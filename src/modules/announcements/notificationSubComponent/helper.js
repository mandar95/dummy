
export const setAllDropDownData = (editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj) => {
    _func.map((item) => item(editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj))
}

export const SetBrokerData = (editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj) => {
    let brokerDetails = []
    if (typeof brokerData !== "undefined" && typeof editData[0]?.broker !== 'undefined') {
        for (let j = 0; j < editData[0]?.broker?.length; j++) {
            for (let i = 0; i < brokerData.length; i++) {
                if (parseInt(brokerData[i].id) === parseInt(editData[0].broker[j].id))
                    brokerDetails.push(brokerData[i])
            }
        }
        obj.setBrokers(() => [...brokerDetails]);
    }
}
export const SetEmployerData = (editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj) => {
    let employerDetails = []
    if (typeof EmployeeNameResponse !== "undefined") {

        for (let j = 0; j < editData[0].employer.length; j++) {
            for (let i = 0; i < EmployerNameResponse?.data?.data.length; i++) {
                if (parseInt(EmployerNameResponse?.data?.data[i].id) === parseInt(editData[0].employer[j].id))
                    employerDetails.push(EmployerNameResponse.data.data[i])
            }
        }
        obj.setEmployers(() => [...employerDetails]);
    }
}
export const SetEmployeeData = (editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj) => {
    let employeeDetails = [];
    if (typeof EmployeeNameResponse !== "undefined") {
        for (let j = 0; j < editData[0].employee.length; j++) {
            if (editData[0].employee[j].employee_details !== null) {
                for (let i = 0; i < EmployeeNameResponse?.data?.data.length; i++) {
                    if (parseInt(EmployeeNameResponse?.data?.data[i].id) === parseInt(editData[0].employee[j].employee_details.id))
                        employeeDetails.push(EmployeeNameResponse.data.data[i])
                }
            }
        }
        obj.setEmployees(() => [...employeeDetails]);
    }
}

export const setPolicyData = (editData, brokerData, EmployerNameResponse, EmployeeNameResponse, obj) => {
    if (editData[0].policy.length) {
        obj.setPolicies(() => [...editData[0].policy]);
    }

}

const _func = [SetBrokerData, SetEmployerData, SetEmployeeData, setPolicyData]
