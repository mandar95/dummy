import React from 'react';

import { Row, Col } from 'react-bootstrap';
import { BucketCard } from '../../plan-configuration/style';
import { RiskBucket } from '../../plan-configuration/steps/RiskBucket';
import { Head, Text, Button } from 'components'

export const ViewBucket = ({ options, rfqData, nextPage }) => {

  const activeBuckets = []

  options.forEach(({ bucket_name, industry_list, id }) => {
    (rfqData.risk_buckets || []).forEach(({ risk_bucket_id, risk_percentage }) => {
      if (id === risk_bucket_id) {
        activeBuckets.push({
          bucket_name: bucket_name,
          industry_list: industry_list,
          risk_bucket: risk_percentage
        })
      }
    })
  })

  return (
    <>
      <Row>
        {activeBuckets.length ?
          activeBuckets.map(({ bucket_name, id, industry_list, risk_bucket }, index) => {

            return (
              <Col xl={nextPage ? 4 : 6} lg={nextPage ? 5 : 12} md={6} sm={12} key={bucket_name + index}>
                <BucketCard>
                  <h3>{bucket_name}</h3>
                  <RiskBucket industry_list={industry_list} />
                  <Head className='text-center'>Risk Bucket %</Head>
                  <Text className='text-center pb-4'>{risk_bucket}</Text>
                </BucketCard>
              </Col>
            )
          }) :
          <Col xl={12} lg={12} md={12} sm={12}>
            <h1 className='display-4 text-center'>No Industry Bucket Selected</h1>
          </Col>
        }
      </Row>
      {nextPage &&
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="button" onClick={nextPage}>
              Next
            </Button>
          </Col>
        </Row>}
    </>
  )
}
