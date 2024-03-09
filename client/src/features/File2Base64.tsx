function addImageFromFile(f: File, callback: (result: string) => void) : void {
    
    const reader = new FileReader();
    reader.readAsDataURL(f)
    reader.onloadend = () =>{
        const result = reader.result as string;
        callback(result);
    }
}

export default addImageFromFile;
