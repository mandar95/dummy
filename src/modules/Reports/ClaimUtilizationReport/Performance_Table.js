import React from "react";
import { CardBlue } from "components";
import Table from "react-bootstrap/Table";

const SUMMARY_ACTIVE_LIVES = (props) => {

  //table data
  const Data = props?.tableData;

  const TableData = [
    { Particulars: "Report Data as on", Value: Data?.report_as_on || "-" },
    { Particulars: "Policy Inception/start Date", Value: Data?.policy_start_date || "-" },
    { Particulars: "Total No. of Days from policy inception", Value: Data?.policy_inception_no_days || "-" },
    { Particulars: "Policy remaining Days", Value: Data?.policy_remaining_days || "-" },
    {
      Particulars: "Total amount(Total Settled Amt. +Total Claimed Amt. for Outstanding )", Value: String(Data?.total_amt).includes('.') ?
        (Data?.total_amt * 1)?.toFixed(2) : Data?.total_amt
    },
    {
      Particulars: "Net Premium", Value: String(Data?.net_premium).includes('.') ?
        (Data?.net_premium * 1)?.toFixed(2) : Data?.net_premium
    },
    {
      Particulars: "Earned Premium As On Date	", Value: String(Data?.Earned_Premium_as_date).includes('.') ?
        (Data?.Earned_Premium_as_date * 1)?.toFixed(2) : Data?.Earned_Premium_as_date
    },
    {
      Particulars: "*Projected Full Year Claims", Value: String(Data?.Projected_Full_Year_Claims).includes('.') ?
        (Data?.Projected_Full_Year_Claims * 1)?.toFixed(2) : Data?.Projected_Full_Year_Claims
    },
    {
      Particulars: "IBNR 8%", Value: String(Data?.IBNR_eight_per).includes('.') ?
        (Data?.IBNR_eight_per * 1)?.toFixed(2) : Data?.IBNR_eight_per
    },
    {
      Particulars: "Projected Full Year Claims", Value: String(Data?.Projected_Full_Year_Claims2).includes('.') ?
        (Data?.Projected_Full_Year_Claims2 * 1)?.toFixed(2) : Data?.Projected_Full_Year_Claims2
    },
    {
      Particulars: "Claim Ratio on Net Premium", Value: String(Data?.Claim_Ratio_Net_Premium).includes('.') ?
        (Data?.Claim_Ratio_Net_Premium * 1)?.toFixed(2) : Data?.Claim_Ratio_Net_Premium
    },
    {
      Particulars: "Claim Ratio on Earned Premium", Value: String(Data?.Claim_Ratio_Earned_Premium).includes('.') ?
        (Data?.Claim_Ratio_Earned_Premium * 1)?.toFixed(2) : Data?.Claim_Ratio_Earned_Premium
    },
    {
      Particulars: "Projected Full Year Claim Ratio with IBNR", Value: String(Data?.['Projected Full Year Claim Ratio with IBNR']).includes('.') ?
        (Data?.['Projected Full Year Claim Ratio with IBNR'] * 1)?.toFixed(2) : Data?.['Projected Full Year Claim Ratio with IBNR']
    },
    { Particulars: "No of Employees", Value: Data?.no_emp || "-" },
    { Particulars: "No of Claims*", Value: Data?.no_of_claims || "-" },
    {
      Particulars: "Paid Amount*", Value: String(Data?.no_paid_claim_amount).includes('.') ?
        (Data?.no_paid_claim_amount * 1)?.toFixed(2) : Data?.no_paid_claim_amount
    },
    {
      Particulars: "Premium Cost per Employee", Value: String(Data?.Premium_Cost_per_Employee).includes('.') ?
        (Data?.Premium_Cost_per_Employee * 1)?.toFixed(2) : Data?.Premium_Cost_per_Employee
    },
    {
      Particulars: "Average Claimed Amount", Value: String(Data?.avg_claim_amount).includes('.') ?
        (Data?.avg_claim_amount * 1)?.toFixed(2) : Data?.avg_claim_amount
    },
    {
      Particulars: "Average Paid Amount", Value: String(Data?.avg_paid_amount).includes('.') ?
        (Data?.avg_paid_amount * 1)?.toFixed(2) : Data?.avg_paid_amount
    }
  ]

  // Renderer Function ----------------------
  const renderer = (TableData, index) => (
    <tr key={index + 'summary-live-active2'}>
      <th>{TableData.Particulars}</th>
      <th>{TableData.Value}</th>
    </tr>

  )
  // ----------------------------------------

  return (
    <CardBlue title="Performance Table">
      <div style={{ marginLeft: '15px', marginRight: '15px' }}>
        <Table striped bordered hover size="xl" responsive>
          <thead style={{ background: "#6334e3", color: "white" }}>
            <tr>
              <th>Particulars</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {TableData?.map(renderer)}
          </tbody>
        </Table>
      </div>
    </CardBlue>
  );
};

export default SUMMARY_ACTIVE_LIVES;
