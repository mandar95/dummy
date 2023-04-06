import React from "react";
import { Row, Col, Button as Btn } from "react-bootstrap";
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { Select } from "components";
import { BenefitList } from "modules/policies/steps/additional-details/styles";
import { Chip } from "../../../../../src/components/index";
const CreatePlanForm = ({ Controller, control, Rater, RaterType, rater_type_id, SIType,
  is_policy_level, SI, suminsuredDataTwo, AddSIValue, SIValue, RemoveSIValue }) => {
  return (
    <Row className="d-flex justify-content-center flex-wrap">
      <>
        <div className="col-12 col-md-4">
          <Controller
            as={
              <Switch
                InputBorderStyle={{
                  border: "none",
                }}
                showSpan={true}
                label={"Policy Level ?"}
                required={false}
              />
            }
            defaultValue={0}
            name={`is_policy_level`}
            control={control}
          />
        </div>
        {Rater.length > 0 && !Boolean(is_policy_level) &&
          <Col md={6} lg={5} xl={4} sm={12}>
            <Controller
              as={
                <Select
                  label={`Rater Type`}
                  placeholder="Select Rater Type"
                  options={Rater}
                  required={true}
                />
              }
              name={`rater_type_id`}
              control={control}
              rules={{ required: true }}
            />
          </Col>
        }
        {((RaterType && Rater.length === 0) || (Rater.length > 0 && rater_type_id)) && !Boolean(is_policy_level) && <>
          {(SIType === "flat" || SIType === "base" || SIType === "family_contruct") && (
            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <Select
                    label={`Sum Insured`}
                    placeholder="Select Sum Insured"
                    options={SI}
                    required={true}
                  />
                }
                name={`relation_id`}
                control={control}
                rules={{ required: true }}
              />
            </Col>
          )}
          {(SIType === "salary" && !Boolean(is_policy_level)) && (
            <Col md={6} lg={5} xl={4} sm={12}>
              <Controller
                as={
                  <Select
                    label="No of time salary"
                    placeholder="Select No of time salary"
                    // options={SI}
                    options={SI}
                    required={true}
                  // error={memberError && (['undefined', 'null', ''].includes(construct[index]) || !construct[index])}
                  />
                }
                name={`relation_id`}
                control={control}
                rules={{ required: true }}
              />
            </Col>
          )}
          {SIType !== "salary" && SIType !== "flat" && SIType !== "base" && SIType !== "family_contruct" && (
            <>
              {(SIType !== "member" && SIType !== null) && (
                <>
                  <Col md={6} lg={5} xl={4} sm={12}>
                    <Controller
                      as={
                        <Select
                          label={`Select ${SIType?.length > 0 ? SIType.charAt(0).toUpperCase() + SIType.slice(1) : ""}`}
                          placeholder={`Select ${SIType?.length > 0 ? SIType.charAt(0).toUpperCase() + SIType.slice(1) : ""}`}
                          // options={SI}
                          options={SI}
                          // error={memberError && (['undefined', 'null', ''].includes(construct[index]) || !construct[index])}
                          isRequired={true}
                        />
                      }
                      name={`si_type`}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Col>

                  {<Col md={6} lg={5} xl={4} sm={12}>
                    <Controller
                      as={
                        <Select
                          label="Sum Insured"
                          placeholder="Select Sum Insured"
                          options={suminsuredDataTwo}
                          required={true}
                        />
                      }
                      name={`relation_id`}
                      control={control}
                      rules={{ required: true }}
                    />
                  </Col>}
                </>
              )}
              {(SIType === "member" && SIType !== null) && (
                <Col md={6} lg={5} xl={4} sm={12}>
                  <Controller
                    as={
                      <Select
                        label={`Sum Insured`}
                        placeholder="Select Sum Insured"
                        options={SI}
                        required={true}
                      />
                    }
                    name={`relation_id`}
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
              )}
            </>
          )}
          {SIType !== null &&
            <Col
              md={6}
              lg={5}
              xl={4}
              sm={12}
              className="d-flex justify-content-center align-items-center mb-1"
            >
              <Btn type="button" onClick={AddSIValue}>
                Add +
              </Btn>
            </Col>
          }
          {<Col md={12} lg={12} xl={12} sm={12}>
            {SIValue.length ? (
              <BenefitList>
                {SIValue.map((data, index) => (
                  <Chip
                    key={index + "SIValue"}
                    id={data.id}
                    name={data.name}
                    onDelete={RemoveSIValue}
                  />
                ))}
              </BenefitList>
            ) : null}
          </Col>}
        </>}
      </>
    </Row>
  );
}

export default CreatePlanForm;
