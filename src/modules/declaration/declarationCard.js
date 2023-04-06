import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import styled from 'styled-components';
import { RFQButton } from "../../../src/components/index"
import { useDispatch, useSelector } from "react-redux";

import DeclrationConfig from "./declaration";

import { getAllDeclration } from "modules/documents/documents.slice";

const Label = styled.label`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};

padding: 0px 5px;
border-radius: 5px;
`
const BorderDiv = styled.div`
height: 8px;
width: 55px;
background: #ffcd37;
border-radius: 15px;
`
const DeclararionCard = styled.div`
padding: 20px 35px;
background: white;
border-radius: 5px;
box-shadow: 0px 1px 6px 1px gainsboro;
width: 450px;
height: max-content;
line-height:55px;
margin: 40px 30px;
`
const Cardinputlabel = styled.div`

color: #727272;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
`
const CardOutputLabel = styled.div`

text-transform: capitalize;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
`

const DeclrationCard = ({ IC_id, Type, Name }) => {

    const { allDeclrationData } = useSelector((state) => state.documents);
    const dispatch = useDispatch();
    const [showViewData, setShowViewData] = useState(true);


    useEffect(() => {
        if (IC_id && showViewData) {
            if (Type === "insurer") {
                dispatch(getAllDeclration({
                    ic_id: IC_id
                }));
            }
            else {
                dispatch(getAllDeclration({
                    broker_id: IC_id
                }));
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [IC_id, showViewData])

    const setDataView = () => {
        setShowViewData(false)
    }

    return (
        <>
            {showViewData && (
                <Row className="justify-content-center">
                    <DeclararionCard>
                        <Row className="flex-column" style={{ lineHeight: '35px' }}>
                            <Label>Declaration Details</Label>
                            <BorderDiv />
                        </Row>
                        <Row className="justify-content-between">
                            <Cardinputlabel>Name</Cardinputlabel>
                            <CardOutputLabel>{Name}</CardOutputLabel>
                        </Row>
                        <Row className="justify-content-between">
                            <Cardinputlabel>Type</Cardinputlabel>
                            <CardOutputLabel>{
                                // abhi changes
                                // Type === 'broker' ? 'insurer' : 
                                Type}</CardOutputLabel>
                        </Row>
                        <Row className="justify-content-between">
                            <Cardinputlabel>Declaration Count</Cardinputlabel>
                            <CardOutputLabel>{allDeclrationData?.length}</CardOutputLabel>
                        </Row>
                        <Row>
                            <RFQButton width="100%" height="68px" style={{ marginTop: '20px' }} onClick={setDataView}>
                                View Declaration
                            </RFQButton>
                        </Row>
                    </DeclararionCard>
                </Row>
            )}
            {!showViewData && (<DeclrationConfig setShowViewData={setShowViewData} Type={Type} IC_id={IC_id} allDeclrationData={allDeclrationData} />)}
        </>
    )
}

export default DeclrationCard;
