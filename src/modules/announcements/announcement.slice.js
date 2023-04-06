import { createSlice } from "@reduxjs/toolkit";
import swal from "sweetalert";
import { serializeError } from "../../utils";
import {
  getEmployers, modules, types,
  announcements, postAnncmt, deleteAnncmt,
  position, alignment, size, subType,
  anncmt, adminGetBroker, adminGetEmployer,
  adminGetEmployee,
  notificationType,
  getAllModules,
  getAllNotification,
  addNotificationData,
  updateNotificationData,
  deleteNotificationData,
  editNotificationData,
  getUserNotificationData,
  updateUserNotificationData,
  loadActions,
  deleteUserNotificationData,
  customModule,
  getAnnouncementId,
  updateAnnouncementId
} from "./serviceApi";


export const announcement = createSlice({
  name: "announcement",
  initialState: {
    EmployerNameResponse: {},
    getModulesResponse: {},
    getTypesResponse: {},
    getAnnouncementResponse: {},
    deleteAnnouncementResp: {},
    postAnnouncementResp: {},
    positionResp: {},
    alignmentResp: {},
    sizeResp: {},
    subTypeResp: {},
    getAnncmtResp: {},
    getAnncmtData: {},
    broker: [],

    EmployerFilterData: [],
    EmployeeFilterData: [],

    EmployeeNameResponse: {},
    notificationType: {},
    Modules: [],

    notificationData: [],

    NotificationDetails: [],
    userNotificationDetails: [],
    editData: [],
    loading: false,
    error: null,
    success: null,
    actionTypes: [],
    todayDate: ''
  },

  //reducers
  reducers: {
    getAnncmtData: (state, { payload }) => {
      state.getAnncmtData = payload;
    },
    getEmployerNameDetails: (state, action) => {
      state.EmployerNameResponse = action.payload;
    },
    getEmployeeNameDetails: (state, action) => {
      state.EmployeeNameResponse = action.payload;
    },
    getmodulesDetails: (state, action) => {
      state.getModulesResponse = action.payload;
    },
    getTypesDetails: (state, action) => {
      state.getTypesResponse = action.payload;
    },
    announcementDetails: (state, action) => {
      state.getAnnouncementResponse = action.payload;
    },
    deleteAnncmtDetails: (state, action) => {
      state.deleteAnnouncementResp = action.payload;
    },
    postAnncmtDetails: (state, action) => {
      state.postAnnouncementResp = action.payload;
    },
    postAlertCleanUp: (state, action) => {
      state.postAnnouncementResp = {};
    },
    deleteAlertCleanUp: (state, action) => {
      state.deleteAnnouncementResp = {};
    },
    positionDetails: (state, action) => {
      state.positionResp = action.payload;
    },
    alignmentDetails: (state, action) => {
      state.alignmentResp = action.payload;
    },
    sizeDetails: (state, action) => {
      state.sizeResp = action.payload;
    },
    subTypeDetails: (state, action) => {
      state.subTypeResp = action.payload;
    },
    anncmtDetails: (state, action) => {
      state.getAnncmtResp = action.payload;
    },
    broker: (state, { payload }) => {
      state.broker = payload;
    },
    loadNotifictionData: (state, { payload }) => {
      state.notificationData = payload;
    },
    getNotificationType: (state, { payload }) => {
      state.notificationType = payload;
    },
    getAllModulesType: (state, { payload }) => {
      state.Modules = payload;
    },
    getAllNotificationDetails: (state, { payload }) => {
      state.NotificationDetails = [...payload];
      state.loading = null;
    },
    userNotificationDetails: (state, { payload }) => {
      let _data = [];
      payload.forEach(element => {
        //if (new Date(state.todayDate) <= new Date(element.end_date) || (element.notification_type_id === 1 && Boolean(element.dynamic_content) && !element.is_read)) {
        if (new Date(state.todayDate) <= new Date(element.end_date) || (element.notification_type_id === 1 && Boolean(element.dynamic_content))) {
          _data.push(element)
        }
      });
      state.userNotificationDetails = [..._data];
      state.loading = null;
    },
    setEmployerFilterData: (state, { payload }) => {
      state.EmployerFilterData = [...payload];
    },
    setEmployeeFilterData: (state, { payload }) => {
      state.EmployeeFilterData = [...payload];
    },
    editData: (state, { payload }) => {
      state.editData = [...payload];
      state.loading = null;
    },
    clearData: (state) => {
      state.editData = [];
      state.EmployerFilterData = [];
      state.EmployeeFilterData = [];
    },
    loading: (state, { payload = true }) => {
      state.loading = payload;
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
          message = `${message} ${payload[property][0]}`;
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
    actionTypes: (state, { payload }) => {
      state.actionTypes = payload
    },
    setTodayData: (state) => {
      state.todayDate = getTodayDate()
    }
  },
});

export const {
  getEmployerNameDetails, getEmployeeNameDetails, getmodulesDetails, getTypesDetails,
  announcementDetails, deleteAnncmtDetails, postAnncmtDetails,
  postAlertCleanUp, deleteAlertCleanUp, positionDetails,
  alignmentDetails, sizeDetails, subTypeDetails, anncmtDetails,
  broker,
  loadNotifictionData,
  success, error, clear,
  loading,
  getNotificationType,
  getAllModulesType,
  setEmployerFilterData,
  setEmployeeFilterData,
  getAllNotificationDetails,
  editData,
  clearData,
  userNotificationDetails,
  actionTypes,
  setTodayData,
  getAnncmtData
} = announcement.actions;

//Action Creator

export const getEmployerName = (id) => {
  return async (dispatch) => {
    const EmployerNameResponse = await getEmployers(id)
    if (EmployerNameResponse.data) {
      dispatch(getEmployerNameDetails(EmployerNameResponse));
    } else {
      console.error('getEmployers Api failed')
    }
  };
};

export const getModules = (userTypeName) => {
  return async (dispatch) => {
    const getModulesResponse = await modules(userTypeName)
    if (getModulesResponse.data) {
      let moduleData = getModulesResponse.data.data

      // remove parent node
      let childModules = moduleData.filter((item) => item?.parentId !== 0 || item?.parent_menu_id);
      for (let i = 0; i < childModules.length; i++) {
        for (let j = 0; j < moduleData.length; j++) {
          if (moduleData[j].id === (childModules[i].parentId || childModules[i].parent_menu_id)) {
            moduleData.splice(j, 1);
          }
        }
      }
      dispatch(getmodulesDetails(moduleData));
    } else {
      console.error('modules Api failed')
    }
  };
};

export const getTypes = () => {
  return async (dispatch) => {
    const getTypesResponse = await types()
    if (getTypesResponse.data) {
      dispatch(getTypesDetails(getTypesResponse));
    } else {
      console.error('types Api failed')
    }
  };
};

export const getAnnouncement = () => {
  return async (dispatch) => {
    const getAnnouncementResponse = await announcements()
    if (getAnnouncementResponse.data) {
      dispatch(announcementDetails(getAnnouncementResponse));
    } else {
      console.error('announcement Api failed')
    }
  };
};

export const deleteAnnouncement = (id) => {
  return async (dispatch) => {
    const deleteAnnouncementResp = await deleteAnncmt(id)
    if (deleteAnnouncementResp.data) {
      dispatch(deleteAnncmtDetails(deleteAnnouncementResp));
    } else {
      console.error('deleteAnncmt Api failed')
    }
  };
};

export const postAnnouncement = (data) => {
  return async (dispatch) => {
    const postAnnouncementResp = await postAnncmt(data)
    if (postAnnouncementResp.data) {
      dispatch(postAnncmtDetails(postAnnouncementResp));
    } else {
      console.error('postAnncmt Api failed')
    }
  };
};


export const getNotificationTypes = () => {
  return async (dispatch) => {
    const getTypesResponse = await notificationType()
    if (getTypesResponse.data) {
      dispatch(getNotificationType(getTypesResponse));
    } else {
      console.error('types Api failed')
    }
  };
};

const getUniqueOnly = (arra1, array2) => {

  const arrayUniqueByKey = [...new Map([...arra1, ...array2].map(item =>
    [item['id'], item])).values()];

  return arrayUniqueByKey
}

const UserTypeInitial = ['/broker', '/employer', '/employee', '/insurer', '/customer', '/admin']

const replaceInitial = (url = '', module_url = '') => {
  if (!url && !module_url) return '';

  for (let i = 0; i < UserTypeInitial.length; ++i) {
    if (url.startsWith(UserTypeInitial[i] + '/')) {
      return url.replace(UserTypeInitial[i], '/employee')
    }
  }

  return ("/employee" + module_url)
}

export const getAllModulesTypes = (userType) => {
  return async (dispatch) => {
    const getModulesResponse = await (userType === 'Super Admin' ? getAllModules() : modules(userType));
    let employeeModules = [];
    if (userType !== 'Super Admin') {
      const { data } = await customModule({ "master_user_types_id": "5" });
      if (data.data?.modules) {
        employeeModules = data.data.modules.map(elem => ({ ...elem, name: elem.name + ' (Recommended for Employees)' }));
      }
    }
    if (getModulesResponse.data.data) {
      let moduleData;
      if (employeeModules.length) {
        moduleData = getUniqueOnly(employeeModules.filter(({ isSelected }) => isSelected), getModulesResponse.data.data)
      } else {
        moduleData = getModulesResponse.data.data

      }


      // remove parent node
      let childModules = moduleData.filter((item) => item?.parentId !== 0 || item?.parent_menu_id);
      for (let i = 0; i < childModules.length; i++) {
        for (let j = 0; j < moduleData.length; j++) {
          if (moduleData[j].id === (childModules[i].parentId || childModules[i].parent_menu_id)) {
            moduleData.splice(j, 1);
          }
        }
      }
      dispatch(getAllModulesType(moduleData.map((elem) => ({
        ...elem,
        url: replaceInitial(elem.url, elem.module_url)
      }))));
    } else {
      console.error('types Api failed')
    }
  };
};

export const getPosition = () => {
  return async (dispatch) => {
    const positionResp = await position()
    if (positionResp.data) {
      dispatch(positionDetails(positionResp));
    } else {
      console.error('position Api failed')
    }
  };
};

export const getAlignment = () => {
  return async (dispatch) => {
    const alignmentResp = await alignment()
    if (alignmentResp.data) {
      dispatch(alignmentDetails(alignmentResp));
    } else {
      console.error('alignment Api failed')
    }
  };
};

export const getSize = () => {
  return async (dispatch) => {
    const sizeResp = await size()
    if (sizeResp.data) {
      dispatch(sizeDetails(sizeResp));
    } else {
      console.error('size Api failed')
    }
  };
};

export const getSubType = (data) => {
  return async (dispatch) => {
    const subTypeResp = await subType(data)
    if (subTypeResp.data) {
      dispatch(subTypeDetails(subTypeResp));
    } else {
      console.error('subType Api failed')
    }
  };
};

export const getAnncmt = (data) => {
  return async (dispatch) => {
    const getAnncmtResp = await anncmt(data)
    if (getAnncmtResp.data) {
      dispatch(anncmtDetails(getAnncmtResp));
    } else {
      console.error('anncmt Api failed')
    }
  };
};


// Get User Notification
export const getUserNotification = (user_type) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getUserNotificationData(user_type);
      if (data.data) {
        dispatch(setTodayData())
        // let sortData = _.sortBy(data.data, (e) => {
        //   return parseInt(e.is_read);
        // });
        let sortData = data.data.sort(function (a, b) {
          var c = new Date(a.updated_at);
          var d = new Date(b.updated_at);
          return d - c;
        });

        dispatch(userNotificationDetails(sortData));
      } else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
    }
  }
}

// update User Notification
export const updateUserNotification = (data, usertype) => {
  return async dispatch => {
    try {
      //dispatch(loading());
      const { success: status, message, errors } = await updateUserNotificationData(data);
      if (status) {
        dispatch(success({ status, message }));
        dispatch(getUserNotification(usertype))
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}

// update User Notification
export const deleteUserNotification = (data, usertype) => {
  return async dispatch => {
    try {
      //dispatch(loading());
      const { success: status, message, errors } = await deleteUserNotificationData(data);
      if (status) {
        dispatch(success({ status, message }));
        dispatch(getUserNotification(usertype))
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}

// Get Announcement Data
export const loadAnnouncement = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getAnnouncementId(id);
      if (data.data) {
        dispatch(getAnncmtData(data.data[0]));
      } else {
        // if (message || errors) {
        dispatch(error(message || errors));
        // }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
// Update Announcement Data
export const updateAnnouncement = (payload, id, goToListing) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await updateAnnouncementId(payload, id);
      if (data.status) {
        dispatch(loading(false));
        swal('Success', message, 'success').then(() => {
          goToListing()
        })
      } else {
        // if (message || errors) {
        swal('Alert', serializeError(message || errors), 'warning')
        dispatch(loading(false));
        // }
      }
    } catch (err) {
      swal('Alert', 'Something went wrong', 'warning')
      dispatch(loading(false));
    }
  }
}

// Get Notification Data
export const getNotification = () => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await getAllNotification();
      if (data.data) {
        dispatch(getAllNotificationDetails(data.data));
      } else {
        // if (message || errors) {
        dispatch(error(message || errors));
        // }
      }
    } catch (err) {
    }
  }
}
// create Notification Data
export const createNotification = (data) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { success: status, message, errors } = await addNotificationData(data);
      if (status) {
        dispatch(success({ status, message }));
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
// update Notification Data
export const updateNotification = (data, id) => {
  return async dispatch => {
    try {
      //dispatch(loading());
      const { success: status, message, errors } = await updateNotificationData(data, id);
      if (status) {
        dispatch(success({ status, message }));
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
// delete Notification Data
export const deleteNotification = (id) => {
  return async dispatch => {
    try {
      //dispatch(loading());
      const { success: status, message, errors } = await deleteNotificationData(id);
      if (status) {
        dispatch(success({ status, message }));
        dispatch(getNotification());
      }
      else {
        if (message || errors) {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
// edit Notification Data
export const editNotification = (id) => {
  return async dispatch => {
    try {
      dispatch(loading());
      const { data, message, errors } = await editNotificationData(id);
      if (data.data) {
        let filterData = [];
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id === parseInt(id)) {
            filterData.push(data.data[i])
          }
        }
        dispatch(editData(filterData));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
    }
  }
}
// Admin Get Broker
export const loadBroker = (userTye) => {
  return async dispatch => {
    try {
      const { data } = await adminGetBroker(userTye);
      if (data.data) {
        dispatch(broker(data.data));
      } else {
      }
    } catch (err) {
    }
  }
};
// Admin Get Employer
export const loadEmployer = (userTye) => {
  return async dispatch => {
    try {
      const data = await adminGetEmployer(userTye);
      if (data.data) {
        dispatch(getEmployerNameDetails(data));
      } else {
      }
    } catch (err) {
    }
  }
};
// Admin Get Employee
export const loadEmployee = (userTye) => {
  return async dispatch => {
    try {
      const data = await adminGetEmployee(userTye);
      if (data.data) {
        dispatch(getEmployeeNameDetails(data));
      } else {
      }
    } catch (err) {
    }
  }
};

// filter employer broker name wise
export const filterEmployer = (data, bifost) => {
  return async (dispatch, getState) => {
    const stateData = getState();
    const employerData = stateData?.announcement?.EmployerNameResponse;
    const finalData = employerData?.data?.data
    let filterData = [];
    if (bifost) {
      filterData = finalData
    }
    else if (typeof finalData !== "undefined") {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < finalData.length; j++) {
          // eslint-disable-next-line eqeqeq
          if (finalData[j].broker == data[i].name) {
            filterData.push(finalData[j])
          }
        }
      }
    }
    dispatch(setEmployerFilterData(filterData || []));
  }
}
// filter employeee employer id wise
export const filterEmployee = (data) => {
  return async (dispatch, getState) => {
    const stateData = getState();
    const employeeData = stateData?.announcement?.EmployeeNameResponse;
    const finalData = employeeData?.data?.data
    let filterData = [];
    if (typeof finalData !== "undefined") {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < finalData.length; j++) {
          // eslint-disable-next-line eqeqeq
          if (finalData[j].employer == data[i].name) {
            filterData.push(finalData[j])
          }
        }
      }
    }
    dispatch(setEmployeeFilterData(filterData));
  }
}

export const LoadActions = () => {
  return async dispatch => {
    try {
      const { data, message, errors } = await loadActions();
      if (data.data) {
        dispatch(actionTypes(data.data));
      } else {
        console.error(message || errors)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

const getTodayDate = () => {
  var today = new Date(),
    month = '' + (today.getMonth() + 1),
    day = '' + today.getDate(),
    year = today.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

//Selectors

export const selectEmployerName = (state) =>
  state.announcement?.EmployerNameResponse;
export const selectModule = (state) =>
  state.announcement?.getModulesResponse;
export const selectType = (state) =>
  state.announcement?.getTypesResponse;
export const selectAnnouncement = (state) =>
  state.announcement?.getAnnouncementResponse;
export const selectdeleteResp = (state) =>
  state.announcement?.deleteAnnouncementResp;
export const selectPostResp = (state) =>
  state.announcement?.postAnnouncementResp;
export const selectPosition = (state) =>
  state.announcement?.positionResp;
export const selectAlignment = (state) =>
  state.announcement?.alignmentResp;
export const selectSize = (state) =>
  state.announcement?.sizeResp;
export const selectSubType = (state) =>
  state.announcement?.subTypeResp;
export const selectAnncmt = (state) =>
  state.announcement?.getAnncmtResp;
export default announcement.reducer;
