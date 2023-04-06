import React, { useEffect } from "react";
import { DataTable } from "modules/user-management";
import { Card, Loader, Select, NoDataFound } from "components";
import { customStatus, exclude } from "./helper";
import { clear, loadPlans } from "../home/home.slice";
import { set_approved, clear as approveClear, set_insurer_id, updateRfq } from '../rfq.slice';
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import swal from "sweetalert";
import { Button } from 'react-bootstrap'
import { useHistory, useParams } from "react-router";

import { Row, Col } from 'react-bootstrap';
import { loadInsurer, selectdropdownData } from 'modules/user-management/user.slice';
// import { _renderDocument } from "../../../components";
import { DateFormate, Encrypt, randomString } from "../../../utils";
import { ModuleControl } from "../../../config/module-control";


const _renderStatusAction = (cell) => {
	return (
		<Button disabled size="sm" className="shadow m-1 rounded-lg" variant={customStatus[cell?.value] || "success"}>
			{cell?.value || "-"}
		</Button>
	);
}


export const UwQuoteView = ({ myModule }) => {

	const dispatch = useDispatch();
	const history = useHistory();
	const { userType } = useParams();
	const { currentUser } = useSelector(state => state.login);
	const { uw, error, loading } = useSelector((state) => state.RFQHome);
	const dropDown = useSelector(selectdropdownData);
	const { approved, error: ApproveError, insurer_id } = useSelector(state => state.rfq);
	// const { currentUser } = useSelector(state => state.login);
	// const [trigger, setTrigger] = useState(currentUser.ic_user_type_id === 4 ? "customers" : "uw");


	useEffect(() => {
		userType === "admin" && dispatch(loadInsurer(1));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// dispatch(clear("uwPreClr"));
		if (currentUser?.ic_id || insurer_id || currentUser?.broker_id) {
			// trigger === "uw" ? 
			userType === "broker" ? dispatch(loadPlans({ broker_id: currentUser?.broker_id })) :
				dispatch(loadPlans({ ic_id: currentUser?.ic_id || insurer_id }))
			// : dispatch(getUw({ is_uw: 0 }));
		}
		// ls.set("uwToken", trigger);
		// dispatch(isUw(trigger));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, insurer_id]);

	// useEffect(() => {
	// 	if (currentUser.ic_user_type_id === 4) {
	// 		setTrigger('customers')
	// 		dispatch(getUw({ is_uw: 0 }));
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [currentUser])

	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [error]);

	useEffect(() => {
		if (approved) {
			swal('Success', approved, "success")
		}
		if (ApproveError) {
			swal("Alert", error, "warning");
		}

		return () => {
			dispatch(set_approved(false));
			dispatch(approveClear())
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [approved, ApproveError])

	const getData = (e) => {
		if (e.target.value) {

			dispatch(set_insurer_id(e.target.value))
		}
		return (e)
	}



	/*-----Table Data-----*/
	let uwTable = uw;
	const UwTableHeaders = !_.isEmpty(uwTable) ? Object.keys(uwTable[0]) : [];

	const _renderApprove = (cell) => {
		const status = cell.row?.original?.status
		switch (status) {
			case "Active": return (
				<Button variant={"success"} size="sm"
					onClick={() => {
						swal({
							title: "Change Plan?",
							text: "Make Changes in Plan data or status!",
							icon: "warning",
							buttons: {
								cancel: "Cancel",
								catch: {
									text: "Update Plan!",
									value: "update",
								},
								inactive: true
							},
							dangerMode: true,
						})
							.then((caseValue) => {
								switch (caseValue) {
									case "update":
										history.push(`rfq-approve/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`)
										break;
									case "inactive":
										dispatch(updateRfq({
											status: 3,
											step: 1,
											ic_plan_id: cell.row.original.id,
										}, {
											ic_plan_id: cell.row.original.id,
											ic_id: currentUser?.ic_id || insurer_id,
											broker_id: currentUser?.broker_id
										}, true));
										break;
									default:
								}
							})
					}}>
					{'Approved'}
				</Button>
			);
			case "Approved": return (
				<Button size="sm" onClick={() => {
					swal({
						title: "Go Live?",
						text: "Make this policy live!",
						icon: "warning",
						buttons: {
							cancel: "Cancel",
							catch: {
								text: "Update Plan!",
								value: "update",
							},
							golive: 'Go Live'
						},
						dangerMode: true,
					})
						.then((caseValue) => {
							switch (caseValue) {
								case "update":
									history.push(`rfq-approve/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`)
									break;
								case "golive":
									dispatch(updateRfq({
										status: 1,
										step: 1,
										ic_plan_id: cell.row.original.id,
									}, {
										ic_plan_id: cell.row.original.id,
										ic_id: currentUser?.ic_id || insurer_id,
										broker_id: currentUser?.broker_id
									}, true));
									break;
								default:
							}
						})
				}}>
					{'Go Live'}
				</Button>
			)
			case "Pending Approval":
				return (<Button size="sm" onClick={() => { history.push(`rfq-approve/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`) }}>
					{'Approve'}
				</Button>);
			default:
				return <></>;
			// }
		}
	}

	let TableData = [
		{
			Header: "Sr No.",
			accessor: "sr_no"
		},
		...UwTableHeaders.map((item, index) => {
			if (
				!(typeof uw[0][`${item}`] === "object" || UwTableHeaders[index] === "id" || exclude.includes(UwTableHeaders[index]))
			) {
				return {
					Header: `${_.capitalize(UwTableHeaders[index]).replace(/_/g, " ")}`,
					accessor: `${UwTableHeaders[index]}`,
				};
			} else return null;
		})
		, ...(!!myModule?.canwrite ?
			[{
				Header: "Approve Action",
				accessor: "changeEnrollmentAction",
				disableFilters: true,
				disableSortBy: true,
				Cell: _renderApprove
			}] : []),
		// ...(trigger !== 'uw' ? [{
		// 	Header: "Document",
		// 	accessor: "document",
		// 	disableFilters: true,
		// 	disableSortBy: true,
		// 	Cell: _renderDocument
		// }] : []),
		// {
		// 	Header: "Copy Plan",
		// 	accessor: "copy_plan",
		//	Cell : customRender,
		// 	disableFilters: true,
		// 	disableSortBy: true,
		// },
		{
			Header: "Status",
			disableFilters: true,
			disableSortBy: true,
			accessor: "status",
			Cell: _renderStatusAction
		},
		// {
		// 	Header: "Operations",
		// 	accessor: "operations",
		// },
	];

	TableData = _.compact(TableData);
	/*--x--Table Data--x--*/


	return !loading ? (
		<Card title={<div className="d-flex justify-content-between">
			<span>RFQ Plan List</span>
			<div>
				{currentUser.ic_user_type_id === 4 &&
					<Button type="button" onClick={() => {
						history.push(`/company-details?creating_user=${currentUser.id}`)
					}} buttonStyle="outline-secondary">
						+ Create quote
					</Button>}
				{ModuleControl.isDevelopment &&
					<Button type="button" onClick={() => {
						history.push(`/company-details?broker_id=${currentUser.broker_id}`)
					}} buttonStyle="outline-secondary">
						+ Create Quote <sub>(on for EB)</sub>
					</Button>}
			</div>
		</div>}>

			{(userType === "admin") &&
				<Row className="d-flex flex-wrap">
					<Col md={6} lg={6} xl={4} sm={12}>
						<Select
							label={"Insurer"}
							placeholder='Select Insurer'
							options={dropDown.map(({ id, name }) => ({
								id,
								name,
								value: id
							}))}
							id="drop"
							onChange={getData}
						/>
					</Col>
				</Row>}

			{((['admin', 'insurer', 'broker'].includes(userType) && !!(currentUser?.ic_id || currentUser?.broker_id)) && !!uw.length) ?
				<DataTable
					columns={TableData || []}
					data={uw.map((data, index) => ({ ...data, sr_no: index + 1, created_at: DateFormate(data.created_at, { type: 'withTime' }) })) || []}
					noStatus={true}
					pageState={{ pageIndex: 0, pageSize: 5 }}
					pageSizeOptions={[5, 10]}
					rowStyle
					// viewLink={'plan-view'}
					// type={"admin/"}
					redirectPolicy={currentUser.ic_user_type_id === 3}
				/> :
				<NoDataFound text='No Plans Found' />}
		</Card>
	) : <Loader />;
};
