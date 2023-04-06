import React, { useContext } from "react";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import AccordionContext from "react-bootstrap/AccordionContext";
import { StyledButton } from "modules/RFQ/data-upload/style.js";
import classesone from "./index.module.css";
import { comma } from "./NewDesignComponents/ForthStep";
import _ from "lodash";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export const gender = [{ name: "Male", id: 1 }, { name: "Female", id: 2 }, { name: 'Other', id: 3 }];

export const filterGender = (relation_id) => {

  const Female = gender.slice(1);
  const Male = [gender[0], gender[2]];

  if ([3, 6, 8].includes(relation_id)) {
    return Female;
  }
  if ([4, 5, 7].includes(relation_id)) {
    return Male;
  }
  else return gender;
}

export const renderTooltip = (props, data) => (
  <div
    id="button-tooltip"
    {...props}
    className={`bg-light p-3 rounded-lg shadow-lg ${classesone.divWidth}`}
  >
    {data}
  </div>
);

export const ContextAwareToggle = ({ eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const { globalTheme } = useSelector(state => state.theme)
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
    <StyledButton
      color='#60c385;'
      variant="link"
      className="open-button"
      onClick={decoratedOnClick}
      relative={'relative'}>
      {isCurrentEventKey ? (<i
        style={{
          color: '#41807f',
          fontSize: globalTheme.fontSize ? `calc(27px + ${globalTheme.fontSize - 92}%)` : '27px',
          marginLeft: '-12px'
        }}
        className="fal fa-minus-circle"></i>) :
        (<i style={{
          color: '#41807f',
          fontSize: globalTheme.fontSize ? `calc(27px + ${globalTheme.fontSize - 92}%)` : '27px',
          marginLeft: '-12px'
        }} className="fal fa-plus-circle"></i>
        )}
    </StyledButton>
  );
};

const walletData = [
  [{ label: 'Flex Wallet Allocated', key_name: 'total_flex_amt' }, { label: 'Remaining Flex Wallet', key_name: 'remaining_flex_bal' }],
  [{ label: 'Flex Wallet Utilized', key_name: 'flex_utilized_amt' }, { label: 'To Pay', key_name: 'to_pay' }]
]

export const WalletDetail = ({ flex_balance }) =>
  <div className="row m-0">
    {!_.isEmpty(flex_balance) && (!!(flex_balance?.remaining_flex_bal || flex_balance?.total_flex_amt || flex_balance?.flex_utilized_amt)) &&
      <div className={`col-12 col-xl-8 w-100 py-2 ${classesone.pinkBackDiv}`}>
        {walletData.map((row, index1) => !!row.some(({ key_name }) => flex_balance[key_name]) &&
          <Row key={index1 + 'parent'} className="d-flex justify-content-between flex-column flex-sm-row align-items-center">
            {row.map(({ key_name, label }, index2) => !!flex_balance[key_name] &&
              <Col key={index1 + '-child-' + index2} xl={6} lg={6} md={12} sm={12}>
                <h5>
                  {label}: {" "}<span className="text-danger">₹ {Boolean(flex_balance[key_name]) ? comma(flex_balance[key_name]) : "-"}</span>
                </h5>
              </Col>)}
          </Row>)}
      </div>}
  </div>
