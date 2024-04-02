import { jwtVerify } from "jose"

type UserJwtPayload = {
    id: string
}

export const getJwtSecret = () => {
    const secret = process.env.USER_TOKEN
    if (!secret || secret.length === 0) {
        throw new Error("The environment USER_TOKEN is not set")
    }

    return secret
}

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecret()))
        return verified.payload as UserJwtPayload
      
    } catch (err) {
        throw new Error("Your token has expired")
    }
}