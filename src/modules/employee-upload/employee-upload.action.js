import swal from 'sweetalert';
import service from './employee-upload.service';
import { DateFormate, downloadFile, serializeError } from "../../utils";

export const initialState = {
  loading: false,
  employers: [],
  details: [],
  uploadLoading: false
}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

export const loadEmployers = async (dispatch) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data } = await service.loadEmployers();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        employers: (data.data && data.data.map(item => (
          {
            id: item.id,
            label: item.name,
            value: item.id
          }
        ))) || [],
        loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const uploadEmployeeUpload = async (dispatch, payload, { set_employer_id, setFile }) => {
  try {
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        uploadLoading: true,
      }
    });
    const { data, message, errors } = await service.uploadEmployeeUpload(payload);
    if (data.status) {

      swal('Success', message, 'success').then(() => {
        set_employer_id(undefined)
        setFile([])
      });
      dispatch({ type: 'GENERIC_UPDATE', payload: { uploadLoading: false } });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { uploadLoading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { uploadLoading: false } });
  }
}

export const sampleEmployeeUpload = async (payload) => {
  try {
    const { data, message, errors } = await service.sampleEmployeeUpload(payload);
    data.data ? downloadFile(data.data) :
      swal("Alert", serializeError(message || errors), 'info');
  }
  catch (error) {
    console.error(error)
  }
}

export const loadErrorSheetAction = async (dispatch, payload) => {
  try {
    const { data } = await service.loadErrorSheet(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        details: (data.data && data.data.map(item => ({
          ...item,
          uploaded_at: DateFormate(item.uploaded_at, { type: 'withTime' })
        }))) || []
      }
    });
  }
  catch (error) {
    console.error(error)
  }
}
