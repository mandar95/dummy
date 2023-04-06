import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteEM } from "../wellness.slice";
import EditEM from './editModal';
import { _renderAIStatus } from "components";

const TableData = (operations) => [
  {
    Header: "Employer",
    accessor: "empoyer_name",
  },
  {
    Header: "Benefit",
    accessor: "benefit_name",
  },
  {
    Header: "Complementary",
    accessor: "complementary",
  },
  {
    Header: "Flex",
    accessor: "flex",
  },
  // {
  //   Header: "Non Flex",
  //   accessor: "non_flex",
  // },
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

  // const deleteFlag = 'benefit-employer-mapping';
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
        removeAction={deleteEM}
        EditFlag={!!myModule?.canwrite ? true : false}
        EditFunc={myModule?.canwrite && onEdit}
      // editEmFlag={myModule?.canwrite ? true : false}
      // AI_status
      />

      {!!editModal &&
        <EditEM
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
