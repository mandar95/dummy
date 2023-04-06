import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const SUMMARY_ACTIVE_LIVES = (props) => {

  const Data = props?.tableData;

  //Object Assigning.------------------------------
  let self = Object.assign(
    {
      Relation: "Self",
    },
    Data?.self
  );

  let spouse = Object.assign(
    {
      Relation: "Spouse",
    },
    Data?.spouse
  );

  let child = Object.assign(
    {
      Relation: "Child",
    },
    Data?.child
  );

  let parent = Object.assign(
    {
      Relation: "Parent",
    },
    Data?.parent
  );

  let total = Object.assign(
    {
      Relation: "total",
    },
    Data?.total
  );

  //--------------------------------------------

  //TableData -------------------------------
  const TableData = { self, spouse, child, parent, total };
  //---------------------------------------------

  //Adding Total row --------
  const RowTotal = (Data, index) => {
    let array = [<th key={index + 'total-487'}>Total</th>]
    for (const key in Data?.total) {
      array.push(<th key={key + 'total-87'}>{Data?.total[key]}</th>)
    }
    const List = array.map(item => item);
    return <tr>{List}</tr>
  };
  //-------------------------

  const renderTableData = (TableData) => {
    // eslint-disable-next-line
    return Data?.tat_keys?.map((item, index) => {
      for (const property in TableData)
        return (
          <tr key={index + 'sum-act-live3'}>
            <th>{item}</th>
            <th>
              {TableData?.self[item] !== undefined
                ? TableData?.self[item]
                : "-"}
            </th>
            <th>
              {TableData?.spouse[item] !== undefined
                ? TableData?.spouse[item]
                : "-"}
            </th>
            <th>
              {TableData?.child[item] !== undefined
                ? TableData?.child[item]
                : "-"}
            </th>
            <th>
              {TableData?.parent[item] !== undefined
                ? TableData?.parent[item]
                : "-"}
            </th>
          </tr>
        );
    });
  };
  return (
    <CardBlue title="Summary For Active Lives">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive >
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Ages(in years)</th>
              <th>Self</th>
              <th>Spouse</th>
              <th>Child</th>
              <th>Parent</th>
            </tr>
          </thead>

          <tbody>
            {renderTableData(TableData)}
            {RowTotal(Data)}
          </tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default SUMMARY_ACTIVE_LIVES;
