import React from "react";
import Card from "../../components/GlobalCard/Card";
import ButtonCard from "./ButtonCard";
import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import {
  TopContainer,
  // ContentBox,
  // ImageBox,
  // TextBox,
  InfoBox,
  DivButtonCard,
  DivPremiumText,
  SpanFloatRight,
  SpanFloatLeft,
} from "./style";
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";

const CDcard = (props) => {
  const policyDetails = props.policyDetails;
  return (
    <div>
      <Card title="CD Balance" round>
        <TopContainer>
          <Row>
            <Col sm={12} md={12} lg={6} xl={6}>
              <img src="/assets/images/balance.png" alt="balance" width="80%" />
            </Col>
            <Col sm={12} md={12} lg={6} xl={6}>
              <ul>
                <li style={styles.list}>
                  <Label>
                    Policy No
                    <SpanFloatRight>
                      {policyDetails?.policy_number}
                    </SpanFloatRight>
                  </Label>
                  <Label>
                    Total Employee
                    <SpanFloatRight>
                      {policyDetails?.employee_count || 0}
                    </SpanFloatRight>
                  </Label>
                  <Label>
                    Members Covered
                    <SpanFloatRight>
                      {policyDetails?.total_members || 0}
                    </SpanFloatRight>
                  </Label>
                  <Label>
                    Sum Insured
                    <SpanFloatRight>
                      {policyDetails?.total_suminsured}
                    </SpanFloatRight>
                  </Label>
                </li>
              </ul>
            </Col>
          </Row>
          {!!props.employeeCount && <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#FEF3EB">
            <Title fontSize="1rem">
              {props.employeeCount}
            </Title>
          </TextCard>}
          <InfoBox>
            <DivPremiumText>
              <SpanFloatLeft>Premium</SpanFloatLeft>
              <SpanFloatRight>{policyDetails?.total_premium}</SpanFloatRight>
            </DivPremiumText>
          </InfoBox>
          <DivButtonCard>
            <ButtonCard
              policyNoId={props.policyNoId}
              TotalMembers={policyDetails?.total_member}
            />
          </DivButtonCard>
        </TopContainer>
      </Card>
    </div>
  );
};

const styles = {
  ul: {
    margin: "0",
    listStyleType: "none",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    float: "left",
  },
};

const Label = styled.label`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  margin: 8px 0px 8px 0px;
`;

CDcard.defaultProps = {
  policyDetails: {
    policy_number: "N/A",
    employee_count: 0,
    total_member: 0,
    total_suminsured: "N/A",
    total_premium: "N/A",
  },
};

export default CDcard;
