// import bcrypt from "bcrypt"
import bcrypt from "bcrypt"


type hashResponseType = {
    err?: string
    res?: string
}

type compareResponseType = {
    err?: string
    res?: boolean
}

export const hashHelpers = {
    hashPass: (password: string) => {
        return new Promise<hashResponseType>(async (resolve, reject) => {
            try {
                const hashed = await bcrypt.hash(password, 12)
                resolve({ res: hashed })

            } catch (err) {
                reject({ err })
            }
        })

    },

    comparePass: (password: string, typedPass: string) => {
        return new Promise<compareResponseType>(async (resolve, reject) => {
            try {
                const match = await bcrypt.compare(typedPass, password)
                resolve({ res: match })
            } catch (err) {
                reject({ err })
            }
        })
    }
}