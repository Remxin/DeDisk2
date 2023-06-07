import { NextApiRequest } from "next";
import { verifyToken } from "../data/token";

export const cookieValidations = {
    verifyUser: (req: NextApiRequest) => {
        const token = req.cookies['user-token']
        if (!token) return { error: { user: "no cookie provided" } }

        const { id } = verifyToken(token, "user") as { id: string }
        if (!id) return { error: { user: "User not verified" } }

        return { data: { id } }
    }

}
