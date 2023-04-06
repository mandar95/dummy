/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import swal from 'sweetalert';

import { Select, Input, Button, Marker, Typography } from 'components';
// import { CustomControl } from 'modules/user-management/AssignRole/option/style';
// import { Switch } from 'modules/user-management/AssignRole/switch/switch';

import { Wrapper, Title, FormWrapper, InputWrapper, SmallInput } from '../style';
import { useDispatch } from 'react-redux';
import { saveTempConfig } from '../../rfq.slice';
import { sortRelation, getRelationName } from '../helper';
import { numOnly, noSpecial } from '../../../../utils';
import { Error } from '../../../../components';



export const FamilyDetail = ({ configs, savedConfig, formId, moveNext }) => {

  const dispatch = useDispatch();
  const { control, errors, handleSubmit } = useForm({
    defaultValues: savedConfig || {}
  });
  const [members, setMembers] = useState(savedConfig.ages?.length || 1);
  // const [hasUnmarried, setHasUnmarried] = useState(savedConfig.has_unmarried_child ? true : false);
  // const [employeeInc, setEmployeeInc] = useState(savedConfig.is_employee_included ?? 1);
  const [showAgeLimit, setShowAgeLimit] = useState(savedConfig.ages?.map((elem) => !elem?.no_limit ? true : false) || []);
  const [memberRelation, setMemberRelation] = useState(savedConfig.ages?.map((elem) => String(elem?.relation_id || 1)) || [1]);
  const [memberError, setMemberError] = useState(false);
  // const employeeInc = watch("is_employee_included");

  // useEffect(() => {
  //   if (Number(employeeInc) === 0 && Number(members) === 1) {
  //     setMembers(2)
  //   }
  // }, [employeeInc, members])


  useEffect(() => {

    if (members) {
      let tempData = [...memberRelation];
      tempData.length = members
      for (let i = 0; i < members; i++) {
        if (!tempData[i] && savedConfig?.ages?.length && savedConfig?.ages[i]?.relation_id) {
          tempData[i] = String(savedConfig.ages[i]?.relation_id)
        }
      }
      setMemberRelation(tempData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members])


  const addCount = () => {
    if (members >= 15) {
      swal('Limit', 'Maximum 15 Relation Count Allowed', 'warning')
      return null
    }
    setMembers(prev => prev ? prev + 1 : 1);
  }

  const subCount = () => {
    setMembers(prev => prev === 1 ? 1 : prev - 1);
  }

  const filteredRelation = sortRelation(configs.familyLabels)

  const onSubmit = data => {
    if ((Number(members) !== memberRelation.filter((elem, index) =>
      (elem !== 'undefined' && elem !== 'null' && elem) || index === 0).length) &&
      Number(members) !== 1) {
      setMemberError(true)
      // swal("Validation","Relation not selected", "info");
      return
    }

    data.ages[0].relation_id = '1';

    const relations = data?.ages
    for (let i = 0; i < relations.length; i++) {
      if (!relations[i]?.no_limit && (Number(relations[i]?.relation_id) === 3 || Number(relations[i]?.relation_id) === 4)) {
        if (Number(relations[i]?.min_age) < 0 || Number(relations[i]?.min_age) > 150) {
          swal("Validation", getRelationName(configs?.relations, Number(relations[i].relation_id))
            + " Min age is wrong!\n* Should be in between 0-150\n* Should be less than Max Age", "info");
          return;
        }
        if (Number(relations[i]?.max_age) < 0 || Number(relations[i]?.max_age) < Number(relations[i]?.min_age) || Number(relations[i]?.max_age) > 150) {
          swal("Validation", getRelationName(configs?.relations, Number(relations[i].relation_id))
            + " Max age is wrong!\n* Should be in between 0-150\n* Should be more than Min Age", "info");
          return;
        }
      } else if (!relations[i]?.no_limit) {
        if (Number(relations[i]?.min_age) < 18 || Number(relations[i]?.min_age) > 150) {
          swal("Validation", getRelationName(configs?.relations, Number(relations[i].relation_id))
            + " Min age is wrong!\n* Should be in between 18-150\n* Should be less than Max Age", "info");
          return;
        }
        if (Number(relations[i]?.max_age) < 18 || Number(relations[i]?.max_age) < Number(relations[i]?.min_age) || Number(relations[i]?.max_age) > 150) {
          swal("Validation",
            getRelationName(configs?.relations, Number(relations[i].relation_id))
            + " Max age is wrong!\n* Should be in between 18-150\n* Should be more than Min Age", "info");
          return;
        }
      }
    }

    // const ages = refillRelations(data.ages)


    // if (onSave) onSave({ formId, data: result });
    dispatch(saveTempConfig({
      ...savedConfig,
      no_of_spouse: Number(data.no_of_spouse) || 0,
      no_of_children: Number(data.no_of_children) || 0,
      ages: data.ages.map(elem => ({ ...elem, no_limit: elem.no_limit ?? true, no_of_relation: Number(elem.no_of_relation) || 1 }))
    }))
    moveNext()
  };


  const _renderFamilyMembers = () => {

    return (
      <>
        <Marker />
        <Typography>{'\u00A0'} Allowed Relation in Policy</Typography>
        {[...Array(Number(members))].map((_, index) =>
          <React.Fragment key={`member-${index}`}>
            <Row>
              {index === 0 ? <Col xl={3} lg={3} md={6} sm={12} className="ml-2">
                <Controller
                  as={
                    <Input
                      label="Member Type"
                      placeholder="Select Member Type"
                      value='Self'
                      disabled
                      labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
                      error={errors && errors.members}
                    />
                  }
                  defaultValue={'Self'}
                  name={`dummy_data`}
                  control={control}
                // rules={{ required: true }}
                />
                <Controller
                  as={
                    <input
                      type="hidden"
                      value={1}
                    />
                  }
                  defaultValue={1}
                  name={`ages[0].relation_id`}
                  control={control}
                />
              </Col> :
                <Col xl={3} lg={3} md={6} sm={12} className="ml-2">
                  <Controller
                    as={
                      <Select
                        label="Member Type"
                        placeholder="Select Member Type"
                        options={filteredRelation
                          .filter((elem) => (!memberRelation.includes(String(elem.id)) || elem.id === Number(memberRelation[index])))
                          .map((elem) => ({ ...elem, value: elem.id }))}
                        required
                        error={memberError && (['undefined', 'null', ''].includes(memberRelation[index]) || !memberRelation[index])}
                      />
                    }
                    name={`ages[${index}].relation_id`}
                    control={control}
                    onChange={([e]) => {
                      const value = e.target.value
                      setMemberRelation(prev => {
                        prev[index] = value;
                        return [...prev];
                      })
                      return e
                    }}
                    rules={{ required: true }}
                  />
                </Col>}

              <Col xl={2} lg={2} md={6} sm={12} className="ml-3 my-auto">
                <InputWrapper className="custom-control custom-checkbox no-heading">
                  <Controller
                    as={
                      <input
                        id={`${index}-no-limit`}
                        className="custom-control-input"
                        type="checkbox"
                        defaultChecked={savedConfig.ages?.[index]?.no_limit ?? true}
                        defaultValue={savedConfig.ages?.[index]?.no_limit ?? true}
                      // required
                      />
                    }
                    name={`ages[${index}].no_limit`}
                    control={control}
                    onChange={([ev]) => {
                      const target = ev.target;
                      const checked = target ? target.checked : false;
                      setShowAgeLimit(prev => {
                        prev[index] = !checked;
                        return [...prev]
                      });
                      return checked;
                    }}
                  // rules={{ required: true }}
                  />
                  <label className="custom-control-label" htmlFor={`${index}-no-limit`}>No Age Limit</label>
                </InputWrapper>
              </Col>
              <Controller
                as={
                  <input
                    type="hidden"
                  />
                }
                name={`ages[${index}].relation_id`}
                control={control}
              // defaultValue={member.id}
              />
              {
                !!showAgeLimit[index] && (
                  <>
                    <Col xl={3} lg={3} md={6} sm={12} >
                      <SmallInput>
                        <Controller
                          as={
                            <Input
                              label="Min Age"
                              placeholder="ex 40"
                              type="number"
                              noWrapper
                              // min={isChild ? 0 : 18}
                              max={150}
                              required
                              error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["min_age"]}
                            />
                          }
                          name={`ages[${index}].min_age`}
                          control={control}
                          rules={{ required: true, min: 0, max: 150 }}
                        />
                      </SmallInput>
                    </Col>
                    <Col xl={3} lg={3} md={6} sm={12} >
                      <SmallInput>
                        <Controller
                          as={
                            <Input
                              label="Max Age"
                              placeholder="ex 40"
                              type="number"
                              // min={isChild ? 0 : 18}
                              max={150}
                              noWrapper
                              required
                              error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["max_age"]}
                            />
                          }
                          name={`ages[${index}].max_age`}
                          control={control}
                          rules={{ required: true, min: 0, max: 150 }}
                        />
                      </SmallInput>
                    </Col>
                  </>)
              }
            </Row>
            <Row className="pl-3 mt-4">
              {(Number(memberRelation[index]) === 2 || (Number(memberRelation[index]) === 3)) &&
                <Col xl={4} lg={5} md={6} sm={12}>
                  <Controller
                    as={
                      <Input
                        label={`No. of ${Number(memberRelation[index]) === 2 ? 'Spouse' : 'Child'} per Employee`}
                        placeholder="Enter no of relation"
                        minLength={1}
                        maxLength={1}
                        type="tel"
                        onKeyDown={numOnly} onKeyPress={noSpecial}
                        required={false}
                        isRequired={true}
                      />
                    }
                    defaultValue={'1'}
                    error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["no_of_relation"]}
                    rules={{ required: true, min: 1, validate: (value) => Number(value) < (Number(memberRelation[index]) === 2 ? 5 : 7) }}
                    name={`ages[${index}].no_of_relation`}
                    control={control}
                  />
                  {!!errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["no_of_relation"] && (
                    <Error>{
                      errors["ages"][`${index}`]["no_of_relation"]?.type === 'validate' ? `should be less than ${Number(memberRelation[index]) === 2 ? 5 : 7}` :
                        errors["ages"][`${index}`]["no_of_relation"].message}</Error>
                  )}
                </Col>
              }
            </Row>
          </React.Fragment>
        )
        }
        <Row className='mt-3'>
          <Col className="d-flex justify-content-end align-items-center">
            <Button buttonStyle="warning" type='button' onClick={addCount}>
              <i className="ti ti-plus"></i> Add{'\u00A0'}
            </Button>
            {members !== 1 &&
              <Button buttonStyle="danger" type='button' onClick={subCount}>
                <i className="ti ti-minus"></i> Remove
              </Button>
            }
          </Col>
        </Row>
        {/* <Row className="pl-3 mt-4">
          {memberRelation.includes('2') &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Spouse"
                    placeholder="Enter Spouse Limit"
                    min={1}
                    max={4}
                    type="number"
                    error={errors && errors['no_of_spouse']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 4 }}
                name="no_of_spouse"
                control={control}
              />
            </Col>
          }
          {memberRelation.includes('3') &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Daughter"
                    placeholder="Enter Daughter Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors['no_of_daughter']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_daughter"
                control={control}
              />
            </Col>
          }
          {memberRelation.includes('4') &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Son"
                    placeholder="Enter Son Limit"
                    min={1}
                    max={10}
                    type="number"
                    error={errors && errors['no_of_son']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1, max: 10 }}
                name="no_of_son"
                control={control}
              />
            </Col>
          }
        </Row> */}
        {/* <Row className="pl-3 mt-4">
          {
            (memberRelation.includes('3') ||
              memberRelation.includes('4')) &&
            <>
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Special Child"
                      placeholder="Special Child"
                      checked={savedConfig && savedConfig.has_special_child ? true : false}
                    />
                  }
                  control={control}
                  name="has_special_child"
                  valueName="checked"
                  onChange={([ev]) => ev.target.checked}
                />
              </Col>
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <Checkbox
                      label="Unmarried Child"
                      placeholder="Unmarried Child"
                    />
                  }
                  control={control}
                  defaultValue={savedConfig && savedConfig.has_unmarried_child ? true : false}
                  name="has_unmarried_child"
                  valueName="checked"
                  onChange={([ev]) => { setHasUnmarried(ev.target.checked); return ev.target.checked }}
                />
              </Col>
            </>}

          {hasUnmarried &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="Unmarried Child Max Age"
                    placeholder="Enter Unmarried Child Max Age"
                    min={18}
                    type="number"
                    error={errors && errors['unmarried_min_age']}
                  />
                }
                defaultValue={'18'}
                rules={{ required: true, min: 18 }}
                name="unmarried_min_age"
                control={control}
              />
            </Col>
          }

        </Row>
        <Row className="pl-3 mt-4">
          {(memberRelation.filter((elem) => ['3', '4'].includes(elem)).length >= 1) &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    label="No. of Twin Child"
                    placeholder="Enter Twin Child Limit"
                    min={1}
                    type="number"
                    error={errors && errors['max_twins']}
                  />
                }
                defaultValue={'1'}
                rules={{ required: true, min: 1 }}
                name="max_twins"
                control={control}
              />
            </Col>
          }
          {
            (memberRelation.includes('5') &&
              memberRelation.includes('6') &&
              memberRelation.includes('7') &&
              memberRelation.includes('8')) &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Checkbox
                    label="Parent Cross Selection"
                    placeholder="Parent Cross Selection"
                    checked={savedConfig && savedConfig.parent_cross_selection ? true : false}
                  />
                }
                control={control}
                name="parent_cross_selection"
                valueName="checked"
                onChange={([ev]) => ev.target.checked}
              />
            </Col>
          } 
        </Row>*/}
      </>
    );
  };

  return (
    // (configs
    //   && configs.family_constructs)
    // ? 
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          Family Construct
          {/* &amp; Relation (Age Limit) */}
        </h4>
      </Title>
      <FormWrapper>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          {/* <Row>
              <Col xl={4} lg={4} md={4} sm={12} className="ml-2 mb-4">
                <Controller
                  as={
                    <Input
                      label="No. of Allowed Members"
                      placeholder="No. of Allowed Members"
                      min={1}
                      max={15}
                      type="number"
                      required
                      error={errors && errors.no_of_member}
                    />
                  }
                  name="no_of_member"
                  control={control}
                  defaultValue={'1'}
                  // onChange={handleConstructChange}
                  rules={{ required: true, max: 15, min: 1 }}
                />
              </Col>
              <Col xl={4} lg={4} md={4} sm={12} className="ml-2 mb-4">
                <Head className='text-center'>Employee Included</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                    <input ref={register} name={'is_employee_included'} type={'radio'} value={1} defaultChecked={true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                    <input ref={register} name={'is_employee_included'} type={'radio'} value={0} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>
            </Row> */}

          {_renderFamilyMembers()}
        </form>
      </FormWrapper>
    </Wrapper>
    // : null
  )
}

