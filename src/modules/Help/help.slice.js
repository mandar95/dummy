import { createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert";
import { actionStructre, downloadFile, serializeError } from "utils";
import {
  getBrokerFAQ,
  getEmployer,
  getSubTypePolicy,
  postBrokerFAQ,
  downloadSample,
  getQueriesComplaint,
  replyQueriesComplaint,
  updateBrokerFAQ,
  deleteBrokerFAQ,
  getFeedBackBroker,
  getEmployerFAQs,
  getEmployerQueries,
  getEmployerFeedBack,
  replyEmployeeQuery,
  adminGetBroker,
  submitCustomerFeedback,
  getCustomerQuery,
  getCustomerSubQuery,
  submitQuery,
  getCustomerQueries,
  getCustomerFaq,

  submitInsurerQueriesType,
  getInsurerQueriesType,
  deleteInsurerQueriesType,
  editInsurerQueriesType,
  updateInsurerQueriesType,

  submitInsurerSubQueriesType,
  getInsurerQueriesSubType,
  deleteInsurerSubQueriesType,
  updateInsurerSubQueriesType,

  getInsurerQuery,
  createMaterQuery,
  createMaterSubQuery,
  updateQuery,
  getInsurerFeedback,

  getInsurerFaq,
  createInsurerFaq,
  createInsurerFaqXls,
  deleteInsurerFaq,
  editInsurerFaq,
  updateInsurerFaq,
  GetOrganizationQuery,
  CreateOrgQueries,
  GetInsOrganizationQuery,
  CreateInsOrgQueries,
  GetEmpOrganizationQuery,
  CreateEmpOrgQueries,
  downloadMasterType,
  getQueriesMasterTypeData,
  downloadFeedback,

  saveEscalationMatrix,
  loadEscalationMatrix,
  deleteEscalationMatrix,
  updateEscalationMatrix

} from './help.service';

import EmployeeServices from './EmployeeHelp/help.service';
import { EndLevel, StartLevel } from "./broker-help/escalation-matrix/EscalationMatrixModal";

export const helpSlice = createSlice({
  name: "help",
  initialState: {
    loading: false,
    error: null,
    success: null,
    Querysuccess: null,
    SubQuerysuccess: null,
    UpdateQuerysuccess: null,
    broker_faq: [],
    employer: [],
    sub_type_policy: [],
    sampleURL: null,
    queries_complaint: [],
    broker_feedback: [],
    employerFAQs: [],
    employerQueries: [],
    employerFeedback: [],
    broker: [],
    /* Employee States */
    policySubTypeAcronym: [],
    employee_query_type: [],
    employee_query_subtype: [],
    employee_queries: [],
    employee_faqs: [],
    employee_query: "",
    employee_subQuery: "",
    employee_comments: "",
    employee_ratings: null,
    employee_feedback: "",
    subQueryTypeData: [],
    queryTypeData: [],
    customerQueriesData: [],
    insurerQueriesTypeData: [],
    editInsurerTypeData: {},
    insurerUpdateQueryType: null,
    insurerQueriesSubTypeData: [],
    insurerUpdateSubQueryType: null,
    insurerQueryData: [],
    customerFAQData: [],
    insurerFeedbackData: [],

    insurerFaq: [],
    createInsFaq: null,
    editInsFaq: [],
    updateInsFaq: null,
    org_queries_complaint: [],
    ins_org_queries_complaint: [],
    emp_org_queries_complaint: [],
    allQueryMasterType: [],
    escalationMatrix: []
  },
  reducers: {
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    Querysuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.Querysuccess = payload;
    },
    SubQuerysuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.SubQuerysuccess = payload;
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
    clear: (state, { payload }) => {
      state.error = null;
      state.success = null;
      state.loading = null;
      state.UpdateQuerysuccess = null;
      switch (payload) {
        case "insurer-query-type":
          state.insurerUpdateQueryType = null;
          break;
        case "insurer-sub-query-type":
          state.insurerUpdateSubQueryType = null;
          break;
        case "Ins":
          state.createInsFaq = null;
          break;
        case "update-Ins":
          state.updateInsFaq = null;
          break;
        default:
          break;
      }
    },
    broker_faq: (state, { payload }) => {
      state.broker_faq = payload;
    },
    clear_broker_faq: (state) => {
      state.broker_faq = [];
    },
    employer: (state, { payload }) => {
      state.employer = payload;
    },
    clearEmployer: (state) => {
      state.employer = [];
    },
    sub_type_policy: (state, { payload }) => {
      state.sub_type_policy = payload;
    },
    clear_sub_type_policy: (state) => {
      state.sub_type_policy = [];
    },
    sampleURL: (state, { payload }) => {
      state.sampleURL = payload;
    },
    clearSampleURL: (state) => {
      state.sampleURL = null;
    },
    queries_complaint: (state, { payload }) => {
      state.queries_complaint = payload;
    },
    clear_queries_complaint: (state) => {
      state.queries_complaint = [];
    },
    broker_feedback: (state, { payload }) => {
      state.broker_feedback = payload;
    },
    clear_broker_feedback: (state) => {
      state.broker_feedback = [];
    },
    employer_FAQs: (state, action) => {
      state.employerFAQs = action.payload;
    },
    employer_Queries: (state, action) => {
      state.employerQueries = action.payload;
    },
    employer_Feedback: (state, action) => {
      state.employerFeedback = action.payload;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    setPolicySubTypeAcronym: (state, action) => {
      state.policySubTypeAcronym = action.payload;
    },
    setQueryTypeForEmployee: (state, action) => {
      state.employee_query_type = action.payload;
    },
    setQuerySubTypeForEmployee: (state, action) => {
      state.employee_query_subtype = action.payload;
    },
    setQueriesForEmployee: (state, action) => {
      state.employee_queries = action.payload;
    },
    setFAQsForEmployee: (state, action) => {
      state.employee_faqs = action.payload;
    },
    setEmployeeQuery: (state, action) => {
      state.employee_query = action.payload;
    },
    setEmployeeSubQuery: (state, action) => {
      state.employee_subQuery = action.payload;
    },
    setEmployeeComments: (state, action) => {
      state.employee_comments = action.payload;
    },
    setEmployeeRatings: (state, action) => {
      state.employee_ratings = action.payload;
    },
    setEmployeeFeedback: (state, action) => {
      state.employee_feedback = action.payload;
    },
    resetEmployeeQuery: (state) => {
      state.employee_query = "";
      state.employee_subQuery = "";
      state.employee_comments = "";
      state.loading = false
    },
    resetEmployeeFeedback: (state, action) => {
      state.employee_ratings = null;
      state.employee_feedback = "";
    },
    queryType: (state, { payload }) => {
      state.queryTypeData = payload;
    },
    subQueryType: (state, { payload }) => {
      state.subQueryTypeData = payload;
    },
    customerQueries: (state, { payload }) => {
      state.customerQueriesData = payload;
      state.loading = null;
    },
    insurerQueriesType: (state, { payload }) => {
      state.insurerQueriesTypeData = payload;
      state.loading = null;
    },
    EditInsurerQueryType: (state, { payload }) => {
      state.editInsurerTypeData = payload;
    },
    UpdateInsurerQueryType: (state, { payload }) => {
      state.insurerUpdateQueryType = payload;
    },
    insurerQueriesSubType: (state, { payload }) => {
      state.insurerQueriesSubTypeData = payload;
      state.loading = null;
    },
    UpdateInsurerSubQueryType: (state, { payload }) => {
      state.insurerUpdateSubQueryType = payload;
    },
    insurerQuery: (state, { payload }) => {
      state.insurerQueryData = payload;
      state.loading = null;
    },
    customerFAQ: (state, { payload }) => {
      state.customerFAQData = payload;
      state.loading = null;
    },
    UpdateQuerysuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.UpdateQuerysuccess = payload;
    },
    insurerFeedback: (state, { payload }) => {
      state.insurerFeedbackData = payload;
      state.loading = null;
    },
    insurerFaq: (state, { payload }) => {
      state.insurerFaq = payload;
    },
    createInsFaq: (state, { payload }) => {
      state.createInsFaq = payload;
    },
    editInsFaq: (state, { payload }) => {
      state.editInsFaq = payload;
    },
    updateInsFaq: (state, { payload }) => {
      state.updateInsFaq = payload;
    },
    org_queries_complaint: (state, { payload }) => {
      state.org_queries_complaint = payload;
    },
    ins_org_queries_complaint: (state, { payload }) => {
      state.ins_org_queries_complaint = payload;
    },
    emp_org_queries_complaint: (state, { payload }) => {
      state.emp_org_queries_complaint = payload;
    },
    getAllQueryMasterType: (state, { payload }) => {
      state.allQueryMasterType = payload;
      state.loading = false;
    },
    escalationMatrix: (state, { payload }) => {
      state.escalationMatrix = payload;
      state.loading = false;
    }
  }
});

export const {
  loading, success, error, clear,
  broker_faq, employer, sub_type_policy,
  sampleURL, queries_complaint,
  clear_broker_faq, clear_queries_complaint,
  clearEmployer, clear_sub_type_policy,
  broker_feedback, clear_broker_feedback,
  clearSampleURL, employer_FAQs, employer_Queries,
  employer_Feedback, broker,
  setPolicySubTypeAcronym,
  setQueryTypeForEmployee,
  setQuerySubTypeForEmployee,
  setQueriesForEmployee,
  setFAQsForEmployee,
  setEmployeeQuery,
  setEmployeeSubQuery,
  setEmployeeComments,
  setEmployeeRatings,
  setEmployeeFeedback,
  resetEmployeeQuery,
  resetEmployeeFeedback,
  queryType,
  subQueryType,
  customerQueries,
  insurerQueriesType,
  EditInsurerQueryType,
  UpdateInsurerQueryType,
  insurerQueriesSubType,
  UpdateInsurerSubQueryType,
  insurerQuery,
  Querysuccess,
  SubQuerysuccess,
  customerFAQ,
  UpdateQuerysuccess,
  insurerFeedback,
  insurerFaq,
  createInsFaq,
  editInsFaq,
  updateInsFaq,
  org_queries_complaint,
  ins_org_queries_complaint,
  emp_org_queries_complaint,
  getAllQueryMasterType,
  escalationMatrix
} = helpSlice.actions;

//---------- Action creators ----------//

// Get Broker FAQ

export const loadBrokerFAQ = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getBrokerFAQ();
      dispatch(clear());
      if (data.data) {
        dispatch(broker_faq(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Get Employer

export const loadEmployer = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await getEmployer();
      if (data.data) {
        dispatch(employer(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Get Sub Type Policy

export const loadSubTypePolicy = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data: data1 } = await getSubTypePolicy(1);
      const { data: data2 } = await getSubTypePolicy(2);
      if (data1.data && data2.data) {
        dispatch(sub_type_policy([...data1.data, ...data2.data]));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

// Post Broker FAQ

export const saveBrokerFAQ = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await postBrokerFAQ(payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadBrokerFAQ());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Sample File Broker FAQ

export const sampleFile = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await downloadSample({
        sample_type_id: payload,
      });
      if (data) {
        dispatch(sampleURL(data?.data[0].upload_path));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Update Broker FAQ

export const editBrokerFAQ = (payload, id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await updateBrokerFAQ(id, payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadBrokerFAQ());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Delete Broker FAQ

export const removeBrokerFAQ = (id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await deleteBrokerFAQ(id);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadBrokerFAQ());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Get Queries & Complaints

export const loadQueriesComplaint = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await getQueriesComplaint(payload);
      if (data.data) {
        dispatch(clear());
        dispatch(queries_complaint(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

// Get Queries & Complaints

export const replyQueries = (payload, id, userType, employerId, currentUser) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await replyQueriesComplaint(id, payload);
      if (data.status === true) {
        dispatch(success(data.message));
        // broker
        if (userType === "broker") {
          if (typeof (currentUser) === "undefined") { dispatch(loadQueriesComplaint(employerId)); }
          else { dispatch(getOrganizationQuery()); }
        }
        //employer
        if (userType === "employer") {
          if (typeof (currentUser) === "undefined") { dispatch(EmployerQueries()); }
          else { dispatch(getEmpOrganizationQuery()); }
        }
        //insurer
        if (userType === "insurer" && typeof (currentUser) !== "undefined") { dispatch(getInsOrganizationQuery()); }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

// Get FeedBack Broker

export const loadFeedBackBroker = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getFeedBackBroker(id);
      if (data.data) {
        dispatch(clear());
        dispatch(broker_feedback(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

// Admin Get Broker

export const loadBroker = (userTypeName) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await adminGetBroker(userTypeName);
      dispatch(clear());
      if (data.data) {
        dispatch(broker(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  };
};

/* ______________________________________________Employer Actions__________________________________________________________ */

export const EmployerFAQs = (is_super_hr) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await getEmployerFAQs(is_super_hr);
      if (data.data.length > -1 && Array.isArray(data.data)) {
        dispatch(clear());
        dispatch(employer_FAQs(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const EmployerQueries = (is_super_hr) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await getEmployerQueries(is_super_hr);
      if (data.status) {
        dispatch(clear());
        dispatch(employer_Queries(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const EmployerQueryResolve = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await replyEmployeeQuery(id, payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(EmployerQueries());
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const EmployerFeedback = (is_super_hr) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await getEmployerFeedBack(is_super_hr);
      if (data.status) {
        dispatch(clear());
        dispatch(employer_Feedback(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

/*------------------------Employee Help Slice-------------------------------------------*/

const ImageData = {
  1: "/assets/images/gmc.png",
  2: "/assets/images/gpa.png",
  3: "/assets/images/termlife.png",
  4: "/assets/images/gmctop.png",
  5: "/assets/images/gpatop.png",
  6: "/assets/images/termlife.png",
};

// function Acronym(str) {
//   let acronym = str.split(/\s/).reduce((acc, cur) => {
//     if (cur !== "Top" && cur !== "Up") {
//       acc += cur.slice(0, 1);
//     } else {
//       acc = acc + " " + cur;
//     }
//     return acc;
//   }, "");
//   return acronym;
// }

export const getPolicySubTypeAcronym = () => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.policySubType();
      let policySubType = [...response[0].data.data, ...response[1].data.data];
      // abhi changes
      // let policySubTypeAcronym = policySubType.filter((v) => ![3, 6].includes(v.id)).map((v) => ({
      let policySubTypeAcronym = policySubType.map((v) => ({
        id: v.id,
        name: v.name,
        image: ImageData[v.id],
      }));

      if (!!policySubTypeAcronym) {
        dispatch(setPolicySubTypeAcronym(policySubTypeAcronym));
      }
    } catch (error) { }
  };
};

export const getFAQByPolicyId = (policyId) => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.getFAQByPolicy(policyId);
      if (response?.data?.data) {
        dispatch(setFAQsForEmployee(response?.data?.data));
      }
    } catch (error) { }
  };
};

// Download Report
// export const dowloadMasterQueryReport = async ( payload, onHide) => {
//   downLoadReportRequest()
//   try {
//     const { data, message, errors } = await downloadMasterType(payload);
//     if (data?.data?.download_report) {
//       onHide();
//       downloadFile(data?.data?.download_report);
//     }
//     else {
//       swal("Alert", serializeError(message || errors), 'info');
//     }
//   }
//   catch (error) {
//     // console.error(error);
//     // dispatch({ type: 'LOADING', payload: false });
//   }
// }

export const dowloadMasterQueryReport = (payload, onHide) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const { data, message, errors } = await downloadMasterType(payload);
      if (data?.data?.download_report) {
        onHide();
        downloadFile(data?.data?.download_report);
        dispatch(loading(false))
      }
      else {
        swal("Alert", serializeError(message || errors), 'info');
        dispatch(loading(false))
      }
    }
    catch (error) {
      dispatch(loading(false))
      // console.error(error);
      // dispatch({ type: 'LOADING', payload: false });
    }
  }
}

// Download Feedback
export const downloadFeedbackReport = (payload, onHide) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const { data, message, errors } = await downloadFeedback(payload);
      if (data?.data?.download_report) {
        onHide();
        downloadFile(data?.data?.download_report);
        dispatch(loading(false))
      }
      else {
        swal("Alert", serializeError(message || errors), 'info');
        dispatch(loading(false))
      }
    }
    catch (error) {
      dispatch(loading(false))
      // console.error(error);
      // dispatch({ type: 'LOADING', payload: false });
    }
  }
}


export const getQueryType = () => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.getQueryType();
      if (!!response?.data?.data) {
        dispatch(setQueryTypeForEmployee(response?.data?.data));
      }
    } catch (error) { }
  };
};

export const getQuerySubType = (payload) => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.getQuerySubType(payload);
      if (!!response?.data?.data) {
        dispatch(setQuerySubTypeForEmployee(response?.data?.data));
      }
    } catch (error) { }
  };
};

export const getQueries = () => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.getQueries();
      if (response?.data?.data) {
        dispatch(setQueriesForEmployee(response?.data?.data));
      }
    } catch (error) { }
  };
};

export const createQueries = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      let response = await EmployeeServices.createQueries(payload);
      if (response.success) {
        swal(response.data.message, "", "success").then(() => {
          dispatch(getQueries());
          dispatch(resetEmployeeQuery());
        });
      } else {
        swal("Submission failed", "", "warning");
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

export const submitFeedback = (payload) => {
  return async (dispatch) => {
    try {
      let response = await EmployeeServices.submitFeedback(payload);
      if (response.success) {
        swal(response.data.message, "", "success").then(() => {
          dispatch(resetEmployeeFeedback());
        });
      } else {
        swal("Submission failed", "", "warning");
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

/*---------------------------------------------------------------------------------------*/

/* _________________________________________________Customer_____________________________________________________ */

export const SubmitCustomerFeedback = (payload) => {
  return async (dispatch) => {
    try {
      let response = await submitCustomerFeedback(payload);
      if (response.success) {
        dispatch(success(response.data.message));
      } else {
        dispatch(error(response.data.message || response.data.errors));
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

export const getCustomerQueryType = () => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, queryType, error, getCustomerQuery);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getCustomerSubQueryType = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, subQueryType, error, getCustomerSubQuery, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const submitCustomerQuery = (queryData) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await submitQuery(
        queryData
      );
      if (data.status) {
        dispatch(success(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getAllCustomerQueries = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, customerQueries, error, getCustomerQueries);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getCustomerFAQ = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, customerFAQ, error, getCustomerFaq, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

/*___________________________________________________________________________________________________________________________ */

/* _________________________________________________Insurer_____________________________________________________ */

export const submitInsurerQueryType = (queryData) => {
  return async (dispatch) => {
    try {
      const {
        data,
        message,
        errors
      } = await submitInsurerQueriesType(queryData);
      if (data.status) {
        dispatch(success(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getAllInsurerQueriesType = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, insurerQueriesType, error, getInsurerQueriesType, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteInsurerQueryType = (id) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, success, error, deleteInsurerQueriesType, id);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const editInsurerQueryType = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(
        dispatch,
        EditInsurerQueryType,
        error,
        editInsurerQueriesType,
        data
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateInsurerQueryType = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors, success } = await updateInsurerQueriesType(
        id,
        payload
      );
      if (data.data || success) {
        dispatch(UpdateInsurerQueryType(message || data.data));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const submitInsurerQuerySubType = (queryData) => {
  return async (dispatch) => {
    try {
      const {
        data,
        message,
        errors
      } = await submitInsurerSubQueriesType(queryData);
      if (data.status) {
        dispatch(success(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getAllInsurerQueriesSubType = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(
        dispatch,
        insurerQueriesSubType,
        error,
        getInsurerQueriesSubType,
        data
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteInsurerSubQueryType = (id) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, success, error, deleteInsurerSubQueriesType, id);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateInsurerSubQueryType = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors, success } = await updateInsurerSubQueriesType(
        id,
        payload
      );
      if (data.data || success) {
        dispatch(UpdateInsurerSubQueryType(message || data.data));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getAllInsurerQuery = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, insurerQuery, error, getInsurerQuery, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//FAQ
export const getInsFaq = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, insurerFaq, error, getInsurerFaq, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const createINSFaq = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, createInsFaq, error, createInsurerFaq, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const createINSFaqXls = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, createInsFaq, error, createInsurerFaqXls, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteInsFaq = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, createInsFaq, error, deleteInsurerFaq, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const editINSFaq = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, editInsFaq, error, editInsurerFaq, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateINSFaq = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await updateInsurerFaq(id, payload);
      if (data.status) {
        dispatch(updateInsFaq(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const CreateMaterQuery = (masterData) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await createMaterQuery(
        masterData
      );
      if (data.status) {
        dispatch(Querysuccess(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const CreateMaterSubQuery = (masterData) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await createMaterSubQuery(
        masterData
      );
      if (data.status) {
        dispatch(SubQuerysuccess(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const UpdateQuery = (id, queryData) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await updateQuery(id, queryData);
      if (data.status) {
        dispatch(UpdateQuerysuccess(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
}

export const getAllInsurerFeedback = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, insurerFeedback, error, getInsurerFeedback, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};


//Masters Queries
export const fetchQueryMasterTypes = () => {
  return async (dispatch) => {
    try {
      const { data } = await getQueriesMasterTypeData();
      if (data.status) {
        dispatch(getAllQueryMasterType(data.data));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
}

/* _________________________________________________Insurer_____________________________________________________ */

export const getOrganizationQuery = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await GetOrganizationQuery();
      if (data.data) {
        dispatch(clear());
        dispatch(org_queries_complaint(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const createOrgQueries = (payload) => {
  return async (dispatch) => {
    try {
      let response = await CreateOrgQueries(payload);
      if (response.success) {
        swal(response.data.message, "", "success").then(() => {
          dispatch(getOrganizationQuery());
          // dispatch(resetEmployeeQuery());
        });
      } else {
        swal("Submission failed", "", "warning");
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

export const getInsOrganizationQuery = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await GetInsOrganizationQuery();
      if (data.data) {
        dispatch(clear());
        dispatch(ins_org_queries_complaint(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const createInsOrgQueries = (payload) => {
  return async (dispatch) => {
    try {
      let response = await CreateInsOrgQueries(payload);
      if (response.success) {
        swal(response.data.message, "", "success").then(() => {
          dispatch(getInsOrganizationQuery());
          // dispatch(resetEmployeeQuery());
        });
      } else {
        swal("Submission failed", "", "warning");
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

export const getEmpOrganizationQuery = (is_super_hr) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await GetEmpOrganizationQuery(is_super_hr);
      if (data.data) {
        dispatch(clear());
        dispatch(emp_org_queries_complaint(data.data));
      } else {
        dispatch(error("warning"));
      }
    } catch (err) {
      dispatch(error("Something went wrong Here"));
    }
  };
};

export const createEmpOrgQueries = (payload) => {
  return async (dispatch) => {
    try {
      let response = await CreateEmpOrgQueries(payload);
      if (response.success) {
        swal(response.data.message, "", "success").then(() => {
          dispatch(getEmpOrganizationQuery());
          // dispatch(resetEmployeeQuery());
        });
      } else {
        swal("Submission failed", "", "warning");
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
    }
  };
};

export const loadSubPolicies = (employee_id, employer_id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      let { data, message, error } = await EmployeeServices.loadSubPolicy(employee_id, employer_id);
      if (data.data) {

        let policySubTypeAcronym = [];

        data.data.forEach(({ policy_sub_type_name, policy_sub_type_id }) => {
          if (!policySubTypeAcronym.some(({ id }) => id === policy_sub_type_id)) {
            policySubTypeAcronym.push({
              name: policy_sub_type_name,
              id: policy_sub_type_id,
              image: ImageData[policy_sub_type_id],
            })
          }
        })

        policySubTypeAcronym.sort(function (a, b) {
          return a?.id - b?.id;
        });

        // policySubTypeAcronym = policySubTypeAcronym?.map((v) => ({
        //   id: v.id,
        //   name: v.name,
        //   image: ImageData[v.id],
        // })) || [];

        if (!!policySubTypeAcronym) {
          dispatch(setPolicySubTypeAcronym(policySubTypeAcronym));
        }
        dispatch(loading(false));
      } else {
        console.error(message, error)
        dispatch(loading(false));
      }
    } catch (error) {
      console.error(error)
      dispatch(loading(false));
    }
  };
};

export const createEscalationMatrix = (payload, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading())
      const { data, message, errors } = await saveEscalationMatrix(payload);
      if (data.status) {
        swal(message, "", "success").then(() => {
          dispatch(getEscalationMatrix({ employer_id: payload.employer_id }))
          dispatch(loading(false))
          onHide && onHide()
        });
      } else {
        swal("Alert", serializeError(message || errors), "warning");
        dispatch(loading(false))
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
      dispatch(loading(false))
    }
  };
};
export const getEscalationMatrix = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading())
      const { data, message, errors } = await loadEscalationMatrix(payload);
      if (data.status) {
        dispatch(escalationMatrix(data.data.map(elem => ({
          ...elem,
          start_level_name: StartLevel.find(({ id }) => id === elem.start_level)?.name || '-',
          end_level_name: EndLevel.find(({ id }) => id === elem.end_level)?.name || '-'
        }))));
      } else {
        dispatch(loading(false))
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (error) {
      dispatch(loading(false))
      swal("Something went wrong", "", "warning");
    }
  };
};
export const reviseEscalationMatrix = (id, payload, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading())
      const { data, message, errors } = await updateEscalationMatrix(id, payload);
      if (data.status) {
        swal(message, "", "success").then(() => {
          dispatch(getEscalationMatrix({ employer_id: payload.employer_id }))
          dispatch(loading(false))
          onHide && onHide()
        });
      } else {
        swal("Alert", serializeError(message || errors), "warning");
        dispatch(loading(false))
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
      dispatch(loading(false))
    }
  };
};
export const removeEscalationMatrix = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading())
      const { data, message, errors } = await deleteEscalationMatrix(payload.id);
      if (data.status) {
        swal(message, "", "success").then(() => {
          dispatch(getEscalationMatrix({ employer_id: payload.employer_id }))
          dispatch(loading(false))
        });
      } else {
        swal("Alert", serializeError(message || errors), "warning");
        dispatch(loading(false))
      }
    } catch (error) {
      swal("Something went wrong", "", "warning");
      dispatch(loading(false))
    }
  };
};

export const help = (state) => state.help;

export const cleanup = (dispatch) => {
  dispatch(clear());
};

export default helpSlice.reducer;
