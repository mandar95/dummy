import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { CardBlue, Button, Error, Input, Chip, SelectComponent } from "../../../components";
import Table from "./table.js";
import swal from "sweetalert";
import _ from "lodash";
import { useParams } from "react-router";


import { useDispatch, useSelector } from "react-redux";
import {
    getAllICD,
    createICD,
    getAllBrokerICD,
    getBrokers,
    exportICD,
    clear
} from "../wellness.slice";

const IcdCodeMaster = ({ myModule }) => {

    const dispatch = useDispatch();
    const { userType } = useParams();
    const { ICDData, success, BrokerICDData, brokers, exportICDResponse, error } = useSelector((state) => state.wellness);
    const { currentUser, userType: userTypeName } = useSelector(state => state.login);

    const [ICD_Master, setICD_Master] = useState([]);
    const [ICD_Data, setICD_Data] = useState([]);
    const [ICD, setICD] = useState(null);
    const [downloadState, setDownloadState] = useState(null);


    useEffect(() => {
        if (error) {
            swal(error, "", "warning");
        }
        return () => {
            dispatch(clear());
        };
        //eslint-disable-next-line
    }, [error]);

    /*----------validation schema----------*/
    // const validationSchema = yup.object().shape({
    //     icd_code: yup.object().shape({
    //         id: yup.string().required('ICD Code Required'),
    //     }),
    //     icd_name: yup.string().required('ICD Name Required'),
    //     ...(userType === "admin" && {
    //         broker_id: yup.object().shape({
    //             id: yup.string().required('Broker Required'),
    //         }),
    //     }),
    // });
    /*----x-----validation schema-----x----*/

    const { control, errors, handleSubmit, setValue, watch } = useForm();

    const brokerId = watch("broker_id")?.value;
    const codeValue = watch("icd_code")?.value;
    const nameValue = watch("icd_name");


    useEffect(() => {
        if (ICD) {
            const ICD_obj = ICDData.filter((item) => item?.id === parseInt(ICD));
            setValue("icd_name", ICD_obj[0].icd_name);
            setICD_Data(() => [...ICD_obj]);
        }
        //eslint-disable-next-line
    }, [ICD]);

    useEffect(() => {
        dispatch(getAllICD());
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (userType === "admin" && userTypeName) {
            dispatch(getBrokers(userTypeName));
        }
        if (userType === "broker" && currentUser?.broker_id) {
            dispatch(getAllBrokerICD({ broker_id: currentUser?.broker_id }));
        }
        //eslint-disable-next-line
    }, [userType, currentUser, userTypeName]);

    useEffect(() => {
        if (brokerId) {
            dispatch(getAllBrokerICD({ broker_id: brokerId }));
        }
        //eslint-disable-next-line
    }, [brokerId]);

    const onAddICD = () => {
        if (!_.isEmpty(ICD_Data)) {
            const flag = ICD_Master.some((value) => value.id === parseInt(codeValue));
            if (!flag && codeValue && nameValue) {
                setICD_Master((prev) => [...prev, ICD_Data[0]])
            }
        }
        else {
            swal("please select ICD code", "", "warning");
        }
    }

    const onRemoveICD = (Index) => {
        const filteredICD = ICD_Master.filter((item, index) => index !== (Index - 1));
        setICD_Master(() => [...filteredICD])
    }

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(
                    getAllBrokerICD({
                        broker_id: userType === "broker" ? currentUser?.broker_id : brokerId,
                    })
                );
            });
        }

        return () => {
            dispatch(clear());
        };
        //eslint-disable-next-line
    }, [success]);

    const resetValues = () => {
        setValue([{ "icd_name": "" }, { "icd_code": undefined }]);
        setICD_Master([]);
        setICD_Data([]);
    }

    const exportDeatils = () => {
        if (brokerId || currentUser?.broker_id) {
            dispatch(exportICD({
                broker_id:
                    userType === "broker" ? parseInt(currentUser?.broker_id) : parseInt(brokerId)
            }))
            setDownloadState(1);
        }
        else {
            swal("please select broker", "", "warning");
        }
    }

    // useEffect(() => {
    //     if (downloadState === 1) {
    //         if (ExportDetailsresponse?.data?.status) {
    //             swal("Successful", "", "success");
    //         } else if (ExportDetailsresponse?.data?.status === false) {
    //             let error =
    //                 ExportDetailsresponse?.data?.errors &&
    //                 getFirstError(ExportDetailsresponse?.data?.errors);
    //             error = error
    //                 ? error
    //                 : ExportDetailsresponse?.data?.message
    //                     ? ExportDetailsresponse?.data?.message
    //                     : "Something went wrong";
    //             swal("", error, "warning");
    //         }
    //     }
    // }, [exportICDResponse, downloadState]);

    useEffect(() => {
        if (exportICDResponse?.ulr && downloadState === 1) {
            //window.open(ExportDetailsresponse?.data?.data.download_report);
            const link = document.createElement("a");
            link.setAttribute(
                "href",
                "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8," +
                encodeURIComponent(exportICDResponse?.ulr)
            );
            link.href = exportICDResponse?.ulr;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloadState(0);
            clear('export-response')
        }
    }, [exportICDResponse, downloadState]);

    const onSubmit = () => {
        // const formdata = new FormData();
        // if (!_.isEmpty(ICD_Master)) {
        //     ICD_Master.forEach((data) => {
        //         formdata.append("icd_id[]", parseInt(data.id));
        //     });
        // }
        // else {
        //     formdata.append("icd_id[]", ICD_Data[0].id);
        // }
        // formdata.append(
        //     "broker_id",
        //     userType === "broker" ? currentUser?.broker_id : brokerId
        // );
        if (_.isEmpty(ICD_Master) && _.isEmpty(ICD_Data)) {

            swal('Validation', 'Add Atleast One ICD Code', 'info')
            return null;
        }
        let icdid = []
        if (!_.isEmpty(ICD_Master)) {
            ICD_Master.forEach((data) => {
                icdid.push(data.id)
            });
        }
        else if (!_.isEmpty(ICD_Data)) {
            icdid.push(ICD_Data[0].id)
        }
        dispatch(createICD({
            broker_id:
                userType === "broker" ? currentUser?.broker_id : brokerId,
            icd_id: icdid
        }))
        resetValues()
    }

    return (
        <>
            {((!!myModule?.canwrite && userType === "broker") ||
                (userType === "admin")) &&
                <CardBlue title="ICD Code Master" >
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            {(userType === "admin") && (
                                <Col sm="12" md="12" lg="12" xl="12">
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
                                        error={errors && errors.broker_id?.id}
                                    />
                                    {!!errors?.broker_id?.id && <Error>{errors?.broker_id?.id?.message}</Error>}
                                </Col>
                            )}
                        </Row>
                        {!!myModule?.canwrite && <>
                            <Row>
                                <Col md={12} lg={5} xl={5} sm={12}>
                                    <div className="p-2">
                                        <Controller
                                            as={<SelectComponent placeholder="Select ICD Code"
                                                label="ICD Code"
                                                required={false}
                                                isRequired={true}
                                                options={ICDData.map((item) => ({
                                                    id: item?.id,
                                                    label: item?.icd_code,
                                                    value: item?.id,
                                                }))} />}
                                            onChange={([selected]) => {
                                                setICD(selected.value);
                                                return selected;

                                            }}
                                            name="icd_code"
                                            control={control}
                                            error={errors && errors.icd_code?.id}

                                        />
                                        {!!errors?.icd_code?.id &&
                                            <Error>
                                                {errors?.icd_code?.id?.message}
                                            </Error>}
                                        {ICD_Master.length ? (
                                            <BenefitList>
                                                {ICD_Master.map((item, i) => {
                                                    return (
                                                        <Chip
                                                            key={'icd-master' + i}
                                                            id={(i + 1)}
                                                            name={item.icd_code}
                                                            onDelete={onRemoveICD}
                                                        />
                                                    );
                                                })}
                                            </BenefitList>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={12} lg={5} xl={5} sm={12}>
                                    <div className="p-2">
                                        <Controller
                                            as={<Input label="ICD Name" placeholder="Enter ICD Name" disabled={true}
                                                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                                            name="icd_name"
                                            defaultValue={""}
                                            control={control}
                                            error={errors && errors.icd_name}

                                        />
                                        {!!errors?.icd_name &&
                                            <Error>
                                                {errors?.icd_name?.message}
                                            </Error>}
                                        {ICD_Master.length ? (
                                            <BenefitList>
                                                {ICD_Master.map((item, i) => {
                                                    return (
                                                        <Chip
                                                            key={'icd-master1' + i}
                                                            id={(i + 1)}
                                                            name={item.icd_name}
                                                            onDelete={onRemoveICD}
                                                        />
                                                    );
                                                })}
                                            </BenefitList>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={12} lg={2} xl={2} sm={12} className="d-flex align-items-center">
                                    <div className="pl-2">
                                        <Btn type="button" onClick={onAddICD}>
                                            <i className="ti ti-plus"></i> Add
                                        </Btn>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ justifyContent: 'flex-end' }}>

                                <div style={{ float: "right" }} className="p-2">
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Row>
                        </>}
                    </Form>
                </CardBlue>
            }
            <CardBlue
                title={
                    <div className="d-flex justify-content-between">
                        <span>Details</span>
                        <div className="d-flex justify-content-end flex-wrap">
                            <Btn size="sm" className="shadow-sm" variant="primary"
                                onClick={exportDeatils}
                            >
                                <strong>Export</strong><i className="fa fa-file-excel-o" aria-hidden="true" style={{ marginLeft: '8px' }}></i>
                            </Btn>
                        </div>
                    </div>
                }>
                <Table
                    myModule={myModule}
                    data={brokerId || currentUser?.broker_id ? BrokerICDData : []} />
            </CardBlue>
        </>
    );
}

const BenefitList = styled.div`
  margin-left: 5px;
  border: 1px dashed #deff;
  padding: 11px;
  background: #efefef;
  border-radius: 5px;
  width: 97%;
`;


export default IcdCodeMaster;
