import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import { IconlessCard } from "components";
import Table from "./Table";
import { ReportCardsContainer } from "../../style";

const ReportCards = ({ coverData, topUpData, year }) => {
  const [key, setKey] = useState(1);

  const filterdCoverData = coverData.filter(
    (d) =>
      d.policy_start_date.includes(year) || d.policy_end_date.includes(year)
  );

  const filterdTopUpData = topUpData.filter(
    (d) =>
      d.policy_start_date.includes(year) || d.policy_end_date.includes(year)
  );

  const title = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: "4px",
      }}
    >
      <div>
        <h3 className="font-weight-bold m-0" style={{ width: "100%" }}>
          Policies
        </h3>
        <span className="filter">( filter by year: {year} )</span>
      </div>
      <div
        style={{
          display: "flex",
          height: "fit-content",
          justifyContent: "flex-end",
        }}
      >
        <ButtonGroup size="sm">
          <Button onClick={() => setKey(1)}>Group</Button>
          {!!filterdTopUpData.length && (
            <Button onClick={() => setKey(2)}>Topup</Button>
          )}
        </ButtonGroup>
      </div>
    </div>
  );

  return (
    <ReportCardsContainer>
      <IconlessCard
        marginTop="1rem"
        styles={{
          margin: 0,
          borderRadius: "20px",
          boxShadow: "0px 10px 65px -45px grey",
        }}
        title={title}
      >
        {filterdCoverData.length === 0 && filterdTopUpData.length === 0 ? (
          <div className="no-data">
            <h1>Data Not Found</h1>
          </div>
        ) : (
          <Table Data={key === 1 ? filterdCoverData : filterdTopUpData} />
        )}
      </IconlessCard>
    </ReportCardsContainer>
  );
};

export default ReportCards;
