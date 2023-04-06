import React, { useEffect, useReducer } from "react";
import { Roles } from "../AssignRole/Roles";
import { Card, Button, Loader } from "components";
import classes from "./AdminModule.module.css";
import { useForm } from "react-hook-form";
import httpClient from "api/httpClient";
import { SortModulesEdit } from "../user.slice";
import swal from "sweetalert";
import { useParams } from "react-router";

// import { useSelector } from 'react-redux';
const initialState = {
  loading: true,
  modules: [],
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ON_FETCH":
      return {
        ...state,
        loading: false,
        modules: payload,
      };
    case "ON_ERROR":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

const AdminModule = () => {
  // const { userType } = useSelector(state => state.login);
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const { master_user_types_id } = useParams();

  useEffect(() => {
    Fetch(master_user_types_id);
  }, [master_user_types_id]);


  const { handleSubmit, watch, register } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data) => {
    const canread =
      data?.canread?.map((value, index) => value && index).filter(Number) || [];
    const candelete =
      data?.candelete?.map((value, index) => value && index).filter(Number) ||
      [];
    const canwrite =
      data?.canwrite?.map((value, index) => value && index).filter(Number) ||
      [];
    const modules =
      data?.module_id?.map((value, index) => value && index).filter(Number) ||
      [];
    Post({
      _method: "PATCH",
      canread: canread,
      candelete: candelete,
      canwrite: canwrite,
      modules: modules,
      master_user_types_id: master_user_types_id,
    });
  };
  return (
    <>
      {state.loading && <Loader />}
      {!state.loading && (
        <Card title="Super Admin">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Roles
              modules={state.modules}
              plan_modules={[]}
              watch={watch}
              register={register}
            />
            <div className={classes.buttonDiv}>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
  async function Fetch(master_user_types_id) {
    try {
      const { data } = await httpClient("/admin/get/user-type/module/mapping", {
        method: "POST",
        data: {
          master_user_types_id: master_user_types_id
        },
      });
      reducerDispatch({
        type: "ON_FETCH",
        payload: SortModulesEdit(data?.data?.modules),
      });
    } catch (err) {
      console.error(err.message);
      reducerDispatch({ type: "ON_ERROR" });
    }
  }
  async function Post(payload) {
    try {
      const { data } = await httpClient("/admin/update/user-type/module/mapping", {
        method: "PATCH",
        data: payload,
      });
      if (data.status) {
        swal('Success', data.message, "success");
        Fetch(payload.master_user_types_id);
      } else {
        swal("Alert", data.message, "warning");
      }
    } catch (err) {
      console.error(err.message);
      reducerDispatch({ type: "ON_ERROR" });
    }
  }
};


export default AdminModule;
