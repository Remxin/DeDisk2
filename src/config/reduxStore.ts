import { configureStore } from "@reduxjs/toolkit"

// reducers
import userReducer, { userInitialType } from "../features/userSlice"

export type RootState = {
    user: userInitialType
}

const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export default store