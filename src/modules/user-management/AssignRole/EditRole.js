import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";

import { Row, Col, Form } from "react-bootstrap";
import { Button, Card, Input, Error, Loader, Select } from "components";
// import { ParentCheckbox, ChildCheckBox } from "./option/Option";
import { Roles } from "./Roles";
import { Switch } from "./switch/switch";
import { RolesForEmployee } from "./RolesForEmployee";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModules,
  editRole,
  getRole,
  clear,
  clearRole,
  selectRoleData,
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
import _ from "lodash";
const validation = common_module.onboard;
function SortModules(module) {
  return _.unionBy([...module
    ?.filter(value => typeof (value?.module_sequence) === "number")
    ?.map((value) => {
      return {
        ...value,
        child: _.unionBy([...value?.child?.filter(value => typeof (value?.module_sequence) === "number")?.sort(
          (a, b) =>
            parseFloat(a.module_sequence) -
            parseFloat(b.module_sequence)
        ), ...value?.child], "id"),
      };
    })
    ?.sort(
      (a, b) =>
        parseFloat(a.module_sequence) -
        parseFloat(b.module_sequence)
    ), ...module], "id")
}
export default function UpdateRole({ type }) {
  const { data, reportingICData } = useSelector(
    (state) => state.userManagement
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const roleData = useSelector(selectRoleData);
  const modules = useSelector(selectModules);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const { userType } = useSelector((state) => state.login);

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
  const { control, reset, errors, handleSubmit, watch, register } = useForm({
    validationSchema,
  });
  // const [clicked, setClicked] = useState([]);
  let { id: roleId } = useParams();
  roleId = Decrypt(roleId);

  let SuperRole = watch("isSuperRole");
  // let RoleId = watch('role_id');

  useEffect(() => {
    if (roleValid === 1) {
      // if (type === "broker") {
      dispatch(
        Role_Data(
          roleData?.broker_id || roleData?.ic_id || roleData?.employer_id,
          type
        )
      );
      // }
      // else {
      //   dispatch(Role_Data(roleData?.employer_id, type));
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleValid]);

  // useEffect(() => {
  //   if (RoleId) {
  //     if (type === "broker") {
  //       dispatch(brokerReportingData({
  //         broker_id: roleData?.broker_id,
  //         role_id: RoleId
  //       }));
  //     }
  //     else {
  //       dispatch(employerReportingData({
  //         employer_id: roleData?.employer_id,
  //         role_id: RoleId
  //       }));
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [RoleId])

  useEffect(() => {
    if (SuperRole) {
      setRoleValid(1);
    } else {
      setRoleValid(0);
    }
  }, [SuperRole]);

  useEffect(() => {
    if (roleData?.has_super_role === 1) {
      setRoleValid(1);
      //dispatch(RoleData(roleData?.broker_id, type));
    }
  }, [roleData]);

  useEffect(() => {
    if (["insurer", "broker"].includes(type)) {
      dispatch(loadInsurerUser());
    }
    return () => {
      dispatch(clearData());
      dispatch(clearRole());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roleId && type && userType) dispatch(getRole(roleId, type, userType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, type, userType]);

  useEffect(() => {
    if (roleId !== roleData?.id) {
      reset(roleData);
    }
  }, [roleId, roleData, reset]);

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
  }, [success, error, loading, dispatch]);

  const onSubmit = (data) => {
    if (type === "employer") {
      let selectedModules =
        data?.module_id_employer?.map((value, index) => value && index).filter(Number) ||
        [];
      let module_sequence = {
        ...data?.childInput_id_employer,
        ...data?.parentInput_id_employer,
      };
      let temp = [];
      for (const [key, value] of Object.entries(module_sequence)) {
        if (selectedModules?.includes(Number(key))) {
          temp.push({
            module_id: Number(key),
            module_sequence: Number(value),
          });
        }
      }
      const canread =
        data?.canread_employer?.map((value, index) => value && index).filter(Number) ||
        [];
      const candelete =
        data?.candelete_employer?.map((value, index) => value && index).filter(Number) ||
        [];
      const canwrite =
        data?.canwrite_employer?.map((value, index) => value && index).filter(Number) ||
        [];
      // const modules =
      //   data?.module_id?.map((value, index) => value && index).filter(Number) ||
      //   [];

      if (!temp.length) {
        swal("Validation", "No module selected", "info");
        return null;
      }

      dispatch(
        editRole(
          {
            _method: "PATCH",
            rolename: data.rolename,
            status: data.status,
            canread,
            candelete,
            canwrite,
            modules: temp,
            ...(SuperRole === 1 && {
              has_super_role: data.isSuperRole,
              super_role_id: data.role_id,
              // reporting_person_id: data.reporting_id
            }),
            ...(["insurer", "broker"].includes(type) && {
              ic_user_type_id: data.ic_user_type_id,
            }),
          },
          roleId,
          type
        )
      );
    }
    if (type !== "employer") {
      const canread =
        data?.canread?.map((value, index) => value && index).filter(Number) ||
        [];
      const candelete =
        data?.candelete?.map((value, index) => value && index).filter(Number) ||
        [];
      const canwrite =
        data?.canwrite?.map((value, index) => value && index).filter(Number) ||
        [];
      const other =
        data?.other?.map((value, index) => value && index).filter(Number) ||
        [];
      const modules =
        data?.module_id?.map((value, index) => value && index).filter(Number) ||
        [];

      if (!modules.length) {
        swal("Validation", "No module selected", "info");
        return null;
      }

      dispatch(
        editRole(
          {
            _method: "PATCH",
            rolename: data.rolename,
            status: data.status,
            canread,
            candelete,
            canwrite,
            other,
            modules,
            ...(SuperRole === 1 && {
              has_super_role: data.isSuperRole,
              super_role_id: data.role_id,
              // reporting_person_id: data.reporting_id
            }),
            ...(["insurer", "broker"].includes(type) && {
              ic_user_type_id: data.ic_user_type_id,
            }),
          },
          roleId,
          type
        )
      );
    }
  };
  return (
    <Card title={`Update ${type[0].toUpperCase() + type.slice(1)} Role`}>
      {roleData?.id === Number(roleId) && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Input */}
          <Row xs={1} sm={1} md={2} lg={3} xl={4}>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <Input
                    label="Role Name"
                    maxLength={validation.name.max}
                    placeholder="Enter Role Name "
                    required={false}
                    isRequired={true}
                  />
                }
                name="rolename"
                control={control}
                error={errors && errors.rolename}
                defaultValue={roleData?.name}
              />
              {!!errors.rolename && <Error>{errors.rolename.message}</Error>}
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Switch />}
                name="status"
                control={control}
                defaultValue={1}
              />
            </Col>
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
                  defaultValue={roleData?.ic_user_type_id}
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
                defaultValue={roleData?.has_super_role || 0}
                label="Does this role has a super role ?"
              />
            </Col>
            {roleValid === 1 && (
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
                  defaultValue={roleData?.super_role_id || ""}
                  error={errors && errors.role_id}
                />
                {!!errors?.role_id && (
                  <Error>{errors?.role_id?.message}</Error>
                )}
              </Col>
            )}
          </Row>

          {/* Select Module */}
          {type === "employer" && (
            <RolesForEmployee
              modules={SortModules(modules)}
              plan_modules={[]}
              watch={watch}
              register={register}
              type="employer"
              type2={"_employer"}
              type3={3}
            />
          )}
          {type !== "employer" && (
            <Roles
              modules={modules}
              plan_modules={[]}
              watch={watch}
              register={register}
            />
          )}

          {/* <Row className="d-flex flex-wrap">
              {modules.map((parentElem) => {
                return (
                  <Fragment key={`module-${parentElem.id}`}>
                    <Col className="pl-0" md={7} lg={7} xl={7} sm={7} >
                      <Controller
                        as={<ParentCheckbox
                          value={parentElem.isSelected && parentElem.id}
                          id={parentElem.id} text={parentElem.name} />}
                        name={`module_id.${parentElem.id}`}
                        control={control}
                        onChange={([data]) => {
                          const newData = JSON.parse(JSON.stringify(clicked));
                          newData[parentElem.id] = !!data;
                          setClicked(newData)
                          return data;
                        }}
                        defaultValue={parentElem.isSelected && parentElem.id}
                      />
                    </Col>
                    {((clicked[parentElem.id] === undefined || clicked[parentElem.id] === null) ? parentElem.isSelected : clicked[parentElem.id]) ?
                      parentElem.child.length ?
                        <>
                          {parentElem.child.map((childElem) =>
                            <Fragment key={`module-${childElem.id}`}>
                              <Col md={7} lg={7} xl={7} sm={7} style={{ paddingLeft: "5vw" }} >
                                <Controller
                                  as={<ParentCheckbox
                                    value={childElem.isSelected && childElem.id}
                                    id={childElem.id} text={childElem.name} />}
                                  name={`module_id.${childElem.id}`}
                                  control={control}
                                  onChange={([data]) => {
                                    const newData = JSON.parse(JSON.stringify(clicked));
                                    newData[childElem.id] = !!data;
                                    setClicked(newData)
                                    return data;
                                  }}
                                  defaultValue={childElem.isSelected && childElem.id}
                                />
                              </Col>
                              {((clicked[childElem.id] === undefined || clicked[childElem.id] === null) ? childElem.isSelected === 1 : clicked[childElem.id]) &&
                                <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                                  <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                                    <Controller
                                      as={<ChildCheckBox
                                        value={childElem.canread && childElem.id}
                                        id={childElem.id} text="Read" />}
                                      name={`canread.${childElem.id}`}
                                      control={control}
                                      defaultValue={(childElem.canread && childElem.id) || (clicked[childElem.id] && childElem.id)}
                                    />
                                    <Controller
                                      as={<ChildCheckBox
                                        value={childElem.canwrite && childElem.id}
                                        id={childElem.id} text="Write" />}
                                      name={`canwrite.${childElem.id}`}
                                      control={control}
                                      defaultValue={childElem.canwrite && childElem.id}
                                    />
                                    <Controller
                                      as={<ChildCheckBox
                                        value={childElem.candelete && childElem.id}
                                        id={childElem.id} text="Delete" />}
                                      name={`candelete.${childElem.id}`}
                                      control={control}
                                      defaultValue={childElem.candelete && childElem.id}
                                    />
                                  </div>
                                </Col>
                              }
                            </Fragment>
                          )}
                        </>
                        :
                        <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                          <div className="d-flex flex-grow-1 mt-3 mb-3 ounded-lg justify-content-around">
                            <Controller
                              as={<ChildCheckBox
                                value={parentElem.canread && parentElem.id}
                                id={parentElem.id} text="Read" />}
                              name={`canread.${parentElem.id}`}
                              control={control}
                              defaultValue={(parentElem.canread && parentElem.id) || (clicked[parentElem.id] && parentElem.id)}
                            />
                            <Controller
                              as={<ChildCheckBox
                                value={parentElem.canwrite && parentElem.id}
                                id={parentElem.id} text="Write" />}
                              name={`canwrite.${parentElem.id}`}
                              control={control}
                              defaultValue={parentElem.canwrite && parentElem.id}
                            />
                            <Controller
                              as={<ChildCheckBox
                                value={parentElem.candelete && parentElem.id}
                                id={parentElem.id} text="Delete" />}
                              name={`candelete.${parentElem.id}`}
                              control={control}
                              defaultValue={parentElem.candelete && parentElem.id}
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
              <Button type="submit">Update</Button>
            </Col>
          </Row>
        </Form>
      )}
      {loading && <Loader />}
    </Card>
  );
};
