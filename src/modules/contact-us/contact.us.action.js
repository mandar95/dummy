import swal from 'sweetalert';
import service from './contact-us.service';
import { serializeError } from "../../utils";

export const loadEmployers = async (dispatch) => {
  try {
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data } = await service.loadEmployers();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        employers: (data.data && data.data.map(item => (
          {
            id: item.id,
            name: item.name,
            label: item.name,
            value: item.id
          }
        ))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    // dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}



export const loadPolicyNo = async (dispatch) => {
  try {
    const { data } = await service.loadPolicyNo();
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        policy_nos: (data.data && data.data.map(item => (
          {
            ...item,
            id: item.id,
            name: item.policy_no,
            label: item.policy_no,
            value: item.id
          }
        ))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


export const addContact = async (dispatch, payload, broker_id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });

    const { data, message, errors } = await service.addContact(payload);
    if (data.status) {
      swal('Success', message, 'success');
    }
    else {
      swal("Alert", serializeError(message || errors), 'info');
    }
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    getContacts(dispatch, { broker_id })
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const getContacts = async (dispatch, payload) => {
  try {
    const { data } = await service.getContacts(payload);
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });

    let details = { broker: [], employer: [], insurer: [], tpa: [] };

    (data?.data || []).forEach((elem) => {
      switch (elem.type) {
        case 1: details.broker.push(elem)
          break;
        case 2: details.insurer.push(elem)
          break;
        case 3: details.employer.push(elem)
          break;
        case 4: details.tpa.push(elem)
          break;
        default:
      }
    })
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        details: details,
        loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const updateContact = async (dispatch, id, payload, broker_id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });

    const { data, message, errors } = await service.updateContact(id, payload);
    if (data.status) {
      swal('Success', message, 'success');
    }
    else {
      swal("Alert", serializeError(message || errors), 'info');
    }
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    getContacts(dispatch, { broker_id })
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const deleteContact = async (dispatch, payload, broker_id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });

    const { data, message, errors } = await service.deleteContact(payload);
    if (data.status) {
      swal('Success', message, 'success');
    }
    else {
      swal("Alert", serializeError(message || errors), 'info');
    }
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    getContacts(dispatch, { broker_id })
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export const loadContact = async (dispatch, userTypeName) => {
  try {

    if (userTypeName === 'Employee' || userTypeName === 'Employer') {
      const { data } = await service.loadContact();


      if ((data?.data || []).length && data?.data.some(({ data }) => data.length)) {
        let ApiData = [...data?.data];
        ApiData.sort(function (a, b) {
          return a?.sequence - b?.sequence;
        });

        dispatch({
          type: 'GENERIC_UPDATE', payload: {
            details: ApiData.map((elem) => {
              switch (elem.type) {
                case 'Broker':
                  let brokerArray = []
                  elem.data.forEach((elem2) => {
                    if (!brokerArray.length)
                      brokerArray.push({ data: [elem2], label: elem2?.policy_name || elem2?.broker_name || '', type: elem.type, sequence: elem.sequence })

                    else {
                      const tpaIndex = brokerArray.findIndex(({ label }) => label === (elem2?.policy_name || elem2?.broker_name || ''));

                      if (tpaIndex >= 0)
                        brokerArray[tpaIndex].data = [...brokerArray[tpaIndex].data, elem2]

                      else
                        brokerArray.push({ data: [elem2], label: elem2?.policy_name || elem2?.broker_name || '', type: elem.type, sequence: elem.sequence })
                    }

                  })

                  return brokerArray
                case 'Employer':
                  let employerArray = []
                  elem.data.forEach((elem2) => {
                    if (!employerArray.length)
                      employerArray.push({ data: [elem2], label: elem2?.policy_name || elem2?.employer_name || '', type: elem.type, sequence: elem.sequence })

                    else {
                      const tpaIndex = employerArray.findIndex(({ label }) => label === (elem2?.policy_name || elem2?.employer_name || ''));

                      if (tpaIndex >= 0)
                        employerArray[tpaIndex].data = [...employerArray[tpaIndex].data, elem2]

                      else
                        employerArray.push({ data: [elem2], label: elem2?.policy_name || elem2?.employer_name || '', type: elem.type, sequence: elem.sequence })
                    }

                  })

                  return employerArray
                case 'IC':
                  let icArray = []
                  elem.data.forEach((elem2) => {
                    if (!icArray.length)
                      icArray.push({ data: [elem2], label: elem2?.insurer_name || elem2?.policy_name || '', type: elem.type, sequence: elem.sequence })

                    else {
                      const tpaIndex = icArray.findIndex(({ label }) => label === (elem2?.insurer_name || elem2?.policy_name || ''));

                      if (tpaIndex >= 0)
                        icArray[tpaIndex].data = [...icArray[tpaIndex].data, elem2]

                      else
                        icArray.push({ data: [elem2], label: elem2?.insurer_name || elem2?.policy_name || '', type: elem.type, sequence: elem.sequence })
                    }

                  })

                  return icArray
                case 'TPA':
                  let tpaArray = []
                  elem.data.forEach((elem2) => {
                    if (!tpaArray.length)
                      tpaArray.push({ data: [elem2], label: elem2?.tpa_name || elem2?.policy_number || '', type: elem.type, sequence: elem.sequence })

                    else {
                      const tpaIndex = tpaArray.findIndex(({ label }) => label === (elem2?.tpa_name || elem2?.policy_number || ''));

                      if (tpaIndex >= 0)
                        tpaArray[tpaIndex].data = [...tpaArray[tpaIndex].data, elem2]

                      else
                        tpaArray.push({ data: [elem2], label: elem2?.tpa_name || elem2?.policy_number || '', type: elem.type, sequence: elem.sequence })
                    }

                  })

                  return tpaArray
                default:
                  return { ...elem, label: '' };
              }
            }),
            loading: false
          }
        });
      } else {
        const { data } = await service.loadContactUs(userTypeName);
        dispatch({
          type: 'GENERIC_UPDATE', payload: {
            other_details: data.data,
            loading: false
          }
        });
      }
    }
    else {
      const { data } = await service.loadContactUs(userTypeName);
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          other_details: data.data,
          loading: false
        }
      });
    }
  }
  catch (error) {
    console.error(error);
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}
