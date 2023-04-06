import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button } from '../../../../components'
import { useForm, Controller } from "react-hook-form";

import { useDispatch } from 'react-redux';
import { editBrokerFAQ } from '../../help.slice';
import { common_module } from 'config/validations'

const validation = common_module.help


export const EditBrokerFAQModal = (props) => {

  const { show, onHide, id, data: { question, answer } } = props
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();


  const onSubmit = (data) => {

    if (id) {
      dispatch(editBrokerFAQ({
        questions: data.question,
        answers: data.answer,
        _method: "PATCH"
      }, id));
    }
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Edit FAQ</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12}>
              <Controller
                as={<Form.Control maxLength={validation.faq.question} as="textarea" rows="2" />}
                defaultValue={question}
                name="question"
                control={control}
              />
              <label className="form-label">
                <span className="span-label">Question</span>
              </label>
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="mt-3">
              <Controller
                as={<Form.Control maxLength={validation.faq.answer} as="textarea" rows="4" />}
                defaultValue={answer}
                name="answer"
                control={control}
              />
              <label className="form-label">
                <span className="span-label">Answer</span>
              </label>
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-center mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Update</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}

// PropTypes 
EditBrokerFAQModal.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
EditBrokerFAQModal.defaultProps = {
  props: { onHide: () => { } }
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
