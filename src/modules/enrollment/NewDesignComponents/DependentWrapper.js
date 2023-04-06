import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

import SecondStep from './SecondStep';
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";

import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from "../enrollment.slice";
import { getPolicyCoverage, submitInstallment, updateFlexToInd } from './enrolment.action';
import { Loader } from '../../../components';
import { enrollment } from "../enrollment.slice";
import _ from 'lodash';
import { WalletDetail } from '../enrollment.help';
import { NumberInd } from '../../../utils';

const RemainingParent = (members) => {
  if (members.length === 2) {
    const parent = members.filter(({ relation_id }) => [5, 6].includes(+relation_id));
    const parentInLaw = members.filter(({ relation_id }) => [7, 8].includes(+relation_id));
    if (parent.length === 1 && parentInLaw.length === 1)
      return true
  }
  return false
}

function DependentWrapper(props) {

  const { backStep, step, steps, policy_ids, flex_balance } = props;
  const dispatchRedux = useDispatch();
  const [policyCoverages, setPolicyCoverages] = useState([]);
  const [policyNotCoverages, setNotPolicyCoverages] = useState([]);
  const [policyMembers, setpolicyMembers] = useState([]);
  const [policyMembersHaveInstalment, setpolicyMembersHaveInstalment] = useState([]);
  const [policyMembersInstalmentSelected, setpolicyMembersInstalmentSelected] = useState([]);
  const [is_installment_there, set_is_installment_there] = useState([]);
  const [flexOfPolicy, setFlexOfPolicy] = useState([]);
  const [policyMembersAll, setPolicyMembersAll] = useState([]);
  const [memberLoad, updateMemberLoad] = useState([]);
  const { familyLabels: relations } = useSelector(
    (state) => state.policyConfig
  );
  const { policies } = useSelector(enrollment);

  useEffect(() => {
    getPolicyCoverage(setPolicyCoverages, setNotPolicyCoverages, policy_ids, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNext = () => {
    if (policyCoverages.length && policyCoverages.some((required_relation_array) => required_relation_array)) {
      for (let i = 0; i < policyCoverages.length; ++i) {
        if (policyCoverages[i]) {
          const notAddedRelation = policyCoverages[i]
            .map((required_relation) => !policyMembers[i].includes(required_relation) && required_relation)
            .filter(Number).filter((relation_id) =>
              ([3, 4].includes(relation_id) && policyMembers[i].some(relation_id => [3, 4].includes(relation_id))) ?
                false : true)
          if (notAddedRelation && notAddedRelation.length !== 0) {
            swal(`Required Relation into Policy: ${policy_ids[i].policy_name}`,
              notAddedRelation.reduce((result, relation_id) => (!result ? result : result + ', ') + (relations.find(({ id }) => relation_id === id)?.name || 'Self'), ''));
            return
          }
        }
      }
      // Individual + Floater
      for (let i = 0; i < flexOfPolicy.length; ++i) {
        const flex = flexOfPolicy[i];
        const member_option = policyMembersAll[i]
        if (flex?.in_suminsured && [9].includes(flex?.suminsured_type_id) &&
          flex?.main_suminsured_type_id === 3 && +member_option?.[0]?.cover_type === 2 && RemainingParent(member_option)) {
          swal({
            // title: `Validaion in  ${policy_ids[i].policy_name}?`,
            title: 'Alert',
            text: `Single Parent/Parent In-Law has selected, hence cover type Individual will be applied.
Also the Sum Insured would be updated to ${NumberInd(member_option[0]?.suminsured)} for both the members            

            Do you want to continue Yes / No`,
            icon: "warning",
            buttons: {
              catch: {
                text: "Yes",
                value: "continue",
              },
              cancel: "No",
            },
            dangerMode: true,
          }).then((Yes) => {
            if (Yes) {
              updateFlexToInd(member_option, policy_ids[i].id, policy_ids, i, updateMemberLoad, dispatchRedux)
            }
          });
          return
        }
      }

      if (is_installment_there.length) {
        for (let i = 0; i < is_installment_there.length; ++i) {
          if (is_installment_there[i] && is_installment_there[i].length && (!policyMembersHaveInstalment[i] && !policyMembersInstalmentSelected[i]) && policyMembers[i].length) {
            swal(`Installment required into Policy: ${policy_ids[i].policy_name}`, '', 'info')
            return
          }
          dispatchRedux(submitInstallment({
            installment_id: policyMembersInstalmentSelected[i],
            policy_id: policy_ids[i].id
          }, policy_ids, setpolicyMembers))
        }
      }
      dispatchRedux(nextStep());
    } else {
      dispatchRedux(nextStep());
    }
  };


  return (
    <>
      <div className='w-100 mb-3'>
        {!_.isEmpty(flex_balance) &&
          <WalletDetail flex_balance={flex_balance} />
        }
      </div>
      {policy_ids.map(({ id, policy_name, baseEnrolmentStatus }, index) =>
        <SecondStep key={id + '_dependent'} {...props}
          memberLoad={memberLoad}
          setFlexOfPolicy={setFlexOfPolicy} setPolicyMembersAll={setPolicyMembersAll}
          baseEnrolmentStatus={baseEnrolmentStatus}
          policyCoverage={policyCoverages[index]}
          policyNotCoverages={policyNotCoverages[index]}
          flex_balance={flex_balance}
          policy_id={id} policy_name={policy_name} policy_ids={policy_ids}
          parentIndex={index} setpolicyMembers={setpolicyMembers}
          description={policies?.filter(value => Number(value.id) === Number(id))[0]?.description}
          is_installment_there={is_installment_there}
          set_is_installment_there={set_is_installment_there} setpolicyMembersHaveInstalment={setpolicyMembersHaveInstalment}
          setpolicyMembersInstalmentSelected={setpolicyMembersInstalmentSelected}
        />
      )}
      <div className="d-flex w-100 flex-column flex-sm-row justify-content-center align-items-center my-2">
        <div className="w-100 d-flex justify-content-center justify-content-sm-start">
          <Button
            onClick={() => dispatchRedux(backStep())}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </Button>
        </div>
        <div className="w-100">
          <div className="d-flex justify-content-center justify-content-sm-end mt-2 mt-0">
            <Button
              onClick={() =>
                handleNext(steps[step])
              }>
              {" "}
              Save & Next
              <i className="fas fa-arrow-right"></i>
            </Button>
          </div>
        </div>
      </div>
      {policyCoverages.length !== policy_ids.length && <Loader />}
    </>
  )
}
export default DependentWrapper;
