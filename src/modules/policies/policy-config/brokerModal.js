import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'components'
import Select from "modules/user-management/Onboard/Select/Select";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { approvePolicy, loadBroker } from '../approve-policy/approve-policy.slice'

export const BrokerModal = (props) => {

  const dispatch = useDispatch();
  const { broker } = useSelector(approvePolicy);
  const { userType } = useSelector(state => state.login);
  const { show, onHide, brokerId } = props
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.broker_id) {
      brokerId(data.broker_id)

      setTimeout(onHide, 500);
    }
  }

  useEffect(() => {
    if (userType)
      dispatch(loadBroker(userType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

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
          <Head>Select Broker</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={10} lg={10} xl={10} sm={12}>
              <Controller
                as={<Select
                  label="Broker"
                  option={broker}
                  valueName="name"
                  id="broker_id"
                  required
                />}
                onChange={([data]) => { return data }}
                name="broker_id"
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

// PropTypes 
// AddFAQ.propTypes = {
//   props: PropTypes.object
// }

// // DefaultTypes
// AddFAQ.defaultProps = {
//   props: { onHide: () => { } }
// }


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
