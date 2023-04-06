import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Select, Input } from "../../components";
import { AttachFile } from "../core/attachFile/AttachFile";
import swal from "sweetalert";
import _ from "lodash";
import { getFirstError, serializeError } from "../../utils";
import { Switch } from "../user-management/AssignRole/switch/switch";
import { MasterUserTypeData, NotificationTypeData } from "./master.helper";
import {
  clear_sample,
  postCountries,
  clearPostDetails,
  postDesignation,
  postRelation,
  postPolicy,
  postFamilyConstruct,
  postAlignment,
  postPosition,
  postSumInsured,
  postSubSumInsured,
  postTPAService,
  setTPA,
  postSize,
  postQuery,
  postTpa,
  setPolicyTypes,
  setQuery,
  postSubQuery,
  postGrade,
  postSubPolicy,
  postAnnouncement,
  setAnnouncement,
  postSubAnnouncement,
  postInsurerType,
  postPolicyContent,
  postInsurer,
  postPremium,
  getSampleFile,
  createDashboardIcon,
  createSampleFormat,
  createNotificationAction,
  createCampaign
} from "./master.slice";
import httpClient from "api/httpClient";
import AddModalForm from "./Forms/AddModalForm";
const ModalComponent = (props) => {
  //hooks
  const { currentUser } = useSelector(
    (state) => state.login
  );
  const [downloadFormate, setDownloadFormat] = useState("");
  async function FeatureFetch(p) {
    try {
      const { data } = await httpClient("/admin/get/policy/sample-document", {
        method: "POST",
        data: {
          policy_id: p.id,
          type: p.type,
        },
      });
      setDownloadFormat(data.data);
    } catch (err) {
      console.error(err.message);
    }
  }
  async function FeatureUpload(p) {
    try {
      const { data, message, errors } = await httpClient("/admin/policy/Feature/create-excel", {
        method: "POST",
        data: p,
        dont_encrypt: true,
      });
      if (data.status) {
        // swal("success", data.message, "success");
        swal('Success', data.message, "success").then(() => {
          props.onHide();
          props.getRecallAfterExcelUpload(props?.featurePolicyId);
          props.FeatureFetch(currentUser?.broker_id)
        });
      } else {
        swal("warning", serializeError(message, errors), "warning").then(() => {
          props.FeatureFetch(currentUser?.broker_id)
        })
      }
    } catch (err) {
      console.error("error message", err.message);
    }
  }
  const dispatch = useDispatch();
  const { handleSubmit, control, watch, register, setValue } = useForm({
    defaultValues: {
      featureoverride: "1",
    },
  });


  const notificationTypeId = watch("notification_type_id");
  //states
  const [file, setFile] = useState(null);
  const [field, setField] = useState(null);
  const [getInput, setInput] = useState(null);
  const [enable_dropdown, setDropdown] = useState(false);
  const [label, setLabel] = useState("N/A");
  const [placeholder, setPlaceholder] = useState("N/A");
  const response = useSelector((state) => state.master);

  const MasterData =
    (!_.isEmpty(response?.allMasterResp?.data?.data) &&
      response?.allMasterResp?.data?.data) ||
    [];
  //getSampleFile------------
  const get = (file) => {
    setFile(file);
  };
  //-------------------

  useEffect(() => {
    if (props?.masterId) {
      const selectedMaster = MasterData?.find(({ id }) => id === props?.masterId)
      if (selectedMaster)
        setValue('master', {
          id: selectedMaster.id,
          label: selectedMaster.name,
          value: selectedMaster.id
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.masterId])

  //on submit ------------------
  const onSubmit = (data) => {
    const formData = new FormData();
    if (_.isEqual(props?.component, "feature-config")) {
      if (_.isEmpty(file)) {
        swal("warning", "File Not Selected", "warning");
        return;
      }
      // if (_.isEqual(Number(data?.featureoverride), 3)) {
      //   if (!_.isEmpty(file)) {
      //     formData.append("file", file[0]);
      //     formData.append("policy_id", props?.featurePolicyId);
      //     formData.append("to_override", 1);
      //     FeatureUpload(formData);
      //     return;
      //   }
      // }
      if (!_.isEmpty(file)) {
        formData.append("file", file[0]);
        formData.append("broker_id", currentUser?.broker_id);
        formData.append("policy_id", props?.featurePolicyId);
        FeatureUpload(formData);
        return;
      }
      return;
    }
    if (!_.isEmpty(file)) {
      switch (Number(data?.master?.value)) {
        case 1:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postPosition(formData));
          break;
        case 2:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postSize(formData));
          break;
        case 3:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postAlignment(formData));
          break;
        case 4:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postDesignation(formData));
          break;
        case 6:
          formData.append("status", data?.status);
          formData.append("name", data?.name);
          formData.append("image", file[0]);
          dispatch(postInsurerType(formData));
          break;
        case 7:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postAnnouncement(formData));
          break;
        case 11:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postCountries(formData));
          break;
        case 13:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postFamilyConstruct(formData));
          break;
        case 16:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postGrade(formData));
          break;
        case 17:
          formData.append("status", data?.status);
          formData.append("name", data?.name);
          formData.append("image", file[0]);
          dispatch(postInsurer(formData));
          break;
        case 21:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postPolicy(formData));
          break;
        case 24:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          formData.append("tpa_id", data.subId);
          dispatch(postTPAService(formData));
          break;
        case 22:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postQuery(formData));
          break;
        case 28:
          formData.append("content", data?.content);
          formData.append("image", file[0]);
          dispatch(postPolicyContent(formData));
          break;
        case 29:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          formData.append("master_policy_id", data.subId);
          dispatch(postSubPolicy(formData));
          break;
        case 30:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          formData.append("query_id", data.subId);
          dispatch(postSubQuery(formData));
          break;
        case 31:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postRelation(formData));
          break;
        case 34:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postSumInsured(formData));
          break;
        case 35:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postSubSumInsured(formData));
          break;
        case 36:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postTpa(formData));
          break;
        case 37:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          dispatch(postPremium(formData));
          break;
        case 38:
          formData.append("override", data?.override);
          formData.append("file", file[0]);
          formData.append("master_type_id", data.subId);
          dispatch(postSubAnnouncement(formData));
          break;
        case 39:
          formData.append("name", data?.name);
          formData.append("icon", file[0]);
          formData.append("master_user_types_id", data?.master_user_types_id);
          dispatch(createDashboardIcon(formData));
          break;
        case 40:
          formData.append("sample_name", data?.sample_name);
          formData.append("sample_type_id", data?.sample_type_id);
          formData.append("sample_file", file[0]);
          dispatch(createSampleFormat(formData));
          break;
        case 41:
          formData.append("action_name", data?.action_name);
          formData.append("notification_type_id", data?.notification_type_id);
          if (data?.url) {
            formData.append("url", data?.url);
          }
          dispatch(createNotificationAction(formData));
          break;
        case 42:
          const response = {
            name: data?.name,
            codes: [
              data?.codes
            ]
          }
          dispatch(createCampaign(response));
          break;
        default:
          return <noscript />; //unreachable code due to the Input validation
      }
    }
    switch (Number(data?.master?.value)) {
      case 41:
        formData.append("action_name", data?.action_name);
        formData.append("notificatin_type_id", data?.notification_type_id);
        if (data?.url) {
          formData.append("url", data?.url);
        }
        dispatch(createNotificationAction(formData));
        break;
      case 42:
        const response = {
          name: data?.name,
          codes: [
            data?.codes
          ]
        }
        dispatch(createCampaign(response));
        break;
      default:
        return <noscript />; //unreachable code due to the Input validation
    }
  };
  //----------------------------

  //alert ------------------------
  useEffect(() => {
    if (!_.isEmpty(response?.postResp)) {
      if (response?.postResp?.data?.status) {
        // swal("Updated successfully", "", "success").then(() => props.onHide());
        swal(response?.postResp?.data?.message, "", "success").then(() =>
          props.onHide()
        );
      } else {
        let error =
          response?.postResp?.data?.errors &&
          getFirstError(response?.postResp?.data?.errors);
        error = error
          ? error
          : response?.postResp?.data?.message
            ? response?.postResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.postResp]);

  useEffect(() => {
    return () => {
      dispatch(clearPostDetails());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //------------------------------
  const masterId = Number(watch("master")?.value || props?.masterId);
  useEffect(() => {
    switch (masterId) {
      case 6:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Content" placeholder="Enter Content" />}
                name="name"
                control={control}
              />
              <Controller
                as={<Switch />}
                name="status"
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <AttachFile
                accept=".jpg, .jpeg, .png"
                key="member_sheet"
                onUpload={get}
                description="File Formats: (.jpg , .png)"
                nameBox
                required
              />
            </Col>
          </>
        );
        break;
      case 17:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Name" placeholder="Enter Name" />}
                name="name"
                control={control}
              />
              <Controller
                as={<Switch />}
                name="status"
                control={control}
                defaultValue={0}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <AttachFile
                accept=".jpg, .jpeg, .png"
                key="member_sheet"
                onUpload={get}
                description="File Formats: (.jpg , .png)"
                nameBox
                required
              />
            </Col>
          </>
        );
        break;
      case 24:
        dispatch(getSampleFile(21));
        dispatch(setTPA());
        setLabel("Tpa");
        setPlaceholder("Select Tpa");
        setDropdown(true);
        setField("excel");
        setInput(null);
        break;
      case 28:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Content" placeholder="Enter Content" />}
                name="content"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <AttachFile
                accept=".jpg, .jpeg, .png"
                key="member_sheet"
                onUpload={get}
                description="File Formats: (.jpg , .png)"
                nameBox
                required
              />
            </Col>
          </>
        );
        break;
      case 29:
        dispatch(getSampleFile(18));
        dispatch(setPolicyTypes());
        setLabel("Policy Type");
        setPlaceholder("Select Policy Type");
        setDropdown(true);
        setField("excel");
        setInput(null);
        break;
      case 30:
        dispatch(getSampleFile(31));
        dispatch(setQuery());
        setLabel("Query Type");
        setPlaceholder("Select Query Type");
        setDropdown(true);
        setField("excel");
        setInput(null);
        break;
      case 38:
        dispatch(setAnnouncement()); //skipped testing
        setLabel("Announcement Type");
        setPlaceholder("Announcement Type");
        setDropdown(true);
        setField("excel");
        setInput(null);
        break;
      case 1:
        dispatch(getSampleFile(25));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 2:
        dispatch(getSampleFile(24));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 3:
        dispatch(getSampleFile(29));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 4:
        dispatch(getSampleFile(16));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 7:
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 11:
        dispatch(getSampleFile(28));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 13:
        dispatch(getSampleFile(27));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 16:
        dispatch(getSampleFile(26));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 21:
        dispatch(getSampleFile(19));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 22:
        dispatch(getSampleFile(31));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 31:
        dispatch(getSampleFile(20));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 34:
        dispatch(getSampleFile(22));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 35:
        dispatch(getSampleFile(23));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 36:
        dispatch(getSampleFile(17));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 37:
        dispatch(getSampleFile(15));
        setDropdown(false);
        setField("excel");
        setInput(null);
        break;
      case 39:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Name" placeholder="Enter Name" />}
                name="name"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={
                  <Select
                    label={"User Type"}
                    placeholder={"Select User Type"}
                    options={MasterUserTypeData.map((master) => ({
                      id: master.id,
                      name: master.name,
                      value: master.id,
                    }))}
                  />
                }
                name="master_user_types_id"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <AttachFile
                accept=".jpg, .jpeg, .png"
                key="member_sheet"
                onUpload={get}
                description="File Formats: (.jpg , .png)"
                nameBox
                required
              />
            </Col>
          </>
        );
        break;
      case 40:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={
                  <Input label="Sample Name" placeholder="Enter Sample Name" />
                }
                name="sample_name"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={
                  <Input
                    label="Sample Type ID"
                    placeholder="Enter Sample Type ID"
                  />
                }
                name="sample_type_id"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <AttachFile
                accept=".xlsx, .xls"
                key="member_sheet"
                onUpload={get}
                description="File Formats: (.xlsx .xls)"
                nameBox
                required
              />
            </Col>
          </>
        );
        break;
      case 41:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={
                  <Select
                    label={"Notification Type"}
                    placeholder={"Select Notification Type"}
                    options={NotificationTypeData.map((master) => ({
                      id: master.id,
                      name: master.name,
                      value: master.id,
                    }))}
                  />
                }
                name="notification_type_id"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={
                  <Input label="Action Name" placeholder="Enter Action Name" />
                }
                name="action_name"
                control={control}
              />
            </Col>
            {Number(notificationTypeId) === 1 && (
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Controller
                  as={
                    <Input
                      label="Notification URL"
                      placeholder="Enter Notification URL"
                    />
                  }
                  name="url"
                  control={control}
                />
              </Col>
            )}
          </>
        );
        break;
      case 42:
        setDropdown(false);
        setField("content");
        setInput(
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Campaign Name" placeholder="Enter Campaign Name" />}
                name="name"
                control={control}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Controller
                as={<Input label="Campaign Code" placeholder="Enter Campaign Code" />}
                name="codes"
                control={control}
              />
            </Col>
          </>
        );
        break;
      default:
        setDropdown(false);
        setField("excel");
        setInput(null);
    }
    if (masterId) props.setMasterId(masterId);
    return () => {
      dispatch(clear_sample());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterId, notificationTypeId]);
  useEffect(() => {
    setDownloadFormat(null);
    if (props?.featurePolicyId) {
      FeatureFetch({
        id: props?.featurePolicyId,
        type: watch()?.featureoverride,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.featurePolicyId, watch()?.featureoverride]);
  return (
    <Modal
      show={props?.show}
      onHide={props?.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <AddModalForm
        handleSubmit={handleSubmit} onSubmit={onSubmit} props={props} control={control} MasterData={MasterData}
        enable_dropdown={enable_dropdown} label={label} placeholder={placeholder} response={response} field={field}
        register={register} get={get} getInput={getInput} downloadFormate={downloadFormate}
      />
    </Modal>
  );
};

export default ModalComponent;
