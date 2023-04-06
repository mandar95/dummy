import { createSlice } from "@reduxjs/toolkit";
import { bankName, bankDetail, storeBankDetails, bankCity, bankBranch, cityIfscByBranch } from "./bankdetails.service";

export const bankDetails = createSlice({
  name: "bankDetails",
  initialState: {
  getbankNameResponse: {},
  getBankDetailsResponse: {},
  saveBankDetailsResponse: {},
  getBankCityResponse: {},
  getBankBranchResponse: {},
  getCityIfscByBranchResp: {}
  },

  //reducers
  reducers: {
    getBankNamesReducer: (state, action) => {
      state.getbankNameResponse = action.payload;
    },
    getBankDetailsReducer: (state, action) => {
      state.getBankDetailsResponse = action.payload;
    },
    storeBankDetailsReducer: (state, action) => {
      state.saveBankDetailsResponse = action.payload;
    },
    getBankCityDetails: (state, action) => {
      state.getBankCityResponse = action.payload;
    },
    getBankBranchDetails: (state, action) => {
      state.getBankBranchResponse = action.payload;
    },
    getcityIfscByBranchDetails: (state, action) => {
      state.getCityIfscByBranchResp = action.payload;
    },
  },
});

export const {
  getBankNamesReducer, getBankDetailsReducer,storeBankDetailsReducer,
  getBankCityDetails, getBankBranchDetails, getcityIfscByBranchDetails
              } = bankDetails.actions;


//Action Creator
export const getbankName = () => {
  return async (dispatch) => {
    const getbankNameResponse = await bankName();
    if (getbankNameResponse?.data) {
      dispatch(getBankNamesReducer(getbankNameResponse));
    } else {
      console.error("bankName API failed");
    }
  };
};

export const getBankDetails = () => {
  return async (dispatch) => {
    const getBankDetailsResponse = await bankDetail();
    if (getBankDetailsResponse?.data) {
      dispatch(getBankDetailsReducer(getBankDetailsResponse));
    } else {
      console.error("BankDetails API failed");
    }
  };
};

export const saveBankDetails = (data) => {
  return async (dispatch) => {
    const saveBankDetailsResponse = await storeBankDetails(data);
    if (saveBankDetailsResponse?.data) {
      dispatch(storeBankDetailsReducer(saveBankDetailsResponse));
    } else {
      console.error("storeBankDetails API failed");
    }
  };
};

export const getBankCity = (data) => {
  return async (dispatch) => {
    const getBankCityResponse = await bankCity(data);
    if (getBankCityResponse?.data) {
      dispatch(getBankCityDetails(getBankCityResponse));
    } else {
      console.error("bankCity API failed");
    }
  };
};

export const getBankBranch = (data) => {
  return async (dispatch) => {
    const getBankBranchResponse = await bankBranch(data);
    if (getBankBranchResponse?.data) {
      dispatch(getBankBranchDetails(getBankBranchResponse));
    } else {
      console.error("bankBranch API failed");
    }
  };
};

export const getCityIfscByBranch = (data) => {
  return async (dispatch) => {
    const getCityIfscByBranchResp = await cityIfscByBranch(data);
    if (getCityIfscByBranchResp?.data) {
      dispatch(getcityIfscByBranchDetails(getCityIfscByBranchResp));
    } else {
      console.error("cityIfscByBranch API failed");
    }
  };
};


//Selectors
export const selectbankName = (state) =>
  state.bankDetails?.getbankNameResponse;
export const selectBankDetails = (state) =>
  state.bankDetails?.getBankDetailsResponse;
export const selectStoredBankDetails = (state) =>
  state.bankDetails?.saveBankDetailsResponse;
export const selectBankCity = (state) =>
  state.bankDetails?.getBankCityResponse;
export const selectBankBranch = (state) =>
  state.bankDetails?.getBankBranchResponse;
export const selectCityIfscByBranch = (state) =>
  state.bankDetails?.getCityIfscByBranchResp;
export default bankDetails.reducer;
