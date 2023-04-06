import React from 'react';

import { Button, Typography, Marker, Head, Text } from "components";
import { Row, Col, Table } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Div } from '../../steps/premium-details/styles';
import { useSelector } from 'react-redux';

const cd_account_type = {
  1: 'Policy',
  2: 'Group',
  3: 'Entity',
}

const style = { zoom: '0.9', marginTop: '0px' }
const _level = [{ id: 1, name: 'Level 1' }, { id: 2, name: 'Level 2' }, { id: 3, name: 'Level 3' }]

export const ViewCDBalance = ({ myModule, policyData = {}, nextPage, userType }) => {

  const history = useHistory();
  const { currentUser } = useSelector(state => state.login);
  // role approve allowed || is Admin 
  const AllowedToApprove = (myModule.other || currentUser.ic_user_type_id === 1) /* && (new Date(policyData.end_date)?.setHours(0, 0, 0, 0) >= new Date()?.setHours(0, 0, 0, 0)) */;

  const goBack = () => {
    history.goBack();
  }

  const ContactStructure = (designation_name, contact_name, contact_email, contact_number, type, level) =>
  (<Row key={designation_name + 'contact-detail-' + type} className="d-flex flex-wrap">
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Designation</Head>
      <Text>{designation_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Name</Head>
      <Text>{contact_name || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Email Id</Head>
      <Text>{contact_email || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Mobile Number</Head>
      <Text>{contact_number || "-"}</Text>
    </Col>
    <Col md={6} lg={3} xl={3} sm={12} >
      <Head>Level</Head>
      <Text>{_level.find((item) => Number(item.id) === Number(level))?.name || "-"}</Text>
    </Col>
  </Row>)


  return (
    <>
      {!!(policyData.cd_value || policyData.cd_threshold_value
        || policyData.inception_premium || policyData.inception_premium_installment) &&
        <>
          <Row className="d-flex flex-wrap">
            {policyData.cd_account_type &&
              <Col md={12} lg={3} xl={3} sm={12} >
                <Head>CD Balance Type</Head>
                <Text>{cd_account_type[policyData.cd_account_type]} Wise</Text>
              </Col>}
            {!!policyData.cd_value && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Opening CD Balance</Head>
              <Text>{policyData.cd_value || "-"}</Text>
            </Col>}
            {!!policyData.cd_threshold_value && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>CD Balance Threshold</Head>
              <Text>{policyData.cd_threshold_value || "-"}</Text>
            </Col>}
            {!!policyData.inception_premium && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Inception Premium</Head>
              <Text>{policyData.inception_premium || "-"}</Text>
            </Col>}
            {!!policyData.inception_premium_installment && <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Inception Premium Installment</Head>
              <Text>{policyData.inception_premium_installment || "-"}</Text>
            </Col>}
          </Row>
          {!!policyData?.installment_amounts?.length &&
            <Div className="col p-0 col-xl-8 col-lg-10 col-md-12 col-sm-12 text-center" >
              <Table
                bordered
                className="text-center rounded text-nowrap"
                style={{ border: "solid 1px #e6e6e6" }}
                responsive>
                <thead>
                  <tr>
                    <th style={style} className="align-top">
                      Installment
                    </th>
                    <th style={style} className="align-top">
                      Installment Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {policyData.installment_amounts?.map((_, index) =>
                    <tr key={index + 'inception'}>
                      <td>
                        {index + 1} Installment
                      </td>
                      <td>
                        {_}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Div>}
        </>/*  :
        policyData.employer_childs?.map(({ company_name, cd_amount, cd_threshold, inception_premium, inception_premium_installment }, index) => !!(cd_amount || cd_threshold) && (
          <Fragment key={company_name + index}>
            <br />
            <Marker />
            <Typography>{'\u00A0'} {company_name}</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12} >
                <Head>Opening CD Balance</Head>
                <Text>{cd_amount || "-"}</Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12} >
                <Head>CD Balance Threshold</Head>
                <Text>{cd_threshold || "-"}</Text>
              </Col>
              {!!inception_premium && <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Inception Premium</Head>
                <Text>{inception_premium || "-"}</Text>
              </Col>}
              {!!inception_premium_installment && <Col md={6} lg={3} xl={3} sm={12} >
                <Head>Inception Premium Installment</Head>
                <Text>{inception_premium_installment || "-"}</Text>
              </Col>}
            </Row>
          </Fragment>
        )) */}

      <Marker />
      {/* abhi changes <Typography className='mb-3'>{'\u00A0'} Contact Details - Insurer Organization</Typography> */}
      <Typography className='mb-3'>{'\u00A0'} Contact Details - Broker Organization</Typography>
      {policyData.contact_details?.map(({ designation_name, contact_name, contact_email, contact_number, type, level }) =>
        (type * 1 !== 0) &&
        ContactStructure(designation_name, contact_name, contact_email, contact_number, 'broker', level)
      )}

      <Marker />
      <Typography className='mb-3'>{'\u00A0'} Contact Details - Employer Organization</Typography>
      {policyData.contact_details?.map(({ designation_name, contact_name, contact_email, contact_number, type, level }) =>
        (type * 1 === 0) &&
        ContactStructure(designation_name, contact_name, contact_email, contact_number, 'employer', level)
      )}

      {/* <Marker />
      <Typography className='mb-3'>{'\u00A0'} Contact Details - tpaCount Organization</Typography>
      {policyData.contact_details?.map(({ designation_name, contact_name, contact_email, contact_number, type }) =>
        (type * 1 === 2) &&
        ContactStructure(designation_name, contact_name, contact_email, contact_number, 'tpa')
      )}

      <Marker />
      <Typography className='mb-3'>{'\u00A0'} Contact Details - Insurer Organization</Typography>
      {policyData.contact_details?.map(({ designation_name, contact_name, contact_email, contact_number, type }) =>
        (type * 1 === 3) &&
        ContactStructure(designation_name, contact_name, contact_email, contact_number, 'insurer')
      )} */}

      <Row>
        <Col md={12} className="d-flex justify-content-end mt-4">
          {(nextPage &&
            ((AllowedToApprove &&
              (new Date(policyData.end_date)?.setHours(0, 0, 0, 0) >= new Date()?.setHours(0, 0, 0, 0)) &&
              ![1, 4].includes(policyData.policy_sub_type_id)) || [1, 4].includes(policyData.policy_sub_type_id)) &&
            userType !== "employer") ?
            <Button type="button" onClick={nextPage}>
              {[1, 4].includes(policyData.policy_sub_type_id) ? 'Next' : 'Approve'}
            </Button>
            :
            <Button type="button" onClick={goBack}>
              Go to Policy list
            </Button>}
        </Col>
      </Row>
    </>
  )
}
