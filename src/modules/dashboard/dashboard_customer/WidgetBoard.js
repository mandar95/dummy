import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "../../../components/Widget/Widgets";
import _ from "lodash";
import { getWidgets } from "./dashboard_customer.slice";
import styled from "styled-components";
import { Loader } from "components";

const WidgetWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	@media (max-width: 600px) {
		display: block;
		overflow: auto;
	}
`;

const WidgetBoard = ({ quotes }) => {
	//Selectors
	const dispatch = useDispatch();
	const { widgets, loading } = useSelector((state) => state.CustDash);

	//mapping widgets ----------------------------------------
	const List = _.uniq(
		widgets?.headings?.map((item, index) =>
			!_.isEmpty(widgets?.links) ? (
				<div className="p-1" key={'widgt103' + index} >
					<a href={widgets?.links[index] || "/home"} style={{ textDecoration: "none" }}>
						<Widget
							Hex1={widgets?.combinations[index].hex1}
							Hex2={widgets?.combinations[index].hex2}
							Header={item}
							Number={widgets?.data[`${item}`]}
							Image={widgets?.icons[index]?.icon}
						/>
					</a>
				</div>
			) : (
				<div className="p-1" key={'widgt103' + index}>
					<Widget
						Hex1={widgets?.combinations[index].hex1}
						Hex2={widgets?.combinations[index].hex2}
						Header={item}
						Number={widgets?.data[`${item}`]}
						Image={widgets?.icons[index]?.icon}
					/>
				</div>
			)
		)
	);

	// api call for widget data-----
	useEffect(() => {
		dispatch(getWidgets());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//------------------------------
	return (
		!loading || !_.isEmpty(widgets) ? (
			<>{_.isEmpty(quotes) && <WidgetWrapper>{List}</WidgetWrapper>}</>
		) : (
			<Loader />
		)
	);
};

export default WidgetBoard;
