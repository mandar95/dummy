import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteMemberDetails } from "../customerProfile.slice";
import MemberDetailsModal from './editModal';

const TableData = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Designation",
    accessor: "designation_name"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Mobile No",
    accessor: "contact_no"
  },
  {
    Header: "Operations",
    accessor: "operations",
  },
];

const Table = ({ data }) => {

  const [editModal, setEditModal] = useState();

  const onEdit = (id, data) => {
    setEditModal(data);
  };

  return (
    <>
      <DataTable
        columns={TableData}
        data={data || []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10]}
        rowStyle
        deleteFlag={'custom_delete'}
        removeAction={deleteMemberDetails}
        EditFlag
        EditFunc={onEdit}
      // editMemberDetail={true}
      />

      {!!editModal &&
        <MemberDetailsModal
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
