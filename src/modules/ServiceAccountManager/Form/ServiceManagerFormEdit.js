import React from "react";
import { Input, Error, Select as Selecta, Button } from "components";
import { Controller } from "react-hook-form";
import { numOnly, noSpecial } from 'utils';
import classes from "../style.module.css";
import Select from "react-select";
import { Levels } from "../State";
const ServiceManagerFormEdit = ({ handleSubmit, onSubmit, state, errors, control, reducerDispatch, formType }) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12 col-md-4">
          <Controller
            as={
              <Input
                label="Service Agent/RM ID"
                name="code"
                placeholder="Enter Name"

              />
            }
            isRequired
            name="code"
            defaultValue={Boolean(state?.modalData?.data?.service_manager_code) ? state?.modalData?.data.service_manager_code : ""}
            error={errors && errors.code}
            control={control}
          />
          {errors?.code && <Error>{errors.code.message}</Error>}
        </div>
        <div className="col-12 col-md-4">
          <Controller
            as={
              <Input
                label="Service Agent/RM Name"
                name="name"
                placeholder="Enter Name"
              />
            }
            isRequired
            name="name"
            defaultValue={Boolean(state?.modalData?.data?.service_manager_name) ? state?.modalData?.data.service_manager_name : ""}
            error={errors && errors.name}
            control={control}
          />
          {errors?.name && <Error>{errors.name.message}</Error>}
        </div>
        <div className="col-12 col-md-4">
          <Controller
            as={
              <Input
                label="Email Address"
                name="email"
                placeholder="Enter Email"

              />
            }
            defaultValue={Boolean(state?.modalData?.data?.service_manager_email) ? state?.modalData?.data.service_manager_email : ""}
            isRequired
            name="email"
            error={errors && errors.email}
            control={control}
          />
          {errors?.email && <Error>{errors.email.message}</Error>}
        </div>
        <div className="col-12 col-md-4">
          <Controller
            as={
              <Input
                label="Mobile Number"
                name="mobile"
                placeholder="Enter Mobile No"
                type='tel'
                maxLength={10}
                onKeyDown={numOnly} onKeyPress={noSpecial}
              />
            }
            defaultValue={Boolean(state?.modalData?.data?.service_manager_mobile_no) ? state?.modalData?.data?.service_manager_mobile_no : ""}
            isRequired
            name="mobile"
            error={errors && errors.mobile}
            control={control}
          />
          {errors?.mobile && <Error>{errors.mobile.message}</Error>}
        </div>
        <div className="col-12 col-md-4 align-self-center">
          <Controller
            as={
              <div className={` text-center ${classes.fieldset}`}>
                <span className={`text-dark ${classes.legend}`}>
                  State <span className="text-danger">*</span>
                </span>
                <Select
                  className={`${classes.minHeight}`}
                  closeMenuOnSelect={false}
                  onChange={(e) => {
                    if (formType === "fresh") {
                      reducerDispatch({
                        type: "ON_SELECT",
                        payload: e,
                      })
                    } else {
                      reducerDispatch({
                        type: "ON_SELECT_MODAL",
                        payload: e,
                      })
                    }

                  }
                  }

                  defaultValue={state?.modalData?.data?.state.map((data, i) => {
                    return {
                      id: data.id,
                      name: data.name,
                      value: data.name,
                      label: data.name,
                    };
                  }) || []}
                  isMulti
                  options={state?.statesList.map((data, i) => {
                    return {
                      id: data.id,
                      name: data.state_name,
                      value: data.state_name,
                      label: data.state_name,
                    };
                  })}
                />
              </div>
            }
            isRequired
            name="state"
            error={errors && errors.state}
            control={control}
          />
        </div>
        <div className="col-12 col-md-4 align-self-center">
          <Controller
            as={
              <Selecta
                label="Level"
                placeholder="Select Level"
                isRequired={true}
                options={Levels}
                error={errors && errors.level} />
            }
            defaultValue={Boolean(state?.modalData?.data?.service_manager_level) ? state?.modalData?.data.service_manager_level : ""}
            error={errors && errors?.level}
            control={control}
            name={'level'}
          />
          {!!(errors?.level) && <Error>
            {errors?.level.message}
          </Error>}
        </div>
        <div className="col-12 align-self-center">
          <div className="d-flex w-100 justify-content-end align-items-center">
            <Button
              type="submit"
              className={`row py-3 px-3 text-light mr-1 mt-2 mt-md-0`}
            >
              <div className="col-8">{formType === "fresh" ? 'Submit' : 'Update'}</div>
              <div className="col-3">
                <i className="text-right fas fa-arrow-right"></i>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ServiceManagerFormEdit;
