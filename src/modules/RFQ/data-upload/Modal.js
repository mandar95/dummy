import React from 'react';
import * as yup from 'yup';

import { Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { CloseButton } from './style';
import { Title } from '../select-plan/style';
import { addMember, updateMember } from '../home/home.slice';
import ModalForm from './Forms/ModalForm';

const validationSchema = yup.object().shape({
  employee_id: yup.string().required('EID Required'),
  name: yup.string().required('Name Required')
    .matches(/^([A-Za-z\s])+$/, 'Must contain only alphabets'),
  gender: yup.string().required('Gender Required'),
  dob: yup.string().required('DOB Required'),
  email: yup.string().email().required('Email ID Required'),
  relation_id: yup.string().required('EID Required'),
  sum_insured: yup.string().required('Sum Insured Required')
});

const Relations = [
  { id: 1, name: 'Male', value: 'Male' },
  { id: 2, name: 'Female', value: 'Female' },
  { id: 3, name: 'Other', value: 'Other' }]

export const MemberModal = ({ show, onHide, Data, dispatch, id, relations }) => {
  const { errors, register, handleSubmit } = useForm({
    validationSchema,
    defaultValues: Data ? { ...Data, dob: Data.dob && formatDate(Data.dob) } : {}
  });

  const onSubmit = (data) => {

    !Data.employee_id ?
      dispatch(addMember({ ...data, rfq_lead_id: id })) :
      dispatch(updateMember({ ...data, rfq_lead_id: id }, Data?.id));
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">

      <Modal.Body className="mx-auto p-4">
        <CloseButton onClick={onHide}>×</CloseButton>
        <Title fontSize="1.7rem" className='mb-5 mt-0'>{Data === true ? 'Add member data' : 'Update member data'}</Title>
        <ModalForm
          handleSubmit={handleSubmit} onSubmit={onSubmit} register={register} relations={relations} errors={errors}
          Relations={Relations} Data={Data}
        />
      </Modal.Body>
    </Modal >
  );
}

const formatDate = (date) => {
  let [day, month, year] = date.split('-');

  return [year, month, day].join("-");
};
