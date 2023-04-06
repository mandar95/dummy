/*
Module: Client Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import { createSlice } from '@reduxjs/toolkit';
// import { getClientDetails, getClientDetailsById } from './client.details.service';

// export const clientDetailsSlice = createSlice({
//     name: "clientDetails",
//     initialState: {
//         details: [],
//         profileDetails: "",
//         policyDetails: "",
//         stats: "",
//         plan: "",
//         errorStatus: false,
//         errorMsg: ""
//     },
//     reducers: {
//         setClientDetails: (state, action) => {
//             state.details = action.payload;
//         },
//         setClientDetailParameters: (state, action) => {
//             state.profileDetails = action.payload.profileDetails;
//             state.policyDetails = action.payload.policyDetails;
//             state.stats = action.payload.stats;
//             state.plan = action.payload.plan;
//         },
//         setError: (state, action) => {
//             state.errorStatus = action.payload.status;
//             state.errorMsg = action.payload.error;
//         },
//         clearError: (state, action) => {
//             state.errorStatus = false;
//             state.errorMsg = "";
//         }
//     }
// })

// const { setClientDetails, setClientDetailParameters, setError, clearError } = clientDetailsSlice.actions;


// export const GetClientDetails = () => {
//     return async dispatch => {
//         dispatch(clearError());
//         try {
//             let response = await getClientDetails();
//             if (response.data.status) {
//                 dispatch(setClientDetails(response?.data?.data));
//             }
//         }
//         catch (error) {
//             dispatch(setError({ status: true, error: "Something went wrong!!!" }));
//         }
//     }
// }

// export const GetClientDetailById = (id) => {
//     return async dispatch => {
//         dispatch(clearError());
//         try {
//             let response = await getClientDetailsById(id);
//             if (response?.data?.status) {
//                 let { profile_details, policy_details, stats, plan } = response?.data?.data[0];
//                 dispatch(setClientDetailParameters({
//                     profileDetails: profile_details,
//                     policyDetails: policy_details,
//                     stats,
//                     plan
//                 }))
//             }
//         }
//         catch (error) {
//             dispatch(setError({ status: true, error: "Something went wrong!!!" }));
//         }
//     }
// }

// export default clientDetailsSlice.reducer;
// // {"status":true,
// // "data":[{
// //     "profile_details":{"name":"HDFC",
// //     "pan":"AAAPL1234C",
// //     "gstn":"27AAPFU0939F1ZV",
// //     "country_name":"INDIA",
// //     "state_name":"Telangana",
// //     "pincode":"400601",
// //     "address_line_1":"HDFC Centre Office",
// //     "address_line_2":"Mumbai H.O",
// //     "address_line_3":null,
// //     "email_1":"contact@hdfc.com",
// //     "email_2":null,"email_3":null,
// //     "contact":"9293212299",
// //     "contact_2":null,
// //     "contact_3":null},

// //     "policy_details":{"plan":"Gold",
// //     "policy_type":"Group",
// //     "sub_policy_name":["Group Mediclaim","Group Personal Accident",
// //     "Group Term Life",
// //     "Voluntry Mediclaim Top Up",
// //     "Voluntry Personal Accident Top Up",
// //     "Voluntry Term Life Top Up"]},

// //     "stats":{"type":"Broker",
// //     "total_corporate":4,
// //     "total_members":73},

// //     "plan":{"plan_type":"Gold",
// //     "subscription_start_date":"2020-09-07",
// //     "subscription_end_date":"2020-12-07",
// //     "subscription_mode":"Quaterly",
// //     "subscription_amount":600,
// //     "status":"Active"}}]}
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
