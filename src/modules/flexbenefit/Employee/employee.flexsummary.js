import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWidgetFlexSummary, getWellnessData, selectWidgetFlexSummaryResponse, selectWellnessDataResponse } from '../flexbenefit.slice';
// import { IconlessCard } from '../../../components'
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
export const FlexSummary = () => {
    const dispatch = useDispatch();
    const widgetFlexSummary = useSelector(selectWidgetFlexSummaryResponse);
    const wellnessData = useSelector(selectWellnessDataResponse);
    useEffect(() => {
        dispatch(getWidgetFlexSummary());
        dispatch(getWellnessData());
        //eslint-disable-next-line
    }, [])
    return (<>
        <div className="d-flex flex-wrap mt-3 mb-2">
            <Paper className="m-1 mr-2">
                <div className="text-center">
                    <img src="/assets/images/flex/Flex-Wallet.png" alt="" width="auto" height="50" />
                </div>
                <p className="text-center mt-2">Total Wallet</p>
                <p className="text-center text-secondary">{String(widgetFlexSummary.totalFlex).includes('.') ? widgetFlexSummary.totalFlex.toFixed(2) : widgetFlexSummary.totalFlex}</p>
            </Paper>
            <Paper className="m-1 mr-2">
                <div className="text-center">
                    <img src="/assets/images/flex/Total-Flex.png" alt="" width="auto" height="50" />
                </div>
                <p className="text-center mt-2">Wallet Balance</p>
                <p className="text-center text-secondary">{String(widgetFlexSummary.flexWallet).includes('.') ? widgetFlexSummary.flexWallet.toFixed(2) : widgetFlexSummary.flexWallet}</p>
            </Paper>
            <Paper className="m-1 mr-2">
                <div className="text-center">
                    <img src="/assets/images/flex/Wallet-Utilise.png" alt="" width="auto" height="50" />
                </div>
                <p className="text-center mt-2">Wallet Utilize</p>
                <p className="text-center text-secondary">{String(widgetFlexSummary.walletUtilization).includes('.') ? widgetFlexSummary.walletUtilization.toFixed(2) : widgetFlexSummary.walletUtilization}</p>
            </Paper>
            {/* <Paper className="m-1">
                <div className="text-center">
                    <img src="/assets/images/car.png" alt="" width="100" height="50" />
                </div>
                <p className="text-center mt-2">To Pay</p>
                <p className="text-center text-secondary">{widgetFlexSummary.toPay}</p>
            </Paper> */}
        </div>
        {wellnessData.length > 0 &&
            <Paper maxWidth="621px" padding="0em" margin="2em 1em" style={{ overflow: "hidden" }} radius="1em">
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Flex</th>
                            <th>Deduction Type</th>
                            <th>Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wellnessData.map((v, i) => (!!Number(v.final_amount) || Number(v.final_amount) === 0) && <tr key={i + 'wellness-data'}>
                                <td className="td_name">{v.name}</td>
                                <td>{v.flex_name}</td>
                                <td>{v.deduction_type}</td>
                                <td>{Number(v.final_amount) || '-'}</td>
                            </tr>)
                        }
                    </tbody>
                </Table></Paper>}
    </>)
}



const Paper = styled.div`
min-width : ${props => props.minWidth || "200px"} ;
max-width : ${props => props.maxWidth || "400px"};
background-color : ${props => props.backgroundColor || "#ffffff"};
border-radius : ${props => props.radius || "2.6em"};
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
margin : ${props => props.margin || "2em"};
padding : ${props => props.padding || "1em 2em"};
color : ${({ color, theme }) => color || theme.Tab?.color || "#6334e3"};
thead{
    background-color: ${({ theme }) => theme.Tab?.color || '#6334e3'};
    color: #ffffff; 
}
.td_name{
    color: ${({ theme }) => theme.Tab?.color || '#9CCC65'};
}
`;
