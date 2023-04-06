import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import styled from "styled-components";

import { Input, Button, Error, Loader, Select as SelectNEW, Card } from "components";
import { Switch } from "modules/user-management/AssignRole/switch/switch"
import { Row, Col, Form } from 'react-bootstrap';
import _ from "lodash";

import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectError, selectSuccess, clearData, clear, clearRole, brokerReportingData, insurerReportingData, selectUserInfo, updateUser, getRegionalMappingdata, getZonalMappingdata, setPageData } from '../user.slice';
import { numOnly, noSpecial } from "utils";
import { common_module } from 'config/validations'
import GetUserInfo from './getUserInfo';
import { fetchEmployers, setPageData as setDataPage } from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { SelectComponent } from '../../../components';

const validation = common_module.user

const validationSchema = (own, type, UserID, isRegion, roleID, mappObj) => yup.object().shape({
  name: type === 'Employer' ? yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
    .max(validation.name.max, `Maximum ${validation.name.max} character available`) :
    yup.string().required('Name required').min(validation.name.min, `Minimum ${validation.name.min} character required`)
      .max(validation.name.max, `Maximum ${validation.name.max} character available`)
      .matches(validation.name.regex, "Name must contain only alphabets"),
  ...(!UserID && {
    email: yup.string().email('Must be a valid email').required('Email required')
      .min(validation.email.min, `Minimum ${validation.email.min} character required`)
      .max(validation.email.max, `Maximum ${validation.email.max} character available`)
  }),
  mobile_no: yup.string()
    .required('Mobile No. is required')
    .min(validation.contact.length, "Mobile No. should be 10 digits")
    .max(validation.contact.length, "Mobile No. should be 10 digits")
    .matches(validation.contact.regex, 'Not valid number'),
  role: yup.string()
    .required('Role required'),
  ...!own && {
    id: yup.object().shape({
      id: yup.string().required(`${type} Required`),
    })
  },
  ...((roleID === 4 && ((!_.isEmpty(mappObj.regional_data)) || (!_.isEmpty(mappObj.zonal_data)))) && (isRegion ? {
    region_id: yup.string().required('Please Select Region')
  } :
    {
      zone_id: yup.string().required('Please Select Zone')
    }
  ))
});


export const UserCreate = ({
  type,
  Users,
  Roles,
  getUsersData,
  RoleData,
  createUser,
  idUser,
  own,
  isRfq,
  icID
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const UserID = GetUserInfo()
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const { reportingData, pincodeErrorMsg, regional_data, zonal_data } = useSelector(state => state.userManagement);
  const { userType, currentUser } = useSelector(state => state.login);
  const [pinData, setPinData] = useState([]);
  // const [pin, setPin] = useState([]);
  const [isRegion, setRegion] = useState(true);
  const [roleID, setRole] = useState(null);

  const { control, errors, handleSubmit, watch, setValue, reset } = useForm({
    validationSchema: validationSchema(own, type, UserID, isRegion, roleID, { regional_data, zonal_data }),
    mode: "onChange",
    reValidateMode: "onChange"
  });
  // const Pincode = watch("pincode");
  const isSuperRole = watch('isSuperRole');
  let roleId = watch('role');

  const { employers, firstPage, lastPage, } = useSelector((state) => state.networkhospitalbroker);

  const UserInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (roleId) {
      let _data = Roles?.filter(({ id }) => id === Number(roleId))
      setRole(_data[0]?.role_type_id || _data[0]?.ic_user_type_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId])

  useEffect(() => {
    if (UserInfo.name) {
      reset({
        ...UserInfo,
        mobile_no: UserInfo.mobile_no || null,
        ...UserInfo.role_id && { role: UserInfo.role_id },
        ...UserInfo.has_reporting_manager && { isSuperRole: UserInfo.has_reporting_manager },
        ...UserInfo.reporting_manager_user_id && { reporting_id: UserInfo.reporting_manager_user_id }
      })
      // UserInfo.pincodes && setPinData(UserInfo.pincodes.map(({ pincode }) => pincode))

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserInfo])


  useEffect(() => {
    return () => {
      dispatch(clearRole());
      dispatch(clearData());
      dispatch(setDataPage({
        firstPage: 1,
        lastPage: 1
      }))
      dispatch(
        setPageData({
          firstPage: 1,
          lastPage: 1,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (idUser && type === "Broker") {
      dispatch(getRegionalMappingdata({ broker_id: idUser }))
      dispatch(getZonalMappingdata({ broker_id: idUser }))
    }
    if (idUser && type === "Insurer") {
      dispatch(getRegionalMappingdata({ ic_id: idUser }))
      dispatch(getZonalMappingdata({ ic_id: idUser }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUser])

  useEffect(() => {
    if (roleId) {
      if (type === "Broker" && isSuperRole) {
        dispatch(brokerReportingData({
          broker_id: idUser,
          role_id: roleId
        }));
      }
      if (type === "Insurer" && isSuperRole) {
        dispatch(insurerReportingData({
          ic_id: idUser,
          role_id: roleId
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, isSuperRole])

  useEffect(() => {
    if (userType)
      (own) ? dispatch(RoleData(idUser, type.toLowerCase(), "1")) : dispatch(getUsersData(type !== 'Insurer' && { type, currentUser: userType }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [own, idUser, type, RoleData, getUsersData, userType])

  useEffect(() => {
    if (userType === 'Broker' && (currentUser?.broker_id) && userType !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      history.goBack();
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  const onSubmit = data => {
    const { name, email, mobile_no, role, reporting_id, isSuperRole, ...id } = data;
    const user = (type === "Broker") ? "admin" : (type === "Insurer") ? 'insurer' : "broker";
    const userId = id?.id?.value || idUser

    UserID ? dispatch(updateUser({
      name,
      // email,
      mobile_no,
      role_id: role,
      has_reporting_manager: isSuperRole,
      ...(isSuperRole === 1 && {
        reporting_manager_user_id: reporting_id
      }),
      ...((isRfq === 1 || isRfq === 2 || isRfq === 3 || icID) && {
        ...pinData?.length && { pincodes: pinData }
      }),
      user_id: UserID,
      ...(roleID === 4 && (isRegion ? {
        region_id: data.region_id
      } :
        {
          zone_id: data.zone_id
        })),
      user_type_name: userType
    })) :
      dispatch(createUser({
        name,
        email,
        mobile_no,
        role,
        has_reporting_manager: isSuperRole,
        ...(isSuperRole === 1 && {
          reporting_manager_user_id: reporting_id
        }),
        ...((isRfq === 1 || isRfq === 2 || isRfq === 3 || icID) && {
          ...pinData?.length && { pincodes: pinData }
        }),
        ...(roleID === 4 && (isRegion ? {
          region_id: data.region_id
        } :
          {
            zone_id: data.zone_id
          }))

      },
        userId, user));
    setPinData([]);
  };

  const roleRequest = (user_id) => {
    if (user_id)
      dispatch(RoleData(user_id, type.toLowerCase(), "1"))
  }

  useEffect(() => {
    if (pincodeErrorMsg) {
      swal(pincodeErrorMsg, "", "warning").then(() => {
        setValue('pincode', '');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincodeErrorMsg])

  // useEffect(() => {
  //   if (Pincode && Pincode.length > 5) {
  //     dispatch(validatePincode({ pincode: Pincode }))
  //     setPin(() => [Pincode]);
  //   }
  //   //eslint-disable-next-line
  // }, [Pincode]);

  // const onAddICD = () => {
  //   if (!_.isEmpty(pin)) {
  //     const flag = pinData.some((value) => value === Pincode);
  //     if (!flag && Pincode) {
  //       if (pinData.length < 10 && pincodeErrorMsg === null) {
  //         setPinData((prev) => [...prev, pin[0]])
  //       }
  //       else {
  //         swal("Can't enter pincode more than 10", "", "warning");
  //       }
  //     }
  //     else {
  //       swal("Can't enter duplicate pincode", "", "warning");
  //     }
  //   }
  // }

  // const onRemoveICD = (Index) => {
  //   const filteredICD = pinData.filter((item, index) => index !== (Index - 1));
  //   setPinData(() => [...filteredICD])
  // }

  return (
    <Card title={`${UserID ? 'Update' : 'Create'} ${type} User`} style={{ maxWidth: "1000px" }}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
          {!UserID && <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input label="Email" type="email" maxLength={validation.email.max}
                placeholder="Enter Email" required={false} isRequired={true} />}
              name="email"
              error={errors && errors.email}
              control={control}
            />
            {!!errors.email &&
              <Error>
                {errors.email.message}
              </Error>}
          </Col>}
          <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Input label="Mobile No" maxLength={validation.contact.length}
                onKeyDown={numOnly} onKeyPress={noSpecial} type='tel' placeholder="Enter Mobile No" required={false} isRequired={true} />}
              name="mobile_no"
              error={errors && errors.mobile_no}
              control={control}
            />
            {!!errors.mobile_no &&
              <Error>
                {errors.mobile_no.message}
              </Error>}
          </Col>
          {['Broker', 'Insurer'].includes(type) && <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<Switch />}
              name="isSuperRole"
              control={control}
              defaultValue={0}
              label="Does this role has a super role ?"
            />
          </Col>}
          {(!own && !UserID) && <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label={type}
                  placeholder={`Select ${type}`}
                  required={false}
                  isRequired
                  options={(userType === 'Broker' ? employers : Users?.data)?.map(({ id, name }) => ({
                    id: id, value: id, label: name
                  })) || []}
                  name="id"
                />
              }
              name="id"
              error={errors && errors?.id?.id}
              onChange={([data]) => { roleRequest(data.value); return data }}
              control={control}
            />
            {!!errors?.id?.id && <Error>{errors?.id?.id?.message}</Error>}
          </Col>}
          <Col md={12} lg={6} xl={4} sm={12}>
            <Controller
              as={<SelectNEW
                label="Role"
                placeholder="Select Role"
                options={Roles.filter(({ status }) => status).map((item) => ({
                  ...item,
                  value: item.id,
                })) || []}
                required={false} isRequired={true}
                id="role"
              />}
              name="role"
              error={errors && errors.role}
              control={control}
            />
            {!!errors.role &&
              <Error>
                {errors.role.message}
              </Error>}
          </Col>
          {isSuperRole === 1 &&
            <Col md={12} lg={6} xl={4} sm={12}>
              <Controller
                as={
                  <SelectNEW
                    label="Reporting Person"
                    placeholder="Select Reporting Person"
                    required={false}
                    isRequired={true}
                    options={reportingData?.data?.map((item) => ({
                      id: item?.user_id,
                      name: item?.user_name,
                      value: item?.user_id,
                    }))}
                  />
                }
                onChange={([selected]) => {
                  return selected;
                }}
                name="reporting_id"
                control={control}
                defaultValue={""}
                error={errors && errors.reporting_id}
              />
              {!!errors?.reporting_id && <Error>{errors?.reporting_id?.message}</Error>}
            </Col>
          }
        </Row>
        {/* {(([1, 2, 3].includes(isRfq) || icID) && ['Broker', 'Insurer'].includes(type)) &&
          <Row>
            <Col md={12} lg={6} xl={4} sm={12}>
              <div className="">
                <Controller
                  as={<Input label="Pincode" placeholder="Enter Pincode" />}
                  name="pincode"
                  defaultValue={""}
                  control={control}
                  required={false} isRequired={false}
                  error={errors && errors.pincode}
                  maxLength="6"
                  onKeyDown={numOnly} onKeyPress={noSpecial}

                />
                {!!errors?.pincode &&
                  <Error>
                    {errors?.pincode?.message}
                  </Error>}
              </div>
            </Col>
            <Col md={12} lg={6} xl={4} sm={12} className="d-flex align-items-center">
              <div className="pl-2">
                <Btn type="button" onClick={onAddICD}>
                  <i className="ti ti-plus"></i> Add
                </Btn>
              </div>
            </Col>
          </Row>
        }
        <Row>
          {pinData.length ? (
            <BenefitList>
              {pinData.map((item, i) => {
                return (
                  <Chip
                    key={'icd-master1' + i}
                    id={(i + 1)}
                    name={item}
                    onDelete={onRemoveICD}
                  />
                );
              })}
            </BenefitList>
          ) : null}
        </Row> */}
        {/* <Row>
          <div style={{ display: "flex" }}>
            <div className="p-2">
              <Button buttonStyle="outline-solid" type="button" onClick={onAddICD}>
                <i className="ti ti-plus"></i> Add
                            </Button>
            </div>
          </div>
        </Row> */}
        {roleID === 4 &&
          <Row style={{ marginTop: '15px', borderTop: '1px solid #e8e8e8', paddingTop: '5px' }}>
            <Col md={12} lg={12} xl={12} sm={12}
            // className="d-flex justify-content-center"
            >
              <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-primary" onClick={() => setRegion(true)}>Region</button>
                <button type="button" className="btn btn-primary" onClick={() => setRegion(false)}>Zone</button>
              </div>
            </Col>
            {isRegion ?
              !_.isEmpty(regional_data) ?
                <Col md={12} lg={6} xl={6} sm={12}>
                  <Controller
                    as={
                      <SelectNEW
                        label="Region"
                        placeholder="Select Region"
                        required={false}
                        isRequired={true}
                        options={
                          regional_data?.map((item) => ({
                            id: item?.id,
                            name: item?.name,
                            value: item?.id,
                          })) || []
                        }
                      />
                    }
                    name="region_id"
                    control={control}
                    error={errors && errors.region_id}
                    defaultValue={""}
                  />
                  {!!errors.region_id &&
                    <Error>
                      {errors.region_id.message}
                    </Error>}
                </Col>
                : <NoMapping>No Region Mapping Found !</NoMapping>
              :
              !_.isEmpty(zonal_data) ?
                <Col md={12} lg={6} xl={6} sm={12}>
                  <Controller
                    as={
                      <SelectNEW
                        label="Zone"
                        placeholder="Select Zone"
                        required={false}
                        isRequired={true}
                        options={
                          zonal_data?.map((item) => ({
                            id: item?.id,
                            name: item?.name,
                            value: item?.id,
                          })) || []
                        }
                      />
                    }
                    name="zone_id"
                    control={control}
                    error={errors && errors.region_id}
                    defaultValue={""}
                  />
                  {!!errors.zone_id &&
                    <Error>
                      {errors.zone_id.message}
                    </Error>}
                </Col> : <NoMapping>No Zone Mapping Found !</NoMapping>
            }
          </Row>
        }
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              {UserID ? 'Update' : 'Submit'}
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && <Loader />}
    </Card>
  )
}


// const BenefitList = styled.div`
//   margin-left: 5px;
//   border: 1px dashed #deff;
//   padding: 11px;
//   background: #efefef;
//   border-radius: 5px;
//   width: 90%;
// `;

const NoMapping = styled.div`
box-shadow: 4px 4px 8px 0px #d2d2d2;
background: #f6f6f6;
padding: 10px;
border-radius: 5px;
color: #727272;
width: 100%;
text-align: center;

border: 1px solid #ebebeb;
margin-top: 5px;

`;

// default props
UserCreate.defaultProps = {
  type: "Broker",
  Users: { data: [] },
  Roles: [],
  idUser: 0,
  own: false
}

// props types
UserCreate.propTypes = {
  type: PropTypes.string,
  Users: PropTypes.object,
  Roles: PropTypes.array,
  getUsersData: PropTypes.func,
  RoleData: PropTypes.func,
  createUser: PropTypes.func,
  idUser: PropTypes.number,
  own: PropTypes.bool
};
