import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from "yup";
import { format } from 'date-fns';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { DatePicker, Error, Button, SelectComponent } from 'components';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice"
import { useForm, Controller } from "react-hook-form";
import { DateFormate } from 'utils';
import { exportUCC } from './UCC.action';
import { useSelector } from 'react-redux';

const validationSchema = yup.object().shape({
  // employer_id: yup.object().shape({
  //   id: yup.string().required('Employer Required'),
  // }),

  employer_id: yup.array().when("employer_all", {
    is: value => value === '0',
    then: yup.array().of(yup.object().shape({
      id: yup.string().required('Employer Required'),
    })).required("Employer Required"),
    otherwise: yup.array().of(yup.object().shape({
      id: yup.string().required('Employer Required'),
    }))
  }),
  email_type: yup.array().when("email_all", {
    is: value => value === '0',
    then: yup.array().of(yup.object().shape({
      id: yup.string().required('Communication Type Required'),
    })).required("Communication Type Required"),
    otherwise: yup.array().of(yup.object().shape({
      id: yup.string().required('Communication Type Required'),
    }))
  }),
  to_date: yup.string().required("End Date Required"),
  from_date: yup.string().required("Start Date Required"),
});


export default function ExportUCC({
  show, onHide, ucc_type, reducerDispatch,
  currentUser, dispatch }) {
  const { control, handleSubmit, errors, watch, register } = useForm({ validationSchema });

  const { employers, firstPage, lastPage } = useSelector(
    (state) => state.networkhospitalbroker
  );

  const employerAll = watch('employer_all');
  const emailAll = watch('email_all');
  const from_date = watch('from_date')

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id)) {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  const onSubmit = (payload) => {
    exportUCC(reducerDispatch, {
      ...payload.email_all === '0' && { email_types: payload.email_type.map(({ id }) => id) },
      ...payload.employer_all === '0' && { employer_ids: payload.employer_id.map(({ id }) => id) },
      employer_all: payload.employer_all,
      email_all: payload.email_all,
      broker_id: currentUser?.broker_id || 1,
      from_date: payload.from_date,
      to_date: payload.to_date,
    }, onHide)
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
          <Head>Download UCC Data</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Row className="d-flex flex-wrap">
            <Col md={12} lg={4} xl={4} sm={12}>
              <Head className='text-center'>Employer Method</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Select All"}</p>
                  <input ref={register} name={'employer_all'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Selective"}</p>
                  <input ref={register} name={'employer_all'} type={'radio'} value={0} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>
            {(employerAll === '0') &&
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
            }
          </Row>

          <Row className="d-flex flex-wrap">
            <Col md={12} lg={4} xl={4} sm={12}>
              <Head className='text-center'>Communication Method</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Select All"}</p>
                  <input ref={register} name={'email_all'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", width: 'inherit' }}>{"Selective"}</p>
                  <input ref={register} name={'email_all'} type={'radio'} value={0} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>

            {(emailAll === '0') &&
              <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                <Controller
                  as={
                    <SelectComponent
                      label="Communication Type"
                      placeholder="Select Communication Type"
                      required={false}
                      isRequired
                      options={ucc_type}
                      multi={true}
                      closeMenuOnSelect={false}
                      closeMenuOnScroll={false}
                      hideSelectedOptions={true}
                      isClearable={false}
                      error={errors && errors.email_type?.id}
                    />
                  }
                  control={control}
                  name="email_type"
                />
                {!!errors.email_type?.id && <Error>
                  {errors.email_type?.id.message}
                </Error>}
              </Col>
            }
          </Row>
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
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
