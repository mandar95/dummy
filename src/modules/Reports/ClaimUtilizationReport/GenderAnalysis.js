import React from "react";
import { CardBlue } from "../../../components";
import Table from "react-bootstrap/Table";

const GenderAnalysis = (props) => {
  const TableData = props?.tableData;

  const renderTableData = (TableData, index) => (
    <tr key={index + 'gender-analysis'}>
      <th>{TableData.relation}</th>
      <th>{TableData.male_cnt}</th>
      <th>{TableData.female_cnt}</th>
      <th>{TableData.grand_total}</th>
      <th>{TableData.share}</th>
      <th>{TableData.total_premium}</th>
      {/* <th>{TableData.total_lives}</th> */}
    </tr>
  );
  return (
    <CardBlue title="Relationship And Gender Wise Analysis">
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Relationship</th>
              <th>Male</th>
              <th>Female</th>
              <th>Grand Total</th>
              <th>Share %</th>
              <th>Total Premium</th>
              {/* <th>Total Lives</th> */}
            </tr>
          </thead>
          <tbody>{TableData?.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default GenderAnalysis;
