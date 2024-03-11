import { Button, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { toast } from "react-toastify";
import './CreateUser.css'
import axios from "axios";

export default function CreateUser() {

    const nameRef = useRef<HTMLInputElement>(null);
    const classRef = useRef<HTMLInputElement>(null);

    function createUser() {
        if(!nameRef.current || !classRef.current) {
            return;
        }

        if(!nameRef.current.value) {
            toast.error('Введите имя');
            return;
        }

        if(!classRef.current.value) {
            toast.error('Введите класс');
            return;
        }

        const url = `/admin/create_user`;

        const data = {
            name: nameRef.current.value,
            grade: classRef.current.value
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
                <TextField
                label="Класс"
                id="create-user-class"
                name="create-user-class"
                fullWidth
                size="small"
                inputRef={classRef}
                />
                <Button variant="contained" fullWidth onClick={createUser}>Создать</Button>
            </div>
        </main>
    )
}