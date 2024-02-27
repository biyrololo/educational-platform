from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True)
    user_name = Column(String, nullable=False)
    test_name = Column(String, nullable=False)
    test_result_correct = Column(Integer, nullable=False)
    test_result_all = Column(Integer, nullable=False)
    test_id = Column(Integer, nullable=False)

def get_all_results(db):
    return db.query(Result).all()

def add_result(user_name, test_name, test_result_correct, test_result_all, test_id, db):
    result = Result(user_name=user_name, test_name=test_name, test_result_correct=test_result_correct, test_result_all=test_result_all, test_id=test_id)
    db.add(result)
    db.commit()

def delete_result(id, db):
    db.query(Result).filter_by(id=id).delete()
    db.commit()