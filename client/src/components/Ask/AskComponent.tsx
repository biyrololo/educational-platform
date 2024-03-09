import styled from "@emotion/styled";
import { RadioGroup, TextField, Typography } from "@mui/material";
import { FormControlLabel, Radio } from "@mui/material";
import { AskWithAns } from "types";
import './Ask.css'

type AskComponentProps = {
    ask: AskWithAns,
    setAns: (ans: string) => void
}

type AnsProps = {
    ans: string,
    setAns: (ans: string) => void,
    answers: string[]
}

export default function AskComponent({ask, setAns}: AskComponentProps) {

    const ansProps : AnsProps = {
        ans: ask.ans,
        setAns,
        answers: ask.answers
    }

    return (
        <section id='ask'>
            {
                ask.image &&
                <img src={ask.image} alt="" id="ask-img"/>
            }
            <Typography 
            variant="h5" 
            component={"div"}
            >
                {
                    ask.text
                }
            </Typography>
            {
                ask.answers.length > 0 ?
                <VariantsOfAnswer {...ansProps} />  :
                <WithoutAnswers {...ansProps} />
            }
        </section>
    )
}

const StyledFormControl = styled(FormControlLabel)({
    boxShadow: `0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)`,
    transition: 'all 0.3s',
    marginLeft: 0,
    marginRight: 0,
})

function VariantsOfAnswer(props: AnsProps) {
    return (
        <RadioGroup 
        name="radio-buttons-group" 
        id='ans-grid'
        value={props.ans}
        onChange={(e) => props.setAns(e.target.value)}
        >
            {
                props.answers.map((answer, index) => {
                    return (
                        <StyledFormControl 
                        key={index} 
                        control={<Radio />} 
                        label={answer} 
                        value={answer}
                        className={answer === props.ans ? 'active-radio' : ''}
                        />
                    )
                })
            }

        </RadioGroup>
    )
}

function WithoutAnswers(props: AnsProps) {
    return (
        <TextField 
        placeholder="Ответить"
        variant="outlined"
        size="small"
        fullWidth
        name={props.ans}
        id={props.ans}
        value={props.ans}
        onChange={(e) => props.setAns(e.target.value)}
        />
    )
}