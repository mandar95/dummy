import React, { useEffect } from 'react';
import * as yup from "yup";


import { Controller, useForm } from "react-hook-form";
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";
import { Error, Input, Select } from '../../../../components';
import { noSpecial, numOnly } from '../../../../utils';
import { ContextAwareToggle, filterGender, formatDate } from '../../../enrollment/enrollment.help';
import { Accordion } from 'react-bootstrap';
import { Relation_Name } from '../FamilyMemberModal';
import { tempStorage } from '../employee-flex.action';
import _ from 'lodash';
import { enrollment } from '../../../enrollment/enrollment.slice';
import { useSelector } from 'react-redux';
import { format, subYears, differenceInYears } from 'date-fns';
import swal from 'sweetalert';
import { common_module } from 'config/validations';
const validation = common_module.user;

const MinValidation = (Validations = {}) => {
  return format(subYears(new Date(), Validations?.max_age || 120), 'yyyy-MM-dd')
}
const MaxValidation = (Validations) => {
  return !Validations?.min_age ? formatDate(subYears(new Date(), isAdult(Validations?.relation_id))) : format(subYears(new Date(), Validations?.min_age || 0), 'yyyy-MM-dd')
}

const validationSchema = yup.object().shape({
  insured_details: yup.array().of(
    yup.object().shape({
      member_firstname: yup
        .string()
        .test("alphabets", "Name must contain only alphabets", (value) => {
          return /^([A-Za-z\s])+$/.test(value?.trim());
        })
        .required("First Name required"),
      member_lastname: yup
        .string()
        .matches(/^([A-Za-z\s])+$/, {
          message: "Name must contain only alphabets",
          excludeEmptyString: true,
        })
        .notRequired()
        .nullable(),
      member_dob: yup.string().required("DOB required"),
      member_gender: yup.string().required("Gender required"),
      member_contact_no: yup
        .string()
        .notRequired()
        .nullable()
        .matches(validation.contact.regex, {
          message: "Not valid number",
          excludeEmptyString: true,
        })
        .max(10, "Must be exactly 10 digits"),
      member_email: yup.string().email("must be a valid email").nullable(),
    }))

});


export function InsuredMembers({ handleNext, handleBack, tempData, dispatch }) {

  const { control, errors, register, handleSubmit, reset, watch } =
    useForm({
      validationSchema,
      defaultValues: tempData?.insured_details?.length ? tempData : {},
    });
  const { globalTheme } = useSelector(state => state.theme)
  const { currentUser } = useSelector(state => state.login)
  const { userData } = useSelector(enrollment);
  const { policyData } = useSelector(state => state.approvePolicy);

  const AllowedRelations = ExtractData(tempData?.flex_details);

  useEffect(() => {
    if (userData && !tempData?.insured_details?.length) {
      if (!_.isEmpty(userData)) {
        let insured_details = [{
          member_relation_id: 1,
          member_gender: userData?.gender || currentUser?.gender,
          member_firstname: userData?.name || currentUser?.name || '',
          // member_lastname:,
          member_contact_no: userData?.mobile_no || currentUser?.mobile_no || '',
          member_email: userData?.email || currentUser?.email || '',
          member_dob: userData?.dob || currentUser?.dob,
        }];

        if (tempData?.flex_details[0]?.members?.length > 1) {
          insured_details = AllowedRelations
        }
        reset({ insured_details });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  // useEffect(() => {
  //   if (!tempData?.insured_details?.length) {

  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const onSubmit = (data) => {
    for (let i = 0; i < data.insured_details.length; ++i) {
      const currentMember = data.insured_details[i];
      const Validations = policyData?.ageDetails?.find((elem) => +elem.relation_id === +currentMember.member_relation_id);
      if (Validations && [3, 4, 5, 6, 7, 8].includes(+currentMember.member_relation_id) && currentMember.member_dob) {
        const age_difference = Validations.age_difference;

        const compareRelation = data.insured_details.find(({ member_relation_id }) => +member_relation_id === +Validations.difference_from_relation) ||
          data.insured_details.find(({ member_relation_id }) => +member_relation_id === 1);

        if ([3, 4,].includes(+currentMember.member_relation_id) ? differenceInYears(new Date(currentMember.member_dob), new Date(compareRelation.member_dob)) < age_difference
          : differenceInYears(new Date(compareRelation.member_dob), new Date(currentMember.member_dob)) < age_difference) {
          swal('Age Validation', `${Relation_Name[currentMember.member_relation_id]} age difference with ${Relation_Name[compareRelation.member_relation_id]} should be ${age_difference} years `, 'info')
          return
        }
        if ([5, 6, 7, 8].includes(+currentMember.member_relation_id)) {
          const selfMember = data.insured_details.find(({ member_relation_id }) => +member_relation_id === 1);
          if (selfMember.member_gender && [0, 1].includes(Validations.is_allowed_for_gender) && Validations.is_allowed_for_gender !== 2 &&
            ((Validations.is_allowed_for_gender === 0 && selfMember.member_gender !== 'Male') || (Validations.is_allowed_for_gender === 1 && selfMember.member_gender !== 'Female'))) {
            swal('Not Allowed for this gender', `${Relation_Name[currentMember.member_relation_id]} is not allowed for  ${Relation_Name[compareRelation.member_relation_id]} as ${selfMember.member_gender} `, 'info')
            return

          }
        }

      }
    }
    let tempDataCopy = tempData;
    if (!tempData?.nominee_details?.length) // remove nominee key if empty
      tempDataCopy = _.omit(tempData, "nominee_details");
    tempStorage(dispatch, { ...tempDataCopy, ...data }, { handleNext })
  }

  const onPrevious = () => {
    let tempDataCopy = tempData;
    if (!tempData?.nominee_details?.length) // remove nominee key if empty
      tempDataCopy = _.omit(tempData, "nominee_details");
    tempStorage(dispatch, { ...tempDataCopy, insured_details: watch('insured_details') }, { handleNext: handleBack })
  }

  return (
    <form className="row w-100 m-0 justify-content-center justify-content-sm-center justify-content-md-start" onSubmit={handleSubmit(onSubmit)}>
      <div className='w-100' style={{ minHeight: '400px' }}>
        {AllowedRelations.map(({ relation_id }, index) => {
          const Validations = policyData?.ageDetails?.find((elem) => +elem.relation_id === +relation_id);

          const filteredGender = filterGender(Number(relation_id)).map((item) => ({
            id: item.name,
            name: item.name,
            value: item.name,
          })) || []

          return <Accordion defaultActiveKey={1}
            style={{
              boxShadow: '1px 1px 16px 0px #e7e7e7',
              borderRadius: '15px',
              width: '100%',
              marginBottom: '15px',
              border: errors.insured_details?.[index] ? '1px solid red' : '1px solid #e8e8e8'
            }}
            key={'AllowedRelations-' + index}
          >
            <Accordion.Toggle
              eventKey={relation_id} style={{
                width: '100%',
                border: 'none',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                background: 'white',
                borderRadius: '15px',
                padding: '10px',
                outline: 'none'

              }} className='d-flex justify-content-between align-items-center'>
              <div className='text-left mr-3' style={{
                fontWeight: '500',
                fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                letterSpacing: '1px',
                color: 'black'
              }}>
                {/* <img
            src={GetSrc(v.policy_sub_type_id)}
            alt={'policy_image_404'}
            style={{
              // border: '1px dashed #b6b6b6',
              borderRadius: "5px",
              // padding: "10px",
              textAlign: "center",
              marginRight: '10px',
              height: '40px'
            }} /> */}
                {Relation_Name[relation_id]}
              </div>
              <ContextAwareToggle eventKey={relation_id} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={relation_id} style={{
              width: '100%',
              // paddingTop: '50px',
              paddingTop: '15px',
              background: 'white',
              borderTop: '2px solid #FFDF00',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px'
            }}>


              <div className="row m-0 justify-content-center justify-content-sm-center justify-content-md-start w-100">
                <input ref={register} value={relation_id} type='hidden'
                  name={`insured_details[${index}].member_relation_id`} />
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={
                      <Select
                        label="Gender"
                        placeholder="Select Gender"
                        required={false}
                        isRequired
                        options={filteredGender}
                        disabled={relation_id === 1}
                        style={{ background: "white" }}
                        error={errors && errors.insured_details?.[index]?.member_gender}
                      />
                    }
                    defaultValue={filteredGender[0].id}
                    control={control}
                    name={`insured_details[${index}].member_gender`}
                  />
                  {!!errors.insured_details?.[index]?.member_gender && (
                    <Error>{errors.insured_details?.[index].member_gender.message}</Error>
                  )}
                </div>
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={
                      <Input
                        label="First Name"
                        placeholder="Enter First Name"
                        isRequired
                      />
                    }
                    disabled={relation_id === 1}
                    style={{ background: "white" }}
                    maxLength={50}
                    error={errors && errors.insured_details?.[index]?.member_firstname}
                    control={control}
                    name={`insured_details[${index}].member_firstname`}
                  />
                  {!!errors.insured_details?.[index]?.member_firstname && (
                    <Error>{errors.insured_details?.[index].member_firstname.message}</Error>
                  )}
                </div>
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={
                      <Input
                        label="Last Name"
                        placeholder="Enter Last Name"
                        required={false}
                      />
                    }
                    disabled={relation_id === 1}
                    style={{ background: "white" }}
                    maxLength={50}
                    error={errors && errors.insured_details?.[index]?.member_lastname}
                    control={control}
                    name={`insured_details[${index}].member_lastname`}
                  />
                  {!!errors.insured_details?.[index]?.member_lastname && (
                    <Error>{errors.insured_details?.[index].member_lastname.message}</Error>
                  )}
                </div>
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={
                      <Input
                        label="Contact No"
                        placeholder="Enter Contact No"
                        min={0}
                        type="tel"
                        maxLength={10}
                        onKeyDown={numOnly}
                        onKeyPress={noSpecial}
                        required={false}
                        disabled={relation_id === 1}
                        style={{ background: "white" }}
                        error={errors && errors.insured_details?.[index]?.member_contact_no}
                      />
                    }
                    control={control}
                    name={`insured_details[${index}].member_contact_no`}
                  />
                  {!!errors.insured_details?.[index]?.member_contact_no && (
                    <Error>{errors.insured_details?.[index].member_contact_no.message}</Error>
                  )}
                </div>
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={
                      <Input
                        label="Email"
                        placeholder="Enter Email"
                        type="email"
                        maxLength={50}
                        disabled={relation_id === 1}
                        style={{ background: "white" }}
                        error={errors && errors.insured_details?.[index]?.member_email}
                        required={false}
                      />
                    }
                    defaultValue={relation_id === 1 ? userData?.email || currentUser?.email : ''}
                    control={control}
                    name={`insured_details[${index}].member_email`}
                  />
                  {!!errors.insured_details?.[index]?.member_email && (
                    <Error>{errors.insured_details?.[index].member_email.message}</Error>
                  )}
                </div>
                <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                  <Controller
                    as={<Input label="Date of Birth" type="date"
                      required={false} isRequired />}
                    min={MinValidation(Validations)}
                    max={MaxValidation(Validations)}
                    name={`insured_details[${index}].member_dob`}
                    disabled={relation_id === 1}
                    style={{ background: "white" }}
                    error={errors && errors.insured_details?.[index]?.member_dob}
                    control={control}
                  />
                  {!!errors.insured_details?.[index]?.member_dob && (
                    <Error>{errors.insured_details?.[index].member_dob.message}</Error>
                  )}
                </div>
                {+relation_id === 2 && (
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input label="Member Marriage Date" type="date" required={false} />
                      }
                      name={`insured_details[${index}].member_marriage_date`}
                      max={formatDate(new Date())}
                      disabled={relation_id === 1}
                      style={{ background: "white" }}
                      error={errors && errors.insured_details?.[index]?.member_marriage_date}
                      control={control}
                    />
                    {!!errors.insured_details?.[index]?.member_marriage_date && (
                      <Error>{errors.insured_details?.[index].member_marriage_date.message}</Error>
                    )}
                  </div>
                )}
              </div>
            </Accordion.Collapse>
          </Accordion>
        })}
      </div>

      <div className="d-flex w-100 flex-column flex-sm-row justify-content-center align-items-center my-2">
        <div className="w-100 d-flex justify-content-center justify-content-sm-start">
          <Button
            type='button'
            onClick={onPrevious}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </Button>
        </div>
        <div className="w-100">
          <div className="d-flex justify-content-center justify-content-sm-end mt-2 mt-0">
            <Button
              type='submit'>
              {" "}
              Next
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export const isAdult = (relation_id) => {
  if ([3, 4, 9].includes(relation_id)) return 0
  return 18
}

const ExtractData = (details = []) => {

  const existingMembers = details.reduce((sum_ins, { members, member_feature }) =>
    [...sum_ins, ...members/* , ...member_feature?.cover > 0 ? member_feature.relation_ids.map(id => ({ relation_id: id })) : [] */],
    []);

  let spouseCount = 0, partnerCount = 0, daughterCount = 0, sonCount = 0, siblingsCount = 0;

  let spouseCountFilter = 0, partnerCountFilter = 0, daughterCountFilter = 0, sonCountFilter = 0, siblingsCountFilter = 0;

  const allowed_relations = details.reduce((sum_ins, { relations }) => {
    let spouseOccurance = 0, partnerOccurance = 0, daughterOccurance = 0, sonOccurance = 0, siblingsOccurance = 0;
    return [...sum_ins, ...relations.filter(({ relation_id }) => {
      if (relation_id === 2) {
        if (spouseCountFilter === 0 || (spouseOccurance === spouseCountFilter)) {
          ++spouseCountFilter
        }
        else if (spouseOccurance < spouseCountFilter) {
          ++spouseOccurance
          return false
        }
        ++spouseOccurance
      };
      if (relation_id === 2) {
        if (partnerCountFilter === 0 || (partnerOccurance === partnerCountFilter)) {
          ++partnerCountFilter
        }
        else if (partnerOccurance < partnerCountFilter) {
          ++partnerOccurance
          return false
        }
        ++partnerOccurance
      };
      if (relation_id === 3) {
        if (sonCountFilter === 0 || (sonOccurance === sonCountFilter)) {
          ++sonCountFilter
        }
        else if (sonOccurance < sonCountFilter) {
          ++sonOccurance
          return false
        }
        ++sonOccurance
      };
      if (relation_id === 4) {
        if (daughterCountFilter === 0 || (daughterOccurance === daughterCountFilter)) {
          ++daughterCountFilter
        }
        else if (daughterOccurance < daughterCountFilter) {
          ++daughterOccurance
          return false
        }
        ++daughterOccurance
      };
      if (relation_id === 9) {
        if (siblingsCountFilter === 0 || (siblingsOccurance === siblingsCountFilter)) {
          ++siblingsCountFilter
        }
        else if (siblingsOccurance < siblingsCountFilter) {
          ++siblingsOccurance
          return false
        }
        ++siblingsOccurance
      };
      return sum_ins.some(elem => elem.relation_id === relation_id) ? [2, 3, 4, 9].includes(relation_id) : true
    })]
  },
    [])
    .map(elem => {
      let spouseOccurance = 0, partnerOccurance = 0, daughterOccurance = 0, sonOccurance = 0, siblingsOccurance = 0;
      const memberFind = existingMembers.find(({ relation_id }) => {
        if (elem.relation_id === relation_id) {

          if (elem.relation_id === 2) {
            if (spouseOccurance !== spouseCount) {
              ++spouseOccurance
              return false
            }
            ++spouseOccurance
          };
          if (elem.relation_id === 10) {
            if (partnerOccurance !== partnerCount) {
              ++partnerOccurance
              return false
            }
            ++partnerOccurance
          };
          if (elem.relation_id === 3) {
            if (sonOccurance !== sonCount) {
              ++sonOccurance
              return false
            }
            ++sonOccurance
          };
          if (elem.relation_id === 4) {
            if (daughterOccurance !== daughterCount) {
              ++daughterOccurance
              return false
            }
            ++daughterOccurance
          };
          if (elem.relation_id === 9) {
            if (siblingsOccurance !== siblingsCount) {
              ++siblingsOccurance
              return false
            }
            ++siblingsOccurance
          };
          return true
        }
        return false
      })
      if (memberFind) {
        if (memberFind.relation_id === 2) ++spouseCount;
        if (memberFind.relation_id === 3) ++sonCount;
        if (memberFind.relation_id === 4) ++daughterCount;
        if (memberFind.relation_id === 9) ++siblingsCount;

        elem.member_relation_id = memberFind.relation_id;
        elem.member_gender = memberFind.gender;
        elem.member_firstname = memberFind.first_name || '';
        elem.member_lastname = memberFind.last_name;
        elem.member_contact_no = '';
        elem.member_email = '';
        elem.member_dob = memberFind.dob;
      }
      return elem
    });


  return allowed_relations
}
