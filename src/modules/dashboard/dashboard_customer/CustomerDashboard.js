import React, { useEffect, useState } from "react";
import styled from "styled-components";

// import WidgetBoard from "./WidgetBoard";
import { Row, Col, Spinner } from "react-bootstrap";
import { Quotes } from "./Quotes";
import _ from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { quotesSearches, clear, StatusWise, getPlanList, MemberWise } from "./dashboard_customer.slice";

import FilterModal from "./modal";
// import swal from 'sweetalert';
import Graph1 from "./graph/Graph1";
import Graph2 from "./graph/Graph2";
// import Policies from "./policies";

const Container = styled.div`
	margin-top: 20px;
	margin-bottom: 60px;
	width:100%;
	padding:0px 85px;
	@media (max-width:700px) {
		padding:0px 30px;
		// width: auto;
	   }
`;

const HeaderContainer = styled.div`
    display: flex;
    padding: 0px 30px;
    justify-content: space-between;
    margin-bottom: 5px;
	@media (max-width:992px) {
		flex-direction:column;
		& div{
			margin:10px;
		}
	   }
`
const Filter = styled.div`
padding: 0px 10px;
background: #c7d3f05c;
border-radius: 20px;
`
const Select = styled.select`
border: 0px solid #dddddd;
border-radius: 30px;
outline: none;
background: #c7d3f000;
height: 41px;
width: 150px;
color:#484848e6;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
padding: 4px 10px;


@media (max-width:992px) {
	width:100%
   }
`
const Title = styled.div`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
	align-items: center;
    
    color: #929292e6;
    display: flex;
    padding: 5px 15px;
    justify-content: center;
    text-transform: uppercase;
`
const Rows = styled(Row)`
justify-content: space-between;
@media (max-width:700px) {
	justify-content: center;
   }
`
const Cols = styled(Col)`
background: rgb(255, 255, 255);
border-radius: 15px;
padding: 15px;
margin-right: -42px;
box-shadow: rgb(0 0 0 / 10%) 0px 10px 15px 6px, rgb(0 0 0 / 5%) 0px 4px 6px -2px;

@media (max-width:992px) {
	margin-top:20px;
	margin-right:0px;
   }
`
const LoaderDiv = styled.div`
height: 435px;
display: flex;
justify-content: center;
align-items: center;
`

const ThreeSpinner = () => {
	return (
		<>
			<Spinner animation="grow" size="sm" />
			<Spinner animation="grow" size="sm" />
			<Spinner animation="grow" size="sm" />
		</>
	)
}

const SelectFilter = (val, drpid, changeHandler) => {
	return (
		<Select value={val} id={drpid} onChange={changeHandler}>
			<option value="30">Last 30 days</option>
			<option value="15">Last 15 days</option>
			<option value="7">Last 7 days</option>
			<option value="customize">customize</option>
		</Select>
	)
}

export const CustomerDashboard = () => {
	const dispatch = useDispatch();
	const { quotes, error, loading1, loading2, loading3, statuswise, planlist, memberwise } = useSelector((state) => state.CustDash);

	const [show, setShow] = useState(false);
	const [statusWiseVal, setStatusWiseVal] = useState("30");
	const [memberWiseVal, setMemberWiseVal] = useState("");
	const [selectId, setSelectId] = useState(null);


	useEffect(() => {
		let resp = {
			days: parseInt(30),
			type: 'days',
		}
		dispatch(getPlanList());
		dispatch(quotesSearches());
		dispatch(StatusWise(resp));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!_.isEmpty(planlist)) {
			dispatch(MemberWise({
				plan_id: planlist[0].plan_id
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [planlist])

	//OnError (No error display)
	useEffect(() => {
		// if (error) {
		// 	swal(error, '', "warning")
		// }
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	let setDropDownValue = (id, val) => {
		switch (parseInt(id)) {
			case 1:
				setStatusWiseVal(val);
				break;
			case 2:
				//setStatusWiseVal(val);
				break;
			case 3:
				//setActivityWiseVal(val)
				break;
			default:
				break;
		}
	}

	let onChangeHandler = (e) => {
		setSelectId(e.target.id);
		let val = e.target.value
		if (val !== "customize") {
			let resp = {
				type: 'days',
				days: parseInt(val),
				// ic_id: currentUser?.ic_id,
			}
			switch (parseInt(e.target.id)) {
				case 1:
					dispatch(StatusWise(resp));
					setStatusWiseVal(val);
					break;
				case 2:
					//dispatch(StatusWise(resp));
					//setStatusWiseVal(val);
					break;
				case 3:
					//dispatch(ActivityWise(resp));
					//setActivityWiseVal(val)
					break;
				default:
					break;

			}
		}
		else {
			setDropDownValue(e.target.id, val);
			setShow(true);
		}
	}

	let changePlan = (e) => {
		let val = e?.target?.value
		dispatch(MemberWise({
			plan_id: val
		}))
		setMemberWiseVal(val);
	}

	return (
		<>
			<Container>
				<div style={{ display: "flex", justifyContent: "center" }}>
					{/* <WidgetBoard quotes={quotes} /> */}
				</div>
				<Rows>
					<Cols md={12} lg={5} xl={5} sm={12}>
						{!_.isEmpty(statuswise) && !loading1 ?
							<>
								<HeaderContainer>
									<Title>Status Wise</Title>
									<Filter>
										{SelectFilter(statusWiseVal, 1, onChangeHandler)}
									</Filter>
								</HeaderContainer>
								{statuswise?.data.length === 0 ?
									<div className='d-flex flex-wrap align-items-center justify-content-center' style={{ height: '75%' }}>
										<img width='100%' style={{ maxWidth: '430px' }}
											src='/assets/images/nodata-found.png' alt='no plans' />
										{/* <h1 className='display-4 text-secondary text-center'>No Customer Leads Found</h1> */}
									</div> :
									<Graph1 GraphData={statuswise.data} theme={statuswise.theme} />
								}
							</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>
						}
					</Cols>
					<Cols md={12} lg={7} xl={7} sm={12}>
						{((!_.isEmpty(memberwise) && !loading2) || !loading3) ?
							<>
								<HeaderContainer>
									<Title>Plan Wise</Title>
									{!!planlist.length && <Filter>
										<Select value={memberWiseVal} onChange={changePlan}>
											{planlist?.map(({ plan_id, plan_name }, index) => <option key={index + 'member-wise'} value={plan_id}>
												{plan_name}
											</option>)}
										</Select>
									</Filter>}
								</HeaderContainer>
								{!memberwise?.data || memberwise?.data?.length === 0 ?
									<div className='d-flex flex-wrap align-items-center justify-content-center' style={{ height: '75%' }}>
										<img width='100%' style={{ maxWidth: '430px' }}
											src='/assets/images/nodata-found.png' alt='no plans' />
										{/* <h1 className='display-4 text-secondary text-center'>No Customer Leads Found</h1> */}
									</div> :
									<Graph2 GraphData={memberwise.data} />
								}
							</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>
						}
					</Cols>
				</Rows>
				<Row className="m-0">
					<Col className="m-0 p-0">
						<Quotes quotes={quotes} />
					</Col>
				</Row>
			</Container>
			<FilterModal show={show} onHide={() => setShow(false)} id={selectId} />
		</>
	);
};
