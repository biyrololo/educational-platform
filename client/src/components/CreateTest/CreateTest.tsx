import { Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import TestInfo from "./TestInfo";
import { TestInfoType, TestAskInfoType } from "types/CreateTestTypes";
import './CreateTest.css'
import Ask from "./Ask";
import AddIcon from '@mui/icons-material/Add';
import { TestRType } from "types";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateTest() {

    const [testInfo, setTestInfo] = useState<TestInfoType>(
        {
            name: '',
            img: ''
        }
    )

    const [asks, setAsks] = useState<TestAskInfoType[]>([])

    function addAsk(){
        setAsks(prev => {
            return [
                ...prev,
                {
                    text: '',
                    image: '',
                    answers: [],
                    correct_answer: ''
                }
            ]
        })
    }

    function createTest(){
        // console.log(testInfo, asks)

        if(!testInfo.name){
            toast.error('Название не может быть пустым')
            return
        }

        if(!asks.length){
            toast.error('Тест должен содержать хотя бы один вопрос')
            return
        }

        //  check if correct answers

        for(let i = 0; i < asks.length; i++){
            if(asks[i].correct_answer === ''){
                toast.error('Вопрос должен иметь правильный ответ')
                return
            }
        }

        const url = `/admin/create_test`;

        const data : TestRType = {
            name: testInfo.name,
            img_src: testInfo.img,
            answers: asks
        }

        axios.post(url, data)
        .then((response) => {
            console.log(response.data)
            toast.success('Тест создан')
        })
        .catch((error) => {
            toast.error('Произошла ошибка')
            console.log(error)
        })

    }

    return (
        <main>
            <div id="create-test">
                <Typography variant="h4" component="div" gutterBottom>
                    Создание теста
                </Typography>
                <TestInfo
                    testInfo={testInfo}
                    setTestInfo={setTestInfo}
                />
            </div>
            <div id="create-test-asks">
                {
                    asks.map((ask, index) => {
                        return (
                            <Ask
                                key={index}
                                ask={ask}
                                setAsk={(ask) => {
                                    setAsks(prev => {
                                        return prev.map((a, i) => {
                                            if (i === index) {
                                                return ask
                                            }
                                            return a
                                        })
                                    })
                                }}
                                index={index}
                                removeAsk={() => {
                                    setAsks(prev => {
                                        return prev.filter((a, i) => i !== index)
                                    })
                                }}
                            />
                        )
                    })
                }
                <Button
                    onClick={addAsk}
                >
                    <AddIcon />
                </Button>
            </div>
            <Button
            variant="contained"
            style={{
                margin: '30px auto 0 auto',
                display: 'block',
                width: '250px'
            }}
            onClick={createTest}
            >
                Создать тест
            </Button>
        </main>
    )
}