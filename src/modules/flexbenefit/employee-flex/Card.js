import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { NumberInd } from "../../../utils";
import { ToolTipDiv } from "../../dashboard/sub-components/helper";
import { CoverType } from "../../policies/steps/additional-details/additional-cover";
import classes from "./card.module.css";
import { Relation_Name } from "./FamilyMemberModal";
function Card({ detail, mt = 0, globalTheme, topup = {}, parent = {} }) {

  const RelationMapToPolicy = detail?.relations;

  const RelationMapToPolicyTopup = topup?.relations;

  const hasTopup = !!Number(topup.policy_suminsured);

  return (
    <div className={`mx-0 mx-xl-4 mt-${mt}`}>
      <div className={`${classes.card}`}>
        <div>
          <span
            style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", backgroundColor: globalTheme?.Tab?.color, whiteSpace: 'normal', lineHeight: '1.2' }}
            className={`badge badge-pill py-2 px-4 text-light`}
          >
            {detail.plan_name}
          </span>
        </div>
        <small className={classes.cardHeading}>
          {detail.policy_name}
        </small>
        <div className="mt-2">
          {/* <p
            style={{ letterSpacing: "0.5px" }}
            className={classes.cardParagraph}
          >
            Group Mediclaim cover hospitalisation expenses of an Employees and
            their families for medical emergencies{" "}
            <span className="text-danger">read more</span>
          </p> */}
          {!!RelationMapToPolicy?.length && <div
            style={{ marginTop: "-10px" }}
            className={`mb-1 ${classes.grayBack}`}
          >
            <div className="mx-2">
              <small className={`text-secondary ${classes.bold}`}>
                Member Covered
              </small>
            </div>
            <div className="border-top border-light mx-2">
              <small style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', fontWeight: "600" }}>
                {!!RelationMapToPolicy?.length && `${Relation_Name[RelationMapToPolicy[0]?.relation_id]}${Relation_Name[RelationMapToPolicy[1]?.relation_id] ? ', ' + Relation_Name[RelationMapToPolicy[1]?.relation_id] : ''}${Relation_Name[RelationMapToPolicy[2]?.relation_id] ? ', ' + Relation_Name[RelationMapToPolicy[2]?.relation_id] : ''}`}
                {detail.member_feature?.cover > 0 && detail.member_feature.relation_ids.reduce((all, id) => !all ? (', ' + Relation_Name[id]) : (all + ', ' + Relation_Name[id]), '')}
                {RelationMapToPolicy?.length > 3 && '...'}
                {RelationMapToPolicy?.length > 3 && <ToolTipDiv>
                  <OverlayTrigger
                    key={'home-india1'}
                    placement={"top"}
                    overlay={<Tooltip id={'tooltip-home-india'}>
                      <strong>
                        {RelationMapToPolicy?.reduce((total, { relation_id }) => (total ? total + ', ' : '') + Relation_Name[relation_id], '')}
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
          </div>}
        </div>
        <div className={classes.cardPrice} style={{ color: globalTheme?.Tab?.color, background: globalTheme?.Tab?.color + '12' }}>
          {!!Number(detail.employee_premium) && <div className="d-flex p-2 justify-content-between align-items-baseline">
            <div>
              <small
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}
                className={`${classes.bold}`}
              >
                {detail.employee_premium < 0 ? 'Amount' : 'Premium'}
              </small>
              <br /> {detail.employee_premium < 0 && <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div>}
            </div>
            <div>
              <small
                style={{ fontSize: globalTheme.fontSize ? `calc(${hasTopup ? '16px' : (hasTopup ? '16px' : '18px')} + ${globalTheme.fontSize - 92}%)` : '18px' }}
                className={`${classes.bold}`}
              >
                ₹ {NumberInd(Math.abs(detail.employee_premium))}
              </small>
              <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
            </div>
          </div>}
          {!!Number(detail.policy_suminsured) && <div
            className={`d-flex p-2 justify-content-between align-items-baseline ${classes.borderTopDashed}`}
          >
            <div>
              <small style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }} className={`${classes.bold}`}>
                Sum Insured
              </small>
            </div>
            <div>
              <small style={{ fontSize: globalTheme.fontSize ? `calc(${hasTopup ? '16px' : (hasTopup ? '16px' : '18px')} + ${globalTheme.fontSize - 92}%)` : '18px' }} className={classes.bold}>
                ₹{NumberInd(detail.policy_suminsured)}
              </small>
            </div>
          </div>}
        </div>
        {!!detail.member_feature && detail.member_feature?.description && <div className={`my-1 p-2 ${classes.grayBack}`}>
          {detail.member_feature?.description}
          <div style={{ color: globalTheme?.Tab?.color }}>
            {detail.member_feature.cover > 0 && <><small className="_src_styles_module__bold">{CoverType.find(({ id }) => +detail.member_feature.cover_type === id)?.name || ''} Sum Insured of {NumberInd(detail.member_feature.cover)}</small><br /></>}
            Flex {detail.member_feature?.premium_type === 1 ? 'Credit' : 'Debit'} of {NumberInd(detail.member_feature?.premium)}
            <sub> (Incl GST)</sub>
          </div>
        </div>}

        {hasTopup && <><div>
          <span
            style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', letterSpacing: "1px", backgroundColor: globalTheme?.Tab?.color, }}
            className={`badge badge-pill py-2 px-4 text-light mt-3`}
          >
            {topup.plan_name}
          </span>
        </div>
          <small className={classes.cardHeading}>
            {topup.policy_name}
          </small>
          <div className="mt-2">
            {/* <p
            style={{ letterSpacing: "0.5px" }}
            className={classes.cardParagraph}
          >
            Group Mediclaim cover hospitalisation expenses of an Employees and
            their families for medical emergencies{" "}
            <span className="text-danger">read more</span>
          </p> */}
            {!!RelationMapToPolicyTopup?.length && <div
              style={{ marginTop: "-10px" }}
              className={`mb-1 ${classes.grayBack}`}
            >
              <div className="mx-2">
                <small className={`text-secondary ${classes.bold}`}>
                  Member Covered
                </small>
              </div>
              <div className="border-top border-light mx-2">
                <small style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', fontWeight: "600" }}>
                  {!!RelationMapToPolicyTopup?.length && `${Relation_Name[RelationMapToPolicyTopup[0]?.relation_id]}${Relation_Name[RelationMapToPolicyTopup[1]?.relation_id] ? ', ' + Relation_Name[RelationMapToPolicyTopup[1]?.relation_id] : ''}${Relation_Name[RelationMapToPolicyTopup[2]?.relation_id] ? ', ' + Relation_Name[RelationMapToPolicyTopup[2]?.relation_id] : ''}`}
                  {RelationMapToPolicyTopup?.length > 3 && '...'}
                  {RelationMapToPolicyTopup?.length > 3 && <ToolTipDiv>
                    <OverlayTrigger
                      key={'home-india1'}
                      placement={"top"}
                      overlay={<Tooltip id={'tooltip-home-india'}>
                        <strong>
                          {RelationMapToPolicyTopup?.reduce((total, { relation_id }) => (total ? total + ', ' : '') + Relation_Name[relation_id], '')}
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
            </div>}
          </div>
          <div className={classes.cardPrice} style={{ color: globalTheme?.Tab?.color, background: globalTheme?.Tab?.color + '12' }}>
            {!!Number(topup.employee_premium) && <div className="d-flex p-2 justify-content-between align-items-baseline">
              <div>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}
                  className={`${classes.bold}`}
                >
                  {topup.employee_premium < 0 ? 'Amount' : 'Premium'}
                </small>
                <br /> {topup.employee_premium < 0 && <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div>}
              </div>
              <div>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(${hasTopup ? '16px' : (hasTopup ? '16px' : '18px')} + ${globalTheme.fontSize - 92}%)` : '18px' }}
                  className={`${classes.bold}`}
                >
                  ₹ {NumberInd(Math.abs(topup.employee_premium))}
                </small>
                <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
              </div>
            </div>}
            {hasTopup && <div
              className={`d-flex p-2 justify-content-between align-items-baseline ${classes.borderTopDashed}`}
            >
              <div>
                <small style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }} className={`${classes.bold}`}>
                  Sum Insured
                </small>
              </div>
              <div>
                <small style={{ fontSize: globalTheme.fontSize ? `calc(${hasTopup ? '16px' : (hasTopup ? '16px' : '18px')} + ${globalTheme.fontSize - 92}%)` : '18px' }} className={classes.bold}>
                  ₹{NumberInd(topup.policy_suminsured)}
                </small>
              </div>
            </div>}
          </div>
          {!!topup.member_feature && <div className={`my-1 p-2 ${classes.grayBack}`}>
            {topup.member_feature?.description}
            <div style={{ color: globalTheme?.Tab?.color }}>
              Flex {topup.member_feature?.premium_type === 1 ? 'Credit' : 'Debit'} of {NumberInd(topup.member_feature?.premium)}
              <sub> (Incl GST)</sub>
            </div>
          </div>}

          <hr />

          <div className={classes.cardPrice} style={{ color: globalTheme?.Tab?.color, background: globalTheme?.Tab?.color + '12', marginTop: '1rem' }}>
            {!!Number((+topup.employee_premium + +detail.employee_premium)) && <div className="d-flex p-2 justify-content-between align-items-baseline">
              <div>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}
                  className={`${classes.bold}`}
                >
                  Total {(+topup.employee_premium + +detail.employee_premium) < 0 ? 'Amount' : 'Premium'}
                </small>
                <br /> {(+topup.employee_premium + +detail.employee_premium) < 0 && <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div>}
              </div>
              <div>
                <small
                  style={{ fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px' }}
                  className={`${classes.bold}`}
                >
                  ₹ {NumberInd(Math.abs((+topup.employee_premium + +detail.employee_premium)))}
                </small>
                <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
              </div>
            </div>}
            {!!Number((+topup.policy_suminsured + +detail.policy_suminsured)) && <div
              className={`d-flex p-2 justify-content-between align-items-baseline ${classes.borderTopDashed}`}
            >
              <div>
                <small style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }} className={`${classes.bold}`}>
                  Total Sum Insured
                </small>
                {/* <br /><div className='d-flex justify-content-end mb-2'><sub> (Mediclaim)</sub></div> */}
              </div>
              <div>
                <small style={{ fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px' }} className={classes.bold}>
                  ₹{NumberInd((+topup.policy_suminsured + +detail.policy_suminsured))}
                </small>
              </div>
            </div>}
          </div>
        </>}
      </div>

    </div>
  );
}
export default Card;
