import React, { useRef, useState }/* , { useEffect, useState } */ from 'react';
import { OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FeatureDiv } from './flex.plan';
import { NumberInd } from '../../../utils';
import { Relation_Name } from './FamilyMemberModal';
import { ToolTipDiv } from '../../dashboard/sub-components/helper';
// import { getSiPr } from './employee-flex.action';
// import BaseOptionModal from './BaseOptionModal';
import SummaryToolTippOver from './SummaryToolTip';
import { ModuleControl } from '../../../config/module-control';

export function TopupFlexPlan({
  item, globalTheme, shouldShowPlan,
  setShow, policyRelations
  // optionState,
  // dispatch, allRelations, reducerdetails
}) {

  // const [addOnModal, setAddOnModal] = useState(false);
  // const [selectedId, setSelectedId] = useState();

  // useEffect(() => {
  //   if (optionState.sum_insured && selectedId && Number(selectedId) !== Number(optionState.sum_insured)) {
  //     setSelectedId()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [optionState])

  // useEffect(() => {
  //   if (selectedId) {
  //     getSiPr(dispatch, [item].map(({ policy_id, suminsured, flex_suminsured, id }) => {
  //       let sum_insured = selectedId || optionState.sum_insured || suminsured
  //       if (flex_suminsured.every((elem) => Number(elem.sum_insured) !== Number(sum_insured))) {
  //         sum_insured = flex_suminsured[0]?.sum_insured
  //       }

  //       return ({
  //         plan_id: id,
  //         policy_id: policy_id,
  //         sum_insured: sum_insured,
  //         relation_ids: allRelations.map(({ id }) => id)
  //       })
  //     }), reducerdetails)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedId])
  const ref = useRef();
  const [popoverShow, setPopover] = useState(false);
  const handleHover = (trigger) => {
    setPopover(trigger);
  };

  return (

    <FeatureDiv className='my-auto'
      ref={ref}
      onMouseOver={handleHover.bind(null, true)}
      onMouseOut={handleHover.bind(null, false)}
    >
      <Row className="d-flex align-items-center" style={{
        flexDirection: 'column',
        fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
        // fontWeight: '500',
        color: '#6e6e6e',
        letterSpacing: '0.8px'
      }}>
        {(shouldShowPlan) ?
          <div className="_src_styles_module__cardPrice"
            style={{ background: globalTheme?.Tab?.color + '12', width: '100%', ...!!item?.flex_suminsured?.length && { cursor: 'pointer' } }}
            // onClick={() => !!item?.flex_suminsured?.length && setAddOnModal(true)}
            onClick={() => !!item?.flex_suminsured?.length && setShow(true)}
          >
            {!(item.employee_premium && item.suminsured) ? <>
              <div
                className="d-flex p-2 justify-content-between align-items-baseline" style={{
                  borderTop: '1px dashed ' + globalTheme?.Tab?.color,
                  color: '#212529',
                  ...!!item?.flex_suminsured?.length && { background: 'transparent url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==") no-repeat right 9px bottom 15px' }
                }}>
                <div className="_src_styles_module__bold" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                  <small style={{ fontWeight: '500' }}>Select Sum Insured</small>
                </div>
                {/* <div>
                  <small className="_src_styles_module__bold mr-3">
                    ₹{NumberInd(item.suminsured)}
                    <br></br>
                  </small>
                </div> */}
              </div>
            </> : <>
              <div className='d-flex pt-2 pb-0 px-2 justify-content-between align-items-baseline border rounded'>
                <p className="_src_styles_module__graytext text-left mb-0 text-dark">Family Construct</p>
                <div className="d-flex justify-content-end">
                  <div className='text-right'><small style={{ fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem' }} className="_src_styles_module__bold text-dark">{!!policyRelations?.length && `${Relation_Name[policyRelations[0]?.relation_id]}${Relation_Name[policyRelations[1]?.relation_id] ? ', ' + Relation_Name[policyRelations[1]?.relation_id] : ''}${Relation_Name[policyRelations[2]?.relation_id] ? ', ' + Relation_Name[policyRelations[2]?.relation_id] : ''}`}
                    {policyRelations?.length > 3 && '...'}
                    {policyRelations?.length > 3 && <ToolTipDiv>
                      <OverlayTrigger
                        key={'home-india1'}
                        placement={"top"}
                        overlay={<Tooltip id={'tooltip-home-india'}>
                          <strong>
                            {policyRelations?.reduce((total, { relation_id }) => (total ? total + ', ' : '') + Relation_Name[relation_id], '')}
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
                  </small></div>
                </div>
              </div>

              <div
                className="d-flex p-2 justify-content-between align-items-baseline" style={{
                  color: '#212529',
                  // borderTop: '1px dashed ' + globalTheme?.Tab?.color,
                  ...!!item?.flex_suminsured?.length && { background: 'transparent url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==") no-repeat right 9px bottom 15px' }
                }}>
                <div className="_src_styles_module__bold" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                  <small style={{ fontWeight: '500' }}>Sum Insured</small>
                </div>
                <div>
                  <small className="_src_styles_module__bold mr-3">
                    ₹{NumberInd(item.suminsured || 0)}
                    <br></br>
                  </small>
                </div>
              </div>
              <div className="d-flex p-2 justify-content-between align-items-baseline" style={{
                color: globalTheme?.Tab?.color,
                borderTop: '1px dashed ' + globalTheme?.Tab?.color,
              }}>
                <div className="_src_styles_module__bold"><small style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>Premium</small>
                </div>
                <div className="_src_styles_module__bold"><small className="_src_styles_module__bold">₹ {NumberInd(item.employee_premium || 0)}</small>
                  <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
                </div>
              </div></>}
          </div> : <span>Not Covered</span>
        }
      </Row>
      {/* <BaseOptionModal
        globalTheme={globalTheme}
        show={addOnModal}
        detail={item}
        is_topup
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onHide={() => setAddOnModal(false)} /> */}
      {ModuleControl.FlexSummaryTooltip && <SummaryToolTippOver ref={ref} showpopover={popoverShow} data={item} />}
    </FeatureDiv>
  )
}
