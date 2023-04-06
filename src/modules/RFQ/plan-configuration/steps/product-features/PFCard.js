import React, { useState } from 'react';

import { Card } from '../../../select-plan/style';
import { Vline, CardWrap, Content, StatusWrap } from '../../style';
import { EditModal } from './Modal';
import { Table, Col, Badge } from 'react-bootstrap';

// import { MaternityDependence } from '../../helper'
import swal from 'sweetalert';

export const PFCard = ({ feature, siAmounts, features,
  setFeatures, editable, master_product_features }) => {

  const [modal, setModal] = useState(false);

  const selectedFeature = features.find(({ product_feature_id }) => Number(product_feature_id) === feature.id) || {}

  const onEditHandle = () => {
    if (!isMaternityCovered(features, feature, master_product_features.find(({ is_maternity }) => Number(is_maternity) === 1) || {}))
      swal('Maternity Not Covered', 'First set premium for Maternity Cover', 'info')
    else setModal(true)
  }

  return (
    <>
      <Col xl={12} lg={12} md={12} sm={12} className='pr-3 pb-3'>
        <Card borderRadius='10px' minHeight boxShadow='1px 1px 14px 5px rgb(142 142 142 / 10%)'>
          <Vline active={selectedFeature?.additional?.length} />
          <CardWrap>
            <div className='header'>
              <h2>{feature.name}</h2>
              {editable && <div className='icon'>
                <i className="ti-pencil" onClick={onEditHandle}></i>
              </div>}
            </div>
            <Table striped={false} responsive>
              <thead>
                <tr>
                  {/* {!ExcludeSumIns.includes(feature.id) && <> */}
                  {feature.include_multiple_si === 1 && <>
                    <th>Deductible From (SI)</th>
                    <th>Sum Insured</th>
                  </>}
                  {feature.product_feature_type_id === 2 && <>
                    <th>Duration</th>
                    <th>Duration Type</th>
                  </>}
                  {feature.product_feature_type_id === 3 &&
                    <th>Name</th>
                  }
                  {feature.product_feature_type_id === 5 &&
                    <th>Is Covered</th>
                  }
                  <th>Premium</th>
                  <th>Premium Type</th>
                </tr>
              </thead>
              <tbody>
                {(selectedFeature?.additional?.length ? selectedFeature?.additional : [{ deductible_from: siAmounts[0] }]).map(({
                  sum_insured, name, premium, duration_unit, duration_value,
                  wavier, sum_insured_type, deductible_from, duration_type, premium_type, premium_by }, index) =>
                  <tr key={index + 'sum-pre'}>
                    {/* {!ExcludeSumIns.includes(feature.id) && <> */}
                    {feature.include_multiple_si === 1 && <>
                      <td>{deductible_from}</td>
                      <td>{(!!sum_insured && `${sum_insured} ${Number(sum_insured_type) === 2 ? '%' : '₹'}`) || 'Not Covered'}</td>
                    </>}
                    {feature.product_feature_type_id === 2 && <>
                      <td>{(!!duration_value &&
                        `${duration_value} ${DurationType(duration_unit, duration_value)}`)
                        || 'No Duration'}</td>
                      <td>{duration_type || '-'}</td>
                    </>}
                    {feature.product_feature_type_id === 3 &&
                      <td>{(name) || 'No Name'}</td>
                    }
                    {feature.product_feature_type_id === 5 &&
                      <td>{(!!Number(wavier)) ? 'Covered' : 'Not Covered'}</td>
                    }
                    <td>{(((!!premium || Number(premium) === 0) &&
                      (Number(premium) ? `${premium} ${premium_by === '2' ? '%' : '₹'}` : 'No Premium')))
                      || 'Not Covered'}</td>
                    <td>{(((!!premium || Number(premium) === 0) &&
                      (Number(premium_type) === 2 ? 'Discount' : 'Loading')))
                      || 'Not Covered'}</td>
                  </tr>
                )}

                {/* {feature.product_feature_type_id === 3 && selectedFeature?.additional?.map(({
                sum_insured, name, premium, sum_insured_type, deductible_from }, index) =>
                siAmounts.length <= index ? (<tr key={index + 'sum-pre'}>
                  <td>{deductible_from}</td>
                  <td>{(!!sum_insured && `${sum_insured} ${Number(sum_insured_type) === 2 ? '%' : '₹'}`) || 'Not Covered'}</td>
                  <td>{name || 'No Name'}</td>
                  <td>{(!!premium && `${premium} ₹`) || 'Not Covered'}</td>
                </tr>) : null
              )} */}
              </tbody>
            </Table>
          </CardWrap>
          <StatusWrap>
            Status : <Badge
              size="sm"
              variant={!!selectedFeature.is_mandantory ? 'danger' : 'secondary'}>
              {!!selectedFeature.is_mandantory ? 'Mandatory' : 'Non-Mandatory'}
            </Badge>
          </StatusWrap>
          {!!(selectedFeature.content || feature.content) && <Content>
            {selectedFeature.content || feature.content}
          </Content>}
        </Card>
      </Col>
      {!!modal && <EditModal
        show={!!modal}
        onHide={setModal}
        feature={feature}
        siAmounts={siAmounts}
        Data={selectedFeature}
        setFeatures={setFeatures} />}
    </>
  )
}

const DurationType = (duration_unit, duration_value) => {
  const DurationValueIs1 = Number(duration_value) === 1
  switch (Number(duration_unit)) {
    case 1: return DurationValueIs1 ? 'Day' : 'Days'

    case 2: return DurationValueIs1 ? 'Month' : 'Months'

    case 3: return DurationValueIs1 ? 'Year' : 'Years'

    default: return ''
  }

}

const isMaternityCovered = (allFeatures, feature, maternity_object) => {
  const MaternityCover = allFeatures.find(({ product_feature_id }) => Number(product_feature_id) === maternity_object.id) || {}
  // if (MaternityDependence.includes(feature.id)) {
  if (feature.maternity_dependant === 1) {
    return MaternityCover?.additional?.length && Number(MaternityCover?.additional[0].wavier)
  } else {
    return true
  }
}
