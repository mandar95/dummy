import React from "react";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import classesone from "./FamilyMemberModal.module.css";

import { OptionInput } from "modules/flexbenefit/style.js";
import { GetPremiumType, GetSumInsuredType } from "./flex.plan";
import { NumberInd } from "../../../utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CustomNames } from "../flex-config/BenefitModal";
import { ExtractPremium } from "./addon.flex.plan";
import { CalculatePR, CalculateSI } from "./FlexSummaryModal";

const AddOnModal = ({ show = {}, onHide, globalTheme, selectedId, setSelectedId, item,
  parent_enhancement, allRelations }) => {

  const { benefit_feature_details = [], detail = {}, ben_name } = show;

  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      centered
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex">
      <Modal.Body>
        <div
          className={`px-3 d-flex justify-content-between ${classesone.borderDashed}`}>
          <div>
            <p className="h5">Select Benefit</p>
          </div>
          <div onClick={onHide} style={{ color: globalTheme?.Tab?.color }} className={classesone.redColor}>
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div
          className={`px-3 py-4 d-flex justify-content-between ${classesone.borderDashed} d-flex flex-column`}>
          {benefit_feature_details.map((elem, childIndex) => {
            if (item.suminsured < (elem.min_enchance_si_limit || 0)) {
              return false
            }


            const currentPremium = (parent_enhancement && (allRelations.no_of_parents || allRelations.no_of_parent_in_laws)) ?
              ExtractPremium({ no_of_parents: allRelations.no_of_parents, no_of_parent_in_laws: allRelations.no_of_parent_in_laws, suminsured: item.suminsured, premium: item.employee_premium, pro_rate_percentage_calculation: item.pro_rate_percentage_calculation }, elem)
              : CalculatePR(elem, Number(item.premium || 0), item.suminsured, undefined, item.pro_rate_percentage_calculation);

            const SI = CalculateSI(elem, item.suminsured);
            const SIText = CalculateSI({ ...elem, cover_type: 2 }, item.suminsured);

            return <OptionInput label_name_width={'100%'} width='auto' small key={"child-feature1" + childIndex} className="d-flex">
              <><input
                name={`flex[${detail.id}][${ben_name}]`}
                type={"radio"}
                value={String(elem?.id)}
                checked={String(selectedId) === String(elem?.id)}
                onClick={() => setSelectedId(String(elem?.id))} />
                <span style={{ top: '2px' }}></span>
              </>
              <div className='label_name'>
                {elem.feature_name}
                {!!elem.feature_description && <OverlayTrigger
                  key={"home-india"}
                  placement={"top"}
                  overlay={<Tooltip id={"tooltip-home-india"} style={{ whiteSpace: 'pre-line' }}>{elem.feature_description}</Tooltip>}>
                  <svg
                    className="icon icon-info cursor-help"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35 35"
                    fill="#8D9194">
                    <path d="M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z"></path>
                    <path d="M20 24h-8v-2h2v-6h-2v-2h6v8h2z"></path>
                    <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z"></path>
                  </svg>
                </OverlayTrigger>}
                {!!(SI || SIText || currentPremium) && ':'}{' '}
                {!!SI && (`${GetSumInsuredType[elem.cover_type]} ${CustomNames.includes(ben_name?.toLowerCase()) ? ben_name : 'Sum Insured'} ₹${NumberInd(SI) || 0}`)}
                {!!SI && !!currentPremium && ` : `}
                {!SI && !!SIText && (`${GetSumInsuredType[elem.cover_type]} ${CustomNames.includes(ben_name?.toLowerCase()) ? ben_name : 'Sum Insured'} ₹${NumberInd(SIText) || 0}`)}
                {!SI && !!currentPremium && !!SIText && ` : `}
                {!!currentPremium && `${GetPremiumType[elem.premium_type]} Annual ${currentPremium < 0 ? 'Amount (Credit)' : 'Premium'} ₹${NumberInd(Math.abs(currentPremium)) || 0}`}{!!currentPremium && <sub> (Incl GST)</sub>}
              </div>
            </OptionInput>
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddOnModal;
