import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import swal from "sweetalert";

import { CardBlue, Button, Error, Loader, Select } from "components";
import { AttachFile2 } from 'modules/core';
import { AnchorTag } from "modules/policies/steps/premium-details/styles";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';


import { downloadFile } from "utils";

import { loadPolicyNumber } from '../../communication-config/communication-config.slice';
import { uploadPolicyData, claim, clear, getDynamicSampleFile, sampleFileDetails } from '../claims.slice';
import { Head } from "../../../components";
//import { sampleFile, clearSampleURL } from "../../Help/help.slice";


const UploadPolicyData = () => {
    const dispatch = useDispatch();
    const { userType } = useParams();
    const { globalTheme } = useSelector(state => state.theme)
    const { loading, success, error, sampleFileResponse } = useSelector(claim);
    const { policy_no } = useSelector(state => state.commConfig);
    const loginState = useSelector(state => state.login);
    const { currentUser } = loginState;
    // const { sampleURL } = useSelector((state) => state.help);

    const [policies, setPolicies] = useState([]);
    const [resetFile, setResetFile] = useState(false);

    const validationSchema = yup.object().shape({
        policy_id: yup.string().required("Policy name is required"),
        file: yup.mixed().required("File is required")
    });
    const { control, errors, handleSubmit, setValue, register, watch } = useForm({
        validationSchema,
    });

    let _policyID = watch("policy_id")


    useEffect(() => {
        if (sampleFileResponse?.data) {
            downloadFile(sampleFileResponse?.data)
            // swal({
            //     title: "Downloading",
            //     text: "Sample Format",
            //     timer: 2000,
            //     button: false,
            //     icon: "info",
            // });
        }
        // if (SampleResponse?.data?.data && SampleResponse?.data?.data && SampleResponse?.data?.data[0]?.upload_path) {
        //   downloadFile(SampleResponse?.data?.data && SampleResponse?.data?.data[0]?.upload_path)
        // }
        return () => { dispatch(sampleFileDetails('')) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sampleFileResponse])

    // useEffect(() => {
    //     if (sampleURL) {
    //         downloadFile(sampleURL);
    //         swal({
    //             title: "Downloading",
    //             text: "Sample Format",
    //             timer: 2000,
    //             button: false,
    //             icon: "info",
    //         });
    //     }
    //     return () => {
    //         dispatch(clearSampleURL());
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sampleURL]);

    useEffect(() => {
        dispatch(loadPolicyNumber());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Filter(broker)
    useEffect(() => {
        if (currentUser?.broker_id && userType === 'broker' && policy_no.length !== 0) {
            const _policy = policy_no.filter((elem2) => elem2.broker_id === currentUser?.broker_id)
            setPolicies(_policy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, userType, policy_no])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                // dispatch(getAllCustomerDocuments());
                resetValues();
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const resetValues = () => {
        setValue([{ "policy_id": "" }, { "claim_data": null }]);
        setResetFile(true)
    };

    const onSubmit = (data) => {
        const formdata = new FormData();
        formdata.append("policy_id", data.policy_id);
        formdata.append("claim_data", data.file[0]);
        formdata.append("to_override", data.to_override);
        dispatch(uploadPolicyData(formdata));
    }

    return (
        <>
            <CardBlue title="Upload Claim Data">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <Controller
                                as={<Select
                                    label="Policy Name"
                                    placeholder='Select Policy Name'
                                    options={policies.map((item) => ({
                                        id: item?.id,
                                        name: item?.policy_no,
                                        value: item?.id,
                                    }))}
                                    required={false}
                                    isRequired={true}
                                />}
                                name="policy_id"
                                defaultValue={""}
                                control={control}
                                error={errors && errors.policy_id}
                            />
                            {!!errors?.policy_id && <Error>{errors?.policy_id?.message}</Error>}
                        </Col>
                        <Col md={6} lg={6} xl={6} sm={12} className='mx-auto'>
                            <Head className='text-center'>Should Overwrite ?</Head>
                            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                                <CustomControl className="d-flex mt-4 mr-0">
                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                                    <input ref={register} name={'to_override'} type={'radio'} value={0} defaultChecked={true} />
                                    <span></span>
                                </CustomControl>
                                <CustomControl className="d-flex mt-4 ml-0">
                                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                                    <input ref={register} name={'to_override'} type={'radio'} value={1} />
                                    <span></span>
                                </CustomControl>
                            </div>
                        </Col>
                        <Col md={12} lg={12} xl={12} sm={12}>
                            <div className="p-2">
                                <AttachFile2
                                    fileRegister={register}
                                    control={control}
                                    defaultValue={""}
                                    name="file"
                                    title="Attach File"
                                    key="premium_file"
                                    accept={".xls, .xlsx"}
                                    resetValue={resetFile}
                                    description="File Formats: xls, xlsx"
                                    nameBox
                                />
                                {!!_policyID && <AnchorTag href={"#"} onClick={() => dispatch(getDynamicSampleFile({ policy_id: _policyID }))}>
                                    <i
                                        className="ti-cloud-down attach-i"
                                        style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                    ></i>
                                    <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                        Download Sample Format
                                    </p>
                                </AnchorTag>}
                                {!!errors?.file && <Error>{errors?.file?.message}</Error>}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlue>
            {loading && <Loader />}
        </>
    );
}




export default UploadPolicyData;
