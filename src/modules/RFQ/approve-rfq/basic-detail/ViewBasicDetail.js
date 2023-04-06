import React from 'react';

import { Button, Head, Text, Marker, Typography } from "components";
import { Row, Col } from 'react-bootstrap';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Title } from '../../select-plan/style';


export const ViewBasicDetail = ({ rfqData = {}, nextPage }) => {

  return (
    <>
      <Row className="d-flex flex-wrap" >
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Plan Name</Head>
          <Text>{rfqData.name || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Policy Type</Head>
          <Text>{rfqData.policy_type || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Policy Sub Type</Head>
          <Text>{rfqData.policy_sub_type || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Min Employee Live</Head>
          <Text>{rfqData.min_no_of_employee ?? "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Max Employee Live</Head>
          <Text>{rfqData.max_no_of_employee ?? "-"}</Text>
        </Col>
        {/* <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Corporate Buffer %</Head>
          <Text>{rfqData.co_operate_buffer ?? "-"}</Text>
        </Col> */}
        {/* <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Co-Pay %</Head>
          <Text>{rfqData.co_pay_percentage ?? "-"}</Text>
        </Col> */}
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Max Discount %</Head>
          <Text>{rfqData.max_discount ?? "-"}</Text>
        </Col>
        {rfqData.insurer_name && <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Insurer Name</Head>
          <Text>{rfqData.insurer_name ?? "-"}</Text>
        </Col>}
        {rfqData.logo && <Col className='mb-5' md={6} lg={3} xl={3} sm={12} >
          <Head>Insurer Logo</Head>
          <Button style={{ whiteSpace: 'break-spaces' }} buttonStyle="outline" onClick={() => window.open(rfqData.logo)}>
            {rfqData.insurer_name} logo <i className="ti-download" />
          </Button>
        </Col>}
      </Row>
      <Row>
        {!!(rfqData.can_view_plan_for_renewal || rfqData.allow_payment_for_renewal) && <Col md={12} lg={12} xl={4} sm={12}>
          <TextCard className="pl-3 pr-3 mb-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#efefef">
            <Marker />
            <Typography>{'\u00A0'} If Renewal journey choosen</Typography>
            <br />
            {!!rfqData.can_view_plan_for_renewal && <Title fontSize="0.9rem" color='#4da2ff'>
              <i className='ti-arrow-circle-right mr-2' />Customer will be able to view plans
            </Title>}
            <br />
            {!!rfqData.allow_payment_for_renewal && <Title fontSize="0.9rem" color='#4da2ff'>
              <i className='ti-arrow-circle-right mr-2' />Customer will be allowed for payment
            </Title>}
          </TextCard>
        </Col>}

      </Row>


      <Row>
        <Col md={12} lg={12} xl={12} sm={12} >
          <Head>Plan Description</Head>
          <Text>{rfqData.plan_description ?? "-"}</Text>
        </Col>
      </Row>

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="button" onClick={nextPage}>
            Next
          </Button>
        </Col>
      </Row>
    </>
  )
}
