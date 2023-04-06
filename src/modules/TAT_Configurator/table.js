import React from "react";
import { _colorCode } from "../../components";
import { DataTable } from "../../modules/user-management";
import { deleteTATQuery } from "./TATConfig.slice"

const TableData = (myModule) => [
  {
    Header: "Time",
    accessor: "duration",
  },
  {
    Header: "Time(unit)",
    accessor: "duration_unit"
  },
  {
    Header: "Color",
    accessor: "color_code",
    Cell: _colorCode
  },
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status"
    // no cell required
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];

const Table = ({ data, EditTATQuery, myModule }) => {
  return (
    <DataTable
      columns={TableData(myModule)}
      data={data || []}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10]}
      rowStyle
      // deleteFlag={`delete-TAT-query`}
      deleteFlag={!!myModule?.candelete && 'custom_delete'}
      removeAction={deleteTATQuery}
      EditFlag={!!myModule?.canwrite}
      EditFunc={EditTATQuery}
    // TAT_status
    //   editCustomerDoc={true}
    />
  );
};

export default Table;
