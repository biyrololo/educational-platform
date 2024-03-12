import { Button } from "@mui/material";
import { downloadFileFromUrl } from "features/DownloadFile";

export default function DownloadUsers() {

    function downloadExcel(){
        downloadFileFromUrl(
            {
                url: '/download_users',
                fileName: 'users',
                fileExtension: 'xlsx',
                throwError: true,
            }
        )
    }

    return (
        <Button 
        variant="contained"
        sx={
            {
                width: 300,
                margin: '0 auto',
                display: 'flex'
            }
        }
        onClick={downloadExcel}
        >
            Скачать Excel
        </Button>
    )
}