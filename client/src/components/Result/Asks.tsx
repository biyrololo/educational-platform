import { useEffect, useState } from "react";
import { ResultAsk } from "types";
import Ask from "./Ask";
import './Result.css'
import axios from "axios";

type Props = {
    incorrect_asks_ids: number[];
    user_answers: string[]
}

export default function Asks(props: Props) {


    const [incorrectAsks, setIncorrectAsks] = useState<ResultAsk[]>([]);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        const url = `/result/asks`

        const data = {
            ids: props.incorrect_asks_ids
        };

        axios.post(url, data, {cancelToken: cancelToken.token})
        .then((response) => {
            if (!response.data) return
            if(Object.keys(response.data).length === 0) return
            setIncorrectAsks(response.data)
            console.log(response.data)
        })
        .catch((error) => {
            console.log('Error: ', error.message);
        })

        return () => {
            cancelToken.cancel()
        }
    }, [props.incorrect_asks_ids])

    return (
        <section className="d-flex fd-column g-20 mb-20">
            {
                incorrectAsks.map((ask, index) => {
                    return (
                        <Ask
                            key={index}
                            image={ask.image}
                            text={ask.text}
                            correct_answer={ask.correct_answer}
                            user_answer={props.user_answers[index]}
                        />
                    )
                })
            }
        </section>
    )
}