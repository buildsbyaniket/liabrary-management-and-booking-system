import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopUp: false,
        addBookPopUp: false,
        readBookPopUp: false,
        recordBookPopUp: false,
        returnBookPopUp: false,
        addNewAdminPopUp: false,
    },
    reducers: {
        toggleSettingPopUp(state) {
            state.settingPopUp = !state.settingPopUp;
        },
        toggleAddBookPopUp(state) {
            state.addBookPopUp = !state.addBookPopUp;
        },
        toggleReadBookPopUp(state) {
            state.readBookPopUp = !state.readBookPopUp;
        },
        toggleRecordBookPopUp(state) {
            state.recordBookPopUp = !state.recordBookPopUp;
        },
        toggleAddNewAdminPopUp(state) {
            state.addNewAdminPopUp = !state.addNewAdminPopUp;
        },
        toggleReturnBookPopUp(state) {
            state.returnBookPopUp = !state.returnBookPopUp;
        },
        closeAllPopUp(state) {
            state.addBookPopUp = false;
            state.addNewAdminPopUp = false;
            state.readBookPopUp = false;
            state.recordBookPopUp = false;
            state.returnBookPopUp = false;
            state.settingPopUp = false;
        }
    }
});

export const {
    closeAllPopUp,
    toggleAddBookPopUp,
    toggleAddNewAdminPopUp,
    toggleReadBookPopUp,
    toggleRecordBookPopUp,
    toggleReturnBookPopUp,
    toggleSettingPopUp,
} = popupSlice.actions;

export default popupSlice.reducer;