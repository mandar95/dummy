import React from "react";
import { FeatureButton } from "../helper";
import { downloadFile } from "utils";
const CardFooterBar = ({classes, setLgShow, v}) => {
    return ( 
        <div className="row border-top m-0 p-0 pr-3">
            <div className="col p-0 mt-2 ml-2 mb-2 d-flex justify-content-between">
              <FeatureButton
                className={`${classes.productfeaturebutton}`}
                onClick={() => setLgShow(true)}>
                Product Features
              </FeatureButton>
              {!!v.benifit_manual && <FeatureButton
                className={`${classes.productfeaturebutton}`}
                onClick={() => downloadFile(v.benifit_manual, null, true)}>
                Benefit Manual
              </FeatureButton>}
            </div>
          </div>
     );
}
 
export default CardFooterBar;