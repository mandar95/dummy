import swal from 'sweetalert';
import service from './offline-tpa.service';
import { DateFormate, downloadFile, serializeError } from "../../utils";

export const loadEmployers = async (dispatch) => {
  try {
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data } = await service.loadEmployers();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        employers: (data.data && data.data.map(item => (
          {
            id: item.id,
            label: item.name,
            name: item.name,
            value: item.id
          }
        ))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


export const loadPolicyType = async (dispatch, payload, type) => {
  try {
    if (type === "claim-data" || type === 'tpa-log') {
      const { data } = await service.loadPolicyTypeAll(payload);
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_types: (data.data && data.data?.filter(({ id }) => type === 'tpa-log' ? true : (id === 1 || id === 2 || id === 3)).map(item => (
            {
              id: item.id,
              label: item.name,
              name: item.name,
              value: item.id
            }
          ))) || [],
          // loading: false
        }
      });
    } else {
      const { data } = await service.loadPolicyType(payload);
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_types: (data.data && data.data?.filter(({ policy_sub_type_id }) => policy_sub_type_id === 1).map(item => (
            {
              id: item.policy_sub_type_id,
              label: item.policy_sub_type_name,
              name: item.policy_sub_type_name,
              value: item.policy_sub_type_id
            }
          ))) || [],
          // loading: false
        }
      });
    }

  }
  catch (error) {
    console.error(error)
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadPolicyNo = async (dispatch, payload, isBroker) => {
  try {
    const { data } = await service.loadPolicyNo(payload, isBroker);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        policy_nos: (data.data && data.data.map(item => (
          {
            ...item,
            id: item.id,
            label: isBroker ? item?.number : item.policy_no,
            name: isBroker ? item?.number : item.policy_no,
            value: item.id
          }
        ))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


export const createAction = async (dispatch, payload, loadPayload, reset, { saveApi, loadErrorApi }, policy_type) => {
  try {
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        loading: true,
      }
    });
    if (Number(policy_type) === 2) {
      const { data, message, errors } = await service.createGPAClaimData(payload);
      if (data.status) {
        reset({
          policy_type: '', policy_id: '', employer_id: '', file: '', to_override: '0'
        })
        swal('Success', message, 'success');
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        setTimeout(() => {
          loadErrorSheetAction(dispatch, loadPayload, loadErrorApi)
        }, 1000);
      } else {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        swal("Alert", serializeError(message || errors), 'info');
      }
    } else if (Number(policy_type) === 3) {
      const { data, message, errors } = await service.createGTLClaimData(payload);
      if (data.status) {
        reset({
          policy_type: '', policy_id: '', employer_id: '', file: '', to_override: '0'
        })
        swal('Success', message, 'success');
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        setTimeout(() => {
          loadErrorSheetAction(dispatch, loadPayload, loadErrorApi)
        }, 1000);
      } else {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        swal("Alert", serializeError(message || errors), 'info');
      }
    } else {
      const { data, message, errors } = await saveApi(payload);
      if (data.status) {
        reset({
          policy_type: '', policy_id: '', employer_id: '', file: '', to_override: '0'
        })
        swal('Success', message, 'success');
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        setTimeout(() => {
          loadErrorSheetAction(dispatch, loadPayload, loadErrorApi)
        }, 1000);
      } else {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
        swal("Alert", serializeError(message || errors), 'info');
      }
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


export const loadErrorSheetAction = async (dispatch, payload, loadErrorApi) => {
  try {
    const { data } = await loadErrorApi(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        details: (data.data && data.data.map(item => ({
          ...item,
          uploaded_at: DateFormate(item.uploaded_at, { type: 'withTime' })
        }))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadSampleFormatAction = async (payload, sampleFormatApi, policy_type, shoulad_load) => {
  try {
    if (Number(policy_type) === 2) {
      const { data, message, errors } = await service.loadSampleFormatForGpa({ policy_id: payload?.policy_id, type: 1 });
      data.data ? downloadFile(data.data) :
        swal("Alert", serializeError(message || errors), 'info');
    } else if (Number(policy_type) === 3) {
      const { data, message, errors } = await service.loadSampleFormatForGtl({ policy_id: payload?.policy_id });
      data.data ? downloadFile(data.data) :
        swal("Alert", serializeError(message || errors), 'info');
    } else {
      const { data, message, errors } = await sampleFormatApi(payload);
      data.data ? downloadFile(data.data) :
        swal("Alert", serializeError(message || errors), 'info');
    }

  }
  catch (error) {
    console.error(error)
  }
}

export const uploadPolicyCoverage = async (dispatch, payload, reset) => {
  try {
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        loadingUpload: true,
      }
    });
    const { data, message, errors } = await service.uploadPolicyCoverage(payload);
    if (data.status) {
      reset({
        policy_type: '', policy_id: '', employer_id: '', file: '', to_override: '0'
      })
      swal('Success', message, 'success');
      setTimeout(() => {
        loadErrorSheetAction(dispatch, { document_type_id: 20, broker_id: 1 }, service.loadErrorSheet)
      }, 1000);
      dispatch({ type: 'GENERIC_UPDATE', payload: { loadingUpload: false } });
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loadingUpload: false } });
      swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingUpload: false } });
  }
}
