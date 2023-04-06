import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Policy_Wise_Claim/Graph1";
import Graph2 from "./Policy_Wise_Claim/Graph2";
import Graph3 from "./Policy_Wise_Claim/Graph3";
import { getpolicyWiseClaim, selectpolicyWiseClaim } from "./dashboard_admin.slice";

function ControlledTabs(props) {
  //selectors
  const dispatch = useDispatch();
  const GraphData = useSelector(selectpolicyWiseClaim);
  const { globalTheme: { dark, fontSize } } = useSelector(state => state.theme);
  //states
  const [key, setKey] = useState("1");
  const [graph, setgraph] = useState([]);
  const [theme, setTheme] = useState(null);

  //api call for graph data ------
  useEffect(() => {
    setgraph([]);
    const formData = Object.assign(
      {
        graph_type: "Linear",
      },
      props.formdata
    );
    dispatch(getpolicyWiseClaim(formData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formdata]);
  //-----------------------------

  //update graphdata-----------
  useEffect(() => {
    if (GraphData?.data?.data != null) {
      setgraph(GraphData?.data?.data);
      setTheme(GraphData?.data?.theme)
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
      <Tab eventKey="1" title="Clustered Bar Chart">
        <div style={{ marginTop: "10px" }}>
          <Graph1 dark={dark} GraphData={graph} theme={theme} />
          <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Claim</label>
        </div>
      </Tab>
      <Tab eventKey="2" title="Stacked Column Chart">
        <div style={{ marginTop: "10px" }}>
          <Graph2 dark={dark} GraphData={graph} theme={theme} />
          <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Claim</label>
        </div>
      </Tab>
      <Tab eventKey="3" title="Donut Chart">
        <div style={{ marginTop: "10px" }}>
          <Graph3 dark={dark} GraphData={graph} theme={theme} />
          <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Claim</label>
        </div>
      </Tab>
    </Tabs>
  );
}

export default ControlledTabs;
