import React from "react";
import {Table,Form} from "react-bootstrap";
import {Error} from "components";
import { AttachFile2 } from "modules/core";
import {_UI} from "../../../Dashboard_Card_Config/helper";
import _ from "lodash";
const ContentTableForm = ({style, additionalCount, register, errors,removeBill,addForm,Data}) => {
    return ( 
        <Table
        className="text-center rounded text-nowrap"
        style={{ border: "solid 1px #e6e6e6" }}
        responsive
      >
        <thead>
          <tr>
            <th style={style} className="align-top">
              Product Feature <sup className="text-danger">*</sup>
            </th>
            <th style={style} className="align-top">
              Content<sup className="text-danger">*</sup>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(Number(additionalCount))]?.map((_, index) => {
            return (
              <tr key={index + "modal"}>
                <td>
                  <Form.Control
                    className="rounded-lg"
                    size="sm"
                    type="text"
                    maxLength={1000}
                    name={`features[${index}].name`}
                    ref={register}
                    error={
                      errors &&
                      errors.features &&
                      errors.features[index] &&
                      errors.features[index].name
                    }
                    placeholder={`Product Feature`}
                    defaultValue={Data?.title || ""}
                  />
                  {!!errors.features &&
                    errors.features[index] &&
                    errors.features[index].name && (
                      <Error top="0">
                        {errors.features[index].name.message}
                      </Error>
                    )}
                </td>
                <td>
                  <Form.Control
                    className="rounded-lg"
                    size="sm"
                    type="text"
                    maxLength={2000}
                    minLength={2}
                    name={`features[${index}].description`}
                    ref={register}
                    error={
                      errors &&
                      errors.features &&
                      errors.features[index] &&
                      errors.features[index].description
                    }
                    placeholder={`Content`}
                    defaultValue={Data?.content || ""}
                  />
                  {!!errors.features &&
                    errors.features[index] &&
                    errors.features[index].description && (
                      <Error top="0">
                        {errors.features[index].description.message}
                      </Error>
                    )}
                </td>
                <td>
                  <AttachFile2
                    fileRegister={register}
                    name={`features[${index}].image`}
                    title="Attach Logo"
                    key="premium_file"
                    accept=".jpeg, .png, .jpg"
                    description="File Formats: jpeg, png, jpg"
                    nameBox
                    attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                    fileDataUI={() => {
                      if(Boolean(Data?.image)) {
                        return _UI(Data?.image)
                      }
                    }}
                  />
                </td>
              </tr>
            );
          })}
          {_.isEmpty(Data) && <tr>
            <td colSpan="8">
              {additionalCount >= 1 && (
                <i
                  className="btn ti-trash text-danger"
                  onClick={removeBill}
                />
              )}
              <i className="btn ti-plus text-success" onClick={addForm} />
            </td>
          </tr>}
        </tbody>
      </Table>
     );
}
 
export default ContentTableForm;
