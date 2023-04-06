import { createSlice } from "@reduxjs/toolkit";
import service from "./users.service";
import { actionStructre, downloadFile, serializeError } from "../../utils";
import swal from "sweetalert";
import { customModule } from "../announcements/serviceApi";

export const userManagement = createSlice({
  name: "user-management",
  initialState: {
    data: {},
    reportingData: {},
    count: {},
    loading: false,
    error: null,
    parentModules: null,
    modules: null,
    module_data: null,
    role_data: [],
    state: null,
    city: null,
    success: null,
    userInfo: {},
    dropdownData: [],
    plans: [],
    subscribe_mode: [
      { id: 1, name: "Monthly" },
      { id: 2, name: "Quaterly" },
      { id: 3, name: "Half Yearly" },
      { id: 4, name: "Yearly" },
    ],
    pincodeErrorMsg: null,
    tempUserDetail: {},
    reportingICData: {},
    regional_data: [],
    zonal_data: [],
    leadData: {},
    tempData: "",
    lastPage: 1,
    firstPage: 1,
    pagination_update: false,
  },
  reducers: {
    usersData: (state, { payload }) => {
      let _data = {
        ...payload,
        data:
          payload.current_page === 1
            ? payload?.data
            : [...(state?.data?.data || []), ...payload?.data],
      };
      state.data = _data;
    },
    setPageData: (state, { payload }) => {
      state.firstPage = payload.firstPage;
      state.lastPage = payload.lastPage;
    },
    statusCount: (state, action) => {
      state.count = action.payload;
    },
    loading: (state, { payload = true }) => {
      state.loading = payload;
      state.error = null;
      state.success = null;
      state.pincodeErrorMsg = null;
    },
    stopLoading: (state) => {
      state.loading = null;
    },
    success: (state, { payload }) => {
      state.loading = null;
      state.error = null;
      state.pincodeErrorMsg = null;
      state.success = payload;
    },
    error: (state, { payload }) => {
      let message = " ";
      if (typeof payload === "string") message = payload;
      else if (typeof payload === "object") {
        for (const property in payload) {
          message = `${message}
${payload[property][0]}`;
        }
      }

      state.loading = null;
      state.error = message !== " " ? message : "Unable to connect to the server, please check your internet connection.";
      state.success = null;
      state.pincodeErrorMsg = null;
    },
    clear: (state) => {
      state.error = null;
      state.success = null;
      state.pincodeErrorMsg = null;
    },
    filterParentModule: (state, action) => {
      state.parentModules = action.payload
        .filter((element) => element.isParent)
        .map((value) => [value.id, value.moduleName]);
    },
    modules: (state, { payload }) => {
      state.modules = SortModules(payload);
    },
    modulesUnfiltered: (state, { payload }) => {
      state.data = payload;
    },
    module_data: (state, action) => {
      state.module_data = action.payload;
    },
    role_data: (state, action) => {
      state.role_data = action.payload;
      state.modules = SortModulesEdit(action.payload.modules);
    },
    dataRoles: (state, { payload }) => {
      state.data = payload;
    },
    reporting_data: (state, action) => {
      state.reportingData = action.payload;
    },

    state_data: (state, action) => {
      state.state = action.payload;
    },
    city_data: (state, action) => {
      state.city = action.payload;
    },
    roles: (state, { payload }) => {
      state.role_data = payload;
    },
    userInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    dropdownData: (state, { payload }) => {
      state.dropdownData = payload;
    },
    clearData: (state) => {
      state.data = {};
      state.reportingData = {};
    },
    clearCity: (state) => {
      state.city = null;
      state.state = null;
    },
    clearRole: (state) => {
      state.role_data = [];
      state.modules = [];
    },
    clearUserInfo: (state) => {
      state.userInfo = {};
    },
    plans: (state, { payload }) => {
      state.plans = payload;
    },
    pincodeError: (state, { payload }) => {
      state.pincodeErrorMsg = payload;
    },
    clearPin: (state, { payload }) => {
      state.pincodeErrorMsg = null;
    },
    setTempUserDetail: (state, { payload }) => {
      state.tempUserDetail = payload;
    },
    reporting_ICdata: (state, { payload }) => {
      state.reportingICData = payload;
    },
    regional_data: (state, { payload }) => {
      state.regional_data = payload;
      state.loading = null;
    },
    zonal_data: (state, { payload }) => {
      state.zonal_data = payload;
      state.loading = null;
    },
    leadData: (state, { payload }) => {
      state.leadData = (payload.length && payload[0]) || {};
      state.loading = null;
    },
    setTempData: (state, { payload }) => {
      state.tempData = payload;
    },
    set_pagination_update: (state, { payload }) => {
      state.pagination_update = payload;
    },
  },
});

export const {
  usersData,
  statusCount,
  loading,
  success,
  error,
  clear,
  modules,
  filterParentModule,
  module_data,
  role_data,
  state_data,
  city_data,
  modulesUnfiltered,
  dataRoles,
  roles,
  userInfo,
  dropdownData,
  clearData,
  clearCity,
  stopLoading,
  clearRole,
  clearUserInfo,
  plans,
  reporting_data,
  pincodeError,
  clearPin,
  setTempUserDetail,
  reporting_ICdata,
  regional_data,
  zonal_data,
  leadData,
  setTempData,
  setPageData,
  set_pagination_update,
} = userManagement.actions;

const SortModules = (data) =>
  data
    .filter((element) => element.isParent)
    .map((value) => {
      const child = data
        .filter((childrenElement) => {
          return (
            childrenElement.isChild && childrenElement.parentId === value.id
          );
        })
        .map((childElem) => {
          return {
            id: childElem.id,
            moduleName: childElem.moduleName,
            module_sequence: childElem.sequence,
            is_employee_module: childElem.is_employee_module,
          };
        });
      return {
        id: value.id,
        moduleName: value.moduleName,
        child: child,
        module_sequence: value.sequence,
        is_employee_module: value.is_employee_module,
      };
    });

export const SortModulesEdit = (data) =>
  data
    .filter((element) => !element.isChild)
    .map((value) => {
      const child = data
        .filter((childrenElement) => {
          return (
            childrenElement.isChild &&
            childrenElement.parent_menu_id === value.id
          );
        })
        .map((childElem) => childElem);
      return { ...value, child: child };
    });

// Action creators

// DataTable User Type

export const getUsersData = (payload) => {
  return async (dispatch) => {
    try {
      //dispatch(loading());
      // dispatch(clearData());
      // dispatch(clearUserInfo());
      ((!payload.pageNo || payload.pageNo === 1) && payload.employer_id) && dispatch(loading());
      const { data, message, errors } = await service.getUserData(payload);
      dispatch(stopLoading());
      if (data?.data) {
        dispatch(usersData(data));
        dispatch(
          setPageData({
            firstPage: data.current_page + 1,
            lastPage: data.last_page,
          })
        );
      } else {
        (message || errors) && dispatch(error(message || errors));
        console.error(message || errors);
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadInsurerUsers = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      // dispatch(clearData());
      // dispatch(clearUserInfo());
      const { data, message, errors } = await service.getInsurerUsers(payload);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(usersData(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadTPA = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      // dispatch(clearData());
      // dispatch(clearUserInfo());
      const { data, message, errors } = await service.getTPA(payload);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(usersData(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadInsurerBrokers = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.insurerGetBrokers(
        payload
      );
      dispatch(stopLoading());
      if (data.data) {
        dispatch(usersData(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadInsurer = (flag) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      // dispatch(clearData());
      // dispatch(clearUserInfo());
      const { data, message, errors } = await service.getInsurers();
      dispatch(stopLoading());
      if (data.data) {
        flag ? dispatch(dropdownData(data.data)) : dispatch(usersData(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getUserDataDropdown = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getUserData(payload);
      if (data.data) {
        dispatch(dropdownData(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getStatusCount = (payload) => {
  return async (dispatch) => {
    try {
      const { data, message, errors } = await service.getUserCount(payload);
      if (data.data) {
        dispatch(statusCount(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Module

export const createModule = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.postCreateModule(payload);
      if (data.status === true) {
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

export const getParentModules = (currentUser) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getAllModules(
        0,
        currentUser
      );
      if (data.data) {
        dispatch(filterParentModule(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const editModule = (moduleData, id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateModule(
        moduleData,
        id
      );
      if (data.status === true) {
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

export const getModule = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getOneModule(id);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(module_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

const getUniqueModulesOnly = (array1, array2) => {
  const arrayUniqueByKey = [
    ...new Map(
      [...array2, ...array1].map((item) => [item["id"], item])
    ).values(),
  ];

  return arrayUniqueByKey;
};

export const allModules = (
  condition,
  flag,
  currentUser,
  alsoGetEmployeeMoule = false
) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.getAllModules(
        flag,
        currentUser
      );
      dispatch(stopLoading());
      if (data.data) {
        let employeeModules = [];
        if (alsoGetEmployeeMoule) {
          const { data: employeeData } = await customModule({
            master_user_types_id: "5",
          });
          if (employeeData.data?.modules) {
            employeeModules = employeeData.data.modules
              .filter(({ isSelected }) => isSelected)
              .map((elem) => ({
                id: elem.id,
                moduleName: elem.name + ' (Recommended for Employees)',
                moduleUrl: "",
                moduleIcon: "",
                isParent: elem.isChild === 0 ? 1 : 0,
                isChild: elem.isChild,
                parentId: elem.parent_menu_id,
                sequence: elem.module_sequence,
                is_employee_module: true,
              }));
          }
          if (condition) {
            data.data = getUniqueModulesOnly(data.data, employeeModules)
          }
        }
        condition
          ? dispatch(modulesUnfiltered(data))
          : dispatch(modules(getUniqueModulesOnly(data.data, employeeModules)));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Role

export const createRole = (roleData, id, user) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.postCreateRole(
        roleData,
        id,
        user
      );
      if (data.status === true) {
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

export const getRole = (id, user, userTypeName) => {
  return async (dispatch) => {
    try {
      dispatch(clearRole());
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.getOneRole(
        id,
        user,
        userTypeName
      );
      dispatch(stopLoading());
      if (data.data) {
        dispatch(role_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const editRole = (payload, id, user) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      if (user === "employee") {
        const { data, message, errors } =
          await service.postCreateRoleForEmployee(payload);
        if (data.status === true) {
          dispatch(success(message));
        } else {
          dispatch(error(message || errors));
        }
      } else {
        const { data, message, errors } = await service.updateRole(
          payload,
          id,
          user
        );
        if (data.status === true) {
          dispatch(success(message));
        } else {
          dispatch(error(message || errors));
        }
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const RoleData = (id, user, optional) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clearRole());
      const { data, message, errors } = await service.getRoles(id, user);
      if (data.data) {
        dispatch(stopLoading());
        optional === "1"
          ? dispatch(roles(data.data))
          : dispatch(dataRoles(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const RoleDataEmployee = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clearRole());
      const { data, message, errors } = await service.getRolesEmployee({
        employer_id: id,
      });
      const { data: employeeData } = await customModule({
        master_user_types_id: "5",
      });
      if (data.data) {
        dispatch(stopLoading());
        dispatch(dataRoles({
          data:
            [{
              ...data?.data,
              modules: data?.data?.modules
                .map((item) => {
                  let module_name = item.name
                  if (employeeData?.data) {
                    const employeModule = employeeData?.data?.modules.some(elem => elem.module_url === item.module_url && elem.name === item.name && elem.isSelected && !item.isSelected);
                    if (employeModule) {
                      module_name += ' (Recommended for Employees)'
                    }
                  }
                  return ({ ...item, name: module_name })
                })
            }]
        }));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const Role_Data = (id, user, optional) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getRoles(id, user);
      if (data.data) {
        dispatch(stopLoading());
        optional === "1"
          ? dispatch(roles(data.data))
          : dispatch(dataRoles(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const brokerReportingData = (reportingdata) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getBrokerReportingData(
        reportingdata
      );
      if (data.data) {
        dispatch(stopLoading());
        dispatch(reporting_data(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const employerReportingData = (reportingdata) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getEmployerReportingData(
        reportingdata
      );
      if (data.data) {
        dispatch(stopLoading());
        dispatch(reporting_data(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadInsurerUser = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getInsurerUser();
      if (data.data) {
        dispatch(stopLoading());
        dispatch(reporting_ICdata(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
// Onboard

export const brokerOnboard = (addRole, brokerData, user, restData) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.onboardBroker(brokerData);
      if (data.status === true) {
        if (addRole) {
          const {
            data: roleData,
            message: roleMessage,
            errors: roleErrors,
          } = await service.postCreateRole(addRole, data.broker_id, user);
          if (roleData.status === true) {
            const {
              data: userData,
              message: userMessage,
              errors: userError,
            } = await service.postUser(
              {
                name: restData.name,
                email: restData.email,
                mobile_no: restData.contact,
                role: roleData.role_id,
              },
              data.broker_id,
              "admin"
            );
            if (userData.status === true) {
              dispatch(setTempData(data.broker_id));
              dispatch(success(message));
            } else {
              dispatch(success(message));
              console.error(userMessage || userError);
            }
          } else {
            dispatch(success(message));
            console.error(roleMessage || roleErrors);
          }
        } else {
          dispatch(setTempData(data.broker_id));
          dispatch(success(message));
        }
      } else dispatch(error(message || errors));
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const employerOnboard = (
  addRole,
  employerData,
  user,
  restData,
  addRoleEmployee,
  hasUserHr
) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.onboardEmployer(
        employerData
      );
      if (data.status === true) {
        if (addRole) {
          const {
            data: roleData,
            message: roleMessage,
            errors: roleErrors,
          } = await service.postCreateRole(addRole, data.employer_id, user);
          if (addRoleEmployee) {
            // eslint-disable-next-line no-unused-vars
            const { _data } = await service.postCreateRoleForEmployee({
              ...addRoleEmployee,
              employer_id: data.employer_id,
            });
          }
          if (roleData.status === true && restData.user_name) {
            const {
              data: userData,
              message: userMessage,
              errors: userError,
            } = await service.postUser(
              {
                name: restData.user_name,
                email: restData.user_email,
                mobile_no: restData.user_contact,
                role: roleData.role_id,
                ...(hasUserHr && {
                  is_user_hr: hasUserHr
                })
              },
              data.employer_id,
              "broker"
            );
            if (userData.status === true) dispatch(success(message));
            else {
              dispatch(success(message));
              console.error(userMessage || userError);
            }
          } else {
            dispatch(success(message));
            console.error(roleMessage || roleErrors);
          }
        } else dispatch(success(message));
      } else dispatch(error(message || errors));
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const insurerOnboard = (insurerData) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.onboardInsurer(
        insurerData
      );
      if (data.status === true) {
        dispatch(success(message));
      } else dispatch(error(message || errors));
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const tpaOnboard = (tpaData) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.onboardTpa(tpaData);
      if (data.status === true) {
        dispatch(success(message));
      } else dispatch(error(message || errors));
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// load Plans
export const loadPlans = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getPlans();
      if (data.data) {
        dispatch(plans(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// State/City/Pincode

export const getState = () => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getStates();
      if (data.data) {
        dispatch(state_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getCity = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      const { data, message, errors } = await service.getCities(payload);
      if (data.data) {
        dispatch(city_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Admin User

export const createAdmin = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.postUserAdmin(payload);
      if (data.status === true) {
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

export const createUser = (userData, id, user) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.postUser(
        userData,
        id,
        user
      );
      if (data.status === true) {
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

export const userUpdate = (userData, id, user, post, logo) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.updateUser(
        userData,
        id,
        user,
        post
      );
      if (logo?.[0]) {
        const formData = new FormData();
        formData.append("logo", logo[0]);
        formData.append("status", 1);
        formData.append("_method", "PATCH");
        service.updateUser(formData, id, user, true);
      }
      if (data.status === true) {
        dispatch(success(message));
        dispatch(loading());
        if (id) {
          const { data: dataUser } = await service.getUserInfo(user, id);
          dispatch(stopLoading());
          if (dataUser.data) {
            dispatch(userInfo(dataUser));
          }
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const insurerUpdate = (userData, id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.updateInsurer(
        userData,
        id
      );
      if (data.status === true) {
        dispatch(success(message));
        dispatch(insurerInfo(id));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
// View

export const userInfoAdmin = (user, id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.getUserInfo(user, id);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(userInfo(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const employeeInfo = (id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.getEmployee(id);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(userInfo(!!data.data.length && data.data[0]));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const insurerInfo = (id) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.getInsurer(id);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(
          userInfo(
            !!data.data.length && {
              ...data.data[0],
              email_1: data.data[0].email,
              contact_1: data.data[0].contact_no_1,
              country: "INDIA",
            }
          )
        );
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Delete User

export const removeUser = (payload, currentUser) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.deleteUser(payload);
      if (data.status === true) {
        dispatch(success(message));
        /* update */
        dispatch(set_pagination_update(true));
        const { data: status } = await service.getUserCount(currentUser);
        if (status.data) {
          dispatch(statusCount(status));
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Delete Module

export const removeModule = (payload, currentUser) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.deleteModule(payload);
      if (data.status === true) {
        dispatch(success(message));
        const { data: moduleData } = await service.getAllModules(
          0,
          currentUser
        );
        dispatch(stopLoading());
        if (moduleData.data) {
          dispatch(modulesUnfiltered(moduleData));
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// Delete Role

export const removeRole = (payload, user, userId) => {
  return async (dispatch) => {
    try {
      dispatch(clear());
      dispatch(loading());
      const { data, message, errors } = await service.deleteRole(payload, user);
      if (data.status === true) {
        dispatch(success(message));
        const { data: roleData } = await service.getRoles(userId, user);
        if (roleData.data) {
          dispatch(dataRoles(roleData));
        }
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const validatePincode = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(clearPin());
      const { data } = await service.ValidatePincode(payload);
      if (data.status === false) {
        //dispatch(pincodeError("Pincode does not exist"));
        dispatch(pincodeError("Please enter valid pincode"));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const insurerReportingData = (reportingdata) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getinsurerReportingData(
        reportingdata
      );
      if (data.data) {
        dispatch(stopLoading());
        dispatch(reporting_data(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

// child employer
export const createEmployerBranch = (payload, employer_id, currentUser, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createChildCompany(
        payload
      );
      if (data.status) {
        dispatch(success(message));
        dispatch(
          setPageData({
            firstPage: 1,
            lastPage: 1,
          })
        );
        onHide()
        // employer_id ? dispatch(loadChildCompanys({ employer_id })) :
        //   dispatch(getUsersData({ status: 1, type: 'Employer', currentUser }));
        dispatch(set_pagination_update(true));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateChildCompany = (payload, employer_id, currentUser) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.editChildCompany(payload);
      if (data.status) {
        dispatch(success(message));
        // employer_id ? dispatch(loadChildCompanys({ employer_id })) :
        //   dispatch(getUsersData({ status: 1, type: 'Employer', currentUser }));
        dispatch(set_pagination_update(true));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const deleteChildCompany = (payload, employer_id, currentUser, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.removeChildCompany(
        payload
      );
      if (data.status) {
        dispatch(success(message));
        // employer_id ? dispatch(loadChildCompanys({ employer_id })) :
        //   dispatch(getUsersData({ status: 1, type: 'Employer', currentUser }));
        dispatch(
          setPageData({
            firstPage: 1,
            lastPage: 1,
          })
        );
        onHide()
        dispatch(set_pagination_update(true));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const loadChildCompanys = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      // dispatch(clearData());
      // dispatch(clearUserInfo());
      const { data, message, errors } = await service.getChildCompanys(payload);
      dispatch(stopLoading());
      if (data.data) {
        dispatch(usersData(data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const updateUser = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.userUpdate(userData);
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

export const getRegionalMappingdata = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.getRegionalMappingdata(
        payload
      );
      if (data.status) {
        dispatch(regional_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const createRegionMapping = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createRegionMapping(
        payload
      );
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

export const createBulkRegionMapping = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createBulkRegionMapping(
        payload
      );
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

export const deleteRegionalMapping = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.deleteRegionalMapping(id);
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

export const updateRegionMapping = (payload, id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateRegionMapping(
        payload,
        id
      );
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

// zonal mapping

export const getZonalMappingdata = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      dispatch(clear());
      const { data, message, errors } = await service.getZonalMappingdata(
        payload
      );
      if (data.status) {
        dispatch(zonal_data(data.data));
      } else {
        dispatch(error(message || errors));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const createZonalMapping = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createZonalMapping(
        payload
      );
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

export const createBulkZonalMapping = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createBulkZonalMapping(
        payload
      );
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

export const deleteZonalMapping = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.deleteZonalMapping(id);
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

export const updateZonalMapping = (payload, id) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.updateZonalMapping(
        payload,
        id
      );
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

export const loadLeadData = (data) => {
  return async (dispatch) => {
    try {
      actionStructre(dispatch, leadData, error, service.loadLeadData, data);
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const createNewPassword = (payload, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.createNewPassword(
        payload
      );
      if (data.status) {
        dispatch(loading(false));
        swal('Success', message, "success").then(() => {
          onHide();
        });
      } else {
        swal("Alert", serializeError(message || errors), "warning");
        dispatch(loading(false));
      }
    } catch (err) {
      // dispatch(error("Something went wrong"));
      swal("Alert", "Something went wrong", "warning");
      console.error("Error", err);
    }
  };
};

export const verifyUser = (
  payload,
  fetcAction = false,
  fetcActionPayload = null
) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.verifyUser(payload);
      if (data.status) {
        // dispatch(success(message));
        dispatch(loading(false));
        swal('Success', message, "success").then(() => {
          fetcAction && dispatch(fetcAction(fetcActionPayload));
        });
        dispatch(set_pagination_update(true));
      } else {
        dispatch(loading(false));
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const unblockUser = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.unblockUser(payload);
      if (data.status) {
        // dispatch(success(message));
        dispatch(loading(false));
        swal('Success', message, "success");
        dispatch(set_pagination_update(true));
      } else {
        dispatch(loading(false));
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const userDelete = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.deleteUserType(payload);
      if (data.status) {
        // dispatch(success(message));
        dispatch(loading(false));
        swal('Success', message, "success");
        dispatch(set_pagination_update(true));
      } else {
        dispatch(loading(false));
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
}

export const employeeWiseStatus = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.employeeWiseStatus(payload);
      if (data.status) {
        // dispatch(success(message));
        dispatch(loading(false));
        swal('Success', message, "success");
        dispatch(set_pagination_update(true));
      } else {
        dispatch(loading(false));
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const employerMapping = (payload, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.employerMapping(payload);
      if (data.status) {
        dispatch(loading(false));
        dispatch(
          setPageData({
            firstPage: 1,
            lastPage: 1,
          })
        );
        onHide();
        swal("Success", message, "success");
      } else {
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const selectiveEmployeeDataForDelete = (payload, setEmployeeCode) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.selectiveEmployeeDataForDelete(payload);
      if (data.status) {
        dispatch(loading(false));
        setEmployeeCode(data?.data?.map((item, index) => ({
          value: item?.employee_id,
          id: item?.employee_id,
          label: item?.employee_code + " - " + item?.employee_data[0]?.employee_details[0]?.employee_name
        })) || []);
      } else {
        setEmployeeCode([])
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      setEmployeeCode([])
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};
export const removeEmployee = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.removeEmployee(payload);
      if (data.status) {
        dispatch(loading(false));
        swal("Success", message, "success");
      } else {
        dispatch(loading(false));
        swal("Alert", serializeError(message || errors), "warning");
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const getSelectedEmployeeMembers = (payload, setMemberCode) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, message, errors } = await service.getSelectedEmployeeMembers(payload);
      if (data.status) {
        dispatch(loading(false));
        setMemberCode(code => data.data?.map(data => ({
          id: data.member_id,
          value: data.member_id,
          label: data.employee_name
        })));
      } else {
        swal("Alert", serializeError(message || errors), "warning");
        dispatch(loading(false));
      }
    } catch (err) {
      dispatch(error("Something went wrong"));
      console.error("Error", err);
    }
  };
};

export const exportUsersData = (payload, onHide) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const { data, errors, message } = await service.exportUsersData(payload);
      if (data.status) {
        dispatch(loading(false));
        downloadFile(data?.data?.url)
        onHide()
      } else {
        swal("Alert", serializeError(message || errors), 'warning');
        dispatch(loading(false));
      }
    }
    catch (error) {
      console.error(error)
      dispatch(loading(false));
    }
  }
};

export const selectUsersData = (state) => state.userManagement?.data;
export const selectUsersStatus = (state) => state.userManagement?.count;
export const selectParentModules = (state) =>
  state.userManagement?.parentModules;
export const selectModules = (state) => state.userManagement?.modules;
export const selectModuleData = (state) => state.userManagement?.module_data;
export const selectRoleData = (state) => state.userManagement?.role_data;
export const selectUserInfo = (state) => state.userManagement?.userInfo;
export const selectdropdownData = (state) => state.userManagement?.dropdownData;
export const selectState = (state) => state.userManagement?.state;
export const selectCity = (state) => state.userManagement?.city;
export const selectPlans = (state) => state.userManagement?.plans;
export const selectSubscribe = (state) => state.userManagement?.subscribe_mode;
export const selectLeadData = (state) => state.userManagement?.leadData;
export const selectLoading = (state) => state.userManagement?.loading;
export const selectError = (state) => state.userManagement?.error;
export const selectSuccess = (state) => state.userManagement?.success;
export const selectTempData = (state) => state.userManagement?.tempData;
export const firstP = (state) => state.userManagement?.firstPage;
export const lastP = (state) => state.userManagement?.lastPage;
export default userManagement.reducer;
