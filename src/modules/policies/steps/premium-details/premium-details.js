import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import * as yup from 'yup';
import swal from 'sweetalert';
import _ from 'lodash';
import { v4 as uuidv4 } from "uuid";

import { Row, Col, Button, Table, Form } from 'react-bootstrap';
import {
  Select, Checkbox, Input, Chip, TabWrapper,
  Tab, Error, Marker, Typography, Head,
} from 'components';
import ContributionAll from './contri-all';
import AdditionalPremium from './additional-premium';
import { AttachFile } from 'modules/core';
import { CustomAccordion } from 'components/accordion';
import { AnchorTag, Heading, AccordionWrapper, Div } from './styles';
import { BenefitList } from '../additional-details/styles';
import AccordionHeader from 'components/accordion/accordion-header';
import AccordionContent from 'components/accordion/accordion-content';
import { Img } from 'components/inputs/input/style';
import { Title as Text, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from '../../approve-policy/style';
import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { Controller, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { downloadSampleFile, loadIpdPolicies, validateTopup } from '../../policy-config.slice';
import { loadBaseWiseSiPrSheet } from '../../approve-policy/approve-policy.slice';
import { numOnly, noSpecial, numOnlyWithPoint, toWords } from '../../../../utils';
import { validateInstalment, validateInstalmentNote } from '../../helper';

const style = {
  minWidth: "110px",
};


const Wrapper = styled.div`
`;

const Title = styled.div`
  margin-bottom: 3rem;
  h4 {
    color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
    
    letter-spacing: 1px;
    z-index: 1;
    span {
      height: 15px;
      width: 15px;
      background-color: #f2c9fb;
      border-radius: 50%;
      display: inline-block;
      margin-bottom: 5px;
      margin-right: -9px;
      opacity: 0.7;
    }
  }
`;

const FormWrapper = styled.div`
`;

const doesExist = (arrayList = [], valueToCompare, type) => {
  switch (type) {
    case 'si': return arrayList.some((value) => value === valueToCompare);
    case 'pr': return arrayList.some(({ amount }) => amount === valueToCompare);
    // case 'slr':
    //   const keysExact = ['no_of_times_of_salary', 'max_si_limit', 'min_si_limit'];
    //   const valuesExact = [Number(valueToCompare.noOfSalary), Number(valueToCompare.maxSi), Number(valueToCompare.minSi)];
    //   // const j = arrayList.filter((item) =>
    //   //   keysExact.every((a) => valuesExact.includes(item[a])))
    //   return arrayList.filter((item) =>
    //     keysExact.every((a) => valuesExact.includes(item[a]))
    //   ).length ? true : false;
    case 'slr': return arrayList.some(({ no_of_times_of_salary }) => no_of_times_of_salary === Number(valueToCompare));
    default: return false
  }

}

const Permily$Relation = [5, 6, 7, 17]

const blankForm = (index) => ({
  bill_no: "",
  bill_date: "",
  bill_amt: "",
  comment: "",
  reimburment_type: "",
  id: index
});

const PremiumRater = {
  _opd: 'opd',
  _topup: 'topup',
  _enhance: 'enhance',
  _individual: 'in'
}

const GivePremiumRaterVariable = (type, opd_variable, topup_variable, enhance_variable, individual_variable) => {
  switch (type) {
    case '_opd': return opd_variable
    case '_topup': return topup_variable
    case '_enhance': return enhance_variable
    case '_individual': return individual_variable
    default: return opd_variable
  }
}

export const ContributionTypeRater = [13, 14, 15, 16, 19, 21];

const PremiumDetails = ({ configs, savedConfig = {}, formId, onSave, moveNext, filesName, broker_id }) => {

  const updateState1 = useCallback(() => {
    let result = [];
    const value = savedConfig.sum_insured?.length || savedConfig.premium?.length || 1;
    for (let i = -1; i < value - 1; i++) {
      result = [...result, blankForm(uuidv4())];
    }
    return result;
  }, [savedConfig]);

  const updateState2 = useCallback(() => {
    let result = [];
    const value = savedConfig.sum_insured_opd?.length || savedConfig.premium_opd?.length || 1;
    for (let i = -1; i < value - 1; i++) {
      result = [...result, blankForm(uuidv4())];
    }
    return result;
  }, [savedConfig]);

  const updateState3 = useCallback(() => {
    let result = [];
    const value = savedConfig.sum_insured_topup?.length || savedConfig.premium_topup?.length || 1;
    for (let i = -1; i < value - 1; i++) {
      result = [...result, blankForm(uuidv4())];
    }
    return result;
  }, [savedConfig]);

  const updateState4 = useCallback(() => {
    let result = [];
    const value = savedConfig.sum_insured_enhance?.length || savedConfig.premium_enhance?.length || 1;
    for (let i = -1; i < value - 1; i++) {
      result = [...result, blankForm(uuidv4())];
    }
    return result;
  }, [savedConfig]);

  const updateState5 = useCallback(() => {
    let result = [];
    const value = savedConfig.in_sum_insured?.length || savedConfig.in_premium_enhance?.length || 1;
    for (let i = -1; i < value - 1; i++) {
      result = [...result, blankForm(uuidv4())];
    }
    return result;
  }, [savedConfig]);

  const { globalTheme } = useSelector(state => state.theme)

  const [ipdFlat, setIpdFlat] = useState(updateState1());
  const [ipdFlatInd, setIpdFlatInd] = useState(updateState5());
  const [opdFlat, setOpdFlat] = useState(updateState2());
  const [topupFlat, setTopupFlat] = useState(updateState3());
  const [enhanceFlat, setEnhanceFlat] = useState(updateState4());

  const [installment_periods, setInstallment_periods] = useState(savedConfig?.installment_periods || []);
  const [salarySI, setSalary] = useState(savedConfig?.salary || []);
  const [salarySI_topup, setSalary_topup] = useState(savedConfig?.salary_topup || []);
  const [salarySI_enhance, setSalary_enhance] = useState(savedConfig?.salary_topup || []);
  const dispatch = useDispatch();

  // file states
  const [premiumFile, setPremiumFile] = useState(null);
  const [siFile, setSIFile] = useState(null);
  const [premiumFileInd, setPremiumFileInd] = useState(null);
  const [siFileInd, setSIFileInd] = useState(null);
  const [premiumFile_opd, setPremiumFile_opd] = useState(null);
  const [siFile_opd, setSIFile_opd] = useState(null);
  const [premiumFile_topup, setPremiumFile_topup] = useState(null);
  const [siFile_topup, setSIFile_topup] = useState(null);
  const [premiumFile_enhance, setPremiumFile_enhance] = useState(null);
  const [siFile_enhance, setSIFile_enhance] = useState(null);

  // dd
  const [premiumType, setPremiumType] = useState(null);
  const [siType, setSIType] = useState(null);
  const [premiumType_opd, setPremiumType_opd] = useState(null);
  const [siType_opd, setSIType_opd] = useState(null);
  const [premiumType_topup, setPremiumType_topup] = useState(null);
  const [siType_topup, setSIType_topup] = useState(null);
  const [premiumType_enhance, setPremiumType_enhance] = useState(null);
  const [siType_enhance, setSIType_enhance] = useState(null);

  const eligiblePolicy = [5, 6].includes(Number(savedConfig.policy_sub_type)) &&
    premiumType && siType === 1;
  const [top_up_cover_has_eligibility_state, set_top_up_cover_has_eligibility_state] = useState((eligiblePolicy && Number(savedConfig?.top_up_cover_has_eligibility)) || 0);


  const [tab, setTab] = useState(savedConfig?.additional_premium ? "additional" : "all" || "all");
  const [tab1, setTab1] = useState(savedConfig?.additional_premium_opd ? "additional" : "all" || "all");
  const [tab2, setTab2] = useState(savedConfig?.additional_premium_topup ? "additional" : "all" || "all");

  const [opd_ipd, setopd_ipd] = useState(savedConfig?.policy_rater_type_id || null);
  const BaseWiseSIPremium = siType === 8;
  const BaseWiseSIPremium_topup = siType_topup === 8;
  // const BaseWiseSIPremium_opd = siType_opd === 8;

  let isNoRule = (siType !== 16 && premiumType !== 18)

  const validationSchema = yup.object().shape({

    ...(Number(savedConfig.policy_sub_type) === 1 && { policy_rater_type_id: yup.number().required('OPD/IPD Type required').typeError('OPD/IPD Type required') }),
    // ...(opd_ipd === 2 && { base_ipd_policy_id: yup.number().required('Parent IPD required').typeError('Parent IPD required') }),
    si_type: yup.number().required('Sum Insured Type required').typeError('Sum Insured Type required'),
    si_sub_type: yup.number().required('Sum Insured Basis required').typeError('Sum Insured Basis required'),
    ...(!BaseWiseSIPremium && {
      premium_type: yup.number().required('Premium Basis required').typeError('Premium Basis required')
    }),
    ...((!(ContributionTypeRater.includes(premiumType)) && tab === 'all' && isNoRule) && {
      employer_contribution: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employer Contribution'),
      employee_contribution: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employee Contribution'),
    }),
    ...(savedConfig?.has_special_child && {
      special_child_additional_premium: yup.number().positive().required('Required'),
      special_child_employer_premium: yup.number().min(0).max(100).required('Required'),
      special_child_employee_premium: yup.number().min(0).max(100).required('Required')
    }),
    ...(savedConfig?.has_unmarried_child && {
      unmarried_child_premium: yup.number().positive().required('Required'),
      unmarried_child_employer_premium: yup.number().min(0).max(100).required('Required'),
      unmarried_child_employee_premium: yup.number().min(0).max(100).required('Required')
    }),
    ...(!(ContributionTypeRater.includes(premiumType)) &&
      (tab === 'additional' || savedConfig?.ages?.some(e => e?.is_special_member_allowed === true)) && {
      ages: yup.array().of(
        yup.object().shape({
          ...((tab === 'additional') && {
            additional_premium: yup.number().typeError('must be a number').positive().notRequired().nullable(),
            // employer_contribution: yup.number().min(0).max(100).required('Required'),
            // employee_contribution: yup.number().min(0).max(100).required('Required')
            employer_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required'),
            employee_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required')
          }),
          // ...(savedConfig?.ages?.some(e => e?.is_special_member_allowed === true) && {
          //   special_member_additional_premium: yup.number().positive()
          //     .test("required", "", function (value) {
          //       const findObject = savedConfig.ages?.find((elm) => elm?.relation_id === this.parent?.relation_id)
          //       if (findObject && findObject.is_special_member_allowed) {
          //         return !!value
          //       }
          //       return true
          //     }),
          //   special_member_employee_contribution: yup.number().min(0).max(100).test("required", "", function (value) {
          //     const findObject = savedConfig.ages?.find((elm) => elm?.relation_id === this.parent?.relation_id)
          //     if (findObject && findObject.is_special_member_allowed) {
          //       return !!value
          //     }
          //     return true
          //   }),
          //   special_member_employer_contribution: yup.number().min(0).max(100).test("required", "", function (value) {
          //     const findObject = savedConfig.ages?.find((elm) => elm?.relation_id === this.parent?.relation_id)
          //     if (findObject && findObject.is_special_member_allowed) {
          //       return !!value
          //     }
          //     return true
          //   })
          // }),
        })
      ),
    }),
    // ...((siType === 5 && Number(savedConfig.policy_sub_type) !== 6) && {
    //   no_of_times_of_salary: yup.number().min(0).required('Required'),
    //   max_si_limit: yup.number().min(0).required('Required'),
    //   min_si_limit: yup.number().min(0).required('Required')
    // }),
    ...(opd_ipd === 3 && {
      opd_suminsured_type: yup.number().required('Sum Insured Type required').typeError('Sum Insured Type required'),
      opd_suminsured_sub_type: yup.number().required('Sum Insured Basis required').typeError('Sum Insured Basis required'),
      opd_premium_type: yup.number().required('Premium Basis required').typeError('Premium Basis required'),
      ...((!(ContributionTypeRater.includes(premiumType_opd)) && tab1 === 'all') && {
        employer_contribution_opd: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employer Contribution'),
        employee_contribution_opd: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employee Contribution'),
      }),
      ...((!(ContributionTypeRater.includes(premiumType_opd)) && tab1 === 'additional') && {
        ages_opd: yup.array().of(
          yup.object().shape({
            additional_premium: yup.number().typeError('must be a number').positive().notRequired().nullable(),
            // employer_contribution: yup.number().min(0).max(100).required('Required'),
            // employee_contribution: yup.number().min(0).max(100).required('Required')
            employer_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required'),
            employee_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required')
          })
        ),
        // parent_contribution_type_opd: yup.number().required('Required')
      })
    }),
    ...(opd_ipd === 4 && {
      topup_suminsured_type: yup.number().required('Sum Insured Type required').typeError('Sum Insured Type required'),
      topup_suminsured_sub_type: yup.number().required('Sum Insured Basis required').typeError('Sum Insured Basis required'),
      ...(!BaseWiseSIPremium_topup && {
        topup_premium_type: yup.number().required('Premium Basis required').typeError('Premium Basis required'),
      }),
      ...((!(ContributionTypeRater.includes(premiumType_topup)) && tab2 === 'all') && {
        // employer_contribution_topup: yup.number().min(0).max(100).required('Required'),
        // employee_contribution_topup: yup.number().min(0).max(100).required('Required')
        employer_contribution_topup: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employer Contribution'),
        employee_contribution_topup: yup.number('must be a number').typeError('must be a number').min(0).max(100, "max limit is 100").required('Required').label('Employee Contribution'),

        // employer_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required'),
        // employee_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required')
      }),
      ...((!(ContributionTypeRater.includes(premiumType_topup)) && tab2 === 'additional') && {
        ages_topup: yup.array().of(
          yup.object().shape({
            additional_premium: yup.number().typeError('must be a number').positive().notRequired().nullable(),
            // employer_contribution: yup.number().min(0).max(100).required('Required'),
            // employee_contribution: yup.number().min(0).max(100).required('Required')
            employer_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required'),
            employee_contribution: yup.number().typeError('must be a number').min(0).max(100, "max limit is 100").required('Required')
          })
        ),
        // parent_contribution_type_opd: yup.number().required('Required')
      })
    }),
    ...(opd_ipd === 5 && {
      enhance_suminsured_type: yup.number().required('Sum Insured Type required').typeError('Sum Insured Type required'),
      enhance_suminsured_sub_type: yup.number().required('Sum Insured Basis required').typeError('Sum Insured Basis required'),
      enhance_premium_type: yup.number().required('Premium Basis required').typeError('Premium Basis required'),
    }),
    // ...(savedConfig.ages.some(e => e.is_special_member_allowed === true) && {
    //   ages: yup.array().of(
    //     yup.object().shape({
    //       special_member_additional_premium: yup.number().positive()
    //         .test("alphabets", "Name must contain only alphabets & .(dots)", requiredSpecial),
    //       special_member_employee_contribution: yup.number().min(0).max(100).required('Required'),
    //       special_member_employer_contribution: yup.number().min(0).max(100).required('Required')
    //     })
    //   ),
    // }),
    ...((siType === 1 || premiumType === 1) && {
      sum_insured: yup.array().of(yup.string().required('Required'))
    }),
    ...((premiumType === 1) && {
      premium: yup.array().of(yup.object().shape({
        amount: yup.string().required('Required'),
        tax: yup.string().required('Required'),
        total_premium: yup.string().required('Required')
      }))
    }),
    ...((siType_opd === 1 && opd_ipd === 3) && {
      sum_insured_opd: yup.array().of(yup.string().required('Required'))
    }),
    ...((premiumType_opd === 1 && opd_ipd === 3) && {
      premium_opd: yup.array().of(yup.object().shape({
        amount: yup.string().required('Required'),
        tax: yup.string().required('Required'),
        total_premium: yup.string().required('Required')
      }))
    }),
    ...((siType_topup === 1 && opd_ipd === 4) && {
      sum_insured_topup: yup.array().of(yup.string().required('Required'))
    }),
    ...((premiumType_topup === 1 && opd_ipd === 4) && {
      premium_topup: yup.array().of(yup.object().shape({
        amount: yup.string().required('Required'),
        tax: yup.string().required('Required'),
        total_premium: yup.string().required('Required')
      }))
    }),
    ...((siType_enhance === 1 && opd_ipd === 5) && {
      sum_insured_enhance: yup.array().of(yup.string().required('Required'))
    }),
    ...((premiumType_enhance === 1 && opd_ipd === 5) && {
      premium_enhance: yup.array().of(yup.object().shape({
        amount: yup.string().required('Required'),
        tax: yup.string().required('Required'),
        total_premium: yup.string().required('Required')
      }))
    }),
    ...top_up_cover_has_eligibility_state && {
      no_of_time_salary: yup.number('must be a number').typeError('must be a number').min(1).max(20, "max limit is 20").required('Required').label('No Of Time Salary Required'),
    },
    ...((siType === 5 || top_up_cover_has_eligibility_state) && {
      calculate_eligibility_from: yup.string().required('Salary Type Required')
    })
  });
  const { control, errors, handleSubmit, register, watch, setValue } = useForm({
    defaultValues: {
      ...savedConfig,
      employer_contribution: String(savedConfig?.employer_contribution),
      employee_contribution: String(savedConfig?.employee_contribution),
      ages: savedConfig?.ages?.map((elem = {}) => ({
        ...elem,
        employer_contribution: String(elem.employer_contribution),
        employee_contribution: String(elem.employee_contribution)
      })),
      employer_contribution_opd: String(savedConfig?.employer_contribution_opd),
      employee_contribution_opd: String(savedConfig?.employee_contribution_opd),
      ages_opd: savedConfig?.ages_opd?.map((elem = {}) => ({
        ...elem,
        employer_contribution: String(elem.employer_contribution),
        employee_contribution: String(elem.employee_contribution)
      })),
      employer_contribution_topup: String(savedConfig?.employer_contribution_topup),
      employee_contribution_topup: String(savedConfig?.employee_contribution_topup),
      ages_topup: savedConfig?.ages_topup?.map((elem = {}) => ({
        ...elem,
        employer_contribution: String(elem.employer_contribution),
        employee_contribution: String(elem.employee_contribution)
      })),
      ...(savedConfig?.has_special_child && {
        special_child_employer_premium: String(savedConfig?.special_child_employer_premium),
        special_child_employee_premium: String(savedConfig?.special_child_employee_premium)
      }),
      ...(savedConfig?.has_unmarried_child && {
        unmarried_child_employer_premium: String(savedConfig?.unmarried_child_employer_premium),
        unmarried_child_employee_premium: String(savedConfig?.unmarried_child_employee_premium)
      }),
      premium_tax_type: Number(savedConfig.premium_tax_type || 0),
      premium_tax: String(savedConfig.premium_tax || 0),
      premium_tax_type_opd: Number(savedConfig.premium_tax_type_opd || 0),
      premium_tax_opd: String(savedConfig.premium_tax_opd || 0),
      premium_tax_type_topup: Number(savedConfig.premium_tax_type_topup || 0),
      premium_tax_topup: String(savedConfig.premium_tax_topup || 0),
      premium_tax_type_enhance: Number(savedConfig.premium_tax_type_enhance || 0),
      premium_tax_enhance: String(savedConfig.premium_tax_enhance || 0),
      top_up_cover_has_eligibility: String(savedConfig.top_up_cover_has_eligibility || 0),
      eligibility_cover_type: String(savedConfig.eligibility_cover_type || 1),
    } || {},
    validationSchema
  });


  const si_type = Number(watch('si_type'));
  const isPayroll = watch('has_payroll');
  const allowedInstallment = watch('installment_allowed');
  const installmentPeriod = watch('installment_period');

  const installment_level = Number(watch('installment_level'));
  // ipd
  const randomipd = watch('randomipd');
  const randomin = watch('randomin');
  const randomopd = watch('randomopd');
  const randomtopup = watch('randomtopup');
  const randomenhance = watch('randomtopup');


  // ipd
  const maxSi = watch('max_si_limit')
  const minSi = watch('min_si_limit')
  const noOfSalary = watch('no_of_times_of_salary')

  // topup
  const maxSi_topup = watch('max_si_limit_topup')
  const minSi_topup = watch('min_si_limit_topup')
  const noOfSalary_topup = watch('no_of_times_of_salary_topup')

  // enhance
  const maxSi_enhance = watch('max_si_limit_enhance')
  const minSi_enhance = watch('min_si_limit_enhance')
  const noOfSalary_enhance = watch('no_of_times_of_salary_enhance')

  const topup_policy = savedConfig.topup_master_policy_ids?.length && Number(savedConfig.policy_type) === 2
  const { stepSaved, masterPolicy, ipdPolicies, employerInstallment } = useSelector(state => state.policyConfig);

  const premium_tax_type = Number(watch('premium_tax_type'));
  const premium_tax_type_opd = Number(watch('premium_tax_type_opd'));
  const premium_tax_type_topup = Number(watch('premium_tax_type_topup'));
  const premium_tax_type_enhance = Number(watch('premium_tax_type_enhance'));

  // Eligibilty
  const top_up_cover_has_eligibility = watch(
    "top_up_cover_has_eligibility"
  );

  useEffect(() => {
    if (siType === 16) {
      setValue('premium_type', 18)
      setPremiumType(18)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siType])
  useEffect(() => {
    if (premiumType === 18) {
      setValue('si_sub_type', 16)
      setSIType(16)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumType])

  useEffect(() => {
    set_top_up_cover_has_eligibility_state((eligiblePolicy && Number(top_up_cover_has_eligibility)) || 0)
  }, [top_up_cover_has_eligibility, eligiblePolicy])

  useEffect(() => {
    if (topup_policy && BaseWiseSIPremium && siType) {

      setValue('premium_type', '')
      setPremiumType('')
    }
    if (!topup_policy && BaseWiseSIPremium) {

      setValue('si_sub_type', '')
      setSIType('')
      setValue('premium_type', '')
      setPremiumType('')

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topup_policy, BaseWiseSIPremium])

  useEffect(() => {
    if (opd_ipd === 4 && BaseWiseSIPremium_topup && siType) {

      setValue('topup_premium_type', '')
      setPremiumType('')
    }
    if (!opd_ipd === 4 && BaseWiseSIPremium_topup) {

      setValue('topup_suminsured_sub_type', '')
      setSIType_topup('')
      setValue('topup_premium_type', '')
      setPremiumType_topup('')

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opd_ipd, BaseWiseSIPremium_topup])

  useEffect(() => {
    if (opd_ipd && (!savedConfig.si_sub_type || !savedConfig.premium_type) && !BaseWiseSIPremium && siType) {
      const master_policy = masterPolicy?.find(({ id }) => Number(savedConfig.topup_master_policy_id) === id)
      if (master_policy) {
        setValue('si_type', master_policy?.suminsurued_type_id)

        setValue('si_sub_type', master_policy?.suminsured_subtype_type_id)
        setSIType(master_policy?.suminsured_subtype_type_id)

        setValue('premium_type', master_policy?.premium_type_id)
        setPremiumType(master_policy?.premium_type_id)
      }

      // if (opd_ipd === 3) {
      //   setValue('opd_suminsured_type', master_policy?.suminsurued_type_id)

      //   setValue('opd_suminsured_sub_type', master_policy?.suminsured_subtype_type_id)
      //   setSIType_opd(master_policy?.suminsured_subtype_type_id)

      //   setValue('opd_premium_type', master_policy?.premium_type_id)
      //   setPremiumType_opd(master_policy?.premium_type_id)
      // }
      // if (opd_ipd === 4) {
      //   setValue('topup_suminsured_type', master_policy?.suminsurued_type_id)

      //   setValue('topup_suminsured_sub_type', master_policy?.suminsured_subtype_type_id)
      //   setSIType_topup(master_policy?.suminsured_subtype_type_id)

      //   setValue('topup_premium_type', master_policy?.premium_type_id)
      //   setPremiumType_topup(master_policy?.premium_type_id)
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topup_policy, savedConfig, opd_ipd])


  // useEffect(() => {
  //   if ((premiumType && premiumType === 1) && (siType &&!siType 5== 1)) {
  //     const minIpdFlat = Math.min(premiumAmounts.length, siAmounts.length);
  //     setSIAmounts(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minIpdFlat;
  //       return prevCopy;
  //     })
  //     setPremiumAmounts(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minIpdFlat;
  //       return prevCopy;
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [premiumType, siType])

  // useEffect(() => {
  //   if (premiumType_opd && premiumType_opd === 1 && siType_opd && siType_opd === 1 && opd_ipd === 3) {

  //     const minOpdFlat = Math.min(premiumAmounts_opd.length, siAmounts_opd.length);
  //     setSIAmounts_opd(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minOpdFlat;
  //       return prevCopy;
  //     })
  //     setPremiumAmounts_opd(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minOpdFlat;
  //       return prevCopy;
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [premiumType_opd, siType_opd, opd_ipd])

  // useEffect(() => {
  //   if (premiumType_topup && premiumType_topup === 1 && siType_topup && siType_topup === 1 && opd_ipd === 4) {

  //     const minTopupFlat = Math.min(premiumAmounts_topup.length, siAmounts_topup.length);
  //     setSIAmounts_topup(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minTopupFlat;
  //       return prevCopy;
  //     })
  //     setPremiumAmounts_topup(prev => {
  //       const prevCopy = [...prev];
  //       prevCopy.length = minTopupFlat;
  //       return prevCopy;
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [premiumType_topup, siType_topup, opd_ipd])

  useEffect(() => {
    // if () {
    dispatch(loadIpdPolicies({
      employer: savedConfig.employer?.value,
      policy_sub_type: savedConfig.policy_sub_type,
      ...(broker_id && { broker_id: broker_id })
    }));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Number(savedConfig.policy_sub_type) !== 1) {
      setopd_ipd(1)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig])

  useEffect(() => {
    if (tab === 'additional' && savedConfig.is_parent_policy)
      setValue('parent_contribution_type', savedConfig.parent_contribution_type || '1')
    else
      setValue('parent_contribution_type', '1')

    if (tab1 === 'additional')
      setValue('parent_contribution_type_opd', '1')
    if (tab2 === 'additional')
      setValue('parent_contribution_type_topup', '1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig, tab, tab1, tab2])


  useEffect(() => {
    if (savedConfig) {
      !siType && setSIType(prev => savedConfig && Number(savedConfig.si_sub_type));
      !premiumType && !BaseWiseSIPremium && setPremiumType(prev => savedConfig && Number(savedConfig.premium_type));
      !siType_opd && setSIType_opd(prev => savedConfig && Number(savedConfig.opd_suminsured_sub_type));
      !premiumType_opd && setPremiumType_opd(prev => savedConfig && Number(savedConfig.opd_premium_type));
      !siType_topup && !!BaseWiseSIPremium_topup && setSIType_topup(prev => savedConfig && Number(savedConfig.topup_suminsured_sub_type));
      !premiumType_topup && setPremiumType_topup(prev => savedConfig && Number(savedConfig.topup_premium_type));
      !siType_enhance && setSIType_enhance(prev => savedConfig && Number(savedConfig.enhance_suminsured_sub_type));
      !premiumType_enhance && setPremiumType_enhance(prev => savedConfig && Number(savedConfig.enhance_premium_type));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig]);

  // parents base policy
  useEffect(() => {
    if (savedConfig.is_parent_policy && Number(savedConfig.policy_sub_type) <= 3) {
      dispatch(validateTopup({
        employer: savedConfig.employer?.value,
        policy_sub_type: Number(savedConfig.policy_sub_type) + 3,
        ...(broker_id && { broker_id: broker_id })
      }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stepSaved && stepSaved === formId) {
      moveNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepSaved]);

  const addFormIpdFlat = () => {
    setIpdFlat(prev => {
      if (prev.length <= 15) {
        return [...prev, { ...blankForm(uuidv4()) }]
      }
      else {
        swal('Max Limit Reached')
        return prev
      }
    });
  };

  const removeIpdFlat = () => {
    let BillCopy = _.cloneDeep(ipdFlat);
    BillCopy.splice(ipdFlat.length - 1, 1);
    setIpdFlat(BillCopy);
  };

  const addFormIpdFlatInd = () => {
    setIpdFlatInd(prev => {
      if (prev.length <= 15) {
        return [...prev, { ...blankForm(uuidv4()) }]
      }
      else {
        swal('Max Limit Reached')
        return prev
      }
    });
  };

  const removeIpdFlatInd = () => {
    let BillCopy = _.cloneDeep(ipdFlatInd);
    BillCopy.splice(ipdFlatInd.length - 1, 1);
    setIpdFlatInd(BillCopy);
  };


  const addFormOpdFlat = () => {
    setOpdFlat(prev => {
      if (prev.length <= 15) {
        return [...prev, { ...blankForm(uuidv4()) }]
      }
      else {
        swal('Max Limit Reached')
        return prev
      }
    });
  };

  const removeOpdFlat = () => {
    let BillCopy = _.cloneDeep(opdFlat);
    BillCopy.splice(opdFlat.length - 1, 1);
    setOpdFlat(BillCopy);
  };


  const addFormTopupFlat = () => {
    setTopupFlat(prev => {
      if (prev.length <= 15) {
        return [...prev, { ...blankForm(uuidv4()) }]
      }
      else {
        swal('Max Limit Reached')
        return prev
      }
    });
  };

  const removeTopupFlat = () => {
    let BillCopy = _.cloneDeep(topupFlat);
    BillCopy.splice(topupFlat.length - 1, 1);
    setTopupFlat(BillCopy);
  };


  const addFormEnhanceFlat = () => {
    setEnhanceFlat(prev => {
      if (prev.length <= 15) {
        return [...prev, { ...blankForm(uuidv4()) }]
      }
      else {
        swal('Max Limit Reached')
        return prev
      }
    });
  };

  const removeEnhanceFlat = () => {
    let BillCopy = _.cloneDeep(enhanceFlat);
    BillCopy.splice(enhanceFlat.length - 1, 1);
    setEnhanceFlat(BillCopy);
  };


  const onAddInstallmemts = () => {
    if (Number(installmentPeriod) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if (installmentPeriod && Number(installmentPeriod)) {
      let flag = false;
      if (installment_periods.length)
        flag = doesExist(installment_periods, installmentPeriod, 'si')

      if (!flag) {
        setInstallment_periods(prev => [...prev, installmentPeriod]);
        setValue(
          'installment_period', ''
        );
      }
    }
  }

  const removeInstallmemts = installment_period => {
    const filteredInstallment_periods = installment_periods.filter(item => item !== installment_period);
    setInstallment_periods([...filteredInstallment_periods]);
  }

  const onAddSalary = () => {
    if (Number(noOfSalary)) {
      let flag = false;
      if (salarySI.length)
        flag = doesExist(salarySI, noOfSalary, 'slr')
      if (!flag) {
        setSalary(prev => [...prev, { no_of_times_of_salary: Number(noOfSalary), max_si_limit: Number(maxSi || 4294967295), min_si_limit: Number(minSi || 0) }]);
        setValue('max_si_limit', '');
        setValue('min_si_limit', '');
        setValue('no_of_times_of_salary', '');
        swal('No. of time salary added',
          `No of times of salary: ${noOfSalary} (${toWords.convert(noOfSalary)})
${!!minSi ? `Lowest SI Limit: ₹${minSi} (${toWords.convert(minSi)})` : ''}
${!!maxSi ? `Highest SI Limit: ₹${maxSi} (${toWords.convert(maxSi)})` : ''}`)
      } else {
        swal('Already Exist', 'Similar no of time salary already added')
      }
    }
    else {
      swal('Validation', 'No of times of salary Required')
    }
    //!doesExist(salary, { noOfSalary, maxSi, minSi }, 'slr'))
  }

  const onAddSalary_topup = () => {
    if (Number(noOfSalary_topup)) {
      let flag = false;
      if (salarySI_topup.length)
        flag = doesExist(salarySI_topup, noOfSalary_topup, 'slr')
      if (!flag) {
        setSalary_topup(prev => [...prev, { no_of_times_of_salary: Number(noOfSalary_topup), max_si_limit: Number(maxSi_topup || 4294967295), min_si_limit: Number(minSi_topup || 0) }]);
        setValue('max_si_limit_topup', '');
        setValue('min_si_limit_topup', '');
        setValue('no_of_times_of_salary_topup', '');
        swal('No. of time salary added',
          `No of times of salary: ${noOfSalary_topup} (${toWords.convert(noOfSalary_topup)})
${!!minSi_topup ? `Lowest SI Limit: ₹${minSi_topup} (${toWords.convert(minSi_topup)})` : ''}
${!!maxSi_topup ? `Highest SI Limit: ₹${maxSi_topup} (${toWords.convert(maxSi_topup)})` : ''}`)
      } else {
        swal('Already Exist', 'Similar no of time salary already added')
      }
    }
    else {
      swal('Validation', 'No of times of salary Required')
    }
    //!doesExist(salary, { noOfSalary, maxSi, minSi }, 'slr'))
  }

  const onAddSalary_enhance = () => {
    if (Number(noOfSalary_enhance)) {
      let flag = false;
      if (salarySI_enhance.length)
        flag = doesExist(salarySI_enhance, noOfSalary_enhance, 'slr')
      if (!flag) {
        setSalary_enhance(prev => [...prev, { no_of_times_of_salary: Number(noOfSalary_enhance), max_si_limit: Number(maxSi_enhance || 4294967295), min_si_limit: Number(minSi_enhance || 0) }]);
        setValue('max_si_limit_enhance', '');
        setValue('min_si_limit_enhance', '');
        setValue('no_of_times_of_salary_enhance', '');
        swal('No. of time salary added',
          `No of times of salary: ${noOfSalary_enhance} (${toWords.convert(noOfSalary_enhance)})
${!!minSi_enhance ? `Lowest SI Limit: ₹${minSi_enhance} (${toWords.convert(minSi_enhance)})` : ''}
${!!maxSi_enhance ? `Highest SI Limit: ₹${maxSi_enhance} (${toWords.convert(maxSi_enhance)})` : ''}`)
      } else {
        swal('Already Exist', 'Similar no of time salary already added')
      }
    }
    else {
      swal('Validation', 'No of times of salary Required')
    }
    //!doesExist(salary, { noOfSalary, maxSi, minSi }, 'slr'))
  }


  const AddSalary = () => {
    onAddSalary()
  }

  const removeSalary = obj => {
    const filteredObj = salarySI.filter(item => item.no_of_times_of_salary !== obj.no_of_times_of_salary);
    setSalary(prev => [...filteredObj]);
    setValue('max_si_limit', '');
    setValue('min_si_limit', '');
    setValue('no_of_times_of_salary', '');
  }

  const removeSalary_topup = obj => {
    const filteredObj = salarySI_topup.filter(item => item.no_of_times_of_salary !== obj.no_of_times_of_salary);
    setSalary_topup(prev => [...filteredObj]);
    setValue('max_si_limit_topup', '');
    setValue('min_si_limit_topup', '');
    setValue('no_of_times_of_salary_topup', '');
  }

  const removeSalary_enhance = obj => {
    const filteredObj = salarySI_enhance.filter(item => item.no_of_times_of_salary !== obj.no_of_times_of_salary);
    setSalary_enhance(prev => [...filteredObj]);
    setValue('max_si_limit_enhance', '');
    setValue('min_si_limit_enhance', '');
    setValue('no_of_times_of_salary_enhance', '');
  }

  const calculateTotalPremium = (i, opd, tax = 0) => {
    const premium_detail = watch(opd ? ('premium_' + PremiumRater[opd]) : 'premium') || [];
    if (premium_detail[i].amount && tax) {
      const total = Number(premium_detail[i].amount) + (premium_detail[i].amount * tax / 100)
      setValue(
        `${(opd ? ('premium_' + PremiumRater[opd]) : 'premium')}[${i}].total_premium`,
        String(total).includes('.') ? total.toFixed(2) : total
      );
    }
  }
  const calculateTotalPremiumIn = (i, tax = 0) => {
    const premium_detail = watch('in_premium') || [];
    if (premium_detail[i].amount && tax) {
      const total = Number(premium_detail[i].amount) + (premium_detail[i].amount * tax / 100)
      setValue(
        `${('in_premium')}[${i}].total_premium`,
        String(total).includes('.') ? total.toFixed(2) : total
      );
    }
  }

  const onSplitSIIpdFlat = () => {
    let values = watch('randomipd') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds');
      return null
    }
    values = values.map(Number);
    if (values[0] > values[1]) {
      swal("Min SI can't be greater than Max SI");
    }
    const ArrayLength = ipdFlat.length;

    new Promise(function (fulfill, reject) {
      for (let i = values[0], j = 0; i <= values[1]; i = i + values[2]) {
        if (j >= ArrayLength) {
          addFormIpdFlat();
        }
        if (i + values[2] > values[1]) {
          fulfill(true);
        }
        ++j
        if (j >= 15) {
          fulfill(true);
          break;
        }
      }

    }).then(function (result) {
      let j = 0;
      for (let i = values[0]; i <= values[1]; i = i + values[2]) {
        setValue(
          `sum_insured.${j}`,
          i
        );
        ++j
        if (j >= 15) {
          swal("Maximum 15 split can be done");
          break;
        }
      }
      setIpdFlat(prev => prev.filter((_, index) => index < j))
    })
  }

  const onSplitSIIpdFlatInd = () => {
    let values = watch('randomin') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds');
      return null
    }
    values = values.map(Number);
    if (values[0] > values[1]) {
      swal("Min SI can't be greater than Max SI");
    }
    const ArrayLength = ipdFlatInd.length;

    new Promise(function (fulfill, reject) {
      for (let i = values[0], j = 0; i <= values[1]; i = i + values[2]) {
        if (j >= ArrayLength) {
          addFormIpdFlatInd();
        }
        if (i + values[2] > values[1]) {
          fulfill(true);
        }
        ++j
        if (j >= 15) {
          fulfill(true);
          break;
        }
      }

    }).then(function (result) {
      let j = 0;
      for (let i = values[0]; i <= values[1]; i = i + values[2]) {
        setValue(
          `in_sum_insured.${j}`,
          i
        );
        ++j
        if (j >= 15) {
          swal("Maximum 15 split can be done");
          break;
        }
      }
      setIpdFlatInd(prev => prev.filter((_, index) => index < j))
    })
  }

  const onSplitSIOpdFlat = () => {
    let values = watch('randomopd') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds')
      return null
    }
    values = values.map(Number);
    const ArrayLength = opdFlat.length;

    new Promise(function (fulfill, reject) {
      for (let i = values[0], j = 0; i <= values[1]; i = i + values[2]) {
        if (j >= ArrayLength) {
          addFormOpdFlat();
        }
        if (i + values[2] > values[1]) {
          fulfill(true);
        }
        ++j
      }

    }).then(function (result) {
      let j = 0;
      for (let i = values[0]; i <= values[1]; i = i + values[2]) {
        setValue(
          `sum_insured_opd.${j}`,
          i
        );
        ++j
      }
      setOpdFlat(prev => prev.filter((_, index) => index < j))
    })
  }

  const onSplitSITopupFlat = () => {
    let values = watch('randomtopup') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds')
      return null
    }
    values = values.map(Number);
    const ArrayLength = topupFlat.length;

    new Promise(function (fulfill, reject) {
      for (let i = values[0], j = 0; i <= values[1]; i = i + values[2]) {
        if (j >= ArrayLength) {
          addFormTopupFlat();
        }
        if (i + values[2] > values[1]) {
          fulfill(true);
        }
        ++j
      }

    }).then(function (result) {
      let j = 0;
      for (let i = values[0]; i <= values[1]; i = i + values[2]) {
        setValue(
          `sum_insured_topup.${j}`,
          i
        );
        ++j
      }
      setTopupFlat(prev => prev.filter((_, index) => index < j))
    })
  }

  const onSplitSIEnhanceFlat = () => {
    let values = watch('randomenhance') || [];
    if (!values.length || !values.every(val => val)) {
      swal('All inputs required to generate sum-insureds')
      return null
    }
    values = values.map(Number);
    const ArrayLength = enhanceFlat.length;

    new Promise(function (fulfill, reject) {
      for (let i = values[0], j = 0; i <= values[1]; i = i + values[2]) {
        if (j >= ArrayLength) {
          addFormEnhanceFlat();
        }
        if (i + values[2] > values[1]) {
          fulfill(true);
        }
        ++j
      }

    }).then(function (result) {
      let j = 0;
      for (let i = values[0]; i <= values[1]; i = i + values[2]) {
        setValue(
          `sum_insured_enhance.${j}`,
          i
        );
        ++j
      }
      setEnhanceFlat(prev => prev.filter((_, index) => index < j))
    })
  }

  const onSubmit = data => {

    if ((data.premium_type === 18 && data.si_sub_type !== 16) || (data.premium_type !== 18 && data.si_sub_type === 16)) {
      swal("Required", "SI & Premium type should be equal for no rule", "info");
      return "";
    }

    if (!isNoRule) {
      data = _.omit(data, 'additional_premium');
    }
    delete data.si_amt;
    delete data.pre_amt;
    delete data.pre_tax;
    delete data.pre_total;

    const ages = _.cloneDeep(savedConfig.ages || []);
    const ages_length = ages?.length;
    const ages_opd = _.cloneDeep(savedConfig.ages || []);
    const ages_length_opd = ages_opd.length;
    const ages_topup = _.cloneDeep(savedConfig.ages || []);
    const ages_length_topup = ages_topup.length;

    // const additionalPremium = ages.some(item => item.additional_premium);
    if (isNoRule) {
      data.additional_premium = (tab === "additional") ? 1 : 0;
    }
    data.has_flex = data.has_flex ? 1 : 0;
    data.has_payroll = data.has_payroll ? 1 : 0;

    // if (!data.has_flex && !data.has_payroll) {
    //   swal("Validation", 'Select atleast one type of payment(Flex or Payroll)', "info");
    //   return
    // }

    // speacial child
    if (savedConfig?.has_special_child && ((data.special_child_employer_premium) + data.special_child_employee_premium) !== 100) {
      swal("Validation", "Total contribution for special child must be 100", "info");
      return
    }

    // unmarried child
    if (savedConfig?.has_unmarried_child && ((data.unmarried_child_employer_premium) + data.unmarried_child_employee_premium) !== 100) {
      swal("Validation", "Total contribution for unmarried child must be 100", "info");
      return
    }

    // File Sum
    if (Number(data.si_sub_type) === 1) {
      // data.sum_insured = siAmounts
    } else if (Number(data.si_sub_type) !== 5 && isNoRule) {
      if (siFile || filesName?.sumName) {
        data.suminsured_file = siFile
      } else if (si_type === 3 ? (((premiumFile || filesName?.premName) || data.premium) || !((premiumFileInd || filesName?.premName_in) || (siFileInd || filesName?.sumName_in))) : true) {
        swal("Required", `${BaseWiseSIPremium ? 'Base Wise SI & Premium' : 'Sum Insured'} file required`, "info")
        return null;
      }
    }
    // File Prem
    if (Number(data.premium_type) === 1) {
      // data.premium = premiumAmounts
    }
    else if (!BaseWiseSIPremium && isNoRule) {
      data.premium = []
      if (premiumFile || filesName?.premName) {
        data.premium_file = premiumFile
      } else if (si_type === 3 ? (((siFile || filesName?.sumName) || data.sum_insured) || !((premiumFileInd || filesName?.premName_in) || (siFileInd || filesName?.sumName_in))) : true) {
        swal("Required", "Premium file required", "info")
        return null;
      }
    }

    // No sum & premium equal
    if (data.premium && data.sum_insured &&
      Number(data.premium) === 1 && Number(data.sum_insured) === 1 &&
      data.premium.length !== data.sum_insured.length) {
      swal("Required", "Number of SI & Premium should be equal", "info");
      return "";
    }

    // Array sum
    if (Number(data.si_sub_type) === 1 && !data.sum_insured.length) {
      swal("Required", "Number of SI can't be zero", "info");
      return;
    }
    // Array premium
    if (Number(data.premium_type) === 1 && !data.premium.length) {
      swal("Required", "Number of Premium can't be zero", "info");
      return;
    }

    if (Number(data.si_sub_type) === 5 && salarySI.length === 0) {
      swal("Required", "Number of Salary can't be zero", "info");
      return;
    }

    if (si_type === 3) {

      // File Sum
      if (Number(data.si_sub_type) === 1) {
        // data.sum_insured = siAmounts
      } else if (Number(data.si_sub_type) !== 5 && isNoRule) {
        if (siFileInd || filesName?.sumName_in) {
          data.in_suminsured_file = siFileInd
        } else if ((premiumFileInd || filesName?.premName_in) || !((premiumFile || filesName?.premName) || (siFile || filesName?.sumName))) {
          swal("Required", `${BaseWiseSIPremium ? 'Base Wise SI & Premium' : 'Sum Insured'} file required`, "info")
          return null;
        }
      }
      // File Prem
      if (Number(data.premium_type) === 1) {
        // data.premium = premiumAmounts
      }
      else if (!BaseWiseSIPremium && isNoRule) {
        data.in_premium = []
        if (premiumFileInd || filesName?.premName_in) {
          data.in_premium_file = premiumFileInd
        } else if ((siFileInd || filesName?.sumName_in) || !((premiumFile || filesName?.premName) || (siFile || filesName?.sumName))) {
          swal("Required", "Premium file required", "info")
          return null;
        }
      }

      // No sum & premium equal
      if (data.in_premium && data.in_sum_insured &&
        Number(data.in_premium) === 1 && Number(data.in_sum_insured) === 1 &&
        data.in_premium.length !== data.in_sum_insured.length) {
        swal("Required", "Number of SI & Premium should be equal", "info");
        return "";
      }

      // Array sum
      if (Number(data.si_sub_type) === 1 && !data.in_sum_insured.length) {
        swal("Required", "Number of SI can't be zero", "info");
        return;
      }
      // Array premium
      if (Number(data.premium_type) === 1 && !data.in_premium.length) {
        swal("Required", "Number of Premium can't be zero", "info");
        return;
      }

      // if (Number(data.si_sub_type) === 5 && salarySI.length === 0) {
      //   swal("Required", "Number of Salary can't be zero", "info");
      //   return;
      // }

    }

    // additional premium validiation
    if (!(ContributionTypeRater.includes(premiumType))) {
      if (data.additional_premium === 1) {
        delete data.employee_contribution;
        delete data.employer_contribution;
        for (let i = 0; i < ages_length; i++) {
          if (Number(data.parent_contribution_type) === 2) {
            if ([5, 6].includes(Number(ages[i].relation_id))) {
              ages[i].employer_contribution = data.parent_contribution.employer_contribution || 0;
              ages[i].employee_contribution = data.parent_contribution.employee_contribution || 0;
              ages[i].additional_premium = data.parent_contribution.additional_premium || 0;
            }
            if ([7, 8].includes(Number(ages[i].relation_id))) {
              ages[i].employer_contribution = data.parentinlaw_contribution.employer_contribution || 0;
              ages[i].employee_contribution = data.parentinlaw_contribution.employee_contribution || 0;
              ages[i].additional_premium = data.parentinlaw_contribution.additional_premium || 0;
            }
          }
          else {
            if (data.ages[i]) {
              if ((Number(data.ages[i].employee_contribution) + Number(data.ages[i].employer_contribution)) !== 100) {
                swal("Validation", "Total contribution must be 100", "info");
                return;
              }
              ages[i].employer_contribution = data.ages[i].employer_contribution || 0;
              ages[i].employee_contribution = data.ages[i].employee_contribution || 0;
              ages[i].additional_premium = data.ages[i].additional_premium || 0;
              ages[i].additional_premium_limit = data.ages[i].additional_premium_limit || false;
            }
          }
        }
      }
      else if (data.additional_premium === 0) {
        for (let i = 0; i < ages_length; i++) {
          delete ages[i]?.additional_premium;
          if (ages[i]) {
            ages[i].employer_contribution = data.employer_contribution || 0;
            ages[i].employee_contribution = data.employee_contribution || 0;
          }
        }
        if ((Number(data.employee_contribution) + Number(data.employer_contribution)) !== 100) {
          swal("Validation", "Total contribution must be 100", "info");
          return;
        }
      }
    }
    if (opd_ipd === 3) {

      delete data.si_amt_opd;
      delete data.pre_amt_opd;
      delete data.pre_tax_opd;
      delete data.pre_total_opd;
      data.additional_premium_opd = (tab1 === "additional") ? 1 : 0;


      if (Number(data.opd_suminsured_sub_type) === 1) {
        // data.sum_insured_opd = siAmounts_opd
      }
      else if (Number(data.si_sub_type_opd) !== 5) {
        if (siFile_opd || filesName?.sumName_opd) {
          data.suminsured_file_opd = siFile_opd
        } else {
          swal("Required", "OPD Sum Insured file required", "info")
          return null;
        }
      }
      // File Prem
      if (Number(data.opd_premium_type) === 1) {
        // data.premium_opd = premiumAmounts_opd
      }
      else {
        data.premium_opd = [];
        if (premiumFile_opd || filesName?.premName_opd) {
          data.premium_file_opd = premiumFile_opd
        } else {
          swal("Required", "OPD Premium file required", "info")
          return null;
        }
      }


      // No sum & premium equal
      if (data.premium_opd && data.sum_insured_opd &&
        Number(data.premium_opd) === 1 && Number(data.sum_insured_opd) === 1 &&
        data.premium_opd.length !== data.sum_insured_opd.length) {
        swal("Required", "Number of opd SI & Premium should be equal", "info");
        return "";
      }

      // Array sum
      if (Number(data.opd_suminsured_sub_type) === 1 && !data.sum_insured_opd.length) {
        swal("Required", "Number of opd SI can't be zero", "info");
        return;
      }
      // Array premium
      if (Number(data.opd_premium_type) === 1 && !data.premium_opd.length) {
        swal("Required", "Number of opd Premium can't be zero", "info");
        return;
      }

      // additional premium validiation
      if (!(ContributionTypeRater.includes(premiumType_opd))) {


        if (data.additional_premium_opd === 1) {
          delete data.employee_contribution_opd;
          delete data.employer_contribution_opd;
          for (let i = 0; i < ages_length_opd; i++) {//mandar
            if (Number(data.parent_contribution_type_opd) === 2) {
              if ([5, 6].includes(Number(ages_opd[i].relation_id))) {
                ages_opd[i].employer_contribution = data.parent_contribution_opd.employer_contribution || 0;
                ages_opd[i].employee_contribution = data.parent_contribution_opd.employee_contribution || 0;
                ages_opd[i].additional_premium = data.parent_contribution_opd.additional_premium || 0;
              }
              if ([7, 8].includes(Number(ages_opd[i].relation_id))) {
                ages_opd[i].employer_contribution = data.parentinlaw_contribution_opd.employer_contribution || 0;
                ages_opd[i].employee_contribution = data.parentinlaw_contribution_opd.employee_contribution || 0;
                ages_opd[i].additional_premium = data.parentinlaw_contribution_opd.additional_premium || 0;
              }
            }
            else {
              if (data.ages_opd[i]) {
                if ((Number(data.ages_opd[i].employee_contribution) + Number(data.ages_opd[i].employer_contribution)) !== 100) {
                  swal("Validation", "Total contribution must be 100", "info");
                  return;
                }
                ages_opd[i].employer_contribution = data.ages_opd[i].employer_contribution || 0;
                ages_opd[i].employee_contribution = data.ages_opd[i].employee_contribution || 0;
                ages_opd[i].additional_premium = data.ages_opd[i].additional_premium || 0;
                ages_opd[i].additional_premium_limit = data.ages_opd[i].additional_premium_limit || false;
              }
            }
          }
        }
        else if (data.additional_premium_opd === 0) {
          for (let i = 0; i < ages_length_opd; i++) {
            if (typeof ages_opd[i] !== "undefined") {
              delete ages_opd[i]?.additional_premium_opd;
              ages_opd[i].employer_contribution = data.employer_contribution_opd || 0;
              ages_opd[i].employee_contribution = data.employee_contribution_opd || 0;
            }
          }
          if ((Number(data.employee_contribution_opd) + Number(data.employer_contribution_opd)) !== 100) {
            swal("Validation", "Total contribution must be 100", "info");
            return;
          }
        }
      }
    }

    if (opd_ipd === 4) {

      delete data.si_amt_topup;
      delete data.pre_amt_topup;
      delete data.pre_tax_topup;
      delete data.pre_total_topup;
      data.additional_premium_topup = (tab2 === "additional") ? 1 : 0;


      if (Number(data.topup_suminsured_sub_type) === 1) {
        // data.sum_insured_topup = siAmounts_topup
      }
      else if (Number(data.topup_suminsured_sub_type) !== 5) {
        if (siFile_topup || filesName?.sumName_topup) {
          data.suminsured_file_topup = siFile_topup
        } else {
          swal("Required", `${BaseWiseSIPremium_topup ? 'Base Wise SI & Premium' : 'Topup Sum Insured'} file required`, "info")
          return null;
        }
      }
      // File Prem
      if (Number(data.topup_premium_type) === 1) {
        // data.premium_topup = premiumAmounts_topup
      }
      else {
        data.premium_topup = [];
        if (premiumFile_topup || filesName?.premName_topup) {
          data.premium_file_topup = premiumFile_topup
        } else {
          swal("Required", "Topup Premium file required", "info")
          return null;
        }
      }


      // No sum & premium equal
      if (data.premium_topup && data.sum_insured_topup &&
        Number(data.premium_topup) === 1 && Number(data.sum_insured_topup) === 1 &&
        data.premium_topup.length !== data.sum_insured_topup.length) {
        swal("Required", "Number of topup SI & Premium should be equal", "info");
        return "";
      }

      // Array sum
      if (Number(data.topup_suminsured_sub_type) === 1 && !data.sum_insured_topup.length) {
        swal("Required", "Number of topup SI can't be zero", "info");
        return;
      }
      // Array premium
      if (Number(data.topup_premium_type) === 1 && !data.premium_topup.length) {
        swal("Required", "Number of topup Premium can't be zero", "info");
        return;
      }

      // additional premium validiation
      if (!(ContributionTypeRater.includes(premiumType_topup))) {


        if (data.additional_premium_topup === 1) {
          delete data.employee_contribution_topup;
          delete data.employer_contribution_topup;
          for (let i = 0; i < ages_length_topup?.length; i++) {
            if (Number(data.parent_contribution_type_topup) === 2) {
              if ([5, 6].includes(Number(ages_topup[i].relation_id))) {
                ages_topup[i].employer_contribution = data.parent_contribution_topup.employer_contribution || 0;
                ages_topup[i].employee_contribution = data.parent_contribution_topup.employee_contribution || 0;
                ages_topup[i].additional_premium = data.parent_contribution_topup.additional_premium || 0;
              }
              if ([7, 8].includes(Number(ages_topup[i].relation_id))) {
                ages_topup[i].employer_contribution = data.parentinlaw_contribution_topup.employer_contribution || 0;
                ages_topup[i].employee_contribution = data.parentinlaw_contribution_topup.employee_contribution || 0;
                ages_topup[i].additional_premium = data.parentinlaw_contribution_topup.additional_premium || 0;
              }
            }
            else {
              if (data.ages_topup[i]) {
                if ((Number(data.ages_topup[i].employee_contribution) + Number(data.ages_topup[i].employer_contribution)) !== 100) {
                  swal("Validation", "Total contribution must be 100", "info");
                  return;
                }
                ages_topup[i].employer_contribution = data.ages_topup[i].employer_contribution || 0;
                ages_topup[i].employee_contribution = data.ages_topup[i].employee_contribution || 0;
                ages_topup[i].additional_premium = data.ages_topup[i].additional_premium || 0;
                ages_opd[i].additional_premium_limit = data.ages_topup[i].additional_premium_limit || false;
              }
            }
          }
        }

        else if (data.additional_premium_topup === 0) {
          for (let i = 0; i < ages_length_topup; i++) {
            delete ages_topup[i]?.additional_premium_topup;
            ages_topup[i].employer_contribution = data.employer_contribution_topup || 0;
            ages_topup[i].employee_contribution = data.employee_contribution_topup || 0;
          }
          if ((Number(data.employee_contribution_topup) + Number(data.employer_contribution_topup)) !== 100) {
            swal("Validation", "Total contribution must be 100", "info");
            return;
          }
        }
      }
    }

    if (opd_ipd === 5) {

      delete data.si_amt_enhance;
      delete data.pre_amt_enhance;
      delete data.pre_tax_enhance;
      delete data.pre_total_enhance;


      if (Number(data.enhance_suminsured_sub_type) === 1) {
        // data.sum_insured_enhance = siAmounts_enhance
      }
      else if (Number(data.enhance_suminsured_sub_type) !== 5) {
        if (siFile_enhance || filesName?.sumName_enhance) {
          data.suminsured_file_enhance = siFile_enhance
        } else {
          swal("Required", 'Enhance Sum Insured file required', "info")
          return null;
        }
      }
      // File Prem
      if (Number(data.enhance_premium_type) === 1) {
        // data.premium_enhance = premiumAmounts_enhance
      }
      else {
        data.premium_enhance = [];
        if (premiumFile_enhance || filesName?.premName_enhance) {
          data.premium_file_enhance = premiumFile_enhance
        } else {
          swal("Required", "Enhance Premium file required", "info")
          return null;
        }
      }


      // No sum & premium equal
      if (data.premium_enhance && data.sum_insured_enhance &&
        Number(data.premium_enhance) === 1 && Number(data.sum_insured_enhance) === 1 &&
        data.premium_enhance.length !== data.sum_insured_enhance.length) {
        swal("Required", "Number of enhance SI & Premium should be equal", "info");
        return "";
      }

      // Array sum
      if (Number(data.enhance_suminsured_sub_type) === 1 && !data.sum_insured_enhance.length) {
        swal("Required", "Number of enhance SI can't be zero", "info");
        return;
      }
      // Array premium
      if (Number(data.enhance_premium_type) === 1 && !data.premium_enhance.length) {
        swal("Required", "Number of enhance Premium can't be zero", "info");
        return;
      }

      // additional premium validiation
    }

    // // special memebers

    // let _Ages = [];

    // for (let i = 0; i < ages.length; i++) {
    //   for (let j = 0; j < data._ages.length; j++) {
    //     if (ages[i]?.relation_id === data._ages[j]?.relation_id) {
    //       if (_Ages.filter(item => item.relation_id === data._ages[j]?.relation_id).length===0) {
    //       _Ages.push({
    //         ...ages[i],
    //         special_member_additional_premium: Number(data._ages[j].special_member_additional_premium),
    //         special_member_employee_contribution: Number(data._ages[j].special_member_employee_contribution),
    //         special_member_employer_contribution: Number(data._ages[j].special_member_employer_contribution),
    //       })
    //     }
    //     }
    //     else {
    //       if (_Ages.filter(item => item.relation_id === ages[i]?.relation_id).length===0) {
    //         _Ages.push(ages[i])
    //       }
    //     }
    //   }
    // }
    // let _ages = ages.map((item, i) => {
    //   if (item?.is_special_member_allowed) {
    //     return {
    //       ...item,
    //       special_member_additional_premium: Number(data.ages[i].special_member_additional_premium),
    //       special_member_employee_contribution: Number(data.ages[i].special_member_employee_contribution),
    //       special_member_employer_contribution: Number(data.ages[i].special_member_employer_contribution),
    //     }
    //   }
    //   else {
    //     let mergedData = _.omit(item,
    //       [
    //         'special_member_additional_premium',
    //         'special_member_employee_contribution',
    //         'special_member_employer_contribution'
    //       ]);
    //     return {
    //       ...mergedData,
    //     };
    //   }
    // })

    if (data.installment_allowed && !installment_periods.length) {
      swal("Alert", "Please enter Installment period installment period", "info");
      return null;
    }

    // if ((Number(savedConfig.policy_sub_type) === 6 && (data.si_sub_type === 5))) {
    //   data = _.omit(data,
    //     [
    //       'max_si_limit',
    //       'min_si_limit',
    //       'no_of_times_of_salary'
    //     ]);
    // }
    let _obj = isNoRule ? {
      formId, data: {
        ...data, ages,
        base_ipd_policy_id: data.base_ipd_policy_id || '',
        ages_opd: opd_ipd === 3 ? ages_opd : [],
        ages_topup: opd_ipd === 4 ? ages_topup : [],
        policy_rater_type_id: data.policy_rater_type_id || 1,
        // is_installment_allowed: (data.installment_allowed && data.has_payroll && !!(topup_policy || opd_ipd === 4)) ? 1 : 0,
        is_installment_allowed: (data.installment_allowed && data.has_payroll) ? 1 : 0,
        installment_periods: (data.installment_allowed && data.has_payroll) ? installment_periods : [],
        installment_level: data.installment_level || '0',
        ...((salarySI.length !== 0 && (siType === 5)) && {
          salary: salarySI
        }),
        premium_tax_type: data.premium_tax_type || 0,
        premium_tax: data.premium_tax || 0,
        premium_tax_type_opd: data.premium_tax_type_opd || 0,
        premium_tax_opd: data.premium_tax_opd || 0,
        premium_tax_type_topup: data.premium_tax_type_topup || 0,
        premium_tax_topup: data.premium_tax_topup || 0,
        premium_tax_type_enhance: data.premium_tax_type_enhance || 0,
        premium_tax_enhance: data.premium_tax_enhance || 0,
        premium_contribution_type_opd: data.premium_contribution_type_opd ?? 1,
        premium_contribution_type_topup: data.premium_contribution_type_topup ?? 1,
        premium_contribution_type: data.premium_contribution_type ?? 1,
        top_up_cover_has_eligibility: data.top_up_cover_has_eligibility || 0,
      }
    } : {
      formId, data: {
        ...data
      }
    }
    if (onSave) onSave(_obj);

  };

  const downloadPremiumSample = (opd) => {
    const switchCondition = opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType;
    if (switchCondition) {
      switch (switchCondition) {
        case 2:
          dispatch(downloadSampleFile({ sample_type_id: 8 }));
          break;
        case 3:
          dispatch(downloadSampleFile({ sample_type_id: 9 }));
          break;
        case 4:
          dispatch(downloadSampleFile({ sample_type_id: 10 }));
          break;
        case 5:
          dispatch(downloadSampleFile({ sample_type_id: 11 }));
          break;
        case 6:
          dispatch(downloadSampleFile({ sample_type_id: 12 }));
          break;
        case 7:
          dispatch(downloadSampleFile({ sample_type_id: 13 }));
          break;
        case 8:
          dispatch(downloadSampleFile({ sample_type_id: 8 }));
          break;
        case 9:
          dispatch(downloadSampleFile({ sample_type_id: 35 }));
          break;
        case 10:
          dispatch(downloadSampleFile({ sample_type_id: 52 }));
          break;
        case 11:
          dispatch(downloadSampleFile({ sample_type_id: 61 }));
          break;
        case 12:
          dispatch(downloadSampleFile({ sample_type_id: 62 }));
          break;
        case 13:
          dispatch(downloadSampleFile({ sample_type_id: 60 }));
          break;
        case 14:
          dispatch(downloadSampleFile({ sample_type_id: 65 }));
          break;
        case 15:
          dispatch(downloadSampleFile({ sample_type_id: 69 }));
          break;
        case 16:
          dispatch(downloadSampleFile({ sample_type_id: 71 }));
          break;
        case 17:
          dispatch(downloadSampleFile({ sample_type_id: 73 }));
          break;
        case 19:
          dispatch(downloadSampleFile({ sample_type_id: 74 }));
          break;
        case 20:
          dispatch(downloadSampleFile({ sample_type_id: 77 }));
          break;
        case 21:
          dispatch(downloadSampleFile({ sample_type_id: 79 }));
          break;
        default:
          swal("Sorry", "No sample file format available.", "info");
          break;
      }
    } else {
      swal("Sorry", "No sample file format available.", "info");
    }
  };

  const downloadSISample = (opd) => {
    const switchCondition = opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType;
    if (switchCondition) {
      switch (switchCondition) {
        case 2:
          dispatch(downloadSampleFile({ sample_type_id: 5 }));
          break;
        case 3:
          dispatch(downloadSampleFile({ sample_type_id: 6 }));
          break;
        case 4:
          dispatch(downloadSampleFile({ sample_type_id: 7 }));
          break;
        case 6:
          dispatch(downloadSampleFile({ sample_type_id: 48 }));
          break;
        case 7:
          dispatch(downloadSampleFile({ sample_type_id: 51 }));
          break;
        case 8:
          dispatch(loadBaseWiseSiPrSheet({ policy_id: savedConfig.topup_master_policy_ids[0]?.policy_id }));
          // dispatch(loadBaseWiseSiPrSheet({ policy_id: savedConfig.topup_master_policy_id }));
          break;
        case 9:
          dispatch(downloadSampleFile({ sample_type_id: 59 }));
          break;
        case 10:
          dispatch(downloadSampleFile({ sample_type_id: 66 }));
          break;
        case 11:
          dispatch(downloadSampleFile({ sample_type_id: 67 }));
          break;
        case 12:
          dispatch(downloadSampleFile({ sample_type_id: 64 }));
          break;
        case 13:
          dispatch(downloadSampleFile({ sample_type_id: 68 }));
          break;
        case 14:
          dispatch(downloadSampleFile({ sample_type_id: 70 }));
          break;
        case 15:
          dispatch(downloadSampleFile({ sample_type_id: 72 }));
          break;
        case 17:
          dispatch(downloadSampleFile({ sample_type_id: 75 }));
          break;
        case 18:
          dispatch(downloadSampleFile({ sample_type_id: 78 }));
          break;
        case 20:
          dispatch(downloadSampleFile({ sample_type_id: 76 }));
          break;
        default:
          swal("Sorry", "No sample file format available.", "info");
          break;
      }
    } else {
      swal("Sorry", "No sample file format available.", "info");
    }
  };


  const onUploadFile = (type, file) => {
    if (type === 'premium_file') {
      setPremiumFile(file);
    }
    if (type === 'suminsured_file') {
      setSIFile(file);
    }
    if (type === 'in_premium_file') {
      setPremiumFileInd(file);
    }
    if (type === 'in_suminsured_file') {
      setSIFileInd(file);
    }
    if (type === 'premium_file_opd') {
      setPremiumFile_opd(file);
    }
    if (type === 'suminsured_file_opd') {
      setSIFile_opd(file);
    }
    if (type === 'premium_file_topup') {
      setPremiumFile_topup(file);
    }
    if (type === 'suminsured_file_topup') {
      setSIFile_topup(file);
    }
    if (type === 'premium_file_enhance') {
      setPremiumFile_enhance(file);
    }
    if (type === 'suminsured_file_enhance') {
      setSIFile_enhance(file);
    }
    return file;
  };

  const CollectTax = (opd) => (<Row>
    <Col md={12} lg={12} xl={12} sm={12}>
      <TextCard className="pl-3 pt-3 pr-3 mb-4 mt-4 row" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
        <Col md={12} lg={6} xl={6} sm={12}>

          <Marker />
          <Typography>{'\u00A0'} Premium Tax Included/Excluded ?</Typography>
          <br />
          <div className='d-flex flex-wrap'>
            <CustomCheck>
              <label className="custom-control-label-check  container-check">
                <span >Tax Included</span>
                <Controller
                  as={
                    <input
                      name={opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type'}
                      type="radio"
                      defaultChecked={!Number(opd ? GivePremiumRaterVariable(opd, savedConfig?.premium_tax_type_opd, savedConfig?.premium_tax_type_toup, savedConfig?.premium_tax_type_enhance) : savedConfig?.premium_tax_type) || true}
                      value={0}
                    />
                  }
                  name={opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type'}
                  onChange={([e]) => { return e.target.checked ? 0 : 1 }}
                  onClick={((e) => setValue(opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type', 0))}
                  control={control}
                />
                <span className="checkmark-check"></span>
              </label>
            </CustomCheck>

            <CustomCheck className="custom-control-checkbox">
              <label className="custom-control-label-check  container-check">
                <span >Tax Excluded</span>
                <Controller
                  as={
                    <input
                      name={opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type'}
                      type="radio"
                      defaultChecked={!!Number(opd ? GivePremiumRaterVariable(opd, savedConfig?.premium_tax_type_opd, savedConfig?.premium_tax_type_toup, savedConfig?.premium_tax_type_enhance) : savedConfig?.premium_tax_type) || false}
                      value={1}
                    />
                  }
                  name={opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type'}
                  onChange={([e]) => { return e.target.checked ? 1 : 0 }}
                  onClick={((e) => setValue(opd ? ('premium_tax_type_' + PremiumRater[opd]) : 'premium_tax_type', 1))}
                  control={control}
                />
                <span className="checkmark-check"></span>
              </label>
            </CustomCheck>
          </div>

          {!!(opd ? GivePremiumRaterVariable(opd, premium_tax_type_opd, premium_tax_type_topup, premium_tax_type_enhance) : premium_tax_type) && <Row>
            <Col xl={5} lg={8} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Premium Tax"
                    placeholder="Enter Premium Tax"
                    type="tel"
                    onKeyDown={numOnlyWithPoint}
                    onKeyPress={noSpecial}
                    maxLength={3}
                    required
                    labelProps={{ background: '#f8f8f8' }}
                    defaultValue={'0'}
                    error={errors && errors[opd ? ('premium_tax_' + PremiumRater[opd]) : 'premium_tax']}
                  />
                }
                rules={{ required: true, min: 1, max: 1000 }}
                control={control}
                name={opd ? ('premium_tax_' + PremiumRater[opd]) : 'premium_tax'}
              />
            </Col>
          </Row>}
        </Col>
        {ContributionTypeRater.includes(Number((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType)))
          && <Col md={12} lg={6} xl={6} sm={12}>
            <Marker />
            <Typography>{'\u00A0'} Contribution Type in Premium Rater ?</Typography>
            <br />
            <div className='d-flex flex-wrap'>
              <CustomCheck>
                <label className="custom-control-label-check  container-check">
                  <span>By Value(₹)</span>
                  <Controller
                    as={
                      <input
                        name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                        type="radio"
                        defaultChecked={!Number(opd ? GivePremiumRaterVariable(opd, savedConfig?.premium_contribution_type_opd, savedConfig?.premium_contribution_type_topup, savedConfig?.premium_contribution_type_enhance) : savedConfig?.premium_contribution_type) || true}
                        value={0}
                      />
                    }
                    name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                    onChange={([e]) => { return e.target.checked ? 0 : 1 }}
                    onClick={((e) => setValue(opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type', 0))}
                    control={control}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>

              <CustomCheck className="custom-control-checkbox">
                <label className="custom-control-label-check  container-check">
                  <span >By Percentage(%)</span>
                  <Controller
                    as={
                      <input
                        name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                        type="radio"
                        defaultChecked={!!Number(opd ? GivePremiumRaterVariable(opd, savedConfig?.premium_contribution_type_opd, savedConfig?.premium_contribution_type_topup, savedConfig?.premium_contribution_type_enhance) : savedConfig?.premium_contribution_type) || false}
                        value={1}
                      />
                    }
                    name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                    onChange={([e]) => { return e.target.checked ? 1 : 0 }}
                    onClick={((e) => setValue(opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type', 1))}
                    control={control}
                  />
                  <span className="checkmark-check"></span>
                </label>
              </CustomCheck>
            </div>
          </Col>}
      </TextCard>
    </Col>
  </Row>)

  const GenerateSumInsured = (opd) => {

    const values = (opd ? GivePremiumRaterVariable(opd, randomopd, randomtopup, randomenhance, randomin) : randomipd) || [];

    return (<Col xl={12} lg={12} md={12} sm={12}>
      <TextCard className="p-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
        <Marker />
        <Typography>{'\u00A0'} Generate Sum Insured {si_type === 3 && (opd === '_individual' ? '(Individual)' : '(Floater)')}</Typography>
        <Row>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  labelProps={{ background: '#f8f8f8' }}
                  label='Minimum SI'
                  placeholder='Enter Minimum SI'
                  type='tel'
                  maxLength={9}
                  onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                  required
                // error={errors && errors.max_discount}
                />
              }
              control={control}
              name={`random${opd ? PremiumRater[opd] : 'ipd'}.0`}
            />
            {!!(values[0]) &&
              <Error top='0' color={'blue'}>{toWords.convert(values[0])}</Error>}
          </Col>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  labelProps={{ background: '#f8f8f8' }}
                  label='Maximum SI'
                  placeholder='Enter Maximum SI'
                  type='tel'
                  maxLength={9}
                  onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                  required
                // error={errors && errors.max_discount}
                />
              }
              control={control}
              name={`random${opd ? PremiumRater[opd] : 'ipd'}.1`}
            />
            {!!(values[1]) &&
              <Error top='0' color={'blue'}>{toWords.convert(values[1])}</Error>}
          </Col>
          <Col xl={4} lg={5} md={6} sm={12}>
            <Controller
              as={
                <Input
                  labelProps={{ background: '#f8f8f8' }}
                  label='Interval Between Min & Max SI'
                  placeholder='Enter Interval Value'
                  type='tel'
                  maxLength={9}
                  onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                  required
                // error={errors && errors.max_discount}
                />
              }
              control={control}
              name={`random${opd ? PremiumRater[opd] : 'ipd'}.2`}
            />
            {!!(values[2]) &&
              <Error top='0' color={'blue'}>{toWords.convert(values[2])}</Error>}
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} className='d-flex justify-content-end'>
            <Button onClick={opd ? GivePremiumRaterVariable(opd, onSplitSIOpdFlat, onSplitSITopupFlat, onSplitSIEnhanceFlat, onSplitSIIpdFlatInd) : onSplitSIIpdFlat}>
              Generate
            </Button>
          </Col>

        </Row>
      </TextCard>
    </Col>)
  }
  const PremiumForm = (opd = '') => (<>

    <Row>
      <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
        <Controller
          as={
            <Select
              label="Sum Insured Type"
              placeholder="Select Sum Insured Type"
              options={configs.sum_insured_types?.filter(({ id }) => (opd_ipd === 1 && id === 3) || id !== 3).map(item => ({
                id: item.id,
                name: item.name,
                value: item.id
              }))}
              error={errors && errors[opd ? (PremiumRater[opd] + '_suminsured_type') : 'si_type']}
            />
          }
          control={control}
          name={opd ? (PremiumRater[opd] + '_suminsured_type') : 'si_type'}
        />
        {!!errors[opd ? (PremiumRater[opd] + '_suminsured_type') : 'si_type'] && <Error>
          {errors[opd ? (PremiumRater[opd] + '_suminsured_type') : 'si_type'].message}
        </Error>}
      </Col>

      <Col xl={4} lg={5} md={6} sm={12}>
        <Controller
          as={
            <Select
              label="Sum Insured Basis"
              placeholder="Select Sum Insured Basis"
              options={configs.sum_insured_sub_types
                .filter(item => {
                  const MC = [1, 4].includes(Number(savedConfig.policy_sub_type))
                  if ([5, 15].includes(item.id) && MC) {
                    return false;
                  }
                  if (!MC && [9, 13, 14].includes(item.id)) {
                    return false
                  }
                  if ((!topup_policy && ((opd_ipd === 4 ? opd !== '_topup' : true))) && item.id === 8) {
                    return false
                  }
                  return true
                })
                .map(item => ({
                  id: item.id,
                  name: item.name,
                  value: item.id
                }))}
              error={errors && errors[opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type']}
            />
          }
          control={control}
          name={opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type'}
          onChange={([selected]) => {
            const target = selected.target;
            const value = target ? target.value : '';
            if ((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1 && Number(value) === 5) {
              (opd ? GivePremiumRaterVariable(opd, setPremiumType_opd, setPremiumType_topup, setPremiumType_enhance) : setPremiumType)(prev => Number(''));
              setValue(opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type', '')
            }
            else if (Number(value) === 15) {
              setValue(opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type', 17);
              (opd ? GivePremiumRaterVariable(opd, setPremiumType_opd, setPremiumType_topup, setPremiumType_enhance) : setPremiumType)(17);
            } else if (Number(value) !== 15 && (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance) : premiumType) === 17) {
              setValue(opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type', '')
            }
            (opd ? GivePremiumRaterVariable(opd, setSIType_opd, setSIType_topup, setSIType_enhance) : setSIType)(prev => Number(value));
            // setSumInsuredFileUploader(prev => value !== '1');
            return selected;
          }}
        />
        {!!errors[opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type'] && <Error>
          {errors[opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type'].message}
        </Error>}
      </Col>

      {!(opd === '_topup' ? BaseWiseSIPremium_topup : BaseWiseSIPremium) && <Col xl={4} lg={5} md={6} sm={12}>
        <Controller
          as={
            <Select
              label="Premium Basis"
              placeholder="Select Premium Basis"
              options={configs.premium_types
                .filter(item => {
                  // const Member_Wise = item.id === 9;
                  const MC = [1, 4].includes(Number(savedConfig.policy_sub_type))
                  // if ((Member_Wise && !MC)) {
                  //   return false;
                  // }
                  if (Permily$Relation.includes(item.id) && MC) {
                    return false;
                  }
                  if (!MC && [13, 15, 16].includes(item.id)) {
                    return false
                  }
                  if ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === 5 && [1].includes(item.id)) {
                    return false;
                  }
                  return true;
                }
                )
                .map(item => ({
                  id: item.id,
                  name: item.name,
                  value: item.id
                }))}
              error={errors && errors[opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type']}
            />
          }
          control={control}
          name={opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type'}
          onChange={([selected]) => {
            const target = selected.target;
            const value = target ? target.value : '';
            if (Number(value) === 17) {
              setValue(opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type', 15);
              (opd ? GivePremiumRaterVariable(opd, setSIType_opd, setSIType_topup, setSIType_enhance) : setSIType)(15);
            } else if (Number(value) !== 17 && (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance) : siType) === 15) {
              setValue(opd ? (PremiumRater[opd] + '_suminsured_sub_type') : 'si_sub_type', '');
            }
            (opd ? GivePremiumRaterVariable(opd, setPremiumType_opd, setPremiumType_topup, setPremiumType_enhance) : setPremiumType)(prev => Number(value));
            // setPremiumFileUploader(prev => value !== '1');
            return selected;
          }}
        />
        {!!errors[opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type'] && <Error>
          {errors[opd ? (PremiumRater[opd] + '_premium_type') : 'premium_type'].message}
        </Error>}
      </Col>}
    </Row>

    {((!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
      (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) !== 1) ||
      (!!(opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) &&
        (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === 8)) && isNoRule && CollectTax(opd)}

    {(siType === 5 && !opd && [2, 3, 5, 6].includes(Number(savedConfig.policy_sub_type))) &&
      <Row>
        <Col md={6} lg={5} xl={4} sm={12}>
          <Controller
            as={<Input
              label="No of times of salary"
              placeholder="Enter No of times of salary"
              type="number"
              min={0}
              max={99999999}
              isRequired={true}
            />}
            error={errors && errors["no_of_times_of_salary" + opd]}
            name={"no_of_times_of_salary" + opd}
            control={control}
          />
          {!!(opd ? noOfSalary_topup : noOfSalary) && <Error color={'blue'}>{toWords.convert(opd ? noOfSalary_topup : noOfSalary)}</Error>}

        </Col>
        <Col md={6} lg={5} xl={4} sm={12}>
          <Controller
            as={<Input
              label="Lowest SI Limit"
              placeholder="Enter Lowest SI Limit"
              type="number"
              min={0}
              max={99999999}
            />}
            error={errors && errors['min_si_limit' + opd]}
            name={"min_si_limit" + opd}
            control={control}
          />
          {!!(opd ? minSi_topup : minSi) && <Error color={'blue'}>{toWords.convert(opd ? minSi_topup : minSi)}</Error>}

        </Col>
        <Col md={6} lg={5} xl={4} sm={12}>
          <Controller
            as={<Input
              label="Highest SI Limit"
              placeholder="Enter Highest SI Limit"
              type="number"
              min={0}
              max={99999999}
            />}
            error={errors && errors['max_si_limit' + opd]}
            name={"max_si_limit" + opd}
            control={control}
          />
          {!!(opd ? maxSi_topup : maxSi) && <Error color={'blue'}>{toWords.convert(opd ? maxSi_topup : maxSi)}</Error>}

        </Col>
        {
          [2, 3, 5, 6].includes(Number(savedConfig.policy_sub_type)) &&
          <>
            <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
              <Button type="button" onClick={opd ? GivePremiumRaterVariable(opd, null, onAddSalary_topup, onAddSalary_enhance) : AddSalary}>
                <i className="ti ti-plus"></i> Add
              </Button>
            </Col>
            <Col md={12} lg={12} xl={12} sm={12}>
              {(opd ? salarySI_topup : salarySI).length
                ? <BenefitList>
                  {(opd ? salarySI_topup : salarySI).map((item, index) =>
                    <Chip
                      key={index + 'si-isn' + opd ? 'opd' : 'no-opd'}
                      id={item}
                      name={<>
                        {item.no_of_times_of_salary} {(item.min_si_limit && item.min_si_limit !== 0) ?
                          <>{' : ' + String(item.min_si_limit)}<sub>(min)</sub></> : ""} {(item.max_si_limit && item.max_si_limit !== 4294967295) ?
                            <>{' : ' + String(item.max_si_limit)}<sub>(max)</sub></> : ""}
                      </>}
                      //                       name={`${item.no_of_times_of_salary}
                      // ${(item.min_si_limit || item.max_si_limit !== 4294967295) ? (' : ' + String(item.min_si_limit)) : ""}
                      // ${(item.max_si_limit !== 4294967295) ? (' : ' + String(item.max_si_limit)) : ""}`}
                      onDelete={opd ? GivePremiumRaterVariable(opd, null, removeSalary_topup, removeSalary_enhance) : removeSalary} />)}
                </BenefitList>
                : null}
            </Col>
          </>
        }

        <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
          <Controller
            as={
              <Select
                label="Salary Calculate From"
                placeholder="Select Salary Type"
                options={[
                  { id: 'salary_1', name: 'Salary Type 1', value: 'salary_1' },
                  { id: 'salary_2', name: 'Salary Type 2', value: 'salary_2' },
                  { id: 'salary_3', name: 'Salary Type 3', value: 'salary_3' }
                ]}
                error={errors && errors.calculate_eligibility_from}
              />
            }
            control={control}
            name="calculate_eligibility_from"
          />
          {!!errors.calculate_eligibility_from && <Error>
            {errors.calculate_eligibility_from.message}
          </Error>}
        </Col>
      </Row>
    }

    {si_type === 3 && isNoRule &&
      <Row>
        {!!((siType) &&
          (siType) !== 1 &&
          (siType) !== 5) &&
          <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
            <Controller
              as={
                <AttachFile
                  key="in_suminsured_file"
                  name="in_suminsured_file"
                  title={('(Individual) ' + configs.sum_insured_sub_types?.find(({ id }) =>
                    (siType) === id)?.name || '') + " Sum Insured File"}
                  accept=".xls, .xlsx"
                  onUpload={(files) => onUploadFile('in_suminsured_file', files[0])}
                  description="File Formats: xls, xlsx "
                  nameBox
                  defaultFileName={(siFile) ? '' : (filesName?.sumName_in)}
                  required={true}
                  error={errors && errors.suminsured_file}
                />
              }
              name={"in_suminsured_file"}
              control={control}
            // rules={{ required: true }}
            />
            <AnchorTag href={'#'} onClick={() => downloadSISample()}>
              <i
                className="ti-cloud-down attach-i"
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
              ></i>
              <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                Download Sample Format
              </p>
            </AnchorTag>
          </Col>
        }
        {!!((premiumType) &&
          (premiumType) !== 1) &&
          <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
            <Controller
              as={
                <AttachFile
                  name="in_premium_file"
                  title={('(Individual) ' + configs.premium_types?.find(({ id }) =>
                    (premiumType) === id)?.name || '') + " Premium File"}
                  key="in_premium_file"
                  accept=".xls, .xlsx"
                  onUpload={(files) => onUploadFile('in_premium_file', files[0])}
                  description="File Formats: xls, xlsx "
                  nameBox
                  defaultFileName={(premiumFile) ? '' : (filesName?.premName_in)}
                  required={true}
                  error={errors && errors.premium_file}
                />
              }
              name={"in_premium_file"}
              control={control}
            // rules={{ required: true }}
            />
            <AnchorTag href={'#'} onClick={() => downloadPremiumSample()}>
              <i
                className="ti-cloud-down attach-i"
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
              ></i>
              <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                Download Sample Format
              </p>
            </AnchorTag>
          </Col>}
      </Row>
    }

    {isNoRule &&
      <Row>
        {!!((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) &&
          (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) !== 1 &&
          (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) !== 5) &&
          <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
            <Controller
              as={
                <AttachFile
                  key="suminsured_file"
                  name="suminsured_file"
                  title={(opd === '_topup' ? BaseWiseSIPremium_topup : BaseWiseSIPremium) ?
                    "Base Wise SI & Premium File" :
                    ((si_type === 3 ? '(Floater) ' : '') + configs.sum_insured_sub_types?.find(({ id }) =>
                      (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === id)?.name || '') + " Sum Insured File"}
                  accept=".xls, .xlsx"
                  onUpload={(files) => onUploadFile('suminsured_file' + opd, files[0])}
                  description="File Formats: xls, xlsx "
                  nameBox
                  defaultFileName={(opd ? GivePremiumRaterVariable(opd, siFile_opd, siFile_topup, siFile_enhance) : siFile) ? '' : (opd ? GivePremiumRaterVariable(opd, filesName?.sumName_opd, filesName?.sumNametopupm, filesName?.sumNameenhance) : filesName?.sumName)}
                  required={true}
                  error={errors && errors.suminsured_file}
                />
              }
              name={"suminsured_file" + opd}
              control={control}
            // rules={{ required: true }}
            />
            <AnchorTag href={'#'} onClick={() => downloadSISample(opd)}>
              <i
                className="ti-cloud-down attach-i"
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
              ></i>
              <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                Download Sample Format
              </p>
            </AnchorTag>
          </Col>
        }
        {!!((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
          (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) !== 1) &&
          <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
            <Controller
              as={
                <AttachFile
                  name="premium_file"
                  title={((si_type === 3 ? '(Floater) ' : '') + configs.premium_types?.find(({ id }) =>
                    (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === id)?.name || '') + " Premium File"}
                  key="premium_file"
                  accept=".xls, .xlsx"
                  onUpload={(files) => onUploadFile('premium_file' + opd, files[0])}
                  description="File Formats: xls, xlsx "
                  nameBox
                  defaultFileName={(opd ? GivePremiumRaterVariable(opd, premiumFile_opd, premiumFile_topup, premiumFile_enhance) : premiumFile) ? '' : (opd ? GivePremiumRaterVariable(opd, filesName?.premName_opd, filesName?.premName_topup, filesName?.premName_enhance) : filesName?.premName)}
                  required={true}
                  error={errors && errors.premium_file}
                />
              }
              name={"premium_file" + opd}
              control={control}
            // rules={{ required: true }}
            />
            <AnchorTag href={'#'} onClick={() => downloadPremiumSample(opd)}>
              <i
                className="ti-cloud-down attach-i"
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
              ></i>
              <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                Download Sample Format
              </p>
            </AnchorTag>
          </Col>}
      </Row>
    }

    {si_type === 3 && <>
      {((!!(siType) &&
        (siType) === 1) ||
        (!!(premiumType) &&
          (premiumType) === 1)) &&
        GenerateSumInsured('_individual')}

      {((!!(premiumType) &&
        (premiumType) === 1) ||
        (!!(siType) &&
          (siType) === 1)) && <Div className="text-center" >
          <Table
            className="text-center rounded text-nowrap"
            style={{ border: "solid 1px #e6e6e6" }}
            responsive
          >
            <thead>
              <tr>
                {((!!(siType) &&
                  (siType) === 1) ||
                  (!!(premiumType) &&
                    (premiumType) === 1)) &&
                  <th style={style} className="align-top">
                    Sum Insured<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                  </th>}
                {(!!(premiumType) &&
                  (premiumType) === 1) &&
                  <><th style={style} className="align-top">
                    Premium<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                  </th>
                    <th style={style} className="align-top">
                      Premium Tax<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                    </th>
                    <th style={style} className="align-top">
                      Premium Total<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                    </th></>}
                {/* <th style={style} className="align-top">
                Actions
              </th> */}
              </tr>
            </thead>
            <tbody>
              {(ipdFlatInd)?.map(({ id }, index) => {
                const sumInsured = watch('in_sum_insured') || [];
                const premium = watch('in_premium') || [];
                return (
                  <tr key={id + 'expensesin_'}>
                    {
                      <td>
                        <Controller
                          as={
                            <Form.Control
                              className="rounded-lg"
                              size="ms"
                              type='tel'
                              onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                              required
                              maxLength={9}
                              placeholder="Sum Insured"
                            />
                          }
                          name={`${'in_sum_insured'}.${index}`}
                          isInvalid={errors['in_sum_insured'] &&
                            errors['in__sum_insured'][index]}
                          control={control}
                        />
                        {!!(sumInsured[index]) &&
                          <Error top='0' color={'blue'}>{toWords.convert(sumInsured[index])}</Error>}
                      </td>}
                    {(!!(premiumType) &&
                      (premiumType) === 1) && <>
                        <td>
                          <Controller
                            as={
                              <Form.Control
                                className="rounded-lg"
                                size="ms"
                                type='tel'
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                required
                                maxLength={9}
                                placeholder="Premium"
                              />
                            }
                            name={`${'in_premium'}[${index}].amount`}
                            isInvalid={errors['in_premium'] &&
                              errors['in_premium'][index] &&
                              errors['in_premium'][index].amount}
                            control={control}
                          />
                          {!!(premium[index]?.amount) &&
                            <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.amount)}</Error>}

                        </td>
                        <td>
                          <Controller
                            as={
                              <Form.Control
                                className="rounded-lg"
                                size="ms"
                                type='tel'
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                required
                                maxLength={9}
                                placeholder="Premium"
                                onInput={(e) => { calculateTotalPremiumIn(index, e.target.value) }}
                              />
                            }
                            name={`${'in_premium'}[${index}].tax`}
                            isInvalid={errors['in_premium'] &&
                              errors['in_premium'][index] &&
                              errors['in_premium'][index].tax}
                            control={control}
                          />
                          {!!(premium[index]?.tax) &&
                            <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.tax)}</Error>}
                        </td>
                        <td>
                          <Controller
                            as={
                              <Form.Control
                                className="rounded-lg"
                                size="ms"
                                type='tel'
                                onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                                required
                                maxLength={9}
                                placeholder="Total Premium"
                              />
                            }
                            name={`${'in_premium'}[${index}].total_premium`}
                            isInvalid={errors['in_premium'] &&
                              errors['in_premium'][index] &&
                              errors['in_premium'][index].total_premium}
                            control={control}
                          />
                          {!!(premium[index]?.total_premium) &&
                            <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.total_premium)}</Error>}
                        </td>
                      </>}
                    {/* <td>
                    <i
                      className="btn ti-trash text-danger"
                      onClick={() => (opd ? (opd === '_opd' ? removeOpdFlat : removeTopupFlat) : removeIpdFlat)(index)}
                    />
                  </td> */}
                  </tr>
                );
              })}

              <tr>
                <td colSpan="6">
                  {(ipdFlatInd).length < 15 &&
                    <i className="btn ti-plus text-success"
                      onClick={addFormIpdFlatInd} />}
                  {(ipdFlatInd).length > 1 && <i
                    className="btn ti-trash text-danger"
                    onClick={() => (removeIpdFlatInd)()}
                  />}
                </td>
              </tr>
            </tbody>
          </Table>
        </Div>}
    </>}

    {((!!(opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) &&
      (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === 1) ||
      (!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
        (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1)) &&
      GenerateSumInsured(opd)}

    {((!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
      (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1) ||
      (!!(opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) &&
        (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === 1)) && <Div className="text-center" >
        <Table
          className="text-center rounded text-nowrap"
          style={{ border: "solid 1px #e6e6e6" }}
          responsive
        >
          <thead>
            <tr>
              {((!!(opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) &&
                (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_topup, siType_enhance) : siType) === 1) ||
                (!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
                  (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1)) &&
                <th style={style} className="align-top">
                  Sum Insured<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                </th>}
              {(!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
                (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1) &&
                <><th style={style} className="align-top">
                  Premium<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                </th>
                  <th style={style} className="align-top">
                    Premium Tax<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                  </th>
                  <th style={style} className="align-top">
                    Premium Total<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                  </th></>}
              {/* <th style={style} className="align-top">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {(opd ? GivePremiumRaterVariable(opd, opdFlat, topupFlat, enhanceFlat) : ipdFlat)?.map(({ id }, index) => {
              const sumInsured = watch(opd ? ('sum_insured_' + PremiumRater[opd]) : 'sum_insured') || [];
              const premium = watch(opd ? ('premium_' + PremiumRater[opd]) : 'premium') || [];
              return (
                <tr key={id + 'expenses'}>
                  {
                    <td>
                      <Controller
                        as={
                          <Form.Control
                            className="rounded-lg"
                            size="ms"
                            type='tel'
                            onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                            required
                            maxLength={9}
                            placeholder="Sum Insured"
                          />
                        }
                        name={`${opd ? ('sum_insured_' + PremiumRater[opd]) : 'sum_insured'}.${index}`}
                        isInvalid={errors[opd ? ('sum_insured_' + PremiumRater[opd]) : 'sum_insured'] &&
                          errors[opd ? ('sum_insured_' + PremiumRater[opd]) : 'sum_insured'][index]}
                        control={control}
                      />
                      {!!(sumInsured[index]) &&
                        <Error top='0' color={'blue'}>{toWords.convert(sumInsured[index])}</Error>}
                    </td>}
                  {(!!(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) &&
                    (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType) === 1) && <>
                      <td>
                        <Controller
                          as={
                            <Form.Control
                              className="rounded-lg"
                              size="ms"
                              type='tel'
                              onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                              required
                              maxLength={9}
                              placeholder="Premium"
                            />
                          }
                          name={`${opd ? ('premium_' + PremiumRater[opd]) : 'premium'}[${index}].amount`}
                          isInvalid={errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index].amount}
                          control={control}
                        />
                        {!!(premium[index]?.amount) &&
                          <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.amount)}</Error>}

                      </td>
                      <td>
                        <Controller
                          as={
                            <Form.Control
                              className="rounded-lg"
                              size="ms"
                              type='tel'
                              onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                              required
                              maxLength={9}
                              placeholder="Premium"
                              onInput={(e) => { calculateTotalPremium(index, opd, e.target.value) }}
                            />
                          }
                          name={`${opd ? ('premium_' + PremiumRater[opd]) : 'premium'}[${index}].tax`}
                          isInvalid={errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index].tax}
                          control={control}
                        />
                        {!!(premium[index]?.tax) &&
                          <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.tax)}</Error>}
                      </td>
                      <td>
                        <Controller
                          as={
                            <Form.Control
                              className="rounded-lg"
                              size="ms"
                              type='tel'
                              onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                              required
                              maxLength={9}
                              placeholder="Total Premium"
                            />
                          }
                          name={`${opd ? ('premium_' + PremiumRater[opd]) : 'premium'}[${index}].total_premium`}
                          isInvalid={errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index] &&
                            errors[opd ? ('premium_' + PremiumRater[opd]) : 'premium'][index].total_premium}
                          control={control}
                        />
                        {!!(premium[index]?.total_premium) &&
                          <Error top='0' color={'blue'}>{toWords.convert(premium[index]?.total_premium)}</Error>}
                      </td>
                    </>}
                  {/* <td>
                    <i
                      className="btn ti-trash text-danger"
                      onClick={() => (opd ? (opd === '_opd' ? removeOpdFlat : removeTopupFlat) : removeIpdFlat)(index)}
                    />
                  </td> */}
                </tr>
              );
            })}

            <tr>
              <td colSpan="6">
                {(opd ? GivePremiumRaterVariable(opd, opdFlat, topupFlat, enhanceFlat) : ipdFlat).length < 15 &&
                  <i className="btn ti-plus text-success"
                    onClick={opd ? GivePremiumRaterVariable(opd, addFormOpdFlat, addFormTopupFlat, addFormEnhanceFlat) : addFormIpdFlat} />}
                {(opd ? GivePremiumRaterVariable(opd, opdFlat, topupFlat, enhanceFlat) : ipdFlat).length > 1 && <i
                  className="btn ti-trash text-danger"
                  onClick={() => (opd ? GivePremiumRaterVariable(opd, removeOpdFlat, removeTopupFlat, removeEnhanceFlat) : removeIpdFlat)()}
                />}
              </td>
            </tr>
          </tbody>
        </Table>
      </Div>}

    {[11, 12].includes(premiumType) && <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f8f8f8">
      <Text fontSize="0.9rem" color='#ff7070'>
        Note: Parents & Parents in law contribution can be added in premium rate sheet
      </Text>
    </TextCard>}

    {/* Eligibility */}
    {!!eligiblePolicy && <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f8f8f8">
      <Marker />
      <Typography>
        {"\u00A0"} Eligibility Policy{" "}
      </Typography>
      <Row>
        <Col md={6} lg={6} xl={6} sm={12}>
          <Head className='text-center'>Eligibilty Allowed?</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2">
            <CustomControl className="d-flex mt-4 mr-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"No"}</p>
              <input ref={register} name={'top_up_cover_has_eligibility'} type={'radio'} value={0} defaultChecked={savedConfig.top_up_cover_has_eligibility ? Number(savedConfig.top_up_cover_has_eligibility) === 0 : true} />
              <span></span>
            </CustomControl>
            <CustomControl className="d-flex mt-4 ml-0">
              <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Yes"}</p>
              <input ref={register} name={'top_up_cover_has_eligibility'} type={'radio'} value={1} defaultChecked={Number(savedConfig.top_up_cover_has_eligibility) === 1 || false} />
              <span></span>
            </CustomControl>
          </div>
        </Col>
        {Number(top_up_cover_has_eligibility) === 1 &&
          <>
            <Col md={6} lg={6} xl={6} sm={12}>
              <Head className='text-center'>Eligibilty Type?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2">
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Greater Than"}</p>
                  <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={1} defaultChecked={savedConfig.eligibility_cover_type ? Number(savedConfig.eligibility_cover_type) === 1 : true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Less Than"}</p>
                  <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={2} defaultChecked={Number(savedConfig.eligibility_cover_type) === 2 || false} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Equal"}</p>
                  <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={3} defaultChecked={Number(savedConfig.eligibility_cover_type) === 3 || false} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>
            <Col xl={5} lg={8} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="No of time salary"
                    placeholder="Enter No of time salary"
                    type='tel'
                    maxLength={2}
                    onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                    required
                    labelProps={{ background: "#f8f8f8" }}
                    error={
                      errors && errors.no_of_time_salary
                    }
                  />
                }
                defaultValue={'1'}
                // onChange={([e]) => e.target.value ? e : '1'}
                rules={{ required: true, min: 1, max: 100 }}
                control={control}
                name="no_of_time_salary"
              />
              {!!errors.no_of_time_salary && <Error>
                {errors.no_of_time_salary.message}
              </Error>}
            </Col>
            <Col xl={5} lg={8} md={12} sm={12}>
              <Controller
                as={
                  <Select
                    label="Salary Calculate From"
                    placeholder="Select Salary Type"
                    options={[
                      { id: 'salary_1', name: 'Salary Type 1', value: 'salary_1' },
                      { id: 'salary_2', name: 'Salary Type 2', value: 'salary_2' },
                      { id: 'salary_3', name: 'Salary Type 3', value: 'salary_3' }
                    ]}
                    labelProps={{ background: "#f8f8f8" }}
                    error={errors && errors.calculate_eligibility_from}
                  />
                }
                control={control}
                name="calculate_eligibility_from"
              />
              {!!errors.calculate_eligibility_from && <Error>
                {errors.calculate_eligibility_from.message}
              </Error>}
            </Col>
          </>
        }
      </Row>
    </TextCard>}

    {!(ContributionTypeRater.includes(Number((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType)))) && opd !== '_enhance' && isNoRule && <>
      <TabWrapper className='ml-0' width='max-content'>
        <Tab isActive={Boolean(opd ? GivePremiumRaterVariable(opd, tab1, tab2) === "all" : tab === "all")}
          onClick={() => { opd ? GivePremiumRaterVariable(opd, setTab1, setTab2)("all") : setTab("all") }}>Contribution For All</Tab>

        <Tab isActive={Boolean(opd ? GivePremiumRaterVariable(opd, tab1, tab2) === "additional" : tab === "additional")}
          onClick={() => { opd ? GivePremiumRaterVariable(opd, setTab1, setTab2)("additional") : setTab("additional") }}>Additional Premium</Tab>
      </TabWrapper>

      {(opd ? GivePremiumRaterVariable(opd, tab1, tab2) === "all" : tab === "all") && <ContributionAll control={control} errors={errors} opd={opd} />}
      {(opd ? GivePremiumRaterVariable(opd, tab1, tab2) === "additional" : tab === "additional") && <AdditionalPremium
        opd_ipd={opd_ipd}
        premiumType={opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_topup, premiumType_enhance) : premiumType}
        configs={configs} savedConfig={savedConfig} register={register}
        control={control} errors={errors}
        opd={opd} watch={watch} />}
    </>}
  </>)

  return (
    (configs
      && configs.sum_insured_types)
      ? (
        <Wrapper>
          <Title>
            <h4>
              <span className="dot-xd"></span>
              SI &amp; Premium
            </h4>
          </Title>
          <FormWrapper>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {Number(savedConfig.policy_sub_type) === 1 &&
                  <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
                    <Controller
                      as={
                        <Select
                          label="Cover Type"
                          placeholder="Select Cover Type"
                          options={configs.policy_rater_type
                            .map(item => ({
                              id: item.id,
                              name: item.name,
                              value: item.id
                            }))}
                          error={errors && errors.policy_rater_type_id}
                        />
                      }
                      onChange={([selected]) => {
                        const target = selected.target;
                        const value = target ? target.value : '';
                        setopd_ipd(Number(value));
                        return selected;
                      }}
                      control={control}
                      name="policy_rater_type_id"
                    />
                    {!!errors.policy_rater_type_id && <Error>
                      {errors.policy_rater_type_id.message}
                    </Error>}
                  </Col>
                }
                {(opd_ipd === 2) &&
                  <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
                    <Controller
                      as={
                        <Select
                          label="Parent IPD Policy"
                          placeholder="Select Parent IPD Policy"
                          options={ipdPolicies.map(item => ({
                            id: item.id,
                            name: item.policy_name + ':' + item.policy_number,
                            value: item.id
                          }))}
                          error={errors && errors.base_ipd_policy_id}
                        />
                      }
                      required={false}
                      control={control}
                      name="base_ipd_policy_id"
                    />
                    {!!errors.base_ipd_policy_id && <Error>
                      {errors.base_ipd_policy_id.message}
                    </Error>}
                  </Col>}

                {!!savedConfig.is_parent_policy && Number(savedConfig.policy_sub_type) <= 3 &&
                  <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
                    <Controller
                      as={
                        <Select
                          label="Parents Base Policy"
                          placeholder="Select Parents Base Policy"
                          options={masterPolicy?.map(item => ({
                            id: item.id,
                            name: item.policy_name + ':' + item.policy_number,
                            value: item.id
                          }))}
                          error={errors && errors.parent_base_policy_id}
                        />
                      }
                      required={false}
                      control={control}
                      name="parent_base_policy_id"
                    />
                    {!!errors.parent_base_policy_id && <Error>
                      {errors.parent_base_policy_id.message}
                    </Error>}
                  </Col>}
              </Row>
              {/* {![2].includes(opd_ipd) && <> */}
              {([3, 4].includes(opd_ipd)) && <>
                <Marker />
                <Typography>{'\u00A0'} IPD</Typography>
              </>}
              {PremiumForm()}
              {/* </>} */}
              {([3/* , 2 */].includes(opd_ipd)) && <>
                <><Marker />
                  <Typography className='mt-5'>{'\u00A0'} OPD</Typography> </>
                {PremiumForm('_opd')}
              </>}
              {(opd_ipd === 4) && <>
                <><Marker />
                  <Typography className='mt-5'>{'\u00A0'} Topup</Typography> </>
                {PremiumForm('_topup')}
              </>}
              {(opd_ipd === 5) && <>
                <><Marker />
                  <Typography className='mt-5'>{'\u00A0'} Enhance</Typography> </>
                {PremiumForm('_enhance')}
              </>}

              <Row>
                {!!savedConfig?.has_special_child &&
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <AccordionWrapper>
                      <CustomAccordion id="contribution-all" defaultOpen>
                        <AccordionHeader>
                          <Heading>{`Special Child Contribution`}</Heading>
                        </AccordionHeader>
                        <AccordionContent>
                          <Row>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Premium"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    required
                                    error={errors && errors.special_child_additional_premium}
                                  />
                                }
                                name={`special_child_additional_premium`}
                                control={control}
                                rules={{ required: true }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employer%"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    required
                                    error={errors && errors.special_child_employer_premium}
                                  />
                                }
                                name={`special_child_employer_premium`}
                                control={control}
                                rules={{ required: true }}
                              />
                            </Col>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employee%"
                                    placeholder="ex 40"
                                    type="number"
                                    min={0}
                                    required
                                    noWrapper
                                    error={errors && errors.special_child_employee_premium}
                                  />
                                }
                                name={`special_child_employee_premium`}
                                control={control}
                                rules={{ required: true }}
                              />
                            </Col>
                          </Row>
                        </AccordionContent>
                      </CustomAccordion>
                    </AccordionWrapper>
                  </Col>
                }
                {!!savedConfig?.has_unmarried_child &&
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <AccordionWrapper>
                      <CustomAccordion id="unmarried_child" defaultOpen>
                        <AccordionHeader>
                          <Heading>{`Unmarried Child Contribution`}</Heading>
                        </AccordionHeader>
                        <AccordionContent>
                          <Row>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Premium"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    required

                                  />
                                }
                                error={errors && errors['unmarried_child_premium']}
                                name={'unmarried_child_premium'}
                                control={control}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employer%"
                                    placeholder="ex 40"
                                    type="number"
                                    noWrapper
                                    min={0}
                                    max={100}
                                    required
                                  />
                                }
                                error={errors && errors['unmarried_child_employer_premium']}
                                name={'unmarried_child_employer_premium'}
                                control={control}
                              />
                            </Col>
                            <Col>
                              <Controller
                                as={
                                  <Input
                                    label="Employee%"
                                    placeholder="ex 40"
                                    type="number"
                                    min={0}
                                    max={100}
                                    required
                                    noWrapper
                                  />
                                }
                                error={errors && errors['unmarried_child_employee_premium']}
                                name={'unmarried_child_employee_premium'}
                                control={control}
                              />
                            </Col>
                          </Row>
                        </AccordionContent>
                      </CustomAccordion>
                    </AccordionWrapper>
                  </Col>}
              </Row>

              {/* {savedConfig?.ages.some(e => e?.is_special_member_allowed === true) &&
                <>
                  <Marker />
                  <Typography>{'\u00A0'} Special Members</Typography>
                  <Row>
                    {savedConfig?.ages.map((contri, index) =>
                      (Number(contri?.relation_id) !== 1 && contri?.is_special_member_allowed) &&
                      (
                        <Col key={`${contri?.relation_id}-contri`} xl={4} lg={4} md={6} sm={12}>
                          <AccordionWrapper>
                            <CustomAccordion id="contribution-all" defaultOpen>
                              <AccordionHeader>
                                <Heading>{`${configs?.relations.find((elem) => elem.id === Number(contri?.relation_id))?.name || 'Self'} Contribution`}</Heading>
                              </AccordionHeader>
                              <AccordionContent>
                                <Row>
                                  <Col>
                                    <Controller
                                      as={
                                        <Input
                                          label="Premium"
                                          placeholder="ex 40"
                                          type="number"
                                          noWrapper
                                          min={0}
                                          required
                                          error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["special_member_additional_premium"]}
                                        />
                                      }
                                      name={`ages[${index}].special_member_additional_premium`}
                                      control={control}
                                      rules={{ required: true }}
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <Controller
                                      as={
                                        <Input
                                          label="Employer%"
                                          placeholder="ex 40"
                                          type="number"
                                          noWrapper
                                          min={0}
                                          required
                                          error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["special_member_employer_contribution"]}
                                        />
                                      }
                                      name={`ages[${index}].special_member_employer_contribution`}
                                      control={control}
                                      rules={{ required: true }}
                                    />
                                  </Col>
                                  <Col>
                                    <Controller
                                      as={
                                        <Input
                                          label="Employee%"
                                          placeholder="ex 40"
                                          type="number"
                                          min={0}
                                          required
                                          noWrapper
                                          error={errors && errors["ages"] && errors["ages"][`${index}`] && errors["ages"][`${index}`]["special_member_employee_contribution"]}
                                        />
                                      }
                                      name={`ages[${index}].special_member_employee_contribution`}
                                      control={control}
                                      rules={{ required: true }}
                                    />
                                  </Col>
                                </Row>
                              </AccordionContent>
                            </CustomAccordion>
                          </AccordionWrapper>
                          <Controller
                            as={
                              <input
                                type="hidden"
                                value={contri?.relation_id}
                              />
                            }
                            defaultValue={contri?.relation_id}
                            name={`ages[${index}].relation_id`}
                            control={control}
                          />
                        </Col>
                      )
                    )}
                  </Row>
                </>
              } */}
              <Row>
                <Col xl={4} lg={4} md={6} sm={12}>
                  <Controller
                    as={
                      <Checkbox
                        label="Flex"
                        placeholder="Use Flex"
                      />
                    }
                    control={control}
                    name="has_flex"
                    valueName="checked"
                    onChange={([ev]) => ev.target.checked}
                  />
                </Col>
                <Col xl={4} lg={4} md={6} sm={12}>
                  <Controller
                    as={
                      <Checkbox
                        label="Payroll"
                        placeholder="Use Payroll"
                      />
                    }
                    control={control}
                    name="has_payroll"
                    valueName="checked"
                    onChange={([ev]) => ev.target.checked}
                  />
                </Col>
                {/* {!!(isPayroll && (topup_policy || opd_ipd === 4)) && */}
                {!!(isPayroll) &&
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                      as={
                        <Checkbox
                          label="Installment Allowed"
                          placeholder="Installment Allowed from Payroll"
                        />
                      }
                      control={control}
                      name="installment_allowed"
                      valueName="checked"
                      onChange={([ev]) => ev.target.checked}
                    />
                  </Col>
                }
              </Row>
              {!!(isPayroll && allowedInstallment) && <Row className="mt-2">
                <Col xl={4} lg={4} md={6} sm={12} className="mb-4">
                  <Head className="text-center">Installment Type</Head>
                  <div
                    className="d-flex justify-content-around flex-wrap"
                    style={{ margin: "0 47px 29px -60px" }}
                  >
                    <CustomControl className="d-flex mt-4 mr-0">
                      <p
                        style={{
                          fontWeight: "600",
                          paddingLeft: "27px",
                          marginBottom: "0px",
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {"Policy-Wise"}
                      </p>
                      <input
                        ref={register}
                        name={"installment_level"}
                        type={"radio"}
                        value={0}
                        defaultChecked={savedConfig.installment_level ? savedConfig.installment_level === '0' : (employerInstallment?.length ? employerInstallment.every(({ installment_level }) => installment_level === 0) : true)}
                        onChange={(e) => validateInstalment(e, employerInstallment, setValue)}
                      />
                      <span></span>
                    </CustomControl>
                    <CustomControl className="d-flex mt-4 ml-0">
                      <p
                        style={{
                          fontWeight: "600",
                          paddingLeft: "27px",
                          marginBottom: "0px",
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {"Enitity-Wise"}
                      </p>
                      <input
                        ref={register}
                        name={"installment_level"}
                        type={"radio"}
                        value={1}
                        defaultChecked={savedConfig.installment_level ? savedConfig.installment_level === '1' : (employerInstallment?.length ? employerInstallment.every(({ installment_level }) => installment_level === 1) : false)}
                        onChange={(e) => validateInstalment(e, employerInstallment, setValue)}
                      />
                      <span></span>
                    </CustomControl>
                  </div>
                </Col>
                <Col xl={4} lg={4} md={6} sm={12} className='my-auto'>
                  <Controller
                    as={<Input
                      label="Monthly equitable period"
                      placeholder="Enter period in month"
                      type="tel"
                      onKeyDown={numOnly} onKeyPress={noSpecial}
                      maxLength={2}
                    />}
                    // error={errors && errors.no_of_times_of_salary}
                    name={"installment_period"}
                    control={control}
                  />
                </Col>
                <Col xl={4} lg={4} md={6} sm={12} className="d-flex align-items-center">
                  <Button type="button" onClick={onAddInstallmemts}>
                    <i className="ti ti-plus"></i> Add
                  </Button>
                </Col>
                <Col md={12} lg={12} xl={12} sm={12}>
                  {installment_periods.length
                    ? <BenefitList>
                      {installment_periods.map((period, index) =>
                        <Chip
                          key={index + 'installment_periods'}
                          id={period}
                          name={`${period} month`}
                          onDelete={removeInstallmemts} />)}
                    </BenefitList>
                    : null}
                </Col>
                {validateInstalmentNote(installment_level, employerInstallment) && <Col md={12} lg={12} xl={12} sm={12}>
                  <Text fontSize="0.9rem" color="#007bff">
                    Note: {validateInstalmentNote(installment_level, employerInstallment)}
                  </Text>
                </Col>}
              </Row>}

            </form>
          </FormWrapper>
        </Wrapper >
      )
      : null
  )
}

export default PremiumDetails;
