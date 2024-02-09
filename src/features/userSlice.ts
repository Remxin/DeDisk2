

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
        resetLoadingData: (state, action) => {
            state.error = ""
            state.success = false
            state.loading = false
        },
        logout: (state) => {
            (async () => {
                const res = await fetch(`${appConstants.serverUrl}/api/user/logout`, { method: "POST"})
                if (res.status !== 200) return
                state = initialState
                Router.push("/login")
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
            console.log(payload)
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

export const { resetLoadingData, logout } = userSlice.actions

export default userSlice.reducer