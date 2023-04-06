import React from "react";
import InfoCard from "./InfoCard";
import { Wrapper } from './style'

const CardList = (props) => {
  const hospitalData = props?.hospitalData;
  const List = hospitalData?.map((item, index) => (
    <InfoCard getLocation={props.getLocation} key={'card-list' + index} title={item.hospital_name} data={item} />
  ));
  return <Wrapper status={props.status}>{List}</Wrapper>
};

export default CardList;
