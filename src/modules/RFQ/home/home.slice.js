import { createSlice } from "@reduxjs/toolkit";
import service from "./home.service";
import { serializeError, actionStructre } from "../../../utils";
import _ from "lodash";
import { DefaultValue } from "./steps";

export const homeSlice = createSlice({
  name: "RFQhome",
  initialState: {
    loading: false,
    planLoading: true,
    pincodeLoading: false,
    topupLoading: true,
    configDataload: true,
    configuredDataload: true,
    customerDataLoad: false,
    error: null,
    success: null,
    otpSuccess: null,
    enquiry_id: null,
    utm_approved: null,
    company_data: {
      member_details: [
        {
          age_group: "0-17",
          min_age: 0,
          max_age: 17,
          sum_insured: "50000",
          no_of_dependant: 0,
          no_of_employees: 10,
        },
        // { age_group: "26-35", min_age: 26, max_age: 35, sum_insured: "100000", no_of_memebers: 0 },
        // { age_group: "36-45", min_age: 36, max_age: 45, sum_insured: "200000", no_of_memebers: 0 },
        // { age_group: "46-55", min_age: 46, max_age: 55, sum_insured: "300000", no_of_memebers: 2 },
        // { age_group: "56-65", min_age: 56, max_age: 65, sum_insured: "400000", no_of_memebers: 2 },
        // { age_group: "66-75", min_age: 66, max_age: 75, sum_insured: "500000", no_of_memebers: 2 }
      ],
      no_of_employees: 10,
    },
    statecity: {},
    industry_data: {},
    TopUP_Data: [],
    uw: [],
    uwSingle: [],
    // isUw: "",
    customizeplan: [],
    employee_sheet_data: { total_employees: 0, data: [] },
    singleplan: [],
    plansave: null,
    members_data: [],
    finalsave: null,
    widgets: {},
    create_bucket: null,
    buckets: [],
    bucketEdit: [],
    bucketUpdate: null,
    industries: [],
    reports: null,
    replace: null,
    replaceUpdate: null,
    broker: [],
    insurer: [],
    ageGroupData: [],
    sumInsuredData: [],
    relationListData: [],
    quotes: [],
    quotesCopy: [],
    postplan: null,
    updatedLeadData: null,
    completeQuoteLoading: null,
    totallives: null,
    filterData: [],
    sorting: "insurance",
    logo: '',
    QuoteSlip: null,
    callbackSuccess: null,
    inviteSuccess: null,
    Sheetsuccess: null,
    RFQDataCount: [],
    QuoteSlipData: null,
    GetQuoteSlipData: [],
    qouteUpdateSuccess: null,
    downloadQuoteResponse: null,
    emailSuccess: null
  },
  reducers: {
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
    },
    setPlanLoading: (state) => {
      state.planLoading = true;
      state.error = null;
      state.success = null;
    },
    setTopUpLoading: (state) => {
      state.topupLoading = true;
      state.error = null;
      state.success = null;
    },
    pincodeLoading: (state) => {
      state.pincodeLoading = true;
      state.error = null;
      state.success = null;
    },
    setLoad: (state, { payload }) => {
      state[payload.key] = payload.value;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.pincodeLoading = null;
      state.error = null;
      state.success = payload;
    },
    otpSuccess: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.otpSuccess = payload;
    },
    error: (state, { payload }) => {
      state.loading = null;
      state.pincodeLoading = null;
      state.statecity = {};
      state.error = serializeError(payload);
      state.success = null;
      state.otpSuccess = null;
    },
    clear: (state, { payload }) => {
      state.error = null;
      state.success = null;
      state.otpSuccess = null;
      state.updatedLeadData = null;
      state.qouteUpdateSuccess = null;
      state.emailSuccess = null
      switch (payload) {
        case "statecity":
          state.statecity = {};
          break;
        case "uwSingle":
          state.uwSingle = [];
          break;
        case "uwPreClr":
          state.uw = [];
          break;
        case "plansave":
          state.plansave = null;
          break;
        case "finalsave":
          state.finalsave = null;
          break;
        case "topup":
          state.TopUP_Data = [];
          break;
        case "create-bucket":
          state.create_bucket = null;
          break;
        case "update-bucket":
          state.bucketUpdate = null;
          break;
        case "reports":
          state.reports = null;
          break;
        case "replace":
          state.replace = null;
          break;
        case "replace-update":
          state.replaceUpdate = null;
          break;
        case "postplan":
          state.replaceUpdate = null;
          state.postplan = null;
          break;
        case "inviteSuccess":
          state.inviteSuccess = null;
          break;
        case "callbackSuccess":
          state.callbackSuccess = null;
          break;
        case "Sheetsuccess":
          state.Sheetsuccess = null;
          break;
        case "RFQDataCount":
          state.RFQDataCount = [];
          break;
        // case "empSheet":
        //   state.employee_sheet_data = { total_employees: 0, data: [] }
        //   break;
        //   case "memberData":
        //     state.company_data.member_details= [
        //       {
        //         age_group: "0-17",
        //         min_age: 0,
        //         max_age: 17,
        //         sum_insured: "50000",
        //         no_of_dependant: 0,
        //         no_of_employees: 10,
        //       },
        //       // { age_group: "26-35", min_age: 26, max_age: 35, sum_insured: "100000", no_of_memebers: 0 },
        //       // { age_group: "36-45", min_age: 36, max_age: 45, sum_insured: "200000", no_of_memebers: 0 },
        //       // { age_group: "46-55", min_age: 46, max_age: 55, sum_insured: "300000", no_of_memebers: 2 },
        //       // { age_group: "56-65", min_age: 56, max_age: 65, sum_insured: "400000", no_of_memebers: 2 },
        //       // { age_group: "66-75", min_age: 66, max_age: 75, sum_insured: "500000", no_of_memebers: 2 }
        //     ];
        //     break;
        default:
          break;
      }
    },
    set_enquiry_id: (state, { payload }) => {
      state.enquiry_id = payload.enquiry_id;
      state.loading = null;
      state.error = null;
      if (typeof payload?.updateObj !== "undefined") {
        state.updatedLeadData = payload?.updateObj.message;
      } else {
        state.success = true;
      }
    },
    set_company_data: (state, { payload }) => {
      state.company_data = { ...state.company_data, ...payload };
    },
    get_company_data: (state, { payload }) => {
      state.company_data = payload;
    },
    set_Industry_Data: (state, { payload }) => {
      state.industry_data = payload;
    },
    statecity: (state, { payload }) => {
      state.statecity = payload;
      state.pincodeLoading = null;
    },
    temp_data: (state, { payload = [] }) => {
      if (payload.length) {
        state.company_data.selected_plan = payload[0].selected_plan;
        // id
        state.company_data.id = payload[0].id;
        // step 1
        state.company_data.name = payload[0].name;
        state.company_data.designation = payload[0].designation;
        state.company_data.work_email = payload[0].work_email;
        state.company_data.company_name = payload[0].company_name;
        state.company_data.contact_no = payload[0].contact_no;
        state.company_data.pincode = payload[0].pincode;
        state.company_data.industry_type = payload[0].industry_id;
        state.company_data.industry_subtype = payload[0].industry_subtype_id;
        // step 3
        state.company_data.is_fresh_policy = payload[0].is_fresh_policy;
        // step 4
        state.company_data.no_of_employees = Number(payload[0].is_demography) === 1 ?
          DefaultValue(payload[0], payload[0].family_construct) || 11 : payload[0].no_of_employees

        let averageAge = "";
        switch (payload[0].avg_min_age) {
          case 18: {
            averageAge = "18-25";
            break;
          }
          case 26: {
            averageAge = "26-35";
            break;
          }
          case 36: {
            averageAge = "36-50";
            break;
          }
          case 51: {
            averageAge = "51-65";
            break;
          }
          default: {
          }
        }
        state.company_data.average_age = averageAge;
        // step 5
        //state.company_data.family_type = payload[0].family_type;
        state.company_data.family_type = payload[0].family_construct.length > 0 ? payload[0].family_construct.map((item) => item?.relation_id) : [1];
        state.company_data.family_construct = payload[0].family_construct;
        state.company_data.relation_type = payload[0].family_construct.map(
          (item) => item?.relation_id
        );
        state.company_data.relation_List =
          payload[0].relation_List || undefined;
        // state.company_data.relation_List = state.industry_data.relations.map((item) => {
        // 	if (state.company_data.relation_type.includes(item.id)) {
        // 		return (item = { value: item?.id, label: item?.name, ...item });
        // 	}
        // });
        // step 6
        state.company_data.relation_count = payload[0].family_construct.map(
          (item) => {
            return (item = {
              id: item?.relation_id,
              count: item?.no_of_relations,
            });
          }
        );

        // step 7
        state.company_data.policy_sub_type_id = payload[0].policy_sub_type_id;
        state.company_data.cover_type = payload[0].cover_type;
        state.company_data.premium_type = payload[0].premium_type;
        state.company_data.member_details =
          payload[0]?.age_group?.length > 0
            ? payload[0].age_group
            : [
              {
                age_group: state.ageGroupData[0]?.name,
                min_age: 0,
                max_age: 17,
                sum_insured: state.sumInsuredData[0]?.name,
                no_of_employees: 10,
                no_of_dependant: 0
              },
            ];
        state.company_data.polic_sub_type_name = payload[0].polic_sub_type_name;
        state.company_data.suminsured_type_id = payload[0].suminsured_type_id;
        state.company_data.address = payload[0].address;
        state.company_data.company_legal_name = payload[0].company_legal_name;
        state.company_data.gstin_number = payload[0].gstin_number;
        state.company_data.pan_number = payload[0].pan_number;

        // step 18
        state.company_data.previous_ic_name = payload[0].previous_ic_name;
        state.company_data.lives_at_inception = payload[0].lives_at_inception;
        state.company_data.previous_active_lives = payload[0].previous_active_lives;
        state.company_data.previous_total_cover = payload[0].previous_total_cover;
        state.company_data.previous_claim_ratio = payload[0].previous_claim_ratio;
        state.company_data.previous_claim_amount = payload[0].previous_claim_amount;
        state.company_data.previous_policy_expiry_date = payload[0].previous_policy_expiry_date;
        state.company_data.pervious_policy_tpa_name = payload[0].pervious_policy_tpa_name;
        state.company_data.pervious_paid_claim_count = payload[0].pervious_paid_claim_count;
        state.company_data.pervious_outstanding_claim_count = payload[0].pervious_outstanding_claim_count;
        state.company_data.pervious_policy_number = payload[0].pervious_policy_number;
        state.company_data.previous_policy_start_date = payload[0].previous_policy_start_date;
        state.company_data.is_demography = payload[0].is_demography;
        state.company_data.isSelf = payload[0].is_self ?? 1
      }
    },
    set_TopUP_Data: (state, { payload }) => {
      state.TopUP_Data = payload;
      state.topupLoading = false;
    },
    uw: (state, { payload }) => {
      state.uw = payload;
      state.loading = false;
    },
    uwSingle: (state, { payload = [] }) => {
      state.uwSingle = payload.length ? payload[0] : [];
    },
    // isUw: (state, { payload }) => {
    // 	state.isUw = payload;
    // },
    customizeplan: (state, { payload }) => {
      state.customizeplan = payload;
      state.planLoading = false;
    },
    employee_sheet_data: (state, { payload }) => {
      state.employee_sheet_data = payload;
      state.loading = false;
    },
    members_data: (state, { payload }) => {
      state.members_data = payload.map((elem) => ({
        ...elem,
        relation_name:
          elem.relation_name === "Self" ? "Employee" : elem.relation_name,
      }));
      state.loading = false;
    },
    singleplan: (state, { payload }) => {
      state.singleplan = payload;
    },
    plansave: (state, { payload }) => {
      state.plansave = payload;
    },
    finalsave: (state, { payload }) => {
      state.finalsave = payload;
    },
    widgets: (state, { payload }) => {
      state.widgets = payload;
    },
    create_bucket: (state, { payload }) => {
      state.create_bucket = payload;
    },
    buckets: (state, { payload }) => {
      state.buckets = Array.isArray(payload) ? payload : [];
    },
    editBuckets: (state, { payload }) => {
      state.bucketEdit = payload;
    },
    updateBuckets: (state, { payload }) => {
      state.bucketUpdate = payload;
    },
    updateSuccess: (state, { payload }) => {
      state.create_bucket = payload;
    },
    industries: (state, { payload }) => {
      state.industries = payload;
    },
    reports: (state, { payload }) => {
      state.reports = payload.url;
    },
    replace: (state, { payload }) => {
      state.replace = payload;
    },
    replaceUpdate: (state, { payload }) => {
      state.replaceUpdate = payload;
    },
    addAgeGroup: (state, { payload }) => {
      let sortedData = payload.member_details.slice().sort((a, b) => {
        return a.min_age - b.min_age;
      });
      const data = { ...payload, member_details: sortedData };
      state.company_data = { ...state.company_data, ...data };
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    insurer: (state, { payload }) => {
      state.insurer = payload;
    },
    ageGroup: (state, { payload }) => {
      let data = [];
      payload.forEach((item, index) => {
        data.push({
          id: index + 1,
          name: item,
          value: item,
        });
      });
      state.ageGroupData = data;
    },
    sumInsured: (state, { payload }) => {
      let data = [];
      payload.forEach((item, index) => {
        data.push({
          id: index + 1,
          name: Math.round(Number(item)),
          value: Math.round(Number(item)),
        });
      });
      state.sumInsuredData = data;
    },
    relationList: (state, { payload }) => {
      state.relationListData = payload;
    },
    quotes: (state, { payload }) => {
      state.quotes = payload;
      // state.quotesCopy = payload;
      state.loading = null;
    },
    teamDetails: (state, { payload }) => {
      state.logo = payload.logo;
      state.organizationName = payload.organization_name;
      let ageData = [];
      let SIData = [];
      if (Array.isArray(payload?.ageGroups)) {
        payload.ageGroups.forEach((item, index) => {
          ageData.push({
            id: index + 1,
            name: item,
            value: item,
          });
        });
      }
      else if (_.isObject(payload?.ageGroups) && !_.isEmpty(payload?.ageGroups)) {
        Object.values(payload?.ageGroups).forEach((value, index) => {
          ageData.push({
            id: index + 1,
            name: value,
            value: value,
          });
        })
      }

      payload.sumInsureds.forEach((item, index) => {
        if (Math.round(Number(item) !== 0)) {
          SIData.push({
            id: index + 1,
            name: Math.round(Number(item)),
            value: Math.round(Number(item)),
          });
        }
      });
      if (!state.company_data.member_details?.length) {
        state.company_data.member_details = [{
          ...state.company_data.member_details[0],
          sum_insured: SIData[0].name,
          age_group: ageData.length ? ageData[0].name : 'NO Data Found'
        }]

      }
      state.ageGroupData = ageData;
      state.sumInsuredData = SIData;
    },
    postplan: (state, { payload }) => {
      state.postplan = payload;
      state.loading = null;
    },
    completeQuoteLoading: (state, { payload }) => {
      state.completeQuoteLoading = payload;
    },
    totallives: (state, { payload }) => {
      state.totallives = payload;
    },
    sorting: (state, { payload }) => {
      state.sorting = payload;
      let unsorted_quotes = !_.isEmpty(state.quotes) ? [...state.quotes] : [];
      let sorted_quotes = unsorted_quotes.sort((a, b) =>
        payload === "insurance"
          ? Number(b.broker_ic_id) - Number(a.broker_ic_id)
          : Number(b.total_premium) - Number(a.total_premium)
      );
      state.filterData = FilterProductData(sorted_quotes);
    },
    QuoteSlip: (state, { payload }) => {
      state.QuoteSlip = payload;
    },
    clearQuoteSlip: (state) => {
      state.QuoteSlip = null;
    },
    callbackSuccess: (state, { payload }) => {
      state.callbackSuccess = payload;
      state.loading = false
    },
    inviteSuccess: (state, { payload }) => {
      state.inviteSuccess = payload;
      state.loading = false
    },
    Sheetsuccess: (state, { payload }) => {
      state.Sheetsuccess = payload;
      state.loading = false
    },
    RFQDataCount: (state, { payload }) => {
      state.RFQDataCount = [payload];
      state.company_data.no_of_employees = payload.total_lives_count;
      state.company_data.member_details = payload.age_groups;
      state.company_data.isSelf = payload.total_lives_count === payload.self_count ? true : false
      state.loading = false
    },
    QuoteSlipData: (state, { payload }) => {

      state.success = payload.message ? payload.message : payload;
      state.QuoteSlipData = payload.quote_id ? payload.quote_id : state.QuoteSlipData;
      state.loading = false
    },
    GetQuoteSlipData: (state, { payload }) => {
      state.GetQuoteSlipData = payload;
      state.loading = false
    },
    qouteUpdateSuccess: (state, { payload }) => {
      state.qouteUpdateSuccess = payload;
      state.loading = false
    },
    downloadQuoteResponse: (state, { payload }) => {
      state.downloadQuoteResponse = payload;
      state.loading = false
    },
    cleardownloadQuoteResponse: (state, { payload }) => {
      state.downloadQuoteResponse = null;
    },
    emailSuccess: (state, { payload }) => {
      state.emailSuccess = payload;
      state.loading = false
    },
    utm_approved: (state, { payload }) => {
      state.utm_approved = payload;
    },
  },
});

export const {
  loading,
  setPlanLoading,
  setTopUpLoading,
  setLoad,
  success,
  otpSuccess,
  error,
  clear,
  set_enquiry_id,
  set_company_data,
  get_company_data,
  set_Industry_Data,
  statecity,
  temp_data,
  set_TopUP_Data,
  pincodeLoading,
  uw,
  uwSingle,
  // isUw,
  customizeplan,
  employee_sheet_data,
  members_data,
  singleplan,
  plansave,
  finalsave,
  widgets,
  create_bucket,
  buckets,
  editBuckets,
  updateBuckets,
  updateSuccess,
  industries,
  reports,
  replace,
  replaceUpdate,
  addAgeGroup,
  broker,
  insurer,
  ageGroup,
  sumInsured,
  relationList,
  quotes,
  teamDetails,
  postplan,
  completeQuoteLoading,
  totallives,
  setFilterData,
  sorting,
  QuoteSlip,
  clearQuoteSlip,
  callbackSuccess,
  inviteSuccess,
  Sheetsuccess,
  RFQDataCount,
  QuoteSlipData,
  GetQuoteSlipData,
  qouteUpdateSuccess,
  downloadQuoteResponse,
  cleardownloadQuoteResponse,
  emailSuccess,
  utm_approved
} = homeSlice.actions;

// Action creator

export const getstatecity = (data) => {
  return async (dispatch) => {
    try {
      dispatch(pincodeLoading());
      actionStructre(dispatch, statecity, error, service.statecity, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// save Company Data
export const saveCompanyData = (payload, updateObj) => {
  let isFormData = payload instanceof FormData
  return async (dispatch) => {
    try {
      dispatch(loading());
      let response = {};
      switch (isFormData ? Number(payload?.get("step")) : payload.step) {
        case 1: {
          response = { ...payload };
          break;
        }
        case 2: {
          response = { ...payload };
          break;
        }
        case 3: {
          response = { ...payload };
          break;
        }
        case 4: {
          response = { ...payload };
          break;
        }
        case 5: {
          response = { ...payload };
          break;
        }
        case 6: {
          response = { ...payload };
          break;
        }
        case 7: {
          response = { ...payload };
          break;
        }
        case 17: {
          response = payload;
          break;
        }
        case 18: {
          response = { ...payload };
          break;
        }
        case 19: {
          response = { ...payload };
          break;
        }
        case 20: {
          response = { ...payload };
          break;
        }
        default: {
        }
      }
      const {
        data,
        message,
        errors,
        success: status,
      } = await service.saveCompanyData(response);

      if (status && data?.data?.enquiry_id) {
        setTimeout(() => {
          if (status) {
            dispatch(
              set_enquiry_id({
                enquiry_id: data.data.enquiry_id,
                ...(typeof updateObj !== "undefined" && {
                  updateObj,
                }),
              })
            );
          }
        }, 1000);
      } else if (status) {
        if (typeof updateObj !== "undefined") {
          dispatch(success(updateObj.message));
        } else {
          dispatch(success(true));
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// load Company Data
export const loadCompanyData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setLoad({ key: 'customerDataLoad', value: true }))
      const {
        data,
        success: status,
        errors,
        message,
      } = await service.loadCompanyData(payload);
      if (data.data && status) {
        dispatch(temp_data(data.data));
        dispatch(setLoad({ key: 'customerDataLoad', value: false }))
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getIndustry = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoad({ key: 'configDataload', value: true }))
      const {
        data,
        message,
        errors,
        success: status,
      } = await service.getIndustry();
      if (status && data?.data) {
        dispatch(set_Industry_Data(data.data));
        dispatch(setLoad({ key: 'configDataload', value: false }))
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getUw = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, uw, error, service.uw, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadPlans = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, uw, error, service.loadPlans, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getSingleUw = (payload) => {
  return async (dispatch) => {
    try {
      const {
        data,
        message,
        errors,
        success: status,
      } = await service.uwSingle(payload);
      if (status && data?.data) {
        dispatch(uwSingle(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getTopUP = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setTopUpLoading());
      const {
        data,
        message,
        errors,
        success: status,
      } = await service.getTopUP(payload);
      if (status && data?.data) {
        dispatch(set_TopUP_Data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getPlanDetails = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setPlanLoading());
      actionStructre(
        dispatch,
        customizeplan,
        error,
        service.customizeplan,
        data
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Data Upload

export const uploadSheet = (payload) => {
  // return async (dispatch) => {
  //   try {
  //     actionStructre(dispatch, Sheetsuccess, error, service.uploadSheet, data);
  //   } catch (err) {
  //     dispatch(error("Something went wrong"));
  //     console.error("Error", err);
  //   }
  // };
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.uploadSheet(
        payload
      );
      if (data.status) {
        dispatch(Sheetsuccess({
          error_sheet: data.error_sheet_url,
          uploaded_sheet: data.uploaded_sheet_url,
          message: data.message,
          si_id: data.suminsured_type_id
        }));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const employeeSheetData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.employeeSheetData(
        payload
      );
      if (data.data) {
        dispatch(employee_sheet_data(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getMembers = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getMembers(payload);
      if (data.data) {
        dispatch(members_data(data.data));
        dispatch(
          widgets({
            total_children: data.total_children,
            total_employees: data.total_employees,
            total_lives: data.total_lives,
            total_parents: data.total_parents,
            total_spouse: data.total_spouse,
          })
        );
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const addMember = (payload, id) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.addMember(payload, id);
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

export const updateMember = (payload, id) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.updateMember(payload, id);
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

export const removeMember = (id) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.removeMember(id);
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

export const SinglePlan = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, singleplan, error, service.singleplan, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// OTP

// load otp
export const generateOTP = (payload) => {
  return async (dispatch) => {
    try {
      service.generateOTP(payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const generateOTP2 = (payload) => {
  return async (dispatch) => {
    try {
      service.generateOTP2(payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};


// verify otp
export const verfiyOTP = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await service.verfiyOTP(payload);
      if (data.status) {
        dispatch(otpSuccess(data.message));
      } else {
        dispatch(error(data.message || data.errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const verfiyOTP2 = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await service.verfiyOTP2(payload);
      if (data.status) {
        dispatch(otpSuccess(data.message));
      } else {
        dispatch(error(data.message || data.errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// resend otp
export const resendOTP = (payload) => {
  return async (dispatch) => {
    try {
      const { data } = await service.resendOTP(payload);
      if (!data.status) {
        dispatch(error(data.message || data.errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const PlanSave = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, plansave, error, service.plansave, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const FinalSave = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, finalsave, error, service.finalsave, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//create bucket

export const createBucket = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(
        dispatch,
        create_bucket,
        error,
        service.createBucket,
        data
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getBucket = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, buckets, error, service.getBucket, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const editBucket = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, editBuckets, error, service.editBucket, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateBucket = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.updateBucket(id, payload);
      if (data.status) {
        dispatch(updateBuckets(message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteBucket = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(
        dispatch,
        create_bucket,
        error,
        service.deleteBucket,
        data
      );
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//filtered industries
export const getIndustries = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, industries, error, service.getIndustries, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//filtered industries
export const Replace = (data, check) => {
  return async (dispatch) => {
    try {
      check
        ? actionStructre(dispatch, replace, error, service.replace, data)
        : actionStructre(dispatch, replaceUpdate, error, service.replace, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//reports
export const getReport = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, reports, error, service.reports, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getBroker = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, broker, error, service.allBroker, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const InsurerAll = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, insurer, error, service.allIns, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getConfigData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setLoad({ key: 'configuredDataload', value: true }))
      const { data, message, errors } = await service.getConfigData(payload);
      if (data.data) {
        dispatch(teamDetails(data.data));
        //dispatch(ageGroup(data.data.ageGroups));
        //dispatch(sumInsured(data.data.sumInsureds));
        dispatch(relationList(data.data.relations));
        dispatch(setLoad({ key: 'configuredDataload', value: false }))
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const Quotes = (payload, age_detail) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      // actionStructre(dispatch, quotes, error, service.quotes, data);
      const { data, message, errors } = await service.quotes(payload);
      if (data.data) {
        const filteredFeatireSumIns = filterFeatireSumIns(
          data.data.filter(({ total_premium }) => total_premium),
          age_detail
        );
        dispatch(quotes(filteredFeatireSumIns));
        // dispatch(setFilterData(mergePremium))
        dispatch(completeQuoteLoading(true));
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

export const PostQuote = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, postplan, error, service.PostQuote, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

//Claim Data Upload

export const uploadClaimSheet = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, success, error, service.uploadClaimSheet, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getQuoteSlip = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getQuoteSlip(payload);
      if (data.data) {
        dispatch(QuoteSlip(data.data));
      } else {
        // dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const createCallback = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createCallback(payload);
      if (data.status) {
        dispatch(callbackSuccess(data.message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const inviteMember = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.inviteMember(payload);
      if (data.status) {
        dispatch(inviteSuccess(message || errors));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}


export const sendQuoteSlipData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.sendQuoteSlipData(payload);
      if (data.status) {
        dispatch(QuoteSlipData(data.data || data.message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const getAllQuoteSlipData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getAllQuoteSlipData(payload);
      if (data.data && data.status) {
        dispatch(GetQuoteSlipData(data.data));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const deleteQuoteFeature = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.deleteQuoteFeature(id);
      if (data.status) {
        dispatch(success(message));
      }
      else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  }
}

export const updateQuoteSlipData = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateQuoteSlipData(payload);
      if (data.status) {
        dispatch(qouteUpdateSuccess(message || data.data.message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const downloadQuotedata = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.downloadQuotedata(payload);
      if (data.status) {
        dispatch(downloadQuoteResponse(data.data));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const sendQuoteEmail = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.sendQuoteEmail(payload);
      if (data.status) {
        dispatch(emailSuccess(message));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}




export default homeSlice.reducer;

const FilterProductData = (quotes) => {
  let features = quotes?.map(({ plan_product_features }) => {
    return plan_product_features;
  });


  let ProcessedFeatures = {};
  let e = [];

  // let PlanArray = [...Array(features.length)];
  (features || []).forEach((elem, index) => {
    elem.forEach((data) => {
      let Plan_ids = [
        ...(ProcessedFeatures?.[`${data?.product_feature_id}`]?.plan_ids || []),
      ];
      Plan_ids[index] = data?.id;
      if (!e.includes(data?.product_feature_id * 1)) {
        e.push(data?.product_feature_id * 1);
        ProcessedFeatures = {
          ...ProcessedFeatures,
          [`${data?.product_feature_id}`]: { ...data, plan_ids: Plan_ids },
        };
      } else {
        ProcessedFeatures = {
          ...ProcessedFeatures,
          [`${data?.product_feature_id}`]: {
            ...ProcessedFeatures?.[`${data?.product_feature_id}`],
            plan_ids: Plan_ids,
            is_mandantory: ProcessedFeatures?.[`${data?.product_feature_id}`].is_mandantory && data?.is_mandantory,
            product_detail: [
              ...ProcessedFeatures?.[`${data?.product_feature_id}`]
                ?.product_detail,
              ...data?.product_detail,
            ],
          },
        };
      }
    });
  });


  let prelistdata = _.map(ProcessedFeatures);

  let unsorted_list = !_.isEmpty(prelistdata) ? [...prelistdata] : [];
  unsorted_list.sort(
    (a, b) => Number(a.order) - Number(b.order)
  );

  prelistdata = unsorted_list;
  const filterData = prelistdata.filter(({ product_feature_name }) => !!product_feature_name).map(({ product_detail, ...rest }) => {
    const tempFilter = [];

    // let plan_feature_mapping_ids = product_detail.map(
    // 	({ plan_feature_mapping_id }) => plan_feature_mapping_id
    // );

    // plan_feature_mapping_ids = plan_feature_mapping_ids.filter(onlyUnique);

    product_detail.forEach((elem, indexElem) => {
      // if (rest.product_type === 1 || rest.product_type === 5) {
      // 	if (!tempFilter.length) {
      // 		let ids = [];
      // 		ids[rest.plan_ids.indexOf(rest.id)] = elem.id;
      // 		let premiums = [];
      // 		premiums[rest.plan_ids.indexOf(rest.id)] = elem.premium;
      // 		tempFilter.push({ ...elem, premiums: premiums, ids: ids });
      // 	} else {
      // 		tempFilter[0].premiums[
      // 			// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
      // 			rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
      // 		] = elem.premium;

      // 		tempFilter[0].ids[
      // 			// plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
      // 			rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
      // 		] = elem.id;
      // 	}
      // } else
      if (!tempFilter.length) {
        let ids = [];
        ids[rest.plan_ids.indexOf(elem.plan_feature_mapping_id)] = elem.id;
        let premiums = [];
        premiums[rest.plan_ids.indexOf(elem.plan_feature_mapping_id)] =
          elem.premium;
        tempFilter.push({ ...elem, premiums: premiums, ids: ids });
      } else {
        let ids = [];
        ids[rest.plan_ids.indexOf(rest.id)] = elem.id;
        let premiums = [];
        premiums[rest.plan_ids.indexOf(rest.id)] = Number(elem.premium);
        tempFilter.forEach((elem1, index) => {
          if (
            ((((elem1.duration_value &&
              elem.duration_value) || (Number(elem1.duration_value) === 0 &&
                Number(elem.duration_value) === 0)) &&
              elem1.duration_value === elem.duration_value &&
              elem1.duration_unit === elem.duration_unit && (rest.product_type === 2)) ||
              (((elem1.name && elem.name) || rest.product_type === 3) && elem1.name?.trim() === elem.name?.trim()) ||
              (elem1.is_wavied_off &&
                elem.is_wavied_off &&
                elem1.is_wavied_off === elem.is_wavied_off) ||
              rest.product_type === 1 ||
              rest.product_type === 5) &&
            Number(elem1.sum_insured) === Number(elem.sum_insured)
          ) {
            tempFilter[index].premiums[
              // plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
              rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
            ] = Number(elem.premium);

            tempFilter[index].ids[
              // plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
              rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
            ] = elem.id;
          } else if (
            !tempFilter.some(
              (elem3) =>
                ((((elem3.duration_value &&
                  elem.duration_value) || (Number(elem3.duration_value) === 0 &&
                    Number(elem.duration_value) === 0)) &&
                  elem3.duration_value === elem.duration_value &&
                  elem3.duration_unit === elem.duration_unit && (rest.product_type === 2)) ||
                  (((elem3.name && elem.name) || rest.product_type === 3) && elem3.name?.trim() === elem.name?.trim()) ||
                  (elem3.is_wavied_off &&
                    elem.is_wavied_off &&
                    elem3.is_wavied_off === elem.is_wavied_off) ||
                  rest.product_type === 1 ||
                  rest.product_type === 5) &&
                Number(elem3.sum_insured) === Number(elem.sum_insured)
            )
          ) {
            let ids = [];
            ids[
              // plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
              rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
            ] = elem.id;
            let premiums = [];
            premiums[
              // plan_feature_mapping_ids.indexOf(elem.plan_feature_mapping_id)
              rest.plan_ids.indexOf(elem.plan_feature_mapping_id)
            ] = Number(elem.premium);
            tempFilter.push({ ...elem, premiums, ids });
          }
        });
      }
    });
    return { ...rest, product_detail: tempFilter };
  });

  return filterData;
};

// const AddPremiums = (quotes) => {
//   const AddDataPrem = quotes.map((elem1) => {
//     return {
//       ...elem1,
//       plan_product_features: elem1.plan_product_features.map((elem2) => {
//         let product_detail = [{
//           ...elem2.product_detail[0],
//           //  copy_product_detail: [{
//           //   id: elem2.product_detail[0].id,
//           //   deductible_from: elem2.product_detail[0].deductible_from,
//           //   premium: elem2.product_detail[0].premium,
//           // }]
//         }];
//         elem2.product_detail.forEach((elem3, index3) => {
//           product_detail.forEach((elem4, index4) => {
//             if (
//               elem4.deductible_from !== elem3.deductible_from &&
//               elem4.sum_insured === elem3.sum_insured
//             ) {
//               if (
//                 elem2.product_type === 2 &&
//                 elem4.duration_value === elem3.duration_value &&
//                 elem4.duration_unit === elem3.duration_unit &&
//                 elem4.duration_type === elem3.duration_type
//               ) {
//                 product_detail[index4] = {
//                   ...elem3,
//                   premium: elem3.premium + elem4.premium,
//                   // copy_product_detail: [
//                   //   elem3.copy_product_detail,
//                   //   {
//                   //     id: elem4.id,
//                   //     deductible_from: elem4.deductible_from,
//                   //     premium: elem4.premium,
//                   //   }]
//                 };
//               }
//               if (elem2.product_type === 3 && elem4.name === elem3.name) {
//                 product_detail[index4] = {
//                   ...elem3,
//                   premium: elem3.premium + elem4.premium,
//                   // copy_product_detail: [
//                   //   elem3.copy_product_detail,
//                   //   {
//                   //     id: elem4.id,
//                   //     deductible_from: elem4.deductible_from,
//                   //     premium: elem4.premium,
//                   //   }]
//                 };
//               }
//               if (![2, 3].includes(elem2.product_type)) {
//                 product_detail[index4] = {
//                   ...elem3,
//                   premium: elem3.premium + elem4.premium,
//                   // copy_product_detail: [
//                   //   elem3.copy_product_detail,
//                   //   {
//                   //     id: elem4.id,
//                   //     deductible_from: elem4.deductible_from,
//                   //     premium: elem4.premium,
//                   //   }]
//                 };
//               }
//             }
//           });
//           if (!product_detail.some(({ id }) => id === elem3.id)) {
//             product_detail.push(elem3);
//           }
//         });
//         return {
//           ...elem2,
//           product_detail: product_detail,
//         };
//       }),
//     };
//   });

//   return AddDataPrem;
// };

// logic not working
// const CalculateBasePremiums = (base_premiums = []) => {
//   const uniqueSI = [...new Set(base_premiums.map(({ suminsured }) => suminsured))];


//   const result = {};
//   uniqueSI.forEach((si) => {
//     result[si] = 0;
//   })

//   base_premiums.forEach(({ suminsured, premium, max_age, min_age }) => {
//     result[suminsured] += premium;
//   })

//   return result
// }

const filterFeatireSumIns = (quotes, age_detail) => {
  const sumInsureds = age_detail.map(({ sum_insured }) => Number(sum_insured));
  return quotes.map((elem1) => ({
    ...elem1,
    base_premiums: elem1.suminsured?.base_premium /* CalculateBasePremiums(elem1.suminsured?.base_premium) */,
    plan_product_features: elem1.plan_product_features.map((elem2) => {
      const product_detail = elem2.product_detail.filter(
        ({ deductible_from }) => {
          return sumInsureds.includes(deductible_from) || !deductible_from;
        }
      );
      return {
        ...elem2,
        ...(product_detail.length && { product_detail }),
      };
    }),
  }));
};

export const getRFQDataCount = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getRFQDataCount(payload);
      if (data.data) {
        dispatch(RFQDataCount(data.data));
      } else {
        dispatch(error(message || errors));
        console.error("Error", message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const isVerifiedSource = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.isVerifiedSource(payload);
      dispatch(utm_approved(data.status));
      (message || errors) && console.error("Error", message || errors);
    } catch (err) {
      console.error("Error", err);
    }
  };
}

export const sendRFQLeadQuote = (payload, { onClose, setMsg }) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.sendRFQLeadQuote(payload);
      if (data.status) {
        setMsg(true);
        // dispatch(success(message));
        dispatch(loading(false));

        setTimeout(() => {
          onClose(false);
          setMsg(false);
        }, 2500);
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
