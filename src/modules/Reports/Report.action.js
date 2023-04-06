import { getApiTypeData, getTpa, getTpaJobData, submitTpaTrigger } from "modules/TPAApiTrigger/serviceAPI";
import swal from "sweetalert";
import { DateFormate, downloadFile, serializeError } from "../../utils";
import service from './serviceApi'

export const initialState = {
  loading: true,
  loadingReport: false,
  employers: [],
  apiType: [],
  brokers: [],
  allTpa: [],
  allTpaJobData: [],
  policies: [],
  policy_subtypes: [],
  firstpage: 1,
  lastpage: 1,
  submittedData: {},
  reportData: {}
}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ON_FETCH_EMPLOYERS":
      return {
        ...state,
        loading: payload.current_page < payload.last_page,
        lastpage: payload.last_page,
        firstpage: payload.current_page + 1,
        employers: [...state.employers, ...(payload.employers || [])],
      };
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'FETCH_TPA': return {
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


export const loadEmployers = async (dispatch, payload, pageNo = 1) => {
  try {
    const { data } = await service.getEmployerNameData(payload, pageNo);
    if (data.data) {
      dispatch({
        type: 'ON_FETCH_EMPLOYERS', payload: {
          ...data,
          employers: data.data || [],
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const submitTpa = async (dispatch, bodyData) => {
  try {
    const { data } = await submitTpaTrigger(bodyData);
    if (data) {
      if (data.status) {
        loadTpaJobData(dispatch)
      }
      dispatch({
        type: 'FETCH_TPA', payload: {
          loading: false,
          submittedData: data
        }
      })
        ;
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadTpa = async (dispatch) => {
  try {
    const { data } = await getTpa();
    if (data.data) {
      dispatch({
        type: 'FETCH_TPA', payload: {
          allTpa: data.data || [],
          loading: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadTpaJobData = async (dispatch) => {
  try {
    const { data } = await getTpaJobData();
    if (data.data) {
      dispatch({
        type: 'FETCH_TPA', payload: {
          allTpaJobData: data.data
            .map((elem, index) => ({
              index: index + 1,
              ...elem, ran_at: DateFormate(elem.ran_at, { type: 'withTime' }),
              request: elem.tpa_logs.length ? elem.tpa_logs[elem.tpa_logs.length - 1].request : null,
              response: elem.tpa_logs.length ? elem.tpa_logs[elem.tpa_logs.length - 1].response : null,
              // tpa_logs: elem.tpa_logs.length ? elem.tpa_logs/* [elem.tpa_logs.length - 1] */ : null
            })) || [],
          loading: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export const loadBrokerEmployer = async (dispatch, payload) => {
  try {
    const { data } = await service.adminGetEmployer(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          employers: data.data || [],
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
};

export const loadBroker = async (dispatch, userType) => {
  try {
    const { data } = await service.adminGetBroker(userType);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          brokers: data.data || [],
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

export const loadPolicyTypes = async (dispatch, payload) => {
  try {
    const { data } = await service.getPolicySubTypeData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          policy_subtypes: data.data || [],
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

export const loadApiType = async (dispatch, payload) => {
  try {
    const { data } = await getApiTypeData(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          apiType: data.data || [],
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

export const exportDetails = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = await service.exportReportData(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loadingReport: false
        }
      });
      downloadFile(data?.data?.download_report)
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};
export const exportDetailsOfTPA = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = await service.exportReportDataOfTpa(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loadingReport: false
        }
      });
      if (data?.data) {
        downloadFile(data?.data?.download_report)
      }
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};
export const exportDetailsOfGPA_GTL = async (dispatch, payload, report_type) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = report_type === 1 ? await service.exportReportDataOfGpa(payload) : await service.exportReportDataOfGtl(payload)
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loadingReport: false
        }
      });
      if (data?.data) {
        downloadFile(data?.data?.url);
      }
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};

export const loadClaimUtilization = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = await service.loadClaimUtilization(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: data.data || [],
          loadingReport: false
        }
      });
      swal("Data fetched", "", "success")
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: [],
          loadingReport: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};

export const loadMonthlyClaim = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = await service.loadMonthlyClaim(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: data.data || [],
          loadingReport: false
        }
      });
      swal("Data fetched", "", "success")
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: [],
          loadingReport: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};

export const loadClientSummary = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: true } });
    const { data, errors, message } = await service.loadClientSummary(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: data.data || [],
          loadingReport: false
        }
      });
      swal("Data fetched", "", "success")
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          reportData: [],
          loadingReport: false
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingReport: false } });
  }
};
