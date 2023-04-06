import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Table from "./MemberWiseEnrollment/Table";
import Graph1 from "./MemberWiseEnrollment/Graph1";
import Graph2 from "./MemberWiseEnrollment/Graph2";
import {getPolicyPlanSummary,selectPolicyPlanData} from './dashboard_admin.slice';

function ControlledTabs(props) {
  const dispatch = useDispatch();
  const GraphData = useSelector(selectPolicyPlanData);
  const { globalTheme: { dark } } = useSelector(state => state.theme);
  //states
  const [key, setKey] = useState("1");
  const [graph, setgraph] = useState([]);
  // eslint-disable-next-line 
  const [theme, setTheme] = useState(null);

  //api call for graph data ------
  useEffect(() => {
    setgraph([]);
    dispatch(getPolicyPlanSummary());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formdata]);
  //-----------------------------

  //update graphdata-----------
  useEffect(() => {
    if (GraphData?.data?.data != null) {
      setgraph(GraphData?.data?.data);
      // setTheme(GraphData?.data?.theme)
    }
  }, [GraphData]);
  //---------------------------
  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      mountOnEnter={true}
      unmountOnExit={true}
    >
    <Tab eventKey="1" title="Summary">
      <div style={{padding:'25px',margin:"10px", minHeight:'450px' }}>
        <Table data={graph} />
      </div>
    </Tab>
    <Tab eventKey="2" title="Stacked Column Chart">
      <div style={{ marginTop: "10px", minHeight:'450px' }}>
        <Graph1 dark={dark} GraphData={graph} theme={theme} />
      </div>
    </Tab>
    <Tab eventKey="3" title="Donut Chart">
      <div style={{ marginTop: "10px", minHeight:'450px' }}>
        <Graph2 dark={dark} GraphData={graph} theme={theme} />
      </div>
    </Tab>
    </Tabs>
  );
}

export default ControlledTabs;
