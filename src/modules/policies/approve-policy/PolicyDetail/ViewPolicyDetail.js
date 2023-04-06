import React from 'react';

import { Button, Head, Text, Marker, Typography } from "components";
import { Row, Col, Table } from 'react-bootstrap';
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { DateFormate } from '../../../../utils';
import { IsIciciTPA } from '../../steps/basic-details';
import { TableDiv } from '../../steps/premium-details/styles';
import { EmployeeEligibleOptions, ShowInEmployeeTab } from '../../helper';
import { ModuleControl } from '../../../../config/module-control';

const style = { zoom: '0.9' }

// const getUnit = (id) => {
//   switch (id) {
//     case 1:
//       return "Days";
//     case 2:
//       return "Month";
//     case 3:
//       return "Year";
//     default: return "Days"
//   }
// }

// const getAddLockInType = (id) => {
//   switch (id) {
//     case 0:
//       return "Member date of joining";
//     case 1:
//       return "Policy start date";
//     default: return "Member date of joining"
//   }
// }

// const getRemoveLockInType = (id) => {
//   switch (id) {
//     case 0:
//       return "Member date of removal";
//     case 1:
//       return "Policy end date";
//     default: return "Member date of removal"
//   }
// }

const TopUpSetup = [
  'Non-Mandatory',
  'Mandatory',
  'Optional',
  'Optional-Mandatory'
]

const EnrolmentType = [
  'Date of Joining',
  'Date of Upload',
  'No Mid Term Enrolment'
]

export const ViewPolicyDetail = (props) => {

  const { policyData, nextPage, userType, options } = props;


  return (
    <>
      <Marker />
      <Typography>{'\u00A0'} Basic Details</Typography>
      <br />
      <br />
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy No</Head>
          <Text>{policyData.policy_number || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy Name</Head>
          <Text>{policyData.policy_name || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy Type</Head>
          <Text>{policyData.policy_type || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy Subtype</Head>
          <Text>{policyData.policy_sub_type || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Insurer</Head>
          <Text>{policyData.insurer || "-"}</Text>
        </Col>
        {!!policyData.tpa && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>TPA</Head>
          <Text>{policyData.tpa || "-"}</Text>
        </Col>}
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy Start Date</Head>
          <Text>{DateFormate(policyData.start_date) || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Policy End Date</Head>
          <Text>{DateFormate(policyData.end_date) || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Employee Tab View</Head>
          <Text>{ShowInEmployeeTab[policyData.display_in_benefit_summary || 0].name}</Text>
        </Col>
        {userType !== 'employer' && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Broker %</Head>
          <Text>{String(policyData.broker_commision || '0') || "-"}</Text>
        </Col>}
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Corporate Buffer ₹</Head>
          <Text>{String(policyData.co_operate_buffer || '0') || "-"}</Text>
        </Col>

        {!!policyData.tpa_id && IsIciciTPA(policyData.tpa_id, options?.tpa) && <>
          {!!policyData.icici_imid_number && <Col md={6} lg={3} xl={3} sm={12}>
            <Head>IM ID</Head>
            <Text>{policyData.icici_imid_number || "-"}</Text>
          </Col>}
          {!!policyData.icici_cdbg_number && <Col md={6} lg={3} xl={3} sm={12}>
            <Head>CDBG Number</Head>
            <Text>{policyData.icici_cdbg_number || "-"}</Text>
          </Col>}
          {!!policyData.icici_customer_id && <Col md={6} lg={3} xl={3} sm={12}>
            <Head>Customer ID</Head>
            <Text>{policyData.icici_customer_id || "-"}</Text>
          </Col>}
        </>}
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>GST Applicable</Head>
          <Text>{(policyData.show_gst_flag === 1 ? 'Yes' : 'No')}</Text>
        </Col>
        {ModuleControl.CustomRelease/* Base + Topup */ &&
          policyData.policy_type_id === 2 &&
          <Col md={6} lg={3} xl={3} sm={12}>
            <Head>Sum with Base Policy</Head>
            <Text>{(policyData.sum_with_base_policy === 1 ? 'Yes' : 'No')}</Text>
          </Col>}

        {ModuleControl.inDevelopment/* CoInsurer */ && !!policyData.coinsurer?.length && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Co-Insurer</Head>
          {policyData?.coinsurer?.map(({ co_insurer_name, co_insurer_percentage }, index) => (
            <button key={'coinsurer' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
              {co_insurer_name}:{co_insurer_percentage}%
            </button>
          ))}
        </Col>}

      </Row>
      {!!policyData.description && <Row>
        <Col md={12} lg={12} xl={12} sm={12} >
          <Head>Policy Description</Head>
          <Text style={{ whiteSpace: 'pre-line' }}>{policyData.description ?? "-"}</Text>
        </Col>
      </Row>}
      <br />
      <Marker />
      <Typography>{'\u00A0'} Company Details</Typography>
      <br />
      <br />
      <Row>
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Company Name</Head>
          <Text>{policyData.employer || "-"}</Text>
        </Col>
        {!!policyData.broker_branch_name && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Branch Name</Head>
          <Text>{policyData.broker_branch_name || "-"}</Text>
        </Col>}

        {!!policyData?.topup_master_policy_names?.length &&
          <>
            <Col xl={12} lg={12} md={12} sm={12}></Col>
            <TableDiv className='col col-xl-8 col-lg-10 col-md-12 col-sm-12'>
              <Table
                className="text-center rounded text-nowrap"
                style={{ border: "solid 1px #e6e6e6" }}
                responsive
              >
                <thead>
                  <tr>
                    <th style={style} className="align-top">
                      Master Group Policy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {policyData?.topup_master_policy_names.map((policy_name, index) => <tr key={index + 'top_base'}>
                    <td className="">
                      {policy_name}
                    </td>
                  </tr>
                  )}
                </tbody>
              </Table>
            </TableDiv>
            <Col xl={12} lg={12} md={12} sm={12}></Col>
          </>}

        {!!policyData?.topup_master_policy_name &&
          false &&
          <Col md={6} lg={3} xl={3} sm={12}>
            <Head>Master Group Policy No</Head>
            <Text>{policyData.topup_master_policy_name || "-"}</Text>
          </Col>}

        {!!policyData?.employer_childs?.length && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Sub Entities</Head>
          <Text>{policyData?.employer_childs?.map(({ company_name }, index) => (
            <button key={'sum' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg">
              {company_name || "-"}
            </button>
          ))}</Text>
        </Col>}

        {!!(policyData.employer_verification_needed || policyData.broker_verification_needed) && <Col md={12} lg={12} xl={4} sm={12}>
          <TextCard className="pl-3 pr-3 mb-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#efefef">
            {!!policyData.broker_verification_needed && <Title fontSize="0.9rem" color='#4da2ff'>
              Broker will verify all Enrolment and Endorsement
            </Title>}
            {!!policyData.employer_verification_needed && <Title fontSize="0.9rem" color='#4da2ff'>
              Employer will verify all Enrolment and Endorsement
            </Title>}
          </TextCard>
        </Col>}

        {!!(policyData?.policy_type_id === 2) && <Col md={12} lg={12} xl={4} sm={12}>
          <TextCard className="pl-3 pr-3 mb-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#efefef">
            <Marker />
            <Typography>
              {"\u00A0"} Topup Setup{" "} : {TopUpSetup[Number(policyData?.topup_compulsion_flag || 0)]}
            </Typography>
            {policyData?.topup_compulsion_flag === 3 && <>
              <br />
              <Typography className='ml-3'>
                {"\u00A0"} Employee Eligible{" "} : {EmployeeEligibleOptions.find(({ id }) => id === (+policyData?.employee_eligibility || 0))?.name}
              </Typography>
              <br />
              {!!policyData?.top_up_policy_ids?.length && <Typography className='ml-3'>
                {"\u00A0"} Mandatory If Not Selected Topup Policies{" "} : {policyData?.top_up_policy_ids.map(({ label }) =>
                  <button key={label} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {label}
                  </button>)}
              </Typography>}

            </>}
          </TextCard>
        </Col>}

      </Row>

      <br />
      <Marker />
      <Typography>{'\u00A0'} Enrolment Details</Typography>
      <br />
      <br />
      <Row>
        {!!policyData.enrollement_status &&
          <>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Enrolment Start Date</Head>
              <Text>{DateFormate(policyData.enrollement_start_date) || "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Enrolment End Date</Head>
              <Text>{DateFormate(policyData.enrollement_end_date) || "-"}</Text>
            </Col>
          </>}
        {policyData.enrollment_window_close_mail_effective_date && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Close Mail Effective Date</Head>
          <Text>{DateFormate(policyData.enrollment_window_close_mail_effective_date) || "-"}</Text>
        </Col>}
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Enrolment Considered From (Mid Term)</Head>
          <Text>{(policyData.enrollement_type && EnrolmentType[policyData.enrollement_type - 1]) || "-"}</Text>
        </Col>
        {policyData.enrollement_type !== 3 && <Col md={6} lg={3} xl={3} sm={12}>
          <Head>Enrolment Allowed Days (Mid Term)</Head>
          <Text>{policyData.enrollement_days || "0"}</Text>
        </Col>}
      </Row>
      {/* {
        !!policyData?.has_lock_in &&
        <>
          <br />
          <Marker />
          <Typography>{'\u00A0'} Lock-In Details</Typography>
          <br />
          <br />
          <Row>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Member addition lock in time</Head>
              <Text>
                {`${policyData?.member_addition_lock_in} ${getUnit(policyData?.member_addition_lock_in_unit)}` || "-"}

              </Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Member removal lock in time</Head>
              <Text>
                {`${policyData?.member_removal_lock_in} ${getUnit(policyData?.member_removal_lock_in_unit)}` || "-"}
              </Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Member addition lock in type</Head>
              <Text>
                {`${getAddLockInType(policyData?.member_addition_lock_in_type)}` || "-"}

              </Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>Member removal lock in type</Head>
              <Text>
                {`${getRemoveLockInType(policyData?.member_removal_lock_in_type)}` || "-"}
              </Text>
            </Col>
          </Row >
        </>
      }
      {
        !!policyData?.has_suminsured_lock_in &&
        <>
          <br />
          <Marker />
          <Typography>{'\u00A0'} SI Lock-In Details</Typography>
          <br />
          <br />
          <Row>
            <Col md={6} lg={3} xl={3} sm={12}>
              <Head>SI lock in time</Head>
              <Text>
                {`${policyData?.suminsured_lock_in} ${getUnit(policyData?.suminsured_lock_in_unit)}` || "-"}
              </Text>
            </Col>
          </Row>
        </>
      } */}
      {!!policyData.is_flex_policy && <>
        <br />
        <Marker />
        <Typography>{'\u00A0'} Flexible Benefits</Typography>
        <br />
        <br />
        <Row>
          <Col md={6} lg={3} xl={3} sm={12}>
            <Head>Will this policy be as an add on flexible benefit?</Head>
            <Text>Yes</Text>
          </Col>
        </Row>
      </>}


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
