import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "../../../components/Widget/Widgets";
import _ from "lodash";
import { getWidgetsData, selectWidgetsData } from "./dashboard_broker.slice";
import { WidgetWrapper } from "./style";
import { Loader } from "../../../components";
import { Link } from 'react-router-dom';

const WidgetBoard = () => {
  //Selectors
  const dispatch = useDispatch();
  const WidgetData = useSelector(selectWidgetsData);

  // api call for widget data-----
  useEffect(() => {
    dispatch(getWidgetsData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //mapping widgets ----------------------------------------
  const List = _.uniq(
    WidgetData?.data?.headings?.map((item, index) => (
      <div className="p-1" key={'widgt102' + index}>
        <Link to={!_.isEmpty(WidgetData?.data?.links)
          ? WidgetData?.data?.links[index]
          : "/home"}
          style={{ textDecoration: "none" }}>
          <Widget
            Hex1={WidgetData?.data?.combinations[index].hex1}
            Hex2={WidgetData?.data?.combinations[index].hex2}
            Header={item}
            Number={WidgetData?.data?.data[`${item}`]}
            Image={WidgetData?.data?.icons[index]?.icon}
          />
        </Link>
      </div >
    ))
  );

  //------------------------------
  return WidgetData.data ? (
    <WidgetWrapper>{List}</WidgetWrapper>
  ) : <Loader />;
};

export default React.memo(WidgetBoard);
