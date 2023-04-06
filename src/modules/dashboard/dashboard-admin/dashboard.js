import React from "react";
import { Row, Col } from "react-bootstrap";
import TabPolicywise from "./Tab_policywise";
import TabEndorsementMemWise from "./Tab_endorsement_memberwise";
// import TabPolicyWiseClaim from "./Tab_policy_wise_claim";
// import TabMemberwiseClaim from "./Tab_memberwise_claim";
import TabMemberWiseEnrollment from "./Tab_MemberWiseEnrollment";
import TabEndorsementPolicyWise from "./Tab_endorsement_policyWise";
import { CompactCard } from "../../../components";
import WidgetBoard from "./WidgetBoard";
import { Container } from "./style";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const { globalTheme } = useSelector(state => state.theme);

  return (
    <>
      <Container>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WidgetBoard />
        </div>
      </Container>
      <>
        <Row style={{ marginTop: "-10px" }} className="w-100 mx-auto">
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <CompactCard removeBottomHeader={true}>
              <div style={{ marginTop: "-20px" }}>
                <p
                  className="p-0 my-2 text-center"
                  style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600" }}
                >
                  Plan Summary
                </p>
                <TabPolicywise />
              </div>
            </CompactCard>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <CompactCard removeBottomHeader={true}>
              <div style={{ marginTop: "-20px" }}>
                <p
                  className="p-0 my-2 text-center"
                  style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600" }}
                >
                  Plan Client Summary
                </p>
                <TabEndorsementMemWise />
              </div>
            </CompactCard>
          </Col>
        </Row>
        <Row className="w-100 mx-auto">
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <CompactCard removeBottomHeader={true}>
              <div style={{ marginTop: "-20px" }}>
                <p
                  className="p-0 my-2 text-center"
                  style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600" }}
                >
                  Plan Policy Summary
                </p>
                <TabMemberWiseEnrollment />
              </div>
            </CompactCard>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6}>
            <CompactCard removeBottomHeader={true}>
              <div style={{ marginTop: "-20px" }}>
                <p
                  className="p-0 my-2 text-center"
                  style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600" }}
                >
                  Plan TPA Summary
                </p>
                <TabEndorsementPolicyWise />
              </div>
            </CompactCard>
          </Col>
        </Row>
      </>
      {/*<CompactCard removeBottomHeader={true}>
          <GraphContainer>
            <SubGraphContainer>
              <TabMemberwiseClaim formdata={formdata} />
            </SubGraphContainer>
            <SubGraphContainer>
              <TabPolicyWiseClaim formdata={formdata} />
            </SubGraphContainer>
          </GraphContainer>
        </CompactCard>*/}
    </>
  );
};

export default Dashboard;
