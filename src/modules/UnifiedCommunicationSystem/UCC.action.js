import service from "./UCS.service";
import { serializeError } from "utils";
import swal from "sweetalert";
import { DateFormate, downloadFile } from "../../utils";
import { createCacheKeyComparator } from "reselect/es/defaultMemoize";

export const initialState = {
  loading: false,
  details: [],
  ucc_type: [],
  firstpage: 1,
  lastpage: 1,
}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ON_FETCH":
      return {
        ...state,
        loading: false,
        lastpage: payload.last_page,
        firstpage: payload.current_page + 1,
        details: [...state.details, ...(payload.data || [])],
      };
    case "SET_PAGE_DATA":
      return {
        ...state,
        firstpage: payload.current_page,
        lastpage: payload.last_page
      }
    case "UCC_TYPE":
      return {
        ...state,
        ucc_type: payload || [],
      };
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    case 'LOADING': return {
      ...state,
      loading: payload,
    }
    default: return state;
  }
}


export const FetchData = async (dispatch, pageNo, employer_id) => {
  try {
    (!pageNo || pageNo === 1) && dispatch({ type: 'LOADING', payload: true });
    //dispatch({ type: 'LOADING', payload: true });
    const { data } = await service.getEmailLogs(pageNo, employer_id);
    if (data.data) {
      dispatch({
        type: 'ON_FETCH', payload: {
          ...data,
          data: data.data.map(elem => ({ ...elem, created_at: DateFormate(elem.created_at, { type: "withTime" }) })) || [],
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadUCCType = async (dispatch) => {
  try {
    const { data } = await service.loadUCCType();
    if (data.data) {
      dispatch({
        type: 'UCC_TYPE', payload: data.data.map(({ email_type }) => ({
          label: email_type,
          id: email_type,
          value: email_type
        }))
      });
    }
  }
  catch (error) {
    console.error(error)
  }
}

export const ResendEmail = async (id) => {
  try {
    const { data, message, errors } = await service.resendEmail(id);
    if (data.status) {
      swal('Success', message, 'success')
    } else {
      swal("Alert", serializeError(message || errors), 'warning')
    }
  } catch (err) {
    console.error("Error", err);
  }
};

export const FetchTemplate = async (payload, setState, api) => {
  try {
    const { data } = await service.FetchTemplate(payload, api);
    setState(state => data);
  } catch (err) {
    console.error("Error", err);
  }
};

export const exportUCC = async (dispatch, payload, onHide) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.exportUCC(payload);
    if (data?.data?.download_report) {
      onHide();
      downloadFile(data?.data?.download_report);
      dispatch({ type: 'LOADING', payload: false });
    }
    else {
      swal("Alert", serializeError(message || errors), 'info');
      dispatch({ type: 'LOADING', payload: false });
    }
  }
  catch (error) {
    console.error(error);
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const setUCCPageData = async (dispatch, payload) => {
  try {
    dispatch({
      type: 'SET_PAGE_DATA',
      payload: {
        current_page: payload.current_page,
        last_page: payload.last_page
      }
    })
  }
  catch (err) {
    console.error("Error", err);
  }
}
