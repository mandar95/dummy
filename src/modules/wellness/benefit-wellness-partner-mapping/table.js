import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteBWPM } from "../wellness.slice";
import EditBWPM from './editModal';
import { _renderAIStatus } from "components";

const TableData = (operations) => [
  {
    Header: "Wellness Partner",
    accessor: "wellness_partner_name",
  },
  {
    Header: "Benefits",
    accessor: "benefit_name",
  },
  {
    Header: "URL",
    accessor: "wellness_partner_url",
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

  // const deleteFlag = 'benefit-wellness-mapping';
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
        removeAction={deleteBWPM}
        EditFlag={!!myModule?.canwrite ? true : false}
        EditFunc={myModule?.canwrite && onEdit}
      // editBwpmFlag={myModule?.canwrite ? true : false}
      // AI_status
      />

      {!!editModal &&
        <EditBWPM
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
