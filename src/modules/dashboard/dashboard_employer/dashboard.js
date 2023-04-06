import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabPolicywise from "./Tab_policywise";
import TabEndorsementMemWise from "./Tab_endorsement_memberwise";
import TabPolicyWiseClaim from "./Tab_policy_wise_claim";
import TabMemberwiseClaim from "./Tab_memberwise_claim";
import TabCard from "./Tab_Card";
import TabMemberWiseEnrollment from "./Tab_MemberWiseEnrollment";
import TabEndorsementPolicyWise from "./Tab_endorsement_policyWise";
import _ from "lodash";
import Filters from "./Filters";
import ClaimTable from "./ClaimTable";
import { CompactCard, /* IconlessCard, */ Card, TabWrapper, Tab } from "../../../components";
import WidgetBoard from "./WidgetBoard";
import {
  Container,
  // GraphContainer,
  // SubGraphContainer,
  TableCardWrapper,
  // TableContainer,
  // SubTableContainer,
} from "./style";
import {
  getmemberWiseClaim,
  getpolicyWiseClaim,
  getEndorsementGraph,
  getendorsementPolicyWise,
  getMemberEnrollGraph,
  getpolicyGraph
} from "../dashboard_broker/dashboard_broker.slice";
import { Row, Col, Tabs, Tab as Tab1 } from "react-bootstrap";

const Dashboard = () => {
  //selectors
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.login);

  //states
  const [formdata, setFormdata] = useState({});
  const [policyType, setPolicyType] = useState(null);
  const [tab1, setTab1] = useState("Enrolment");
  const [employerId, setEmployerId] = useState(null);
  const [key1, setKey1] = useState("1");

  //Data from filters -----
  const getData = (data) => {
    const formData = {
      employer_id: employerId || currentUser?.employer_id,
      policy_type_id: policyType,
      graph_type: "Linear",
      is_super_hr: currentUser.is_super_hr,
      ...data,
      policy_id: data.policy_id?.value,
    }

    dispatch(getmemberWiseClaim(formData));
    dispatch(getpolicyWiseClaim(formData));
    dispatch(getEndorsementGraph(formData));
    dispatch(getendorsementPolicyWise(formData));
    dispatch(getMemberEnrollGraph(formData));
    dispatch(getpolicyGraph(formData));
    setFormdata(formData);

  };
  //----------------------

  return (
    <>
      <Container>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <WidgetBoard />
        </div>
      </Container>
      <TableCardWrapper>
        <ClaimTable />
        {/* <IconlessCard title="Claims">
          <TableContainer>
            <SubTableContainer>
            </SubTableContainer>
          </TableContainer>
        </IconlessCard> */}
        <div style={{ width: "100%" }}>
          <TabCard policyType={policyType} />
        </div>
      </TableCardWrapper>
      {!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
        <TabWrapper width="max-content">
          {currentUser.child_entities.map(({ name, id }, index) => (
            <Tab
              key={id}
              isActive={employerId === id || (!employerId && index === 0)}
              onClick={() => setEmployerId(id)}>
              {name}
            </Tab>
          ))}
        </TabWrapper>
      )}
      <Card title="Filters">
        <Filters
          getData={getData}
          employerId={employerId || currentUser?.employer_id}
          setPolicyType={setPolicyType}
        />
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
            className="w-100 mx-auto text-center"
          >
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabPolicywise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabEndorsementMemWise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
          </Row>
          <Row className="w-100 mx-auto text-center">
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabMemberWiseEnrollment formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabEndorsementPolicyWise formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
          </Row>
          <Row className="w-100 mx-auto text-center">
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
              <CompactCard removeBottomHeader={true}>
                <div style={{ marginTop: "-10px" }}>
                  <TabMemberwiseClaim formdata={formdata} />
                </div>
              </CompactCard>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
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
};

export default Dashboard;
