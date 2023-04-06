import { createSlice } from "@reduxjs/toolkit";
import service from "./contact-config.service";
import { serializeError, actionStructre } from "utils";
import { LoadDetailUserWise } from './contact-config.helper'
export const ContactConfigSlice = createSlice({
    name: "ContactConfig",
    initialState: {
        loading: false,
        error: null,
        success: null,
        BrokerDetailsData: [],
        ContactDetailsUpdated: null
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
                case "ContactDetailsUpdated":
                    state.ContactDetailsUpdated = null;
                    break;
                default:
                    break;
            }
        },
        BrokerDetails: (state, { payload }) => {
            state.BrokerDetailsData = payload;
            state.loading = false;
        },
        ContactDetailsUpdated: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.ContactDetailsUpdated = payload;
        },
    },
});

export const {
    loading,
    success,
    error,
    clear,
    BrokerDetails,
    ContactDetailsUpdated
} = ContactConfigSlice.actions;

export const getContactDetails = (payload, obj) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, BrokerDetails, error, LoadDetailUserWise(obj.type, service), payload);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const updateBrokerDetails = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateBrokerDetails(payload);
            if (data.data || success) {
                dispatch(ContactDetailsUpdated(message || data.data));
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

export const updateICDetails = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateICDetails(payload);
            if (data.data || success) {
                dispatch(ContactDetailsUpdated(message || data.data));
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

export const updateEmployerDetails = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateEmployerDetails(payload);
            if (data.data || success) {
                dispatch(ContactDetailsUpdated(message || data.data));
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

export const updateTPADetails = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateTPADetails(payload);
            if (data.data || success) {
                dispatch(ContactDetailsUpdated(message || data.data));
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


export default ContactConfigSlice.reducer;
