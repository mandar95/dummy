import React from "react";
import { CustomAccordion } from "../../../components/accordion";
import AccordionHeader from "../../../components/accordion/accordion-header";
import AccordionContent from "../../../components/accordion/accordion-content";
import {
  CardBox,
  AccordianImage,
  LabelTag,
  AccordionContainer,
  BoxContent,
  BoxContainer,
  AccordianWrap
} from "./style";

const FlexUtilize = (props) => {
  const FlexData = props?.FlexData;
  let List = FlexData?.map((item, index) => (
    <AccordianWrap key={item?.name + index}>
      <AccordionContainer>
        <CustomAccordion id="flexUtilize">
          <AccordionHeader>
            <div style={{ display: "flex" }}>
              <AccordianImage>
                <img
                  src={item?.image || '/assets/images/support.png'}
                  alt="FlexImage"
                  width="33"
                  style={{ padding: "3px" }}
                />
              </AccordianImage>
              <LabelTag>{item?.name || "N/A"}</LabelTag>
            </div>
          </AccordionHeader>
          <AccordionContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Amount</span>
              <span>{item?.flex_amount || "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Employee Count</span>
              <span>{item?.flex_employee_count || "N/A"}</span>
            </div>
          </AccordionContent>
        </CustomAccordion>
      </AccordionContainer>
    </AccordianWrap>
  ));
  return (
    <CardBox>
      {/*row*/}
      <BoxContainer>
        <BoxContent>{List}</BoxContent>
      </BoxContainer>
    </CardBox>
  );
};

export default FlexUtilize;
