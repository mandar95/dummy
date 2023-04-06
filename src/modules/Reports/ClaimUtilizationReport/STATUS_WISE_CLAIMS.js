import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const STATUS_WISE_CLAIMS = (props) => {
  const TableData = props?.tableData;
  const renderTableData = (TableData, index) => (
    <tr key={index + 'status-wise-claims'}>
      <th>{TableData.status}</th>
      <th>{TableData.count}</th>
      <th>{TableData.claim_amt}</th>
      <th>{TableData.settled_amt}</th>
      <th>{TableData.amt_per}</th>
    </tr>
  );
  return (
    <CardBlue title="Status Wise Claims Summary & Claim Ratios">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: 'white' }}>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Claim Amount</th>
              <th>Settled Amount</th>
              <th>Amount %</th>
            </tr>
          </thead>
          <tbody>{TableData?.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default STATUS_WISE_CLAIMS;
