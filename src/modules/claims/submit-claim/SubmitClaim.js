import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import swal from 'sweetalert';
import { subYears } from 'date-fns'
import { useHistory, useParams } from 'react-router-dom';

import { Wrapper, ContainerStep, ProgessBarStep, ClaimHead, List } from './style.js';
import { Button, CardBlue, IconlessCard, Loader, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import {
  // loadEmployer, 
  clearEmployer,
  loadEmployee, clearEmployee,
  loadPolicyType, clear_policy_type,
  claim, submitClaim,
  loadMembers, clearMembers,
  loadPolicyId, clear_policy_id,
  clear_is_date_valid,
  clearCity, clearHospital,
  loadBroker, loadBrokerEmployer,
  clear,
  loadClaimTemp, submitClaimTemp,
  removeSubmitTemp,
  tpaAcceptedExtensions,
  clearTempData,
  // intimateClaim
} from '../claims.slice';

import { UserDetail, Hospitalization, ClaimSubmission } from ".";
import { Tab, TabWrapper } from '../../../components/index.js';
import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Prefill } from '../../../custom-hooks/prefill.js';
// import { setPolicyData } from 'modules/announcements/notificationSubComponent/helper.js';

const formatDate = (date, inverse) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return inverse ? [day, month, year].join('-') : [year, month, day].join('-');
}


const validateTypeSringNumber = (value) => {
  if (['string', 'number'].includes(typeof (value))) return value
  else return 0;
}

const findObject = (id, options = []) => {
  let result = {}
  if (options.length) {
    // eslint-disable-next-line eqeqeq
    result = options.find(({ value }) => value == id)
  }

  return result
};

export const SubmitClaim = () => {

  const history = useHistory();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { userType } = useParams();
  const [page1, setPage1] = useState({ active: true, completed: false });
  const [page2, setPage2] = useState({ active: false, completed: false });
  const [page3, setPage3] = useState({ active: false, completed: false });
  const [progress, setProgress] = useState(0);
  const [trigger, setTrigger] = useState("Submit");
  const [hospitalData, setHospitalData] = useState();

  const [accepted_extensions, set_accepted_extensions] = useState([]);

  const [minDate, setMinDate] = useState(trigger !== 'opd' ? formatDate(subYears(new Date(), 6), true) : '')
  const [maxDate, setMaxDate] = useState()


  const dispatch = useDispatch();
  const { loading, error, success, employee, policy_type, policy_id, broker, tempData } = useSelector(claim);
  const [formData, setFormData] = useState({ filenames: [], tableBill: {} });
  const [claimDetail, setClaimDetail] = useState({ post_hosp: 0, pre_hosp: 0, hosp: 0, total: 0 });

  const { control, handleSubmit, watch, register, setValue } = useForm();

  const brokerId = validateTypeSringNumber(watch('broker_id')?.value);
  const employerId = validateTypeSringNumber(watch('employer_id')?.value) || currentUser.employer_id || 0;
  const policyType = validateTypeSringNumber(watch('policy_type')?.value);
  const policyId = validateTypeSringNumber(watch('policy_id')?.value);
  const employeeId = validateTypeSringNumber(watch('emp_id')?.value) || currentUser.employee_id || 0;

  const [policyData, setPolicyData] = useState([])
  const [refresh, doRefresh] = useState(0);

  useEffect(() => {
    if (policy_id.length) {
      let _data;
      if (trigger === "opd") {
        _data = policy_id.filter((item) => [2, 3].includes(item.policy_rater_type_id))
      } else {
        _data = policy_id.filter((item) => [1, 3, 4, 5].includes(item.policy_rater_type_id))
      }
      setPolicyData(_data)
    } else {
      setPolicyData([])
    }
  }, [trigger, policy_id])

  useEffect(() => {
    if (!_.isEmpty(tempData) && trigger !== 'opd') {
      swal("Found saved claim, do you want to continue with it ?", {
        buttons: {
          yes: 'Yes',
          no: "No"
        },
        closeOnClickOutside: false,
      }).then((value) => {
        if (value === 'yes') {
          if (Number(tempData?.brokerId)) {
            setValue('broker_id', tempData?.brokerObject)
            dispatch(fetchEmployers({ broker_id: tempData?.brokerId || brokerId }, firstPage));
          }
          tempData.is_opd && setTrigger('opd')
          setValue([
            { 'employer_id': (!!tempData?.employerObject.id && tempData?.employerObject) || { id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name } },
            { 'policy_id': tempData?.policyObject },
            { 'policy_type': tempData?.policyTypeObject },
            { 'emp_id': tempData?.employeeObject },
          ])
          setFormData({ ...tempData, admit_date: '', discharge_date: '', tableBill: {} })
        } else {
          dispatch(removeSubmitTemp(tempData.table_id))
        }
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempData])
  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, brokerId, currentUser]);

  useEffect(() => {
    if (userTypeName) {
      if (userType === 'admin') {
        dispatch(loadBroker(userTypeName))
      }
      // if (userType === "broker") {
      //   dispatch(loadEmployer());
      // }
      dispatch(loadClaimTemp())
    }

    return () => {
      dispatch(clearEmployer());
      dispatch(clearEmployee());
      dispatch(clear_policy_type());
      dispatch(clearMembers());
      dispatch(clear_policy_id());
      dispatch(clear_is_date_valid());
      dispatch(clearCity());
      dispatch(clearHospital());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])

  useEffect(() => {
    if (employerId) {
      if (_.isEmpty(tempData)) {
        setValue([
          { policy_type: undefined },
          { policy_id: undefined },
          { emp_id: undefined },
        ])
        doRefresh(prev => prev + 1)
      }
      dispatch(loadPolicyType({ employer_id: employerId }));
    }

    return () => {
      dispatch(clearEmployee());
      dispatch(clearMembers());
      dispatch(clear_policy_type());
      dispatch(clear_policy_id());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerId])

  useEffect(() => {
    if (employerId && policyType) {
      if (_.isEmpty(tempData)) {
        setValue([
          { policy_id: undefined },
          { emp_id: undefined },
        ])
        doRefresh(prev => prev + 1)
      }
      dispatch(loadPolicyId({
        user_type_name: userTypeName,
        employer_id: employerId, policy_sub_type_id: policyType,
        ...(trigger === 'opd' && { opd: 1 }),
        ...(userType === "broker" && currentUser.broker_id && { broker_id: currentUser.broker_id })
      }));
    }
    return () => {
      dispatch(clearEmployee());
      dispatch(clearMembers());
      dispatch(clear_policy_id());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyType, employerId])

  // useEffect(() => {
  //   if (currentUser && currentUser.employer_id)
  //     setValue('employer_id', currentUser.employer_id)
  //   if (currentUser && currentUser.employee_id)
  //     setValue('emp_id', currentUser.employee_id)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser])

  useEffect(() => {
    if ((userType === "employer" || userType === "broker" || userType === "admin") && employerId && policyId) {
      _.isEmpty(tempData) && setValue([
        { emp_id: undefined },
      ])
      doRefresh(prev => prev + 1)
      dispatch(loadEmployee({ employer_id: employerId, policy_id: policyId }));
    }
    return () => {
      dispatch(clearEmployee());
      dispatch(clearMembers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId])

  useEffect(() => {
    if (employeeId && policyId) {
      doRefresh(prev => prev + 1)
      tpaAcceptedExtensions({ policy_id: policyId }, set_accepted_extensions)
      dispatch(loadMembers({ employee_id: employeeId, policy_id: policyId }));
    }
    return () => {
      dispatch(clearMembers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, userType === 'employee' ? [policyId] : [employeeId])

  useEffect(() => {
    let total = 0;

    if (page1.completed) total += 40;
    if (page2.completed) total += 40;
    if (page3.completed || formData.filenames.length) total += 20;
    setProgress(total)
  }, [page1.completed, page2.completed, page3.completed, formData.filenames])

  useEffect(() => {
    if (formData.tableBill?.reimburment_type?.length) {
      let POST = 0, PRE = 0, HOSP = 0, total = 0;
      formData.tableBill.reimburment_type.forEach((type, index) => {
        if (type === "Pre-hospitalization")
          PRE += Number(formData.tableBill.bill_amt[index]);
        else if (type === "Post-hospitalization")
          POST += Number(formData.tableBill.bill_amt[index]);
        else
          HOSP += Number(formData.tableBill.bill_amt[index]);
      })
      total = POST + PRE + HOSP;
      setClaimDetail({ post_hosp: POST, pre_hosp: PRE, hosp: HOSP, total: total });
    }

  }, [formData.tableBill])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      history.push(`/${userType}/overall-claim`);
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(_.isEmpty(tempData) && policy_type, setValue, 'policy_type', 'policy_sub_type_name', 'policy_sub_type_id')
  Prefill(_.isEmpty(tempData) && policyData, setValue, 'policy_id', 'policy_no', undefined, { reset: true, resetValue: undefined })
  useEffect(() => {
    if (employee.length === 1)
      _.isEmpty(tempData) && setValue('emp_id', { id: employee[0].employee_id, label: employee[0].employee_name + ' : ' + employee[0].employee_code, value: employee[0].employee_id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee])


  const getFiles = (data) => {
    setFormData({ ...formData, filenames: [...formData.filenames, data] })
  }

  const removeFile = (id) => {
    let filesCopy = _.cloneDeep(formData.filenames);
    filesCopy.splice(id, 1);

    if (filesCopy.length)
      setPage3({ active: page3.active, completed: false })
    setFormData({ ...formData, filenames: filesCopy })
  }

  // const getDocs = (data, filename) => {
  //   setFormData({ ...formData, filename: [...formData.document_name , filename], document_path: [...formData.document_path , data]  })
  // }
  // const removeDocs = (id, filename) => {
  //   let filesCopy = _.cloneDeep(formData?.[`${filename}`]);
  //   filesCopy.splice(id, 1);

  //   if (filesCopy.length)
  //     setPage3({ active: page3.active, completed: false })
  //     setFormData({ ...formData, [`${filename}`]: filesCopy })
  // }

  const getModal = (data) => {
    setFormData({ ...formData, tableBill: data })
  }

  const getAdminEmployer = ([e]) => {
    if (e?.value) {
      dispatch(loadBrokerEmployer(e.value));
      dispatch(clear_policy_type());
      setValue([
        { 'broker_id': e.value },
        { 'employer_id': undefined },
        { 'policy_type': undefined },
        { 'policy_id': undefined },
        { 'emp_id': undefined }
      ])
    }
    return (e)
  }

  const onSubmit = data => {
    const docsName = _.compact(data?.document_path?.map((item, index) => item.length ? data?.document_name[index] : false));
    const docsType = _.compact(data?.document_path?.map((item, index) => item.length ? data?.document_type[index] : false));
    const docs = _.compact(data?.document_name?.map((item, index) => item ? data?.document_path[index][0] : false));
    const other_docs_name = _.compact(data?.others_path?.map((item, index) => item.length ? data?.others_name[index] : false));
    const other_docs = _.compact(data?.others_name?.map((item, index) => item ? data?.others_path[index][0] : false));
    const { tableBill: { bill_no, bill_date, bill_amt, comment, reimburment_type }, filenames } = formData;

    const dataObject = new FormData();
    filenames.forEach((data) => {
      data && dataObject.append(`filenames[]`, data);
    })
    bill_no.forEach((data) => {
      dataObject.append(`bill_no[]`, data);
    })
    bill_date.forEach((data) => {
      dataObject.append(`bill_date[]`, data);
    })
    // trigger !== 'opd' && bill_amt.forEach((data) => {
    //   dataObject.append(`bill_amt[]`, data);
    // })
    bill_amt.forEach((data) => {
      dataObject.append(`bill_amt[]`, data);
    })
    comment.forEach((data) => {
      dataObject.append(`comment[]`, data);
    })
    // trigger !== 'opd' && reimburment_type.forEach((data) => {
    //   dataObject.append('reimburment_type[]', data)
    // })
    reimburment_type.forEach((data) => {
      dataObject.append('reimburment_type[]', data)
    })
    // docsName.forEach((data) => {
    // })
    docs.forEach((data, i) => {
      if (data) {
        dataObject.append(`document_name[]`, docsName[i]);
        dataObject.append(`document_type[]`, docsType[i] || '1,2,3');
        dataObject.append(`document_path[]`, data);
      }
    })
    // other_docs_name.forEach((data) => {
    // })
    other_docs.forEach((data, i) => {
      if (data) {
        dataObject.append(`document_name[]`, other_docs_name[i]);
        dataObject.append(`document_type[]`, '1,2,3');
        dataObject.append(`document_path[]`, data);
      }
    })
    // trigger === 'opd' && dataObject.append('claim_type', 'opd')
    dataObject.append('claim_type', trigger === 'opd' ? 1 : 0)
    //trigger === 'opd' && dataObject.append('claim_amt', claimDetail?.total)
    // dataObject.append(trigger !== 'opd' ? 'admit_date' : 'planned_date', formData.admit_date)
    dataObject.append('admit_date', formData.admit_date)
    dataObject.append('city_id', formData.city_id)
    trigger !== 'opd' && dataObject.append('discharge_date', formData.discharge_date)
    if (trigger !== 'opd' && reimburment_type?.length /* ClaimSubType */ /* formData.claim_hospitalization_type?.length */) {

      reimburment_type?.some(label => label === 'Pre-hospitalization') && dataObject.append('claim_hospitalization_type[]', 'Pre-hospitalization');
      reimburment_type?.some(label => label === 'Post-hospitalization') && dataObject.append('claim_hospitalization_type[]', 'Post-hospitalization');
      reimburment_type?.some(label => label === 'Hospitalization') && dataObject.append('claim_hospitalization_type[]', 'Hospitalization');
      // ClaimSubType
      // formData.claim_hospitalization_type.forEach(({ label }) =>
      //   dataObject.append('claim_hospitalization_type[]', label)
      // )
    }
    dataObject.append('disease', formData.disease)
    dataObject.append('doctor_name', formData.doctor_name)
    dataObject.append('email', formData.email)
    dataObject.append('emp_id', data.emp_id?.value || employeeId)
    dataObject.append('hospital_addres', formData.hospital_addres)
    dataObject.append('hospital_name', formData.hospital_name)
    dataObject.append('member_id', formData.member_id)
    dataObject.append('mobile_no', formData.mobile_no)
    dataObject.append('policy_id', data.policy_id?.value)
    formData.reason && dataObject.append('reason', formData.reason)
    dataObject.append('relation', formData.relation)
    dataObject.append('state_id', formData.state_id)
    dataObject.append('state_name', formData.state_name)
    dataObject.append('city_name', formData.city_name)

    if (formData.hospital_pincode && formData.hospital_mobile_no) {
      dataObject.append('hospital_pincode', formData.hospital_pincode)
      dataObject.append('hospital_mobile_no', formData.hospital_mobile_no)
    }

    formData.intimate_claim_id && dataObject.append('intimate_claim_id', formData.intimate_claim_id)
    trigger === 'opd' && dataObject.append('tpa_member_id', formData.tpa_member_id)
    trigger === 'opd' && dataObject.append('tpa_member_name', formData.tpa_member_name)
    trigger === 'opd' && dataObject.append('tpa_emp_id', formData.tpa_emp_id)
    dataObject.append('status', 1)
    if (Number(hospitalData?.id)) {
      dataObject.append('hospital_id', hospitalData.id)
    } else {
      dataObject.append('hospital_id', 0)
    }
    // dispatch(trigger !== 'opd' ? submitClaim(dataObject) : intimateClaim(dataObject))
    dispatch(submitClaim(dataObject))

  };

  const nextPage = (page, data) => {
    switch (page) {
      case 1:
        setPage1({ active: false, completed: true });
        setPage2({ active: true, completed: page2.completed });
        setFormData({ ...formData, ...data })
        dispatch(submitClaimTemp({
          is_opd: trigger !== 'opd' ? false : true,
          android: 'no',
          ...formData, ...data,
          employerId, policyType,
          employeeId, policyId,
          brokerId,
          brokerObject: findObject(brokerId, broker.map(item => (
            {
              id: item.id,
              label: item.name,
              value: item.id
            }
          ))),
          ...userType === 'employer' ? {
            employerObject: findObject(employerId, currentUser.child_entities.map(item => (
              {
                id: item.id,
                label: item.name,
                value: item.id
              }
            )))
          } : {
            employerObject: findObject(employerId, employers.map(item => (
              {
                id: item.id,
                label: item.name,
                value: item.id
              }
            ))),
          },
          policyTypeObject: findObject(policyType, policy_type.map((item) => ({
            id: item.policy_sub_type_id,
            label: item.policy_sub_type_name,
            value: item.policy_sub_type_id,
          }))),
          policyObject: findObject(policyId, policy_id.map((item) => ({
            id: item.id,
            label: item.policy_no,
            value: item.id,
          }))),
          employeeObject: findObject(employeeId, employee.map(item => (
            {
              id: item.employee_id,
              label: item.employee_name,
              value: item.employee_id
            }
          ))),
        }));
        break;
      case 2:
        setPage2({ active: false, completed: true });
        setPage3({ active: true, completed: page3.completed });
        setFormData({ ...formData, ...data })
        dispatch(submitClaimTemp({
          is_opd: trigger !== 'opd' ? false : true,
          android: 'no',
          ...formData, ...data,
          employerId, policyType,
          employeeId, policyId,
          brokerId,
          brokerObject: findObject(brokerId, broker.map(item => (
            {
              id: item.id,
              label: item.name,
              value: item.id
            }
          ))),
          employerObject: findObject(employerId, employers.map(item => (
            {
              id: item.id,
              label: item.name,
              value: item.id
            }
          ))),
          policyTypeObject: findObject(policyType, policy_type.map((item) => ({
            id: item.policy_sub_type_id,
            label: item.policy_sub_type_name,
            value: item.policy_sub_type_id,
          }))),
          policyObject: findObject(policyId, policy_id.map((item) => ({
            id: item.id,
            label: item.policy_no,
            value: item.id,
          }))),
          employeeObject: findObject(employeeId, employee.map(item => (
            {
              id: item.employee_id,
              label: item.employee_name,
              value: item.employee_id
            }
          ))),
        }));
        break;
      case 3:
        setPage3({ active: true, completed: true });
        setProgress(100);
        (handleSubmit(onSubmit))();
        break;
      default:
    }
  }

  const changePage = (page, reset) => {
    switch (page) {
      case 1:
        setPage2({ active: false, completed: !reset && page2.completed });
        setPage3({ active: false, completed: !reset && page3.completed });
        setPage1({ active: true, completed: !reset && page1.completed });
        break;
      case 2:
        if (page1.completed) {
          setPage1({ active: false, completed: page1.completed });
          setPage3({ active: false, completed: page3.completed });
          setPage2({ active: true, completed: page2.completed });
        }
        break;
      case 3:
        if (page1.completed && page2.completed) {
          setPage1({ active: false, completed: page1.completed });
          setPage2({ active: false, completed: page2.completed });
          setPage3({ active: true, completed: page3.completed });
        }
        break;
      default:
    }
    if (reset) {
      setFormData({ filenames: [], tableBill: {} });
      setClaimDetail({ post_hosp: 0, pre_hosp: 0, hosp: 0, total: 0 });
      setValue('broker_id', undefined)
      setValue('employer_id', undefined)
      setValue('policy_id', undefined)
      setValue('policy_type', undefined)
      setValue('emp_id', undefined)
    }
  }

  const clearDataTemp = ([e]) => {
    tempData && dispatch(clearTempData());
    return e;
  }


  return (
    <>
      {(!!(policy_type[0]?.has_opd && userType === 'employee') || userType === 'broker') &&
        <TabWrapper width={"max-content"}>
          <Tab
            isActive={trigger === "Submit"}
            onClick={() => {
              setTrigger("Submit");
              changePage(1, true)
            }}
          >
            {/* <SpanTag>Reimburse</SpanTag> */}
            {/* <SpanTagMobile>Reimbursement</SpanTagMobile> */}
            IPD
          </Tab>
          <Tab
            isActive={trigger === "opd"}
            onClick={() => {
              setTrigger("opd");
              changePage(1, true)
            }}
          >
            OPD
          </Tab>
        </TabWrapper>
      }
      <Rows className="d-flex flex-wrap">
        <Col md={12} lg={12} xl={/* trigger !== 'opd' ? */ 9 /* : 12 */} sm={12}>
          <CardBlue
            title={'Submit Claim - ' + (trigger === "opd" ? "OPD" : "IPD")}
            styles={{ margin: " 20px 0px" }}
            round
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="d-flex flex-wrap">
                {(userType === "admin") &&
                  <Col md={6} lg={6} xl={4} sm={12}>
                    <Controller
                      as={<SelectComponent
                        label="Broker"
                        placeholder='Select Broker'
                        options={broker.map(item => (
                          {
                            id: item.id,
                            label: item.name,
                            value: item.id
                          }
                        )) || []}
                        id="id"
                        required
                      />}
                      defaultValue
                      disabled={!page1.active}
                      labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                      onChange={getAdminEmployer}
                      name="broker_id"
                      control={control}
                    />
                  </Col>}
                {(userType === "broker" || userType === "admin") &&
                  <Col md={6} lg={6} xl={4} sm={12}>
                    <Controller
                      as={<SelectComponent
                        label="Employer"
                        placeholder='Select Employer'
                        options={employers.map(item => (
                          {
                            id: item.id,
                            label: item.name,
                            value: item.id
                          }
                        )) || []}
                        id="employer_id"
                        required
                      />}
                      defaultValue
                      onChange={clearDataTemp}
                      disabled={!page1.active}
                      labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                      name="employer_id"
                      control={control}
                    />
                  </Col>}

                {!!(currentUser.is_super_hr && currentUser.child_entities.length) &&
                  <Col md={6} lg={6} xl={4} sm={12}>
                    <Controller
                      as={<SelectComponent
                        label="Employer"
                        placeholder='Select Employer'
                        options={currentUser.child_entities.map(item => (
                          {
                            id: item.id,
                            label: item.name,
                            value: item.id
                          }
                        )) || []}
                        id="employer_id"
                        required
                      />}
                      defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                      onChange={clearDataTemp}
                      disabled={!page1.active}
                      labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                      name="employer_id"
                      control={control}
                    />
                  </Col>}
                <Col md={6} lg={6} xl={4} sm={12}>
                  <Controller
                    as={
                      <SelectComponent
                        label="Policy Type"
                        placeholder="Select Policy Type"
                        options={
                          policy_type.map((item) => ({
                            id: item.policy_sub_type_id,
                            label: item.policy_sub_type_name,
                            value: item.policy_sub_type_id,
                          })) || []
                        }
                        id="policy_type"
                        required
                      />
                    }
                    defaultValue
                    onChange={clearDataTemp}
                    disabled={!page1.active}
                    labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                    name="policy_type"
                    control={control}
                  />
                </Col>
                <Col md={6} lg={6} xl={4} sm={12}>
                  <Controller
                    as={
                      <SelectComponent
                        label="Policy Name"
                        placeholder="Select Policy Name"
                        // options={
                        //   (trigger === "opd"
                        //     ? policy_id.filter(({ is_opd }) => is_opd)
                        //     : policy_id
                        //   ).map((item) => ({
                        //     id: item.id,
                        //     label: item.policy_no,
                        //     value: item.id,
                        //   })) || []
                        // }
                        options={
                          policyData?.map((item) => ({
                            id: item.id,
                            label: item.policy_no,
                            value: item.id,
                          })) || []
                        }
                        id="policy_id"
                        required
                      />
                    }
                    defaultValue
                    onChange={clearDataTemp}
                    disabled={!page1.active}
                    labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                    name="policy_id"
                    control={control}
                  />
                </Col>
                {(userType !== "employee") &&
                  <Col md={6} lg={6} xl={4} sm={12}>
                    <Controller
                      as={<SelectComponent
                        label="Employee Name : Code"
                        placeholder='Select Employee'
                        options={employee.map(item => (
                          {
                            id: item.employee_id,
                            label: `${item.employee_name} : ${item.employee_code}`,
                            value: item.employee_id
                          }
                        )) || []}
                        id="emp_id"
                        required
                      />}
                      defaultValue
                      onChange={clearDataTemp}
                      disabled={!page1.active}
                      labelProps={!page1.active ? { background: 'linear-gradient(#ffffff, #f2f2f2)' } : undefined}
                      name="emp_id"
                      control={control}
                    />
                  </Col>}
              </Row>
            </Form>
            <Row>
              <Wrapper>
                <ContainerStep>
                  <ProgessBarStep>
                    <div className="liner"></div>
                    <List
                      status={page1.active ? "active" : (page1.completed) ? "completed" : ""}
                      onClick={() => changePage(1)}><ClaimHead><span></span>User Details</ClaimHead></List>
                    <List
                      status={page2.active ? "active" : (page2.completed) ? "completed" : ""}
                      onClick={() => changePage(2)}><ClaimHead><span></span>{`${trigger === 'opd' ? 'OPD' : 'Hospitalization'} Details`}</ClaimHead></List>
                    <List
                      status={(page3.completed) ? "completed" : page3.active ? "active" : ""}
                      onClick={() => changePage(3)}><ClaimHead><span></span>Claim Submission</ClaimHead></List>
                  </ProgessBarStep>
                </ContainerStep>
              </Wrapper>
            </Row>

            {page1.active && <UserDetail refresh={refresh} policyData={policyData} data={formData} progress={progress} submitData={nextPage} policyId={policyId} minDate={minDate} setMinDate={(date) => setMinDate(date)} maxDate={maxDate} setMaxDate={(date) => setMaxDate(date)} formatDate={formatDate} type={trigger} register={register} watch={watch} />}
            {page2.active && <Hospitalization policyData={policyData} data={formData} progress={progress} postModal={(data) => getModal(data)} policyId={policyId} submitData={nextPage} previousPage={(page) => changePage(page)} formatDate={formatDate} minDate={minDate} maxDate={maxDate} hospitalData={hospitalData} setHospitalData={setHospitalData} type={trigger} watch={watch} register={register} />}
            {page3.active && <ClaimSubmission accepted_extensions={accepted_extensions} data={formData} progress={progress} postFiles={(data) => getFiles(data)} deleteFile={(id) => removeFile(id)} submitData={nextPage} previousPage={(page) => changePage(page)} policy_id={watch('policy_id') || policy_id} watch={watch} register={register} Controller={Controller} control={control} type={trigger} />}

          </CardBlue>
        </Col>
        <Col md={12} lg={12} xl={3} sm={12}>
          <IconlessCard title={<span>Claim Details</span>} styles={{ margin: "30px 0px", padding: "30px 0px" }}>
            {trigger !== 'opd' && <>
              {(!formData?.tableBill?.reimburment_type?.length || formData?.tableBill?.reimburment_type?.some(label => label === 'Pre-hospitalization')) && <Button disabled className="w-100 mb-3" buttonStyle="square-outline"><div className="d-flex justify-content-between text-wrap"> <span className="text-left">Pre-Hospitalization Claim:</span><span className="text-secondary">{claimDetail.pre_hosp}</span></div></Button>}
              {(!formData?.tableBill?.reimburment_type?.length || formData?.tableBill?.reimburment_type?.some(label => label === 'Post-hospitalization')) && <Button disabled className="w-100 mb-3" buttonStyle="square-outline"><div className="d-flex justify-content-between text-wrap"> <span className="text-left">Post-Hospitalization Claim:</span><span className="text-secondary">{claimDetail.post_hosp}</span></div></Button>}
              {(!formData?.tableBill?.reimburment_type?.length || formData?.tableBill?.reimburment_type?.some(label => label === 'Hospitalization')) && <Button disabled className="w-100 mb-3" buttonStyle="square-outline"><div className="d-flex justify-content-between text-wrap"> <span className="text-left">Hospitalization Claim:</span><span className="text-secondary">{claimDetail.hosp}</span></div></Button>}
            </>}
            <Button disabled className="w-100 mb-3" buttonStyle="square-outline"><div className="d-flex justify-content-between text-wrap"> <span className="text-left">Total Claim:</span><span className="text-secondary">{claimDetail.total}</span></div></Button>
          </IconlessCard>
        </Col>
      </Rows>
      {loading && <Loader />}
    </>
  )
}

const Rows = styled(Row)`
margin-left: 0px !important;
margin-right: 0px !important;`
