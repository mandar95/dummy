import { createSlice } from "@reduxjs/toolkit";
import service from "./TATConfig.service.js";
import { serializeError, actionStructre } from "utils";

export const TATConfigSlice = createSlice({
    name: "TATConfig",
    initialState: {
        loading: false,
        error: null,
        success: null,
        AllTATQueryData: [],
        TATQueryUpdated: null
    },
    reducers: {
        loading: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        success: (state, { payload }) => {
            state.loading = null;
            state.pincodeLoading = null;
            state.error = null;
            state.success = payload;
        },
        error: (state, { payload }) => {
            state.loading = null;
            state.pincodeLoading = null;
            state.statecity = {};
            state.error = serializeError(payload);
            state.success = null;
            state.otpSuccess = null;
        },
        clear: (state, { payload }) => {
            state.error = null;
            state.success = null;
            switch (payload) {
                case "TATQuery":
                    state.TATQueryUpdated = null;
                    break;
                case "AllTATQuery":
                    state.AllTATQueryData = [];
                    break;
                default:
                    break;
            }
        },
        AllTATQuery: (state, { payload }) => {
            state.AllTATQueryData = payload;
            state.loading = false;
        },
        TATQueryUpdated: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.TATQueryUpdated = payload;
        },
    },
});

export const {
    loading,
    success,
    error,
    clear,
    AllTATQuery,
    TATQueryUpdated
} = TATConfigSlice.actions;

export const CreateTATQuery = (uploadData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.CreateTATQuery(uploadData);
            if (data.status) {
                dispatch(success(message));
            } else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const CreateBrokerTATQuery = (uploadData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.CreateBrokerTATQuery(uploadData);
            if (data.status) {
                dispatch(success(message));
            } else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const getAllTATQuery = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, AllTATQuery, error, service.getAllTATQuery, payload);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const getAllBrokerTATQuery = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, AllTATQuery, error, service.getAllBrokerTATQuery, payload);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const deleteTATQuery = (id) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, success, error, service.deleteTATQuery, id);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateTATQuery = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateTATQuery(
                payload
            );
            if (data.data || success) {
                dispatch(TATQueryUpdated(message || data.data));
            } else {
                dispatch(error(message || errors));
                console.error("Error", message || errors);
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};


export default TATConfigSlice.reducer;
