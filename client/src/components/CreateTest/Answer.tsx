import { TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    text: string;
    setText: (text: string) => void;
    id_index: string;
    index: number;
    removeAnswer: (index: number) => void;
}

export default function Answer(props: Props) {

    const {
        text,
        setText,
        id_index,
        index,
        removeAnswer
    } = props

    return (
        <div className="answer">
            <TextField
            placeholder="Вариант ответа"
            variant="outlined"
            size="small"
            fullWidth
            name="answer"
            id={`answer-${id_index}`}
            onChange={(e) => {
                setText(e.target.value || '')
            }}
            multiline
            value={text}
            />
            <IconButton onClick={() => removeAnswer(index)}>
                <CloseIcon />
            </IconButton>
        </div>
    )
}