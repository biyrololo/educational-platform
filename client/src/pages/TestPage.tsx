import { Button, Typography } from "@mui/material";
import AskComponent from "components/Ask/AskComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AskWithAns, AskType, CheckAnsRType } from "types";
import styled from "@emotion/styled";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ActionsButton = styled(Button)({
    textTransform: 'none',
    paddingLeft: '30px',
    paddingRight: '30px',
    width: '45%'
})

function getDate(){
    const date = new Date(new Date().getTime() + 60*60*1000*4);
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
}

export default function TestPage() {

    const navigate = useNavigate();

    const test_id = parseInt(useParams().id || '-1');

    const [asks, setAsks] = useState<AskWithAns[]>([]);

    const [curAnsIndex, setCurAnsIndex] = useState(0);

    function setAns(ans: string) {
        setAsks(prev => {
            return prev.map((ask, i) => {
                if (i === curAnsIndex) {
                    return {
                        ...ask,
                        ans
                    }
                }
                return ask
            })
        });
    }

    useEffect(
        ()=>{
            const calcenToken = axios.CancelToken.source();

            const url = `/asks/${test_id}`;

            axios.get(url, {cancelToken: calcenToken.token})
            .then((response)=>{
                const rdata : AskType[] = response.data;
                setAsks(rdata.map((ask)=>{
                    return {
                        ...ask,
                        ans: ''
                    }
                }));
            })
            .catch((error)=>{
                if(axios.isCancel(error)){
                    console.log('Error: ', error.message);
                }
                else{
                    if(error.response?.status === 401 || error.response?.status === 403){
                        toast.error('Необходима авторизация');
                    }
                    console.log('Error: ', error.message);
                }
            })

            return ()=>{
                calcenToken.cancel()
            }
        },
        []
    )

    function completeTest() {

        const test_name = localStorage.getItem('test_name') || 'test_name';

        const rdata : CheckAnsRType = {
            answers: asks.map(ask => {
                return {
                    answer: ask.ans,
                    ans_id: ask.id
                }
            }),
            test_name: test_name,
            test_id: test_id,
            user_name: localStorage.getItem('user_name') || 'user_name',
            user_id: parseInt(localStorage.getItem('user_id') || '0'),
            date: getDate()
        }

        axios.post(`/check_answers/${test_id}`, rdata)
        .then((response)=>{
            navigate(`/result/${response.data.result_id}`)
        })
        .catch((error)=>{
            console.log('Error: ', error.message);
        })
    }

    return (
        <main id="test-page">
            <Typography variant="subtitle1" component="div">
                Вопрос {curAnsIndex + 1} из {asks.length}
            </Typography>
            {
                asks.length > 0 &&
                <>
                    <AskComponent ask={asks[curAnsIndex]} setAns={setAns}/>
                    <section id="test-page-actions">
                        <ActionsButton 
                        disabled={curAnsIndex === 0} 
                        onClick={() => setCurAnsIndex(curAnsIndex - 1)}
                        variant="outlined"
                        >
                            Назад
                        </ActionsButton>
                        <ActionsButton 
                        disabled={asks[curAnsIndex].ans === ''} 
                        onClick={() => {
                            if (curAnsIndex < asks.length - 1) {
                                setCurAnsIndex(curAnsIndex + 1)
                            }
                            else {
                                completeTest()
                            }
                        }}
                        variant="contained"
                        >
                            {
                                curAnsIndex === asks.length - 1 ? 'Завершить' : 'Далее'
                            }
                        </ActionsButton>
                    </section>
                </>
            }
        </main>
    )
}