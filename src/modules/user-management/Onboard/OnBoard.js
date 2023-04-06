import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";
import swal from "sweetalert";
import { useHistory, useLocation } from "react-router-dom";
import * as yup from "yup";

import {
  Input,
  Card,
  Button,
  Error,
  Loader,
  Select as AnotherSelect,
} from "components";
import Select from "./Select/Select";
import { Row, Col, Form } from "react-bootstrap";
import { Switch } from "../AssignRole/switch/switch";
// import { ParentCheckbox, ChildCheckBox } from "../AssignRole/option/Option";
import { Roles } from "../AssignRole/Roles";
import { BottomHeader } from "components/GlobalCard/style";
import { AttachFile } from "modules/core";
import { CardComponent, Flex, Color } from "./Select/style";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from "modules/policies/approve-policy/style";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { useDispatch, useSelector } from "react-redux";
import {
  brokerOnboard,
  employerOnboard,
  selectModules,
  insurerOnboard,
  allModules,
  // getState,
  // selectState,
  // getCity,
  // selectCity,
  selectLoading,
  selectError,
  selectSuccess,
  selectUsersData,
  getUsersData,
  // clearCity,
  clear,
  clearData,
  selectPlans,
  selectSubscribe,
  loadPlans,
  loadInsurer,
  selectLeadData,
  loadLeadData,
  selectTempData,
  setTempData,
} from "../user.slice";
import { loadThemes } from "../../theme/theme.slice";
import { numOnly, noSpecial } from "utils";
import { common_module } from "config/validations";
import classes from "./index.module.css";
import { RolesForEmployee } from "../AssignRole/RolesForEmployee";
// import { RolesForEmployer } from "../AssignRole/RolesForEmployer";
import { getstatecity, clear as clearStateCity } from "modules/RFQ/home/home.slice";
import { ModuleControl } from "../../../config/module-control";
import { Head } from "../../../components";
const validation = common_module.onboard;

const BrokerType = [
  { id: 3, value: 3, name: "Broker" },
  { id: 1, value: 1, name: "RFQ" },
  { id: 2, value: 2, name: "Broker + RFQ" },
];

const validationSchema = (employer, has_user_data) =>
  yup.object().shape({
    name: employer
      ? yup
        .string()
        .required("Name required")
        .min(
          validation.name.min,
          `Minimum ${validation.name.min} character required`
        )
        .max(
          validation.name.max,
          `Maximum ${validation.name.max} character available`
        )
      : yup
        .string()
        .required("Name required")
        .matches(validation.name.regex, "Name must contain only alphabets")
        .min(
          validation.name.min,
          `Minimum ${validation.name.min} character required`
        )
        .max(
          validation.name.max,
          `Maximum ${validation.name.max} character available`
        ),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email required")
      .min(
        validation.email.min,
        `Minimum ${validation.email.min} character required`
      )
      .max(
        validation.email.max,
        `Maximum ${validation.email.max} character available`
      ),
    contact: yup
      .string()
      .required("Mobile No. required")
      .min(validation.contact.length, "Mobile No. should be 10 digits")
      .max(validation.contact.length, "Mobile No. should be 10 digits")
      .matches(validation.contact.regex, "Not valid number"),
    address_line_1: yup
      .string()
      .required("Address required")
      .min(
        validation.address_line.min,
        `Enter atleast ${validation.address_line.min} letters`
      )
      .max(
        validation.address_line.max,
        `Maximum ${validation.address_line.max} character available`
      ),
    address_line_2: yup
      .string()
      .required("Address required")
      .min(
        validation.address_line.min,
        `Enter atleast ${validation.address_line.min} letters`
      )
      .max(
        validation.address_line.max,
        `Maximum ${validation.address_line.max} character available`
      ),
    pincode: yup
      .string()
      .required("Pincode required")
      .min(
        validation.pincode.length,
        `Pincode must consist ${validation.pincode.length} digits`
      )
      .max(
        validation.pincode.length,
        `Pincode must consist ${validation.pincode.length} digits`
      )
      .matches(validation.pincode.regex, "Invalid pincode"),
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
    ...(employer && {
      code: yup
        .string()
        .required("Employee Code required")
        // .min(validation.employee_code.length, `Minimum ${validation.employee_code.length} character required`)
        .max(
          validation.employee_code.length,
          `Maximum ${validation.employee_code.length} character available`
        )
        .matches(
          validation.employee_code.regex,
          "Must contain only alphabets alphabets & numbers"
        ),
    }),
    ...(has_user_data && {
      user_name: yup
        .string()
        .required("Name required")
        .matches(validation.name.regex, "Name must contain only alphabets")
        .min(
          validation.name.min,
          `Minimum ${validation.name.min} character required`
        )
        .max(
          validation.name.max,
          `Maximum ${validation.name.max} character available`
        ),
      user_email: yup
        .string()
        .email("Must be a valid email")
        .required("Email required")
        .min(
          validation.email.min,
          `Minimum ${validation.email.min} character required`
        )
        .max(
          validation.email.max,
          `Maximum ${validation.email.max} character available`
        ),
      user_contact: yup
        .string()
        .required("Mobile No. required")
        .min(validation.contact.length, "Mobile No. should be 10 digits")
        .max(validation.contact.length, "Mobile No. should be 10 digits")
        .matches(validation.contact.regex, "Not valid number"),
    }),
  });

const NoSaas = ["Insurer"];

export default function OnBoard({ type }) {
  const [tab, setTab] = useState("all");
  const history = useHistory();
  const [has_user_data, setHas_user_data] = useState(
    type === "Employer" ? 1 : 0
  );
  const { control, errors, handleSubmit, watch, register, reset, setValue } = useForm({
    validationSchema: validationSchema(type === "Employer", has_user_data),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const dispatch = useDispatch();
  const modules = useSelector(selectModules);
  // const states = useSelector(selectState);
  // const cities = useSelector(selectCity);
  // const [clicked, setClicked] = useState([]);
  const [themeState, setThemeState] = useState(0);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const Users = useSelector(selectUsersData);
  const leadData = useSelector(selectLeadData);
  const plans = useSelector(selectPlans);
  const subscribe_modes = useSelector(selectSubscribe);
  const tempData = useSelector(selectTempData);

  const [file, setFile] = useState();
  const [hasSaas, setHasSaas] = useState();
  const [hasIC, setHasIC] = useState();
  const IsRFQ = Number(watch("is_rfq"));
  const { currentUser, userType } = useSelector((state) => state.login);
  const { themes } = useSelector((state) => state.theme);
  const { statecity } = useSelector((state) => state.RFQHome);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const enquiry_id = decodeURIComponent(query.get("enquiry_id") || "");
  const pincode = watch("pincode");
  const tfa_enabled = watch("tfa_enabled");
  useEffect(() => {
    if (pincode?.length === 6 || String(pincode)?.length === 6) {
      dispatch(getstatecity({ pincode: pincode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode]);
  useEffect(() => {
    if (statecity?.length && String(pincode)?.length === 6) {
      setValue(`state_id`, statecity[0]?.state_id);
      setValue(`city_id`, statecity[0]?.city_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statecity])
  useEffect(() => {
    // dispatch(clearCity());
    // dispatch(getState());
    dispatch(clearStateCity("statecity"))
    dispatch(loadPlans());
    dispatch(loadThemes());

    if (enquiry_id) {
      dispatch(loadLeadData({ enquiry_id }));
    }

    return () => {
      dispatch(clearData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (leadData?.enquiry_id) {
      // cityRequest(leadData.state_id);
      reset({
        name: leadData.company_legal_name || leadData?.company_name,
        email: leadData.work_email,
        contact: leadData.contact_no,
        PAN: leadData.pan_number,
        GSTIN: leadData.gstin_number,
        address_line_1: leadData.address,
        country_id: "1",
        state_id: leadData.state_id,
        city_id: leadData.city_id,
        pincode: leadData.pincode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadData]);

  useEffect(() => {
    if (userType) {
      dispatch(allModules(false, userType === "IC" ? 1 : 0, userType, userType === "Broker"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  useEffect(() => {
    if (type === "Employer" && userType && userType === "Super Admin") {
      dispatch(
        getUsersData({ status: 1, type: "Broker", currentUser: userType })
      );
    }
  }, [type, userType, dispatch]);

  useEffect(() => {
    if (type === "Broker" && userType === "Super Admin") {
      dispatch(loadInsurer());
    }
  }, [type, userType, dispatch]);

  useEffect(() => {
    if (themes.length) {
      setThemeState(themes[0].id);
    }
  }, [themes]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success && !enquiry_id) {
      swal('Success', success, "success").then(() => {
        history.goBack();
      });
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  useEffect(() => {
    if (!loading && success && tempData) {
      swal('Success', success, "success");
      history.replace(
        `/${type === "Broker" ? "broker" : "admin"
        }/policy-create/${encodeURIComponent(
          enquiry_id
        )}?employer_id=${tempData}&ic_plan_id=${leadData?.selected_plan?.ic_plan_id
        }`
      );
    }

    return () => {
      dispatch(setTempData(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempData, success, loading]);
  // const Type = type = 'employer' && "Employer" || type = 'broker' && "Broker";

  const addImage = (filesAccepted) => {
    setFile(filesAccepted[0]);
  };

  const onSubmit = (data) => {
    let {
      canread,
      candelete,
      canwrite,
      other,
      module_id,
      brokerId,
      insurerId,
      candelete_employee,
      canread_employee,
      canwrite_employee,
      candelete_employer,
      canread_employer,
      canwrite_employer,
      module_id_employee,
      module_id_employer,
      childInput_id,
      childInput_id_employer,
      parentInput_id,
      parentInput_id_employer,
      ...rest
    } = data;

    const formData = new FormData();
    let addRole = null;
    let addRoleEmployee = null;
    for (let key in rest) {
      formData.append(`${key}`, `${rest[key]}`);
    }
    if (type === "Employer" && !hasSaas) {
      formData.append("broker_id", brokerId || currentUser?.broker_id);
    }
    file && formData.append("logo", file);

    formData.append("theme_id", themeState);
    if (type === "Employer" && !hasSaas) {
      let selectedModulesEmployer =
        data?.module_id_employer?.map((value, index) => value && index).filter(Number) ||
        [];
      let module_sequenceEmployer = {
        ...data?.childInput_id_employer,
        ...data?.parentInput_id_employer,
      };
      let modulesEmployer = [];
      for (const [key, value] of Object.entries(module_sequenceEmployer)) {
        if (selectedModulesEmployer?.includes(Number(key))) {
          modulesEmployer.push({
            module_id: Number(key),
            module_sequence: Number(value),
          });
        }
      }

      // eslint-disable-next-line no-const-assign
      addRole = !hasSaas && {
        canread:
          canread_employer?.map((value, index) => value && index).filter(Number) || [],
        candelete:
          candelete_employer?.map((value, index) => value && index).filter(Number) || [],
        canwrite:
          canwrite_employer?.map((value, index) => value && index).filter(Number) || [],
        modules: modulesEmployer,
        rolename: "Admin",
        // module_id:
        //   module_id?.map((value, index) => value && index).filter(Number) || [],
        // rolename: "Admin",
        ic_user_type_id: 1,
      };
      let selectedModules =
        data?.module_id_employee
          ?.map((value, index) => value && index)
          .filter(Number) || [];
      let module_sequence = { ...data?.childInput_id, ...data?.parentInput_id };
      let modules = [];
      for (const [key, value] of Object.entries(module_sequence)) {
        if (selectedModules?.includes(Number(key))) {
          modules.push({
            module_id: Number(key),
            module_sequence: Number(value),
          });
        }
      }

      data.tfa_enabled && formData.append("tfa_enabled", data.tfa_enabled);
      data.tfa_type && formData.append("tfa_type", data.tfa_type);
      // eslint-disable-next-line no-const-assign
      addRoleEmployee = !hasSaas && {
        canread:
          canread_employee
            ?.map((value, index) => value && index)
            .filter(Number) || [],
        candelete:
          candelete_employee
            ?.map((value, index) => value && index)
            .filter(Number) || [],
        canwrite:
          canwrite_employee
            ?.map((value, index) => value && index)
            .filter(Number) || [],
        modules: modules,
        employer_id: 1,
      };
    }
    if (type !== "Employer") {
      // eslint-disable-next-line no-const-assign
      addRole = !hasSaas && {
        canread:
          canread?.map((value, index) => value && index).filter(Number) || [],
        candelete:
          candelete?.map((value, index) => value && index).filter(Number) || [],
        canwrite:
          canwrite?.map((value, index) => value && index).filter(Number) || [],
        other:
          other?.map((value, index) => value && index).filter(Number) || [],
        module_id:
          module_id?.map((value, index) => value && index).filter(Number) || [],
        rolename: "Admin",
        ic_user_type_id: 1,
      };
    }
    if (type === "Insurer") {
      formData.append("contact_no_1", data.contact);

      if (addRole.canread.length) {
        addRole.canread.forEach((id) => {
          formData.append("canread[]", id);
        });
      } else {
        formData.append("canread[]", null);
      }

      if (addRole.candelete.length) {
        addRole.candelete.forEach((id) => {
          formData.append("candelete[]", id);
        });
      } else {
        formData.append("candelete[]", null);
      }

      if (addRole.canwrite.length) {
        addRole.canwrite.forEach((id) => {
          formData.append("canwrite[]", id);
        });
      } else {
        formData.append("canwrite[]", null);
      }

      addRole.module_id.forEach((id) => {
        formData.append("module_id[]", id);
      });
    }
    if (type !== "Employer") {
      if (!addRole?.module_id?.length) {
        swal("Validation", "No module selected", "info");
        return null;
      }
    } else {
      if (!addRole?.modules?.length) {
        swal("Validation", "No module select for Employer", "info");
        return null;
      }
      if (!addRoleEmployee?.modules?.length) {
        swal("Validation", "No module select for Employee", "info");
        return null;
      }
    }

    if (userType === "IC") {
      formData.append("ic_id", currentUser?.ic_id || insurerId);
    }

    type === "Employer" &&
      dispatch(
        employerOnboard(addRole, formData, "employer", rest, addRoleEmployee, has_user_data)
      );

    type === "Broker" &&
      dispatch(brokerOnboard(addRole, formData, "broker", rest));

    type === "Insurer" && dispatch(insurerOnboard(formData));
  };

  // const cityRequest = (state_id) => {
  //   if (state_id) dispatch(getCity({ state_id }));
  // };

  return (
    <Card title={`OnBoard ${type}`}>
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <Row className="d-flex flex-wrap justify-content-center">
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  label={`${type} Name`}
                  maxLength={validation.name.max}
                  placeholder={`Enter ${type} Name`}
                  required
                />
              }
              name="name"
              error={errors && errors.name}
              control={control}
            />
            {!!errors.name && <Error>{errors.name.message}</Error>}
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  label="Email"
                  type="email"
                  maxLength={validation.email.max}
                  placeholder={`Enter ${type} Email`}
                  required
                />
              }
              name="email"
              error={errors && errors.email}
              control={control}
            />
            {!!errors.email && <Error>{errors.email.message}</Error>}
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  label="Mobile No"
                  maxLength={validation.contact.length}
                  onKeyDown={numOnly}
                  onKeyPress={noSpecial}
                  type="tel"
                  placeholder={`Enter ${type} Mobile No`}
                  required
                />
              }
              name="contact"
              error={errors && errors.contact}
              control={control}
            />
            {!!errors.contact && <Error>{errors.contact.message}</Error>}
          </Col>
          {type === "Employer" && (
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Employer Code"
                    maxLength={validation.employee_code.length}
                    placeholder="Enter Employer Code "
                    required
                  />
                }
                name="code"
                error={errors && errors.code}
                control={control}
              />
              {!!errors.code && <Error>{errors.code.message}</Error>}
            </Col>
          )}
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={<Switch />}
              name="status"
              control={control}
              defaultValue={1}
              required
            />
          </Col>
          {type === "Employer" && userType === "Super Admin" && !hasSaas && (
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Broker"
                    option={Users?.data || []}
                    required={true}
                    valueName="name"
                    selected=""
                    id="id"
                  />
                }
                name="brokerId"
                control={control}
              />
            </Col>
          )}
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  onInput={(e) =>
                    (e.target.value = ("" + e.target.value).toUpperCase())
                  }
                  label={`${type} PAN No.`}
                  maxLength={validation.PAN.length}
                  placeholder={`Enter ${type} PAN No.`}
                  required
                />
              }
              name="PAN"
              error={errors && errors.PAN}
              control={control}
            />
            {!!errors.PAN && <Error>{errors.PAN.message}</Error>}
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  onInput={(e) =>
                    (e.target.value = ("" + e.target.value).toUpperCase())
                  }
                  label={`${type} GST No.`}
                  maxLength={validation.GST.length}
                  placeholder={`Enter ${type} GST No.`}
                  required
                />
              }
              name="GSTIN"
              error={errors && errors.GSTIN}
              control={control}
            />
            {!!errors.GSTIN && <Error>{errors.GSTIN.message}</Error>}
          </Col>
          {type === "Insurer" && (
            <>
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label={"IRDA Registration No"}
                      placeholder={"Enter IRDA Registration No"}
                      required
                    />
                  }
                  name="irda_registration_number"
                  error={errors && errors.irda_registration_number}
                  control={control}
                />
                {!!errors.irda_registration_number && (
                  <Error>{errors.irda_registration_number.message}</Error>
                )}
              </Col>
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={
                    <Input
                      label={"Corporate Identification No"}
                      placeholder={"Enter Corporate Identification No"}
                      required
                    />
                  }
                  name="cin_no"
                  error={errors && errors.cin_no}
                  control={control}
                />
                {!!errors.cin_no && <Error>{errors.cin_no.message}</Error>}
              </Col>
            </>
          )}
          {userType === "Super Admin" && type === "Broker" && (
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Broker Account Type"
                    option={BrokerType || []}
                    required={true}
                    valueName="name"
                    selected=""
                    id="id"
                  />
                }
                name="is_rfq"
                control={control}
              />
            </Col>
          )}
        </Row>
        <Row className="d-flex flex-wrap justify-content-center">
          {userType === "Super Admin" && type === "Broker" && IsRFQ === 3 && (
            <>
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={<Switch />}
                  label="Have IC"
                  name="has_ic"
                  onChange={([e]) => {
                    setHasIC(e);
                    return e;
                  }}
                  control={control}
                  defaultValue={0}
                  required
                />
              </Col>
              {!!hasIC && (
                <Col md={6} lg={6} xl={3} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Insurer"
                        option={Users?.data || []}
                        required={true}
                        valueName="name"
                        selected=""
                        id="id"
                      />
                    }
                    name="insurerId"
                    control={control}
                  />
                </Col>
              )}
            </>
          )}
          {ModuleControl.PlanHospitalization &&
            type === "Employer" && (
              <Col xl={12} lg={12} md={12} sm={12}>
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
                          "Does this employer opted for planned hospitalization ?"
                        }
                      </span>
                      <Controller
                        as={
                          <input
                            name={"has_planned_hospitalization"}
                            type="checkbox"
                            defaultChecked={false}
                          />
                        }
                        name={"has_planned_hospitalization"}
                        onChange={([e]) => (e.target.checked ? 1 : 0)}
                        control={control}
                        defaultValue={0}
                      />
                      <span className="checkmark-check"></span>
                    </label>
                  </CustomCheck>
                </TextCard>
              </Col>
            )}

          {type === "Employer" &&
            ModuleControl.ChatBot && (
              <Col xl={12} lg={12} md={12} sm={12}>
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
                            defaultChecked={false}
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
              </Col>
            )}

          {["Employer", 'Broker'].includes(type) &&
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
                                "2 Factor Authentication for this " + ('Employer' === type ? "Employer & it's Employees?" : "Broker?")
                              }
                            </span>
                            <Controller
                              as={
                                <input
                                  name={"tfa_enabled"}
                                  type="checkbox"
                                  defaultChecked={false}
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

                    {['Broker'].includes(type) && <Row className="d-flex my-3">
                      <Col md={6} lg={6} xl={4} sm={12}>
                        <CustomCheck className="custom-control-checkbox">
                          <label className="custom-control-label-check  container-check">
                            <span>Activate IP or Email Address WhiteListing</span>
                            <Controller
                              as={
                                <input
                                  name={"ip_checking"}
                                  type="checkbox"
                                  defaultChecked={false}
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
                    </Row>}
                  </TextCard>
                </Col>

              </>
            )}

          {["Employer"].includes(type) && <Col xl={12} lg={12} md={12} sm={12}>
            <TextCard
              className="pl-3 pr-3 mb-4 mt-4"
              borderRadius="10px"
              noShadow
              border="1px dashed #929292"
              bgColor="#f8f8f8"
            >
              <CustomCheck className="custom-control-checkbox">
                <label className="custom-control-label-check  container-check">
                  <span>{"Should create employer user(HR) ?"}</span>
                  <Controller
                    as={
                      <input
                        name={"has_user_data"}
                        type="checkbox"
                      // defaultChecked={false}
                      />
                    }
                    name={"has_user_data"}
                    onChange={([e]) =>
                      setHas_user_data(e.target.checked ? 1 : 0)
                    }
                    control={control}
                    defaultChecked={type === "Employer" ? true : false}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>
              {!!Number(has_user_data) && (
                <Row className="d-flex flex-wrap justify-content-center">
                  <Col md={6} lg={6} xl={3} sm={12}>
                    <Controller
                      as={
                        <Input
                          label={`HR User Name`}
                          maxLength={validation.name.max}
                          placeholder={`Enter HR User Name`}
                          required
                        />
                      }
                      name="user_name"
                      error={errors && errors.user_name}
                      control={control}
                      labelProps={{ background: "#f8f8f8" }}
                    />
                    {!!errors.user_name && (
                      <Error>{errors.user_name.message}</Error>
                    )}
                  </Col>
                  <Col md={6} lg={6} xl={3} sm={12}>
                    <Controller
                      as={
                        <Input
                          label="HR Email"
                          type="email"
                          maxLength={validation.email.max}
                          placeholder={`Enter HR User Email`}
                          required
                        />
                      }
                      name="user_email"
                      error={errors && errors.user_email}
                      control={control}
                      labelProps={{ background: "#f8f8f8" }}
                    />
                    {!!errors.user_email && (
                      <Error>{errors.user_email.message}</Error>
                    )}
                  </Col>
                  <Col md={6} lg={6} xl={3} sm={12}>
                    <Controller
                      as={
                        <Input
                          label="HR Mobile No"
                          maxLength={validation.contact.length}
                          onKeyDown={numOnly}
                          onKeyPress={noSpecial}
                          type="tel"
                          placeholder={`Enter HR User Mobile No`}
                          required
                        />
                      }
                      name="user_contact"
                      error={errors && errors.user_contact}
                      control={control}
                      labelProps={{ background: "#f8f8f8" }}
                    />
                    {!!errors.user_contact && (
                      <Error>{errors.user_contact.message}</Error>
                    )}
                  </Col>
                </Row>
              )}
            </TextCard>
          </Col>}


        </Row>
        <Row className="d-flex flex-wrap justify-content-center pt-5 pb-5">
          <Col xl="8" lg="8" md="12" sm="12">
            <AttachFile
              name="premium_file"
              title="Attach Logo"
              key="premium_file"
              {...validation.logo}
              onUpload={addImage}
              nameBox
              required={false}
            />
          </Col>
        </Row>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={6} xl={6} sm={12}>
            <Controller
              as={
                <Input
                  label="Address 1"
                  maxLength={validation.address_line.max}
                  placeholder={`Enter ${type} Address`}
                  required
                />
              }
              name="address_line_1"
              error={errors && errors.address_line_1}
              control={control}
            />
            {!!errors.address_line_1 && (
              <Error>{errors.address_line_1.message}</Error>
            )}
          </Col>
          <Col md={6} lg={6} xl={6} sm={12}>
            <Controller
              as={
                <Input
                  label="Address 2"
                  maxLength={validation.address_line.max}
                  placeholder={`Enter ${type} Address`}
                  required
                />
              }
              name="address_line_2"
              error={errors && errors.address_line_2}
              control={control}
            />
            {!!errors.address_line_2 && (
              <Error>{errors.address_line_2.message}</Error>
            )}
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <AnotherSelect
                  label="Country"
                  placeholder="Select Country"
                  options={[{ id: 1, value: 1, name: "India" }]}
                  id="country"
                  required
                />
              }
              name="country_id"
              control={control}
            />
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  label="Pincode"
                  maxLength={validation.pincode.length}
                  type="tel"
                  onKeyDown={numOnly}
                  onKeyPress={noSpecial}
                  placeholder={`Enter ${type} Pincode`}
                  required
                />
              }
              name="pincode"
              error={errors && errors.pincode}
              control={control}
            />
            {!!errors.pincode && <Error>{errors.pincode.message}</Error>}
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <AnotherSelect
                  label="State"
                  placeholder="Select State"
                  options={[
                    {
                      id:
                        statecity.length &&
                        statecity[0]?.state_id,
                      name:
                        statecity.length &&
                        statecity[0]?.state_name,
                      value:
                        statecity.length &&
                        statecity[0]?.state_id,
                    },
                  ]}
                  id="state"
                  required
                  disabled={true}
                  readOnly={true}
                />
              }
              name="state_id"
              // onChange={([data]) => {
              //   cityRequest(data.target.value);
              //   return data.target.value;
              // }}
              control={control}
            />
          </Col>
          <Col md={6} lg={6} xl={3} sm={12}>
            <Controller
              as={
                <AnotherSelect
                  label="City"
                  placeholder="Select City"
                  options={
                    [
                      {
                        id:
                          statecity.length && statecity[0]?.city_id,
                        name:
                          statecity.length &&
                          statecity[0]?.city_name,
                        value:
                          statecity.length && statecity[0]?.city_id,
                      },
                    ]
                  }
                  id="city"
                  required
                  disabled={true}
                  readOnly={true}
                />
              }
              name="city_id"
              control={control}
            />
          </Col>
        </Row>
        {userType === "Super Admin" && !NoSaas.includes(type) && (
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Switch />}
                label="SAAS"
                name="has_saas"
                onChange={([e]) => {
                  setHasSaas(e);
                  return e;
                }}
                control={control}
                defaultValue={0}
                required
              />
            </Col>
          </Row>
        )}
        {!!hasSaas && (
          <>
            <Row className="d-flex flex-wrap justify-content-center">
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Plan Type"
                      option={plans.filter((plan) => {
                        if (type === "Employer") {
                          return plan.has_employer;
                        } else {
                          return plan.has_broker;
                        }
                      })}
                      required={true}
                      valueName="name"
                      selected=""
                      id="id"
                    />
                  }
                  name="plan_id"
                  control={control}
                />
              </Col>
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Subscribing Mode"
                      option={subscribe_modes}
                      required={true}
                      valueName="name"
                      selected=""
                      id="id"
                    />
                  }
                  name="subcribe_mode"
                  control={control}
                />
              </Col>
            </Row>
          </>
        )}
        {/* Select Theme */}
        <Row className="d-flex flex-wrap m-0">
          {themes.map((theme) => {
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
        {/* Select Module */}
        {type === "Employer" && (
          <>
            <button
              type="button"
              onClick={() => setTab("all")}
              className={`btn ${tab === "all" ? "btn-primary" : "btn-light"}`}
            >
              Employer
            </button>
            <button
              type="button"
              onClick={() => setTab("employee")}
              className={`btn ${tab === "employee" ? "btn-primary" : "btn-light"
                } ml-2`}
            >
              Employee
            </button>
          </>
        )}
        {!hasSaas && (
          type !== "Employer" ? <div className={`${tab === "all" ? "" : classes.invisbileDiv}`}>
            <div>
              <h5 className="mt-5">{type} Role Modules</h5>
              <BottomHeader />
            </div>
            <Roles
              modules={modules?.filter(({ is_employee_module }) => !is_employee_module)}
              plan_modules={[]}
              watch={watch}
              register={register}
              type=""
              create
            />
          </div> : <div className={`${tab === "all" ? "" : classes.invisbileDiv}`}>
            <div>
              <h5 className="mt-5">{type} Role Modules</h5>
              <BottomHeader />
            </div>
            <RolesForEmployee
              modules={modules?.filter(({ is_employee_module }) => !is_employee_module)}
              plan_modules={[]}
              watch={watch}
              register={register}
              type="employer"
              type2={"_employer"}
              type3={3}
              create
            />
          </div>
        )}
        {!hasSaas && type === "Employer" && (
          <div
            className={`${tab === "employee" ? "" : classes.invisbileDiv}`}
          >
            <div>
              <h5 className="mt-5">Employee Role Modules</h5>
              <BottomHeader />
            </div>
            <RolesForEmployee
              modules={modules}
              plan_modules={[]}
              watch={watch}
              register={register}
              Controller={Controller}
              control={control}
              type="employee"
              type2={""}
              type3={2}
              create
            />
          </div>
        )}

        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>
      {loading && <Loader />}
    </Card>
  );
};

// const TopColumn = ({ employer, children }) => {

//   return employer ?
//     <Col md={6} lg={6} xl={3} sm={12}>
//       {children}
//     </Col>
//     :
//     <Col md={6} lg={6} xl={3} sm={12}>
//       {children}
//     </Col>
// }

// default props
OnBoard.defaultProps = {
  employer: false,
};
// TopColumn.defaultProps = {
//   employer: false,
// }

// props types
OnBoard.propTypes = {
  employer: PropTypes.bool,
};
// TopColumn.propTypes = {
//   onChange: PropTypes.func,
// };
