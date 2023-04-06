import React from "react";
import { SelectComponent, Error, TabWrapper, Tab } from "components";
import { Row, Col, Button } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { ViewPlan2 } from "../viewPlan";
import { CreatePlan } from "../create-plan";
import UpdatePlan from "../update-plan";
const FeatureForm = ({
    userTypeName, control, errors,setValue,
    brokers, employers, PolicyTypeResponse, policies, policyId, setTab, tab, setPlanModal, setModalShow,
    featureData, SIType, onRemovePlan, setUpdatePlanModal, planModal, dispatch, UpdatePlanModal, myModule
}) => {
    return (
        <form>
            <Row>
                {(userTypeName === "Admin" || userTypeName === "Super Admin") && (
                    <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Broker"
                                    placeholder="Select Broker"
                                    required={false}
                                    isRequired={true}
                                    options={brokers?.map((item) => ({
                                        id: item?.id,
                                        label: item?.name,
                                        value: item?.id,
                                    })) || []}
                                />
                            }
                            name="broker_id"
                            control={control}
                            error={errors && errors.broker_id}
                        />
                    </Col>
                )}
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
                                        options={employers?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        })) || []}
                                    />
                                }
                                onChange={([selected]) => {
                                    setValue('policy_sub_type_id', undefined);
                                    setValue('policy_id', undefined);
                                    return selected;
                                  }}
                                name="employer_id"
                                control={control}
                            />
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
                                options={PolicyTypeResponse?.data?.data?.map(item => (
                                    {
                                        id: item.id,
                                        label: item.name,
                                        value: item.id
                                    }
                                )) || []}
                            />
                        }
                        onChange={([selected]) => {
                            setValue('policy_id', undefined);
                            return selected;
                          }}
                        name="policy_sub_type_id"
                        control={control}
                        
                        error={errors && errors.policy_sub_type_id}
                    />
                    {!!errors?.policy_sub_type_id && (
                        <Error>{errors?.policy_sub_type_id?.message}</Error>
                    )}
                </Col>
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Policy Name"
                                placeholder="Select Policy Name"
                                required={false}
                                isRequired={true}
                                options={policies?.map((item) => ({
                                    id: item?.id,
                                    label: item?.number,
                                    value: item?.id,
                                })) || []}
                            />
                        }
                        name="policy_id"
                        control={control}
                        error={errors && errors.policy_id}
                    />
                    {!!errors?.policy_id && <Error>{errors?.policy_id?.message}</Error>}
                </Col>
            </Row>
            {policyId && (
                <TabWrapper margin={"10px 0px 15px 0px"} width="max-content ">
                    <Tab
                        isActive={Boolean(tab === "view")}
                        onClick={() => setTab("view")}
                        className="d-block"
                    >
                        View Feature
                    </Tab>
                    {!!myModule?.canwrite && <Tab
                        isActive={Boolean(tab === "create")}
                        onClick={() => setTab("create")}
                        className="d-block"
                    >
                        Create Feature
                    </Tab>}
                </TabWrapper>
            )}
            {tab === "create" && (
                policyId && (
                    <>
                        <div className="d-flex justify-content-start">
                            <Button
                                className="mb-3 ml-3"
                                onClick={() => setPlanModal(true)}
                            >
                                Add Feature +
                            </Button>

                            <Button
                                className="mb-3 ml-2 ml-3"
                                onClick={() => setModalShow(true)}
                            >
                                Upload
                            </Button>
                        </div>
                        <Row>
                            {featureData?.map((data, index) => (
                                <ViewPlan2
                                    key={"ViewPlan2" + index}
                                    SIType={SIType}
                                    data={data}
                                    onRemovePlan={onRemovePlan}
                                    setModal={setUpdatePlanModal}
                                />
                            ))}
                        </Row>
                    </>
                )
            )}
            {!!planModal && (
                <CreatePlan
                    Data={planModal}
                    type="Plan"
                    show={!!planModal}
                    onHide={() => setPlanModal(false)}
                    policyId={policyId}
                    dispatch={dispatch}
                />
            )}
            {!!UpdatePlanModal && (
                <UpdatePlan
                    Data={UpdatePlanModal}
                    type="Plan"
                    // show={!!planModal}
                    // onHide={() => setPlanModal(false)}
                    policyId={policyId}
                    dispatch={dispatch}
                    show={!!UpdatePlanModal}
                    // id={UpdatePlanModal.id}
                    onHide={() => setUpdatePlanModal(false)}
                // featureData={featureData}
                />
            )}
        </form>
    );
}

export default FeatureForm;
