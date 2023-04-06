import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from '..';
import { Card, Loader, LoaderButton, NoDataFound } from '../../../components';
import { serializeError, DateFormate } from '../../../utils';
import { columnLives } from '../DataTable';
import service from '../users.service';

const initialState = {
  loading: true,
  details: [],
  firstpage: 1,
  lastpage: 1,
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ON_FETCH":
      return {
        ...state,
        loading: false,
        lastpage: payload.last_page,
        firstpage: payload.current_page + 1,
        details: [...state.details, ...(payload.details || [])],
      };
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    case 'LOADING': return {
      ...state,
      loading: payload,
    }
    default: return state;
  }
}

const FetchTotalLive = async (dispatch, payload, RemoveSelf, pageNo) => {
  try {
    const { data } = await service.loadTotalLive(payload, pageNo);
    if (data.data) {
      dispatch({
        type: 'ON_FETCH', payload: {
          ...data,
          details: data.data.filter(({ relation_id }) => RemoveSelf ? relation_id !== 1 : true).map((elem, index) => ({
            ...elem,
            age: elem.age + ' ' + elem.age_type,
            dob: DateFormate(elem.dob)
          })) || [],
        }
      });
    }
  }
  catch (error) {
    console.error(error)
    dispatch({ type: 'LOADING', payload: false });
  }
}

export function LivesDependent({ type }) {

  const [{ lastpage, firstpage, details, loading }, dispatch] = useReducer(reducer, initialState);
  const { currentUser, userType: currentUserType } = useSelector(state => state.login);

  useEffect(() => {
    if (lastpage >= firstpage && currentUserType) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    function _callback() {
      FetchTotalLive(dispatch, { employer_id: currentUser.employer_id, is_super_hr: currentUser.is_super_hr }, type === 'Active Dependent Lives', firstpage)
    }
    return () => {
      clearTimeout(_TimeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstpage, currentUserType]);

  return (
    <Card title={<div className="d-flex justify-content-between">
      <span>{type}</span>
      {!(firstpage > lastpage) &&
        <LoaderButton percentage={(firstpage - 1) * 100 / lastpage} />}
    </div>}>

      {loading ? <>
        <NoDataFound text={'Loading ' + type} img='/assets/images/loading.jpg' />
        <Loader /></> : ((details.length > 0) ?
          <DataTable
            columns={columnLives()}
            data={details.map((elem, index) => ({
              ...elem,
              sr_no: index + 1
            }))}
            autoResetPage={false}
            noStatus={true}
          /> :
          (<NoDataFound text={`No ${type} Data Found`} />))}

    </Card>
  )
}
