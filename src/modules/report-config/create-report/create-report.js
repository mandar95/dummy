import React, { useEffect } from 'react';

import { Input, Head, SelectComponent, Button, Error } from '../../../components'
import { Row, Col, Form } from 'react-bootstrap';
import { CustomControl } from '../../user-management/AssignRole/option/style';
import * as yup from 'yup';
// import { InputWrapper, BenefitList } from '../../policies/steps/additional-details/styles';

import { useForm, Controller } from "react-hook-form";
import { loadTemplate, createCommunication } from '../report-config.slice'
import { useDispatch, useSelector } from 'react-redux';
// import { OptionInput } from '../../policies/approve-policy/style';

const validationSchema = yup.object().shape({
  name: yup.string().required('Report Name Required')
    .min(2, `Minimum ${2} character required`)
    .max(40, `Maximum ${40} character available`),
  template_id: yup.object().shape({
    id: yup.string().required('Template Required'),
  }),
  mail_to: yup.string().required('Mail To Required'),
  mail_cc: yup.string().required('Mail CC Required'),
});

const CreateReport = () => {
  const dispatch = useDispatch();
  const { control, errors, register, watch, handleSubmit } = useForm({
    validationSchema
  });
  const { templates } = useSelector(state => state.reportConfig);
  const { userType } = useSelector((state) => state.login);
  const triggerMethod = watch('trigger_method');
  // const [brokerSelect, setBrokerSelect] = useState();
  // const [broker, setBroker] = useState();
  // const [brokers, setBrokers] = useState([]);
  // const [employerSelect, setEmployerSelect] = useState();
  // const [employer, setEmployer] = useState();
  // const [employers, setEmployers] = useState([]);
  // const [employerData, setEmployerData] = useState([]);
  // const brokerAll = watch('broker_all');
  // const employerAll = watch('employer_all');

  useEffect(() => {
    if (userType) {
      dispatch(loadTemplate(userType));
    }
    // dispatch(loadBroker());
    // dispatch(loadBroker('Employer'));
    // dispatch(loadBroker('Employee'));
    // dispatch(loadPolicyType());
    // dispatch(loadPolicyNumber());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  // useEffect(() => {
  //   if (employer_list.length) {

  //     const temp = brokers.reduce((filtered, elem1) => {
  //       return [...filtered, ...employer_list.filter((elem2) => elem2.broker === elem1.name)]
  //     }, [])
  //     setEmployerData(temp)
  //   }
  // }, [employer_list, brokers])


  // useEffect(() => {
  //   let newEmployers = employerData.reduce((filtered, elem1) => {
  //     return [...filtered, ...employers.filter((elem2) => elem2.id === elem1.id)]
  //   }, [])
  //   setEmployers(newEmployers)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [employerData])


  // // Broker
  // const onChangeBroker = ([selected]) => {
  //   const target = selected.target;
  //   const checked = target && target.checked ? target.checked : false;
  //   setBrokerSelect(prev => checked);
  //   return selected;
  // };

  // const onAddBroker = () => {
  //   if (broker && Number(broker)) {
  //     const flag = broker_list?.find(
  //       (value) => value?.id === Number(broker)
  //     );
  //     const flag2 = brokers.some((value) => value?.id === Number(broker));
  //     if (flag && !flag2)
  //       setBrokers((prev) => [...prev, flag]);
  //   }
  // };

  // const removeBroker = (Broker) => {
  //   const filteredBrokers = brokers?.filter((item) => item?.id !== Broker);
  //   setBrokers((prev) => [...filteredBrokers]);
  // };

  // // Employer
  // const onChangeEmployer = ([selected]) => {
  //   const target = selected.target;
  //   const checked = target && target.checked ? target.checked : false;
  //   setEmployerSelect(prev => checked);
  //   return selected;
  // };

  // const onAddEmployer = () => {
  //   if (employer && Number(employer)) {
  //     const flag = employer_list?.find(
  //       (value) => value?.id === Number(employer)
  //     );
  //     const flag2 = employers.some((value) => value?.id === Number(employer));
  //     if (flag && !flag2)
  //       setEmployers((prev) => [...prev, flag]);
  //   }
  // };

  // const removeEmployer = (Broker) => {
  //   const filteredEmployers = employers?.filter((item) => item?.id !== Broker);
  //   setEmployers((prev) => [...filteredEmployers]);
  // };


  const onSubmit = ({ name, template_id, trigger_time, mail_cc, mail_to }) => {
    const result = {
      name,
      mail_cc,
      mail_to,
      report_template_id: template_id?.value,
      all_brokers: 0,
      all_employers: 0
      // ...(brokerSelect && {
      //   all_brokers: brokerAll === '0' ? 0 : 1,
      //   broker_ids: brokers.map((({ id }) => id))
      // }),
      // ...({
      //   all_employers: employerAll === '0' ? 0 : 1,
      //   employer_ids: employers.map((({ id }) => id))
      // })
    }
    const formdata = Object.assign(result, {
      frequency: triggerMethod, trigger_time: trigger_time
    })


    dispatch(createCommunication(formdata))
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <Input
                label='Report Name'
                placeholder="Enter Report Name"
                error={errors && errors.name}
                required={false}
                isRequired={true}
              />
            }
            control={control}
            name="name"
          />
          {!!errors.name &&
            <Error>
              {errors.name.message}
            </Error>}
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={
              <SelectComponent
                label="Template"
                placeholder="Select Template"
                required={false}
                isRequired={true}
                options={templates.map((item) => ({
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
          {!!errors.template_id?.id &&
            <Error>
              {errors.template_id?.id.message}
            </Error>}
        </Col>
        <Col xs={12} sm={12} md={6} lg={4} xl={3}>
          <Controller
            as={
              <Input label="Mail To" placeholder="Mail To" required={false}
                isRequired={true} />
            }
            name="mail_to"
            control={control}
          />
          {!!errors.mail_to &&
            <Error>
              {errors.mail_to.message}
            </Error>}
        </Col>
        <Col xs={12} sm={12} md={6} lg={4} xl={3}>
          <Controller
            as={
              <Input label="Mail CC" placeholder="Mail CC" required={false}
                isRequired={true} />
            }
            name="mail_cc"
            control={control}
          />
          {!!errors.mail_cc &&
            <Error>
              {errors.mail_cc.message}
            </Error>}
        </Col>
      </Row>
      {/* <Row className="d-flex flex-wrap">
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
                  name="add_benefit"
                  control={control}
                  onChange={onChangeBroker}
                />
                <label className="custom-control-label" htmlFor="brokerCheck"><Typography>Brokers</Typography></label>
              </InputWrapper>
            </Col>
            {!!brokerSelect &&
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
            }
            {(brokerAll === '0') &&
              <>
                <Col md={6} lg={4} xl={4} sm={12}>
                  <Select
                    label="Broker"
                    placeholder='Select Broker'
                    options={broker_list.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                    valueName="name"
                    id="id"
                    required
                    onChange={(e) => {
                      setBroker(e.target.value);
                    }}
                    name="broker_id"
                  />
                </Col>

                <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                  <Btn type="button" onClick={onAddBroker}>
                    <i className="ti ti-plus"></i> Add
              </Btn>
                </Col>

                {brokers.length ? (
                  <BenefitList>
                    {brokers.map((item) => {
                      return (
                        <Chip
                          key={item?.id}
                          id={item?.id}
                          name={item?.name}
                          onDelete={removeBroker}
                        />
                      );
                    })}
                  </BenefitList>
                ) : null}
              </>
            }
          </Row>
          {!!brokers.length &&

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
                    name="add_benefit"
                    control={control}
                    onChange={onChangeEmployer}
                  />
                  <label className="custom-control-label" htmlFor="employerCheck"><Typography>Employers</Typography></label>
                </InputWrapper>
              </Col>
              {!!employerSelect &&
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
                </Col>}
              {(employerAll === '0') &&
                <>
                  <Col md={6} lg={4} xl={4} sm={12}>
                    <Select
                      label="Employer"
                      placeholder='Select Employer'
                      options={employerData.map((item) => ({
                        id: item?.id,
                        name: item?.name,
                        value: item?.id,
                      }))}
                      valueName="name"
                      id="id"
                      required
                      onChange={(e) => {
                        setEmployer(e.target.value);
                      }}
                      name="employer_id"
                    />
                  </Col>

                  <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                    <Btn type="button" onClick={onAddEmployer}>
                      <i className="ti ti-plus"></i> Add
              </Btn>
                  </Col>

                  {employers.length ? (
                    <BenefitList>
                      {employers.map((item) => {
                        return (
                          <Chip
                            id={item?.id}
                            name={item?.name}
                            onDelete={removeEmployer}
                          />
                        );
                      })}
                    </BenefitList>
                  ) : null}
                </>
              }
            </Row>
          } */}
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={6} xl={6} sm={12}>
          <Head className='text-center'>Frequency</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2 text-nowrap" style={{ margin: '0 47px 50px -55px' }}>
            <CustomControl className="d-flex mt-4 mr-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Daily"}</p>
              <input ref={register} name={'trigger_method'} type={'radio'} value={1} defaultChecked={true} />
              <span></span>
            </CustomControl>
            <CustomControl className="d-flex mt-4 ml-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Alternate day"}</p>
              <input ref={register} name={'trigger_method'} type={'radio'} value={2} />
              <span></span>
            </CustomControl>
            <CustomControl className="d-flex mt-4 ml-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Once a week"}</p>
              <input ref={register} name={'trigger_method'} type={'radio'} value={3} />
              <span></span>
            </CustomControl>
            <CustomControl className="d-flex mt-4 ml-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Immediate"}</p>
              <input ref={register} name={'trigger_method'} type={'radio'} value={4} />
              <span></span>
            </CustomControl>
          </div>
        </Col>
        {triggerMethod !== "4" && <Col md={6} lg={6} xl={6} sm={12}>
          <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", textAlign: 'center' }}>{"Time"}</p>
          <div className="mt-4 ml-0">
            <input type="time" name="trigger_time" ref={register} disabled={triggerMethod === "4"} />
          </div>
        </Col>}
        <Col md={12} className="d-flex justify-content-end mt-4">
          {/* <Button type="button" onClick={() => resetForm} buttonStyle="danger">
                Cancel
              </Button> */}
          <Button type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default CreateReport;
