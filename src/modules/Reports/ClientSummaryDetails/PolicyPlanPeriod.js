import React from "react";
import { CardBlue } from "../../../components";
import Table from "react-bootstrap/Table";

const PolicyPlanPeriod = (props) => {
  const Data = props?.Data;
  const TableData = [
    {
      STATUS: Data?.status_cashless,
      COUNT: Data?.count_cashless,
      CLAIMEDAMT: Data?.sum_cashless,
      INCURREDAMT: Data?.sum_incurred_cashless,
    },
    {
      STATUS: Data?.status_underquery,
      COUNT: Data?.count_underquery,
      CLAIMEDAMT: Data?.sum_underquery,
      INCURREDAMT: Data?.sum_incurred_underquery,
    },
    {
      STATUS: Data?.status_forsettlement,
      COUNT: Data?.count_forsettlement,
      CLAIMEDAMT: Data?.sum_forsettlement,
      INCURREDAMT: Data?.sum_incurred_forsettlement,
    },
    {
      STATUS: Data?.status_settled,
      COUNT: Data?.count_settled,
      CLAIMEDAMT: Data?.sum_settled,
      INCURREDAMT: Data?.sum_incurred_settled,
    },
    {
      STATUS: Data?.status_repudiated,
      COUNT: Data?.count_repudiated,
      CLAIMEDAMT: Data?.sum_repudiated,
      INCURREDAMT: Data?.sum_incurred_repudiated,
    },
    {
      STATUS: Data?.status_cancelled,
      COUNT: Data?.count_cancelled,
      CLAIMEDAMT: Data?.sum_cancelled,
      INCURREDAMT: Data?.sum_incurred_cancelled,
    },
    {
      STATUS: Data?.status_others,
      COUNT: Data?.count_others,
      CLAIMEDAMT: Data?.sum_others,
      INCURREDAMT: Data?.sum_incurred_others,
    },
    {
      STATUS: Data?.status_total,
      COUNT: Data?.count_total,
      CLAIMEDAMT: Data?.sum_total,
      INCURREDAMT: Data?.sum_incurred_total,
    },
  ];

  const renderTableData = (TableData, index) => (
    <tr key={index + 'policy_plan_period2'}>
      <th>{TableData.STATUS}</th>
      <th>{TableData.COUNT}</th>
      <th>{TableData.CLAIMEDAMT}</th>
      <th>{TableData.INCURREDAMT}</th>
    </tr>
  );
  return (
    <CardBlue title="Policy Plan Period - Claims Summary">
      <div style={{ marginLeft: '20px', marginRight: '20px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Claimed Amount</th>
              <th>Incurred Amount</th>
            </tr>
          </thead>
          <tbody>{TableData.map(renderTableData)}</tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default PolicyPlanPeriod;
