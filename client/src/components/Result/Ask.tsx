import { Card, CardContent, CardMedia, Typography } from "@mui/material";

type Props = {
    text: string;
    image: string | undefined;
    correct_answer: string;
}

export default function Ask(props: Props) {
    return (
        <Card>
            {
                props.image &&
                <CardMedia src={props.image}/>
            }
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Правильный ответ
                </Typography>
                <Typography variant="h6" component="div"
                >
                    {props.correct_answer}
                </Typography>
            </CardContent>
        </Card>
    )
}