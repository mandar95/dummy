import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, DatePicker } from "../../../components";
import { Row, Col } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import styled from "styled-components";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { postCol, clearCreatedResp } from "../report-config.slice";
import swal from "sweetalert";
import { format } from 'date-fns'

const StepTwo = (props) => {
  const dispatch = useDispatch();
  const response = useSelector((state) => state.reportConfig);
  const { handleSubmit, control } = useForm();
  let ungroupedArrays = response?.fieldResp;
  const { globalTheme } = useSelector(state => state.theme)
  let groupedArrays = _.map(
    _.groupBy(ungroupedArrays, (item) => item?.table_name)
  );
  let [tableName, setTableName] = useState(null);

  //onSubmit
  const onSubmit = (data) => {
    let ObjKeys = Object.keys(data);
    let ObjValues = Object.values(data);
    let formdata = [];
    let j;
    for (var i = 0; i < ObjKeys.length; i++) {
      ObjValues[i]
        ? (j = { column_table_name: ObjKeys[i], value: ObjValues[i] })
        : (j = { column_table_name: ObjKeys[i] });
      formdata.push(j);
    }
    let postdata = Object.assign({ table: formdata }, { name: tableName });
    dispatch(postCol(postdata));
  };

  //file download---------------------------------------------------------------------
  useEffect(() => {
    if (response?.createResp?.data?.status) {
      // downloadFile(response?.createResp?.data?.data?.url);
      swal(response?.createResp?.data?.message, "", "success").then(() =>
        props.handleNext()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.createResp]);

  useEffect(() => {
    return () => {
      dispatch(clearCreatedResp());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //----------------------------------------------------------------------------------

  // field mapping
  const fieldSelection = (field, name, key, Table, index) => {
    switch (field) {
      case "bigint":
        return (
          <Col xs={12} sm={12} md={6} lg={4} xl={3} key={key + 'selected'}>
            <Controller
              as={<Input label={name} placeholder={name} type="number" />}
              control={control}
              name={`${Table}-${name}`}
            />
          </Col>
        );
      case "integer":
        return (
          <Col xs={12} sm={12} md={6} lg={4} xl={3} key={key + 'selected'} >
            <Controller
              as={<Input label={name} placeholder={name} type="number" />}
              control={control}
              name={`${Table}-${name}`}
            />
          </Col >
        );
      case "boolean":
        return (
          <Col xs={12} sm={12} md={6} lg={4} xl={3} key={key + 'selected'}>
            <Controller
              as={<Switch label={name} />}
              control={control}
              name={`${Table}-${name}`}
              defaultValue={0}
            />
          </ Col>
        );
      case "datetime":
        return (
          <Col xs={12} sm={12} md={6} lg={4} xl={3} key={key + 'selected'} >
            {/* <Controller
              as={<Input label={name} placeholder={name} type="1date" />}
              control={control}
              name={`${Table}-${name}`}
            /> */}
            <Controller
              as={
                <DatePicker
                  name={name}
                  label={name}
                  required={false}
                />
              }
              onChange={([selected]) => {
                return selected ? format(selected, 'dd-MM-yyyy') : '';
              }}
              name={name}
              control={control}
            />
          </Col>
        );
      default:
        return (
          <Col xs={12} sm={12} md={6} lg={4} xl={3} key={key + 'selected'} >
            <Controller
              as={<Input label={name} placeholder={name} />}
              control={control}
              name={`${Table}-${name}`}
            />
          </Col>
        );
    }
  };
  return (
    !_.isEmpty(response?.fieldResp) ? (
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "20px" }}>
        <h5 style={{ textAlign: "center", margin: "10px" }}>Template Name</h5>
        <RowInnerDiv>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Input
              label="Template Name"
              placeholder="Template Name"
              required
              value={tableName}
              onInput={(e) => setTableName(e.target.value)}
            />
          </Col>
        </RowInnerDiv>
        {!_.isEmpty(groupedArrays) ? (
          groupedArrays?.map((item, index) => {
            return (
              <Fragment key={index + 'table-data-145'}>
                <h5 style={{ textAlign: "center", margin: "10px" }}>
                  {item[0]?.table_name?.replaceAll("_", " ")?.toUpperCase()}
                </h5>
                <RowInnerDiv>
                  {!_.isEmpty(item) ? (
                    item?.map((obj, index) =>
                      fieldSelection(
                        obj?.column_type,
                        obj?.column_name,
                        obj?.id,
                        obj?.table_name,
                        index
                      )
                    )
                  ) : (
                    <noscript />
                  )}
                </RowInnerDiv>
              </Fragment>
            );
          })
        ) : (
          <div>
            <p
              style={{
                color: "red",
                fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Please Select & Submit the required columns
            </p>
          </div>
        )}

        <RowDiv>
          <Button
            buttonStyle="outline-solid"
            hex="#0000ff"
            hex2="#00ccff"
            style={{
              margin: "10px",
            }}
          >
            Submit
          </Button>
        </RowDiv>
      </form>
    ) : (
      <div>
        <p
          style={{
            color: "red",
            fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Please Select & Submit the required columns
        </p>
      </div>
    )
  );
};

const RowDiv = styled(Row)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const RowInnerDiv = styled(Row)`
  border-top: 1px dashed black;
  padding: 10px 0 10px 0;
  @media (max-width: 600px) {
    border: none;
  }
`;

export default StepTwo;
