import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        errors: []
    },
    reducers: {
        addError: (state, action) => {
            state.error.push(action.error);
        },
        removeError: (state, action) => {
            const errors = state.errors;
            state.errors = errors.filter(error => error.id !== action.id);
        }
    }
});

export const {
    addError,
    removeError
} = notificationsSlice.actions;

export default notificationsSlice.reducer;