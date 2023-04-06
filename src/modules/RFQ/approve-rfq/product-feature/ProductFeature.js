import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { Row, Col } from 'react-bootstrap';
import { CardBlue, Button, Chip, Input } from "components";
import { BenefitList } from 'modules/policies/steps/additional-details/styles.js';

import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { updateRfq } from '../../rfq.slice'
import { PFCard } from '../../plan-configuration/steps/product-features/PFCard';
import { numOnly, noSpecial } from 'utils';

export const ProductFeature = ({ options, nextPage, ic_plan_id, ic_id, broker_id }) => {

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { rfqData, success } = useSelector(state => state.rfq);
  const [siAmounts, setSIAmounts] = useState([]);
  const [features, setFeatures] = useState([]);

  const { handleSubmit, control, watch, setValue } = useForm();

  const siAmt = watch('si_amt')

  useEffect(() => {
    if (success) {
      setShow(false)
    }

  }, [success])

  useEffect(() => {
    if (rfqData.sum_insureds?.length) {
      setSIAmounts(rfqData?.sum_insureds)
      setFeatures(rfqData?.product_feature)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfqData])

  useEffect(() => {
    if (!show) {
      setSIAmounts(rfqData?.sum_insureds)
      setFeatures(rfqData?.product_feature)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])



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
  const onSubmit = data => {
    if (!siAmounts?.length) {
      return swal('Validation', 'Atleast 1 SumInsured Required', 'info')
    }
    if (!features?.length) {
      return swal('Validation', 'Atleast 1 Product Feature Required', 'info')
    }

    dispatch(updateRfq({
      features: features.filter((elem) => (elem.additional?.length))
        // .map((elem) => ({
        //   ...elem,
        //   additional: elem.additional.filter(({ premium }) => premium)
        // }))
        .map((elem) => _.pickBy({
          ...elem,
          additional: elem.additional.map((elem1) => _.pickBy({ ...elem1, ...(elem1.premium && { premium_by: elem1.premium_by || 1 }) })),
          is_mandantory: !!elem.is_mandantory ? '1' : '0'
        }, _.identity)),
      step: 4,
      ic_plan_id,
    }, { ic_id, ic_plan_id, broker_id }))


  };


  const FeatureDiv = (
    <Col md={12} lg={12} xl={12} sm={12}>
      {options?.master_product_features?.map((feature) => <PFCard
        key={feature.id + 'feat'}
        feature={feature}
        siAmounts={siAmounts}
        master_product_features={options?.master_product_features}
        features={features}
        setFeatures={setFeatures}
        editable={show}
      />)}
    </Col>
  )

  const AddSumInsured = (
    <Row className="d-flex flex-wrap">
      {show && <>
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
        </Col>
        <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
          <Button type="button" onClick={onAddSI}>
            <i className="ti ti-plus"></i> Add
          </Button>
        </Col>
      </>}
      {!!siAmounts.length &&
        <>
          {show &&
            <Col md={12} lg={12} xl={12} sm={12}>
              <BenefitList>
                {(siAmounts).map(amount =>
                  <Chip
                    key={'si-am' + amount}
                    id={amount}
                    name={`${amount}`}
                    onDelete={removeSIAmount} />)}
              </BenefitList>
            </Col>}
          {FeatureDiv}
        </>}
    </Row>
  )


  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>Product Features</span>
        <div>
          {show ?
            <Button type="button" onClick={() => { setShow(false) }} buttonStyle="outline-secondary">
              Cancel
            </Button>
            : <Button type="button" onClick={() => { setShow(true) }} buttonStyle="outline-secondary">
              Edit <i className="ti-pencil" />
            </Button>
          }
        </div>
      </div>
    }>
      {AddSumInsured}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row >
          <Col md={12} className="d-flex justify-content-end mt-4">
            {show ?
              <Button type="submit">
                Update
              </Button> :
              <Button type="button" onClick={nextPage}>
                Next
              </Button>}
          </Col>
        </Row>
      </form>
    </CardBlue>
  )
}
