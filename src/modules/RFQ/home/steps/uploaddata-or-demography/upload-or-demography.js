import React, { useEffect, useState, useRef,useImperativeHandle } from "react";
import { RFQButton, Loader, ToggleCard } from "components";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import { BackBtn } from "../button";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import styled from "styled-components";
import swal from "@sweetalert/with-react";
import { InfoCard, Title, Button } from "modules/RFQ/data-upload/style";

import { clear, saveCompanyData, set_company_data, uploadSheet, employeeSheetData } from "../../home.slice";
// import * as yup from "yup";
import _ from "lodash";
import { doesHasIdParam } from "../../home";
import { Card } from "modules/RFQ/select-plan/style";
import { FileDrop } from "react-file-drop";
import { InviteTeamModal } from "modules/RFQ/data-upload/Moadal2";
import { downloadSampleFile, clearDownloadSampleSuccess } from 'modules/policies/policy-config.slice';
import { downloadFile } from 'utils';


// const ColHeader = styled(Col)`
// 	@media screen and (max-width: 990px) {
// 		justify-content: center;
// 	}
// `;

export const UploadDemography = ({ utm_source,childRef }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    const { globalTheme } = useSelector(state => state.theme)

    //enquiry id
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const {
        enquiry_id,
        loading,
        success,
        company_data,
        employee_sheet_data,
        Sheetsuccess,
        inviteSuccess
    } = useSelector((state) => state.RFQHome);
    const { sampleURL } = useSelector(state => state.policyConfig);

    const fileInputRef = useRef(null);
    const [file, setFile] = useState();
    const [inviteTeamModal, setInviteTeamModal] = useState();
    const [coverType, setCoverType] = useState("individual");
    const [premiumType, setPremiumType] = useState("per_life");
    const [showButton, setShowButton] = useState(false);
    /*----------validation schema----------*/
    // const validationSchema = yup.object().shape({});
    /*----x-----validation schema-----x----*/

    const { register, handleSubmit, setValue, watch } = useForm({
        // validationSchema,
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            is_demography: (parseInt(company_data?.is_demography)) || 0
        },
    });
    let _isDataUpload = watch('is_demography')

    useImperativeHandle(childRef, () => ({

        unSetFile: () => {
          setFile(null);
        }
    
      }));
    const downloadSample = () => {
        dispatch(downloadSampleFile({ sample_type_id: 32 }));
    }

    const onFileInputChange = (event) => {
        const { files } = event.target;
        if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls"))) setFile(files);
    };

    const onTargetClick = () => {
        fileInputRef.current.click();
        setShowButton(false)
    };

    useEffect(() => {
        if (sampleURL) {
            downloadFile(sampleURL);
        }
        return () => { dispatch(clearDownloadSampleSuccess()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sampleURL]);

    useEffect(() => {
        setShowButton(false)
    }, [_isDataUpload])
    // // redirect if !id
    useEffect(() => {
        if (enquiry_id || id) {
            dispatch(employeeSheetData({ enquiry_id: insurerId || id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, enquiry_id]);

    // useEffect(() => {
    // 	var relationId;
    // 	if (company_data?.family_construct) {
    // 		relationId = company_data?.family_construct.map((item) => {
    // 			return item.relation_id;
    // 		});
    // 	}

    // 	// eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [company_data.family_construct]);
    useEffect(() => {
        if (typeof (company_data?.isSelf) !== 'undefined') {
            if (!!employee_sheet_data.data.length && !company_data?.isSelf) {
                setShowButton(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employee_sheet_data, company_data])

    useEffect(() => {
        if (!_.isEmpty(company_data)) {
            if (company_data?.is_demography) {
                setValue("is_demography", parseInt(company_data?.is_demography));
            }

            if (company_data?.suminsured_type_id) {
                Number(company_data?.suminsured_type_id) === 1
                    ? setCoverType("individual")
                    : setCoverType("floater");
            }

            if (company_data?.premium_type && Number(company_data?.suminsured_type_id) === 2) {
                Number(company_data?.premium_type) === 1
                    ? setPremiumType("per_life")
                    : setPremiumType("per_family");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data]);

    useEffect(() => {
        if (success && (enquiry_id || id)) {
            if (!showButton) {
                if (Number(_isDataUpload) === 0) {
                    if (!file && !employee_sheet_data.data.length) {
                        setFile(false);
                        return;
                    }
                    if (!file && employee_sheet_data.data.length) {
                        history.push(`/about-team?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
                        return
                    }

                    const formData = new FormData();
                    formData.append("enquiry_id", enquiry_id || id);
                    formData.append("employee_data", file[0]);
                    if (employee_sheet_data.data.length) {
                        swal({
                            title: 'Upload Data',
                            text: 'Uploading this data will override previous data',
                            icon: 'warning',
                            buttons: {
                                cancel: "Cancel",
                                // 'Append': 'Append Data',
                                'Override': 'Upload Data'
                            },
                            dangerMode: true
                        }).then((caseValue) => {
                            switch (caseValue) {
                                // case 'Append': formData.append("is_override", 0);
                                // 	dispatch(uploadSheet(formData))
                                // 	break;

                                case 'Override': formData.append("is_override", 1);
                                    dispatch(uploadSheet(formData))
                                    break;
                                default:
                            }
                        })
                    } else {
                        dispatch(uploadSheet(formData))

                    }
                }
                else {
                    history.push(`/family-construct?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
                }
            }
            else {
                dispatch(employeeSheetData({ enquiry_id: insurerId || id }));
                history.push(`/about-team?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
            }
        }
        return () => {
            dispatch(clear());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, enquiry_id, id]);

    useEffect(() => {
        if (inviteSuccess) {
            swal('Success', inviteSuccess, "success");
            setInviteTeamModal(false)
        }
        return () => {
            dispatch(clear('inviteSuccess'));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inviteSuccess])

    useEffect(() => {
        if (Sheetsuccess) {
            if (Sheetsuccess.uploaded_sheet && Sheetsuccess.error_sheet) {
                setFile(null);
                swal(<div>
                    <h1 style={{
                        fontSize: globalTheme.fontSize ? `calc(25px + ${globalTheme.fontSize - 92}%)` : '25px',
                        color: 'dimgrey',
                        marginBottom: '30px'
                    }}>{Sheetsuccess.message}</h1>
                    <div className="col-12 mt-2 mt-lg-0 text-right d-flex justify-content-between">
                        <Btn
                            size="sm"
                            variant="success"
                            onClick={() => { exportPolicy(Sheetsuccess.uploaded_sheet); }}
                            className="shadow-sm m-1 rounded-lg"
                            style={{ padding: '10px', border: 'none' }}
                        >
                            Uploaded Sheet Document
                            <i className="ti ti-download" style={{ marginLeft: '10px' }}></i>
                        </Btn>
                        <Btn
                            size="sm"
                            variant="danger"
                            onClick={() => { exportPolicy(Sheetsuccess.error_sheet); }}
                            className="shadow-sm m-1 rounded-lg"
                            style={{ padding: '10px', border: 'none' }}
                        >
                            Error Sheet Document
                            <i className="ti ti-download" style={{ marginLeft: '10px' }}></i>
                        </Btn>
                    </div>
                </div>);
            }
            else {
                if (Sheetsuccess.si_id === 1) {
                    swal('Success', Sheetsuccess.message, "success").then(() => {
                        dispatch(employeeSheetData({ enquiry_id: insurerId || id }));
                        history.push(`/about-team?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
                    });
                }
                else {
                    setShowButton(true)
                }
            }
        }
        return () => {
            dispatch(clear('Sheetsuccess'));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Sheetsuccess])

    const onSubmit = (data) => {
        if (!inviteTeamModal) {
            if (!showButton) {
                let newData = {
                    is_demography: data.is_demography,
                    step: 19,
                    enquiry_id: id
                }
                dispatch(set_company_data({ is_demography: data.is_demography }));
                dispatch(saveCompanyData(newData))
                // if (data.is_demography === "1") {
                //     history.push(`/family-construct?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
                // }
            }
            else {
                let newData2 = {
                    suminsured_type_id: coverType === "individual" ? 1 : 2,
                    premium_type: coverType === "floater" ? premiumType === "per_life" ? 1 : 2 : 1
                }
                dispatch(set_company_data(newData2));
                dispatch(saveCompanyData({
                    ...newData2, step: 20,
                    enquiry_id: id,
                }))
            }
        }
    }
    const Upload = (
        <Col xl={12} lg={12} md={12} sm={12}>
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
                Upload the list of employees and their dependents. Mandatory fields
                include code, name, email, date of birth, gender and relationship
            </Title>
            <Col className="p-0" xl={12} lg={12} md={12} sm={12}>
                <FileDrop
                    // onFrameDragEnter={(event) => console.warn('onFrameDragEnter', event)}
                    // onFrameDragLeave={(event) => console.warn('onFrameDragLeave', event)}
                    // onFrameDrop={(event) => console.warn('onFrameDrop', event)}
                    // onDragOver={(event) => console.warn('onDragOver', event)}
                    // onDragLeave={(event) => console.warn('onDragLeave', event)}
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
                        bgColor={(file === false && !employee_sheet_data.data.length) ? "#ffc8c0" : "#F6F9FF"}
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
                                    <span className="browse"
                                        onClick={onTargetClick}
                                    >
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
                                    color="#555555"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    or{" "}
                                    <span className="browse"
                                        onClick={onTargetClick}
                                    >
                                        Browse
                                    </span>
                                </Title>
                                {!!employee_sheet_data.data.length && <Title
                                    fontWeight="500"
                                    color="#009b23"
                                    className="d-block"
                                    fontSize="1rem"
                                >
                                    You have already submitted excel sheet before <br /> (Adding excel sheet again will override previous members)
                                </Title>}
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
                {(file === false && !employee_sheet_data.data.length) && (
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
                    template <span style={{
                        color: '#3737ff',
                        cursor: 'pointer'
                    }}
                        onClick={downloadSample}
                    >here</span>
                </Title>
            </Col>
            {/* <Col className="p-0" xl={4} lg={4} md={12} sm={12}>
				<BTN width={"190px"} padding="15px" fontSize='1.5rem'
				//  onClick={onFileSubmit}
				>
					Proceed <i className="fa fa-long-arrow-right" aria-hidden="true" />
				</BTN>
			</Col> */}
        </Col>
    );

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="d-flex">
                    <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                        <BackBtn
                            url={`/${parseInt(company_data?.is_fresh_policy) === 0 ? 'previous-policy-detail' : 'policy-renewal'}?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`}
                            style={{ outline: "none", border: "none", background: "none" }}
                        >
                            <img
                                src="/assets/images/icon/Group-7347.png"
                                alt="bck"
                                height="45"
                                width="45"
                            />
                        </BackBtn>
                        <h1 style={{ fontWeight: "600", marginLeft: "10px", fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>
                            Would you like to upload Data or Enter Demography
                        </h1>
                    </Col>
                    <div
                        className="d-flex flex-wrap-reverse"
                        style={{ paddingLeft: "2.5%" }}
                    >
                        <Col
                            sm="12"
                            md="12"
                            lg="8"
                            xl="8"
                            className="pl-4 pr-4 d-flex flex-wrap align-content-start"
                        >
                            <ToggleCard
                                data={[
                                    {
                                        imgSrc: "/assets/images/RFQ/submit.png",
                                        content: "Upload Data",
                                        // title: "Yes",
                                        id: 0,
                                        titleColor: { color: '#0056ff' }
                                    },
                                    {
                                        imgSrc: "/assets/images/RFQ/file.png",
                                        content: "Enter Demography",
                                        // title: "No",
                                        id: 1,
                                        titleColor: { color: '#f95656' }
                                    },
                                ]}
                                contentStyle={{
                                    fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                                    fontWeight: "600",
                                    color: "black",
                                    marginTop: "-5px",
                                }}
                                titleDivStyle={{
                                    margin: '21px 0 11px',
                                }}
                                inputName="is_demography"
                                inputRef={register}
                                setVal={setValue}
                                watch={watch}
                                padding='10px'
                                height='auto'
                                width='215px'
                            ></ToggleCard>
                            {_isDataUpload === "0" && Upload}
                            {showButton &&
                                <Col
                                    sm="12"
                                    md="12"
                                    lg="5"
                                    xl="5"
                                    className="d-flex justify-content-center"
                                >
                                    <div className="my-3 w-100 px-4">
                                        <h5 style={{ fontSize: globalTheme.fontSize ? `calc(1rem + ${globalTheme.fontSize - 92}%)` : '1rem' }} className="text-center">Cover Type</h5>
                                        <div className="d-flex justify-content-center">
                                            <RFQButton
                                                width='140px'
                                                height='45px'
                                                fontSize='0.8rem'
                                                className="m-2"
                                                variant={coverType === "individual" ? "bulgy" : "bulgy_invert"}
                                                onClick={() => setCoverType("individual")}
                                                type="button"
                                            >
                                                Multi Individual
                                            </RFQButton>
                                            <RFQButton
                                                width='140px'
                                                height='45px'
                                                fontSize='0.8rem'
                                                className="m-2"
                                                variant={coverType === "floater" ? "bulgy" : "bulgy_invert"}
                                                onClick={() => setCoverType("floater")}
                                                type="button"
                                            >
                                                Family Floater
                                            </RFQButton>
                                        </div>
                                    </div>
                                </Col>
                            }
                            {
                                (coverType === "floater" && showButton) &&
                                <Col
                                    sm="12"
                                    md="12"
                                    lg="5"
                                    xl="5"
                                    className="d-flex justify-content-center"
                                >
                                    <div className="my-3 w-100 px-4">
                                        <h5 style={{ fontSize: globalTheme.fontSize ? `calc(1rem + ${globalTheme.fontSize - 92}%)` : '1rem' }} className="text-center">Premium Type</h5>
                                        <div className="d-flex justify-content-center">
                                            <RFQButton
                                                width='140px'
                                                height='45px'
                                                fontSize='0.8rem'
                                                className="m-2"
                                                variant={premiumType === "per_life" ? "bulgy1" : "bulgy_invert1"}
                                                onClick={() => setPremiumType("per_life")}
                                                type="button"
                                            >
                                                Per Life
                                            </RFQButton>
                                            <RFQButton
                                                width='140px'
                                                height='45px'
                                                fontSize='0.8rem'
                                                className="m-2"
                                                variant={premiumType === "per_family" ? "bulgy1" : "bulgy_invert1"}
                                                onClick={() => setPremiumType("per_family")}
                                                type="button"
                                            >
                                                Per Family
                                            </RFQButton>
                                        </div>
                                    </div>
                                </Col>
                            }
                            <Col sm="12" md="12" lg="12" xl="12" className="w-100 mt-4 pt-4">
                                <RFQButton>
                                    Next
                                    <i className="fa fa-long-arrow-right" aria-hidden="true" />
                                </RFQButton>
                            </Col>
                        </Col>

                        <Col xl={4} lg={4} md={12} sm={12}>
                            <InfoCard>
                                <Title fontSize="1.2rem">What to have ready:</Title>
                                <div className="list">
                                    <button type="button" className="btn btn-circle btn-lg">
                                        <i className="fa fa-check" />
                                    </button>
                                    <span>Employee full name</span>
                                </div>
                                <div className="list">
                                    <button type="button" className="btn btn-circle btn-lg">
                                        <i className="fa fa-check" />
                                    </button>
                                    <span>Gender</span>
                                </div>
                                <div className="list">
                                    <button type="button" className="btn btn-circle btn-lg">
                                        <i className="fa fa-check" />
                                    </button>
                                    <span>Date of birth</span>
                                </div>
                                <p>or</p>
                                <h4>
                                    Do you know someone in your team who could add the data?
                                    Invite them here.
                                </h4>
                                <Button onClick={() => setInviteTeamModal(true)}>Invite a team member</Button>
                            </InfoCard>

                        </Col>
                    </div>
                </Row>
            </Form>
            {!!inviteTeamModal && (
                <InviteTeamModal
                    dispatch={dispatch}
                    show={!!inviteTeamModal}
                    onHide={() => setInviteTeamModal(null)}
                    // Data={modal}
                    id={company_data.id}
                // relations={industry_data?.relations}
                />
            )}
            {(loading || success) && <Loader />}
        </>
    );
};

const exportPolicy = (URL) => {
    if (URL) {
        const link = document.createElement('a');
        link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
        link.href = URL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
