import React, { useEffect, useState } from 'react';
import swal from "sweetalert";
import _ from "lodash";

import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleAzureLogin, alertCleanup, cleanExpiryDetails } from "./login.slice";
import { serializeError } from "utils";
import { Loader } from 'components';

import { isMobile } from 'react-device-detect';
import { isMobileIOS, MobileChooseModal } from './MobileChooseModal';
import AppDetail from './appLink'

// Type 1:Mobile 2:Web 3:Modal 0:none

export function AzureLogin() {

  const dispatch = useDispatch();
  const [type, setType] = useState((isMobile && AppDetail.appName && (isMobileIOS() ? AppDetail.appStoreURL : AppDetail.playStoreURL)) ? 3 : 2);
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  let paramObj = {};
  for (var value of query.keys()) {
    paramObj[value] = query.get(value);
  }

  const { loading, error, isAuthenticated, getExpiryResp } = useSelector((state) => state.login);
  useEffect(() => {
    if (!_.isEmpty(paramObj)) {
      if (!isMobile) {
        dispatch(handleAzureLogin(paramObj));
      }
    }
    else {
      swal('Authentication Failed', 'No User Found', 'warning').then(() => history.replace('/broker'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (type === 0) {
      history.replace('/mobile-login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (!loading && isAuthenticated && !_.isEmpty(getExpiryResp)) {
      history.replace("/home");
      dispatch(cleanExpiryDetails());
    }
    else if (!loading && error) {
      swal("", serializeError(error), "warning");
    }

    return () => {
      dispatch(alertCleanup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, isAuthenticated, getExpiryResp]);


  if (isMobile && type !== 2) {
    return <MobileChooseModal paramObj={paramObj} queryKeys={location.search} setType={setType} show={type === 3} onHide={() => setType(0)} />
  }

  return loading ? (<Loader />) : null
}
