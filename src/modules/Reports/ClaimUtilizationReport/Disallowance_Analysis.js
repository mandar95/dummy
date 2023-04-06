import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const SUMMARY_ACTIVE_LIVES = (props) => {
  const TableData = props?.tableData

  const renderTableData = (TableData, index) => (
    <tr key={index + 'summary-active-lives'}>
      <th>{TableData.type}</th>
      <th>{TableData.amount}</th>
    </tr>
  );
  return (
    <CardBlue title="Disallowance Amount Analysis">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: 'white' }}>
            <tr>
              <th>Disallowance Reasons</th>
              <th>Amount</th>  </tr>
          </thead>
          <tbody>{TableData?.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default SUMMARY_ACTIVE_LIVES;
