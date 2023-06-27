import { Dispatch, createContext, useState } from "react"

// hooks
import { useDrive } from "../hooks/useDrive"
import { ActionType } from "../hooks/useDrive"

// types
import { stateType as DataType, initialState } from "../hooks/useDrive"

type ProviderProps = {
    children: React.ReactNode | React.ReactNode[] 
}

type ContextType = {
    data: DataType
    dispatch: (actionType: ActionType) => any
    setCreateFolder: Dispatch<boolean>
    createFolder: boolean
}

export const DriveContext = createContext<ContextType>({ data: initialState, dispatch: () => null, setCreateFolder: () => null, createFolder: false})

export default function DriveContextProvider({ children }: ProviderProps) {
    const { data, dispatch } = useDrive()
    const [createFolder, setCreateFolder] = useState(false)

    return (
        <DriveContext.Provider value={{ data, dispatch, createFolder, setCreateFolder}}>
            {children}
        </DriveContext.Provider>
    )
}