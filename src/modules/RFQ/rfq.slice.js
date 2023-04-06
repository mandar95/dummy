import { createSlice } from "@reduxjs/toolkit";
import service from './rfq.service';
import { serializeError, actionStructre } from 'utils';
import swal from 'sweetalert';
import { getUw, loadPlans } from "./home/home.slice";
import { DateFormate, NumberInd } from "../../utils";

export const Rfq = createSlice({
  name: "rfq",
  initialState: {
    loading: false,
    error: null,
    success: null,
    configs: {},
    tempConfig: {},
    rfqData: {},
    approved: false,
    riskBuckets: [],
    insurer_id: '',
    roles: [],
    flow: null,
    insurer: [],
    ins: [],
    listview: [],
    userlist: [],
    updatelist: null,
    access: {},
    updateflow: null,
    broker: [],
    brkr: [],
    featureTypes: [],
    features: [],
    feature: {},
    leadAssigne: [],
    ICQuotesuccess: null
  },
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      state.loading = null;
      state.error = serializeError(payload);
      state.success = null;
    },
    clear: (state, { payload }) => {
      state.error = null;
      state.success = null;
      state.loading = null;
      state.ICQuotesuccess = null;
      switch (payload) {
        case 'update':
          state.updatelist = null;
          break
        case 'updateflow':
          state.updateflow = null;
          break
        case 'listview':
          state.listview = [];
          break
        default:
      }
    },
    configs: (state, { payload }) => {
      state.configs = payload
      state.loading = null;
    },
    tempConfig: (state, { payload }) => {
      state.tempConfig = payload.temp_config || {};
    },
    configTemp: (state, { payload }) => {
      state.tempConfig = payload;
    },
    set_approved: (state, { payload }) => {
      state.approved = payload;
    },
    riskBuckets: (state, { payload }) => {
      state.riskBuckets = Array.isArray(payload) ? payload : [];
    },
    set_insurer_id: (state, { payload }) => {
      state.insurer_id = payload;
    },
    rfqData: (state, { payload }) => {

      let sum_insureds = []
      if (payload.length) {
        payload[0].plan_product_features.forEach(({ product_detail }) => (product_detail?.map(({ deductible_from }) => sum_insureds.push(deductible_from))))
        const unique_sum_insureds = sum_insureds.filter(onlyUnique);
        state.rfqData =
        {
          ...payload[0],
          product_feature: payload[0].plan_product_features?.map(
            ({ product_feature_id, content, product_detail, is_mandantory }) => {
              return {
                is_mandantory,
                product_feature_id: product_feature_id,
                content,
                additional: product_detail.map(({
                  sum_insured, premium, sum_insured_type,
                  duration_value, is_wavied_off, name,
                  duration_unit, deductible_from, duration_type,
                  premium_by, premium_type }) => ({
                    name,
                    deductible_from,
                    sum_insured,
                    sum_insured_type: sum_insured_type ? String(sum_insured_type) : sum_insured_type,
                    premium,
                    premium_type: premium_type ? String(premium_type) : premium_type,
                    premium_by: String(premium_by || 1),
                    duration_unit: duration_unit ? String(duration_unit) : duration_unit,
                    duration_value,
                    duration_type: duration_type ? String(duration_type) : duration_type,
                    wavier: String(is_wavied_off || 0),
                  }))
              }
            }),
          sum_insureds: unique_sum_insureds.length ? unique_sum_insureds : (payload[0]?.unique_suminsured?.filter(Number) || [])

        };
      }
      state.loading = null;
    },
    roles: (state, { payload }) => {
      state.roles = payload;
    },
    flow: (state, { payload }) => {
      state.flow = payload;
    },
    insurer: (state, { payload }) => {
      state.insurer = payload;
    },
    ins: (state, { payload }) => {
      state.ins = payload;
    },
    listview: (state, { payload }) => {
      state.listview = payload;
    },
    userlist: (state, { payload }) => {
      state.userlist = payload.length ? payload
        ?.filter(
          ({ display_lead_to_current_user }) =>
            display_lead_to_current_user * 1 !== 0
        )
        .map((item) => {
          return {
            ...item,
            ...(item?.rfq_selected_plan && {
              plan_name: item?.rfq_selected_plan?.plan_name,
              sum_insured: '₹ ' + NumberInd(item?.rfq_age_demography?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0)),
              final_premium: '₹ ' + NumberInd(item?.rfq_selected_plan?.final_premium),
            }),
            created_at: DateFormate(item.created_at, { type: 'withTime' })
          };
        }) : [];
      state.loading = false;
    },
    updatelist: (state, { payload }) => {
      state.updatelist = payload;
    },
    access: (state, { payload }) => {
      state.access = payload;
    },
    updateflow: (state, { payload }) => {
      state.updateflow = payload;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    brkr: (state, { payload }) => {
      state.brkr = payload;
    },
    featureTypes: (state, { payload }) => {
      state.featureTypes = payload;
    },
    features: (state, { payload }) => {
      state.features = payload.map((feature, index) => ({ ...feature, sr_no: index + 1 }));
      state.loading = false;
    },
    feature: (state, { payload }) => {
      state.feature = payload.length ? payload[0] : {};
      state.loading = false;
    },
    loadRfqCopy: (state, { payload }) => {

      if (payload.length) {
        const sum_insureds = []
        payload[0].plan_product_features.forEach(({ product_detail }) => (product_detail?.map(({ deductible_from }) => sum_insureds.push(deductible_from))))
        state.tempConfig =
        {
          ...payload[0],
          plan_name: payload[0].name,
          co_oprate_buffer: payload[0].co_operate_buffer,
          ic_name: payload[0].insurer_name,

          ages: payload[0].relations
            .map(relation => ({ ...relation, relation_id: relation.relation_id, no_limit: relation.min_age ? false : true })),

          industry_ids_mock: payload[0].risk_buckets
            .map(risk_bucket => ({ risk_bucket_id: risk_bucket.risk_bucket_id, risk_factor: risk_bucket.risk_percentage })),

          product_feature: payload[0].plan_product_features?.map(
            ({ product_feature_id, content, product_detail, is_mandantory }) => {
              return {
                is_mandantory,
                product_feature_id: product_feature_id,
                content,
                additional: product_detail.map(({
                  sum_insured, premium, sum_insured_type,
                  duration_value, is_wavied_off, name,
                  duration_unit, deductible_from, duration_type, premium_type }) => ({
                    name,
                    deductible_from,
                    sum_insured,
                    sum_insured_type: sum_insured_type ? String(sum_insured_type) : sum_insured_type,
                    premium,
                    premium_type: premium_type ? String(premium_type) : premium_type,
                    duration_unit: duration_unit ? String(duration_unit) : duration_unit,
                    duration_value,
                    duration_type: duration_type ? String(duration_type) : duration_type,
                    waiver: is_wavied_off,
                  }))
              }
            }),
          sum_insureds: sum_insureds.filter(onlyUnique)

        };

      }
      state.loading = false;
    },
    leadAssigne: (state, { payload }) => {
      state.leadAssigne = payload.length ? payload : [];
      state.loading = false;
    },
    ICQuotesuccess: (state, { payload }) => {
      state.ICQuotesuccess = payload
      state.loading = false;
    },
  }
});

export const {
  loading, success, error, clear, configTemp,
  configs, tempConfig,
  rfqData, set_approved, riskBuckets,
  set_insurer_id, roles, flow, insurer, ins,
  listview, userlist, updatelist, access,
  updateflow, broker, brkr, features,
  featureTypes, feature, loadRfqCopy,
  leadAssigne,
  ICQuotesuccess
} = Rfq.actions;


// Action creator


// Config Data
export const loadRfqConfig = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, configs, error, service.loadRfqConfig, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Config Temp Data
export const saveTempConfig = (payload, flag) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await service.saveTempConfig({ temp_rfq_config: payload, ...(!flag && { temp_rfq_id: payload.temp_rfq_id }) });
      dispatch(configTemp({
        ...payload,
        temp_rfq_id: data.data?.temp_rfq_id
      }))
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
    // actionStructre(dispatch, clear, error, service.saveTempConfig, { temp_rfq_config: data });
  };
};

// Remove Config Data
export const removeTempConfig = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, tempConfig, tempConfig, service.removeTempConfig, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Get Temp Config Data
export const getTempConfig = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data } = await service.getTempConfig(payload);
      if (data.data) {
        swal("Found saved plan, do you want to continue with it ?", {
          buttons: {
            yes: 'Yes',
            no: "No"
          },
          closeOnClickOutside: false,
        }).then((value) => {
          if (value === 'yes') {
            dispatch(tempConfig(data.data));
          } else {
            dispatch(tempConfig({}));
            // dispatch(removeTempConfig({ temp_rfq_id: data.data?.temp_config?.temp_rfq_id }));
          }
        });
      }
      else {
        // dispatch(error(message || errors));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Save Config Data
export const saveConfig = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.saveConfig, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Load Single RFQ
export const loadRfq = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, rfqData, error, service.loadRfq, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}
export const loadRfqCopied = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, loadRfqCopy, error, service.loadRfq, payload);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Update Config Data
export const updateRfq = (payload, ids, flag) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateRfq(payload);
      if (data.status === true) {

        payload.status ? dispatch(set_approved(message)) : dispatch(success(message));
        flag ? dispatch(loadPlans(ids?.broker_id ? { broker_id: ids?.broker_id }
          : { ic_id: ids?.ic_id }))
          : dispatch(loadRfq(ids?.broker_id ?
            { ic_plan_id: ids?.ic_plan_id, broker_id: ids?.broker_id } :
            { ic_plan_id: ids?.ic_plan_id, ic_id: ids?.ic_id }))
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

// Load Risk Buckets
export const loadBuckets = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, riskBuckets, error, service.loadBuckets, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Add Deficiency
export const addDeficiency = (payload, rfq_id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.addDeficiency(payload);
      if (data.status === true) {
        dispatch(success(message));
        // dispatch(getSingleUw({ rfq_id: rfq_id, is_uw: 0 }));
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

// Update Deficiency
export const updateDeficiency = (payload, id, rfq_id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateDeficiency(payload, id);
      if (data.status === true) {
        dispatch(success(message));
        // dispatch(getSingleUw({ rfq_id: rfq_id, is_uw: 0 }));
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

// Approve Customer
export const approveCustomer = (payload, id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.approveCustomer(payload, id);
      if (data.status === true) {
        dispatch(set_approved(message));
        dispatch(getUw({ is_uw: 0 }))
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

//work flow config
export const Roles = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, roles, error, service.roles, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const Flow = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, flow, error, service.createFlow, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const InsurerAll = (data, switcher) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      !switcher
        ? actionStructre(dispatch, insurer, error, service.allIns, data)
        : actionStructre(dispatch, ins, error, service.allIns, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const getBroker = (data, switcher) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      !switcher
        ? actionStructre(dispatch, broker, error, service.allBroker, data)
        : actionStructre(dispatch, brkr, error, service.allBroker, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

//work-flow-list-view
export const ListView = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, listview, null, service.workFlowList, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const updateFlow = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors, success } = await service.UpdateFlow(
        id,
        payload
      );
      if (data.data || success) {
        dispatch(updateflow(message || data.data));
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

export const deleteFlow = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.deleteFlow, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}


//list-view
export const userList = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const FullResp = await service.userList(data);
      if (FullResp?.data?.status) {
        FullResp?.data?.data && dispatch(userlist(FullResp?.data?.data));
        FullResp?.data?.journey_access && dispatch(access(FullResp?.data?.journey_access));
      } else {
        dispatch(error(FullResp?.message || FullResp?.errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}



//work-flow-list-view
export const UpdateList = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, updatelist, error, service.UpdateList, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Product Features

// load feature types
export const loadFeatureType = () => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, featureTypes, error, service.loadFeatureType)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// load features
export const loadFeatures = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, features, error, service.loadFeatures)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// load feature
export const loadFeature = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, feature, error, service.loadFeature, id)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// save feature
export const saveFeature = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.saveFeature, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// save feature
export const updateFeature = (data) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.updateFeature, data)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// delete feature
export const removeFeature = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, success, error, service.removeFeature, id)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Add Deficiency
export const createRFQAssignment = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createRFQAssignment(payload);
      if (data.status === true) {
        dispatch(success(message));
        // dispatch(getSingleUw({ rfq_id: rfq_id, is_uw: 0 }));
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

// load feature
export const loadRFQleadAssigne = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      actionStructre(dispatch, leadAssigne, error, service.loadRFQleadAssigne, id)
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

// Approve Customer
export const updateUWQuote = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateUWQuote(payload);
      if (data.status) {
        dispatch(success(message));
        // dispatch(getUw({ is_uw: 0 }))
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

// Approve Customer
export const updateICQuote = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateICQuote(payload);
      if (data.status) {
        dispatch(ICQuotesuccess(message));
        // dispatch(getUw({ is_uw: 0 }))
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

export default Rfq.reducer;

function onlyUnique(value, index, self) {
  return value && self.indexOf(value) === index;
}
