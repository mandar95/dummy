import React, { useEffect } from 'react';
import _ from 'lodash';
import * as yup from 'yup';

import { Input, Button, Error, Select as Selecta } from "components";
import { Row, Col, Form } from 'react-bootstrap';
import Select from "../../Onboard/Select/Select";

import { useDispatch, useSelector } from 'react-redux';
import { userUpdate, /* selectState, selectCity,  getCity,*/ insurerUpdate } from '../../user.slice';
import { useForm, Controller } from "react-hook-form";
import { getstatecity } from "modules/RFQ/home/home.slice";


export const EditAddress = ({ Data, Submitted, userType }) => {

  const dispatch = useDispatch();
  const validationSchema = yup.object().shape({
    address_line_1: yup.string().required('Adress required').test('len', 'Must be atleast 8 letters', val => (val).toString().length > 8),
    address_line_2: yup.string().required('Adress required').test('len', 'Must be atleast 8 letters', val => (val).toString().length > 8),
    address_line_3: yup.string().test('len', 'Must be atleast 8 letters', val => {
      if (!val) return true;
      return (val).toString().length > 8
    }),
    pincode: yup.number().required('Pincode required').test('len', 'Must be 6 digits', val => (val).toString().length === 6),
  });
  const { control,/*  reset, */ errors, handleSubmit, watch, setValue } = useForm({
    validationSchema
  });
  // const states = useSelector(selectState);
  // const cities = useSelector(selectCity);
  const { statecity } = useSelector((state) => state.RFQHome);

  let _pincode = watch("pincode");
  useEffect(() => {
    if (_pincode?.length === 6 || String(_pincode)?.length === 6) {
      dispatch(getstatecity({ pincode: _pincode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pincode]);
  useEffect(() => {
    if (statecity?.length) {
      setValue(`state_id`, statecity[0]?.state_id);
      setValue(`city_id`, statecity[0]?.city_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statecity])
  useEffect(() => {
    if (!_.isEmpty(Data)) {
      // reset({
      //   address_line_1: Data?.address_line_1,
      //   address_line_2: Data?.address_line_2,
      //   address_line_3: Data?.address_line_3 || '',
      //   pincode: Data?.pincode
      // })
      setValue("pincode", Data?.pincode);
      setValue("state_id", Data?.state_id);
      setValue("city_id", Data?.city_id);

      setValue("address_line_1", Data?.address_line_1);
      setValue("address_line_2", Data?.address_line_2);
      setValue("address_line_3", Data?.address_line_3 || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data])

  const onSubmit = data => {
    const {
      address_line_1 = Data?.address_line_1,
      address_line_2 = Data?.address_line_2,
      address_line_3 = Data?.address_line_3,
      city_id = Data?.city_id,
      country_id = 1,
      pincode = Data?.pincode,
      state_id = Data?.state_id } = data;

    userType !== 'insurer' ?
      dispatch(userUpdate({
        address_line_1,
        address_line_2,
        ...(address_line_3 && { address_line_3 }),
        city_id,
        country_id,
        pincode,
        state_id,
        status: 1,
        _method: "PATCH"
      }, Data?.id, userType)) :
      dispatch(insurerUpdate({
        address_line_1,
        address_line_2,
        city_id,
        state_id,
        pincode,
        status: 1
      }, Data?.id));

    Submitted();
  };

  // const cityRequest = (state_id) => {
  //   if (state_id)
  //     dispatch(getCity({ state_id }))
  // }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="d-flex flex-wrap justify-content-center">
        <Col md={6} lg={6} xl={6} sm={12}>
          <Controller
            as={<Input label="Address Line 1" placeholder="Enter Address" required />}
            name="address_line_1"
            error={errors && errors.address_line_1}
            control={control}
          />
          {!!errors.address_line_1 &&
            <Error>
              {errors.address_line_1.message}
            </Error>}
        </Col>
        <Col md={6} lg={6} xl={6} sm={12}>
          <Controller
            as={<Input label="Address Line 2" placeholder="Enter Address" required />}
            name="address_line_2"
            error={errors && errors.address_line_2}
            control={control}
          />
          {!!errors.address_line_2 &&
            <Error>
              {errors.address_line_2.message}
            </Error>}
        </Col>
        {userType !== 'insurer' && <Col md={6} lg={6} xl={6} sm={12}>
          <Controller
            as={<Input label="Address Line 3(Optional)" placeholder="Enter Address" />}
            name="address_line_3"
            error={errors && errors.address_line_3}
            control={control}
          />
          {!!errors.address_line_3 &&
            <Error>
              {errors.address_line_3.message}
            </Error>}
        </Col>}
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Select
              label="Country"
              option={[{ id: 1, country_name: "India" }]}
              id="country"
              required={true}
              valueName="country_name"
              selected={1}

            />}
            name="country_id"
            control={control}
          />
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Pincode" type="number" placeholder="Enter Pincode" required />}
            name="pincode"
            error={errors && errors.pincode}
            control={control}
          />
          {!!errors.pincode &&
            <Error>
              {errors.pincode.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Selecta
                label="State"
                placeholder="state"
                isRequired={true}
                options={[
                  {
                    id: statecity.length && statecity[0]?.state_id,
                    name: statecity.length && statecity[0]?.state_name,
                    value: statecity.length && statecity[0]?.state_id,
                  },
                ]}
                id="state_id"
                disabled={true}
                readOnly= {true}
              />
            }
            // onChange={getMember}
            name={`state_id`}
            control={control}
            defaultValue={""}
          />
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Selecta
                label="City"
                placeholder="City"
                isRequired={true}
                options={[
                  {
                    id: statecity.length && statecity[0]?.city_id,
                    name: statecity.length && statecity[0]?.city_name,
                    value: statecity.length && statecity[0]?.city_id,
                  },
                ]}
                id="city_id"
                disabled={true}
                readOnly= {true}
              />
            }
            // onChange={getMember}
            name={`city_id`}
            control={control}
            defaultValue={""}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="float-right flex-d justify-content-end" style={{ right: "25px" }} >
            <Button type="submit">Submit</Button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
