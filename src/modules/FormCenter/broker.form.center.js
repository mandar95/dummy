import React, { useState, useEffect } from "react";
import {
  Card,
  SelectComponent,
  Button,
  Input,
  Error,
  Loader,
} from "../../components";
import { AttachFile } from "../core";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import {
  initialiseAdmin,
  initialiseBroker,
  getBrokerPolicyNumber,
  adminGetEmployer,
  submitDocument,
  resetState,
  formcenter,
} from "./form.center.slice";
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import FormCenterTable from "./FormCenterTable";
import { Prefill } from "../../custom-hooks/prefill";
const Title = () => {
  return (
    <p>Add Form</p>
  );
};

const validationSchema = yup.object().shape({
  company_name: yup.string().required("Employer name is required"),
  policy_type: yup.string().required("Policy type is required"),
  policy_number: yup.string().required("Policy number is required"),
  document_name: yup
    .string()
    .min(2, "Minimum 2 chars required")
    .required("Document name is required"),
  // .matches(/^[a-zA-Z0-9\s]+$/, "Alphanumeric characters only"),
  document_type: yup.string().required("Document type is required"),
});

export default function BrokerFormCenter({ admin, myModule }) {
  const { control, errors, reset, handleSubmit, watch, setValue } = useForm({
    validationSchema,
  });
  const brokerId = watch("broker_id")?.id;
  const dispatch = useDispatch();
  const [resetFile, setResetFile] = useState(false);

  const [file, setFile] = useState("");
  const {
    broker,
    broker_documents,
    broker_policyType,
    broker_policyNumbers,
    resetStatus,
    loading,
  } = useSelector(formcenter);
  const { userType, currentUser } = useSelector((state) => state.login);

  const { employers: broker_employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
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
    if ((currentUser?.broker_id || brokerId) && userType !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, brokerId, currentUser]);

  useEffect(() => {
    if (userType) {
      if (admin) {
        dispatch(initialiseAdmin(userType));
      }
      dispatch(initialiseBroker(currentUser.broker_id));
    }
    // eslint-disable-next-line
  }, [admin, userType, currentUser]);

  const employer_id = watch("company_name")?.id || null;
  const policy_sub_type_id = watch("policy_type")?.id || null;
  const policy_number = watch("policy_number")?.id || null;
  const document_type = watch("document_type")?.id || null;

  useEffect(() => {
    if (!!employer_id && !!policy_sub_type_id) {
      setValue('policy_number', undefined)
      dispatch(
        getBrokerPolicyNumber({
          user_type_name: userType,
          employer_id, policy_sub_type_id,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    }
    // eslint-disable-next-line
  }, [employer_id, policy_sub_type_id]);

  Prefill(broker_employers, setValue, 'company_name')
  // Prefill(broker_policyType, setValue, 'policy_type')
  Prefill(broker_policyNumbers, setValue, 'policy_number', 'policy_no')

  const getAdminEmployer = ([e]) => {
    if (e.value) {
      dispatch(adminGetEmployer(e.value));
    }
    return e;
  };

  useEffect(() => {
    reset(resetFields());
    // eslint-disable-next-line
  }, [resetStatus]);

  const ResetData = () => {
    dispatch(resetState());
    setResetFile(prev => prev + 1);
  };

  const onSubmit = (data) => {
    if (file) {
      const formData = new FormData();
      if (admin) formData.append("broker_id", data.broker_id);
      formData.append("employer_id", employer_id);
      formData.append("policy_type", policy_sub_type_id);
      formData.append("policy_id", policy_number);
      formData.append("document_type", document_type);
      formData.append("document_name", data.document_name);
      formData.append("userfile", file);
      dispatch(submitDocument(formData, ResetData));
    } else {
      swal("Validation", "File Required", "warning");
    }
  };

  return (
    <>
      {!!myModule?.canwrite && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title={<Title />} style={{ maxWidth: "700px" }}>
            <div className="row">
              {admin && (
                <div className="col-12 col-md-6">
                  <Controller
                    as={
                      <SelectComponent
                        label="Broker"
                        placeholder="Select Broker"
                        options={broker.map((item) => ({
                          id: item?.id,
                          label: item?.name,
                          value: item?.id,
                        })) || []}
                        required={true}
                      />
                    }
                    onChange={getAdminEmployer}
                    name="broker_id"
                    control={control}
                  />
                  {!!errors?.broker_id && (
                    <Error>{errors?.broker_id?.message}</Error>
                  )}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <Controller
                  as={
                    <SelectComponent
                      isRequired={true}
                      label="Company Name"
                      options={broker_employers.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      placeholder={"Select Company Name"}
                      name={"company_name"}
                      error={errors?.company_name}
                    />
                  }
                  name={"company_name"}
                  control={control}
                  defaultValue=""
                />
                {!!errors?.company_name && (
                  <Error>{errors?.company_name?.message}</Error>
                )}
              </div>
              <div className="col-12 col-md-6">
                <Controller
                  as={
                    <SelectComponent
                      isRequired={true}
                      label="Document Type"
                      options={broker_documents.map((item) => ({
                        id: item?.id,
                        label: item?.document_name,
                        value: item?.id,
                      })) || []}
                      id={"document_name"}
                      placeholder={"Select Document type"}
                      name={"document_type"}
                      error={errors?.document_type}
                    />
                  }
                  name={"document_type"}
                  control={control}
                  defaultValue=""
                />
                {!!errors?.document_type && (
                  <Error>{errors?.document_type?.message}</Error>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <Controller
                  as={
                    <SelectComponent
                      isRequired={true}
                      label="Policy Type"
                      options={broker_policyType.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      id={"policy_type"}
                      placeholder={"Select Policy Type"}
                      name={"policy_type"}
                      error={errors?.policy_type}
                    />
                  }
                  name={"policy_type"}
                  control={control}
                  defaultValue=""
                />
                {!!errors?.policy_type && (
                  <Error>{errors?.policy_type?.message}</Error>
                )}
              </div>
              <div className="col-12 col-md-6">
                <Controller
                  as={
                    <SelectComponent
                      isRequired={true}
                      label="Policy Name"
                      options={broker_policyNumbers.map((item) => ({
                        id: item?.id,
                        label: item?.policy_no,
                        value: item?.id,
                      })) || []}
                      id={"policy_number"}
                      placeholder={"Select Policy Name"}
                      name={"policy_number"}
                      error={errors?.policy_number}
                    />
                  }
                  name={"policy_number"}
                  control={control}
                  defaultValue=""
                />
                {!!errors?.policy_number && (
                  <Error>{errors?.policy_number?.message}</Error>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
                <Controller
                  as={
                    <Input
                      label="Document Name"
                      placeholder={"Select Document type"}
                      name={"document_name"}
                      type={"text"}
                      error={errors?.document_name}
                      isRequired={true}
                      required={false}
                    />
                  }
                  name={"document_name"}
                  control={control}
                  defaultValue=""
                />
                {!!errors?.document_name && (
                  <Error>{errors?.document_name?.message}</Error>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <AttachFile
                  name="premium_file"
                  title="Attach File"
                  key="premium_file"
                  accept=".ppt, .pptx, .pdf, .doc, .docx, .xls, .xlxs"
                  onUpload={(files) => setFile(files[0])}
                  description="File Formats: ppt, pptx, pdf, doc, docx ,xls ,xlxs"
                  nameBox
                  required
                  resetValue={resetFile}
                />
              </div>
            </div>
            <div className="text-right mt-3">
              <Button
                buttonStyle="danger"
                type="button"
                onClick={ResetData}>
                Reset
              </Button>
              <Button buttonStyle="success" type="submit">
                Submit
              </Button>
            </div>
          </Card>
          {loading && <Loader />}
        </form>
      )}

      <FormCenterTable admin={admin} broker={broker} myModule={myModule} broker_employers={broker_employers} />
    </>
  );
}

const resetFields = () => ({
  company_name: "",
  policy_type: "",
  policy_number: "",
  document_name: "",
});
