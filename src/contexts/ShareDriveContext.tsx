import { createContext, useContext, useState, Dispatch } from "react"
import { useSearchParams } from 'next/navigation'

type SharedDriveContentT = {
    name: string
    type: "folder" | "file"
}
type SharedDriveContextT = {
    path: string
    token: string
    content: SharedDriveContentT[],
    setContent: Dispatch<SharedDriveContentT[]>
}

type ContextProviderT = {
    children: JSX.Element | JSX.Element[]
}


const SharedDriveContext = createContext<null | SharedDriveContextT>(null)

export const SharedDriveContextProvider = ({ children }: ContextProviderT) => {
    const [content, setContent] = useState<SharedDriveContentT[]>([])
    const searchParams = useSearchParams()
    let path = searchParams.get("path") || "/" as string
    path = path.replaceAll("%2F", "/")
    const token = searchParams.get("token") || ""
    return (
        <SharedDriveContext.Provider value={{ content, path, token, setContent }}>
            {children}
        </SharedDriveContext.Provider>
    )

}

export const useSharedDriveContext = () => {
    const context = useContext(SharedDriveContext)
    if (!context) throw new Error("Context should be used within parent component")

    
    return context
}