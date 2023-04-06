import { createSlice } from "@reduxjs/toolkit";
import {
  getInsurerData,
  getPolicyTypeData,
  getPolicyNumberData,
  getPolicyDetailsData,
  getCdData,
  postCdBalanceData,
  getCdStatementFile,
} from "./serviceApi";
import { getFirstError } from "../../utils";
import { employeeCountwrtPremium } from "../CD_balance_broker/CDB.Slice";

export const cdBalance = createSlice({
  name: "cdBalance",
  initialState: {
    response: {},
    selectPolicyResponse: {},
    PolicyNumberResponse: {},
    PolicyDetailsResponse: {},
    CdUpdateResponse: {},
    CdBalanceResponse: {},
    CdStatementResponse: {},
    alert: null,
    updateAlert: null,
    success: null
  },

  //reducers
  reducers: {
    getInsurerId: (state, action) => {
      state.response = action.payload;
    },
    PolicyType: (state, action) => {
      state.selectPolicyResponse = action.payload;
    },
    PolicyNumber: (state, action) => {
      state.PolicyNumberResponse = action.payload;
    },
    PolicyDetails: (state, action) => {
      state.PolicyDetailsResponse = action.payload;
    },
    cdUpdateDetails: (state, action) => {
      state.CdUpdateResponse = action.payload;
    },
    getCdBalanceDetails: (state, action) => {
      state.CdBalanceResponse = action.payload;
    },
    getCdStatementDetails: (state, action) => {
      state.CdStatementResponse = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
    updateMessage: (state, action) => {
      state.updateAlert = action.payload;
    },
    clearUpdateMessage: (state, action) => {
      state.updateAlert = null;
    },
    successMessage: (state, action) => {
      state.success = action.payload;
    },
    clearSuccessMessage: (state, action) => {
      state.success = null;
    },
  },
});

export const {
  getInsurerId,
  PolicyType,
  PolicyNumber,
  PolicyDetails,
  cdUpdateDetails,
  getCdBalanceDetails,
  getCdStatementDetails,
  clearAlertMessage,
  alertMessage,
  updateMessage,
  clearUpdateMessage,
  successMessage,
  clearSuccessMessage
} = cdBalance.actions;

//Action Creators

export const getInsurerDetails = (data) => {
  return async (dispatch) => {
    const response = await getInsurerData(data);

    if (response.data) {
      dispatch(getInsurerId(response));
    } else {

    }
  };
};

export const getPolicyType = (data) => {
  return async (dispatch) => {
    const selectPolicyResponse = await getPolicyTypeData(data);

    if (selectPolicyResponse.data) {
      dispatch(PolicyType(selectPolicyResponse));
    } else {

    }
  };
};

export const getPolicyNumber = (data) => {
  return async (dispatch) => {
    const PolicyNumberResponse = await getPolicyNumberData(data);

    if (PolicyNumberResponse.data) {
      dispatch(PolicyNumber(PolicyNumberResponse));
    } else {

    }
  };
};

export const getPolicyDetails = (data) => {
  return async (dispatch) => {
    try {
      const PolicyDetailsResponse = await getPolicyDetailsData(data);

      if (PolicyDetailsResponse.data) {
        dispatch(PolicyDetails(PolicyDetailsResponse));
      } else {
        let error =
          PolicyDetailsResponse?.data?.errors &&
          getFirstError(PolicyDetailsResponse?.data?.errors);
        error = error
          ? error
          : PolicyDetailsResponse?.data?.message
            ? PolicyDetailsResponse?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error))
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"))
    }
  };
};

export const cdUpdate = (data) => {
  return async (dispatch) => {
    const CdUpdateResponse = await getCdData(data);

    if (CdUpdateResponse.data) {
      dispatch(cdUpdateDetails(CdUpdateResponse));
      if (CdUpdateResponse?.data?.status) {
        dispatch(updateMessage(CdUpdateResponse?.data?.message));
        dispatch(employeeCountwrtPremium({ policy_id: data.policy_id }));
      }
      else {
        let error =
          CdUpdateResponse?.data?.errors &&
          getFirstError(CdUpdateResponse?.data?.errors);
        error = error
          ? error
          : CdUpdateResponse?.data?.message
            ? CdUpdateResponse?.data?.message
            : "Something went wrong";
        dispatch(updateMessage(error));
      }
    } else {
      dispatch(updateMessage(CdUpdateResponse?.message || "Something went wrong"));
    }
  };
};

export const cdBalanceDetails = (data) => {
  return async (dispatch) => {
    const CdBalanceResponse = await postCdBalanceData(data);

    if (CdBalanceResponse?.data) {
      dispatch(getCdBalanceDetails(CdBalanceResponse));
    } else {

    }
  };
};

export const getCdStatement = (data) => {
  return async (dispatch) => {
    const CdStatementResponse = await getCdStatementFile(data);

    if (CdStatementResponse.data) {
      dispatch(getCdStatementDetails(CdStatementResponse));
    } else {

    }
  };
};

//Selectors
export const selectInsurerId = (state) => state?.cdBalance?.response;
export const selectCdStatement = (state) =>
  state?.cdBalance?.CdStatementResponse;
export const selectCdBalanceDetails = (state) =>
  state?.cdBalance?.CdBalanceResponse;
export const selectCdUpdateDetails = (state) =>
  state?.cdBalance?.CdUpdateResponse;
export const selectPolicyDetails = (state) =>
  state?.cdBalance?.PolicyDetailsResponse;
export const selectPolicyType = (state) =>
  state?.cdBalance?.selectPolicyResponse;
export const selectPolicyNumber = (state) =>
  state?.cdBalance?.PolicyNumberResponse;
export const selectAlert = (state) =>
  state?.cdBalance?.alert;
export const selectUpdateAlert = (state) =>
  state?.cdBalance?.updateAlert;

export default cdBalance.reducer;
