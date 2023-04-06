import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Graph1 from "./Graph1";

function ControlledTabs(props) {
	const {
		globalTheme: { dark },
	} = useSelector((state) => state.theme);
	const [key, setKey] = useState("1");

	return (
		<Tabs
			id="controlled-tab-example"
			activeKey={key}
			onSelect={(k) => setKey(k)}
			mountOnEnter={true}
			unmountOnExit={true}
		>
			<Tab eventKey="1" title="Stacked Bar Chart">
				<div style={{ marginTop: "10px" }}>
					<Graph1 dark={dark} GraphData={props?.premiumwise} theme={1} />
				</div>
			</Tab>
			{/* <Tab eventKey="2" title="Stacked Column Chart">
				<div style={{ marginTop: "10px" }}>
					<Graph2 dark={dark} GraphData={props?.statuswise} theme={1} />
				</div>
			</Tab> */}
		</Tabs>
	);
}

export default ControlledTabs;
