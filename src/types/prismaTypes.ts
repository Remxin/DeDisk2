export type UserT = {
    id: string
    email: string
    name: string
}

export type ShareT = {
    id: string
    userId: string
    user: UserT
    token: string
    sharedSource: string
    sharedTo: string
    createData: Date
}