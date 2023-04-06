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

/*----x-----validation schema-----x----*/

let schema = yup.object().shape({
  checktype: yup
    .string()
    .required("Please Enter Checkup Type").nullable(),
});

const AppointmentModal = (props) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, errors, } = useForm({
    validationSchema: schema,
    mode: "onBlur",
  });
  //prefill
  const onSubmit = (data) => {
    dispatch(
      createHealthCheckup({
        user_type_name: props.userTypeName,
        action: "update",
        members: [
          { ...props.id, checkup_type: data.checktype },
        ],
      })
    );
    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide} size="sm">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {<h5 className={classes.redColor}>CheckUp Type</h5>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Controller
            as={
              <Input
                label="Checkup Type"
                name="checktype"
                placeholder="Enter Checkup Type"
              />
            }
            isRequired
            defaultValue={props?.id?.checkup_type}
            name={`checktype`}
            error={errors && errors.checktype}
            control={control}
          />
          {errors?.checktype && (
            <Error>{errors.checktype.message}</Error>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;
