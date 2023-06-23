import { useCallback, useEffect, useReducer } from "react"
import { appConstants } from "../constants/appConstants"

// --- actions ---
type Move = { type: "move", payload: string}
type CreateDir = { type: "createDir", payload: string}
type Sort = { type: "sort", payload: "create date" | "size" | "name"}
type SendFile = { type: "sendFile", payload: File}

type SetError = { type: "setError", payload: string}
type SetLoading = { type: "setLoading", payload?: null}

export type ActionType = Move | CreateDir | Sort | SendFile | SetError | SetLoading

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
        currentFolder: "",
        folderContent: []
    },
    loading: true,
    error: ""
}

function driveReducer(state: stateType, action: ActionType) {
    switch (action.type) {
        case "move":
            // @ts-ignore
            state.data = action.payload
            state.error = ""
            state.loading = false
            return { ...state }
        case "createDir":
            state.data.folderContent.push({ name: action.payload, type: "folder"})
            return { ...state }
        case "setLoading":
            state.loading = true
            return { ...state }
        case "setError":
            state.loading = false
            state.error = action.payload
            return { ...state }
        default:
            return {...state}
    }
}

export function useDrive() {
    const [state, dispatch] = useReducer(driveReducer, initialState)

    const customDispatch = useCallback(async (action: ActionType) => {
        let res = null
        let resData = null
        switch(action.type) {
            case "move":
                dispatch({ type: "setLoading" })
                res = await fetch(`${appConstants.serverUrl}/api/dir/${action.payload}`)
                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).error })
                resData = await res.json()
                //@ts-ignore
                dispatch({ ...action, payload: {currentFolder: action.payload, folderContent: resData.data}})
                break

            case "createDir":
                dispatch({ type: "setLoading"})
                res = await fetch(`${appConstants.serverUrl}/api/dir/`, {
                    method: "POST",
                    body: JSON.stringify({ pathName: action.payload})
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).error.server })
                resData = await res.json()
                dispatch({ type: "createDir", payload: resData.path})
                break
        }
    }, [])

    useEffect(() => {
        customDispatch({ type: "move", payload: "/"})
    }, [])

    return { data: state, dispatch: customDispatch }
}