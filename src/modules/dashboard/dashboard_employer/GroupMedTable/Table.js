import React from "react";
import { ModuleControl } from "../../../../config/module-control";
import { DataTable } from "../../../user-management";

const TableData = [
  {
    Header: "Total Cover",
    accessor: "members_covered",
  },
  {
    Header: "Policy Type",
    accessor: "poliyc_type",
  },
  {
    Header: "Policy Sub Type",
    accessor: "policy_sub_type",
  },
  ...!ModuleControl.isACE ? [{
    Header: "Premium",
    accessor: "premium",
  }] : []
];

const Table = (props) => {
  return (
    <DataTable
      columns={TableData}
      data={props.Data?.map((elem) => ({ ...elem, premium: String(elem.premium).includes('.') ? elem.premium.toFixed(2) : elem.premium }))}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 3 }}
      pageSizeOptions={[3]}
      rowStyle
    />
  );
};

export default Table;
