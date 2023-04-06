import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
// import _ from "lodash";
import { Button, Error } from "components";
import classes from "./index.module.css";

import { useForm } from "react-hook-form";
import { useDispatch/* , useSelector */ } from "react-redux";
// import * as yup from "yup";
// import { numOnly } from "utils";
import { AttachFile2 } from "modules/core";

import { createHealthCheckup } from "./healthSlice";
import { Row, Col, Button as Btn } from "react-bootstrap";
import swal from "sweetalert";
import * as yup from "yup";
/*----x-----validation schema-----x----*/
// import { loading } from "./healthSlice";

const validationSchema = () =>
  yup.object().shape({
    document: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Please Enter File Name").label("File")
      })
    ),
  });

const UploadHealthReportModal = (props) => {

  const [additionalCount, setAdditionalCount] = useState(1);
  const addForm = () => {
    setAdditionalCount((prev) => prev + 1);
  };

  const removeBill = (id) => {
    setAdditionalCount((prev) => (prev ? prev - 1 : prev));
  };
  const dispatch = useDispatch();
  //prefill
  const { handleSubmit, errors, register } = useForm({
    validationSchema: validationSchema(),
  });
  const onSubmit = (data) => {
    if (!data.document.map(data => {
      return data.image.length
    }).reduce((total, number) => total * number, 1)) {
      swal({
        title: "Please Select File",
        icon: "warning",
      })
      return
    }
    const formdata = new FormData();
    formdata.append(`members[${0}][employee_member_mapping_id]`, props.id.employee_member_mapping_id);
    formdata.append(`members[${0}][contact]`, props.id.contact);
    formdata.append(`members[${0}][email]`, props.id.email);
    formdata.append(`members[${0}][appointment_request_date_time]`, props.id.appointment_request_date_time);
    formdata.append(`members[${0}][alternate_appointment_request_date_time]`, props.id.alternate_appointment_request_date_time);
    formdata.append(`members[${0}][address_line_1]`, props.id.address_line_1);
    formdata.append(`members[${0}][address_line_2]`, props.id.address_line_2);
    formdata.append(`members[${0}][pincode]`, props.id.pincode);
    formdata.append(`members[${0}][state_id]`, props.id.state_id);
    formdata.append(`members[${0}][city_id]`, props.id.city_id);
    formdata.append(`user_type_name`, props.userTypeName);
    formdata.append(`action`, "update");

    data.document.forEach((data, index) => {
      formdata.append(`members[${0}][reports][${index}][image]`, data.image[0]);
      formdata.append(`members[${0}][reports][${index}][name]`, data.name);
    });

    dispatch(
      createHealthCheckup(formdata)
    );
    props.loader(true);
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="lg">

      <Modal.Header closeButton>
        <Modal.Title>
          {<h5 className={classes.redColor}>Upload Documents</h5>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body><Form onSubmit={handleSubmit(onSubmit)}>
        {additionalCount < 1 ? (
          <Row>
            <Col
              md={6}
              lg={5}
              xl={4}
              sm={12}
              className="d-flex align-items-center"
            >
              <Btn type="button" onClick={addForm}>
                Upload Documents +
              </Btn>
            </Col>
          </Row>
        ) : (<>
          <div className="d-flex flex-column">

            {[...Array(Number(additionalCount))]?.map((_, index) => {
              return (
                <div className="row justify-content-around align-items-center" key={"upload" + index}>
                  <div className="col-12 col-sm-6">
                    <Form.Control
                      className="rounded-lg"
                      size="sm"
                      type="text"
                      maxLength={1000}
                      minLength={2}
                      name={`document[${index}].name`}
                      ref={register}
                      placeholder={`File Name`}
                    />
                    {!!errors.document &&
                      errors.document[index] &&
                      errors.document[index].name && (
                        <Error top="0">
                          {errors.document[index].name.message}
                        </Error>
                      )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <AttachFile2
                      fileRegister={register}
                      name={`document[${index}].image`}
                      title="Attach Document"
                      key="premium_file"
                      accept=".jpeg, .png, .jpg, .pdf"
                      description="File Formats: jpeg, png, jpg, pdf"
                      nameBox
                      attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                    />
                  </div></div>

              );
            })}

          </div>
          <div className="d-flex justify-content-center align-items-center my-5">
            {additionalCount >= 1 && (
              <i
                className="btn ti-trash text-danger"
                onClick={removeBill}
              />
            )}
            <i className="btn ti-plus text-success" onClick={addForm} />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Button type="submit">Upload Documents</Button>
          </div>
        </>
        )}</Form>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>

    </Modal>
  );
};

export default UploadHealthReportModal;
