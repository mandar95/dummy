import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { NumberInd } from '../../../utils';
import { ToolTipDiv } from '../../dashboard/sub-components/helper';
import { CustomNames } from '../flex-config/BenefitModal';
import AddOnModal from './AddOnModal';
import { BenefitText, FeatureDiv, GetSumInsuredType } from './flex.plan';
import { CalculatePR, CalculateSI } from './FlexSummaryModal';

const extractChildFeatureID = (tempData, ben_name, oldBenefits = [], features = [], item) => {
  let id = false;
  (tempData?.flex_details || []).forEach(({ benefits_features = [] }) =>
    benefits_features.forEach(({ benefit_feature_name, benefit_feature_id }) => {
      if (benefit_feature_name === ben_name && benefit_feature_id) {
        id = benefit_feature_id
      }
    }));
  (tempData?.flex_details?.every(({ plan_id }) => +item.id !== +plan_id)) && (oldBenefits || []).forEach(({ benefit, name }) => {
    if (ben_name === benefit) {
      const selectedFeature = features.find(({ feature_name }) => feature_name === name)
      if (selectedFeature)
        id = selectedFeature?.id
    }
  });

  return id
}

export const ExtractPremium = ({ no_of_parents, no_of_parent_in_laws, premium, suminsured, pro_rate_percentage_calculation = 100 }, benefit_feature_details) => {
  let benefit_feature_premium = 0;
  if (benefit_feature_details?.has_capping_data) {
    const ParentPrem = CalculatePR(
      benefit_feature_details, premium, suminsured,
      { no_of_parents: no_of_parents, no_of_parent_in_laws: no_of_parent_in_laws }, pro_rate_percentage_calculation) || 0

    benefit_feature_premium = ParentPrem;
  } else {
    benefit_feature_premium = 0;
  }
  return benefit_feature_premium

}

export function AddOnFlexPlan({ item, ben_name, globalTheme,
  register, setValue, parent_enhancement, allRelations = {},
  checkById,
  tempData, selectedBenefit, oldBenefits, isSinglePlan, setPremiumUpdated }) {

  const findBenefit = item.plan_benefits.find(({ benefit_name }) => benefit_name === ben_name);


  const [addOnModal, setAddOnModal] = useState(false);
  const [selectedId, setSelectedId] = useState(extractChildFeatureID(tempData, ben_name, oldBenefits, findBenefit?.benefit_feature_details, item) || findBenefit?.benefit_feature_details[0]?.id);

  useEffect(() => {
    if (selectedId) {
      setValue(`flex[${item.id}][${ben_name}]`, selectedId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  useEffect(() => {
    if (item.suminsured && selectedId && findBenefit?.benefit_feature_details.some(({ id, min_enchance_si_limit }) =>
      +id === +selectedId && item.suminsured < min_enchance_si_limit
    )) {
      setSelectedId(findBenefit?.benefit_feature_details[0]?.id)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.suminsured])


  const selectedFeature = findBenefit?.benefit_feature_details.find(({ id }) => Number(selectedId) === id) ||
    findBenefit?.benefit_feature_details[0];


  const currentPremium = (parent_enhancement && (allRelations.no_of_parents || allRelations.no_of_parent_in_laws)) ?
    ExtractPremium({ no_of_parents: allRelations.no_of_parents, no_of_parent_in_laws: allRelations.no_of_parent_in_laws, suminsured: item.suminsured, premium: item.employee_premium, pro_rate_percentage_calculation: item.pro_rate_percentage_calculation }, selectedFeature)
    : CalculatePR(selectedFeature, Number(item.premium || 0), item.suminsured, undefined, item.pro_rate_percentage_calculation)

  useEffect(() => {
    if (isSinglePlan && currentPremium)
      setPremiumUpdated(prev => prev ? prev + 1 : prev)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSinglePlan, currentPremium, selectedBenefit?.[checkById || ben_name]])

  const SIText = CalculateSI({ ...selectedFeature, cover_type: 2 }, item.suminsured);
  const BenefitComp = BenefitText({ ...selectedFeature, SIText }, currentPremium, undefined, ben_name, item.suminsured);

  const SI = CalculateSI(selectedFeature, item.suminsured);

  return <FeatureDiv className="my-auto" >
    <Row className="d-flex align-items-center" style={{
      flexDirection: 'column',
      fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
      fontWeight: '500',
      color: '#6e6e6e',
      letterSpacing: '0.8px'
    }}>
      <input type='hidden' value={selectedId} ref={register} name={`flex[${item.id}][${ben_name}]`} />

      {(((findBenefit?.benefit_description !== '-' && !!findBenefit?.benefit_description) || selectedFeature) &&
        (item.suminsured >= (findBenefit.min_enchance_si_limit || 0)) && ((parent_enhancement ? (allRelations.no_of_parents || allRelations.no_of_parent_in_laws) : true))) ?
        (selectedBenefit?.[checkById || ben_name] && (checkById ? selectedBenefit?.[checkById] === ben_name : true) ? <ToolTipDiv onClick={() => setAddOnModal({ detail: item, ben_name: ben_name, benefit_feature_details: findBenefit?.benefit_feature_details })} className="w-100" >
          <OverlayTrigger
            key={'home-india1'}
            placement={"top"}
            overlay={<Tooltip id={'tooltip-home-india'}>
              <strong>
                {selectedFeature.feature_description ? selectedFeature.feature_description : 'Covered'}
                <hr className="my-1" style={{ borderColor: '#fff' }} />
                {BenefitComp}
              </strong>
            </Tooltip>}>
            <div className="_src_styles_module__cardPrice" style={{ background: globalTheme?.Tab?.color + '12', width: '100%' }}>
              {!!selectedFeature && <div className="d-flex justify-content-center align-items-baseline border rounded" style={{ color: globalTheme?.Tab?.color }}>
                <div className="_src_styles_module__bold">
                  <small style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>
                    {selectedFeature.feature_name}
                  </small>
                </div>
              </div>}
              <div className="d-flex p-2 justify-content-between align-items-baseline" style={{ /* borderTop: '1px dashed ' + globalTheme?.Tab?.color, */ color: '#212529', background: /* globalTheme?.Tab?.color +  */`#ffffff00 url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==") no-repeat right 9px bottom 23px` }}>
                {!!(SI) && <>
                  <div className="_src_styles_module__bold text-nowrap" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                    <small style={{ fontWeight: '500' }}>{CustomNames.includes(ben_name?.toLowerCase()) ? ben_name : 'Sum Insured'}</small>
                    {GetSumInsuredType[parent_enhancement && (allRelations.no_of_parents || allRelations.no_of_parent_in_laws) ? 1 : selectedFeature.cover_type] && <small><br /> <div className='d-flex justify-content-end mb-2'><sub> ({GetSumInsuredType[parent_enhancement && (allRelations.no_of_parents || allRelations.no_of_parent_in_laws) ? 1 : selectedFeature.cover_type]})</sub></div></small>}
                  </div>
                  <div><small className="_src_styles_module__bold mr-3">
                    ₹{NumberInd(SI)} <br></br>
                  </small>
                  </div>
                </>
                }
                {!SI && !!selectedFeature.cover && <>
                  <div className="_src_styles_module__bold text-nowrap" style={{ fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px' }}>
                    <small style={{ fontWeight: '500' }}>{CustomNames.includes(ben_name?.toLowerCase()) ? ben_name : 'Sum Insured'}</small>
                    {GetSumInsuredType[selectedFeature.cover_type] && <small><br /> <div className='d-flex justify-content-end mb-2'><sub> ({GetSumInsuredType[selectedFeature.cover_type]})</sub></div></small>}
                  </div>
                  <div><small className="_src_styles_module__bold mr-3">
                    ₹{NumberInd(SIText)} <br></br>
                  </small>
                  </div>
                </>
                }
              </div>
              {!!Number(currentPremium) && <div className="d-flex p-2 justify-content-between align-items-baseline" style={{ color: globalTheme?.Tab?.color, borderTop: (SI || selectedFeature.cover) ? '1px dashed ' + globalTheme?.Tab?.color : 0 }}>
                <div className="_src_styles_module__bold"><small style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: '500' }}>{+currentPremium < 0 ? 'Amount' : 'Premium'}</small>
                  {+currentPremium < 0 && <><br /> <div className='d-flex justify-content-end mb-2'><sub> (Credit)</sub></div></>}
                </div>
                <div className="_src_styles_module__bold"><small className="_src_styles_module__bold">
                  ₹ {NumberInd(Math.abs(currentPremium))}</small>
                  <br /> <div className='d-flex justify-content-end mb-2'><sub> (Incl GST)</sub></div>
                </div>
              </div>}
            </div>
          </OverlayTrigger>
        </ToolTipDiv> : <span>Available</span>) : <span>Not Covered</span>}
      <AddOnModal
        item={item}
        globalTheme={globalTheme}
        show={addOnModal}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        onHide={() => setAddOnModal(false)}
        parent_enhancement={parent_enhancement}
        allRelations={allRelations} />
    </Row>
  </FeatureDiv>

}
