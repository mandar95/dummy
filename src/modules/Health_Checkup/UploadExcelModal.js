import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import classesone from "./index.module.css";
import swal from "sweetalert";
import _ from "lodash";
import { serializeError } from "utils";
import httpClient from "api/httpClient";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchEmployers,
  fetchPolicies,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
  selectPolicySubType,
  getPolicySubTypeData,
} from "modules/EndorsementRequest/EndorsementRequest.slice";
import * as yup from "yup";
import UploadExcelForm from "./Forms/UploadExcelForm";

const UploadExcelModal = ({ show, onHide, ErrorSheetHandler, getRecallAfterExcelUpload, setErrorSheetData }) => {
  const dispatch = useDispatch();
  let PolicyTypeResponse = useSelector(selectPolicySubType);
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  const { employers, policies,
    firstPage,
    lastPage } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { control, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema: yup.object().shape({
      employer_id: yup.string().required().label("Employer"),
      policy_sub_type_id: yup.string().required().label("Policy Type"),
      policy_id: yup.string().required().label("Policy Id")
    }),
    mode: "onBlur",
  });

  const employerId = watch("employer_id")?.id || currentUser?.employer_id;
  const policyTypeID = watch("policy_sub_type_id")?.id;
  const policyID = watch("policy_id")?.id;
  const _policySubType = PolicyTypeResponse?.data?.data.filter(
    (item) => item.id === 1
  ); //filter for policy type only -> GMC

  const [downloadFormate, setDownloadFormat] = useState("");
  const [file, setFile] = useState(null);

  // set file on file select
  const get = (file) => {
    setFile(file);
  };

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (policies?.length === 1 && _policySubType?.length > 0) {
      setValue("policy_id", policies[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policies]);

  //get employer
  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (userTypeName === "Broker" && employerId && policyID) {
      setDownloadFormat(false);
      HealthSample();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyID]);

  //get policy type id
  useEffect(() => {
    if (currentUser?.employer_id || employerId)
      dispatch(
        getPolicySubTypeData({
          employer_id: currentUser?.employer_id || employerId,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employerId]);

  //get policy id
  useEffect(() => {
    if (policyTypeID && (currentUser?.employer_id || employerId))
      dispatch(
        fetchPolicies({
          user_type_name: userTypeName,
          employer_id: currentUser?.employer_id || employerId,
          policy_sub_type_id: policyTypeID,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyTypeID, employerId]);

  // download sample formate function
  async function HealthSample(p) {
    try {
      const { data } = await httpClient(
        `/broker/get/health-checkup/sample-document?user_type_name=${userTypeName}&policy_id=${policyID}&type=${13}`,
        {
          method: "GET",
        }
      );
      if (data?.status) {
        setDownloadFormat(data?.data);
      } else {
        swal("Warning", serializeError(data.errors), "warning");
      }
    } catch (err) {
      swal("Alert", serializeError(err.message), "warning");
      console.error(err.message);
    }
  }

  // upload excel function
  async function HealthUpload(p) {
    try {
      const { data, message, errors } = await httpClient("/broker/import/health-checkup", {
        method: "POST",
        data: p,
        dont_encrypt: true,
      });
      if (data?.status) {
        swal('Success', data.message, "success").then(() => {
          getRecallAfterExcelUpload(userTypeName);
          ErrorSheetHandler(currentUser?.broker_id, setErrorSheetData, currentUser?.is_super_hr);
          onHide();
        });
      } else {
        swal("warning", serializeError(message, errors), "warning").then(() => {
          ErrorSheetHandler(currentUser?.broker_id, setErrorSheetData, currentUser?.is_super_hr);
          onHide();
        });
      }
    } catch (err) {
      console.error("error message", err.message);
      ErrorSheetHandler(currentUser?.broker_id, setErrorSheetData, currentUser?.is_super_hr);
      onHide();
    }
  }
  const onSubmit = (data) => {
    const formData = new FormData();
    if (_.isEmpty(file)) {
      swal("warning", "File Not Selected", "warning");
      return;
    }
    if (!_.isEmpty(file)) {
      formData.append("member_sheet", file[0]);
      formData.append("user_type_name", userTypeName);
      formData.append("employer_id", employerId);
      formData.append("type", 18);
      formData.append("policy_id", policyID);
      HealthUpload(formData);
      return;
    }
  }
  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <Modal.Body>
        <div
          className={`px-3 py-2 d-flex justify-content-between ${classesone.borderDashed}`}
        >
          <div>
            <p className={`h5 ${classesone.redColor}`}>
              Upload Health Check Up
            </p>
          </div>
          <div onClick={onHide} className={classesone.redColorCross}>
            <i className="fas fa-times"></i>
          </div>
        </div>
        <UploadExcelForm
          handleSubmit={handleSubmit} onSubmit={onSubmit} userTypeName={userTypeName} employers={employers}
          control={control} errors={errors} _policySubType={_policySubType}
          policies={policies} get={get} downloadFormate={downloadFormate} onHide={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default UploadExcelModal;
