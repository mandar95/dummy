import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button, Select } from 'components';

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { loadInsurer, selectdropdownData } from 'modules/user-management/user.slice';

export const InsurerModal = (props) => {

  const dispatch = useDispatch();
  const dropDown = useSelector(selectdropdownData);
  const { show, onHide, insurerId } = props
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.insurer_id) {
      insurerId(data.insurer_id)

      setTimeout(onHide, 500);
    }
  }

  useEffect(() => {
    dispatch(loadInsurer(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Select Insurer</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={10} lg={10} xl={10} sm={12}>
              <Controller
                as={<Select
                  label="Insurer"
                  placeholder='Select Insurer'
                  options={dropDown.map(({ id, name }) => ({
                    id,
                    name,
                    value: id
                  }))}
                  valueName="name"
                  id="insurer_id"
                  required
                />}
                onChange={([data]) => { return data }}
                name="insurer_id"
                control={control}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}

const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
