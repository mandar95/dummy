/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as yup from 'yup';
import swal from 'sweetalert';

import { Button as Btn, Row, Col, Modal } from "react-bootstrap";
import { Input, SelectComponent, Error, Chip, Button } from "components";
import { BenefitList } from 'modules/policies/steps/additional-details/styles';

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loadTPAKeywords, keywords as keywordChange, saveTPAKeywords, updateTPAKeywords } from "../claims.slice";

const validationSchema = (userType, newData) => yup.object().shape({
  ...(userType === "admin" && {
    broker_id: yup.string().required("Broker Required"),
  }),
  status_name: yup.string().required("Status required"),
  color_code: yup.string().required("Color required"),
  ...(newData && {
    tpa_id: yup.object().shape({
      id: yup.string().required('TPA Required'),
    })
  }),
})

const ModalStatus = ({ show, onHide, broker_id, Data, userType }) => {

  const edit = !!Data.id
  const dispatch = useDispatch();
  const [selectedKewords, setSelectedKewords] = useState([]);
  const { keywords, tpas } = useSelector((state) => state.claims);
  const [filterKeywords, setFilterKeywords] = useState([]);
  const { control, errors, handleSubmit, watch, setValue, reset } = useForm({
    validationSchema: validationSchema(userType, !edit),
  });

  const keyword = Number(watch('keyword')?.value);

  useEffect(() => {

    if (keywords) {
      setFilterKeywords(keywords.filter(({ id }) => !selectedKewords.some(({ id: otherId }) => otherId === id)))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKewords])

  useEffect(() => {
    setFilterKeywords(keywords)
    if (keywords && edit) {
      setSelectedKewords(Data.keywords.map((elem) => ({ id: elem.keyword_id, name: elem.keyword, value: elem.keyword_id })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords])

  useEffect(() => {
    if (Data.tpa_id) {
      dispatch(loadTPAKeywords({ tpa_id: Data.tpa_id }))
    }
    if (Data.id) {
      reset(Data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data])

  const onSubmit = (data) => {
    if (!selectedKewords.length) {
      swal('No Keywords Selected', 'Please select atleast 1 keywords', 'warning');
      return;
    }

    edit ?
      dispatch(updateTPAKeywords({
        status_name: data.status_name,
        keywords_id: selectedKewords.map(({ id }) => id),
        color_code: data.color_code,
        custom_claim_status_id: Data.id
      }))
      : dispatch(saveTPAKeywords({
        broker_id: broker_id,
        tpa_id: data.tpa_id?.value,
        status_name: data.status_name,
        keywords_id: selectedKewords.map(({ id }) => id),
        color_code: data.color_code
      }))
  };

  const addKewords = () => {
    if (keyword) {
      const flag = keywords?.find(
        (value) => value?.id === keyword
      );
      const flag2 = selectedKewords.some((value) => value?.id === Number(keyword));
      if (flag && !flag2) {
        setSelectedKewords((prev) => [...prev, flag]);
        setValue('keyword', '')
      }
    }
  };

  const removeKewords = (Broker) => {
    const filteredPolicyType = selectedKewords?.filter((item) => item?.id !== Broker);
    setSelectedKewords([...filteredPolicyType]);
  };

  const onChange = ([e]) => {
    if (e?.value) {
      dispatch(loadTPAKeywords({ tpa_id: e.value }))
    } else {
      dispatch(keywordChange([]))
    }
    setSelectedKewords([])
    setFilterKeywords([])

    return e;
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Claim Status Mapping
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          {!edit && <Row className="d-flex flex-wrap justify-content-center">

            <Col md={12} lg={5} xl={5} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="TPA's"
                    placeholder="Select TPA"
                    options={tpas.map(({ id, name }) => ({
                      id, label: name, value: id
                    })) || []}
                    id='tpa_id'
                    required={false}
                    error={errors && errors.tpa_id?.id}
                    isRequired={true} />}
                onChange={onChange}
                control={control}
                name='tpa_id' />
              {!!errors.tpa_id?.id && <Error>
                {errors.tpa_id?.id.message}
              </Error>}
            </Col>
          </Row>
          }
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={8} lg={5} xl={5} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Tpa Claim Status Master"
                    placeholder="Select Tpa Claim Status Master"
                    options={filterKeywords || []}
                    id='keyword'
                    required={false} />}
                control={control}
                name='keyword' />
            </Col>

            <Col md={4} lg={4} xl={4} sm={12} className='d-flex align-items-center'>
              <Btn type='button' onClick={addKewords}>
                <i className='ti ti-plus'></i> Add
              </Btn>
            </Col>

            {!!selectedKewords.length && (
              <Col md={12} lg={12} xl={12} sm={12}>
                <BenefitList>
                  {selectedKewords.map((item, index) =>
                    <Chip
                      key={'keyword' + index}
                      id={item?.id}
                      name={item?.name}
                      onDelete={removeKewords}
                    />)}
                </BenefitList>
              </Col>)}

          </Row>

          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={12} lg={5} xl={5} sm={12}>
              <Controller
                as={<Input label="Status" isRequired placeholder="Enter Status" />}
                error={errors && errors.status_name}
                control={control}
                name="status_name" />
              {!!errors.status_name && <Error>
                {errors.status_name.message}
              </Error>}
            </Col>

            <Col md={12} lg={5} xl={5} sm={12}>
              <Controller
                as={<Input label="Color" type="color" isRequired />}
                name="color_code"
                control={control}
                error={errors && errors.color_code}
                defaultValue="black"
              />

              {!!errors.color_code && <Error>
                {errors.color_code.message}
              </Error>}
            </Col>

          </Row>
          <Row>
            <Col className='d-flex justify-content-end mb-3 mt-3'>
              <Button
                type='submit'>
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalStatus;
