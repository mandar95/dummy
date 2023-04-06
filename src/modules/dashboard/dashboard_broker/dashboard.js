import React, { useEffect, useState } from "react";
import { Row, Col, Tabs, Tab as Tab1 } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import TabPolicywise from "./Tab_policywise";
import TabEndorsementMemWise from "./Tab_endorsement_memberwise";
import TabPolicyWiseClaim from "./Tab_policy_wise_claim";
import TabMemberwiseClaim from "./Tab_memberwise_claim";
import TabMemberWiseEnrollment from "./Tab_MemberWiseEnrollment";
import TabEndorsementPolicyWise from "./Tab_endorsement_policyWise";
import Filters from "./Filters";
import { CompactCard, Card, TabWrapper, Tab } from "../../../components";
import WidgetBoard from "./WidgetBoard";
import { Container } from "./style";
import {
  getpolicyGraph, selectPolicyData,
  getMemberEnrollGraph,
  getendorsementPolicyWise,
  getEndorsementGraph,
  getpolicyWiseClaim,
  getmemberWiseClaim,
} from "./dashboard_broker.slice";
import { InsurerDashboard } from "../dashboard_insurer/InsurerDashboard";

const Dashboard = () => {
  //Selectors
  const PolicyData = useSelector(selectPolicyData);
  const { currentUser } = useSelector((state) => state.login);
  //states
  const [formdata, setFormdata] = useState({});
  const [policyType, setPolicyType] = useState(null);
  const [tab, setTab] = useState("Broker");
  const [tab1, setTab1] = useState("Enrolment");
  const [key1, setKey1] = useState("1");

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.is_rfq && currentUser?.is_rfq === 1) {
      setTab("RFQ");
    }
  }, [currentUser]);
  //Data from filters -----
  const getTypeId = (e) => {
    if (!_.isEmpty(PolicyData?.data?.data)) {
      var policyTypeId = PolicyData?.data?.data.filter((item) => {
        return item?.id === Number(e);
      });
      setPolicyType(policyTypeId[0]?.policy_type_id);
    }
  };

  const getData = (data) => {
    const formData = {
      ...{
        policy_type_id: policyType,
        graph_type: "Linear"
      },
      ...data,
      employer_id: data.employer_id?.value,
      policy_id: data.policy_id?.value,
    }

    dispatch(getpolicyGraph(formData));
    dispatch(getMemberEnrollGraph(formData));
    dispatch(getendorsementPolicyWise(formData));
    dispatch(getEndorsementGraph(formData));
    dispatch(getpolicyWiseClaim(formData));
    dispatch(getmemberWiseClaim(formData));
    setFormdata(formData);
  };

  //----------------------
  const Broker = (
    <>
      <Container>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WidgetBoard />
        </div>
      </Container>
      <Card title="Filters">
        <Filters getData={getData} getTypeId={getTypeId} />
      </Card>
      {!_.isEmpty(formdata) && (
        <>
          <TabWrapper width="max-content">
            <Tab
              isActive={Boolean(tab1 === "Enrolment")}
              onClick={() => { setKey1('1'); setTab1("Enrolment") }}>
              Enrolment
            </Tab>
            <Tab
              isActive={Boolean(tab1 === "Endorsement")}
              onClick={() => { setKey1('1'); setTab1("Endorsement") }}>
              Endorsement
            </Tab>
            <Tab
              isActive={Boolean(tab1 === "Claim")}
              onClick={() => { setKey1('1'); setTab1("Claim") }}>
              Claim
            </Tab>
          </TabWrapper>
          {tab1 === "Enrolment" &&
            <Row
              // style={{ marginTop: "-30px" }}
              className="w-100 mx-auto text-center">
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <CompactCard styles={{ marginTop: "0" }} marginTop={'1rem'} removeBottomHeader={true}>
                  <div style={{ marginTop: "-10px" }}>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key1}
                      onSelect={(k) => setKey1(k)}
                      mountOnEnter={true}
                      unmountOnExit={true}>
                      <Tab1 eventKey="1" title="Policy Wise">
                        <TabPolicywise formdata={formdata} />
                      </Tab1>
                      <Tab1 eventKey="2" title="Member Wise">
                        <TabMemberWiseEnrollment formdata={formdata} />
                      </Tab1>
                    </Tabs>
                  </div>
                </CompactCard>
              </Col>
            </Row>
          }
          {tab1 === "Endorsement" &&
            <Row
              className="w-100 mx-auto text-center">
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <CompactCard styles={{ marginTop: "0" }} marginTop={'1rem'} removeBottomHeader={true}>
                  <div style={{ marginTop: "-10px" }}>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key1}
                      onSelect={(k) => setKey1(k)}
                      mountOnEnter={true}
                      unmountOnExit={true}>
                      <Tab1 eventKey="1" title="Policy Wise">
                        <TabEndorsementPolicyWise formdata={formdata} />

                      </Tab1>
                      <Tab1 eventKey="2" title="Member Wise">
                        <TabEndorsementMemWise formdata={formdata} />
                      </Tab1>
                    </Tabs>
                  </div>
                </CompactCard>
              </Col>
            </Row>
          }
          {tab1 === "Claim" &&
            <Row
              className="w-100 mx-auto text-center">
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <CompactCard styles={{ marginTop: "0" }} marginTop={'1rem'} removeBottomHeader={true}>
                  <div style={{ marginTop: "-10px" }}>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key1}
                      onSelect={(k) => setKey1(k)}
                      mountOnEnter={true}
                      unmountOnExit={true}>
                      <Tab1 eventKey="1" title="Policy Wise">
                        <TabPolicyWiseClaim formdata={formdata} />
                      </Tab1>
                      <Tab1 eventKey="2" title="Member Wise">
                        <TabMemberwiseClaim formdata={formdata} />
                      </Tab1>
                    </Tabs>
                  </div>
                </CompactCard>
              </Col>
            </Row>
          }
          {/* <Row
            style={{ marginTop: "-10px" }}
            className="w-100 mx-auto text-center">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabPolicywise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabEndorsementMemWise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
          </Row>
          <Row className="w-100 mx-auto text-center">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabMemberWiseEnrollment formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabEndorsementPolicyWise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
          </Row>
          <Row className="w-100 mx-auto text-center">
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabMemberwiseClaim formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabPolicyWiseClaim formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
          </Row> */}
        </>
      )}
    </>
  );

  return (
    <>
      {/* { currentUser?.is_rfq === 2 && <TabWrapper width='185px'>
      <Tab isActive={Boolean(tab === "Broker")} onClick={() => setTab("Broker")}>Broker</Tab>
      <Tab isActive={Boolean(tab === "RFQ")} onClick={() => setTab("RFQ")}>RFQ</Tab>
    </TabWrapper>} */}

      {tab === "Broker" && currentUser?.is_rfq !== 1 && Broker}
      {tab === "RFQ" && currentUser?.is_rfq !== 3 && <InsurerDashboard />}
    </>
  );
};

export default Dashboard;
