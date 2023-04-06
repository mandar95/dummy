/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { Button, Row, Form, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import {
    Input, Select, Card, Chip,
    Error, DatePicker, Head,
    Typography, SelectComponent, Marker
} from "../../../components";
import { SelectSpan } from "../../../components/inputs/Select/style";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import * as yup from 'yup';
import swal from "sweetalert";
// import _ from "lodash";
import { format } from "date-fns";
import { BenefitList, CarausalDiv } from "../style";
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';
import { /* setAllDropDownData, */ SetBrokerData, SetEmployerData, SetEmployeeData } from './helper';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";

import {
    loadBroker,
    // loadEmployer,
    loadEmployee,
    filterEmployer,
    filterEmployee,
    // selectEmployerName,
    getNotificationTypes,
    getAllModulesTypes,
    createNotification,
    updateNotification,
    editNotification,
    clear,
    clearData,
    LoadActions,
    // getModules
} from "../announcement.slice";
import { DateFormate, Decrypt } from "../../../utils";
import {
    fetchPoliciesST,
    fetchPolicies, fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Title } from "../../RFQ/select-plan/style";

const validationSchema = (IsPolicy, editData) => yup.object().shape({
    content: yup.string().min(2, 'Minimum 2 charactor required').matches(/^([A-Za-z\s])+$/, "Must contain only alphabets").required("Please enter content"),
    title: yup.string().min(2, 'Minimum 2 charactor required').matches(/^([A-Za-z\s])+$/, "Must contain only alphabets").required("Please enter title"),
    notification_type_id: yup.string().required("Please select notification type"),
    action_type_id: yup.object().shape({
        id: yup.string().required('Action Type Required'),
    }),
    ...((IsPolicy && editData.length === 0) && {
        policy_sub_type_id: yup.string().required("Please select policy sub type"),
        policy_id: yup.string().required("Please select policy"),
    })
})

const AddComponent = (props) => {
    const dispatch = useDispatch();
    let { userType, id } = useParams();
    const { globalTheme } = useSelector(state => state.theme)

    id = Decrypt(id);
    const history = useHistory();
    const closeBtn = useRef(null);
    const { broker: brokerData,
        success,
        error,
        loading,
        notificationType,
        Modules,
        EmployeeNameResponse,
        EmployerNameResponse,
        // EmployerFilterData,
        EmployeeFilterData,
        editData, actionTypes
    } = useSelector(state => state.announcement);
    const { currentUser, userType: userTypeName } = useSelector(state => state.login);
    const { policiesST, policies,
        firstPage,
        lastPage, employers: EmployerFilterData } = useSelector((state) => state.networkhospitalbroker);
    let actionTypeID = [3, 4, 5, 6, 8, 12, 14, 16, 17, 18, 19, 20, 22, 23, 24];
    const [isPolicy, showPolicy] = useState(false);
    // const { currentUser } = useSelector((state) => state.login);
    // const employerResp = useSelector(selectEmployerName);
    const { handleSubmit, control, reset, setValue, errors, watch, register } = useForm({
        //validationSchema(isPolicy),
        validationSchema: validationSchema(isPolicy, editData),
        defaultValues: {
            title: editData[0]?.title,
            // color: editData[0]?.color,
            content: editData[0]?.content,
            link: editData[0]?.link,
            // time_to_live: editData[0]?.time_to_live,
            start_date: DateFormate(editData[0]?.start_date || '', { dateFormate: true }) || "",
            end_date: DateFormate(editData[0]?.end_date || '', { dateFormate: true }) || "",
            notification_type_id: editData[0]?.notification_type_id,
            action_type_id: editData[0]?.action_type_id?.value,
            status: editData[0]?.status,
            //employer_all: editData[0]?.all_employers === 2 ? 0 : 1
        }
    });

    const employerId = watch('employer_id')?.id
    const _policyid = watch('policy_id');
    const brokerID = watch('broker_id')
    const notification_type_id = Number(watch('notification_type_id'))

    const action_type_id = watch('action_type_id')?.value;

    const brokerAll = watch('broker_all');
    const employerAll = watch('employer_all');
    const employeeAll = watch('employee_all');

    const [brokerSelect, setBrokerSelect] = useState();
    const [employerSelect, setEmployerSelect] = useState();
    const [employeeSelect, setEmployeeSelect] = useState();

    const [minDate, setMinDate] = useState(null);
    const [url, setURL] = useState("");
    const [actionTypeData, setActionTypeData] = useState([]);
    const [isRedirection, setRedirection] = useState(true);
    const [_policies, setPolicies] = useState([]);
    /*---------load api---------------*/

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
        if ((currentUser?.broker_id) && userTypeName !== "Employee") {
            if (lastPage >= firstPage) {
                var _TimeOut = setTimeout(_callback, 250);
            }
            function _callback() {
                dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
            }
            return () => {
                clearTimeout(_TimeOut)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstPage, currentUser]);
    useEffect(() => {
        if (!editData.length) {
            if (brokerSelect && brokers.length == 0) {
                setValue('broker_all', '1')
            }
            if (employerSelect && employers.length == 0) {
                setValue('employer_all', '1')
            }
            if (employeeSelect) {
                setValue('employee_all', '1')
            }
        }
        //eslint-disable-next-line
    }, [brokerSelect, employerSelect, employeeSelect, editData])

    useEffect(() => {
        if (editData?.length) {
            if (userType === "admin") {
                setBrokerSelect(true)
            }
            setEmployerSelect(true)
            setEmployeeSelect(true)
        }
    }, [editData, userType])

    useEffect(() => {
        if (notification_type_id) {
            // if (notification_type_id === 2) {
            //     setURL("")
            // }
            setURL("")
            setActionTypeData(actionTypes.filter((item) => item.notificatin_type_id === Number(notification_type_id)))
        }
        //eslint-disable-next-line
    }, [notification_type_id])

    useEffect(() => {
        if (url) {
            setValue('notificationUrl', url)
        }
        //eslint-disable-next-line
    }, [url])

    useEffect(() => {
        if (action_type_id) {
            const _data = actionTypes.filter((item) => item.id === Number(action_type_id))
            if (_data[0].url !== "undefined" && _data[0].url !== null) {
                setURL(_data[0].url)
            }
            else {
                setURL("")
            }
            let isInclude = actionTypeID.includes(Number(action_type_id))
            showPolicy(isInclude)
        }
        //eslint-disable-next-line
    }, [action_type_id])
    // Fill All Data

    useEffect(() => {
        if (typeof brokerAll !== 'undefined') {
            if (brokerAll !== '0' && brokerSelect)
                setBrokers(brokerData)
            else if (brokerAll === '0') {
                if (editData[0]?.broker) {
                    SetBrokerData(editData, brokerData, EmployerNameResponse, EmployeeNameResponse, { setBrokers, setEmployers, setEmployees })
                }
                else {
                    setBrokers([])
                }
            }
        }
        //eslint-disable-next-line
    }, [brokerAll, brokerData, brokerSelect, editData])

    useEffect(() => {
        if (typeof employerAll !== 'undefined') {
            if (employerAll !== '0' && employerSelect)
                setEmployers(EmployerFilterData)
            else if (employerAll === '0') {
                if (editData[0]?.employer) {
                    SetEmployerData(editData, brokerData, EmployerNameResponse, EmployeeNameResponse, { setBrokers, setEmployers, setEmployees })
                }
                else {
                    setEmployers([])
                }
            }
        }
        //eslint-disable-next-line
    }, [employerAll, EmployerFilterData, employerSelect])

    useEffect(() => {
        if (typeof employeeAll !== 'undefined') {
            if (employeeAll !== '0' && employeeSelect)
                setEmployees(EmployeeFilterData)
            else if (employeeAll === '0') {
                if (editData[0]?.employee) {
                    SetEmployeeData(editData, brokerData, EmployerNameResponse, EmployeeNameResponse, { setBrokers, setEmployers, setEmployees })
                }
                else {
                    setEmployees([])
                }
            }

        }
        //eslint-disable-next-line
    }, [employeeAll, EmployeeFilterData, employeeSelect])

    useEffect(() => {
        if (userTypeName) {
            if (userType === 'admin') {
                dispatch(loadBroker(userTypeName))
            }
            dispatch(getAllModulesTypes(userTypeName));
            // dispatch(loadEmployer(userTypeName))
            dispatch(loadEmployee(userTypeName))
            dispatch(getNotificationTypes());
            dispatch(LoadActions());


            return () => {
                dispatch(clearData())
                setBrokers(() => []);
                setEmployers(() => []);
                setEmployees(() => []);
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType, userTypeName]);

    const [broker, setBroker] = useState("");
    const [brokers, setBrokers] = useState([]);

    const onAddBroker = () => {
        if (broker && Number(broker)) {
            const flag = brokerData?.find(
                (value) => value?.id === Number(broker)
            );
            const flag2 = brokers.some((value) => value?.id === Number(broker));
            if (flag && !flag2) setBrokers((prev) => [...prev, flag]);
        }
    };
    const removeBroker = (Broker) => {
        const filteredBrokers = brokers.filter((item) => item?.id !== Broker);
        setBrokers((prev) => [...filteredBrokers]);
    };


    /*---------filter Employer---------------*/
    useEffect(() => {
        // dispatch(filterEmployer(userType !== "broker" ? brokers : [{ name: currentUser?.broker_name }]))
        if (brokers.length > 0) {
            dispatch(filterEmployer(brokers))
        }
        if (userType === 'broker') {
            dispatch(filterEmployer(false, true))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brokers, userType]);

    useEffect(() => {
        // dispatch(filterEmployer(userType !== "broker" ? brokers : [{ name: currentUser?.broker_name }]))
        if (userType === 'broker' && EmployerNameResponse?.data?.data?.length) {
            dispatch(filterEmployer(false, true))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EmployerNameResponse, userType]);


    const [employer, setEmployer] = useState("");
    const [employers, setEmployers] = useState([]);

    /*---------add---------------*/

    const onAdd = () => {
        if (employer && Number(employer)) {
            const flag = EmployerFilterData?.find(
                (value) => value?.id === Number(employer)
            );
            const flag2 = employers.some((value) => value?.id === Number(employer));
            if (flag && !flag2) setEmployers((prev) => [...prev, flag]);
            setValue('broker_ids', "");
        }
    };

    /*-----------------remove------------------*/
    const removeEmployer = (Employer) => {
        const filteredEmployers = employers.filter((item) => item?.id !== Employer);
        setEmployers((prev) => [...filteredEmployers]);
    };

    /*---------filter Employee---------------*/
    useEffect(() => {
        if (employers.length > 0)
            dispatch(filterEmployee(employers))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employers]);

    const [employee, setEmployee] = useState("");
    const [employees, setEmployees] = useState([]);

    /*---------add---------------*/

    const onAddEmployee = () => {
        if (employee && Number(employee)) {
            const flag = EmployeeNameResponse?.data?.data?.find(
                (value) => value?.id === Number(employee)
            );
            const flag2 = employees.some((value) => value?.id === Number(employee));
            if (flag && !flag2) setEmployees((prev) => [...prev, flag]);
            setValue('broker_ids', "");
        }
    };

    /*-----------------remove------------------*/
    const removeEmployee = (Employee) => {
        const filteredEmployees = employees.filter((item) => item?.id !== Employee);
        setEmployees((prev) => [...filteredEmployees]);
    };

    /*-----------------reset data when edit notification------------------*/
    useEffect(() => {
        if (editData.length > 0) {
            reset({
                title: editData[0].title,
                status: editData[0].status,
                content: editData[0]?.content,
                link: editData[0]?.link,
                start_date: DateFormate(editData[0]?.start_date || '', { dateFormate: true }) || "",
                end_date: DateFormate(editData[0]?.end_date || '', { dateFormate: true }) || "",
                notification_type_id: editData[0].notification_type_id || 1,
                action_type_id: actionTypes.map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                })).find(({ id }) => editData[0]?.action_type_id === id),

            })
            // setAllDropDownData(editData, brokerData, EmployerNameResponse, EmployeeNameResponse, { setBrokers, setEmployers, setEmployees, setPolicies })
            // editData[0].employer.forEach((item) => {
            // dispatch(
            //     fetchPoliciesST({ employer_id: item.id })
            // );
            // dispatch(
            //     fetchPolicies({
            //         user_type_name: userTypeName,
            //         employer_id: item.id,
            //         policy_sub_type_id: 1,
            //         ...(currentUser.broker_id && { broker_id: currentUser.broker_id })
            //     })
            // );
            // })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData, brokerData, EmployerNameResponse, EmployeeNameResponse, actionTypes])

    /*-----------------update notification------------------*/
    useEffect(() => {
        if (id /* && (EmployeeNameResponse?.data?.data || EmployerNameResponse?.data?.data) */) {
            dispatch(editNotification(id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id/* , EmployeeNameResponse, EmployerNameResponse */])

    /*-----------------success ,error ,------------------*/
    useEffect(() => {
        if (!loading && success?.status) {
            if (id) history.replace(`/${userType}/announcement-config?type=notification`)
            else closeBtn.current.click()

            swal('Success', success.message, "success").then(() => {
                dispatch(clear());
            });

        }
        if (!loading && error) {
            swal("Alert", error, "warning").then(() => dispatch(clear()));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error, loading])

    // Broker
    const onChangeBroker = ([selected]) => {
        const target = selected.target;
        const checked = target && target.checked ? target.checked : false;
        setBrokerSelect(prev => checked);
        return selected;
    };

    // Employer
    const onChangeEmployer = ([selected]) => {
        const target = selected.target;
        const checked = target && target.checked ? target.checked : false;
        setEmployerSelect(prev => checked);
        return selected;
    };

    // Employee
    const onChangeEmployee = ([selected]) => {
        const target = selected.target;
        const checked = target && target.checked ? target.checked : false;
        setEmployeeSelect(prev => checked);
        return selected;
    };

    //get policy type id
    useEffect(() => {
        if (currentUser?.employer_id || employerId)
            dispatch(
                fetchPoliciesST({ employer_id: currentUser?.employer_id || employerId })
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, employerId]);

    const policyTypeID = watch("policy_sub_type_id");
    //get policy id
    useEffect(() => {
        if (policyTypeID && (currentUser?.employer_id || employerId))
            dispatch(
                fetchPolicies({
                    user_type_name: userTypeName,
                    employer_id: currentUser?.employer_id || employerId,
                    policy_sub_type_id: policyTypeID,
                    ...(currentUser.broker_id && { broker_id: currentUser.broker_id })
                })
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyTypeID, employerId]);

    // const [employee, setEmployee] = useState("");

    const onAddPolicy = () => {
        if (_policyid && Number(_policyid)) {
            const flag = policies?.find(
                (value) => value?.id === Number(_policyid)
            );
            const flag2 = _policies.some((value) => value?.id === Number(employee));
            if (flag && !flag2) setPolicies((prev) => [...prev, flag]);
            //setValue('broker_ids', "");
        }
    };

    /*-----------------remove------------------*/
    const removePolicy = (Employee) => {
        const filteredEmployees = _policies.filter((item) => item?.id !== Employee);
        setPolicies((prev) => [...filteredEmployees]);
    };

    useEffect(() => {
        if (errors.policy_sub_type_id) {
            swal("Select Employer to get the Policy", "", "warning");
        }
    }, [errors])

    /*-----------------create notification------------------*/
    const onSubmit = (data) => {
        if (employerSelect && ((employerAll === '0' && employers.length) || employerAll !== '0')) {
            const formdata = {
                ...!id && {
                    ...((brokerSelect && brokers.length) ? {
                        all_brokers: brokerAll === '0' ? 2 : 1,
                        ...(brokerAll === '0' && {
                            broker_ids: brokers.map((({ id }) => id))
                        })
                    } : { all_brokers: 0 }),
                    ...((employerSelect && brokerSelect && employers.length) ? {
                        all_employers: employerAll === '0' ? 2 : 1,
                        ...(employerAll === '0' && {
                            employer_ids: employers.map((({ id }) => id))
                        })
                    } : { all_employers: 0 }),
                    ...((employeeSelect && employerSelect && brokerSelect && employees.length) ? {
                        all_employees: employeeAll === '0' ? 2 : 1,
                        ...(employeeAll === '0' && {
                            employee_ids: employees.map((({ id }) => id))
                        })
                    } : { all_employees: 0 })
                },
                broker_id: currentUser.broker_id || brokerID,
                status: data.status,
                notification_type_id: data.notification_type_id,
                content: data.content,
                // ...((data?.link?.length !== 0 || data?.link) && {
                //     link: data.link
                // }),
                ...(Boolean(data.link) && {
                    link: data.link
                }),
                ...(_policies.length && {
                    policy_ids: _policies.map((item) => item.id)
                }),
                // ...(notification_type_id === 2 && {
                //     action_type_id: data.action_type_id
                // }),
                action_type_id: data.action_type_id?.value,
                ...(data.start_date && { start_date: DateFormate(data.start_date) }),
                ...(data.end_date && { end_date: DateFormate(data.end_date) }),
                title: data.title,
            }
            const result2 = {
                ...formdata,
                ...!id && {
                    ...((currentUser?.broker_id) && {
                        all_brokers: 2,
                        broker_ids: [Number(currentUser?.broker_id)]
                    }),
                    ...((employerSelect) ? {
                        // all_employers: 2,
                        all_employers: employerAll === '0' ? 2 : 1,
                        ...((employers.length && employerAll === "0") && {
                            employer_ids: employers.map((({ id }) => id))
                        })
                        //employer_ids: employers.map((({ id }) => id))
                    } : { all_employers: 0 }),
                    ...((employeeSelect) ? {
                        // all_employees: 2,
                        all_employees: employeeAll === '0' ? 2 : 1,
                        ...((employees.length && employeeAll === '0') && {
                            employee_ids: employees.map((({ id }) => id))
                        })
                        //employee_ids: employees.map((({ id }) => id))
                    } : { all_employees: 0 })
                },
            }
            if (id) {
                // formdata.append("_method", "PATCH")
                dispatch(updateNotification(userType === "broker" ? { ...result2, _method: 'PATCH' } : { ...formdata, _method: 'PATCH' }, id))
                //dispatch(updateNotification({ ...formdata, _method: 'PATCH' }, id));
            }
            else {
                //dispatch(createNotification(formdata));
                dispatch(createNotification(userType === "broker" ? result2 : formdata))
            }
        }
        else {
            swal("Fill all the required fields", "", "warning");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card title={editData.length ? "Edit Notification" : "Add Notification"}>
                <div>
                    <Row xs={3} sm={3} md={3} lg={3} xl={3}>
                        {/*Annoucement type*/}
                        <div className="p-2">
                            <Controller
                                as={
                                    <Select
                                        label="Notification Type"
                                        placeholder="Select Notification Type"
                                        required={false}
                                        isRequired={true}
                                        options={notificationType?.data?.data?.map((item) => ({
                                            id: item?.id,
                                            name: item?.name,
                                            value: item?.id,
                                        }))}
                                        disabled={id}
                                    />
                                }
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                name="notification_type_id"
                                control={control}
                                defaultValue={""}
                                error={errors && errors.notification_type_id}
                            />
                            {!!errors?.notification_type_id && <Error>{errors?.notification_type_id?.message}</Error>}
                        </div>
                        {/*Action type*/}
                        {/* {notification_type_id === 1 && !!actionTypes.length &&  */}
                        <div className="p-2">
                            <Controller
                                as={
                                    <SelectComponent
                                        label="Action Type"
                                        placeholder="Select Action Type"
                                        required={false}
                                        isRequired={true}
                                        options={actionTypeData?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        }))}
                                        disabled={id}
                                    />
                                }
                                name="action_type_id"
                                control={control}
                                error={errors && errors.action_type_id?.id}
                            />
                            {!!errors?.action_type_id?.id && <Error>{errors?.action_type_id?.id?.message}</Error>}
                        </div>
                        {/* } */}
                        {(url !== "" && notification_type_id === 1) &&
                            <div className="p-2">

                                {/* <DownloadBtn
                                        role='button'
                                    >
                                        URL -  {url}
                                    </DownloadBtn> */}
                                <Controller
                                    as={<Input label="URL" placeholder="" isRequired={false} disabled={true}
                                        labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                                    name="notificationUrl"
                                    control={control}

                                />
                            </div>
                        }
                        {/*switch*/}
                        <div className="p-2">
                            <Controller
                                as={<Switch />}
                                name="status"
                                control={control}
                                defaultValue={0}
                            />
                        </div>
                    </Row>
                    {!id ? <>
                        <Row className="d-flex flex-wrap">
                            {userType === "admin" &&
                                <Col md={12} lg={12} xl={12} sm={12}>
                                    <InputWrapper className="custom-control custom-checkbox">
                                        <Controller
                                            as={
                                                <input
                                                    id="brokerCheck"
                                                    className="custom-control-input"
                                                    type="checkbox"
                                                    defaultChecked={brokerSelect} />
                                            }
                                            name="add_benefit1"
                                            control={control}
                                            onChange={onChangeBroker}
                                        />
                                        <label className="custom-control-label" htmlFor="brokerCheck"><Typography>Brokers</Typography></label>
                                    </InputWrapper>
                                </Col>
                            }
                            {(!!brokerSelect) &&
                                <>
                                    <Col md={6} lg={4} xl={4} sm={12}>
                                        <Head className='text-center'>Broker Method</Head>
                                        <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                                            <CustomControl className="d-flex mt-4 mr-0">
                                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                                                <input ref={register} name={'broker_all'} type={'radio'} value={1} defaultChecked={editData[0]?.all_brokers === 1 || true} />
                                                <span></span>
                                            </CustomControl>
                                            <CustomControl className="d-flex mt-4 ml-0">
                                                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                                                <input ref={register} name={'broker_all'} type={'radio'} value={0} defaultChecked={editData[0]?.all_brokers === 2} />
                                                <span></span>
                                            </CustomControl>
                                        </div>
                                    </Col>
                                    {(brokerAll === '0') &&
                                        <>
                                            <Col md={6} lg={4} xl={4} sm={12}>
                                                <Controller
                                                    as={
                                                        <Select
                                                            label="Broker"
                                                            placeholder='Select Broker'
                                                            required={false}
                                                            isRequired={true}
                                                            options={brokerData.map((item) => ({
                                                                id: item?.id,
                                                                name: item?.name,
                                                                value: item?.id,
                                                            }))}
                                                        />
                                                    }
                                                    onChange={([selected]) => {
                                                        setBroker(selected.target.value);
                                                        return selected;

                                                    }}
                                                    name="broker_id"
                                                    control={control}
                                                    defaultValue={""}
                                                    error={errors && errors.broker_id}
                                                />
                                                {!!errors?.broker_id && <Error>{errors?.broker_id?.message}</Error>}

                                            </Col>
                                            <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                                                <div className="p-2">
                                                    <Button type="button" onClick={onAddBroker}>
                                                        <i className="ti ti-plus"></i> Add
                                                    </Button>
                                                </div>
                                            </Col>
                                            {brokers.length ? (
                                                <BenefitList>
                                                    {brokers.map((item) => {
                                                        return (
                                                            <Chip
                                                                key={'brokers' + item?.id}
                                                                id={item?.id}
                                                                name={item?.name}
                                                                onDelete={removeBroker}
                                                            />
                                                        );
                                                    })}
                                                </BenefitList>
                                            ) : null}
                                        </>
                                    }
                                </>
                            }
                        </Row>
                        {((!!brokers.length && !!brokerSelect) || (currentUser?.broker_id && userType === 'broker')) &&
                            <Row>
                                <Col md={12} lg={12} xl={12} sm={12}>
                                    <InputWrapper className="custom-control custom-checkbox">
                                        <Controller
                                            as={
                                                <input
                                                    id="employerCheck"
                                                    className="custom-control-input"
                                                    type="checkbox"
                                                    defaultChecked={employerSelect} />
                                            }
                                            name="add_benefit2"
                                            control={control}
                                            onChange={onChangeEmployer}
                                        />
                                        <label className="custom-control-label" htmlFor="employerCheck"><Typography>Employers</Typography></label>
                                    </InputWrapper>
                                </Col>
                                {!!employerSelect &&
                                    <>
                                        <Col md={6} lg={4} xl={4} sm={12}>
                                            <Head className='text-center'>Employer Method</Head>
                                            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                                                <CustomControl className="d-flex mt-4 mr-0">
                                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                                                    <input ref={register} name={'employer_all'} type={'radio'} value={1} defaultChecked={editData[0]?.all_employers === 1 || true} />
                                                    <span></span>
                                                </CustomControl>
                                                <CustomControl className="d-flex mt-4 ml-0">
                                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                                                    <input ref={register} name={'employer_all'} type={'radio'} value={0} defaultChecked={editData[0]?.all_employers === 2} />
                                                    <span></span>
                                                </CustomControl>
                                            </div>
                                        </Col>
                                        {(employerAll === '0') &&
                                            <>
                                                <Col md={6} lg={4} xl={4} sm={12}>
                                                    <Controller
                                                        as={<SelectComponent
                                                            label="Select Employer"
                                                            placeholder="Select Employer"
                                                            required={false}
                                                            isRequired={true}
                                                            options={EmployerFilterData.map((item) => ({
                                                                id: item?.id,
                                                                label: item?.company_name || item?.name,
                                                                value: item?.id,
                                                            }))}
                                                        />
                                                        }
                                                        onChange={([selected]) => {
                                                            setEmployer(selected?.value);
                                                            return selected;
                                                        }}
                                                        name="employer_id"
                                                        control={control}
                                                        defaultValue={""}
                                                        error={errors && errors.employer_id}
                                                    />
                                                    {!!errors?.employer_id && <Error>{errors?.employer_id?.message}</Error>}
                                                </Col>

                                                <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                                                    <div className="p-2">
                                                        <Button type="button" onClick={onAdd}>
                                                            <i className="ti ti-plus"></i> Add
                                                        </Button>
                                                    </div>
                                                </Col>

                                                {employers.length ? (
                                                    <BenefitList>
                                                        {employers.map((item) => {
                                                            return (
                                                                <Chip
                                                                    key={'employers' + item?.id}
                                                                    id={item?.id}
                                                                    name={item?.company_name || item?.name}
                                                                    onDelete={removeEmployer}
                                                                />
                                                            );
                                                        })}
                                                    </BenefitList>
                                                ) : null}
                                            </>
                                        }
                                    </>
                                }
                            </Row>
                        }
                        {((!!brokers.length && !!employers.length && !!employerSelect && !!brokerSelect) || (!!employers.length && !!employerSelect && userType === 'broker')) &&
                            ![21, 24, 13].includes(Number(action_type_id)) &&
                            <Row className="d-flex flex-wrap">

                                <Col md={12} lg={12} xl={12} sm={12}>
                                    <InputWrapper className="custom-control custom-checkbox">
                                        <Controller
                                            as={
                                                <input
                                                    id="employeeCheck"
                                                    className="custom-control-input"
                                                    type="checkbox"
                                                    defaultChecked={employeeSelect} />
                                            }
                                            name="add_benefit3"
                                            control={control}
                                            onChange={onChangeEmployee}
                                        />
                                        <label className="custom-control-label" htmlFor="employeeCheck"><Typography>Employee</Typography></label>
                                    </InputWrapper>
                                </Col>
                                {!!employeeSelect &&
                                    <>
                                        <Col md={6} lg={4} xl={4} sm={12}>
                                            <Head className='text-center'>Employee Method</Head>
                                            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                                                <CustomControl className="d-flex mt-4 mr-0">
                                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"All"}</p>
                                                    <input ref={register} name={'employee_all'} type={'radio'} value={1} defaultChecked={editData[0]?.all_employees === 1 || true} />
                                                    <span></span>
                                                </CustomControl>
                                                <CustomControl className="d-flex mt-4 ml-0">
                                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Selective"}</p>
                                                    <input ref={register} name={'employee_all'} type={'radio'} value={0} defaultChecked={editData[0]?.all_employees === 2} />
                                                    <span></span>
                                                </CustomControl>
                                            </div>
                                        </Col>
                                        {(employeeAll === '0') &&
                                            <>
                                                <Col md={6} lg={4} xl={4} sm={12}>
                                                    <Controller
                                                        as={<SelectComponent
                                                            label="Select Employee"
                                                            placeholder="Select Employee"
                                                            required={false}
                                                            isRequired={true}
                                                            options={EmployeeFilterData?.map((item) => ({
                                                                id: item?.id,
                                                                label: item?.company_name || item?.name,
                                                                value: item?.id,
                                                            }))}
                                                        />
                                                        }
                                                        onChange={([selected]) => {
                                                            setEmployee(selected?.value);
                                                            return selected;
                                                        }}
                                                        name="employee_id"
                                                        control={control}
                                                        defaultValue={""}
                                                        error={errors && errors.employee_id}
                                                    />
                                                    {!!errors?.employee_id && <Error>{errors?.employee_id?.message}</Error>}
                                                </Col>

                                                <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                                                    <div className="p-2">
                                                        <Button type="button" onClick={onAddEmployee}>
                                                            <i className="ti ti-plus"></i> Add
                                                        </Button>
                                                    </div>
                                                </Col>
                                                {employees.length ? (
                                                    <BenefitList>
                                                        {employees.map((item) => {
                                                            return (
                                                                <Chip
                                                                    key={'employees' + item?.id}
                                                                    id={item?.id}
                                                                    name={item?.company_name || item?.name}
                                                                    onDelete={removeEmployee}
                                                                />
                                                            );
                                                        })}
                                                    </BenefitList>
                                                ) : null}
                                            </>
                                        }
                                    </>
                                }
                            </Row>
                        }
                        <Row>
                            {isPolicy &&
                                <>
                                    <Col xl={4} lg={4} md={6} sm={12}>
                                        <Controller
                                            as={
                                                <Select
                                                    label="Policy Type"
                                                    placeholder="Select Policy Type"
                                                    required={false}
                                                    isRequired={true}
                                                    options={
                                                        policiesST.filter(({ policy_sub_type_id }) => policy_sub_type_id === 1)?.map((item) => ({
                                                            id: item?.policy_sub_type_id,
                                                            name: item?.policy_sub_type_name,
                                                            value: item?.policy_sub_type_id,
                                                        })) || []
                                                    }
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
                                                <Select
                                                    label="Policy Name"
                                                    placeholder="Select Policy Name"
                                                    isRequired={true}
                                                    required={false}
                                                    options={
                                                        policies?.map((item) => ({
                                                            id: item?.id,
                                                            name: `${item?.policy_no}`,
                                                            value: item?.id,
                                                        })) || []
                                                    }
                                                />
                                            }
                                            name="policy_id"
                                            control={control}
                                            defaultValue={""}
                                            error={errors && errors.policy_id}
                                        />
                                        {!!errors?.policy_id && (
                                            <Error>{errors?.policy_id?.message}</Error>
                                        )}
                                    </Col>
                                    <Col md={6} lg={4} xl={4} sm={12} className="d-flex align-items-center">
                                        <div className="p-2">
                                            <Button type="button" onClick={onAddPolicy}>
                                                <i className="ti ti-plus"></i> Add
                                            </Button>
                                        </div>
                                    </Col>
                                    {_policies.length ? (
                                        <BenefitList>
                                            {_policies.map((item) => {
                                                return (
                                                    <Chip
                                                        key={'employees2' + item?.id}
                                                        id={item?.id}
                                                        name={item?.policy_no}
                                                        onDelete={removePolicy}
                                                    />
                                                );
                                            })}
                                        </BenefitList>
                                    ) : null}
                                </>
                            }
                        </Row>
                    </> : <>
                        <Row>
                            <Col md={12} lg={12} xl={12} sm={12}>
                                <TextCard
                                    className="pl-3 pt-3 pr-3 mb-4 mt-4"
                                    borderRadius="10px"
                                    noShadow
                                    border="1px dashed #929292"
                                    bgColor="#f8f8f8"
                                >
                                    {editData?.[0]?.all_employers && <>
                                        <Marker />
                                        <Typography>
                                            {"\u00A0"} Employers{" "}
                                        </Typography>
                                        <br />
                                        <Title fontSize="0.9rem" color="#4da2ff">
                                            <i className="ti-arrow-circle-right mr-2" />
                                            Employer Method :{" "}
                                            {editData?.[0]?.all_employers === 1 ? 'All' : 'Selective'}
                                        </Title>
                                        {editData?.[0]?.all_employers === 2 && editData?.[0]?.employer?.map(({ name }, index) => (
                                            <button key={'employer' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                                                {name || "-"}
                                            </button>
                                        ))}
                                        <br />
                                    </>}
                                    {editData?.[0]?.all_employees && <>
                                        <Marker />
                                        <Typography>
                                            {"\u00A0"} Employees{" "}
                                        </Typography>
                                        <br />
                                        <Title fontSize="0.9rem" color="#4da2ff">
                                            <i className="ti-arrow-circle-right mr-2" />
                                            Employer Method :{" "}
                                            {editData?.[0]?.all_employees === 1 ? 'All' : 'Selective'}
                                        </Title>
                                        {editData?.[0]?.all_employees === 2 && editData?.[0]?.employer?.map(({ name }, index) => (
                                            <button key={'employee' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                                                {name || "-"}
                                            </button>
                                        ))}
                                        <br />
                                    </>}

                                    {!!editData?.[0]?.policy?.length && <>
                                        <Marker />
                                        <Typography>
                                            {"\u00A0"} Policies{" "}
                                        </Typography>
                                        <br />

                                        {editData?.[0]?.policy?.map(({ policy_no }, index) => (
                                            <button key={'policy' + index} disabled className="btn shadow m-1 btn-primary btn-sm rounded-lg" >
                                                {policy_no || "-"}
                                            </button>
                                        ))}
                                        <br />
                                    </>}
                                </TextCard>
                            </Col>
                        </Row>
                    </>}
                </div>
            </Card>
            <Card title="Notification Parameters">
                <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                    {/*content*/}
                    <CarausalDiv style={{ borderBottom: 'none' }}>
                        <div style={{ padding: "10px", marginTop: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <SelectSpan style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                                    Notification Content
                                    <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
                                </SelectSpan>
                            </div>
                            <Controller
                                as={<Form.Control as="textarea" rows="3" />}
                                name="content"
                                control={control}
                                error={errors && errors.content}
                                style={{ resize: 'none' }}
                            />
                            {!!errors?.content && <Error style={{ marginTop: '1px' }}>{errors?.content?.message}</Error>}
                        </div>
                    </CarausalDiv>
                    {/*link*/}
                    {/* <div className="p-2" style={{ marginTop: '30px' }}>
                            <Controller
                                as={<Input label="Link" placeholder="Enter Media Link" />}
                                name="link"
                                control={control}
                                error={errors && errors.link}
                            />
                            {!!errors?.link && <Error>{errors?.link?.message}</Error>}
                        </div> */}
                </Row>
                {notification_type_id === 2 &&
                    <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                        <div className="p-2">
                            <div className="p-2 d-flex justify-content-center align-items-center">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => setRedirection(true)}
                                    >
                                        Default</button>
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => setRedirection(false)}
                                    >
                                        Customize</button>
                                </div>
                            </div>
                            {isRedirection ?
                                <div className="p-2">
                                    <Controller
                                        as={
                                            <Select
                                                label="Select Redirection Link"
                                                placeholder="No Redirection Link"
                                                options={Modules?.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.moduleName || item?.name,
                                                    value: item?.moduleUrl || item?.url,
                                                }))}
                                            />
                                        }
                                        onChange={([selected]) => {
                                            return selected;
                                        }}
                                        name="link"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.link}
                                        required={false}
                                        isRequired={false}
                                    />
                                    {!!errors?.link && <Error>{errors?.link?.message}</Error>}
                                </div>
                                :
                                <div className="p-2">
                                    <Controller
                                        as={<Input label="Link" placeholder="Enter Link" isRequired={false} />}
                                        name="link"
                                        control={control}
                                        error={errors && errors.link}

                                    />
                                    {!!errors?.link && <Error>{errors?.link?.message}</Error>}
                                </div>
                            }
                        </div>
                    </Row>
                }
                <Row xs={1} sm={2} md={3} lg={4} xl={4}>
                    <div className="p-2">
                        <Controller
                            as={<Input label="Notification Title" placeholder="Enter Title" isRequired={true} />}
                            name="title"
                            control={control}
                            error={errors && errors.title}

                        />
                        {!!errors?.title && <Error>{errors?.title?.message}</Error>}
                    </div>
                    {notification_type_id === 2 &&
                        <>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <DatePicker
                                            name={'start_date'}
                                            label={'Start Date'}
                                            minDate={new Date()}
                                            required={false}
                                            //isRequired={true}
                                            isRequired={false}
                                        />
                                    }
                                    onChange={([selected]) => {
                                        setMinDate(selected)
                                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                                    }}
                                    error={errors && errors.start_date}
                                    name="start_date"
                                    control={control}
                                />
                                {!!errors?.start_date && <Error>{errors?.start_date?.message}</Error>}
                            </div>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <DatePicker
                                            minDate={minDate}
                                            name={'end_date'}
                                            label={'End Date'}
                                            required={false}
                                            // isRequired={true}
                                            isRequired={false}
                                            disabled={!minDate}
                                        />
                                    }
                                    onChange={([selected]) => {
                                        return selected ? format(selected, 'dd-MM-yyyy') : '';
                                    }}
                                    error={errors && errors.end_date}
                                    name="end_date"
                                    control={control}
                                />
                                {!!errors?.end_date && <Error>{errors?.end_date?.message}</Error>}
                            </div>
                        </>
                    }
                </Row>
                <div style={{ float: "right" }} className="p-2">
                    <Button size="md" className="p-2" variant="success" type="submit">
                        <span style={{ fontWeight: "600" }}>{`${id ? "Update & Save" : "Save"}`}</span>
                    </Button>
                </div>
                {!id &&
                    <div style={{ float: "right" }} className="p-2">
                        <Button
                            size="md"
                            className="p-2"
                            variant="danger"
                            onClick={props.onHide}
                            ref={closeBtn}
                        >
                            <span style={{ fontWeight: "600" }}>Close</span>
                        </Button>
                    </div>
                }
            </Card>
        </form >
    )
}
export default AddComponent;
