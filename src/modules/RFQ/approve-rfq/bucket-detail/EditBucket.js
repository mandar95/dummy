import React, { useState } from 'react';
import swal from 'sweetalert';

import { Row, Col } from 'react-bootstrap';
import { Wrapper, BucketCard } from '../../plan-configuration/style';
import { Input, Error, Button } from 'components';
import { RiskBucket } from '../../plan-configuration/steps/RiskBucket';

import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateRfq } from '../../rfq.slice';
import { numOnly, noSpecial } from "utils";
import { insurer } from 'config/validations'

const validation = insurer.plan_config


export const EditBucket = ({ ic_plan_id, ic_id, options, rfqData, history, userType, broker_id }) => {


  const dispatch = useDispatch();
  const { control, errors, handleSubmit } = useForm({
    // defaultValues: savedConfig.risk_buckets?.map
  })

  const [industryTypes, setIndustryTypes] = useState(rfqData.risk_buckets?.filter(({ risk_bucket_id }) => options.find(({ id }) => id === risk_bucket_id)).map(({ risk_bucket_id }) => risk_bucket_id) || []);

  const AddBucket = (id) => {
    if (industryTypes.includes(id)) {
      setIndustryTypes(prev => prev.filter((value) => value !== id))
    }
    else {
      setIndustryTypes(prev => [...prev, id])
    }
  }

  const onSubmit = data => {
    if (!industryTypes.length) {
      swal('Validation', 'No industry bucket selected', 'info');
      return
    }

    const risk_factor = data.risk_factor?.filter((value) => Number(value) || value === 0 || value === '0')

    dispatch(updateRfq({
      buckets: industryTypes.map((val, index) => ({ risk_bucket_id: val, risk_factor: risk_factor[index] })),
      step: 2,
      ic_plan_id,
    }, { ic_plan_id, ic_id, broker_id }))

  };


  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {options.length ? options.map(({ bucket_name, id, industry_list }, index) => {
            // {Data.map(({ bucket_name, id, industry_list }, index) => {
            const active = industryTypes.includes(Number(id))

            return (
              <Col xl={4} lg={5} md={6} sm={12} key={bucket_name + index}>
                <BucketCard active={active} onClick={(e) => { e.stopPropagation(); AddBucket(Number(id)) }}>
                  <h3>{bucket_name}</h3>
                  <RiskBucket active={active} industry_list={industry_list} />
                  {active &&
                    <>
                      <Controller
                        as={
                          <Input
                            className='mb-4'
                            label="Risk Factor %"
                            placeholder="Enter Risk Factor %"
                            type='tel'
                            maxLength={validation.risk_factor.length}
                            onKeyDown={numOnly} onKeyPress={noSpecial}
                            required
                            error={errors && errors.risk_factor && errors.risk_factor[index]}
                            onClick={e => { e.stopPropagation(); return e }}
                          />
                        }
                        defaultValue={rfqData.risk_buckets?.find((elem) => Number(elem.risk_bucket_id) === Number(id))?.risk_percentage || '0'}
                        control={control}
                        rules={{ required: true, min: validation.risk_factor.min, max: validation.risk_factor.max }}
                        name={`risk_factor[${index}]`}
                      />
                      {!!errors.risk_factor && errors.risk_factor[index] && <Error>
                        {errors.risk_factor[index].type === 'required' && 'Risk Factor Required'}
                        {errors.risk_factor[index].type === 'min' && 'Min Value ' + validation.risk_factor.min}
                        {errors.risk_factor[index].type === 'max' && 'Max Value ' + validation.risk_factor.max}
                      </Error>}
                    </>}
                </BucketCard>
              </Col>
            )
          }) : <>
            <Col xl={12} lg={12} md={12} sm={12}>
              <h1 className='display-4 text-center'>No Industry Bucket Created</h1>
            </Col>
            <Col xl={12} lg={12} md={12} sm={12} className='d-flex justify-content-center'>
              <Button type='button' buttonStyle="outline" onClick={() => history.push(`/${userType}/bucket-config`)}>Create Industry Bucket</Button>
            </Col>
          </>}
        </Row>
        <Row >
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              Update
             </Button>
          </Col>
        </Row>
      </form>
    </Wrapper>
  )
}
