import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import _ from 'lodash';


import { Stepper, Step, Loader } from 'components';
import {
  loadFormConfigs, loadPolicyConfigs, saveTempPolicy,
  clearSavedStep, deleteTempPolicy, savePolicy,
  clearCompleteFlag, clearDownloadSampleSuccess,
  loadRelationMaster,
  clearPolicyError, clear_masterPolicy, employerInstallment, loadBrokerBranch,
  // ipdError
} from '../policy-config.slice';
import {
  loadPolicy, clear,
  updatePolicyConfigData, clearPolicyConfigData, employerCdStatement
} from '../approve-policy/approve-policy.slice';
import { components, TopUpMapBase } from '../helper';
import { FormConfig } from '../models/form-config';
import swal from 'sweetalert';
import { downloadFile } from 'utils';
import { BrokerModal } from './brokerModal';
import { Decrypt } from '../../../utils';
import { getUserDataDropdown } from "modules/user-management/user.slice";
import { clearData } from '../../user-management/user.slice';

const Wrapper = styled.div`
    padding: 20px 20px 20px 0;
`;

const PolicyConfig = props => {

  // Access Control
  const history = useHistory();
  let { userType, id, enquiry_id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const ic_plan_id = query.get("ic_plan_id");
  const employer_id = query.get("employer_id");

  id = Decrypt(id)
  const { modules, currentUser } = useSelector(state => state.login);
  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find((elem) => elem.url === history?.location?.pathname)
      if (!thisModule?.canread &&
        !history?.location?.pathname.includes('/policy-renew/') &&
        !history?.location?.pathname.includes('/policy-create/') &&
        !history?.location?.pathname.includes('/policy-copy/') &&
        !history?.location?.pathname.includes('/policy-generate')) {
        history.replace('/home')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])

  const dispatch = useDispatch();
  const [brokerId, setBrokerId] = useState('');
  const [modal, setModal] = useState(true);
  const [steps, setSteps] = useState([]);
  const policyConfigState = useSelector(state => state.policyConfig);
  const { policyData: renwalPolicyData, loading: loading1, error: error1 } = useSelector(state => state.approvePolicy);


  const [foundConfig, setFoundConfig] = useState(false);
  const [premium_file, setPremium_file] = useState(null);
  const [suminsured_file, setSuminsured_file] = useState(null);
  const [in_premium_file, setInPremium_file] = useState(null);
  const [in_suminsured_file, setInSuminsured_file] = useState(null);
  const [premium_file_opd, setPremium_file_opd] = useState(null);
  const [suminsured_file_opd, setSuminsured_file_opd] = useState(null);
  const [premium_file_topup, setPremium_file_topup] = useState(null);
  const [suminsured_file_topup, setSuminsured_file_topup] = useState(null);
  const [premium_file_enhance, setPremium_file_enhance] = useState(null);
  const [suminsured_file_enhance, setSuminsured_file_enhance] = useState(null);


  const { formConfigs, submitError, policyConfigs, policyDeleted, sampleURL, completeConfig, familyLabels, renew_type } = policyConfigState;

  useEffect(() => {
    if (userType === 'admin' && modal === false && !brokerId) {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal])

  // useEffect(() => {
  //   if (id) {
  //     if (renwalPolicyData && renwalPolicyData.benefits && renwalPolicyData.benefits.length > 0) {
  //       dispatch(setBenefits(renwalPolicyData.benefits));
  //     }
  //     if (renwalPolicyData.cd_balance && renwalPolicyData.cd_balance_threshold) {
  //       dispatch(setCdBalance(renwalPolicyData.cd_balance));
  //       dispatch(setThresholdBalance(renwalPolicyData.cd_balance_threshold));
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [renwalPolicyData, id])
  const PolicyGenerate = history?.location?.pathname.includes('/policy-generate');

  useEffect(() => {

    if (PolicyGenerate) {
      if (!renwalPolicyData.policy_name) {
        dispatch(clearPolicyConfigData())
        history.push('/broker/policies')
      }
    }

    return () => {
      dispatch(clearPolicyConfigData());
      dispatch(clear_masterPolicy());
      dispatch(employerInstallment([]))
      dispatch(employerCdStatement([]))
      dispatch(clearData())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userType === 'broker' || brokerId) {
      dispatch(loadFormConfigs());
      !enquiry_id && dispatch(loadPolicyConfigs(brokerId, !PolicyGenerate && id, enquiry_id, ic_plan_id, PolicyGenerate));
      dispatch(loadRelationMaster());
      dispatch(
        getUserDataDropdown({
          status: 1,
          type: "users",
          currentUser: 'Broker',
          per_page: 10000,
          is_super_hr: currentUser.is_super_hr
        }))
    }
    if (!PolicyGenerate && id) {
      dispatch(loadPolicy(id, true));
    }
    // dispatch(loadRfq({
    //   ic_plan_id, ...(currentUser?.ic_id ? { ic_id: currentUser.ic_id } :
    //     { broker_id: currentUser?.broker_id })
    // }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, brokerId]);

  useEffect(() => {
    if ((userType === 'broker' || brokerId) && enquiry_id && (currentUser?.ic_id || currentUser?.broker_id)) {
      dispatch(loadPolicyConfigs(brokerId, id, enquiry_id, {
        ic_plan_id, ...(currentUser?.ic_id ? { ic_id: currentUser.ic_id } :
          { broker_id: currentUser?.broker_id })
      }));
    }
    if (currentUser?.broker_id) {
      dispatch(loadBrokerBranch(currentUser?.broker_id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  useEffect(() => {
    if (submitError) {
      swal("Alert", submitError || "", "warning");
    }
    if (error1) {
      swal("Alert", error1 || "", "warning")
        .then(() => history.goBack());
    }

    return () => {
      dispatch(clearPolicyError())
      dispatch(clear())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitError, error1]);


  useEffect(() => {
    if (completeConfig) {
      swal('Success', "Policy created successfully", "success");
      history.push(`/${userType}/policies`);
    }

    return () => {
      dispatch(clearCompleteFlag());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeConfig, dispatch]);

  useEffect(() => {
    if ((policyConfigs?.config) && !foundConfig) {
      setFoundConfig(prev => true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyConfigs]);

  useEffect(() => {
    if (policyDeleted) {
      setFoundConfig(prev => false);
    }
  }, [policyDeleted]);

  useEffect(() => {
    if (sampleURL) {
      downloadFile(sampleURL);
    }
    return () => { dispatch(clearDownloadSampleSuccess()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleURL]);

  useEffect(() => {
    if (formConfigs
      && formConfigs.length > 0) {
      setSteps([...formConfigs])
    }
  }, [formConfigs]);

  const checkClaimShoudExist = (sub_type) => {
    if (formConfigs && formConfigs.length > 0) {
      if ([2, 3, 5, 6].includes(Number(sub_type))) {
        let formConfigsCopy = [...formConfigs];
        formConfigsCopy.pop()
        setSteps(formConfigsCopy)
      } else {
        setSteps([...formConfigs])
      }
    }
  }

  // useEffect(() => {
  //   if (ipd_error) {
  //     swal('No IPD found !', ipd_error, 'info')
  //   }
  //   return () => {
  //     dispatch(ipdError(''))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ipd_error])


  const onSave = payload => {
    if (policyConfigState && policyConfigState.brokerId) {
      const { data, formId } = payload;
      data.broker_id = policyConfigState.brokerId;

      const savedConfig = (policyConfigState.policyConfigs
        && policyConfigState.policyData)
        ? policyConfigState.policyData
        : {};

      if (formId === "basic-details-form") {
        if (data.policy_sub_type) {
          checkClaimShoudExist(data.policy_sub_type)
        }
      }
      // let _saveConfig;
      // if (!data.has_lock_in && formId === "basic-details-form") {
      //   _saveConfig = _.omit(savedConfig,
      //     [
      //       'member_addition_lock_in',
      //       'member_addition_lock_in_unit',
      //       'member_removal_lock_in',
      //       'member_removal_lock_in_unit',
      //       'member_addition_lock_in_type',
      //       'member_removal_lock_in_type'
      //     ]);
      // }
      // else {
      //   _saveConfig = savedConfig;
      // }
      let mergedData = {
        ...(_.cloneDeep(id ? renwalPolicyData : savedConfig)), ...data, type: id ? 0 : 1
      };
      const opd_ipd = Number(mergedData.policy_rater_type_id) === 3 ? true : false;
      const ipd_topup = Number(mergedData.policy_rater_type_id) === 4 ? true : false;
      const ipd_enhance = Number(mergedData.policy_rater_type_id) === 5 ? true : false;
      const is_only_opd = Number(mergedData.policy_rater_type_id) === 2 ? 1 : 0

      if (data.ages || savedConfig.ages) {
        for (let i = 0; i < mergedData.ages.length; i++) {
          if (typeof mergedData.ages[i] !== "undefined") {
            mergedData.ages[i] = { ...savedConfig?.ages?.length && savedConfig.ages[i], ...mergedData?.ages?.length && mergedData.ages[i], is_opd_contribution: is_only_opd, is_topup_contribution: 0 };
          }
        }
      }
      if (data.ages_opd && opd_ipd) {
        for (let i = 0; i < mergedData.ages_opd.length; i++) {
          mergedData.ages_opd[i] = { ...savedConfig.ages[i], ...mergedData.ages_opd && mergedData.ages_opd[i], is_opd_contribution: 1, is_topup_contribution: 0 };
        }
      }
      if (data.ages_topup && ipd_topup) {
        for (let i = 0; i < mergedData.ages_opd.length; i++) {
          mergedData.ages_topup[i] = { ...savedConfig.ages[i], ...mergedData.ages_topup && mergedData.ages_topup[i], is_topup_contribution: 1, is_opd_contribution: 0 };
        }
      }

      if ((formId === 'claim-form' && steps.length === 6) || (formId === 'additional-details-form' && steps.length === 5)) {

        // ommiting keys 
        if (Number(mergedData.policy_rater_type_id) === 1) {
          mergedData = _.omit(mergedData,
            [
              'opd_suminsured_type',
              'opd_suminsured_sub_type',
              'opd_premium_type',
              'employer_contribution_opd',
              'employee_contribution_opd',
              'ages_opd',

              'topup_suminsured_type',
              'topup_suminsured_sub_type',
              'topup_premium_type',
              'employer_contribution_topup',
              'employee_contribution_topup',
              'ages_topup',
            ]);
        }
        if (opd_ipd) {
          mergedData = _.omit(mergedData,
            [
              'topup_suminsured_type',
              'topup_suminsured_sub_type',
              'topup_premium_type',
              'employer_contribution_topup',
              'employee_contribution_topup',
              'ages_topup',
              'enhance_suminsured_type',
              'enhance_suminsured_sub_type',
              'enhance_premium_type',
            ]);
        }
        if (ipd_topup) {
          mergedData = _.omit(mergedData,
            [
              'opd_suminsured_type',
              'opd_suminsured_sub_type',
              'opd_premium_type',
              'employer_contribution_opd',
              'employee_contribution_opd',
              'ages_opd',
              'enhance_suminsured_type',
              'enhance_suminsured_sub_type',
              'enhance_premium_type',
            ]);
        }

        if (ipd_enhance) {
          mergedData = _.omit(mergedData,
            [
              'opd_suminsured_type',
              'opd_suminsured_sub_type',
              'opd_premium_type',
              'employer_contribution_opd',
              'employee_contribution_opd',
              'ages_opd',
              'topup_suminsured_type',
              'topup_suminsured_sub_type',
              'topup_premium_type',
              'employer_contribution_topup',
              'employee_contribution_topup',
              'ages_topup',
            ]);
        }


        if (!mergedData.has_lock_in) {
          mergedData = _.omit(mergedData,
            [
              'member_addition_lock_in',
              'member_addition_lock_in_unit',
              'member_removal_lock_in',
              'member_removal_lock_in_unit',
              'member_addition_lock_in_type',
              'member_removal_lock_in_type'
            ]);
        }


        if (Number(mergedData.policy_type) === 1) {
          mergedData = _.omit(mergedData,
            [
              'suminsured_lock_in',
              'suminsured_lock_in_unit',
              'has_suminsured_lock_in'
            ]);
        }
        else {
          if ((Number(mergedData.policy_type) === 2 && !mergedData.has_suminsured_lock_in)) {
            mergedData = _.omit(mergedData,
              [
                'suminsured_lock_in',
                'suminsured_lock_in_unit',
              ]);
          }
        }

        let BaseWiseSIPr = Number(mergedData.si_sub_type) === 8;
        let BaseWiseSIPr_topup = Number(mergedData.topup_suminsured_sub_type) === 8;
        let _ageData = mergedData.ages.map((item, i) => {
          if (item) {
            if (item.is_special_member_allowed) {
              return { ...item, is_opd_contribution: is_only_opd };
            }
            else {
              let mergedData = _.omit(item,
                [
                  'special_member_additional_premium',
                  'special_member_employee_contribution',
                  'special_member_employer_contribution'
                ]);
              return {
                ...mergedData,
                is_opd_contribution: is_only_opd
              };
            }
          }
          else {
            return null
          }
        })

        // if ((Number(mergedData.policy_sub_type) === 6 && Number(mergedData.si_sub_type) === 5)) {
        //   mergedData = _.omit(mergedData,
        //     [
        //       'max_si_limit',
        //       'min_si_limit',
        //       'no_of_times_of_salary'
        //     ]);
        // }

        if (!mergedData.is_midterm_enrollement_allowed_for_spouse) {
          mergedData = _.omit(mergedData,
            [
              'default_midterm_enrollement_days_for_spouse',
              'midterm_premium_calculation_from_for_spouse'
            ]);
        }
        if (!mergedData.is_midterm_enrollement_allowed_for_partner) {
          mergedData = _.omit(mergedData,
            [
              'default_midterm_enrollement_days_for_partner',
              'midterm_premium_calculation_from_for_partner'
            ]);
        }
        if (!mergedData.is_midterm_enrollement_allowed_for_kids) {
          mergedData = _.omit(mergedData,
            [
              'default_midterm_enrollement_days_for_kids',
              'midterm_premium_calculation_from_for_kids'
            ]);
        }

        // ------------------------

        mergedData.ages = _ageData;
        let agesClone = [];
        if (mergedData.ages_opd && opd_ipd) {
          agesClone = _.cloneDeep(mergedData.ages || [])
          for (let i = 0; i < mergedData.ages_opd.length; i++) {
            agesClone.push({ ...mergedData.ages_opd[i], is_opd_contribution: 1 });
          }
        }
        if (mergedData.ages_topup && ipd_topup) {
          agesClone = _.cloneDeep(mergedData.ages || [])
          for (let i = 0; i < mergedData.ages_topup.length; i++) {
            agesClone.push({ ...mergedData.ages_topup[i], is_opd_contribution: 0, is_topup_contribution: 1 });
          }
        }
        const formData = new FormData();

        // all key append
        for (let key in mergedData) {
          if (mergedData[key] !== '' && mergedData[key] !== null && mergedData[key] !== undefined)
            formData.append(`${key}`, `${mergedData[key]}`)
        }
        formData.set('employer', mergedData['employer']?.value);
        // restructure rater key
        if (is_only_opd) {
          formData.set('opd_suminsured_type', mergedData['si_type']);
          formData.set('opd_suminsured_sub_type', mergedData['si_sub_type'])
          formData.set('opd_premium_type', mergedData['premium_type'])
          formData.set('premium_tax_type_opd', mergedData['premium_tax_type'])
          formData.set('premium_tax_opd', mergedData['premium_tax'])
          formData.set('premium_contribution_type_opd', mergedData['premium_contribution_type'])
          formData.set('employer_contribution_opd', mergedData['employer_contribution'])
          formData.set('employee_contribution_opd', mergedData['employee_contribution'])

          formData.delete('si_type');
          formData.delete('si_sub_type');
          formData.delete('premium_type');
          formData.delete('premium_tax_type')
          formData.delete('premium_tax')
          formData.delete('premium_contribution_type')
          formData.delete('employer_contribution')
          formData.delete('employee_contribution')
        }

        if (Number(mergedData.si_sub_type) !== 16 && Number(mergedData.premium_type) !== 18) {
          // si file
          if (![1, 5].includes(Number(mergedData.si_sub_type))) {
            if (suminsured_file) {
              formData.append(is_only_opd ? 'opd_si_file' : 'suminsured_file', suminsured_file)
            }
            else if (Number(mergedData.si_type) === 3 ? ((premium_file) || !(in_suminsured_file || in_premium_file)) : true) {
              swal("Incomplete", "Attach suminsured file", "info");
              return;
            }
            // formData.delete('sum_insured');
          }

          // si file opd
          if (![1].includes(Number(mergedData.opd_suminsured_sub_type)) && opd_ipd) {
            if (suminsured_file_opd) {
              formData.append('opd_si_file', suminsured_file_opd)
            }
            else {
              swal("Incomplete", "Attach opd suminsured file", "info");
              return;
            }
            // formData.delete('sum_insured_opd');
          }

          // si file topup
          if (![1].includes(Number(mergedData.topup_suminsured_sub_type)) && ipd_topup) {
            if (suminsured_file_topup) {
              formData.append('topup_si_file', suminsured_file_topup)
            }
            else {
              swal("Incomplete", "Attach Topup suminsured file", "info");
              return;
            }
            // formData.delete('sum_insured_topup');
          }

          // si file enhance
          if (![1].includes(Number(mergedData.enhance_suminsured_sub_type)) && ipd_enhance) {
            if (suminsured_file_enhance) {
              formData.append('enhance_si_file', suminsured_file_enhance)
            }
            else {
              swal("Incomplete", "Attach Enhance suminsured file", "info");
              return;
            }
            // formData.delete('sum_insured_topup');
          }
        }


        // si flat
        if ((Number(mergedData.si_sub_type) === 1 ||
          Number(mergedData.opd_suminsured_sub_type) === 1 ||
          Number(mergedData.topup_suminsured_sub_type) === 1) ||
          (Number(mergedData.premium_type) === 1 ||
            Number(mergedData.opd_premium_type) === 1 ||
            Number(mergedData.topup_premium_type) === 1)) {
          let tempSI1 = [];
          if (!BaseWiseSIPr && (Number(mergedData.si_sub_type) === 1 || Number(mergedData.premium_type) === 1)) {
            tempSI1 = mergedData.sum_insured?.map((value) => ({
              value: value,
              is_opd_rate: is_only_opd,
              is_topup_rate: 0,
              is_enchance_flex_rate: 0
            })) || [];
          }
          let tempSI2 = [];
          if (opd_ipd && (Number(mergedData.opd_suminsured_sub_type) === 1 || Number(mergedData.opd_premium_type) === 1)) {
            tempSI2 = mergedData.sum_insured_opd?.map((value) => ({
              value: value,
              is_opd_rate: 1,
              is_topup_rate: 0,
              is_enchance_flex_rate: 0
            }));
          }
          let tempSI3 = [];
          if (ipd_topup && !BaseWiseSIPr_topup && (Number(mergedData.topup_suminsured_sub_type) === 1 || Number(mergedData.topup_premium_type) === 1)) {
            tempSI3 = mergedData.sum_insured_topup?.map((value) => ({
              value: value,
              is_opd_rate: 0,
              is_topup_rate: 1,
              is_enchance_flex_rate: 0
            }));
          }
          let tempSI4 = [];
          if (ipd_enhance && (Number(mergedData.enhance_suminsured_sub_type) === 1 || Number(mergedData.enhance_premium_type) === 1)) {
            tempSI3 = mergedData.sum_insured_enhance?.map((value) => ({
              value: value,
              is_opd_rate: 0,
              is_topup_rate: 0,
              is_enchance_flex_rate: 1
            }));
          }
          formData.set('sum_insured', JSON.stringify([...(tempSI1 || []), ...(tempSI2 || []), ...(tempSI3 || []), ...(tempSI4 || [])]))
        }

        // premium file
        if (Number(mergedData.si_sub_type) !== 16 && Number(mergedData.premium_type) !== 18) {
          if (!BaseWiseSIPr || !BaseWiseSIPr_topup || ipd_enhance) {
            if (!BaseWiseSIPr) {
              if (![1].includes(Number(mergedData.premium_type))) {
                if (premium_file) {
                  formData.append(is_only_opd ? 'opd_premium_file' : 'premium_file', premium_file)
                } else if (Number(mergedData.si_type) === 3 ? ((suminsured_file) || !(in_suminsured_file || in_premium_file)) : true) {
                  swal("Incomplete", "Attach premium file", "info");
                  return;
                }
                formData.delete('premium');
              }
              // premium file opd
              if (![1].includes(Number(mergedData.opd_premium_type)) && opd_ipd) {
                if (premium_file_opd) {
                  formData.append('opd_premium_file', premium_file_opd)
                } else {
                  swal("Incomplete", "Attach opd premium file", "info");
                  return;
                }
                formData.delete('premium_opd');
              }
            } else {

            }
            // premium file topup
            if (![1].includes(Number(mergedData.topup_premium_type)) && ipd_topup && !BaseWiseSIPr_topup) {
              if (premium_file_topup) {
                formData.append('topup_premium_file', premium_file_topup)
              } else {
                swal("Incomplete", "Attach topup premium file", "info");
                return;
              }
              formData.delete('premium_topup');
            }
            // premium file enhance
            if (![1].includes(Number(mergedData.enhance_premium_type)) && ipd_enhance) {
              if (premium_file_enhance) {
                formData.append('enhance_premium_file', premium_file_enhance)
              } else {
                swal("Incomplete", "Attach Enhance premium file", "info");
                return;
              }
              formData.delete('premium_enhance');
            }

            // premium flat
            if (Number(mergedData.premium_type) === 1 ||
              Number(mergedData.opd_premium_type) === 1 ||
              Number(mergedData.topup_premium_type) === 1 ||
              Number(mergedData.enhance_premium_type) === 1) {
              let tempPremium1 = [];
              if (!BaseWiseSIPr) {
                tempPremium1 = mergedData.premium?.map((values) => ({
                  ...values,
                  is_topup_rate: 0,
                  is_opd_rate: is_only_opd,
                  is_enchance_flex_rate: 0
                }));
              }
              let tempPremium2 = [];
              if (opd_ipd && Number(mergedData.opd_premium_type) === 1) {
                tempPremium2 = mergedData.premium_opd?.map((values) => ({
                  ...values,
                  is_opd_rate: 1,
                  is_topup_rate: 0,
                  is_enchance_flex_rate: 0
                }));
              }
              let tempPremium3 = [];
              if (ipd_topup && Number(mergedData.topup_premium_type) === 1 && !BaseWiseSIPr_topup) {
                tempPremium3 = mergedData.premium_topup?.map((values) => ({
                  ...values,
                  is_topup_rate: 1,
                  is_opd_rate: 0,
                  is_enchance_flex_rate: 0
                }));
              }
              let tempPremium4 = [];
              if (ipd_enhance && Number(mergedData.enhance_premium_type) === 1) {
                tempPremium4 = mergedData.premium_enhance?.map((values) => ({
                  ...values,
                  is_topup_rate: 0,
                  is_opd_rate: 0,
                  is_enchance_flex_rate: 1
                }));
              }
              formData.set('premium', JSON.stringify([...(tempPremium1 || []), ...(tempPremium2 || []), ...(tempPremium3 || []), ...(tempPremium4 || [])]));
            }
          }
        }

        if (Number(mergedData.si_type) === 3) {
          if (![1, 5].includes(Number(mergedData.si_sub_type))) {
            if (in_suminsured_file) {
              formData.append('in_suminsured_file', in_suminsured_file)
            }
            else if (in_premium_file || !(premium_file || suminsured_file)) {
              swal("Incomplete", "Attach suminsured file", "info");
              return;
            }
            // formData.delete('sum_insured');
          }
          if (![1].includes(Number(mergedData.premium_type))) {
            if (in_premium_file) {
              formData.append('in_premium_file', in_premium_file)
            } else if (in_suminsured_file || !(premium_file || suminsured_file)) {
              swal("Incomplete", "Attach premium file", "info");
              return;
            }
            formData.delete('in_premium');
          }

          if (Number(mergedData.si_sub_type) === 1) {
            let tempSI1 = [];
            if ((Number(mergedData.si_sub_type) === 1 || Number(mergedData.premium_type) === 1)) {
              tempSI1 = mergedData.in_sum_insured?.map((value) => ({
                value: value,
                is_opd_rate: is_only_opd,
                is_topup_rate: 0,
                is_enchance_flex_rate: 0
              })) || [];
            }
            formData.set('in_sum_insured', JSON.stringify(tempSI1))
          }

          if (Number(mergedData.premium_type) === 1) {
            let tempPremium1 = [];
            if (!BaseWiseSIPr) {
              tempPremium1 = mergedData.in_premium?.map((values) => ({
                ...values,
                is_topup_rate: 0,
                is_opd_rate: is_only_opd,
                is_enchance_flex_rate: 0
              }));
            }
            formData.set('in_premium', JSON.stringify(tempPremium1));
          }
        }

        BaseWiseSIPr && formData.delete('premium_type');
        BaseWiseSIPr_topup && formData.delete('topup_premium_type');


        if (Number(mergedData.si_sub_type) === 5 || (Number(mergedData.topup_suminsured_sub_type) === 5 && ipd_topup) || (Number(mergedData.enhance_suminsured_sub_type) === 5 && ipd_enhance)) {
          formData.set('salary', JSON.stringify([
            ...mergedData.salary ? mergedData.salary?.map(elem => ({ ...elem, is_topup_rate: 0 })) : [],
            ...mergedData.salary_topup ? mergedData.salary_topup?.map(elem => ({ ...elem, is_topup_rate: 1 })) : [],
            ...mergedData.salary_enhance ? mergedData.salary_enhance?.map(elem => ({ ...elem, is_enchance_flex_rate: 1 })) : [],
          ]));
        } else {
          if (!Number(mergedData.top_up_cover_has_eligibility))
            formData.delete('calculate_eligibility_from')
        }

        let ages = [...agesClone];
        if (!ages.length) ages = mergedData.ages
        if (!Number(mergedData.is_employee_included)) {
          // ages = ages.filter(({ relation_id }) => Number(relation_id) !== 1);
          ages = ages.filter((item) => {
            if (item) {
              return Number(item.relation_id) !== 1
            }
            else {
              return null
            }
          })
        }
        if (mergedData.base_ipd_policy_id) {
          formData.set('base_ipd_policy_id', mergedData.base_ipd_policy_id)
        } else {
          formData.delete('base_ipd_policy_id')
        }
        // if (false) {
        //   if (mergedData.topup_master_policy_id) {
        //     formData.set('topup_master_policy_id', mergedData.topup_master_policy_id)
        //   } else {
        //     formData.delete('topup_master_policy_id')
        //   }
        // }

        // refill relation
        const agesCopy = [...ages];

        agesCopy.forEach((elem) => {
          if (elem) {
            if ([3, 5, 7].includes(Number(elem.relation_id))) {
              ages.push({ ...elem, relation_id: Number(elem.relation_id) + 1 })
            }
          }
        });

        formData.set('ages', JSON.stringify(ages.filter((age) => age.relation_id)))
        formData.set('benefits', JSON.stringify(mergedData['benefits']))
        !mergedData['benefits']?.length && formData.delete('benefits_type')
        formData.set('contact_details', JSON.stringify(mergedData['contact_details'].filter(contact => contact).map(elem => ({ ...elem, designation_id: elem.designation_id?.label || 'Admin' }))))
        formData.append('is_parent_policy', mergedData['is_parent_policy'] || 0);
        if (mergedData['is_parent_policy'] === 1 && !mergedData.parent_contribution_type) {
          formData.append('parent_contribution_type', 0);
        }
        (mergedData.claims_array || []).forEach(({ is_mandatory, document_name, sample_document_url, document_type }, index) => {
          if (document_name) {
            formData.append(`claims[${index}][is_mandatory]`, is_mandatory);
            formData.append(`claims[${index}][document_name]`, document_name);
            formData.append(`claims[${index}][is_opd_document]`, is_only_opd);
            formData.append(`claims[${index}][document_type]`, document_type?.reduce((total, { id }) => total ? `${total},${id}` : id, '') || '3');

            if (sample_document_url && sample_document_url[0]) {
              formData.append(`claims[${index}][sample_document_url]`, sample_document_url[0]);
            }
          }
        })

        if (opd_ipd && mergedData.claims_array_opd) {
          const ipd_claim_document_length = mergedData.claims_array?.length;

          (mergedData.claims_array_opd || []).forEach(({ is_mandatory, document_name, sample_document_url, document_type }, index) => {
            if (document_name) {
              const base_index = ipd_claim_document_length + index;

              formData.append(`claims[${base_index}][is_mandatory]`, is_mandatory);
              formData.append(`claims[${base_index}][document_name]`, document_name);
              formData.append(`claims[${base_index}][is_opd_document]`, 1);
              //change index to base index
              formData.append(`claims[${base_index}][document_type]`, document_type?.reduce((total, { id }) => total ? `${total},${id}` : id, '') || '4');
              if (sample_document_url && sample_document_url[0]) {
                formData.append(`claims[${base_index}][sample_document_url]`, sample_document_url[0]);
              }
            }

          })
        }

        if (mergedData.employer_child?.length) {
          let employer_child_companies = mergedData.employer_child;
          if (mergedData.cd_account_type === 3 && mergedData.employer_child_cd?.length) {

            employer_child_companies = employer_child_companies.map((elem, index) => ({ ...elem, ...mergedData.employer_child_cd[index] }))
            formData.delete('cd_balance')
            formData.delete('cd_balance_threshold')
          }
          formData.set('employer_child_companies', JSON.stringify(employer_child_companies))
        }


        (mergedData.installment_periods || []).forEach((period) => {
          formData.append(`installment[]`, period);
        })

        if (!mergedData.enrollement_status) {
          formData.delete('enrollement_start_date');
          formData.delete('enrollement_end_date');
          // formData.delete('enrollment_window_close_mail_effective');
        }
        if (mergedData.enrollment_window_close_mail_effective) {
          formData.set('enrollment_window_close_mail_effective_date', mergedData.enrollment_window_close_mail_effective);
        } else {
          formData.delete('enrollment_window_close_mail_effective_date');
        }
        if (mergedData.benefits?.length && mergedData.benefits) {
          formData.set('benefits', JSON.stringify(mergedData.benefits))
        }
        if (!mergedData.tpa) {
          formData.delete('tpa');
        }
        formData.append('co_oprate_buffer', mergedData.co_oprate_buffer || 0);
        formData.append('broker_commission', mergedData.broker_commission || 0);
        formData.append('claim_back_date_days', mergedData.claim_back_date_days || 0);

        // temp delete key
        if (mergedData.no_of_daughter) {
          formData.delete('no_of_daughter');
        }
        if (mergedData.no_of_son) {
          formData.delete('no_of_son');
        }

        if (mergedData.installment_amounts?.length) {
          formData.delete('installment_amounts');
          mergedData.installment_amounts.forEach((value) => {
            formData.append('installment_amounts[]', value);
          })
        } else {
          formData.delete('installment_amounts');
        }

        // topup mapping
        if (mergedData.topup_master_policy_ids?.length) {
          mergedData.topup_master_policy_ids.forEach(({ policy_id }, index) => {
            formData.append(TopUpMapBase[index].input, policy_id);
          })
        }

        // parents base policy
        if (!!mergedData.parent_base_policy_id || !Number(mergedData['is_parent_policy'])) {
          formData.delete('parent_base_policy_id');
        }

        if (Number(mergedData.policy_type) === 1) {
          formData.delete('topup_compulsion_flag');
        }

        if (mergedData.broker_branch_id && mergedData.broker_branch_id.id) {
          formData.set('broker_branch_id', mergedData.broker_branch_id.id);
        }

        // co insurer
        if (mergedData.co_insurer_array?.length) {
          mergedData.co_insurer_array.forEach((value, index) => {
            formData.append(`coinsurer[${index}][co_insurer_id]`, value.id);
            formData.append(`coinsurer[${index}][co_insurer_percentage]`, value.percentage);
          })
        }

        // top optiona-mandatory
        if (mergedData.top_up_policy_ids?.length) {
          formData.delete('top_up_policy_ids');
          mergedData.top_up_policy_ids.forEach(({ id }) => formData.append('top_up_policy_ids[]', id))
        } else {
          formData.delete('top_up_policy_ids');
        }

        dispatch(savePolicy(formData, formId,
          (id && history?.location?.pathname.includes('/policy-renew/')) && {
            old_policy_id: id,
            renew_flag: renew_type,
            suminsured: mergedData.renew_suminsured
          }
        ));

      }
      else {

        if (formId === "premium-details-form") {

          if (Number(mergedData.si_sub_type) !== 5) {
            mergedData = _.omit(mergedData,
              [
                'salary'
              ]);
          }

          if (mergedData?.premium_file)
            setPremium_file(mergedData?.premium_file);
          if (mergedData?.suminsured_file)
            setSuminsured_file(mergedData?.suminsured_file);
          if (mergedData?.in_premium_file)
            setInPremium_file(mergedData?.in_premium_file);
          if (mergedData?.in_suminsured_file)
            setInSuminsured_file(mergedData?.in_suminsured_file);
          if (mergedData?.premium_file_opd)
            setPremium_file_opd(mergedData?.premium_file_opd);
          if (mergedData?.suminsured_file_opd)
            setSuminsured_file_opd(mergedData?.suminsured_file_opd);
          if (mergedData?.premium_file_topup)
            setPremium_file_topup(mergedData?.premium_file_topup);
          if (mergedData?.suminsured_file_topup)
            setSuminsured_file_topup(mergedData?.suminsured_file_topup);
          if (mergedData?.premium_file_enhance)
            setPremium_file_enhance(mergedData?.premium_file_enhance);
          if (mergedData?.suminsured_file_enhance)
            setSuminsured_file_enhance(mergedData?.suminsured_file_enhance);
        }
        if (mergedData.si_sub_type !== 1) {
          delete mergedData.suminsured_file
          delete mergedData.in_suminsured_file
          // delete mergedData.premiumsum_insured
        }
        if (mergedData.premium_type !== 1) {
          delete mergedData.premium_file
          delete mergedData.premium

          delete mergedData.in_premium_file
          delete mergedData.in_premium
        }
        if (mergedData.opd_suminsured_sub_type !== 1) {
          delete mergedData.suminsured_file_opd
          // delete mergedData.premiumsum_insured_opd
        }
        if (mergedData.opd_premium_type !== 1) {
          delete mergedData.premium_file_opd
          delete mergedData.premium_opd
        }
        if (mergedData.topup_suminsured_sub_type !== 1) {
          delete mergedData.suminsured_file_topup
          // delete mergedData.premiumsum_insured_topup
        }
        if (mergedData.topup_premium_type !== 1) {
          delete mergedData.premium_file_topup
          delete mergedData.premium_topup
        }
        if (mergedData.enhance_suminsured_sub_type !== 1) {
          delete mergedData.suminsured_file_enhance
          // delete mergedData.premiumsum_insured_enhance
        }
        if (mergedData.enhance_premium_type !== 1) {
          delete mergedData.premium_file_enhance
          delete mergedData.premium_enhance
        }
        dispatch(updatePolicyConfigData(mergedData));
        dispatch(saveTempPolicy({ data: mergedData, formId }, brokerId));
      }
    }
  };

  const onAfterNext = (currStep, nextStep) => {
    const newSteps = [...steps];
    const newStep = new FormConfig(newSteps[currStep], newSteps[currStep].formId);
    newStep.completed = true;
    newSteps[currStep] = newStep;
    setSteps(newSteps);
    dispatch(clearSavedStep(brokerId));

    if (currStep === steps.length - 1) {
      dispatch(deleteTempPolicy(brokerId));
    }
  };

  const onConfirm = () => {
    setFoundConfig(prev => false);
  };

  const onCancel = () => {
    setFoundConfig(prev => false);
    dispatch(deleteTempPolicy(brokerId));
    setTimeout(() => {
      dispatch(loadPolicyConfigs(brokerId));
    }, 1000);
  };

  const _renderPolicyConfig = () => {
    const dummy = () => (<> </>)
    const { policyConfigs, policyData, loading } = policyConfigState;

    if (foundConfig && !id && !enquiry_id) {
      swal("Found saved policy, do you want to continue with it ?", {
        buttons: {
          yes: 'Yes',
          no: "No"
        },
        closeOnClickOutside: false,
      }).then((value) => {
        if (value === 'yes') {
          onConfirm();
        } else {
          onCancel();
        }
      });
    }

    if (userType === 'admin' && !brokerId) {
      return (<BrokerModal
        show={modal}
        onHide={() => setModal(false)}
        brokerId={(id) => setBrokerId(id)}
      />)
    }

    else if (steps && policyConfigs.data && (id ? renwalPolicyData.policy_no : true) && steps.length > 0) {

      return (
        <Wrapper>
          <Stepper
            activeStep={0}
            lastStep={steps.length}
            onSave={onSave}
            afterNext={onAfterNext}>
            {
              steps.map((config, index) => {
                return (
                  <Step
                    key={config.id}
                    id={config.id}
                    completed={config.completed ? 'completed' : ''}
                    formId={config.formId}
                    label={config.content}
                    icon={config.image}
                    noCheck={!process.env.NODE_ENV || process.env.NODE_ENV === 'development'}
                    steps={steps}>

                    {React.cloneElement(components[index] || dummy(), {
                      configs: { ...policyConfigs.data, familyLabels },
                      savedConfig: id ? renwalPolicyData : { ...policyData, ...(employer_id && { employer: employer_id }) },
                      filesName: {
                        sumName: suminsured_file?.name, premName: premium_file?.name,
                        sumName_in: in_suminsured_file?.name, premName_in: in_premium_file?.name,
                        sumName_opd: suminsured_file_opd?.name, premName_opd: premium_file_opd?.name,
                        sumName_topup: suminsured_file_topup?.name, premName_topup: premium_file_topup?.name,
                        sumName_enhance: suminsured_file_enhance?.name, premName_enhance: premium_file_enhance?.name
                      },
                      broker_id: brokerId,
                      renewal: (id && history?.location?.pathname.includes('/policy-renew/')) ? true : false
                    })}
                  </Step>
                );
              })
            }
          </Stepper>
          {(loading || loading1) && <Loader />}
        </Wrapper>
      )
    }

    return (<></>);
  };

  return _renderPolicyConfig();
}

export default PolicyConfig
