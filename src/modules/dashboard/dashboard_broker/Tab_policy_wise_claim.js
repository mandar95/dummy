import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Policy_Wise_Claim/Graph1";
// import Graph2 from "./Policy_Wise_Claim/Graph2";
// import Graph3 from "./Policy_Wise_Claim/Graph3";
import {
  // getpolicyWiseClaim,
  selectpolicyWiseClaim,
} from "./dashboard_broker.slice";
import { ThreeSpinner } from "../Loader";

function ControlledTabs(props) {
  //selectors
  // const dispatch = useDispatch();
  const GraphData = useSelector(selectpolicyWiseClaim);
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
  //   dispatch(getpolicyWiseClaim(formData));
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
      <Graph1 dark={dark} GraphData={graph} theme={theme} />
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Policy Wise Claim</label>
    </div>
  ) :
    <ThreeSpinner />;
}

export default ControlledTabs;
