// import swal from "sweetalert";
import swal from "sweetalert";
import {/*  downloadFile,  */serializeError } from "utils";
import service from './self-endorsement.service'

export const initialState = {
  loading: true,
  policy_detail: [],
  designation: [],
  grade: []

}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'POLICY_DETAIL':
      const designation = payload.reduce((result, { designation }) => [...result, ...designation], []);
      const grade = payload.reduce((result, { grade }) => [...result, ...grade], []);
      return {
        ...state,
        loading: false,
        policy_detail: payload.filter(({ self_included }) => self_included),
        designation: [...new Set(designation)].map(value => ({
          id: value,
          name: value,
          value
        })),
        grade: [...new Set(grade)].map(value => ({
          id: value,
          name: value,
          value
        })),
      }
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
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


export const loadPolicyDetail = async (dispatch, payload) => {
  try {
    const responseData = await Promise.all(payload.map((policy_id) => service.loadPolicyDetail({ policy_id })));

    if (responseData?.length) {
      dispatch({
        type: 'POLICY_DETAIL', payload: responseData.filter((elem) => elem?.data.data)
          .map(({ data }) => data.data) || []
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
      swal('Alert', 'Server Error', 'warning')
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const submitEndorsement = async (dispatch, payload,history) => {
  try {
    dispatch({ type: 'LOADING', payload: true });

    const { data, errors, message } = await service.submitEndorsement(payload);

    if (data.status) {
      dispatch({ type: 'LOADING', payload: false });
      swal("Success", message, "success").then(()=>{
        history.replace('/')
      })

    } else {
      swal('Alert', serializeError(message || errors), 'warning')
      dispatch({ type: 'LOADING', payload: false });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}
