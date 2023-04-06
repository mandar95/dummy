import React, { useState } from "react";
import { Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { format } from 'date-fns'
import DatePicker from "react-datepicker";

import { Button } from "components";
import classesone from "modules/Health_Checkup/index.module.css";
import "modules/Health_Checkup/index.module.css";

const DateComponent = ({ show, onHide, setDates }) => {
  const { handleSubmit } = useForm({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onSubmit = (data) => {
    setDates({
      from_date: format(startDate,"dd-MM-yyyy"),
      to_date: format(endDate,"dd-MM-yyyy")
    });
    onHide();
  };

  const handleChange = (e) => {
    setStartDate(e);
  };
  const handleChangeEndDate = (e) => {
    setEndDate(e);
  };
  return (
    <Modal
      size="lg"
      show={!!show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <Modal.Body>
        <>
          <div
            className={`px-3 py-2 d-flex justify-content-between ${classesone.borderDashed}`}
          >
            <div>
              <p className={`h5 font-weight-bold`}>
                Date
              </p>
            </div>
            <div onClick={onHide} className={classesone.redColorCross}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          <form className="px-2" onSubmit={handleSubmit(onSubmit)}>

            <div className="d-flex w-100 justify-content-center align-items-center py-3">
              <div className="text-center mr-2">
                <h6>From Date</h6>
                <DatePicker selected={startDate} onChange={handleChange} inline />
              </div>
              <div className="text-center">
                <h6>To Date</h6>
                <DatePicker
                  selected={endDate}
                  onChange={handleChangeEndDate}
                  inline
                />
              </div>
            </div>

            <Row className="justify-content-end">
              <div className="mr-3">
                <Button type="submit">Set</Button>
              </div>
            </Row>
          </form>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default DateComponent;
