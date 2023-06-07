// import bcrypt from "bcrypt"
const bcrypt = require('bcrypt')


type hashResponseType = {
    err?: string
    res?: string
}

type compareResponseType = {
    err?: string
    res?: boolean
}

export const hashHelpers = {
    hashPass: (password: String) => {
        return new Promise<hashResponseType>(async (resolve, reject) => {
            try {
                const hashed = await bcrypt.hash(password, 12)
                // console.log(hashe);
                resolve({ res: hashed })

            } catch (err) {
                reject({ err })
            }
        })

    },

    comparePass: (password: String, typedPass: string) => {
        return new Promise<compareResponseType>(async (resolve, reject) => {
            try {
                const match = await bcrypt.compare(password, typedPass)
                resolve({ res: match })
            } catch (err) {
                reject({ err })
            }
        })
    }
}