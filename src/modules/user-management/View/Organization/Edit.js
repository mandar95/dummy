import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import * as yup from 'yup';

import { Input, Button, Error } from "components";
import { Row, Col, Form } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { userUpdate, insurerUpdate } from '../../user.slice';
import { useForm, Controller } from "react-hook-form";
import { numOnly, noSpecial } from "utils";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from "modules/policies/approve-policy/style";
import { AttachFile2 } from '../../../core';
import { ModuleControl } from '../../../../config/module-control';
import { common_module } from 'config/validations';
import { CardComponent, Color, Flex } from '../../Onboard/Select/style';
import { Head } from '../../../../components';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

const validation = common_module.onboard;

export const EditOrganization = ({ Data, Submitted, userType, themes }) => {

  const { userType: currentUserType, currentUser } = useSelector(state => state.login);

  const [themeState, setThemeState] = useState(0);


  const dispatch = useDispatch();
  const validationSchema = yup.object().shape({
    name: /* userType === 'employer' ? */ yup.string().required('Name required')
    /* :
      yup.string().required('Name required').test('alphabets', 'Name must contain only alphabets', (value) => {
        return /^([A-Za-z\s])+$/.test(value?.trim());
      }) */,
    email_1: yup.string().email('must be a valid email').required(),
    contact: yup.string()
      .required('Mobile No. is required')
      .min(10, 'Mobile No. should be 10 digits')
      .max(10, 'Mobile No. should be 10 digits')
      .matches(validation.contact.regex, 'Not valid number').nullable(),
    // .test('invalid', 'Not valid number', (value) => {
    //   return !/^[9]{10}$/.test(value);
    // }),
    email_2: yup.string().email('must be a valid email').nullable(),
    contact_2: yup.string()
      // .required('Mobile No. is required')
      // .min(10, 'Mobile No. should be 10 digits')
      .max(10, 'Mobile No. should be 10 digits')
      // .matches(validation.contact.regex, 'Not valid number').nullable(),
      .test('invalid', 'Not valid number', (value) => {
        if (!value) return true;
        return validation.contact.regex.test(value);
      }),
    email_3: yup.string().email('must be a valid email').nullable(),
    contact_3: yup.string()
      // .required('Mobile No. is required')
      // .min(10, 'Mobile No. should be 10 digits')
      .max(10, 'Mobile No. should be 10 digits')
      // .matches(validation.contact.regex, 'Not valid number')
      .test('invalid', 'Not valid number', (value) => {
        if (!value) return true;
        return validation.contact.regex.test(value);
      }),
    ...userType === 'employer' && {
      PAN: yup
        .string()
        .required("PAN no required")
        .min(
          validation.PAN.length,
          `PAN must consist ${validation.PAN.length} digits`
        )
        .max(
          validation.PAN.length,
          `PAN must consist ${validation.PAN.length} digits`
        )
        .matches(validation.PAN.regex, "PAN number invalid")
    },
    ...userType === 'employer' && {
      GSTIN: yup
        .string()
        .required("GST no required")
        .min(
          validation.GST.length,
          `GST must consist ${validation.GST.length} digits`
        )
        .max(
          validation.GST.length,
          `GST must consist ${validation.GST.length} digits`
        )
        .matches(validation.GST.regex, "GST number invalid")
    },
  });

  const { control, reset, errors, handleSubmit, register, watch } = useForm({
    validationSchema,
    defaultValues: {
      name: Data?.name,
      email_1: Data?.email_1,
      contact: Data?.contact_1,
      email_2: Data?.email_2,
      contact_2: Data?.contact_2 || '',
      email_3: Data?.email_3,
      contact_3: Data?.contact_3 || '',
      PAN: Data?.PAN || '',
      GSTIN: Data?.GSTIN || '',
      ip_checking: String(Data?.ip_checking),
      ...(["employer", 'broker'].includes(userType) && {
        has_chatbot_service: Data?.has_chatbot_service || 0,
        ...Data.tfa_enabled && { tfa_enabled: Data.tfa_enabled || 0 },
        ...Data.tfa_type && { tfa_type: Data.tfa_type || 1 },
      })
    }
  });

  const tfa_enabled = watch("tfa_enabled");

  useEffect(() => {
    if (!_.isEmpty(Data)) {
      setThemeState(Data.theme_id);
      reset({
        name: Data?.name,
        email_1: Data?.email_1,
        contact: Data?.contact_1,
        email_2: Data?.email_2,
        contact_2: Data?.contact_2 || '',
        email_3: Data?.email_3,
        contact_3: Data?.contact_3 || '',
        PAN: Data?.PAN || '',
        GSTIN: Data?.GSTIN || '',
        ip_checking: String(Data?.ip_checking),
        ...(["employer", 'broker'].includes(userType) && {
          has_chatbot_service: Data?.has_chatbot_service || 0,
          ...Data.tfa_enabled && { tfa_enabled: Data.tfa_enabled || 0 },
          ...Data.tfa_type && { tfa_type: String(Data.tfa_type || 1) },
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Data])

  const onSubmit = data => {
    const {
      contact = Data?.contact_1,
      email_1 = Data?.email_1,
      name = Data?.name,
      contact_2 = Data?.contact_2,
      email_2 = Data?.email_2,
      contact_3 = Data?.contact_3,
      email_3 = Data?.email_3,
      PAN,
      GSTIN,
      tfa_enabled,
      tfa_type,
      ip_checking
    } = data;


    userType !== 'insurer' ?
      dispatch(userUpdate({
        contact, email_1, name,
        ...(contact_2 && { contact_2 }),
        ...(contact_3 && { contact_3 }),
        ...(email_2 && { email_2 }),
        ...(email_3 && { email_3 }),
        ...PAN && PAN !== Data?.PAN && { PAN },
        ...GSTIN && GSTIN !== Data?.GSTIN && { GSTIN },
        ...themeState && themeState !== Data?.theme_id && { theme_id: themeState },
        ...(["employer", 'broker'].includes(userType) && {
          has_chatbot_service: data?.has_chatbot_service,
          tfa_enabled,
          ...tfa_type && { tfa_type },
        }),
        ...(['broker'].includes(userType) && {
          ip_checking
        }),
        status: 1,
        _method: "PATCH"
      }, Data?.id, userType, false, data.logo)) :
      dispatch(insurerUpdate({
        name,
        contact_no_1: contact,
        email: email_1,
        status: 1,
      }, Data?.id));

    Submitted();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="d-flex flex-wrap justify-content-center">
        <Col md={6} lg={4} xl={4} sm={12}>
          <Controller
            as={<Input label="Name" name="name" placeholder={"Enter Name"} required />}
            name="name"
            error={errors && errors.name}
            control={control}
          />
          {!!errors.name &&
            <Error>
              {errors.name.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={4} sm={12}>
          <Controller
            as={<Input label="Email" type="email" placeholder={"Enter Email"} required />}
            name="email_1"
            error={errors && errors.email_1}
            control={control}
          />
          {!!errors.email_1 &&
            <Error>
              {errors.email_1.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={4} sm={12}>
          <Controller
            as={<Input label="Mobile No"
              type='tel'
              maxLength={10}
              onKeyDown={numOnly} onKeyPress={noSpecial} placeholder={"Enter Mobile No"} required />}
            name="contact"
            error={errors && errors.contact}
            control={control}
          />
          {!!errors.contact &&
            <Error>
              {errors.contact.message}
            </Error>}
        </Col>
        {userType !== 'insurer' && <><Col md={6} lg={4} xl={4} sm={12}>
          <Controller
            as={<Input label="Email(Optional 1)" type="email" placeholder={"Enter Email"} />}
            name="email_2"
            error={errors && errors.email_2}
            control={control}
          />
          {!!errors.email_2 &&
            <Error>
              {errors.email_2.message}
            </Error>}
        </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Email(Optional 2)" type="email" placeholder={"Enter Email"} />}
              name="email_3"
              error={errors && errors.email_3}
              control={control}
            />
            {!!errors.email_3 &&
              <Error>
                {errors.email_3.message}
              </Error>}
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Mobile No(Optional 1)"
                type='tel'
                maxLength={10}
                onKeyDown={numOnly} onKeyPress={noSpecial} placeholder={"Enter Mobile No"} />}
              name="contact_2"
              error={errors && errors.contact_2}
              control={control}
            />
            {!!errors.contact_2 &&
              <Error>
                {errors.contact_2.message}
              </Error>}
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={<Input label="Mobile No(Optional 2)"
                type='tel'
                maxLength={10}
                onKeyDown={numOnly} onKeyPress={noSpecial} placeholder={"Enter Mobile No"} />}
              name="contact_3"
              error={errors && errors.contact_3}
              control={control}
            />
            {!!errors.contact_3 &&
              <Error>
                {errors.contact_3.message}
              </Error>}
          </Col>
          {userType === 'employer' && <>
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <Input
                    onInput={(e) =>
                      (e.target.value = ("" + e.target.value).toUpperCase())
                    }
                    label={'PAN No.'}
                    maxLength={validation.PAN.length}
                    placeholder={'Enter PAN No.'}
                    required
                  />
                }
                name="PAN"
                error={errors && errors.PAN}
                control={control}
              />
              {!!errors.PAN && <Error>{errors.PAN.message}</Error>}
            </Col>
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <Input
                    onInput={(e) =>
                      (e.target.value = ("" + e.target.value).toUpperCase())
                    }
                    label={'GST No.'}
                    maxLength={validation.GST.length}
                    placeholder={'Enter GST No.'}
                    required
                  />
                }
                name="GSTIN"
                error={errors && errors.GSTIN}
                control={control}
              />
              {!!errors.GSTIN && <Error>{errors.GSTIN.message}</Error>}
            </Col>
          </>}
        </>}

      </Row>
      <Row>
        {userType === 'employer' && ModuleControl.ChatBot && currentUserType !== 'Employer' && <Col xl={12} lg={12} md={12} sm={12}>
          <TextCard
            className="pl-3 pr-3 mb-4 mt-4"
            borderRadius="10px"
            noShadow
            border="1px dashed #929292"
            bgColor="#f8f8f8"
          >
            <CustomCheck className="custom-control-checkbox">
              <label className="custom-control-label-check  container-check">
                <span>
                  {
                    "Will this employer want to enable chatbot service ?"
                  }
                </span>
                <Controller
                  as={
                    <input
                      name={"has_chatbot_service"}
                      type="checkbox"
                      defaultChecked={!!Data?.has_chatbot_service || false}
                    />
                  }
                  name={"has_chatbot_service"}
                  onChange={([e]) => (e.target.checked ? 1 : 0)}
                  control={control}
                  defaultValue={0}
                />
                <span className="checkmark-check"></span>
              </label>
            </CustomCheck>
          </TextCard>
        </Col>}
        {currentUserType !== 'Employer' && (currentUser.ic_user_type_id === 1 || currentUserType === 'Super Admin') &&
          ModuleControl.TwoFactorAuthentication.allowed && (
            <>
              <Col xl={12} lg={12} md={12} sm={12}>
                <TextCard
                  className="pl-3 pr-3 mb-4 mt-4"
                  borderRadius="10px"
                  noShadow
                  border="1px dashed #929292"
                  bgColor="#f8f8f8"
                >
                  <Row className="d-flex my-3">
                    <Col md={6} lg={6} xl={4} sm={12}>
                      <CustomCheck className="custom-control-checkbox">
                        <label className="custom-control-label-check  container-check">
                          <span>

                            {
                              "2 Factor Authentication for this " + (userType === 'employer' ? "Employer & it's Employees?" : "Broker?")
                            }
                          </span>
                          <Controller
                            as={
                              <input
                                name={"tfa_enabled"}
                                type="checkbox"
                                defaultChecked={!!Data?.tfa_enabled || false}
                              />
                            }
                            name={"tfa_enabled"}
                            onChange={([e]) => (e.target.checked ? 1 : 0)}
                            control={control}
                            defaultValue={0}
                          />
                          <span className="checkmark-check"></span>
                        </label>
                      </CustomCheck>
                    </Col>
                    {Number(tfa_enabled) === 1 &&
                      <Col md={6} lg={6} xl={4} sm={12}>
                        <Head className='text-center'>Authorization Medium?</Head>
                        <div className="d-flex justify-content-around flex-wrap mt-2">
                          {(ModuleControl.TwoFactorAuthentication.onlyEmail || ModuleControl.TwoFactorAuthentication.both) && <CustomControl className="d-flex mt-4 mr-0">
                            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Email"}</p>
                            <input ref={register} name={'tfa_type'} type={'radio'} value={1} defaultChecked={true} />
                            <span></span>
                          </CustomControl>}
                          {(ModuleControl.TwoFactorAuthentication.onlySms || ModuleControl.TwoFactorAuthentication.both) && <CustomControl className="d-flex mt-4 ml-0">
                            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"SMS"}</p>
                            <input ref={register} name={'tfa_type'} type={'radio'} value={2} />
                            <span></span>
                          </CustomControl>}
                          {ModuleControl.TwoFactorAuthentication.both && <CustomControl className="d-flex mt-4 ml-0">
                            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Both"}</p>
                            <input ref={register} name={'tfa_type'} type={'radio'} value={3} />
                            <span></span>
                          </CustomControl>}
                        </div>
                      </Col>}
                  </Row>
                  {userType === 'broker' && <Row className="d-flex my-3">
                    <Col md={6} lg={6} xl={4} sm={12}>
                      <CustomCheck className="custom-control-checkbox">
                        <label className="custom-control-label-check  container-check">
                          <span>Activate White List IP</span>
                          <Controller
                            as={
                              <input
                                name={"ip_checking"}
                                type="checkbox"
                                defaultChecked={!!Data?.ip_checking}
                              />
                            }
                            name={"ip_checking"}
                            onChange={([e]) => (e.target.checked ? 1 : 0)}
                            control={control}
                          // defaultValue={0}
                          />
                          <span className="checkmark-check"></span>
                        </label>
                      </CustomCheck>
                    </Col>
                  </Row>}
                </TextCard>
              </Col>

            </>
          )}
        <Col md={6} lg={6} xl={6} sm={12}>
          <AttachFile2
            // required={true}
            fileRegister={register}
            name={'logo'}
            title={'Update Logo'}
            key="logo_file"
            accept=".jpeg, .png, .jpg"
            description="File Formats: jpeg, png, jpg"
            nameBox
          />
        </Col>

      </Row>
      {/* Select Theme */}
      <Row className="d-flex flex-wrap m-0">
        {themes?.map((theme) => {
          const { name, data, id } = theme;
          const Selected = themeState === id;

          return (
            <Col key={name + id} sm={12} md={12} lg={6} xl={4}>
              <CardComponent
                border={Selected}
                onClick={() => {
                  setThemeState(id);
                }}
              >
                <p>{name}</p>
                <Flex>
                  <Color bgColor={data.Card.color} />
                  <Color bgColor={data.CardBlue.color} />
                  <Color bgColor={data.CardLine.color} />
                  <Color bgColor={data.Tab.color} />
                </Flex>
                <Flex>
                  <Color bgColor={data.Button.default.background} />
                  <Color bgColor={data.Button.danger.background} />
                  <Color bgColor={data.Button.outline.background} />
                  <Color bgColor={data.Button.warning.background} />
                </Flex>
                <Flex>
                  <Color
                    bgColor={data.Button.outline_secondary.background}
                  />
                  <Color bgColor={data.Button.square_outline.background} />
                  <Color bgColor={data.Button.outline_solid.background1} />
                  <Color bgColor={data.Button.outline_solid.background2} />
                </Flex>
                <Flex>
                  <Color bgColor={data.PrimaryColors.color1} />
                  <Color bgColor={data.PrimaryColors.color2} />
                  <Color bgColor={data.PrimaryColors.color3} />
                  <Color bgColor={data.PrimaryColors.color4} />
                </Flex>
              </CardComponent>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col>
          <div className="float-right flex-d justify-content-end" style={{ right: "25px" }} >
            <Button type="submit">Submit</Button>
          </div>
        </Col>
      </Row>
    </Form>
  )
}
