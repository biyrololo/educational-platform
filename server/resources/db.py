DATABASE_URL = "postgresql://postgres:rootroot@localhost:5433/education-project"

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.base import Base

engine = create_engine(DATABASE_URL)

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()