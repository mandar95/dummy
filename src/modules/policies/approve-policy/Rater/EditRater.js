import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import swal from 'sweetalert';

import { Button, Input, Chip, Typography, Marker, Head, Error, Select as ComponentSelect } from "components";
import { Row, Col, Form, Button as Btn } from 'react-bootstrap';
import Select from "modules/user-management/Onboard/Select/Select";
import { AttachFile } from 'modules/core'
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import { AnchorTag } from 'modules/policies/steps/premium-details/styles';
import { InputWrapper, FormWrapper, BenefitList } from '../../steps/additional-details/styles';
import { Card as TextCard, Title } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from '../../approve-policy/style';

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { sampleFile, clearSampleURL, approvePolicy, editPolicy, loadBaseWiseSiPrSheet } from '../approve-policy.slice';
import { loadIpdPolicies, validateTopup } from '../../policy-config.slice';
import { downloadFile } from 'utils';
import { numOnly, noSpecial, toWords, numOnlyWithPoint } from '../../../../utils';
import { Tab, TabWrapper } from '../../../../components';
import { ViewPlan } from '../../steps/additional-details/additional-cover';
import { CreatePlan } from '../../steps/additional-details/create-plan';
import { validateInstalment, validateInstalmentNote } from '../../helper';
import { ContributionTypeRater } from '../../steps/premium-details/premium-details';

const Permily$Relation = [5, 6, 7, 17];
const style = { zoom: '0.9' }

const doesExist = (arrayList = [], valueToCompare, type) => {
  switch (type) {
    case 'si': return arrayList.some((value) => value === valueToCompare);
    case 'pr': return arrayList.some(({ amount }) => amount === valueToCompare);
    case 'slr': return arrayList.some(({ no_of_times_of_salary }) => no_of_times_of_salary === Number(valueToCompare));
    default: return false
  }
}

const PremiumRater = {
  _opd: 'opd',
  _topup: 'topup',
  _enhance: 'enhance'
}

const GivePremiumRaterVariable = (type, opd_variable, enhance_variable, individual_variable) => {
  switch (type) {
    case '_opd': return opd_variable
    // case '_topup': return topup_variable
    case '_enhance': return enhance_variable
    case '_ind': return individual_variable

    default: return opd_variable
  }
}


export const EditRater = ({ options, policyData, SalaryType }) => {

  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const { control, reset, handleSubmit, watch, setValue, register, errors } = useForm({
    defaultValues: {
      ...policyData,
      top_up_cover_has_eligibility: String(policyData.top_up_cover_has_eligibility || 0),
      eligibility_cover_type: String(policyData.eligibility_cover_type || 1),
      installment_level: String(policyData.installment_level || 0)
    }
  });
  const [premiumFile, setPremiumFile] = useState(null);
  const [siFile, setSIFile] = useState(null);
  const [premiumFile_ind, setPremiumFile_ind] = useState(null);
  const [siFile_ind, setSIFile_ind] = useState(null);
  const [premiumFile_opd, setPremiumFile_opd] = useState(null);
  const [siFile_opd, setSIFile_opd] = useState(null);
  const [premiumFile_enhance, setPremiumFile_enhance] = useState(null);
  const [siFile_enhance, setSIFile_enhance] = useState(null);
  const [benefits, setBenefits] = useState((Array.isArray(policyData?.benefits) && policyData?.benefits?.map((ben) => { return { label: ben.name, limit: ben.deductiable } })) || []);
  const [installment_periods, setInstallment_periods] = useState(policyData?.installment.map(({ installment }) => installment) || []);
  const [premiumAmounts, setPremiumAmounts] = useState((policyData.policy_rater_type_id === 2 ?
    Array.isArray(policyData?.opd_premiums) && policyData?.opd_premiums :
    Array.isArray(policyData?.premiums) && policyData?.premiums) || []);
  const [siAmounts, setSIAmounts] = useState((policyData.policy_rater_type_id === 2 ?
    Array.isArray(policyData?.opd_suminsureds) && policyData?.opd_suminsureds?.map(({ sum_insured }) => sum_insured) :
    Array.isArray(policyData?.sum_insureds) && policyData?.sum_insureds?.map(({ sum_insured }) => sum_insured)) || []);

  const [premiumAmounts_ind, setPremiumAmounts_ind] = useState((Array.isArray(policyData?.premiums) && policyData?.premiums) || []);
  const [siAmounts_ind, setSIAmounts_ind] = useState((Array.isArray(policyData?.sum_insureds) && policyData?.sum_insureds?.map(({ sum_insured }) => sum_insured)) || []);
  const [premiumAmounts_opd, setPremiumAmounts_opd] = useState((policyData.policy_rater_type_id === 3 && Array.isArray(policyData?.opd_premiums) && policyData?.opd_premiums) || []);
  const [siAmounts_opd, setSIAmounts_opd] = useState((policyData.policy_rater_type_id === 3 && Array.isArray(policyData?.opd_suminsureds) && policyData?.opd_suminsureds?.map(({ sum_insured }) => sum_insured)) || []);
  const [premiumAmounts_enhance, setPremiumAmounts_enhance] = useState((policyData.policy_rater_type_id === 5 && Array.isArray(policyData?.enhance_premiums) && policyData?.enhance_premiums) || []);
  const [siAmounts_enhance, setSIAmounts_enhance] = useState((policyData.policy_rater_type_id === 5 && Array.isArray(policyData?.enhance_suminsureds) && policyData?.enhance_suminsureds?.map(({ sum_insured }) => sum_insured)) || []);
  const { sampleURL } = useSelector(approvePolicy);
  const { ipdPolicies, masterPolicy, employerInstallment } = useSelector(state => state.policyConfig);
  const { userType } = useSelector(state => state.login);
  const [showForm, setShowForm] = useState(!!policyData?.benefits?.length);
  const [salarySI, setSalary] = useState(policyData?.salary || []);
  const [tab, setTab] = useState((policyData.is_flex_policy && String(policyData.benefits_type || '1')) || "1");
  const [planData, setPlanData] = useState([2, 3, 4].includes(policyData.benefits_type) && policyData.benefits?.length ?
    policyData.benefits.map((elem) => ({
      ...elem, construct: elem.construct.map(({ relation_id }) => relation_id)
    })) : []);
  const [planModal, setPlanModal] = useState(false);
  const [packageModal, setPackageModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);

  const _policyconfigData = useSelector(state => state.policyConfig);

  const label = watch('label');
  const limit = Number(watch('limit'));
  const premiumType = Number(watch('premium_type_id'));
  const siType = Number(watch('sum_insured_sub_type_id'));
  const premiumType_opd = Number(watch('opd_premium_type_id'));
  const siType_opd = Number(watch('opd_suminsured_sub_type_id'));
  const premiumType_enhance = Number(watch('enhance_premium_type_id'));
  const siType_enhance = Number(watch('enhance_suminsured_sub_type_id'));
  const policy_rater_type_id = Number(watch('policy_rater_type_id'));
  const installment_level = Number(watch('installment_level'));


  const BaseWiseSIPremium = siType === 8;
  // let BaseWiseSIPr_topup = siType_opd === 8;
  let isNoRule = (siType !== 16 && premiumType !== 18)

  const sum_insured_type_id = Number(watch('sum_insured_type_id'));
  const isPayroll = !!Number(watch('has_payroll'));
  const allowedInstallment = !!Number(watch('is_installment_allowed'));
  const installmentPeriod = Number(watch('installment_period'));

  const maxSi = watch('max_si_limit')
  const minSi = watch('min_si_limit')
  const noOfSalary = watch('no_of_times_of_salary')

  // ipd
  const preAmt = Number(watch('pre_amt'));
  const preTax = Number(watch('pre_tax'));
  const preTotal = Number(watch('pre_total'));
  const siAmt = Number(watch('si_amt'));

  const preAmt_ind = Number(watch('pre_amt_ind'));
  const preTax_ind = Number(watch('pre_tax_ind'));
  const preTotal_ind = Number(watch('pre_total_ind'));
  const siAmt_ind = Number(watch('si_amt_ind'));

  // opd
  const preAmt_opd = Number(watch('pre_amt_opd'));
  const preTax_opd = Number(watch('pre_tax_opd'));
  const preTotal_opd = Number(watch('pre_total_opd'));
  const siAmt_opd = Number(watch('si_amt_opd'));

  // enhance
  const preAmt_enhance = Number(watch('pre_amt_enhance'));
  const preTax_enhance = Number(watch('pre_tax_enhance'));
  const preTotal_enhance = Number(watch('pre_total_enhance'));
  const siAmt_enhance = Number(watch('si_amt_enhance'));

  const topup_policy = policyData.topup_master_policy_id && Number(policyData.policy_type_id) === 2;
  const flexi = !!policyData.is_flex_policy;

  const premium_tax_type = Number(watch('premium_tax_type'));
  const premium_tax_type_opd = Number(watch('premium_tax_type_opd'));
  const premium_tax_type_enhance = Number(watch('premium_tax_type_enhance'));
  // const premium_tax_type_topup = Number(watch('premium_tax_type_topup'));

  // Eligibilty
  const top_up_cover_has_eligibility = watch(
    "top_up_cover_has_eligibility"
  );
  const eligiblePolicy = [5, 6].includes(Number(policyData.policy_sub_type_id)) &&
    premiumType && siType === 1;



  // calculate total prem
  useEffect(() => {
    if (preAmt && preTax) {
      const total = (preAmt) + (preAmt * preTax / 100)
      setValue('pre_total', String(total).includes('.') ? total.toFixed(2) : total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preAmt, preTax])

  // calculate total prem ind
  useEffect(() => {
    if (preAmt_ind && preTax_ind) {
      const total = (preAmt_ind) + (preAmt_ind * preTax_ind / 100)
      setValue('pre_total_ind', String(total).includes('.') ? total.toFixed(2) : total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preAmt_ind, preTax_ind])

  // calculate total prem opd
  useEffect(() => {
    if (preAmt_opd && preTax_opd) {
      const total = (preAmt_opd) + (preAmt_opd * preTax_opd / 100)
      setValue('pre_total_opd', String(total).includes('.') ? total.toFixed(2) : total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preAmt_opd, preTax_opd])

  // calculate total prem enhance
  useEffect(() => {
    if (preAmt_enhance && preTax_enhance) {
      const total = (preAmt_enhance) + (preAmt_enhance * preTax_enhance / 100)
      setValue('pre_total_enhance', String(total).includes('.') ? total.toFixed(2) : total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preAmt_enhance, preTax_enhance])

  // prefill data
  useEffect(() => {
    if (!(_.isEmpty(policyData))) {
      reset({
        ...policyData,
        top_up_cover_has_eligibility: String(policyData.top_up_cover_has_eligibility || 0),
        eligibility_cover_type: String(policyData.eligibility_cover_type || 1),
        installment_level: String(policyData.installment_level || 0)
      })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData])

  // reset if BaseWiseSIPremium
  useEffect(() => {
    if (topup_policy && BaseWiseSIPremium && siType) {

      setValue('premium_type_id', '')

    }
    if (!topup_policy && BaseWiseSIPremium) {

      setValue('sum_insured_sub_type_id', '')
      setValue('premium_type_id', '')

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData, BaseWiseSIPremium])


  // download sample file
  useEffect(() => {
    if (sampleURL || _policyconfigData?.sampleURL) {
      downloadFile(sampleURL || _policyconfigData?.sampleURL);
    }

    return (() => { dispatch(clearSampleURL()) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleURL, _policyconfigData?.sampleURL, dispatch])

  // fetch ipd policies
  useEffect(() => {
    if (policy_rater_type_id === 2) {
      dispatch(loadIpdPolicies({
        employer: policyData.employer_id,
        policy_sub_type: policyData.policy_sub_type_id
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_rater_type_id])

  // default set rater as ipd
  useEffect(() => {
    if (policyData.policy_sub_type_id !== 1) {
      setValue('policy_rater_type_id', 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData])

  // readjust flat si-pr length
  useEffect(() => {
    if ((premiumType && premiumType === 1) && (siType && (siType === 1 || premiumType === 1))) {
      const minIpdFlat = Math.min(premiumAmounts.length, siAmounts.length);
      setSIAmounts(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minIpdFlat;
        return prevCopy;
      })
      setPremiumAmounts(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minIpdFlat;
        return prevCopy;
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumType, siType])

  // readjust flat si-pr length opd
  useEffect(() => {
    if (premiumType_opd && premiumType_opd === 1 && siType_opd && siType_opd === 1 && policy_rater_type_id === 3) {

      const minOpdFlat = Math.min(premiumAmounts_opd.length, siAmounts_opd.length);
      setSIAmounts_opd(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minOpdFlat;
        return prevCopy;
      })
      setPremiumAmounts_opd(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minOpdFlat;
        return prevCopy;
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumType_opd, siType_opd, policy_rater_type_id])

  // readjust flat si-pr length enhance
  useEffect(() => {
    if (premiumType_enhance && premiumType_enhance === 1 && siType_enhance && siType_enhance === 1 && policy_rater_type_id === 5) {

      const minEnhanceFlat = Math.min(premiumAmounts_enhance.length, siAmounts_enhance.length);
      setSIAmounts_enhance(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minEnhanceFlat;
        return prevCopy;
      })
      setPremiumAmounts_enhance(prev => {
        const prevCopy = [...prev];
        prevCopy.length = minEnhanceFlat;
        return prevCopy;
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premiumType_enhance, siType_enhance, policy_rater_type_id])

  // parents base policy
  useEffect(() => {
    if (policyData.is_parent_policy && Number(policyData.policy_sub_type_id) <= 3) {
      dispatch(validateTopup({
        employer: policyData.employer_id,
        policy_sub_type: Number(policyData.policy_sub_type_id) + 3,
        // ...(broker_id && { broker_id: broker_id })
      }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (policyData.parent_base_policy_id && masterPolicy.length) {
      setValue('parent_base_policy_id', policyData.parent_base_policy_id)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicy])


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

  const removeInstallmemts = index => {
    const filteredInstallment_periods = installment_periods.filter((_, item) => item !== index);
    setInstallment_periods([...filteredInstallment_periods]);
  }


  const addBenefit = benefit => {
    let flag = false;
    if (benefits.length)
      flag = benefits.some((value) => value.label === benefit.label)

    if (!flag)
      setBenefits(prev => [...prev, benefit]);

  };

  const removeBenefit = index => {
    const filteredBenefits = benefits.filter((_, item) => item !== index);
    setBenefits(prev => [...filteredBenefits]);
    setValue('label', '')
    setValue('limit', '')
  };


  const onRemovePlan = (id) => {
    let BillCopy = _.cloneDeep(planData);
    BillCopy.splice(id, 1);
    setPlanData(BillCopy)
  }

  const removePremiumAmount = index => {
    const filteredPremiumAmount = premiumAmounts.filter((_, item) => item !== index);
    setPremiumAmounts([...filteredPremiumAmount]);
    setValue('pre_amt', '')
    setValue('pre_tax', '')
    setValue('pre_total', '')
  };

  const removeSIAmount = index => {
    const filteredSIAmount = siAmounts.filter((_, item) => item !== index);
    setSIAmounts([...filteredSIAmount]);
    setValue('si_amt', '')
  };

  const removePremiumAmount_ind = index => {
    const filteredPremiumAmount = premiumAmounts_ind.filter((_, item) => item !== index);
    setPremiumAmounts_ind([...filteredPremiumAmount]);
    setValue('pre_amt_ind', '')
    setValue('pre_tax_ind', '')
    setValue('pre_total_ind', '')
  };

  const removeSIAmount_ind = index => {
    const filteredSIAmount = siAmounts_ind.filter((_, item) => item !== index);
    setSIAmounts([...filteredSIAmount]);
    setValue('si_amt_ind', '')
  };


  const removePremiumAmount_opd = index => {
    const filteredPremiumAmount = premiumAmounts_opd.filter((_, item) => item !== index);
    setPremiumAmounts_opd([...filteredPremiumAmount]);
    setValue('pre_amt_opd', '')
    setValue('pre_tax_opd', '')
    setValue('pre_total_opd', '')
  };

  const removeSIAmount_opd = index => {
    const filteredSIAmount = siAmounts_opd.filter((_, item) => item !== index);
    setSIAmounts_opd([...filteredSIAmount]);
    setValue('si_amt_opd', '')
  };

  const removePremiumAmount_enhance = index => {
    const filteredPremiumAmount = premiumAmounts_enhance.filter((_, item) => item !== index);
    setPremiumAmounts_enhance([...filteredPremiumAmount]);
    setValue('pre_amt_enhance', '')
    setValue('pre_tax_enhance', '')
    setValue('pre_total_enhance', '')
  };

  const removeSIAmount_enhance = index => {
    const filteredSIAmount = siAmounts_enhance.filter((_, item) => item !== index);
    setSIAmounts_enhance([...filteredSIAmount]);
    setValue('si_amt_enhance', '')
  };


  const downloadPremiumSample = (opd) => {
    const switchCondition = opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType;
    if (switchCondition) {
      switch (switchCondition) {
        case 2:
          dispatch(sampleFile(8));
          break;
        case 3:
          dispatch(sampleFile(9));
          break;
        case 4:
          dispatch(sampleFile(10));
          break;
        case 5:
          dispatch(sampleFile(11));
          break;
        case 6:
          dispatch(sampleFile(12));
          break;
        case 7:
          dispatch(sampleFile(13));
          break;
        case 8:
          dispatch(sampleFile(8));
          break;
        case 9:
          dispatch(sampleFile(35));
          break;
        case 10:
          dispatch(sampleFile(52));
          break;
        case 11:
          dispatch(sampleFile(61));
          break;
        case 12:
          dispatch(sampleFile(62));
          break;
        case 13:
          dispatch(sampleFile(60));
          break;
        case 14:
          dispatch(sampleFile(65));
          break;
        case 15:
          dispatch(sampleFile(69));
          break;
        case 16:
          dispatch(sampleFile(71));
          break;
        case 17:
          dispatch(sampleFile(73));
          break;
        case 19:
          dispatch(sampleFile(74));
          break;
        case 20:
          dispatch(sampleFile(77));
          break;
        case 21:
          dispatch(sampleFile(79));
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
    const switchCondition = opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance) : siType;
    if (switchCondition) {
      switch (switchCondition) {
        case 2:
          dispatch(sampleFile(5));
          break;
        case 3:
          dispatch(sampleFile(6));
          break;
        case 4:
          dispatch(sampleFile(7));
          break;
        case 6:
          dispatch(sampleFile(48));
          break;
        case 7:
          dispatch(sampleFile(51));
          break;
        case 8:
          // dispatch(loadBaseWiseSiPrSheet({ policy_id: policyData.topup_master_policy_id }));
          dispatch(loadBaseWiseSiPrSheet({ policy_id: policyData.topup_master_policy_ids[0]?.policy_id }));
          break;
        case 9:
          dispatch(sampleFile(59));
          break;
        case 10:
          dispatch(sampleFile(66));
          break;
        case 11:
          dispatch(sampleFile(67));
          break;
        case 12:
          dispatch(sampleFile(64));
          break;
        case 13:
          dispatch(sampleFile(68));
          break;
        case 14:
          dispatch(sampleFile(70));
          break;
        case 15:
          dispatch(sampleFile(72));
          break;
        case 17:
          dispatch(sampleFile(75));
          break;
        case 18:
          dispatch(sampleFile(78));
          break;
        case 20:
          dispatch(sampleFile(76));
          break;
        default:
          swal("Sorry", "No sample file format available.", "info");
          break;
      }
    } else {
      swal("Sorry", "No sample file format available.", "info");
    }
  };

  const onChange = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setShowForm(checked);
    return selected;
  };

  const onAddLabel = () => {
    if (Number(limit) < 0) {
      swal("Validation", "benefit amount should be positive", "info");
      return;
    }
    if (label) {
      addBenefit({ label, limit });
      setValue('label', '');
      setValue('limit', '');
    }
  };

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
${minSi ? `Lowest SI Limit: ₹${minSi} (${toWords.convert(minSi)})` : ''}
${maxSi ? `Highest SI Limit: ₹${maxSi} (${toWords.convert(maxSi)})` : ''}`)
      } else {
        swal('Already Exist', 'Similar no of time salary already added')
      }
    }
    else {
      swal('Validation', 'No of times of salary Required')
    }
    //!doesExist(salary, { noOfSalary, maxSi, minSi }, 'slr'))
  }

  const onAddPremium = ({ noAlert = false }) => {
    if (Number(preAmt) < 0) {
      swal("Validation", "Premium amount should be positive", "info");
      return;
    }
    if (Number(preTax) < 0) {
      swal("Validation", "Premium tax should be positive", "info");
      return;
    }
    if (Number(preTotal) < 0) {
      swal("Validation", "Premium total should be positive", "info");
      return;
    }
    if (preAmt || Number(preAmt) >= 0) {
      // let flag = false;
      // if (premiumAmounts.length)
      // flag = doesExist(premiumAmounts, preAmt, 'pr')

      // if (!flag) {
      setPremiumAmounts(prev => [...prev, { amount: preAmt, tax: preTax || 0, total_premium: preTotal || 0 }]);
      setValue('pre_amt', '')
      setValue('pre_tax', '')
      setValue('pre_total', '')
      !noAlert && swal('Premium Added',
        `Premium: ₹${preAmt} (${toWords.convert(preAmt)})
Tax: ${preTax}% (${toWords.convert(preTax)})
Total: ₹${preTotal} (${toWords.convert(preTotal)})`)
      // } else {
      //   swal('Already Exist', 'Same premium already added')
      // }
    }
  };

  const onAddPremium_ind = ({ noAlert = false }) => {
    if (Number(preAmt_ind) < 0) {
      swal("Validation", "Premium amount should be positive", "info");
      return;
    }
    if (Number(preTax_ind) < 0) {
      swal("Validation", "Premium tax should be positive", "info");
      return;
    }
    if (Number(preTotal_ind) < 0) {
      swal("Validation", "Premium total should be positive", "info");
      return;
    }
    if (preAmt_ind || Number(preAmt_ind) >= 0) {
      // let flag = false;
      // if (premiumAmounts.length)
      // flag = doesExist(premiumAmounts, preAmt, 'pr')

      // if (!flag) {
      setPremiumAmounts_ind(prev => [...prev, { amount: preAmt_ind, tax: preTax_ind || 0, total_premium: preTotal_ind || 0 }]);
      setValue('pre_amt_ind', '')
      setValue('pre_tax_ind', '')
      setValue('pre_total_ind', '')
      !noAlert && swal('Premium Added',
        `Premium: ₹${preAmt_ind} (${toWords.convert(preAmt_ind)})
Tax: ${preTax_ind}% (${toWords.convert(preTax_ind)})
Total: ₹${preTotal_ind} (${toWords.convert(preTotal_ind)})`)
      // } else {
      //   swal('Already Exist', 'Same premium already added')
      // }
    }
  };


  const onAddPremium_opd = ({ noAlert = false }) => {
    if (Number(preAmt_opd) < 0) {
      swal("Validation", "Premium amount should be positive", "info");
      return;
    }
    if (Number(preTax_opd) < 0) {
      swal("Validation", "Premium tax should be positive", "info");
      return;
    }
    if (Number(preTotal_opd) < 0) {
      swal("Validation", "Premium total should be positive", "info");
      return;
    }
    if (preAmt_opd || Number(preAmt_opd) >= 0) {
      // let flag = false;
      // if (premiumAmounts_opd.length)
      // flag = doesExist(premiumAmounts_opd, preAmt_opd, 'pr')

      // if (!flag) {
      setPremiumAmounts_opd(prev => [...prev, { amount: preAmt_opd, tax: preTax_opd || 0, total_premium: preTotal_opd || 0 }]);
      setValue('pre_amt_opd', '')
      setValue('pre_tax_opd', '')
      setValue('pre_total_opd', '')
      !noAlert && swal('OPD Premium Added',
        `Premium: ₹${preAmt_opd} (${toWords.convert(preAmt_opd)})
Tax: ${preTax_opd}% (${toWords.convert(preTax_opd)})
Total: ₹${preTotal_opd} (${toWords.convert(preTotal_opd)})`)
      // } else {
      //   swal('Already Exist', 'Same OPD premium already added')
      // }
    }
  };

  const onAddPremium_enhance = ({ noAlert = false }) => {
    if (Number(preAmt_enhance) < 0) {
      swal("Validation", "Premium amount should be positive", "info");
      return;
    }
    if (Number(preTax_enhance) < 0) {
      swal("Validation", "Premium tax should be positive", "info");
      return;
    }
    if (Number(preTotal_enhance) < 0) {
      swal("Validation", "Premium total should be positive", "info");
      return;
    }
    if (preAmt_enhance || Number(preAmt_enhance) >= 0) {
      // let flag = false;
      // if (premiumAmounts_enhance.length)
      // flag = doesExist(premiumAmounts_enhance, preAmt_enhance, 'pr')

      // if (!flag) {
      setPremiumAmounts_enhance(prev => [...prev, { amount: preAmt_enhance, tax: preTax_enhance || 0, total_premium: preTotal_enhance || 0 }]);
      setValue('pre_amt_enhance', '')
      setValue('pre_tax_enhance', '')
      setValue('pre_total_enhance', '')
      !noAlert && swal('Enhance Premium Added',
        `Premium: ₹${preAmt_enhance} (${toWords.convert(preAmt_enhance)})
Tax: ${preTax_enhance}% (${toWords.convert(preTax_enhance)})
Total: ₹${preTotal_enhance} (${toWords.convert(preTotal_enhance)})`)
      // } else {
      //   swal('Already Exist', 'Same Enhance premium already added')
      // }
    }
  };

  const onAddSI = ({ noAlert = false }) => {
    if (Number(siAmt) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if ((siAmt || siAmt === 0) && Number(siAmt) >= 0) {
      let flag = false;
      if (siAmounts.length)
        flag = flag = doesExist(siAmounts, siAmt, 'si')

      if (!flag) {
        setSIAmounts(prev => [...prev, siAmt]);
        setValue('si_amt', '')
        !noAlert && swal('Suminsured Added', `₹${siAmt} (${toWords.convert(siAmt)})`)
      } else {
        swal('Already Exist', 'Same suminsured already added')
      }
    }
  };

  const onAddSI_ind = ({ noAlert = false }) => {
    if (Number(siAmt_ind) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if ((siAmt_ind || siAmt_ind === 0) && Number(siAmt_ind) >= 0) {
      let flag = false;
      if (siAmounts_ind.length)
        flag = flag = doesExist(siAmounts_ind, siAmt_ind, 'si')

      if (!flag) {
        setSIAmounts_ind(prev => [...prev, siAmt]);
        setValue('si_amt_ind', '')
        !noAlert && swal('Suminsured Added', `₹${siAmt_ind} (${toWords.convert(siAmt_ind)})`)
      } else {
        swal('Already Exist', 'Same suminsured already added')
      }
    }
  };

  const onAddSI_opd = ({ noAlert = false }) => {
    if (Number(siAmt_opd) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if ((siAmt_opd || siAmt_opd === 0) && Number(siAmt_opd) >= 0) {
      let flag = false;
      if (siAmounts_opd.length)
        flag = doesExist(siAmounts_opd, siAmt_opd, 'si')

      if (!flag) {
        setSIAmounts_opd(prev => [...prev, siAmt_opd]);
        setValue('si_amt_opd', '')
        !noAlert && swal('OPD Suminsured Added', `₹${siAmt_opd} (${toWords.convert(siAmt_opd)})`)
      } else {
        swal('Already Exist', 'Same OPD suminsured already added')
      }
    }
  };

  const onAddSI_enhance = ({ noAlert = false }) => {
    if (Number(siAmt_enhance) < 0) {
      swal("Validation", "SI amount should be positive", "info");
      return;
    }
    if ((siAmt_enhance || siAmt_enhance === 0) && Number(siAmt_enhance) >= 0) {
      let flag = false;
      if (siAmounts_enhance.length)
        flag = doesExist(siAmounts_enhance, siAmt_enhance, 'si')

      if (!flag) {
        setSIAmounts_enhance(prev => [...prev, siAmt_enhance]);
        setValue('si_amt_enhance', '')
        !noAlert && swal('Enhance Suminsured Added', `₹${siAmt_enhance} (${toWords.convert(siAmt_enhance)})`)
      } else {
        swal('Already Exist', 'Same Enhance suminsured already added')
      }
    }
  };

  const onAddBoth = () => {
    const notExistSi = !doesExist(siAmounts, siAmt, 'si');
    // const notExistPr = !doesExist(premiumAmounts, preAmt, 'pr');
    if (Number(siAmt) >= 0
      && Number(preAmt) >= 0
      && Number(preTax) >= 0
      && Number(preTotal) >= 0
      && notExistSi
      /* && notExistPr */) {
      onAddSI({ noAlert: true })
      onAddPremium({ noAlert: true })
      swal('SI & Premium Added',
        `SumInsured: ₹${siAmt} (${toWords.convert(siAmt)})
Premium: ₹${preAmt} (${toWords.convert(preAmt)})
Tax: ${preTax}% (${toWords.convert(preTax)})
Total: ₹${preTotal} (${toWords.convert(preTotal)})`)
    }
    else {
      !notExistSi && swal('Already Exist', 'Same suminsured already added')
      // !notExistPr && swal('Already Exist', 'Same premium already added')
    }
  }

  const removeBoth = (arr) => {
    removeSIAmount(arr)
    removePremiumAmount(arr)
  }

  const onAddBoth_ind = () => {
    const notExistSi = !doesExist(siAmounts_ind, siAmt_ind, 'si');
    // const notExistPr = !doesExist(premiumAmounts, preAmt, 'pr');
    if (Number(siAmt_ind) >= 0
      && Number(preAmt_ind) >= 0
      && Number(preTax_ind) >= 0
      && Number(preTotal_ind) >= 0
      && notExistSi
      /* && notExistPr */) {
      onAddSI_ind({ noAlert: true })
      onAddPremium_ind({ noAlert: true })
      swal('SI & Premium Added',
        `SumInsured: ₹${siAmt_ind} (${toWords.convert(siAmt_ind)})
Premium: ₹${preAmt_ind} (${toWords.convert(preAmt_ind)})
Tax: ${preTax_ind}% (${toWords.convert(preTax_ind)})
Total: ₹${preTotal_ind} (${toWords.convert(preTotal_ind)})`)
    }
    else {
      !notExistSi && swal('Already Exist', 'Same suminsured already added')
      // !notExistPr && swal('Already Exist', 'Same premium already added')
    }
  }

  const removeBoth_ind = (arr) => {
    removeSIAmount_ind(arr)
    removePremiumAmount_ind(arr)
  }

  const onAddBoth_opd = () => {
    const notExistSi = !doesExist(siAmounts_opd, siAmt_opd, 'si');
    // const notExistPr = !doesExist(premiumAmounts_opd, preAmt_opd, 'pr');
    if (Number(siAmt_opd) >= 0
      && Number(preAmt_opd) >= 0
      && Number(preTax_opd) >= 0
      && Number(preTotal_opd) >= 0
      && notExistSi
      /* && notExistPr */) {
      onAddSI_opd({ noAlert: true });
      onAddPremium_opd({ noAlert: true });
      swal('SI & Premium Added',
        `SumInsured: ₹${siAmt_opd} (${toWords.convert(siAmt_opd)})
Premium: ₹${preAmt_opd} (${toWords.convert(preAmt_opd)})
Tax: ${preTax_opd}% (${toWords.convert(preTax_opd)})
Total: ₹${preTotal_opd} (${toWords.convert(preTotal_opd)})`)
    }
    else {
      !notExistSi && swal('Already Exist', 'Same OPD suminsured already added')
      // !notExistPr && swal('Already Exist', 'Same OPD premium already added')
    }
  }

  const removeBoth_opd = (arr) => {
    removeSIAmount_opd(arr)
    removePremiumAmount_opd(arr)
  }

  const onAddBoth_enhance = () => {
    const notExistSi = !doesExist(siAmounts_enhance, siAmt_enhance, 'si');
    // const notExistPr = !doesExist(premiumAmounts_enhance, preAmt_enhance, 'pr');
    if (Number(siAmt_enhance) >= 0
      && Number(preAmt_enhance) >= 0
      && Number(preTax_enhance) >= 0
      && Number(preTotal_enhance) >= 0
      && notExistSi
      /* && notExistPr */) {
      onAddSI_enhance({ noAlert: true });
      onAddPremium_enhance({ noAlert: true });
      swal('SI & Premium Added',
        `SumInsured: ₹${siAmt_enhance} (${toWords.convert(siAmt_enhance)})
Premium: ₹${preAmt_enhance} (${toWords.convert(preAmt_enhance)})
Tax: ${preTax_enhance}% (${toWords.convert(preTax_enhance)})
Total: ₹${preTotal_enhance} (${toWords.convert(preTotal_enhance)})`)
    }
    else {
      !notExistSi && swal('Already Exist', 'Same Enhance suminsured already added')
      // !notExistPr && swal('Already Exist', 'Same Enhance premium already added')
    }
  }

  const removeBoth_enhance = (arr) => {
    removeSIAmount_enhance(arr)
    removePremiumAmount_enhance(arr)
  }

  const AddSalary = () => {
    onAddSalary()
  }

  const removeSalary = obj => {
    const filteredObj = salarySI.filter((_, item) => item !== obj);
    setSalary(prev => [...filteredObj]);
    setValue('max_si_limit', '');
    setValue('min_si_limit', '');
    setValue('no_of_times_of_salary', '');
  }


  const onUploadFile = (type, file) => {
    if (type === 'premium_file') {
      setPremiumFile(file);
    }
    if (type === 'suminsured_file') {
      setSIFile(file);
    }

    if (type === 'premium_file_ind') {
      setPremiumFile_ind(file);
    }
    if (type === 'suminsured_file_ind') {
      setSIFile_ind(file);
    }
    if (type === 'premium_file_opd') {
      setPremiumFile_opd(file);
    }
    if (type === 'suminsured_file_opd') {
      setSIFile_opd(file);
    }

    if (type === 'premium_file_enhance') {
      setPremiumFile_enhance(file);
    }
    if (type === 'suminsured_file_enhance') {
      setSIFile_enhance(file);
    }
    return file;
  };


  const _renderForm = () => {
    if (showForm) {
      return (
        <>
          {tab === '1' && <><FormWrapper>
            <Row>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input
                    label="Add Label"
                    placeholder="Add Label"
                  />}
                  name="label"
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={<Input
                    label="Add Limit"
                    placeholder="Add Limit"
                    type="number"
                    min={0}
                  />}
                  name="limit"
                  control={control}
                />
              </Col>
              <Col md={6} lg={4} xl={3} sm={12} className="d-flex align-items-center">
                <Btn type="button" onClick={onAddLabel}>
                  <i className="ti ti-plus"></i> Add
                </Btn>
              </Col>
            </Row>
          </FormWrapper>

            <Row>
              {benefits && benefits.length > 0
                ? <BenefitList>
                  {benefits.map((benefit, index) =>
                    <Chip
                      key={index = 'benefit'}
                      id={index}
                      name={`${benefit.label} ${benefit.limit ? `- ${benefit.limit}` : ''}`}
                      onDelete={removeBenefit} />)}
                </BenefitList>
                : null}
            </Row>
          </>}
          {tab === '2' && <>
            <Btn className='mb-3 ml-3' onClick={() => setPlanModal(true)}>
              Add Plan +
            </Btn>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                // view
                i={index} setModal={setPlanModal}
                key={index + 'plan'}
                type='Plan'
                configs={options} data={data} />)}
          </>}
          {tab === '3' && <>
            <Btn className='mb-3 ml-3' onClick={() => setPackageModal(true)}>
              Add Packages +
            </Btn>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                // view
                i={index} setModal={setPackageModal}
                key={index + 'package'}
                type='Package'
                configs={options} data={data} />)}
          </>}
          {tab === '4' && <>
            <Btn className='mb-3 ml-3' onClick={() => setSwapModal(true)}>
              Add Swap +
            </Btn>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                // view
                i={index} setModal={setSwapModal}
                key={index + 'swap'}
                type='Swap'
                configs={options} data={data} />)}
          </>}
          {!!planModal && <CreatePlan
            savedConfig={{ sum_insured: siAmounts }}
            configs={options}
            setPlanData={setPlanData}
            Data={planModal}
            type='Plan'
            show={!!planModal} onHide={() => setPlanModal(false)}
          />}
          {!!packageModal && <CreatePlan
            savedConfig={{ sum_insured: siAmounts }}
            configs={options}
            setPlanData={setPlanData}
            Data={packageModal}
            type='Package'
            show={!!packageModal} onHide={() => setPackageModal(false)}
          />}
          {!!swapModal && <CreatePlan
            savedConfig={{ sum_insured: siAmounts }}
            configs={options}
            setPlanData={setPlanData}
            Data={swapModal}
            type='Swap'
            show={!!swapModal} onHide={() => setSwapModal(false)}
          />}

        </>
      )
    }
    return null;
  };

  const _renderRaterDD = (opd = '') => (<>
    <Col md={6} lg={4} xl={3} sm={12}>
      <Controller
        as={<Select
          label="Sum Insured Type"
          option={options.sum_insured_types?.filter(({ id }) => (policy_rater_type_id === 1 && id === 3) || id !== 3)}
          valueName="name"
          id={opd ? (PremiumRater[opd] + '_suminsured_type_id') : "sum_insured_types"}
          selected={(opd ? GivePremiumRaterVariable(opd, policyData.opd_suminsured_type_id, policyData.enhance_suminsured_type) : policyData.sum_insured_type_id) || ""}
          required
        />}
        name={opd ? (PremiumRater[opd] + '_suminsured_type_id') : "sum_insured_type_id"}
        control={control}
      />
    </Col>
    <Col md={6} lg={4} xl={3} sm={12}>
      <Controller
        as={<ComponentSelect
          label="SI Basis"
          placeholder="Select SI Basis"
          options={options.sum_insured_sub_types
            .filter(item => {
              const MC = [1, 4].includes(Number(policyData.policy_sub_type_id))
              if ([5, 15].includes(item.id) && MC) {
                return false;
              }
              if (!MC && [9, 13, 14].includes(item.id)) {
                return false
              }
              if (!topup_policy && item.id === 8) {
                return false
              }
              return true
            })
            .map(item => ({
              id: item.id,
              name: item.name,
              value: item.id
            }))}
          valueName="name"
          id={opd ? (PremiumRater[opd] + '_suminsured_sub_type_id') : "sum_insured_sub_types"}
          selected={(opd ? GivePremiumRaterVariable(opd, policyData.opd_suminsured_sub_type_id, policyData.enhance_suminsured_sub_type) : policyData.sum_insured_sub_type_id) || ""}
          required
        />}
        onChange={([e]) => {

          const value = e.target ? e.target.value : '';
          if ((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance) : premiumType) === 1 && Number(value) === 5) {
            setValue(opd ? (PremiumRater[opd] + '_premium_type_id') : 'premium_type_id', '')
          }
          else if (Number(value) === 15) {
            setValue(opd ? (PremiumRater[opd] + '_premium_type_id') : 'premium_type_id', '17');
          } else if (Number(value) !== 15 && (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance) : premiumType) === 17) {
            setValue(opd ? (PremiumRater[opd] + '_premium_type_id') : 'premium_type_id', '')
          }
          return e;
        }}
        name={opd ? (PremiumRater[opd] + '_suminsured_sub_type_id') : "sum_insured_sub_type_id"}
        control={control}
      />
    </Col>
    {!BaseWiseSIPremium && <Col md={6} lg={4} xl={3} sm={12}>
      <Controller
        as={<ComponentSelect
          label="Premium Basis"
          placeholder="Select Premium Basis"
          options={options.premium_types
            .filter(item => {
              // const Member_Wise = item.id === 9;
              const MC = [1, 4].includes(Number(policyData.policy_sub_type_id))
              // if ((Member_Wise && !GMC)) {
              //   return false;
              // }
              if (Permily$Relation.includes(item.id) && MC) {
                return false;
              }
              if ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance) : siType) === 5 && [1].includes(item.id)) {
                return false;
              }
              return true;
            })
            .map(item => ({
              id: item.id,
              name: item.name,
              value: item.id
            }))}
          valueName="name"
          id={opd ? (PremiumRater[opd] + '_premium_type_id') : "premium_types"}
          selected={!BaseWiseSIPremium && ((opd ? GivePremiumRaterVariable(opd, policyData.opd_premium_type_id, policyData.enhance_premium_type) : policyData.premium_type_id) || "")}
          required
        />}
        onChange={([e]) => {

          const value = e.target ? e.target.value : '';
          if (Number(value) === 17) {
            setValue(opd ? (PremiumRater[opd] + '_suminsured_sub_type_id') : "sum_insured_sub_type_id", '15');
          } else if (Number(value) !== 17 && (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance) : siType) === 15) {
            setValue(opd ? (PremiumRater[opd] + '_suminsured_sub_type_id') : "sum_insured_sub_type_id", '');
          }
          return e;
        }}
        name={opd ? (PremiumRater[opd] + '_premium_type_id') : "premium_type_id"}
        control={control}
      />
    </Col>}
    <Col md={12} lg={12} xl={12} sm={12}>
      {/* Eligibility */}
      {!!eligiblePolicy && <TextCard className="p-3 mb-4" noShadow bgColor="#f8f8f8">
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
                <input ref={register} name={'top_up_cover_has_eligibility'} type={'radio'} value={0} defaultChecked={policyData?.top_up_cover_has_eligibility ? policyData?.top_up_cover_has_eligibility === 0 : true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Yes"}</p>
                <input ref={register} name={'top_up_cover_has_eligibility'} type={'radio'} value={1} defaultChecked={policyData?.top_up_cover_has_eligibility === 1 || false} />
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
                    <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={1} defaultChecked={policyData?.eligibility_cover_type ? policyData?.eligibility_cover_type === 1 : true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Less Than"}</p>
                    <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={2} defaultChecked={policyData?.eligibility_cover_type === 2 || false} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Equal"}</p>
                    <input ref={register} name={'eligibility_cover_type'} type={'radio'} value={3} defaultChecked={policyData?.eligibility_cover_type === 3 || false} />
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
                  rules={{ required: true, min: 1, max: 20 }}
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
                    <ComponentSelect
                      label="Salary Calculate From"
                      placeholder="Select Salary Type"
                      options={SalaryType}
                      labelProps={{ background: "#f8f8f8" }}
                      error={errors && errors.calculate_eligibility_from}
                    />
                  }
                  control={control}
                  name="calculate_eligibility_from"
                />
              </Col>
            </>
          }
        </Row>
      </TextCard>}
    </Col>

  </>)

  const _renderPremium = (opd) => (
    <>
      {((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) > 1) ?
        <Col md={12} lg={6} xl={6} sm={12}>
          <AttachFile
            name={"premium_file"}
            title={"Premium File" + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
            key="premium_file"
            accept=".xls, .xlsx"
            onUpload={(files) => onUploadFile('premium_file' + opd, files[0])}
            description="File Formats: xls, xlsx"
            nameBox
            required={false}
          />
          <AnchorTag href={'#'}
            onClick={() => downloadPremiumSample(opd)}
          >
            <i
              className="ti-cloud-down attach-i"
              style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
            ></i>
            <span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
              Download Sample Format
            </span>
          </AnchorTag>
        </Col>
        : (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) === 1 ?
          <>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input
                  label={"Add Premium Amount " + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
                  placeholder="Add Amount"
                  type="number"
                  min={0}
                  isRequired
                />}
                name={"pre_amt" + opd}
                control={control}
              />
              {!!(opd ? GivePremiumRaterVariable(opd, preAmt_opd, preAmt_enhance, preAmt_ind) : preAmt) && <Error color={'blue'}>{toWords.convert(opd ? GivePremiumRaterVariable(opd, preAmt_opd, preAmt_enhance, preAmt_ind) : preAmt)}</Error>}
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input
                  label={"Add Premium Tax % " + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
                  placeholder="Add Tax"
                  type="number"
                  min={0}
                  isRequired
                />}
                name={"pre_tax" + opd}
                control={control}
              />
              {!!(opd ? GivePremiumRaterVariable(opd, preTax_opd, preTax_enhance, preTax_ind) : preTax) && <Error color={'blue'}>{toWords.convert(opd ? GivePremiumRaterVariable(opd, preTax_opd, preTax_enhance, preTax_ind) : preTax)}</Error>}
            </Col>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input
                  label={"Add Premium Total " + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
                  placeholder="Add Total"
                  type="number"
                  min={0}
                  isRequired
                />}
                name={"pre_total" + opd}
                control={control}
              />
              {!!(opd ? GivePremiumRaterVariable(opd, preTotal_opd, preTotal_enhance, preTotal_ind) : preTotal) && <Error color={'blue'}>{toWords.convert(opd ? GivePremiumRaterVariable(opd, preTotal_opd, preTotal_enhance, preTotal_ind) : preTotal)}</Error>}
            </Col>
            {/* {(opd ? siType_opd : siType) !== 1 && <>
              <Col md={6} lg={4} xl={3} sm={12} className="d-flex align-items-center">
                <Btn type="button" onClick={opd ? onAddPremium_opd : onAddPremium}>
                  <i className="ti ti-plus"></i> Add
                </Btn>
              </Col>
              <Col md={12} lg={6} xl={6} sm={12}>
                {(opd ? premiumAmounts_opd : premiumAmounts).length
                  ? <BenefitList>
                    {(opd ? premiumAmounts_opd : premiumAmounts).map((amount, index) =>
                      <Chip
                        id={amount.amount}
                        key={index + 'si-prem' + (opd ? opd : 'no-opd')}
                        name={`${amount.amount}:${amount.tax}:${amount.total_premium}`}
                        onDelete={opd ? removePremiumAmount_opd : removePremiumAmount} />)}
                  </BenefitList>
                  : null}
              </Col>
            </>} */}
            {((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) && (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) === 1)
              && ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) && ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) === 1 || (opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) === 1)) && <>
                <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
                  <Btn type="button" onClick={opd ? GivePremiumRaterVariable(opd, onAddBoth_opd, onAddBoth_enhance, onAddBoth_ind) : onAddBoth}>
                    <i className="ti ti-plus"></i> Add
                  </Btn>
                </Col>
                <Col md={12} lg={12} xl={12} sm={12}>
                  {(opd ? GivePremiumRaterVariable(opd, premiumAmounts_opd, premiumAmounts_enhance, premiumAmounts_ind) : premiumAmounts).length
                    ? <BenefitList>
                      {(opd ? GivePremiumRaterVariable(opd, premiumAmounts_opd, premiumAmounts_enhance, premiumAmounts_ind) : premiumAmounts).map((amount, index) =>
                        <Chip
                          key={index + 'both' + (opd ? opd : 'no-opd')}
                          id={index}
                          name={<>{opd ? GivePremiumRaterVariable(opd, siAmounts_opd, siAmounts_enhance, siAmounts_ind)[index] : siAmounts[index]}<sub>(si)</sub> : {amount.amount}<sub>(prem)</sub> : {amount.tax}<sub>(tax%)</sub> : {amount.total_premium}<sub>(total)</sub></>}
                          // name={`${opd ? GivePremiumRaterVariable(opd,siAmounts_opd,siAmounts_enhance)[index] : siAmounts[index]} - ${amount.amount}:${amount.tax}:${amount.total_premium}`}
                          onDelete={opd ? GivePremiumRaterVariable(opd, removeBoth_opd, removeBoth_enhance, removeBoth_ind) : removeBoth} />)}
                    </BenefitList>
                    : null}
                </Col>
              </>}
          </> : null
      }
    </>
  )

  const _renderSI = (opd) => (
    ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) > 1 && (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) !== 5) ?
      <>
        <Col md={12} lg={6} xl={6} sm={12}>
          <AttachFile
            name="si_file"
            title={(BaseWiseSIPremium ? "Base Wise SI & Premium File " : "Sum Insured File ") + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
            key="si_file"
            accept=".xls, .xlsx"
            onUpload={(files) => onUploadFile('suminsured_file' + opd, files[0])}
            description="File Formats: xls, xlsx"
            nameBox
            required={false}
          // error={errors && errors.premium_file}
          />
          <AnchorTag href={'#'}
            onClick={() => downloadSISample(opd)}
          >
            <i
              className="ti-cloud-down attach-i"
              style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
            ></i>
            <span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
              Download Sample Format
            </span>
          </AnchorTag>
        </Col>
        <Col md={12} lg={12} xl={12} sm={12}></Col>
        {(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) === 1 && <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input
              label={"Add SI Amount " + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
              placeholder="Add Amount"
              type="number"
              min={0}
              isRequired
            />}
            // onChange={([e]) => { setSIAmt(e.target.value); return e.target.value }}
            name={"si_amt" + opd}
            control={control}
          />
          {!!(opd ? GivePremiumRaterVariable(opd, siAmt_opd, siAmt_enhance) : siAmt) && <Error color={'blue'}>{toWords.convert(opd ? GivePremiumRaterVariable(opd, siAmt_opd, siAmt_enhance) : siAmt)}</Error>}

        </Col>}
      </>
      : ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance) : siType) === 5 && !opd) ?
        <>
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Input
                label="No of times of salary"
                placeholder="Enter No of times of salary"
                type="number"
                min={0}
                isRequired
              />}
              name="no_of_times_of_salary"
              control={control}
            />
            {!!(noOfSalary) && <Error color={'blue'}>{toWords.convert(noOfSalary)}</Error>}

          </Col>
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Input
                label="Lowest SI Limit"
                placeholder="Enter Lowest SI Limit"
                type="number"
                min={0}
              // required
              />}
              name="min_si_limit"
              control={control}
            />
            {!!(minSi) && <Error color={'blue'}>{toWords.convert(minSi)}</Error>}

          </Col>
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Input
                label="Highest SI Limit"
                placeholder="Enter upper limit"
                type="number"
                min={0}
              // required
              />}
              name="max_si_limit"
              control={control}
            />
            {!!(maxSi) && <Error color={'blue'}>{toWords.convert(maxSi)}</Error>}

          </Col>
          {
            [2, 3, 5, 6].includes(Number(policyData.policy_sub_type_id)) &&
            <>
              <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
                <Btn type="button" onClick={AddSalary}>
                  <i className="ti ti-plus"></i> Add
                </Btn>
              </Col>
              <Col md={12} lg={12} xl={12} sm={12}>
                {salarySI.length
                  ? <BenefitList>
                    {(salarySI).map((item, index) =>
                      <Chip
                        key={index + 'si-isn' + (opd ? opd : 'no-opd')}
                        id={index}
                        name={<>
                          {item.no_of_times_of_salary} {(item.min_si_limit && item.min_si_limit !== 0) ?
                            <>{' : ' + String(item.min_si_limit)}<sub>(min)</sub></> : ""} {(item.max_si_limit && item.max_si_limit !== 4294967295) ?
                              <>{' : ' + String(item.max_si_limit)}<sub>(max)</sub></> : ""}
                        </>}
                        //                           name={`${item.no_of_times_of_salary}
                        // ${(item.min_si_limit && item.min_si_limit !== 0) ? (' : ' + String(item.min_si_limit)) : ""}
                        // ${(item.max_si_limit && item.max_si_limit !== 4294967295) ? (' : ' + String(item.max_si_limit)) : ""}`}
                        onDelete={removeSalary} />)}
                  </BenefitList>
                  : null}
              </Col>
            </>
          }
          <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
            <Controller
              as={
                <ComponentSelect
                  label="Salary Calculate From"
                  placeholder="Select Salary Type"
                  options={SalaryType}
                  error={errors && errors.calculate_eligibility_from}
                />
              }
              control={control}
              name="calculate_eligibility_from"
            />
          </Col>
        </>

        : ((opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) === 1 && (opd ? GivePremiumRaterVariable(opd, siType_opd, siType_enhance, siType) : siType) !== 5) ?
          <>
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={<Input
                  label={"Add SI Amount" + (sum_insured_type_id === 3 ? (opd ? '(Individual)' : '(Floater)') : '')}
                  placeholder="Add Amount"
                  type="number"
                  min={0}
                  isRequired
                />}
                // onChange={([e]) => { setSIAmt(e.target.value); return e.target.value }}
                name={"si_amt" + opd}
                control={control}
              />
              {!!(opd ? GivePremiumRaterVariable(opd, siAmt_opd, siAmt_enhance, siAmt_ind) : siAmt) && <Error color={'blue'}>{toWords.convert(opd ? GivePremiumRaterVariable(opd, siAmt_opd, siAmt_enhance, siAmt_ind) : siAmt)}</Error>}

            </Col>
            {(opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance, premiumType) : premiumType) !== 1 && <>
              <Col md={4} className="d-flex align-items-center">
                <Btn type="button" onClick={opd ? GivePremiumRaterVariable(opd, onAddSI_opd, onAddSI_enhance, onAddSI_ind) : onAddSI}>
                  <i className="ti ti-plus"></i> Add
                </Btn>
              </Col>
              <Col md={12} lg={6} xl={6} sm={12}>
                {(opd ? GivePremiumRaterVariable(opd, siAmounts_opd, siAmounts_enhance, siAmounts_ind) : siAmounts).length
                  ? <BenefitList>
                    {(opd ? GivePremiumRaterVariable(opd, siAmounts_opd, siAmounts_enhance, siAmounts_ind) : siAmounts).map((amount, index) =>
                      <Chip
                        key={index + opd + '-siAmounts'}
                        id={index}
                        name={`${amount}`}
                        onDelete={opd ? GivePremiumRaterVariable(opd, removeSIAmount_opd, removeSIAmount_enhance, removeSIAmount_ind) : removeSIAmount} />)}
                  </BenefitList>
                  : null}
              </Col>
            </>}
          </> : null
  )

  const onSubmit = (data) => {

    const benifitData = benefits.map((elem) => {
      return {
        name: elem.label,
        sum_insured_dedutible: elem.limit
      }
    })

    if ((Number(data.sum_insured_sub_type_id) === 1) &&
      (Number(data.premium_type_id) === 1) &&
      (siAmounts.length !== premiumAmounts.length)
    ) {
      swal("Required", "Number of SI & Premium should be equal", "info");
      return;
    }

    if (Number(data.sum_insured_type_id) === 3 &&
      (Number(data.sum_insured_sub_type_id) === 1) &&
      (Number(data.premium_type_id) === 1) &&
      (siAmounts_ind.length !== premiumAmounts_ind.length)
    ) {
      swal("Required", "Number of SI & Premium should be equal (Individual)", "info");
      return;
    }

    if (!siAmounts.length && Number(data.sum_insured_sub_type_id) === 1) {
      swal("Required", "Number of SI can't be zero", "info");
      return;
    }

    if (!premiumAmounts.length && Number(data.premium_type_id) === 1) {
      swal("Required", "Number of Premium can't be zero", "info");
      return;
    }

    if (Number(data.sum_insured_type_id) === 3 && !siAmounts_ind.length && Number(data.sum_insured_sub_type_id) === 1) {
      swal("Required", "Number of SI can't be zero (Individual)", "info");
      return;
    }

    if (Number(data.sum_insured_type_id) === 3 && !premiumAmounts_ind.length && Number(data.premium_type_id) === 1) {
      swal("Required", "Number of Premium can't be zero (Individual)", "info");
      return;
    }

    if (Number(data.sum_insured_sub_type_id) === 5 && salarySI.length === 0) {
      swal("Required", "Number of Salary can't be zero", "info");
      return;
    }

    if (policy_rater_type_id === 3) {

      if ((Number(data.opd_suminsured_sub_type_id) === 1) &&
        (Number(data.opd_premium_type_id) === 1) &&
        (siAmounts_opd.length !== premiumAmounts_opd.length)
      ) {
        swal("Required", "Number of opd SI & Premium should be equal", "info");
        return;
      }

      if (!siAmounts_opd.length && Number(data.opd_suminsured_sub_type_id) === 1) {
        swal("Required", "Number of opd SI can't be zero", "info");
        return;
      }


      if (!premiumAmounts_opd.length && Number(data.opd_premium_type_id) === 1) {
        swal("Required", "Number of opd Premium can't be zero", "info");
        return;
      }
    }

    // if (!data.has_flex && !data.has_payroll) {
    //   swal("Validation", 'Select atleast one type of payment(Flex or Payroll)', "info");
    //   return
    // }

    // sheet required for either case
    if (![1, 5, 8].includes(Number(data.sum_insured_sub_type_id)) && ![1].includes(Number(data.premium_type_id))) {
      if (premiumFile && !siFile) {
        swal("Validation", "Please update/upload sum insured rate sheet", "info");
        return;
      }
      if (!premiumFile && siFile) {
        swal("Validation", "Please update/upload premium rate sheet", "info");
        return;
      }
      if (Number(data.sum_insured_type_id) === 3) {
        if (premiumFile_ind && (!siFile_ind || (!premiumFile && policyData.premium_file) || (!siFile && policyData.suminusred_file))) {
          swal("Validation", "Please update/upload all rate sheet", "info");
          return;
        }
        if ((!premiumFile_ind || (!premiumFile && policyData.premium_file) || (!siFile && policyData.suminusred_file)) && siFile_ind) {
          swal("Validation", "Please update/upload all rate sheet", "info");
          return;
        }

        if (premiumFile && ((!premiumFile_ind && policyData.in_premium_file) || (!siFile_ind && policyData.in_suminsured_file) || !siFile)) {
          swal("Validation", "Please update/upload all rate sheet", "info");
          return;
        }
        if (((!premiumFile_ind && policyData.in_premium_file) || (!siFile_ind && policyData.in_suminsured_file) || !premiumFile) && siFile) {
          swal("Validation", "Please update/upload all rate sheet", "info");
          return;
        }
      }
    }
    if (![1, 5, 8].includes(Number(data.opd_suminsured_sub_type_id)) && ![1].includes(Number(data.opd_premium_type_id))
      && policy_rater_type_id === 3) {
      if (premiumFile && !siFile_opd) {
        swal("Validation", "Please update/upload sum insured rate sheet", "info");
        return;
      }
      if (!premiumFile_opd && siFile_opd) {
        swal("Validation", "Please update/upload premium rate sheet", "info");
        return;
      }
    }
    if (![1, 5, 8].includes(Number(data.enhance_suminsured_sub_type_id)) && ![1].includes(Number(data.enhance_premium_type_id))
      && policy_rater_type_id === 5) {
      if (premiumFile && !siFile_enhance) {
        swal("Validation", "Please update/upload sum insured rate sheet", "info");
        return;
      }
      if (!premiumFile_enhance && siFile_enhance) {
        swal("Validation", "Please update/upload premium rate sheet", "info");
        return;
      }
    }

    const formData = new FormData();


    if (((Array.isArray(siAmounts) && siAmounts.length) || (Array.isArray(siAmounts_opd) && siAmounts_opd.length) || (Array.isArray(siAmounts_enhance) && siAmounts_enhance.length)) &&
      ((Number(data.sum_insured_sub_type_id) === 1 || Number(data.opd_suminsured_sub_type_id) === 1 || Number(data.enhanvce_suminsured_sub_type_id) === 1) ||
        (Number(data.premium_type_id) === 1 || Number(data.opd_premium_type_id) === 1) || Number(data.enhance_premium_type_id) === 1)) {
      let tempSI1 = [];
      if ((Number(data.sum_insured_sub_type_id) === 1 || Number(data.premium_type_id) === 1) && Array.isArray(siAmounts) && siAmounts.length) {
        tempSI1 = siAmounts.map((value) => ({
          value: value,
          is_opd_rate: policy_rater_type_id === 2 ? 1 : 0,
          is_opd_contribution: policy_rater_type_id === 2 ? 1 : 0,
          is_enchance_flex_rate: 0
        }));
      }
      let tempSI2 = [];
      if (policy_rater_type_id === 3 && (Number(data.opd_suminsured_sub_type_id) === 1 || Number(data.opd_premium_type_id) === 1) && Array.isArray(siAmounts_opd) && siAmounts_opd.length) {
        tempSI2 = siAmounts_opd.map((value) => ({
          value: value,
          is_opd_rate: 1,
          is_opd_contribution: 1,
          is_enchance_flex_rate: 0
        }));
      }
      let tempSI3 = [];
      if (policy_rater_type_id === 5 && (Number(data.enhance_suminsured_sub_type_id) === 1 || Number(data.enhance_premium_type_id) === 1) && Array.isArray(siAmounts_enhance) && siAmounts_enhance.length) {
        tempSI2 = siAmounts_enhance.map((value) => ({
          value: value,
          is_opd_rate: 0,
          is_opd_contribution: 0,
          is_enchance_flex_rate: 1
        }));
      }
      formData.append('sum_insureds', JSON.stringify([...tempSI1 || [], ...tempSI2 || [], ...tempSI3 || []]))
    }

    if (Number(data.sum_insured_type_id) === 3 &&
      (Array.isArray(siAmounts_ind) && siAmounts_ind.length) &&
      ((Number(data.sum_insured_sub_type_id) === 1) ||
        (Number(data.premium_type_id) === 1))) {
      let tempSI1 = [];
      if ((Number(data.sum_insured_sub_type_id) === 1 || Number(data.premium_type_id) === 1) && Array.isArray(siAmounts_ind) && siAmounts_ind.length) {
        tempSI1 = siAmounts_ind.map((value) => ({
          value: value,
          is_opd_rate: 0,
          is_opd_contribution: 0,
          is_enchance_flex_rate: 0
        }));
      }
      formData.append('in_sum_insured', JSON.stringify(tempSI1))
    }


    if (![1, 5].includes(Number(data.sum_insured_sub_type_id))) {
      if ((policyData.sum_insured_sub_type_id) !== Number(data.sum_insured_sub_type_id) && !siFile) {
        swal("Validation", "Please update/upload sum insured rate sheet", "info");
        return null;
      }
      if (siFile) {
        formData.append(policy_rater_type_id === 2 ? 'opd_si_file' : `si_file`, siFile);
      }
    }

    if (Number(data.sum_insured_type_id) === 3 && ![1, 5].includes(Number(data.sum_insured_sub_type_id))) {
      if ((policyData.sum_insured_sub_type_id) !== Number(data.sum_insured_sub_type_id) && !siFile_ind) {
        swal("Validation", "Please update/upload sum insured rate sheet", "info");
        return null;
      }
      if (siFile_ind) {
        formData.append('in_suminsured_file', siFile_ind);
      }
    }

    if (policy_rater_type_id === 3 && ![1, 5].includes(Number(data.opd_suminsured_sub_type_id))) {
      if ((policyData.opd_suminsured_sub_type_id) !== Number(data.opd_suminsured_sub_type_id) && !siFile_opd) {
        swal("Validation", "Please update/upload opd sum insured rate sheet", "info");
        return null;
      }
      if (siFile_opd) {
        formData.append(`opd_si_file`, siFile_opd);
      }
    }

    if (policy_rater_type_id === 5 && ![1, 5].includes(Number(data.enhance_suminsured_sub_type_id))) {
      if ((policyData.enhance_suminsured_sub_type_id) !== Number(data.enhance_suminsured_sub_type_id) && !siFile_enhance) {
        swal("Validation", "Please update/upload enhance sum insured rate sheet", "info");
        // return null;
      }
      if (siFile_enhance) {
        formData.append(`enhance_si_file`, siFile_enhance);
      }
    }

    if (Number(data.sum_insured_sub_type_id) === 5 && salarySI.length !== 0) {
      formData.set('salary', JSON.stringify([...salarySI]));
      formData.append('calculate_eligibility_from', data.calculate_eligibility_from)
    }
    // if (Number(data.sum_insured_sub_type_id) === 5 && Number(policyData.policy_sub_type_id !== 6)) {
    //   formData.append('no_of_times_of_salary', data.no_of_times_of_salary);
    //   formData.append('min_si_limit', data.min_si_limit);
    //   formData.append('max_si_limit', data.max_si_limit);
    // }
    // else {
    //   if (Number(data.sum_insured_sub_type_id) === 5) {
    //     formData.set('salary', JSON.stringify([...salarySI]));
    //   }
    // }


    if (((Array.isArray(premiumAmounts) && premiumAmounts.length) || (Array.isArray(premiumAmounts_opd) && premiumAmounts_opd.length) || (Array.isArray(premiumAmounts_enhance) && premiumAmounts_enhance.length)) &&
      (Number(data.premium_type_id) === 1 || Number(data.opd_premium_type_id) === 1 || Number(data.enhance_premium_type_id) === 1)) {
      let tempPremium1 = [];
      if (Number(data.premium_type_id) === 1 && Array.isArray(premiumAmounts) && premiumAmounts.length)
        tempPremium1 = premiumAmounts.map((values) => ({
          ...values,
          is_opd_rate: policy_rater_type_id === 2 ? 1 : 0,
          is_opd_contribution: policy_rater_type_id === 2 ? 1 : 0,
          is_enchance_flex_rate: 0
        }));
      let tempPremium2 = [];
      if (policy_rater_type_id === 3 && Number(data.opd_premium_type_id) === 1 && Array.isArray(premiumAmounts_opd) && premiumAmounts_opd.length) {
        tempPremium2 = premiumAmounts_opd.map((values) => ({
          ...values,
          is_opd_rate: 1,
          is_opd_contribution: 1,
          is_enchance_flex_rate: 0
        }));
      }

      let tempPremium3 = [];
      if (policy_rater_type_id === 5 && Number(data.enhance_premium_type_id) === 1 && Array.isArray(premiumAmounts_enhance) && premiumAmounts_enhance.length) {
        tempPremium2 = premiumAmounts_enhance.map((values) => ({
          ...values,
          is_opd_rate: 0,
          is_opd_contribution: 0,
          is_enchance_flex_rate: 1
        }));
      }
      formData.set('premiums', JSON.stringify([...tempPremium1 || [], ...tempPremium2 || [], ...tempPremium3 || []]));
    }

    if (Number(data.sum_insured_type_id) === 3 &&
      ((Array.isArray(premiumAmounts_ind) && premiumAmounts_ind.length)) &&
      (Number(data.premium_type_id) === 1)) {
      let tempPremium1 = [];
      if (Number(data.premium_type_id) === 1 && Array.isArray(premiumAmounts_ind) && premiumAmounts_ind.length)
        tempPremium1 = premiumAmounts_ind.map((values) => ({
          ...values,
          is_opd_rate: 0,
          is_opd_contribution: 0,
          is_enchance_flex_rate: 0
        }));

      formData.set('in_premium', JSON.stringify(tempPremium1));
    }

    if (Number(data.premium_type_id) !== 1 && !BaseWiseSIPremium) {
      if (((policyData.premium_type_id) !== Number(data.premium_type_id) ||
        (!!Number(data.premium_tax_type) && Number(data.premium_tax) !== Number(policyData.premium_tax))) && !premiumFile) {
        swal("Validation", "Please update/upload premium rate sheet", "info");
        return null;
      }
      if (premiumFile) {
        formData.append(policy_rater_type_id === 2 ? 'opd_premium_file' : `premium_file`, premiumFile);
      }
    }

    if (Number(data.premium_type_id) !== 1 && !BaseWiseSIPremium && Number(data.sum_insured_type_id) === 3) {
      if (((policyData.premium_type_id) !== Number(data.premium_type_id) ||
        (!!Number(data.premium_tax_type) && Number(data.premium_tax) !== Number(policyData.premium_tax))) && !premiumFile_ind) {
        swal("Validation", "Please update/upload premium rate sheet", "info");
        return null;
      }
      if (premiumFile_ind) {
        formData.append('in_premium_file', premiumFile_ind);
      }
    }

    if (policy_rater_type_id === 3 && Number(data.opd_premium_type_id) !== 1) {
      if (((policyData.opd_premium_type_id) !== Number(data.opd_premium_type_id) ||
        (!!Number(data.premium_tax_type_opd) && Number(data.premium_tax_opd) !== Number(policyData.premium_tax_opd))) && !premiumFile_opd) {
        swal("Validation", "Please update/upload opd premium rate sheet", "info");
        return null;
      }
      if (premiumFile_opd) {
        formData.append(`opd_premium_file`, premiumFile_opd);
      }
    }

    if (policy_rater_type_id === 2 && data.base_ipd_policy_id) {
      formData.append('base_ipd_policy_id', data.base_ipd_policy_id);
    }
    policy_rater_type_id && formData.append('policy_rater_type_id', policy_rater_type_id || 1);


    formData.append('benefits', (showForm) ? JSON.stringify(tab === '1' ? (benifitData && benifitData.length > 0 ? benifitData : []) : ((tab !== '1' && planData) || []))
      : JSON.stringify([]));
    formData.append('benefits_type', tab);
    formData.append('has_flex', data.has_flex);
    formData.append('has_payroll', data.has_payroll);
    formData.append('policy_id', policyData.id);
    formData.append('step', '3');
    if (policy_rater_type_id === 2) {
      formData.set(`opd_suminsured_type`, data.sum_insured_type_id);
      formData.set(`opd_suminsured_sub_type`, data.sum_insured_sub_type_id)
      formData.set(`opd_premium_type`, data.premium_type_id)

      formData.set(`premium_tax_type_opd`, (data.premium_tax_type ?? policyData.premium_tax_type) || 0)
      formData.set(`premium_tax_opd`, data.premium_tax || 0)
      formData.set(`premium_contribution_type_opd`, ContributionTypeRater.includes(data.premium_type_id) ? ((data.premium_contribution_type ?? policyData.premium_contribution_type) ?? 0) : 1)





    } else {
      !BaseWiseSIPremium && formData.append('premium_type_id', data.premium_type_id);
      formData.append('suminsured_subtype_type_id', data.sum_insured_sub_type_id);
      formData.append('suminsurued_type_id', data.sum_insured_type_id);

      formData.append('premium_tax_type', (data.premium_tax_type ?? policyData.premium_tax_type) || 0);
      formData.append('premium_tax', data.premium_tax || 0);
      formData.append('premium_contribution_type', ContributionTypeRater.includes(data.premium_type_id) ? ((data.premium_contribution_type ?? policyData.premium_contribution_type) ?? 0) : 1);
    }
    if (policy_rater_type_id === 3) {
      formData.append('opd_premium_type', data.opd_premium_type_id);
      formData.append('opd_suminsured_sub_type', data.opd_suminsured_sub_type_id);
      formData.append('opd_suminsured_type', data.opd_suminsured_type_id);

      formData.append('premium_tax_type_opd', (data.premium_tax_type_opd ?? policyData.premium_tax_type_opd) || 0);
      formData.append('premium_tax_opd', data.premium_tax_opd || 0);
      formData.append('premium_contribution_type_opd', ContributionTypeRater.includes(data.opd_premium_type_id) ? ((data.premium_contribution_type_opd ?? policyData.premium_contribution_type_opd) ?? 0) : 1);
    }
    if (policy_rater_type_id === 5) {
      formData.append('enhance_premium_type', data.enhance_premium_type_id);
      formData.append('enhance_suminsured_sub_type', data.enhance_suminsured_sub_type_id);
      formData.append('enhance_suminsured_type', data.enhance_suminsured_type_id);
    }

    if (data.parent_base_policy_id) {
      formData.set('parent_base_policy_id', data.parent_base_policy_id);
    }



    formData.append('is_installment_allowed', Number(data.is_installment_allowed) && data.has_payroll ? 1 : 0);
    formData.append('installment_level', data.installment_level || '0');
    if (Number(data.is_installment_allowed) && data.has_payroll) {
      if (installment_periods.length) {
        installment_periods.forEach((period) => {
          formData.append('installment[]', period);
        })
      }
      else {
        swal("Alert", "Please enter Installment period installment period", "info");
        return null;
      }
    }

    if (eligiblePolicy) {
      formData.append('top_up_cover_has_eligibility', Number(data.top_up_cover_has_eligibility) || 0);
      formData.append('eligibility_cover_type', Number(data.eligibility_cover_type) || 0);
      formData.append('no_of_time_salary', Number(data.no_of_time_salary) || 1);
      formData.append('calculate_eligibility_from', data.calculate_eligibility_from)
    } else {
      formData.append('top_up_cover_has_eligibility', 0);
    }

    formData.append('user_type_name', userType);
    formData.append('_method', "PATCH");

    dispatch(editPolicy(formData, policyData.id))

  }

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
                      name={opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type'}
                      type="radio"
                      defaultChecked={!Number(opd ? GivePremiumRaterVariable(opd, policyData?.premium_tax_type_opd, policyData?.premium_tax_type_enhance) : policyData?.premium_tax_type) || true}
                    />
                  }
                  name={opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type'}
                  onChange={([e]) => e.target.checked ? 0 : 1}
                  onClick={((e) => setValue(opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type', 0))}
                  control={control}
                  value={0}
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
                      name={opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type'}
                      type="radio"
                      defaultChecked={!!Number(opd ? GivePremiumRaterVariable(opd, policyData?.premium_tax_type_opd, policyData?.premium_tax_type_enhance) : policyData?.premium_tax_type) || false}
                      value={1}
                    />
                  }
                  name={opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type'}
                  onChange={([e]) => e.target.checked ? 1 : 0}
                  onClick={((e) => setValue(opd ? 'premium_tax_type_' + PremiumRater[opd] : 'premium_tax_type', 1))}
                  control={control}
                />
                <span className="checkmark-check"></span>
              </label>
            </CustomCheck>
          </div>
          {!!(opd ? GivePremiumRaterVariable(opd, premium_tax_type_opd, premium_tax_type_enhance) : premium_tax_type) && <Row>
            <Col xl={5} lg={8} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Premium Tax"
                    placeholder="Enter Premium Tax"
                    type="number"
                    min={0}
                    required
                    labelProps={{ background: '#f8f8f8' }}
                    defaultValue={'0'}
                  // error={errors && errors[opd ?  'premium_tax_opd' : 'premium_tax_topup') : 'premium_tax']}
                  />
                }
                rules={{ required: true, min: 1, max: 1000 }}
                control={control}
                name={opd ? 'premium_tax_' + PremiumRater[opd] : 'premium_tax'}
              />
            </Col>
          </Row>}
        </Col>

        {ContributionTypeRater.includes((opd ? GivePremiumRaterVariable(opd, premiumType_opd, premiumType_enhance) : premiumType))
          && <Col md={12} lg={6} xl={6} sm={12}>
            <Marker />
            <Typography>{'\u00A0'} Contribution Type in Premium Rater ?</Typography>
            <br />
            <div className='d-flex flex-wrap'>
              <CustomCheck>
                <label className="custom-control-label-check  container-check">
                  <span >By Value(₹)</span>
                  <Controller
                    as={
                      <input
                        name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                        type="radio"
                        defaultChecked={!Number(opd ? GivePremiumRaterVariable(opd, policyData?.premium_contribution_type_opd, policyData?.premium_contribution_type_enhance) : policyData?.premium_contribution_type) || true}
                      />
                    }
                    name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                    onChange={([e]) => e.target.checked ? 0 : 1}
                    onClick={((e) => setValue(opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type', 0))}
                    control={control}
                    value={0}
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
                        defaultChecked={!!Number(opd ? GivePremiumRaterVariable(opd, policyData?.premium_contribution_type_opd, policyData?.premium_contribution_type_enhance) : policyData?.premium_contribution_type) || false}
                        value={1}
                      />
                    }
                    name={opd ? 'premium_contribution_type_' + PremiumRater[opd] : 'premium_contribution_type'}
                    onChange={([e]) => e.target.checked ? 1 : 0}
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

  return (

    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="d-flex flex-wrap">
        {policyData.policy_sub_type_id === 1 &&
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Select
                label="Cover Type"
                option={options.policy_rater_type}
                valueName="name"
                id="policy_rater_type_id"
                selected={policyData.policy_rater_type_id || ""}
                required
              />}
              name="policy_rater_type_id"
              control={control}
            />
          </Col>
        }

        {(policy_rater_type_id === 2) &&
          <Col md={6} lg={4} xl={3} sm={12}>
            <Controller
              as={<Select
                label="Parent IPD Policy"
                option={ipdPolicies.map(item => ({
                  id: item.id,
                  name: item.policy_name + ':' + item.policy_number,
                  value: item.id
                }))}
                valueName="name"
                id="base_ipd_policy_id"
                selected={policyData.base_ipd_policy_id || ""}
                required={false}
              />}
              name="base_ipd_policy_id"
              control={control}
            />
          </Col>}
        {!!policyData.is_parent_policy && Number(policyData.policy_sub_type_id) <= 3 &&
          <Col xl={4} lg={5} md={6} sm={12} className="pl-4 mb-4">
            <Controller
              as={
                <ComponentSelect
                  label="Parents Base Policy"
                  placeholder="Select Parents Base Policy"
                  options={masterPolicy?.map(item => ({
                    id: item.id,
                    name: item.policy_name + ':' + item.policy_number,
                    value: item.id
                  }))}
                />
              }
              required={false}
              control={control}
              name="parent_base_policy_id"
            />
          </Col>}
      </Row>

      {policy_rater_type_id === 3 && <>
        <Marker />
        <Typography>{'\u00A0'}IPD</Typography>
      </>}
      <Row className="d-flex flex-wrap">
        {_renderRaterDD()}
      </Row>
      {((!!premiumType &&
        premiumType !== 1) ||
        (!!siType &&
          siType === 8)) && isNoRule && CollectTax('')}
      <Row className="d-flex flex-wrap">
        {sum_insured_type_id === 3 && isNoRule && _renderSI('_ind')}
      </Row>
      <Row className="d-flex flex-wrap">
        {sum_insured_type_id === 3 && (!BaseWiseSIPremium && isNoRule) && _renderPremium('_ind')}
      </Row>
      <Row className="d-flex flex-wrap">
        {isNoRule && _renderSI('')}
      </Row>
      <Row className="d-flex flex-wrap">
        {(!BaseWiseSIPremium && isNoRule) && _renderPremium('')}
      </Row>

      {policy_rater_type_id === 3 && <>
        <Marker />
        <Typography>{'\u00A0'}OPD</Typography>

        <Row className="d-flex flex-wrap">
          {_renderRaterDD('_opd')}
        </Row>
        <Row className="d-flex flex-wrap">
          {((!!premiumType_opd &&
            premiumType_opd !== 1) ||
            (!!siType_opd &&
              siType_opd === 8)) && isNoRule && CollectTax('_opd')}
        </Row>
        <Row className="d-flex flex-wrap">
          {isNoRule && _renderSI('_opd')}
        </Row>
        <Row className="d-flex flex-wrap">
          {isNoRule && _renderPremium('_opd')}
        </Row>
      </>}

      {policy_rater_type_id === 5 && <>
        <Marker />
        <Typography>{'\u00A0'}Enhance</Typography>

        <Row className="d-flex flex-wrap">
          {_renderRaterDD('_enhance')}
        </Row>
        <Row className="d-flex flex-wrap">
          {((!!premiumType_enhance &&
            premiumType_enhance !== 1) ||
            (!!siType_enhance &&
              siType_enhance === 8)) && isNoRule && CollectTax('_enhance')}
        </Row>
        <Row className="d-flex flex-wrap">
          {isNoRule && _renderSI('_enhance')}
        </Row>
        <Row className="d-flex flex-wrap">
          {isNoRule && _renderPremium('_enhance')}
        </Row>
      </>}

      <Marker />
      <Typography>{'\u00A0'}Deduction Type</Typography>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={3} sm={12}>
          <Head>Has Payroll?</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
            <Controller
              as={<CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                <input name={'has_payroll'} type={'radio'} value={1} defaultChecked={!!policyData.has_payroll} />
                <span></span>
              </CustomControl>}
              name={'has_payroll'}
              control={control}
            />
            <Controller
              as={<CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                <input name={'has_payroll'} type={'radio'} value={0} defaultChecked={!policyData.has_payroll} />
                <span></span>
              </CustomControl>}
              name={'has_payroll'}
              control={control}
            />
          </div>
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Head>Has Flex?</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
            <Controller
              as={<CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                <input name={'has_flex'} type={'radio'} value={1} defaultChecked={!!policyData.has_flex} />
                <span></span>
              </CustomControl>}
              name={'has_flex'}
              control={control}
            />
            <Controller
              as={<CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                <input name={'has_flex'} type={'radio'} value={0} defaultChecked={!policyData.has_flex} />
                <span></span>
              </CustomControl>}
              name={'has_flex'}
              control={control}
            />
          </div>
        </Col>
        {/* {isPayroll && !!topup_policy && <Col md={6} lg={4} xl={3} sm={12}> */}
        {isPayroll && (<Col md={6} lg={4} xl={3} sm={12}>
          <Head>Installment Allowed from Payroll?</Head>
          <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -40px' }}>
            <Controller
              as={<CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                <input name={'is_installment_allowed'} type={'radio'} value={1} defaultChecked={!!policyData.is_installment_allowed} />
                <span></span>
              </CustomControl>}
              name={'is_installment_allowed'}
              control={control}
            />
            <Controller
              as={<CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                <input name={'is_installment_allowed'} type={'radio'} value={0} defaultChecked={!policyData.is_installment_allowed} />
                <span></span>
              </CustomControl>}
              name={'is_installment_allowed'}
              control={control}
            />
          </div>
        </Col>)}
      </Row>

      {/* {isPayroll && allowedInstallment && !!topup_policy && <Row className="mt-2"> */}
      {isPayroll && allowedInstallment && <Row className="mt-2">
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
                defaultChecked={policyData.installment_level ? policyData.installment_level === '0' : (employerInstallment?.length ? employerInstallment.every(({ installment_level }) => installment_level === 0) : true)}
                onChange={(e) => validateInstalment(e, employerInstallment, setValue)}
                onClick={e => null}
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
                defaultChecked={policyData.installment_level ? policyData.installment_level === '1' : (employerInstallment?.length ? employerInstallment.every(({ installment_level }) => installment_level === 1) : false)}
                onChange={(e) => validateInstalment(e, employerInstallment, setValue)}
                onClick={e => null}
              />
              <span></span>
            </CustomControl>
          </div>
        </Col>
        <Col md={6} lg={4} xl={3} sm={12}>
          <Controller
            as={<Input
              label="Monthly equitable period"
              placeholder="Enter period in month"
              type="tel"
              onKeyDown={numOnly} onKeyPress={noSpecial}
              maxLength={2}
              min={1}
            />}
            // error={errors && errors.no_of_times_of_salary}
            name={"installment_period"}
            control={control}
          />
        </Col>
        <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
          <Btn type="button" onClick={onAddInstallmemts}>
            <i className="ti ti-plus"></i> Add
          </Btn>
        </Col>
        <Col md={12} lg={12} xl={12} sm={12}>
          {installment_periods.length
            ? <BenefitList>
              {installment_periods.map((period, index) =>
                <Chip
                  key={index + 'installment_periods'}
                  id={index}
                  name={`${period} month`}
                  onDelete={removeInstallmemts} />)}
            </BenefitList>
            : null}
        </Col>
        {validateInstalmentNote(installment_level, employerInstallment) && <Col md={12} lg={12} xl={12} sm={12}>
          <Title fontSize="0.9rem" color="#007bff">
            Note: {validateInstalmentNote(installment_level, employerInstallment)}
          </Title>
        </Col>}
      </Row>}


      < Marker />
      <Typography>{'\u00A0'}Addition Cover(Benefit)</Typography>
      <InputWrapper className="custom-control custom-checkbox">
        <Controller
          as={
            <input
              id="customCheck"
              className="custom-control-input"
              type="checkbox"
              defaultChecked={showForm} />
          }
          name="add_benefit"
          control={control}
          onChange={onChange}
        />

        <label className="custom-control-label" htmlFor="customCheck">Add Benefit</label>
      </InputWrapper>

      {!!flexi && !!showForm &&
        <div style={style}>
          <TabWrapper width={'max-content'}>
            <Tab
              isActive={Boolean(tab === "1")}
              onClick={() => {
                if (planData.length) {
                  swal({
                    title: "Warning",
                    text: `Will Delete Created ${tab === '2' ? 'Plans' : (tab === '3' ? 'Package' : 'Swap')}!`,
                    icon: "warning",
                    buttons: {
                      cancel: "No",
                      'yes': 'Yes'
                    },
                    dangerMode: true,
                  })
                    .then(function (caseValue) {
                      switch (caseValue) {
                        case "yes":
                          setTab("1");
                          setPlanData([])
                          break;
                        default:
                      }
                    })
                } else {
                  setTab("1");
                }
              }}>
              Single
            </Tab>

            <Tab
              isActive={Boolean(tab === "2")}
              onClick={() => {
                if (tab !== '1' && planData.length) {
                  swal({
                    title: "Warning",
                    text: `Will Delete Created ${tab === '4' ? 'Swap' : 'Package'}!`,
                    icon: "warning",
                    buttons: {
                      cancel: "No",
                      'yes': 'Yes'
                    },
                    dangerMode: true,
                  })
                    .then(function (caseValue) {
                      switch (caseValue) {
                        case "yes":
                          setTab("2");
                          setPlanData([])
                          break;
                        default:
                      }
                    })
                } else {
                  setTab("2");
                }
              }}>
              Plan Wise
            </Tab>

            <Tab
              isActive={Boolean(tab === "3")}
              onClick={() => {
                if (tab !== '1' && planData.length) {
                  swal({
                    title: "Warning",
                    text: `Will Delete Created ${tab === '4' ? 'Swap' : 'Plan'}!`,
                    icon: "warning",
                    buttons: {
                      cancel: "No",
                      'yes': 'Yes'
                    },
                    dangerMode: true,
                  })
                    .then(function (caseValue) {
                      switch (caseValue) {
                        case "yes":
                          setTab("3");
                          setPlanData([])
                          break;
                        default:
                      }
                    })
                } else {
                  setTab("3");
                }
              }}>
              Package Wise
            </Tab>
            <Tab
              isActive={Boolean(tab === "4")}
              onClick={() => {
                if (tab !== '1' && planData.length) {
                  swal({
                    title: "Warning",
                    text: `Will Delete Created ${tab === '2' ? 'Plan' : 'Package'}!`,
                    icon: "warning",
                    buttons: {
                      cancel: "No",
                      'yes': 'Yes'
                    },
                    dangerMode: true,
                  })
                    .then(function (caseValue) {
                      switch (caseValue) {
                        case "yes":
                          setTab("4");
                          setPlanData([])
                          break;
                        default:
                      }
                    })
                } else {
                  setTab("4");
                }
              }}>
              Swap Wise
            </Tab>
          </TabWrapper>
        </div>
      }
      {_renderForm()}


      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
