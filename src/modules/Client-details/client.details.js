
/*
Module: Client Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useEffect, useState } from 'react';
// import { CardBlue } from "../../components"
// import { DataTable } from '../user-management';
// import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom'
// import { GetClientDetails } from './client.details.slice';
// import { Spinner } from 'react-bootstrap';
// import styled from 'styled-components';

// export const ClientDetails = () => {
//     const [loading, setLoading] = useState(false);
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const { details } = useSelector(state => state.clientDetails);
//     useEffect(() => {
//         dispatch(GetClientDetails())

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
//     const RedirectTo = (id) => {
//         if (!!id) {
//             setLoading(true);
//             let timer = setTimeout(() => {
//                 setLoading(false);
//                 clearTimeout(timer);
//                 history.push(`/client/view/${id}`);
//             }, 800)
//         }
//     }
//     return <>

//         {loading && <BgScreen />}
//         {loading &&
//             <Position>
//                 <Spinner animation="border" role="status" style={{ margin: " 8rem auto" }}>
//                     <span className="sr-only">Loading...</span>
//                 </Spinner>
//             </Position>}
//         <CardBlue title={<p>Client Details</p>}>
//             <DataTable
//                 columns={ClientDetailsHeader(RedirectTo)}
//                 data={details}
//                 // redirectTo={RedirectTo}
//                 noStatus={true}
//                 rowStyle />
//         </CardBlue>
//     </>
// }

// const BgScreen = styled.div`
// position : fixed;
// background-color : #272727;
// opacity : 0.5;
// width : 100%;
// height : 100%;
// z-index : 100;
// top : 0;
// `;

// const Position = styled.div`
// display : grid;
// width : 100%;
// height : 100vh;
// position : fixed;
// z-index : 200;
// `;

// const PolicyTypesMerge = (cell) => {
//     let resp = cell.value?.split(",").map(v => {
//         let acronym = v.split(/\s/).reduce((acc, cur) => {
//             if (cur !== 'Top' && cur !== 'Up') {
//                 acc += cur.slice(0, 1)
//             }
//             else {
//                 acc = acc + " " + cur;
//             }
//             return acc;
//         }, '');
//         return acronym;
//     })
//     resp = String(resp)
//     return resp;
// }

// const _renderMemberData = (cell, redirectTo) => {
//     return <div className="d-flex justify-content-around">
//         <div className="border border-dark rounded-pill px-3 py-2"
//             style={{ backgroundColor: "rgb(231 19 226 / 23%)", color: "#6f42c1", borderColor: "#6f42c1", cursor: "pointer" }}
//             onClick={() => redirectTo(cell.row.original.id)}>
//             <i className="ti-eye" />
//         </div>
//         {/* <div className="border border-dark rounded-pill px-3 py-2"
//             style={{ backgroundColor: "rgb(231 19 226 / 23%)", color: "#6f42c1", borderColor: "#6f42c1", cursor: "pointer" }}>
//             <i className="ti-cloud-down" />
//         </div> */}
//     </div>
// }

// const ClientDetailsHeader = (RedirectTo) => [{
//     Header: "Client Name",
//     accessor: "name"
// }, {
//     Header: "Plan Types",
//     accessor: "plan_type"
// }, {
//     Header: "Subscription Start Date",
//     accessor: "subscription_start_date"
// }, {
//     Header: "Subscription End Date",
//     accessor: "subscription_end_date"
// }, {
//     Header: "Subscription Mode",
//     accessor: "subscription_mode"
// },
// {
//     Header: "Subscription Amount",
//     accessor: "subscription_amount"
// },
// {
//     Header: "Policy Types",
//     accessor: "policy_type",
//     Cell: PolicyTypesMerge
// },
// {
//     Header: "Total Member",
//     accessor: "total_members"
// }, {
//     Header: "Total Corporate",
//     accessor: "total_corporate"
// },
// {
//     Header: "Member Data",
//     accessor: "member_data",
//     Cell: (data) => _renderMemberData(data, RedirectTo),
//     disableFilters: true,
//     disableSortBy: true,
// }]

// // id: 1
// // name: "HDFC"
// // plan_type: "Gold"
// // policy_type: "Group Mediclaim,Group Personal Accident,Group Term Life,Voluntry Mediclaim Top Up,Voluntry Personal Accident Top Up,Voluntry Term Life Top Up"
// // subscription_amount: 600
// // subscription_end_date: "2020-12-07"
// // subscription_mode: "Quaterly"
// // subscription_start_date: "2020-09-07"
// // total_corporate: 4
// // total_members: 73
// // type: "Broker"

// // const dummyData = [{
// //     client_name: "ABC",
// //     plan_type: "Platinum",
// //     start_date: "31/08/2020",
// //     end_date: "31/09/2020",
// //     mode: "Annualy",
// //     amount: "1000",
// //     policy_type: "GMC/GPA/GTL",
// //     total_member: 5000,
// //     total_corporate: 10,
// //     status: "Active",
// //     member_data: ""
// // }]

// // {
// //     "status": true,
// //         "data": [{
// //             "id": 1,
// //             "name": "HDFC",
// //             "type": "Broker",
// //             "plan_type": "Gold",
// //             "subscription_start_date": "2020-09-07",
// //             "subscription_end_date": "2020-12-07",
// //             "subscription_mode": "Quaterly",
// //             "subscription_amount": 600,
// //             "policy_type": "Group Mediclaim,Group Personal Accident,Group Term Life,Voluntry Mediclaim Top Up,Voluntry Personal Accident Top Up,Voluntry Term Life Top Up",
// //             "total_members": 73,
// //             "total_corporate": 4
// //         }]
// // }
