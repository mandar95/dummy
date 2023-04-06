import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Graph_PolicyWise/Graph1";
// import Graph2 from "./Graph_PolicyWise/Graph2";
import { selectpolicyGraph } from "./dashboard_broker.slice";
import { ThreeSpinner } from "../Loader";
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
  return GraphData?.data ? (
    <div style={{ marginTop: "10px", minHeight: "450px" }}>
      <Graph1 dark={dark} Graphdata={graph?.map(elem => ({ ...elem, label: DateFormate(elem.label) }))} theme={theme} />
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Enrolment</label>
    </div>
  ) :
    <ThreeSpinner />;
}

export default ControlledTabs;
