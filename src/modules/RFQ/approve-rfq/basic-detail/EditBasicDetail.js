import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import swal from 'sweetalert';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { updateRfq } from '../../rfq.slice';
import { insurer } from 'config/validations'
import EditBasicDetailsForm from './Forms/EditBasicDetailsForm';

const validation = insurer.plan_config

const validationSchema = (isBroker) => yup.object().shape({
  plan_name: yup.string().required('Plan Name Required')
    .min(validation.plan_name.min, `Minimum ${validation.plan_name.min} character required`)
    .max(validation.plan_name.max, `Maximum ${validation.plan_name.max} character available`)
    .matches(validation.plan_name.regex, 'Must contain only alphabets'),
  policy_type_id: yup.string().required('Policy Type Required'),
  policy_sub_type_id: yup.string().required('Policy Type Required'),
  max_no_of_employee: yup.number().required('Max Employee Live Required')
    .min(validation.max_no_of_employee.min, `Minimum ${validation.max_no_of_employee.min}`)
    .max(validation.max_no_of_employee.max, `Maximum ${validation.max_no_of_employee.max}`)
    .typeError('Max Employee Live Required'),
  min_no_of_employee: yup.number().required('Min Employee Live Required')
    .min(1, `Minimum ${1}`)
    .typeError('Min Employee Live Required'),
  // co_oprate_buffer: yup.number().required('Corporate Buffer Required')
  //   .min(validation.co_oprate_buffer.min, `Minimum ${validation.co_oprate_buffer.min}%`)
  //   .max(validation.co_oprate_buffer.max, `Maximum ${validation.co_oprate_buffer.max}%`)
  //   .typeError('Corporate Buffer Required'),
  // co_pay_percentage: yup.number().required('Co-Pay Required')
  //   .min(validation.co_pay_percentage.min, `Minimum ${validation.co_pay_percentage.min}%`)
  //   .max(validation.co_pay_percentage.max, `Maximum ${validation.co_pay_percentage.max}%`)
  //   .typeError('Co-Pay Required'),
  max_discount: yup.number().required('Max Discount Required')
    .min(validation.max_discount.min, `Minimum ${validation.max_discount.min}%`)
    .max(validation.max_discount.max, `Maximum ${validation.max_discount.max}%`)
    .typeError('Max Discount Required'),
  ...isBroker && {
    ic_name: yup.string().required("IC Name required")
      .min(validation.ic_name.min, `Minimum ${validation.ic_name.min} character required`)
      .max(validation.ic_name.max, `Maximum ${validation.ic_name.max} character available`)
  },
  plan_description: yup.string().required('Plan Name Required')
    .max(validation.plan_description.length, `Maximum ${validation.plan_description.max} character available`)
});


export const EditBasicDetail = ({ userType, options, rfqData, ic_plan_id, ic_id, broker_id }) => {

  const dispatch = useDispatch();
  const isBroker = userType === 'broker'
  const { control, errors, handleSubmit, watch, setValue } = useForm({
    defaultValues: rfqData && {
      ...rfqData,
      // co_oprate_buffer: rfqData.co_operate_buffer || '0',
      co_pay_percentage: rfqData.co_pay_percentage || '0',
      max_discount: rfqData.max_discount || '0',
      max_no_of_employee: rfqData.max_no_of_employee || '0',
      plan_name: rfqData.name
    },
    validationSchema: validationSchema(isBroker)
  });
  const [subPolicyTypes, setSubPolicyTypes] = useState([]);
  const [icLogo, setIcLogo] = useState();

  const Min_no_of_employee = watch('min_no_of_employee');
  const Max_no_of_employee = watch('max_no_of_employee');

  useEffect(() => {
    if (Min_no_of_employee && Max_no_of_employee) {
      if (Number(Min_no_of_employee) > Number(Max_no_of_employee)) {
        swal('Validtion', 'Min no of employee lives can not be greater than Max employee lives', 'info').then(() => setValue('min_no_of_employee', ''));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Min_no_of_employee, Max_no_of_employee])

  useEffect(() => {
    if (rfqData.policy_type_id)
      setSubPolicyType(rfqData.policy_type_id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  const planDescription = watch("plan_description") || '';
  const icName = (watch("ic_name") || '').trim();

  const setSubPolicyType = (policyType) => {
    if (policyType) {
      const data = options.policy_sub_types
        // eslint-disable-next-line eqeqeq
        .filter(item => String(item.master_policy_id) == policyType)
        .map(item => ({
          id: item.id,
          name: item.name,
          value: item.id
        }));
      setSubPolicyTypes(data);
    } else {
      return null;
    }
  };


  const onSubmit = (data) => {

    if (isBroker && options.insurance_compaines.every(({ name }) => name !== icName) && !icLogo && !rfqData.logo) {
      swal("Validtion", 'Attach Ic logo to proceed', "info");
      return
    }

    const formData = new FormData();

    for (let key in data) {
      if (data[key] !== '' && data[key] !== null)
        formData.append(`${key}`, `${data[key]}`)
    }


    if (userType === 'broker') {
      // formData.set('broker_id', broker_id);
      if (options.insurance_compaines.every(({ name }) => name !== icName)) {
        formData.set('insurer_name', icName);
        if (icLogo) formData.set('logo', icLogo[0]);
      }
      else {
        formData.set('ic_id', options.insurance_compaines.find(({ name }) => name === icName).id);
      }
    }

    formData.append(`step`, 1);
    formData.append(`ic_plan_id`, ic_plan_id);

    dispatch(updateRfq(
      formData
      , { ic_plan_id, ic_id, broker_id }))

  }

  return (
    <EditBasicDetailsForm
      handleSubmit={handleSubmit} onSubmit={onSubmit} validation={validation} errors={errors} control={control}
      options={options} setSubPolicyType={setSubPolicyType} subPolicyTypes={subPolicyTypes} isBroker={isBroker}
      icName={icName} rfqData={rfqData} setIcLogo={setIcLogo} planDescription={planDescription}
    />
  )
}
