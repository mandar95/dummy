import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import "./Tabs.css";
import CardBody from "./CardBody";
// import { getSampleFile } from "./addMember.slice";
import { getDynamicFile } from "../EndorsementRequest/EndorsementRequest.slice";

const ControlledTabs = ({ policyno,
  employerId,
  myModule,
  reset }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState("1");

  useEffect(() => {
    if (Number(myModule?.canwrite) === 0) {
      setKey('2')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myModule]);

  // download Sample file
  const downloadFile = () => {
    dispatch(getDynamicFile({ type: Number(key), policy_id: policyno }));
  }

  return (
    <Tabs
      animation={true}
      id="controlled-tab-example"
      onSelect={(k) => {
        setKey(k);
      }}
    >
      {!!myModule?.canwrite && <Tab eventKey="1" title="Add" style={{ padding: "20px" }}>
        <CardBody
          reset={reset}
          Header="Add Member"
          policyNumberData={policyno}
          employerId={employerId}
          type="Add"
          new_type={3}
          downloadSampleFile={downloadFile}
        />
      </Tab>}
      {!!myModule?.candelete && <Tab eventKey="2" title="Remove" style={{ padding: "20px" }}>
        <CardBody
          reset={reset}
          Header="Remove Member"
          policyNumberData={policyno}
          employerId={employerId}
          type="Remove"
          new_type={4}
          downloadSampleFile={downloadFile}
        />
      </Tab>}
      {!!myModule?.canwrite && <Tab eventKey="3" title="Corrections" style={{ padding: "20px" }}>
        <CardBody
          reset={reset}
          Header="Corrections"
          policyNumberData={policyno}
          employerId={employerId}
          type="Update"
          new_type={5}
          downloadSampleFile={downloadFile}
        />
      </Tab>}
    </Tabs>
  );
};
export default ControlledTabs;
