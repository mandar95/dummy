import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, Loader } from "components";
import { RolesForEmployee } from "./RolesForEmployee";
import { useDispatch, useSelector } from "react-redux";
import {
  editRole,
  clear,
  clearRole,
  selectLoading,
  selectError,
  selectSuccess,
  clearData,
  RoleDataEmployee,
  selectUsersData,
} from "../user.slice";
import { Decrypt } from "../../../utils";
import { SortModulesEdit } from "../user.slice";
import _ from "lodash";
export function SortModules(module) {
  return _.unionBy([...SortModulesEdit(module)
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
    ), ...SortModulesEdit(module)], "id")
}
export default function UpdateRoleForEmployee({ type }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector(selectUsersData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  let { id: employer_id } = useParams();
  employer_id = Decrypt(employer_id);


  // let schema = yup.object().shape({
  //   parentInput_id: yup.array.of(),
  //   childInput_id: yup.string().required(),
  // });
  const { handleSubmit, watch, register, control } = useForm({
    // validationSchema: schema,
    mode: "onBlur"
  });
  useEffect(() => {
    return () => {
      dispatch(clearData());
      dispatch(clearRole());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  useEffect(() => {
    if (Boolean(employer_id)) dispatch(RoleDataEmployee(employer_id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id]);
  const onSubmit = (data) => {
    let selectedModules =
      data?.module_id_employee
        ?.map((value, index) => value && index)
        .filter(Number) || [];
    let module_sequence = { ...data?.childInput_id, ...data?.parentInput_id };
    let temp = [];
    for (const [key, value] of Object.entries(module_sequence)) {
      if (selectedModules?.includes(Number(key))) {
        temp.push({
          module_id: Number(key),
          module_sequence: Number(value)
        })
      }
    }
    const _data = {
      canread:
        data?.canread_employee
          ?.map((value, index) => value && index)
          .filter(Number) || [],
      candelete:
        data?.candelete_employee
          ?.map((value, index) => value && index)
          .filter(Number) || [],
      canwrite:
        data?.canwrite_employee
          ?.map((value, index) => value && index)
          .filter(Number) || [],
      employer_id: employer_id,
      modules: temp,
    };
    if (!_data.modules.length) {
      swal("Validation", "No module selected", "info");
      return null;
    }

    dispatch(editRole(_data, employer_id, "employee"));
  };
  return (
    <Card title="Update Employee Role">
      <form onSubmit={handleSubmit(onSubmit)}>
        {userData?.data?.[0]?.modules && (
          <RolesForEmployee
            // modules={SortModulesEdit(userData?.data?.modules)?.sort((a, b) => parseFloat(a.module_sequence) - parseFloat(b.module_sequence))}
            modules={SortModules(userData?.data?.[0]?.modules?.filter(({ name, module_url }) => !(module_url === '/home' && name === 'Dahsboard')))}
            plan_modules={[]}
            watch={watch}
            register={register}
            Controller={Controller}
            control={control}
            type="employee"
            type2={""}
            type3={2}
          />
        )}
        <div className="mt-2 d-flex justify-content-end">
          <Button type="submit">Update</Button>
        </div>
      </form>
      {loading && <Loader />}
    </Card>
  );
}
