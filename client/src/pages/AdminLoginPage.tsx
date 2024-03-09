import { Button, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type RData = {
    user_id: number;
    pass_key: string;
    is_admin: boolean;
    name: string;
}

export default function AdminLoginPage(){
    const pass_key_ref = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    function handleLogin(){
        if(!pass_key_ref.current) return;
        const url = `/login`;

        const data = {
            pass_key: pass_key_ref.current.value
        };

        axios.post(url, data)
        .then((response)=>{
            const rdata : RData = response.data;
            localStorage.setItem('user_id', rdata.user_id.toString());
            localStorage.setItem('user_name', rdata.name);
            localStorage.setItem('user', rdata.is_admin? 'admin' : 'user');
            axios.defaults.headers.common['Authorization'] = `Bearer ${rdata.pass_key}`;
            localStorage.setItem('pass_key', rdata.pass_key);

            if(!rdata.is_admin){
                navigate('/');
            }
            else{
                navigate('/users');
            }

        })
        .catch((error)=>{
            console.log('Error: ', error.message);
        })
    }

    return (
        <main id="login-page">
            <Typography variant="h4" component="div" gutterBottom>
                Вход в админку
            </Typography>
            <TextField
                label="Пароль администратора"
                id="password"
                name="password"
                fullWidth
                size="small"
                inputRef={pass_key_ref}
            />
            <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            >
                Войти
            </Button>
        </main>
    )
}