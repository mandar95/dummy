import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToolTipDiv } from "../helper";
import { NumberInd } from "utils";
const FamilyConstructBox = ({ isMobile, classes, v, }) => {
  return (
    <div className={`${isMobile ? `ml-1 ${classes.paddingDiv}` : `mx-1 py-2 w-100 my-2 my-sm-0`} ${classes.divBorder2} ${classes.grayBack}`}>
      {(v.premium) !== 0 ? (
        <>
          <div>
            <div className={`text-center`}>
              <small className={`${classes.bigFont}`}>Family Construct</small>
            </div>
            <div className={`text-center`}>
              {/* <small className={`${classes.fontBold}`}>{v.members?.reduce((total, member) => (total ? total + ', ' : '') + member, '')}</small> */}
              <small className={`${classes.fontBold}`}>{!!v.members?.length && `${v.members[0]}${v.members[1] ? ', ' + v.members[1] : ''}${v.members[2] ? ', ' + v.members[2] : ''}`}
                {v.members?.length > 3 && <ToolTipDiv>
                  <OverlayTrigger
                    key={'home-india1'}
                    placement={"top"}
                    overlay={<Tooltip id={'tooltip-home-india'}>
                      <strong>
                        {v.members?.reduce((total, member) => (total ? total + ', ' : '') + member, '')}
                      </strong>
                    </Tooltip>}>
                    <svg
                      onClick={(e) => { e.stopPropagation() }}
                      className="icon icon-info"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 35 35"
                      fill="#8D9194" >
                      <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                      <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                      <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                    </svg>
                  </OverlayTrigger>
                </ToolTipDiv>}
              </small>
            </div>
          </div>
          <div className="border-top w-100">
            <div className={`text-center`}>
              <small className={`${classes.bigFont}`}>{(v.premium) > 0 ? 'Premium To Pay' : 'Amount Credit'}</small>
            </div>
            <div className={`text-center`}>
              <small className={`${classes.fontBold}`}> ₹{" "}
                {NumberInd(Math.abs(v.premium))}</small>
            </div>
          </div>
        </>
      ) : (
        <div className={`${isMobile ? `${classes.paddingDiv2}` : "py-4"}`}>
          <div className={`text-center`}>
            <small className={`${classes.bigFont}`}>Family Construct</small>
          </div>
          <div className={`text-center`}>
            <small>
              <small className={`${classes.fontBold}`}>{!!v.members?.length && `${v.members[0]}${v.members[1] ? ', ' + v.members[1] : ''}${v.members[2] ? ', ' + v.members[2] : ''}`}
                {v.members?.length > 3 && <ToolTipDiv>
                  <OverlayTrigger
                    key={'home-india2'}
                    placement={"top"}
                    overlay={<Tooltip id={'tooltip-home-india'}>
                      <strong>
                        {v.members?.reduce((total, member) => (total ? total + ', ' : '') + member, '')}
                      </strong>
                    </Tooltip>}>
                    <svg
                      onClick={(e) => { e.stopPropagation() }}
                      className="icon icon-info"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 35 35"
                      fill="#8D9194" >
                      <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                      <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                      <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                    </svg>
                  </OverlayTrigger>
                </ToolTipDiv>}
              </small>
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyConstructBox;
