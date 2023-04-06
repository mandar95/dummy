import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { Button, Col } from "react-bootstrap";

import { Card, NoDataFound, Select, TabWrapper, Tab, Loader } from "components";

import _ from "lodash";
import swal from "sweetalert";
import { DataTable } from "modules/user-management";
import AddRegionMapping from "./AddRegionMapping";
import { TableData, DataTableButtons } from "./helper";

import { loadBroker } from "modules/announcements/announcement.slice";
import { InsurerAll } from "modules/RFQ/home/home.slice";
import {
    getState, selectState, getRegionalMappingdata, deleteRegionalMapping, clear
} from '../user.slice';


export const RegionMapping = ({ myModule }) => {

    const dispatch = useDispatch();
    const { userType } = useParams();
    const states = useSelector(selectState);
    const { regional_data, success, error, loading } = useSelector((state) => state.userManagement);
    const { currentUser } = useSelector((state) => state.login);
    const { broker: brokerData } = useSelector(state => state.announcement);
    const { insurer } = useSelector(state => state.RFQHome);
    const _btnObj = DataTableButtons()
    const [tab, setTab] = useState("broker");
    const [show, setShow] = useState({
        isShow: false,
        isBulkUpload: false,
        isEditData: false
    });
    const [editData, setEditData] = useState(null)

    const { watch, control } = useForm();
    const _brokerId = watch('broker_id');
    let _icId = watch('ic_id');

    const onEdit = (id, data) => {
        setEditData(data);
        setShow({
            isShow: true,
            isBulkUpload: false,
            isEditData: true
        });
    };

    useEffect(() => {
        if (userType === 'admin') {
            dispatch(loadBroker());
            dispatch(InsurerAll())
        }
        dispatch(getState())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let BrokerID = currentUser?.broker_id || _brokerId
        let ICID = currentUser?.ic_id || _icId

        if (BrokerID || ICID) {
            dispatch(getRegionalMappingdata({
                ...(BrokerID && {
                    broker_id: BrokerID
                }),
                ...(ICID && {
                    ic_id: ICID
                })
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_brokerId, _icId, currentUser])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                let BrokerID = currentUser?.broker_id || _brokerId
                let ICID = currentUser?.ic_id || _icId
                dispatch(getRegionalMappingdata({
                    ...(BrokerID && {
                        broker_id: BrokerID
                    }),
                    ...(ICID && {
                        ic_id: ICID
                    })
                }))
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    return (
        <Card title={
            <div className="d-flex justify-content-between">
                <span>Regional Mapping</span>
                {!!myModule?.canwrite && <div>
                    <Button
                        size="sm"
                        onClick={() => {
                            setShow({
                                isShow: true,
                                isBulkUpload: false,
                                isEditData: false
                            });
                        }}
                        className="shadow-sm m-1 rounded-lg"
                    >
                        <strong>Add Region +</strong>
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            setShow({
                                isShow: true,
                                isBulkUpload: true,
                            });
                        }}
                        className="shadow-sm m-1 rounded-lg"
                    >
                        <strong>Bulk Upload</strong>
                    </Button>
                </div>}
            </div>
        }>
            <form>
                {userType === 'admin' &&
                    <>
                        <TabWrapper width='max-content'>
                            <Tab isActive={Boolean(tab === "broker")} onClick={() => setTab("broker")} className="d-block">Broker</Tab>
                            <Tab isActive={Boolean(tab === "insurer")} onClick={() => setTab("insurer")} className="d-block">Insurer</Tab>
                        </TabWrapper>
                        {tab === "broker" &&
                            <Col sm="12" md="12" lg="12" xl="12">
                                <Controller
                                    as={
                                        <Select
                                            label="Broker"
                                            placeholder="Select Broker"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                brokerData?.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="broker_id"
                                    control={control}
                                    defaultValue={""}
                                />
                            </Col>
                        }
                        {tab === "insurer" &&

                            <Col sm="12" md="12" lg="12" xl="12">
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
                                />
                            </Col>
                        }
                    </>
                }
            </form>
            {!_.isEmpty(regional_data) ? (
                <DataTable
                    columns={
                        TableData(
                            _btnObj._statusBtn,
                            _btnObj._btnGroup,
                            myModule
                        ) ||
                        []
                    }
                    data={regional_data}
                    noStatus={true}
                    pageState={{ pageIndex: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10]}
                    rowStyle
                    deleteFlag={!!myModule?.candelete && 'custom_delete'}
                    removeAction={deleteRegionalMapping}
                    EditFlag={!!myModule?.canwrite}
                    EditFunc={onEdit}
                />
            ) : (
                <NoDataFound text='No Data Found' />)}

            <AddRegionMapping
                show={show}
                onHide={() => setShow({
                    isShow: false,
                    isBulkUpload: false,
                })}
                stateData={states}
                _currentUser={currentUser}
                _editData={editData}
                _broker={_brokerId}
                _ic={_icId}
            />
            {loading && <Loader />}
        </Card>
    )
}
