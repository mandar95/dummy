import { createSlice } from "@reduxjs/toolkit";
import service from "./documents.serviceApi";
import { serializeError, actionStructre } from "utils";

export const documentSlice = createSlice({
    name: "document",
    initialState: {
        loading: false,
        error: null,
        success: null,
        customerDocumentsData: [],
        insurerDocumentsData: [],
        fileTypeData: [],
        planTypeData: [],
        editCustomerData: {},
        customerUpdate: null,
        editInsurerData: {},
        insurerUpdate: null,
        allDeclrationData: [],
        Declarationsuccess: null,
        declarationUpdated: null,
        allAdminDeclrationData: [],
        AllICListData:[],
        broker: [],
        trigger: 'insurer',
        ic:'',
        brokerId: ''
    },
    reducers: {
        loading: (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        },
        success: (state, { payload }) => {
            state.loading = null;
            state.pincodeLoading = null;
            state.error = null;
            state.success = payload;
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
            switch (payload) {
                case "customer-doc":
                    state.customerUpdate = null;
                    break;
                case "insurer-doc":
                    state.insurerUpdate = null;
                    break;
                case "declaration":
                    state.declarationUpdated = null;
                    break;
                default:
                    break;
            }
        },
        customerDocuments: (state, { payload }) => {
            if (typeof payload !== "string") {
                state.customerDocumentsData = payload;
            }
            else {
                state.customerDocumentsData = [];
            }
            state.loading = null;

        },
        insurerDocuments: (state, { payload }) => {
            if (typeof payload !== "string") {
                state.insurerDocumentsData = payload;
            }
            else {
                state.insurerDocumentsData = [];
            }
            state.loading = null;
        },
        fileType: (state, { payload }) => {
            state.fileTypeData = payload;
        },
        planType: (state, { payload }) => {
            state.planTypeData = payload;
        },
        editCustomerDocuments: (state, { payload }) => {
            state.editCustomerData = payload;
        },
        updateCustomer: (state, { payload }) => {
            state.customerUpdate = payload;
        },
        editInsurerDocuments: (state, { payload }) => {
            state.editInsurerData = payload;
        },
        updateInsurer: (state, { payload }) => {
            state.insurerUpdate = payload;
        },
        allDeclration: (state, { payload }) => {
            state.allDeclrationData = payload;
            state.loading = null;
        },
        Declarationsuccess: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.Declarationsuccess = payload;
        },
        declarationUpdated: (state, { payload }) => {
            state.loading = null;
            state.pincodeLoading = null;
            state.error = null;
            state.success = payload;
        },
        setDeclaration: (state, { payload }) => {
            state.allDeclrationData = payload.data;
            state.loading = null;
        },
        allAdminDeclration: (state, { payload }) => {
            state.allAdminDeclrationData = payload;
            state.loading = null;
        },
        setAdminDeclaration: (state, { payload }) => {
            state.allAdminDeclrationData = payload.data;
            state.loading = null;
        },
        clearDeclaration: (state) => {
            state.allAdminDeclrationData = [];
        },
        AllICList: (state, { payload }) => {
            state.AllICListData = payload;
            state.loading = null;
        },
        broker: (state, { payload }) => {
            state.broker = payload;
            state.loading = null;
        },
        trigger:  (state, { payload }) => {
            state.trigger = payload;
        },    
        ic:  (state, { payload }) => {
            state.ic = payload;
        },      
        brokerId:  (state, { payload }) => {
            state.brokerId = payload;
        },
    },
});

export const {
    loading,
    success,
    error,
    clear,
    customerDocuments,
    insurerDocuments,
    fileType,
    planType,
    editCustomerDocuments,
    updateCustomer,
    editInsurerDocuments,
    updateInsurer,
    allDeclration,
    Declarationsuccess,
    declarationUpdated,
    setDeclaration,
    allAdminDeclration,
    setAdminDeclaration,
    clearDeclaration,
    AllICList,
    broker,
    trigger,
    brokerId,
    ic
} = documentSlice.actions;

// Action creator
export const uploadCustomerDocument = (uploadData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.uploadCustomerDocument(uploadData);
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

export const getAllCustomerDocuments = () => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, customerDocuments, error, service.getAllCustomerDocuments);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const deleteCustomerDocument = (id) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, success, error, service.deleteCustomerDocument, id);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const editCustomerDocument = (data) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, editCustomerDocuments, error, service.editCustomerDocument, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateCustomerDocument = (id, payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.updateCustomerDocument(
                id,
                payload
            );
            if (data.data || data.status) {
                dispatch(updateCustomer(message || data.data));
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

export const uploadInsurerDocument = (uploadData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.uploadInsurerDocument(uploadData);
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

export const getAllInsurerDocuments = (data) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, insurerDocuments, error, service.getAllInsurerDocuments, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const deleteInsurerDocument = (id) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, success, error, service.deleteInsurerDocument, id);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const editInsurerDocument = (data) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, editInsurerDocuments, error, service.editInsurerDocument, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateInsurerDocument = (id, payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateInsurerDocument(
                id,
                payload
            );
            if (data.data || success) {
                dispatch(updateInsurer(message || data.data));
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

export const getFileType = () => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, fileType, error, service.getFileType);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const getPlanType = (data) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, planType, error, service.getPlanType, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

// .......................insurer declration..................

export const createDeclration = (declrationData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.createDeclration(declrationData);
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

export const deleteDeclration = (id) => {
    return async (dispatch) => {
        try {
            actionStructre(dispatch, success, error, service.deleteDeclration, id);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const updateDeclaration = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateDeclaration(
                payload
            );
            if (data.data || success) {
                dispatch(declarationUpdated(message || data.data));
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

export const getAllDeclration = (data) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, allDeclration, error, service.getAllDeclration, data);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};



export const CreateMaterDeclaration = (masterData) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.createMaterDeclaration(
                masterData
            );
            if (data.status) {
                dispatch(Declarationsuccess(message));
            } else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};

export const getAllAdminDeclaration = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, allAdminDeclration, error, service.getAllAdminDeclaration, payload);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const updateAdminDeclaration = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors, success } = await service.updateAdminDeclaration(
                payload
            );
            if (data.data || success) {
                dispatch(declarationUpdated(message || data.data));
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


export const getAllIcList = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            actionStructre(dispatch, AllICList, error, service.getAllIcList, payload);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}


export const getBroker = (data) => {
    return async (dispatch) => {
      try {
        dispatch(loading());
        actionStructre(dispatch, broker, error, service.allBroker, data)
      } catch (err) {
        dispatch(error("Something went wrong"));
        console.error("Error", err);
      }
    };
  }

export default documentSlice.reducer;
