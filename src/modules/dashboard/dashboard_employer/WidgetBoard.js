import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Widget from "../../../components/Widget/Widgets";
import _ from "lodash";
import {
  getWidgetsEmployer,
  selectWidgetsEmployer,
} from "../dashboard_broker/dashboard_broker.slice";
import { WidgetWrapper } from "./style";
import { Link } from 'react-router-dom';

const WidgetBoard = () => {
  //Selectors
  const dispatch = useDispatch();
  const WidgetData = useSelector(selectWidgetsEmployer);
  const { currentUser } = useSelector(state => state.login);

  // api call for widget data-----
  useEffect(() => {
    if (!_.isEmpty(currentUser))
      dispatch(getWidgetsEmployer(currentUser.is_super_hr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  //------------------------------

  //mapping widgets ----------------------------------------
  const List = _.uniq(
    WidgetData?.data?.headings?.map((item, index) => (
      <div className="p-1" key={'widgt104' + index}>
        <Link to={!_.isEmpty(WidgetData?.data?.links)
          ? WidgetData?.data?.links[index]
          : "/home"}
          style={{ textDecoration: "none" }}>
          <Widget
            Hex1={WidgetData?.data?.combinations[index].hex1}
            Hex2={WidgetData?.data?.combinations[index].hex2}
            Header={item}
            Number={WidgetData?.data?.data[`${item}`].toFixed(0)}
            Image={WidgetData?.data?.icons[index]?.icon}
          />
        </Link>
      </div>
    ))
  );

  return (
    <WidgetWrapper>{List}</WidgetWrapper>
  );
};

export default WidgetBoard;
