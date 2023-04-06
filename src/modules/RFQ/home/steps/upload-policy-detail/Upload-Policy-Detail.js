import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { FileDrop } from "react-file-drop";
import { Row, Col } from "react-bootstrap";

import { Loader } from "../../../../../components";
import swal from "sweetalert";
import { BackBtn } from '../button'
import { Title, Button as BTN, Card } from "modules/RFQ/select-plan/style"
import { downloadSampleFile, clearDownloadSampleSuccess } from 'modules/policies/policy-config.slice';

import { clear, uploadClaimSheet } from '../../home.slice';
import { doesHasIdParam } from '../../home';
import { downloadFile } from '../../../../../utils';


export const UploadPreviousPolicyDetail = ({ utm_source }) => {
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const history = useHistory();
    const [file, setFile] = useState();
    const fileInputRef = useRef(null);
    const { success, error, loading } = useSelector(state => state.RFQHome);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const { sampleURL } = useSelector(state => state.policyConfig);


    useEffect(() => {
        if (success) {
            history.push(`/declaration?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error]);

    useEffect(() => {
        if (sampleURL) {
            downloadFile(sampleURL);
        }
        return () => { dispatch(clearDownloadSampleSuccess()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sampleURL]);



    const onFileInputChange = (event) => {
        const { files } = event.target;
        if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls"))) setFile(files);
    };

    const onTargetClick = () => {
        fileInputRef.current.click();
    };

    const onFileSubmit = () => {
        if (!file) {
            history.push(`/declaration?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
            return;
        }
        const formData = new FormData();
        formData.append("enquiry_id", enquiry_id);
        formData.append("employee_data", file[0]);
        dispatch(uploadClaimSheet(formData))

    };

    const downloadSample = () => {
        dispatch(downloadSampleFile({ sample_type_id: 57 }));
    }

    const Upload = (
        <Col xl={8} lg={8} md={12} sm={12}>
            <Title
                color="#687b92"
                fontWeight="500"
                className="d-block"
                fontSize="1rem"
            >
                Upload sheet
            </Title>
            <Title className="mb-2 mt-1" fontSize="1.7rem">Upload XLS or CSV file</Title>
            <br />
            <Title color="#555555" fontSize="1.15rem">
                Upload the policy claim data. Mandatory fields
                include emp code, name, claim amount, claim reason and remark
            </Title>
            <Col className="p-0" xl={12} lg={12} md={12} sm={12}>
                <FileDrop
                    onDrop={(files, event) => {
                        if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls")))
                            setFile(files);
                    }}
                >
                    <Card
                        className="mt-3 p-4 text-center"
                        noShadow
                        borderRadius="10px"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%2386B4EEFF' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e")`,
                            wordBreak: "break-word",
                        }}
                        bgColor={(file === false) ? "#ffc8c0" : "#F6F9FF"}
                    >
                        {!!file ? (
                            <>
                                <img
                                    className="mx-auto"
                                    width="80px"
                                    src="/assets/images/excel_logo.png"
                                    alt="Your File"
                                />
                                <Title
                                    fontWeight="500"
                                    color="#555555"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    {file[0]?.name}
                                </Title>
                                <Title
                                    fontWeight="500"
                                    color="#555555"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    <span className="browse" onClick={onTargetClick}>
                                        Browse
                                    </span>
                                </Title>
                            </>
                        ) : (
                            <>
                                <img
                                    className="mx-auto"
                                    width="60px"
                                    src="/assets/images/RFQ/Group 6577@2x.png"
                                    alt="Drop File Here"
                                />
                                <Title
                                    fontWeight="500"
                                    color="#555555"
                                    className="d-block"
                                    fontSize="0.8rem"
                                >
                                    Drop your file here.
                                </Title>
                                <Title
                                    fontWeight="500"
                                    color="#4a84ff"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    or{" "}
                                    <span className="browse" onClick={onTargetClick}>
                                        Browse
                                    </span>
                                </Title>
                                {/* {!!employee_sheet_data.data.length && <Title
                                    fontWeight="500"
                                    color="#009b23"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    You have already submitted excel sheet before <br /> (Adding excel sheet again will add new members with previous members)
                                </Title>} */}
                            </>
                        )}
                        <input
                            onChange={onFileInputChange}
                            ref={fileInputRef}
                            onClick={(event) => {
                                event.target.value = null
                            }}
                            type="file"
                            accept={".xlsx, .xls"}
                            className="hidden"
                            style={{ display: "none" }}
                        />
                    </Card>
                </FileDrop>
                {(file === false) && (
                    <Title
                        className="d-block"
                        fontWeight="500"
                        color="#ff1717"
                        fontSize="1.1rem"
                    >
                        File Required
                    </Title>
                )}
                <Title fontWeight="500" color="#555555" fontSize="0.9rem">
                    If you are not sure about the spreadsheet format, you can download a
                    template <span className="link"
                        onClick={downloadSample}
                    >here</span>
                </Title>
            </Col>
            <Col className="p-0" xl={4} lg={4} md={12} sm={12}>
                <BTN width={"190px"} padding="15px" fontSize='1.5rem'
                    onClick={onFileSubmit}
                >
                    Proceed <i className="fa fa-long-arrow-right" aria-hidden="true" />
                </BTN>
            </Col>
        </Col>
    );

    return (
        <>
            <Row>
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                    <BackBtn url={`/company-detail/5?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`} style={{ outline: "none", border: "none", background: "none" }}
                    >
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn>
                    <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>Upload Previous Policy Claim Data</h1>
                </Col>
            </Row>
            <Row>
                {Upload}
            </Row>
            {(loading || success) && <Loader />}
        </>
    )
}
