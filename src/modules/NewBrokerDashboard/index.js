import React, { useLayoutEffect, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import axios from 'axios';

import Card from "./LocalComponent/Card";
import IconCard from "./LocalComponent/IconCard";
import Table from "./LocalComponent/Table";
import Map from "./LocalComponent/Map";
import style from "./style.module.css";
import {
    GetQueriesCount, GetEndorsementCount, GetAllClaimCount, GetAllEmailLogs,
    GetInsurerAndTpa, GetEnrolmentInProgress, GetStates, GetMapWiseBusinessDetails, setAllDataClear,
    GetLiveCaselessClaim, GetEmployers, setShowingPolicyNumberOrName,
    GetPolicySubType, GetWidgetsData, GetPolicyDetails, setOnSearchData
} from "./newbrokerDashboard.slice";
import { Loader, NoDataFound } from "components";
// import { getWidgetsData, selectWidgetsData } from "modules/dashboard/dashboard_broker/dashboard_broker.slice";
import FilterModal from "./LocalComponent/Modal/FilterModal";
import MapModal from "./LocalComponent/Modal/MapModal";
import Button from "./LocalComponent/Button";
import { NumberInd } from "utils";
import SelectComponent from "./LocalComponent/Select";
import picker from "./LocalComponent/Picker/style.module.css";
// import Date from "./LocalComponent/Date";

import dateStyles from "./LocalComponent/Date/style.module.css";
import DateComponent from "./LocalComponent/Date";
import {
    fetchEmployers,
    setPageData, clearDD, fetchPolicies, getPolicies
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
    clear as policyTypeClear
} from "modules/EndorsementRequest/EndorsementRequest.slice";

// const filterOptions = [
//     { id: 1, text: "OPTION 1", handleOnClick: () => { } },
//     { id: 2, text: "OPTION 2", handleOnClick: () => { } },
//     { id: 3, text: "OPTION 3", handleOnClick: () => { } },
// ]
const ResetButton = styled.div`
  color: ${({ theme }) => theme.Button?.warning?.background || "#ff3c46"};
`;
const SuccessButton = styled.div`
  color: ${({ theme }) => theme.Button?.default?.background || "#ff3c46"};
`;
let cancelTokenSource;
const NewBrokerDashboard = () => {

    const { handleSubmit, watch, reset, control, setValue } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const employerId = (watch("employer_id") || {});
    const policyTypeID = (watch("policy_sub_type_id") || {})?.id;

    const { loading, allEmailLogs, totalQueriesCount,
        totalQueriesNotResolvedCount, totalQueriesResolvedCount,
        endorsmentCount, communicationLoading, claimCount,
        claimCountLoading, enrolmentInProgress,
        enrolmentInProgressLoading, mapStates, liveCaselessClaimLoading, policySubType,
        liveCaselessClaim, currentStateInfo, getWidgetsDataResponse, /* showingPolicyNumberOrName, */
        getWidgetsDataResponseLoading, employerDropdownData, policyDetails, policyDetailsloading,
        onSearchData
    } = useSelector(state => state.NewBrokerDashboard);
    const { userType: userTypeName, currentUser } = useSelector(state => state.login);
    // const WidgetData = useSelector(selectWidgetsData);
    const { employers,
        firstPage,
        lastPage, policies } = useSelector(
            (state) => state.networkhospitalbroker
        );

    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);
    const [mapModal, setMapModal] = useState(false);
    const [dates, setDates] = useState([]);
    const [selectedEmployer, setSelectedEmployer] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const handleClick = (e) => {
        setIsOpen(!isOpen);
        e.preventDefault();
    };

    const chartOptions = {
        series: [{
            name: 'Deletion',
            data: endorsmentCount?.removed || []
        }, {
            name: 'Addition',
            data: endorsmentCount?.addition || []
        }, {
            name: 'Updation',
            data: endorsmentCount?.updation || []
        }],
        options: {
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: endorsmentCount?.months || []
            },
            yaxis: [
                {
                    labels: {
                        formatter: function (val) {
                            return val.toFixed(0);
                        }
                    }
                }
            ]
        },
    };


    const LoadDefaultData = () => {
        if (typeof cancelTokenSource != typeof undefined) {
            cancelTokenSource.cancel()
        }
        cancelTokenSource = axios.CancelToken.source();
        const payload = {
            is_child_company: 0,
            // ...((!!currentUser?.is_super_hr || userTypeName === "Broker")
            //      && { is_child_company: 1 }),
            broker_id: currentUser?.broker_id,
            policy_sub_type_id: 1,
            ...(userTypeName === "Employer" && {
                is_employer: true,
                is_super_hr: currentUser?.is_super_hr,
                employer_id: [currentUser?.employer_id]
            })
        }
        dispatch(GetWidgetsData(payload));
        dispatch(GetQueriesCount(
            payload
        ));
        dispatch(GetEndorsementCount(
            payload
        ));
        dispatch(GetAllEmailLogs(
            payload
        ));
        dispatch(GetAllClaimCount(
            payload
        ));
        dispatch(GetEnrolmentInProgress(
            payload
        ));
        dispatch(GetLiveCaselessClaim(
            payload
        ));
        dispatch(GetStates(
            payload
        ));
        dispatch(GetPolicySubType(
            payload
        ));
        dispatch(GetPolicyDetails(
            payload, cancelTokenSource
        ));
        reset({
            from_date: "",
            to_date: "",
            master_system_trigger_id: "",
            employer_id: "",
            policy_id: "",
            log_type: "",
            policy_sub_type_id: "",
            insurer_id: "",
            tpa_id: "",
        });
        setSelectedEmployer({});
    }

    useEffect(() => {
        if(policySubType?.length) {
            setValue("policy_sub_type_id",{
                "id": 1,
                "value": 1,
                "label": "Group Mediclaim"
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[policySubType])

    useEffect(() => {
        if(employerId?.id) {
            setValue("policy_sub_type_id","");
            setValue("policy_id","");
            dispatch(getPolicies([]));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[employerId?.id]);
    
    useEffect(() => {
        dispatch(GetInsurerAndTpa());
        return () => {
            dispatch(setPageData({
                firstPage: 1,
                lastPage: 1
            }))
            dispatch(setAllDataClear());
            dispatch(clearDD('employer'));
            dispatch(clearDD('policyST'));
            dispatch(clearDD('policy'));
            dispatch(policyTypeClear('broker'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const cancelTokenGetWidgetsData = axios.CancelToken.source();
        const cancelTokenGetQueriesCount = axios.CancelToken.source();
        const cancelTokenGetEndorsementCount = axios.CancelToken.source();
        const cancelTokenGetAllEmailLogs = axios.CancelToken.source();
        const cancelTokenGetAllClaimCount = axios.CancelToken.source();
        const cancelTokenGetEnrolmentInProgress = axios.CancelToken.source();
        const cancelTokenGetLiveCaselessClaim = axios.CancelToken.source();
        const cancelTokenGetStates = axios.CancelToken.source();
        const cancelTokenGetPolicyDetails = axios.CancelToken.source();
        if (onSearchData) {
            if (onSearchData?.show === "Global") {
                setSelectedEmployer(employerId);
                dispatch(GetWidgetsData(onSearchData?.data, cancelTokenGetWidgetsData));
                dispatch(GetQueriesCount(
                    onSearchData?.data, cancelTokenGetQueriesCount
                ));
                dispatch(GetEndorsementCount(
                    onSearchData?.data, cancelTokenGetEndorsementCount
                ));
                dispatch(GetAllEmailLogs(
                    onSearchData?.data, cancelTokenGetAllEmailLogs
                ));
                dispatch(GetAllClaimCount(
                    onSearchData?.data, cancelTokenGetAllClaimCount
                ));
                dispatch(GetEnrolmentInProgress(
                    onSearchData?.data, cancelTokenGetEnrolmentInProgress
                ));
                dispatch(GetLiveCaselessClaim(
                    onSearchData?.data, cancelTokenGetLiveCaselessClaim
                ));
                dispatch(GetStates(
                    onSearchData?.data, cancelTokenGetStates
                ));
                dispatch(GetPolicyDetails(
                    onSearchData?.data, cancelTokenGetPolicyDetails
                ));
            } else if (onSearchData?.show === "Queries") {
                dispatch(GetQueriesCount(onSearchData?.data, cancelTokenGetQueriesCount));
            } else if (onSearchData?.show === "Endorsement") {
                dispatch(GetEndorsementCount(onSearchData?.data, cancelTokenGetEndorsementCount));
            } else if (onSearchData?.show === "All Claims") {
                dispatch(GetAllClaimCount(onSearchData?.data, cancelTokenGetAllClaimCount));
            } else if (onSearchData?.show === "Enrolment In Progress") {
                dispatch(GetEnrolmentInProgress(onSearchData?.data, cancelTokenGetEnrolmentInProgress));
            } else if (onSearchData?.show === "Live Cashless Claims") {
                dispatch(GetLiveCaselessClaim(onSearchData?.data, cancelTokenGetLiveCaselessClaim));
            } else if (onSearchData?.show === "Communication") {
                dispatch(GetAllEmailLogs(onSearchData?.data, cancelTokenGetAllEmailLogs));
            }
        }
        return () => {
            if (onSearchData?.show === "Global") {
                cancelTokenGetWidgetsData.cancel();
                cancelTokenGetQueriesCount.cancel();
                cancelTokenGetEndorsementCount.cancel();
                cancelTokenGetAllEmailLogs.cancel();
                cancelTokenGetAllClaimCount.cancel();
                cancelTokenGetEnrolmentInProgress.cancel();
                cancelTokenGetLiveCaselessClaim.cancel();
                cancelTokenGetStates.cancel();
                cancelTokenGetPolicyDetails.cancel();
            } else if (onSearchData?.show === "Queries") {
                cancelTokenGetQueriesCount.cancel();
            } else if (onSearchData?.show === "Endorsement") {
                cancelTokenGetEndorsementCount.cancel();
            } else if (onSearchData?.show === "All Claims") {
                cancelTokenGetAllClaimCount.cancel();
            } else if (onSearchData?.show === "Enrolment In Progress") {
                cancelTokenGetEnrolmentInProgress.cancel();
            } else if (onSearchData?.show === "Live Cashless Claims") {
                cancelTokenGetLiveCaselessClaim.cancel();
            } else if (onSearchData?.show === "Communication") {
                cancelTokenGetAllEmailLogs.cancel();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSearchData]);

    useEffect(() => {
        if ((currentUser?.broker_id && userTypeName === "Broker")) {
            if (lastPage >= firstPage) {
                var _TimeOut = setTimeout(_callback, 250);
            }
            function _callback() {
                dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
            }
            return () => {
                clearTimeout(_TimeOut)
            }
        } else if (userTypeName === "Employer" && !!currentUser?.is_super_hr) {
            dispatch(GetEmployers({
                currentUser: userTypeName,
                is_super_hr: currentUser.is_super_hr
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstPage, currentUser]);

    //get policy id
    useEffect(() => {
        if (policyTypeID && (employerId?.id || currentUser?.employer_id)) {
            dispatch(
                fetchPolicies({
                    user_type_name: userTypeName,
                    employer_id: employerId?.id || currentUser?.employer_id,
                    policy_sub_type_id: policyTypeID,
                    ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
                }, true)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [policyTypeID]);

    useEffect(() => {
        if (currentUser?.broker_id) {
            LoadDefaultData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    // Map Component API Part
    const handleLocationOnClick = (id) => {
        dispatch(GetMapWiseBusinessDetails({
            state_id: id,
            ...(userTypeName === "Employer" && {
                is_employer: true,
                is_super_hr: currentUser?.is_super_hr,
                employer_id: [currentUser?.employer_id]
            })
        }, currentUser, userTypeName));
    }

    useLayoutEffect(() => {

        if (!claimCountLoading) {
            let chart = am4core.create("chartdivnewbroker", am4charts.PieChart);
            chart.logo.disabled = true;
            chart.data = [{
                "country": "Claim Pending",
                "litres": claimCount?.claim_pending || 0,
                "color": am4core.color("#3734a9")
            }, {
                "country": "Claim Settled",
                "litres": claimCount?.claim_settled || 0,
                "color": am4core.color("#00c1ff")
            }, {
                "country": "Claim Rejected",
                "litres": claimCount?.claim_rejected || 0,
                "color": am4core.color("#ff00d6")
            },];
            // Add and configure Series
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.slices.template.propertyFields.fill = "color";
            pieSeries.dataFields.value = "litres";
            pieSeries.dataFields.category = "country";
            pieSeries.labels.template.disabled = true;
            pieSeries.ticks.template.disabled = true;

            chart.legend = new am4charts.Legend();
            chart.legend.useDefaultMarker = true;
            chart.legend.labels.template.fontSize = "10";
            chart.legend.labels.template.fontWeight = "bold";
            chart.legend.markers.template.height = "10";
            var marker = chart.legend.markers.template.children.getIndex(0);
            marker.cornerRadius(12, 12, 12, 12);
            marker.strokeWidth = 0;
            marker.strokeOpacity = 1;
            marker.stroke = am4core.color("#ccc");

            chart.innerRadius = am4core.percent(50);

            var label = pieSeries.createChild(am4core.Label);
            label.html = `<div style="text-align: center;">
                <span style='font-size: 18px; font-weight: bold;'>${claimCount?.claim_registered || 0}</span>
                <span style="font-size: 10px; display: block; font-weight: bold;">Claim Registered</span>
            </div>`;
            label.truncate = true;
            label.ellipsis = true;
            label.horizontalCenter = "middle";
            label.verticalCenter = "middle";
            label.textAlign = "middle";
            label.fontSize = 20;
        }
    }, [claimCount, claimCountLoading]);

    const columns = [
        { Header: "Employee Name", accessor: "employee_name" },
        { Header: "Corporate Name", accessor: "employer_name" },
        {
            Header: "Claim Status", accessor: "current_status",
            cell: (e) => <Button type={
                e?.current_status
                // e?.claim_status === "approved" ? "success" :
                //     e?.claim_status === "pending" ? "pending" : "danger"
            }
            />
        },
        { Header: "TAT", accessor: "tat" },
    ]
    const onSubmit = (data) => {
        if (typeof cancelTokenSource != typeof undefined) {
            cancelTokenSource.cancel();
        }
        if (!!data?.employer_id?.id) {
            dispatch(setShowingPolicyNumberOrName(true));
        } else {
            dispatch(setShowingPolicyNumberOrName(false));
        }
        if (!!data?.employer_id?.id || !!data?.insurer_id?.id ||
            !!data?.tpa_id?.id || !!data?.policy_sub_type_id?.id || !!data?.policy_id?.id
            || !!dates?.from_date || !!dates?.to_date) {
            data = {
                broker_id: currentUser?.broker_id,
                is_child_company: Number(!!data?.employer_id?.id && (!!currentUser?.is_super_hr || userTypeName === "Broker")),
                ...(!!dates?.from_date && { from_date: dates?.from_date }),
                ...(!!dates?.to_date && { to_date: dates?.to_date }),
                ...(!!data?.employer_id?.id && { employer_id: [data?.employer_id?.id] }),
                ...(!!data?.insurer_id?.id && { insurer_id: data?.insurer_id?.id }),
                ...(!!data?.tpa_id?.id && { tpa_id: data?.tpa_id?.id }),
                ...((!!data?.policy_sub_type_id?.id && +data?.policy_sub_type_id?.id !== 999) && { policy_sub_type_id: data?.policy_sub_type_id?.id }),
                ...(!!data?.policy_id?.id && { policy_id: [data?.policy_id?.id] }),
                ...(userTypeName === "Employer" && {
                    is_employer: true,
                    is_super_hr: currentUser?.is_super_hr,
                    ...((!data?.employer_id?.id) && { employer_id: [currentUser?.employer_id] }),
                })
            };
            dispatch(setOnSearchData({ data, show: "Global" }));
            // dispatch(GetWidgetsData(data));
            // dispatch(GetQueriesCount(
            //     data
            // ));
            // dispatch(GetEndorsementCount(
            //     data
            // ));
            // dispatch(GetAllEmailLogs(
            //     data
            // ));
            // dispatch(GetAllClaimCount(
            //     data
            // ));
            // dispatch(GetEnrolmentInProgress(
            //     data
            // ));
            // dispatch(GetLiveCaselessClaim(
            //     data
            // ));
            // dispatch(GetStates(
            //     data
            // ));
            // dispatch(GetPolicyDetails(
            //     data
            // ));
        }
    }

    function compare(a, b) {
        if (+a.policy_sub_type_id < +b.policy_sub_type_id) {
            return -1;
        }
        if (+a.policy_sub_type_id > +b.policy_sub_type_id) {
            return 1;
        }
        return 0;
    }
    const handleErase = () => {
        reset({
            from_date: "",
            to_date: "",
            master_system_trigger_id: "",
            employer_id: "",
            policy_id: "",
            log_type: "",
            policy_sub_type_id: "",
            insurer_id: "",
            tpa_id: "",
        });
        setDates({});
        LoadDefaultData();
    }
    const renderLink = (defaultLink) => {
        const [link, param] = defaultLink.split("?");
        if(currentUser?.employer_id || selectedEmployer?.id) {
            const dynamicLink = `${link}?name=${selectedEmployer?.label || currentUser?.employer_name}&id=${selectedEmployer?.id || currentUser?.employer_id}&${param}`;
            return dynamicLink;
        }
        return defaultLink
    }
    return (
        <>
            <div className={style.container}>
                <div className={style.main}>
                    <div className={style.header}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p className={style.heading}>
                                    {userTypeName === "Employer" ? `Hello, ${currentUser?.name}` : "Dashboard"}
                                </p>
                            </div>
                            <div onClick={() => setModal("Global")} className={style.filterIconBox}>
                                <img className={style.filterIcon} src="/assets/images/newbrokerdashboard/filter.png" alt="" />
                            </div>
                        </div>
                        {/* <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere perferendis
                            dolor quaerat odit, velit dolore voluptatem commodi ducimus expedita temporibus at
                            ex eos cumque, ipsam minima sit voluptatum laboriosam molestiae.
                        </p> */}
                    </div>
                    <div className={style.globalFilterContainer}>
                        {(userTypeName === "Broker" || !!currentUser?.is_super_hr) && <div className={style.globalFilterBox}>
                            <Controller
                                as={
                                    <SelectComponent
                                        selectType="new"
                                        label={"Corporate"}
                                        placeholder={"Corporate"}
                                        options={[...employerDropdownData, ...employers]?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        })) || []}
                                        required={false}
                                        isRequired={true}
                                    />
                                }
                                name="employer_id"
                                control={control}
                                defaultValue={""}
                            />
                        </div>}
                        <div className={style.globalFilterBox}>
                            <Controller
                                as={
                                    <SelectComponent
                                        selectType="new"
                                        label={"Cover Type"}
                                        placeholder={"Cover Type"}
                                        options={policySubType?.map((item) => ({
                                            id: item?.policy_sub_type_id,
                                            label: item?.policy_sub_type,
                                            value: item?.policy_sub_type_id,
                                        })) || []}
                                        required={false}
                                        isRequired={true}
                                    />
                                }
                                name="policy_sub_type_id"
                                control={control}
                                defaultValue={""}
                            />
                        </div>
                        <div className={style.globalFilterBox}>
                            <Controller
                                as={
                                    <SelectComponent
                                        selectType="new"
                                        label={"Policy Name"}
                                        placeholder={"Policy Name"}
                                        options={((!!employerId?.id || (!currentUser?.is_super_hr && userTypeName === "Employer")) && policies?.map((item) => ({
                                            id: item?.id,
                                            label: item?.number,
                                            value: item?.id,
                                        }))) || []}
                                        required={false}
                                        isRequired={true}
                                    />
                                }
                                name="policy_id"
                                control={control}
                                defaultValue={""}
                            />
                        </div>
                        <div className={style.globalFilterBox}>
                            <div className="d-flex justify-content-between align-items-center" style={{
                                cursor: "pointer"
                            }} onClick={handleClick}>
                                <div className={dateStyles.cardBody}>
                                    <div className={dateStyles.textBox}>
                                        <p className={dateStyles.title}>Date</p>
                                        {!!dates?.from_date && !!dates.to_date && <>
                                            <div>
                                                <p className={dateStyles.text}>From: {dates?.from_date}</p>
                                            </div>
                                            <div>
                                                <p className={dateStyles.text}>To: {dates.to_date}</p>
                                            </div>
                                        </>}
                                    </div>
                                </div>
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                        </div>
                        <div className={style.globalFilterBox3}>
                            <div className={picker.cardBody2}>
                                <div className={picker.textBox2}>
                                    {/* <p className={picker.title2}>{boldText}</p> */}
                                    <div className="d-flex justify-content-center align-items-center w-100">
                                        <ResetButton className="mx-2 border px-2 text-center" onClick={handleErase}>
                                            <i className="fas fa-eraser"></i>
                                            <small style={{
                                                display: "block",
                                                margin: "0px",
                                                padding: "0px",
                                                fontSize: "8px"
                                            }}>Reset</small>
                                        </ResetButton>
                                        <SuccessButton className="border px-2 text-center" onClick={handleSubmit(onSubmit)}>
                                            <i className="fas fa-search"></i>
                                            <small style={{
                                                display: "block",
                                                margin: "0px",
                                                padding: "0px",
                                                fontSize: "8px"
                                            }}>Search</small>
                                        </SuccessButton>
                                    </div>
                                    {/* <div onClick={handleSubmit(onSubmit)} className={picker.filterIconBoxButton}>
                                        Search
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className={style.globalFilterBox2}>
                            <div className={picker.cardBody2}>
                                <div className={picker.textBox3}>
                                    {/* <p className={picker.title2}>{boldText}</p> */}
                                    <div onClick={() => setModal("Global")} className={picker.filterIconBox2}>
                                        <img className={picker.filterIcon2} src="/assets/images/newbrokerdashboard/filter.png" alt="" />
                                        <small style={{
                                            display: "block",
                                            margin: "0px",
                                            padding: "0px",
                                            fontSize: "8px"
                                        }}>More</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.cardType1Container}>
                        {getWidgetsDataResponse?.data?.headings?.map((item, index) => (
                            <div className={style.cardType1} key={'widgt102' + index}>
                                <Link to={!_.isEmpty(getWidgetsDataResponse?.data?.links)
                                    ? ([`/${userTypeName?.toLowerCase()}/policies?type=active`, `/${userTypeName?.toLowerCase()}/policies?type=inactive`]?.includes(getWidgetsDataResponse?.data?.links[index]) ?
                                       renderLink(getWidgetsDataResponse?.data?.links[index]) : getWidgetsDataResponse?.data?.links[index]
                                    )
                                    : "/home"}
                                    style={{ textDecoration: "none" }}>

                                    <IconCard
                                        Hex1={getWidgetsDataResponse?.data?.combinations[index].hex1}
                                        Hex2={getWidgetsDataResponse?.data?.combinations[index].hex2}
                                        text={item}
                                        boldText={getWidgetsDataResponse?.data?.data[`${item}`]}
                                        img={getWidgetsDataResponse?.data?.icons[index]?.icon}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className={style.enrolmentEndorsementContainer}>
                        <div className={style.enrolmentContainer}>
                            <Card
                                cardTitle={"Enrolment In Progress"} isOnClickFilter={true}
                                filterFuntion={() => setModal("Enrolment In Progress")}
                            >
                                {!enrolmentInProgressLoading && (!!enrolmentInProgress?.length ? <div className={style.enrolmentContainerInner}>
                                    {enrolmentInProgress?.map((item, index) => <IconCard
                                        key={"enrolmentinprogress" + index}
                                        cardType={2}
                                        userTypeName={userTypeName}
                                        corporateName={item?.employer_name}
                                        policyName={item?.policy_name}
                                        policyNumber={item?.policy_number}
                                        enrolmentProgressStatus={item?.enrolment_progress_status}
                                        enrolmentEndDate={item?.enrolment_end_date || ""}
                                    />)}
                                </div> : <div
                                    style={{
                                        height: "225px"
                                    }}
                                    className="d-flex justify-content-center align-items-center">
                                    <h1>No Data Found</h1>
                                </div>)}
                                {enrolmentInProgressLoading && <div
                                    style={{
                                        height: "225px"
                                    }}
                                    className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border" style={{
                                        width: "5rem",
                                        height: "5rem"
                                    }} role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                            </Card>
                        </div>
                        <div className={style.endorsementContainer}>
                            <Card
                                cardTitle={"Endorsement"}
                                isOnClickFilter={true}
                                filterFuntion={() => setModal("Endorsement")}
                            >
                                <Chart
                                    options={chartOptions.options}
                                    series={chartOptions.series}
                                    type="area"
                                    height={210}
                                />
                            </Card>
                        </div>
                    </div>
                    <div className={style.claimsGraphAndTableContainer}>
                        <div className={style.claimsGraphContainer}>
                            <Card
                                cardTitle={"All Claims"} isOnClickFilter={true}
                                filterFuntion={() => setModal("All Claims")}
                            >
                                {!claimCountLoading && <div className={style.graph} id="chartdivnewbroker"></div>}
                                {claimCountLoading && <div
                                    style={{
                                        height: "300px"
                                    }}
                                    className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border" style={{
                                        width: "5rem",
                                        height: "5rem"
                                    }} role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                            </Card>
                        </div>
                        <div className={style.claimsTableContainer}>
                            <Card cardTitle={"Live Cashless Claims"} isOnClickFilter={true}
                                filterFuntion={() => setModal("Live Cashless Claims")}>
                                {!liveCaselessClaimLoading && (!!liveCaselessClaim.length ? <div className={style.table}>
                                    <Table dataFromAPI={liveCaselessClaim} columns={columns} />
                                    {/* <Table dataFromAPI={data} columns={columns} /> */}
                                </div> : <div
                                    style={{
                                        height: "300px"
                                    }}
                                    className="d-flex justify-content-center align-items-center">
                                    <h1>Coming Soon</h1>
                                </div>)}
                                {liveCaselessClaimLoading && <div
                                    style={{
                                        height: "300px"
                                    }}
                                    className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border" style={{
                                        width: "5rem",
                                        height: "5rem"
                                    }} role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                            </Card>
                        </div>
                    </div>
                </div>
                <div className={style.sideBar}>
                    <div className={style.mapContainer}>
                        {(!!currentStateInfo?.length && !mapModal) && <div className={style.stateDetails}>
                            <span className={style.mapSpan}>State: <b>{currentStateInfo[0]?.state_name}</b></span>
                            {!!(+currentStateInfo[0]?.premium + +currentStateInfo[0]?.opd_premium) &&
                                <span className={style.mapSpan}>
                                    Total Premium: <b>{NumberInd(+currentStateInfo[0]?.premium + +currentStateInfo[0]?.opd_premium)}</b>
                                </span>}
                            {/* <span className={style.mapSpan}>OPD Premium: {currentStateInfo[0]?.opd_premium}</span> */}
                        </div>}
                        <div className={style.mapInnerContainer}>
                            <Map statesFromAPI={mapStates} handleOnLocationClick={handleLocationOnClick} />
                        </div>
                        <img onClick={() => setMapModal(true)} className={style.mapZoom}
                            src="/assets/images/newbrokerdashboard/zoom.png" alt="" />
                    </div>
                    <div className={style.queryCommunicationContainer}>
                        <div className={style.queryContainer}>
                            <Card
                                cardTitle={"Queries"}
                                isOnClickFilter={true}
                                filterFuntion={() => setModal("Queries")}
                                shadow={false}
                                headerBorder={false}
                            >
                                <IconCard boldText={totalQueriesCount} cardType={3} />
                                <div className={style.queryStatus}>
                                    <IconCard
                                        cardType={4}
                                        text={"Close"}
                                        boldText={totalQueriesResolvedCount}
                                    />
                                    <IconCard
                                        text={"Open"}
                                        boldText={totalQueriesNotResolvedCount}
                                        cardType={4}
                                        icon={"arrowdown"}
                                    />
                                </div>
                            </Card>
                        </div>
                        <div className={style.communicationContainer}>
                            <Card
                                cardTitle={"Communication"}
                                shadow={false}
                                headerBorder={false}
                                isOnClickFilter={true}
                                filterFuntion={() => setModal("Communication")}
                            >
                                <div className={style.communicationHeight}>
                                    {!communicationLoading && allEmailLogs?.map((data, index) => <div
                                        key={"EmailCommunication" + index} className={style.communicationBox}>
                                        <div className={style.commTextCon}>
                                            <p className={style.commText}>{data?.master_event_trigger_name}</p>
                                        </div>
                                        <p className={style.commTitle}>{data?.email_log_count_sent_trigger_on}</p>
                                    </div>)}
                                    {communicationLoading && <div
                                        style={{
                                            height: "208px"
                                        }}
                                        className="d-flex justify-content-center align-items-center">
                                        <div className="spinner-border" style={{
                                            width: "5rem",
                                            height: "5rem"
                                        }} role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                {(loading || getWidgetsDataResponseLoading) && <Loader />}
                {modal && <FilterModal loadDefault={LoadDefaultData} show={modal} onHide={() => setModal(false)} />}
                {isOpen && <DateComponent
                    show={isOpen}
                    onHide={() => setIsOpen(false)}
                    setDates={((dates) => setDates(dates))}
                />}
                {mapModal && <MapModal
                    statesFromAPI={mapStates}
                    show={mapModal}
                    onHide={() => setMapModal(false)}
                    handleLocationOnClick={handleLocationOnClick}
                />}
            </div>
            {<div className={style.policyContainer}>
                <Card
                    cardTitle={"Policy"}
                // isOnClickFilter={true}
                // filterFuntion={() => setModal("Communication")}
                >
                    {!policyDetailsloading && (!!policyDetails.length ? <div className="row">
                        {!!policyDetails?.some(item => [1, 4].includes(item.policy_sub_type_id)) && <div className="col-12 col-md-6 col-sm-12 col-lg-4">
                            {policyDetails?.filter(item => [1, 4].includes(item.policy_sub_type_id))?.sort(compare)
                                ?.map((item, index) => {
                                    return <div
                                        key={"policyDetails" + index}
                                    // className="col-12 col-md-6 col-sm-12 col-lg-4"
                                    >
                                        <IconCard
                                            cardType={5}
                                            boldText={
                                                !!item?.policy_name ? item?.policy_name : item?.policy_sub_type
                                                // ((userTypeName === "Employer" && !currentUser?.is_super_hr) || showingPolicyNumberOrName) ?
                                                //     item?.policy_number
                                                //     : item?.policy_sub_type
                                            }
                                            lossRatio={item?.loss_ratio}
                                            lives={item?.total_lives}
                                            cover={item?.members_covered}
                                            premium={item?.premium}
                                        />
                                    </div>
                                })}
                        </div>}
                        {!!policyDetails?.some(item => [2, 5].includes(item.policy_sub_type_id)) && <div className="col-12 col-md-6 col-sm-12 col-lg-4">
                            {policyDetails?.filter(item => [2, 5].includes(item.policy_sub_type_id))?.sort(compare)
                                ?.map((item, index) => {
                                    return <div
                                        key={"policyDetailsj" + index}
                                    // className="col-12 col-md-6 col-sm-12 col-lg-4"
                                    >
                                        <IconCard
                                            cardType={5}
                                            boldText={
                                                !!item?.policy_name ? item?.policy_name : item?.policy_sub_type
                                            }
                                            // boldText={
                                            //     ((userTypeName === "Employer" && !currentUser?.is_super_hr) || showingPolicyNumberOrName) ?
                                            //         item?.policy_number
                                            //         : item?.policy_sub_type}
                                            lossRatio={item?.loss_ratio}
                                            lives={item?.total_lives}
                                            cover={item?.members_covered}
                                            premium={item?.premium}
                                        />
                                    </div>
                                })}
                        </div>}
                        {!!policyDetails?.some(item => [3, 6].includes(item.policy_sub_type_id)) && <div className="col-12 col-md-6 col-sm-12 col-lg-4">
                            {policyDetails?.filter(item => [3, 6].includes(item.policy_sub_type_id))?.sort(compare)
                                ?.map((item, index) => {
                                    return <div
                                        key={"policyDetailsjk" + index}
                                    // className="col-12 col-md-6 col-sm-12 col-lg-4"
                                    >
                                        <IconCard
                                            cardType={5}
                                            boldText={
                                                !!item?.policy_name ? item?.policy_name : item?.policy_sub_type
                                            }
                                            // boldText={
                                            //     ((userTypeName === "Employer" && !currentUser?.is_super_hr) || showingPolicyNumberOrName) ?
                                            //         item?.policy_number
                                            //         : item?.policy_sub_type}
                                            lossRatio={item?.loss_ratio}
                                            lives={item?.total_lives}
                                            cover={item?.members_covered}
                                            premium={item?.premium}
                                        />
                                    </div>
                                })}
                        </div>}
                    </div> : <NoDataFound />)}
                    {policyDetailsloading && <div
                        style={{
                            height: "200px"
                        }}
                        className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border" style={{
                            width: "5rem",
                            height: "5rem"
                        }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}
                </Card>
            </div>}
        </>
    );
}

export default NewBrokerDashboard;
