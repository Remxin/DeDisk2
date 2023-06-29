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

export interface stateType {
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

export const initialState: stateType = {
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
            // console.log(action.payload)
            // @ts-ignore
            state.data = action.payload
            state.error = ""
            state.loading = false
            return { ...state }
            // return { ...state, data: action.payload, error: "", loading: false}
        case "createDir":
            if(state.data.folderContent.some((e) => e.name === action.payload)) return { ...state } // ! to prevent calling twice
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

    async function cDisptatch (action: ActionType) {
        let res = null
        let resData = null
        switch(action.type) {
            case "move":
                // console.log(action.payload)
                dispatch({ type: "setLoading" })
                res = await fetch(`${appConstants.serverUrl}/api/dir/${action.payload}`)
                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).error })
                resData = await res.json()
                // console.log(action.payload, resData.data)
                
                //@ts-ignore
                dispatch({ ...action, payload: {currentFolder: action.payload, folderContent: resData.data}})
                break

            case "createDir":
                const dirName = action.payload.split("/").pop()
                dispatch({ type: "setLoading"})
                res = await fetch(`${appConstants.serverUrl}/api/dir/`, {
                    method: "POST",
                    body: JSON.stringify({ pathName: action.payload})
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).error.server })
                resData = await res.json()
                dispatch({ type: "createDir", payload: resData.path.split("/").pop()})
                break
        }
    }

    const customDispatch = useCallback(cDisptatch, [])

    // useEffect(() => {
    //     customDispatch({ type: "move", payload: "/"})
    // }, [])

    return { data: state, dispatch: customDispatch }
}