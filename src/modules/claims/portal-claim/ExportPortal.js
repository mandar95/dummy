import React from 'react';
import styled from 'styled-components';
import * as yup from "yup";
import { format } from 'date-fns';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { DatePicker, Error, Button, SelectComponent } from 'components';


import { useForm, Controller } from "react-hook-form";
import { DateFormate } from 'utils';

const validationSchema = yup.object().shape({
  claim_type: yup.object().shape({
    value: yup.string().required('Claim Type Required'),
  }),

  to_date: yup.string().required("End Date Required"),
  from_date: yup.string().required("Start Date Required"),
});

const ClaimType = [
  { value: "hospitalization", label: "Hospitalization" },
  { value: "intimate", label: "Intimatation" }];


export default function ExportPortal({ show, onHide, exportReport, employers }) {
  const { control, handleSubmit, errors, watch } = useForm({ validationSchema });


  const from_date = watch('from_date')

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
          <Head>Export Portal Claim</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Form onSubmit={handleSubmit(exportReport)}>

          <Row className="d-flex flex-wrap justify-content-center">
            {!!employers?.length && <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <SelectComponent
                    label="Employers (Optional)"
                    placeholder="Select Employers"
                    required={false}
                    options={employers?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) || []}
                    isClearable
                    error={errors && errors.employer_id?.id}
                  />
                }
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>}
            <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <SelectComponent
                    label="Claim Type"
                    placeholder="Select Claim Type"
                    required={false}
                    isRequired
                    options={ClaimType}
                    error={errors && errors.claim_type?.value}
                  />
                }
                control={control}
                name="claim_type"
              />
              {!!errors.claim_type?.value && <Error>
                {errors.claim_type?.value.message}
              </Error>}
            </Col>
            <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <DatePicker
                    maxDate={new Date()}
                    name={'from_date'}
                    label={'Start Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="from_date"
                error={errors && errors?.from_date}
                control={control}
              />
              {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
            </Col>
            <Col xs={12} sm={12} md={6} lg={4} xl={4}>
              <Controller
                as={
                  <DatePicker
                    minDate={new Date(DateFormate(from_date || '01-01-1900', { dateFormate: true }))}
                    maxDate={new Date()}
                    name={'to_date'}
                    label={'End Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="to_date"
                error={errors && errors?.to_date}
                control={control}
              />
              {!!errors?.to_date && <Error>{errors?.to_date?.message}</Error>}
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
