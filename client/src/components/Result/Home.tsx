import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Home(){
    const navigate = useNavigate();

    function goHome(){
        navigate("/");
    }

    return (
        <Button 
        onClick={goHome}
        sx={
            {
                textTransform: "none",
            }
        }
        >
            На главную
        </Button>
    )
}