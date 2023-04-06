import { createSlice } from "@reduxjs/toolkit";
import service from './healthService';
import { serializeError } from "utils";
import swal from "sweetalert";
import { DateFormate } from "../../utils";


const healthCheckupSlice = createSlice({
    name: "healthCheckup",
    initialState: {
        loading: false,
        error: null,
        success: null,
        healthCheckupData: [],
        healthCheckupMemberData: null,
        tempData: false,
    },
    reducers: {
        tempData: (state, { payload }) => {
            state.appointmentDateTime = true
        },
        loading: (state, { payload }) => {
            state.loading = true
        },
        success: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.success = payload;
        },
        error: (state, { payload }) => {
            let message = " "
            if (typeof payload === 'string')
                message = payload;
            else if (typeof payload === 'object') {
                for (const property in payload) {
                    message = `${message}
	  ${payload[property][0]}`;
                }
            }
            state.loading = null;
            state.error = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
            state.success = null;
        },
        clear: (state, { payload }) => {
            state.error = null;
            state.success = null;
            switch (payload) {
                case "healthCheckupMemberData":
                    state.healthCheckupMemberData = {};
                    break;
                default:
                    break;
            }
        },
        setHealthCheckupData: (state, { payload }) => {
            state.healthCheckupData = payload;
            state.loading = null;
        },
        setHealthCheckupMemberData: (state, { payload }) => {
            state.healthCheckupMemberData = payload;
            state.loading = null;
        },
    }
});

export const {
    success,
    error,
    clear,
    loading,
    setHealthCheckupData,
    setHealthCheckupMemberData,
    tempData
} = healthCheckupSlice.actions;

export default healthCheckupSlice.reducer;

// export const healthCheckup = state => state.healthCheckup;
// Action creators
export const createHealthCheckup = (payload) => {

    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, message, errors } = await service.createHealthCheckup(
                payload
            );
            if (data.status) {
                dispatch(success(message));
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

export const getHealthCheckup = payload => {
    return async dispatch => {
        try {
            if (payload.status !== "Processing") {
                dispatch(loading());
            }
            const { data, message, errors } = await service.getHealthCheckup({ user_type_name: payload?.user_type_name, });
            if (data.status) {
                dispatch(setHealthCheckupData(data.data));
            }
            else {
                if (message === "Data Not Found")
                    dispatch(setHealthCheckupData([]))
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    }
}

export const deleteHealthCheckup = (id) => {
    return async dispatch => {
        try {
            dispatch(loading());
            const { data, message, errors } = await service.deleteHealthCheckup(id);
            if (data.status) {
                dispatch(success(message));
            }
            else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    }
}


export const getHealthCheckupByMember = payload => {
    return async dispatch => {
        try {
            dispatch(loading());
            const { data } = await service.getHealthCheckupByMember(payload);
            if (data.status) {
                dispatch(setHealthCheckupMemberData(data.data));
            }
            else {
                // dispatch(error(message || errors));
                dispatch(setHealthCheckupMemberData({}));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    }
}
export async function Fetch(payload, setDownloadURL) {
    try {
        const { data } = await service.Fetch(payload)
        setDownloadURL((url) => data?.data?.url);
    } catch (err) {
        console.error(err.message);
    }
}
export async function ErrorSheetHandler(brokerid, setErrorSheetData, is_super_hr) {
    try {
        const { data } = await service.ErrorSheetHandler(brokerid, is_super_hr)
        if (data?.status) {
            setErrorSheetData(data.data.map((elem) => ({ ...elem, uploaded_at: DateFormate(elem.uploaded_at, { type: "withTime" }) })));
        } else {
            swal("warning", serializeError(data.message), "warning");
        }
    } catch (err) {
        console.error(err.message);
    }
}
