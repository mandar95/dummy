import React, { useEffect } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { Head, Text, CardBlue, Loader } from "components";
import { Row, Col, Button as Btn } from 'react-bootstrap';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { getClaimDetails, clear } from "../claims.slice";
import { useParams } from "react-router";

const DownloadBtn = styled.span`
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    margin-right: 10px;
`

export const ClaimDetailsView = (props) => {
    const { id: claimId } = useParams();
    const dispatch = useDispatch();
    const { claimDetailsData, loading, error } = useSelector((state) => state.claims);
    const { globalTheme } = useSelector(state => state.theme)

    useEffect(() => {
        if (claimId) {
            dispatch(getClaimDetails({ claim_id: claimId }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claimId])

    useEffect(() => {
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    //card title----------------------------------------------
    const title = (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "4px" }}>
            <span>Claim Details</span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn size="sm" varient="primary" disabled>
                    <p
                        style={{
                            fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                            fontWeight: "600",
                            marginBottom: "-1px",
                        }}
                    >
                        {`Claim Submission Type :
                         ${(claimDetailsData?.documents?.length && claimDetailsData?.documents !== null) ? 'EB Portal' : 'Offline'}`}
                    </p>
                </Btn>
            </div>
        </div>
    );

    return (
        (!_.isEmpty(claimDetailsData)) ? (
            <CardBlue title={title}>
                <Row className="mt-3 flex-wrap">
                    {Object.keys(claimDetailsData).map((item, i) =>
                        <Col xs={12} md={6} lg={3} className="mt-2" sm={12} key={"sadasd" + i}>
                            <Head style={{ textTransform: 'capitalize' }}>{item.replace(/_/g, ' ')}</Head>
                            {/* <Text>{claimDetailsData[item] || "-"}</Text> */}
                            <Text>{checkLabel(claimDetailsData, item)}</Text>
                        </Col>
                    )}
                </Row>
            </CardBlue>
        ) :
            loading && <Loader />

    )
}

const checkLabel = (claimDetailsData, key) => {
    let value = claimDetailsData[key] || "-"
    if (key === 'member_mobile' && claimDetailsData[key] !== null) {
        value = claimDetailsData[key].length > 1 ? claimDetailsData[key] : "-"
    }
    if (key === 'member_email' && typeof claimDetailsData[key] === 'object' && claimDetailsData[key] !== null) {
        value = claimDetailsData[key].length !== 0 ? claimDetailsData[key].join(",") : "-"
    }
    if (key === 'documents' && claimDetailsData[key] !== null) {
        value = claimDetailsData[key].length !== 0 ? getDocumentCell(claimDetailsData[key]) : "-"
    }
    return value
}

const getDocumentCell = (values) => {
    // let _mockData = [{ document_name: 'mandar', document_url: "https://employeebenefit.s3.ap-south-1.amazonaws.com/uploads/Endrosement/AddMemberSheets/163221151316319501671631949775endorsement_add_sample.xlsx" },
    // { document_name: 'mahesh', document_url: "https://employeebenefit.s3.ap-south-1.amazonaws.com/uploads/Endrosement/AddMemberSheets/163221151316319501671631949775endorsement_add_sample.xlsx" }
    // ]
    return values.map((item, i) =>
        <DownloadBtn
            key={"qwwewsgdfd" + i}
            role='button'
            onClick={() => exportPolicy(item.document_url)}>
            {item.document_name}
            <i className="ti ti-download"></i>
        </DownloadBtn>
    )
}

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
