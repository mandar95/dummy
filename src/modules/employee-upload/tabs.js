import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import CardBody from "./CardBody";
import { loadErrorSheetAction, sampleEmployeeUpload } from "./employee-upload.action";

const ControlledTabs = ({ employer_id, myModule, set_employer_id, dispatch, uploadLoading }) => {

  const [key, setKey] = useState("21");
  const { currentUser } = useSelector(state => state.login);

  useEffect(() => {
    if (!myModule?.canwrite && !!myModule?.candelete) {
      setKey('22')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myModule]);


  // load Error Sheet
  useEffect(() => {
    if (currentUser.employer_id || currentUser.broker_id) {
      const payload = currentUser.employer_id ?
        { employer_id: currentUser.employer_id, document_type_id: key, is_super_hr: currentUser.is_super_hr } :
        { broker_id: currentUser.broker_id, document_type_id: key };

      loadErrorSheetAction(dispatch, payload);
      const intervalId = setInterval(() => loadErrorSheetAction(dispatch, payload), 15000);
      return () => { clearInterval(intervalId); }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, key])

  // download Sample file
  const downloadFile = () => {
    sampleEmployeeUpload({ type: key, employer_id: currentUser?.employer_id || employer_id })
  }

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
      }}
    >
      <Tab eventKey="21" title="Add" style={{ padding: "20px" }}>
        {!!myModule?.canwrite && <CardBody
          set_employer_id={set_employer_id}
          Header="Add Employee"
          employer_id={employer_id}
          type="21"
          downloadSampleFile={downloadFile}
          dispatch={dispatch}
          uploadLoading={uploadLoading}
          note='Employee Code, Employee First Name, Employee Email, Employee DOB & Employee Date of Joining'
        />}
      </Tab>
      <Tab eventKey="22" title="Remove" style={{ padding: "20px" }}>
        {!!myModule?.candelete && <CardBody
          set_employer_id={set_employer_id}
          Header="Remove Employee"
          employer_id={employer_id}
          type="22"
          downloadSampleFile={downloadFile}
          dispatch={dispatch}
          uploadLoading={uploadLoading}
          note='Employee Code & Employee Leaving Date'
        />}
      </Tab>
      <Tab eventKey="23" title="Corrections" style={{ padding: "20px" }}>
        {!!myModule?.canwrite && <CardBody
          set_employer_id={set_employer_id}
          Header="Employee Correction"
          employer_id={employer_id}
          type="23"
          downloadSampleFile={downloadFile}
          dispatch={dispatch}
          uploadLoading={uploadLoading}
          note='Employee Code & Type Of Correction'
        />}
      </Tab>
    </Tabs>
  );
};
export default ControlledTabs;
