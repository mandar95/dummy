import { createSlice } from '@reduxjs/toolkit';
import Services from './form.center.service';
import swal from "sweetalert";


const formCenterSlice = createSlice({
    name: "formcenter",
    initialState: {
        loading: false,
        broker: [],
        broker_employers: [],
        broker_documents: [],
        broker_policyType: [],
        broker_policyNumbers: [],
        broker_details: [],
        resetStatus: false,
        broker_post_policyNumbers: [],
    },
    reducers: {
        loading: (state, { payload }) => {
            state.loading = payload;
        },
        initialiseAdminBroker: (state, action) => {
            state.broker = action.payload;
        },
        initialiseBrokerFormCenter: (state, action) => {
            state.broker_documents = action.payload.documents;
            state.broker_employers = action.payload.employers;
            state.broker_policyType = action.payload.policyType;
        },
        setBrokerPolicyNumbers: (state, action) => {
            state.broker_policyNumbers = action.payload;
        },
        updateBrokerEmployers: (state, action) => {
            state.broker_employers = action.payload;
        },
        updateBrokerDocuments: (state, action) => {
            state.broker_documents = action.payload;
        },
        updateBrokerPolicyType: (state, action) => {
            state.broker_policyType = action.payload;
        },
        getDocumentDetails: (state, action) => {
            state.broker_details = action.payload;
        },
        resetState: (state, action) => {
            state.resetStatus = !state.resetStatus;
        },
        setPostBrokerPolicyNumbers: (state, action) => {
            state.broker_post_policyNumbers = action.payload;
        }


    }
})


export const {
    initialiseAdminBroker,
    initialiseBrokerFormCenter,
    setBrokerPolicyNumbers,
    updateBrokerEmployers,
    updateBrokerDocuments,
    updateBrokerPolicyType,
    getDocumentDetails,
    resetState,
    setPostBrokerPolicyNumbers,
    loading
} = formCenterSlice.actions;

export const initialiseAdmin = (userType) => {
    return async dispatch => {
        let response = await Services.adminGetBroker(userType);
        if (response.data?.data.length > 0) {
            dispatch(initialiseAdminBroker(response.data?.data));
        }
    }
}

export const initialiseBroker = (id) => {
    return async dispatch => {
        try {
            let response = await Promise.all([
                // Services.brokerGetEmployers(id),
                Services.brokerGetDocuments(), Services.brokerGetPolicyType()]);
            if (
                // response[0].data?.status && 
                response[0].data?.status && response[1].data?.status) {
                dispatch(initialiseBrokerFormCenter({
                    documents: response[0].data?.data,
                    policyType: response[1].data?.data
                }))
            }
        }
        catch (error) {
            // dispatch(initialiseBroker());
        }
    }
}


export const getBrokerPolicyNumber = (payload) => {
    return async dispatch => {
        try {
            let response = await Services.brokerPostPolicyNumber(payload);
            if (response.data?.status) {
                dispatch(setBrokerPolicyNumbers(response.data?.data));
            }
            else {
                dispatch(setBrokerPolicyNumbers([]));
                swal(response.data?.message, "", "warning");
            }
        }
        catch (error) {

        }
    }
}

export const adminGetDocuments = () => {
    return async dispatch => {
        let response = await Services.brokerGetDocuments();
        if (response.data?.status) {
            dispatch(updateBrokerDocuments(response.data?.data));
        }
    }
}

export const adminGetPolicyTypes = () => {
    return async dispatch => {
        let response = await Services.brokerGetPolicyType();
        if (response.data?.status) {
            dispatch(updateBrokerPolicyType(response.data?.data));
        }
    }
}

export const adminGetEmployer = (payload) => {
    return async dispatch => {
        let response = await Services.adminGetEmployer(payload);
        if (response.data?.status) {
            dispatch(updateBrokerEmployers(response.data?.data));
            dispatch(adminGetDocuments());
            dispatch(adminGetPolicyTypes());
        }
    }
}


export const submitDocument = (payload, ResetData) => {
    return async dispatch => {
        try {
            dispatch(loading(true))
            let response = await Services.submitDocument(payload);
            if (response.data?.status) {
                swal(response.data?.message, "", "success").then(ResetData);
                dispatch(getDocument());
                dispatch(loading(false))
            }
            else {
                swal("Submission failed", "", "warning");
                dispatch(loading(false))
            }
        }
        catch (error) {
            swal("Something went wrong", "", "warning");
            dispatch(loading(false))
        }
    }
}


export const getDocument = (payload) => {
    return async dispatch => {
        let response = await Services.getDocument(payload);
        if (!!response.data?.data?.length) {

            let value = response.data.data.map(v => {
                return ({
                    id: v.id,
                    company_name: v.employer_name,
                    master_document_type_name: v.master_document_type_name,
                    policy_number: v.policy_number,
                    document_name: v.document_name,
                    document: v.document_path,
                    document_type_id: v.document_type_id,
                    policy_type_id: v.policy_type,
                    policy_id: v.policy_id,
                    employer_id: v.employer_id

                })

            })
            dispatch(getDocumentDetails(value));
        }
        else {
            dispatch(getDocumentDetails([]));
            // swal("Something went wrong", "", "warning");
        }
    }
}

export const deleteDetails = (id) => {
    return async dispatch => {
        let response = await Services.deleteDetails(id);
        if (response.data?.status) {
            swal("Details deleted successfully", "", "success").then(() => {
                dispatch(getDocument());
            })
        }
        else {
            swal("Something went wrong", "", "warning");
        }
    }
}

export const brokerPostPolicyNumber = (payload) => {
    return async dispatch => {
        let response = await Services.brokerPostPolicyNumber(payload);
        if (response.data?.status) {
            dispatch(setPostBrokerPolicyNumbers(response.data?.data));
        }
        else {
            dispatch(setPostBrokerPolicyNumbers([]));
        }
    }
}

export const updateDetails = (id, data) => {
    return async dispatch => {
        let response = await Services.updateDetails(id, data);
        if (response.data?.status) {
            swal("Updated successfully", "", "success").then(() => {
                dispatch(getDocument())
            })
        }
    }
}


//selector
export const formcenter = state => state.formcenter;

export default formCenterSlice.reducer;
