import React from "react";
import { Modal, Form } from "react-bootstrap";
// import _ from "lodash";
import { Button, Error, Select } from "components";
import classes from "./index.module.css";

import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import _ from 'lodash';
// import { numOnly } from "utils";

import { createHealthCheckup } from "./healthSlice";

/*----x-----validation schema-----x----*/

let schema = yup.object().shape({
  status: yup.string().required("Please Select Status"),
});
const Status = [
  { id: 1, name: "Pending", value: "1" },
  { id: 2, name: "Approved", value: "2" },
  { id: 3, name: "Rejected", value: "3" },
];
const AppointmentStatusModal = (props) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm({
    validationSchema: schema,
    mode: "onBlur",
    // defaultValues: {
    //   status: Status.filter(item => item.name === props?.id?.appointment_status)
    // }
  });
  //prefill
  const onSubmit = (data) => {
    let newObj = _.omit(props.id, 'appointment_status');
    dispatch(
      createHealthCheckup({
        user_type_name: props.userTypeName,
        action: "update",
        members: [{ ...newObj, appointment_status_id: Number(data.status) }],
      })
    );
    props.onHide();
  };
  let dataAdd = 1
  if (props?.id?.appointment_status === "Approved") {
    dataAdd = 2
  }
  if (props?.id?.appointment_status === "Rejected") {
    dataAdd = 3
  }

  return (
    <Modal show={props.show} onHide={props.onHide} size="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {<h5 className={classes.redColor}>Appointment Status</h5>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <Controller
                as={
                  <Select
                    label="Status"
                    placeholder="Select Status"
                    isRequired={true}
                    options={Status}
                    error={errors && errors.status}
                  />
                }
                defaultValue={dataAdd}
                error={errors && errors?.status}
                control={control}
                name={"status"}

              />
              {!!errors?.status && <Error>{errors?.status.message}</Error>}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AppointmentStatusModal;
