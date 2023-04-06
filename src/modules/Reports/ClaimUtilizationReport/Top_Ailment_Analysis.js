import React, { useState, useEffect } from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const TOP_AILMENT_ANALYSIS = (props) => {

  const [getkeys, setkeys] = useState([]);
  const Data = props?.tableData;

  useEffect(() => {
    if (Data) {
      setkeys(Object.keys(Data));
    }
  }, [Data]);

  const TableRender = (Data) => {
    for (const property in Data) {
      return getkeys?.map((property, index) => (
        <tr key={index + 'top-alignment-analysis'}>
          <th>{Data[property]?.disease}</th>
          <th>{Data[property]?.no_of_claims}</th>
          <th>{String(Data[property]?.claimed_amount).includes('.') ?
            Data[property]?.claimed_amount?.toFixed(2) : Data[property]?.claimed_amount}</th>
          <th>{String(Data[property]?.settled_amount).includes('.') ?
            Data[property]?.settled_amount?.toFixed(2) : Data[property]?.settled_amount}</th>
          <th>{String(Data[property]?.avg_settled).includes('.') ?
            Data[property]?.avg_settled?.toFixed(2) : Data[property]?.avg_settled}</th>
          <th>{String(Data[property]?.settled_amt_per).includes('.') ?
            Data[property]?.settled_amt_per?.toFixed(2) : Data[property]?.settled_amt_per}</th>
        </tr>
      ));
    }
  };

  return (
    <CardBlue title="Top 10 Ailment Analysis">
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Ailment (ICD Code First Level)</th>
              <th>No. Of Claims</th>
              <th>Claimed Amount</th>
              <th>Settled Amount</th>
              <th>Avg Settled</th>
              <th>Settled Amount %</th>
            </tr>
          </thead>
          <tbody>{TableRender(Data)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default TOP_AILMENT_ANALYSIS;
