import { createSlice } from "@reduxjs/toolkit";
import service from './login.service';
import service2 from 'modules/RFQ/home/home.service.js';

import SecureLS from "secure-ls";
import { serializeError, actionStructre, downloadFile } from "../../../utils";
// import Theme from '../../../theme/theme';
import { loadThemes } from "modules/theme/theme.slice";
import { giveProperId } from "../../RFQ/home/home";
import swal from "sweetalert";
import { all_claim_data, setClaimAllData } from "../../claims/claims.slice";
import { ModuleControl } from "../../../config/module-control";

const ls = new SecureLS();
const loginSlice = createSlice({
    name: "login",
    initialState: {
        loading: false,
        error: null,
        isAuthenticated: (!!ls.get("token") && !!ls.get("loggedInUser")) || false,
        loggedInUser: !!ls.get("loggedInUser") || null,
        modules: null,
        userType: null,
        currentUser: {},
        logoutResp: null,
        TokenResp: {},
        getExpiryResp: {},
        success: null,
        // theme: Theme,
        securityQuestion: [],
        QAsuccess: null,
        QAVerifysuccess: null,
        QAVerifytoken: null,
        errorQA: null
    },
    reducers: {
        login: state => {
            state.loading = true;
            state.error = null;
        },
        loading: (state, { payload = true }) => {
            state.loading = payload;
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
            state.errorQA = null;
            state.success = null;
            switch (payload) {
                case "QAVerify":
                    state.QAVerifysuccess = null;
                    state.QAVerifytoken = null;
                    break;
                default:
                    break;
            }
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.modules = action.payload ? action.payload.modules.filter(({ url }) => !url.includes('er/policy-flexible-benefits')).map(({ name, ...rest }) => ({ ...rest, name: rest.url === '/employee/policy-flexible-benefits' ? 'Enrolment' : name })) : null;
            state.error = null;
        },
        loginError: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        forgotPassword(state) {
            state.loading = true;
            state.error = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        forgotPasswordError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPassword(state) {
            state.loading = true;
            state.error = null;
        },
        changePassword(state) {
            state.loading = true;
            state.error = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.success = action.payload;
        },
        changePasswordSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.success = action.payload;
            state.getExpiryResp = {}
        },
        resetPasswordError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        changePasswordError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getMe(state) {
            state.loading = true;
            state.error = null;
        },
        getMeSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
            state.userType = ls.get("userType")
        },
        getMeError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout: state => {
            state.loading = true;
            state.error = null;
        },
        logoutSuccess: state => {

            state.error = null;
            state.isAuthenticated = false;
            state.userType = null;
            state.modules = null;
            // state.loading = false;
        },
        logoutError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getModules: state => {
            state.loading = false;
            state.error = null;
        },
        getModulesSuccess: (state, action) => {
            // state.loading = true;
            state.error = null;
            state.modules = action.payload.filter(({ url }) => !url.includes('er/policy-flexible-benefits')).map(({ name, ...rest }) => ({ ...rest, name: rest.url === '/employee/policy-flexible-benefits' ? 'Enrolment' : name }));
        },
        getModulesError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutDetails: (state, action) => {
            state.logoutResp = action.payload;
        },
        VerifyToken: (state, action) => {
            state.TokenResp = action.payload;
        },
        expiryDetails: (state, action) => {
            state.loading = false;
            state.getExpiryResp = action.payload;
        },
        alertCleanup: (state) => {
            state.success = null;
            state.error = null;
        },
        cleanExpiryDetails: (state) => {
            state.getExpiryResp = {};
        },
        SecurityQuestion: (state, action) => {
            state.securityQuestion = action.payload;
        },
        QAsuccess: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.QAsuccess = payload;
        },
        QAVerifysuccess: (state, { payload }) => {
            state.loading = null;
            state.error = null;
            state.QAVerifysuccess = payload;
        },
        QAVerifytoken: (state, { payload }) => {
            state.QAVerifytoken = payload;
        },
        errorQA: (state, { payload }) => {
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
            state.errorQA = message !== ' ' ? message : 'Unable to connect to the server, please check your internet connection.';
            state.success = null;
        },
    }
});

export const {
    loading,
    getMe, getMeSuccess, getMeError,
    login, loginSuccess, loginError,
    logout, logoutSuccess, logoutError,
    forgotPassword, forgotPasswordSuccess, forgotPasswordError,
    resetPassword, resetPasswordSuccess, resetPasswordError,
    getModules, getModulesSuccess, getModulesError,
    logoutDetails, VerifyToken, changePasswordError,
    changePasswordSuccess, changePassword, expiryDetails,
    alertCleanup, cleanExpiryDetails,
    SecurityQuestion,
    error,
    QAsuccess,
    clear,
    QAVerifysuccess,
    QAVerifytoken,
    errorQA
} = loginSlice.actions;



const MasterUserName = {
    1: 'Super Admin',
    // 2: 'Login as Admin',
    3: 'Broker',
    4: 'Employer',
    5: 'Employee',
    6: 'IC',
    7: 'Customer'
}

const UserTypeHelper = (type) => {
    if (!Number(type)) {
        return type
    }
    else {
        return MasterUserName[type.split('')[type.length - 1]]
    }
}

export const verifyOtpAction = (payload, payload1) => {
    return async dispatch => {
        try {
            const { data, message, errors } = await service.verifyOtp(payload);

            if (data.status) {
                dispatch(handleLogin(payload1))
            }
            else {
                swal('Alert', serializeError(message || errors), 'warning');
            }
        } catch (err) {
            swal('Alert', 'Something went wrong', 'warning');
        }
    }
}

export const resendOtpAction = (payload, payload1) => {
    return async dispatch => {
        try {
            dispatch(loading(true));
            const { data, message, errors } = await service.resendOtp(payload);

            if (data.status) {
                swal('Success', message, 'info')
                dispatch(loading(false));
            }
            else {
                swal('Alert', serializeError(message || errors), 'warning');
                dispatch(loading(false));
            }
        } catch (err) {
            swal('Alert', 'Something went wrong', 'warning');
            dispatch(loading(false));
        }
    }
}

// Action creators
export const handleLogin = (payload, refresh, isSSO, setOTPModal) => {
    return async dispatch => {
        try {

            dispatch(login());
            localStorage.setItem('theme', '')
            const { data, success, errors, message } = await service.login(payload);
            if (success && data) {
                if (setOTPModal && data.tfa_enabled && ModuleControl.TwoFactorAuthentication.allowed) {
                    dispatch(loginError(false))
                    setOTPModal({ tfa_type: data.tfa_type, user_id: data.user_id, payload })
                    return null
                }
                ls.set("token", data.api_token);
                ls.set("isSSO", isSSO ? true : false);
                ls.set("modules", data.modules);
                ls.set("userType", UserTypeHelper(data.type));
                ls.set("session", Date.now() + 15 * 60 * 1000); //expire after 15 minute
                if (data.language) { document.cookie = `googtrans=${data.language}; Path=/;secure`; }

                const userDetails = await getUserDetails(refresh ? {
                    master_user_type_id: payload.master_user_type_id,
                    user_id: payload.user_id
                } : {});
                if (userDetails) {
                    // reset overall claim data
                    dispatch(setClaimAllData({
                        broker_id: undefined,
                        employer_id: undefined,
                        policy_type: undefined,
                        policy_id: undefined,
                        from_date: undefined,
                        to_date: undefined,
                        url: null
                    }))
                    dispatch(all_claim_data([]))

                    dispatch(loadCurrentUser());
                    dispatch(loadThemes(true, userDetails.theme_id))
                    dispatch(loginSuccess());
                    if (refresh) {
                        return true
                        //  window.location.replace('/')
                    }
                    const getExpiryResp = await service.expiry()
                    if (getExpiryResp) {
                        dispatch(expiryDetails(getExpiryResp));
                    } else {
                        console.error("expiry api failed")
                    }

                } else {
                    dispatch(loginError("Not valid user"));
                }
            } else {
                dispatch(loginError(serializeError(errors || message)));
            }


        } catch (err) {
            dispatch(loginError(err));
        }

    }
};

export const handleForgotPassword = payload => {
    return async dispatch => {
        try {
            dispatch(forgotPassword());
            const result = await service.forgotPassword(payload);
            const { errors, data, message } = result;
            if (data && data.status && data.message) {
                dispatch(forgotPasswordSuccess(data.message));
            } else {
                dispatch(forgotPasswordError(serializeError(errors || message)));
            }
        } catch (err) {
            dispatch(forgotPasswordError(err));
        }
    }
}

export const handleResetPassword = payload => {
    return async dispatch => {
        try {
            dispatch(resetPassword());
            const result = await service.resetPassword(payload);
            const { errors, data, message } = result;
            if (data && data.status && data.message) {
                dispatch(resetPasswordSuccess(data.message));
            } else {
                dispatch(resetPasswordError(serializeError(errors || message)));
            }
        } catch (err) {
            dispatch(resetPasswordError(err));
        }
    }
}

export const getUserDetails = async (payload = {}) => {
    try {
        const { data } = await service.getProfile(payload);
        if (data && data.data && data.data.length > 0 && data.data !== 'User not available.') {

            if (data.data[0].profile_master === 'Customer') {
                var { data: logoData } = await service2.getConfigData(giveProperId({}));
            }
            data.data[0].branding = (!data.data[0].branding) ?
                logoData?.data?.logo : data.data[0].branding;
            ls.set("loggedInUser", data.data[0]);
            return data.data[0];
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export const loadCurrentUser = () => {
    return async dispatch => {
        try {
            dispatch(getMe());
            const user = ls.get("loggedInUser");
            dispatch(getMeSuccess({ ...user, is_super_hr: user.is_super_hr ? 1 : 0, child_entities: user.child_entities?.filter(({ id }) => id) || [] }));

            // dispatch(getMeSuccess({ ...user, child_entities: user.child_entities.filter(({ id }) => id) || [] }));
        } catch (err) {
            dispatch(getMeError());
            console.error(err)
        }
    }
};

export const handleLogout = () => {
    return async dispatch => {
        try {
            dispatch(logout());
            const logoutResp = await service.logoutAction();
            if (logoutResp) {
                dispatch(logoutDetails());
                ls.remove("token");
                ls.remove("loggedInUser");
                ls.remove("modules");
                ls.remove("userType");
                ls.remove("session");
                ls.remove('checkTab')
                localStorage.setItem('dark', 0)
                localStorage.setItem('theme', '')
                dispatch(logoutSuccess());
            }
        } catch (err) {
            dispatch(logoutError(err));
        }
    };
};

export const handleAzureLogin = (payload) => {
    return async dispatch => {
        try {
            dispatch(logout());
            dispatch(logoutDetails());
            ls.remove("token");
            ls.remove("loggedInUser");
            ls.remove("modules");
            ls.remove("userType");
            ls.remove("session");
            ls.remove('checkTab')
            localStorage.setItem('dark', 0)
            localStorage.setItem('theme', '')
            dispatch(logoutSuccess());
            dispatch(handleLogin(payload, null, true));
        } catch (err) {
            dispatch(logoutError(err));
        }
    };
};

export const loadModules = () => {
    return async dispatch => {
        try {
            dispatch(getModules());
            const modules = ls.get("modules");
            dispatch(getModulesSuccess(modules));
        } catch (err) {
            dispatch(getModulesError(err));
        }
    };
};

export const getToken = (hash) => {
    return async (dispatch) => {
        const TokenResp = await service.token(hash)
        if (TokenResp) {
            dispatch(VerifyToken(TokenResp));
        } else {
            console.error("getToken api failed")
        }
    };
};

export const handleChangePassword = payload => {
    return async dispatch => {
        try {
            dispatch(changePassword());
            const result = await service.changePassword(payload);
            let { errors, data, message } = result;
            if (data && data.message && data.status) {
                dispatch(changePasswordSuccess(data.message));
            } else {
                let error = errors && serializeError(errors || message);
                error = error ? error : data?.message;
                dispatch(changePasswordError(error))
            }
        } catch (err) {
            dispatch(changePasswordError(err));
        }
    }
}

export const getSecurityQuestion = () => {
    return async dispatch => {
        try {
            actionStructre(dispatch, SecurityQuestion, error, service.getSecurityQuestion);
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    }
}

export const storeSecurityQuestion = (payload) => {
    return async (dispatch) => {
        try {
            dispatch(login())
            const { data, message, errors } = await service.storeSecurityQuestion(
                payload
            );
            if (data.status) {
                dispatch(QAsuccess(message));
            } else {
                dispatch(error(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const verifySecurityQA = (payload) => {
    return async (dispatch) => {
        try {
            const { data, message, errors } = await service.verifySecurityQA(
                payload
            );
            if (data.status) {
                dispatch(QAVerifysuccess(message));
                dispatch(QAVerifytoken(data.token));
            } else {
                dispatch(errorQA(message || errors));
            }
        } catch (err) {
            dispatch(error("Something went wrong"));
            console.error("Error", err);
        }
    };
}

export const AzureRedirection = async () => {
    try {
        const { data, message, errors } = await service.azureRedirection();
        if (data.status && data.data?.authUrl) {
            downloadFile(data.data.authUrl)
        }
        else {
            swal('Validation', serializeError(message || errors), 'warning');
        }
    } catch (err) {
        console.error("Error", err);
    }
};



export default loginSlice.reducer;
