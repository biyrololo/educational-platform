from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True)
    user_name = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False)
    user_grade = Column(String, nullable=False)
    test_name = Column(String, nullable=False)
    test_result_correct = Column(Integer, nullable=False)
    test_result_all = Column(Integer, nullable=False)
    test_id = Column(Integer, nullable=False)
    incorrect_asks_ids = Column(ARRAY(Integer), nullable=True)
    user_answers = Column(ARRAY(String), nullable=True)
    date = Column(String, nullable=False)

def get_all_results(db):
    return db.query(Result).all()

def add_result(user_name, user_id, user_grade, test_name, test_result_correct, test_result_all, test_id, incorrect_asks_ids, user_answers, date, db):
    result = Result(
        user_name=user_name, user_id=user_id, user_grade=user_grade, test_name=test_name, test_result_correct=test_result_correct, 
        test_result_all=test_result_all, test_id=test_id, incorrect_asks_ids=incorrect_asks_ids,
        user_answers=user_answers,
        date=date
        )
    db.add(result)
    db.commit()

    return result.id

def delete_result(id, db):
    db.query(Result).filter_by(id=id).delete()
    db.commit()

def get_result_by_id(id, db):
    return db.query(Result).filter_by(id=id).first()

def get_all_results_by_test_id(test_id, db):
    return db.query(Result).filter_by(test_id=test_id).all()