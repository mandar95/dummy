import { createSlice } from "@reduxjs/toolkit";
import { info, email, aboutUs, demo, userTypeInput, userTypeUpdate } from "./serviceApi";
import { getFirstError } from "../../utils";

export const employerHome = createSlice({
  name: "employerHome",
  initialState: {
    response: {},
    emailResp: {},
    aboutUsResp: {},
    demoResp: {},
    alert: null,
    error: null,
    success: null,
    loading: false,
    employerData: [],
    brokerData: []

  },

  //reducers
  reducers: {
    infoDetails: (state, action) => {
      state.response = action.payload;
    },
    emailDetails: (state, action) => {
      state.emailResp = action.payload;
    },
    clearEmailDetails: (state) => {
      state.emailResp = {};
    },
    aboutUsDetails: (state, action) => {
      state.aboutUsResp = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
    demoMessage: (state, { payload }) => {
      state.demoResp = payload;
    },
    clearDemoMessage: (state, { payload }) => {
      state.demoResp = null;
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
          message = `${message} ${payload[property][0]}`;
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
    loading: (state) => {
      state.loading = true;
    },
    employerData: (state, { payload }) => {
      state.employerData = [...payload];
      state.loading = null;
    },
    brokerData: (state, { payload }) => {
      state.brokerData = [...payload];
      state.loading = null;
    }
  },
});

export const {
  infoDetails,
  emailDetails,
  aboutUsDetails,
  alertMessage,
  clearAlertMessage,
  clearEmailDetails,
  demoMessage,
  clearDemoMessage,
  success,
  error,
  clear,
  employerData,
  brokerData,
  loading
} = employerHome.actions;

//action Creators

export const getInfo = (data) => {
  return async (dispatch) => {
    try {
      const response = await info(data);
      if (response?.data) {
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
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const getEmail = (data) => {
  return async (dispatch) => {
    try {
      const emailResp = await email(data);
      if (emailResp?.data) {
        dispatch(emailDetails(emailResp));
      } else {
        let error =
          emailResp?.data?.errors && getFirstError(emailResp?.data?.errors);
        error = error
          ? error
          : emailResp?.data?.message
            ? emailResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const getaboutUs = (data) => {
  return async (dispatch) => {
    try {
      const aboutUsResp = await aboutUs(data);
      if (aboutUsResp?.data) {
        dispatch(aboutUsDetails(aboutUsResp));
      } else {
        let error =
          aboutUsResp?.data?.errors && getFirstError(aboutUsResp?.data?.errors);
        error = error
          ? error
          : aboutUsResp?.data?.message
            ? aboutUsResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const getdemo = (data) => {
  return async (dispatch) => {
    try {
      const demoResp = await demo(data);
      if (demoResp?.data) {
        dispatch(demoMessage(demoResp));
      } else {
        let error =
          demoResp?.data?.errors && getFirstError(demoResp?.data?.errors);
        error = error
          ? error
          : demoResp?.data?.message
            ? demoResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const sendBrokerInput = (payload) => {
  // return async dispatch => {
  //   try {
  //     dispatch(loading());
  //     const { success: status, errors, message } = await service.getSelectedPlan(payload);
  //     if (status) {
  //       dispatch(success(true));
  //     } else {
  //       if (message || errors)
  //         dispatch(error(message || errors));
  //     }
  //   } catch (err) {
  //     dispatch(error("Something went wrong"));
  //   }
  // }
};

export const sendEmployerInput = (payload) => {
  // return async dispatch => {
  //   try {
  //     dispatch(loading());
  //     const { success: status, errors, message } = await service.getSelectedPlan(payload);
  //     if (status) {
  //       dispatch(success(true));
  //     } else {
  //       if (message || errors)
  //         dispatch(error(message || errors));
  //     }
  //   } catch (err) {
  //     dispatch(error("Something went wrong"));
  //   }
  // }
};

export const getEmployerInput = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { success: status, errors, message, data } = await userTypeInput(id);
      if (status && data?.data?.length) {
        dispatch(employerData(data.data));
      } else {
        if (message || errors)
          dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
export const getBrokerInput = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { success: status, errors, message, data } = await userTypeInput(id);
      if (status && data?.data?.length) {
        dispatch(brokerData(data.data));
      } else {
        if (message || errors)
          dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}

export const updateBrokerInput = (brokerData, id) => {
  return async dispatch => {
    try {
      // dispatch(loading());
      const { success: status, message, errors } = await userTypeUpdate(brokerData, id);
      if (status) {
        dispatch(success({ status, message }));
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}

export const updateBrokerData = (data) => {
  return async (dispatch, getState) => {
    const stateData = getState();
    const brokerState = stateData.employerHome.brokerData[0];

    let Data1 = brokerState.benefits.map((item, i) => {
      return {
        ...item,
        description: data.benefits[i].benefits_description,
        title: data.benefits[i].benefits_title,
        url: data.benefits[i].benefits_url,
        id: data.benefits[i].benefits_id
      }
    })
    let Data2 = brokerState.customer_service.map((item, i) => {
      return {
        ...item,
        description: data.customer_service[i].customer_service_description,
        title: data.customer_service[i].customer_service_title,
        id: data.customer_service[i].customer_service_id
      }
    })
    let Data3 = brokerState.stepers.map((item, i) => {
      return {
        ...item,
        description: data.stepers[i].steper_description,
        title: data.stepers[i].steper_title,
        id: data.stepers[i].steper_id
      }
    })
    let finalData = [{
      ...brokerState,
      benefits: [...Data1],
      customer_service: [...Data2],
      stepers: [...Data3],
    }]
    dispatch(brokerData(finalData));
  }
}

export const updateEmployerInput = (employerData, id) => {
  return async dispatch => {
    try {
      // dispatch(loading());
      const { success: status, message, errors } = await userTypeUpdate(employerData, id);
      if (status) {
        dispatch(success({ status, message }));
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}

export const updateEmployerData = (data) => {
  return async (dispatch, getState) => {
    const stateData = getState();
    const employerState = stateData.employerHome.employerData[0];

    let Data1 = employerState.benefit_features.map((item, i) => {
      return data.benefits[i].benefit_features
    })

    let Data2 = employerState.stepers.map((item, i) => {
      return {
        ...item,
        description: data.stepers[i].steper_description,
        title: data.stepers[i].steper_title,
        id: data.stepers[i].steper_id
      }
    })
    let finalData = [{
      ...employerState,
      benefit_features: [...Data1],
      stepers: [...Data2],
      benefit_id: data.benefit_id,
      benefit_tagline: data.benefit_tagline,
      benefit_title: data.benefit_title,
      app_url: data.benefit_app_url
    }]
    dispatch(employerData(finalData));
  }
}

//reducer export
export default employerHome.reducer;
