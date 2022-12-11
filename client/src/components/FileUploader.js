import React, {useRef} from 'react'

const FileUploader = ({onFileSelectSuccess, onFileSelectError}) => {
    const fileInput = useRef(null)

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (/[^.]+$/.exec(file.name)[0] === 'txt' && file.size > 100) {
            e.target.value = null;
            onFileSelectError({ error: "File size cannot exceed more than 100KB" });
            return;
        }
        
        onFileSelectSuccess(file);
    }

    return (
        <div className="file-uploader">
            <input type="file" onChange={handleFileInput} accept=".gif, .jpg, .png, .txt" />
            <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary" />
        </div>
    );
}

export default FileUploader;