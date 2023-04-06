import React from "react";
import { TabContainer, Spacer } from "../style";
import { Row, Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { SelectComponent } from "components";
import ControlledTabs from "../tabs";
const EmdorsmentRequestForm = ({ userType, broker, getAdminEmployer, control, EmployerResponse,
    PolicyTypeResponse, PolicyNumberResponse, policyno,
    employerId, myModule, reset }) => {
    return (
        <TabContainer>
            <Row>
                {(userType === "admin") &&
                    <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Broker"
                                    placeholder="Select Broker"
                                    required
                                    options={broker.map(item => (
                                        {
                                            id: item.id,
                                            label: item.name,
                                            value: item.id
                                        }
                                    )) || []}
                                />
                            }
                            onChange={getAdminEmployer}
                            control={control}
                            name="broker"
                        />
                    </Col>
                }
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Employer"
                                placeholder="Select Employer"
                                required
                                options={EmployerResponse?.map(item => (
                                    {
                                        id: item.id,
                                        label: item.name,
                                        value: item.id
                                    }
                                )) || []}
                            />
                        }
                        // onChange={getEmployerId}
                        control={control}
                        name="employer"
                    />
                </Col>
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Policy Type"
                                placeholder="Select Policy Type"
                                required
                                options={PolicyTypeResponse?.data?.data?.map(item => (
                                    {
                                        id: item.id,
                                        label: item.name,
                                        value: item.id
                                    }
                                )) || []}
                            />
                        }
                        // onChange={getPolicyId}
                        control={control}
                        name="policytype"
                    />
                </Col>
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Policy Number"
                                placeholder="Select Policy Number"
                                required
                                options={PolicyNumberResponse?.data?.data?.map(item => (
                                    {
                                        id: item.id,
                                        label: item.number,
                                        value: item.id
                                    }
                                )) || []}
                            />
                        }
                        // onChange={getPolicyNumberId}
                        control={control}
                        name="policyno"
                    />
                </Col>
            </Row>
            {/* {((sumInsuredResp?.data?.suminsured) ||
          sumInsuredResp?.data?.opd_suminsured) && (
            <Row xs={1} sm={1} md={1} lg={1} xl={1}>
              <div
                style={{
                  border: "1px solid #6334e3",
                  justifyContent: "center",
                  alignItems: " center",
                  display: "flex",
                  borderRadius: "12px",
                  width: "min-content",
                  flexDirection: "column",
                  textAlign: 'center'
                }}
              >
                {sumInsuredResp?.data?.suminsured && (
                  <p
                    style={
                      sumInsuredResp?.data?.opd_suminsured
                        ? { padding: "10px 10px 0px 10px" }
                        : { padding: "10px" }
                    }
                    className="m-0"
                  >
                    The above selected policy type is flat sum insured (SI),
                    please refer to the following SI values while submitting the Insured data via excel sheet as{" "}
                    {sumInsuredEndorseSplit(sumInsuredResp?.data?.suminsured)}
                  </p>
                )}
                <br />
                {sumInsuredResp?.data?.opd_suminsured && (
                  <p
                    style={
                      sumInsuredResp?.data?.suminsured
                        ? { padding: "0px 10px 10px 10px" }
                        : { padding: "10px" }
                    }
                    className="m-0"
                  >
                    The above selected policy type is flat sum insured (SI-OPD),
                    please refer to the following SI values while submitting the Insured data via excel sheet as
                    {sumInsuredEndorseSplit(sumInsuredResp?.data?.opd_suminsured)}
                  </p>
                )}
              </div>
            </Row>
          )} */}
            <Spacer>
                <ControlledTabs
                    policyno={policyno}
                    employerId={employerId}
                    myModule={myModule}
                    reset={reset}
                />
            </Spacer>
        </TabContainer>
    );
}

export default EmdorsmentRequestForm;
