import React from "react";
import { Controller } from "react-hook-form";
import { Input, Error, Select, Button } from "components";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { AttachFile2 } from "modules/core";
import { _UI } from "../helper";
import _ from "lodash";
const UpdateForm = ({ handleSubmit, onSubmit, state, errors, control, customField, Modules, register }) => {
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row w-100">
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Input
                                label="Heading"
                                name="heading"
                                placeholder="Enter Heading"
                                required={true}
                            />
                        }
                        defaultValue={state?.updateCardModalData.data.heading}
                        name="heading"
                        error={errors && errors.heading}
                        control={control}
                    />
                    {errors?.heading && <Error>{errors.heading.message}</Error>}
                </div>
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Input
                                label="Sub Heading"
                                name="sub_heading"
                                placeholder="Enter Sub Heading"
                            />
                        }
                        defaultValue={state?.updateCardModalData.data.sub_heading || ""}
                        name="sub_heading"
                        error={errors && errors.sub_heading}
                        control={control}
                    />
                    {errors?.sub_heading && (
                        <Error>{errors.sub_heading.message}</Error>
                    )}
                </div>
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Switch
                                InputBorderStyle={{
                                    border: "none",
                                }}
                                showSpan={true}
                                label={"Custom Field ?"}
                                required={false}
                            />
                        }
                        name={`custom_field`}
                        control={control}
                    />
                </div>
                {Boolean(!customField) && <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Select
                                label="Modules"
                                placeholder="Select Module"
                                options={Modules.map(({ name, url }) => ({
                                    name: name,
                                    id: url,
                                    value: url
                                }))}
                                required={Boolean(!customField)}
                            />
                        }
                        name="redirect_url"
                        error={errors && errors.redirect_url}
                        control={control}
                    />
                </div>}
                {Boolean(customField) && (
                    <div className="col-12 col-md-4">
                        <Controller
                            as={
                                <Input
                                    style={{
                                        background: "white",
                                    }}
                                    label="URL"
                                    placeholder="Enter URL"
                                    required={Boolean(customField)}
                                />
                            }
                            name="redirect_url_external"
                            error={errors && errors.redirect_url_external}
                            control={control}
                        />
                        {errors?.redirect_url_external && (
                            <Error>{errors.redirect_url_external.message}</Error>
                        )}
                    </div>
                )}
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Input
                                type="color"
                                label="Card Background"
                                placeholder="Select Card Background"
                                required={false}
                                isRequired={true}
                            />
                        }
                        defaultValue={
                            state?.updateCardModalData.data.theme_json.cardBackground
                        }
                        isRequired
                        name="cardBackground"
                        error={errors && errors.cardBackground}
                        control={control}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Input
                                type="color"
                                label="Card Color"
                                placeholder="Select Card Color"
                                required={false}
                                isRequired={true}
                            />
                        }
                        defaultValue={
                            state?.updateCardModalData.data.theme_json.cardColor
                        }
                        isRequired
                        name="cardColor"
                        error={errors && errors.cardColor}
                        control={control}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <Controller
                        as={
                            <Input
                                type="color"
                                label="Text Color"
                                placeholder="Select Text Color"
                                required={false}
                                isRequired={true}
                            />
                        }
                        defaultValue={
                            state?.updateCardModalData.data.theme_json.textColor
                        }
                        isRequired
                        name="textColor"
                        error={errors && errors.textColor}
                        control={control}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <AttachFile2
                        fileRegister={register}
                        name={`icon`}
                        title="Attach Document"
                        key="premium_file"
                        accept=".jpeg, .png, .jpg, .pdf"
                        description="File Formats: jpeg, png, jpg"
                        nameBox
                        attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                        fileDataUI={() => _UI(state?.updateCardModalData.data.image)}
                        required={_.isEmpty(state?.updateCardModalData.data.image)}
                    />
                </div>
                <div className="col-12 align-self-center text-right mt-2">
                    <Button>Update</Button>
                </div>
            </div>
        </form>
    );
}

export default UpdateForm;