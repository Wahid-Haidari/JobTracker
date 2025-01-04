from fastapi import FastAPI

'''
CORSMiddleware is a middleware class in FastAPI used to handle Cross-Origin 
Resource Sharing (CORS). It allows your FastAPI application to accept requests 
from different domains or origins.
'''

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



@app.get('/hello')

def test_fastapi():
    return (
        {"message": "Hello front FastAPI"}
    )
    



