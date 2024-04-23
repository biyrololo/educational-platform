import Header from "components/AdminHeader/Header";

import { useState } from "react";

import { AsksType, ResultType } from "types";

import axios from "axios";
import { toast } from "react-toastify";
import TestSelect from "components/Analytics/TestSelect";
import Chart from "components/Analytics/Chart";

export default function AnalyticsPage() {

    const [data, setData] = useState<ResultType[]>([]);

    const [asks, setAsks] = useState<AsksType>([]);
    async function requestDataByTestId(test_id: number) {
        const url = `/admin/results/${test_id}`;

        axios.get(url)
        .then((response) => {
            setData(response.data);
        })
        .then(() => {
            let url = `/asks/${test_id}`;

            return axios.get(url)  
        })
        .then((response) => {
            setAsks(response.data);
        })
        .catch((error) => {
            console.log('Error: ', error.message);
            toast.error(error.message);
        })
    }

    return (
        <>
            <Header />
            <main className="d-flex fd-column g-30">
                <TestSelect onSelect={requestDataByTestId} />
                <Chart data={data} asks={asks} />
            </main>
        </>
    )
}