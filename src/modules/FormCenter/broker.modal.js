import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { SelectComponent, Input, Error, Button } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { AttachFile } from "../core";
import { brokerPostPolicyNumber, updateDetails } from "./form.center.slice";

const validationSchema = yup.object().shape({
  // company_name: yup.string().required("employer name is required"),
  policy_type: yup.string().required("Policy type is required"),
  policy_number: yup.string().required("Policy number is required"),
  document_name: yup
    .string()
    .required("Document name is required"),
    // .matches(/^[a-zA-Z0-9\s]+$/, "Alphanumeric characters only"),
  document_type: yup.string().required("Document type is required"),
});
export const BrokerModal = ({
  documents,
  policyTypes,
  policyNumbers,
  show,
  setshow,
}) => {
  const [file, setFile] = useState("");
  const handleClose = () => {
    setshow(false);
  };
  const { control, handleSubmit, errors, setValue, watch } = useForm({
    validationSchema,
  });
  const { currentUser, userType: userTypeName } = useSelector(
    (state) => state.login
  );
  const policy_sub_type_id = watch("policy_type")?.id || null;
  const policy_number = watch("policy_number")?.id || null;
  const document_type = watch("document_type")?.id || null;
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(
        brokerPostPolicyNumber({
          user_type_name: userTypeName,
          employer_id: show.employer_id, policy_sub_type_id:show.policy_type_id,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    // eslint-disable-next-line
  }, []);


  const Submit = (data) => {
    const formData = new FormData();
    formData.append(
      "policy_type",
      policy_sub_type_id
    );
    formData.append(
      "policy_id",
      policy_number
    );
    formData.append(
      "document_type",
      document_type
    );
    formData.append("document_name", data.document_name);
    file && formData.append("userfile", file);
    dispatch(updateDetails(show.id, formData));
    setTimeout(() => {
      setshow(false);
    }, 500);
  };
  useEffect(() => {
    if (policyNumbers.length) {
      setValue(
        "policy_number",
        policyNumbers
          .map((item) => ({
            id: item?.id,
            label: item?.policy_no,
            value: item?.id,
          }))
          .find((c) => Number(c.value) === Number(show["policy_id"]))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyNumbers]);
  return (
    <Modal
      show={!!show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(Submit)}>
          <div className="row">
            <div className="col-12 col-md-6">
              <Controller
                as={
                  <SelectComponent
                    required={true}
                    isRequired={true}
                    label="Document Type"
                    options={
                      documents.map((item) => ({
                        id: item?.id,
                        label: item?.document_name,
                        value: item?.id,
                      })) || []
                    }
                    placeholder={"Select Document Type"}
                  />
                }
                isRequired={true}
                defaultValue={documents
                  .map((item) => ({
                    id: item?.id,
                    label: item?.document_name,
                    value: item?.id,
                  }))
                  .find(
                    (c) =>
                      Number(c.value) ===
                      Number(show["document_type_id"])
                  )}
                name={"document_type"}
                control={control}
                error={errors?.document_type}
              />
            </div>
            <div className="col-12 col-md-6">
              <Controller
                as={
                  <SelectComponent
                    required={true}
                    isRequired={true}
                    label="Policy Type"
                    options={
                      policyTypes.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []
                    }
                    placeholder={"Select Policy Type"}
                  />
                }
                isRequired={true}
                defaultValue={policyTypes
                  .map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                  }))
                  .find(
                    (c) =>
                      Number(c.value) ===
                      Number(show["policy_type_id"])
                  ) || ""}
                name={"policy_type"}
                control={control}
                error={errors?.policy_type}
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
                    required={true}
                    isRequired={true}
                    label="Policy Name"
                    options={
                      policyNumbers.map((item) => ({
                        id: item?.id,
                        label: item?.policy_no,
                        value: item?.id,
                      })) || []
                    }
                    error={errors?.policy_number}
                    placeholder={"Select Policy Name"}
                  />
                }
                isRequired={true}
                name={"policy_number"}
                control={control}
              />
              {!!errors?.policy_number && (
                <Error>{errors?.policy_number?.message}</Error>
              )}
            </div>
            <div className="col-12 col-md-6">
              <Controller
                as={
                  <Input
                    required={true}
                    isRequired={true}
                    label="Document Name"
                    placeholder={"Select Document type"}
                    name={"document_name"}
                    type={"text"}
                  />
                }
                isRequired={true}
                name={"document_name"}
                error={errors?.document_name}
                control={control}
                defaultValue={show["document_name"] || ""}
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
                description="File Formats: ppt, pptx, pdf, doc, docx, ,xls ,xlxs"
                nameBox
                required={false}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button type='button' buttonStyle='danger' variant="danger" onClick={handleClose}>
              Close
            </Button>

            <Button variant="warning" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
