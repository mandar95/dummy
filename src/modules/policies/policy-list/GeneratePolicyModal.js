import React, { useState } from 'react';
import styled from 'styled-components';
import CryptoJS from "crypto-js";

import { Modal, Row, Col } from 'react-bootstrap';
import { Button } from 'components'

import { useDispatch } from 'react-redux';
import { Input } from '../../../components';
import { generatePolicy } from '../approve-policy/approve-policy.slice';
import swal from 'sweetalert';
import { isJson } from '../../offline-tpa/tpalog/ViewModal';
import { useHistory } from 'react-router';

export const GeneratePolicyModal = ({ show, onHide }) => {

  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = () => {
    if (value) {
      const bytes = CryptoJS.AES.decrypt(value, 'secret key 123');
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (isJson(originalText)) {
        // Decrypt
        dispatch(generatePolicy(JSON.parse(originalText)));
        history.push('policy-generate/0011001100')
      } else {
        swal('Incorrect JSON', '', 'info')
      }
    } else {
      swal('Incorrect JSON', '', 'info')
    }
  }

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
          <Head>Genrate Policy</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Row className="d-flex flex-wrap justify-content-center">
          <Col md={10} lg={10} xl={10} sm={12}>
            <Input label="Policy JSON" placeholder="Enter Policy JSON"
              value={value}
              onChange={(e) => { setValue(e.target.value); return e }}
              name="json_policy"
            />
          </Col>
        </Row>
        <Row >
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
            <Button type="button" onClick={onSubmit}>Submit</Button>
          </Col>
        </Row>
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
