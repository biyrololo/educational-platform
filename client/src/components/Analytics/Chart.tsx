import { AsksType, ResultType } from "types"
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useMemo, useState } from "react";
import Filters from "./Filters";

type Props = {
    data: ResultType[];
    asks: AsksType
}

export default function Chart(props: Props) {

    const [date_filter, set_date_filter] = useState({
        startDate: new Date(new Date().getTime() - 86400000*14),
        endDate: new Date()
    });

    const results = props.data;

    const asks = props.asks;

    const count_correct_answers : {"правильно ответили": number, index: string}[] = [];

    let filtered_data = results.filter(r => new Date(r.date) >= date_filter.startDate && new Date(r.date) <= date_filter.endDate);

    for(let i = 0; i < asks.length; i++) {
        count_correct_answers[i] = {
            "правильно ответили": 0,
            index: `${i + 1}`
        }
        for(let res of filtered_data.filter(r => !r.incorrect_asks_ids.includes(asks[i].id))) {
            count_correct_answers[i]["правильно ответили"]++
        }

    }

    if(results.length === 0) {
        return null
    }

    return (
        <>
            <Filters onSelectDate={(date) => set_date_filter(date)}/>
            <div className="d-flex jc-center ai-center">
                <BarChart
                    width={1000}
                    height={300}
                    data={count_correct_answers}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="правильно ответили" fill="#8884d8" />
                </BarChart>
            </div>
        </>
    )
}