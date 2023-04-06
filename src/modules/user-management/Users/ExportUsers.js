import React from 'react';
import styled from 'styled-components';
import * as yup from "yup";
import { format } from 'date-fns';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { DatePicker, Error, Button } from '../../../components';

import { useForm, Controller } from "react-hook-form";
import { DateFormate } from '../../../utils';
import { exportUsersData } from '../user.slice';
import { useDispatch } from 'react-redux';

const validationSchema = yup.object().shape({
  end_date: yup.string().required("End Date Required"),
  start_date: yup.string().required("Start Date Required"),
});


export default function ExportUsers({ show, onHide, user_type_name }) {

  const dispatch = useDispatch();
  const { control, handleSubmit, errors, watch } = useForm({ validationSchema });

  const onSubmit = (payload) => {
    dispatch(exportUsersData({ ...payload, user_type_name }, onHide))
  }

  const start_date = watch('start_date')

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
          <Head>Download Users Data</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <DatePicker
                    maxDate={new Date()}
                    name={'start_date'}
                    label={'Start Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="start_date"
                error={errors && errors?.start_date}
                control={control}
              />
              {!!errors?.start_date && <Error>{errors?.start_date?.message}</Error>}
            </Col>
            <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <DatePicker
                    minDate={new Date(DateFormate(start_date || '01-01-1900', { dateFormate: true }))}
                    maxDate={new Date()}
                    name={'end_date'}
                    label={'End Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="end_date"
                error={errors && errors?.end_date}
                control={control}
              />
              {!!errors?.end_date && <Error>{errors?.end_date?.message}</Error>}
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Export</Button>
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
