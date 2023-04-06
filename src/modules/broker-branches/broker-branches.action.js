import swal from 'sweetalert';
import { serializeError } from '../../utils'
import service from './broker-branches.service'

export const initialState = {
  loading: true,
  detail: []
}

export const reducer = (state, { type, payload }) => {

  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'LOADING': return {
      ...state,
      loading: payload || false,
    }
    default: return state;
  }
}


export const loadBrokerBranches = async (dispatch, broker_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data } = await service.loadBrokerBranches(broker_id);
    if (data.data.length) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          detail: data.data.map((elem, index) => ({ ...elem, index: index + 1 })) || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
      // swal('Alert', serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const createBrokerBranches = async (dispatch, payload, setModal, broker_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.createBrokerBranches(payload);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      setModal && setModal()
      loadBrokerBranches(dispatch, broker_id)
    } else {
      dispatch({ type: 'LOADING', payload: false });
      swal('Alert', serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const updateBrokerBranches = async (dispatch, payload, setModal, broker_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.updateBrokerBranches(payload);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      setModal && setModal()
      loadBrokerBranches(dispatch, broker_id)
    } else {
      dispatch({ type: 'LOADING', payload: false });
      swal('Alert', serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const deleteBrokerBranches = async (dispatch, id, broker_id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.deleteBrokerBranches(id);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      loadBrokerBranches(dispatch, broker_id)
    } else {
      dispatch({ type: 'LOADING', payload: false });
      swal('Alert', serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}
