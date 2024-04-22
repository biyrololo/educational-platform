import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { UserType } from "types/UserType"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import React from "react"
import { visuallyHidden } from '@mui/utils';
import { Delete } from "@mui/icons-material"

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
        key: 'grade',
        title: 'Класс'
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
        return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof UserType) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler =
        (property: keyof UserType) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
    }

    return (
        <TableHead>
            <TableRow>
                {
                    COLUMNS.map(({key, title}, index) => (
                        <TableCell
                        key={key}
                        align="center"
                        padding="normal"
                        sortDirection={orderBy === key ? order : false}
                        >
                            <TableSortLabel
                            active={orderBy === key}
                            direction={orderBy === key ? order : 'asc'}
                            onClick={createSortHandler(key)}
                            sx={{
                                '&:hover':{
                                    '& .MuiTableSortLabel-icon':{
                                        opacity: 0.7
                                    }
                                },
                                '& .MuiTableSortLabel-icon':{
                                    opacity: 0.25
                                }
                            }}
                            >
                                {title}
                                {
                                    orderBy === key && (
                                        <Box sx={visuallyHidden}>sorted {order}</Box>
                                    )
                                }
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
    )
}

export default function UsersTable(){
    const [data, setData] = useState<UserType[]>([]);

    const [orderBy, setOrderBy] = useState<keyof UserType>('id');
    const [order, setOrder] = useState<Order>('asc');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof UserType
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

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

    const sortedData = stableSort(data, getComparator(order, orderBy));

    async function handleDeleteUser(id: number) {
        const url = `/admin/delete_user/${id}`;

        axios.delete(url)
        .then((response) => {
            toast.success('Пользователь удален');
            setData(data.filter((data_row) => data_row.id !== id));
        })
        .catch((error) => {
            console.log('Error: ', error.message);
            toast.error('Ошибка удаления пользователя');
        })
    }

    return (
        <Paper
        sx={{ width: 1200, margin: '50px auto' }}
        >
            <TableContainer>
                <Table stickyHeader>
                    <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {
                            sortedData.map((data_row, index) => (
                                <TableRow key={index}>
                                    {
                                        COLUMNS.map(({key}) => (
                                            <TableCell key={key} align="center">{data_row[key as keyof UserType]}</TableCell>
                                        ))
                                    }
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDeleteUser(data_row.id)}>
                                            <Delete color="error"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
)
}