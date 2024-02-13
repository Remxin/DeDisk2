import { useCallback, useEffect, useReducer, Reducer } from "react"
import { appConstants } from "../constants/appConstants"
import axios from "axios"

// redux
import { useDispatch } from "react-redux"

// router
import { useSearchParams } from "next/navigation"
import Router from "next/router"

// helpers
import { getOriginalPath, getModifiedPath } from "../helpers/path"
import { splitPath } from "@/helpers/fs/path"

// types
import { ShareT } from "../types/prismaTypes"
import { ResponseT } from "../types/apiTypes"

// --- actions ---
type Move = { type: "move", payload: string}
type CreateDir = { type: "createDir", payload: string}
type Sort = { type: "sort", payload: "create date" | "size" | "name"}
type SendFile = { type: "sendFile", payload: { files: File[], folder: string }}
type UploadFiles = { type: "uploadFiles", payload: string[] }
type SetUploadingProgress = { type: "uploadingProgress", payload: UploadProgress}
type Rename = { type: "rename", payload: { name: string, newName: string, currentLocation: string }}
type Delete = { type: "delete", payload: { target: string }}
type GetInformations = { type: "informations", payload: { target: string }}
type ClearData = { type: "clear additional data" }
type ClearUploads = { type: "clearUploads" }

type AddToFavourites = { type: "add to favourites", payload: { fileName: string, path: string, type: "file" | "folder" }}
type RemoveFromFavourites = { type: "remove from favourites", payload: { fileName: string, path: string }}
type GetFavourites = { type: "get favourites", payload: favouriteStructureType[] }

type GetShared = { type: "get shared", payload: Omit<ShareT, "user userId">[] }

type SetError = { type: "setError", payload: string} 
type SetLoading = { type: "setLoading" }

// _ ACTIONS _
export type ActionType = Move | CreateDir | Sort | SendFile | SetError | SetLoading | UploadFiles | SetUploadingProgress | ClearUploads | Rename | Delete | GetInformations | ClearData | AddToFavourites | RemoveFromFavourites | GetFavourites | GetShared

// --- upload ---
type UploadProgress = {
    file: string
    loaded: number
    total: number
}

// additional informations
type FileInformations = {
    name: string
    size: number
    path: string
    atime: Date
    birthtime: Date
    extension: string
}
export type AdditionalData = null | ({ type: "file data" } & FileInformations) | ({ type: "shared"} & Omit<ShareT, "user userId">[])

type NormalSearchT = {
    searchType: "" // empty string is normal search
    currentFolder: string
    folderContent: structureType[]
    additionalData: AdditionalData | null
}

type FavouritesSearchT = {
    searchType: "favourites"
    currentFolder: string
    folderContent: favouriteStructureType[]
    additionalData: AdditionalData | null
}

type SharedSearchT = {
    searchType: "shared"
    currentFolder: string
    folderContent: Omit<ShareT, "user userId">[],
    additionalData: AdditionalData | null
}
export type stateType = {
    data: NormalSearchT | FavouritesSearchT | SharedSearchT,
    uploads: UploadProgress[],
    loading: boolean
    error: string
}

interface structureType {
    name: string
    type: "folder" | "file"
}
interface favouriteStructureType  {
    name: string
    type: "folder" | "file"
    date: string
    path: string
}

// query props type
import { QueryProps } from "@/pages/drive"
import { resetLoadingData, setError, setLoading, setUser, userInitialType } from "../features/userSlice"

// ----------------

export const initialState: stateType = {
    data: {
        searchType: "",
        currentFolder: "",
        folderContent: [],
        additionalData: null
    },
    uploads: [],
    loading: true,
    error: ""
}

//@ts-ignore
const driveReducer: Reducer<stateType, ActionType> = (state, action) => {
    switch (action.type) {
        case "move":
            state.data.searchType = ""
            // @ts-ignore
            let originalPath = getOriginalPath(action.payload.currentFolder)
            // @ts-ignore
            action.payload.currentFolder = originalPath
            
            state.data = {
                ...state.data,
                // @ts-ignore
                ...action.payload,
                additionalData: null
            }
            state.error = ""
            state.loading = false
            return { ...state }
        case "createDir":
            if (state.data.searchType !== "") return
            if(state.data.folderContent.some((e) => e.name === action.payload)) return { ...state }
            //@ts-ignore`
            state.data.folderContent.push({ name: action.payload, type: "folder"})
            return { ...state }
            case "uploadFiles":
                for (let fileName of action.payload) {
                //@ts-ignore`
                state.data.folderContent.push({ name: fileName, type: "file"})
            }
            return { ...state }
        case "uploadingProgress":
            const { file, total, loaded } = action.payload
            // __ find existing file progress indicator ___
            const progress = state.uploads.find(e => e.file === action.payload.file)
         
            if (progress) {
                progress.loaded = loaded
            } else {
           
                state.uploads.push({ file, total, loaded })
            }
            return { ...state }
        case "delete":
            if (state.data.searchType !== "") return
            state.data.folderContent = state.data.folderContent.filter(e => e.name !== action.payload.target)
            return { ...state }
        case "clearUploads":
            state.uploads = []
            return { ...state }
        case "rename":
            if (state.data.searchType !== "") return
            const myFile = state.data.folderContent.find((e) => e.name === action.payload.name) !
            myFile.name = action.payload.newName
            return { ...state }
        case "informations":
            // @ts-ignore
            state.data.additionalData = { type: "file data", ...action.payload }
            return { ...state }
        case "clear additional data":
            state.data.additionalData = null
            return { ...state }
        case "get favourites":
            state.data.searchType = "favourites"
            state.data.folderContent = action.payload

            return { ...state }
        case "get shared":
            state.data.searchType = "shared"
            state = {
                ...state,
                data: {
                    searchType: "shared",
                    folderContent: action.payload,
                    additionalData: null,
                    currentFolder: ""
                }
            }
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


export function useDrive(queryProps: QueryProps) {
    const [state, dispatch] = useReducer(driveReducer, initialState)
    const userDispatch = useDispatch()
    

    async function cDisptatch (action: ActionType) {
        let res = null
        let resData = null
        let target = null

        // handle main actions
        switch(action.type) {
            case "move":
                dispatch({ type: "setLoading" })
                
                Router.push(`${appConstants.clientUrl}/drive?path=${action.payload}`)
                
                res = await fetch(`${appConstants.serverUrl}/api/dir/${action.payload}`)
                
                if (res.status !== 200) {
                    cDisptatch({ type: "move", payload: "/"})
                    return dispatch({ type: "setError", payload: (await res.json()).error })
                }
                resData = await res.json()
           
                //@ts-ignore
                dispatch({ ...action, payload: {currentFolder: action.payload, folderContent: resData.data}})
                break

            case "createDir":
                const dirName = splitPath(action.payload).pop()
                
                dispatch({ type: "setLoading"})
                res = await fetch(`${appConstants.serverUrl}/api/dir/`, {
                    method: "POST",
                    body: JSON.stringify({ pathName: action.payload})
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).error.server })
                resData = await res.json()
                //@ts-ignore
                dispatch({ type: "createDir", payload: dirName})
                break
            case "sendFile":
                // dispatch({ type: "setLoading"})
                const { files, folder } = action.payload

                const myUploadProgress = (myFileName: string) => (progress: any) => {
                    
                    dispatch({ type: "uploadingProgress", payload: { file: myFileName, total: progress.total, loaded: progress.loaded}})
                }

            
                // tracking upload progress for multiple files
                for (let i=0; i<files.length; i++) { 
                  
                    const formData = new FormData()
                    formData.append(`File0`, files[i])
                    
                    // ___ adding information about current folder ___
                    formData.append('jsondata', JSON.stringify({ folder }))
                    
                    let config = {
                        onUploadProgress: myUploadProgress(files[i].name)
                    };
                    // dispatch({ type: "uploadingProgress", payload: { file: files[i].name, total: files[i].size, loaded: 0 }})
                    res = await axios.post(`${appConstants.serverUrl}/api/file`, formData, config)

                    if (res.status !== 200) return dispatch({ type: "setError", payload:  res.data.message })
                    resData = res.data
                    dispatch({ type: "uploadFiles", payload: resData.data })
                }
                break
            case "rename":
                dispatch({ type: "setLoading" })
                let { name, newName, currentLocation } = action.payload
                res = await fetch(`${appConstants.serverUrl}/api/file/${name}`, {
                    method: "PATCH",
                    body: JSON.stringify({ newName, currentLocation }),
                })

                
                resData = await res.json()
                
                dispatch({ type: "rename", payload: { name: resData.data.name, newName: resData.data.newName, currentLocation: resData.data.currentLocation }})
                break
            case "delete":
                dispatch({ type: "setLoading" })
                 target = action.payload.target
                 res = await fetch(`${appConstants.serverUrl}/api/file/${target}`, {
                     method: "DELETE",
                })
                  

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message })
                resData = await res.json()
             
                dispatch({ type: "delete", payload: { target: resData.data }})
                break
            case "informations":
                dispatch({ type: "setLoading" })
                target = action.payload.target
        

                res = await fetch(`${appConstants.serverUrl}/api/file/${target}/informations`, {
                    method: "GET"
                })
                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message })
                resData = await res.json()
          
                dispatch({ type: "informations", payload: resData.data})
                break
            case "clear additional data":
                dispatch({ type: "clear additional data"})
                break
            case "add to favourites":
                dispatch({ type: "setLoading" })
            

                res = await fetch(`${appConstants.serverUrl}/api/file/favourites`, {
                    method: "POST",
                    body: JSON.stringify({ fileName: action.payload.fileName, path: action.payload.path, type: action.payload.type })
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message })
                resData = await res.json()
               
                dispatch({ type: "add to favourites", payload: resData.data})
                break
            case "remove from favourites":
                dispatch({ type: "setLoading" })
              

                res = await fetch(`${appConstants.serverUrl}/api/file/favourites/remove`, {
                    method: "POST",
                    body: JSON.stringify({ fileName: action.payload.fileName, path: action.payload.path })
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message })
                resData = await res.json()
               
                dispatch({ type: "remove from favourites", payload: resData.data})
                break
            case "get favourites":
                res = await fetch(`${appConstants.serverUrl}/api/file/favourites`, {
                    method: "GET",
                })

                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message })
                resData = await res.json()
            
                dispatch({ type: "get favourites", payload: resData.data })
                break
            case "get shared":
                res = await fetch(`${appConstants.serverUrl}/api/file/share`)
                if (res.status !== 200) return dispatch({ type: "setError", payload: (await res.json()).message})
                resData = await res.json() as ResponseT<Omit<ShareT, "user userId">[]>

                dispatch({ type: "get shared", payload: resData.data})
                break

            

        }
    
}
    const customDispatch = useCallback(cDisptatch, [])
    async function getUserData() {
        userDispatch(setLoading())
        const res = await fetch(`${appConstants.serverUrl}/api/user/verify`, { method: "POST"})
        const resData = await res.json() as Omit<userInitialType, "loading">
        if (res.status !== 200)return userDispatch(setError(resData.error))
        userDispatch(setUser(resData))
        userDispatch(resetLoadingData())
    }

    useEffect(() => {
        if (queryProps?.search === "shared") {
            customDispatch({ type: "get shared", payload: []})
            return
        }
        if (queryProps?.search === "favourites") {
            customDispatch({ type: "get favourites", payload: [] })
            return
        }
        if (!queryProps?.path) {
            customDispatch({ type: "move", payload: "/"})
        } else {
            let url = getModifiedPath(queryProps.path)
         
            customDispatch({ type: "move", payload: url})
        }
        getUserData()
    }, [queryProps?.search, queryProps?.path])

    return { data: state, dispatch: customDispatch }
}