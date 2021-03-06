
export class DownloadUtils {

    static downloadFile(fileName: string, fileContent: Blob) {
        // @ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // @ts-ignore
            window.navigator.msSaveOrOpenBlob(fileContent, fileName);
        } else {
            const a = document.createElement('a');
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(fileContent);
            a.href = url;
            a.download = fileName;
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 0);
        }
    }
}
