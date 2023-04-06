/* eslint-disable eqeqeq */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Select, Card, Error, Loader, TabWrapper, Tab, NoDataFound, SelectComponent } from "../../components";
import Table from "./table";
import * as yup from 'yup';
import swal from "sweetalert";
// import _ from "lodash";
import { TATModal } from "./Modal";
import AddTAT from "./addTAT";

import { loadBroker } from "../announcements/announcement.slice";

import { InsurerAll } from "../RFQ/home/home.slice";

import { getAllTATQuery, getAllBrokerTATQuery, clear } from "./TATConfig.slice";

import { getTATQueryUserWise } from "./TATHelper";

// import { getUserDataDropdown, selectdropdownData } from "../user-management/user.slice";

import {
    fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";


const TATConfig = ({ myModule }) => {
    const dispatch = useDispatch();
    const { userType } = useParams();
    const [modal, setModal] = useState();
    const [show, setShow] = useState(false);

    const validationSchema = yup.object().shape({
        ...(userType === "admin" && {
            broker_id: yup.string().required("Please select broker"),
            ic_id: yup.string().required("Please select insurer"),
        }),

    })

    const { broker: brokerData,
    } = useSelector(state => state.announcement);
    const { employers,
        firstPage,
        lastPage, } = useSelector(
            (state) => state.networkhospitalbroker
        );
    const { AllTATQueryData, loading, success, error } = useSelector((state) => state.TATConfig);

    const { insurer } = useSelector(state => state.RFQHome);

    const loginState = useSelector(state => state.login);
    // const dropDown = useSelector(selectdropdownData);
    const { currentUser, userType: currentUserType } = loginState;
    const [tab, setTab] = useState("broker");
    const { control, errors, watch, setValue } = useForm({
        validationSchema,
    });

    const BorkerID = watch('broker_id');
    const InsurerID = watch('ic_id');
    const EmployerID = watch('employer_id')?.id;

    const EditTATQueryData = (data) => {
        setModal(data);
    };

    useEffect(() => {
        return () => {
            dispatch(setPageData({
                firstPage: 1,
                lastPage: 1
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if ((currentUser?.broker_id) && currentUserType !== "Employee") {
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
        setValue([
            { broker_id: "" },
            { ic_id: "" },
            { employer_id: "" },
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    useEffect(() => {
        if (userType === 'admin') {
            dispatch(loadBroker())
            dispatch(InsurerAll());
        }
        // if (userType === 'broker')
        //     dispatch(getUserDataDropdown({ status: 1, type: 'Employer', currentUser: 'Broker', per_page: 10000 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType]);

    useEffect(() => {
        if ((BorkerID && tab === 'broker') || (InsurerID && tab === 'insurer')) {
            dispatch(getAllTATQuery(
                { ...(BorkerID ? { broker_id: BorkerID } : { ic_id: InsurerID }) }
            ))
        }
        if (userType === "broker" && EmployerID) {
            dispatch(getAllBrokerTATQuery(
                { broker_id: currentUser?.broker_id, employer_id: EmployerID }
            ))
        }
        else {
            if (userType === "broker" && tab !== 'employer')
                getTATQueryUserWise(currentUser, dispatch, getAllTATQuery)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BorkerID, InsurerID, currentUser, EmployerID, tab])

    useEffect(() => {
        if (currentUser?.broker_id && tab !== "employer") {
            dispatch(getAllTATQuery({ broker_id: currentUser?.broker_id }))
        }
        else {
            dispatch(clear('AllTATQuery'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, tab])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                if (BorkerID || InsurerID) {
                    dispatch(getAllTATQuery(
                        { ...(BorkerID ? { broker_id: BorkerID } : { ic_id: InsurerID }) }
                    ))
                }
                if (userType === "broker" && EmployerID) {
                    dispatch(getAllBrokerTATQuery(
                        { broker_id: currentUser?.broker_id, employer_id: EmployerID }
                    ))
                }
                else {
                    if (userType === "broker" && tab !== 'employer')
                        getTATQueryUserWise(currentUser, dispatch, getAllTATQuery)
                }
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        // return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    return (
        <>
            <Card
                title={
                    <div className="d-flex justify-content-between">
                        <span>Query TAT Configurator</span>
                        {!!myModule?.canwrite && <div>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setShow(true);
                                }}
                                className="shadow-sm m-1 rounded-lg"
                            >
                                <strong>Add TAT Query +</strong>
                            </Button>
                        </div>}
                    </div>
                }>
                {userType === 'admin' && <><TabWrapper width='max-content'>
                    <Tab isActive={Boolean(tab === "broker")} onClick={() => setTab("broker")} className="d-block">Broker</Tab>
                    <Tab isActive={Boolean(tab === "insurer")} onClick={() => setTab("insurer")} className="d-block">Insurer</Tab>

                </TabWrapper>
                    {tab === "broker" ?
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
                                    name="broker_id"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.broker_id}
                                />
                                {!!errors?.broker_id && <Error>{errors?.broker_id?.message}</Error>}
                            </div>
                        </div>
                        :
                        <div>
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Insurer"
                                            placeholder='Select insurer'
                                            required={false}
                                            isRequired={true}
                                            options={insurer.map((item) => ({
                                                id: item?.id,
                                                name: item?.name,
                                                value: item?.id,
                                            }))}
                                        />
                                    }
                                    name="ic_id"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.ic_id}
                                />
                                {!!errors?.ic_id && <Error>{errors?.ic_id?.message}</Error>}
                            </div>
                        </div>
                    }
                </>
                }
                {userType === 'broker' && <TabWrapper width='max-content'>
                    <Tab isActive={Boolean(tab === "broker")} onClick={() => setTab("broker")} className="d-block">Organization</Tab>
                    <Tab isActive={Boolean(tab === "employer")} onClick={() => setTab("employer")} className="d-block">Employer</Tab>
                </TabWrapper>}
                {(userType === "broker" && tab === "employer") &&
                    <div>
                        <div className="p-2">
                            <Controller
                                as={
                                    <SelectComponent
                                        label="Employer"
                                        placeholder='Select Employer'
                                        required={false}
                                        isRequired={true}
                                        options={employers?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        }))}
                                    />
                                }
                                name="employer_id"
                                control={control}
                                defaultValue={""}
                                error={errors && errors.employer_id}
                            />
                            {!!errors?.employer_id && <Error>{errors?.employer_id?.message}</Error>}
                        </div>
                    </div>

                }
                {AllTATQueryData.length > 0 ? <Table myModule={myModule} data={AllTATQueryData} EditTATQuery={EditTATQueryData} /> :
                    <NoDataFound />
                }
            </Card>
            {!!modal && (
                <TATModal
                    show={!!modal}
                    onHide={() => setModal(null)}
                    Data={modal}
                    UT={userType}
                    CU={currentUser}
                // id={company_data.id}
                // relations={industry_data?.relations}
                />
            )}
            <AddTAT
                show={show}
                onHide={() => setShow(false)}
                userType={userType}
                currentUser={currentUser}
                BrokerData={brokerData}
                BrokerID={BorkerID}
                ICID={InsurerID}
                EmployerID={EmployerID}
            />
            {loading && <Loader />}
        </>
    )
}


export default TATConfig;
