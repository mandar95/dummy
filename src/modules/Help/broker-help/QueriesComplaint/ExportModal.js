import React from 'react';
import styled from 'styled-components';
import * as yup from "yup";
import { format } from 'date-fns';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { DatePicker, Error, Button, SelectComponent, Loader } from 'components';
import { useForm, Controller } from "react-hook-form";
import { DateFormate } from 'utils';
import { useDispatch } from 'react-redux';
import { dowloadMasterQueryReport, downloadFeedbackReport } from 'modules/Help/help.slice';

const validationSchema = (type) => yup.object().shape({
  employer_id: yup.array().of(yup.object().shape({
    id: yup.string().required('Employer Required'),
  })).required("Employer Required"),
  ...type === "query" && 
  {master_query_type: yup.array().of(yup.object().shape({
    id: yup.string().required('Query Type Required'),
  })).required("Query Type Required")},
  to_date: yup.string().required("End Date Required"),
  from_date: yup.string().required("Start Date Required"),
});


export default function ExportModal({
  show, employers, onHide, loading, allQueryMasterType, type, title}) {
  const { control, handleSubmit, errors, watch } = useForm({ validationSchema: validationSchema(type) });
  const dispatch = useDispatch();
  const from_date = watch('from_date');
  
  const onSubmit = (payload) => {
    const all_employeer_id = payload.employer_id.map( (employee) => employee.id);
    
    if(type === "query"){
      const all_master_query_type = payload.master_query_type.map( (data) => data.id)
      const data = { employer_id: all_employeer_id,
          "master_query_type": all_master_query_type,
          "from_date": payload.from_date,
          "to_date": payload.to_date
      }
      dispatch(dowloadMasterQueryReport(data, onHide))
    }else{
      const data = { employer_ids: all_employeer_id,
        "from_date": payload.from_date,
        "to_date": payload.to_date
      }
      dispatch(downloadFeedbackReport(data, onHide))
    }
  }

  return (
    <>
      <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{title}</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
              <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                <Controller
                  as={
                    <SelectComponent
                      label="Employers"
                      placeholder="Select Employers"
                      required={false}
                      isRequired
                      options={employers?.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      multi={true}
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      hideSelectedOptions={true}
                      isClearable={false}
                      error={errors && errors.employer_id}
                    />
                  }
                  control={control}
                  name="employer_id"
                />
                {!!errors.employer_id && <Error>
                  {errors.employer_id.message}
                </Error>}
              </Col>
          </Row>

          {
            type === "query" &&
            <Row className="d-flex flex-wrap justify-content-center">
              <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                <Controller
                  as={
                    <SelectComponent
                      label="Query Type"
                      placeholder="Select Master Query Type"
                      required={false}
                      isRequired
                      options={allQueryMasterType?.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      multi={true}
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      hideSelectedOptions={true}
                      isClearable={false}
                      error={errors && errors.master_query_type}
                    />
                  }
                  control={control}
                  name="master_query_type"
                />
                {!!errors.master_query_type && <Error>
                  {errors.master_query_type.message}
                </Error>}
              </Col>
          </Row>
          }

          <Row className="d-flex flex-wrap justify-content-center">
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
    
    {loading && <Loader />}
    </>
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
