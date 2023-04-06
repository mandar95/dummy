import { createSlice } from "@reduxjs/toolkit";
import service from "./customerProfile.service";
import { serializeError, actionStructre } from "utils";

export const customerProfileSlice = createSlice({
    name: "customerprofile",
    initialState: {
        loading: false,
        error: null,
        success: null,
        editCustomerProfileData: {},
        editMemberData: {},
        memberUpdate: null
    },
    reducers: {
        loading: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        success: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.success = payload;
        },
        error: (state, { payload }) => {
            state.loading = null;
            state.error = serializeError(payload);
            state.success = null;
        },
        clear: (state, { payload }) => {
            state.error = null;
            state.success = null;
            switch (payload) {
                case "member-detail":
                    state.memberUpdate = null;
                    break;
                default:
                    break;
            }
        },
        customerProfile: (state, { payload }) => {
            state.editCustomerProfileData = payload;
            state.loading = null;
        },
        editMemberDetail: (state, { payload }) => {
            state.editMemberData = payload;
        },
        updateMember: (state, { payload }) => {
            state.memberUpdate = payload;
        },
    },
});

export const {
    loading,
    success,
    error,
    clear,
    customerProfile,
    editMemberDetail,
    updateMember
} = customerProfileSlice.actions;

// Action creator

export const getCustomerProfileData = () => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, customerProfile, error, service.getCustomerProfileData);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateCustomerProfile = (uploadData) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, message, errors } = await service.updateCustomerProfile(uploadData);
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

export const CreateMemberDetails = (uploadData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.CreateMemberDetails(uploadData);
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

export const editMemberDetails = (data) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, editMemberDetail, error, service.editMemberDetails, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const deleteMemberDetails = (id) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, success, error, service.deleteMemberDetails, id);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateMemberDetails = (id, payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateMemberDetails(
                id,
                payload
            );
            if (data.data || success) {
                dispatch(updateMember(message || data.data));
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

export default customerProfileSlice.reducer;
