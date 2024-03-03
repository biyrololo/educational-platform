from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    img_src = Column(String, nullable=True)

def get_all_tests(db):
    tests = db.query(Test).all()
    return tests

def delete_test(id, db):
    db.query(Test).filter_by(id=id).delete()
    db.commit()

def create_test(name, img_src, db) -> int:
    test = Test(name=name, img_src=img_src)
    db.add(test)
    db.commit()
    return test.id

def edit_test(id, name, img_src, db):
    test = db.query(Test).filter_by(id=id).first()
    test.name = name
    test.img_src = img_src
    db.commit()