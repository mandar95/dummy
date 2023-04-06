import React, { useState, useEffect } from 'react';


// import { Row } from 'react-bootstrap';
import { FAQ } from './FAQ/FAQ';
import { QueryComplaint } from './QueriesComplaint/QueryComplaint';
import { FeedBack } from './FeedBack/FeedBack';
import ChooseBroker from './ChooseBroker';
import { TabWrapper, Tab } from "components";
import { HelpInsurer } from '../insurerHelp';

import { useDispatch, useSelector } from 'react-redux';
import {
	loadBrokerFAQ, loadFeedBackBroker,
	// loadEmployer, 
	clearEmployer,
	loadSubTypePolicy, clear_sub_type_policy,
	clear_broker_feedback, clear, clear_queries_complaint
} from '../help.slice'
import { useHistory } from 'react-router';
// import { Button } from '../../../components';
import {
	fetchEmployers,
	setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { EscalationMatrix } from './escalation-matrix/EscalationMatrix';


export const HelpBroker = ({ userType, myModule, validation }) => {

	const [tab, setTab] = useState("FAQs");
	const [show, setShow] = useState(true);
	const [helpType, setHelpType] = useState('');
	const history = useHistory();
	const dispatch = useDispatch();
	const { firstPage, employers,
		lastPage } = useSelector(
			(state) => state.networkhospitalbroker
		);
	const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
	useEffect(() => {
		// loadEmployers(dispatch);
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		if ((currentUser?.broker_id) && userTypeName !== "Employee") {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, currentUser]);
	useEffect(() => {
		if (userType === 'broker') {
			dispatch(loadBrokerFAQ());
			dispatch(loadFeedBackBroker());
			dispatch(clear_queries_complaint());
			// dispatch(loadEmployer());
			dispatch(loadSubTypePolicy());

		}

		return () => {
			dispatch(clear_broker_feedback());
			dispatch(clear());
			dispatch(clearEmployer());
			dispatch(clear_sub_type_policy());
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userType])

	useEffect(() => {
		if (currentUser?.is_rfq) {
			if (currentUser?.is_rfq === 1) setHelpType('rfq')
			if (currentUser?.is_rfq === 3) setHelpType('normal')
		}
		if (currentUser?.is_rfq === 0) {
			setHelpType('normal')
		}


	}, [currentUser])

	useEffect(() => {
		if (!helpType && !show) {
			history.goBack()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show])


	// if ((!currentUser.is_rfq || currentUser.is_rfq !== 0)) {
	// 	return <Loader />
	// }
	if (currentUser.is_rfq === 2 && !helpType) {
		return (<ChooseBroker show={show} onHide={() => setShow(false)}
			setHelpType={setHelpType} />)
	}

	if (helpType === 'normal') {

		return (userType === "broker" ?
			<>
				{/* < Col md={12} lg={10} xl={10} sm={12} className="p-0">
					<Paper>
						<Col className="my-auto" md={9} lg={9} xl={9} sm={12}>
							Lorem Ipsum Lorem Ipsum,
							Lorem Sipum Lorem Ipsum,
							You Can Enter Your Retail Policy Details,
							This Help You To Manage All Your Insurance Cover Under One Roof.
					</Col>
						<Col md={2} lg={2} xl={2} sm={12} className="text-center p-0">
							<img src="/assets/images/bal-policy.png" alt="" />
						</Col>
					</Paper>
				</Col> */}
				{/* <div><Button type="button" onClick={() => {
						setHelpType(helpType === 'rfq' ? 'normal' : 'rfq')
					}} buttonStyle="outline-secondary">
						Switch to {helpType === 'rfq' ? 'Post Help' : 'Pre Help'}
					</Button></div> */}
				<TabWrapper width='max-content'>
					<Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")}>FAQs</Tab>
					<Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")}>Queries & Complaints</Tab>
					<Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")}>Feedback</Tab>
					<Tab isActive={Boolean(tab === "Escalation Matrix")} onClick={() => setTab("Escalation Matrix")}>Escalation Matrix</Tab>
				</TabWrapper>

				{(tab === "FAQs") && <FAQ userType={userType} myModule={myModule} validation={validation} />}
				{(tab === "Queries & Complaints") && <QueryComplaint userType={userType} myModule={myModule} employer={employers} />}
				{(tab === "Feedback") && <FeedBack employer={employers} userType={userType} myModule={myModule} />}
				{(tab === "Escalation Matrix") && <EscalationMatrix employers={employers} userType={userType} myModule={myModule} />}
			</>
			: ""
		)
	}

	if (helpType === 'rfq') {
		return <HelpInsurer myModule={myModule} validation={validation} />
	}
	return null;
}
// const Paper = styled(Row)`
// background-color : ${props => props.backgroundColor || "#f2c9fb"};
// border-radius : ${props => props.radius || "2.6em"};
// box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
// margin : ${props => props.margin || "2em"};
// padding : ${props => props.padding || "2em !important"};
// color : ${props => props.color || "#6334e3"};
// display: flex;
// margin-right: 35px !important;
// margin-left: 35px !important;
// flex-wrap: wrap;
// @media (max-width: 767px) {
// 	margin: 10px !important;
// }
// `;

