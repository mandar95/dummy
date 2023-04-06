import React from "react";
import { DataTable } from "../../../user-management";
import _ from 'lodash';

const TableData = [
  {
    Header: "Plan Name",
    accessor: "plan",
  },
  {
    Header: "GMC",
    accessor: "GMC",
  },
  {
    Header: "GPA",
    accessor: "GPA",
  },
  {
    Header: "GTL",
    accessor: "GTL",
  },
  {
    Header: "VGMC",
    accessor: "VGMC",
  },
  {
    Header: "VGPC",
    accessor: "VGPC",
  },
  {
    Header: "VGTL",
    accessor: "VGTL",
  },
];

const Table = (props) => {
  return (
    <DataTable
      columns={!_.isEmpty(props.data) ? TableData : []}
      data={props.data || []}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 3 }}
      pageSizeOptions={[3]}
      rowStyle
    />
  );
};

export default Table;
