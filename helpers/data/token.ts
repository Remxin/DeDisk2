import jwt from "jsonwebtoken"
export type TokenType = "user" | "share"

function getTokenSecret(tokenType: TokenType) {
    let tokenSecret: string | undefined = ""

    switch (tokenType) {
        case "user":
            tokenSecret = process.env.USER_TOKEN
            break
        case "share":
            tokenSecret = process.env.SHARE_TOKEN
            break
        default:
            throw new Error("this type of token does not exist")
       
    }
    if (!tokenSecret) throw new Error("Wrong token type")
    return tokenSecret
}

export function signToken(payload: any, tokenType: TokenType, expiresIn: string) {
    let tokenSecret = getTokenSecret(tokenType)
    const token = jwt.sign(payload, tokenSecret, { expiresIn })

    return token
}

export function verifyToken(token: string, tokenType: TokenType) {
    let tokenSecret = getTokenSecret(tokenType)
    const valid = jwt.verify(token, tokenSecret)
    return valid
}
