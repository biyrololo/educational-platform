import { Button, IconButton, TextField, Typography } from "@mui/material";
import ImageLoader from "components/ImageLoader/ImageLoader";
import CloseIcon from '@mui/icons-material/Close';
import { TestAskInfoType } from "types/CreateTestTypes"
import Answers from "./Answers";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

type Props = {
    ask: TestAskInfoType;
    setAsk: (ask: TestAskInfoType) => void;
    index: number;
    removeAsk: (index: number) => void;
    asks_length: number;
    moveAsk: (index: number, direction: 1 | -1) => void
}

export default function Ask(props: Props) {
    return (
        <div className="create-test-ask">
            <section>
                <IconButton style={props.index === 0 ? {} : {color: 'blue'}} disabled={props.index === 0} onClick={() => props.moveAsk(props.index, -1)}>
                    <ArrowDropUpIcon />
                </IconButton>
                <IconButton style={props.index === props.asks_length - 1 ? {} : {color: 'blue'}} disabled={props.index === props.asks_length - 1} onClick={() => props.moveAsk(props.index, 1)}>
                    <ArrowDropDownIcon />
                </IconButton>
            </section>
            <Typography variant="h6" component="div">
                Вопрос
            </Typography>
            <TextField
            placeholder="Текст вопроса"
            name="create-test-ask"
            id={`ask-${props.index}`}
            size="small"
            value={props.ask.text}
            onChange={(e) => {
                props.setAsk({
                    ...props.ask,
                    text: e.target.value || ''
                })
            }}
            multiline
            />
            <ImageLoader
            setImg={(img) => {
                props.setAsk({
                    ...props.ask,
                    image: img
                })
            }}
            />
            <Answers
            answers={props.ask.answers}
            setAnswers={(answers) => {
                props.setAsk({
                    ...props.ask,
                    answers
                })
            }}
            index={props.index}
            />
            <Typography variant="h6" component="div">
                Правильный ответ
            </Typography>
            <TextField
            placeholder="Правильный ответ"
            name="create-test-correct-answer"
            id={`correct-answer-${props.index}`}
            size="small"
            value={props.ask.correct_answer}
            onChange={(e) => {
                props.setAsk({
                    ...props.ask,
                    correct_answer: e.target.value || ''
                })
            }}
            multiline
            />
            <Button onClick={() => props.removeAsk(props.index)}>
                <CloseIcon/>
            </Button>
        </div>
    )
}