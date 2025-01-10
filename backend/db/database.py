# declarative_base is a function provided by SQLAlchemy that is 
# used to create a base class for your ORM (Object-Relational Mapping) models.
# An ORM model in the context of SQLAlchemy refers to a Python class that 
# represents a table in a relational database.
from sqlalchemy.ext.declarative import declarative_base

# sessionmaker is a factory function that creates Session 
# objects, which are used to interact with the database.
# A Session in SQLAlchemy Represents a connection to the database.
# Acts as a workspace for performing operations like querying, 
# adding, updating, and deleting records.
from sqlalchemy.orm import sessionmaker 


'''
Column: Defines a column in a database table. You use it to specify the column's 
properties like data type and constraints (e.g., primary key).

Integer: A SQLAlchemy data type representing integer values in a database column.

String: A SQLAlchemy data type representing string (text) values in a database column.
 You can specify a maximum length for the string.

create_engine: A function that creates a new SQLAlchemy Engine instance. It establishes 
a connection to the database and provides an interface to execute SQL commands.
'''
from sqlalchemy import Column, Integer, String, create_engine
from fastapi import FastAPI, HTTPException, Depends
from passlib.context import CryptContext


# Database setup
DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()

# User model
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Create tables if they don't exist
# This line ensures that all the tables defined in your models (like User) 
# are created in the database. It checks whether the tables exist in the SQLite 
# database, and if they don't, it creates them.
Base.metadata.create_all(bind=engine)
