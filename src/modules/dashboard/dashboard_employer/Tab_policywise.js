import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Graph_PolicyWise/Graph1";
// import Graph2 from "./Graph_PolicyWise/Graph2";
import {
  // getpolicyGraph,
  selectpolicyGraph,
} from "../dashboard_broker/dashboard_broker.slice";
import { DateFormate } from 'utils'

function ControlledTabs(props) {
  //selectors
  // const dispatch = useDispatch();
  const GraphData = useSelector(selectpolicyGraph);
  const {
    globalTheme: { dark, fontSize },
  } = useSelector((state) => state.theme);
  //states
  // const [key, setKey] = useState("1");
  const [graph, setgraph] = useState([]);
  const [theme, setTheme] = useState(null);

  //api call for graph data ------
  // useEffect(() => {
  //   setgraph([]);
  //   const formData = Object.assign(
  //     {
  //       graph_type: "Linear",
  //     },
  //     props.formdata
  //   );
  //   dispatch(getpolicyGraph(formData));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.formdata]);
  //-----------------------------

  //update graphdata-----------
  useEffect(() => {
    if (GraphData?.data?.data != null) {
      setgraph(GraphData?.data?.data);
      setTheme(GraphData?.data?.theme);
    }
  }, [GraphData]);
  //---------------------------
  return (
    // <Tabs
    //   id="controlled-tab-example"
    //   activeKey={key}
    //   onSelect={(k) => setKey(k)}
    //   mountOnEnter={true}
    //   unmountOnExit={true}
    // >
    //   <Tab eventKey="1" title="Bar Graph">
    <div style={{ marginTop: "10px", minHeight: "450px" }}>
      <Graph1 dark={dark} Graphdata={graph?.map(elem => ({ ...elem, label: DateFormate(elem.label) }))} theme={theme} />
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Enrolment</label>
    </div>
    //   </Tab>
    //   <Tab eventKey="2" title="Pie Chart">
    //     <div style={{ marginTop: "10px", minHeight: "450px" }}>
    //       <Graph2 dark={dark} Graphdata={graph} theme={theme} />
    //       <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Enrolment</label>
    //     </div>
    //   </Tab>
    // </Tabs>
  );
}

export default ControlledTabs;
