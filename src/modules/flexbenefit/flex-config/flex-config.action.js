import swal from "sweetalert";
import { serializeError } from "utils"
import { DateFormate, downloadFile } from "../../../utils";
import { loading, set_pagination_update } from "../../user-management/user.slice";
import service from './flex-config.service';

export const initialState = {
  loading: true,
  details: [],
  flex_detail: {},
  policies: [],
  policy_types: [],
  policy_data: {},
  benefit_master: [],
  employer_opted_flex: []
}

export const reducer = (state, { type, payload }) => {

  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'LOADING': return {
      ...state,
      loading: payload,
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      errors: serializeError(payload)
    }
    default: return state;
  }
}


export const loadPolicyTypes = async (dispatch, payload) => {
  try {
    const { data } = await service.getPolicySubTypeData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_types: data.data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadPolicies = async (dispatch, payload) => {
  try {
    const { data } = await service.getPolicyNumberData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policies: data.data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadPolicyData = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data } = await service.loadPolicyData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_data: data.data[0] || {},
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}


export const submitFlex = async (dispatch, payload, { setPage, history }) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await (payload.flex_plan_id ? service.updateFlex : service.submitFlex)(payload);
    if (data.status) {
      swal('Success', message, 'success').then(() => {
        if (payload.flex_plan_id) {
          history.replace('/broker/policy-flex-config')
        } else {
          setPage('list');
          loadFlexList(dispatch)
        }
      })
      dispatch({ type: 'LOADING', payload: false });
    } else {
      swal('Alert', serializeError(message || errors), 'warning')
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const deleteFlex = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.deleteFlex(payload);
    if (data.status) {
      swal('Success', message, 'success').then(() => {
        loadFlexList(dispatch)
      })
      dispatch({ type: 'LOADING', payload: false });
    } else {
      swal('Alert', serializeError(message || errors), 'warning')
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const updateFlexStatus = async (dispatch, payload) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data, message, errors } = await service.updateFlexStatus(payload);
    if (data.status) {
      // swal('Success', message, 'success').then(() => {
      loadFlexList(dispatch)
      // })
      dispatch({ type: 'LOADING', payload: false });
    } else {
      swal('Alert', serializeError(message || errors), 'warning')
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadFlexList = async (dispatch, payload) => {
  try {
    const { data } = await service.loadFlexList(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          details: data.data.map(elem => ({
            ...elem,
            created_at: DateFormate(elem.created_at, { type: 'withTime', dateFormate: true }),
            updated_at: DateFormate(elem.updated_at, { type: 'withTime', dateFormate: true }),
            deleted_at: DateFormate(elem.deleted_at, { type: 'withTime', dateFormate: true })
          })) || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const getFlexDetail = async (dispatch, payload) => {
  try {
    const { data } = await service.getFlexDetail(payload);
    if (data.data) {
      const finalData = data.data[0];
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          flex_detail: {
            ...finalData,
            plan_benefits: finalData.plan_benefits?.map(elem => ({
              ...elem,
              ...elem.mandatory_if_not_selected_benefit_ids && { mandatory_if_not_selected_benefit_ids: elem.mandatory_if_not_selected_benefit_ids.split(',').map(elem => ({ id: elem })) }
            })) || {},
            loading: false
          }
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadBenefits = async (dispatch) => {
  try {
    const { data } = await service.loadBenefits();
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          benefit_master: data.data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadEmployeOptedFlex = async (dispatch) => {
  try {
    const { data } = await service.loadEmployeOptedFlex();
    if (data.data.length) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          employer_opted_flex: data.data || [],
          loading: false
        }
      });
    } else {
      dispatch({ type: 'LOADING', payload: false });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const employeeRollBack = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.employeeRollBack(payload);
      if (data.status === true) {
        swal('Success', message, 'success').then(() => {
          dispatch(set_pagination_update(true));
        })
      } else {
        swal('Alert', serializeError(message || errors), 'warning')
        dispatch(loading(false));
      }
    } catch (err) {
      swal('Alert', serializeError('Something went wrong'), 'warning')
      console.error("Error", err);
    }
  };
}
  ;
export const downloadEmployee = async (payload, dispatch) => {
  try {
    dispatch(true);
    const { data, message, errors } = await service.loadEmployeOptedFlex({ data: payload });
    if (data.url) {
      downloadFile(data.url, null, true);
      dispatch(false);
    } else {
      swal('Alert', serializeError(message || errors), 'warning');
      dispatch(false);
    }
  } catch (err) {
    dispatch(false);
    swal('Alert', serializeError('Something went wrong'), 'warning')
    console.error("Error", err);
  }
};
