/*
Reason: Not In Used (Not Imported by any file)
Commented By: Salman Ahmed
*/

// import React, { useEffect } from "react";
// import swal from "sweetalert";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     getVisit,
//     clear
// } from "../wellness.slice"

// const Visit = () => {

//     const dispatch = useDispatch();
//     const { error,visitURL } = useSelector((state) => state.wellness);
//     useEffect(() => {
//             dispatch(getVisit());
//         //eslint-disable-next-line
//     }, []);

//     useEffect(() => {
//         if (error) {
//             swal(error, "", "warning");
//         }
//         return () => {
//             dispatch(clear());
//         };
//         //eslint-disable-next-line
//     }, [error]);


//     return (
//         <>
//             <div className="mx-2">
//                 <iframe id="myFrame" title="myFrame" src={visitURL} style={{
//                     background:"white",
//                     width: '100%',
//                     border: 'none',
//                     height: '100vh',
//                 }} />
//             </div>
//         </>
//     );
// }

// export default Visit;
