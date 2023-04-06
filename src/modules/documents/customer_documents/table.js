/*
Module: Document
User Type: Broker/Customer
Commented By: Salman Ahmed
*/

// import React, { useState } from "react";
// import { _renderDocument } from "../../../components";
// import { DataTable } from "../../user-management";
// import { deleteCustomerDocument } from "../documents.slice";
// import CustomerDocModal from './editModal'

// const TableData = [
//   {
//     Header: "Document Name",
//     accessor: "document_name",
//   },
//   {
//     Header: "Document",
//     accessor: "document",
//     disableFilters: true,
//     disableSortBy: true,
//     Cell: _renderDocument
//   },
//   {
//     Header: "Operations",
//     accessor: "operations",
//   },
// ];

// const Table = ({ data }) => {

//   const [editModal, setEditModal] = useState();

//   const onEdit = (id, data) => {
//     setEditModal(data);
//   };

//   return (
//     <>
//       <DataTable
//         columns={TableData}
//         data={data || []}
//         noStatus={true}
//         pageState={{ pageIndex: 0, pageSize: 5 }}
//         pageSizeOptions={[5, 10]}
//         rowStyle
//         deleteFlag={'custom_delete'}
//         removeAction={deleteCustomerDocument}
//         EditFlag
//         EditFunc={onEdit}
//       // deleteFlag={`delete-customer-document`}
//       // editCustomerDoc={true}
//       />

//       {!!editModal &&
//         <CustomerDocModal
//           show={!!editModal}
//           id={editModal.id}
//           onHide={() => setEditModal(false)}
//         />
//       }
//     </>
//   );
// };

// export default Table;
