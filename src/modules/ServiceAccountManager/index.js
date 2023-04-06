import { IconlessCard } from "components";
import React, { useEffect, useReducer } from "react";
import { NoDataFound, Loader } from "components";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { DataTable } from "modules/user-management";
import { reducer, initialState, structure, schemaServiceAccountManager } from "./State";
import ModalComponent from "./EditModel.js";
import { Fetch, Update, Post } from "./ServiceAccountManager.action";
import ServiceManagerFormEdit from "./Form/ServiceManagerFormEdit";

const ServiceAccountManager = ({ myModule }) => {
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const { control, errors, handleSubmit, reset } = useForm({
    validationSchema: schemaServiceAccountManager,
    mode: "onBlur",
  });
  const onSubmit = (data) => {
    if (state.selectInput.length) {
      reducerDispatch({
        type: "LOADING",
      });
      const states = state.selectInput.map((data) => {
        return data.id;
      });
      const payload = {
        service_manager_code: data.code,
        service_manager_name: data.name,
        service_manager_email: data.email,
        service_manager_mobile_no: data.mobile,
        service_manager_level: data.level,
        state_ids: states,
      };
      reset({
        code: "",
        email: "",
        mobile: "",
        name: "",
      });
      reducerDispatch({
        type: "ON_SELECT",
        payload: [],
      });
      Post(payload, reducerDispatch);
    } else {
      swal("Alert", "Select State", "warning");
    }
  };
  useEffect(() => {
    Fetch(reducerDispatch);
    reducerDispatch({
      type: "ON_SELECT",
      payload: [],
    });
  }, []);
  useEffect(() => {
    // This Section Is used For extracting zones
    const RefactorData = state?.details?.map((elem) => ({
      ...elem,
      zones: elem.state.reduce((merge_array, { zone }) => {
        let result_array = [];
        zone.forEach(({ name }) => {
          if (!result_array.includes(name)) {
            result_array.push(name);
          }
        });
        return [...new Set([...merge_array, ...result_array])];
      }, []),
    }));
    reducerDispatch({
      type: "ON_FETCH_CREATE_ZONE",
      payload: RefactorData,
    });
  }, [state.details]);
  return (
    <>
      {state.loading && <Loader />}
      {!!myModule?.canwrite && <IconlessCard title={"Service Agent/RM Creation Module"}>
        <ServiceManagerFormEdit formType={"fresh"} handleSubmit={handleSubmit} onSubmit={onSubmit} errors={errors} control={control} reducerDispatch={reducerDispatch} state={state} />
      </IconlessCard>}
      <IconlessCard removeBottomHeader={true}>
        {state?.details.length ? (
          <DataTable
            className="border rounded"
            columns={structure(reducerDispatch, Update, Fetch, myModule)}
            data={state?.detailswithzone}
            noStatus={"true"}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            rowStyle={"true"}
            autoResetPage={false}
          />
        ) : (
          <NoDataFound />
        )}
        {state?.modalData?.show && (
          <ModalComponent
            show={state?.modalData?.show}
            onHide={() =>
              reducerDispatch({
                type: "HANDEL_MODAL_HIDE",
              })
            }
            state={state}
            reducerDispatch={reducerDispatch}
            Fetch={Fetch}
          />
        )}
      </IconlessCard>
    </>
  );
};

export default ServiceAccountManager;
