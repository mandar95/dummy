import React, { useEffect } from "react";
import { CardBlue, NoDataFound } from "../../components";
import { BuyCard } from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { selectInsuranceLink, loadInsuranceLink } from "./MyPolicy.slice";

export const BuyInsurance = (props) => {
  const dispatch = useDispatch();
  const insurance_link = useSelector(selectInsuranceLink);

  useEffect(() => {
    dispatch(loadInsuranceLink());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardBlue title="Buy Insurance Policy" round>
      {insurance_link.length ? <BuyCard Data={insurance_link} /> :
        <NoDataFound />}
    </CardBlue>
  );
};
