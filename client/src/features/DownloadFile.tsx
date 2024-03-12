import axios, { AxiosRequestConfig } from "axios";

type DownloadFileProps = {
    url: string;
    config?: AxiosRequestConfig<any>;
    fileName?: string;
    fileExtension?: string;
    throwError?: boolean;
    handleError?: () => void;
}

const DEFAULT_PROPS : DownloadFileProps = {
    url: '/',
    config: {
        responseType: 'blob',
    },
    fileName: 'file',
    fileExtension: 'txt',
    throwError: true,
    handleError: () => {},
}

/**
 * Downloads a file from a given URL.
 *
 * @param {DownloadFileProps} props - The properties for downloading the file.
 * @param {string} props.url - The URL of the file to download.
 * @param {object} props.config - The configuration for the HTTP request.
 * @param {string} props.fileName - The name of the downloaded file.
 * @param {string} props.fileExtension - The file extension of the downloaded file.
 * @param {boolean} props.throwError - Whether to throw an error if the download fails.
 * @param {() => void} props.handleError - A function to handle the error.
 */
async function downloadFileFromUrl(props: DownloadFileProps) {
    
    const { url, config, fileName, fileExtension, throwError, handleError } = { ...DEFAULT_PROPS, ...props };

    try{
        const response = await axios.get(url, config);
        const blob = new Blob([response.data]);
        const object_url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = object_url;
        a.download = `${fileName}.${fileExtension}`;
        a.click();
        window.URL.revokeObjectURL(object_url);
    }
    catch(err){
        if(throwError)
            throw new Error(`Error downloading file: ${err}`);
        else 
            console.error(`Error downloading file: ${err}`);
        if(handleError) handleError();
    }

}

export {downloadFileFromUrl};