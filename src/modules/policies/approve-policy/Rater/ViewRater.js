import React from 'react';

import { Button, Typography, Marker, Head, Text } from "components";
import { Row, Col } from 'react-bootstrap';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Title } from "../../../RFQ/select-plan/style";

import { downloadFile } from 'utils';
import { ViewPlan } from '../../steps/additional-details/additional-cover';
import swal from 'sweetalert';

const BenefitType = {
  1: 'Simple',
  2: 'Plan Wise',
  3: 'Package Wise',
  4: 'Swap Wise'
}

const TaxType = (type, value) => {
  return type ? '(Tax Excluded-' + value + '%)' : ('Tax Included')
}

export const ViewRater = ({ policyData, nextPage, options, SalaryType }) => {

  const isNoRule = policyData.sum_insured_sub_type !== 16 && policyData.premium_type_id !== 18
  const is_opd_ipd = policyData.policy_rater_type_id === 3;
  const is_enhance = policyData.policy_rater_type_id === 5;
  const only_opd = policyData.policy_rater_type_id === 2;
  const BaseWiseSIPremium = policyData.sum_insured_sub_type_id === 8;
  const eligiblePolicy = [5, 6].includes(Number(policyData.policy_sub_type_id)) &&
    policyData.premium_type_id && policyData.sum_insured_sub_type_id === 1;

  const FileDownload = (request_file) => {
    if (request_file && (typeof request_file !== "number"))
      downloadFile(request_file);
    else {
      swal('Alert', 'File Not Found', 'warning');
    }
  }


  return (
    <>
      <Row className="d-flex flex-wrap" >
        {policyData.policy_sub_type_id === 1 &&
          <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Cover Type</Head>
            <Text>{policyData.policy_rater_type_name}</Text>
          </Col>
        }
        {policyData.base_ipd_policy_name && policyData.policy_rater_type_id === 2 &&
          <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Parent IPD Policy</Head>
            <Text>{policyData.base_ipd_policy_name || "-"}</Text>
          </Col>}
        {policyData.parent_base_policy_name &&
          <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Parents Base Policy</Head>
            <Text>{policyData.parent_base_policy_name || "-"}</Text>
          </Col>}
      </Row>

      {is_opd_ipd && <>
        <Marker />
        <Typography>{'\u00A0'}IPD</Typography>
      </>}
      {!only_opd &&
        <><Row className="d-flex flex-wrap">
          <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Sum Insured Type</Head>
            <Text>{policyData.sum_insured_type || "-"}</Text>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} >
            <Head>SI Basis</Head>
            <Text>{policyData.sum_insured_sub_type || "-"}</Text>
          </Col>
          {(policyData.calculate_eligibility_from && policyData.sum_insured_sub_type_id === 5) && <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Calculate Salary from</Head>
            <Text>{SalaryType.find(({ value }) => value === policyData.calculate_eligibility_from)?.name || "Salary Type 1"}</Text>
          </Col>}
          {!BaseWiseSIPremium && <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Premium Basis Type</Head>
            <Text>{policyData.premium || "-"}</Text>
          </Col>}
        </Row>

          {policyData.sum_insured_type_id === 3 &&
            <Row className="d-flex flex-wrap">
              {(Array.isArray(policyData?.in_sum_insureds) && policyData.sum_insured_sub_type_id === 1 && !policyData?.in_suminsured_file) ?
                <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                  <Head>SI Basis Amounts  (Individual)</Head>
                  {policyData?.in_sum_insureds?.map(({ sum_insured }, index) => (
                    <button key={'sum' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                      {sum_insured}
                    </button>
                  ))}
                </Col>
                : /* (policyData.sum_insured_sub_type_id === 5 && policyData?.in_salary.length !== 0) ?
                  <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                    <Head>Salary Basis Amounts</Head>
                    {policyData?.salary.map(({ no_of_times_of_salary, max_si_limit, min_si_limit }, index) => (
                      <button key={'prem-basis' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                        {no_of_times_of_salary} {(min_si_limit && min_si_limit !== 0) ?
                          <>{' : ' + String(min_si_limit)}<sub>(min)</sub></> : ""} {(max_si_limit && max_si_limit !== 4294967295) ?
                            <>{' : ' + String(max_si_limit)}<sub>(max)</sub></> : ""}
                      </button>
                    ))}
                  </Col>
                  : */
                isNoRule ?
                  !!policyData.in_suminsured_file && <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                    <Head>Sum Insured File (Individual)</Head>
                    <Button buttonStyle="outline" onClick={() => FileDownload(policyData.in_suminsured_file)}>
                      SI Basis File <i className="ti-download" />
                    </Button>
                    <br />
                    {policyData?.in_sum_insureds?.map(({ sum_insured }, index) => (
                      <button key={'sum' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                        {sum_insured}
                      </button>
                    ))}
                  </Col> : <></>

              }
              {!BaseWiseSIPremium && ((Array.isArray(policyData?.in_premiums)) ?
                <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                  <Head>Premium Basis Amounts (Individual)</Head>
                  {policyData?.in_premiums.map(({ amount, tax, total_premium }, index) => (
                    <button key={'prem-basis' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                      {amount} : {tax}<sub>(tax%)</sub> : {total_premium}<sub>(total)</sub>
                    </button>
                  ))}
                </Col>
                :
                isNoRule ?
                  !!policyData.in_premium_file && <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                    <Head>Premium File (Individual) {TaxType(policyData?.premium_tax_type, policyData?.premium_tax)}</Head>
                    <Button buttonStyle="outline" onClick={() => FileDownload(policyData.in_premium_file)}>
                      Premium Basis File <i className="ti-download" />
                    </Button>
                  </Col> : <></>

              )}
            </Row>}

          <Row className="d-flex flex-wrap">
            {(Array.isArray(policyData?.sum_insureds) && policyData.sum_insured_sub_type_id === 1 && !policyData?.suminusred_file) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>SI Basis Amounts {policyData.sum_insured_type_id === 3 && '(Floater)'}</Head>
                {policyData?.sum_insureds?.map(({ sum_insured }, index) => (
                  <button key={'sum' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {sum_insured}
                  </button>
                ))}
              </Col>
              : (policyData.sum_insured_sub_type_id === 5 && policyData?.salary.length !== 0) ?
                <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                  <Head>Salary Basis Amounts</Head>
                  {policyData?.salary.map(({ no_of_times_of_salary, max_si_limit, min_si_limit }, index) => (
                    <button key={'prem-basis' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                      {no_of_times_of_salary} {(min_si_limit && min_si_limit !== 0) ?
                        <>{' : ' + String(min_si_limit)}<sub>(min)</sub></> : ""} {(max_si_limit && max_si_limit !== 4294967295) ?
                          <>{' : ' + String(max_si_limit)}<sub>(max)</sub></> : ""}
                    </button>
                  ))}
                </Col>
                :
                isNoRule ?
                  !!policyData.suminusred_file && <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                    <Head>Sum Insured File {policyData.sum_insured_type_id === 3 && '(Floater)'}</Head>
                    <Button buttonStyle="outline" onClick={() => FileDownload(policyData.suminusred_file)}>
                      SI Basis File <i className="ti-download" />
                    </Button>
                    <br />
                    {policyData?.sum_insureds?.map(({ sum_insured }, index) => (
                      <button key={'sum' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                        {sum_insured}
                      </button>
                    ))}
                  </Col> : <></>

            }
            {!BaseWiseSIPremium && ((Array.isArray(policyData?.premiums)) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>Premium Basis Amounts {policyData.sum_insured_type_id === 3 && '(Floater)'}</Head>
                {policyData?.premiums.map(({ amount, tax, total_premium }, index) => (
                  <button key={'prem-basis' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {amount} : {tax}<sub>(tax%)</sub> : {total_premium}<sub>(total)</sub>
                  </button>
                ))}
              </Col>
              :
              isNoRule ?
                !!policyData.premium_file && <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                  <Head>Premium File {policyData.sum_insured_type_id === 3 && '(Floater)'} {TaxType(policyData?.premium_tax_type, policyData?.premium_tax)}</Head>
                  <Button buttonStyle="outline" onClick={() => FileDownload(policyData.premium_file)}>
                    Premium Basis File <i className="ti-download" />
                  </Button>
                </Col> : <></>

            )}
          </Row>
          <Row>
            <Col md={12} lg={12} xl={12} sm={12}>
              {/* Eligibility */}
              {eligiblePolicy && <TextCard className="p-3 mb-4" noShadow bgColor="#f8f8f8">
                <Marker />
                <Typography>
                  {"\u00A0"} Eligibility Policy{" "}
                </Typography>
                <br />
                <Title fontSize="0.9rem" color="#4da2ff">
                  <i className="ti-arrow-circle-right mr-2" />
                  Eligibilty Allowed: {" "}
                  {policyData.top_up_cover_has_eligibility === 1 ? 'Yes' : 'No'}
                </Title>
                <br />
                {policyData.top_up_cover_has_eligibility === 1 && !!policyData?.eligibility_cover_type &&
                  <>
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Eligibilty Type: {" "}
                      {policyData.eligibility_cover_type === 1 && 'Greater Than'}
                      {policyData.eligibility_cover_type === 2 && 'Less Than'}
                      {policyData.eligibility_cover_type === 3 && 'Equal'}
                    </Title>
                    <br />
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      No of time salary: {" "}
                      {policyData.no_of_time_salary || '1'}
                    </Title>
                    <br />
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Salary Calculate From: {" "}
                      {SalaryType.find(({ value }) => value === policyData.calculate_eligibility_from)?.name || "Salary Type 1"}
                    </Title>
                  </>}
              </TextCard>}
            </Col>
          </Row>
        </>
      }
      {
        (is_opd_ipd || only_opd) && <>
          {is_opd_ipd && <>
            <Marker />
            <Typography>{'\u00A0'}OPD</Typography>
          </>}
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Sum Insured Type</Head>
              <Text>{policyData.opd_suminsured_type || "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>SI Basis</Head>
              <Text>{policyData.opd_suminsured_sub_type || "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Premium Basis Type</Head>
              <Text>{policyData.opd_premium_type || "-"}</Text>
            </Col>
          </Row>

          <Row className="d-flex flex-wrap">

            {(Array.isArray(policyData?.opd_suminsureds) && policyData?.opd_suminsured_sub_type_id === 1) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>{'SI Basis Amounts'}</Head>
                {policyData?.opd_suminsureds?.map(({ sum_insured }, index) => (
                  <button key={'sum-opd' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {sum_insured}
                  </button>
                ))}
              </Col>
              :
              <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                <Head>Sum Insured File</Head>
                <Button buttonStyle="outline" onClick={() => FileDownload(policyData.opd_si_file)}>
                  SI Basis OPD File <i className="ti-download" />
                </Button>
              </Col>}
            {(Array.isArray(policyData?.opd_premiums)) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>{'Premium Basis Amounts'}</Head>
                {policyData?.opd_premiums.map(({ amount, tax, total_premium }, index) => (
                  <button key={'prem-opd' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {amount} : {tax}<sub>tax%</sub> : {total_premium}<sub>total</sub>
                  </button>
                ))}
              </Col>
              :
              <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                <Head>Premium File {TaxType(policyData?.premium_tax_type_opd, policyData?.premium_tax_opd)}</Head>
                <Button buttonStyle="outline" onClick={() => FileDownload(policyData.opd_premium_file)}>
                  Premium Basis OPD File <i className="ti-download" />
                </Button>
              </Col>}
          </Row>
        </>
      }

      {
        (is_enhance) && <>
          <Marker />
          <Typography>{'\u00A0'}Enhance</Typography>
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Sum Insured Type</Head>
              <Text>{policyData.enhance_suminsured_type_name || "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>SI Basis</Head>
              <Text>{policyData.enhance_suminsured_sub_type_name || "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Premium Basis Type</Head>
              <Text>{policyData.enhance_premium_type_name || "-"}</Text>
            </Col>
          </Row>

          <Row className="d-flex flex-wrap">

            {(Array.isArray(policyData?.enhance_suminsureds) && policyData?.enhance_suminsured_sub_type_id === 1) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>{'SI Basis Amounts'}</Head>
                {policyData?.enhance_suminsureds?.map(({ sum_insured }, index) => (
                  <button key={'sum-opd' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {sum_insured}
                  </button>
                ))}
              </Col>
              :
              <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                <Head>Sum Insured File</Head>
                <Button buttonStyle="outline" onClick={() => FileDownload(policyData.enhance_premium_file)}>
                  SI Basis Enhance File <i className="ti-download" />
                </Button>
              </Col>}
            {(Array.isArray(policyData?.enhance_premiums)) ?
              <Col md={12} lg={4} xl={4} sm={12} className="mb-3">
                <Head>{'Premium Basis Amounts'}</Head>
                {policyData?.enhance_premiums.map(({ amount, tax, total_premium }, index) => (
                  <button key={'prem-enhance' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                    {amount} : {tax}<sub>tax%</sub> : {total_premium}<sub>total</sub>
                  </button>
                ))}
              </Col>
              :
              <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
                <Head>Premium File {TaxType(policyData?.premium_tax_type_enhance, policyData?.premium_tax_enhance)}</Head>
                <Button buttonStyle="outline" onClick={() => FileDownload(policyData.enhance_premium_file)}>
                  Premium Basis Enhance File <i className="ti-download" />
                </Button>
              </Col>}
          </Row>
        </>
      }




      <Marker />
      <Typography>{'\u00A0'}Deduction Type</Typography>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Has Payroll?</Head>
          <Text>{(policyData.has_payroll ? "Yes" : "No") || "-"}</Text>
        </Col>
        <Col md={6} lg={3} xl={3} sm={12} >
          <Head>Has Flex?</Head>
          <Text>{(policyData.has_flex ? "Yes" : "No") || "-"}</Text>
        </Col>
        {!!policyData.is_installment_allowed && <Col>
          <Head>Premium Installments</Head>
          {policyData?.installment?.map(({ installment }, index) => (
            <button key={'sum' + index} disabled className="btn shadow m-1 btn-secondary btn-sm rounded-lg" >
              {installment || "-"} month
            </button>
          ))}
        </Col>}
      </Row>

      {
        !!policyData?.benefits?.length &&
        <>
          < Marker />
          <Typography>{'\u00A0'}Addition Cover(Benefit) - {BenefitType[policyData?.benefits_type]}</Typography>
          <Row className="d-flex flex-wrap">
            {policyData?.benefits_type === 1 &&
              policyData?.benefits?.map((benefit, index) => (
                <Col md={6} lg={3} xl={3} sm={12} key={'add-cov' + index} >
                  <Head>{benefit.name}</Head>
                  <Text>{benefit.deductiable || "-"}</Text>
                </Col>
              ))}
            {policyData?.benefits_type !== 1 &&
              policyData?.benefits?.map((data, index) =>
                <ViewPlan
                  view
                  i={index}
                  key={index + 'benefit'}
                  type={policyData?.benefits_type === 2 ? 'Plan' :
                    (policyData?.benefits_type === 3 ? 'Package' : 'Swap')}
                  configs={options} data={data} />)}
          </Row>
        </>
      }

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
