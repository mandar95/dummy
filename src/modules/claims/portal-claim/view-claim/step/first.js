import React from "react";
import { Input } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useEffect } from "react";
import { claim } from "../../../claims.slice";
import { DateFormate } from "utils";
// import { SelectComponent } from "../../../../../components";

export const UserDetail = () => {
  const { userType } = useSelector((state) => state.login);
  const { claimDataBox: props } = useSelector(claim);
  const { control, setValue } = useForm({});
  useEffect(() => {
    if (!_.isEmpty(props)) {
      setValue([{ "broker_name": props?.broker_name },
      { "employer_name": props?.employer_name },
      { "policy_sub_type_name": props?.policy_sub_type_name },
      { "policy_name": props?.policy_name },
      { "patient_name": props?.patient_name },
      { "relation": props?.relation },
      { "mobile_no": props?.mobile_no || '' },
      { "email": props?.email },
      { "admit_date": DateFormate(props?.admit_date) },
      { "discharge_date": DateFormate(props?.discharge_date) },
      // ClaimSubType
      /* {
        'claim_hospitalization_type': props?.claim_hospitalization_type?.split(',').map(label => ({ label, id: label, value: label })) ||
          { id: 'Hospitalization', label: 'Hospitalization', value: 'Hospitalization' }
      } */])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const isOpdPolicy = props?.discharge_date;

  return (
    <form>
      <Row className="d-flex flex-wrap" style={{ margin: "0px" }}>
        {userType === "admin" && (
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  label="Broker"
                  placeholder="Broker"
                />
              }
              name="broker_name"
              // defaultValue={props?.broker_name}
              control={control}
            />
          </Col>
        )}
        {(userType === "broker" || userType === "admin") && (
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  label="Employer"
                  placeholder="Employer"
                />
              }
              name="employer_name"
              // defaultValue={props?.employer_name}
              control={control}
            />
          </Col>
        )}
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Policy Type"
                placeholder="Policy Type"
              />
            }
            // defaultValue={props?.policy_sub_type_name}
            name="policy_sub_type_name"
            control={control}
          />
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Policy Name"
                placeholder="Policy Name"
              />
            }
            // defaultValue={props?.policy_name}
            name="policy_name"
            control={control}
          />
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Patient Name"
                placeholder="Patient"
                id="patient_name"
              />
            }
            // defaultValue={props?.patient_name}
            name="patient_name"
            control={control}
          />
          {/* <input type="hidden" ref={register} name="tpa_member_id" />
            <input type="hidden" ref={register} name={"tpa_member_name"} />
            <input type="hidden" ref={register} name={"tpa_emp_id"} /> */}
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Relation With Employee"
                placeholder="Relation With Employee"
              />
            }
            // defaultValue={props?.relation}
            name="relation"
            control={control}
          />
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Mobile Number"
                type="tel"
                placeholder="Mobile Number"
              />
            }
            // defaultValue={props?.mobile_no}
            name="mobile_no"
            control={control}
          />
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label="Email Id"
                type="email"
                placeholder="Email Id"
              />
            }
            // defaultValue={props?.email}
            name="email"
            control={control}
          />
        </Col>
        <Col md={6} lg={6} xl={4} sm={12}>
          <Controller
            as={
              <Input
                style={{
                  background: "white",
                }}
                disabled={true}
                label={isOpdPolicy ? "Hospitalization Date" : 'OPD Date'}
                placeholder={"Hospitalization Date"}
                name={"admit_date"}
              //   label={
              //     props.type !== "opd" ? "Hospitalization Date" : "OPD Date"
              //   }
              />
            }
            // defaultValue={props?.admit_date}
            name="admit_date"
            control={control}
          />
        </Col>
        {!!isOpdPolicy && (
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={
                <Input
                  style={{
                    background: "white",
                  }}
                  disabled={true}
                  placeholder={"Discharge Date"}
                  name={"discharge_date"}
                  label={"Discharge Date"}
                />
              }
              // defaultValue={props?.discharge_date}
              name="discharge_date"
              control={control}
            />
          </Col>
        )}
        {/* ClaimSubType */}
        {/* {!!isOpdPolicy &&
          <Col md={6} lg={6} xl={4} sm={12} className='mb-3'>
            <Controller
              as={
                <SelectComponent
                  labelProps={{ style: { background: 'linear-gradient( white, #f2f2f2)' } }}
                  label="Claim Sub Type"
                  placeholder="Select Claim Sub Type"
                  disabled
                  required
                  options={[
                    { id: 'Pre-hospitalization', label: 'Pre-hospitalization', value: 'Pre-hospitalization' },
                    { id: 'Post-hospitalization', label: 'Post-hospitalization', value: 'Post-hospitalization' },
                    { id: 'Hospitalization', label: 'Hospitalization', value: 'Hospitalization' },
                  ]}
                  isRequired={true}
                  multi={true}
                  closeMenuOnSelect={false}
                  closeMenuOnScroll={false}
                  hideSelectedOptions={true}
                  isClearable={false}
                />
              }
              name="claim_hospitalization_type"
              control={control}
            />
          </Col>} */}
      </Row>
    </form>
  );
};
