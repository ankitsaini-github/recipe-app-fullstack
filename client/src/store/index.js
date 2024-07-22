import authSlice from './authReducer'
import { configureStore } from "@reduxjs/toolkit";

const store=configureStore({
    reducer:{
        auth:authSlice,
    }
})

export default store;