import { NextApiRequest } from "next";
import { verifyToken } from "../data/token";

export const cookieValidations = {
    verifyUser: (req: NextApiRequest) => {
        console.log(req.cookies)
        const token = req.cookies['userToken']
        if (!token) return { error: { user: "no cookie provided" } }

        const { id } = verifyToken(token, "user") as { id: string }
        if (!id) return { error: { user: "User not verified" } }

        return { data: { id } }
    }

}
