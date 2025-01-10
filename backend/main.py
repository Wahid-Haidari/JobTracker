# Depends is a utility that allows you to define dependency injection in 
# your application. Dependency injection is a design pattern that allows 
# you to pass dependencies (such as services, configurations, or reusable logic) 
# into functions, rather than creating or managing them within the functions themselves.
from fastapi import FastAPI, HTTPException, Depends 
'''
CORSMiddleware is a middleware class in FastAPI used to handle Cross-Origin 
Resource Sharing (CORS). It allows your FastAPI application to accept requests 
from different domains or origins.
'''
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
# CryptContext from Passlib is a utility used for handling password hashing and verification in Python.
from passlib.context import CryptContext
from db.database import User, SessionLocal
from typing import List
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr


app = FastAPI()

# Allow all origins (you can specify specific origins in a production environment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# creating a CryptContext object from the Passlib library, which is 
# used for handling password hashing and verification.

'''
schemes is a parameter that specifies which hashing algorithms to use in the CryptContext
deprecated is a parameter that controls how to handle algorithms that are marked as deprecated.
A deprecated algorithm is one that is no longer considered secure, or it's outdated and should be replaced with a stronger one.
"auto" means that Passlib will automatically manage deprecation:
'''
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

'''
The get_db() function is a dependency that provides a database session. It creates 
a new database session using SessionLocal(), yields it for use in the route handler, 
and ensures the session is closed after the request is complete (in the finally block). 
FastAPI automatically calls it when the db parameter is used in a route with Depends(get_db).
'''
def get_db():
    db = SessionLocal()
    try:#The try ensures that any exceptions during the usage of the db session don't prevent the cleanup in the finally block.
        yield db#Pauses the function and "provides" the db session to whatever is calling this function
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

@app.post("/signup")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully"}
    except:
        db.rollback()#undoes any uncommitted changes made in the database session, reverting it to its previous state to avoid saving incomplete or invalid data.
        raise HTTPException(status_code=400, detail="Username or email already exists")  


# @app.get('/hello')
# def test_fastapi():
#     return (
#         {"message": "Hello from FastAPI"}
#     )
    

@app.get("/users") 
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()  # Retrieve all users from the database
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users


SECRET_KEY = "your-secret-key" #a secret string used to sign and verify the JWT tokens.
ALGORITHM = "HS256" #This specifies the algorithm used for encoding and decoding the JWT token


class UserLogin(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(loginUser: UserLogin, db: Session = Depends(get_db)):
    #db.query(User): This initiates a query to the database, specifically targeting 
    #the User model (which represents the users table in the database).
    user = db.query(User).filter(User.username == loginUser.username).first()
    if not user or not pwd_context.verify(loginUser.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = jwt.encode({"username": loginUser.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}
