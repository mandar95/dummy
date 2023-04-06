import React from "react";
import service from "./Wellness.service";
import { WellnessLogModel } from "../../offline-tpa/tpalog/CommonFunctions";
import TpaWellnessUI from "../../offline-tpa/tpalog";
const WellnessLog = () => {
  return (
    <TpaWellnessUI
      FetchAPI={service.getWellNessLog}
      module={WellnessLogModel}
      cardTitle={"Wellness Log"}
      nofoundData={"No Wellness Log Found"}
    />
  );
};

export default WellnessLog;



