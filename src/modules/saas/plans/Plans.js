/*
Module: Plan Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useState, useEffect } from 'react'

// import { TabWrapper, Tab } from '../../../components'
// import { loadPlans } from '../saas.slice';
// import { useDispatch } from 'react-redux';

// import { CreatePlan } from './CreatePlans';
// import { PlansData } from './PlansData';


// export const Plans = () => {
//   // const { userType, myModule } = props;
//   const [tab, setTab] = useState("PlansData");
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(loadPlans());

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])


//   return (
//     <>
//       <TabWrapper width='250px'>
//         <Tab isActive={Boolean(tab === "PlansData")} onClick={() => setTab("PlansData")}>Plans Data</Tab>
//         <Tab isActive={Boolean(tab === "CreatePlan")} onClick={() => setTab("CreatePlan")}>Create Plans</Tab>
//       </TabWrapper>

//       {(tab === "CreatePlan") && <CreatePlan setDataTable={setTab} />}
//       {(tab === "PlansData") && <PlansData />}
//     </>
//   )
// }
