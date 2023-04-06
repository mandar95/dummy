import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { Button, Error, Input, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "utils";

const FilterModal = ({
  onHide,
  show,
  fromDate,
  toDate,
  getData,
  dataType,
  dateType,
}) => {
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [startDate, setStartDate] = useState("");

  const validationSchema = yup.object().shape({
    ...(isCustomDate && {
      till_date: yup.string().required("Please Enter End Date"),
      from_date: yup.string().required("Please Enter Start Date"),
    }),
  });

  useEffect(() => {
    if (dateType === "Custom Date") {
      setIsCustomDate(true);
    }
  }, [dateType]);

  const { control, errors, handleSubmit } = useForm({
    validationSchema,
    defaultValues: {
      data_type: {
        id: dataType,
        label: dataType,
        value: dataType,
      },
      ...(dateType && {
        date_type: {
          id: dateType,
          label: dateType,
          value: dateType,
        },
      }),
      from_date: fromDate,
      till_date: toDate,
    },
  });

  const allDataType = ["Employee Wise", "Member Wise"];
  const allDateType = ["FTD", "MTD", "YTD", "Custom Date"];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Form onSubmit={handleSubmit(getData)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Filter Endrosement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <Col xl={6} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Data Type"
                      placeholder="Select Data Type"
                      options={
                        allDataType.map((item) => ({
                          id: item,
                          label: item,
                          value: item,
                        })) || []
                      }
                    />
                  }
                  onChange={([selected]) => {
                    return selected;
                  }}
                  name="data_type"
                  control={control}
                />
              </Col>
              <Col xl={6} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Date Type"
                      placeholder="Select Date Type"
                      options={
                        allDateType.map((item) => ({
                          id: item,
                          label: item,
                          value: item,
                        })) || []
                      }
                    />
                  }
                  onChange={([selected]) => {
                    if (selected.value === "Custom Date") {
                      setIsCustomDate(true);
                    } else {
                      setIsCustomDate(false);
                    }
                    return selected;
                  }}
                  name="date_type"
                  control={control}
                />
              </Col>

              {isCustomDate && (
                <>
                  <Col xl={6} lg={6} md={6} sm={12}>
                    <Controller
                      as={<Input type="date" label="Date Range From" />}
                      name="from_date"
                      control={control}
                      onChange={([e]) => {
                        setStartDate(e.target.value);
                        return e.target.value;
                      }}
                    />
                    {!!errors?.from_date && (
                      <Error>{errors?.from_date?.message}</Error>
                    )}
                  </Col>
                  <Col xl={6} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Input
                          type="date"
                          min={startDate}
                          max={addDays(startDate, 30)}
                          label="Date Range To"
                        />
                      }
                      name="till_date"
                      control={control}
                    />
                    {!!errors?.till_date && (
                      <Error>{errors?.till_date?.message}</Error>
                    )}
                  </Col>
                </>
              )}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Search</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FilterModal;
