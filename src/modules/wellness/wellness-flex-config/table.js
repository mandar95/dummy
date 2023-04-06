import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteWF } from "../wellness.slice";
import EditWF from './editModal';
import { _renderAIStatus } from "components";

const TableData = (operations) => [
  {
    Header: "Employer",
    accessor: "employer_name",
  },
  {
    Header: "Flex Benefit Applicable",
    accessor: "flex_applicable",
  },
  {
    Header: "Wellness Redirection Applicable",
    accessor: "wellness_redirection",
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

  // const deleteFlag = 'wellness-flex-config';
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
        removeAction={deleteWF}
        EditFlag={!!myModule?.canwrite ? true : false}
        EditFunc={myModule?.canwrite && onEdit}
      // editWfFlag={myModule?.canwrite ? true : false}
      // AI_status
      />

      {!!editModal &&
        <EditWF
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
