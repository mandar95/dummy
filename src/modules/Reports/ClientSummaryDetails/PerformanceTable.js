import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const PolicyPlanPeriod = (props) => {
  const Data = props?.Data;
  const TableData = [
    {
      ENDORSEMENTTYPE: "Member Addition",
      EMPLOYEES: Data?.employee_count,
      DEPENDENT: Data?.member_count,
      TOTALLIVES: Data?.total_live,
      PREMIUM: Data?.total_premium,
    },
    {
      ENDORSEMENTTYPE: "Member Deletion",
      EMPLOYEES: Data?.removed_employee_count,
      DEPENDENT: Data?.removed_member_count,
      TOTALLIVES: Data?.removed_total_live,
      PREMIUM: Data?.adjusted_premium,
    },
    {
      ENDORSEMENTTYPE: "Member Correction",
      EMPLOYEES: Data?.correction_employee_count,
      DEPENDENT: Data?.correction_member_count,
      TOTALLIVES: Data?.correction_total_live,
      PREMIUM: Data?.correction_premium,
    },
  ];

  const renderTableData = (TableData, index) => (
    <tr key={index + 'policy-plan-period'}>
      <th>{TableData.ENDORSEMENTTYPE}</th>
      <th>{TableData.EMPLOYEES}</th>
      <th>{TableData.DEPENDENT}</th>
      <th>{TableData.TOTALLIVES}</th>
      <th>{TableData.PREMIUM}</th>
    </tr>
  );
  return (
    <CardBlue title="Performance For The Selected Period">
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr style={{ width: '100%' }}>
              <th>Endorsement Type</th>
              <th>Employees</th>
              <th>Dependant</th>
              <th>Total Lives</th>
              <th>Premium (EXCL TAXES)</th>
            </tr>
          </thead>
          <tbody>{TableData.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default PolicyPlanPeriod;
