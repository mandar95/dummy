import React from "react";
import { CardBlue } from "../../components";
import Table from "react-bootstrap/Table";

const Table2 = () => {
  const TableData = [
    { CASHLESS_PROCESSING_TAT: "0-1 Hr", COUNT: "", PERCENTAGE: "", TMIBASL_BENCHMARK: "", VARINACE_FROM_BENCHMARK: "" },
    { CASHLESS_PROCESSING_TAT: "1-2 Hr", COUNT: "", PERCENTAGE: "", TMIBASL_BENCHMARK: "", VARINACE_FROM_BENCHMARK: "" },
    { CASHLESS_PROCESSING_TAT: "> 2 Hrs", COUNT: "", PERCENTAGE: "", TMIBASL_BENCHMARK: "", VARINACE_FROM_BENCHMARK: "" },
    { CASHLESS_PROCESSING_TAT: "Total", COUNT: "", PERCENTAGE: "", TMIBASL_BENCHMARK: "", VARINACE_FROM_BENCHMARK: "" }

  ];

  const renderTableData = (TableData, index) => (
    <tr key={index + 'table-cashless'}>
      <th>{TableData.CASHLESS_PROCESSING_TAT}</th>
      <th>{TableData.COUNT}</th>
      <th>{TableData.PERCENTAGE}</th>
      <th>{TableData.TMIBASL_BENCHMARK}</th>
      <th>{TableData.VARINACE_FROM_BENCHMARK}</th>
    </tr>
  );
  return (
    <CardBlue title="Table">
      <Table striped bordered hover size="xl">
        <thead style={{ background: "#6334e3", color: 'white' }}>
          <tr>
            <th>CASHLESS PROCESSING TAT</th>
            <th>COUNT</th>
            <th>%</th>
            <th>BENCHMARK</th>
            <th>VARINACE FROM BENCHMARK</th>
          </tr>
        </thead>
        <tbody>{TableData.map(renderTableData)}</tbody>
      </Table>
    </CardBlue>
  );
};

export default Table2;
