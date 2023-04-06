/*
Module: Plan Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useEffect } from 'react'
// import swal from "sweetalert";

// import { Card } from '../../../components'
// import { DataTable } from "../../user-management";

// import { clear, deletePlan } from '../saas.slice';
// import { useDispatch, useSelector } from 'react-redux';
// import { PlansColumn } from '../saas.helper';

// export const PlansData = () => {

//   const { plans, loading, success, error } = useSelector(state => state.saas);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!loading && error) {
//       swal("Alert", error, "warning");
//     };

//     if (!loading && success) {
//       swal('Success', success, "success");
//     };

//     return () => { dispatch(clear()) }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [success, loading, error]);


//   return (
//     <Card title='Plans Data'>
//       <DataTable
//         columns={PlansColumn()}
//         data={plans}
//         noStatus={true}
//         editLink={'/admin/edit'}
//         deleteFlag={'custom_delete'}
//         removeAction={deletePlan}
//         // deleteFlag={'plansDelete'}
//         rowStyle
//       />
//     </Card>
//   )

// }
