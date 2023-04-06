import React from "react";
import { Modal, Form } from "react-bootstrap";
// import _ from "lodash";
import { Button, Input, Error } from "components";
import classes from "./index.module.css";

import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
// import { numOnly } from "utils";

import { createHealthCheckup } from "./healthSlice";
import moment from "moment";
/*----x-----validation schema-----x----*/
// const datec = new Date();
// let pastdate = datec.setDate(datec.getDate());
let schema = yup.object().shape({
  appointmentDateTime: yup
  .date()
  .min(new Date(), "Past Date and Time Not Allowed")
  .required("Please Select Appointment Date Time")
  .typeError("Wrong Date")
  .label("Appointment Date Time")
});

const AppointmentModal = (props) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm({
    validationSchema: schema,
    mode: "onBlur",
  });
  //prefill
  const setDateFormate = (date) => {
    let today = new Date(date);
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var date_ =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var dateTime = date_ + " " + time;
    return dateTime;
  };
  const onSubmit = (data) => {
    dispatch(
      createHealthCheckup({
        user_type_name: props.userTypeName,
        action: "update",
        members: [
          { ...props.id, appointment_date_time: setDateFormate(data.appointmentDateTime) },
        ],
      })
    );
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="md">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {<h5 className={classes.redColor}>Appointment Date Time</h5>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Controller
            as={
              <Input
                label="Appointment Date Time"
                // type="date"
                type="datetime-local"
                name="appointmentDateTime"
                placeholder="Appointment Date Time"
              />
            }
            isRequired
            name={`appointmentDateTime`}
            defaultValue={Boolean(props?.id?.appointment_date_time?.length)?moment(props?.id?.appointment_date_time).format('YYYY-MM-DDTHH:mm'):""}
            error={errors && errors.appointmentDateTime}
            control={control}
          />
          {errors?.appointmentDateTime && (
            <Error>{errors.appointmentDateTime.message}</Error>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Set Appointment Date Time</Button>
        </Modal.Footer>
      </Form> 
    </Modal>
  );
};

export default AppointmentModal;
