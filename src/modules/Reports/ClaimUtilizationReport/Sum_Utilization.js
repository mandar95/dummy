import React, { useState, useEffect } from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const TOP_HOSPITAL_ANALYSIS = (props) => {
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
        <tr key={index + 'top-hosp-anal'}>
          <th>{Data[property]?.cover_amt || "-"}</th>
          <th>{Data[property]?.count || "-"}</th>
          <th>{Data[property]?.settled_amt || "-"}</th>
          <th>{Data[property]?.utilized || "-"}</th>
        </tr>
      ));
    }
  };

  return (
    <CardBlue title="Sum Assured Utilization">
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Cover Amount</th>
              <th>Count</th>
              <th>Settled Amount</th>
              <th>Utilized</th>
            </tr>
          </thead>
          <tbody>{TableRender(Data)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default TOP_HOSPITAL_ANALYSIS;
