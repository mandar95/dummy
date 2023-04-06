import React from "react";
import { DataTable } from "../../../user-management";
import _ from 'lodash';

const TableData = [
  {
    Header: "Plan Name",
    accessor: "plan",
  },
  {
    Header: "Monthly",
    accessor: "monthly",
  },
  {
    Header: "Quarterly",
    accessor: "quaterly",
  },
  {
    Header: "Half Year",
    accessor: "half",
  },
  {
    Header: "Annually",
    accessor: "annualy",
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
