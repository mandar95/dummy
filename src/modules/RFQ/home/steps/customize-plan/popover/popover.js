import React from 'react';
import { Overlay, Popover, Row, Col } from "react-bootstrap";
import styled from 'styled-components';
import { NumberInd } from 'utils';

export default function PopOver({ showpopover, target, reference, tooltipdata }) {
    let sum = tooltipdata?.reduce((n, { sum_insured, no_of_employees }) => n + (parseInt(sum_insured) * parseInt(no_of_employees)), 0)
    return (
        <div ref={reference}>
            <Overlay
                show={showpopover}
                target={target}
                placement={"bottom"}
                container={reference.current}
                containerPadding={50}
            >
                <Popup id="popover-contained">
                    <Popover.Content>
                        <Row style={{ flexWrap: 'nowrap', borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '5px' }}>
                            <Col sm={6} md={6} lg={6}><Span style={{ fontWeight: '500' }}>Age Group</Span></Col>
                            <Col sm={6} md={6} lg={6}><Span style={{ fontWeight: '500' }}>Sum Insured</Span></Col>
                        </Row>
                        <div
                        // style={{ height: '150px', overflowY: 'scroll', overflowX: 'hidden' }}
                        >
                            {tooltipdata?.map((item) => !!item.no_of_employees && (
                                <Row key={item + 'tooltip'} style={{ flexWrap: 'nowrap' }}>
                                    <Col sm={6} md={6} lg={6}><Span>{item.age_group} {`X ${item.no_of_employees}`}</Span></Col>
                                    <Col sm={6} md={6} lg={6} className="text-right"><Span style={{ 'color': '#0487c1', 'fontWeight': '500' }}>₹ {NumberInd(item.sum_insured)}</Span></Col>
                                </Row>
                            )
                            )}
                        </div>
                        <Row style={{ flexWrap: 'nowrap' }}>
                            <Col sm={6} md={6} lg={6}><Span style={{ fontWeight: '500' }}>Total</Span></Col>
                            <Col sm={6} md={6} lg={6} className="text-right"><Span style={{ 'color': '#0487c1', 'fontWeight': '500' }}>₹ {NumberInd(sum)}</Span></Col>
                        </Row>
                    </Popover.Content>
                </Popup>
            </Overlay>
        </div>
    );
}

const Popup = styled(Popover)`
    width: 260px;
    padding:5px 10px;
    border-radius: 13px;
    border:none;
    background: white;
    box-shadow: 0px 3px 10px 1px #ccc;
    & .popover-body> .row:last-child{
        margin: 5px 0px 0px 0px;
        border-top: 1px solid rgba(0,0,0,.1);
    }
    & .popover-body> .row:last-child > div{
        padding: 0px;
    }
`

const Span = styled.span`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
&:(not:first-child){
    text-align:end
}
`
