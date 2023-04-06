import React, { useState } from 'react'
import swal from 'sweetalert';

import { Row, Col, Button } from 'react-bootstrap';
import { Title, Wrapper } from '../../style';
import { Input, Chip, Marker, Typography, Error } from 'components';
import { BenefitList } from 'modules/policies/steps/additional-details/styles.js';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";

import { Controller, useForm } from 'react-hook-form';
import { PFCard } from './PFCard';
import { saveTempConfig } from '../../../rfq.slice'
import { numOnly, noSpecial } from 'utils';
import { useDispatch } from 'react-redux';
import { toWords } from '../../../../../utils';

export default function ProductFeature({ formId, moveNext, configs, savedConfig }) {

  const dispatch = useDispatch();
  const [siAmounts, setSIAmounts] = useState(savedConfig?.sum_insureds || []);
  const [features, setFeatures] = useState(savedConfig?.product_feature || []);
  const { handleSubmit, watch, setValue, control } = useForm();

  const siAmt = watch('si_amt')

  const onSubmit = () => {
    if (!siAmounts?.length) {
      return swal('Validation', 'Atleast 1 SumInsured Required', 'info')
    }
    if (!features?.length) {
      return swal('Validation', 'Atleast 1 Product Feature Required', 'info')
    }

    dispatch(saveTempConfig({
      ...savedConfig, sum_insureds: siAmounts,
      // product_feature: features
      product_feature: features.filter(({ product_feature_id }) => product_feature_id).map((elem) => ({
        ...elem,
        additional: elem.additional?.map(({ duration_type, ...elem2 }) => ({ ...elem2, ...duration_type && { duration_type }, ...(elem2.premium && { premium_by: elem2.premium_by || 1 }) }))
      }))
    }))
    moveNext()
  }


  const onAddSI = () => {
    if (Number(siAmt) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if (siAmt && Number(siAmt)) {
      let flag = false;
      if (siAmounts.length)
        flag = siAmounts.some((value) => value === siAmt)

      if (!flag) {
        setSIAmounts(prev => [...prev, siAmt]);
        setValue(
          'si_amt', ''
        );
      }
    }
  };

  const removeSIAmount = siAmount => {
    const filteredSIAmount = siAmounts.filter(item => item !== siAmount);

    setSIAmounts([...filteredSIAmount]);

    setFeatures(prev => prev.map(({ additional, ...featureMap }) => ({
      ...featureMap,
      additional: additional?.filter(({ sum_insured }) => Number(sum_insured) !== Number(siAmount)) || []
    })))
  };

  const FeatureDiv = (

    <Col md={12} lg={12} xl={12} sm={12}>
      {configs?.master_product_features?.map((feature) => <PFCard
        key={feature.id + 'feat'}
        feature={feature}
        siAmounts={siAmounts}
        features={features}
        master_product_features={configs?.master_product_features}
        setFeatures={setFeatures}
        editable={true}
      />)}
    </Col>

  );

  const values = watch('random') || [];

  const onSplitSI = () => {
    let valuesRandom = watch('random') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds');
      return null
    }
    valuesRandom = valuesRandom.map(Number);
    if (valuesRandom[0] > valuesRandom[1]) {
      swal("Min SI can't be greater than Max SI");
    }

    let j = 0;
    let dataResponse = []
    for (let i = valuesRandom[0]; i <= valuesRandom[1]; i = i + valuesRandom[2]) {
      dataResponse.push(i);
      ++j;
      if (j >= 15) {
        swal("Maximum 15 split can be done");
        break;
      }
    }
    dataResponse.length && setSIAmounts(dataResponse);
  }

  const GenerateSumInsured = (<Col xl={12} lg={12} md={12} sm={12}>
    <TextCard className="p-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
      <Marker />
      <Typography>{'\u00A0'} Generate Sum Insured</Typography>
      <Row>
        <Col xl={4} lg={5} md={6} sm={12}>
          <Controller
            as={
              <Input
                labelProps={{ background: '#f8f8f8' }}
                label='Minimum SI'
                placeholder='Enter Minimum SI'
                type='tel'
                maxLength={9}
                onKeyDown={numOnly} onKeyPress={noSpecial}
                required
              // error={errors && errors.max_discount}
              />
            }
            control={control}
            name={'random.0'}
          />
          {!!(values[0]) &&
            <Error top='0' color={'blue'}>{toWords.convert(values[0])}</Error>}
        </Col>
        <Col xl={4} lg={5} md={6} sm={12}>
          <Controller
            as={
              <Input
                labelProps={{ background: '#f8f8f8' }}
                label='Maximum SI'
                placeholder='Enter Maximum SI'
                type='tel'
                maxLength={9}
                onKeyDown={numOnly} onKeyPress={noSpecial}
                required
              // error={errors && errors.max_discount}
              />
            }
            control={control}
            name={'random.1'}
          />
          {!!(values[1]) &&
            <Error top='0' color={'blue'}>{toWords.convert(values[1])}</Error>}
        </Col>
        <Col xl={4} lg={5} md={6} sm={12}>
          <Controller
            as={
              <Input
                labelProps={{ background: '#f8f8f8' }}
                label='Interval Between Min & Max SI'
                placeholder='Enter Interval Value'
                type='tel'
                maxLength={9}
                onKeyDown={numOnly} onKeyPress={noSpecial}
                required
              // error={errors && errors.max_discount}
              />
            }
            control={control}
            name={'random.2'}
          />
          {!!(values[2]) &&
            <Error top='0' color={'blue'}>{toWords.convert(values[2])}</Error>}
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} className='d-flex justify-content-end'>
          <Button onClick={onSplitSI}>
            Generate
          </Button>
        </Col>

      </Row>
    </TextCard>
  </Col>)


  const AddSumInsured = (
    <Row className="d-flex flex-wrap">
      {GenerateSumInsured}
      <Col md={6} lg={5} xl={4} sm={12}>
        <Controller
          as={<Input
            label="Add SI Amount"
            placeholder="Add Amount"
            type="tel"
            onKeyDown={numOnly} onKeyPress={noSpecial}
            maxLength={8}
          />}
          name={"si_amt"}
          control={control}
        />
        {!!(siAmt) &&
          <Error top='0' color={'blue'}>{toWords.convert(siAmt)}</Error>}
      </Col>
      <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
        <Button type="button" onClick={onAddSI}>
          <i className="ti ti-plus"></i> Add
        </Button>
      </Col>
      {!!siAmounts.length &&
        <>
          <Col md={12} lg={12} xl={12} sm={12}>
            <BenefitList>
              {(siAmounts).map((amount, index) =>
                <Chip
                  key={index + 'si-amount'}
                  id={amount}
                  name={`${amount}`}
                  onDelete={removeSIAmount} />)}
            </BenefitList>
          </Col>
          {FeatureDiv}
        </>
      }
    </Row>
  )

  return (
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          Product Features
        </h4>
      </Title>
      {AddSumInsured}
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      </form>
    </Wrapper>
  )
}
