import { createSlice } from "@reduxjs/toolkit";
import swal from 'sweetalert';

import service from "./newbrokerDashboard.service";
import { serializeError } from "utils";

const newBrokerDashboard = createSlice({
    name: "NewBrokerDashboard",
    initialState: {
        loading: false,
        communicationLoading: false,
        claimCountLoading: false,
        enrolmentInProgressLoading: false,
        liveCaselessClaimLoading: false,
        getWidgetsDataResponseLoading: false,
        policyDetailsloading: false,
        error: null,
        success: null,
        allEmailLogs: [],
        allEventTriggersLog: [],
        emailLogDetails: [],
        emailLogFirstPage: 1,
        emailLogLastPage: 1,
        totalQueriesCount: null,
        totalQueriesNotResolvedCount: null,
        totalQueriesResolvedCount: null,
        endorsmentCount: null,
        claimCount: null,
        insurer: [],
        tpa: [],
        enrolmentInProgress: [],
        mapStates: [],
        liveCaselessClaim: [],
        currentStateInfo: [],
        policySubType: [],
        getWidgetsDataResponse: [],
        employerDropdownData: [],
        policyDetails: [],
        showingPolicyNumberOrName: false,
        onSearchData: false
    },
    reducers: {
        loading: (state, { payload = true }) => {
            state.loading = payload
        },
        setCommunicationLoading: (state, { payload = true }) => {
            state.communicationLoading = payload
        },
        setClaimCountLoading: (state, { payload = true }) => {
            state.claimCountLoading = payload;
        },
        setEnrolmentInProgressLoading: (state, { payload = true }) => {
            state.enrolmentInProgressLoading = payload;
        },
        setLiveCaselessClaimLoading: (state, { payload = true }) => {
            state.liveCaselessClaimLoading = payload;
        },
        setGetWidgetsDataResponseLoading: (state, { payload = true }) => {
            state.getWidgetsDataResponseLoading = payload;
        },
        setShowingPolicyNumberOrName: (state, { payload = true }) => {
            state.showingPolicyNumberOrName = payload;
        },
        success: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.success = payload;
        },
        error: (state, { payload }) => {
            state.loading = null;
            state.error = payload;
            state.success = null;
        },
        clear: (state, { payload }) => {
            state.error = null;
            state.success = null;
            state.loading = false;
        },
        setAllEmailLogs: (state, { payload }) => {
            state.allEmailLogs = payload;
        },
        setEmailEventTriggers: (state, { payload }) => {
            state.allEventTriggersLog = payload;
        },
        setEmailLogDetails: (state, { payload }) => {
            state.emailLogDetails = [...state.emailLogDetails, ...payload];
        },
        setPagination: (state, { payload }) => {
            state.emailLogFirstPage = payload.firstPage;
            state.emailLogLastPage = payload.lastPage;
        },
        setQueriesCount: (state, { payload }) => {
            state.totalQueriesCount = payload?.total_queries_count;
            state.totalQueriesNotResolvedCount = payload?.total_queries_not_resolved_count;
            state.totalQueriesResolvedCount = payload?.total_queries_resolved_count;
        },
        setEndorsementCount: (state, { payload }) => {
            state.endorsmentCount = payload;
        },
        setClaimCount: (state, { payload }) => {
            state.claimCount = payload;
        },
        setInsurerAndTpa: (state, { payload }) => {
            state.insurer = payload?.insurers;
            state.tpa = payload?.tpa;
        },
        setEnrolmentInProgress: (state, { payload }) => {
            state.enrolmentInProgress = payload;
        },
        clearOldDataOnNewSubmit: (state, { payload }) => {
            state.emailLogFirstPage = 1;
            state.emailLogLastPage = 1;
            state.emailLogDetails = [];
        },
        setMapStates: (state, { payload }) => {
            state.mapStates = payload;
        },
        setLiveCaselessClaim: (state, { payload }) => {
            state.liveCaselessClaim = payload;
        },
        setCurrentStateInfo: (state, { payload }) => {
            state.currentStateInfo = payload;
        },
        setPolicySubtype: (state, { payload }) => {
            state.policySubType = payload;
        },
        getWidgetsDetails: (state, action) => {
            state.getWidgetsDataResponse = action.payload;
        },
        setEmployerDropdownData: (state, { payload }) => {
            state.employerDropdownData = payload;
        },
        setPolicyDetails: (state, { payload }) => {
            state.policyDetails = payload;
        },
        setPolicyDetailsloading: (state, { payload = true }) => {
            state.policyDetailsloading = payload;
        },
        setOnSearchData: (state, { payload = false }) => {
            state.onSearchData = payload;
        },
        setAllDataClear: (state, { payload }) => {
            state.allEmailLogs = [];
            state.allEventTriggersLog = [];
            state.emailLogDetails = [];
            state.emailLogFirstPage = 1;
            state.emailLogLastPage = 1;
            state.totalQueriesCount = null;
            state.totalQueriesNotResolvedCount = null;
            state.totalQueriesResolvedCount = null;
            state.endorsmentCount = null;
            state.claimCount = null;
            state.insurer = [];
            state.tpa = [];
            state.enrolmentInProgress = [];
            state.mapStates = [];
            state.liveCaselessClaim = [];
            state.currentStateInfo = [];
            state.policySubType = [];
            state.getWidgetsDataResponse = [];
            state.employerDropdownData = [];
            state.policyDetails = [];
            state.showingPolicyNumberOrName = false;
            state.onSearchData = false;
        }
    }
});

export const {
    success, error, clear, loading, setClaimCountLoading, setCommunicationLoading, setAllEmailLogs,
    setEmailEventTriggers, setEmailLogDetails, setPagination,
    clearOldDataOnNewSubmit, setQueriesCount, setEndorsementCount,
    setClaimCount, setInsurerAndTpa, setEnrolmentInProgress,
    setEnrolmentInProgressLoading, setMapStates, setAllDataClear, setLiveCaselessClaimLoading,
    setLiveCaselessClaim, setCurrentStateInfo, setPolicySubtype, getWidgetsDetails,
    setGetWidgetsDataResponseLoading, setEmployerDropdownData, setPolicyDetails, setPolicyDetailsloading,
    setShowingPolicyNumberOrName, setOnSearchData
} = newBrokerDashboard.actions;

export default newBrokerDashboard.reducer;

const GetEmailEventTriggers = () => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data } = await service.getEmailEventTriggers();
            if (data?.status && !!data?.data?.length) {
                dispatch(setEmailEventTriggers(
                    data?.data?.map((item, index) => ({
                        id: item?.id,
                        label: item?.trigger_name,
                        value: item?.id,
                    }))
                ));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(data.message), "warning");
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', "Something went wrong", 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const GetAllEmailLogs = (payload = {},cancelTokenGetAllEmailLogs) => {
    return async (dispatch) => {
        try {
            dispatch(setCommunicationLoading());
            const { data } = await service.getAllEmailLogs(payload, cancelTokenGetAllEmailLogs);
            if (data?.status) {
                dispatch(setAllEmailLogs(data?.emailDashboardLog));
                dispatch(setCommunicationLoading(false));
            } else {
                dispatch(setAllEmailLogs([]));
                // swal("warning", serializeError(data.message), "warning");
                dispatch(setCommunicationLoading(false));
            }
        } catch (err) {
            swal('Error!', "Something went wrong", 'warning');
            console.error("Error", err);
            dispatch(setCommunicationLoading(false));
        }
    };
};

const GetEmailLogsDetails = (payload, pageNo) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data } = await service.getEmailLogsDetails(payload, pageNo);
            if (data?.status) {
                dispatch(setEmailLogDetails(data?.data));
                dispatch(setPagination({
                    firstPage: data.current_page + 1,
                    lastPage: data.last_page,
                }));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(data.message), "warning");
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', "Something went wrong", 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const ResendEmail = async (payload) => {
    try {
        const { data, message, errors } = await service.sendTriggerOffOnEmail(payload);
        if (data.status) {
            swal('Success', message, 'success')
        } else {
            swal("Alert", serializeError(message || errors), "warning");
        }
    } catch (err) {
        console.error("Error", err);
    }
};

const GetQueriesCount = (payload, cancelTokenGetQueriesCount) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.getQueriesCount(payload, cancelTokenGetQueriesCount);
            if (data?.status) {
                dispatch(setQueriesCount(data.data));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setQueriesCount([]));
                console.error("Error ", message || errors);
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const GetEndorsementCount = (payload, cancelTokenGetEndorsementCount) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.getEndorsementCount(payload, cancelTokenGetEndorsementCount);
            if (data?.status) {
                dispatch(setEndorsementCount(data.data));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setEndorsementCount(null));
                console.error("Error ", message || errors);
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const getPercentage = (given, total) => {
    const percent = ((Number(given) * 100) / Number(total));
    return !!percent ? percent?.toFixed(2) : percent;
}

const GetAllClaimCount = (payload, cancelTokenGetAllClaimCount) => {
    return async (dispatch) => {
        try {
            dispatch(setClaimCountLoading());
            const { data, errors, message } = await service.getAllClaimCount(payload, cancelTokenGetAllClaimCount);
            if (data?.status) {
                const _data = {
                    ...data.data,
                    claim_pending_percent: getPercentage(data?.data?.claim_pending, data?.data?.claim_registered),
                    claim_rejected_percent: getPercentage(data?.data?.claim_rejected, data?.data?.claim_registered),
                    claim_settled_percent: getPercentage(data?.data?.claim_settled, data?.data?.claim_registered),
                }
                dispatch(setClaimCount(_data));
                dispatch(setClaimCountLoading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setClaimCount(null));
                console.error("Error ", message || errors);
                dispatch(setClaimCountLoading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(setClaimCountLoading(false));
        }
    };
};

const GetInsurerAndTpa = () => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.getInsurerAndTpa();
            if (data?.status) {
                dispatch(setInsurerAndTpa({
                    insurers: data?.data?.insurers.map(item => ({
                        ...item,
                        label: item?.name,
                        value: item?.id
                    })),
                    tpa: data?.data?.tpa.map(item => ({
                        ...item,
                        label: item?.name,
                        value: item?.id
                    })),
                }));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                console.error("Error ", message || errors);
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const GetEnrolmentInProgress = (payload, cancelTokenGetEnrolmentInProgress) => {
    return async (dispatch) => {
        try {
            dispatch(setEnrolmentInProgressLoading());
            const { data, errors, message } = await service.getEnrolmentInProgress(payload, cancelTokenGetEnrolmentInProgress);
            if (data?.status) {
                dispatch(setEnrolmentInProgress(data?.data));
                dispatch(setEnrolmentInProgressLoading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setEnrolmentInProgress([]));
                console.error("Error ", message || errors);
                dispatch(setEnrolmentInProgressLoading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(setEnrolmentInProgressLoading(false));
        }
    };
};

const GetStates = (payload, cancelTokenGetStates) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.getStates(payload,cancelTokenGetStates);
            if (data?.status) {
                dispatch(setMapStates(data.data));
                dispatch(loading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setMapStates([]));
                console.error("Error ", message || errors);
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};

const GetLiveCaselessClaim = (payload, cancelTokenGetLiveCaselessClaim) => {
    return async (dispatch) => {
        try {
            dispatch(setLiveCaselessClaimLoading());
            const { data, errors, message } = await service.getLiveCaselessClaim(payload, cancelTokenGetLiveCaselessClaim);
            if (data?.status) {
                dispatch(setLiveCaselessClaim(data?.data));
                dispatch(setLiveCaselessClaimLoading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setLiveCaselessClaim([]));
                console.error("Error ", message || errors);
                dispatch(setLiveCaselessClaimLoading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(setLiveCaselessClaimLoading(false));
        }
    };
};

const GetPolicySubType = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.policySubType(payload);
            if (data?.status) {
                dispatch(setPolicySubtype([
                    { policy_sub_type_id: 999, policy_sub_type: "All Cover Type" },
                    ...data?.data
                ]));
                dispatch(loading(false));
            } else {
                swal("warning", serializeError(message || errors), "warning");
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};
const GetWidgetsData = (payload, cancelTokenGetWidgetsData) => {
    return async (dispatch) => {
        dispatch(setGetWidgetsDataResponseLoading(true));
        const getWidgetsDataResponse = await service.getWidgets(payload, cancelTokenGetWidgetsData);
        if (getWidgetsDataResponse.data) {
            dispatch(setGetWidgetsDataResponseLoading(false));
            dispatch(getWidgetsDetails(getWidgetsDataResponse));
        } else {
            dispatch(setGetWidgetsDataResponseLoading(false));
            dispatch(getWidgetsDetails([]));
            console.error("getWidgets API failed");
        }
    };
};

const GetEmployers = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.getUserData(payload);
            if (data.data) {
                dispatch(setEmployerDropdownData(data.data));
            } else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
};
const GetPolicyDetails = (payload, cancelTokenSource) => {
    return async (dispatch) => {
        try {
            dispatch(setPolicyDetailsloading());
            const { data, errors, message } = await service.getPolicyCover(payload, cancelTokenSource);
            if (data?.status) {
                dispatch(setPolicyDetails(data.data));
                dispatch(setPolicyDetailsloading(false));
            } else {
                // swal("warning", serializeError(message || errors), "warning");
                dispatch(setPolicyDetails([]));
                console.error("Error ", message || errors);
                dispatch(setPolicyDetailsloading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(setPolicyDetailsloading(false));
        }
    };
};

const GetMapWiseBusinessDetails = (payload, currentUser, userTypeName) => {
    return async (dispatch) => {
        try {
            dispatch(loading());
            const { data, errors, message } = await service.getMapWiseBusinessDetails(payload);
            if (data?.status) {
                if (!!data?.data?.length) {
                    const employer_id = Array.from(new Set(data.data?.map(item => item?.employer_id)));
                    const _data = {
                        employer_id,
                        is_child_company: Number(!!employer_id?.length && (!!currentUser?.is_super_hr || userTypeName === "Broker")),
                        broker_id: currentUser?.broker_id,
                        ...(userTypeName === "Employer" && {
                            is_employer: true,
                            ...((!employer_id?.length) && { employer_id: [currentUser?.employer_id] }),
                        })
                    }
                    if (!!employer_id?.length) {
                        dispatch(setShowingPolicyNumberOrName(true));
                    } else {
                        dispatch(setShowingPolicyNumberOrName(false));
                    }
                    dispatch(loading(false));
                    dispatch(setOnSearchData({data: _data, show: "Global"}));
                    // dispatch(GetAllEmailLogs(_data));
                    // dispatch(GetQueriesCount(_data));
                    // dispatch(GetEndorsementCount(_data));
                    // dispatch(GetAllClaimCount(_data));
                    // dispatch(GetEnrolmentInProgress(_data));
                    // dispatch(setLiveCaselessClaim(_data));
                    // dispatch(GetPolicySubType(_data));
                    // dispatch(GetWidgetsData(_data));
                    // dispatch(GetPolicyDetails(_data));
                } else {
                    // swal("No Data Found !", "", "warning");
                    dispatch(loading(false));
                }
            } else {
                swal("warning", serializeError(message || errors), "warning");
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Error!', err, 'warning');
            console.error("Error", err);
            dispatch(loading(false));
        }
    };
};
export {
    GetAllEmailLogs, GetEmailEventTriggers, GetEmailLogsDetails, ResendEmail,
    GetQueriesCount, GetEndorsementCount, GetAllClaimCount, GetInsurerAndTpa, GetEnrolmentInProgress, GetStates,
    GetMapWiseBusinessDetails, GetLiveCaselessClaim, GetPolicySubType, GetWidgetsData, GetEmployers, GetPolicyDetails
}
