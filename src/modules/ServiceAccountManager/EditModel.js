import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { UpdateModel } from "./ServiceAccountManager.action"
import { schemaServiceAccountManager } from "./State";
import ServiceManagerFormEdit from "./Form/ServiceManagerFormEdit";

const ModalComponent = ({ show, onHide, state, reducerDispatch, Fetch }) => {
  useEffect(() => {
    reducerDispatch({
      type: "ON_SELECT_MODAL",
      payload: [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { control, errors, handleSubmit } = useForm({
    validationSchema: schemaServiceAccountManager,
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    if (state.selectInputModel.length) {
      reducerDispatch({
        type: "LOADING",
      });
      const states = state.selectInputModel.map((data) => {
        return data.id;
      });
      const payload = {
        service_manager_code: data.code,
        service_manager_name: data.name,
        service_manager_email: data.email,
        service_manager_mobile_no: data.mobile,
        status: state?.modalData?.data?.status,
        state_ids: states,
      };
      UpdateModel(payload, onHide, reducerDispatch, Fetch, state?.modalData?.data?.id);
    } else if (state?.modalData?.data.state.length) {
      reducerDispatch({
        type: "LOADING",
      });
      const states = state?.modalData?.data.state.map((data) => {
        return data.id;
      });
      const payload = {
        service_manager_code: data.code,
        service_manager_name: data.name,
        service_manager_email: data.email,
        service_manager_mobile_no: data.mobile,
        status: state?.modalData?.data?.status,
        service_manager_level: data.level,
        state_ids: states,
      };
      UpdateModel(payload, onHide, reducerDispatch, Fetch, state?.modalData?.data?.id);
    } else {
      reducerDispatch({
        type: "ON_HIDE",
      });
      swal("Alert", "Select State", "warning");
    }
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span className={"text-primary"}>Update - Service Agent/RM</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ServiceManagerFormEdit
          formType={"update"}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          state={state}
          errors={errors}
          control={control}
          reducerDispatch={reducerDispatch}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
