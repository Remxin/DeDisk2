import { BiSolidFileTxt, BiSolidFilePng, BiSolidFilePdf, BiSolidFileMd, BiSolidFileJson, BiSolidFileJs, BiSolidFileJpg, BiSolidFileHtml, BiSolidFileGif, BiSolidFileDoc, BiSolidFileCss, BiSolidFileBlank } from "react-icons/bi"
type ExtensionType = "txt" | "png" | "pdf" | "md" | "json" | "js" | "jpg" | "jpeg" | "html" | "gif" | "doc" | "css"

export function getFileIcon(fileName: string) {
    const extension = fileName.split(".").slice(-1)[0] as ExtensionType

    switch (extension) {
        case "css":
            return <BiSolidFileCss/>
        case "doc":
            return <BiSolidFileDoc/>
        case "gif":
            return <BiSolidFileGif/>
        case "html":
            return <BiSolidFileHtml/>
        case "jpeg":
        case "jpg":
            return <BiSolidFileJpg/>
        case "js":
            return <BiSolidFileJs/>
        case "json":
            return <BiSolidFileJson/>
        case "md":
            return <BiSolidFileMd/>
        case "pdf":
            return <BiSolidFilePdf/>
        case "png":
            return <BiSolidFilePng/>
        case "txt":
            return <BiSolidFileTxt/>
        default:
            return <BiSolidFileBlank/>
    }
}