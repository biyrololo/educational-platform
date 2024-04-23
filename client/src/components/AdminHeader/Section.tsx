import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Section = {
    path: string;
    title: string;
}

const SECTIONS : Section[] = [
    {
        title: 'Пользователи',
        path: '/users'
    },
    {
        title: 'Создать пользователя',
        path: '/create_user'
    },
    {
        title: 'Создать тест',
        path: '/create_test'
    },
    {
        title: 'Тесты',
        path: '/tests'
    },
    {
        title: 'Результаты',
        path: '/user_results'
    },
    {
        title: 'Аналитика',
        path: '/analytics'
    }
]

const StyledBtn = styled(Button)({
    textTransform: 'none',
    color: 'black',
})

export default function Sections(){

    const navigate = useNavigate();

    function goTo(path: string){
        navigate(path);
    }

    return (
        <section className="d-flex g-30">
            {
                SECTIONS.map(({path, title}) => <StyledBtn key={path} onClick={() => goTo(path)}>{title}</StyledBtn>)
            }
        </section>
    )
}