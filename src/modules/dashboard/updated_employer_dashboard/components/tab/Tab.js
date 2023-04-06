import React from "react";
import { TabContainer } from "../../style";

const Tab = ({ isActive, name, onClick }) => {
  return (
    <TabContainer
      onClick={onClick}
      isActive={isActive}
      className="mr-md-3 mr-2 mb-md-0 mb-3 "
    >
      {name}
    </TabContainer>
  );
};

export default Tab;
