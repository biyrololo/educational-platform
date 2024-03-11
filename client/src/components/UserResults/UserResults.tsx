import { Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { UserResultType, UserResultTypeResponse } from "types/UserResults"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom";
import { visuallyHidden } from '@mui/utils';
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
        key: 'user_grade',
        title: 'Класс'
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
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof UserResultType) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof UserResultType) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead>
        <TableRow sx={
            {
                background: '#F3EBFF'
            }
        }>
          {COLUMNS.map((headCell) => headCell.key).map((headCell, index) => (
            <TableCell
              key={headCell}
              align={'center'}
              padding={'normal'}
              width={headCell === 'test_name' ? undefined : 200}
              sortDirection={orderBy === headCell ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell}
                direction={orderBy === headCell ? order : 'asc'}
                onClick={createSortHandler(headCell as keyof UserResultType)}
                sx={
                  {
                    '&:hover':{
                      '& .MuiTableSortLabel-icon': {
                        opacity: '0.7'
                      },
                    },
                    '& .MuiTableSortLabel-icon': {
                      opacity: '0.25'
                    },
                  }
                }
              >
                {COLUMNS[index].title}
                {orderBy === headCell ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}

export default function UserResults() {

    const [orderBy, setOrderBy] = useState<keyof UserResultType>('date');
    const [order, setOrder] = useState<Order>('asc');
    
    const [data, setData] = useState<UserResultType[]>([]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof UserResultType,
      ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const navigate = useNavigate();

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        const url = `/admin/results`;

        axios.get(url, {cancelToken: cancelToken.token})
        .then((response) => {
            const rdata : UserResultTypeResponse[] = response.data;
            
            setData(rdata.map(
                (data_row) => ({
                    ...data_row,
                    incorrect_asks: data_row.incorrect_asks_ids.length
                })
            ));
        })
        .catch((error) => {
            console.log('Error: ', error.message);
        })

        return () => {
            cancelToken.cancel();
        }
    }, [])

    const visibleData = useMemo(() => stableSort(data, getComparator(order, orderBy)), [data, order, orderBy]);

    return (
        <main>
            <Paper>
                <TableContainer>
                    <Table stickyHeader>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            numSelected={0}
                            onSelectAllClick={() => {}}
                        />
                        <TableBody>
                            {
                                visibleData.map((data_row, index) => (
                                    <TableRow key={index}>
                                        {
                                            COLUMNS.slice(0, 3).map(({key}) => (
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