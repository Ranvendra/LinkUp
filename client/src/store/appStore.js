import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionRequestReducer from "./connectionRequestSlice";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connectionRequests: connectionRequestReducer,
    },
});

export default appStore;
