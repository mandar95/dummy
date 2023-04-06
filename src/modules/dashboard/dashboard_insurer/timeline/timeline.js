import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useSelector } from "react-redux";
import _ from "lodash";
// import { Button } from "react-bootstrap";
import styled from "styled-components";

// const SpanTag = styled.span`
// 	float: right;
// `;

const VerticalTimelineElementStyled = styled(VerticalTimelineElement)`
	.vertical-timeline-element-date {
		color: black !important;
	}
`;

const TimeLine = () => {
	const { activitywise } = useSelector((state) => state.InsDash);
	const styles = {
		Open: [{ background: "rgb(33, 150, 243)", color: "#fff" }, "secondary"],
		Deficiency: [{ background: "rgb(255, 255, 102)", color: "black" }, "danger"],
		Lost: [{ background: "rgb(204, 255, 255)", color: "black" }, "info"],
		Reject: [{ background: "rgb(255, 0, 0)", color: "#fff" }, "dark"],
		Won: [{ background: "rgb(0, 204, 0)", color: "#fff" }, "light"],
	};
	return (
		!_.isEmpty(activitywise) && (
			<VerticalTimeline>
				{activitywise.map(({ labels, selected_plan, total_customer }, index) => (
					<VerticalTimelineElementStyled
						key={'timeline' + index}
						className="vertical-timeline-element--work"
						contentStyle={
							total_customer * 1 <= 5
								? styles?.Reject[0]
								: total_customer * 1 <= 10
									? styles?.Deficiency[0]
									: total_customer * 1 <= 15
										? styles?.Lost[0]
										: total_customer * 1 <= 25
											? styles?.Open[0]
											: styles?.Won[0]
						}
						contentArrowStyle={{
							borderRight: `7px solid ${total_customer * 1 <= 5
								? styles?.Reject[0]?.background
								: total_customer * 1 <= 10
									? styles?.Deficiency[0]?.background
									: total_customer * 1 <= 15
										? styles?.Lost[0]?.background
										: total_customer * 1 <= 25
											? styles?.Open[0]?.background
											: styles?.Won[0]?.background
								} `,
						}}
						date={labels}
						iconStyle={
							total_customer * 1 <= 5
								? styles?.Reject[0]
								: total_customer * 1 <= 10
									? styles?.Deficiency[0]
									: total_customer * 1 <= 15
										? styles?.Lost[0]
										: total_customer * 1 <= 25
											? styles?.Open[0]
											: styles?.Won[0]
						}
					// icon={<WorkIcon />}
					>
						<h3 className="vertical-timeline-element-title">
							{total_customer * 1 &&
								(total_customer * 1 === 1
									? `${total_customer || 'N/A'} Customer visited`
									: `${total_customer || 'N/A'} Customers visited`)}
						</h3>
						<h3 className="vertical-timeline-element-subtitle">
							{selected_plan * 1 &&
								(selected_plan * 1 === 1
									? `${selected_plan || 'N/A'} Plan seen by the Customers`
									: `${selected_plan || 'N/A'} Plans seen by the Customers`)}
						</h3>
						{/*saw {selected_plan || "N/A"} Quotes*/}
					</VerticalTimelineElementStyled>
				))}
			</VerticalTimeline>
		)
	);
};

export default TimeLine;
