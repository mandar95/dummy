import React, { useEffect, useState } from "react";

import { Modal, Row, Col } from "react-bootstrap";
import { Button, Select, Marker, Typography } from "../../../components";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { endorsementMapping } from "../approve-policy/approve-policy.slice";

const sortData = (map_data) => {
  const response = [];

  for (let data of map_data) {
    response[data.default_format_id] = data.upload_template_id;
  }
  return { template_ids: response };
};

export const EnrollmentSheetMappping = ({ data, onHide, show }) => {
  const [filteredTemplate, setfFilteredTemplate] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    14: [],
    15: [],
    25: [],
    26: []
  });
  const dispatch = useDispatch();

  const { control, handleSubmit, errors } = useForm(
    data.sheet_data.length && {
      defaultValues: sortData(data.sheet_data),
    }
  );
  const { templates } = useSelector((state) => state.endorsementRequest);
  useEffect(() => {
    if (templates.length) {
      setfFilteredTemplate({
        1: templates.filter(
          ({ default_format_id, status }) => default_format_id === 1 && status
        ),
        2: templates.filter(
          ({ default_format_id, status }) => default_format_id === 2 && status
        ),
        3: templates.filter(
          ({ default_format_id, status }) => default_format_id === 3 && status
        ),
        4: templates.filter(
          ({ default_format_id, status }) => default_format_id === 4 && status
        ),
        5: templates.filter(
          ({ default_format_id, status }) => default_format_id === 5 && status
        ),
        6: templates.filter(
          ({ default_format_id, status }) => default_format_id === 6 && status
        ),
        7: templates.filter(
          ({ default_format_id, status }) => default_format_id === 7 && status
        ),
        8: templates.filter(
          ({ default_format_id, status }) => default_format_id === 8 && status
        ),
        9: templates.filter(
          ({ default_format_id, status }) => default_format_id === 9 && status
        ),
        10: templates.filter(
          ({ default_format_id, status }) => default_format_id === 10 && status
        ),
        14: templates.filter(
          ({ default_format_id, status }) => default_format_id === 14 && status
        ),
        15: templates.filter(
          ({ default_format_id, status }) => default_format_id === 15 && status
        ),
        25: templates.filter(
          ({ default_format_id, status }) => default_format_id === 25 && status
        ),
        26: templates.filter(
          ({ default_format_id, status }) => default_format_id === 26 && status
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);
  const onSubmit = ({ template_ids }) => {
    const template_ids_filter = template_ids.filter(Number);
    if (template_ids_filter.length) {
      dispatch(
        endorsementMapping({
          policy_id: data.policy_id,
          template_ids: template_ids_filter,
        })
      );
    } else {
      dispatch(
        endorsementMapping({
          policy_id: data.policy_id,
          template_ids: [],
        })
      );
    }
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
          <Typography>{"\u00A0"} Endorsement Mapping</Typography>
          <br />
          <Row className="d-flex justify-content-center">
            <Col xl={4} lg={6} md={6} sm={12}>
              <Controller
                as={
                  <Select
                    label="Member Adding Sheet"
                    placeholder="Default Member Adding Sheet"
                    required={false}
                    options={filteredTemplate[1].map((item) => ({
                      id: item.id,
                      name: item.name,
                      value: item.id,
                    }))}
                    error={errors && errors.policy_type}
                  />
                }
                control={control}
                name="template_ids.1"
              />
            </Col>
            {!!filteredTemplate[2]?.length && (
              <Col xl={4} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Member Remove Sheet"
                      placeholder="Default Member Remove Sheet"
                      required={false}
                      options={filteredTemplate[2].map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))}
                      error={errors && errors.policy_type}
                    />
                  }
                  control={control}
                  name="template_ids.2"
                />
              </Col>
            )}
            {!!filteredTemplate[3]?.length && (
              <Col xl={4} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="Member Correction Sheet"
                      placeholder="Default Member Correction Sheet"
                      required={false}
                      options={filteredTemplate[3].map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))}
                      error={errors && errors.policy_type}
                    />
                  }
                  control={control}
                  name="template_ids.3"
                />
              </Col>
            )}
          </Row>

          {!!filteredTemplate[4]?.length && (
            <>
              <Marker />
              <Typography>{"\u00A0"} TPA Member Sheet Mapping</Typography>
              <br />
              <Row className="d-flex justify-content-center">
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="TPA Member Sheet"
                        placeholder="Default TPA Member Sheet"
                        required={false}
                        options={filteredTemplate[4].map((item) => ({
                          id: item.id,
                          name: item.name,
                          value: item.id,
                        }))}
                        error={errors && errors.policy_type}
                      />
                    }
                    control={control}
                    name="template_ids.4"
                  />
                </Col>
              </Row>
            </>
          )}

          {!!filteredTemplate[5]?.length && (
            <>
              <Marker />
              <Typography>{"\u00A0"} Claim Dumb Sheet Mapping</Typography>
              <br />
              <Row className="d-flex justify-content-center">
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Claim Sheet"
                        placeholder="Default Claim Sheet"
                        required={false}
                        options={filteredTemplate[5].map((item) => ({
                          id: item.id,
                          name: item.name,
                          value: item.id,
                        }))}
                        error={errors && errors.policy_type}
                      />
                    }
                    control={control}
                    name="template_ids.5"
                  />
                </Col>
              </Row>
            </>
          )}

          {!!(filteredTemplate[6]?.length || filteredTemplate[7]?.length) && (
            <>
              <Marker />
              <Typography>
                {"\u00A0"} {!!filteredTemplate[6]?.length && "Intimate"}{" "}
                {!!(
                  filteredTemplate[6]?.length && filteredTemplate[7]?.length
                ) && "&"}{" "}
                {!!filteredTemplate[7]?.length && "Submit"} Claim Sheet

              </Typography>
              <br />
              <Row className="d-flex justify-content-center">
                {!!filteredTemplate[6]?.length && (
                  <Col xl={4} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Intimate Claim Sheet"
                          placeholder="Default Intimate Claim Sheet"
                          required={false}
                          options={filteredTemplate[6].map((item) => ({
                            id: item.id,
                            name: item.name,
                            value: item.id,
                          }))}
                          error={errors && errors.policy_type}
                        />
                      }
                      control={control}
                      name="template_ids.6"
                    />
                  </Col>
                )}
                {!!filteredTemplate[7]?.length && (
                  <Col xl={4} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Submit Claim Sheet"
                          placeholder="Default Submit Claim Sheet"
                          required={false}
                          options={filteredTemplate[7].map((item) => ({
                            id: item.id,
                            name: item.name,
                            value: item.id,
                          }))}
                          error={errors && errors.policy_type}
                        />
                      }
                      control={control}
                      name="template_ids.7"
                    />
                  </Col>
                )}

              </Row>
            </>
          )}
          {(data?.policy_sub_type_id === 2) && <><Marker />
            <Typography>
              {"\u00A0"} GPA Claim Sheet

            </Typography>
            <br />
            <Row className="d-flex justify-content-center">
              <Col xl={4} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <Select
                      label="GPA Claim Sheet"
                      placeholder="Default GPA Claim"
                      required={false}
                      options={filteredTemplate[14].map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))}
                      error={errors && errors.policy_type}
                    />
                  }
                  control={control}
                  name="template_ids.14"
                />
              </Col>
            </Row></>}
          {!!filteredTemplate[8]?.length && (
            <>
              <Marker />
              <Typography>{"\u00A0"} Network Hospital Sheet Mapping</Typography>
              <br />
              <Row className="d-flex justify-content-center">
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Controller
                    as={
                      <Select
                        label="Network Hospital Sheet"
                        placeholder="Default Network Hospital Sheet"
                        required={false}
                        options={filteredTemplate[8].map((item) => ({
                          id: item.id,
                          name: item.name,
                          value: item.id,
                        }))}
                        error={errors && errors.policy_type}
                      />
                    }
                    control={control}
                    name="template_ids.8"
                  />
                </Col>
              </Row>
            </>
          )}

          {!!(
            filteredTemplate[9]?.length ||
            filteredTemplate[10]?.length ||
            filteredTemplate[14]?.length
          ) && (
              <>
                <Marker />
                <Typography>{"\u00A0"} Dynamic sheet</Typography>
                <br />
                <Row className="d-flex justify-content-center">
                  <Col xl={4} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Dynamic sheet for Report Enrolment"
                          placeholder="Default Dynamic sheet for Report Enrolment"
                          required={false}
                          options={filteredTemplate[9].map((item) => ({
                            id: item.id,
                            name: item.name,
                            value: item.id,
                          }))}
                          error={errors && errors.policy_type}
                        />
                      }
                      control={control}
                      name="template_ids.9"
                    />
                  </Col>
                  <Col xl={4} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="TPA Claim Report"
                          placeholder="Default TPA Claim Report"
                          required={false}
                          options={filteredTemplate[10]
                            .filter((item) => item.tpa_id === data.tpaid)
                            .map((item) => ({
                              id: item.id,
                              name: item.name,
                              value: item.id,
                            }))}
                          error={errors && errors.policy_type}
                        />
                      }
                      control={control}
                      name="template_ids.10"
                    />
                  </Col>
                  {(data?.policy_sub_type_id === 2) && <Col xl={4} lg={6} md={6} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="GPA Claim Report"
                          placeholder="Default GPA Claim Report"
                          required={false}
                          options={filteredTemplate[15].map((item) => ({
                            id: item.id,
                            name: item.name,
                            value: item.id,
                          }))}
                          error={errors && errors.policy_type}
                        />
                      }
                      control={control}
                      name="template_ids.15"
                    />
                  </Col>}
                </Row>
              </>
            )}
          {
            !!(filteredTemplate[25]?.length ||
              filteredTemplate[26]?.length) && (
              <>
                {(data?.policy_sub_type_id === 3) &&
                  <>
                    <Marker />
                    <Typography>{"\u00A0"} GTL Claim Sheet Mapping</Typography>
                    <br />
                    <Row className="d-flex justify-content-center">
                      <Col xl={4} lg={6} md={6} sm={12}>
                        <Controller
                          as={
                            <Select
                              label="GTL Claim Import"
                              placeholder="GTL Claim Import"
                              required={false}
                              options={filteredTemplate[25].map((item) => ({
                                id: item.id,
                                name: item.name,
                                value: item.id,
                              }))}
                              error={errors && errors.policy_type}
                            />
                          }
                          control={control}
                          name="template_ids.25"
                        />
                      </Col>
                      <Col xl={4} lg={6} md={6} sm={12}>
                        <Controller
                          as={
                            <Select
                              label="GTL Claim Export"
                              placeholder="GTL Claim Export"
                              required={false}
                              options={filteredTemplate[26].map((item) => ({
                                id: item.id,
                                name: item.name,
                                value: item.id,
                              }))}
                              error={errors && errors.policy_type}
                            />
                          }
                          control={control}
                          name="template_ids.26"
                        />
                      </Col>
                    </Row>
                  </>
                }
              </>)}

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
