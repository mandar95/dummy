import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import PolicyTable from "./PolicyTable";
import { CardBlue } from "../../components";
import { Select, Input, Button, Error, DatePicker } from "../../components";
import { AttachFile } from "../core/attachFile/AttachFile";
import { Row } from "react-bootstrap";
import Radiobutton from "./radiobutton";
import { DivSelect, DivButton } from "./style";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { getFirstError, numOnly, noSpecial } from "../../utils";
import * as yup from "yup";
import {
  getPoliciesData,
  getPolicyData,
  getMasterPolicyData,
  selectMasterPolicyData,
  addMyPolicyData,
  selectMyPolicyData,
} from "./MyPolicy.slice";
import { format } from 'date-fns'


const MyInsurance = (props) => {
  //selectors
  const dispatch = useDispatch();
  const [insurerId, setInsurerId] = useState(null);


  const validationSchema = yup.object().shape({
    premium: yup.number().typeError('Premium Required').min(1).max(100000000, "max limit is 100000000").required('Premium Required'),
    suminsured: yup.number().typeError('Sum Insured Required').min(1).max(100000000, "max limit is 100000000").required('Sum Insured Required'),
    company_name: yup.string().required('Company Name Required')
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .min(2, `Minimum ${2} character required`)
      .max(40, `Maximum ${40} character available`),
    policy_number: yup.string()
      .matches(/^[a-zA-Z0-9-/\s]+$/, {
        message: 'Alphanumeric characters, hyphen(-) & frontslash(/) only',
        excludeEmptyString: true,
      }).required('Policy ID Required'),
    start_date: yup.string().required('Start Date Required').nullable(),
    end_date: yup.string().required('End Date Required').nullable(),
    ...((Number(insurerId) === 1 || Number(insurerId) === 2) && {
      vehicle_reg_no: yup.string().required('Vehicle Reg No Required'),
      vehicle_reg_date: yup.string().required('Vehicle Reg Date Required').nullable()
      // .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, {
      //   message: 'Please enter valid registration number',
      //   excludeEmptyString: true,
      // })
    }),
    ...((Number(insurerId) === 3) && {
      travel_trip_type: yup.string().required('Travel Trip Required'),
      travel_location: yup.string().required('Travel Location Required'),
    })

  })
  // const validationSchema = yup.object().shape(Number(insurerId) < 3 ? {
  //   premium: yup.string().required('Premium Required'),
  //   suminsured: yup.string().required('Sum Insured Required'),
  //   company_name: yup.string().required('Company Name Required')
  //     .min(2, `Minimum ${2} character required`)
  //     .max(40, `Maximum ${40} character available`),
  //   policy_number: yup.string().required('Policy ID Required'),
  //   vehicle_reg_no: yup.string().required('Vehicle Reg No Required')
  //     .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, {
  //       message: 'Please enter valid registration number',
  //       excludeEmptyString: true,
  //     })
  // } : {})

  const { control, handleSubmit, reset, errors } = useForm({
    validationSchema
  });
  const MyPolicyResp = useSelector(selectMyPolicyData);
  const MasterPolicyResponse = useSelector(selectMasterPolicyData);
  //states--------------------------------------
  const [file, setFile] = useState([]);
  const [enableAlert, setEnableAlert] = useState(null);
  // const [fields, setFields] = useState(null);
  const [dispatchType, setdispatchType] = useState("Normal");
  const [sDate, setSDate] = useState(null);
  //---------------------------------------------

  //get file ------------------------------
  const getFile = (file) => {
    setFile(file);
  };
  //------------------------------
  //get insurer Id and field parameters(radio button)-----
  const getInsurerId = (e, car, bike, travel) => {
    reset({
      start_date: null,
      end_date: null,
    });
    setInsurerId(e.target.value);
    //clearing states to reset values -----------
    setdispatchType("");
    // setFields(<noscript />);
    //-------------------------------------------
    if (car === 1 && bike === 0 && travel === 0) {
      setdispatchType("Car");
      // setFields(
      //   <>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={<Input label="Registration Number" />}
      //         control={control}
      //         required={false}
      //         isRequired={true}
      //         name="vehicle_reg_no"
      //         placeholder="e.g MH05DO1017"
      //         error={errors && errors.vehicle_reg_no}
      //       />
      //       {!!errors?.vehicle_reg_no && <Error>{errors?.vehicle_reg_no.message}</Error>}
      //     </DivSelect>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={
      //           <DatePicker
      //             name={'vehicle_reg_date'}
      //             label={'Registration Date'}
      //             required={false}
      //             isRequired={true}
      //           />
      //         }
      //         onChange={([selected]) => {
      //           return selected ? format(selected, 'dd-MM-yyyy') : '';
      //         }}
      //         name="vehicle_reg_date"
      //         control={control}
      //       />
      //     </DivSelect>
      //   </>
      // );
    } else if (car === 0 && bike === 1 && travel === 0) {
      setdispatchType("Bike");
      // setFields(
      //   <>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={<Input label="Registration Number" />}
      //         control={control}
      //         required={false}
      //         isRequired={true}
      //         name="vehicle_reg_no"
      //         placeholder="e.g MH05DO101"
      //         error={errors && errors.vehicle_reg_no}
      //       />
      //       {!!errors?.vehicle_reg_no && <Error>{errors?.vehicle_reg_no.message}</Error>}
      //     </DivSelect>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={
      //           <DatePicker
      //             name={'vehicle_reg_date'}
      //             label={'Registration Date'}
      //             required={false}
      //             isRequired={true}
      //           />
      //         }
      //         onChange={([selected]) => {
      //           return selected ? format(selected, 'dd-MM-yyyy') : '';
      //         }}
      //         name="vehicle_reg_date"
      //         control={control}
      //       />
      //     </DivSelect>
      //   </>
      // );
    } else if (car === 0 && bike === 0 && travel === 1) {
      setdispatchType("Travel");
      // setFields(
      //   <>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={<Input label="Travel Location" />}
      //         control={control}
      //         name="travel_location"
      //         placeholder="Travel Location"
      //         required={false}
      //         isRequired={true}
      //       />
      //       {!!errors?.travel_location && <Error>{errors?.travel_location.message}</Error>}
      //     </DivSelect>
      //     <DivSelect className="p-2">
      //       <Controller
      //         as={
      //           <Select
      //             label="Travel Trip Type"
      //             options={[
      //               { name: "Single Trip", value: "Single Trip" },
      //               { name: "Annual Multi-Trip", value: "Annual Multi-Trip" },
      //             ]}
      //           />
      //         }
      //         control={control}
      //         name="travel_trip_type"
      //         placeholder="Travel Trip Type"
      //         required={false}
      //         isRequired={true}
      //       />
      //       {!!errors?.travel_trip_type && <Error>{errors?.travel_trip_type.message}</Error>}
      //     </DivSelect>
      //   </>
      // );
    } else {
      // setFields(<noscript />);
      setdispatchType("Normal");
    }
  };
  //---------------------------------
  // useEffect(() => {
  //   if (errors?.vehicle_reg_no?.message) {
  //     swal("", errors?.vehicle_reg_no?.message, "warning");
  //   }
  // }, [errors])
  //MasterPolicy  API-------------
  useEffect(() => {
    dispatch(getMasterPolicyData());
    dispatch(getPolicyData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //------------------------------

  //HandleSubmit -----------------
  const onSubmit = (data) => {
    if (insurerId !== null) {
      const imageData = new FormData();
      file.length && imageData.append("image", file[0]);
      imageData.append("insurer_type_id", insurerId);
      imageData.append("status", 1);
      imageData.append("policy_no", data?.policy_number);
      imageData.append("suminsured", data?.suminsured);
      imageData.append("premium", data?.premium);
      imageData.append("start_date", data?.start_date);
      imageData.append("end_date", data?.end_date);
      imageData.append("company_name", data?.company_name);
      switch (dispatchType) {
        case "Normal":
          dispatch(addMyPolicyData(imageData));
          setEnableAlert(1);
          break;
        case "Car":
          imageData.append("vehicle_reg_no", data?.vehicle_reg_no);
          imageData.append("vehicle_reg_date", data?.vehicle_reg_date);
          dispatch(addMyPolicyData(imageData));
          setEnableAlert(1);
          break;
        case "Bike":
          imageData.append("vehicle_reg_no", data?.vehicle_reg_no);
          imageData.append("vehicle_reg_date", data?.vehicle_reg_date);
          dispatch(addMyPolicyData(imageData));
          setEnableAlert(1);

          break;
        case "Travel":
          imageData.append("travel_location", data?.travel_location);
          imageData.append("travel_trip_type", data?.travel_trip_type);
          dispatch(addMyPolicyData(imageData));
          setEnableAlert(1);
          break;
        default:
          console.error("no dispatch type");
      }
    } else {
      swal("Please select policy type", "", "warning");
    }
  };
  //------------------------------

  //acknowldgment of submission -------------------
  useEffect(() => {
    if (enableAlert === 1) {
      if (MyPolicyResp?.data?.status === true) {
        swal("Successfully added", "", "success").then(() => {
          dispatch(getPoliciesData());
          switch (dispatchType) {
            case "Normal":
              reset({
                policy_number: "",
                start_date: "",
                end_date: "",
                company_name: "",
                suminsured: "",
                premium: "",
              });
              break;
            case "Car":
              reset({
                policy_number: "",
                start_date: "",
                end_date: "",
                company_name: "",
                suminsured: "",
                premium: "",
                vehicle_reg_no: "",
                vehicle_reg_date: "",
              });
              break;
            case "Bike":
              reset({
                policy_number: "",
                start_date: "",
                end_date: "",
                company_name: "",
                suminsured: "",
                premium: "",
                vehicle_reg_no: "",
                vehicle_reg_date: "",
              });
              break;
            case "Travel":
              reset({
                policy_number: "",
                start_date: "",
                end_date: "",
                company_name: "",
                suminsured: "",
                premium: "",
                travel_location: "",
                travel_trip_type: "",
              });
              break;
            default:
              reset({
                policy_number: "",
                start_date: "",
                end_date: "",
                company_name: "",
                suminsured: "",
                premium: "",
              });
          }
          setFile([]);
        });
        setEnableAlert(0);
      } else {
        let error =
          MyPolicyResp?.data?.errors &&
          getFirstError(MyPolicyResp?.data?.errors);
        error = error
          ? error
          : MyPolicyResp?.data?.message
            ? MyPolicyResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setEnableAlert(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyPolicyResp]);
  //--------------------------------

  return (
    <>
      <CardBlue title="My Insurance Policy" round>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginTop: "-20px", width: "100%" }}>
            <Radiobutton
              Data={MasterPolicyResponse?.data?.data}
              getInsurerId={getInsurerId}
            />
            <Row xs={1} sm={1} lg={3} xl={4}>
              <DivSelect className="p-2">
                <Controller
                  as={<Input label="Policy"
                    required={false}
                    isRequired={true}
                    placeholder="Policy" />}
                  control={control}
                  error={errors?.policy_number}
                  name="policy_number"
                />
                {!!errors?.policy_number && <Error>{errors?.policy_number.message}</Error>}
              </DivSelect>
              <DivSelect className="p-2">
                {/* <Controller
                  as={<Input type="1Date" label="Policy Start Date" />}
                  onBlur={([selected]) => {
                    setSDate(selected.target.value);
                    return selected;
                  }}
                  control={control}
                  name="start_date"
                /> */}
                <Controller
                  as={
                    <DatePicker
                      name={'start_date'}
                      label={'Policy Start Date'}
                      required={false}
                      isRequired={true}
                      error={errors?.start_date}
                    />
                  }
                  onChange={([selected]) => {
                    setSDate(selected);
                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="start_date"
                  control={control}
                />
                {!!errors?.start_date && <Error>{errors?.start_date.message}</Error>}
              </DivSelect>
              <DivSelect className="p-2">
                {/* <Controller
                  as={<Input type="1Date" label="Policy End Date" />}
                  onBlur={([selected]) => {
                    let Age = Math.floor(
                      (new Date(selected.target.value).getTime() -
                        new Date(sDate)) /
                      3.15576e10
                    );
                    if (Age > 1 && dispatchType === "Travel") {
                      swal(
                        "Difference between the start date and end date cannot be more than 1 year",
                        "",
                        "warning"
                      ).then(() =>
                        reset({
                          start_date: null,
                          end_date: null,
                        })
                      );
                    }
                    setSDate(null);
                    return selected;
                  }}
                  control={control}
                  name="end_date"
                /> */}
                <Controller
                  as={
                    <DatePicker
                      minDate={sDate}
                      name={'end_date'}
                      label={'Policy End Date'}
                      required={false}
                      error={errors?.end_date}
                      isRequired={true}
                    />
                  }
                  onChange={([selected]) => {

                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="end_date"
                  control={control}
                />
                {!!errors?.end_date && <Error>{errors?.end_date.message}</Error>}
              </DivSelect>
              {/* {fields} */}
              {dispatchType === 'Car' &&
                <>
                  <DivSelect className="p-2">
                    <Controller
                      as={<Input label="Registration Number" />}
                      control={control}
                      required={false}
                      isRequired={true}
                      name="vehicle_reg_no"
                      placeholder="e.g MH05DO1017"
                      error={errors && errors.vehicle_reg_no}
                    />
                    {!!errors?.vehicle_reg_no && <Error>{errors?.vehicle_reg_no.message}</Error>}
                  </DivSelect>
                  <DivSelect className="p-2">
                    <Controller
                      as={
                        <DatePicker
                          name={'vehicle_reg_date'}
                          label={'Registration Date'}
                          required={false}
                          isRequired={true}
                          error={errors?.vehicle_reg_date}
                        />
                      }
                      onChange={([selected]) => {
                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                      }}
                      name="vehicle_reg_date"
                      control={control}
                    />
                    {!!errors?.vehicle_reg_date && <Error>{errors?.vehicle_reg_date.message}</Error>}
                  </DivSelect>
                </>
              }

              {dispatchType === 'Bike' &&
                <>
                  <DivSelect className="p-2">
                    <Controller
                      as={<Input label="Registration Number" />}
                      control={control}
                      required={false}
                      isRequired={true}
                      name="vehicle_reg_no"
                      placeholder="e.g MH05DO101"
                      error={errors && errors.vehicle_reg_no}
                    />
                    {!!errors?.vehicle_reg_no && <Error>{errors?.vehicle_reg_no.message}</Error>}
                  </DivSelect>
                  <DivSelect className="p-2">
                    <Controller
                      as={
                        <DatePicker
                          name={'vehicle_reg_date'}
                          label={'Registration Date'}
                          required={false}
                          isRequired={true}
                          error={errors?.vehicle_reg_date}

                        />
                      }
                      onChange={([selected]) => {
                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                      }}
                      name="vehicle_reg_date"
                      control={control}
                    />
                    {!!errors?.vehicle_reg_date && <Error>{errors?.vehicle_reg_date.message}</Error>}
                  </DivSelect>
                </>
              }
              {dispatchType === 'Travel' && <>
                <DivSelect className="p-2">
                  <Controller
                    as={<Input label="Travel Location" />}
                    control={control}
                    name="travel_location"
                    placeholder="Travel Location"
                    error={errors?.travel_location}
                    required={false}
                    isRequired={true}
                  />
                  {!!errors?.travel_location && <Error>{errors?.travel_location.message}</Error>}
                </DivSelect>
                <DivSelect className="p-2">
                  <Controller
                    as={
                      <Select
                        label="Travel Trip Type"
                        options={[
                          { name: "Single Trip", value: "Single Trip" },
                          { name: "Annual Multi-Trip", value: "Annual Multi-Trip" },
                        ]}
                      />
                    }
                    error={errors?.travel_trip_type}
                    control={control}
                    name="travel_trip_type"
                    placeholder="Travel Trip Type"
                    required={false}
                    isRequired={true}
                  />
                  {!!errors?.travel_trip_type && <Error>{errors?.travel_trip_type.message}</Error>}
                </DivSelect>
              </>}

              <DivSelect className="p-2">
                <Controller
                  as={<Input required={false}
                    isRequired={true} label="Company Name" />}
                  onBlur={([selected]) => {
                    return selected;
                  }}
                  error={errors?.company_name}
                  control={control}
                  name="company_name"
                  placeholder="Company Name"
                />
                {!!errors?.company_name && <Error>{errors?.company_name.message}</Error>}
              </DivSelect>
              <DivSelect className="p-2">
                <Controller
                  as={<Input
                    type='tel'
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    required={false}
                    isRequired={true} label="Sum Insured" />}
                  control={control}
                  name="suminsured"
                  error={errors?.suminsured}
                  minLength={1}
                  maxLength={9}
                  placeholder="Sum Insured"
                />
                {!!errors?.suminsured && <Error>{errors?.suminsured.message}</Error>}
              </DivSelect>
              <DivSelect className="p-2">
                <Controller
                  as={<Input
                    type='tel'
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    required={false}
                    isRequired={true} label="Premium" />}
                  error={errors?.premium}
                  control={control}
                  minLength={1}
                  maxLength={9}
                  name="premium"
                  placeholder="Premium"
                />
                {!!errors?.premium && <Error>{errors?.premium.message}</Error>}
              </DivSelect>
            </Row>
            <div>
              <AttachFile
                // accept={".png"}
                accept="jpg, jpeg, png, pdf"
                key="image"
                onUpload={getFile}
                description="File Formats: pdf, jpg, png"
                //description="File Formats: (.png)"
                nameBox
                defaultFileName={file.length ? file[0]?.name : "Choose File"}
                required
              />
            </div>
            <DivButton>
              <div className="p-2">
                <Button type="submit">Submit</Button>
              </div>
              {/*
              <div className="p-2">
                <Button type="button" buttonStyle="outline" onClick={() => {}}>
                  View Doc <i className="ti-eye"></i>
                </Button>
              </div>
            */}
            </DivButton>
          </div>
        </form>
      </CardBlue>
      <PolicyTable dispatchType={dispatchType} />
    </>
  );
};

export default MyInsurance;
