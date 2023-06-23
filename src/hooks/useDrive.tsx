import { useCallback, useEffect, useReducer } from "react"
import { appConstants } from "../constants/appConstants"

// --- actions ---
type Move = { type: "move", payload: string}
type CreateDir = { type: "createDir", payload: string}
type Sort = { type: "sort", payload: "create date" | "size" | "name"}
type SendFile = { type: "sendFile", payload: File}

export type ActionType = Move | CreateDir | Sort | SendFile

// ---
// interface actionType {
//     type: ActionType,
//     payload: any
// }

interface stateType {
    data: {

        currentFolder: string
        folderContent: structureType[]
    },
    loading: boolean
    error: string
}

interface structureType {
    name: string
    type: "folder" | "file"
}

const initialState: stateType = {
    data: {

        currentFolder: "/",
        folderContent: []
    },
    loading: false,
    error: ""
}

function driveReducer(state: stateType, action: ActionType) {
    switch (action.type) {
        case "move":
            return { ...state }
        default:
            return {...state}
    }
}

export function useDrive() {
    const [state, dispatch] = useReducer(driveReducer, initialState)

    const customDispatch = useCallback(async (action: ActionType) => {
        switch(action.type) {
            case "move":
                const res = await fetch(`${appConstants.serverUrl}/api/dir/${action.payload}`)
                break
        }
    }, [])

    useEffect(() => {
        customDispatch({ type: "move", payload: ""})
    }, [])

    return { state, dispatch: customDispatch }
}