import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteCMS } from "../wellness.slice";
import EditCMS from './editModal';
import { _renderAIStatus } from "components";

const TableData = (operations) => [
  {
    Header: "Employer Name",
    accessor: "employer_name",
  },
  {
    Header: "Dynamic Content",
    accessor: "dynamic_content",
  },
  // {
  //   Header: "Static Content",
  //   accessor: "static_content",
  // },
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

  // const deleteFlag = 'wellness-benefit-cms';
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
        removeAction={deleteCMS}
        EditFlag={!!myModule?.canwrite ? true : false}
        EditFunc={myModule?.canwrite && onEdit}
      // editCmsFlag={myModule?.canwrite ? true : false}
      // AI_status
      />

      {!!editModal &&
        <EditCMS
          show={!!editModal}
          id={editModal.id}
          onHide={() => setEditModal(false)}
        />
      }
    </>
  );
};

export default Table;
