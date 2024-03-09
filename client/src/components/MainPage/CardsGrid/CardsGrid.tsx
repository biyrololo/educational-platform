import CardComponent from 'components/Card';
import { useEffect, useState } from 'react';
import './CardsGrid.css';
import { TestType } from 'types';
import axios from 'axios';

export default function CardsGrid(){

    const [tests, setTests] = useState<TestType[]>([]);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        console.log(axios.defaults.baseURL)

        const url = '/tests'

        axios.get(url, {cancelToken: cancelToken.token})
        .then((response) => {
            setTests(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            if(axios.isCancel(error)){
                console.log('Error: ', error.message);
            }
            else{
                console.log('Error: ', error.message);
            }
        })

        return () => {
            cancelToken.cancel()
        }
    }, [])

    return (
        <section id="cards-grid">
            {
                tests.map((test) => <CardComponent key={test.id} test_id={test.id} title={test.name} img_src={test.img_src}/>)
            }
        </section>
    )
}