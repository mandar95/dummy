import { createSlice } from "@reduxjs/toolkit";
import {
  getWidget, getUtilization, getEmployeeWidget, widgetFlexSummary,
  wellnessData, getEmployers, getEmployerFlexDetails, getEmployerFlexWidget, downloadExcel
} from "./serviceApi";
import swal from "sweetalert";
import { serializeError } from 'utils';

export const flexbenefitBroker = createSlice({
  name: "flexbenefitBroker",
  initialState: {
    getWidgetDataResponse: {},
    getUtilizationDataResponse: {},
    getEmployeeWidgetDataResponse: {},
    getWidgetFlexSummaryResponse: {},
    getWellnessDataResponse: {},
    selectedEmployer: "",
    EmployerFlexWidget: {},
    EmployerFlexBenefit: [],
    Employers: [],
    filterByEmployer: false,
    loading: false,
    getDownloadExcelData: null
  },

  //reducers
  reducers: {
    getWidgetDetails: (state, action) => {
      state.getWidgetDataResponse = action.payload;
    },
    getUtilizationDetails: (state, action) => {
      state.getUtilizationDataResponse = action.payload;
    },
    getEmployeeWidgetDetails: (state, action) => {
      state.getEmployeeWidgetDataResponse = action.payload;
    },
    getWidgetFlexSummaryDetails: (state, action) => {
      state.getWidgetFlexSummaryResponse = action.payload;
    },
    getWellnessDataDetails: (state, action) => {
      state.getWellnessDataResponse = action.payload;
    },
    selectedEmployer: (state, action) => {
      state.selectedEmployer = action.payload;
    },
    getAllEmployers: (state, action) => {
      state.Employers = action.payload;
    },
    getSelectedEmployerFlexBenefit: (state, action) => {
      state.filterByEmployer = true;
      state.EmployerFlexBenefit = action.payload;
    },
    getSelectedEmployerWidget: (state, action) => {
      state.filterByEmployer = true;
      state.EmployerFlexWidget = action.payload;
    },
    resetFilter: (state, action) => {
      state.selectedEmployer = "";
      state.EmployerFlexBenefit = [];
      state.filterByEmployer = false;
    },
    loading: (state, action) => {
      state.loading = true;
    },
    unloading: (state, action) => {
      state.loading = false;
    },
    getDownloadExcelData: (state, action) => {
      state.getDownloadExcelData = action.payload;
    },
    cleardownload: (state) => {
      state.getDownloadExcelData = null;
    },

  },
});

export const { getWidgetDetails,
  getUtilizationDetails,
  getEmployeeWidgetDetails,
  getWidgetFlexSummaryDetails,
  getWellnessDataDetails,
  selectedEmployer,
  getSelectedEmployerFlexBenefit,
  getSelectedEmployerWidget,
  getAllEmployers, resetFilter, loading, unloading, getDownloadExcelData, cleardownload } = flexbenefitBroker.actions;

//Action Creators
export const getWidgetData = (data) => {
  return async (dispatch) => {
    const getWidgetDataResponse = await getWidget(data);

    if (getWidgetDataResponse.data) {
      dispatch(getWidgetDetails(getWidgetDataResponse));
    } else {
    }
  };
};

export const getUtilizationData = (data) => {
  return async (dispatch) => {
    const getUtilizationDataResponse = await getUtilization(data);

    if (getUtilizationDataResponse.data) {
      dispatch(getUtilizationDetails(getUtilizationDataResponse));
    } else {
    }
  };
};

export const getEmployeeWidgetData = () => {
  return async dispatch => {
    const getEmployeeWidgetDataResponse = await getEmployeeWidget();
    if (getEmployeeWidgetDataResponse.data.status) {
      dispatch(getEmployeeWidgetDetails(getEmployeeWidgetDataResponse.data.data))
    }
    else {

    }
  }
}

export const getWidgetFlexSummary = () => {
  return async dispatch => {
    const response = await widgetFlexSummary();
    if (response.data.status) {
      dispatch(getWidgetFlexSummaryDetails(response.data.data));
    }
    else {

    }
  }
}
export const getWellnessData = () => {
  return async dispatch => {
    const response = await wellnessData();
    if (response.data.status) {
      dispatch(getWellnessDataDetails(response.data.data));
    }
    else {

    }
  }
}

export const fetchEmployers = (id) => {
  return async dispatch => {
    const response = await getEmployers(id);
    if (response?.data?.status) {
      dispatch(getAllEmployers(response.data.data))
    }
    else {

    }
  }
}


export const selectEmployer = (data = null) => {
  return async dispatch => {
    if (!!data) {
      dispatch(selectedEmployer(data));
    }
    dispatch(loading());
    let responses = await Promise.all([getEmployerFlexDetails({ employer_id: data.id }),
    getEmployerFlexWidget({ employer_id: data.id })]);
    if (responses[0]?.data?.status && responses[1]?.data?.status) {
      dispatch(getSelectedEmployerFlexBenefit(responses[0].data.data));
      dispatch(getSelectedEmployerWidget(responses[1].data.data));
    }
    else {

    }
  }
}

export const downloadExcelData = (payload) => {
  return async (dispatch) => {
    const { data, message, errors } = await downloadExcel(payload);
    if (data.status) {
      dispatch(getDownloadExcelData(data?.data));
    } else {
      swal("Alert", serializeError(message || errors), 'info');
    }
  };
}
export const cleardownloadResponse = () => {
  return dispatch => {
    dispatch(cleardownload());
  }
}

export const resetfilter = () => {
  return dispatch => {
    dispatch(loading());
    dispatch(resetFilter());
  }
}

export const disableloading = () => {
  return dispatch => {
    dispatch(unloading());
  }
}

//Selectors
export const selectWidgetResponse = (state) =>
  state?.flexbenefitBroker?.getWidgetDataResponse;
export const selectUtilizationResponse = (state) =>
  state?.flexbenefitBroker?.getUtilizationDataResponse;
export const selectEmployeeWidgetResponse = (state) =>
  state?.flexbenefitBroker?.getEmployeeWidgetDataResponse;
export const selectWidgetFlexSummaryResponse = (state) =>
  state?.flexbenefitBroker?.getWidgetFlexSummaryResponse;
export const selectWellnessDataResponse = (state) =>
  state?.flexbenefitBroker?.getWellnessDataResponse;
export const employers = (state) => state?.flexbenefitBroker?.Employers;
export const selectEmployerFB = (state) => state?.flexbenefitBroker?.EmployerFlexBenefit;
export const selectEmployerWidget = (state) => state?.flexbenefitBroker?.EmployerFlexWidget;
export const filterStatus = (state) => state?.flexbenefitBroker?.filterByEmployer;
export const loadingStatus = (state) => state?.flexbenefitBroker?.loading;

export default flexbenefitBroker.reducer;




