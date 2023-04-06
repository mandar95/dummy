import React from "react";
import { DataTable } from "../../../user-management";
import _ from 'lodash';

const TableData = [
  {
    Header: "TPA Name",
    accessor: "tpa_name",
  },
  {
    Header: "Total Clients",
    accessor: "total_clients",
  },
  {
    Header: "Claims Registered",
    accessor: "claims_registered",
  },
  {
    Header: "Claims Settled",
    accessor: "claims_settled",
  }
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
