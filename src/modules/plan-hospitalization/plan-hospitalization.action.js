import swal from 'sweetalert';
import service from './plan-hospitalization.service';
import { DateFormate, downloadFile, randomString, serializeError } from "../../utils";
import { SubStatus } from '.';
import { ModuleControl } from '../../config/module-control';

export const loadEmployers = async (dispatch) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data } = await service.loadEmployers();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        employers: (data.data && data.data.map(item => (
          {
            id: item.id,
            name: item.name,
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

export const loadBalanceSuminsured = async (setValue, payload) => {
  try {
    const { data } = await service.loadBalanceSuminsured(payload);
    setValue({
      balance_cover: String(data.data?.balance_ipd_suminsured_amount || 0),
    });
  }
  catch (error) {
    console.error(error)
  }
}



export const loadPolicyType = async (dispatch, payload) => {
  try {
    const { data } = await service.loadPolicyType(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        policy_types: (data.data && data.data.map(item => (
          {
            id: item.policy_sub_type_id,
            name: item.policy_sub_type_name,
            label: item.policy_sub_type_name,
            value: item.policy_sub_type_id
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

export const loadPolicyNo = async (dispatch, payload, filter_flag, firstPage) => {
  try {
    const { data } = await service.loadPolicyNo(payload, firstPage);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        lastPage: data.last_page,
        firstPage: data.current_page + 1,
        policy_nos: (data.data && data.data.filter(({ e_cashless_allowed }) => filter_flag ? e_cashless_allowed : true).map(item => (
          {
            ...item,
            id: item.id,
            name: item.policy_no,
            label: item.policy_no,
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

export const downloadSample = async (dispatch, payload) => {
  try {
    const { data, message } = await service.loadSampleFormat(payload);
    if (data.status) {

      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          sampleURL: (data.data && data.data.url) || '',
          loading: false
        }
      });
    } else {
      swal("Alert", message || '', 'warning');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadEmployee = async (dispatch, payload) => {
  try {
    const { data } = await service.loadEmployee(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        employees: (data.data && data.data.map(item => (
          {
            id: item.employee_id,
            name: item.employee_name + ' : ' + item.employee_code,
            label: item.employee_name + ' : ' + item.employee_code,
            value: item.employee_id,
            is_vip: item.is_vip
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

export const loadMembers = async (dispatch, payload) => {
  try {
    const { data } = await service.loadMembers(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        members: (data.data && data.data.map(item => (
          {
            id: item.member_id,
            name: item.name,
            label: item.name,
            value: item.member_id,
            relation_name: item.relation_name,
            mobile: item.mobile,
            email: item.email,
            tpa_member_id: item.tpa_member_id,
            tpa_member_name: item.tpa_member_name,
            tpa_emp_id: item.tpa_emp_id,
            ecard_url: item.ecard_url,
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


export const exportPlannedHosp = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, errors, message } = await service.exportPlannedHosp(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false
        }
      });
      swal('Success', message, 'success');
    } else {
      swal("Alert", serializeError(message || errors), 'warning');
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const sheetStatus = async (dispatch, payload) => {
  try {
    const { data } = await service.sheetStatus(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        sheetDetail: (data.data && data.data.map((elem) => ({
          ...elem,
          uploaded_at: DateFormate(elem.uploaded_at, { type: 'withTime' })
        }))) || [],
        loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadAilment = async (dispatch, payload) => {
  try {
    const { data } = await service.loadAilment(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        ailments: (data.data && data.data.map(item => (
          {
            id: item.id,
            name: item.ailment_name,
            label: item.ailment_name,
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

export const loadHospitals = async (dispatch, payload) => {
  try {
    const { data } = await service.loadHospitals(payload);
    // if (data.data && data.data.length) {
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        hospitals: (data.data && data.data.map(item => (
          {
            id: item.id,
            name: item.hospital_name,
            label: item.hospital_name,
            value: item.id
          }
        ))) || [],
        loading: false
      }
    });
    // } else {
    // loadState(dispatch)
    // }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

// export const loadStateCity = async (dispatch, payload) => {
//   try {
//     const { data } = await (payload.hospital_id ? service.loadStateCity : service.loadState)(payload);
//     if (data.data && data.data.length) {
//       dispatch({
//         type: 'GENERIC_UPDATE', payload: !payload.hospital_id ? {
//           state: (data.data && data.data.map(item => (
//             {
//               id: item.id,
//               name: item.state_name,
//               value: item.id
//             }
//           ))) || [],
//           state_city: [],
//           loading: false
//         } : {
//           state_city: data.data || [],
//           loading: false
//         }
//       });
//     }
//     else {
//       loadState(dispatch)
//     }
//   }
//   catch (error) {
//     console.error(error)
//     dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
//   }
// }

export const loadState = async (dispatch, payload) => {
  try {
    const { data } = await service.loadState(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        state: (data.data && data.data.map(item => (
          {
            id: item.state_name,
            name: item.state_name,
            label: item.state_name,
            value: item.state_name
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

export const loadCity = async (dispatch, payload) => {
  try {
    const { data } = await service.loadCity(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        city: (data.data && data.data.map(item => (
          {
            id: item.CITY_NAME,
            name: item.CITY_NAME,
            label: item.CITY_NAME,
            value: item.CITY_NAME
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

export const saveClaim = async (dispatch, payload, pass_to_tpa) => {
  try {
    const { data, message, errors } = await service.saveClaim(payload);
    if (data.status) {
      if (pass_to_tpa && data.claim_request_id) {
        updateProceedWith(dispatch, {
          path: `tpa/${randomString()}/e-cashless-intimation/${data.claim_request_id}/${randomString()}`,
          claim_request_id: data.claim_request_id
        }, true)
      }
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', pass_to_tpa ? 'Claim Intimation request submitted to TPA for approval' : message, 'success').then(() => {
        dispatch({
          type: 'GENERIC_UPDATE', payload: {
            success: true
          }
        });
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

export const loadClaimData = async (dispatch, payload) => {
  try {
    const { data } = await service.loadClaimData(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        claimData: (data.data && data.data[0]) || {},
        loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const RecommendHospitals = async (dispatch, payload, city_name) => {
  try {
    const { data } = await service.RecommendHospitals(payload);

    const priortyData = [], restData = [];

    (data.data || []).forEach((elem) => {
      if (elem.city_name === city_name) {
        priortyData.push(elem)
      } else {
        restData.push(elem)
      }
    })

    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        recommend_hospitals: [...priortyData, ...restData],
        loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const suggestHospital = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.suggestHospital(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false
        }
      });
      swal('Success', message, 'success');
      loadClaimData(dispatch, { claim_request_id: payload.claim_request_id })
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

export const updateClaimStatus = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.updateClaimStatus(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        // dispatch({
        //   type: 'GENERIC_UPDATE', payload: {
        //     success: true
        //   }
        // });
      });
      loadClaimData(dispatch, { claim_request_id: payload.claim_request_id })
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

export const updateProceedWith = async (dispatch, payload, noStatusUpdate = false) => {
  try {
    const { data, message, errors } = await service.updateProceedWith(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      !noStatusUpdate && swal('Success', message, 'success').then(() => {
        // dispatch({
        //   type: 'GENERIC_UPDATE', payload: {
        //     success: true
        //   }
        // });
      });
      loadClaimData(dispatch, { claim_request_id: payload.claim_request_id })
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      !noStatusUpdate && swal("Alert", serializeError(message || errors), 'info');
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const updateTPAClaim = async (dispatch, payload, noStatusUpdate = false, claim_request_id) => {
  try {
    const { data, message, errors } = await service.updateTPAClaim(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      !noStatusUpdate && swal('Success', message, 'success').then(() => {
        // dispatch({
        //   type: 'GENERIC_UPDATE', payload: {
        //     success: true
        //   }
        // });
      });
      loadClaimData(dispatch, { claim_request_id })
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

export const updateDiscrepancy = async (dispatch, payload, claim_request_id) => {
  try {
    const { data, message, errors } = await service.updateDiscrepancy(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success');
      loadClaimData(dispatch, { claim_request_id: payload.claim_request_id || claim_request_id });
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

export const getHealthECard = async (dispatch, payload) => {
  try {
    const { data, message, errors } = await service.getHealthECard(payload);
    if (data.status && data.ecardURL) {
      downloadFile(data?.ecardURL, null, true)
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      // swal('Success', message, 'success');
    } else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
      swal("Alert", ModuleControl.isHowden ? 'E-cards would be available post issuance of the policy' :'E-card not available', 'info');
      console.error(message, errors)
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const ClaimDetail = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingClaimDetail: true } });
    const { data } = await service.ClaimDetail(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        loadingClaimDetail: false,
        detail: data?.data?.map((elem, index) => ({
          ...elem,
          sr_no: index + 1,
          planned_date: DateFormate(elem.planned_date),
          status: SubStatus(elem?.status, elem?.claim_deficiency, elem.recommendation_id, elem.comment),
          claim_request_date: DateFormate(elem.claim_request_date)
        })) || [],
      }
    });
    // swal('Success', message, 'success');
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const PlannedHospitalMapDetail = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data } = await service.PlannedHospitalMapDetail(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        loading: false,
        detail: data.data || [],
      }
    });
    // swal('Success', message, 'success');
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


// flow

// load all
export const loadFlowDetails = async (dispatch) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: true } });
    const { data } = await service.loadFlowDetails();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        details: (data.data && data.data.map((item, index) => (
          {
            ...item,
            policy_name: (item.policy_name ? item.policy_name + ' : ' : '') + item.policy_number,
            sr_no: index + 1
          }
        ))) || [],
        loadingDetail: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: false } });
  }
}

// create
export const createECashFlow = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.createECashFlow(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        loadFlowDetails(dispatch)
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

// get single
export const getFlowDetail = async (dispatch, payload) => {
  try {
    const { data } = await service.getFlowDetail(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
          flow_data: data.data || {}
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        loading: false,
        flow_data: {}
      }
    });
  }
}

// update
export const updateECashFlow = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.updateECashFlow(payload);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        loadFlowDetails(dispatch)
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

// delete
export const deleteECashFlow = async (dispatch, id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data, message, errors } = await service.deleteECashFlow(id);
    if (data.status) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading: false,
        }
      });
      swal('Success', message, 'success').then(() => {
        loadFlowDetails(dispatch)
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
