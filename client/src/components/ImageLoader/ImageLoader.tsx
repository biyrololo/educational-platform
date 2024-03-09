import { Button, IconButton} from "@mui/material";
import addImageFromFile from "features/File2Base64";
import { useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    setImg: (img: string) => void
}

export default function ImageLoader({setImg}: Props) {

    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(file: File | null) {
        if(!file) return
        setFile(file)
        addImageFromFile(file, (result) => {
            if(!result) return
            setImg(result)
        })
    }

    function clearFile(){
        setFile(null);
        setImg('')
    }
    return (
        
        <section>
            <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => handleFileChange(e.target.files?.item(0) || null)}
            />
            <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            >
                {
                    file ? file.name : 'Загрузить изображение'
                }
            </Button>
            <IconButton onClick={clearFile}>
                <CloseIcon/>
            </IconButton>
        </section>
    )
}