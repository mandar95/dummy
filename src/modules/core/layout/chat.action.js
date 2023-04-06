import swal from "sweetalert";
import { serializeError } from "../../../utils"
import service from './chat.service';

export const initialState = {
    loading: false,
    details: null,
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


export const getAllDetails = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.getAllDetails(payload);
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    details: data.data || {},
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
