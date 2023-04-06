import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { Button, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Chip } from "../../../components";
import { allocateFlexData } from "../flexbenefit.slice";
import styled from "styled-components";
import { numOnly, noSpecial } from 'utils';

//styles--------------------------------------------
export const BenefitList = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  border: 1px dashed #deff;
  padding: 11px;
  background: #efefef;
  border-radius: 5px;
  width: 100%;
`;
//--------------------------------------------------

const ModalComponent = (props) => {
  const { handleSubmit, control, reset } = useForm();
  const dispatch = useDispatch();

  //chip states
  const [amt, setAmt] = useState("");
  const [amounts, setAmounts] = useState([]);

  //onSubmit-----------------------------------
  const onSubmit = (data) => {
    const formdata = Object.assign({ amount: amounts }, props?.Data);
    dispatch(allocateFlexData({ ...formdata, employer_id: props?.Data?.employer_id?.value }));
    onFinish();
  };
  //-------------------------------------------

  //onFinish-------------------------------------
  const onFinish = () => {
    props.onHide();
  };
  //---------------------------------------------

  // chip add delete----------------------------

  /*---------add---------------*/
  const onAdd = () => {
    if (amt && Number(amt)) {
      let flag = false;
      if (amounts.length) flag = amounts.some((value) => value === amt);

      if (!flag) setAmounts((prev) => [...prev, amt]);
      reset({
        amt: "",
      });
    }
  };

  /*-----------------remove------------------*/
  const removeAmount = (siAmount) => {
    const filteredSIAmount = amounts.filter((item) => item !== siAmount);
    setAmounts((prev) => [...filteredSIAmount]);
  };

  //---------------------------------------------
  return (
    <Modal
      {...props}
      animation={true}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span >Sodexo Amount</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto" }}>
          <div style={{ padding: "20px", overflow: "auto" }}>
            <Row sm={1} md={1} lg={1} xl={1}>
              <div className="p-2">
                <Controller
                  as={
                    <Input
                      label="Add Amount"
                      placeholder="Add Amount"
                      type='tel'
                      maxLength={9}
                      onKeyDown={numOnly} onKeyPress={noSpecial}
                    />
                  }
                  onChange={([e]) => {
                    setAmt(e.target.value);
                    return e;
                  }}
                  name="amt"
                  control={control}
                />
              </div>
              <div style={{ display: "flex", padding: "10px" }}>
                <div className="p-2">
                  <Button type="button" onClick={onAdd}>
                    <i className="ti ti-plus"></i> Add
                  </Button>
                </div>
                <Row sm={1} md={1} lg={1} xl={1}>
                  {amounts.length ? (
                    <BenefitList>
                      {amounts.map((amount, index) => (
                        <Chip
                          id={amount}
                          name={`${amount}`}
                          onDelete={removeAmount}
                          key={index + 'benefit-amount'}
                        />
                      ))}
                    </BenefitList>
                  ) : null}
                </Row>
              </div>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={props.onHide}
            variant="danger"
            style={{ float: "right" }}
          >
            Close
          </Button>
          <Button type="submit" variant="success" style={{ float: "right" }}>
            Save
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default ModalComponent;
