from sqlalchemy import ARRAY, Column, Integer, String

from .base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    pass_key = Column(String, nullable=False)

def check_user_pass_key(pass_key, db):
    return db.query(User).filter_by(pass_key=pass_key).first()

def create_user(name, pass_key, db) -> int:
    user = User(name=name, pass_key=pass_key)
    db.add(user)
    db.commit()
    return user.id

def delete_user(id, db):
    db.query(User).filter_by(id=id).delete()
    db.commit()

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    pass_key = Column(String, nullable=False)

def check_admin_pass_key(pass_key, db):
    return db.query(Admin).filter_by(pass_key=pass_key).first

def create_admin(name, pass_key, db):
    admin = Admin(name=name, pass_key=pass_key)
    db.add(admin)
    db.commit()

def delete_admin(id, db):
    db.query(Admin).filter_by(id=id).delete()
    db.commit()