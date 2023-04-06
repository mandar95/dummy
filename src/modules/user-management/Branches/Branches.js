// import React, { useEffect, useState } from 'react'

// import { DataTable } from '../';
// import { BranchModal } from './BranchModal';
// import { Loader, Card } from 'components'
// import { Button } from 'react-bootstrap'

// import {
//   clear,
//   deleteChildCompany, loadChildCompanys,
//   selectError, selectLoading, selectSuccess, selectUsersData
// } from '../user.slice';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearData } from '../../announcements/announcement.slice';
// import swal from 'sweetalert';

// export default function Branches() {

//   const dispatch = useDispatch();
//   const [modal, setModal] = useState(null);
//   const userData = useSelector(selectUsersData);
//   const error = useSelector(selectError);
//   const success = useSelector(selectSuccess);
//   const loading = useSelector(selectLoading);
//   const { currentUser, userType } = useSelector(state => state.login);

//   useEffect(() => {
//     if (currentUser.employer_id)
//       dispatch(loadChildCompanys({ employer_id: currentUser.employer_id }));

//     return () => { dispatch(clearData()) };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentUser])

//   useEffect(() => {
//     if (!loading && error) {
//       swal("Alert", error, "warning");
//     };
//     if (!loading && success) {
//       swal('Success', success, "success");
//     };

//     return () => { dispatch(clear()) }
//   }, [success, error, loading, dispatch]);

//   // const onEdit = (id, data) => {
//   //   setModal(data);
//   // };

//   const onDelete = (id) => {
//     dispatch(deleteChildCompany({ employer_child_company_id: id }, currentUser.employer_id, userType))
//   };

//   return (
//     <Card title={<>
//       <div className="d-flex justify-content-between">
//         <span>Sub Entities</span>
//         <div>
//           <Button type="button" size='sm' onClick={() => setModal(true)}>
//             Create New +
//           </Button>
//         </div>
//       </div>
//     </>}>
//       <DataTable
//         columns={Column()}
//         data={userData?.data || []}
//         noStatus
//         rowStyle
//         // EditFlag
//         // EditFunc={onEdit}
//         deleteFlag={'custom_delete_action'}
//         removeAction={onDelete}
//       />
//       {!!modal &&
//         <BranchModal
//           show={!!modal}
//           Data={[]}
//           employer_id={currentUser.employer_id}
//           // editData={modal}
//           employer
//           onHide={() => setModal(null)}
//         />
//       }
//       {(loading) && <Loader />}
//     </Card>
//   )
// }

// const Column = () => [
//   {
//     Header: "Branch",
//     accessor: "name",
//   },
//   {
//     Header: "Operations",
//     accessor: "operations",
//     // Cell: _renderEdit
//   }
// ]


