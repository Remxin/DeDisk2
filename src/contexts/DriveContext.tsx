import { Dispatch, createContext, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

// hooks
import { useDrive } from "../hooks/useDrive"
import { ActionType } from "../hooks/useDrive"

// types
import { stateType as DataType, initialState } from "../hooks/useDrive"
import { QueryProps } from "@/pages/drive"



type ProviderProps = {
    children: React.ReactNode | React.ReactNode[] ,
    queryProps: QueryProps
} 

type ContextType = {
    data: DataType
    dispatch: (actionType: ActionType) => any
    setCreateFolder: Dispatch<boolean>
    createFolder: boolean,
    queryProps: QueryProps

}

export const DriveContext = createContext<ContextType>({ data: initialState, dispatch: () => null, setCreateFolder: () => null, createFolder: false, queryProps: null})

export default function DriveContextProvider({ children, queryProps }: ProviderProps) {
    const { data, dispatch } = useDrive(queryProps)
    const [createFolder, setCreateFolder] = useState(false)

   

    return (
        <DriveContext.Provider value={{ data, dispatch, createFolder, setCreateFolder, queryProps}}>
            {children}
        </DriveContext.Provider>
    )
}