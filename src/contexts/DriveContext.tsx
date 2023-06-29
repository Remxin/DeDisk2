import { Dispatch, createContext, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

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
    const searchParams = useSearchParams()
    const pathName = searchParams.get("path")
    const { data, dispatch } = useDrive()
    const [createFolder, setCreateFolder] = useState(false)

    useEffect(() => {
        console.log(pathName)
        if (pathName === null) {
            dispatch({ type: "move", payload: "/"})
        } else {
            // console.log("jest", "/" + pathName)
            dispatch({ type: "move", payload: "/" + pathName})
        }
    }, [pathName])

    return (
        <DriveContext.Provider value={{ data, dispatch, createFolder, setCreateFolder}}>
            {children}
        </DriveContext.Provider>
    )
}