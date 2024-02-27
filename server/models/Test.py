from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    questions = Column(ARRAY(String), nullable=False)

def get_all_tests(db):
    tests = db.query(Test).all()
    return tests

def delete_test(id, db):
    db.query(Test).filter_by(id=id).delete()
    db.commit()

def create_test(name, questions, db):
    test = Test(name=name, questions=questions)
    db.add(test)
    db.commit()

def edit_test(id, name, questions, db):
    test = db.query(Test).filter_by(id=id).first()
    test.name = name
    test.questions = questions
    db.commit()