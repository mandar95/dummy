import { Loader, NoDataFound } from "components";
import DataTable from "modules/user-management/DataTable/DataTable";
import React from "react";

const AuditTrailEnrollment = ({ data, loading }) => {
  return (
    <div>
      {loading && !data.length ? (
        <Loader />
      ) : data.length ? (
        <DataTable
          columns={AuditTrailColumn}
          data={data}
          noStatus
          rowStyle
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default AuditTrailEnrollment;

export const AuditTrailColumn = [
  {
    Header: "Modification Type",
    accessor: "modification_type",
  },
  {
    Header: "Modified By",
    accessor: "modified_by",
  },
  {
    Header: "Modified On",
    accessor: "modified_on",
  },
  {
    Header: "IP Address",
    accessor: "ip_address",
  },
];
