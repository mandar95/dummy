import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Button, Loader } from "components";
import { AttachFile2 } from "modules/core";
import swal from "sweetalert";
import _ from "lodash";
import {
  employeeImageUpload, getloading
} from "./Dashboard.slice";
import { useDispatch, useSelector } from "react-redux";
const UploadedImageModal = ({ show, onHide, data, policyId, FindMemberImage }) => {
  const dispatch = useDispatch();
  const loading = useSelector(getloading);
  const { handleSubmit } = useForm();
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState([]);
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!file.length) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file[0]);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const get = (file) => {
    setFile(file);
  };
  const onSubmit = () => {
    const formData = new FormData();
    if (_.isEmpty(file)) {
      swal("Select Image", "", "warning");
      return;
    }
    if (!_.isEmpty(file)) {
      formData.append("member_id", data?.id);
      formData.append("image", file[0]);
      dispatch(employeeImageUpload(formData, policyId));
      onHide()
    }
  }
  return (
    <Modal show={Boolean(show)} onHide={onHide} size="md">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Preview Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100 d-flex justify-content-center">
            <img
              style={{
                maxWidth: "200px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
              src={preview || data?.image_url || FindMemberImage(data.relation_id, data.gender)}
              alt=""
            />
          </div>
          <AttachFile2
            accept=".jpg,.png,.jpeg,.gif"
            key="member_sheet"
            onUpload={get}
            description={`File Formats: (.jpg, .jpeg, .gif, .png)`}
            nameBox
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Upload</Button>
        </Modal.Footer>
      </Form>
      {loading && <Loader />}
    </Modal>
  );

};

export default UploadedImageModal;
