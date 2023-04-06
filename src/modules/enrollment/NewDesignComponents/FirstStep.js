import React, { useEffect } from "react";
import * as yup from "yup";
import _ from "lodash";
import swal from "sweetalert";
import { Input, Error } from "components";
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements"

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { numOnly } from "utils";
import { DateFormate } from "utils";
import {
  editUser,
  enrollment,
  clearPersonalSuccess,
  nextStep,
  loadUser,
} from "../enrollment.slice";
import { noSpecial } from "../../../utils";
import classes from "./FirstStep.module.css";
import { common_module } from 'config/validations';
const validation = common_module.user;

const validationSchema = yup.object().shape({
  alternate_email: yup
    .string()
    .email("must be a valid email")
    .notRequired()
    .nullable(),
  mobile_no: yup
    .string()
    .required("mobile no required")
    .matches(validation.contact.regex, "Not valid number")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  emergency_contact_name: yup
    .string()
    .notRequired()
    .nullable()
    .matches(/^([A-Za-z\s])+$/, {
      message: "Name must contain only alphabets",
      excludeEmptyString: true,
    }),
  emergency_contact_number: yup
    .string()
    .notRequired()
    .nullable()
    .matches(validation.contact.regex, {
      message: "Not valid number",
      excludeEmptyString: true,
    })
    .max(10, "Must be exactly 10 digits"),
});

const FirstStep = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.login);
  const { personalSuccess, loading, error, userData } = useSelector(enrollment);

  const { control, errors, reset, handleSubmit } = useForm({
    validationSchema,
    defaultValues: userData?.name ? {
      employee_name: userData?.name,
      dob: userData?.dob,
      joining: userData?.doj,
      email: userData?.email,
      alternate_email: userData?.alternate_email || "",
      mobile_no: userData?.mobile_no || "",
      designation: userData?.employee_desination,
      grade: userData?.employee_grade,
      emergency_contact_number: userData?.emergency_contact || "",
      emergency_contact_name: userData?.emergency_contact_name || "",
      employer_id: userData?.employer_id,
      employee_id: userData?.employee_id,
      // policy_id: policyId
    } : {
      employee_name: currentUser?.name,
      dob: currentUser?.dob,
      joining: currentUser?.doj,
      email: currentUser?.email,
      alternate_email: currentUser?.alternate_email || "",
      mobile_no: currentUser?.mobile_no || "",
      designation: currentUser?.employee_desination,
      grade: currentUser?.employee_grade,
      emergency_contact_number: currentUser?.emergency_contact || "",
      emergency_contact_name: currentUser?.emergency_contact_name || "",
      employer_id: currentUser?.employer_id,
      employee_id: currentUser?.employee_id,
      // policy_id: policyId
    },
  });

  useEffect(() => {
    dispatch(loadUser(currentUser.id, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && personalSuccess) {
      swal('Success', personalSuccess, "success");
      dispatch(nextStep(1))
      // moveNext();
    }

    return () => {
      dispatch(clearPersonalSuccess());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalSuccess, loading, error]);

  useEffect(() => {
    if (!_.isEmpty(userData)) {
      reset({
        employee_name: userData?.name,
        dob: userData?.dob,
        joining: userData?.doj,
        email: userData?.email,
        alternate_email: userData?.alternate_email || "",
        mobile_no: userData?.mobile_no || "",
        designation: userData?.employee_desination,
        grade: userData?.employee_grade,
        emergency_contact_number: userData?.emergency_contact || "",
        emergency_contact_name: userData?.emergency_contact_name || "",
        employer_id: userData?.employer_id,
        employee_id: userData?.employee_id,
        // policy_id: policyId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit = ({
    alternate_email,
    emergency_contact_name,
    emergency_contact_number,
    mobile_no,
  }) => {

    const result = {
      ...(alternate_email && { alternate_email }),
      ...(emergency_contact_name && { emergency_contact_name }),
      ...(emergency_contact_number && { emergency_contact_number }),
      ...(mobile_no && { mobile_no }),
    };

    const resultToCompare = {
      ...(userData?.alternate_email && {
        alternate_email: userData?.alternate_email,
      }),
      ...(userData?.emergency_contact_name && {
        emergency_contact_name: userData?.emergency_contact_name,
      }),
      ...(userData?.emergency_contact && {
        emergency_contact_number: String(userData?.emergency_contact),
      }),
      ...(userData?.mobile_no && { mobile_no: String(userData?.mobile_no) }),
    };

    if (_.isEqual(result, resultToCompare)) {
      dispatch(nextStep(1))
    } else {
      dispatch(editUser({ ...result, user_type_name: "Employee" }, userData?.id));
    }
  };

  return (
    <div className={`row justify-content-center align-items-start ${classes.height}`}>
      <form
        id="step0"
        className="row w-100"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Employee Name"
            name="employeeName"
            placeholder="Employee Name"
            disabled
            value={(userData?.name || currentUser?.name) || "-"}
          />
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Date of Birth"
            name="employeeDob"
            placeholder="Date of Birth"
            disabled
            value={DateFormate((userData?.dob || currentUser?.dob)) || "-"}
          />
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Date of Joining"
            name="employeeDoj"
            placeholder="Date Of Joining"
            disabled
            value={DateFormate((userData?.doj || currentUser?.doj)) || "-"}
          />
        </div>
        {!!((userData?.employee_desination || currentUser?.employee_desination) && !(userData?.employee_desination || currentUser?.employee_desination)?.toLowerCase()?.startsWith('code')) && <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Designation"
            name="employeeDesignation"
            placeholder="Designation"
            disabled
            value={(userData?.employee_desination || currentUser?.employee_desination) || "-"}
          />
        </div>}
        {!!((userData?.employee_grade || currentUser?.employee_grade) && !(userData?.employee_grade || currentUser?.employee_grade)?.toLowerCase()?.startsWith('code')) && <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Grade"
            name="employeeGrade"
            placeholder="Grade"
            disabled
            value={(userData?.employee_grade || currentUser?.employee_grade) || "-"}
          />
        </div>}
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Input
            style={{ background: "white" }}
            label="Email"
            name="employeeEmail"
            placeholder="Email"
            value={(userData?.email || currentUser?.email) || "-"}
            disabled
          />
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Controller
            as={
              <Input
                label="Contact No"
                placeholder="Enter Contact No"
                min={0}
                type="tel"
                maxLength={10}
                onKeyDown={numOnly}
                onKeyPress={noSpecial}
                required
                error={errors && errors.mobile_no}
              />
            }
            control={control}
            name="mobile_no"
          />
          {!!errors.mobile_no && <Error>{errors.mobile_no.message}</Error>}
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Controller
            as={
              <Input
                label="Alternate Email"
                placeholder="Enter Alternate Email"
                type="email"
                error={errors && errors.alternate_email}
                required={false}
              />
            }
            control={control}
            name="alternate_email"
          />
          {!!errors.alternate_email && (
            <Error>{errors.alternate_email.message}</Error>
          )}
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Controller
            as={
              <Input
                label="Emergency Contact Person"
                placeholder="Enter Person Name"
                error={errors && errors.emergency_contact_name}
                required={false}
              />
            }
            control={control}
            name="emergency_contact_name"
          />
          {!!errors.emergency_contact_name && (
            <Error>{errors.emergency_contact_name.message}</Error>
          )}
        </div>
        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
          <Controller
            as={
              <Input
                label="Emergency Contact No"
                placeholder="Enter Emergency Contact No"
                min={0}
                type="tel"
                maxLength={10}
                onKeyDown={numOnly}
                onKeyPress={noSpecial}
                error={errors && errors.emergency_contact_number}
                required={false}
              />
            }
            control={control}
            name="emergency_contact_number"
          />
          {!!errors.emergency_contact_number && (
            <Error>{errors.emergency_contact_number.message}</Error>
          )}
        </div>
        <div className="col-12">
          <div className="d-flex justify-content-end align-item-center">
            <Button>
              {" "}
              Save & Next
              <i className="ml-3 fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FirstStep;
