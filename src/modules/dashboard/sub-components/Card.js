import React, { useState } from "react";
import classes from "../againCard.module.css";
import BenifitModal from "../BenifitModal";
import CardTopBar from "./card-parts/CardTopBar";
import FamilyConstructBox from "./card-parts/FamilyConstructBox";
import IpdSiBox from "./card-parts/IpdSiBox";
import OpdSiBox from "./card-parts/OpdSiBox";
import CardFooterBar from "./card-parts/CardFooterBar";
import { useHistory } from "react-router-dom";
import image1 from "../1and4.png";
import image2 from "../2and5.png";
import image3 from "../3and6.png";
import { useMediaQuery } from 'react-responsive'
const Card = ({ v, navigatorName, description }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const [lgShow, setLgShow] = useState(false);
  const history = useHistory();
  const navigator = (navigateTo, policy_id) => {
    // history.push(`/employee/home/${navigateTo}/${policy_id}`);
    history.push(`/home/employee-policy-members/${policy_id}`);
  };
  // const doesHaveOpd = v.opd_suminsured ? "IPD " : "";
  const showIpdOnTwoAndThree =
    v.policy_sub_type_id === 2 ||
      v.policy_sub_type_id === 3 ||
      v.policy_sub_type_id === 5 ||
      v.policy_sub_type_id === 6
      ? ""
      : "IPD";
  const showImageOnPolicy1and4 =
    v.policy_sub_type_id === 1 || v.policy_sub_type_id === 4;
  const showImageOnPolicy2and5 =
    v.policy_sub_type_id === 2 || v.policy_sub_type_id === 5;
  const showImageOnPolicy3and6 =
    v.policy_sub_type_id === 3 || v.policy_sub_type_id === 6;

    const SumInsuredIPD = v.ipd_total_cover || v.suminsured;
    const SumInsuredOPD = v.opd_total_cover || v.opd_suminsured;

  return <>
    <div className={`shadow w-100 ${classes.card} my-4 my-sm-3 mr-4 mr-lg-0`}>
      <CardTopBar navigator={navigator} navigatorName={navigatorName} v={v} classes={classes} />
      <div
        style={{ cursor: "pointer", }}
        className={`${classes.controlCard} ${classes.controlMargin} ${classes.minHeightCard}`}
        onClick={() => navigator(navigatorName, v.policy_id)}
      >
        <FamilyConstructBox isMobile={isMobile} v={v} classes={classes} />
        {Number(SumInsuredIPD) > 0 && <IpdSiBox isMobile={isMobile} v={v} classes={classes} showIpdOnTwoAndThree={showIpdOnTwoAndThree} showImageOnPolicy3and6={showImageOnPolicy3and6} />}
        <OpdSiBox
          isMobile={isMobile} v={v} classes={classes} showImageOnPolicy3and6={showImageOnPolicy3and6}
          showImageOnPolicy1and4={showImageOnPolicy1and4} showImageOnPolicy2and5={showImageOnPolicy2and5}
          image1={image1} image2={image2} image3={image3}
        />
        {(!(SumInsuredIPD || v.enhnace_cover) && !!(v.opd_cover_balance || SumInsuredOPD)) && <div className={`${classes.imgdiv}`}>
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
        </div>}
      </div>
      <CardFooterBar classes={classes} v={v} setLgShow={setLgShow} />
    </div>
    {lgShow && (
      <BenifitModal v={v} lgShow={lgShow} onHide={() => setLgShow(false)} description={description} />
    )}
  </>
}

export default Card;
