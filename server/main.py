from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db import get_db

from models import *

from pydantic import BaseModel
from typing import List

from secrets import token_hex
from os import getenv

ADMIN_CREATE_PASSWORD = getenv("ADMIN_CREATE_PASSWORD")
# ADMIN_CREATE_PASSWORD = "rootroot"

security = HTTPBearer(scheme_name='Authorization')

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/tests')
def get_tests(db = Depends(get_db)):
    tests = get_all_tests(db)
    return tests

@app.get('/tests/{test_id}')
def get_test(test_id : int, admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")

    test = get_test_by_id(test_id, db)
    asks = get_asks_by_test_id(test_id, db)

    return {"test" : test, "asks" : asks}

@app.get('/asks/{asks_list_id}')
def get_asks(asks_list_id : int, pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    pass_key = pass_key.credentials
    user = check_user_pass_key(pass_key, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user key")
    tests = get_asks_by_test_id(asks_list_id, db)
    for test in tests:
        del test.correct_answer
    return tests

class AnswerItem(BaseModel):
    answer : str
    ans_id: int

class CheckAnswersBody(BaseModel):
    answers : List[AnswerItem]
    user_name : str
    user_id : int
    test_name : str
    test_id : int
    date: str


@app.post('/check_answers/{asks_list_id}')
def check_answers(body : CheckAnswersBody, asks_list_id : int, pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    pass_key = pass_key.credentials
    user = check_user_pass_key(pass_key, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user key")
    ans = get_asks_by_test_id(asks_list_id, db)
    body.answers.sort(key=lambda x: x.ans_id)
    incorrect = []
    for i in range(len(ans)):
        if ans[i].correct_answer != body.answers[i].answer:
            incorrect.append(body.answers[i].ans_id)

    incorrect_ids = [ask.id for ask in ans if ask.id in incorrect]

    res_id = add_result(
        user_name=body.user_name,
        user_id=body.user_id,
        test_name=body.test_name,
        test_result_correct=len(ans) - len(incorrect),
        test_result_all=len(ans),
        test_id=body.test_id,
        incorrect_asks_ids=incorrect_ids,
        date=body.date,
        db=db
    )
    
    return {'correct_answers' : len(ans) - len(incorrect), 'all_answers' : len(ans), 'incorrect_answers' : incorrect, 'result_id' : res_id}

@app.get('/admin/results')
def get_results(admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    results = get_all_results(db)
    return results

class ResultAsksItem(BaseModel):
    ids : List[int]

@app.post('/result/asks')
def get_result_asks(body : ResultAsksItem, pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    pass_key = pass_key.credentials
    user = check_user_pass_key(pass_key, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user key")
    return get_asks_by_ids(body.ids, db)

@app.get('/result/{result_id}')
def get_result(result_id : int, pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    pass_key = pass_key.credentials
    user = check_user_pass_key(pass_key, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user key")
    return get_result_by_id(result_id, db)
class CreateTestAnswerItem(BaseModel):
    text : str
    image : str = None
    answers : List[str] = None
    correct_answer : str

class TestItem(BaseModel):
    name : str
    img_src : str = None
    answers : List[CreateTestAnswerItem]

@app.post('/admin/create_test')
def create_test_admin(body : TestItem, admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    id = create_test(name=body.name, img_src=body.img_src, db=db)
    for answer in body.answers:
        add_ask(text=answer.text, image=answer.image, answers=answer.answers, correct_answer=answer.correct_answer, test_id=id, db=db)
    return id

@app.delete('/admin/delete_test/{test_id}')
def delete_test_admin(test_id : int, admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    delete_test(test_id, db)
    delete_asks_by_test_id(test_id, db)
    return

@app.patch('/admin/update_test/{test_id}')
def update_test_admin(test_id : int, body : TestItem, admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")

    delete_asks_by_test_id(test_id, db)
    edit_test(test_id, body.name, body.img_src, db)
    for answer in body.answers:
        add_ask(text=answer.text, image=answer.image, answers=answer.answers, correct_answer=answer.correct_answer, test_id=test_id, db=db)
    return

def create_random_passkey():
    return token_hex(16)

class UserResponseItem(BaseModel):
    user_id: int
    pass_key: str

class UserItem(BaseModel):
    name : str

@app.post('/admin/create_user', response_model=UserResponseItem)
def create_user_admin(user : UserItem, admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    pass_key = create_random_passkey()
    user_id = create_user(name=user.name, pass_key=pass_key, db=db, role=UserRole.user)
    return {"user_id" : user_id, "pass_key" : pass_key}

@app.post('/admin/create_admin', response_model=UserResponseItem)
def create_admin_admin(user : UserItem, create_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    create_pass_key = create_pass_key.credentials
    if create_pass_key != ADMIN_CREATE_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid Admin create key")
    pass_key = create_random_passkey()
    user_id = create_user(name=user.name, pass_key=pass_key, db=db, role=UserRole.admin)
    return {"user_id" : user_id, "pass_key" : pass_key}

@app.get('/users')
def get_users(admin_pass_key : HTTPAuthorizationCredentials = Depends(security), db = Depends(get_db)):
    admin_pass_key = admin_pass_key.credentials
    admin = check_user_pass_key(admin_pass_key, db)
    if admin is None:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    if admin.role != UserRole.admin:
        raise HTTPException(status_code=401, detail="Invalid Admin key")
    users = get_all_users(db)
    return users

class LoginItem(BaseModel):
    pass_key : str

@app.post('/login')
def login(body : LoginItem, db = Depends(get_db)):
    user = check_user_pass_key(body.pass_key, db)
    print(user)
    if user:
        return {"user_id" : user.id, "pass_key" : user.pass_key, "is_admin" : user.role == UserRole.admin, "name" : user.name}
    raise HTTPException(status_code=404, detail="Invalid credentials")