import { NextApiRequest } from "next";
import { verifyToken } from "../data/token";

export const cookieValidations = {
    verifyUser: (req: NextApiRequest) => {
        const token = req.cookies['userToken']
        if (!token) return { error: { user: "no cookie provided" } }

        const { id } = verifyToken(token, "user") as { id: string }
        if (!id) return { error: { user: "User not verified" } }

        return { data: { id } }
    },
    verifyShare: (req: NextApiRequest) => {
        const token = req.query["token"] as string
        if (!token) return { error: "token not provided" }
        const { filepath, userId } = verifyToken(token, "share") as { filepath: string, userId: string }
        if (!filepath || !userId) return { error: "bad token" }

        return { data: { filepath, userId }}

    }

}
