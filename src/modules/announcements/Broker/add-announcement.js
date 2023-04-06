import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Card, Chip, Error, SelectComponent, Button as BTN } from "../../../components";
import { AttachFile } from "../../core/attachFile/AttachFile";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { Decrypt, getFirstError } from "../../../utils";
import swal from "sweetalert";
import _ from "lodash";
import { BenefitList, CarausalDiv } from "../style";
import PreviewComponent from "./preview";
import { Img } from "../../../components/inputs/input/style"
import {
  // getEmployerName,
  // selectEmployerName,
  // getModules,
  getAllModulesTypes,
  // selectModule,
  getTypes,
  selectType,
  postAnnouncement,
  selectPostResp,
  postAlertCleanUp,
  getPosition,
  selectPosition,
  getAlignment,
  selectAlignment,
  getSize,
  selectSize,
  getSubType,
  selectSubType,
  loadBroker,
  loadAnnouncement,
  getAnncmtData as getAnncmtDataSlice,
  updateAnnouncement,
  // loadEmployer
} from "../announcement.slice";
import { useHistory, useParams } from "react-router";

// import { format } from 'date-fns'
import * as yup from 'yup';

import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";

const validationSchema = yup.object().shape({
  // policy_no: yup.string()
  //   .matches(/^[a-zA-Z0-9-/\s]+$/, {
  //     message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
  //     excludeEmptyString: true,
  //   })
  //   .required('Policy No required'),
  title: yup.string().required('Title required'),
  // content: yup.string().required('Content required'),
  // tc: yup.string().required('T&C required'),
  type_id: yup.string().required('Announcement Type required'),
  position: yup.string().required('Position required'),
  alignment: yup.string().required('Alignment required'),
  // link: yup.string().required('Link field required'),
  size: yup.string().required('Size field required'),
  // time: yup.string().required('Time required'),
  time_to_live: yup.number()
    .required('Time field required')
    .typeError('you must specify a number')
    .min(1, 'Min value 1.')
    .max(730, 'Max value 730.'),
  unit: yup.string().required('Unit field required'),
  start_date: yup.string().required('Start date is required'),
  // end_date: yup.string().required('End date is required')

});

const AddComponent = ({ onHide }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { globalTheme } = useSelector(state => state.theme)
  const { handleSubmit, control, errors, watch, setValue, reset } = useForm({
    validationSchema
  });
  let { userType, id } = useParams();

  id = Decrypt(id);
  const type_id = watch('type_id');
  const brokerId = (watch("broker_id") || {})?.id;

  //selectors
  // const employerResp = useSelector(selectEmployerName);
  // const moduleResp = useSelector(selectModule);
  const typeResp = useSelector(selectType);
  const postResp = useSelector(selectPostResp);
  const positionResp = useSelector(selectPosition);
  const alignmentResp = useSelector(selectAlignment);
  const sizeResp = useSelector(selectSize);
  const subTypeResp = useSelector(selectSubType);
  const { broker: brokerData, Modules, getAnncmtData } = useSelector(state => state.announcement);
  const { userType: userTypeName, currentUser } = useSelector(state => state.login);

  const { employers: employerList,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  //states
  const [file, setFile] = useState([]);

  // const [minDate, setMinDate] = useState(null);
  //Api Calls-----------------
  useEffect(() => {
    if (id) {
      dispatch(loadAnnouncement(id))

      return () => {
        dispatch(setPageData({
          firstPage: 1,
          lastPage: 1
        }));
        dispatch(getAnncmtDataSlice({}));
      }
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
    if (userTypeName || currentUser.broker_id) {
      if (userTypeName === 'admin') {
        dispatch(loadBroker(userTypeName))
        // dispatch(loadEmployer(userTypeName))
      }
      else {
        // dispatch(getEmployerName(currentUser.broker_id));
      }
      dispatch(getAllModulesTypes(userTypeName));
      // dispatch(getModules(userTypeName));
      dispatch(getTypes());
      dispatch(getPosition());
      dispatch(getAlignment());
      dispatch(getSize());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);
  //--------------------------

  // chip add delete----------------------------


  /*--------------------------Broker Chip Selection code----------------------*/
  //chip states
  const [broker, setBroker] = useState("");
  const [brokers, setBrokers] = useState([]);

  /*---------add---------------*/

  const onAddBroker = () => {
    if (broker && Number(broker)) {
      const flag = brokerData?.find(
        (value) => value?.id === Number(broker)
      );
      const flag2 = brokers.some((value) => value?.id === Number(broker));
      if (flag && !flag2) setBrokers((prev) => [...prev, flag]);
      // reset({
      //   broker_ids: "",
      // });
      setValue('broker_id', '');

    }
  };

  /*-----------------remove------------------*/
  const removeBroker = (Broker) => {
    const filteredBrokers = brokers.filter((item) => item?.id !== Broker);
    setBrokers((prev) => [...filteredBrokers]);
  };

  /*---------------------------------X------------------------------------*/


  /*--------------------------Employer Chip Selection code----------------------*/
  //chip states
  const [employer, setEmployer] = useState("");
  const [employers, setEmployers] = useState([]);

  /*---------add---------------*/

  const onAdd = () => {
    if (employer && Number(employer)) {
      const flag = employerList?.find(
        (value) => value?.id === Number(employer)
      );
      const flag2 = employers.some((value) => value?.id === Number(employer));
      if (flag && !flag2) setEmployers((prev) => [...prev, flag]);
      setValue('employer_id', '');
    }
  };

  /*-----------------remove------------------*/
  const removeEmployer = (Employer) => {
    const filteredEmployers = employers.filter((item) => item?.id !== Employer);
    setEmployers((prev) => [...filteredEmployers]);
  };

  /*---------------------------------X------------------------------------*/

  /*--------------------------Module Chip Selection code----------------------*/
  //chip states
  const [getmodule, setModule] = useState("");
  const [modules, setModules] = useState([]);

  /*---------add---------------*/

  const onAddModule = () => {
    if (getmodule && Number(getmodule)) {
      let flag = false;
      flag = Modules?.find(
        (value) => value?.id === Number(getmodule)
      );

      const flag2 = modules.some((value) => value?.id === Number(getmodule));

      if (flag && !flag2) setModules((prev) => [...prev, flag]);
      setValue('module_id', '');
    }
  };

  /*-----------------remove------------------*/
  const removeModule = (Module) => {
    const filteredModules = modules.filter((item) => item?.id !== Module);
    setModules((prev) => [...filteredModules]);
  };

  /*---------------------------------X------------------------------------*/


  useEffect(() => {
    if (!_.isEmpty(getAnncmtData)) {
      setEmployers(getAnncmtData.employer || []);
      setModules(getAnncmtData.module?.map(elem => ({ id: elem.id, name: elem.module_name })) || []);

      reset({
        type_id: getAnncmtData.type_id,
        content: getAnncmtData.content,
        title: getAnncmtData.title,
        tc: getAnncmtData.term_condition,
        position: getAnncmtData.position_id,
        alignment: getAnncmtData.alignment_id,
        link: getAnncmtData.link,
        time_to_live: getAnncmtData.time_to_live,
        unit: [
          { id: 0, name: "Minutes", value: 0 },
          { id: 1, name: "Hours", value: 1 },
          { id: 2, name: "Days", value: 2 },
        ].find(({ name }) => name === getAnncmtData.unit)?.id || 0,
        color: getAnncmtData.color,
        bg_color: getAnncmtData.bg_color,
        sub_type_id: getAnncmtData.sub_type_id,
        start_date: getAnncmtData.start_date,
        status: getAnncmtData.status,

        size: getAnncmtData.size_id
      })

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAnncmtData])


  //---------------------------------------------

  //getfile---------------
  const getFile = (Newfile) => {
    if (!_.isEmpty(Newfile)) {
      // if (Newfile[0].size < 2097152) {
      if (Number(type_id) !== 1) {
        setFile((prev) => [...file, Newfile[0]]);
      }
      else {
        if (file.length < 1) {
          setFile((prev) => [...file, Newfile[0]]);
        }
        else {
          swal("Banner allows only one image, select carousel for multiple images!", "", "warning");
        }
      }
      // }
      // else {
      //   swal("File size must under 2MB!", "", "warning");
      // }


    }
  };

  useEffect(() => {
    setFile((prev) => []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type_id])

  const removeFile = (FileIndex) => {
    const filteredFiles = file.filter((item) => item !== file[FileIndex]);
    setFile((prev) => [...filteredFiles]);
  };
  //------------------------

  //api call for subtype--------------
  useEffect(() => {
    if (type_id) {
      const data = { master_type_id: type_id };
      dispatch(getSubType(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type_id]);
  //----------------------------------
  const setDateFormate = (date) => {
    // let _date = date.split("T")[0]
    // let _time = date.split("T")[1].split(":")
    // _time.push("00")
    // let timeWithSec = _time.join(":")
    let today = new Date(date);
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var date_ =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var dateTime = date_ + " " + time;
    return dateTime;
  };
  //on Submit --------
  const onSubmit = (data) => {
    if (!_.isEmpty(employers) || !_.isEmpty(modules)) {
      const formdata = new FormData();
      if (!_.isEmpty(brokers)) {
        // let employerArray = employers.map(Number);
        brokers.forEach((data, index) => {
          formdata.append("brokers_ids[]", data.id);
        });
      }
      if (!_.isEmpty(employers)) {
        // let employerArray = employers.map(Number);
        employers.forEach((data, index) => {
          formdata.append("employer_ids[]", data.id);
        });
      }
      if (!_.isEmpty(modules)) {
        // let moduleArray = modules.map(Number);
        modules.forEach((data, index) => {
          formdata.append("module_ids[]", data.id);
        });
      }
      formdata.append("type_id", data.type_id);
      formdata.append("status", data.status);
      if (data.sub_type_id) {
        formdata.append("sub_type_id", data.sub_type_id);
      }
      //appending multiple files
      if (!_.isEmpty(file)) {
        file.forEach((data, index) => {
          formdata.append(`images[]`, data);
        })
      };
      data.content && formdata.append("content", data.content || '-');
      formdata.append("title", data.title || '-');
      data.tc && formdata.append("tc", data.tc || '-');
      formdata.append("position_id", data.position);
      formdata.append("alignment_id", data.alignment);
      data.link && formdata.append("link", data.link);
      formdata.append("size_id", data.size);
      formdata.append("time_to_live", data.time_to_live);
      formdata.append("start_date", setDateFormate(data.start_date));
      formdata.append("unit", data.unit);
      formdata.append("color", data.color);
      formdata.append("bg_color", data.bg_color);
      id && formdata.append("_method", "PATCH");
      dispatch((id ? updateAnnouncement : postAnnouncement)(formdata, id, goToListing));
    } else {
      swal("Fill all the required fields", "", "warning");
    }
  };
  //-----------------

  //Alerts------------------------------------------------
  useEffect(() => {
    if (!_.isEmpty(postResp)) {
      if (postResp?.data?.status) {
        swal(postResp?.data?.message, "", "success").then(() => {
          dispatch(postAlertCleanUp());
          onHide && onHide();
          id && goToListing()
        });
      } else {
        let error =
          postResp?.data?.errors && getFirstError(postResp?.data?.errors);
        error = error ? error : postResp?.data?.message;
        swal("", error, "warning").then(() => dispatch(postAlertCleanUp()));
      }
    }

    // dispatch(postAlertCleanUp());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postResp]);

  const goToListing = () => {
    history.push(`/${userType || 'broker'}/announcement-config`)
  }

  //------------------------------------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card title={`${id ? 'Update' : 'Add'} Announcement`}>
        <div>
          <Row xs={1} sm={2} md={2} lg={2} xl={2}>
            {/*Broker*/}
            {userType === 'admin' &&
              <div>
                <div className="p-2">
                  <Controller
                    as={<SelectComponent
                      label="Broker"
                      placeholder='Select Broker'
                      options={brokerData.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      }))}
                      valueName="name"
                      id="id"
                      required={false}
                      isRequired={true}
                    />}
                    onChange={([e]) => {
                      setBroker(e?.value);
                      return e;
                    }}
                    name="broker_id"
                    control={control}
                  />
                </div>
                <div style={{ display: "flex", paddingBottom: "10px" }}>
                  <div className="p-2">
                    <Button type="button" onClick={onAddBroker}>
                      <i className="ti ti-plus"></i> Add
                    </Button>
                  </div>
                </div>
                {brokers.length ? (
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
                ) : null}
              </div>
            }

            <div>
              {/*Employer*/}
              <div className="p-2">
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    options={employerList?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) || []}
                    required={false}
                    isRequired={true}
                  />}
                  onChange={([e]) => {
                    setEmployer(e?.value);
                    return e;
                  }}
                  name='employer_id'
                  control={control}
                />
              </div>
              <div style={{ display: "flex", paddingBottom: "10px" }}>
                <div className="p-2">
                  <Button type="button" onClick={onAdd}>
                    <i className="ti ti-plus"></i> Add
                  </Button>
                </div>
              </div>
              {employers.length ? (
                <BenefitList>
                  {employers.map((item) => {
                    return (
                      <Chip
                        key={'employer' + item?.id}
                        id={item?.id}
                        name={item?.company_name || item?.name}
                        onDelete={removeEmployer}
                      />
                    );
                  })}
                </BenefitList>
              ) : null}
            </div>
            {/*Module*/}
            <div>
              <div className="p-2">
                <Controller
                  as={<SelectComponent
                    label="Module"
                    placeholder="Select Module"
                    options={Modules?.map((item) => ({
                      id: item?.id,
                      label: item?.name || item?.moduleName,
                      value: item?.id,
                    }))}
                    required={false}
                    isRequired={true}
                  />}
                  onChange={([e]) => {
                    setModule(e?.value);
                    return e;
                  }}
                  name='module_id'
                  control={control}
                />
              </div>
              <div style={{ display: "flex", paddingBottom: "10px" }}>
                <div className="p-2">
                  <Button type="button" onClick={onAddModule}>
                    <i className="ti ti-plus"></i> Add
                  </Button>
                </div>
              </div>
              {modules.length ? (
                <BenefitList>
                  {modules.map((item) => (
                    <Chip
                      key={'modules' + item?.id}
                      id={item?.id}
                      name={`${item?.name || item?.moduleName}`}
                      onDelete={removeModule}
                    />
                  ))}
                </BenefitList>
              ) : null}
            </div>
          </Row>
        </div>
      </Card>
      <Card title="Display Parameters">
        <Row xs={1} sm={2} md={2} lg={3} xl={3}>
          <div className="p-2">
            <Controller
              as={
                <Select
                  label="Announcement Type"
                  placeholder="Select Announcement Type"
                  options={typeResp?.data?.data?.map((item) => ({
                    id: item?.id,
                    name: item?.name,
                    value: item?.id,
                  }))}
                />
              }
              required={false}
              isRequired={true}
              name="type_id"
              control={control}
              error={errors && errors.type_id}
            />
            {!!errors.type_id && <Error>
              {errors.type_id.message}
            </Error>}
          </div>
          {Number(type_id) === 1 && <div className="p-2">
            <Controller
              as={
                <Select
                  label="Sub Type"
                  placeholder="Select Sub Type"
                  required={true}
                  options={subTypeResp?.data?.data?.map((item) => ({
                    id: item?.id,
                    name: item?.name,
                    value: item?.id,
                  })) || []}
                />
              }
              name="sub_type_id"
              control={control}
            />
          </div>}
          <div className="p-2">
            <Controller
              as={<Switch />}
              name="status"
              control={control}
              defaultValue={0}
            />
          </div>
        </Row>
      </Card>
      <Card title="Media">
        <CarausalDiv>
          <Row sm={1} md={id ? 1 : 2} lg={id ? 1 : 2} xl={id ? 1 : 2}>
            {!id && <div style={{ padding: "10px" }}>
              <AttachFile
                accept=".png,.jpeg,.jpg"
                key="images"
                onUpload={getFile}
                description="File Formats: (.jpg , .png, .jpeg)"
                nameBox
                required={!(Number(type_id) === 1)}
              />
              {file.length ? (
                <BenefitList>
                  {file.map((item, index) => (
                    <Chip key={'file' + index} id={index} name={item.name} onDelete={removeFile} />
                  ))}
                </BenefitList>
              ) : null}
            </div>}
            <PreviewComponent
              getAnncmtData={getAnncmtData}
              file={file}
              style={{
                transitionTimingFunction: "ease-in",
                transitionDelay: "1s",
              }}
            />
          </Row>
        </CarausalDiv>
        <CarausalDiv>
          <div style={{ padding: "10px", marginTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <label style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>
                <u>Media Text Content</u>
                {(Number(type_id) === 1 ? true : !file?.length) && <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>}
              </label>
            </div>
            <Controller
              as={<Form.Control as="textarea" rows="3" />}
              name="content"
              control={control}
              required={Number(type_id) === 1 ? true : !file?.length}
            />
            {!!errors.content && <Error top={'0'}>
              {errors.content.message}
            </Error>}
          </div>
        </CarausalDiv>
      </Card>
      <Card title="Announcement Parameters">
        <div>
          <Row xs={1} sm={2} md={3} lg={4} xl={4}>
            <div className="p-2">
              <Controller
                as={<Input label="Title" placeholder="Enter Title"
                  required={false}
                  isRequired={true}
                />}
                name="title"
                error={errors && errors.title}
                control={control}
              />
              {!!errors.title && <Error>
                {errors.title.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Input
                    label="Terms & Conditions"
                    placeholder="Terms & Conditions"
                    required={false}
                    isRequired={false}
                  />
                }
                name="tc"
                error={errors && errors.tc}
                control={control}
              />
              {!!errors.tc && <Error>
                {errors.tc.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Position"
                    placeholder="Select Position"
                    options={positionResp?.data?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                required={false}
                isRequired={true}
                name="position"
                control={control}
                error={errors && errors.position}
              />
              {!!errors.position && <Error>
                {errors.position.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Alignment"
                    placeholder="Select Alignment"
                    options={alignmentResp?.data?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                required={false}
                isRequired={true}
                name="alignment"
                control={control}
                error={errors && errors.alignment}
              />
              {!!errors.alignment && <Error>
                {errors.alignment.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={<Input label="Link" placeholder="Enter Media Link" required />}
                name="link"
                control={control}
                required={false}
                isRequired={false}
                error={errors && errors.link}
              />
              {!!errors.link && <Error>
                {errors.link.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Size"
                    placeholder="Select Size"
                    options={sizeResp?.data?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                name="size"
                control={control}
                required={false}
                isRequired={true}
                error={errors && errors.size}
              />
              {!!errors.size && <Error>
                {errors.size.message}
              </Error>}
            </div>
            {/*
              <div className="p-2">
                <Controller
                  as={<Input label="Text Colour" placeholder="Select Colour" />}
                  name="color"
                  control={control}
                />
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <Input
                      label="Background Colour"
                      placeholder="Select Background Colour"
                    />
                  }
                  name="bg_color"
                  control={control}
                />
              </div>*/}
            <div className="p-2">
              <Controller
                as={<Input label="Time" min={1} type="number" placeholder="Time" required={false}
                  isRequired={true} />}
                name="time_to_live"
                control={control}
                error={errors && errors.time_to_live}
              />
              {!!errors.time_to_live && <Error>
                {errors.time_to_live.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Time(Unit)"
                    placeholder="Unit"
                    options={[
                      { id: 0, name: "Minutes", value: 0 },
                      { id: 1, name: "Hours", value: 1 },
                      { id: 2, name: "Days", value: 2 },
                    ]}
                    required={false}
                    isRequired={true}
                  />
                }
                name="unit"
                control={control}
                error={errors && errors.unit}
              />
              {!!errors.unit && <Error>
                {errors.unit.message}
              </Error>}
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Input
                    label="Start Date"
                    // type="date"
                    type="datetime-local"
                    placeholder="Start Date"
                  // value={_memberData1?.appointment_request_date_time}
                  />
                }
                isRequired
                name={`start_date`}

                control={control}
              // defaultValue={moment(
              //   _memberData1?.appointment_request_date_time
              // ).format("YYYY-MM-DDTHH:mm") }
              />
            </div>
            {/* <div className="p-2">
                <Controller
                  as={
                    <Input
                      label="End Date"
                      // type="date"
                      type="datetime-local"
                      placeholder="End Date"
                    // value={_memberData1?.appointment_request_date_time}
                    />
                  }
                  isRequired
                  name={`end_date`}

                  control={control}
                // defaultValue={moment(
                //   _memberData1?.appointment_request_date_time
                // ).format("YYYY-MM-DDTHH:mm") }
                />
              </div> */}
            {/* <div className="p-2">
                <Controller
                  as={
                    <DatePicker
                      name={'start_date'}
                      label={'Start Date'}
                      required={false}
                      isRequired={true}
                    />
                  }
                  onChange={([selected]) => {
                    setMinDate(selected);
                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="start_date"
                  control={control}
                  error={errors && errors.start_date}
                />
                {!!errors.start_date && <Error>
                  {errors.start_date.message}
                </Error>}
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <DatePicker
                      minDate={minDate}
                      name={'end_date'}
                      label={'End Date'}
                      required={false}
                      isRequired={true}
                    />
                  }
                  onChange={([selected]) => {
                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="end_date"
                  control={control}
                  error={errors && errors.end_date}
                />
                {!!errors.end_date && <Error>
                  {errors.end_date.message}
                </Error>}
              </div> */}
          </Row>
        </div>
      </Card>
      <Card title="Colour Selection">
        <Row className="d-flex justify-content-center">

          <Col xl={4} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Input
                  type="color"
                  label="Text Color"
                  placeholder="Select Text Color"
                  required={false}
                  isRequired={true}
                />
              }
              isRequired
              name="color"
              error={errors && errors.cardColor}
              control={control}
            />
          </Col>

          {Number(type_id) === 1 &&
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <Input
                    type="color"
                    label="Background Color"
                    placeholder="Select Background Color"
                    required={false}
                    isRequired={true}
                  />
                }
                isRequired
                name="bg_color"
                error={errors && errors.cardColor}
                control={control}
              />
            </Col>
          }
        </Row>
        <Row className="d-flex justify-content-end">
          <BTN
            type='button'
            buttonStyle='danger'
            onClick={id ? goToListing : onHide}>
            Close
          </BTN>
          <BTN type="submit">
            {id ? 'Update' : 'Save'}
          </BTN>
        </Row>
      </Card>
    </form>
  );
};
export default AddComponent;
