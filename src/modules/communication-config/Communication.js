import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import swal from 'sweetalert';

import { TabWrapper, Tab } from 'components';
import { Communication } from './create-comm/CreateComm';
import { Template } from './create-template/CreateTemplate';
import CommunicationDetail from './comm-detail/CommunicationDetail';
import { StaticTemplate } from './ck-editor/CreateTemplate';

import {
  clear, reset_template,
  loadDynamic, loadHtmlTags,
  // loadEmailTemplate,
  // loadSmsTemplate,
  loadUser,
  loadPolicyNumber,
  setPageData
} from './communication-config.slice';
import { useDispatch, useSelector } from 'react-redux';

// const StringHtml = '<div><h1>Hello</h1><p>Salman</p><ul><li>Yes</li><li>No</li></ul></div>'

export const CommunicationConfig = ({ myModule }) => {
  // const { userType, myModule } = props;
  const [tab, setTab] = useState("Detail");
  const dispatch = useDispatch();
  const { userType } = useParams();

  const { success, error, loading, firstPage, lastPage } = useSelector(state => state.commConfig);
  const { userType: userTypeName } = useSelector(state => state.login);

  useEffect(() => {

    // template
    dispatch(loadDynamic());
    dispatch(loadHtmlTags());

    // create communication

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    if (userTypeName) {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        if (userType === 'admin') {
          dispatch(loadUser('Broker', userTypeName, firstPage));
          dispatch(loadPolicyNumber());
        }
        dispatch(loadUser('Employer', userTypeName, firstPage));
        // dispatch(loadUser('Employee', userTypeName, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }

      // if (userType === 'admin') {
      //   dispatch(loadUser('Broker', userTypeName));
      //   dispatch(loadPolicyNumber());
      // }

      // dispatch(loadUser('Employer', userTypeName));
      // dispatch(loadUser('Employee', userTypeName));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, lastPage, userType, userTypeName])

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      dispatch(reset_template())
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);



  return (
    <>
      {/* <td dangerouslySetInnerHTML={{ __html: StringHtml }} /> */}
      <TabWrapper width={'max-content'}>
        <Tab isActive={Boolean(tab === "Detail")} onClick={() => setTab("Detail")}>Communication Detail</Tab>
        {!!myModule?.canwrite && <>
          <Tab isActive={Boolean(tab === "Communication")} onClick={() => setTab("Communication")}>Create Communication</Tab>
          <Tab isActive={Boolean(tab === "Template")} onClick={() => setTab("Template")}>Create Template</Tab>
          <Tab isActive={Boolean(tab === "Static Template")} onClick={() => setTab("Static Template")}>Create Static Template</Tab>
        </>}
      </TabWrapper>
      {(tab === "Detail") && <CommunicationDetail />}
      {(tab === "Communication") && <Communication resetForm={!loading && success} />}
      {(tab === "Template") && <Template _setTab={setTab} />}
      {(tab === "Static Template") && <StaticTemplate setTab={setTab} />}
    </>
  )
}
