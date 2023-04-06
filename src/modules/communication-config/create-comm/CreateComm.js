import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import swal from 'sweetalert';
import * as yup from "yup";

import { CardBlue, Input, Head, SelectComponent, Select, Typography, Chip, Button, LoaderButton } from 'components'
import { Row, Col, Form, Button as Btn } from 'react-bootstrap';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
import { InputWrapper, BenefitList } from 'modules/policies/steps/additional-details/styles';

import { useForm, Controller } from "react-hook-form";
import { createCommunication, loadEmailTemplate, loadSmsTemplate, loadEMP, setPage } from '../communication-config.slice'
import { loadTemplate } from 'modules/report-config/report-config.slice'
import { useDispatch, useSelector } from 'react-redux';

const validationSchema = yup.object().shape({
  template_id: yup.object().shape({
    id: yup.string().required('Template Required'),
  })
});

const TemplateType = [{ id: 1, name: 'Dynamic' }, { id: 2, name: 'Static' }]

export const Communication = ({ resetForm }) => {

  const dispatch = useDispatch();
  const { userType } = useParams();
  const { control, errors, register, watch, handleSubmit, reset } = useForm({
    validationSchema
  });
  const [brokerSelect, setBrokerSelect] = useState();
  const [broker, setBroker] = useState();
  const [brokers, setBrokers] = useState([]);
  const [employerSelect, setEmployerSelect] = useState();
  const [employer, setEmployer] = useState();
  const [employers, setEmployers] = useState([]);
  const [employeeSelect, setEmployeeSelect] = useState();
  const [employee, setEmployee] = useState();
  const [employees, setEmployees] = useState([]);
  const [policy, setPolicy] = useState();
  const [policies, setPolicies] = useState([]);
  const {
    email_templates, sms_templates, broker_list, employer_list,
    employee_list, policy_no, frequency, _firstPage, _lastPage, loadEMPData
  } = useSelector(state => state.commConfig);
  const { templates } = useSelector(state => state.reportConfig);
  const loginState = useSelector(state => state.login);
  const { currentUser, userType: userTypeName } = loginState;
  const [employerData, setEmployerData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [reportSelect, setReportSelect] = useState();
  const [immediate, setImmediate] = useState();
  const brokerAll = watch('broker_all');
  const employerAll = watch('employer_all');
  const employeeAll = watch('employee_all');
  const policyAll = watch('policy_all');

  const templateType = watch('template_type')
  const commType = watch('comm_type');
  useEffect(() => {
    if (templateType) {
      let _data = {
        user_type_name: userTypeName,
        type: Number(templateType)
      }
      if (commType === '1') {
        dispatch(loadEmailTemplate(_data));
      } else {
        dispatch(loadSmsTemplate(_data));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateType, commType])
  // const triggerMethod = watch('trigger_method');

  //load report templates
  useEffect(() => {
    if (userTypeName) {

      dispatch(loadTemplate(userTypeName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])

  // Filter EmployerData
  useEffect(() => {
    if (employer_list?.length) {
      const temp = brokers.reduce((filtered, elem1) => {
        return [...filtered, ...employer_list.filter((elem2) => elem2?.broker === elem1?.name)]
      }, [])
      setEmployerData(temp)
    }
  }, [employer_list, brokers])

  // Filter(broker)
  useEffect(() => {
    if (currentUser?.broker_id && userType === 'broker') {
      const _emp = employer_list.filter((elem2) => elem2.broker === currentUser?.broker_name)
      const _policy = policy_no.filter((elem2) => elem2.broker_id === currentUser?.broker_id)
      setEmployerData(_emp)
      setPolicies(_policy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, userType])

  // Filter(broker)
  // useEffect(() => {
  //   if (employee_list.length && employers.length && userType === 'broker') {
  //     const temp = employers.reduce((filtered, elem1) => {
  //       return [...filtered, ...employee_list.filter((elem2) => elem2.employer === elem1.name)]
  //     }, [])
  //     setEmployeeData(temp)
  //   }
  // }, [employee_list, userType, employers])
  useEffect(() => {
    if (employers.length && userType === 'broker' && employerAll === "0") {
      // if (_lastPage >= _firstPage) {
      //   var _TimeOut = setTimeout(_callback, 250);
      // }
      //function _callback() {
      let _id = employers.map((item) => {
        return item.id
      })
      dispatch(loadEMP({
        user_type_name: userTypeName,
        type: 'Employee',
        employer_ids: _id,
        page: 1
      }))
      // }
      // return () => {
      //   clearTimeout(_TimeOut)
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, employers])

  useEffect(() => {
    if (_lastPage >= _firstPage) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    function _callback() {
      let _id = employers.map((item) => {
        return item.id
      })
      dispatch(loadEMP({
        user_type_name: userTypeName,
        type: 'Employee',
        employer_ids: _id,
        page: _firstPage
      }))
    }
    return () => {
      clearTimeout(_TimeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_firstPage, _lastPage])

  useEffect(() => {
    return () => {
      dispatch(setPage({
        _firstPage: 1,
        _lastPage: 1,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (resetForm) {
      reset({
        comm_type: '0',
        broker_all: '1',
        policy_all: '1',
        employer_all: '1',
        employee_all: '1',
        name: '',
        template_id: undefined,
        frequency_id: '',
        trigger_time: '',
        add_benefit1: false,
        add_benefit2: false,
        add_benefit3: false,
        report_template_id: undefined,
        attach_report: false
      });
      setBrokerSelect();
      setBroker();
      setBrokers([]);
      setEmployerSelect();
      setEmployer();
      setEmployers([]);
      setEmployeeSelect();
      setEmployee();
      setEmployees([]);
      setPolicy();
      setPolicies([]);
      setEmployerData([]);
      setEmployeeData([]);
      setPolicyData([]);
      setReportSelect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetForm])

  // Filter EmployeeData
  useEffect(() => {
    if (employee_list.length && brokers.length && employers.length) {
      const temp = employers.reduce((filtered, elem1) => {
        return [...filtered, ...employee_list.filter((elem2) => elem2.employer === elem1.name)]
      }, [])
      setEmployeeData(temp)
    }
  }, [employee_list, brokers, employers])

  // Filter PolicyData
  useEffect(() => {
    if (policy_no.length) {

      const temp = brokers.reduce((filtered, elem1) => {
        return [...filtered, ...policy_no.filter((elem2) => elem2.broker_id === elem1.id)]
      }, [])
      setPolicyData(temp)
    }
  }, [policy_no, brokers])


  // Filter Employers
  useEffect(() => {
    let newEmployers = employerData.reduce((filtered, elem1) => {
      return [...filtered, ...employers.filter((elem2) => elem2.id === elem1.id)]
    }, [])
    setEmployers(newEmployers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerData])

  // Filter Employees
  useEffect(() => {
    let newEmployees = employeeData.reduce((filtered, elem1) => {
      return [...filtered, ...employees.filter((elem2) => elem2.id === elem1.id)]
    }, [])
    setEmployees(newEmployees)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeData])

  // Fill All Data

  useEffect(() => {
    if (brokerAll !== '0' && brokerSelect)
      setBrokers(broker_list)
    else if (brokerAll === '0')
      setBrokers([])
  }, [brokerAll, broker_list, brokerSelect])

  useEffect(() => {
    if (employerAll !== '0' && employerSelect)
      setEmployers(employerData)
    else if (employerAll === '0')
      setEmployers([])
  }, [employerAll, employerData, employerSelect])

  useEffect(() => {
    if (employeeAll !== '0' && employeeSelect)
      setEmployees(employeeData)
    else if (employeeAll === '0')
      setEmployees([])
  }, [employeeAll, employeeData, employeeSelect])

  useEffect(() => {
    if (userType === 'admin') {
      if (policyAll !== '0') {
        if (brokerAll !== '0' && brokerSelect) {
          setPolicies(policy_no)
        }
        else {
          setPolicies(policy_no.filter(({ broker_id }) =>
            brokers.map((elem) => (elem.id)).includes(broker_id)))
        }
      }
      else if (policyAll === '0')
        setPolicies([])
    }
  }, [policyAll, policy_no, brokers, brokerAll, brokerSelect, userType])

  // Broker
  const onChangeBroker = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setBrokerSelect(prev => checked);
    return selected;
  };

  const onAddBroker = () => {
    if (broker && Number(broker)) {
      const flag = broker_list?.find(
        (value) => value?.id === Number(broker)
      );
      const flag2 = brokers.some((value) => value?.id === Number(broker));
      if (flag && !flag2)
        setBrokers((prev) => [...prev, flag]);
    }
  };

  const removeBroker = (Broker) => {
    const filteredBrokers = brokers?.filter((item) => item?.id !== Broker);
    setBrokers((prev) => [...filteredBrokers]);
  };

  // Employer
  const onChangeEmployer = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setEmployerSelect(prev => checked);
    return selected;
  };

  const onAddEmployer = () => {
    if (employer && Number(employer)) {
      const flag = employer_list?.find(
        (value) => value?.id === Number(employer)
      );
      const flag2 = employers.some((value) => value?.id === Number(employer));
      if (flag && !flag2)
        setEmployers((prev) => [...prev, flag]);
    }
  };

  const removeEmployer = (Employer) => {
    const filteredEmployers = employers?.filter((item) => item?.id !== Employer);
    setEmployers((prev) => [...filteredEmployers]);
  };

  // Employee
  const onChangeEmployee = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setEmployeeSelect(prev => checked);
    return selected;
  };

  const onAddEmployee = () => {
    if (employee && Number(employee)) {
      const flag = loadEMPData?.find(
        (value) => value?.id === Number(employee)
      );
      const flag2 = employees.some((value) => value?.id === Number(employee));
      if (flag && !flag2)
        setEmployees((prev) => [...prev, flag]);
    }
  };

  const removeEmployee = (Employee) => {
    const filteredEmployees = employees?.filter((item) => item?.id !== Employee);
    setEmployees((prev) => [...filteredEmployees]);
  };

  // Policy
  const onAddPolicy = () => {
    if (policy && Number(policy)) {
      const flag = policy_no?.find(
        (value) => value?.id === Number(policy)
      );
      const flag2 = policies.some((value) => value?.id === Number(policy));
      if (flag && !flag2)
        setPolicies((prev) => [...prev, flag]);
    }
  };

  const removePolicy = (Policy) => {
    const filteredPolicies = policies?.filter((item) => item?.id !== Policy);
    setPolicies((prev) => [...filteredPolicies]);
  };

  //Attach Report
  const onChangeReport = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setReportSelect(prev => checked);
    return selected;
  };
  const onChangeImmediate = ([e]) => {
    setImmediate(e.target.value)
    return e
  }

  const onSubmit = ({ comm_type, name, template_id, frequency_id, trigger_time, report_template_id }) => {
    if (!brokers.length && userType !== 'broker') {
      swal("No user selected", 'Required aleast 1 user', "info");
      return
    }

    if (!employers.length && userType === 'broker') {
      swal("No user selected", 'Required aleast 1 user', "info");
      return
    }
    const result = {
      ...(comm_type === '1' ? { is_email: 1 } : { is_sms: 1 }),
      name,
      template_id: template_id?.value,
      // 0 none | 1 all | 2 selective
      ...((brokerSelect && brokers.length) ? {
        all_brokers: brokerAll === '0' ? 2 : 1,
        ...(brokerAll === '0' && {
          broker_ids: brokers.map((({ id }) => id))
        })
      } : { all_brokers: 0 }),
      ...((employerSelect && (brokerSelect || userType !== 'admin') && employers.length) ? {
        all_employers: employerAll === '0' ? 2 : 1,
        ...(employerAll === '0' && {
          employer_ids: employers.map((({ id }) => id))
        })
      } : { all_employers: 0 }),
      ...((employeeSelect && employerSelect && (brokerSelect || userType !== 'admin') && employees.length) ? {
        all_employee: employeeAll === '0' ? 2 : 1,
        ...(employeeAll === '0' && {
          employee_ids: employees.map((({ id }) => id))
        })
      } : { all_employee: 0 }),
      frequency: frequency_id,
      trigger_time: trigger_time,
      policies_ids: policies.map((({ id }) => id)),
      has_report: reportSelect ? 1 : 0,
      report_template_id: report_template_id?.value
    }
    const result2 = {
      ...result,
      ...(employerAll !== '0' && {
        all_employers: 1
      }),
      ...(employeeAll !== '0' && {
        all_employee: 1
      }),
      ...((currentUser?.broker_id) && {
        all_brokers: 2,
        broker_ids: [Number(currentUser?.broker_id)]
      })
    }
    dispatch(createCommunication(userType === "broker" ? result2 : result))
  }

  return (
    <CardBlue title='Create Communication'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={4} xl={4} sm={12}>
            <Head className='text-center'>Select Communication Type</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"SMS"}</p>
                <input ref={register} name={'comm_type'} type={'radio'} value={0} defaultChecked={true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Mail"}</p>
                <input ref={register} name={'comm_type'} type={'radio'} value={1} />
                <span></span>
              </CustomControl>
            </div>
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  label='Communication Name'
                  placeholder="Enter Communication Name"
                  required
                  error={errors && errors.name}
                />
              }
              control={control}
              name="name"
            />
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <Select
                  label="Template Type"
                  placeholder="Select Template Type"
                  required={false}
                  isRequired={true}
                  // options={_Events}
                  options={TemplateType.map((item) => ({
                    id: item?.id,
                    name: item?.name,
                    value: item?.id,
                  }))}
                />
              }
              name="template_type"
              control={control}
              defaultValue={""}
            />
          </Col>
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Template"
                  placeholder="Select Template"
                  required
                  options={(commType === '1') ?
                    email_templates.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) :
                    sms_templates.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    }))}
                  error={errors && errors.template_id?.id}
                />
              }
              control={control}
              name="template_id"
            />
          </Col>
        </Row>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <Select
                  label="Frequency"
                  placeholder='Select Frequency'
                  options={frequency.map((item) => ({
                    id: item?.id,
                    name: item?.name,
                    value: item?.id,
                  }))}
                  valueName="name"
                  id="id"
                  required
                />}
              onChange={onChangeImmediate}
              control={control}
              name="frequency_id"
            />
          </Col>
          {Number(immediate) !== 4 &&
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <Input
                    label='Trigger Time'
                    placeholder="Enter Trigger Time"
                    required
                    type='time'
                    error={errors && errors.name}
                  />
                }
                control={control}
                name="trigger_time"
              />
            </Col>
          }
        </Row>
        {true && (
          <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12}>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="reportCheck"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={reportSelect} />
                  }
                  name="attach_report"
                  control={control}
                  onChange={onChangeReport}
                />
                <label className="custom-control-label" htmlFor="reportCheck"><Typography>Attach Report</Typography></label>
              </InputWrapper>
            </Col>
            {reportSelect && (
              <Col md={6} lg={6} xl={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Template"
                      placeholder="Select Template"
                      required={false}
                      options={templates.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      }))}
                    />
                  }
                  control={control}
                  name="report_template_id"
                />
              </Col>
            )}
          </Row>
        )}
        <Row className="d-flex flex-wrap">
          {userType === "admin" &&
            <Col md={12} lg={12} xl={12} sm={12}>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="brokerCheck"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={brokerSelect} />
                  }
                  name="add_benefit1"
                  control={control}
                  onChange={onChangeBroker}
                />
                <label className="custom-control-label" htmlFor="brokerCheck"><Typography>Brokers</Typography></label>
              </InputWrapper>
            </Col>
          }
          {(!!brokerSelect) &&
            <>
              <Col md={6} lg={4} xl={4} sm={12}>
                <Head className='text-center'>Broker Method</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                    <input ref={register} name={'broker_all'} type={'radio'} value={1} defaultChecked={true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                    <input ref={register} name={'broker_all'} type={'radio'} value={0} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>

              {(brokerAll === '0') &&
                <>
                  <Col md={6} lg={4} xl={4} sm={12}>
                    <Controller
                      as={<SelectComponent
                        label="Broker"
                        placeholder='Select Broker'
                        options={broker_list.map((item) => ({
                          id: item?.id,
                          label: item?.name,
                          value: item?.id,
                        }))}
                        valueName="name"
                        id="id"
                        required={false}
                      />}
                      onChange={([e]) => {
                        setBroker(e?.value);
                        return e;
                      }}
                      name="broker_id"
                      control={control}
                    />
                  </Col>

                  <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                    <Btn type="button" onClick={onAddBroker}>
                      <i className="ti ti-plus"></i> Add
                    </Btn>
                  </Col>

                  {!!brokers.length && (
                    <BenefitList>
                      {brokers.map((item) => {
                        return (
                          <Chip
                            key={'broker' + item?.id}
                            id={item?.id}
                            name={item?.name}
                            onDelete={removeBroker}
                          />
                        );
                      })}
                    </BenefitList>
                  )}
                </>
              }
            </>
          }
        </Row>
        {(!!brokers.length && !!brokerSelect) &&
          <Row className="d-flex flex-wrap mt-4">
            <Col md={6} lg={4} xl={4} sm={12}>
              <Head className='text-center'>Policy Method</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                  <input ref={register} name={'policy_all'} type={'radio'} value={1} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                  <input ref={register} name={'policy_all'} type={'radio'} value={0} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>
            {(policyAll === '0') &&
              <>
                <Col md={6} lg={4} xl={4} sm={12}>
                  <Controller
                    as={<SelectComponent
                      label="Policy Name"
                      placeholder='Select Policy Name'
                      options={policyData.map((item) => ({
                        id: item?.id,
                        label: item?.policy_no,
                        value: item?.id,
                      }))}
                      valueName="name"
                      id="id"
                      required={false}
                    />}
                    onChange={([e]) => {
                      setPolicy(e?.value);
                      return e;
                    }}
                    name="policy_id"
                    control={control}
                  />
                </Col>

                <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                  <Btn type="button" onClick={onAddPolicy}>
                    <i className="ti ti-plus"></i> Add
                  </Btn>
                </Col>
                {!!policies.length && (
                  <BenefitList>
                    {policies.map((item) => {
                      return (
                        <Chip
                          key={'policies' + item?.id}
                          id={item?.id}
                          name={item?.policy_no}
                          onDelete={removePolicy}
                        />
                      );
                    })}
                  </BenefitList>
                )}
              </>
            }
          </Row>
        }
        {((!!brokers.length && !!brokerSelect) || (currentUser?.broker_id && userType === 'broker')) &&

          <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12} sm={12}>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="employerCheck"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={employerSelect} />
                  }
                  name="add_benefit2"
                  control={control}
                  onChange={onChangeEmployer}
                />
                <label className="custom-control-label" htmlFor="employerCheck"><Typography>Employers</Typography></label>
              </InputWrapper>
            </Col>
            {!!employerSelect &&
              <>
                <Col md={6} lg={4} xl={4} sm={12}>
                  <Head className='text-center'>Employer Method</Head>
                  <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                    <CustomControl className="d-flex mt-4 mr-0">
                      <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                      <input ref={register} name={'employer_all'} type={'radio'} value={1} defaultChecked={true} />
                      <span></span>
                    </CustomControl>
                    <CustomControl className="d-flex mt-4 ml-0">
                      <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                      <input ref={register} name={'employer_all'} type={'radio'} value={0} />
                      <span></span>
                    </CustomControl>
                  </div>
                </Col>
                {(employerAll === '0') &&
                  <>
                    <Col md={6} lg={4} xl={4} sm={12}>
                      <Controller
                        as={<SelectComponent
                          label="Employer"
                          placeholder='Select Employer'
                          options={employerData.map((item) => ({
                            id: item?.id,
                            label: item?.name,
                            value: item?.id,
                          }))}
                          valueName="name"
                          id="id"
                          required={false}
                        />}
                        onChange={([e]) => {
                          setEmployer(e?.value);
                          return e;
                        }}
                        name="employer_id"
                        control={control}
                      />
                    </Col>

                    <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                      <Btn type="button" onClick={onAddEmployer}>
                        <i className="ti ti-plus"></i> Add
                      </Btn>
                    </Col>

                    {!!employers.length && (
                      <BenefitList>
                        {employers.map((item) => {
                          return (
                            <Chip
                              key={'employer' + item?.id}
                              id={item?.id}
                              name={item?.name}
                              onDelete={removeEmployer}
                            />
                          );
                        })}
                      </BenefitList>
                    )}
                  </>
                }
              </>
            }
          </Row>
        }
        {((!!brokers.length && !!employers.length && !!employerSelect && !!brokerSelect) || (!!employers.length && !!employerSelect && userType === 'broker')) &&
          <Row className="d-flex flex-wrap">

            <Col md={12} lg={12} xl={12} sm={12}>
              <InputWrapper className="custom-control custom-checkbox">
                <Controller
                  as={
                    <input
                      id="employeeCheck"
                      className="custom-control-input"
                      type="checkbox"
                      defaultChecked={employeeSelect} />
                  }
                  name="add_benefit3"
                  control={control}
                  onChange={onChangeEmployee}
                />
                <label className="custom-control-label" htmlFor="employeeCheck"><Typography>Employee</Typography></label>
              </InputWrapper>
            </Col>

            {!!employeeSelect &&
              <>
                <Col md={6} lg={4} xl={4} sm={12}>
                  <Head className='text-center'>Employee Method</Head>
                  <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                    <CustomControl className="d-flex mt-4 mr-0">
                      <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                      <input ref={register} name={'employee_all'} type={'radio'} value={1} defaultChecked={true} />
                      <span></span>
                    </CustomControl>
                    <CustomControl className="d-flex mt-4 ml-0">
                      <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                      <input ref={register} name={'employee_all'} type={'radio'} value={0} />
                      <span></span>
                    </CustomControl>
                  </div>
                </Col>
                {(employeeAll === '0') &&
                  <>
                    <Col md={6} lg={4} xl={4} sm={12}>
                      <Controller
                        as={<SelectComponent
                          label="Employee"
                          placeholder='Select Employee'
                          // options={employeeData.map((item) => ({
                          //   id: item?.id,
                          //   label: item?.name,
                          //   value: item?.id,
                          // }))}
                          options={loadEMPData?.map((item) => ({
                            id: item?.id,
                            label: item?.name,
                            value: item?.id,
                          }))}

                          valueName="name"
                          id="id"
                          required={false}
                        />}
                        onChange={([e]) => {
                          setEmployee(e?.value);
                          return e;
                        }}
                        name="employee_id"
                        control={control}
                      />
                    </Col>

                    {!(_firstPage > _lastPage) &&
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}><LoaderButton percentage={(_firstPage - 1) * 100 / _lastPage} /></div>}

                    <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                      <Btn type="button" onClick={onAddEmployee}>
                        <i className="ti ti-plus"></i> Add
                      </Btn>
                    </Col>
                    {!!employees.length && (
                      <BenefitList>
                        {employees.map((item) => {
                          return (
                            <Chip
                              key={'employee' + item?.id}
                              id={item?.id}
                              name={item?.name}
                              onDelete={removeEmployee}
                            />
                          );
                        })}
                      </BenefitList>
                    )}
                  </>
                }
              </>
            }
          </Row>
        }
        <Row className="d-flex flex-wrap">
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </CardBlue>
  )
}
