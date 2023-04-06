import { createSlice } from "@reduxjs/toolkit";
import { DateFormate } from "../../utils";
import { sendFile, sampleFile, getReport, GetErrorSheetData } from "./serviceApi";

export const allocate = createSlice({
  name: "allocate",
  initialState: {
    response: {},
    sampleFileResponse: {},
    sampleReportDataResponse: {},
    alert: null,
    ErrorSheetData: []
  },

  //reducers
  reducers: {
    fileDetails: (state, action) => {
      state.response = action.payload;
    },
    samplefileDetails: (state, action) => {
      state.sampleFileResponse = action.payload;
    },
    sampleReportDetails: (state, action) => {
      state.sampleReportDataResponse = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
    ErrorSheetData: (state, { payload }) => {
      state.ErrorSheetData = payload.map((elem) => ({
          ...elem,
          uploaded_at: DateFormate(elem.uploaded_at, { type: 'withTime' })
        }))
      state.loading = false
    },
  },
});

export const { sampleReportDetails, fileDetails, samplefileDetails, alertMessage, clearAlertMessage, ErrorSheetData } = allocate.actions;

//action Creators

export const sendFileData = (data) => {
  return async (dispatch) => {
    try {
      const response = await sendFile(data);
      if (response.data) {
        dispatch(fileDetails(response));
      } else {
        dispatch(alertMessage(response?.message || "Something went wrong"))
      }
    }
    catch (err) {
      dispatch(alertMessage("Something went wrong"))
    }
  };
};

export const sampleFileData = (id) => {
  return async (dispatch) => {
    try {
      const sampleFileResponse = await sampleFile(id);
      if (sampleFileResponse.data) {
        dispatch(samplefileDetails(sampleFileResponse));
      } else {
        dispatch(alertMessage(sampleFileResponse?.message || "Something went wrong"))
      }
    }
    catch (err) {
      dispatch(alertMessage("Something went wrong"))
    }
  };
};

export const sampleReportData = (data) => {
  return async (dispatch) => {
    try {
      const sampleReportDataResponse = await getReport(data);
      if (sampleReportDataResponse.data) {
        dispatch(sampleReportDetails(sampleReportDataResponse));
      } else {
        dispatch(alertMessage(sampleReportDataResponse?.message || "Something went wrong"))
      }
    }
    catch (err) {
      dispatch(alertMessage("Something went wrong"))
    }
  };
};

export const getErrorSheetData = (payload) => {
  return async (dispatch) => {
    try {
      // dispatch(loading());
      const { data, message, errors } = await GetErrorSheetData(payload);
      if (data.status) {
        dispatch(ErrorSheetData(data.data));
      }
      else {
        // dispatch(error(message || errors));
        console.error(message, errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// selectors
export const selectFileResponse = (state) => state?.allocate?.response;
export const selectSampleResponse = (state) =>
  state?.allocate?.sampleFileResponse;
export const selectReportResponse = (state) =>
  state?.allocate?.sampleReportDataResponse;
export const selectAlert = (state) =>
  state?.allocate?.alert;

//reducer export
export default allocate.reducer;
