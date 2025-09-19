# Depends is a utility that allows you to define dependency injection in 
# your application. Dependency injection is a design pattern that allows 
# you to pass dependencies (such as services, configurations, or reusable logic) 
# into functions, rather than creating or managing them within the functions themselves.
from fastapi import FastAPI, HTTPException, Depends, status
'''
CORSMiddleware is a middleware class in FastAPI used to handle Cross-Origin 
Resource Sharing (CORS). It allows your FastAPI application to accept requests 
from different domains or origins.
'''
from fastapi.middleware.cors import CORSMiddleware
import os
from sqlalchemy.orm import Session
# CryptContext from Passlib is a utility used for handling password hashing and verification in Python.
from passlib.context import CryptContext
from db.database import User, Application, SessionLocal
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta



app = FastAPI()

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Allow requests from this origin
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all HTTP methods
#     allow_headers=["*"],  # Allow all headers
# )


# --- CORS setup (env-driven for Render) ---
origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],   # you can tighten this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health endpoint for Render ---
@app.get("/health")
def health():
    return {"ok": True}

# creating a CryptContext object from the Passlib library, which is 
# used for handling password hashing and verification.

'''
schemes is a parameter that specifies which hashing algorithms to use in the CryptContext
deprecated is a parameter that controls how to handle algorithms that are marked as deprecated.
A deprecated algorithm is one that is no longer considered secure, or it's outdated and should be replaced with a stronger one.
"auto" means that Passlib will automatically manage deprecation:
'''
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# OAuth2PasswordBearer is a class that provides a way to retrieve a bearer token from the request.
# tokenUrl="token" specifies the URL where the client can get the token (usually the endpoint that
#  issues tokens, e.g., /token).
# tokenUrl="token": This is just metadata for the OpenAPI documentation (Swagger UI). It informs clients 
# (such as frontends or API consumers) where they can obtain a token. It does not make an actual call to 
# the /token endpoint.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

@app.get("/users") 
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()  # Retrieve all users from the database
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users


# Before Deploying
# SECRET_KEY = "your-secret-key" #a secret string used to sign and verify the JWT tokens.
# ALGORITHM = "HS256" #This specifies the algorithm used for encoding and decoding the JWT token
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# --- JWT setup ---
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-change-in-render")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def authenticate_user(username: str, password: str, db: Session):
    #db.query(User): This initiates a query to the database, specifically targeting 
    #the User model (which represents the users table in the database).
    user = db.query(User).filter(User.username == username).first()
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None
 


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/login")
def login_and_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
    


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        #A JWT consists of three parts: Header, Payload, Signature. 
        # Payload: Contains the claims or statements about the entity (usually the user) 
        # and additional data. This is the part where you store information like the 
        # user's ID, username, roles, and any other necessary data.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # In JWTs, "sub" typically stands for "subject," which usually represents the unique 
        # identifier of the user (e.g., their user ID or username).
        username: str = payload.get("sub") 
        if username is None:
            #creating an instance of the HTTPException class with the specified attributes (status_code, detail, and headers)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}, #It allows you to specify custom HTTP headers that will be included in the response when the exception is raised.
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@app.get("/applications")
def get_user_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    applications = db.query(Application).filter(Application.user_id == current_user.id).all()
    return applications


class ApplicationCreate(BaseModel):
    company: str
    position: str
    date: str
    application_location: str
    recruiter: str
    recruiter_contact: str
    status: str  # e.g., applied, interviewing, etc.
    notes: str


@app.post("/applications")
def create_application(
    application: ApplicationCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)):

    new_application = Application(
        company = application.company,
        position = application.position,
        date = application.date,
        application_location = application.application_location,
        recruiter = application.recruiter,
        recruiter_contact = application.recruiter_contact,
        status = application.status,
        notes = application.notes,
        user_id=current_user.id  # Associate with the current user
    )

    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return {"message": "Application created successfully"}

