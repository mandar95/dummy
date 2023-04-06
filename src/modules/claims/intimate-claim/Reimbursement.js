import React, { useState, useEffect } from 'react';

import { Card, Input, Button, Error, DatePicker } from "components";
import { Row, Col } from 'react-bootstrap';
import Select from "modules/user-management/Onboard/Select/Select";
import { addDays, subDays } from 'date-fns';

import { useSelector } from 'react-redux';
import { claim } from '../claims.slice';
import { numOnly, noSpecial } from "utils";
import { format } from 'date-fns'

export const ReimbursementClaim = ({ control, errors, Controller,
  formatDate, validation, policyId, watch, setValue }) => {

  const [memberId, setMemberId] = useState()
  const { members, policy_id } = useSelector(claim);
  const [minDate, setMinDate] = useState(formatDate(new Date()));

  const [noOfBackDays, setNoOfBackDays] = useState(0);
  const discharge_date = watch('discharge_date');

  useEffect(() => {
    if (members && memberId) {
      const member = members.find((member) => member.member_id === Number(memberId))
      setValue([
        { relation: member?.relation_name },
        { mobile_no: member?.mobile || '' },
        { email: member?.email }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, members])

  useEffect(() => {
    if (policyId && policy_id.length) {
      let policyData = policy_id.filter((item) => item.id === Number(policyId))
      setNoOfBackDays(policyData[0]?.claim_back_date_days || 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId, policy_id])

  const currentPolicyDetail = policy_id.find((item) => item.id === Number(policyId)) || {}

  return (
    <Card title="Reimbursement Claim">
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Select
              label="Patient Name"
              placeholder='Patient'
              option={members.map((elem) => ({ ...elem, name: elem.name + (!elem.tpa_member_id ? '(Member Not Active)' : ''), disable: !elem.tpa_member_id })) || [{ id: 0, name: "Loading" }]}
              valueName="name"
              valueId="member_id"
              id="patient_name"
              required={false}
              isRequired={true}
            />}
            onChange={([id]) => { setMemberId(id); return id }}
            name="member_id"
            error={errors && errors.member_id}
            control={control}
          />
          {!!errors.member_id &&
            <Error>
              {errors.member_id.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Mobile Number" type='tel' onKeyDown={numOnly} onKeyPress={noSpecial}
              maxLength={validation.mobile_no.length} placeholder="Mobile Number" required={false}
              isRequired={true} />}
            name="mobile_no"
            value={members[memberId]?.mobile || ""}
            error={errors && errors.mobile_no}
            control={control}
          />
          {!!errors.mobile_no &&
            <Error>
              {errors.mobile_no.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Email Id" type="email" maxLength={validation.email.max}
              placeholder="Enter Email Id" required={false}
              isRequired={true} />}
            name="email"
            value={members[memberId]?.email || ""}
            error={errors && errors.email}
            control={control}
          />
          {!!errors.email &&
            <Error>
              {errors.email.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Doctor Name" maxLength={validation.doctor.max}
              placeholder="Enter Doctor Name" required={true}
              isRequired={true} />}
            name="doctor_name"
            error={errors && errors.doctor_name}
            control={control}
          />
          {!!errors.doctor_name &&
            <Error>
              {errors.doctor_name.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Hospital Name" maxLength={validation.hospital_name.max}
              placeholder="Hospital Name" required={false}
              isRequired={true} />}
            name="hospital_name"
            error={errors && errors.hospital_name}
            control={control}
          />
          {!!errors.hospital_name &&
            <Error>
              {errors.hospital_name.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Hospital Address" maxLength={validation.hospital_address.max}
              placeholder="Hospital Address" required={false}
              isRequired={true} />}
            name="hospital_address"
            error={errors && errors.hospital_address}
            control={control}
          />
          {!!errors.hospital_address &&
            <Error>
              {errors.hospital_address.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Reason For Hospitilization" maxLength={validation.admitted_for.max}
              placeholder="Admitted For" required={false}
              isRequired={true} />}
            name="reason"
            error={errors && errors.reason}
            control={control}
          />
          {!!errors.reason &&
            <Error>
              {errors.reason.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Claim Amount Estimated" type='tel' onKeyDown={numOnly} onKeyPress={noSpecial}
              maxLength={validation.estimated_claim.length}
              placeholder="Claim Amount Estimated" required={false}
              isRequired={true} />}
            name="claim_amt"
            error={errors && errors.claim_amt}
            control={control}
          />
          {!!errors.claim_amt &&
            <Error>
              {errors.claim_amt.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input label="Remark" placeholder="Remark"
              maxLength={validation.remark.max} required={false}
              isRequired={false} />}
            name="remark"
            error={errors && errors.remark}
            control={control}
          />
          {!!errors.remark &&
            <Error>
              {errors.remark.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <DatePicker
                minDate={subDays((currentPolicyDetail.start_date && new Date() < new Date(currentPolicyDetail.start_date)) ? new Date(currentPolicyDetail.start_date) : new Date(), noOfBackDays)}
                maxDate={new Date(currentPolicyDetail.end_date ? currentPolicyDetail.end_date : '2200-01-01')}
                name={'planned_date'}
                label={'Date Of Admission'}
                required={false}
                isRequired={true}
              />
            }
            onChange={([selected]) => {
              const selectedDate = format(selected, 'dd-MM-yyyy')
              if (selectedDate > discharge_date) {
                setValue('discharge_date', '')
              }
              setMinDate(selected)
              return selected ? format(selected, 'dd-MM-yyyy') : '';
            }}
            name="planned_date"
            control={control}
          />
          {!!errors.planned_date &&
            <Error>
              {errors.planned_date.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <DatePicker
                minDate={addDays(new Date(minDate), 0)}
                maxDate={new Date(currentPolicyDetail.end_date ? currentPolicyDetail.end_date : '2200-01-01')}
                name={'discharge_date'}
                label={'Planned Discharge Date'}
                required={false}
                isRequired={false}
              />
            }
            onChange={([selected]) => {
              return selected ? format(selected, 'dd-MM-yyyy') : '';
            }}
            name="discharge_date"
            control={control}
          />
          {!!errors.discharge_date &&
            <Error>
              {errors.discharge_date.message}
            </Error>}
        </Col>
        <Controller
          as={<input className="d-none" disabled />}
          name="claim_type"
          defaultValue="reimbursement"
          control={control}
        />
      </Row>
      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          {/* <Button type="button" buttonStyle="danger">
              Cancel
            </Button> */}
          <Button type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Card>
  )
}
