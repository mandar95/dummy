import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import _ from 'lodash';

import { Stepper, Step, Loader } from 'components';
import {
  loadRfqConfig, getTempConfig, saveConfig,
  clear, loadBuckets, loadRfqCopied
} from '../rfq.slice';
import { clearDownloadSampleSuccess, loadRelationMaster } from 'modules/policies/policy-config.slice';
import { InsurerModal } from './InsurerModal';

import { downloadFile } from 'utils';
import { components, FormConfig, steps as alternateStep, formIds, refillRelations } from './helper';
import swal from 'sweetalert';


const Wrapper = styled.div`
    padding: 0 20px 0 0;
`;

export const RFQConfig = () => {

  const history = useHistory();
  const { userType } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const copied_plan_id = query.get("copied_plan");
  const [insurerId, setInsurerId] = useState('');
  const [modal, setModal] = useState(true);
  const [icLogo, setIcLogo] = useState();
  const [steps, setSteps] = useState(alternateStep.map((item, index) => {
    const config = new FormConfig(item, formIds[index]);
    return config;
  }));
  const { configs, tempConfig,
    loading, success, error, riskBuckets } = useSelector(state => state.rfq);
  const { sampleURL, familyLabels } = useSelector(state => state.policyConfig);
  const { currentUser } = useSelector(state => state.login);
  const dispatch = useDispatch();


  useEffect(() => {
    if (['insurer', 'broker', 'broker'].includes(userType) || insurerId) {
      dispatch(loadRfqConfig());
      dispatch(loadRelationMaster());
      copied_plan_id ?
        dispatch(loadRfqCopied({
          ...currentUser?.broker_id ?
            { broker_id: currentUser?.broker_id } :
            { ic_id: currentUser.ic_id || insurerId },
          ic_plan_id: copied_plan_id
        }, 'copy')) :
        dispatch(getTempConfig());
      // dispatch(loadFeatures())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insurerId])

  useEffect(() => {
    if (userType === 'admin' && modal === false && !insurerId) {
      history.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal])

  useEffect(() => {
    if (userType === 'insurer' && (currentUser?.ic_id || insurerId)) {
      dispatch(loadBuckets({ ic_id: currentUser.ic_id || insurerId }));
    }

    if (userType === 'broker' && (currentUser?.broker_id)) {
      dispatch(loadBuckets({ broker_id: currentUser.broker_id }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, insurerId])

  useEffect(() => {
    if (sampleURL) {
      downloadFile(sampleURL);
    }
    return () => { dispatch(clearDownloadSampleSuccess()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleURL]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      // dispatch(removeTempConfig({ temp_rfq_id: tempConfig.temp_rfq_id }))
      swal('Success', success, "success").then(() => {
        history.replace(`/${userType}/uwquote-view`);
      });
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  const onSave = payload => {


    const formData = new FormData();
    for (let key in payload) {
      if (payload[key] !== '' && payload[key] !== null)
        formData.append(`${key}`, `${payload[key]}`)
    }
    if (currentUser.ic_id || insurerId)
      formData.set('ic_id', currentUser.ic_id || insurerId);
    else formData.delete('ic_id')

    formData.set('features', JSON.stringify(payload.product_feature.filter((elem) => (elem.additional?.length))
      .map((elem) => _.pickBy({
        ...elem,
        additional: elem.additional.map((elem1) => _.pickBy({ ...elem1, premium: elem1.premium || 0, ...(elem1.premium && { premium_type: elem1.premium_type || 1 }) }, function (value) {
          return (!!value || parseInt(value) === 0);
        })),
        is_mandantory: !!elem.is_mandantory ? '1' : '0'
      }, _.identity))));
    formData.set('buckets', JSON.stringify(payload['industry_ids_mock']));

    const ages = refillRelations(payload['ages'])
    formData.set('relations', JSON.stringify(ages));

    if (userType === 'broker') {
      formData.set('broker_id', currentUser.broker_id);
      // formData.delete('ic_id')
      if (payload.is_new_ic === 0) {
        formData.set('insurer_id', payload.ic_id);

      }
      else {
        formData.set('insurer_name', payload.insurer_name);
        formData.set('logo', icLogo[0]);
      }
    }

    if (payload.has_individual) {
      if (payload.individual_file) {
        formData.set('indivdual_rate_sheet', payload.individual_file)
        formData.set('has_indivdual', 1)
      }
      else {
        swal("Incomplete", "Attach individual rate file", "info");
        return;
      }
    } else {
      formData.set('has_indivdual', 0)
    }

    if (payload.has_family) {
      if (payload.family_file) {
        formData.set('family_floater_sheet', payload.family_file)
        formData.set('has_family_floater', 1)
      } else {
        swal("Incomplete", "Attach family rate file", "info");
        return;
      }
    } else {
      formData.set('has_family_floater', 0)
    }

    dispatch(saveConfig(formData))
  };

  const onAfterNext = (currStep, nextStep) => {
    const newSteps = [...steps];
    const newStep = new FormConfig(newSteps[currStep], newSteps[currStep].formId);
    newStep.completed = true;
    newSteps[currStep] = newStep;
    setSteps(newSteps);
    // dispatch(clearSavedStep(brokerId));

    if (currStep === steps.length - 1) {
      // dispatch(deleteTempPolicy(brokerId));
    }
  };

  const _renderPolicyConfig = () => {
    const dummy = () => (<> </>)

    if (userType === 'admin' && !insurerId) {
      return (<InsurerModal
        show={modal}
        onHide={() => setModal(false)}
        insurerId={(id) => setInsurerId(id)}
      />)
    }
    else if (steps) {
      return (
        <Wrapper>
          <Stepper
            activeStep={0}
            lastStep={5}
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
                      configs: { ...configs, riskBuckets, familyLabels },
                      savedConfig: tempConfig,
                      insurerId, logo: { setIcLogo, icLogo },
                      userType
                    })}
                  </Step>
                );
              })
            }
          </Stepper>
          {(loading) && <Loader />}
        </Wrapper>
      )
    }

    return (<></>);
  };

  return _renderPolicyConfig();
}
