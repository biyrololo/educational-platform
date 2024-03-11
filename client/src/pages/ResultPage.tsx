import { Link, useParams } from "react-router-dom"
import { ResultType } from "types";
import { useEffect, useState } from "react";    
import Asks from "components/Result/Asks";
import { Button, Typography } from "@mui/material";
import Header from "components/Header/Header";
import Home from "components/Result/Home";
import axios from "axios";

export default function ResultPage(){

    const resultId = parseInt(useParams().resultId || "-1");

    const [result, setResult] = useState<ResultType>({
        test_result_correct: 0,
        user_name: "",
        user_id: 0,
        test_id: 0,
        test_name: "",
        id: 0,
        test_result_all: 0,
        incorrect_asks_ids: [],
        user_answers: [],
        date: ""
    })

    useEffect(
        ()=>{
            const cancelToken = axios.CancelToken.source();

            const url = `/result/${resultId}`;

            axios.get(url, {cancelToken: cancelToken.token})
            .then((response)=>{
                setResult(response.data)
            })
            .catch((error)=>{
                console.log('Error: ', error.message);
            })

            return ()=>{
                cancelToken.cancel()
            }
        },
        []
    )

    return (
        <>
            <Header/>
            <main id="result-page">
                <Typography variant="h3" component="div">{result.test_name}</Typography>
                <Typography variant="h5" component="div" gutterBottom>Результат: {result.test_result_correct} из {result.test_result_all}</Typography>
                <Asks incorrect_asks_ids={result.incorrect_asks_ids} user_answers={result.user_answers}/>
                <Home/>
            </main>
        </>
    )
}