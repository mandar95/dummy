
import React, { useEffect, useState } from "react";

import { Modal, Row, Col } from "react-bootstrap";
import { Button, Select, Marker, Typography } from "components";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { employerMapping } from "./user.slice";
const sortData = (map_data) => {
  const response = [];

  for (let data of map_data) {
    response[data.default_format_id] = data.upload_template_id;
  }
  return { template_ids: response };
};

export const EnrollmentSheetMappping = ({ data, onHide, show }) => {
  const [filteredTemplate, setfFilteredTemplate] = useState({
      21:[],
      22:[],
      23:[]
  });
  const dispatch = useDispatch();

  const { control, handleSubmit, errors } = useForm(
    data?.sheet_data?.length && {
      defaultValues: sortData(data.sheet_data),
    }
  );
  const { templates } = useSelector((state) => state.endorsementRequest);
  useEffect(() => {
    if (templates.length) {
      setfFilteredTemplate({
        21: templates.filter(
          ({ default_format_id, status }) => default_format_id === 21 && status
        ),
        22: templates.filter(
          ({ default_format_id, status }) => default_format_id === 22 && status
        ),
        23: templates.filter(
          ({ default_format_id, status }) => default_format_id === 23 && status
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);
  const onSubmit = ({ template_ids }) => {
    const template_ids_filter = template_ids.filter(Number);
    dispatch(
        employerMapping({
            employer_id: data.employer_id,
            template_ids: template_ids_filter,
        },onHide)
      );
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Custom Sheet Mapping
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Marker />
          <Typography>{"\u00A0"} Employee Upload Mapping</Typography>
          <br />
          <Row className="d-flex justify-content-center">
            <Col xl={4} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Employee Adding Sheet"
                    placeholder="Default Employee Adding Sheet"
                    required={false}
                    options={filteredTemplate[21]?.map((item) => ({
                      id: item.id,
                      name: item.name,
                      value: item.id,
                    }))}
                    error={errors && errors.policy_type}
                  />
                }
                control={control}
                name="template_ids.21"
              />
            </Col>
            {!!filteredTemplate[22]?.length && (
              <Col xl={4} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Employee Removal Sheet"
                      placeholder="Default Employee Remove Sheet"
                      required={false}
                      options={filteredTemplate[22]?.map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))}
                      error={errors && errors.policy_type}
                    />
                  }
                  control={control}
                  name="template_ids.22"
                />
              </Col>
            )}
            {!!filteredTemplate[23]?.length && (
              <Col xl={4} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Employee Correction Sheet"
                      placeholder="Default Employee Correction Sheet"
                      required={false}
                      options={filteredTemplate[23]?.map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))}
                      error={errors && errors.policy_type}
                    />
                  }
                  control={control}
                  name="template_ids.23"
                />
              </Col>
            )}
          </Row>

          <Row>
            <Col>
              <Button
                className="m-3"
                type="button"
                buttonStyle="outline-secondary"
                onClick={onHide}
              >
                Cancel
              </Button>
              <Button className="m-3" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
};
