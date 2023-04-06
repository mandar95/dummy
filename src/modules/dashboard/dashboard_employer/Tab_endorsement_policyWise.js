import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Endorsement_PolicyWise/Graph1";
// import Graph2 from "./Endorsement_PolicyWise/Graph2";
// import Graph3 from "./Endorsement_PolicyWise/Graph3";
import {
  // getendorsementPolicyWise,
  selectendorsementPolicyWise,
} from "../dashboard_broker/dashboard_broker.slice";

function ControlledTabs(props) {
  //selectors
  // const dispatch = useDispatch();
  const GraphData = useSelector(selectendorsementPolicyWise);
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
  //   dispatch(getendorsementPolicyWise(formData));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.formdata]);
  //-----------------------------

  //update graphdata-----------
  useEffect(() => {
    if (GraphData?.data != null) {
      setgraph(GraphData?.data);
      setTheme(GraphData?.data?.theme);
    }
  }, [GraphData]);
  //---------------------------

  return (
    <div style={{ marginTop: "10px", minHeight: "450px" }}>
      <Graph1 dark={dark} GraphData={graph} theme={theme} />
      <label style={{ fontSize: fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px' }}>Endorsement Policy Wise</label>
    </div>
  );
}

export default ControlledTabs;
