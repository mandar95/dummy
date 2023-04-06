import React from 'react';

import { Head, Text } from "components";
import { Row, Col } from 'react-bootstrap';


export const ViewAddress = ({ Data }) => {

  const {
    address_line_1, address_line_2,
    country, state, city, pincode,
    address_line_3
  } = Data;

  return (
    <Row className="d-flex flex-wrap mt-4 text-left" >
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Address Line 1</Head>
        <Text>{address_line_1 || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Address Line 2</Head>
        <Text>{address_line_2 || "-"}</Text>
      </Col>
      {address_line_3 &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Address Line 3</Head>
          <Text>{address_line_3 || "-"}</Text>
        </Col>}
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Country</Head>
        <Text>{country || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>State</Head>
        <Text>{state || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>City</Head>
        <Text>{city || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Pincode</Head>
        <Text>{pincode || "-"}</Text>
      </Col>
    </Row>
  )
}
