import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const SUMMARY_ACTIVE_LIVES = (props) => {
  const TableData = props?.tableData

  const renderTableData = (TableData, index) => (
    <tr key={index + 'summary-active-lives'}>
      <th>{TableData.delivery_type !== undefined ? TableData.delivery_type : TableData.total}</th>
      <th>{TableData.cnt !== undefined ? TableData.cnt : TableData.cnt_total}</th>
      <th>{TableData.amount !== undefined ? TableData.amount : TableData.amount_total}</th>
    </tr>
  );
  return (
    <CardBlue title="Utilization Summary For Maternity Claims">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: 'white' }}>
            <tr>
              <th>Maternity Break Up</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{TableData?.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default SUMMARY_ACTIVE_LIVES;
