import React from "react";
import { Controller } from "react-hook-form";
import {Input,Error,Button,Select} from "components";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { AttachFile2 } from "modules/core";
const CardConfigForm = ({handleSubmit, onSubmit,errors,control,customField,Modules,register}) => {
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
              defaultValue=""
              name="sub_heading"
              error={errors && errors.sub_heading}
              control={control}
            />
            {errors?.sub_heading && (
              <Error>{errors.sub_heading.message}</Error>
            )}
          </div>
          {/* <div className="col-12 col-md-4">
            <Controller
              as={
                <Input
                  label="Description"
                  name="description"
                  placeholder="Enter Description"
                />
              }
              defaultValue=""
              name="description"
              error={errors && errors.description}
              control={control}
            />
            {errors?.description && (
              <Error>{errors.description.message}</Error>
            )}
          </div> */}
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
              defaultValue={0}
              name={`custom_field`}
              control={control}
            />
          </div>
          {Boolean(!customField) && (
            <div className="col-12 col-md-4">
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
              {errors?.redirect_url && (
                <Error>{errors.redirect_url.message}</Error>
              )}
            </div>
          )}
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
              defaultValue={"#000000"}
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
              defaultValue={"#000000"}
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
              defaultValue={"#000000"}
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
              required={true}
            />
          </div>
          <div className="col-12 mt-3 align-self-end text-right">
            <Button>Submit</Button>
          </div>
        </div>
      </form>
     );
}
 
export default CardConfigForm;