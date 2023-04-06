import React from 'react'
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { CustomAccordion } from 'components/accordion';
import AccordionHeader from 'components/accordion/accordion-header';
import AccordionContent from 'components/accordion/accordion-content';
import { Controller } from 'react-hook-form';
import { Input, Head } from 'components';
import { AccordionWrapper, Heading } from './styles';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
// import { InputWrapper } from '../member-details/styles';
import { sortRelation } from '../../../RFQ/plan-configuration/helper';

const Error = styled.div`
margin-top: -10px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
text-align: center;
color: red;
`

const AdditionalPremium = ({ configs, savedConfig, control, errors, opd, register, watch, premiumType, opd_ipd }) => {

  const parentType = Number(watch('parent_contribution_type')) || 1;


  // const handlePremiumLimitChange = ([ev]) => {
  //   const target = ev.target;
  //   const checked = target ? target.checked : false;
  //   // setShowAgeLimit(prev => !checked);
  //   return checked;
  // };

  const filteredRelation = sortRelation(configs.familyLabels);

  const _renderContributions = () => {

    if (configs && savedConfig && savedConfig.ages.length > 0) {

      // const relationContris = configs.relations.slice(0, savedConfig.ages.length);
      if (parentType === 1 || !savedConfig.is_parent_policy)

        return (
          <Row>
            {
              savedConfig.ages.map((contri, index) => {
                // const showPremiumLimit = watch(`ages${opd}[${index}].additional_premium_limit`);
                const relName = filteredRelation.find((elem) => elem.id === Number(contri?.relation_id))?.name || 'Self';

                return !!(contri && ((Number(savedConfig.is_employee_included) && Number(contri.relation_id) === 1) || Number(contri.relation_id) !== 1)) &&
                  ([11, 12].includes(premiumType) ? ![5, 6, 7, 8].includes(Number(contri.relation_id)) : true) &&
                  (<Col key={`${contri.relation_id}-contri`} xl={4} lg={4} md={6} sm={12}>
                    <AccordionWrapper>
                      <CustomAccordion id="contribution-all" defaultOpen>
                        <AccordionHeader>
                          <Heading>{`${relName} Contribution`}</Heading>
                        </AccordionHeader>
                        <AccordionContent>
                          <Row>
                            {/* <Col className="ml-3" xl='12' lg='12' md='12' sm='12'>
                              <InputWrapper className="custom-control custom-checkbox no-heading">
                                <Controller
                                  as={
                                    <input
                                      id={`${relName}-no-limit`}
                                      className="custom-control-input"
                                      type="checkbox"
                                    // required
                                    />
                                  }
                                  name={`ages${opd}[${index}].additional_premium_limit`}
                                  control={control}
                                  onChange={handlePremiumLimitChange}
                                  //defaultValue={}
                                // rules={{ required: true }}
                                />
                                <label className="custom-control-label" htmlFor={`${relName}-no-limit`}>No Premium</label>
                              </InputWrapper>
                            </Col> */}
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Premium"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    // required
                                    error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["additional_premium"]}
                                  />
                                }
                                name={`ages${opd}[${index}].additional_premium`}
                                control={control}
                              // rules={{ required: true }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employer%"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    required
                                    error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employer_contribution"]}
                                  />
                                }
                                // defaultValue={savedConfig[`ages${opd}`][index]?.employee_contribution === 100 ?
                                //   '0' : ''}
                                name={`ages${opd}[${index}].employer_contribution`}
                                control={control}
                                rules={{ required: true }}
                              />
                              {errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && <Error>{errors["ages" + opd][`${index}`]["employer_contribution"]?.message}</Error>}
                            </Col>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employee%"
                                    placeholder="ex 40"
                                    type="number"
                                    min={0}
                                    required
                                    noWrapper
                                    error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employee_contribution"]}
                                  />
                                }
                                // defaultValue={savedConfig[`ages${opd}`][index]?.employer_contribution === 100 ?
                                //   '0' : ''}
                                name={`ages${opd}[${index}].employee_contribution`}
                                control={control}
                                rules={{ required: true }}
                              />
                              {errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && <Error>{errors["ages" + opd][`${index}`]["employee_contribution"]?.message}</Error>}
                            </Col>
                          </Row>
                        </AccordionContent>
                      </CustomAccordion>
                    </AccordionWrapper>
                  </Col>)
              })
            }
          </Row>
        )
      if (parentType === 2) {
        return (<Row>{savedConfig.ages.some((age) => [5, 6].includes(Number(age?.relation_id))) && <Col xl={4} lg={4} md={6} sm={12}>
          <AccordionWrapper>
            <CustomAccordion id="contribution-all" defaultOpen>
              <AccordionHeader>
                <Heading>{'Parent Contribution'}</Heading>
              </AccordionHeader>
              <AccordionContent>
                <Row>
                  <Col>
                    <Controller
                      as={
                        <Input
                          label="Premium"
                          placeholder="ex 40"
                          type="number"
                          noWrapper
                          min={0}
                          required
                        // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["additional_premium"]}
                        />
                      }
                      // name={`ages${opd}[${index}].additional_premium`}
                      name={`parent_contribution${opd}.additional_premium`}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Controller
                      as={
                        <Input
                          label="Employer%"
                          placeholder="ex 40"
                          type="number"
                          noWrapper
                          min={0}
                          required
                        // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employer_contribution"]}
                        />
                      }
                      // name={`ages${opd}[${index}].employer_contribution`}
                      name={`parent_contribution${opd}.employer_contribution`}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Col>
                  <Col>
                    <Controller
                      as={
                        <Input
                          label="Employee%"
                          placeholder="ex 40"
                          type="number"
                          min={0}
                          required
                          noWrapper
                        // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employee_contribution"]}
                        />
                      }
                      // name={`ages${opd}[${index}].employee_contribution`}
                      name={`parent_contribution${opd}.employee_contribution`}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Col>
                </Row>
              </AccordionContent>
            </CustomAccordion>
          </AccordionWrapper>
        </Col>}
          {savedConfig.ages.some((age) => [7, 8].includes(Number(age?.relation_id))) && <Col xl={4} lg={4} md={6} sm={12}>
            <AccordionWrapper>
              <CustomAccordion id="contribution-all" defaultOpen>
                <AccordionHeader>
                  <Heading>{'Parent Inlaw Contribution'}</Heading>
                </AccordionHeader>
                <AccordionContent>
                  <Row>
                    <Col>
                      <Controller
                        as={
                          <Input
                            label="Premium"
                            placeholder="ex 40"
                            type="number"
                            noWrapper
                            min={0}
                            required
                          // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["additional_premium"]}
                          />
                        }
                        // name={`ages${opd}[${index}].additional_premium`}
                        name={`parentinlaw_contribution${opd}.additional_premium`}
                        control={control}
                        rules={{ required: true }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Controller
                        as={
                          <Input
                            label="Employer%"
                            placeholder="ex 40"
                            type="number"
                            noWrapper
                            min={0}
                            required
                          // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employer_contribution"]}
                          />
                        }
                        // name={`ages${opd}[${index}].employer_contribution`}
                        name={`parentinlaw_contribution${opd}.employer_contribution`}
                        control={control}
                        rules={{ required: true }}
                      />
                    </Col>
                    <Col>
                      <Controller
                        as={
                          <Input
                            label="Employee%"
                            placeholder="ex 40"
                            type="number"
                            min={0}
                            required
                            noWrapper
                          // error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employee_contribution"]}
                          />
                        }
                        // name={`ages${opd}[${index}].employee_contribution`}
                        name={`parentinlaw_contribution${opd}.employee_contribution`}
                        control={control}
                        rules={{ required: true }}
                      />
                    </Col>
                  </Row>
                </AccordionContent>
              </CustomAccordion>
            </AccordionWrapper>
          </Col>}</Row>)
      }

      if (parentType === 3) {
        return (<Row>
          {
            savedConfig.ages.map((contri, index) =>
              !!(contri?.relation_id && ((Number(savedConfig.is_employee_included) && Number(contri?.relation_id) === 1) || Number(contri?.relation_id) !== 1)) &&
              (<Col key={`${contri?.relation_id}-contri`} xl={4} lg={4} md={6} sm={12}>
                <AccordionWrapper>
                  <CustomAccordion id="contribution-all" defaultOpen>
                    <AccordionHeader>
                      <Heading>{`${index} Parent Contribution`}</Heading>
                    </AccordionHeader>
                    <AccordionContent>
                      <Row>
                        <Col>
                          <Controller
                            as={
                              <Input
                                label="Premium"
                                placeholder="ex 40"
                                type="number"
                                noWrapper
                                min={0}
                                required
                                error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["additional_premium"]}
                              />
                            }
                            name={`ages${opd}[${index}].additional_premium`}
                            control={control}
                            rules={{ required: true }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Controller
                            as={
                              <Input
                                label="Employer%"
                                placeholder="ex 40"
                                type="number"
                                noWrapper
                                min={0}
                                required
                                error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employer_contribution"]}
                              />
                            }
                            name={`ages${opd}[${index}].employer_contribution`}
                            control={control}
                            rules={{ required: true }}
                          />
                          {errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && <Error>{errors["ages" + opd][`${index}`]["employer_contribution"]?.message}</Error>}
                        </Col>
                        <Col>
                          <Controller
                            as={
                              <Input
                                label="Employee%"
                                placeholder="ex 40"
                                type="number"
                                min={0}
                                required
                                noWrapper
                                error={errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && errors["ages" + opd][`${index}`]["employee_contribution"]}
                              />
                            }
                            name={`ages${opd}[${index}].employee_contribution`}
                            control={control}
                            rules={{ required: true }}
                          />
                          {errors && errors["ages" + opd] && errors["ages" + opd][`${index}`] && <Error>{errors["ages" + opd][`${index}`]["employee_contribution"]?.message}</Error>}
                        </Col>
                      </Row>
                    </AccordionContent>
                  </CustomAccordion>
                </AccordionWrapper>
              </Col>))
          }
        </Row>)
      }
    }
    return null;
  };


  return (<>
    {!!savedConfig.is_parent_policy && [1, 2].includes(opd_ipd) &&
      <Col md={6} lg={6} xl={6} sm={12} className='mx-auto'>
        <Head className='text-center'>Parent Contribution Type</Head>
        <div className="d-flex justify-content-around flex-wrap mt-2 text-nowrap" style={{ margin: '0px 32px 50px -58px' }}>
          <CustomControl className="d-flex mt-4 mr-0">
            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Basic"}</p>
            <input ref={register} name={'parent_contribution_type' + opd} type={'radio'} value={'1'} defaultChecked={true} />
            <span></span>
          </CustomControl>
          <CustomControl className="d-flex mt-4 ml-0">
            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Parent Pair"}</p>
            <input ref={register} name={'parent_contribution_type' + opd} type={'radio'} value={'2'} />
            <span></span>
          </CustomControl>
          <CustomControl className="d-flex mt-4 ml-0">
            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No. of Parent"}</p>
            <input ref={register} name={'parent_contribution_type' + opd} type={'radio'} value={'3'} />
            <span></span>
          </CustomControl>
        </div>
      </Col>
      // <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
      //   <Controller
      //     as={
      //       <Select
      //         label="parent_policy_type"
      //         placeholder="Select Parent Policy Type"
      //         options={[
      //           { id: 1, name: 'Basic', value: 1 },
      //           { id: 2, name: 'Parent Pair', value: 2 },
      //           { id: 3, name: 'No of Parent', value: 3 }]}
      //         error={errors && errors.parent_policy_type}
      //       />
      //     }
      //     defaultValue='1'
      //     onChange={([selected]) => {
      //       const target = selected.target;
      //       const value = target ? target.value : '';
      //       setParentType(Number(value));
      //       return selected;
      //     }}
      //     control={control}
      //     name={"parent_policy_type" + opd}
      //   />
      //   {!!errors.parent_policy_type && <Error>
      //     {errors.parent_policy_type.message}
      //   </Error>}
      // </Col>
    }
    {_renderContributions()}
  </>);
};

export default AdditionalPremium;
