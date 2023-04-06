/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { IconlessCard, SelectComponent, Error, Button, Head } from "components";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
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
import { Row, Col } from "react-bootstrap";
import _ from "lodash";
import { selectiveEmployeeDataForDelete, removeEmployee, getSelectedEmployeeMembers } from "../user.slice";
import * as yup from "yup";
import swal from "sweetalert";
import { useParams } from "react-router";
export let schema = yup.object().shape({
    policy_id: yup.string().required().label("Policy"),
    // type: yup.string().required().label("Type"),
});
const EmployeeDelete = () => {
    const { userType } = useParams()

    const [employeeCode, setEmployeeCode] = useState([]);
    const [memberCode, setMemberCode] = useState([]);
    const dispatch = useDispatch();
    const { userType: userTypeName, currentUser } = useSelector(
        (state) => state.login
    );
    const { brokers, employers, policies,
        firstPage,
        lastPage, } = useSelector(
            (state) => state.networkhospitalbroker
        );
    let PolicyTypeResponse = useSelector(selectPolicySubType);
    const { control, errors, handleSubmit, watch, reset, setValue, register } = useForm({
        validationSchema: schema,
        mode: "onBlur",
    });
    const policyId = (watch("policy_id") || {})?.id;
    const type = watch("type");
    const brokerId = (watch("broker_id") || {})?.id;
    const policyTypeID = (watch("policy_sub_type_id") || {})?.id;
    const employerId = (watch("employer_id") || {})?.id;
    const selected_id = (watch("selected_id") || {});
    const selected_member = (watch("selected_member") || {});
    useEffect(() => {
        if (!_.isEmpty(selected_id)) {
            dispatch(getSelectedEmployeeMembers({
                policy_id: policyId,
                employeeids: selected_id?.map(data => data?.id)
            }, setMemberCode))
        }
    }, [selected_id])
    useEffect(() => {
        return () => {
            dispatch(setPageData({
                firstPage: 1,
                lastPage: 1
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        setValue("selected_id", [])
        if (_.isEqual(Number(type), 2) && Boolean(policyId)) {
            dispatch(selectiveEmployeeDataForDelete({
                policy_id: policyId,
                type: Number(type) === 2 ? "Selective" : "All"
            }, setEmployeeCode));
        }
    }, [type, policyId]);
    useEffect(() => {
        if (userTypeName === "Admin" || userTypeName === "Super Admin") {
            dispatch(fetchBrokers(userTypeName));
        }
    }, [userTypeName]);
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
    useEffect(() => {
        if (currentUser?.employer_id || employerId)
            dispatch(
                getPolicySubTypeData({
                    employer_id: employerId || currentUser?.employer_id,
                })
            );
    }, [currentUser, employerId]);
    useEffect(() => {
        if (policyTypeID && (currentUser?.employer_id || employerId)) {
            setValue("policy_id", []);
            dispatch(
                fetchPolicies({
                    user_type_name: userTypeName,
                    employer_id: employerId || currentUser?.employer_id,
                    policy_sub_type_id: policyTypeID,
                    ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
                }, true)
            );
        }

    }, [policyTypeID, employerId]);
    const onSubmit = (data) => {
        if (_.isEqual(Number(type), 2) && !data?.selected_id?.length) {
            swal("Warning", "Please Select Employee", "warning");
            return
        }
        let _data = {
            policy_id: policyId,
            type: _.isEqual(Number(type), 2) ? "Selective" : "All",
            ...(_.isEqual(Number(type), 2) && _.isEmpty(selected_member) && !!data?.selected_id?.length && { selected_id: data?.selected_id.map(item => item?.id) }),
            ...(_.isEqual(Number(type), 2) && !_.isEmpty(selected_member) && !!data?.selected_member?.length && { selected_member: data?.selected_member.map(item => item?.id) }),
        }
        dispatch(removeEmployee(_data));
        reset({
            selected_member: [],
            selected_id: [],
            broker_id: [],
            employer_id: [],
            policy_sub_type_id: [],
            policy_id: [],
            type: "2"
        })
    }
    return (
        <IconlessCard title={"Employee Delete"}>
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
                                        options={brokers?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        })) || []}
                                    />
                                }
                                name="broker_id"
                                control={control}
                                defaultValue={""}
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
                                    name="employer_id"
                                    control={control}
                                    defaultValue={""}
                                />
                            </Col>
                        )}
                    {userType === 'employer' && !!(currentUser.is_super_hr && currentUser.child_entities.length) &&
                        <Col xl={4} lg={4} md={6} sm={12}>
                            <Controller
                                as={<SelectComponent
                                    label="Employer"
                                    placeholder='Select Employer'
                                    options={currentUser.child_entities?.map((item) => ({
                                        id: item?.id,
                                        label: item?.name,
                                        value: item?.id,
                                    })) || []}
                                    id="employer_id"
                                    required
                                />}
                                // defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                                name="employer_id"
                                control={control}
                            />
                        </Col>
                    }
                    <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Policy Type"
                                    placeholder="Select Policy Type"
                                    required={false}
                                    isRequired={true}
                                    options={employerId ? PolicyTypeResponse?.data?.data?.map(item => (
                                        {
                                            id: item.id,
                                            label: item.name,
                                            value: item.id
                                        }
                                    )) : []}
                                />
                            }
                            name="policy_sub_type_id"
                            control={control}
                            defaultValue={""}
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
                                    options={(employerId && policyTypeID) ? policies?.map((item) => ({
                                        id: item?.id,
                                        label: item?.number,
                                        value: item?.id,
                                    })) : []}
                                />
                            }
                            name="policy_id"
                            control={control}
                            defaultValue={""}
                            error={errors && errors.policy_id}
                        />
                        {!!errors?.policy_id && <Error>{errors?.policy_id?.message}</Error>}
                    </Col>
                    <Col xl={4} lg={4} md={6} sm={12}>
                        <Head className='text-center'>Delete Method</Head>
                        <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                            <CustomControl className="d-flex mt-4 mr-0">
                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                                <input ref={register} name={'type'} type={'radio'} value={1} />
                                <span></span>
                            </CustomControl>
                            <CustomControl className="d-flex mt-4 ml-0">
                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                                <input ref={register} name={'type'} type={'radio'} value={2} defaultChecked={2} />
                                <span></span>
                            </CustomControl>
                        </div>
                        {/* <Controller
                            as={
                                <SelectComponent
                                    label="Type"
                                    placeholder="Select Type"
                                    required={false}
                                    isRequired={true}
                                    options={[{
                                        id: 1,
                                        label: "All",
                                        value: 1,
                                    }, {
                                        id: 2,
                                        label: "Selective",
                                        value: 2,
                                    }]}
                                />
                            }
                            name="type"
                            control={control}
                            defaultValue={""}
                            error={errors && errors.type}
                        />
                        {!!errors?.type && <Error>{errors?.type?.message}</Error>} */}
                    </Col>
                    {Number(type) === 2 && Boolean(policyId) && <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Employee Code/Name"
                                    placeholder="Select Employee Code/Name"
                                    required={true}
                                    isRequired={true}
                                    options={employeeCode}
                                    multi={true}
                                    closeMenuOnSelect={false}
                                    closeMenuOnScroll={false}
                                    hideSelectedOptions={true}
                                />
                            }
                            isRequired={true}
                            name="selected_id"
                            control={control}
                            error={errors && errors.selected_id}
                        />
                        {!!errors?.selected_id && <Error>{errors?.selected_id?.message}</Error>}
                    </Col>}
                    {Number(type) === 2 && Boolean(policyId) && !_.isEmpty(selected_id) && !_.isEmpty(memberCode) && <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Member Name"
                                    placeholder="Select Member Name"
                                    options={memberCode}
                                    multi={true}
                                    closeMenuOnSelect={false}
                                    closeMenuOnScroll={false}
                                    hideSelectedOptions={true}
                                />
                            }
                            name="selected_member"
                            control={control}
                            error={errors && errors.selected_member}
                        />
                        {!!errors?.selected_member && <Error>{errors?.selected_member?.message}</Error>}
                    </Col>}
                </Row>
                <Row className="justify-content-end">
                    <Button type="submit">Delete</Button>
                </Row>
            </form>
        </IconlessCard>
    );
}

export default EmployeeDelete;
