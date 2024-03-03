from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from .db import get_db

from models.Ask import *
from models.Test import *
from models.Result import *
from models.User import *

from pydantic import BaseModel
from typing import List

from secrets import token_hex

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

@app.get('/asks/{asks_list_id}')
def get_asks(asks_list_id : int, db = Depends(get_db)):
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


@app.post('/check_answers/{asks_list_id}')
def check_answers(body : CheckAnswersBody, asks_list_id : int, db = Depends(get_db)):
    ans = get_asks_by_test_id(asks_list_id, db)
    body.answers.sort(key=lambda x: x.ans_id)
    incorrect = []
    for i in range(len(ans)):
        if ans[i].correct_answer != body.answers[i].answer:
            incorrect.append(body.answers[i].ans_id)

    incorrect_ids = [ask.ans_id for ask in ans if ask.ans_id in incorrect]

    add_result(
        user_name=body.user_name,
        user_id=body.user_id,
        test_name=body.test_name,
        test_result_correct=len(ans) - len(incorrect),
        test_result_all=len(ans),
        test_id=body.test_id,
        incorrect_asks_ids=incorrect_ids,
        db=db
    )
    
    return {'correct_answers' : len(ans) - len(incorrect), 'all_answers' : len(ans), 'incorrect_answers' : incorrect}

@app.get('/admin/results')
def get_results(db = Depends(get_db)):
    results = get_all_results(db)
    return results

class CreateTestAnswerItem(BaseModel):
    text : str
    image : str = None
    answers : List[str] = None
    correct_answer : str

class TestItem(BaseModel):
    name : str
    img_src : str
    answers : List[CreateTestAnswerItem]

@app.post('/admin/create_test')
def create_test_admin(body : TestItem, db = Depends(get_db)):
    id = create_test(name=body.name, img_src=body.image, db=db)
    for answer in body.answers:
        add_ask(text=answer.text, image=answer.image, answers=answer.answers, correct_answer=answer.correct_answer, test_id=id, db=db)
    return id

def create_random_passkey():
    return token_hex(16)

class UserItem(BaseModel):
    name : str

@app.post('/admin/create_user')
def create_user_admin(user : UserItem, db = Depends(get_db)):
    pass_key = create_random_passkey()
    user_id = create_user(name=user.name, pass_key=pass_key, db=db)
    return {"user_id" : user_id, "pass_key" : pass_key}

class LoginItem(BaseModel):
    pass_key : str

@app.post('/login')
def login(body : LoginItem, db = Depends(get_db)):
    user = check_user_pass_key(body.pass_key, db)
    if user:
        return {"user_id" : user.id, "pass_key" : user.pass_key}
    admin = check_admin_pass_key(body.pass_key, db)
    if admin:
        return {"user_id" : admin.id, "pass_key" : admin.pass_key}
    return {"user_id" : None, "pass_key" : None}