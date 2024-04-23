import { Autocomplete, TextField } from "@mui/material"

import {TestType} from "types"
import {useState, useEffect} from "react"
import axios from "axios"
type Props = {
    onSelect: (test_id: number) => void
}

export default function TestSelect({ onSelect }: Props) {

    const [all_tests, setAllTests] = useState<TestType[]>([]);

    const [selected_test, setSelectedTest] = useState<string>("");

    const all_tests_names = all_tests.map(test => test.name);

    useEffect(
        ()=>{
            const cancelToken = axios.CancelToken.source();

            const url = '/tests';

            axios.get(url, {cancelToken: cancelToken.token})
            .then((response) => {
                setAllTests(response.data);
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
        },
        []
    )

    return (
        <div
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
            <Autocomplete 
                noOptionsText="Ничего не найдено"
                disableClearable
                id="test-select"
                options={all_tests_names}
                value={selected_test}
                onChange={(event: any, newValue: string | null) => {
                    setSelectedTest(newValue || "");
                    if(newValue){
                        onSelect(all_tests.find(test => test.name === newValue)?.id || -1);
                    }
                }}
                renderInput={(params) => <TextField {...params} label="Тест" style={{width: 300}}
                />
            }
                
            />

        </div>
    )
}