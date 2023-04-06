import { createSlice } from "@reduxjs/toolkit";
import { getBrokerHome } from "../serviceApi";

export const brokerHomeSlice = createSlice({
  name: "broker_home",
  initialState: {
    loading: false,
    error: null,
    success: null,
    page: {}
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
    clear: (state) => {
      state.error = null;
      state.success = null;
    },
    page: (state, { payload }) => {
      state.loading = null;
      state.page = payload;
    }
  }
});

export const {
  loading, success, error,
  clear, page
} = brokerHomeSlice.actions;


//---------- Action creators ----------//

// Get Broker Home Detail

export const loadBrokerHome = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getBrokerHome(payload);
      if (data.data) {
        dispatch(page(data.data[0] || {}));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
};

export default brokerHomeSlice.reducer;
