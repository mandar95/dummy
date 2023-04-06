import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "components";
import classes from "./index.module.css";
import image from "./Img-Broker.png";
import { ErrorSheetTable } from "./helper";
import swal from "sweetalert";
import _ from "lodash";
import {
  createHealthCheckup,
  getHealthCheckup,
  deleteHealthCheckup,
  clear,
  Fetch,
  ErrorSheetHandler
} from "./healthSlice";
import { useMediaQuery } from "react-responsive";
import HealthCheckupInfoHeader from "./sub-modules/HealthCheckupInfoHeader";
import UsersList from "./sub-modules/UsersList";
import UserUplodedTable from "./sub-modules/UserUploadedTable";

const HealthCheckUp = ({ myModule }) => {
  const [loader, setLoader] = useState(false);
  const [urlData, setDownloadURL] = useState(null);
  const [uploadExcelModal, setUploadExcelModal] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const [modal, setModal] = useState(false);
  const [errorSheetData, setErrorSheetData] = useState(null);
  const dispatch = useDispatch();
  const [openAppointmentModal, setOpenAppointmentModal] = useState({
    flag: false,
    id: null,
  });
  const [openHealthReportModal, setOpenHealthReportModal] = useState({
    flag: false,
    id: null,
  });
  const [openCheckupTypeModal, setOpenCheckupTypeModal] = useState({
    flag: false,
    id: null,
  });
  const [openAppointmentStatusModal, setAppointmentStatusModal] = useState({
    flag: false,
    id: null,
  });
  const [openReportDownloadModal, setOpenReportDownloadModal] = useState({
    flag: false,
    id: null,
  });
  const [UpdatePlanModal, setUpdatePlanModal] = useState(false);
  const { success, error, loading, healthCheckupData } = useSelector(
    (state) => state.HealthCheckup
  );
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  useEffect(() => {
    if (!loading && error) {
      if (!_.isEqual(error, "Data Not Found")) {
        swal("Alert", error, "warning");
      }
      setLoader(false);
    }
    if (!loading && success) {
      // setModal(modal => false);
      swal('Success', success, "success").then(() => {
        dispatch(
          getHealthCheckup({
            user_type_name: userTypeName,
            is_super_hr: currentUser.is_super_hr,
          })
        );
        setModal(false);
        setLoader(false);
      });
    }

    return () => {
      dispatch(clear("healthCheckupMemberData"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  useEffect(() => {
    if (userTypeName === "Broker") {
      Fetch(currentUser?.broker_id, setDownloadURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthCheckupData]);

  useEffect(() => {
    if (userTypeName === "Broker") {
      Fetch(currentUser?.broker_id, setDownloadURL);
      ErrorSheetHandler(currentUser?.broker_id, setErrorSheetData, currentUser?.is_super_hr);
    }
    if (userTypeName) {
      dispatch(
        getHealthCheckup({
          user_type_name: userTypeName,
          is_super_hr: currentUser.is_super_hr,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);

  const onEdit = (id, data) => {
    if (!data.is_checkup_done) {
      setUpdatePlanModal(data);
    } else {
      swal("warning", "Health checkup already done!", "warning");
    }
  };
  function getRecallAfterExcelUpload(p, status = "not") {
    dispatch(
      getHealthCheckup({
        user_type_name: userTypeName,
        is_super_hr: currentUser.is_super_hr,
        status: status
      })
    );
  }
  const render = (status) => {
    if (_.isEqual(status, "Processing")) {
      var _TimeOut = setTimeout(_callback, 25000);
    }
    function _callback() {
      getRecallAfterExcelUpload(userTypeName, "Processing");
      Fetch(currentUser?.broker_id, setDownloadURL);
      ErrorSheetHandler(currentUser?.broker_id, setErrorSheetData, currentUser?.is_super_hr);
    }
    return () => {
      clearTimeout(_TimeOut)
    }
  }
  useEffect(() => {
    if (!_.isEmpty(errorSheetData?.filter(data => data?.status === "Processing"))) {
      render("Processing");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSheetData])
  return (
    <>
      <HealthCheckupInfoHeader myModule={myModule} classes={classes} setModal={setModal} image={image} />
      <UsersList
        myModule={myModule}
        classes={classes} userTypeName={userTypeName} urlData={urlData} isMobile={isMobile} setUploadExcelModal={setUploadExcelModal}
        healthCheckupData={healthCheckupData} dispatch={dispatch} createHealthCheckup={createHealthCheckup} setOpenAppointmentModal={setOpenAppointmentModal}
        setOpenHealthReportModal={setOpenHealthReportModal} setOpenCheckupTypeModal={setOpenCheckupTypeModal} setAppointmentStatusModal={setAppointmentStatusModal}
        setOpenReportDownloadModal={setOpenReportDownloadModal} deleteHealthCheckup={deleteHealthCheckup} onEdit={onEdit} modal={modal}
        setModal={setModal} uploadExcelModal={uploadExcelModal} ErrorSheetHandler={ErrorSheetHandler} getRecallAfterExcelUpload={getRecallAfterExcelUpload}
        setErrorSheetData={setErrorSheetData} openAppointmentModal={openAppointmentModal} openHealthReportModal={openHealthReportModal} setLoader={setLoader}
        openCheckupTypeModal={openCheckupTypeModal} openAppointmentStatusModal={openAppointmentStatusModal}
        openReportDownloadModal={openReportDownloadModal} UpdatePlanModal={UpdatePlanModal} setUpdatePlanModal={setUpdatePlanModal}
      />
      {Boolean(userTypeName === "Broker") && (
        <UserUplodedTable
          errorSheetData={errorSheetData}
          ErrorSheetTable={ErrorSheetTable}
        />
      )}
      {loader && <Loader />}
    </>
  );
};

export default HealthCheckUp;
