import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Spinner } from "react-bootstrap";
import _ from "lodash";
import {
	CircularProgressbar,
	buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChangingProgressProvider from "../ChangingProgressProvider"

import FilterModal from "../modal";

import { clear, GetVisitedCustomer, PolicyWise, StatusWise, ActivityWise } from "../dashboard_insurer.slice";
import swal from "sweetalert";


import styled from "styled-components";
import Graph1 from "../graph/Graph1";
import Graph2 from "../graph/Graph2";
import Graph3 from "../graph/Graph3";
import Graph22 from "../graph/Graph22";
import { useParams } from "react-router";

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
   }
`
const LoaderDiv = styled.div`
height: 435px;
display: flex;
justify-content: center;
align-items: center;
`
const ProgressiveDiv = styled.div`
max-width: 285px;
margin: auto;
.CircularProgressbar{
	width: auto;
}
@media (max-width:353px) {
	max-width:230px;
   }
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

// const MainView = ({ statuswise, policywise, premiumwise }) => {
const MainView = () => {
	const dispatch = useDispatch();
	const { userType } = useParams();
	const { error, loading1, loading2, loading3, loading4 } = useSelector((state) => state.InsDash);
	const { currentUser } = useSelector((state) => state.login);

	const { policywise, statuswise, activitywise, visitedCustomer } = useSelector(
		(state) => state.InsDash
	);

	const [show, setShow] = useState(false);
	const [policyWiseVal, setPolicyWiseVal] = useState("30");
	const [statusWiseVal, setStatusWiseVal] = useState("30");
	const [activityWiseVal, setActivityWiseVal] = useState("30");
	const [lineChart, setLineChart] = useState(true);
	const [selectId, setSelectId] = useState(null);


	useEffect(() => {
		if (currentUser?.ic_id || currentUser?.broker_id) {
			let resp = {
				days: parseInt(30),
				type: 'days',
				...userType === 'broker' ?
					{ broker_id: currentUser?.broker_id } :
					{ ic_id: currentUser?.ic_id }
			}
			// if (currentUser?.ic_user_type_id === 1 || currentUser?.ic_user_type_id === 4) {
			// 	dispatch(PolicyWise(resp));
			// }
			// else if (currentUser?.ic_user_type_id === 2 || currentUser?.ic_user_type_id === 3) {
			// 	dispatch(DocumentWise(resp));
			// }
			dispatch(PolicyWise(resp));
			dispatch(StatusWise(resp));
			dispatch(ActivityWise(resp));
			dispatch(GetVisitedCustomer({
				...userType === 'broker' ?
					{ broker_id: currentUser?.broker_id } :
					{ ic_id: currentUser?.ic_id }
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	//onError
	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	let toggleChart = (e) => {
		if (parseInt(e.target.id) === 1) {
			setLineChart(true);
		}
		else {
			setLineChart(false);
		}
	}

	let setDropDownValue = (id, val) => {
		switch (parseInt(id)) {
			case 1:
				setPolicyWiseVal(val);
				break;
			case 2:
				setStatusWiseVal(val);
				break;
			case 3:
				setActivityWiseVal(val)
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
				...userType === 'broker' ?
					{ broker_id: currentUser?.broker_id } :
					{ ic_id: currentUser?.ic_id }

			}
			switch (parseInt(e.target.id)) {
				case 1:
					//(currentUser?.ic_user_type_id === 1 || currentUser?.ic_user_type_id === 4 ? dispatch(PolicyWise(resp)) : dispatch(DocumentWise(resp)))
					dispatch(PolicyWise(resp))
					setPolicyWiseVal(val);
					break;
				case 2:
					dispatch(StatusWise(resp));
					setStatusWiseVal(val);
					break;
				case 3:
					dispatch(ActivityWise(resp));
					setActivityWiseVal(val)
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

	return (
		<>
			<Container>
				<Rows>
					<Cols md={12} lg={5} xl={5} sm={12}>
						{!_.isEmpty(policywise) && !loading1 ?
							<>
								<HeaderContainer>
									<Title>Plan Wise</Title>
									<Filter>
										{SelectFilter(policyWiseVal, 1, onChangeHandler)}
									</Filter>
								</HeaderContainer>
								{policywise?.data.length === 0 ?
									<div className='d-flex flex-wrap align-items-center justify-content-center' style={{ height: '75%' }}>
										<img width='100%' style={{ maxWidth: '430px' }}
											src='/assets/images/nodata-found.png' alt='no plans' />
										{/* <h1 className='display-4 text-secondary text-center'>No Customer Leads Found</h1> */}
									</div> :
									<Graph1 GraphData={policywise.data} theme={policywise.theme} type={'insurer'} />
								}
							</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>}
					</Cols>
					<Cols md={12} lg={7} xl={7} sm={12}>
						{!_.isEmpty(statuswise) && !loading2 ? <>
							<HeaderContainer>
								<Title>Status Wise</Title>
								<div className="btn-group" role="group" aria-label="Basic example">
									<button type="button" className="btn btn-secondary" id={1} onClick={toggleChart}>Curv Series</button>
									<button type="button" className="btn btn-secondary" id={2} onClick={toggleChart}>Line Chart</button>
								</div>
								<Filter>
									{SelectFilter(statusWiseVal, 2, onChangeHandler)}
								</Filter>
							</HeaderContainer>
							{statuswise?.data.length === 0 ?
								<div className='d-flex flex-wrap align-items-center justify-content-center' style={{ height: '75%' }}>
									<img width='100%' style={{ maxWidth: '430px' }}
										src='/assets/images/nodata-found.png' alt='no plans' />
									{/* <h1 className='display-4 text-secondary text-center'>No Customer Leads Found</h1> */}
								</div> :
								lineChart ? <Graph2 GraphData={statuswise.data} theme={statuswise.theme} />
									: <Graph22 GraphData={statuswise.data} theme={statuswise.theme} />
							}
						</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>}
					</Cols>
				</Rows>
				<Rows style={{ marginTop: '35px' }}>
					<Cols md={12} lg={4} xl={4} sm={12}>
						{(!_.isEmpty(visitedCustomer) && !loading4) ? <>
							<HeaderContainer className="justify-content-center mb-5">
								<Title>New Visitors</Title>
							</HeaderContainer>
							<ProgressiveDiv>
								<ChangingProgressProvider values={[0, visitedCustomer.data]}>
									{percentage => (
										<CircularProgressbar
											value={percentage}
											text={`${percentage}%`}
											background
											strokeWidth={5}
											styles={buildStyles({
												pathTransition: percentage === 0 ? "none" : "stroke-dashoffset 0.9s ease 0s",
												backgroundColor: "#fff",
												textColor: "#565656",
												pathColor: "rgb(243 0 137 / 78%)",
												trailColor: "#e4e4e49e"
											})}
										/>
									)}
								</ChangingProgressProvider>
							</ProgressiveDiv>
						</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>}
					</Cols>
					<Cols md={12} lg={8} xl={8} sm={12}>
						{!_.isEmpty(activitywise) && !loading3 ? <>
							<HeaderContainer>
								<Title>Activity Wise</Title>
								<Filter>
									{SelectFilter(activityWiseVal, 3, onChangeHandler)}
								</Filter>
							</HeaderContainer>
							{activitywise?.data.length === 0 ?
								<div className='d-flex flex-wrap align-items-center justify-content-center'>
									<img width='100%' style={{ maxWidth: '430px' }}
										src='/assets/images/nodata-found.png' alt='no plans' />
									{/* <h1 className='display-4 text-secondary text-center'>No Customer Leads Found</h1> */}
								</div> :
								<Graph3 GraphData={activitywise.data} theme={activitywise.theme} />
							}

						</> : <LoaderDiv>{ThreeSpinner()}</LoaderDiv>}
					</Cols>
				</Rows>
			</Container>
			<FilterModal show={show} userType={userType} onHide={() => setShow(false)} id={selectId} />
		</>
	);
};

export default MainView;
