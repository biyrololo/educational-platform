from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class Ask(Base):
    __tablename__ = "asks"
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=False)
    image = Column(String, nullable=True)
    answers = Column(ARRAY(String), nullable=True)
    correct_answer = Column(String, nullable=False)
    test_id = Column(Integer, nullable=False)

def get_asks_by_test_id(test_id, db):
    return db.query(Ask).filter(Ask.test_id == test_id).all()

def add_ask(text, image, answers, correct_answer, test_id, db):
    ask = Ask(text=text, image=image, answers=answers, correct_answer=correct_answer, test_id=test_id)
    db.add(ask)
    db.commit()

def delete_ask(id, db):
    db.query(Ask).filter(Ask.id == id).delete()
    db.commit()

def edit_ask(id, text, image, answers, correct_answer, test_id, db):
    ask = db.query(Ask).filter(Ask.id == id).first()
    ask.text = text
    ask.image = image
    ask.answers = answers
    ask.correct_answer = correct_answer
    ask.test_id = test_id
    db.commit()

def get_asks_by_ids(ids : list, db):
    return db.query(Ask).filter(Ask.id.in_(ids)).all()

def delete_asks_by_test_id(test_id, db):
    db.query(Ask).filter(Ask.test_id == test_id).delete()
    db.commit()