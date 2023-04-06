import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button } from '../../../../components'
import { useForm, Controller } from "react-hook-form";
import { CustomControl } from "../../../user-management/AssignRole/option/style";

import { useDispatch } from 'react-redux';
import { replyQueries } from '../../help.slice';
import { useParams } from "react-router";
import { common_module } from 'config/validations'
import { TextInput } from '../../../RFQ/plan-configuration/style';

const validation = common_module.help

export const ReplyModal = ({ show, onHide, id, replyText, employerId, currentUser }) => {
  const { control, handleSubmit, watch } = useForm();
  const dispatch = useDispatch();
  const { userType } = useParams();

  const onSubmit = (data) => {
    if (id) {
      const { action, status } = data;
      dispatch(replyQueries({
        action,
        status: status || "1"
      }, id, userType, employerId, currentUser));
      setTimeout(onHide, 500);
    }
  }

  const queryReply = watch('action') || '';


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
          <Head>Reply Query</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12} className='mt-3'>
              <div style={
                {
                  position: 'absolute',
                  right: '15px',
                  top: '-20px',
                  background: '#e2e2e2',
                  padding: '0px 5px',
                  borderRadius: '3px'
                }
              }>
                {`${queryReply.length} / ${validation.text.length}`}
              </div>
              <Controller
                as={<TextInput
                  maxLength={validation.text.length}
                  className='form-control'
                  placeholder='Enter Reply Here...'
                  required
                />}
                defaultValue={replyText}
                name="action"
                control={control}
              />
              <label className='form-label'>
                <span className='span-label'>Reply</span>
              </label>
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="mx-auto">
              <div className="d-flex justify-content-around flex-wrap p-2">
                <Controller
                  as={<CustomControl className="d-flex mt-4" >
                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Query Resolved'}</h5>
                    <input name={'status'} type={'radio'} value={0} />
                    <span style={{ top: "-2px" }}></span>
                  </CustomControl>}
                  name={'status'}
                  control={control}
                />
                <Controller
                  as={<CustomControl className="d-flex mt-4" >
                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Query Not Resolved'}</h5>
                    <input name={'status'} type={'radio'} value={1} defaultChecked />
                    <span style={{ top: "-2px" }}></span>
                  </CustomControl>}
                  name={'status'}
                  control={control}
                />
              </div>
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-center mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Save</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}

// PropTypes 
ReplyModal.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
ReplyModal.defaultProps = {
  props: { onHide: () => { } }
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
