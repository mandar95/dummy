import React from "react";
import { NumberInd } from "utils";

const IpdSiBox = ({ isMobile, classes, v, showIpdOnTwoAndThree, showImageOnPolicy3and6 }) => {

  const SumInsured = v.ipd_total_cover || v.suminsured;

  return (
    <div className={`mx-1 ${isMobile ? `${classes.paddingDiv}` : `w-100 py-2 mb-2 mb-sm-0`} ${classes.divBorder2} ${classes.redBack}`}>
      {!!(SumInsured || v.enhnace_cover) && (
        <>
          <div className={v.cover_balance === SumInsured ? `${isMobile ? `${classes.paddingDiv2}` : "py-4"}` : ''}>
            <div className={`text-center`}>
              <small className={`${classes.bigFont}`}>{showIpdOnTwoAndThree} Sum{" "}
                {showImageOnPolicy3and6 ? "Assured" : "Insured"} {!!v.enhnace_cover && ' + Enhance'} </small>
            </div>
            <div className={`text-center`}>
              <small className={`${classes.fontBold}`}>{" "}
                {Number(v.suminsured_type) === 2 ? <>
                  ₹{" "}
                  {NumberInd(SumInsured)}
                  {!!v.enhnace_cover && <> + ₹{" "}
                    {NumberInd(v.enhnace_cover)}</>}
                </> : 'View Details'}
              </small>
            </div>
          </div>
          {(!!v.cover_balance && (v.cover_balance !== SumInsured)) && <div className="border-top w-100">
            <div className={`text-center`}>
              <small className={`${classes.bigFont}`}>{showIpdOnTwoAndThree} Cover Balance</small>
            </div>
            <div className={`text-center`}>
              <small className={`${classes.fontBold}`}>  ₹{" "}
                {NumberInd(v.cover_balance)}</small>
            </div>
          </div>}
        </>
      )}
    </div>
  )
};

export default IpdSiBox;
