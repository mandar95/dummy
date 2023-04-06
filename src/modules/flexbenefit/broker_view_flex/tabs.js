import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import FlexUtilize from "./FlexUtilize";
// import SalaryDeduction from "./SalaryDeduction";

const ControlledTabs = (props) => {
  const [key, setKey] = useState("1");
  return (
    <Tabs
      style={{ transition: "2s" }}
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
      }}
    >
      <Tab eventKey="1" title="Flex Utilize" style={{ padding: "1em" }}>
        <FlexUtilize FlexData={props.FlexData} />
      </Tab>
      {/* <Tab eventKey="2" title="Salary Deduction" style={{ padding: "20px" }}>
        <SalaryDeduction FlexData={props.FlexData} />
      </Tab> */}
    </Tabs>
  );
};
export default ControlledTabs;
