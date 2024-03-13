import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { TestType } from "types"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

type ColumsType = {
    key: keyof TestType;
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
]

export default function TestsTable(){
    const [data, setData] = useState<TestType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        const url = `/tests`;

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

    function deleteTest(id: number){
        const url = `/admin/delete_test/${id}`;

        axios.delete(url)
        .then((response) => {
            toast.success('Тест удален');
            setData(data.filter((data_row) => data_row.id !== id));
        })
        .catch((error) => {
            toast.error('Произошла ошибка');
        })
    }

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
                                <TableCell width={50}>

                                </TableCell>
                                <TableCell width={50}>
                                    
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.map((data_row, index) => (
                                    <TableRow key={index}>
                                        {
                                            COLUMNS.map(({key}) => (
                                                <TableCell key={key} align="center">{data_row[key as keyof TestType]}</TableCell>
                                            ))
                                        }
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => navigate(`/create_test/${data_row.id}`)}>
                                                <EditIcon/>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => deleteTest(data_row.id)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
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