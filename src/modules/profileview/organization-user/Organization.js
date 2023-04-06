import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import * as yup from 'yup';

import { CardBlue, Head, Text, Input, Error, Button } from "../../../components";
import { Row, Col } from "react-bootstrap";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { common_module } from 'config/validations'
import { selectError, selectSuccess, userUpdate, clear } from '../../user-management/user.slice';
import { getProfileDetails } from '../profileview.slice';
import { getUserDetails, loadCurrentUser } from '../../core/form/login.slice';
import { AttachFile2 } from '../../core';
import { CustomCheck } from "modules/policies/approve-policy/style";
import { ModuleControl } from '../../../config/module-control';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
import { TFA_TYPES } from '../../user-management/View/Organization/View';

const validation = common_module.onboard;

const validationSchema = (is_employer) => yup.object().shape({
  name: yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`),
  // .matches(validation.name.regex, "Name must contain only alphabets"),
  ...is_employer && {
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
      .matches(validation.PAN.regex, "PAN number invalid"),
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
      .matches(validation.GST.regex, "GST number invalid"),
  }
})

export default function Organization({ userData, userType, userTypeName, currentUser }) {

  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  useEffect(() => {
    if (userData.name && edit) {
      reset({
        name: userType === 'Broker' ? userData.broker_name : userData.employer_name,
        PAN: userData?.PAN || '',
        GSTIN: userData?.GSTIN || '',
        ip_checking: userData?.ip_checking,
        ...(['Broker'].includes(userType) && {
          has_chatbot_service: userData?.has_chatbot_service || 0,
          ...userData.tfa_enabled && { tfa_enabled: userData.tfa_enabled || 0 },
          ...userData.tfa_type && { tfa_type: String(userData.tfa_type || 1) },
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, edit])

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    };
    if (success) {
      swal('Success', success, "success");
      changeEdit()
      getUser()
      dispatch(getProfileDetails(Number(currentUser.profile_master) ? { id: currentUser.id, master_id: userTypeName === 'Broker' ? 3 : 4 } : {}));
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const getUser = () => {
    getUserDetails({ master_user_type_id: userTypeName === 'Broker' ? 3 : 4, user_id: currentUser.id }).then(() => {
      dispatch(loadCurrentUser())
    })
  }


  const { control, errors, register, handleSubmit, reset, watch } = useForm({
    validationSchema: validationSchema(userTypeName === 'Employer'),
    mode: "onBlur",
    reValidateMode: "onBlur"
  });

  const tfa_enabled = watch("tfa_enabled");

  const onSubmit = ({ name, logo, PAN, GSTIN, ip_checking, tfa_enabled, tfa_type }) => {

    const formdata = new FormData();
    formdata.append("name", name);
    if (userType === 'Broker' && currentUser.ic_user_type_id === 1) {
      formdata.append("ip_checking", ip_checking);
      formdata.append("tfa_enabled", tfa_enabled);
      tfa_type && formdata.append("tfa_type", tfa_type);
    }

    PAN && userData?.PAN !== PAN && formdata.append("PAN", PAN);
    GSTIN && userData?.GSTIN !== GSTIN && formdata.append("GSTIN", GSTIN);

    logo.length && formdata.append("logo", logo[0]);
    formdata.append("status", 1);
    formdata.append("_method", "PATCH");

    dispatch(userUpdate(formdata, userType === 'Broker' ?
      userData.broker_id : userData.employer_id,
      userType.toLowerCase(), true))
  };

  const changeEdit = () => {
    setEdit(prev => !prev)
  }


  const Show = (
    <Row className="mt-3 flex-wrap">
      <Col xs={12} md={6} lg={4} xl={4} sm={12}>
        <Head>Name</Head>
        <Text>{(userType === 'Broker' ? userData.broker_name : userData.employer_name) || "-"}</Text>
      </Col>
      {userType === 'Employer' && <>
        {!!userData.PAN && <Col xs={12} md={6} lg={4} xl={4} sm={12}>
          <Head>PAN No.</Head>
          <Text>{userData.PAN}</Text>
        </Col>}
        {!!userData.GSTIN && <Col xs={12} md={6} lg={4} xl={4} sm={12}>
          <Head>GST No.</Head>
          <Text>{userData.GSTIN}</Text>
        </Col>}
      </>}
      {userType === 'Broker' && currentUser.ic_user_type_id === 1 && ModuleControl.TwoFactorAuthentication.allowed && <>
        <Col md={6} lg={4} xl={4} sm={12} >
          <Head>IP or Email Address WhiteListing</Head>
          <Text>{userData.ip_checking ? 'Activated' : 'Deactivated'}</Text>
        </Col>
        {!!userData.tfa_enabled &&
          <Col xs={12} md={6} lg={4} xl={4} sm={12}>
            <Head>2 Factor Authentication for this {userType === 'broker' ? "Broker?" : "Employer & it's Employees"}</Head>
            <Text>Yes and its authorization medium {TFA_TYPES[userData.tfa_type]}</Text>
          </Col>}
      </>}

      {!!userData.branding && <Col xs={12} md={6} lg={4} xl={4} sm={12}>
        <Head>Logo</Head>
        <img width='150px' height='auto' src={userData.branding} alt='logo' />
      </Col>}

    </Row>
  )

  const Edit = (<form onSubmit={handleSubmit(onSubmit)}>
    <Row className="d-flex flex-wrap">
      <Col md={12} lg={6} xl={4} sm={12}>
        <Controller
          as={<Input label="Name" name="name" maxLength={validation.name.max}
            placeholder="Enter Name" required={false} isRequired={true} />}
          name="name"
          error={errors && errors.name}
          control={control}
        />
        {!!errors.name &&
          <Error>
            {errors.name.message}
          </Error>}
      </Col>
      {userType === 'Employer' && <>
        <Col md={12} lg={6} xl={4} sm={12}>
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
        <Col md={12} lg={6} xl={4} sm={12}>
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
      {userType === 'Broker' && currentUser.ic_user_type_id === 1 && ModuleControl.TwoFactorAuthentication.allowed &&
        <Col md={6} lg={6} xl={4} sm={12}>
          <CustomCheck className="custom-control-checkbox">
            <label className="custom-control-label-check  container-check">
              <span>Activate IP or Email Address WhiteListing</span>
              <Controller
                as={
                  <input
                    name={"ip_checking"}
                    type="checkbox"
                    defaultChecked={!!userData?.ip_checking}
                  />
                }
                name={"ip_checking"}
                onChange={([e]) => (e.target.checked ? 1 : 0)}
                control={control}
                defaultValue={0}
              />
              <span className="checkmark-check"></span>
            </label>
          </CustomCheck>
        </Col>
      }

      {userType === 'Broker' && currentUser.ic_user_type_id === 1 &&
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
                            "2 Factor Authentication for " + (userType === 'Employer' ? "Employer & it's Employees?" : "Broker?")
                          }
                        </span>
                        <Controller
                          as={
                            <input
                              name={"tfa_enabled"}
                              type="checkbox"
                              defaultChecked={!!userData?.tfa_enabled || false}
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
                              defaultChecked={!!userData?.ip_checking}
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
          key="premium_file"
          accept=".jpeg, .png, .jpg"
          description="File Formats: jpeg, png, jpg"
          nameBox
        />
      </Col>


      <Col md={12} className="d-flex justify-content-end mt-4">
        <Button type="submit">
          Update
        </Button>
      </Col>
    </Row>
  </form>)

  return (
    <CardBlue title={<div className="d-flex justify-content-between">
      <span>{'Organization Details'}</span>
      <div>
        <Button buttonStyle='outline-secondary' type="button" onClick={changeEdit}>
          {edit ? 'Cancel' : 'Edit'}
        </Button>
      </div>
    </div>} round={true}>

      {edit ? Edit : Show}
    </CardBlue>
  )
}
