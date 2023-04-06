import React from 'react';

import { Head, Text } from "components";
import { Row, Col } from 'react-bootstrap';
import { CardComponent, Color, Flex } from '../../Onboard/Select/style';

export const TFA_TYPES = ['', 'Email', 'SMS', 'SMS & Email']

export const ViewOrganization = ({ Data, themes, userType }) => {

  const {
    name, email_1, contact_1,
    email_2, email_3,
    contact_2, contact_3,
    branding, has_chatbot_service,
    PAN, GSTIN, theme_id, tfa_enabled, tfa_type,
    ip_checking
  } = Data;

  const currentTheme = themes?.find(({ id }) => theme_id === id);
  return (
    <Row className="d-flex flex-wrap mt-4 text-left" >
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Name</Head>
        <Text>{name || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Email</Head>
        <Text>{email_1 || "-"}</Text>
      </Col>
      <Col md={6} lg={4} xl={4} sm={12} >
        <Head>Mobile No</Head>
        <Text>{contact_1 || "-"}</Text>
      </Col>
      {!!email_2 &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Email(Optional 1)</Head>
          <Text>{email_2 || "-"}</Text>
        </Col>}
      {!!email_3 &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Email(Optional 2)</Head>
          <Text>{email_3 || "-"}</Text>
        </Col>}
      {!!contact_2 &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Mobile No (Optional 1)</Head>
          <Text>{contact_2 || "-"}</Text>
        </Col>}
      {!!contact_3 &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Mobile No (Optional 2)</Head>
          <Text>{contact_3 || "-"}</Text>
        </Col>}

      {!!PAN && <Col md={6} lg={4} xl={4} sm={12}>
        <Head>PAN No.</Head>
        <Text>{PAN}</Text>
      </Col>}

      {!!GSTIN && <Col md={6} lg={4} xl={4} sm={12}>
        <Head>GST No.</Head>
        <Text>{GSTIN}</Text>
      </Col>}



      {!!has_chatbot_service &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>Has Chat Bot Service</Head>
          <Text>{'Yes'}</Text>
        </Col>}

      {!!tfa_enabled &&
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>2 Factor Authentication for this {userType === 'broker' ? "Broker?" : "Employer & it's Employees"}</Head>
          <Text>Yes and its authorization medium {TFA_TYPES[tfa_type]}</Text>
        </Col>}

      {userType === 'broker' && <Col md={6} lg={4} xl={4} sm={12} >
        <Head>IP or Email Address WhiteListing</Head>
        <Text>{ip_checking ? 'Activated' : 'Deactivated'}</Text>
      </Col>}

      {!!branding && <Col xs={12} md={6} lg={4} xl={4} sm={12}>
        <Head>Logo</Head>
        <img width='150px' height='auto' src={branding} alt='logo' />
      </Col>}

      {!!theme_id && currentTheme && <Col md={6} lg={4} xl={4} sm={12}>
        <Head>Theme</Head>
        <CardComponent
          border={currentTheme}
          className='m-0'
        >
          <p>{currentTheme.name}</p>
          <Flex>
            <Color bgColor={currentTheme.data.Card.color} />
            <Color bgColor={currentTheme.data.CardBlue.color} />
            <Color bgColor={currentTheme.data.CardLine.color} />
            <Color bgColor={currentTheme.data.Tab.color} />
          </Flex>
          <Flex>
            <Color bgColor={currentTheme.data.Button.default.background} />
            <Color bgColor={currentTheme.data.Button.danger.background} />
            <Color bgColor={currentTheme.data.Button.outline.background} />
            <Color bgColor={currentTheme.data.Button.warning.background} />
          </Flex>
          <Flex>
            <Color
              bgColor={currentTheme.data.Button.outline_secondary.background}
            />
            <Color bgColor={currentTheme.data.Button.square_outline.background} />
            <Color bgColor={currentTheme.data.Button.outline_solid.background1} />
            <Color bgColor={currentTheme.data.Button.outline_solid.background2} />
          </Flex>
          <Flex>
            <Color bgColor={currentTheme.data.PrimaryColors.color1} />
            <Color bgColor={currentTheme.data.PrimaryColors.color2} />
            <Color bgColor={currentTheme.data.PrimaryColors.color3} />
            <Color bgColor={currentTheme.data.PrimaryColors.color4} />
          </Flex>
        </CardComponent>
      </Col>}
    </Row>
  )
}
