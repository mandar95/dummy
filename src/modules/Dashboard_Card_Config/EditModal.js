import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { updateDashboardCardConfig } from "./actions";
import { schemaCardConfig } from "./helper";
import UpdateForm from "./Form/UpdateForm";

const EditModal = ({
  show,
  onHide,
  state,
  reducerDispatch,
  Modules,
  currentUser,
}) => {
  const { control, errors, handleSubmit, register, watch, setValue } =
    useForm({
      validationSchema: schemaCardConfig,
      mode: "onBlur",
    });

  const customField = watch("custom_field");

  useEffect(() => {
    if (state?.updateCardModalData.data.redirect_url.search("://") < 0) {
      setValue("custom_field", 0);
    } else {
      setValue("custom_field", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.updateCardModalData.data]);

  useEffect(() => {
    if (Boolean(customField) && Boolean(state?.updateCardModalData.data.redirect_url.search("://") >= 0)) {
      setValue("redirect_url_external", state?.updateCardModalData.data.redirect_url);
    } else {
      setValue("redirect_url", state?.updateCardModalData.data.redirect_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customField])

  const onSubmit = (data) => {
    const formdata = new FormData();
    if (data.icon.length) {
      formdata.append(`icon[image]`, data.icon[0]);
      formdata.append(`icon[name]`, data.icon[0].name);
    }
    let theme_json = JSON.stringify({
      cardBackground: data.cardBackground,
      cardColor: data.cardColor,
      textColor: data.textColor,
    });
    formdata.append(`redirect_url`, Boolean(data.custom_field) ? data.redirect_url_external : data.redirect_url);
    formdata.append(`theme_json`, theme_json);
    formdata.append(`sub_heading`, Boolean(data.sub_heading) ? data.sub_heading : "");
    formdata.append(`heading`, data.heading);
    // formdata.append(`description`, Boolean(data.description) ? data.description : "");
    updateDashboardCardConfig(formdata, currentUser.broker_id, reducerDispatch, state?.updateCardModalData.data.id);
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
          Update Card Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UpdateForm
          handleSubmit={handleSubmit} onSubmit={onSubmit} state={state} errors={errors} control={control}
           customField={customField} Modules={Modules} register={register}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
