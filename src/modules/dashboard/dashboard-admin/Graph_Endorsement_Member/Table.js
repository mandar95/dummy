import React from "react";
import { DataTable } from "../../../user-management";
import _ from 'lodash';


const TableData = [
  {
    Header: "Plan Name",
    accessor: "name",
  },
  {
    Header: "Total Clients",
    accessor: "total_clients",
  },
  {
    Header: "Active Clients",
    accessor: "active_clients",
  },
  {
    Header: "Active Policies",
    accessor: "active_policies",
  },
  {
    Header: "Active Lives",
    accessor: "active_lives",
  },
  {
    Header: "Active Cover",
    accessor: "cover",
  },
  {
    Header: "Premium",
    accessor: "premium",
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
