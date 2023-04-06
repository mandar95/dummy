import React, { useEffect, useState, useReducer } from 'react'

import TableView from './TableView';
import Widgets from './Widgets';
import EmployerModal from './EmployerModal';

import { loadCorporateBufferWidget, loadCorporateBufferData } from './service';
import { useParams } from 'react-router';
import { serializeError } from '../../utils';
import { Loader } from '../../components';
import { useSelector } from 'react-redux';

const initialState = {
  loading: false,
  widgets: {},
  data: [],
  employers: [],
  employer_id: {}
}

const reducer = (state, { type, payload }) => {

  switch (type) {
    case 'CHILDS_FETCH': return {
      ...state,
      childs: payload,
      loading2: false
    }
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      errors: serializeError(payload)
    }
    default: return state;
  }
}


const ApiCalls = async (dispatch, employer_id) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
    const { data: widgets } = await loadCorporateBufferWidget(employer_id?.value);
    const { data } = await loadCorporateBufferData(employer_id?.value);

    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        widgets: (widgets.data && widgets.data[0]) || {},
        data: data.data?.filter(({ total_corporate_buffer_amount, utilizied_corporate_buffer_amount }) => total_corporate_buffer_amount || utilizied_corporate_buffer_amount) || [], loading: false,
        employer_id: employer_id
      }
    });
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}

export default function CorporateBuffer() {

  const [{ widgets, data, employers, loading, employer_id }, dispatch] = useReducer(reducer, initialState);
  const { userType } = useParams();
  const [employerModal, setEmployerModal] = useState(userType === 'broker' ? true : false)
  const { currentUser } = useSelector(state => state.login)


  useEffect(() => {
    if (userType === 'employer' && currentUser?.employer_id)
      ApiCalls(dispatch, { value: currentUser.employer_id })
  }, [userType, currentUser])

  return <>
    {!employerModal && <>
      <Widgets data={widgets} />
      <TableView employer_id={employer_id} rowData={data} setEmployerModal={setEmployerModal} userType={userType} currentUser={currentUser} />
    </>}
    {loading && <Loader />}
    <EmployerModal
      userType={userType}
      currentUser={currentUser}
      show={!!employerModal}
      onHide={() => setEmployerModal(false)}
      ApiCalls={ApiCalls}
      employers={employers}
      dispatch={dispatch} />
  </>
}
