import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Member_wise_claim/Graph1";
// import Graph2 from "./Member_wise_claim/Graph2";
// import Graph3 from "./Member_wise_claim/Graph3";
import {
  // getmemberWiseClaim,
  selectmemberWiseClaim,
} from "./dashboard_broker.slice";
import { ThreeSpinner } from "../Loader";

function ControlledTabs(props) {
  //selectors
  // const dispatch = useDispatch();
  const GraphData = useSelector(selectmemberWiseClaim);
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
  //   dispatch(getmemberWiseClaim(formData));
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
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Member Wise Claim</label>
    </div>
  ) :
    <ThreeSpinner />;
}

export default ControlledTabs;
