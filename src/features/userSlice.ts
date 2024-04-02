

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appConstants } from "../constants/appConstants";

// router
import Router from "next/router";



type userRegisterData = {
    name: string
    email: string
    password: string
}

type userLoginData = {
    email: string
    password: string
}
// actions
export const registerUser = createAsyncThunk(
    "user/register",
    async ({ name, email, password }: userRegisterData, { rejectWithValue }) => {
        try {
            const config = {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }
            //@ts-ignore
            const res = await fetch(`${appConstants.serverUrl}/api/user/register`, config)
  
            const resData = await res.json()

            if (resData.error) {
                return rejectWithValue(resData.error?.server)
            }
            return resData.user
        } catch (err) {
            return rejectWithValue("")
        }
    }
)

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }: userLoginData, { rejectWithValue }) => {
        try {
            const config = {
                method: "POST",
                body: JSON.stringify({ email, password }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            }
            //@ts-ignore
            const res = await fetch(`${appConstants.serverUrl}/api/user/login`, config)
            const resData = await res.json()

            if (resData.error?.password) return rejectWithValue(resData.error.password)
            else if (resData.error?.email) return rejectWithValue(resData.error.email)
            else if (resData.error?.server) return rejectWithValue(resData.error.server)

            return resData.user
        } catch (err) {
            return rejectWithValue("")
        }
    }
)

export type userInitialType = {
    id: string
    email: string
    name: string
    plan: string
    usedSpace: string
    createDate: string
    error: any
    loading: boolean
    success: boolean
}
const initialState: userInitialType = {
    id: "",
    email: "",
    name: "",
    plan: "",
    usedSpace: "",
    createDate: "",

    // fetch states
    error: "",
    loading: false,
    success: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetLoadingData: (state) => {
            state.loading = false
        },
        setLoading: (state) => {
            state.loading = true
        },
        setError: (state, action: { payload: string }) => {
            state.error = action.payload
        },

        resetError: (state) => {
            state.error = ""
            state.loading = false
            state.success = true
        },
        resetUser: (state) => {
            state = { ...initialState }
        },

        setUser: (state, action: { payload: Omit<userInitialType, "loading"> }) => {
            state.id = action.payload.id
            state.email = action.payload.email
            state.name = action.payload.name
            state.createDate = action.payload.createDate
            state.plan = action.payload.plan
            state.usedSpace = action.payload.usedSpace
            state.error = action.payload.error
            state.success = action.payload.success
        },
        logout: (state) => {
            (async () => {
                const res = await fetch(`${appConstants.serverUrl}/api/user/logout`, { method: "POST"})
                if (res.status !== 200) return
                Router.push("/login")
                window.location.reload()
            })()
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.success = false
            state.loading = true
            state.error = ""
        })

        builder.addCase(registerUser.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.id = payload.id
            state.name = payload.name
            state.email = payload.email
            state.plan = payload.plan
            state.usedSpace = payload.usedSpace
            Router.push("/")
        })

        builder.addCase(registerUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        builder.addCase(loginUser.pending, (state, action) => {
            state.success = false
            state.loading = true
            state.error = ""
        })

        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.id = payload.id
            state.name = payload.name
            state.email = payload.email
            state.plan = payload.plan
            state.usedSpace = payload.usedSpace
            Router.push("/")
        })

        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

    }
})

export const { resetLoadingData, logout, setError, setLoading, setUser, resetUser, resetError } = userSlice.actions

export default userSlice.reducer