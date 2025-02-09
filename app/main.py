import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Oberflaechenanforderung, Anwendungsbereich, Extrusionsanlage, Strangpressprofil
from app.schemas import OberflaechenanforderungSchema, AnwendungsbereichSchema, ExtrusionsanlageSchema, StrangpressprofilSchema
import logging

logging.basicConfig(level=logging.DEBUG)






# Include routes
from app.routes import router
app.include_router(router)
