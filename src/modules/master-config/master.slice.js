import { createSlice } from "@reduxjs/toolkit";
import { service } from "./serviceApi";
import { getFirstError } from "../../utils";

export const master = createSlice({
  name: "master",
  initialState: {
    loading: false,
    response: {},
    postResp: {},
    updateResp: {},
    countryResp: {},
    allMasterResp: {},
    queries: [],
    tpa: [],
    announcement: [],
    policytype: [],
    subResp: [],
    alert: null,
    success: null,
    error: null,
    sample: {},
  },

  //reducers
  reducers: {
    loading: (state) => {
      state.loading = true
    },
    setqueries: (state, action) => {
      state.queries = action.payload;
    },
    settpa: (state, action) => {
      state.tpa = action.payload;
    },
    setannouncement: (state, action) => {
      state.announcement = action.payload;
    },
    setpolicytype: (state, action) => {
      state.policytype = action.payload;
    },
    tableDetails: (state, action) => {
      state.response = action.payload;
      state.loading = false;
    },
    clearResponse: (state, action) => {
      state.response = {};
    },
    postDetails: (state, action) => {
      state.postResp = action.payload;
    },
    fileDetails: (state, action) => {
      state.sample = action.payload;
    },
    clearPostDetails: (state, action) => {
      state.postResp = {};
    },
    updateDetails: (state, action) => {
      state.updateResp = action.payload;
    },
    countryDetails: (state, action) => {
      state.countryResp = action.payload;
    },
    allMasterDetails: (state, action) => {
      state.allMasterResp = action.payload;
      state.loading = false;
    },
    setResp: (state, action) => {
      state.subResp = action.payload;
    },
    alertMessage: (state, action) => {
      state.alert = action.payload;
    },
    clearAlertMessage: (state, action) => {
      state.alert = null;
    },
    success: (state, { payload }) => {
      state.success = payload;
      state.alert = null;
    },
    clear_success: (state, { payload }) => {
      state.success = null;
      state.alert = null;
    },
    clear_sample: (state, { payload }) => {
      state.sample = null;
    },
  },
});

export const {
  loading,
  setqueries,
  settpa,
  clear_sample,
  setannouncement,
  setpolicytype,
  tableDetails,
  clearResponse,
  updateDetails,
  postDetails,
  countryDetails,
  allMasterDetails,
  setResp,
  alertMessage,
  clearAlertMessage,
  clearPostDetails,
  success,
  clear_success,
  fileDetails,
} = master.actions;


export const setQueries = () => {
  return async dispatch => {
    let response = await service.getQuery();
    if (response?.data?.status) {
      dispatch(setqueries(response?.data?.data));
    }
  }
}

export const setTpa = () => {
  return async dispatch => {
    let response = await service.getTpa();
    if (!!response?.data?.data) {
      dispatch(settpa(response?.data?.data))
    }
  }
}

export const setAnnounce = () => {
  return async dispatch => {
    let response = await service.getAnnouncement();
    if (response?.data?.status) {
      dispatch(setannouncement(response?.data?.data))
    }
  }
}

export const setPolicyType = () => {
  return async dispatch => {
    let response = await service.getPolicyTypes();
    if (response?.data?.status) {
      dispatch(setpolicytype(response?.data?.data))
    }
  }
}

//action Creators

export const getAllMaster = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const allMasterResp = await service.allMaster(id);
      if (allMasterResp?.data) {
        dispatch(allMasterDetails(allMasterResp));
      } else {
        let error =
          allMasterResp?.data?.errors &&
          getFirstError(allMasterResp?.data?.errors);
        error = error
          ? error
          : allMasterResp?.data?.message
            ? allMasterResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// TPA

export const loadTPA = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getTpa();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editTPA = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editTPA(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadTPA());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteTPA = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteTPA(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadTPA());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Relation

export const loadRelation = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getRelation();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editRelation = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editRelation(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadRelation());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteRelation = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteRelation(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadRelation());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postRelation = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeRelation(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadRelation());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Designation

export const loadDesignation = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getDesignation();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editDesignation = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editDesignation(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadDesignation());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const setTPA = () => {
  return async (dispatch) => {
    try {
      const response = await service.getTpa();
      if (response?.data) {
        dispatch(setResp(response?.data?.data));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

//TPA Services
export const loadTPAServices = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      let response = await service.getTPAData();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editTPAServices = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editService(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadTPAServices());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const postTPAService = (payload) => {
  return async (dispatch) => {
    try {
      let { data } = await service.storeTPAData(payload);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadTPAServices());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editTPAService = () => {
  return async (dispatch) => {
    try {
    } catch (error) { }
  };
};

export const deleteTPAService = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteTPAData(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadTPAServices());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postTpa = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeTpa(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadTPA());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Relation

export const deleteDesignation = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteDesignation(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadDesignation());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postDesignation = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeDesignation(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadDesignation());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Construct

export const loadConstruct = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getConstruct();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editConstruct = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editConstruct(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadConstruct());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteConstruct = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteConstruct(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadConstruct());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postFamilyConstruct = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeFamilyConstruct(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadConstruct());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Country

export const getCountries = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.countries();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const updateCountries = (id) => {
  return async (dispatch) => {
    try {
      const updateResp = await service.updateCountry(id);
      if (updateResp?.data) {
        dispatch(updateDetails(updateResp));
      } else {
        let error =
          updateResp?.data?.errors && getFirstError(updateResp?.data?.errors);
        error = error
          ? error
          : updateResp?.data?.message
            ? updateResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const getCountry = (id) => {
  return async (dispatch) => {
    try {
      const countryResp = await service.country(id);
      if (countryResp?.data) {
        dispatch(countryDetails(countryResp));
      } else {
        let error =
          countryResp?.data?.errors && getFirstError(countryResp?.data?.errors);
        error = error
          ? error
          : countryResp?.data?.message
            ? countryResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editCountry = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editCountry(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(getCountries());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteCountry = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteCountry(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(getCountries());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postCountries = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeCountries(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(getCountries());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Policy

export const loadPolicyTypes = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getPolicyTypes();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editPolicy = (id, payload) => {
  return async (dispatch) => {
    try {
      const { data } = await service.editPolicy(id, payload);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(loadPolicyTypes())
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deletePolicy = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deletePolicy(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadPolicyTypes());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const setPolicyTypes = () => {
  return async (dispatch) => {
    try {
      const response = await service.getPolicyTypes();
      if (response?.data) {
        dispatch(setResp(response?.data?.data));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postPolicy = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storePolicy(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadPolicyTypes());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Premium

export const loadPremium = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getPremium();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deletePremium = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deletePremium(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadPremium());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editPremium = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editPremium(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadPremium());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

// Insurer

export const loadInsurer = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getInsurer();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editInsurer = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editInsurer(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadInsurer());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }

}

export const deleteInsurer = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteInsurer(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadInsurer());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Master Query Type not using

export const loadMasterQueryType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getMasterQueryType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Query

export const loadQuery = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getQuery();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editQuery = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editQuery(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadQuery());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteQuery = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteQuery(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadQuery());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const setQuery = () => {
  return async (dispatch) => {
    try {
      const response = await service.getQuery();
      if (response?.data) {
        dispatch(setResp(response?.data?.data));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postQuery = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeQuery(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadQuery());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Alignment

export const loadAlignment = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getAlignment();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editAlignment = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editAlignment(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadAlignment());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteAlignment = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteAlignment(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadAlignment());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postAlignment = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeAlignment(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadAlignment());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Position

export const loadPosition = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getPosition();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editPosition = (id, data) => {
  return async dispatch => {
    try {
      let response = await service.editPosition(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadPosition());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deletePosition = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deletePosition(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadPosition());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postPosition = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storePosition(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadPosition());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// SumInsured

export const loadSumInsured = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getSumInsured();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editSumInsured = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSumInsured(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadSumInsured());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteSumInsured = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteSumInsured(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadSumInsured());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSumInsured = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeSumInsured(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadSumInsured());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// SubSumInsured

export const loadSubSumInsured = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getSubSumInsured();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editSubSumInsured = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSubSumInsured(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadSubSumInsured());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteSubSumInsured = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteSubSumInsured(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadSubSumInsured());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSubSumInsured = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeSubSumInsured(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadSubSumInsured());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Size

export const loadSize = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getSize();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editSize = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSize(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadSize());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteSize = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteSize(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadSize());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSize = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeSize(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadSize());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Grade

export const loadGrade = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getGrade();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editGrade = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editGrade(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadGrade());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteGrade = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteGrade(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadGrade());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postGrade = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeGrade(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadGrade());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Query Sub Type

export const loadQuerySubType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getQuerySubType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editQuerySubType = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSubQuery(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadQuerySubType());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteQuerySubType = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteQuerySubType(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadQuerySubType());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSubQuery = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeSubQuery(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadQuerySubType());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Policy Sub Type
export const loadPolicySubType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getPolicySubType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editPolicySubType = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSubPolicy(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadPolicySubType());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deletePolicySubType = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deletePolicySubType(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadPolicySubType());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSubPolicy = (data) => {
  return async (dispatch) => {
    try {
      const response = await service.storeSubPolicy(data);
      if (response?.data) {
        dispatch(postDetails(response));
        dispatch(loadPolicySubType());
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Policy Content
export const loadPolicyContent = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getPolicyContent();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const editPolicyContent = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editPolicyContent(id, data);
      if (response?.data?.staus) {
        dispatch(success(response?.data?.message));
        dispatch(loadPolicyContent());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}


export const deletePolicyContent = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deletePolicyContent(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadPolicyContent());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Insurer Type
export const loadInsurerType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getInsurerType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editInsurerType = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editInsurerType(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadInsurerType());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteInsurerType = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteInsurerType(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadInsurerType());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Announcement
export const loadAnnouncement = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getAnnouncement();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editAnnouncement = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editAnnouncement(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadAnnouncement());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const postAnnouncement = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeAnnouncement(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadAnnouncement());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deleteAnnouncement = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteAnnouncement(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadAnnouncement());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// Announcement Sub Type
export const loadAnnouncementSubType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.getAnnouncementSubType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error ? error : response?.data?.message;
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editAnnouncementSubType = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editAnnouncementSubType(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadAnnouncementSubType());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const setAnnouncement = (data) => {
  return async (dispatch) => {
    try {
      const response = await service.getAnnouncement(data);
      if (response?.data) {
        dispatch(setResp(response?.data?.data));
        dispatch(loadAnnouncementSubType());
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deleteAnnouncementSubType = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteAnnouncementSubType(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadAnnouncementSubType());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postSubAnnouncement = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeSubAnnouncement(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadAnnouncementSubType());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postInsurerType = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeInsurerType(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadInsurerType());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postPolicyContent = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storePolicyContent(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadPolicyContent());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postInsurer = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storeInsurer(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadInsurer());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const postPremium = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.storePremium(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadPremium());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const getSampleFile = (id) => {
  return async (dispatch) => {
    try {
      const sample = await service.sampleFile(id);
      if (sample?.data) {
        dispatch(fileDetails(sample));
      } else {
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

//dashboard icon
export const loadDashboardIcone = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.loadDashboardIcone();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};


export const createDashboardIcon = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.createDashboardIcon(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadDashboardIcone());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deleteDashboardIcone = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteDashboardIcone(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadDashboardIcone());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editDashboardIcon = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editDashboardIcon(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadDashboardIcone());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

//sample format

export const loadSampleFormat = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.loadSampleFormat();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const createSampleFormat = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.createSampleFormat(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadSampleFormat());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deleteSampleFormat = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteSampleFormat(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadSampleFormat());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editSampleFormat = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editSampleFormat(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadSampleFormat());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

//notification

export const loadNotificationType = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.loadNotificationType();
      if (response?.data) {
        dispatch(tableDetails(response));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const createNotificationAction = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.createNotificationAction(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadNotificationType());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const deleteNotificationAction = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteNotificationAction(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadNotificationType());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

// campaign

export const loadCampaign = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const response = await service.loadCampaign();
      if (response?.data) {
        const response2 = { data: { data: response?.data?.data?.map((elem) => ({ id: elem.id, name: elem.name, codes: elem.codes?.[0]?.campaign_code || '' })) } }
        dispatch(tableDetails(response2));
      } else {
        let error =
          response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const createCampaign = (data) => {
  return async (dispatch) => {
    try {
      const postResp = await service.createCampaign(data);
      if (postResp?.data) {
        dispatch(postDetails(postResp));
        dispatch(loadCampaign());
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error
          ? error
          : postResp?.data?.message
            ? postResp?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

export const editCampaign = (id, data) => {
  return async dispatch => {
    try {
      const response = await service.editCampaign(id, data);
      if (response?.data?.status) {
        dispatch(success(response?.data?.message));
        dispatch(loadCampaign());
      }
      else {
        let error = response?.data?.errors && getFirstError(response?.data?.errors);
        error = error
          ? error
          : response?.data?.message
            ? response?.data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    }
    catch (error) {
      dispatch(alertMessage("Something went wrong"));
    }
  }
}

export const deleteCampaign = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await service.deleteCampaign(id);
      if (data.status) {
        dispatch(success(data.message));
        dispatch(loadCampaign());
      } else {
        let error = data?.errors && getFirstError(data?.errors);
        error = error
          ? error
          : data?.message
            ? data?.message
            : "Something went wrong";
        dispatch(alertMessage(error));
      }
    } catch (err) {
      dispatch(alertMessage("Something went wrong"));
    }
  };
};

//reducer export
export default master.reducer;
