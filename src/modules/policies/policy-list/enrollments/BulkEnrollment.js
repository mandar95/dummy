import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';

import { Row, Col, Button as Btn } from 'react-bootstrap';
import { Button, Input, Select, Chip } from 'components';
import { BenefitList } from '../../steps/additional-details/styles';

import { Controller, useForm } from 'react-hook-form';
import { updateEnrollmentDate } from '../../policy-config.slice';
import { updateMembersEnrollmentDate } from '../../approve-policy/approve-policy.slice';
import subMonths from 'date-fns/subMonths';

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export default function BulkEnrollment({ dispatch, data, multiple, members_enrolled = [] }) {

  const [members, setMembers] = useState(members_enrolled.filter(elem => elem['employee_enrollement_status'] !== 2) || []);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [startDate, setStartDate] = useState(data?.start_date || '')
  const { control, handleSubmit, errors, watch, setValue, reset } = useForm({
    defaultValues: (data && !multiple)
      ? {
        start_date: data.enrollement_start_date,
        end_date: data.enrollement_end_date,
      } : {}
  });
  const policyType = watch('policy_types');

  useEffect(() => {
    if (data)
      reset({
        start_date: data.enrollement_start_date,
        end_date: data.enrollement_end_date,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {

    if (members_enrolled.length) {
      setMembers(members_enrolled.filter(({ id, ...elem }) => elem['employee_enrollement_status'] !== 2 && !selectedMembers.some(({ id: otherId }) => otherId === id)))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMembers])

  const onSubmit = formData => {
    if (!multiple) {
      formData.policy_id = data.id;
      formData.enrollement_status = 1;
      dispatch(updateEnrollmentDate(formData));
    }
    else {
      if (!selectedMembers.length) {
        swal('No Employee Selected', 'Please select atleast 1 employee', 'warning');
        return;
      }
      let employee_policy_mapping_ids = [], employee_ids = [];

      selectedMembers.forEach(elem => {
        if (elem.real_id) {
          employee_policy_mapping_ids.push(elem.real_id)
        } else {
          employee_ids.push(elem.employee_id)
          formData.policy_id = data.id

        }
      });

      dispatch(updateMembersEnrollmentDate({
        ...employee_policy_mapping_ids.length && { employee_policy_mapping_ids },
        ...employee_ids.length && { employee_ids },
        employee_enrollement_status: 1,
        enrollement_start_date: formData.start_date,
        enrollement_end_date: formData.end_date,
        ...employee_ids.length && { policy_id: data.id }
      }));
    }
  };


  const addPolicyType = () => {
    if (policyType) {
      const flag = members_enrolled?.find(
        (value) => value?.code === policyType
      );
      const flag2 = selectedMembers.some((value) => value?.code === policyType);
      if (flag && !flag2) {
        setSelectedMembers((prev) => [...prev, flag]);
        setValue('policy_types', '')
      }
    }
  };

  const removePolicyType = (Broker) => {
    const filteredPolicyType = selectedMembers?.filter((item) => item?.id !== Broker);
    setSelectedMembers([...filteredPolicyType]);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Row>
        <Col xl={6} lg={6} md={6} sm={12}>
          <Controller
            as={
              <Input
                label='Start Date'
                placeholder='mm/dd/yyyy'
                type='date'
                error={errors && errors.start_date} />}
            name='start_date'
            onChange={([e]) => { setStartDate(e.target.value); return e }}
            // min={data?.start_date}
            min={formatDate(subMonths(new Date(data?.start_date), 6))}
            max={data?.enrollment_window_close_mail_effective_date || data?.end_date}
            control={control}
            rules={{ required: true }} />
        </Col>

        <Col xl={6} lg={6} md={6} sm={12}>
          <Controller
            as={
              <Input
                label='End Date'
                placeholder='mm/dd/yyyy'
                type='date'
                error={errors && errors.end_date} />}
            name='end_date'
            min={startDate}
            max={data?.enrollment_window_close_mail_effective_date || data?.end_date}
            control={control}
            rules={{ required: true }} />
        </Col>
      </Row>

      {multiple &&
        <Row className='d-flex flex-wrap'>
          <Col md={6} lg={6} xl={6} sm={12}>
            <Controller
              as={
                <Select
                  label='Employees'
                  placeholder='Select Employees'
                  options={members.map(elem => ({ ...elem, real_id: elem.id, id: elem.code, value: elem.code })) || []}
                  required={false} />}
              control={control}
              name='policy_types' />
          </Col>

          <Col md={6} lg={2} xl={2} sm={12} className='d-flex align-items-center'>
            <Btn type='button' onClick={addPolicyType}>
              <i className='ti ti-plus'></i> Add
            </Btn>
          </Col>

          {!!selectedMembers.length && (
            <Col md={12} lg={12} xl={12} sm={12}>
              <BenefitList>
                {selectedMembers.map((item, index) =>
                  <Chip
                    key={'policy' + index}
                    id={item?.id}
                    name={item?.name}
                    onDelete={removePolicyType}
                  />)}
              </BenefitList>
            </Col>)}
        </Row>}
      <Row>
        <Col className='d-flex justify-content-end mb-3 mt-3'>
          <Button
            type='submit'>
            Submit
          </Button>
        </Col>
      </Row>
    </form>
  )
}
