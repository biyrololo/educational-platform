
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
    title: string;
    img_src?: string;
    test_id: number
}

export default function CardComponent(props: Props) {

    const navigate = useNavigate();

    const img_src = props.img_src || "static/empty_test.png";

    function openTest(){
        localStorage.setItem("test_name", props.title);
        navigate(`/test/${props.test_id}`)
    }

    return (
        <Card sx={{ maxWidth: 345 }} onClick={openTest}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    src={img_src}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}