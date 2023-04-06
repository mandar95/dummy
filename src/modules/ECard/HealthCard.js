import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import IconlessCard from "../../components/GlobalCard/IconlessCard";
import { getCardData } from "./ECard.slice";
import { Row, Col } from "react-bootstrap";
import styled from 'styled-components';

import {
  Wrapper
} from "./style";
import { DateFormate, downloadFile } from "../../utils";

const HealthCard = (props) => {
  let cardData = props.cardData;

  //selectors
  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)

  //Selector of getCardData is in Parent component.
  let List = cardData?.map((cardData, index) => {
    // onClick ecard_url check------
    const GetCard = () => {
      if (cardData.ecard_url === undefined || cardData.ecard_url === null) {
        const data = {
          employeeCode: cardData?.emp_code,
          tpa_member_id: cardData?.tpa_member_id,
          tpa_member_name: cardData?.tpa_member_name,
          member_id: cardData?.member_id,
          policy_id: props?.Policyid,
        };
        dispatch(getCardData(data));
      } else {
        //use the same fake anchor tag here
        downloadFile(cardData.ecard_url, null, true)
      }
    };
    //------------------------------
    return (
      <div key={index + 'health-card'} style={{ display: "flex", maxWidth: "600px" }}>
        <IconlessCard
          round
          title={
            <Row className="w-100 pt-1 pb-0 mb-0">
              <Col xs={4} sm={4} md={2} lg={2} xl={2} className="w-100">
                <img
                  src="/assets/images/neutral_user.jpg"
                  alt="user"
                  width="40"
                ></img>
              </Col>
              <Col xs={8} sm={8} md={4} lg={4} xl={4} className="pl-0 w-100">
                <h6 className="pt-0 pb-0">Insured Name</h6>
                <p className="pt-0 pb-0" style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}>
                  {cardData?.name || "N/A"}
                </p>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} xl={6} className="w-100">
                <Button buttonStyle="outline" onClick={GetCard} style={{ width: '100%' }}>
                  Download E-Card
                </Button>
              </Col>
            </Row>
          }
        >
          <Row xs={2} sm={2} md={2} lg={2} xl={2} className="d-flex w-100" style={{ margin: '-20px 0 0 0' }}>
            <Col xs={6} sm={6} md={6} lg={6} className="p-2 center">
              <Header>Relation</Header>
              <Value>{cardData?.relation_name || "N/A"}</Value>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="p-2 center">
              <Header>Member Id</Header>
              <Value>{cardData?.tpa_member_id || "N/A"}</Value>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="p-2 center">
              <Header>Policy Number</Header>
              <Value>{cardData?.policy_no || "N/A"}</Value>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} className="p-2 center">
              <Header>Cover Date</Header>
              <Value>{`${DateFormate(cardData.start_date)} to ${DateFormate(cardData.end_date)}` || "N/A"}</Value>
            </Col>
          </Row>
        </IconlessCard>
      </div>
    );
  });

  return <Wrapper>{List}</Wrapper>;
};

const Header = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};

padding:0;
`;

const Value = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};

padding:0;
white-space: pre-wrap;
word-wrap: break-word;
`;

HealthCard.defaultProps = {
  cardData: {
    name: "N/A",
    relation_name: "N/A",
    policy_no: "N/A",
  },
};

export default HealthCard;
