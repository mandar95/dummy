import React, { useEffect, useState, useReducer } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import _ from "lodash";

import { Col } from "react-bootstrap";
import ModalComponent from "./ViewModal";
import { Card, NoDataFound, Select, TabWrapper, Tab, Loader, LoaderButton, SelectComponent } from "components";
import { DataTable } from "modules/user-management";

import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { loadBroker } from "modules/announcements/announcement.slice";
import { InsurerAll } from "modules/RFQ/home/home.slice";

import { TableData } from "./UCS.helper";
import { FetchData, initialState, loadUCCType, reducer, setUCCPageData } from "./UCC.action";
import { useDispatch, useSelector } from "react-redux";
import { ModuleControl } from "../../config/module-control";
import ExportUCC from "./ExportModal";

import {
  fetchEmployers,
  setPageData as setPageData1
} from "modules/networkHospital_broker/networkhospitalbroker.slice";

export const UCS = ({ myModule }) => {

  const dispatch = useDispatch();
  const [{ lastpage, firstpage, details, loading, ucc_type }, reducerDispatch] = useReducer(reducer, initialState);
  const [viewModal, setViewModal] = useState(false);
  const [modalExport, setModalExport] = useState(false);

  const { userType } = useParams();
  const [EmailData, setEmailData] = useState([]);
  const [tab, setTab] = useState("broker");

  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const employerName = decodeURIComponent(query.get("name") || '');
  const employerId = query.get("id");

  const [employer, setEmployer] = useState(employerName ? {
    label: employerName,
    id: employerId,
    value: employerId
  } : null);

  const { broker: brokerData } = useSelector((state) => state.announcement);
  const { insurer } = useSelector((state) => state.RFQHome);
  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
  const { employers,
    firstPage: firstPage1,
    lastPage: lastPage1, } = useSelector(
      (state) => state.networkhospitalbroker);

  const { watch, control } = useForm();
  const _brokerId = watch("broker_id");
  let _icId = watch("ic_id");

  useEffect(() => {
    if (ModuleControl.isFyntune /* UCC Multi Broker */ && false) {

      let BrokerID = _brokerId || currentUser?.broker_id;
      let ICID = _icId || currentUser?.ic_id;
      if (BrokerID) {
        setEmailData(
          details.filter((item) => item.broker_id === Number(BrokerID))
        );
      }
      if (ICID) {
        setEmailData(
          details.filter((item) => item.ic_id === Number(ICID))
        );
      }
    } else {
      setEmailData(details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_brokerId, _icId, currentUser, details]);

  useEffect(() => {
    setEmailData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (userType === "admin") {
      dispatch(loadBroker());
      dispatch(InsurerAll());
    }
    loadUCCType(reducerDispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (employer?.id || currentUser?.employer_id) {
      if (lastpage >= firstpage) {
        var _TimeOut = setTimeout(_callback, 300);
      }
      function _callback() {
        FetchData(reducerDispatch, firstpage, employer?.id || currentUser?.employer_id)
      }
    }
    return () => {
      clearTimeout(_TimeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstpage, employer]);


  useEffect(() => {
    return () => {
      dispatch(setPageData1({
        firstPage: 1,
        lastPage: 1,
      }))
      setUCCPageData(reducerDispatch, {
        current_page: 1,
        last_page: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id || _brokerId) && userTypeName !== "Employee") {
      if (lastPage1 >= firstPage1) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage1));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage1, currentUser]);

  let _commonObject = {
    viewModal,
    setViewModal,
  };

  return (
    <Card
      title={
        <div className="d-flex justify-content-between">
          <span>Unified Customer Communication</span>
          {!(firstpage > lastpage) &&
            <LoaderButton percentage={(firstpage - 1) * 100 / lastpage} />}
        </div>
      }
    >
      <>
        <form>
          {userType === "admin" && (
            <>
              <TabWrapper width="max-content">
                <Tab
                  isActive={Boolean(tab === "broker")}
                  onClick={() => setTab("broker")}
                  className="d-block"
                >
                  Broker
                </Tab>
                <Tab
                  isActive={Boolean(tab === "insurer")}
                  onClick={() => setTab("insurer")}
                  className="d-block"
                >
                  Insurer
                </Tab>
              </TabWrapper>
              {tab === "broker" && (
                <Col sm="12" md="12" lg="12" xl="12">
                  <Controller
                    as={
                      <Select
                        label="Broker"
                        placeholder="Select Broker"
                        required={false}
                        isRequired={true}
                        options={
                          brokerData?.map((item) => ({
                            id: item?.id,
                            name: item?.name,
                            value: item?.id,
                          })) || []
                        }
                      />
                    }
                    name="broker_id"
                    control={control}
                    defaultValue={""}
                  />
                </Col>
              )}
              {tab === "insurer" && (
                <Col sm="12" md="12" lg="12" xl="12">
                  <Controller
                    as={
                      <Select
                        label="Insurer"
                        placeholder="Select insurer"
                        required={false}
                        isRequired={true}
                        options={insurer.map((item) => ({
                          id: item?.id,
                          name: item?.name,
                          value: item?.id,
                        }))}
                      />
                    }
                    name="ic_id"
                    control={control}
                    defaultValue={""}
                  />
                </Col>
              )}
            </>
          )}
        </form>
        {(userType === "broker" || userType === "admin") &&
          <Col md={12} lg={4} xl={3} sm={12} style={{ zIndex: 4 }}>
            <SelectComponent
              label="Employer"
              placeholder='Select Employer'
              options={[{
                id: -1,
                label: 'All UCC',
                value: -1
              }, ...employers.map((item) => ({
                id: item?.id,
                label: item?.name,
                value: item?.id
              }))]}
              value={employer}
              id="employer_id"
              required
              onChange={(e) => {
                history.replace(`unified-communication-system?name=${encodeURIComponent(e.label)}&id=${e.id}${type ? `&type=${type}` : ''}`)
                setUCCPageData(reducerDispatch, {
                  current_page: 1,
                  last_page: 1,
                })
                setEmployer(e); return e
              }}
              name="employer_id"
            />
          </Col>}
        {(loading && employer) ? <>
          <NoDataFound text='Loading UCC' img='/assets/images/loading.jpg' />
          <Loader />
        </> : (!!(EmailData && EmailData.length > 0) && (
          <DataTable
            columns={
              TableData(
                _commonObject.setViewModal,
                myModule
              ) || []
            }
            data={EmailData}
            onExport={() => setModalExport(true)}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            autoResetPage={false}
            rowStyle
          />
        ) 
        // : (employer && <NoDataFound text="No Data Found" />)
        )}
        {!!_commonObject.viewModal && (
          <ModalComponent
            show={!!_commonObject.viewModal}
            onHide={() => _commonObject.setViewModal(false)}
            HtmlArray={{ id: _commonObject.viewModal }}
          />
        )}
      </>
      {<ExportUCC
        show={modalExport}
        onHide={() => setModalExport(false)}
        ucc_type={ucc_type}
        reducerDispatch={reducerDispatch}
        currentUser={currentUser}
        dispatch={dispatch}
      />}
    </Card>
  );
};
