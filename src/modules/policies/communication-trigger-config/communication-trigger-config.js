import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Table, Button as Btn } from "react-bootstrap";
import { CustomControl } from '../../user-management/AssignRole/option/style';
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { Card, SelectComponent, Error, Button, Loader, Head, Input } from "components";

// import _ from "lodash";
import swal from "sweetalert";

import {
    fetchBrokers,
    fetchEmployers,
    fetchPolicies,
    setPageData,
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
    selectPolicySubType,
    getPolicySubTypeData,
} from "modules/EndorsementRequest/EndorsementRequest.slice";
// import { ViewPlan2 } from "./viewPlan"
// import { CreatePlan } from "./create-plan";
// import UpdatePlan from "./update-plan";
import {
    getComminicationTriggers, setComminicationTriggers, clear, deleteComminicationTriggers, getMasterCommunication, createComminicationTriggers,
    getComminicationTriggersEmployer, createComminicationTriggersEmployer, deleteComminicationTriggersEmployer
} from "modules/policies/policy-config.slice";
import ModalComponent from "../../UnifiedCommunicationSystem/ViewModal";
import { Prefill } from "../../../custom-hooks/prefill";
import { ModuleControl } from "../../../config/module-control";



const CommunicationTrigger = ({ isPolicy }) => {
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const { userType: userTypeName, currentUser } = useSelector((state) => state.login);
    const { brokers, employers, policies,
        firstPage,
        lastPage, } = useSelector((state) => state.networkhospitalbroker);
    const { success, error, loading, ComminicationTriggersData, MasterCommunicationsData } = useSelector(state => state.policyConfig);
    let PolicyTypeResponse = useSelector(selectPolicySubType);

    const { control, errors, handleSubmit, watch, register, setValue } = useForm({});

    const policyId = watch("policy_id")?.value;
    const employerId = watch("employer_id")?.value || null;
    const brokerId = watch("broker_id")?.value || null;
    const policyTypeID = watch("policy_sub_type_id")?.value;
    const triggerMethod = watch('trigger_method');

    const [trigger/* , setTrigger */] = useState(0)

    const [viewModal, setViewModal] = useState(false);

    useEffect(() => {
        if (ComminicationTriggersData.length && MasterCommunicationsData.length) {
            if (policyId || (!isPolicy && employerId)) {
                let isTriggerYes = ComminicationTriggersData?.every((item) => item.to_trigger === 1)
                let isTriggerNo = ComminicationTriggersData?.every((item) => item.to_trigger === 0);
                let cus = ComminicationTriggersData?.some((item) => item.to_trigger === 0)
                if (isTriggerYes) {
                    // setTrigger(1)
                    setValue("trigger_method", '1')
                }
                if (isTriggerNo) {
                    // setTrigger(2)
                    setValue("trigger_method", '2')
                }
                if (cus && !isTriggerNo) {
                    //  setTrigger(3)
                    setValue("trigger_method", '3')
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ComminicationTriggersData, MasterCommunicationsData])

    useEffect(() => {
        if ((policyId && ComminicationTriggersData.length === 0) || (!isPolicy && employerId && ComminicationTriggersData.length === 0)) {
            setValue("trigger_method", '0')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyId, ComminicationTriggersData])

    useEffect(() => {
        dispatch(getMasterCommunication(isPolicy))
        // setValue("trigger_method", '0')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPolicy])

    useEffect(() => {
        if (!loading && error) {
            swal("Warning", error, "warning");
        };
        if (!loading && success) {
            swal('Success', success, "success").then(() => {
                if (isPolicy) {
                    dispatch(getComminicationTriggers(
                        policyId
                    ))
                }
                else {
                    dispatch(getComminicationTriggersEmployer(employerId))
                }
            })
        };

        return () => {
            dispatch(clear())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error, loading]);

    useEffect(() => {
        //for policy
        if (policyId) {
            dispatch(getComminicationTriggers(policyId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyId])

    //get broker
    useEffect(() => {
        if (userTypeName === "Admin" || userTypeName === "Super Admin") {
            dispatch(fetchBrokers(userTypeName));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userTypeName]);

    /*-x-broker ID -x-*/

    /*---Employer ID ---*/
    useEffect(() => {
        return () => {
            dispatch(setPageData({
                firstPage: 1,
                lastPage: 1
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    //get employer
    useEffect(() => {
        if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
            if (lastPage >= firstPage) {
                var _TimeOut = setTimeout(_callback, 250);
            }
            function _callback() {
                dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
            }
            return () => {
                clearTimeout(_TimeOut)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstPage, brokerId, currentUser]);

    //get policy type id
    useEffect(() => {
        if ((currentUser?.employer_id || employerId) && !!isPolicy) {
            dispatch(
                getPolicySubTypeData({ employer_id: currentUser?.employer_id || employerId })
            );
            return () => {
                dispatch(clear('policy-type'))

                dispatch(setComminicationTriggers([]))

                setValue([
                    { policy_sub_type_id: undefined },
                    { policy_id: undefined },
                ])
            }
        }
        //for generic
        if (employerId && !isPolicy) {
            dispatch(getComminicationTriggersEmployer(employerId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, employerId]);

    //get policy id
    useEffect(() => {
        if (policyTypeID && (currentUser?.employer_id || employerId)) {
            dispatch(
                fetchPolicies({
                    user_type_name: userTypeName,
                    employer_id: currentUser?.employer_id || employerId,
                    policy_sub_type_id: policyTypeID,
                    ...(currentUser.broker_id && { broker_id: currentUser.broker_id })
                })
            );
            return () => {
                dispatch(setComminicationTriggers([]))
                setValue([
                    { policy_id: undefined },
                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyTypeID]);

    useEffect(() => {
        if (ComminicationTriggersData.length) {
            ComminicationTriggersData.forEach((item, index) => {
                setValue(`triggers[${index}].to_trigger`, item.to_trigger)
                ModuleControl.DataToSend && setValue(`triggers[${index}].to_send_data`, item.to_send_data)
            })
        }
        // else {
        //     if (policyId || (!isPolicy && employerId)) {
        //         swal("", "No Communication Trigger Mapping Found", "warning");
        //     }

        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ComminicationTriggersData])

    // Prefill 
    Prefill(employers, setValue, 'employer_id')
    Prefill(PolicyTypeResponse?.data?.data, setValue, 'policy_sub_type_id')
    Prefill(policies, setValue, 'policy_id', 'policy_no')


    const onSubmit = (data) => {
        let triggersData = [];
        if (Number(triggerMethod) === 1 || Number(triggerMethod) === 2) {
            MasterCommunicationsData.forEach((item) => {
                triggersData.push({
                    trigger_id: item.id,
                    to_trigger: Number(triggerMethod) === 1 ? 1 : 0,
                    ...ModuleControl.DataToSend && { to_send_data: data.triggers.find(({ trigger_id }) => +trigger_id === +item.id).to_send_data ? 1 : 0 }
                })
            })
        }
        if (isPolicy) {
            dispatch(createComminicationTriggers({
                policy_id: policyId,
                triggers: (data.triggers && Number(triggerMethod) === 3) ? data.triggers : triggersData
            }))
        }
        else {
            dispatch(createComminicationTriggersEmployer({
                employer_id: employerId,
                triggers: (data.triggers && Number(triggerMethod) === 3) ? data.triggers : triggersData
            }))
        }

    }

    const deleteTrigger = (id, data) => {
        if (isPolicy) {
            dispatch(deleteComminicationTriggers(id, policyId))
        }
        else {
            dispatch(deleteComminicationTriggersEmployer(id))
        }
    };
    return (
        <Card title={<div className="d-flex justify-content-between">
            <span>{`Communication Trigger Config ${isPolicy ? `(Policy Wise)` : `(Generic)`}`}</span>
        </div>}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                        options={
                                            brokers?.map((item) => ({
                                                id: item?.id,
                                                label: item?.name,
                                                value: item?.id,
                                            })) || []
                                        }
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
                                />
                            </Col>
                        )}
                    {!!isPolicy && <>
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
                                        isRequired={true}
                                        required={false}
                                        options={
                                            policies?.map((item) => ({
                                                id: item?.id,
                                                label: item?.policy_no,
                                                value: item?.id,
                                            })) || []
                                        }
                                    />
                                }
                                name="policy_id"
                                control={control}
                                error={errors && errors.policy_id}
                            />
                            {!!errors?.policy_id && (
                                <Error>{errors?.policy_id?.message}</Error>
                            )}
                        </Col>
                    </>}
                </Row>

                <Row className="d-flex flex-wrap">
                    <Col md={6} lg={6} xl={6} sm={12}>
                        <Head className='text-center'>Do you want to trigger all communication ?</Head>
                        <div className="d-flex justify-content-around flex-wrap mt-2 text-nowrap" style={{ margin: '0 47px 50px -55px' }}>
                            <CustomControl className="d-flex mt-4 mr-0">
                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                                <input ref={register} name={'trigger_method'} type={'radio'} value={1} defaultChecked={trigger === 1} />
                                <span></span>
                            </CustomControl>
                            <CustomControl className="d-flex mt-4 ml-0">
                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                                <input ref={register} name={'trigger_method'} type={'radio'} value={2} defaultChecked={trigger === 2} />
                                <span></span>
                            </CustomControl>
                            <CustomControl className="d-flex mt-4 ml-0">
                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                                <input ref={register} name={'trigger_method'} type={'radio'} value={3} defaultChecked={trigger === 3} />
                                <span></span>
                            </CustomControl>
                        </div>
                    </Col>
                </Row>

                {/* {tab === "create" && */}
                {((policyId && !ComminicationTriggersData.length && !!Number(triggerMethod)) || (!ComminicationTriggersData.length && !!Number(triggerMethod) && !isPolicy && employerId)) &&
                    <>
                        <Row style={{
                            padding: '10px 21px',
                            fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
                            fontWeight: '500',
                            borderTop: '1px dashed #929292',
                        }}>Create Trigger Communication Mapping</Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr style={{
                                    background: '#3e4dcc',
                                    color: '#FFFFFF',
                                    textAlign: 'center'
                                }}>
                                    <th>ID</th>
                                    <th>Trigger Name</th>
                                    <th>To Trigger</th>
                                    {isPolicy === 1 && ModuleControl.DataToSend && <th>Data to send</th>}
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    MasterCommunicationsData.map((item, index) => {
                                        const to_trigger = watch(`triggers[${index}].to_trigger`);

                                        return (
                                            <tr style={{
                                                textAlign: 'center',
                                                fontWeight: '500'
                                            }}
                                                key={'MasterCommunicationsData-' + index}
                                            >
                                                <td>
                                                    <Controller
                                                        as={<Input showSpan={false} style={{ display: 'none' }} label="" placeholder="" isRequired={false} disabled={true}
                                                            labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                                                        name={`triggers[${index}].trigger_id`}
                                                        control={control}
                                                        defaultValue={(item.id)}

                                                    />
                                                    {index + 1}</td>
                                                <td> {item.trigger_name}</td>
                                                <td> <Controller
                                                    as={<Switch
                                                        InputBorderStyle={{
                                                            margin: '0',
                                                            maxHeight: '0',
                                                            border: 'none'
                                                        }}
                                                        CustomControlStyle={{
                                                            minHeight: '33px'
                                                        }}
                                                        showSpan={false} label={''} required={false} />}
                                                    name={`triggers[${index}].to_trigger`}
                                                    onChange={([e]) => {
                                                        e && isPolicy === 1 && ModuleControl.DataToSend &&
                                                            item.is_data_trigger_applicable && setValue(`triggers[${index}].to_send_data`, 1);
                                                        return e
                                                    }}
                                                    control={control}
                                                    defaultValue={1}
                                                />
                                                </td>
                                                {isPolicy === 1 && ModuleControl.DataToSend && <td>
                                                    {item.is_data_trigger_applicable ? <Controller
                                                        as={<Switch
                                                            InputBorderStyle={{
                                                                margin: '0',
                                                                maxHeight: '0',
                                                                border: 'none'
                                                            }}
                                                            // CustomControlStyle={{
                                                            //     minHeight: '33px',
                                                            //     pointerEvents: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "none" : "unset",
                                                            //     opacity: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "0.4" : "1",
                                                            // }}
                                                            style={{ margin: '0px' }} showSpan={false} label={''} required={false}
                                                            disabled={to_trigger}
                                                        //disabled={triggerMethod === 1 || triggerMethod === 2 ? true : false}
                                                        />}
                                                        name={`triggers[${index}].to_send_data`}
                                                        control={control}
                                                        defaultValue={item?.to_send_data || 0}
                                                    /> : ""}

                                                </td>}
                                                <td>
                                                    {item.id !== 12 && <Btn
                                                        size="sm"
                                                        type="button"
                                                        variant='light'
                                                        className="shadow rounded-lg align-items-center"
                                                        onClick={() => {
                                                            setViewModal(item.id);
                                                        }}
                                                    >
                                                        View &nbsp;
                                                        <i className={"ti-angle-up text-dark"} />
                                                    </Btn>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </>
                }
                {
                    ((!!ComminicationTriggersData.length && policyId) || (!!ComminicationTriggersData.length && !isPolicy && employerId)) &&
                    <>
                        <Row style={{
                            padding: '10px 21px',
                            fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
                            fontWeight: '500',
                            borderTop: '1px dashed #929292',
                        }}>Update Trigger Communication Mapping</Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr style={{
                                    background: '#3e4dcc',
                                    color: '#FFFFFF',
                                    textAlign: 'center'
                                }}>
                                    <th>ID</th>
                                    <th>Trigger Name</th>
                                    <th>To Trigger</th>
                                    {isPolicy === 1 && ModuleControl.DataToSend && <th>Data to send</th>}
                                    <th>View</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ComminicationTriggersData.map((item, index) => {
                                        const to_trigger = watch(`triggers[${index}].to_trigger`);

                                        return (
                                            <tr style={{
                                                textAlign: 'center',
                                                fontWeight: '500'
                                            }}
                                                key={"ComminicationTriggersData" + index}
                                            >
                                                <td>
                                                    <Controller
                                                        as={<Input showSpan={false} style={{ display: 'none' }} label="" placeholder="" isRequired={false} disabled={true}
                                                            labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                                                        name={`triggers[${index}].trigger_id`}
                                                        control={control}
                                                        // defaultValue={(item.master_system_trigger_id)}
                                                        defaultValue={(item.id)}

                                                    />
                                                    {index + 1}</td>
                                                {/* <td> {MasterCommunicationsData.filter((jitem) => jitem.id === item.master_system_trigger_id)[0]?.trigger_name}</td> */}
                                                <td>{item.master_event_name}</td>
                                                <td> <Controller
                                                    as={<Switch
                                                        InputBorderStyle={{
                                                            margin: '0',
                                                            maxHeight: '0',
                                                            border: 'none'
                                                        }}
                                                        CustomControlStyle={{
                                                            minHeight: '33px',
                                                            pointerEvents: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "none" : "unset",
                                                            opacity: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "0.4" : "1",
                                                        }}
                                                        style={{ margin: '0px' }} showSpan={false} label={''} required={false}
                                                        disabled={triggerMethod === 1 || triggerMethod === 2 ? true : false}
                                                    />}
                                                    onChange={([e]) => {
                                                        e && isPolicy === 1 && ModuleControl.DataToSend &&
                                                            item.is_data_trigger_applicable && setValue(`triggers[${index}].to_send_data`, 1);
                                                        return e
                                                    }}
                                                    name={`triggers[${index}].to_trigger`}
                                                    control={control}
                                                    defaultValue={item.to_trigger}
                                                />
                                                </td>
                                                {isPolicy === 1 && ModuleControl.DataToSend && <td>
                                                    {item.is_data_trigger_applicable ? <Controller
                                                        as={<Switch
                                                            InputBorderStyle={{
                                                                margin: '0',
                                                                maxHeight: '0',
                                                                border: 'none'
                                                            }}
                                                            CustomControlStyle={{
                                                                minHeight: '33px',
                                                                // pointerEvents: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "none" : "unset",
                                                                // opacity: (Number(triggerMethod) === 1 || Number(triggerMethod) === 2 || triggerMethod === "") ? "0.4" : "1",
                                                            }}
                                                            style={{ margin: '0px' }} showSpan={false} label={''} required={false}
                                                        //disabled={triggerMethod === 1 || triggerMethod === 2 ? true : false}
                                                        />}
                                                        disabled={to_trigger}
                                                        // onChange={([e]) => {
                                                        //     e && isPolicy === 1 && ModuleControl.DataToSend &&
                                                        //         item.is_data_trigger_applicable && setValue(`triggers[${index}].to_send_data`, 1);
                                                        //     return e
                                                        // }}
                                                        name={`triggers[${index}].to_send_data`}
                                                        control={control}
                                                        defaultValue={item.to_send_data}
                                                    /> : ""}

                                                </td>}
                                                <td>
                                                    {item.master_system_trigger_id !== 12 && <Btn
                                                        size="sm"
                                                        type="button"
                                                        variant='light'
                                                        className="shadow rounded-lg align-items-center"
                                                        onClick={() => {
                                                            setViewModal(item.master_system_trigger_id);
                                                        }}
                                                    >
                                                        View &nbsp;
                                                        <i className={"ti-angle-up text-dark"} />
                                                    </Btn>}
                                                </td>
                                                <td>
                                                    <button type="button" className="strong btn btn-outline-danger"
                                                        onClick={() => deleteTrigger(isPolicy ? item.master_system_trigger_id : item?.id)}
                                                    ><i className="ti-trash"></i></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </>
                }
                {/* {(policyId && Number(triggerMethod) === 3) && */}
                {((policyId && !!Number(triggerMethod)) || (!isPolicy && employerId && !!Number(triggerMethod))) &&
                    <div style={{ float: "right" }} className="p-2">
                        <Button type="button" onClick={handleSubmit(onSubmit)}>
                            <span style={{ fontWeight: "600" }}>Save</span>
                        </Button>

                    </div>
                }
            </form>
            {!!viewModal && (
                <ModalComponent
                    show={!!viewModal}
                    onHide={() => setViewModal(false)}
                    HtmlArray={{
                        master_system_trigger_id: viewModal,
                        employer_id: employerId,
                        broker_id: currentUser?.broker_id || brokerId,
                        ...(isPolicy && { policy_id: policyId })
                    }}
                    api={'/admin/get/trigger-mail/sample'}
                />
            )}
            {loading && <Loader />}
        </Card >
    )

}
export default CommunicationTrigger;




