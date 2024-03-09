import { Button, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import './CreateUser.css'
import axios from "axios";

export default function CreateUser() {

    const nameRef = useRef<HTMLInputElement>(null);

    function createUser() {
        if(!nameRef.current) {
            return;
        }

        if(!nameRef.current.value) {
            toast.error('Введите имя');
            return;
        }

        const url = `/admin/create_user`;

        const data = {
            name: nameRef.current.value
        }

        axios.post(url, data)
        .then((response) => {
            toast.success('Пользователь создан');
        })
        .catch((error) => {
            toast.error('Произошла ошибка');
        })

    }

    return (
        <main>
            <div id="create-user">
                <Typography variant="h4" component="div" gutterBottom>
                    Создать пользователя
                </Typography>
                <TextField
                label="Имя"
                id="create-user-name"
                name="create-user-name"
                fullWidth
                size="small"
                inputRef={nameRef}
                />
                <Button variant="contained" fullWidth onClick={createUser}>Создать</Button>
            </div>
        </main>
    )
}