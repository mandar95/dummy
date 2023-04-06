import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import CardBody from "./cardBody";
import { getDynamicFileTPA } from "../EndorsementRequest/EndorsementRequest.slice";

const ControlledTabs = ({ policyNumberData,
  employerId,
  myModule,
  to_override,
  is_opd }) => {
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
    // if (is_opd) {
    //   if ('1' === key) dispatch(getDynamicFileTPA({ type: 1, policy_id: policyNumberData.id }))
    //   if ('2' === key) dispatch(getDynamicFileTPA({ type: 2, policy_id: policyNumberData.id }))
    //   if ('3' === key) dispatch(getDynamicFileTPA({ type: 3, policy_id: policyNumberData.id }))
    // }
    // else dispatch(getDynamicFileTPA({ type: Number(key), policy_id: policyNumberData.id }));

    if ('1' === key) dispatch(getDynamicFileTPA({ policy_id: policyNumberData.id }))

  }

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
      }}
    >
      {<Tab eventKey="1" title="Add" style={{ padding: "20px" }}>
        <CardBody
          to_override={to_override}
          Header="Add Member"
          policyNumberData={policyNumberData}
          employerId={employerId}
          type="Add"
          downloadSampleFile={downloadFile}
        />
      </Tab>}
      {/* {<Tab eventKey="2" title="Remove" style={{ padding: "20px" }}>
        <CardBody
          Header="Remove Member"
          policyNumberData={policyNumberData}
          employerId={employerId}
          type="Remove"
          downloadSampleFile={downloadFile}
        />
      </Tab>}
      {<Tab eventKey="3" title="Corrections" style={{ padding: "20px" }}>
        <CardBody
          Header="Corrections"
          policyNumberData={policyNumberData}
          employerId={employerId}
          type="Update"
          downloadSampleFile={downloadFile}
        />
      </Tab>} */}
      {/* {!!myModule?.canwrite && <Tab eventKey="50" title="IC Endorsement" style={{ padding: "20px" }}>
        <CardBody
          Header="IC Endorsement"
          policyNumberData={policyNumberData}
          employerId={employerId}
          type="Endorsement"
          downloadSampleFile={downloadFile}
        />
      </Tab>} */}
    </Tabs>
  );
};
export default ControlledTabs;
