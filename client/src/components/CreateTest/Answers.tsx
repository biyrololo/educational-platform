import { Typography, Button } from '@mui/material'
import React from 'react'
import Answer from './Answer'
import AddIcon from '@mui/icons-material/Add';

type Props = {
    answers: string[],
    setAnswers: (answers: string[]) => void,
    index: number
}

export default function Answers(props: Props) {

    function addAns(){
        const newAnswers = [...props.answers]
        newAnswers.push('')
        props.setAnswers(newAnswers)
    }

    return (
        <section className="answers">
            <Typography variant="h6" component="div">
                Варианты ответов
            </Typography>
            <div className="answers-list">
                {
                    props.answers.map((answer, index) => {
                        return (
                            <Answer
                                key={index}
                                text={answer}
                                setText={(text) => {
                                    const newAnswers = [...props.answers]
                                    newAnswers[index] = text
                                    props.setAnswers(newAnswers)
                                }}
                                id_index={`answer-${props.index}-${index}`}
                                index={index}
                                removeAnswer={(index) => {
                                    const newAnswers = [...props.answers]
                                    newAnswers.splice(index, 1)
                                    props.setAnswers(newAnswers)
                                }}
                            />
                        )
                    })
                }
                <Button onClick={addAns}>
                    <AddIcon />
                </Button>
            </div>
        </section>
    )
}