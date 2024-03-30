import { createContext, useContext} from "react"
type SharedDriveContextT = {
    content: {
        name: string
        type: "folder" | "file"
    }[]
}

type ContextProviderT = {
    children: JSX.Element | JSX.Element[]
}


const SharedDriveContext = createContext<null | SharedDriveContextT>(null)

export const SharedDriveContextProvider = ({ children }: ContextProviderT) => {
    const context = useContext(SharedDriveContext)
    return (
        <SharedDriveContext.Provider value={context}>
            {children}
        </SharedDriveContext.Provider>
    )

}

export const useSharedDriveContext = () => {
    const context = useContext(SharedDriveContext)
    if (!context) throw new Error("Context should be used within parent component")

    return context
}