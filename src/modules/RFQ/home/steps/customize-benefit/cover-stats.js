import React, { useEffect, useState } from "react";
import { TabWrapper, Tab } from "components";
import { Row, Col } from "react-bootstrap";
import { CompactCard } from "components";
// import _ from "lodash";

const CoverStats = ({ cover, all }) => {
	const [trigger, setTrigger] = useState("covered");
	const [filterData, setFilterData] = useState(cover);

	//cover : product_feature_id ,all: id
	useEffect(() => {
		if (trigger === "covered") {
			setFilterData(
				all.filter(({ id }) =>
					cover.some(
						({ product_feature_id }) => Number(id) === Number(product_feature_id)
					)
				)
			);
		} else {
			setFilterData(
				all.filter(({ id }) =>
					cover.every(
						({ product_feature_id }) => Number(id) !== Number(product_feature_id)
					)
				)
			);
		}
	}, [trigger, cover, all]);

	const covered = (
		<Row>
			{filterData.length ? (
				filterData.map((item, index) => (
					<Col key={'filter-data' + index} sm="12" md="12" lg="6" xl="6">
						<CompactCard removeBottomHeader={true}>
							<div style={{ marginTop: "-40px", display: "flex" }}>
								<Col xs="3" sm="2" md="2" lg="3" xl="3" className="pr-1">
									<img
										alt="user"
										src={item?.logo || "/assets/images/women_user.png"}
										height="50"
										width="50"
									/>
								</Col>
								<Col
									xs="9"
									sm="10"
									md="10"
									lg="9"
									xl="9"
									style={{ maxHeight: "150px", overflow: "auto" }}
								>
									<h5 style={{ fontWeight: "600" }}>{item?.name || "N/A"}</h5>
									{/* <p>{item?.content}</p> */}
								</Col>
							</div>
						</CompactCard>
					</Col>
				))
			) : (
				<h3 className="mx-auto">
					{trigger === "covered" ? "No feature covered" : "All Features Covered"}
				</h3>
			)}
		</Row>
	);

	return (
		<>
			<TabWrapper width={"max-content"}>
				<Tab
					color={"#32CD32"}
					isActive={trigger === "covered"}
					onClick={() => setTrigger("covered")}
				>
					What's covered
				</Tab>
				<Tab
					color={"#32CD32"}
					isActive={trigger === "notCovered"}
					onClick={() => setTrigger("notCovered")}
				>
					What's not covered
				</Tab>
			</TabWrapper>

			{trigger === "covered" && covered}
			{trigger === "notCovered" && covered}
		</>
	);
};

export default CoverStats;
