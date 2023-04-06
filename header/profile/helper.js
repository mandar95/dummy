export const MasterUserId = {
    1: 'Login as Admin',
    2: 'Login as Admin',
    3: 'Login as Broker',
    4: 'Login as Employer',
    5: 'Login as Employee',
    6: 'Login as Insurer',
    7: 'Login as Customer'
  }
  export const MasterUserName = {
    1: 'Super Admin',
    // 2: 'Login as Admin',
    3: 'Broker',
    4: 'Employer',
    5: 'Employee',
    6: 'IC',
    7: 'Customer'
  }
  export const calculateMasters = (type) => {
    if (Number(type)) {
      return type.split('')
    } else {
      return []
    }
  }
  export const wrap = (ele) => {
    if (ele.currentTarget.nodeName === "SPAN") {
      ele.currentTarget.style.whiteSpace = "normal"
    }
  }
  export const unwrap = (ele) => {
    if (ele.currentTarget.nodeName === "SPAN") {
      ele.currentTarget.style.whiteSpace = "nowrap"
    }
  }
  export const appendUser = (user_type, formdata, currentUser) => {
    if (user_type === "Employee") {
      formdata.append("employee_id", currentUser?.employee_id);
    }
    if (user_type === "Employer") {
      formdata.append("employer_id", currentUser?.employer_id);
    }
    if (user_type === "Broker") {
      formdata.append("broker_id", currentUser?.broker_id);
    }
  }