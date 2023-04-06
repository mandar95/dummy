import React, { useEffect, useReducer, useState } from 'react';
import { CreateFlex } from './CreateFlex';

import { getFlexDetail, initialState, loadBenefits, loadFlexList, reducer } from './flex-config.action';
import { FlexList } from './FlexList';
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Decrypt } from '../../../utils';

export function FlexConfig({ myModule }) {

  let { flex_id } = useParams();
  flex_id = Decrypt(flex_id);
  const [page, setPage] = useState(flex_id ? 'create' : 'list')
  const [{ details, loading, policies, policy_types, policy_data, flex_detail, benefit_master },
    dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login)
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  useEffect(() => {
    if (flex_id) {
      // call flex api
      getFlexDetail(dispatch, { flex_plan_id: flex_id })
    } else {
      // call list api
      loadFlexList(dispatch)
    }
    loadBenefits(dispatch)

    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }));
      dispatch({ type: 'GENERIC_UPDATE', payload: { flex_detail: {} } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  if (page === 'list') return (
    <FlexList setPage={setPage} details={details} loading={loading} dispatch={dispatch} />
  )

  if (page === 'create') return (<CreateFlex
    flex_id={flex_id}
    flex_detail={flex_detail}
    employers={employers}
    setPage={setPage}
    dispatch={dispatch}
    benefit_master={benefit_master}
    currentUser={currentUser}
    userTypeName={userTypeName}
    policies={policies} policy_types={policy_types} policy_data={policy_data} />)

  return null;
}

