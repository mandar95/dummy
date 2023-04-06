import React from "react";
import { NumberInd } from "utils";

const OpdSiBox = ({ isMobile, classes, v, showImageOnPolicy3and6, showImageOnPolicy1and4, showImageOnPolicy2and5, image1, image2, image3 }) => {

  const SumInsured = v.opd_total_cover || v.opd_suminsured;

  return (
    <div className={`${isMobile ? `` : "w-100 py-2 mx-1 mb-2 mb-sm-0"} ${(v.opd_cover_balance > 0 && SumInsured > 0) ? `${classes.divBorder2} ${classes.redBack} ${isMobile && classes.paddingDiv}` : ``}`}>
      {!!(v.opd_cover_balance || SumInsured) ? (
        <>
          {!!(SumInsured) && (
            <div className={SumInsured === v.opd_cover_balance ? `${isMobile ? `${classes.paddingDiv2}` : "py-4"}` : ''}>
              <div className={`text-center`}>
                <small className={`${classes.bigFont}`}>OPD Sum{" "}
                  {showImageOnPolicy3and6 ? "Assured" : "Insured"}</small>
              </div>
              <div className={`text-center`}>
                <small className={`${classes.fontBold}`}>{" "}
                  {(Number(v.opd_suminsured_type) === 2 || !v.opd_suminsured_type) ? <>
                    ₹{" "}
                    {NumberInd(SumInsured)}
                  </> : 'View Details'}
                </small>
              </div>
            </div>
          )}
          {!!v.opd_cover_balance && SumInsured !== v.opd_cover_balance && <div className="border-top w-100">
            <div className={`text-center`}>
              <small className={`${classes.bigFont}`}>OPD Cover Balance</small>
            </div>
            <div className={`text-center`}>
              <small className={`${classes.fontBold}`}>  ₹{" "}
                {NumberInd(v.opd_cover_balance)}</small>
            </div>
          </div>}
        </>
      ) : (
        <div className={`${classes.imgdiv}`}>
          {showImageOnPolicy1and4 && (
            <div>
              <img src={image1} alt="1and4" />
            </div>
          )}
          {showImageOnPolicy2and5 && (
            <div>
              <img src={image2} alt="2and5" />
            </div>
          )}
          {showImageOnPolicy3and6 && (
            <div>
              <img src={image3} alt="3and6" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OpdSiBox;
