import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from 'yup';

import { Row, Col } from 'react-bootstrap';
import { InputWrapper, Wrapper, Title, AdditionalInformationWrapper, Header, FormWrapper } from './styles';
import AdditionalCover from './additional-cover';
import AdditionalInformation from './additional-information';
import { setRenewType } from '../../policy-config.slice';
import { Select, Error } from 'components';
import swal from 'sweetalert';
import { selectUsersData } from '../../../user-management/user.slice';

const RenewTypes = [
  { id: 1, name: 'No Previous Data' },
  { id: 2, name: 'Only Employee Data' },
  { id: 3, name: 'Employee + Member Data With Minimum Sum Insured' },
  { id: 4, name: 'Employee Data With Selective Sum Insured' },
  { id: 5, name: 'Employee + Member Data With Selective Sum Insured' }
]

const cd_account_type = {
  'policy': 1,
  'group': 2,
  'branch': 3,
  1: 'policy',
  2: 'group',
  3: 'branch',
}

const validationSchema = (renewal, cdBalance, tab, renew_type) => yup.object().shape({
  ...(['policy', 'group', 'branch'].includes(tab) && {
    cd_balance: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('Opening CD Balance required')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
    // .required('Opening CD Balance required'),
    cd_balance_threshold: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('CD Balance Threshold required')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value)
      // .required('CD Balance Threshold required')
      .test('len', 'Must be less than Opening CD Balance', val => !val || val <= cdBalance),
    inception_premium: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
    inception_premium_installment: yup.number('Only number')
      .nullable()
      .notRequired()
      .typeError('')
      .positive('Only +Positive Number')
      .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  }),
  // ...(tab === 'branch' && {
  //   employer_child_cd: yup.array().of(
  //     yup.object().lesserThan([
  //       ['cd_threshold', 'Must be less than Opening CD Balance']
  //     ]).shape({
  //       cd_amount: yup.number('Only number')
  //         .typeError('Opening CD Balance required')
  //         .positive('Only +Positive Number')
  //         .nullable()
  //         .notRequired()
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),

  //       // .required('Opening CD Balance required'),
  //       cd_threshold: yup.number('Only number')
  //         .typeError('CD Balance Threshold required')
  //         .positive('Only +Positive Number')
  //         .nullable()
  //         .notRequired()
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //       // .required('CD Balance Threshold required')
  //       inception_premium: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //       inception_premium_installment: yup.number('Only number')
  //         .nullable()
  //         .notRequired()
  //         .typeError('')
  //         .positive('Only +Positive Number')
  //         .transform((value, originalValue) => String(originalValue).trim() === "" ? null : value),
  //     }),
  //   )
  // }),
  ...((renewal && [4, 5].includes(renew_type)) && {
    renew_suminsured: yup.string().required('Sum Insured required')
  })
});

const AdditionalDetails = ({ formId, savedConfig, onSave, moveNext, renewal, configs }) => {

  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const { renew_type, stepSaved } = useSelector(state => state.policyConfig);
  const [cdBalance, setCdBalance] = useState(savedConfig.cd_balance || "");
  const [benefits, setBenefits] = useState((savedConfig.benefits?.length && savedConfig.benefits_type === '1') ? savedConfig.benefits : []);
  const [tab, setTab] = useState((savedConfig.cd_account_type && cd_account_type[savedConfig.cd_account_type]) || "policy");
  const [tab1, setTab1] = useState((savedConfig.is_flex_policy && Number(savedConfig.policy_rater_type_id) === 1 && savedConfig.benefits_type) || "1");
  const [planData, setPlanData] = useState(['2', '3', '4'].includes(savedConfig.benefits_type) && savedConfig.benefits?.length ?
    savedConfig.benefits : []);
  const [showForm, setShowForm] = useState(false);
  const userData = useSelector(selectUsersData);
  const { employerCdStatement } = useSelector(state => state.approvePolicy)

  const { control, handleSubmit, register, reset, errors, watch, setValue } = useForm({
    defaultValues: savedConfig || {},
    validationSchema: validationSchema(renewal, cdBalance, tab, renew_type)
  });

  const haveSubEntities = userData && !!userData.data?.length
  // const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    // if (!branch) {
    //   setTab('policy')
    // }

    if (!employerCdStatement.length || employerCdStatement.every(({ cd_account_type }) => cd_account_type === 1)) {
      setTab('policy')
    } else if (haveSubEntities && employerCdStatement.some(({ cd_account_type }) => cd_account_type === 2)) {
      setTab('group')
    } else {
      employerCdStatement.some(({ cd_account_type }) => cd_account_type === 3) && setTab('branch')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerCdStatement])

  useEffect(() => {
    if (savedConfig && (Number(savedConfig.si_sub_type) !== 1 && [4, 5].includes(renew_type))) {
      dispatch(setRenewType(1));
      reset({ renewal_type_id: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig]);

  useEffect(() => {

    if (stepSaved && stepSaved === formId) {
      moveNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepSaved]);


  // useEffect(() => {
  //   reset({
  //     cd_balance: cdBalance || savedConfig.cd_balance,
  //     cd_balance_threshold: thresholdBalance || savedConfig.cd_balance_threshold
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cdBalance, thresholdBalance])

  const onSubmit = formData => {

    if (formData?.inception_premium && formData?.installment_amounts &&
      (Number(formData?.inception_premium) !== formData?.installment_amounts.reduce((total, premium) => total + Number(premium), 0))) {
      return swal('Validation', "Inception Premium & Installment Amounts doesn't match", 'info')
    }
    if (Number(formData?.cd_balance_threshold) > 0 && !Number(formData?.cd_balance)) {
      return swal('Validation', "Opening CD balance required when Threshold is added", 'info')
    }
    const payload = {
      formId,
      data: {
        ...formData,
        add_benefit: showForm ? (tab1 === '1' ? (benefits && benefits.length > 0 ? true : false) : ((tab1 !== '1' && planData && planData.length) ? true : false)) : false,
        benefits: showForm ? (tab1 === '1' ? (benefits && benefits.length > 0 ? benefits : []) : ((tab1 !== '1' && planData) || [])) : [],
        cd_account_type: cd_account_type[tab],
        // benefits: planData || [],
        benefits_type: tab1
      }
    };
    if (onSave) onSave(payload);
  };

  const addBenefit = benefit => {
    const flag = benefits.some((elem) => elem.name === benefit.name)
    if (!flag) setBenefits([...benefits, benefit]);
    // if (!flag) setBenefits(prev => [...prev, benefit]);
  };

  const removeBenefit = benefit => {
    const filteredBenefits = benefits.filter(item => item.name !== benefit);
    setBenefits(filteredBenefits)
    // setBenefits(prev => [...filteredBenefits]);
  };

  return savedConfig && (
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          Additional Cover &amp; Additional Information
        </h4>
      </Title>

      <AdditionalCover
        showForm={showForm} setShowForm={setShowForm}
        savedConfig={savedConfig}
        benefits={benefits}
        addBenefit={addBenefit}
        dispatch={dispatch}
        setBenefits={setBenefits}
        removeBenefit={removeBenefit}
        flexi={!!savedConfig.is_flex_policy} tab={tab1} setTab={setTab1}
        configs={configs}
        planData={planData} setPlanData={setPlanData}
      />

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <AdditionalInformation
          control={control}
          errors={errors}
          cdBalance={cdBalance}
          setCdBalance={setCdBalance}
          reset={reset}
          dispatch={dispatch}
          // savedConfig={savedConfig}
          setTab={setTab}
          employerCdStatement={employerCdStatement}
          tab={tab}
          haveSubEntities={haveSubEntities}
          watch={watch}
          setValue={setValue}
        />
      </form>
      {renewal && !(Number(savedConfig.si_sub_type) !== 1 && [4, 5].includes(renew_type)) &&
        <AdditionalInformationWrapper>
          <Header>
            <h6>Should continue with previous policy employee and member data -</h6>
          </Header>
          <br />
          <FormWrapper>
            <Row className="d-flex flex-column">
              {RenewTypes.map(({ id, name }, index) =>
                ((Number(savedConfig.si_sub_type) === 1 && [4, 5].includes(id)) || ![4, 5].includes(id)) &&
                <InputWrapper key={index + name} className="custom-control custom-radio">
                  <input
                    id={id + 'k'}
                    value={id}
                    className="custom-control-input"
                    type="radio"
                    ref={register}
                    defaultChecked={renew_type === id}
                    name={`renewal_type_id`}
                    onChange={() => dispatch(setRenewType(id))}
                  />

                  <label className="custom-control-label" style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px', color: "#000000 !important", fontWeight: "600" }} htmlFor={id + 'k'}>
                    {name}
                  </label>
                  {([4, 5].includes(renew_type) && renew_type === id) &&
                    <Col xl={4} lg={5} md={6} sm={12}>
                      <Controller
                        as={
                          <Select
                            label="Sum Insured"
                            placeholder="Select Sum Insured"
                            required
                            options={savedConfig?.sum_insured.map(item => (
                              {
                                id: item,
                                name: item,
                                value: item
                              }
                            ))}
                            error={errors && errors.renew_suminsured}
                          />
                        }
                        control={control}
                        name="renew_suminsured"
                      />
                      {!!errors.renew_suminsured && <Error>
                        {errors.renew_suminsured.message}
                      </Error>}
                    </Col>}
                </InputWrapper>)}
            </Row>
          </FormWrapper>
        </AdditionalInformationWrapper>
      }
    </Wrapper>
  )
}

export default AdditionalDetails;
