import React from "react";
import {
  Accordion,
  AccordionContext,
  useAccordionToggle,
} from "react-bootstrap";

import { useContext } from "react";
import { StyledButton } from "modules/RFQ/data-upload/style";
import { useSelector } from "react-redux";
// import { de } from "date-fns/locale";
import AddOnFeatureList from "./AddOnFeature-list";

const ContextAwareToggle = ({ eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const { globalTheme } = useSelector((state) => state.theme);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
    <StyledButton
      color="#60c385;"
      variant="link"
      className="open-button"
      onClick={decoratedOnClick}
      relative={"relative"}
    >
      {isCurrentEventKey ? (
        <i
          style={{
            color: "rgb(96, 96, 96)",
            fontSize: globalTheme.fontSize
              ? `calc(17px + ${globalTheme.fontSize - 92}%)`
              : "17px",
            marginLeft: "-12px",
            fontWeight: "600",
          }}
          className="fal fa-chevron-down"
        ></i>
      ) : (
        <i
          style={{
            color: "rgb(96, 96, 96)",
            fontSize: globalTheme.fontSize
              ? `calc(17px + ${globalTheme.fontSize - 92}%)`
              : "17px",
            marginLeft: "-12px",
            fontWeight: "600",
          }}
          className="fal fa-chevron-right"
        ></i>
      )}
    </StyledButton>
  );
};

const AddOnToggle = ({ benefits_features }) => {

  const { globalTheme } = useSelector((state) => state.theme);

  const AccordionComp = (
    <Accordion
      // defaultActiveKey={1}
      style={{
        // borderRadius: "06px",
        width: "auto",
        margin: "5px 10px 5px 16px",
        // border: "1px solid #e5e5e5",
        // boxShadow: "rgb(206 229 218) 1px 1px 7px",
      }}
      key={"AllowedRelations-" /* + index */}
    >
      <Accordion.Toggle
        eventKey={1}
        style={{
          width: "100%",
          //   border: "none",
          //   borderTopLeftRadius: "20px",
          //   borderTopRightRadius: "20px",
          background: "white",
          //   borderRadius: "15px",
          //   padding: "10px",
          outline: "none",
          border: "none",
        }}
        className="d-flex justify-content-between align-items-center"
      >
        <div
          className="text-left ml-2"
          style={{
            // fontWeight: "600",
            // fontSize: globalTheme.fontSize ? `calc(1.2rem + ${globalTheme.fontSize - 92}%)` : '1.2rem',
            // color: "#444343",
            fontWeight: '500',
            color: '#56697c',
            fontSize: '1.1rem'
          }}
        >
          {benefits_features.length} Add-ons
        </div>
        <ContextAwareToggle eventKey={1} />
      </Accordion.Toggle>
      <Accordion.Collapse
        eventKey={1}
        style={{
          width: "100%",
          // paddingTop: '50px',
          paddingBottom: "5px",
          paddingLeft: "15px",
          paddingRight: "15px",
          background: globalTheme.Tab?.color + '17',
          borderRadius: '10px',
          paddingTop: '1px'
          // borderTop: '2px solid #e5e5e5',
          //   borderBottomLeftRadius: "20px",
          //   borderBottomRightRadius: "20px",
        }}
      >
        <AddOnFeatureList benefits_features={benefits_features} />
      </Accordion.Collapse>
      {/* <hr /> */}
    </Accordion>
  );

  return (
    <>
      <div>{AccordionComp}</div>
      <hr className="line" />
    </>
  );
};

export default AddOnToggle;
