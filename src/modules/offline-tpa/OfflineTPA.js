import React, { useEffect, useReducer } from 'react';

import { UploadData } from './upload-data/UploadData';
import { ErrorData } from './error-data/ErrorData';
import { ProgressBar } from "modules/EndorsementRequest/progressbar";

import {
  // loadEmployers,
  loadErrorSheetAction
} from './offline-tpa.action';
import service from './offline-tpa.service';
import { serializeError } from 'utils';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";


const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  details: [],
  loadingDetail: true
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

const Types = {
  'member-data': {
    title: 'Member ID & E-Card Upload',
    loadErrorApi: service.loadMemberDataErrorSheet,
    saveApi: service.createMemberData,
    sampleFormatApi: service.loadSampleFormatMemberData,
    fileName: 'tpa_member_sheet',
    type: 4,
    document_type_id: 0
  },
  'claim-data': {
    title: 'Claim Data Upload',
    loadErrorApi: service.loadErrorSheet,
    saveApi: service.createClaimData,
    sampleFormatApi: service.loadSampleFormatClaimData,
    fileName: 'claim_data',
    type: 5,
    document_type_id: 15
  },
  'intimate': {
    title: 'TPA Intimate Claim',
    loadErrorApi: service.loadErrorSheet,
    saveApi: service.createIntimateClaim,
    sampleFormatApi: service.loadSampleFormat,
    fileName: 'intimate_claim_sheet',
    type: 6,
    document_type_id: 13
  },
  'submit': {
    title: 'TPA Submit Claim',
    loadErrorApi: service.loadErrorSheet,
    saveApi: service.createSubmitClaim,
    sampleFormatApi: service.loadSampleFormat,
    fileName: 'submit_claim_sheet',
    type: 7,
    document_type_id: 14
  },
  'network-hospital': {
    title: 'Network Hospital Bulk Upload',
    loadErrorApi: service.loadErrorSheet,
    saveApi: service.createNetworkHospital,
    sampleFormatApi: service.loadSampleFormat,
    fileName: 'file',
    type: 8,
    document_type_id: 16
  }
}

export function OfflineTPA({ myModule, type }) {
  const dispatchRedux = useDispatch();
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [state, dispatch] = useReducer(reducer, initialState);

  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);


  // initial load
  useEffect(() => {
    // if (userType === 'broker') {
    //   loadEmployers(dispatch);
    // }
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
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

  // load policy type
  useEffect(() => {
    if (currentUser.employer_id || currentUser.broker_id) {
      const payload = currentUser.employer_id ?
        { employer_id: currentUser.employer_id, document_type_id: Types[type].document_type_id } :
        { broker_id: currentUser.broker_id, document_type_id: Types[type].document_type_id };

      loadErrorSheetAction(dispatch, payload, Types[type].loadErrorApi);
      const intervalId = setInterval(() => loadErrorSheetAction(dispatch, payload, Types[type].loadErrorApi), 15000);
      return () => { clearInterval(intervalId); }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])



  return (
    <>
      {!!myModule.canwrite && <UploadData
        userType={userType} state={state}
        dispatch={dispatch} userTypeName={userTypeName}
        currentUser={currentUser}
        moduleData={Types[type]}
        typeName={type}
        employers={employers?.map((item) => ({
          id: item?.id,
          label: item?.name,
          value: item?.id,
        })) || []}
      />}

      <ErrorData
        ErrorSheetData={state.details}
        moduleData={Types[type]}
        userType={userType} />
      {state.loading && <ProgressBar text='Uploading Data...' />}
    </>
  )
}
