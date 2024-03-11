import { Card, CardContent, CardMedia, Typography } from "@mui/material";

type Props = {
    text: string;
    image: string | undefined;
    correct_answer: string;
    user_answer: string;
    key: number
}

export default function Ask(props: Props) {


    return (
        <Card>
            {
                props.image && <CardMedia src={props.image} component="img" 
                sx={{maxHeight: 450, objectFit: 'contain'}}
                />
            }
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ваш ответ
                </Typography>
                <Typography variant="h6" component="div"
                >
                    {props.user_answer}
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