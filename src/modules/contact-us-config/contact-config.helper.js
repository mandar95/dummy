export const LoadDetailUserWise = (type, service) => {
    switch (type) {
        case 'broker':
            return service.getBrokerDetails
        case 'employer':
            return service.getEmployerDetails
        case 'ic':
            return service.getICDetails
        case 'tpa':
            return service.getTPADetails
        default: return service.getTPADetails;
    }
}

export const getContactUserWise = (user, userObj, dispatch, getContactDetails) => {
    if (user?.broker_id || userObj?.BrokerID) {
        dispatch(getContactDetails({
            broker_id: user?.broker_id || userObj?.BrokerID
        }, { type: 'broker' }))
    }
    if (user?.ic_id || userObj?.ICID) {
        dispatch(getContactDetails({
            ic_id: user?.ic_id || userObj?.ICID
        }, { type: 'ic' }))
    }
    if (user?.employer_id || userObj?.EmployerID) {
        dispatch(getContactDetails({
            employer_id: user?.employer_id || userObj?.EmployerID
        }, { type: 'employer' }))
    }
    if (user?.tpa_id || userObj?.TPAID) {
        dispatch(getContactDetails({
            tpa_id: user?.tpa_id || userObj?.TPAID
        }, { type: 'tpa' }))
    }
}
