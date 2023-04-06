import React from "react";
import { CardsContainer } from "../../style";
import Card from "./Card";

const Cards = ({ data }) => {
  const {
    claim_pending = 0,
    claim_registered = 0,
    claim_rejected = 0,
    claim_settled = 0,
    claim_pending_amount = 0,
    total_claimed_amount = 0,
    total_rejected_amount = 0,
    total_settled_amount = 0,
  } = data || {};

  return (
    <CardsContainer className="row card-container p-0">
      <Card
        title1={"Claims Registered"}
        value1={claim_registered}
        title2={"Registered Amount"}
        value2={'₹ ' + total_claimed_amount}
        icon={<i className="fas icon fa-cash-register"></i>}
      />
      <Card
        title1={"Claims Pending"}
        value1={claim_pending}
        title2={"Pending Amount"}
        value2={'₹ ' + claim_pending_amount}
        icon={<i className="fas icon fa-address-card"></i>}
      />
      <Card
        title1={"Claims Settled"}
        value1={claim_settled}
        title2={"Settled Amount"}
        value2={'₹ ' + total_settled_amount}
        icon={<i className="fab icon fa-gg-circle"></i>}
      />
      <Card
        title1={"Claims Rejected"}
        value1={claim_rejected}
        title2={"Rejected Amount"}
        value2={'₹ ' + total_rejected_amount}
        icon={<i className="fas icon fa-ambulance"></i>}
      />
    </CardsContainer>
  );
};

export default Cards;
