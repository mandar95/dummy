
/*
Module: Client Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useEffect } from 'react';
// import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useHistory } from 'react-router-dom';
// import { GetClientDetailById } from './client.details.slice';
// import swal from "sweetalert";
// import Table from './table';
// import { IconlessCard } from '../../components';

// export const ClientViewDetails = () => {
//     const { id } = useParams();
//     const dispatch = useDispatch();
//     const history = useHistory();
//     const { profileDetails, policyDetails, stats, plan, errorStatus, errorMsg } = useSelector(state => state.clientDetails);
//     useEffect(() => {
//         dispatch(GetClientDetailById(id));
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id])
//     useEffect(() => {
//         if (errorStatus) {
//             swal(errorMsg, "", "warning").then(() => {
//                 history.push('/client-details');
//             })
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [errorStatus])
//     return <>
//         <BgCard>
//             <OverHeadCard>
//                 <Text>Client stats</Text>
//                 <hr />
//                 <ClientStats>
//                     <Stats>
//                         <img src={profileDetails.logo} alt="" width={"33%"} />
//                         {/* <Item>Type</Item>
//                         <SubItem>{stats.type}</SubItem> */}
//                     </Stats>
//                     <Stats>
//                         <Item>Total Corporate</Item>
//                         <SubItem>{stats.total_corporate}</SubItem>
//                     </Stats>
//                     <Stats>
//                         <Item>Total Members</Item>
//                         <SubItem>{stats.total_members}</SubItem>
//                     </Stats>
//                 </ClientStats>
//             </OverHeadCard>
//         </BgCard>
//         <CardWrapper className="h-100">
//             <Card>
//                 <Text>Profile Details</Text>
//                 <hr />
//                 <CardText>Client Name : {profileDetails.name}</CardText>
//                 <CardText>PAN Card No. : {profileDetails.pan}</CardText>
//                 <CardText>GST No. : {profileDetails.gstn}</CardText>
//                 <CardText>Country : {profileDetails.country_name}</CardText>
//                 <CardText>State : {profileDetails.state_name}</CardText>
//                 <CardText>Pincode : {profileDetails.pincode}</CardText>
//                 <CardText>Contact : {profileDetails.contact}</CardText>
//                 <CardText>Alternate Contact : &nbsp;{profileDetails.contact_2 || "-"}&nbsp;</CardText>
//                 <CardText>Second Alternate Contact  : &nbsp;{profileDetails.contact_3 || "-"}</CardText>
//                 <CardText>Email Id : {profileDetails.email_1}</CardText>
//                 <CardText>Alternate Email Id : &nbsp;{profileDetails.email_2 || "-"}&nbsp;</CardText>
//                 <CardText>Address Line 1 : &nbsp;{profileDetails.address_line_1 || "-"}&nbsp;</CardText>
//                 <CardText>Address Line 2 : &nbsp;{profileDetails.address_line_2 || "-"}&nbsp;</CardText>
//                 <CardText>Address Line 3 : &nbsp;{profileDetails.address_line_3 || "-"}&nbsp;</CardText>
//             </Card>
//             <Card>
//                 <Text>Policy Details</Text>
//                 <hr />
//                 {/*<CardText>Plan Name : <Plan type={policyDetails.plan}>&nbsp;{policyDetails.plan || "-"}&nbsp;</Plan></CardText>*/}
//                 <CardText>Policy Type : &nbsp;{policyDetails.policy_type || "-"}&nbsp;</CardText>
//                 <CardText>Sub Policy Name : </CardText>
//                 {policyDetails?.sub_policy_name?.map((v, i) =>
//                     <CardText key={i + 'sub_policy_name'}>&nbsp;<SubPlan>{v || "-"}</SubPlan>&nbsp;</CardText>)}

//             </Card>
//             <Card>
//                 <Text>Plan Details</Text>
//                 <hr />
//                 <CardText>Plan Type : <Plan type={plan.plan_type}>&nbsp;{plan.plan_type || ""}&nbsp;</Plan></CardText>
//                 <CardText>Subscription : </CardText>
//                 <div >
//                     <CardText>Start Date : &nbsp;{plan.subscription_start_date || "-"}&nbsp; </CardText>
//                     <CardText>End Date : &nbsp;{plan.subscription_end_date || "-"}&nbsp;</CardText>
//                     <CardText>Mode : &nbsp;{plan.subscription_mode || "-"}&nbsp;</CardText>
//                     <CardText>Amount :  &#8377;&nbsp;{plan.subscription_amount || "-"}&nbsp;</CardText>
//                     <CardText>Status : &nbsp;<SubPlan>{plan.status || "-"}</SubPlan>&nbsp;</CardText>
//                 </div>
//             </Card>
//         </CardWrapper>
//         <IconlessCard title="Client Details" styles={{ borderRadius: "12px" }}>
//             <Table />
//         </IconlessCard>

//     </>
// }

// const BgCard = styled.div`
// width : 100%;
// height : 100px;
// background-color : #2e0d34;
// position : relative;
// `;

// const OverHeadCard = styled.div`
// height : 200px;
// width : 90%;
// background-color : #fff;
// position :  absolute;
// top : 30px;
// left : 5%;
// border-radius : 0.5em;
// box-shadow : 0px 4px 6px 0px #27272759;
// @media (max-width : 500px){
//     height : auto;
// }

// `;

// const Text = styled.div`
// width : auto;
// margin : 1em;

// const CardWrapper = styled.div`
// width: 100%;
//     margin-top: 12rem;
//     display: flex;
//     flex-direction : row;
//     @media (max-width : 1024px){
//         flex-direction :  column;
//         align-items : center;
//         margin-top: 16rem;
//     }
// `;

// const Card = styled.div`
// min-width: 200px;
//     width: 33%;
//     margin: 1em;
//     background-color: #ffffff;
//     min-height: 200px;
//     height : ${props => props.height || ""};
//     border-radius : 0.5em;
// box-shadow : 1px 1px 3px 0px #27272759;
// @media (max-width : 1024px){
//     width : 80%;
// }
// `;


// const ClientStats = styled.div`
// display : flex;
// flex-direction : row;
// padding : 2rem;
// @media (max-width : 500px){
//     flex-direction : column;
//     align-items : center;
// }
// `;

// const Stats = styled.div`
// width : 33%;
// text-align : center;
// @media (max-width : 500px){
//     width : 100%;
//     margin : 6px 0;
// }
// `;

// const Item = styled.div`
// color : #2e0d34;
// `;

// const SubItem = styled.div`
// color : #595656b5;
// `;


// const CardText = styled(Text)`
// color : #595656b5;
// `;


// const Plan = styled.span`
// padding: 2px 4px;
// border-radius : 5px;
// ${props => {
//         if (props.type === "Gold") {
//             return {
//                 "background-color": "#ffd571",
//                 "color": "#fff",
//             };
//         }
//         else {
//             return ""
//         }
//     }}`;

// const SubPlan = styled.span`
// padding: 2px 4px;
// border-radius : 5px;
// background-color : #28df99;
// color : #fff;
// `;
