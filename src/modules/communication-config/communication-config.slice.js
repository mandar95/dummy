import { createSlice } from "@reduxjs/toolkit";
import service from './communication-config.service';
import { actionStructre } from "utils";
import swal from 'sweetalert';

export const communicationConfigSlice = createSlice({
  name: "claims",
  initialState: {
    loading: false,
    error: null,
    success: null,
    html_data: [],
    header: [],
    content: [],
    frequency: [
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Alternate Day' },
      { id: 3, name: 'Once a Week' },
      { id: 4, name: 'Immediately' }
    ],
    footer: [],
    files: [],
    sms: { id: 0, value: '' },
    email_templates: [],
    sms_templates: [],
    broker_list: [],
    employer_list: [],
    employee_list: [],
    dynamic_data: [],
    policy_type: [],
    policy_no: [],
    templates: [],
    smstemplates: [],
    lastPage: 1,
    firstPage: 1,
    loadEMPData: [],
    _firstPage: 1,
    _lastPage: 1,

  },
  reducers: {
    setPageData: (state, { payload }) => {
      state.firstPage = payload.firstPage;
      state.lastPage = payload.lastPage;
    },
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
    clear: (state) => {
      state.error = null;
      state.success = null;
    },
    html_set: (state, { payload }) => {
      state.html_data = payload;
    },
    add_text: (state, { payload: { value, id, table, index, file } }) => {

      switch (table) {
        case 'header': state.header[index].value = value;
          break;
        case 'content': state.content[index].value = value;
          break;
        case 'footer': state.footer[index].value = value;
          break;
        case 'sms': state.sms.value = value;
          break;
        default:

      }
    },
    sort_sms: (state, { payload }) => {
      const {
        // sourceIdStart,
        // destinationIdEnd,
        sourceIndexEnd,
        // destinationIndexStart,
        // id
      } = payload;
      state.sms.value =
        state.sms.value + ` {!!${state.dynamic_data[sourceIndexEnd].name}!!} `

    },
    sort: (state, { payload }) => {
      const {
        sourceIdStart,
        destinationIdEnd,
        sourceIndexEnd,
        destinationIndexStart,
        // id
      } = payload;

      // header
      //add
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'html' & destinationIdEnd === 'header') {
        const html = state.html_data.slice(sourceIndexEnd, sourceIndexEnd + 1);
        state.header.splice(destinationIndexStart, 0, ...html)
      }
      // arrange
      if (sourceIdStart === destinationIdEnd && sourceIdStart === 'header') {
        const html = state.header.splice(sourceIndexEnd, 1)
        state.header.splice(destinationIndexStart, 0, ...html)
      }

      // content
      //add
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'html' & destinationIdEnd === 'content') {
        const html = state.html_data.slice(sourceIndexEnd, sourceIndexEnd + 1)
        state.content.splice(destinationIndexStart, 0, ...html)
      }
      // arrange
      if (sourceIdStart === destinationIdEnd && sourceIdStart === 'content') {
        const html = state.content.splice(sourceIndexEnd, 1)
        state.content.splice(destinationIndexStart, 0, ...html)
      }

      // footer
      //add
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'html' & destinationIdEnd === 'footer') {
        const html = state.html_data.slice(sourceIndexEnd, sourceIndexEnd + 1)
        state.footer.splice(destinationIndexStart, 0, ...html)
      }
      // arrange
      if (sourceIdStart === destinationIdEnd && sourceIdStart === 'footer') {
        const html = state.footer.splice(sourceIndexEnd, 1)
        state.footer.splice(destinationIndexStart, 0, ...html)
      }

      // header => content
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'header' && destinationIdEnd === 'content') {
        const html = state.header.splice(sourceIndexEnd, 1)
        state.content.splice(destinationIndexStart, 0, ...html)
      }

      // header => footer
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'header' && destinationIdEnd === 'footer') {
        const html = state.header.splice(sourceIndexEnd, 1)
        state.footer.splice(destinationIndexStart, 0, ...html)
      }


      // content => footer
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'content' && destinationIdEnd === 'footer') {
        const html = state.content.splice(sourceIndexEnd, 1)
        state.footer.splice(destinationIndexStart, 0, ...html)
      }

      // content => header
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'content' && destinationIdEnd === 'header') {
        const html = state.content.splice(sourceIndexEnd, 1)
        state.header.splice(destinationIndexStart, 0, ...html)
      }


      // footer => header
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'footer' && destinationIdEnd === 'header') {
        const html = state.footer.splice(sourceIndexEnd, 1)
        state.header.splice(destinationIndexStart, 0, ...html)
      }

      // footer => content
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'footer' && destinationIdEnd === 'content') {
        const html = state.footer.splice(sourceIndexEnd, 1)
        state.content.splice(destinationIndexStart, 0, ...html)
      }



      // remove
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'header' && destinationIdEnd === 'html') {
        state.header.splice(sourceIndexEnd, 1)
      }

      // remove
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'content' && destinationIdEnd === 'html') {
        state.content.splice(sourceIndexEnd, 1)
      }

      // remove
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'footer' && destinationIdEnd === 'html') {
        state.footer.splice(sourceIndexEnd, 1)
      }

      // dynamic => input
      let inputId = (destinationIdEnd && destinationIdEnd.split('-')) || []
      if (sourceIdStart !== destinationIdEnd && sourceIdStart === 'dynamic' & inputId[0] === 'input') {
        state[`${inputId[3]}`][inputId[2]].value =
          state[`${inputId[3]}`][inputId[2]].value + ` {!!${state.dynamic_data[sourceIndexEnd].name}!!} `
      }

    },
    reset_template: (state) => {
      state.header = [];
      state.content = [];
      state.footer = [];
    },
    reset_sms_template: (state) => {
      state.sms = { id: 0, value: '' }
    },
    email_templates: (state, { payload }) => {
      state.email_templates = payload;
    },
    sms_templates: (state, { payload }) => {
      state.sms_templates = payload;
    },
    broker_list: (state, { payload }) => {
      //state.broker_list = payload;
      if (payload.length) {
        state.broker_list = [...state.broker_list, ...payload];
      }
    },
    employer_list: (state, { payload }) => {
      // state.employer_list = payload;
      if (payload.length) {
        state.employer_list = [...state.employer_list, ...payload];
      }

    },
    employee_list: (state, { payload }) => {
      //state.employee_list = payload;
      if (payload.length) {
        state.employee_list = [...state.employee_list, ...payload];
      }
    },
    dynamic_data: (state, { payload }) => {
      state.dynamic_data = [...payload,
      ...[{ id: 16, name: 'verify email link', url: 'https://www.google.com/' },
      { id: 17, name: 'Set New Password', url: 'http://ebfront.fynity.in/login' }]];
    },
    policy_type: (state, { payload }) => {
      state.policy_type = payload;
    },
    policy_no: (state, { payload }) => {
      state.policy_no = payload;
    },
    templates: (state, { payload }) => {
      state.templates = payload;
    },
    smstemplates: (state, { payload }) => {
      state.smstemplates = payload;
    },
    loadEMPData: (state, { payload }) => {
      if (payload.length) {

        state.loadEMPData = state._lastPage >= state._firstPage ? [...state.loadEMPData, ...payload] : [...payload];
      }
    },
    setPage: (state, { payload }) => {
      state._firstPage = payload._firstPage;
      state._lastPage = payload._lastPage;
    },
  }
});

export const {
  loading, success, error, clear,
  html_set, sort, add_text, sort_sms,
  reset_template, email_templates, broker_list,
  employer_list, employee_list, dynamic_data,
  policy_type, policy_no, reset_sms_template,
  sms_templates, templates, smstemplates,
  setPageData,
  loadEMPData,
  setPage
} = communicationConfigSlice.actions;


//---------- Action creators ----------//

const tagStrcuture = (id, key) => ({
  id,
  value: '',
  tag_id: key
})

const findTag = ({ id, name }) => {
  switch (name) {
    case '<h1>': return tagStrcuture(1, id);
    case '<h2>': return tagStrcuture(2, id);
    case '<h3>': return tagStrcuture(3, id);
    case '<h4>': return tagStrcuture(4, id);
    case '<h5>': return tagStrcuture(5, id);
    case '<h6>': return tagStrcuture(6, id);
    case '<p>': return tagStrcuture(7, id);
    case '<img>': return tagStrcuture(8, id);
    case '<a>': return tagStrcuture(9, id);
    default: return tagStrcuture(0, id);
  }
}
// Get HTML Tags

export const loadHtmlTags = () => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadHtmlTags();
      if (data.data) {
        let response = [];
        data.data.forEach((value, index) => {
          response[index] = findTag(value)
        })
        dispatch(html_set(response));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};


// Create Template

export const createEmailTemplate = (array, template_name, files, dynamic_data, userTypeName, isStatic = false, apiData, setTab) => {
  return async dispatch => {
    try {
      const formData = new FormData();
      if (!isStatic) {
        let dynamic_values = [];
        formData.append('template_name', template_name)
        formData.append('type', 1)
        array.forEach(({ tag_id, value }, index) => {
          if (value.name) {
            formData.append(`tag_id[${index}]`, tag_id);
            const file = files.find((elem) => value.name === elem.name)
            // let file = await fetch(value.url).then(r => r.blob());
            // let file = URL.revokeObjectURL(value.url)
            formData.append(`value[${index}]`, file);
          }
          else {
            formData.append(`tag_id[${index}]`, tag_id);
            formData.append(`value[${index}]`, value.replace(/{!!|!!}/gi, ''));


            const val1 = value?.split('{!!');

            const val2 = val1?.reduce((filtered, elem) => {
              const result = elem.split('!!}')
              if (result.length === 2) {
                filtered.push(result)
              }
              return filtered;
            }, [])

            formData.append(`has_dynamic_value[${index}]`, val2.length ? 1 : 0);

            val2.forEach((elem2) => {
              if (elem2.length) {
                const dynmaic_id = dynamic_data?.find((elem) => {
                  return elem.name === elem2[0]
                });
                dynamic_values = [...dynamic_values, dynmaic_id.id]
              }
            })
          }
        })

        dynamic_values = [...new Set(dynamic_values)]
        dynamic_values.forEach((id, index) => {
          formData.append(`dynamic_value_id[${index}]`, id);
        })
      }
      else {
        formData.append('template_name', apiData.template_name)
        formData.append('type', 2)
        formData.append('static_content', apiData.static_content)
      }
      const { data, message, errors } = await service.createEmailTemplate(formData);
      if (data.status === true) {
        dispatch(success(data.message));
        setTimeout(() => {
          setTab('Detail')
        }, 0)
        // dispatch(loadEmailTemplate(userTypeName));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// load Email Templates
export const loadEmailTemplate = (payload) => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadEmailTemplate(payload);
      if (data.data) {
        dispatch(email_templates(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// load Sms Templates
export const loadSmsTemplate = (payload) => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadSmsTemplate(payload);
      if (data.data) {
        dispatch(sms_templates(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// load Dynamic Data
export const loadDynamic = () => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadDynamic();
      if (data.data) {
        dispatch(dynamic_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// load Policy Number
export const loadPolicyNumber = () => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadPolicyNumber();
      if (data.data) {
        dispatch(policy_no(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// load Broker/Employer/Employee
export const loadUser = (type, userType, pageNo) => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadUser(type, userType, pageNo);
      if (data.data) {
        switch (type) {
          case 'Employer':
            dispatch(employer_list(data.data));
            break;
          case 'Employee':
            dispatch(employee_list(data.data));
            break;
          default:
            dispatch(broker_list(data.data));
        }
        dispatch(setPageData({
          firstPage: data.current_page + 1,
          lastPage: data.last_page,
        }))
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// Create Communication
export const createCommunication = (payload) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createCommunication(payload);
      if (data.status === true) {
        dispatch(success(data.message));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

// Create Sms Template
export const createSmsTemplate = (sms, template_name, dynamic_data, userTypeName, isStatic = false, apiData, setTab) => {
  return async dispatch => {
    try {
      let _data = {}
      if (!isStatic) {
        const val1 = sms.value?.split('{!!');
        let dynamic_values = [];
        const val2 = val1?.reduce((filtered, elem) => {
          const result = elem.split('!!}')
          if (result.length === 2) {
            filtered.push(result)
          }
          return filtered;
        }, [])
        val2.forEach((elem2) => {
          if (elem2.length) {
            const dynmaic_id = dynamic_data?.find((elem) => {
              return elem.name === elem2[0]
            });
            dynamic_values = [...dynamic_values, dynmaic_id.id]
          }
        })
        _data = {
          text: sms.value?.replace(/{!!|!!}/gi, ''),
          template_name,
          type: 1,
          ...(dynamic_values.length && { dynamic_value_id: dynamic_values })
        }
      } else {
        _data = {
          template_name: apiData.template_name,
          static_content: apiData.static_content,
          type: 2,
        }
      }
      dispatch(loading());
      const { data, message, errors } = await service.createSmsTemplate(_data);
      if (data.status === true) {
        dispatch(success(data.message));
        dispatch(success(data.message));
        setTimeout(() => {
          setTab('Detail')
        }, 0)
        //dispatch(loadSmsTemplate(userTypeName));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const loadTemplates = (userTypeName) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, templates, error, service.loadTemplates, userTypeName);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadSMSTemplates = (userTypeName) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, smstemplates, error, service.loadSMSTemplates, userTypeName);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getTemplateView = async (payload, setState) => {
  try {
    const { data } = await service.getTemplateView(payload);
    setState(state => data);
  } catch (err) {
    console.error("Error", err);
  }
};

export const deleteCommunication = (payload, tab, userTypeName) => {
  return async dispatch => {
    try {
      const { data, message, errors } = tab === "Email" ? await service.deleteEmailCommunication(payload) : await service.deleteSmsCommunication(payload);
      if (data.status) {
        //dispatch(success(message));
        swal('Success', message, "success").then(() => {
          dispatch(loadTemplates(userTypeName));
          dispatch(loadSMSTemplates(userTypeName));
        })
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export const loadEMP = (payload) => {
  return async dispatch => {
    try {
      const { data, message, errors } = await service.loadEMP(payload);
      if (data.data) {
        dispatch(loadEMPData(data.data));
        if (data?.data?.length) {
          dispatch(setPage({
            _firstPage: data.current_page + 1,
            _lastPage: data.last_page,
          }))
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error(err)
    }
  }
};

export default communicationConfigSlice.reducer;
