import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopUp } from "./popUpSlice";

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading : false,
    },
    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true;
        },
        fetchAllUsersSuccess(state, action){
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed(state) {
            state.loading = false;
        },

        addnewAdminRequest(state) {
            state.loading = true;
        },
        addnewAdminSuccess(state) {
            state.loading = false;
        },
        addnewAdminFailed(state) {
            state.loading = false;
        },
    }
});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());

    try {
        const res = await api.get("/user/all");

        dispatch(
            userSlice.actions.fetchAllUsersSuccess(res.data.users)
        );
    } catch (err) {
        dispatch(
            userSlice.actions.fetchAllUsersFailed(
                err.response?.data?.message || err.message
            )
        );
        toast.error(err.response?.data?.message || err.message);
    }
};

export const addnewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addnewAdminRequest());

    try {
        const res = await api.post(
            "/user/add/new-admin",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        dispatch(userSlice.actions.addnewAdminSuccess());

        // 🔥 FIX: refresh users after adding admin
        dispatch(fetchAllUsers());

        toast.success(res.data.message);
        dispatch(toggleAddNewAdminPopUp());

    } catch (err) {
        dispatch(userSlice.actions.addnewAdminFailed());
        toast.error(err.response?.data?.message || err.message);
    }
};

export default userSlice.reducer;