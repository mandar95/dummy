import { ToWords } from 'to-words';
import moment from 'moment';

export const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: false,
    ignoreDecimal: true,
    ignoreZeroCurrency: true,
  }
});

export const useQuery = search => {
  return new URLSearchParams(search);
};

// for add days
export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return moment(result).format("YYYY-MM-DD");
}

export const getFirstError = errors => {
  const keys = Object.keys(errors);
  const error = keys && keys.length > 0 ? errors[keys[0]] : '';
  return error && error.length > 0 ? error[0] : '';
};

export const processData = (data) => {
  if (!data) return data;
  const dataStr = JSON.stringify(data);
  dataStr.replace(/true/g, 1);
  dataStr.replace(/false/g, 0);
  return JSON.parse(dataStr);
};

export const checkBool = bool => {
  return typeof bool === 'boolean' ||
    (typeof bool === 'object' &&
      bool !== null &&
      typeof bool.valueOf() === 'boolean');
};

export const downloadFile = (url, options, isTarget) => {
  const link = document.createElement('a');
  if (options)
    link.setAttribute('href', `options${encodeURIComponent(url)}`);
  if (isTarget) {
    link.setAttribute('target', `_blank`);
  }
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// all error
export const serializeError = (payload) => {
  let message = ''
  if (typeof payload === 'string')
    message = payload;
  else if (typeof payload === 'object') {
    for (const property in payload) {
      message = `${message}
${payload[property][0]}`;
    }
  }
  return (message === '') ? 'Unable to connect to the server, please check your internet connection.' : message;
};

// common action creatre(single get & post)
export const actionStructre = async (dispatch, onSuccess, onError, api, payload) => {
  const { data, message, errors, success } = await api(payload);
  if (data?.data || success) {
    onSuccess && dispatch(onSuccess(data.data || message));
  }
  else {
    onError && dispatch(onError(message || errors));
    console.error("Error", message || errors);
  }
};

// common action creatre(single get & post)
export const actionStructreBoth = async (dispatch, onSuccess, onError, api, payload) => {
  const { data, message, errors, success } = await api(payload);
  if (data?.data && success) {
    dispatch(onSuccess(data.data || message));
  }
  else {
    dispatch(onError(message || errors));
    console.error("Error", message || errors);
  }
};

// export const numOnly = (event) => {
//   let key = event.keyCode || event.which;
//   if (event.shiftKey === false && (
//     (key >= 48 && key <= 57) ||
//     (key >= 96 && key <= 105) ||
//     key === 8 ||
//     key === 9 ||
//     key === 13 ||
//     key === 16 ||
//     key === 17 ||
//     key === 20 ||
//     key === 35 ||
//     key === 36 ||
//     key === 37 ||
//     key === 39 ||
//     key === 46)
//     // key === 144
//   ) {
//   } else {
//     event.preventDefault();
//   }
// };

export const numOnly = (event) => {
  const key = event.keyCode || event.which;
  if (
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105) ||
    [8, 9, 13, 35, 36, 37, 39].includes(key) ||
    (event.ctrlKey === true && ([65, 67, 86, 88, 90].includes(key)))
  ) {
  } else {
    event.preventDefault();
  }
};

export const noSpecial = (evt) => {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (!(charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 46) {
  } else evt.preventDefault();
};

export const numOnlyWithPoint = (event) => {

  const key = event.keyCode || event.which;
  if (event.key === '.' && event.target.value?.includes('.')) {
    event.preventDefault();
  }
  if (
    (key >= 48 && key <= 57) ||
    (key >= 96 && key <= 105) ||
    [8, 9, 13, 35, 36, 37, 39, 110, 190].includes(key) ||
    (event.ctrlKey === true && ([65, 67, 86, 88, 90].includes(key)))
  ) {
  } else {
    event.preventDefault();
  }
};


export const noSpace = (event) => {
  const key = event.keyCode || event.which;
  if (key === 32) {
    event.preventDefault();
  }
};

export const toDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
}

export const scrollToTargetAdjusted = (id, offsetVal) => {
  var element = document.getElementById(`${id}`);
  if (element) {
    const offset = offsetVal || 45;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

export const reloadPage = (url) => {
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const DateFormate = (date, options = {}) => {
  if (date) {
    switch (options.type) {
      case 'withTime': {
        const [newData, time] = date.split(' ')
        const [year, month, day] = newData.split('-');
        return [day, month, year].join(options.splitString || "-") + ' ' + time;
      }
      default: {
        const [year, month, day] = date.split('-');
        return [day, month, year].join(options.splitString || "-");
      }
    }
  }
  else if (options.dateFormate) {
    return '';
  }
  else { return '-' }
};

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function isInt(n) {
  return Number(n) % 1 === 0;
}

export const NumberInd = (str) => {
  var newStr = 0;
  if (isInt(str)) {
    newStr = parseInt(str);
    return newStr.toLocaleString("en-IN");
  } else {
    newStr = parseFloat(Number(str).toFixed(2));
    return newStr.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};

export * from './ReadAccess'
export * from './EncryptDecrypt'
export * from './IsMainWindow'
export * from './BroadCastTab'
export * from './IdleTimer'
