import React from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import { Button, SelectComponent } from "components";
import { useForm, Controller } from "react-hook-form";

const FilterModal1 = ({
  onHide,
  policies,
  policyId,
  reset,
  show,
  year,
  getFilterValue,
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      year: {
        id: year,
        label: year,
        value: year,
      },
      ...(policyId && {
        policy_id: {
          id: policyId.id,
          label: policyId.label,
          value: policyId.value,
        },
      }),
    },
  });

  const allYears = [2020, 2021, 2022, 2023];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Form onSubmit={handleSubmit(getFilterValue)}>
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
                      label="Year List"
                      placeholder="Select Year"
                      options={
                        allYears.map((item) => ({
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
                  name="year"
                  control={control}
                />
              </Col>
              <Col xl={6} lg={6} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Policies"
                      placeholder="Select Policy"
                      options={
                        policies.map((item) => ({
                          id: item.policy_id,
                          label: item.policy_name,
                          value: item.policy_id,
                        })) || []
                      }
                    />
                  }
                  onChange={([selected]) => {
                    return selected;
                  }}
                  name="policy_id"
                  control={control}
                />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button onClick={reset} className="mx-2 bg-secondary">Reset</Button>
            <Button type="submit">Search</Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FilterModal1;
