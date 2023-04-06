import React, { useState } from "react";
// import { Col } from "react-bootstrap";
import { Container } from "./style";
import MyInsurance from "./MyInsurance";
import Renewal from "./Renewal";
// import { BuyInsurance } from "./BuyInsurance";
import { TabWrapper, Tab } from "../../components";
import { useParams } from "react-router";

import BuyInsuranceCustomer from "../Insurance/BuyInsurance";

const MyPolicy = () => {

  //states
  const [tab, setTab] = useState("My Insurance Cover");
  const { userType } = useParams();

  //Screen Selection

  const screenSelection = () => {
    if (tab === "My Insurance Cover") {
      return <MyInsurance />;
    } else if (tab === "Renewal") {
      return <Renewal />;
    } else if (tab === "BuyInsurance") {
      return <BuyInsuranceCustomer userType={userType} />;
    }
  };

  return (
    <Container>
      {/* <Col md={12} lg={10} xl={10} sm={12} className="p-0">
          <Paper>
            <Col className="my-auto" md={9} lg={9} xl={9} sm={12}>
              Lorem Ipsum Lorem Ipsum, Lorem Sipum Lorem Ipsum, You Can Enter
              Your Retail Policy Details, This Help You To Manage All Your
              Insurance Cover Under One Roof.
            </Col>
            <Col md={2} lg={2} xl={2} sm={12} className="text-center p-0">
              <img src="/assets/images/bal-policy.png" alt="" />
            </Col>
          </Paper>
        </Col> */}
      <TabWrapper width='max-content'>
        <Tab
          isActive={Boolean(tab === "My Insurance Cover")}
          onClick={() => setTab("My Insurance Cover")}
        >
          My Insurance
        </Tab>
        <Tab
          isActive={Boolean(tab === "Renewal")}
          onClick={() => setTab("Renewal")}
        >
          Renewal
        </Tab>
        <Tab
          isActive={Boolean(tab === "BuyInsurance")}
          onClick={() => setTab("BuyInsurance")}
        >
          Buy Insurance
        </Tab>
      </TabWrapper>
      {screenSelection()}
    </Container>
  );
};

export default MyPolicy;
