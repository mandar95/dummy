import React from "react";
import { CardBlue } from "../../../components";
import Table from "react-bootstrap/Table";

const PolicyPlanPeriod = (props) => {
  const Data = props.Data;
  const TableData = [
    {
      STATUS: "Claims Paid",
      NUMBER: (Data?.claim_paid_count * 1),
      AMOUNT: String(Data?.claim_paid_amount).includes('.') ? (Data?.claim_paid_amount * 1)?.toFixed(2) : Data?.claim_paid_amount,
    },
    {
      STATUS: "Claims Outstanding",
      NUMBER: (Data?.outstanding_count * 1),
      AMOUNT: String(Data?.outstanding_amount).includes('.') ? (Data?.outstanding_amount * 1)?.toFixed(2) : Data?.outstanding_amount,
    },
    {
      STATUS: "Prorata Premium",
      NUMBER: (Data?.prorata_premium_count * 1),
      AMOUNT: String(Data?.prorata_premium_amount).includes('.') ? (Data?.prorata_premium_amount * 1)?.toFixed(2) : Data?.prorata_premium_amount,
    },
    {
      STATUS: "ICR",
      NUMBER: (Data?.icr_count * 1),
      AMOUNT: String(Data?.icr_amount).includes('.') ? (Data?.icr_amount * 1)?.toFixed(2) : Data?.icr_amount,
    },
    {
      STATUS: "Total Premium",
      NUMBER: (Data?.total_premium_count * 1),
      AMOUNT: String(Data?.total_premium_amount).includes('.') ? (Data?.total_premium_amount * 1)?.toFixed(2) : Data?.total_premium_amount
    },
    {
      STATUS: "Total ICR",
      NUMBER: (Data?.total_icr_count * 1),
      AMOUNT: String(Data?.total_icr_amount).includes('.') ? (Data?.total_icr_amount * 1)?.toFixed(2) : Data?.total_icr_amount,
    },
  ];

  const renderTableData = (TableData, index) => (
    <tr key={index + 'policy-plan-period3'}>
      <th>{TableData.STATUS}</th>
      <th>{TableData.NUMBER}</th>
      <th>{TableData.AMOUNT}</th>
    </tr>
  );
  return (
    <CardBlue title="Prorata">
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Status</th>
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

export default PolicyPlanPeriod;
