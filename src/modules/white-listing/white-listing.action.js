import swal from 'sweetalert';
import { DateFormate, serializeError } from '../../utils'
import service from './white-listing.service'

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


export const loadWhiteListing = async (dispatch) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data } = await service.loadWhiteListingIP();
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          detail: data.data.map((elem, index) =>
          ({
            ...elem, created_at: DateFormate(elem.created_at, { type: 'withTime' }),
            updated_at: DateFormate(elem.created_at, { type: 'withTime' }), index: index + 1,
            type_name: elem.type === 1 ? 'IP/Email' : '2FA'
          })) || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const createWhiteListing = async (dispatch, payload, setModal) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.createWhiteListing(payload);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      setModal && setModal()
      loadWhiteListing(dispatch)
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

export const updateWhiteListing = async (dispatch, payload, id, setModal) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.updateWhiteListing(payload, id);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      setModal && setModal()
      loadWhiteListing(dispatch)
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

export const deleteWhiteListing = async (dispatch, id) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.deleteWhiteListing(id);
    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal('Success', message, 'success');
      loadWhiteListing(dispatch)
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
