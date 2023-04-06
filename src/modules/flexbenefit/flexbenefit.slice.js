import { createSlice } from "@reduxjs/toolkit";
import {
  getWidget, getUtilization, getEmployeeWidget,
  widgetFlexSummary, wellnessData, getEmployers,
  getAllFlexBenefits, allocateFlexbenefitToEmployer,
  addBenefits, adminGetBroker, adminGetEmployer, getFlexPolicies,
  updateBenefits, deleteBenefit,
  saveFlexPolicy
} from "./serviceApi";
import service from './employee-flex/employee-flex-.service'
import { serializeError } from "utils";
import swal from "sweetalert";
import { employeeDashboard } from "../dashboard/Dashboard.slice";
// import SecureLS from "secure-ls";

// const ls = new SecureLS();

export const flexbenefit = createSlice({
  name: "flexbenefit",
  initialState: {
    loading: true,
    loadingW: true,
    error: null,
    success: null,
    getWidgetDataResponse: {},
    getUtilizationDataResponse: {},
    getEmployeeWidgetDataResponse: {},
    getWidgetFlexSummaryResponse: {},
    getWellnessDataResponse: {},
    getEmployersDataresponse: {},
    getFlexDataresponse: {},
    allocateFlexDataResp: {},
    addBenefitsDataResp: {},
    broker: [],
    FlexPolicies: [],
    plan_policies: []
  },

  //reducers
  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    loadingW: (state, { payload }) => {
      state.loadingW = payload;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.loadingW = null;
      state.error = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      state.loading = null;
      state.loadingW = null;
      state.error = serializeError(payload);
      state.success = null;
    },
    clear: (state) => {
      state.error = null;
      state.success = null;
    },
    getWidgetDetails: (state, action) => {
      state.getWidgetDataResponse = action.payload;
    },
    getUtilizationDetails: (state, action) => {
      state.getUtilizationDataResponse = action.payload;
    },
    getEmployeeWidgetDetails: (state, action) => {
      state.getEmployeeWidgetDataResponse = action.payload;
      state.loadingW = null;
    },
    getWidgetFlexSummaryDetails: (state, action) => {
      state.getWidgetFlexSummaryResponse = action.payload;
    },
    getWellnessDataDetails: (state, action) => {
      state.getWellnessDataResponse = action.payload;
    },
    getEmployersDetails: (state, action) => {
      state.getEmployersDataresponse = action.payload;
    },
    getFlexDetails: (state, action) => {
      state.getFlexDataresponse = action.payload;
      state.loading = false;
    },
    allocateFlexDetails: (state, action) => {
      state.allocateFlexDataResp = action.payload;
      state.loading = false;
    },
    addBenefitsDetails: (state, action) => {
      state.addBenefitsDataResp = action.payload;
      state.loading = false;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    FlexPolicies: (state, { payload }) => {
      state.FlexPolicies = payload;
      state.loading = false;
    },
    plan_policies:(state, { payload }) => {
      state.plan_policies = payload;
    },
  },
});

export const {
  getWidgetDetails, getUtilizationDetails,
  getEmployeeWidgetDetails, getWidgetFlexSummaryDetails,
  getWellnessDataDetails, getEmployersDetails, getFlexDetails,
  allocateFlexDetails, addBenefitsDetails, broker, success, error, FlexPolicies,
  loading, loadingW, clear, plan_policies
} = flexbenefit.actions;

//Action Creators
export const getWidgetData = (data) => {
  return async (dispatch) => {
    const getWidgetDataResponse = await getWidget(data);

    if (getWidgetDataResponse.data) {
      dispatch(getWidgetDetails(getWidgetDataResponse));
    } else {
      console.error("getWidget Api failed");
    }
  };
};

export const getUtilizationData = (data) => {
  return async (dispatch) => {
    const getUtilizationDataResponse = await getUtilization(data);

    if (getUtilizationDataResponse.data) {
      dispatch(getUtilizationDetails(getUtilizationDataResponse));
    } else {
      console.error("getUtilization Api failed");
    }
  };
};

export const getEmployeeWidgetData = () => {
  return async (dispatch) => {
    dispatch(loadingW(true))
    const getEmployeeWidgetDataResponse = await getEmployeeWidget();

    if (getEmployeeWidgetDataResponse?.data?.status) {
      dispatch(
        getEmployeeWidgetDetails(
          // abhi changes
          // [
          // ...getEmployeeWidgetDataResponse.data.data.filter(({ flexi_benefit_id }) => flexi_benefit_id === 35),
          // ...getEmployeeWidgetDataResponse.data.data.filter(({ flexi_benefit_id }) => flexi_benefit_id !== 35)
          // ]
          getEmployeeWidgetDataResponse.data.data
        )
      );
    } else {
      console.error("getEmployeeWidget Api failed");
    }
  };
};

export const getWidgetFlexSummary = () => {
  return async (dispatch) => {
    const response = await widgetFlexSummary();
    if (response?.data?.status) {
      dispatch(getWidgetFlexSummaryDetails(response?.data?.data));
    } else {
      console.error("widgetFlexSummary Api failed");
    }
  };
};

export const getWellnessData = () => {
  return async (dispatch) => {
    const response = await wellnessData();
    if (response?.data?.status) {
      dispatch(getWellnessDataDetails(response?.data?.data));
    } else {
      console.error("wellnessData Api failed");
    }
  };
};

// Flex-Config-------------------------------------------------

export const getEmployersData = (id) => {
  return async (dispatch) => {
    const getEmployersDataresponse = await getEmployers(id);
    if (getEmployersDataresponse?.data?.status) {
      dispatch(getEmployersDetails(getEmployersDataresponse));
    } else {
      console.error("getEmployers Api failed");
    }
  };
};

export const getFlexData = (data) => {
  return async (dispatch) => {
    dispatch(loading(true))
    const getFlexDataresponse = await getAllFlexBenefits(data);
    if (getFlexDataresponse?.data?.status) {
      dispatch(getFlexDetails(getFlexDataresponse));
    } else {
      console.error("getAllFlexBenefits Api failed");
    }
  };
};

export const allocateFlexData = (data) => {
  return async (dispatch) => {
    dispatch(loading(true));
    const allocateFlexDataResp = await allocateFlexbenefitToEmployer(data);
    if (allocateFlexDataResp?.data) {
      dispatch(allocateFlexDetails(allocateFlexDataResp));
    } else {
      console.error("allocateFlexbenefitToEmployer Api failed");
    }
  };
};

export const addBenefitsData = (data) => {
  return async (dispatch) => {
    dispatch(loading(true));
    const addBenefitsDataResp = await addBenefits(data);
    if (addBenefitsDataResp?.data) {
      dispatch(addBenefitsDetails(addBenefitsDataResp));
    } else {
      console.error("addBenefits Api failed");
    }
  };
};
export const updateBenefitsData = (payload, id) => {
  return async dispatch => {
    dispatch(loading(true));
    const addBenefitsDataResp = await updateBenefits(payload, id);
    if (addBenefitsDataResp?.data) {
      dispatch(addBenefitsDetails(addBenefitsDataResp));
    } else {
      console.error("updateBenefits Api failed");
    }
  };
}

export const deleteBenefitsData = (id) => {
  return async dispatch => {
    try {
      dispatch(loading(true));
      const { data, message, errors } = await deleteBenefit(id);
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

// Admin
export const loadBroker = () => {
  return async dispatch => {
    try {
      const { data } = await adminGetBroker();
      if (data.data) {
        dispatch(broker(data.data));
      } else {
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};

// Admin Get Employer

export const loadBrokerEmployer = (id) => {
  return async dispatch => {
    try {
      const data = await adminGetEmployer(id);
      if (data.data) {
        dispatch(getEmployersDetails(data));
      } else {
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};

const findClosestNumber = (arraySI, currentCover) => arraySI.reduce(function (prev, curr) {
  return (Math.abs(curr - currentCover) < Math.abs(prev - currentCover) ? curr : prev);
});


export const getFlexPolicy = () => {
  return async (dispatch) => {
    try {
      dispatch(loading(true))
      const { data } = await getFlexPolicies();
      if (data?.data) {
        const sortedData = data.data.map((elem) => {
          let current_cover = elem.current_cover;
          if (current_cover) {

            if (elem.flex_sum_insured_value?.length && elem.flex_sum_insured_value.indexOf(current_cover) === -1) {
              current_cover = findClosestNumber(elem.flex_sum_insured_value, current_cover)
            }
            if (elem.grade_suminsured?.length && elem.grade_suminsured.indexOf(current_cover) === -1) {
              current_cover = findClosestNumber(elem.grade_suminsured, current_cover)
            }
          }
          return { ...elem, current_cover }
        })
        dispatch(FlexPolicies(sortedData));
      } else {
        dispatch(loading(false))
      }
      // actionStructre(dispatch, FlexPolicies, error, getFlexPolicies, payload);
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
      dispatch(loading(false))
    }
  };
}

export const employeeFlexPolicies = () => {
  return async (dispatch) => {
    try {
      dispatch(loading(true))
      const { data } = await service.employeeFlexPolicies();
      if (data?.data) {
        dispatch(plan_policies(data?.data?.filter(({ flex_grades, employee_grade_id, enrollment_data }) => {

          if (flex_grades?.length && ((employee_grade_id && flex_grades.every(({ grade_id }) => employee_grade_id !== grade_id)) || !employee_grade_id)) {
            return false
          }
          if ([0, 2].includes(enrollment_data?.enrollement_status)) {
            return false
          }

          return true
        })));
      } else {
        dispatch(loading(false))
      }
    } catch (err) {
      console.error("Error", err);
      dispatch(loading(false))
    }
  };
}

export const submitFlexPolicy = (payload, currentUser) => {
  return async (dispatch) => {
    try {
      // let userType = ls.get('userType');
      dispatch(loading(true))
      const { data, message, errors } = await saveFlexPolicy(payload);
      if (data?.status) {
        swal('Success', message, 'success');
        dispatch(loading(false));
        // dispatch(getEmployeeDashboard({
        //   voluntary_cover: [],
        //   group_cover: [],
        //   userType
        // }))
        dispatch(employeeDashboard(currentUser));
        dispatch(getFlexPolicy());
      } else {
        swal("Alert", serializeError(message || errors), 'warning');
        dispatch(loading(false));
      }
    } catch (err) {
      console.error("Error", err);
      dispatch(loading(false))
    }
  };
}



//Selectors
export const selectWidgetResponse = (state) =>
  state?.flexbenefit?.getWidgetDataResponse;
export const selectUtilizationResponse = (state) =>
  state?.flexbenefit?.getUtilizationDataResponse;
export const selectEmployeeWidgetResponse = (state) =>
  state?.flexbenefit?.getEmployeeWidgetDataResponse;
export const selectWidgetFlexSummaryResponse = (state) =>
  state?.flexbenefit?.getWidgetFlexSummaryResponse;
export const selectWellnessDataResponse = (state) =>
  state?.flexbenefit?.getWellnessDataResponse;
export const selectEmployerDataresp = (state) =>
  state?.flexbenefit?.getEmployersDataresponse;
export const selectFlexresp = (state) =>
  state?.flexbenefit?.getFlexDataresponse;
export const selectAllocateFlex = (state) =>
  state?.flexbenefit?.allocateFlexDataResp;
export const selectAddBenefits = (state) =>
  state?.flexbenefit?.addBenefitsDataResp;

export default flexbenefit.reducer;
