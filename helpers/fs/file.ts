import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";

export function readFile(req: NextApiRequest, saveLocally: boolean, userId: string) {
    const options: formidable.Options = {}

    if (saveLocally) {
        options.uploadDir = path.join('serverFiles', "folders", userId)
        options.filename = (name, ext, path, form) => {
            return path.originalFilename + ""
        }
    }
    
    const form = formidable(options)
    
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
}