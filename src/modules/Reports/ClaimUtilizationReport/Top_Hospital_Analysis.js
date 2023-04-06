import React, { useState, useEffect } from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";
import _ from 'lodash';

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
        <tr key={index + 'top-hosp-anal2'}>
          <th>{Data[property]?.hospital_name ? _.capitalize(Data[property]?.hospital_name) : "-"}</th>
          <th>{Data[property]?.place || "-"}</th>
          <th>{Data[property]?.count || "-"}</th>
          <th>{Data[property]?.settled_amount || "-"}</th>
        </tr>
      ));
    }
  };

  return (
    <CardBlue title="Top 10 Hospital Analysis">
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Hospital Name</th>
              <th>Place</th>
              <th>Count</th>
              <th>Settled Amount</th>
            </tr>
          </thead>
          <tbody>{TableRender(Data)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default TOP_HOSPITAL_ANALYSIS;
