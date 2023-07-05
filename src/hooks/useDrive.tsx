import { useCallback, useEffect, useReducer } from "react"
import { appConstants } from "../constants/appConstants"
import axios from "axios"

// router
import { useSearchParams } from "next/navigation"

// --- actions ---
type Move = { type: "move", payload: string}
type CreateDir = { type: "createDir", payload: string}
type Sort = { type: "sort", payload: "create date" | "size" | "name"}
type SendFile = { type: "sendFile", payload: FormData}

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
    const searchParams = useSearchParams()
    const pathName = searchParams.get("path")
    const [state, dispatch] = useReducer(driveReducer, initialState)
    

    async function cDisptatch (action: ActionType) {
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
            case "sendFile":
                // dispatch({ type: "setLoading"})
                const files = action.payload
                console.log(files)
                res = await axios.post(`${appConstants.serverUrl}/api/file`, files)
                // res = await fetch(`${appConstants.serverUrl}/api/file`, {
                //     method: "POST",
                //     body: files,
                //     headers: {
                //         "Content-Type": "multipart/form-data"
                //         // "Content-Type": "text/plain; charset=utf-8"
                //     }
                // })
                break
        }
    }
    const customDispatch = useCallback(cDisptatch, [])



    useEffect(() => {
        if (pathName === null) {
            customDispatch({ type: "move", payload: "/"})
        } else {
            customDispatch({ type: "move", payload: "/" + pathName})
        }
    }, [pathName])
    return { data: state, dispatch: customDispatch }
}