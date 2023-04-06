import swal from "sweetalert";
import { randomString, serializeError, DateFormate } from "utils"
import service from './qcr.service';

export const initialState = {
  loading: true,
  details: [],
  qcr_detail: {},
  audit_details: {},
  pdfResponse: null,
  insurer: []
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
      errors: serializeError(payload)
    }
    default: return state;
  }
}



export const loadQCRQuotes = async (dispatch, payload) => {
  try {
    const { data } = await service.loadQCRQuotes(payload);
    if (data.data) {
      payload?.quote_id ? dispatch({
        type: 'GENERIC_UPDATE', payload: {
          qcr_detail: data.data[0] || {},
          loading: false
        }
      }) : dispatch({
        type: 'GENERIC_UPDATE', payload: {
          details: data.data.map((elem) => ({ ...elem, created_at: DateFormate(elem.created_at) })) || [],
          loading: false
        }
      });
    }
    else {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const addQuote = async (dispatch, payload, history, userType) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.addQuote(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        history.push(`/${userType}/qcr-quote-detail`)
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const updateInsurerData = async (dispatch, payload, history, userType) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.updateInsurerData(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        history.replace(payload.type === 'updateversion' ? `/${userType}/qcr-quote-detail` : `/${userType}/qcr-quote-view/${randomString()}/${payload.quote_id}/${randomString()}`)
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const deleteQuoteSlip = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.deleteQuoteSlip(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        loadQCRQuotes(dispatch, { user_type_name: 'Broker' })
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const deleteInsurer = async (dispatch, insurer_id, quote_id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.deleteInsurer(insurer_id, quote_id);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        loadQCRQuotes(dispatch, { quote_id })
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const sendPlacementSlip = async (payload, onHide) => {
  try {
    const { data, message, errors } = await service.sendPlacementSlip(payload);
    if (data.status) {
      onHide();
      swal('Success', message, 'success')
    } else {
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
  }
}

export const sendQouteSlip = async (payload, onHide) => {
  try {
    const { data, message, errors } = await service.sendQouteSlip(payload);
    if (data.status) {
      onHide();
      swal('Success', message, 'success')
    } else {
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
  }
}

export const loadAuditData = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.loadAuditData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          audit_details: data.data || {},
          loading: false
        }
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const downloadQuoteSlipPDF = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.downloadQuoteSlipPDF(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          pdfResponse: data.data,
          loading: false
        }
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


export const buyQuote = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.buyQuote(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false
        }
      });
      swal('Success', message, 'success').then(() => {
        loadQCRQuotes(dispatch, { quote_id: payload.quote_id })
      });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadInsurer = async (dispatch) => {
  try {
    const { data } = await service.loadInsurer();
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          insurer: data.data || [],
          loading: false
        }
      });
    }
    else {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}
