from sqlalchemy import ARRAY, Column, Integer, String, Enum
import enum
from .base import Base

class UserRole(enum.Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    pass_key = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user)

def check_user_pass_key(pass_key, db):
    return db.query(User).filter_by(pass_key=pass_key).first()

def create_user(name, pass_key, role, db) -> int:
    user = User(name=name, pass_key=pass_key, role=role)
    db.add(user)
    db.commit()
    return user.id

def delete_user(id, db):
    db.query(User).filter_by(id=id).delete()
    db.commit()

def get_all_users(db):
    return db.query(User).filter(User.role == UserRole.user).all()