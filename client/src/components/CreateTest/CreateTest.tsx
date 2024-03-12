import { Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TestInfo from "./TestInfo";
import { TestInfoType, TestAskInfoType } from "types/CreateTestTypes";
import './CreateTest.css'
import Ask from "./Ask";
import AddIcon from '@mui/icons-material/Add';
import { TestRType } from "types";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function CreateTest() {

    const test_id = useParams().test_id;

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

    useEffect(() => {
        if(test_id){
            const url = `/tests/${test_id}`;

            const cancelToken = axios.CancelToken.source();

            axios.get(url, {cancelToken: cancelToken.token})
            .then((response) => {
                setTestInfo({
                    name: response.data.test.name,
                    img: response.data.test.img_src
                })
                setAsks(response.data.asks)
            })
            .catch((error) => {
                console.log('Error: ', error.message);
            })
        }
    }, [test_id])

    function editTest(){
        if(!test_id){
            toast.error('Тест не найден')
            return
        }
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

        const url = `/admin/update_test/${test_id}`;

        const data : TestRType = {
            name: testInfo.name,
            img_src: testInfo.img,
            answers: asks
        }

        axios.patch(url, data)
        .then((response) => {
            console.log(response.data)
            toast.success('Тест обновлен')
        })
        .catch((error) => {
            toast.error('Произошла ошибка')
            console.log(error)
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

    function moveAsk(index: number, direction: 1 | -1){
        setAsks(prev => {
            return prev.map((ask, i) => {
                if(i === index){
                    return prev[index + direction]
                }
                if(i === index + direction){
                    return prev[index]
                }
                return ask
            })
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
                                asks_length={asks.length}
                                moveAsk={moveAsk}
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
            {
                test_id ? (
                    <Button
                    variant="contained"
                    style={{
                        margin: '30px auto 0 auto',
                        display: 'block',
                        width: '250px'
                    }}
                    onClick={editTest}
                    >
                        Редактировать тест
                    </Button>
                ) :
                (
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
                )
            }
        </main>
    )
}