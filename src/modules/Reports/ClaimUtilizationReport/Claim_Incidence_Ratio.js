import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const CLAIM_INCIDENCE_RATIO = (props) => {

  const TableData = props?.tableData

  const renderTableData = (TableData, index) => (
    <tr key={index + 'claim-incidence-ratio'}>
      <th>{TableData?.Relation}</th>
      <th>{TableData?.Members}</th>
      <th>{TableData?.claim_count}</th>
      <th>{TableData?.Claim_Count_end_of_policy}</th>
      <th>{String(TableData?.Incidence_Ratio).includes('.') ? TableData?.Incidence_Ratio?.toFixed(2) : TableData?.Incidence_Ratio}  </th>
      <th>{String(TableData?.Incidence_Ratio_eop).includes('.') ? TableData?.Incidence_Ratio_eop?.toFixed(2) : TableData?.Incidence_Ratio_eop}</th>
    </tr>
  );
  return (
    <CardBlue title="Claim Incidence Ratio">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: 'white' }}>
            <tr>
              <th>Relation</th>
              <th>Members</th>
              <th>Claim Count</th>
              <th>Claim Count (End Of Policy Estimate)</th>
              <th>Incidence Ratio</th>
              <th>Incidence Ratio (EOP Estimated)</th>
            </tr>
          </thead>
          <tbody>{TableData?.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default CLAIM_INCIDENCE_RATIO;
