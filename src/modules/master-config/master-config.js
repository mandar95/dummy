import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Controller, useForm } from "react-hook-form";
import { Row, Col, Button as Btn } from "react-bootstrap";
import { CardBlue, SelectComponent, Loader } from "../../components";
import Table from "./table";
import ModalComponent from "./AddModal";
import { clearAlertMessage, getAllMaster, clear_success, clearResponse, setQueries, setAnnounce, setTpa, setPolicyType } from "./master.slice";
import _ from "lodash";
import swal from 'sweetalert';
import { getMaster } from './master.helper';
import { useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";


const MasterConfig = () => {
  //hooks
  const dispatch = useDispatch();
  const { userType } = useParams();
  const { control } = useForm();
  const { globalTheme } = useSelector(state => state.theme)

  // const { handleSubmit, control, reset } = useForm();
  const response = useSelector((state) => state.master);
  const TableData =
    !_.isEmpty(response?.response?.data?.data) &&
    response?.response?.data?.data;

  const MasterData =
    (!_.isEmpty(response?.allMasterResp?.data?.data) &&
      response?.allMasterResp?.data?.data) || []

  //states
  const [modalShow, setModalShow] = useState(false);
  const [masterId, setMasterId] = useState('');
  const [masterData, setMasterData] = useState('');

  //api calls--------------
  useEffect(() => {
    dispatch(getAllMaster(userType));
    dispatch(setQueries());
    dispatch(setTpa());
    dispatch(setPolicyType());
    dispatch(setAnnounce());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (masterId)
      getMaster(masterId, dispatch)

    return () => { dispatch(clearResponse()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId]);

  useEffect(() => {
    if (TableData.length) {
      const Data = TableData
        .map((master, index) => ({ ...master, index: index + 1 }));
      setMasterData(Data);
    } else {
      setMasterData('');
    }
  }, [TableData]);

  //-----------------------

  //alerts-----------------------
  //secondary
  useEffect(() => {
    if (response?.alert) {
      swal(response?.alert, "", "warning");
    }
    return () => {
      dispatch(clearAlertMessage())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.alert])

  useEffect(() => {
    if (response?.success) {
      swal(response?.success, "", "success");
    }
    return () => {
      dispatch(clear_success())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.success])
  //-----------------------------

  //card title----------------------------------------------
  const title = (
    <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
      <span style={{ width: "100%" }}>Master Table</span>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn size="sm" varient="primary" onClick={() => setModalShow(true)}>
          <p
            style={{
              fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
              fontWeight: "600",
              marginBottom: "-1px",
            }}
          >
            Add/Overwrite
          </p>
        </Btn>
      </div>
    </div>
  );
  //--------------------------------------------------------

  return (
    <>
      <CardBlue title={"Master Type"}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Controller
              as={<SelectComponent
                label="Select Master"
                placeholder="Select Master"
                options={userType !== 'admin' ?
                  [
                    ...MasterData?.filter(({ id }) => [17, 22, 30, 36, 42].includes(id)).map((master) => ({
                      id: master.id,
                      label: master.name,
                      value: master.id
                    })),
                    {
                      id: 42,
                      label: 'Campaign',
                      value: 42
                    }
                  ]
                  : MasterData?.map((master) => ({
                    id: master.id,
                    label: master.name,
                    value: master.id
                  }))}
                placeHolder="Select Master" />}
              onChange={([e]) => { setMasterId(Number(e?.value)); return e; }}
              control={control}
              name="template_id"
            />
          </Col>
        </Row>
      </CardBlue>
      {!!masterId &&
        <CardBlue title={title}>
          <Table Data={masterData}
            masterId={masterId}
            queries={response?.queries}
            announcement={response.announcement}
            tpa={response.tpa}
            policytype={response?.policytype}
            dispatch={dispatch}
            userType={userType}
          />
        </CardBlue>}
      {!!modalShow && <ModalComponent setMasterId={(id) => setMasterId(Number(id))} userType={userType} masterId={masterId} show={modalShow} onHide={() => setModalShow(false)} />}
      {response.loading && <Loader />}
    </>
  );
};

export default MasterConfig;
