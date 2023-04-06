import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import * as yup from "yup";
import { useHistory, useParams } from "react-router-dom";

import { Row, Col, Form } from "react-bootstrap";
import { Button, Card, Input, Error, Loader, Select } from "components";
import { Roles } from "./Roles";
// import { ParentCheckbox, ChildCheckBox } from "./option/Option";
import { Switch } from "./switch/switch";

import { useDispatch, useSelector } from "react-redux";
import {
  selectModules,
  clear,
  allModules,
  createRole,
  selectLoading,
  selectError,
  selectSuccess,
  clearData,
  Role_Data,
  // brokerReportingData, employerReportingData,
  loadInsurerUser,
} from "../user.slice";
import { common_module } from "config/validations";
import { Decrypt } from "../../../utils";
import { RolesForEmployee } from "./RolesForEmployee";

const validation = common_module.onboard;

export default function RoleForm({ type, create }) {
  const { data, reportingICData } = useSelector(
    (state) => state.userManagement
  );
  const { userType } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const history = useHistory();
  const modules = useSelector(selectModules);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  const [roleValid, setRoleValid] = useState(0);

  const validationSchema = yup.object().shape({
    rolename: yup
      .string()
      .required("Role Name required")
      .min(
        validation.name.min,
        `Minimum ${validation.name.min} character required`
      )
      .max(
        validation.name.max,
        `Maximum ${validation.name.max} character available`
      )
      .matches(validation.name.regex, "Name must contain only alphabets"),
    ...(roleValid === 1 && {
      // reporting_id: yup.string().required('Please select reporting person'),
      role_id: yup.string().required("Please select role"),
    }),
    ...(["insurer", "broker"].includes(type) && {
      ic_user_type_id: yup
        .string()
        .required("Please select Role Type")
        .nullable(),
    }),
  });

  const { control, errors, handleSubmit, watch, register } = useForm({
    validationSchema,
    mode: "onChange",
    reValidateMode: "onChange",
  }); // have to apply reset
  // const [clicked, setClicked] = useState([]);
  let { id: userId } = useParams();
  userId = Decrypt(userId);

  let isSuperRole = watch("isSuperRole");
  // let roleId = watch('role_id');

  useEffect(() => {
    if (isSuperRole) {
      setRoleValid(1);
      dispatch(Role_Data(userId, type));
    } else {
      setRoleValid(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperRole]);

  // useEffect(() => {
  //   if (roleId) {
  //     if (type === "broker") {
  //       dispatch(brokerReportingData({
  //         broker_id: userId,
  //         role_id: roleId
  //       }));
  //     }
  //     if (type === "employer") {
  //       dispatch(employerReportingData({
  //         employer_id: userId,
  //         role_id: roleId
  //       }));
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [roleId])

  useEffect(() => {
    if (userType) {
      dispatch(allModules(false, 0, userType));
      if (["insurer", "broker"].includes(type)) {
        dispatch(loadInsurerUser());
      }
    }
    return () => {
      dispatch(clearData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success) {
      swal('Success', success, "success");
      history.goBack();
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  const onSubmit = (data) => {
    // alert(JSON.stringify(data))
    if (type === "employer") {
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
      const addRole = {
        canread:
          data?.canread_employer?.map((value, index) => value && index).filter(Number) || [],
        candelete:
          data?.candelete_employer?.map((value, index) => value && index).filter(Number) || [],
        canwrite:
          data?.canwrite_employer?.map((value, index) => value && index).filter(Number) || [],
        modules: modulesEmployer,
      };
      if (!addRole?.modules.length) {
        swal("Validation", "No module selected", "info");
        return null;
      }

      dispatch(
        createRole(
          {
            rolename: data.rolename,
            ...addRole,
            ...(isSuperRole === 1 && {
              has_super_role: data.isSuperRole,
              super_role_id: data.role_id,
              // reporting_person_id: data.reporting_id
            }),
            ...(["insurer", "broker"].includes(type) && {
              ic_user_type_id: data.ic_user_type_id,
            }),
          },
          userId,
          type
        )
      );

    }
    if (type !== "employer") {
      const canread =
        data?.canread?.map((value, index) => value && index).filter(Number) || [];
      const candelete =
        data?.candelete?.map((value, index) => value && index).filter(Number) ||
        [];
      const canwrite =
        data?.canwrite?.map((value, index) => value && index).filter(Number) ||
        [];
      const other =
        data?.other?.map((value, index) => value && index).filter(Number) ||
        [];
      const module_id =
        data?.module_id?.map((value, index) => value && index).filter(Number) ||
        [];
      if (!module_id.length) {
        swal("Validation", "No module selected", "info");
        return null;
      }

      dispatch(
        createRole(
          {
            rolename: data.rolename,
            canread,
            candelete,
            canwrite,
            other,
            module_id,
            ...(isSuperRole === 1 && {
              has_super_role: data.isSuperRole,
              super_role_id: data.role_id,
              // reporting_person_id: data.reporting_id
            }),
            ...(["insurer", "broker"].includes(type) && {
              ic_user_type_id: data.ic_user_type_id,
            }),
          },
          userId,
          type
        )
      );
    }
  };

  return (
    <Card title={`Create ${type[0].toUpperCase() + type.slice(1)} Role`}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Input */}
        <Row>
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  label="Role Name"
                  maxLength={validation.name.max}
                  placeholder="Enter Role Name"
                  required={false}
                  isRequired={true}
                />
              }
              name="rolename"
              error={errors && errors.rolename}
              control={control}
              defaultValue={""}
            />
            {!!errors.rolename && <Error>{errors.rolename.message}</Error>}
          </Col>
          {/* <Col md={6} lg={4} xl={3} sm={12}>
              // <Switch />
            </Col> */}
          {["insurer", "broker"].includes(type) && (
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Role Type"
                    placeholder="Select Role Type"
                    required={false}
                    isRequired={true}
                    options={reportingICData?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                // onChange={([selected]) => {
                //   return selected;
                // }}
                name="ic_user_type_id"
                control={control}
                defaultValue={""}
                error={errors && errors.ic_user_type_id}
              />
              {!!errors?.ic_user_type_id && (
                <Error>{errors?.ic_user_type_id?.message}</Error>
              )}
            </Col>
          )}
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Switch />}
              name="isSuperRole"
              control={control}
              defaultValue={0}
              label="Does this role has a super role ?"
            />
            {/* } */}
          </Col>
          {isSuperRole === 1 && (
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Select
                    label="Select Reporting Role"
                    placeholder="Select Reporting Role"
                    required={false}
                    isRequired={true}
                    options={data?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                onChange={([selected]) => {
                  return selected;
                }}
                name="role_id"
                control={control}
                defaultValue={""}
                error={errors && errors.role_id}
              />
              {!!errors?.role_id && (
                <Error>{errors?.role_id?.message}</Error>
              )}
            </Col>
          )}
        </Row>

        {/* Select Module */}
        {type !== "employer" ? (
          <Roles
            create={create}
            modules={modules}
            plan_modules={[]}
            watch={watch}
            register={register}
          />
        ) : (
          <RolesForEmployee
            create={create}
            modules={modules}
            plan_modules={[]}
            watch={watch}
            register={register}
            type="employer"
            type2={"_employer"}
            type3={3}
          />
        )}

        {/* <Row className="d-flex flex-wrap">
            {modules?.map((parentElem) => {
              return (
                <Fragment key={`module-${parentElem.id}`}>
                  <Col className="pl-0" md={7} lg={7} xl={7} sm={7} >
                    <Controller
                      as={<ParentCheckbox id={parentElem.id} text={parentElem.moduleName} />}
                      name={`module_id.${parentElem.id}`}
                      control={control}
                      onChange={([data]) => {
                        const newData = JSON.parse(JSON.stringify(clicked));
                        newData[parentElem.id] = !!data;
                        setClicked(newData)
                        return data;
                      }}
                    />
                  </Col>
                  {clicked[parentElem.id] ?
                    (parentElem.child.length) ?
                      <>
                        {parentElem.child.map((childElem) =>
                          <Fragment key={`module-${childElem.id}`}>
                            <Col md={7} lg={7} xl={7} sm={7} style={{ paddingLeft: "5vw" }} >
                              <Controller
                                as={<ParentCheckbox id={childElem.id} text={childElem.moduleName} />}
                                name={`module_id.${childElem.id}`}
                                control={control}
                                onChange={([data]) => {
                                  const newData = JSON.parse(JSON.stringify(clicked));
                                  newData[childElem.id] = !!data;
                                  setClicked(newData)
                                  return data;
                                }}
                              />
                            </Col>
                            {clicked[childElem.id] &&
                              <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                                <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                                  <Controller
                                    as={<ChildCheckBox id={childElem.id} text="Read" />}
                                    name={`canread.${childElem.id}`}
                                    control={control}
                                    defaultValue={clicked[childElem.id] && childElem.id}
                                  />
                                  <Controller
                                    as={<ChildCheckBox id={childElem.id} text="Write" />}
                                    name={`canwrite.${childElem.id}`}
                                    control={control}
                                  />
                                  <Controller
                                    as={<ChildCheckBox id={childElem.id} text="Delete" />}
                                    name={`candelete.${childElem.id}`}
                                    control={control}
                                  />
                                </div>
                              </Col>
                            }
                          </Fragment>
                        )}
                      </>
                      :
                      <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                        <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                          <Controller
                            as={<ChildCheckBox id={parentElem.id} text="Read" />}
                            name={`canread.${parentElem.id}`}
                            control={control}
                            defaultValue={clicked[parentElem.id] && parentElem.id}
                          />
                          <Controller
                            as={<ChildCheckBox id={parentElem.id} text="Write" />}
                            name={`canwrite.${parentElem.id}`}
                            control={control}
                          />
                          <Controller
                            as={<ChildCheckBox id={parentElem.id} text="Delete" />}
                            name={`candelete.${parentElem.id}`}
                            control={control}
                          />
                        </div>
                      </Col>
                    : ""
                  }
                </Fragment>
              )
            })
            }
          </Row> */}
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
