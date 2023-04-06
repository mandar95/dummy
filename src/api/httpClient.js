import axios from 'axios';
import { stringify } from 'querystring';
import SecureLS from 'secure-ls';
import sha256 from "crypto-js/sha256";
import md5 from "crypto-js/md5";
import CryptoJS from "crypto-js";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import _ from "lodash";

const defaultOptions = {
    headers: {},
    queryParams: null
};

export const restClient = axios.create();

// Encrypt Payload
function customEncrypt(value) {
    const secret_key = process.env.REACT_APP_ENCRYPTION_KEY;
    const secret_iv = md5(md5(secret_key));
    const key = sha256(secret_key);
    const iv = sha256(secret_iv.toString());
    let output = CryptoJS.AES.encrypt(value, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC
    });
    output = Base64.stringify(Utf8.parse(output));

    return output;
}

// FromData => JSON
function objectifyForm(formData = new FormData()) {
    var object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    return object
}

// Verify Method to Encrypt
function checkMethod(options) {
    if (options.method && ['POST', 'PATCH'].includes((options.method).toUpperCase()) && _.isEmpty(options.data)) {
        return { ...options, data: objectifyForm(options.data) }
    }
    else return options
}

restClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const err = error.response;
    const ls = new SecureLS();
    // Remove Toke & Logout
    if (err?.status === 401) {
        ls.remove('token');
        window.location.replace('/login')
    }
    return Promise.reject(error);
});

const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const httpClient = async (url = '', options = defaultOptions, noBaseUrl) => {
    const ls = new SecureLS();
    const customURL = ''
    const baseUrl = (customURL && isLocal) ? (customURL + '/api') : process.env.REACT_APP_API_BASE_URL;
    let fullPath = noBaseUrl ? (`${url}`) : (`${baseUrl}${url}`);


    if (options.queryParams) {
        const queryString = stringify(options.queryParams);
        fullPath = `${fullPath}?${queryString}`;
    }

    const token = ls.get('token');

    if (token) {
        restClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const requestData = !options.dont_encrypt ? checkMethod(options) : options

    return await restClient({
        url: fullPath,
        method: requestData.method || 'GET',
        cancelToken: options.cancelToken,
        data: requestData.data && !(options.dont_encrypt || isLocal) ? { data: customEncrypt(JSON.stringify(requestData.data)), to_decrpyt: 1 } : requestData.data
    })
        .then(response => (
            {
                data: response?.data || {},
                errors: response?.data.errors,
                error: response?.data.error,
                message: response?.data.message,
                success: (response?.status === 200
                    || response?.status === 201)
                    && response?.data?.status
            }
        ))
        .catch(err => axios.isCancel(err) ?
            ({
                data: null,
                success: true,
                cancelToken : true
            })
            :
            ({
                data: err,
                success: false,
                message: err?.response?.data?.message
            })
        );
};

export default httpClient;
