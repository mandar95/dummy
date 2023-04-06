import React from 'react'
import styled from "styled-components";
import * as yup from "yup";

import { Card } from '../../../components'

import { useForm } from "react-hook-form";
import { saveFeature, updateFeature } from '../rfq.slice';
import { useDispatch } from 'react-redux';
import CreateFeatureForm from './Forms/CreateFeatureForm';

const validationSchema = yup.object().shape({
  name: yup.string().required("Hospital Name required")
    .max(80, `Maximum ${80} character available`),
  // .matches(validation.bill_no.regex, 'Must contain only alphabets/numbers'),
  order: yup.string().nullable()
    .max(3, `Maximum ${3} character available`),
  content: yup.string().nullable()
    // .min(validation.claim_amt.min, `Minimum ${validation.claim_amt.min} character required`)
    .max(800, `Maximum ${800} character available`)
});

const featureIcons = [
  '/assets/images/family-couple-saving-money_74855-5240.jpg',
  '/assets/images/businessman-planning-events-deadlines-agenda_74855-6274.jpg',
  '/assets/images/digital-pen-abstract-concept-illustration_335657-2281.jpg',
  '/assets/images/people-sitting-hospital-corridor-waiting-doctor-patient-clinic-visit-flat-vector-illustration-medicine-healthcare_74855-8507.jpg',
  '/assets/images/thoughtful-woman-with-laptop-looking-big-question-mark_1150-39362.jpg?size=338&ext=jpg',
]

export default function CreateFeature({ id, featureTypes, feature }) {

  const dispatch = useDispatch();
  const { control, errors, handleSubmit, register, watch, setValue } = useForm({
    validationSchema,
    defaultValues: id ? {
      name: feature.name,
      content: feature.content,
      order: feature.order,
      include_multiple_si: String(feature.include_multiple_si || 0), is_maternity: String(feature.is_maternity || 0), maternity_dependant: String(feature.maternity_dependant || 0),
      product_feature_type_id: String(feature.product_feature_type_id || '')
    } : {}
  })


  const content = watch("content") || '';
  const is_maternity = watch('is_maternity') || '0';
  const maternity_dependant = watch('maternity_dependant') || '0';
  const product_feature_type_id = watch('product_feature_type_id') || '1';

  const onSubmit = ({ name, order, content, product_feature_type_id,
    include_multiple_si = 0, is_maternity = 0, maternity_dependant = 0 }) => {
    id ? dispatch(updateFeature({
      name, product_feature_type_id,
      include_multiple_si, is_maternity, maternity_dependant,
      product_feature_id: id,
      ...!!order && { order },
      ...!!content && { content }
    })) :
      dispatch(saveFeature({
        name, content,
        include_multiple_si, is_maternity, maternity_dependant,
        ...!!order && { order }, product_feature_type_id
      }))
  }

  return (
    <Card title={(id ? 'Edit' : 'Create') + ' Product Feature'}>
      <CreateFeatureForm
        handleSubmit={handleSubmit} onSubmit={onSubmit} errors={errors} control={control} content={content}
        featureTypes={featureTypes} setValue={setValue} register={register} featureIcons={featureIcons} product_feature_type_id={product_feature_type_id}
        feature={feature} maternity_dependant={maternity_dependant} is_maternity={is_maternity} id={id}
      />
    </Card>
  )
}

export const Head = styled.span`
	text-align: center;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: #6334e3;
  svg {
    height: 15px;
    padding-left: 5px;
  }
`;

export const OptionInput = styled.label`
  margin-left: 20px;
  cursor: pointer;
  user-select: none;
  position: absolute;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -25px;
    top: ${({ small }) => small ? '-4' : '-7'}px;
    height: ${({ small }) => small ? '25' : '35'}px;
    width: ${({ small }) => small ? '25' : '35'}px;
    min-width: ${({ small }) => small ? '25' : '35'}px;
    background-color: #fff;
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 0px 2px 6px 0px #0b0b0b40;
    border: 1px solid #1bf29e;
  }
  span:after {
    content: "";
    position: relative;
    display: none;
    }
  /* &:hover input ~ span{
    background-color: #1bf29e3b;
    transition: all 0.2s;
  } */
  input:checked ~ span {
    background-color: #1bf29e !important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: ${({ small }) => small ? '6.1' : '7'}px;
    top: ${({ small }) => small ? '3.5' : '3.5'}px;
    width: 5px;
    height: 10px;
    transition: all 1s;
    border: solid rgb(255, 255, 255);
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: ${({ small }) => small ? '1.3' : '1.7'};
    }
`
