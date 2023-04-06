import React from "react";
import { CardBlue } from "../../components";
import Table from "react-bootstrap/Table";

const TMIBASL_BENCHMARK = () => {
  const TableData = [
    {
      PARTICULAR:
        "TPA Processing TAT Claim Received to Payment upload where there is no deficiency",
      ZERO_FIVE: "",
      SIX_TEN: "",
      TEN_FIFTEEN: "",
      SIXTEEN_THIRTY: "",
      ABV_THIRTY: "",
    },
    {
      PARTICULAR: "TPA TAT for Raising deficiency in claim (if any)",
      ZERO_FIVE: "",
      SIX_TEN: "",
      TEN_FIFTEEN: "",
      SIXTEEN_THIRTY: "",
      ABV_THIRTY: "",
    },
    {
      PARTICULAR:
        "TAT for payment by insurer from date of upload to cheque date",
      ZERO_FIVE: "",
      SIX_TEN: "",
      TEN_FIFTEEN: "",
      SIXTEEN_THIRTY: "",
      ABV_THIRTY: "",
    },
  ];

  const renderTableData = (TableData, index) => (
    <tr key={index + 'benchmark'}>
      <th>{TableData.PARTICULAR}</th>
      <th>{TableData.ZERO_FIVE}</th>
      <th>{TableData.SIX_TEN}</th>
      <th>{TableData.TEN_FIFTEEN}</th>
      <th>{TableData.SIXTEEN_THIRTY}</th>
      <th>{TableData.ABV_THIRTY}</th>
    </tr>
  );
  return (
    <CardBlue title="BENCHMARK">
      <Table striped bordered hover size="xl">
        <thead style={{ background: "#6334e3", color: "white" }}>
          <tr>
            <th>PARTICULAR</th>
            <th>0-5</th>
            <th>6-10</th>
            <th>10-15</th>
            <th>16-30</th>
            <th>ABOVE 30</th>
          </tr>
        </thead>
        <tbody>{TableData.map(renderTableData)}</tbody>
      </Table>
      <span>
        Note:- All Pre and Post and Resettlement Claims are counted in above
        summary.
      </span>
    </CardBlue>
  );
};

export default TMIBASL_BENCHMARK;
