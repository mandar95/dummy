import { createSlice } from "@reduxjs/toolkit";
import {
  getEmployerNameData,
  getPolicySubType,
  getPolicyNumber,
  postMemberData,
  sampleFile,
  dynamicFile,
  sumInsured,
  adminGetBroker,
  postICMemberData,
  sheetKeys,
  createSheetTemplate,
  editSheetTemplate,
  getTemplates,
  removeTemplate,
  getEndorsementDetail,
  EndorsedMemberApproveReject,
  CreateEndorsementDeficiency,
  GetErrorSheetData,
  GetDynamicFileTPA,
  postMemberDataTPA,
  postMemberDataNew,
  GetErrorSheetDataTPA,
  getTPAFetch,
  GetErrorSheetURL
} from "./serviceApi";
import { actionStructre } from 'utils';
import { DateFormate, downloadFile } from "../../utils";

export const endorsementRequest = createSlice({
  name: "endorsementRequest",
  initialState: {
    loading: false,
    loading1: false,
    error: null,
    success: null,
    dynamicKeys: [],
    // template: {},
    templates: [],
    PolicySubTypeDataResponse: {},
    PolicyNumberDataResponse: {},
    PostDataResponse: {},
    sampleFileResponse: '',
    getEmployereDataResponse: [],
    sumInsuredResponse: {},
    broker: [],
    EndorsementDetails: [],
    endorsedMemberSuccess: null,
    ErrorSheetData: [],
    ErrorSheetDataTPA: [],
    lastPage: 1,
    firstPage: 1,
  },

  //reducers
  reducers: {
    getEmployerDetails: (state, { payload }) => {
      state.getEmployereDataResponse = payload.isNew ? payload.data : [...state.getEmployereDataResponse, ...payload.data];
    },
    getPolicySubTypeDetails: (state, action) => {
      state.PolicySubTypeDataResponse = action.payload;
    },
    getPolicyNumberDetails: (state, action) => {
      state.PolicyNumberDataResponse = action.payload;
    },
    postMember: (state, action) => {
      state.loading1 = false;
      state.PostDataResponse = action.payload;
    },
    sampleFileDetails: (state, action) => {
      state.sampleFileResponse = action.payload;
    },
    sumInsuredDetails: (state, action) => {
      state.sumInsuredResponse = action.payload;
    },
    sumInsuredCleanUp: (state, action) => {
      state.sumInsuredResponse = {};
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    clear: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      switch (payload) {
        case 'broker':
          state.getEmployereDataResponse = [];
          state.PolicySubTypeDataResponse = {};
          state.PolicyNumberDataResponse = {};
          state.sumInsuredResponse = {};
          break
        case 'employer':
          state.PolicySubTypeDataResponse = {};
          state.PolicyNumberDataResponse = {};
          state.sumInsuredResponse = {};
          break
        case 'policy-type':
          state.PolicyNumberDataResponse = {};
          state.sumInsuredResponse = {};
          break
        case 'policy-no':
          state.sumInsuredResponse = {};
          break
        case 'endorsedMemberSuccess':
          state.endorsedMemberSuccess = null;
          break
        default:
      }
    },
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
    error: (state, { payload }) => {
      let message = " "
      if (typeof payload === 'string')
        message = payload;
      else if (typeof payload === 'object') {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }

      state.loading = null;
      state.error = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
      state.success = null;
    },
    clearState: (state) => {
      state.error = null;
      state.success = null;
    },
    dynamicKeys: (state, { payload = [] }) => {
      state.dynamicKeys = payload;
      state.loading = false
    },
    templates: (state, { payload }) => {
      state.templates = payload;
      state.loading = false
    },
    EndorsementDetails: (state, { payload }) => {
      state.EndorsementDetails = payload;
      state.loading = false
    },
    endorsedMemberSuccess: (state, { payload }) => {
      state.endorsedMemberSuccess = payload;
      state.loading = false
    },
    ErrorSheetData: (state, { payload }) => {
      state.ErrorSheetData = payload.map((elem) => ({
        ...elem,
        uploaded_at: DateFormate(elem.uploaded_at, { type: 'withTime' })
      }));
    },
    ErrorSheetDataTPA: (state, { payload }) => {
      state.ErrorSheetDataTPA = payload.map((elem) => ({
        ...elem,
        uploaded_at: DateFormate(elem.uploaded_at, { type: 'withTime' })
      }));
      state.loading = false
    },
    // template: (state, { payload }) => {
    //   state.template = payload;
    //   state.loading = false
    // },
    loading1: (state, { payload = true }) => {
      state.loading1 = payload;
    },
    setPageData: (state, { payload }) => {
      state.firstPage = payload.firstPage;
      state.lastPage = payload.lastPage;
    },
  },
});

export const {
  getEmployerDetails,
  getPolicySubTypeDetails,
  getPolicyNumberDetails,
  postMember,
  sampleFileDetails,
  sumInsuredDetails,
  sumInsuredCleanUp,
  broker,
  clear,
  loading,
  success,
  error,
  clearState,
  dynamicKeys,
  templates,
  EndorsementDetails,
  endorsedMemberSuccess,
  ErrorSheetData,
  ErrorSheetDataTPA,
  loading1,
  setPageData
  // template
} = endorsementRequest.actions;

//Action Creators
export const getEmployereData = (payload, pageNo, perPage, isClearData = true) => {
  return async (dispatch) => {
    try {
      if (isClearData) {
        dispatch(clear('employer'))
      }
      dispatch(loading())
      const { data, message, errors } = await getEmployerNameData(payload, pageNo, perPage);
      if (data.data) {
        dispatch(getEmployerDetails({ data: data.data || [], isNew: !pageNo || pageNo === 1 }));
        dispatch(setPageData({
          firstPage: data.current_page + 1,
          lastPage: data.last_page,
        }))
        if (data.current_page === data.last_page) {
          dispatch(loading(false))
        }
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (error) {
      console.error(error)
    }
  };
};

export const getPolicySubTypeData = (data) => {
  return async (dispatch) => {
    try {
      dispatch(clear('policy-type'))
      const PolicySubTypeDataResponse = await getPolicySubType(data);
      if (PolicySubTypeDataResponse.data) {
        dispatch(getPolicySubTypeDetails(PolicySubTypeDataResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};

export const getPolicyNumberData = (data, url) => {
  return async (dispatch) => {
    try {
      dispatch(clear('policy-no'))
      const PolicyNumberDataResponse = await getPolicyNumber(data, url);

      if (PolicyNumberDataResponse.data) {
        dispatch(getPolicyNumberDetails(PolicyNumberDataResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};

export const postMemberDetails = (data, is_new) => {
  return async (dispatch) => {
    try {
      dispatch(loading1(true));
      const PostDataResponse = await (is_new ? postMemberDataNew : postMemberData)(data);
      if (PostDataResponse.data) {
        dispatch(postMember(PostDataResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};

export const postICMemberDetails = (data) => {
  return async (dispatch) => {
    try {
      const PostDataResponse = await postICMemberData(data);

      if (PostDataResponse.data) {
        dispatch(postMember(PostDataResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};
//
export const getSampleFile = (url) => {
  return async (dispatch) => {
    try {
      const sampleFileResponse = await sampleFile(url);
      if (sampleFileResponse.data) {

        dispatch(sampleFileDetails(sampleFileResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};

// export const getDynamicFile = (key, payload) => {
//   return async (dispatch) => {
//     try {
//       let sampleFileResponse = { data: null };
//       if (payload.policy_id) {
//         sampleFileResponse = await dynamicFile(payload);
//       }
//       if (sampleFileResponse.data?.data && sampleFileResponse.data?.data[0]?.upload_path) {
//         dispatch(sampleFileDetails(sampleFileResponse));
//       } else {
//         dispatch(getSampleFile(key));
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   };
// };
export const getDynamicFile = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await dynamicFile(payload);
      if (data.data) {
        dispatch(sampleFileDetails(data));
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getSumInsured = (data) => {
  return async (dispatch) => {
    try {
      const sumInsuredResponse = await sumInsured(data);

      if (sumInsuredResponse.data) {
        dispatch(sumInsuredDetails(sumInsuredResponse));
      } else {
        console.error("sumInsured API failed");
      }

    } catch (error) {
      console.error(error)
    }
  };
};

// Admin Get Broker

export const loadBroker = (userType) => {
  return async dispatch => {
    try {
      dispatch(clear('broker'))
      const { data } = await adminGetBroker(userType);
      if (data.data) {
        dispatch(broker(data.data));
      } else {
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
    }
  }
};


export const loadDynamicKeys = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, dynamicKeys, error, sheetKeys, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}


export const createSheet = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, createSheetTemplate, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const updateSheetTemplate = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await editSheetTemplate(payload);
      if (data.status) {
        payload.status === undefined ? dispatch(success(message)) :
          dispatch(loadTemplates())
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const deleteTemplate = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, removeTemplate, { template_id: payload });
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}


export const loadTemplates = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getTemplates(payload);
      if (data.data) {
        // if (payload) {
        //   dispatch(template(data.data));
        // } else {
        dispatch(templates(data.data?.map((elem) => ({
          ...elem,
          created_at: DateFormate(elem.created_at)
        }))));
        // }
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const getEndorsementDetails = (type, userType, is_super_hr, employer_id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getEndorsementDetail(type, userType, is_super_hr, employer_id);
      if (data.data) {
        // if (payload) {
        //   dispatch(template(data.data));
        // } else {
        dispatch(EndorsementDetails(data.data.map((elem) => ({ ...elem, dobFormated: DateFormate(elem.dob), ...elem.marriage_date && { marriage_date_formated: DateFormate(elem.marriage_date) } }))));
        // }
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const endorsedMemberApproveReject = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await EndorsedMemberApproveReject(payload);
      if (data.status) {
        dispatch(endorsedMemberSuccess(data.message));

      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const createEndorsementDeficiency = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await CreateEndorsementDeficiency(payload);
      if (data.status) {
        dispatch(success(data.message));

      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const getErrorSheetData = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await GetErrorSheetData(payload);
      if (data.status) {
        dispatch(ErrorSheetData(data.data.map(elem => ({ ...elem, source_name: elem.source_id === 1 ? 'EB Portal' : 'TPA' }))));
      }
      else {
        // dispatch(error(message || errors));
        console.error(message, errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const getDynamicFileTPA = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await GetDynamicFileTPA(payload);
      if (data.data) {
        dispatch(sampleFileDetails(data));
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const postMemberDetailsTPA = (data) => {
  return async (dispatch) => {
    try {
      const PostDataResponse = await postMemberDataTPA(data);

      if (PostDataResponse.data) {
        dispatch(postMember(PostDataResponse));
      } else {
      }

    } catch (error) {
      console.error(error)
    }
  };
};


export const getErrorSheetDataTPA = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await GetErrorSheetDataTPA(payload);
      if (data.status) {
        dispatch(ErrorSheetDataTPA(data.data));
      }
      else {
        // dispatch(error(message || errors));
        console.error(message, errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}
export async function Fetch(renderType, setTpaList, setTpaid, tpaidOnUpdateModal) {
  if (!renderType) {
    try {
      const { data } = await getTPAFetch();
      const refactorList = data.data.map((data) => ({
        id: data.id,
        name: data.name,
        value: data.id,
      }));
      setTpaList(tpaList => refactorList)
    } catch (err) {
      console.error(err.message);
    }
  }
  if (renderType) {
    try {
      const { data } = await getTPAFetch();
      const refactorList = data.data.map((data) => ({
        id: data.id,
        name: data.name,
        value: data.id,
      }));
      setTpaList(tpaList => refactorList)
      setTpaid(tpa_id => tpaidOnUpdateModal);
    } catch (err) {
      console.error(err.message);
    }
  }
}

export const loadErrorSheetURL = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await GetErrorSheetURL(payload);
      if (data.status) {
        downloadFile(data.error_report_url)
        dispatch(loading(false));
      }
      else {
        console.error(message, errors);
        dispatch(loading(false));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
      dispatch(loading(false));
    }
  };
}
//Selectors
export const selectEmployerResponse = (state) =>
  state?.endorsementRequest?.getEmployereDataResponse;
export const selectPostResponse = (state) => state?.endorsementRequest?.PostDataResponse;
export const selectPolicySubType = (state) =>
  state?.endorsementRequest?.PolicySubTypeDataResponse;
export const selectPolicyNumber = (state) =>
  state?.endorsementRequest?.PolicyNumberDataResponse;
export const selectSampleFileResponse = (state) =>
  state?.endorsementRequest?.sampleFileResponse;
export const selectSumInsured = (state) =>
  state?.endorsementRequest?.sumInsuredResponse;

export default endorsementRequest.reducer;
