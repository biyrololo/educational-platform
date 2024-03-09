import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { UserType } from "types/UserType"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

type ColumsType = {
    key: keyof UserType;
    title: string;
}

const COLUMNS : ColumsType[] = [
    {
        key: 'id',
        title: 'ID',
    },
    {
        key: 'name',
        title: 'Имя'
    },
    {
        key: 'pass_key',
        title: 'Пароль'
    }
]

export default function UsersTable(){
    const [data, setData] = useState<UserType[]>([]);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        const url = `/users`;

        axios.get(url, {cancelToken: cancelToken.token})
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            if(axios.isCancel(error)){
                console.log('Error: ', error.message);
            }
            else{
                console.log('Error: ', error.message);
                toast.error('Ошибка получения списка пользователей');
            }
        })
    }, [])

    return (
        <main>
            <Paper
            sx={{ width: 1200, margin: '50px auto' }}
            >
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {
                                    COLUMNS.map(({key, title}) => (
                                        <TableCell 
                                        key={key} 
                                        align="center"
                                        width={key === 'id' ? 100 : undefined}
                                        >
                                            {title}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((data_row, index) => (
                                    <TableRow key={index}>
                                        {
                                            COLUMNS.map(({key}) => (
                                                <TableCell key={key} align="center">{data_row[key as keyof UserType]}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </main>
    )
}