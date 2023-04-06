import React from "react";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import classesone from "./FamilyMemberModal.module.css";

import { OptionInput } from "modules/flexbenefit/style.js";
import { Button } from "../../../components";
import { Col, Row } from "react-bootstrap";
import { NumberInd } from "../../../utils";

const BaseOptionModal = ({ show = {}, detail, onHide, globalTheme,
  selectedId, setSelectedId, is_topup = false,
  no_of_times_salary = [], isSinglePlan,
  defaultSI, setOptionState }) => {

  return (

    <Modal
      size="md"
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex">
      <Modal.Body>
        <div
          className={`px-3 d-flex justify-content-between ${classesone.borderDashed}`}>
          <div>
            <p className="h5">Select Base Cover</p>
          </div>
          <div onClick={onHide} style={{ color: globalTheme?.Tab?.color }} className={classesone.redColor}>
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div
          className={`px-3 py-4 d-flex justify-content-around ${classesone.borderDashed} d-flex row`}>
          {detail.flex_suminsured?.map((elem, childIndex) => {

            return <OptionInput width='auto' small key={"child-feature1" + childIndex} className={`d-flex col-md-${no_of_times_salary.length ? '12' : '4'} col-12`}>
              <><input
                name={`${is_topup ? 'flex_topup_si' : 'flex_si'}[${detail.id}]`}
                type={"radio"}
                value={String(elem?.sum_insured)}
                checked={!!selectedId ? (String(selectedId) === String(elem?.sum_insured)) : (isSinglePlan && String(defaultSI) === String(elem?.sum_insured))}
                onClick={() => {
                  isSinglePlan ? setOptionState(prev => ({
                    ...prev,
                    sum_insureds: prev.sum_insureds.map(elem1 => ({
                      ...elem1,
                      ...elem1.flex_id === detail.id && { sum_insured: elem?.sum_insured }
                    })),
                    step: prev.step + 1
                  })) : setSelectedId(String(elem?.sum_insured));
                  onHide();
                }} />
                <span style={{ top: '2px' }}></span>
              </>
              <div className='label_name'>
                ₹{NumberInd(elem?.sum_insured)} {!!no_of_times_salary.length && `(No. times of salary : ${+(no_of_times_salary[childIndex])})`}
              </div>
            </OptionInput>
          })}
        </div>
        {!!selectedId && <Row>
          <Col className="text-center mt-3" style={{ zoom: '0.9' }}>
            <Button onClick={() => {
              setSelectedId()
              onHide()
            }} buttonStyle='danger' >
              Reset
            </Button>
          </Col>
        </Row>}
      </Modal.Body>
    </Modal>
  );
};

export default BaseOptionModal;
