from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL

# Datenbank-Engine erstellen
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Basisklasse für ORM-Modelle
Base = declarative_base()

# Dependency für FastAPI-Routen
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
