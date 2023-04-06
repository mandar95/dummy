import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteICD } from "../wellness.slice";
import EditICD from './editModal';
import { _renderAIStatus } from "components";

const TableData = (operations) => [
  {
    Header: "ICD Code",
    accessor: "icd_code",
  },
  {
    Header: "ICD Name",
    accessor: "icd_name",
  },
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderAIStatus
  },
  ...(operations ?
    [{
      Header: "Operations",
      accessor: "operations",
    }] : [])
];

const Table = ({ data, myModule }) => {

  // const deleteFlag = 'icd-code-master';
  const [editModal, setEditModal] = useState();

  const onEdit = (id, data) => {
    setEditModal(data);
  };

  return (
    <>
      <DataTable
        columns={TableData(myModule?.canwrite || myModule?.candelete)}
        data={data || []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10]}
        rowStyle
        deleteFlag={myModule?.candelete ? 'custom_delete' : false}
        removeAction={deleteICD}
        EditFlag={!!myModule?.canwrite ? true : false}
        EditFunc={myModule?.canwrite && onEdit}
      // editICDFlag={myModule?.canwrite ? true : false}
      // AI_status
      />

      {!!editModal &&
        <EditICD
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
