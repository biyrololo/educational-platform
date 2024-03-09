import { Button, IconButton, TextField } from "@mui/material";
import addImageFromFile from "features/File2Base64";
import { useRef, useState } from "react";
import { TestInfoType } from "types/CreateTestTypes";
import CloseIcon from '@mui/icons-material/Close';
import ImageLoader from "components/ImageLoader/ImageLoader";

type Props = {
    testInfo: TestInfoType,
    setTestInfo: (testInfo: TestInfoType) => void
}

export default function TestInfo(props: Props) {

    return (
        <>
            <TextField
            label="Название теста"
            name="test-name"
            id="test-name"
            size="small"
            value={props.testInfo.name}
            onChange={(e) => {
                if(!e.target.value) return
                props.setTestInfo({
                    ...props.testInfo,
                    name: e.target.value
                })
            }}
            fullWidth
            multiline
            />
            <ImageLoader 
            setImg={(img) => {
                props.setTestInfo({
                    ...props.testInfo,
                    img
                })
            }}
            />
        </>
    )
}