import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./MemberWiseEnrollment/Graph1";
// import Graph2 from "./MemberWiseEnrollment/Graph2";
import {
  // getMemberEnrollGraph,
  selectMemberEnrollGraph,
} from "../dashboard_broker/dashboard_broker.slice";

function ControlledTabs(props) {
  // const dispatch = useDispatch();
  const GraphData = useSelector(selectMemberEnrollGraph);
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
  //   dispatch(getMemberEnrollGraph(formData));
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
      <Graph1 dark={dark} GraphData={graph} theme={theme} />
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Member Wise Enrolment</label>
    </div>
    //   </Tab>
    //   <Tab eventKey="2" title="Pie Chart">
    //     <div style={{ marginTop: "10px", minHeight: "450px" }}>
    //       <Graph2 dark={dark} GraphData={graph} theme={theme} />
    //       <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Member Wise Enrolment</label>
    //     </div>
    //   </Tab>
    // </Tabs>
  );
}

export default ControlledTabs;
