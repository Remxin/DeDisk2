import { otherValidations } from "./other"

export const userValidations = {
    nick: (text: string) => {
        const containsSwears = otherValidations.swear(text)
        if (containsSwears) return "Please do not use swears"

        const badLen = text.length < 3
        if (badLen) return "User name should be at least 3 characters long"

        return ""
    },

    email: (text: string) => {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        const isValid = regex.test(text)

        return isValid ? "" : "Wrong email"
    },

    password: (text: string) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm
        const isValid = regex.test(text)

        return isValid ? "" : "Password should be more complicated"
    }
}