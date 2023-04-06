import React from "react";
import Modal from "react-bootstrap/Modal";
import { Input, Button, Error } from "components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
let schmea = yup.object().shape({
  entry: yup
    .string()
    .required()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .min(3)
    .label("Entry"),
});
const ModalComponent = ({ show, onHide, setData }) => {
  const { control, errors, handleSubmit } = useForm({
    validationSchema: schmea,
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    data = data.entry.split(" ").map(data => {
      return data.charAt(0).toUpperCase() + data.slice(1);
    })
    data = data.toString().split(",").join(" ");
    data = {
      id: uuidv4(),
      default_endrosement_format_id: 1,
      feild_name: data,
      default_feild_name: data,
      feild_validation: "sometimes|required",
      is_mandatory: 0
  }
  setData(data);
  onHide();
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className={"text-primary"}>Add</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-100">
            <Controller
              as={
                <Input
                  label="Field"
                  name="entry"
                  placeholder="Enter Field Name"
                />
              }
              isRequired
              name="entry"
              error={errors && errors.entry}
              control={control}
            />
            {errors?.entry && <Error>{errors.entry.message}</Error>}
          </div>
          <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
              <Title fontSize="0.9rem" color='#ff7070'>
                Note: If key name is not set then default label will be set<br />
                (<sup> <img height='8px' alt="important" src='/assets/images/inputs/important.png' /> </sup>) asterisk - mandatory key
              </Title>
            </TextCard>
          <Button type="submit" className="w-100 my-2">
            Add Field
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
