import React, { useEffect, useState } from 'react';
import * as yup from "yup";


import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";
import { Error, Input, Marker, Select, Typography, Button as BTN } from '../../../../components';
import { ContextAwareToggle, formatDate } from '../../../enrollment/enrollment.help';
import { Accordion } from 'react-bootstrap';
import { differenceInYears, subYears } from 'date-fns';
import swal from 'sweetalert';
import { /* saveEnrolment,  */getMeAllNomineeConfig, tempStorage } from '../employee-flex.action';
import { isAdult } from './InsuredMembers';
import { GetNomineeConfig } from "modules/policies/Nominee-Config/nominee.actions";
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Relation_Name } from '../FamilyMemberModal';

const relations = [
  { "id": 2, "value": 2, "name": "Spouse" },
  { "id": 3, "value": 3, "name": "Daughter" },
  { "id": 4, "value": 4, "name": "Son" },
  { "id": 5, "value": 5, "name": "Father" },
  { "id": 6, "value": 6, "name": "Mother" },
  { "id": 7, "value": 7, "name": "Father-in-law" },
  { "id": 8, "value": 8, "name": "Mother-in-law" },
  { "id": 9, "value": 9, "name": "Siblings" },
  { "id": 10, "value": 10, "name": "Partner" }
]

const validationSchema =
  yup.object().shape({
    nominee_details: yup.array().of(
      yup.object().shape({
        // nominee_gender: yup.string().required("Gender required"),
        nominee_relation: yup.string().required("Please select employee relation"),
        nominee_fname: yup
          .string()
          .required("Nominee First Name required")
          .test("alphabets", "Name must contain only alphabets", (value) => {
            return /^([A-Za-z\s])+$/.test(value?.trim());
          }),
        nominee_lname: yup
          .string()
          .matches(/^([A-Za-z\s])+$/, {
            message: "Name must contain only alphabets",
            excludeEmptyString: true,
          })
          .notRequired()
          .nullable(),
        nominee_dob: yup.string().required("Nominee DOB required"),

        guardian_relation: yup
          .string().when("nominee_dob", {
            is: value => value && differenceInYears(new Date(), new Date(value)) < 18,
            then: yup.string().required(
              "Relation with nominee required"
            ),
            otherwise: yup.string()
          }),
        guardian_fname: yup
          .string()
          .when("nominee_dob", {
            is: value => value && differenceInYears(new Date(), new Date(value)) < 18,
            then: yup.string().required("Guardian First Name required").test("alphabets", "Name must contain only alphabets", (value) => {
              return /^([A-Za-z\s])+$/.test(value?.trim());
            }),
            otherwise: yup.string()
          }),
        guardian_lname: yup
          .string()
          .when("nominee_dob", {
            is: value => value && differenceInYears(new Date(), new Date(value)) < 18,
            then: yup.string()
              .matches(/^([A-Za-z\s])+$/, {
                message: "Name must contain only alphabets",
                excludeEmptyString: true,
              })
              .notRequired()
              .nullable(),
            otherwise: yup.string()
          }),
        guardian_dob: yup.string()
          .when("nominee_dob", {
            is: value => value && differenceInYears(new Date(), new Date(value)) < 18,
            then: yup.string()
              .required("Guardian DOB required"),
            otherwise: yup.string()
          }),

        share_per: yup
          .number()
          .required('Share required')
          .nullable()
          .typeError("must be a number")
          .min(0)
          .max(100, "max limit is 100")
      }))
  });


export function NomineeMembers({ handleBack, tempData, dispatch, handleNext }) {

  const { currentUser } = useSelector(state => state.login);
  const { globalTheme } = useSelector(state => state.theme)
  const { control, errors, handleSubmit, watch, setValue /* register, watch,  */ } =
    useForm({
      validationSchema,
      defaultValues: tempData?.nominee_details?.length ? { nominee_details: tempData.nominee_details } : {}
    });

  const [gate, setGate] = useState(true);
  const [nomineeConfig, setNomineeConfig] = useState(null);
  const [nomineeRelation, setNomineeRelation] = useState([]);
  const [nomineeToAddConfig, setNomineeToAddConfig] = useState([]);
  const [flag, updateFlag] = useState(0);

  const allowed_relations = nomineeConfig?.allowed_relations?.map((data) =>
    Number(data)
  );


  const { fields, remove, append } = useFieldArray({
    control,
    name: 'nominee_details'
  });

  function RelationDropDownHandler() {
    let b = [];
    if (relations?.length && _.isEmpty(nomineeConfig)) {
      setNomineeRelation(relations);
    }
    if (
      relations?.length &&
      Number(nomineeConfig?.allowed_relations_type) === 2
    ) {
      b = relations?.filter((data, i) =>
        allowed_relations.includes(Number(data?.id))
      );
      setNomineeRelation(b);
    } else if (
      relations?.length &&
      Number(nomineeConfig?.allowed_relations_type) === 1
    ) {
      // b =
      // member_option?.filter(value => Number(value?.relation_id) !== 1)?.map((item) => ({
      //     id: item?.relation_id,
      //     name: `${item?.relation_name} - ${item?.first_name}`,
      //     value: item?.relation_id,
      //   })) || [];
      // setNomineeRelation(b);
    }
  }


  useEffect(() => {
    if (!tempData?.nominee_details?.length)
      append({ index: '' })

    getMeAllNomineeConfig(tempData?.flex_details.map(({ policy_id }) => ({ id: policy_id })), currentUser.employer_id, setNomineeToAddConfig)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (_.isEmpty(nomineeConfig) && gate) {
      setGate(false);
      GetNomineeConfig({
        configurable_type: "policy",
        configurable_id: tempData?.flex_details.find(({ product_id }) => [1, 2, 3].includes(product_id)).policy_id,
      }, setNomineeConfig);
    } else if (_.isEmpty(nomineeConfig) && !gate) {
      GetNomineeConfig({
        configurable_type: "employer",
        configurable_id: currentUser.employer_id,
      }, setNomineeConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomineeConfig]);

  const nominee_details = watch('nominee_details') || [];

  useEffect(() => {
    if (!_.isEmpty(nominee_details)) {
      let a = nominee_details
        ?.filter((value) => [5, 6, 7, 8].includes(+value?.nominee_relation))
        ?.map((data) => +data?.nominee_relation);
      if (
        Number(nomineeConfig?.allowed_relations_type) === 2 &&
        !_.isEmpty(nomineeConfig)
      ) {
        a = relations?.filter((value) => !a?.includes(+value?.id));
        let b = a?.filter((data, i) =>
          allowed_relations?.includes(Number(data?.id))
        );
        setNomineeRelation(b);
      } else if (
        Number(nomineeConfig?.allowed_relations_type) === 1 &&
        !_.isEmpty(nomineeConfig)
      ) {
        // let b =
        //   tempData.insured_details
        //     ?.filter((value) => Number(value?.relation_id) !== 1)
        //     ?.map((item) => ({
        //       id: item?.relation_id,
        //       name: `${item?.relation_name} - ${item?.first_name}`,
        //       value: item?.relation_id,
        //     })) || [];
        let b = tempData.insured_details
          ?.filter((value) => Number(value?.member_relation_id) !== 1 &&
            (nominee_details?.every(({ nominee_fname, nominee_dob }) =>
              (value.member_firstname !== nominee_fname && value.member_dob !== nominee_dob))))
          ?.map((item) => ({
            id: item?.member_relation_id,
            name: `${relations?.find(({ id }) => +id === +item?.member_relation_id)?.name} - ${item?.member_firstname}`,
            value: item?.member_relation_id,
          })) || [];
        // b = b?.filter((data, i) => !a?.includes(Number(data?.id)));
        setNomineeRelation(b);
      } else if (_.isEmpty(nomineeConfig)) {
        // let b = members
        //   ?.filter((value) => [5, 6, 7, 8].includes(value?.nominee_relation_id))
        //   ?.map((data) => data?.nominee_relation_id);
        // if (!_.isEmpty(a)) {
        a = relations?.filter((value) => !a?.includes(value?.id));
        setNomineeRelation(a);
        // }
      }
    } else {
      if (Number(nomineeConfig?.allowed_relations_type) !== 1) {
        RelationDropDownHandler();
      }
      if (Number(nomineeConfig?.allowed_relations_type) === 1) {
        let b =
          tempData.insured_details
            ?.filter((value) => Number(value?.member_relation_id) !== 1)
            ?.map((item) => ({
              id: item?.member_relation_id,
              name: `${relations.find((({ id }) => +id === +item?.member_relation_id)?.name)} - ${item?.member_firstname}`,
              value: item?.member_relation_id,
            })) || [];
        setNomineeRelation(b);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempData.insured_details, nomineeConfig, flag]);

  useEffect(() => {
    updateFlag(prev => prev + 1)
  }, [fields.length])

  const onAddCount = () => {
    if (fields?.length === 5) {
      return swal('Validation', 'Limit reached', 'info')
    }
    append({ index: ''/* , is_primary: false  */ });
  }

  const onSubCount = (id) => {
    if (fields?.length === 1) {
      return
    }
    remove(id);
  }

  const PrefillData = (e, index) => {
    updateFlag(prev => prev + 1)
    if (e.target.value) {
      const nomineeDetail = tempData.insured_details.find(({ member_relation_id }) => +member_relation_id === +e.target.value)
      if (nomineeDetail) {
        setValue(`nominee_details[${index}].nominee_relation`, nomineeDetail.member_relation_id);
        setValue(`nominee_details[${index}].nominee_fname`, nomineeDetail.member_firstname);
        setValue(`nominee_details[${index}].nominee_lname`, nomineeDetail.member_lastname);
        setValue(`nominee_details[${index}].nominee_dob`, nomineeDetail.member_dob);
      }
    }
    return e
  }

  const onSubmit = ({ nominee_details }) => {

    if (nomineeConfig?.nominee_requirement === 1 && !nominee_details.length) {
      swal(`Nominee is mandatory for this policy`);
      return
    }
    if (nomineeConfig?.nominee_requirement === 2 && !nominee_details?.length) {
      tempStorage(dispatch, tempData, { handleNext })
      return
    }
    const isTotal100 = nominee_details.reduce((total, { share_per }) => total + Number(share_per), 0) === 100
    if (!isTotal100) {
      return swal('Validation', 'Total Share is not 100%', 'info')
    }
    tempStorage(dispatch, { ...tempData, flex_details: tempData?.flex_details.map((elem, index) => ({ ...elem, add_nominee: nomineeToAddConfig?.[index]?.nominee_requirement !== 3 ? 1 : 0 })), nominee_details: nominee_details.filter(elem => elem.nominee_relation && elem.share_per) }, { handleNext })
  }



  const onPrevious = () => {
    tempStorage(dispatch, { ...tempData, ...nominee_details.some(elem => elem.relation_id && elem.share_per) && { nominee_details: nominee_details.filter(elem => elem.relation_id && elem.share_per) } }, { handleNext: handleBack })
  }

  const getMeNomineeText = () => {
    const filterNomineeAllowes = tempData?.flex_details.filter((_, index) => nomineeToAddConfig?.[index]?.nominee_requirement !== 3)

    return filterNomineeAllowes.reduce((total, { plan_name }, index) => !total ? plan_name : `${total}${index + 1 === filterNomineeAllowes.length ? ' & ' : ','} ${plan_name}`, '') || ''
  }

  return (
    <form
      className="row m-0 w-100 justify-content-center mb-2 justify-content-sm-center justify-content-md-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-100' style={{ minHeight: '400px' }}>

        <h5 className="my-2">
          Nominee will be added to {getMeNomineeText()}
        </h5>
        {fields.map((field, index) => {
          const dob = watch(`nominee_details[${index}].nominee_dob`);
          const relation_id = watch(`nominee_details[${index}].nominee_relation`);
          const nominee_fname = watch(`nominee_details[${index}].nominee_fname`);

          const memberRelation = nomineeRelation
            .filter(({ id }) =>
              Number(nominee_details[index]?.nominee_relation) === Number(id) ||
              (!nominee_details?.some(({ nominee_relation }) =>
                Number(nominee_relation) === Number(id) && [2, 5, 6, 7, 8].includes(id))
              ));

          return <Accordion key={field.id} defaultActiveKey={/* packageIndex + */ 1} style={{
            boxShadow: '1px 1px 16px 0px #e7e7e7',
            borderRadius: '15px',
            width: '100%',
            marginBottom: '15px',
            border: errors.nominee_details?.[index] ? '1px solid red' : '1px solid #e8e8e8'
          }}>
            <Accordion.Toggle
              eventKey={/* packageIndex + */ 1} style={{
                width: '100%',
                border: 'none',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                background: 'white',
                padding: '10px',
                outline: 'none'

              }} className='d-flex justify-content-between align-items-center'>
              <div className='text-left mr-3 d-flex' style={{
                fontWeight: '500',
                fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
                letterSpacing: '1px',
                color: 'black'
              }}>
                Nominee {index + 1}
                {fields.length !== 1 && <td className="">
                  <i
                    className="btn ti-trash text-danger"
                    onClick={() => onSubCount(index)}
                  />
                </td>}
              </div>
              <ContextAwareToggle eventKey={/* packageIndex + */ 1} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={/* packageIndex + */ 1} style={{
              width: '100%',
              // paddingTop: '50px',
              paddingTop: '15px',
              background: 'white',
              borderTop: '2px solid #FFDF00',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px'
            }}>
              <>
                <div className="row m-0 w-100">
                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Select
                          label="Relation With Employee"
                          options={[...memberRelation, ...((!memberRelation.some(({ id }) => +id === +relation_id) && relation_id)) ? [{ id: relation_id, value: relation_id, name: Relation_Name[+relation_id] }] : []]}
                          valueName="name"
                          placeholder='Select Relation With Employee'
                          id="employee_relation"
                          isRequired={true}
                          required={false}
                        />
                      }
                      onChange={([e]) =>
                        (!nominee_fname || +relation_id !== +e.target.value) ? PrefillData(e, index) :
                          updateFlag(prev => prev + 1)
                      }
                      error={errors && errors.nominee_details?.[index]?.nominee_relation}
                      name={`nominee_details[${index}].nominee_relation`}
                      control={control}
                    />
                    {!!errors.nominee_details?.[index]?.nominee_relation && (
                      <Error>{errors.nominee_details[index].nominee_relation.message}</Error>
                    )}
                  </div>

                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          style={{
                            background: "white",
                          }}
                          label="First Name"
                          placeholder="Enter First Name"
                          maxLength={50}
                          isRequired={true}
                          required={false}
                          disabled={
                            relations?.length &&
                            Number(nomineeConfig?.allowed_relations_type) === 1
                          }
                        />
                      }
                      error={errors && errors.nominee_details?.[index]?.nominee_fname}
                      control={control}
                      name={`nominee_details[${index}].nominee_fname`}
                    />
                    {!!errors.nominee_details?.[index]?.nominee_fname && (
                      <Error>{errors.nominee_details[index].nominee_fname.message}</Error>
                    )}
                  </div>

                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          style={{
                            background: "white",
                          }}
                          label="Last Name"
                          placeholder="Enter Last Name"
                          maxLength={50}
                          required={false}
                          disabled={
                            relations?.length &&
                            Number(nomineeConfig?.allowed_relations_type) === 1
                          }
                        />
                      }
                      error={errors && errors.nominee_details?.[index]?.nominee_lname}
                      control={control}
                      name={`nominee_details[${index}].nominee_lname`}
                    />
                    {!!errors.nominee_details?.[index]?.nominee_lname && (
                      <Error>{errors.nominee_details[index].nominee_lname.message}</Error>
                    )}
                  </div>

                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          style={{ background: "white" }}
                          label="Date of Birth"
                          type="date"
                          disabled={
                            relations?.length &&
                            Number(nomineeConfig?.allowed_relations_type) === 1
                          }
                          isRequired={true}
                          required={false}
                        />
                      }
                      max={formatDate(subYears(new Date(), isAdult(Number(relation_id))))}
                      error={errors && errors.nominee_details?.[index]?.nominee_dob}
                      name={`nominee_details[${index}].nominee_dob`}
                      control={control}
                    />
                    {!!errors.nominee_details?.[index]?.nominee_dob && (
                      <Error>{errors.nominee_details[index].nominee_dob.message}</Error>
                    )}
                  </div>

                  <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                    <Controller
                      as={
                        <Input
                          label="Share %"
                          placeholder="Enter Share %"
                          min={1}
                          type="number"
                          isRequired={true}
                          required={false}
                        />
                      }
                      error={errors && errors.nominee_details?.[index]?.share_per}
                      control={control}
                      name={`nominee_details[${index}].share_per`}
                    />
                    {!!errors.nominee_details?.[index]?.share_per &&
                      <Error>{errors.nominee_details[index].share_per.message}</Error>}
                  </div>
                </div>
                {differenceInYears(new Date(), new Date(dob)) < 18 && (
                  <>
                    <div className="col-12">
                      <Marker />
                      <Typography>{"\u00A0"}Guardian</Typography>
                    </div>
                    <div className="row m-0 w-100">
                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Input
                              label="First Name"
                              placeholder="Enter First Name"
                              maxLength={50}
                              isRequired={true}
                              required={false}
                            />
                          }
                          error={errors && errors.nominee_details?.[index]?.guardian_fname}
                          control={control}
                          name={`nominee_details[${index}].guardian_fname`}
                        />
                        {!!errors.nominee_details?.[index]?.guardian_fname && (
                          <Error>{errors.nominee_details[index].guardian_fname.message}</Error>
                        )}
                      </div>

                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Input
                              label="Last Name"
                              placeholder="Enter Last Name"
                              maxLength={50}
                              required={false}
                            />
                          }
                          error={errors && errors.nominee_details?.[index]?.guardian_lname}
                          control={control}
                          name={`nominee_details[${index}].guardian_lname`}
                        />
                        {!!errors.nominee_details?.[index]?.guardian_lname && (
                          <Error>{errors.nominee_details[index].guardian_lname.message}</Error>
                        )}
                      </div>

                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={<Input label="Date of Birth" type="date"
                            isRequired={true}
                            required={false} />}
                          error={errors && errors.nominee_details?.[index]?.guardian_dob}
                          name={`nominee_details[${index}].guardian_dob`}
                          max={formatDate(subYears(new Date(), 18))}
                          control={control}
                        />
                        {!!errors.nominee_details?.[index]?.guardian_dob && (
                          <Error>{errors.nominee_details[index].guardian_dob.message}</Error>
                        )}
                      </div>

                      <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                        <Controller
                          as={
                            <Select
                              label="Relation With Nominee"
                              options={relations.filter(({ id }) => [5, 6, 9].includes(id))}
                              id="guardian_relation"
                              placeholder="Select Relation With Nominee"
                              isRequired={true}
                              required={false}
                            />
                          }
                          error={errors && errors.nominee_details?.[index]?.guardian_relation}
                          name={`nominee_details[${index}].guardian_relation`}
                          control={control}
                        />
                        {!!errors.nominee_details?.[index]?.guardian_relation && (
                          <Error>{errors.nominee_details[index].guardian_relation.message}</Error>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </>
            </Accordion.Collapse>
          </Accordion>
        })}

        <div className="col-12">
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center mr-3">
              <BTN
                type='button'
                buttonStyle={"outline"}
                onClick={onAddCount}>
                Add More +
              </BTN>
            </div>
          </div>
        </div>
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
              {...(nomineeConfig?.nominee_requirement === 2 && !(nominee_details[0]?.share_per || nominee_details[0]?.nominee_relation)) && { onClick: onSubmit }}

              type={(nomineeConfig?.nominee_requirement === 2 && !(nominee_details[0]?.share_per || nominee_details[0]?.nominee_relation)) ? 'button' : 'submit'}>
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
