import { useCallback, useEffect, useReducer } from "react"
import { appConstants } from "../constants/appConstants"
import axios from "axios"

// router
import { useSearchParams } from "next/navigation"

// --- actions ---
type Move = { type: "move", payload: string}
type CreateDir = { type: "createDir", payload: string}
type Sort = { type: "sort", payload: "create date" | "size" | "name"}
type SendFile = { type: "sendFile", payload: { files: File[], folder: string }}
type UploadFiles = { type: "uploadFiles", payload: string[] }
type SetUploadingProgress = { type: "uploadingProgress", payload: UploadProgress}
type ClearUploads = { type: "clearUploads" }

type SetError = { type: "setError", payload: string}
type SetLoading = { type: "setLoading", payload?: null}

export type ActionType = Move | CreateDir | Sort | SendFile | SetError | SetLoading | UploadFiles | SetUploadingProgress | ClearUploads
type UploadProgress = {
    file: string
    loaded: number
    total: number
}

export interface stateType {
    data: {
        currentFolder: string
        folderContent: structureType[]
    },
    uploads: UploadProgress[],
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
    uploads: [],
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
        case "uploadFiles":
            console.log(action.payload)
            for (let fileName of action.payload) {
                state.data.folderContent.push({ name: fileName, type: "file"})
            }
            return { ...state }
        case "uploadingProgress":
            // console.log(action.payload)
            const { file, total, loaded } = action.payload
            // __ find existing file progress indicator ___
            const progress = state.uploads.find(e => e.file === action.payload.file)
            if (progress) {
                progress.loaded = loaded
            } else {
                state.uploads.push({ file, total, loaded })
            }
            return { ...state }
        case "clearUploads":
            state.uploads = []
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
                const { files, folder } = action.payload
                
                const formData = new FormData()
               
                // @ts-ignore
                Array.from(files).forEach((f: File, i: number) => {
                    console.log(f, i)
                    formData.append(`File${i}`, f)                
                })
           
                // ___ adding information about current folder ___
                formData.append('jsondata', JSON.stringify({ folder }))
                

                const myUploadProgress = (myFileName: string) => (progress: any) => {
                    // let percentage = Math.floor((progress.loaded * 100) / progress.total)
                    dispatch({ type: "uploadingProgress", payload: { file: myFileName, total: progress.total, loaded: progress.loaded}})
                  }
                  
                  for (let i=0; i<files.length; i++) {
                    let config = {
                      onUploadProgress: myUploadProgress(files[i].name)
                    };

                res = await axios.post(`${appConstants.serverUrl}/api/file`, formData, config)
                console.log(res)

                if (res.status !== 200) return dispatch({ type: "setError", payload:  res.data.message })
                resData = res.data
                console.log(resData)
                dispatch({ type: "uploadFiles", payload: resData.data })
                break
        }
    }
}
    const customDispatch = useCallback(cDisptatch, [])

    console.log(state)

    useEffect(() => {
        if (pathName === null) {
            customDispatch({ type: "move", payload: "/"})
        } else {
            customDispatch({ type: "move", payload: "/" + pathName})
        }
    }, [pathName])
    return { data: state, dispatch: customDispatch }
}