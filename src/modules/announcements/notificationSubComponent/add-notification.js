/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { Button, Row, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Card, Chip, Error, DatePicker } from "../../../components";
import { SelectSpan } from "../../../components/inputs/Select/style";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import * as yup from 'yup';
import swal from "sweetalert";
// import _ from "lodash";
import { format } from "date-fns";
import { BenefitList, CarausalDiv } from "../style";

import {
    loadBroker,
    loadEmployer,
    loadEmployee,
    filterEmployer,
    filterEmployee,
    selectEmployerName,
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

const validationSchema = yup.object().shape({
    content: yup.string().required("Please enter content"),
    // link: yup.string().required("Please enter link"),
    title: yup.string().required("Please enter title"),
    // time_to_live: yup.number().required("Please enter time"),
    // broker_id: yup.string().required("Please select broker"),
    // employer_id: yup.string().required("Please select employer"),
    // employee_id: yup.string().required("Please select employee"),
    notification_type_id: yup.string().required("Please select notification type"),
    start_date: yup.string().required('Start date is required'),
    end_date: yup.string().required('End date is required')

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
        EmployerFilterData,
        EmployeeFilterData,
        editData, actionTypes
    } = useSelector(state => state.announcement);
    const { userType: userTypeName } = useSelector(state => state.login);

    // const { currentUser } = useSelector((state) => state.login);
    const employerResp = useSelector(selectEmployerName);
    const { handleSubmit, control, reset, setValue, errors, watch } = useForm({
        validationSchema,
        defaultValues: {
            title: editData[0]?.title,
            // color: editData[0]?.color,
            content: editData[0]?.content,
            link: editData[0]?.link,
            // time_to_live: editData[0]?.time_to_live,
            start_date: DateFormate(editData[0]?.start_date || '', { dateFormate: true }) || "",
            end_date: DateFormate(editData[0]?.end_date || '', { dateFormate: true }) || "",
            notification_type_id: editData[0]?.notification_type_id,
            action_type_id: editData[0]?.action_type_id,
            status: editData[0]?.status
        }
    });

    const notification_type_id = Number(watch('notification_type_id'))


    const [minDate, setMinDate] = useState(null);
    /*---------load api---------------*/

    useEffect(() => {
        if (userTypeName) {
            if (userType === 'admin') {
                dispatch(loadBroker(userTypeName))
            }
            dispatch(getAllModulesTypes(userTypeName));
            dispatch(loadEmployer(userTypeName))
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
            const flag = employerResp?.data?.data?.find(
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
                action_type_id: editData[0]?.action_type_id,

            })
            let brokerDetails = []
            if (typeof brokerData !== "undefined" && typeof editData[0]?.broker !== 'undefined') {
                for (let j = 0; j < editData[0]?.broker?.length; j++) {
                    for (let i = 0; i < brokerData.length; i++) {
                        if (parseInt(brokerData[i].id) == parseInt(editData[0].broker[j].id))
                            brokerDetails.push(brokerData[i])
                    }
                }
                setBrokers(() => [...brokerDetails]);
            }

            let employerDetails = []
            if (typeof EmployeeNameResponse !== "undefined") {

                for (let j = 0; j < editData[0].employer.length; j++) {
                    for (let i = 0; i < EmployerNameResponse?.data?.data.length; i++) {
                        if (parseInt(EmployerNameResponse?.data?.data[i].id) == parseInt(editData[0].employer[j].id))
                            employerDetails.push(EmployerNameResponse.data.data[i])
                    }
                }
                setEmployers(() => [...employerDetails]);
            }

            let employeeDetails = [];
            if (typeof EmployeeNameResponse !== "undefined") {
                for (let j = 0; j < editData[0].employee.length; j++) {
                    if (editData[0].employee[j].employee_details !== null) {
                        for (let i = 0; i < EmployeeNameResponse?.data?.data.length; i++) {
                            if (parseInt(EmployeeNameResponse?.data?.data[i].id) == parseInt(editData[0].employee[j].employee_details.id))
                                employeeDetails.push(EmployeeNameResponse.data.data[i])
                        }
                    }
                }
                setEmployees(() => [...employeeDetails]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData, brokerData, EmployerNameResponse, EmployeeNameResponse])

    /*-----------------update notification------------------*/
    useEffect(() => {
        if (id && EmployeeNameResponse?.data?.data && EmployerNameResponse?.data?.data) {
            dispatch(editNotification(id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, EmployeeNameResponse, EmployerNameResponse])

    /*-----------------success ,error ,------------------*/
    useEffect(() => {
        if (!loading && success?.status) {
            if (id) history.replace(`/${userType}/announcement-config`)
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


    /*-----------------create notification------------------*/
    const onSubmit = (data) => {
        // const formdata = new FormData();
        // if (!_.isEmpty(brokers)) {
        //     // let employerArray = employers.map(Number);
        //     brokers.forEach((data, index) => {
        //         formdata.append(`broker_ids.${index}`, data.id);
        //     });
        // }
        // if (!_.isEmpty(employers)) {
        //     // let employerArray = employers.map(Number);
        //     employers.forEach((data, index) => {
        //         formdata.append(`employer_ids.${index}`, data.id);
        //     });
        // }

        // if (!_.isEmpty(employees)) {
        //     // let employerArray = employers.map(Number);
        //     employees.forEach((data, index) => {
        //         formdata.append(`employee_ids.${index}`, data.id);
        //     });
        // }
        // formdata.append("notification_type_id", data.notification_type_id);
        // notification_type_id === 2 && formdata.append("action_type_id", data.action_type_id);
        // // formdata.append("status", data.status);
        // formdata.append("content", data.content);
        // formdata.append("link", data.link);
        // // formdata.append("time_to_live", data.time_to_live);
        // formdata.append("start_date", DateFormate(data.start_date));
        // formdata.append("end_date", DateFormate(data.end_date));
        // // formdata.append("unit", data.unit); ----------------------------------
        // // formdata.append("color", data.color);
        // formdata.append("title", data.title);

        const formdata = {
            broker_ids: brokers?.map((data) => data.id),
            employer_ids: employers?.map((data) => data.id),
            employee_ids: employees?.map((data) => data.id),
            notification_type_id: data.notification_type_id,
            content: data.content,
            link: data.link,
            ...(notification_type_id === 2 && {
                action_type_id: data.action_type_id
            }),
            start_date: DateFormate(data.start_date),
            end_date: DateFormate(data.end_date),
            title: data.title,
        }

        if (id) {
            // formdata.append("_method", "PATCH")
            dispatch(updateNotification({ ...formdata, _method: 'PATCH' }, id));
        }
        else {
            dispatch(createNotification(formdata));
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card title="Add Notification">
                    <div>
                        <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                            {/*Broker*/}
                            {(userType === "admin") &&
                                <div>
                                    <div className="p-2">
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

                                    </div>
                                    <div style={{ display: "flex", paddingBottom: "10px" }}>
                                        <div className="p-2">
                                            <Button type="button" onClick={onAddBroker}>
                                                <i className="ti ti-plus"></i> Add
                                            </Button>
                                        </div>
                                    </div>
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
                                </div>
                            }
                            <div>
                                {/*Employer*/}
                                <div className="p-2">
                                    <Controller
                                        as={<Select
                                            label="Select Employer"
                                            placeholder="Select Employer"
                                            required={false}
                                            isRequired={true}
                                            options={EmployerFilterData.map((item) => ({
                                                id: item?.id,
                                                name: item?.company_name || item?.name,
                                                value: item?.id,
                                            }))}
                                        />
                                        }
                                        onChange={([selected]) => {
                                            setEmployer(selected.target.value);
                                            return selected;
                                        }}
                                        name="employer_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.employer_id}
                                    />
                                    {!!errors?.employer_id && <Error>{errors?.employer_id?.message}</Error>}
                                </div>
                                <div style={{ display: "flex", paddingBottom: "10px" }}>
                                    <div className="p-2">
                                        <Button type="button" onClick={onAdd}>
                                            <i className="ti ti-plus"></i> Add
                                        </Button>
                                    </div>
                                </div>
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
                            </div>
                            {/*Employee*/}
                            <div>
                                <div className="p-2">
                                    <Controller
                                        as={<Select
                                            label="Select Employee"
                                            placeholder="Select Employee"
                                            required={false}
                                            isRequired={true}
                                            options={EmployeeFilterData?.map((item) => ({
                                                id: item?.id,
                                                name: item?.company_name || item?.name,
                                                value: item?.id,
                                            }))}
                                        />
                                        }
                                        onChange={([selected]) => {
                                            setEmployee(selected.target.value);
                                            return selected;
                                        }}
                                        name="employee_id"
                                        control={control}
                                        defaultValue={""}
                                        error={errors && errors.employee_id}
                                    />
                                    {!!errors?.employee_id && <Error>{errors?.employee_id?.message}</Error>}

                                </div>
                                <div style={{ display: "flex", paddingBottom: "10px" }}>
                                    <div className="p-2">
                                        <Button type="button" onClick={onAddEmployee}>
                                            <i className="ti ti-plus"></i> Add
                                        </Button>
                                    </div>
                                </div>
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
                            </div>
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
                            {notification_type_id === 2 && !!actionTypes.length && <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Action Type"
                                            placeholder="Select Action Type"
                                            required={false}
                                            isRequired={true}
                                            options={actionTypes?.map((item) => ({
                                                id: item?.id,
                                                name: item?.name,
                                                value: item?.id,
                                            }))}
                                        />
                                    }
                                    name="action_type_id"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.action_type_id}
                                />
                                {!!errors?.action_type_id && <Error>{errors?.action_type_id?.message}</Error>}
                            </div>}
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
                    </div>
                </Card>
                <Card title="Notification Parameters">
                    <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                        {/*content*/}
                        <CarausalDiv style={{ borderBottom: 'none' }}>
                            <div style={{ padding: "10px", marginTop: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <SelectSpan style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                                        Content
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
                    <Row xs={1} sm={2} md={3} lg={4} xl={4}>
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
                            />
                            {!!errors?.link && <Error>{errors?.link?.message}</Error>}
                        </div>
                        <div className="p-2">
                            <Controller
                                as={<Input label="Title" placeholder="Enter Title" isRequired={true} />}
                                name="title"
                                control={control}
                                error={errors && errors.title}

                            />
                            {!!errors?.title && <Error>{errors?.title?.message}</Error>}
                        </div>
                        <div className="p-2">
                            <Controller
                                as={
                                    <DatePicker
                                        name={'start_date'}
                                        label={'Start Date'}
                                        minDate={new Date()}
                                        required={false}
                                        isRequired={true}
                                    />
                                }
                                onChange={([selected]) => {
                                    setMinDate(selected ? format(selected, 'dd-MM-yyyy') : '')
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
                                        name={'end_date'}
                                        label={'End Date'}
                                        required={false}
                                        isRequired={true}
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
            </form>
        </>
    )
}
export default AddComponent;
