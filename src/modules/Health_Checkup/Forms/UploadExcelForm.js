import React from "react";
import { Col, Modal } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Error, SelectComponent, Button } from "components";
import { AttachFile } from "../../core/";
import { downloadFile } from "utils";
import swal from "sweetalert";
import _ from "lodash";
import { useSelector } from "react-redux";
const UploadExcelForm = ({ handleSubmit, onSubmit, userTypeName, employers, control, errors, _policySubType,
  policies, get, downloadFormate, onHide }) => {
  const { globalTheme } = useSelector(state => state.theme)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {(userTypeName === "Admin" ||
          userTypeName === "Super Admin" ||
          userTypeName === "Broker") && (
            <Col xl={4} lg={4} md={6} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired={true}
                    options={
                      employers?.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []
                    }
                  />
                }
                name="employer_id"
                control={control}
                defaultValue={""}
                error={errors && errors.employer_id}
              />
              {!!errors?.employer_id && (
                <Error top="2">{errors?.employer_id?.message}</Error>
              )}
            </Col>
          )}
        <Col xl={4} lg={4} md={6} sm={12}>
          <Controller
            as={
              <SelectComponent
                label="Policy Type"
                placeholder="Select Policy Type"
                required={false}
                isRequired={true}
                options={
                  _policySubType?.map((item) => ({
                    id: item.id,
                    label: item.name,
                    value: item.id,
                  })) || []
                }
              />
            }
            name="policy_sub_type_id"
            control={control}
            defaultValue={""}
            error={errors && errors.policy_sub_type_id}
          />
          {!!errors?.policy_sub_type_id && (
            <Error top="2">{errors?.policy_sub_type_id?.message}</Error>
          )}
        </Col>
        <Col xl={4} lg={4} md={6} sm={12}>
          <Controller
            as={
              <SelectComponent
                label="Policy Name"
                placeholder="Select Policy Name"
                isRequired={true}
                required={false}
                options={
                  (_policySubType?.length > 0 &&
                    policies?.map((item) => ({
                      id: item?.id,
                      label: `${item?.policy_no}`,
                      value: item?.id,
                    }))) ||
                  []
                }
              />
            }
            name="policy_id"
            control={control}
            defaultValue={""}
            error={errors && errors.policy_id}
          />
          {!!errors?.policy_id && (
            <Error>{errors?.policy_id?.message}</Error>
          )}
        </Col>
      </div>

      <div className="row">
        <div className="col-12">
          <AttachFile
            accept=".xlx, .xlsx, .xls, .csv"
            key="member_sheet"
            onUpload={get}
            description={`File Formats: (.xlx, .xlsx, .xls, .csv)`}
            nameBox
          />
        </div>
      </div>
      <div className="d-flex justify-content-end">
        {!_.isEmpty(downloadFormate) && (
          <button
            type="button"
            style={{
              color: "blue",
              outline: "none",
              background: "transparent",
              border: "none",
            }}
            onClick={() => {
              !_.isEmpty(downloadFormate)
                ? downloadFile(downloadFormate)
                : swal("Sample format not available", "", "warning");
            }}
          >
            <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px' }}>
              <i className="fa fa-download" /> Download Sample Format
            </p>
          </button>
        )}
      </div>
      <Modal.Footer>
        <Button type="button" buttonStyle="danger" onClick={onHide}>
          Close
        </Button>
        <Button type="submit">Submit</Button>
      </Modal.Footer>
    </form>
  );
}

export default UploadExcelForm;
