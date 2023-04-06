import { createSlice } from "@reduxjs/toolkit";
import { actionStructre } from "utils";
import service from "./claims.service";
import swal from "sweetalert";
import { DateFormate, downloadFile, isValidHttpUrl, serializeError } from "../../utils";
import { isString } from "lodash";
export const claimSlice = createSlice({
  name: "claims",
  initialState: {
    loading: false,
    error: null,
    states: [],
    cities: [],
    hospitals: [],
    success: null,
    tempSuccess: false,
    employer: [],
    employee: [],
    policy_type: [],
    policy_id: [],
    members: [],
    claims: [],
    track: null,
    all_claims: [],
    is_date_valid: true,
    track_claim: {},
    broker: [],
    tempData: {},
    docs: [],
    claimAllData: {
      broker_id: undefined,
      employer_id: undefined,
      policy_type: undefined,
      policy_id: undefined,
      from_date: undefined,
      to_date: undefined,
      url: null
    },
    tpas: [],
    keywords: [],
    tpaKeywords: [],
    all_claim_data: [],
    claimDetailsData: {},
    sampleFileResponse: "",
    claimDataBox: {},
    intimateClaimId: []
  },
  reducers: {
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.success = payload;
    },
    tempSuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.tempSuccess = payload;
    },
    error: (state, { payload }) => {
      let message = " ";
      if (typeof payload === "string") message = payload;
      else if (typeof payload === "object") {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }

      state.loading = null;
      state.error = message !== " " ? message : "Unable to connect to the server, please check your internet connection.";
      state.success = null;
    },
    clear: (state, { payload }) => {
      state.error = null;
      state.success = null;
      state.tempSuccess = null;
      switch (payload) {
        case "docs":
          state.docs = [];
          break;
        default:
      }
    },
    setClaimAllData: (state, action) => {
      state.claimAllData = action.payload;
    },
    state_data: (state, { payload }) => {
      state.states = payload;
      state.loading = null;
    },
    city_data: (state, { payload }) => {
      state.cities = payload;
      state.loading = null;
    },
    hospital_data: (state, { payload }) => {
      state.hospitals = payload;
      state.loading = null;
    },
    clearCity: (state) => {
      state.cities = [];
      state.states = [];
    },
    clearHospital: (state) => {
      state.hospitals = [];
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    clearBroker: (state) => {
      state.broker = [];
    },
    employer: (state, { payload }) => {
      state.employer = payload;
    },
    clearEmployer: (state) => {
      state.employer = [];
    },
    employee: (state, { payload }) => {
      state.employee = payload;
    },
    clearEmployee: (state) => {
      state.employee = [];
    },
    policy_type: (state, { payload }) => {
      state.policy_type = payload;
    },
    clear_policy_type: (state) => {
      state.policy_type = [];
    },
    policy_id: (state, { payload }) => {
      state.policy_id = payload;
    },
    clear_policy_id: (state) => {
      state.policy_id = [];
    },
    members: (state, { payload }) => {
      state.members = payload;
    },
    clearMembers: (state) => {
      state.members = [];
    },
    claim_data: (state, { payload }) => {
      state.claims = payload;
    },
    clear_claim_data: (state) => {
      state.claims = null;
    },
    track_data: (state, { payload }) => {
      state.track = payload;
      state.loading = null;
    },
    clearTrackClaim: (state) => {
      state.track = null;
    },
    all_claims: (state, { payload }) => {
      state.all_claims = payload;
      state.loading = null;
    },
    all_claim_data: (state, { payload }) => {
      state.all_claim_data = payload;
      state.loading = null;
    },
    clear_claims: (state) => {
      state.all_claims = [];
    },
    is_date_valid: (state, { payload }) => {
      state.is_date_valid = payload;
    },
    clear_is_date_valid: (state) => {
      state.is_date_valid = false;
    },
    set_track_claim: (state, { payload }) => {
      state.track_claim = payload;
    },
    clear_track_claim: (state) => {
      state.track_claim = {};
    },
    tempData: (state, { payload }) => {
      payload.filenames = [];
      state.tempData = payload;
    },
    clearTempData: (state) => {
      state.tempData = {};
    },
    docs: (state, { payload }) => {
      state.docs = payload;
    },
    tpas: (state, { payload }) => {
      state.tpas = payload.map((elem) => ({ ...elem, value: elem.id }));
    },
    keywords: (state, { payload }) => {
      state.keywords = payload.map((elem) => ({
        id: elem.id,
        name: elem.keyword,
        label: elem.keyword,
        value: elem.id,
      }));
    },
    tpaKeywords: (state, { payload }) => {
      state.tpaKeywords = payload;
    },
    claimDetailsData: (state, { payload }) => {
      state.claimDetailsData = payload;
      state.loading = null;
    },
    sampleFileDetails: (state, action) => {
      state.sampleFileResponse = action.payload;
    },
    setClaimData: (state, action) => {
      state.claimDataBox = action.payload;
      state.loading = null;
    },
    clearClaimData: (state) => {
      state.claimDataBox = {};
      state.loading = null;
    },
    intimateClaimId: (state, { payload = [] }) => {
      state.intimateClaimId = payload;
    }
  },
});

export const {
  loading,
  success,
  error,
  clear,
  state_data,
  city_data,
  clearCity,
  employer,
  employee,
  policy_type,
  members,
  policy_id,
  hospital_data,
  claim_data,
  clearHospital,
  track_data,
  all_claims,
  clear_claims,
  is_date_valid,
  clearTrackClaim,
  clearEmployer,
  clearEmployee,
  clear_policy_type,
  clear_policy_id,
  clearMembers,
  clear_claim_data,
  clear_is_date_valid,
  set_track_claim,
  clear_track_claim,
  broker,
  clearBroker,
  tempData,
  clearTempData,
  tempSuccess,
  docs,
  setClaimAllData,
  tpas,
  keywords,
  tpaKeywords,

  all_claim_data,
  claimDetailsData,
  sampleFileDetails,
  setClaimData,
  clearClaimData,
  intimateClaimId
} = claimSlice.actions;

//---------- Action creators ----------//

// Admin Get Broker

export const loadBroker = (userType) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.adminGetBroker(userType);
      dispatch(clear());
      if (data.data) {
        dispatch(broker(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Admin Get Employer

export const loadBrokerEmployer = (id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.adminGetEmployer(id);
      dispatch(clear());
      if (data.data) {
        dispatch(
          employer(
            data.data.map((employer) => ({
              id: employer.id,
              name: employer.company_name,
            }))
          )
        );
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Employer

export const loadEmployer = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getEmployer();
      dispatch(clear());
      if (data.data) {
        dispatch(employer(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Employee

export const loadEmployee = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getEmployee(payload);
      if (data.data) {
        dispatch(employee(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Policy Type

export const loadPolicyType = (payload, type = "all") => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      if (type === "GPA") {
        const { data, message, errors } = await service.getPolicyType2(payload);
        if (data.data) {
          dispatch(
            policy_type(
              data.data
                .filter((data) => [1, 2].includes(data.id))
                .map((data) => ({
                  policy_sub_type_id: Number(data.id),
                  policy_sub_type_name: data.name,
                  value: Number(data.id),
                }))
            )
          );
        } else {
          dispatch(error(message || errors));
          console.error(message || errors);
        }
      } else {
        const { data, message, errors } = await service.getPolicyType(payload);
        if (data.data) {
          dispatch(policy_type(data.data));
        } else {
          dispatch(error(message || errors));
          console.error(message || errors);
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Policy Id

export const loadPolicyId = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getPolicyId(payload);
      if (data.data) {
        dispatch(policy_id(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Members

export const loadMembers = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getMembers(payload);
      if (data.data) {
        dispatch(members(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get ClaimId

export const loadClaimId = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getClaimId(payload);
      if (data.data) {
        dispatch(claim_data(data.data.map(({ claim_no, admit_date }) => ({ admit_date: admit_date, id: claim_no, value: claim_no, label: admit_date ? `${claim_no} [${admit_date[2] === '-' ? admit_date : DateFormate(admit_date, { dateFormate: true })}]` : claim_no }))));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Submit Claim

export const submitClaim = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.postSubmitClaim(payload);
      if (data.status === true) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Temp
export const submitClaimTemp = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.postSubmitTemp(payload);
      if (data.status === true) {
        dispatch(tempSuccess(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Get Temp
export const loadClaimTemp = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getSubmitTemp();
      dispatch(clear());
      if (data.data && data.data?.claim_submitted_data) {
        const decodeData = JSON.parse(data.data?.claim_submitted_data);
        (!decodeData.android || decodeData.android === 'no') && dispatch(tempData({ ...decodeData, table_id: data.data?.id, city_id: Number(decodeData.city_id) || null }));
      } else {
        console.error(message || errors);
      }
    } catch (err) {
      console.error(err);
    }
  };
};

// Get Claim Details --> View Claim
export const loadClaimDetails = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.loadClaimDetails(payload);
      if (data.status) {
        // dispatch(setClaimData({...JSON.parse(data.data.claim_submitted_data)}));
        dispatch(setClaimData({ ...data.data }));
      } else {
        swal(message || errors, "", "warning");
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};
// Delete Temp
export const removeSubmitTemp = (id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.deleteSubmitTemp(id);
      dispatch(clear());
      if (data.status) {
        dispatch(clearTempData());
      } else {
        // dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Intimate Claim

export const intimateClaim = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.postIntimateClaim(
        payload
      );
      if (data.status === true) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Check Claim Avaibility

export const claimAvailable = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message } = await service.postClaimValid(payload);
      if (data.status === false) {
        dispatch(error(message));
        dispatch(is_date_valid(false));
      } else {
        dispatch(is_date_valid(true));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// Hopital/State/City

export const loadHospStates = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clearCity());
      dispatch(clear());
      const { data, message, errors } = await service.getHospStates(payload);
      if (data.data) {
        dispatch(state_data(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const loadHospCities = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getHospCities(payload);
      if (data.data) {
        dispatch(city_data(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const loadHospitals = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clearHospital());
      dispatch(clear());
      const { data, message, errors } = await service.getHospitals(payload);
      if (data.data) {
        dispatch(hospital_data(data.data));
      } else {
        console.error(message || errors);
        // if (data.errors)
        //   dispatch(error(data.errors));
        // if (data.message)
        //   dispatch(error(data.message));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err);
      console.error(err);
    }
  };
};

export const hospitalByName = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clearHospital());
      dispatch(clear());
      const { data } = await service.getHospitalsByName(payload);
      if (data.data) {
        dispatch(hospital_data(data.data));
      } else {
        // dispatch(error(data.errors));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

//  Track Claim

export const trackClaim = (payload, memberData, type = "all") => {
  return async (dispatch) => {
    try {
      dispatch(clearTrackClaim());
      dispatch(clear());
      dispatch(loading());
      if (type === "all") {
        const { data, message, errors } = await service.postTrackClaim(payload);
        if (data.data) {
          dispatch(
            track_data({
              ...data.data,
              claim_register: data.data.claim_register || true,
            })
          );
        } else {
          // dispatch(error(message || errors));
          console.error(message || errors);
          // const { data: data1, message: message1, errors: errors1 } = await service.postTrackClaim({ tpa_member_id: "25375743", claim_id: "4580214" });
          // if (data1.data) {
          //   dispatch(track_data(data1.data));
          // } else {
          //   dispatch(error(message1 || errors1));
          //   console.error(message1 || errors1);
          // }
          dispatch(
            track_data({
              claim_register: true,
              // member_dob: memberData.,
              // member_gender: memberData.,
              member_name: memberData.name,
              relation: memberData.relation_name,
              email: memberData.email,
              mobile: memberData.mobile,
            })
          );
        }
      } else if (type === "GPA") {
        const { data, message, errors } = await service.postTrackClaimForGPA(payload);
        if (data.status) {
          dispatch(
            track_data({
              ...data.data,
              claim_register: data.data.claim_register || true,
            })
          );
        } else {
          // dispatch(error(message || errors));
          console.error(message || errors);
          // const { data: data1, message: message1, errors: errors1 } = await service.postTrackClaim({ tpa_member_id: "25375743", claim_id: "4580214" });
          // if (data1.data) {
          //   dispatch(track_data(data1.data));
          // } else {
          dispatch(error(message || errors));
          //   console.error(message1 || errors1);
          // }
          dispatch(
            track_data(null)
          );
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

//  Overall Claim

export const overAllClaim = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear_claims());
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.postOverAllClaim(payload);
      if (data.data) {
        dispatch(all_claims(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

// State/City

export const loadState = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getStates();
      if (data.data) {
        dispatch(state_data(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const loadCity = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getCities(payload);
      if (data.data) {
        dispatch(city_data(data.data));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const loadIntimateClaimId = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.loadIntimateClaimId(payload);
      if (data.data) {
        dispatch(intimateClaimId(data.data.filter((elem) => elem.claim_request_id || elem.tpa_intimate_no).map((elem) => ({
          id: elem.id,
          name: (elem.claim_request_id || elem.tpa_intimate_no) + ' : ' + elem.claim_type,
          value: elem.id
        }))));
      } else {
        // dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const exportPortalClaimReport = (payload, setModalExport) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.exportPortalClaimReport(payload);
      if (data.data) {
        downloadFile(data?.data?.url);
        dispatch(loading(false));
        setModalExport(false)
      } else {
        swal("Alert", serializeError(message || errors), 'info');
        dispatch(loading(false));
      }
    } catch (err) {
      console.error(err);
      swal("Alert", 'Something went wrong', 'info');
      dispatch(loading(false));
    }
  };
};


//get docs
export const getDocs = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, docs, error, service.documents, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//get TPA's
export const loadTPAs = (payload) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, tpas, error, service.getTPAs, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//get TPA's
export const loadTPAKeywords = (payload) => {
  return async (dispatch) => {
    try {
      actionStructre(
        dispatch,
        keywords,
        error,
        service.getTPAKeywords,
        payload
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//get map TPA's status keyword
export const loadTPAKeywordsStatus = (payload) => {
  return async (dispatch) => {
    try {
      actionStructre(
        dispatch,
        tpaKeywords,
        error,
        service.getTPAKeywordsStatus,
        payload
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const saveTPAKeywords = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(
        dispatch,
        success,
        error,
        service.createTPAKeywords,
        payload
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateTPAKeywords = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(
        dispatch,
        success,
        error,
        service.editTPAKeywords,
        payload
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteTPAKeywords = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.removeTPAKeywords, {
        custom_claim_status_id: payload,
      });
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadClaimData = (payload, showMessage) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.loadClaimData(payload);
      if (data.data?.length) {
        dispatch(all_claim_data(data.data || []));
      } else if (!data.data.length && data.status === true) {
        showMessage ? dispatch(error('No Data Found')) : dispatch(loading(false));
        dispatch(all_claim_data([]));
      }
      else {
        dispatch(error(message || errors));
        console.error(message || errors);
        dispatch(all_claim_data([]));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
      dispatch(all_claim_data([]));
    }
  };
};

export const uploadPolicyData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.uploadPolicyData(payload);
      if (data.status === true) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err);
    }
  };
};

export const getClaimDetails = (payload, type, showError) => {
  return async (dispatch) => {
    if (type === "GPA") {
      try {
        dispatch(loading());
        const { data, message, errors } = await service.getClaimDetailsForGPA({
          id: payload?.claim_id,
        });
        if (data.status) {
          dispatch(claimDetailsData({
            ...data.data, tpa_claim_documents: data.data?.tpa_claim_documents?.filter((value) => {
              if (isString(value)) {
                return (isValidHttpUrl(value) ? value : (value.length > 6) ? 'https://' + value : '') || ''
              }
              return true
            })
          }));
        } else {
          showError && swal('Alert', serializeError(message || errors), 'warning');
          dispatch(loading(false));
        }
      } catch (err) {
        dispatch(error("Something went wrong"));
        console.error(err);
      }
    } else {
      try {
        dispatch(loading());
        const { data, message, errors } = await service.getClaimDetails(
          payload
        );
        if (data.status) {
          dispatch(claimDetailsData({
            ...data.data, tpa_claim_documents: data.data?.tpa_claim_documents?.filter((value) => {
              if (isString(value)) {
                return (isValidHttpUrl(value) ? value : (value.length > 6) ? 'https://' + value : '') || ''
              }
              return true
            })
          }));
        } else {
          showError && swal('Alert', serializeError(message || errors), 'warning');
          dispatch(loading(false));
        }
      } catch (err) {
        dispatch(error("Something went wrong"));
        console.error(err);
      }
    }
  };
};

export const getDynamicSampleFile = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.GetDynamicSampleFile(
        payload
      );
      if (data.data) {
        dispatch(sampleFileDetails(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//submit claim bulk upload
export const postClaimData = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.postClaimData(payload);
      if (data.status) {
        dispatch(success(data.data || message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (error) {
      console.error(error);
    }
  };
};
//intimate claim bulk upload
export const postIntimateClaimData = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.postIntimateClaimData(
        payload
      );
      if (data.status) {
        dispatch(success(data.data || message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const postDeficiencyUpload = (payload, id, type, reset) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.postDeficiencyUpload(
        payload
      );
      if (data.status) {
        dispatch(loading(false));
        swal('Success', message, 'success').then(reset);
        dispatch(getClaimDetails({ claim_id: id }, type))
      } else {
        dispatch(loading(false));
        swal('Alert', serializeError(message || errors), 'warning');
      }
    } catch (err) {
      swal('Alert!', "Something went wrong", 'warning');
      console.error("Error", err);
      dispatch(loading(false));

    }
  };
};

export const tpaAcceptedExtensions = async (payload, setState) => {
  try {
    const { data } = await service.tpaAcceptedExtensions(payload);
    if (data.status && data?.data?.accepted_extensions) {
      setState(data.data.accepted_extensions)
    } else {
      setState([])
    }
  } catch {
    setState([])
  }

}

export const digitalClaimIpdOpdformHandler = (payload, type) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, errors } = await service.digitalClaimIpdOpdform(payload, type);
      if (data.status && !!data?.url) {
          dispatch(loading(false));
          downloadFile(data?.url, null, true);
      } else {
        dispatch(loading(false));
        console.error(errors);
      }
    } catch (err) {
      dispatch(loading(false));
      console.error(err);
    }
  };
};

export const claim = (state) => state.claims;

export default claimSlice.reducer;
