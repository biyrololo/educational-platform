import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { UserResultType } from "types/UserResults"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

type ColumsType = {
    key: keyof UserResultType;
    title: string;
}

const COLUMNS : ColumsType[] = [
    {
        key: 'date',
        title: 'Дата'
    },
    {
        key: 'user_name',
        title: 'Пользователь'
    },
    {
        key: 'test_name',
        title: 'Тест'
    },
    {
        key: 'test_result_correct',
        title: 'Результат'
    }
]

export default function UserResults() {
    
    const [data, setData] = useState<UserResultType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        const url = `/admin/results`;

        axios.get(url, {cancelToken: cancelToken.token})
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            console.log('Error: ', error.message);
        })

        return () => {
            cancelToken.cancel();
        }
    }, [])

    return (
        <main>
            <Paper>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {
                                    COLUMNS.map(({key, title}) => (
                                        <TableCell 
                                        key={key} 
                                        align="center"
                                        width={key === 'test_result_correct' || key === 'date' ? 100 : undefined}
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
                                            COLUMNS.slice(0, 2).map(({key}) => (
                                                <TableCell key={key} align="center">{data_row[key as keyof UserResultType]}</TableCell>
                                            ))
                                        }
                                        <TableCell align="center">
                                            <span
                                            onClick={() => navigate(`/result/${data_row.id}`)}
                                            >
                                                {data_row.test_name}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">{data_row.test_result_correct} {'/'} {data_row.test_result_all}</TableCell>
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