import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployerNameData,
  getPolicySubtype,
  getEmployee,
  getMembers,
  getCard,
  adminGetBroker,
  PostECardDataTPA,
  getEmployPolicies
} from "./serviceApi";

import { serializeError } from "../../utils";
import swal from "sweetalert";
import { getEmployDashboard } from "../dashboard/Dashboard.service";

export const eCard = createSlice({
  name: "brokerEnrollmentReport",
  initialState: {
    getEmployerIdDataResponse: [],
    getPolicySubtypeDataResponse: {},
    getEmployeeDataResponse: {},
    getMemberDataResponse: {},
    getCardDataResponse: {},
    broker: [],
    error: null,
    success: null,
    loading: false,
    ErrorMessage: null,
    lastPage: 1,
    firstPage: 1,
  },

  //reducers
  reducers: {
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    getEmployerNameDetails: (state, { payload }) => {
      state.getEmployerIdDataResponse = payload.isNew ? payload.data : [...state.getEmployerIdDataResponse, ...payload.data];
    },
    getPolicySubTypeDetails: (state, action) => {
      state.getPolicySubtypeDataResponse = action.payload;
    },
    getEmployeeDataDetails: (state, action) => {
      state.getEmployeeDataResponse = action.payload;
    },
    getMemberDataDetails: (state, action) => {
      state.getMemberDataResponse = action.payload;
    },
    clearMemberDataDetail: (state) => {
      state.getMemberDataResponse = {}
    },
    getCardDetails: (state, action) => {
      state.getCardDataResponse = action.payload;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      state.loading = false;
      state.error = serializeError(payload);
      state.success = null;
    },
    ErrorMessage: (state, { payload }) => {
      state.loading = false;
      state.ErrorMessage = serializeError(payload);
      state.success = null;
    },
    clear: (state, { payload }) => {
      state.error = null;
      state.success = null;
      state.ErrorMessage = null;
      switch (payload) {
        case 'broker':
          state.getEmployerIdDataResponse = [];
          state.getPolicySubtypeDataResponse = {};
          state.getEmployeeDataResponse = {};
          state.getMemberDataResponse = {};
          state.getCardDataResponse = {};
          break
        case 'employer':
          state.getPolicySubtypeDataResponse = {};
          state.getEmployeeDataResponse = {};
          state.getMemberDataResponse = {};
          state.getCardDataResponse = {};
          break
        case 'policy-type':
          state.getEmployeeDataResponse = {};
          state.getMemberDataResponse = {};
          state.getCardDataResponse = {};
          break
        case 'employee':
          state.getMemberDataResponse = {};
          break
        default:
      }
    },
    setPageData: (state, { payload }) => {
      state.firstPage = payload.firstPage;
      state.lastPage = payload.lastPage;
    },
  },
});

export const {
  getEmployerNameDetails,
  getPolicySubTypeDetails,
  getEmployeeDataDetails,
  getMemberDataDetails,
  getCardDetails,
  broker,
  clearMemberDataDetail,
  clear,
  success,
  error,
  loading,
  ErrorMessage,
  setPageData
} = eCard.actions;

//Action Creator

export const getEmployerName = (payload, pageNo, perPage) => {
  return async (dispatch) => {
    dispatch(loading(true))
    dispatch(clear('employer'))
    const { data, message, errors } = await getEmployerNameData(payload, pageNo, perPage);
    if (data.data) {
      dispatch(getEmployerNameDetails({ data: data?.data || [], isNew: !pageNo || pageNo === 1 }));
      dispatch(setPageData({
        firstPage: data.current_page + 1,
        lastPage: data.last_page,
      }))
      data.current_page === data.last_page && dispatch(loading(false))
    } else {
      dispatch(error(message || errors));
      console.error("Error", message || errors);
    }
  };
};

export const getPolicySubtypeData = (data, isEmployee) => {
  return async (dispatch) => {
    dispatch(clear('policy-type'))
    const getPolicySubtypeDataResponse = await (isEmployee ? getEmployDashboard : getPolicySubtype)(data);
    if (getPolicySubtypeDataResponse?.data) {
      dispatch(getPolicySubTypeDetails(getPolicySubtypeDataResponse));
    } else {
    }
  };
};

export const loadEmployeePolicies = () => {
  return async (dispatch) => {
    dispatch(clear('policy-type'))
    const getPolicySubtypeDataResponse = await getEmployPolicies();
    if (getPolicySubtypeDataResponse?.data) {
      dispatch(getPolicySubTypeDetails(getPolicySubtypeDataResponse));
    } else {
    }
  };
};



export const getEmployeeData = (data) => {
  return async (dispatch) => {
    dispatch(clear('employee'))
    const getEmployeeDataResponse = await getEmployee(data);
    if (getEmployeeDataResponse?.data) {
      dispatch(getEmployeeDataDetails(getEmployeeDataResponse));
    } else {
    }
  };
};

export const getMemberData = (data, show_alert) => {
  return async (dispatch) => {
    const getMemberDataResponse = await getMembers(data);
    if (getMemberDataResponse?.data?.data) {
      dispatch(getMemberDataDetails(getMemberDataResponse));
    } else {
      show_alert && swal("Alert", serializeError(getMemberDataResponse?.message || getMemberDataResponse?.errors), 'info')
    }
  };
};

export const getCardData = (data) => {
  return async (dispatch) => {
    const getCardDataResponse = await getCard(data);
    if (getCardDataResponse?.data) {
      dispatch(getCardDetails(getCardDataResponse));
    } else {
      console.error("CardData API failed");
    }
  };
};

// Admin Get Broker

export const loadBroker = (userType) => {
  return async dispatch => {
    try {
      dispatch(clear('broker'))
      const { data } = await adminGetBroker(userType);
      if (data.data) {
        dispatch(broker(data.data));
      } else {
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};

export const postECardDataTPA = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await PostECardDataTPA(payload);
      if (data.status) {
        if (data.errors) {
          dispatch(error(JSON.stringify(data.errors)));
        }
        else {
          dispatch(success(data.data || message));
        }
      } else {
        dispatch(ErrorMessage(message || errors));
        console.error("Error", message || errors);
      }
    } catch (error) {
      console.error(error)
    }
  };
};


//Selectors
export const selectMemberName = (state) => state.eCard?.getMemberDataResponse;
export const selectEmployeeName = (state) =>
  state.eCard?.getEmployeeDataResponse;
export const selectEmployerName = (state) =>
  state.eCard?.getEmployerIdDataResponse;
export const selectPolicyTypeData = (state) =>
  state.eCard?.getPolicySubtypeDataResponse;
export const selectCardData = (state) =>
  state.eCard?.getCardDataResponse;
export default eCard.reducer;
