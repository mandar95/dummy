import React from "react";
import Styled from "styled-components";
import { Gta } from "../Flex-moudle";
import EmiInfo from "./Emi";

const GroupTermLifeList = () => {
  return (
    <>
      <div className="GMList">
        {Gta.map((item, i) => (
          <EmiInfo
            key={i}
            sum_insured={item.sum_insured}
            premium={item.premium}
          />
        ))}
      </div>
    </>
  );
};

export default GroupTermLifeList;
