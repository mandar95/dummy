import { createSlice } from "@reduxjs/toolkit";
import { services } from "./serviceApi";
import { getFirstError, actionStructre } from "../../utils";

export const reportConfig = createSlice({
  name: "reportConfig",
  initialState: {
    loading: false,
    error: null,
    success: null,
    broker_list: [],
    employer_list: [],
    employee_list: [],
    response: {},
    colResp: {},
    alert: null,
    col_resp: {},
    fieldResp: {},
    createResp: {},
    templates: [],
    storedResp: {},
    report_merge: null,
    report_url: ''
  },

  //reducers
  reducers: {
    infoDetails: (state, action) => {
      state.response = action.payload;
    },
    clearTableResponse: (state, action) => {
      state.response = {};
    },
    colDetails: (state, action) => {
      state.colResp = action.payload;
    },
    clearColDetails: (state, action) => {
      state.colResp = {};
    },
    colResponse: (state, action) => {
      state.col_resp = action.payload;
    },
    clearcolResponse: (state, action) => {
      state.col_resp = {};
    },
    fieldResponse: (state, action) => {
      state.fieldResp = action.payload;
    },
    clearfieldResponse: (state, action) => {
      state.fieldResp = {};
    },
    createResponse: (state, action) => {
      state.createResp = action.payload;
    },
    clearCreatedResp: (state, action) => {
      state.createResp = {};
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
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
      let message = " ";
      if (typeof payload === "string") message = payload;
      else if (typeof payload === "object") {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }

      state.loading = null;
      state.error = message;
      state.success = null;
    },
    clear: (state) => {
      state.error = null;
      state.success = null;
    },
    clear_report_resp: (state) => {
      state.error = null;
      state.report_merge = null;
    },
    broker_list: (state, { payload }) => {
      state.broker_list = payload;
    },
    employer_list: (state, { payload }) => {
      state.employer_list = payload;
    },
    employee_list: (state, { payload }) => {
      state.employee_list = payload;
    },
    templates: (state, { payload }) => {
      state.templates = payload;
      state.loading = false;
    },
    storedResponse: (state, { payload }) => {
      state.storedResp = payload;
    },
    report_merge: (state, { payload }) => {
      state.report_merge = payload;
    },
    report_url: (state, { payload }) => {
      state.report_url = payload.url;
    }
  },
});

export const {
  infoDetails,
  clearTableResponse,
  alertMessage,
  clearAlertMessage,
  colDetails,
  clearColDetails,
  colResponse,
  createResponse,
  clearCreatedResp,
  fieldResponse,
  clearcolResponse,
  clearfieldResponse,
  loading,
  success,
  error,
  clear,
  broker_list,
  employer_list,
  employee_list,
  templates,
  storedResponse,
  report_merge,
  clear_report_resp,
  report_url
} = reportConfig.actions;

//action Creators

export const getInfo = (data) => {
  return async (dispatch) => {
    try {
      const response = await services.info(data);
      if (response?.data) {
        if (response?.data?.status) {
          dispatch(infoDetails(response));
        } else {
          let error =
            response?.data?.errors && getFirstError(response?.data?.errors);
          error = error
            ? error
            : response?.data?.message
              ? response?.data?.message
              : "Something went wrong";
          dispatch(alertMessage(error));
        }
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const getCol = (data) => {
  return async (dispatch) => {
    try {
      const colResp = await services.columns(data);
      if (colResp?.data) {
        if (colResp?.data?.status) {
          dispatch(colDetails(colResp));
        } else {
          let error =
            colResp?.data?.errors && getFirstError(colResp?.data?.errors);
          error = error
            ? error
            : colResp?.data?.message
              ? colResp?.data?.message
              : "Something went wrong";
          dispatch(alertMessage(error));
        }
      } else {
        let error =
          colResp?.data?.errors && getFirstError(colResp?.data?.errors);
        error = error
          ? error
          : colResp?.data?.message
            ? colResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postCol = (data) => {
  return async (dispatch) => {
    try {
      const createResp = await services.create(data);
      if (createResp?.data) {
        if (createResp?.data?.status) {
          dispatch(createResponse(createResp));
        } else {
          let error =
            createResp?.data?.errors && getFirstError(createResp?.data?.errors);
          error = error
            ? error
            : createResp?.data?.message
              ? createResp?.data?.message
              : "Something went wrong";
          dispatch(alertMessage(error));
        }
      } else {
        let error =
          createResp?.data?.errors && getFirstError(createResp?.data?.errors);
        error = error
          ? error
          : createResp?.data?.message
            ? createResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

//create report

// load Broker/Employer/Employee
// export const loadBroker = (type) => {
//   return async (dispatch) => {
//     try {
//       const { data } = await services.loadBroker(type);
//       if (data.data) {
//         switch (type) {
//           case "Employer":
//             dispatch(employer_list(data.data));
//             break;
//           case "Employee":
//             dispatch(employee_list(data.data));
//             break;
//           default:
//             dispatch(broker_list(data.data));
//         }
//       } else {
//         let error =
//           data?.errors && getFirstError(data?.errors);
//         error = error
//           ? error
//           : data?.message
//             ? data?.message
//             : "Something went wrong";
//         dispatch(alertMessage(error));
//       }
//     } catch (err) {
//       dispatch(alertMessage("Something went wrong"));
//     }
//   };
// };

// Create Communication
export const createCommunication = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await services.createCommunication(payload);
      if (data.status === true) {
        dispatch(success(data.message));
      } else {
        let error =
          data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

//load template

// load Templates
export const loadTemplate = (userType) => {
  return async dispatch => {
    try {
      const { data } = await services.loadTemplate(userType);
      if (data.data) {
        dispatch(templates(data.data));
      } else {
        let error =
          data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
};

//verify merge
export const verifyTableMerge = (id) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, report_merge, error, services.verifyMerge, id);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//loadTemplatesData
export const loadTemplatesData = (loadFlag = true, userType) => {
  return async (dispatch) => {
    try {
      loadFlag && dispatch(loading());
      actionStructre(dispatch, templates, error, services.loadTemplateData, userType);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//download template report
export const downloadReportTemplate = (id) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, report_url, error, services.downloadReportTemplate, id);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateTemplateStatus = (payload) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, success, error, services.updateTemplateStatus, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};


//reducer export
export default reportConfig.reducer;
