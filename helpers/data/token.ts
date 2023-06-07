import jwt from "jsonwebtoken"
export type TokenType = "user" | "reset-password" | "verify-user"

function getTokenSecret(tokenType: TokenType) {
    let tokenSecret: string | undefined = ""

    switch (tokenType) {
        case "user":
            tokenSecret = process.env.USER_TOKEN
            break
        case "reset-password":
            tokenSecret = process.env.USER_RESET_TOKEN
            break
        case "verify-user":
            tokenSecret = process.env.USER_VERIFICATION_TOKEN
            break
    }
    if (!tokenSecret) throw new Error("Wrong token type")
    return tokenSecret
}

export function signToken(payload: any, tokenType: TokenType, expiresIn: string) {
    let tokenSecret = getTokenSecret(tokenType)
    console.log(payload)
    const token = jwt.sign(payload, tokenSecret, { expiresIn })

    return token
}

export function verifyToken(token: string, tokenType: TokenType) {
    let tokenSecret = getTokenSecret(tokenType)
    const valid = jwt.verify(token, tokenSecret)

    return valid
}