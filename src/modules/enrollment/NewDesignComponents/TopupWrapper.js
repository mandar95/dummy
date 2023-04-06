import React, { useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import ForthStep from './ForthStep';
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";

import { useDispatch } from 'react-redux';
import { nextStep } from "../enrollment.slice";
import { WalletDetail } from '../enrollment.help';

export default function TopupWrapper(props) {

  const { backStep, step, steps, policy_ids, flex_balance } = props;
  const dispatchRedux = useDispatch();
  const [topupPolicies, setTopupPolicies] = useState([]);

  const checkConfig = (topupPoliciesFlatten) => {
    // (topup_compulsion_flag) top up type 0: non-M 1:M 3:Optional
    if (topupPolicies.length) {
      for (let i = 0; i < topupPolicies.length; ++i) {
        if (topupPolicies[i].length) {
          for (let j = 0; j < topupPolicies[i].length; ++j) {
            const topupDetail = topupPolicies?.[i]?.[j] || {}
            // mandatory
            if (topupDetail.top_up_added !== 1 && topupDetail.topup_compulsion_flag === 1) {
              swal(`${topupDetail.policy_name}: Selection Is Mandatory`,
                '', 'warning');
              return
            }
          }

          // optional 
          // if (topupPolicies[i].every(({ topup_compulsion_flag }) => topup_compulsion_flag === 2) &&
          //   topupPolicies[i].every(({ top_up_added }) => !top_up_added)) {
          //   swal(`${topupPolicies[i].reduce((final, { policy_name }) => (final ? (final + ', ' + policy_name) : policy_name), '')}: Select Any One Top-Up`,
          //     '', 'warning');
          //   return
          // }
        }
      }
    }


    if (topupPoliciesFlatten.length && topupPoliciesFlatten.some((elem) => elem?.coverageData)) {
      for (let i = 0; i < topupPoliciesFlatten.length; ++i) {
        if (topupPoliciesFlatten[i]?.coverageData && !topupPoliciesFlatten[i]?.top_up_added) {
          const addedRelationInBase = topupPoliciesFlatten[i]?.coverageData.map((required_relation) => topupPoliciesFlatten[i]?.baseMemberData?.includes(required_relation) && required_relation).filter(Number)

          if (addedRelationInBase && addedRelationInBase.length !== 0) {
            swal(`${topupPoliciesFlatten[i].policy_name}: Selection Is Mandatory`,
              '', 'warning');
            return
          }
        }
      }
      dispatchRedux(nextStep());
    } else {
      dispatchRedux(nextStep());
    }
  }

  const handleNext = () => {
    const topupPoliciesFlatten = topupPolicies.flat(1);
    const isAddedTopup = topupPoliciesFlatten.some((item) => item?.top_up_added === 1);
    const haveValidTopup = topupPoliciesFlatten.filter(item => item).every(({ suminsured }) => suminsured)
    if (!isAddedTopup && haveValidTopup) {
      swal({
        title: "You have not finalised the Top Up. Please Use Add top Up Button to finalise the Top Up",
        text: "Do you want to continue without any Top Up?",
        icon: "warning",
        buttons: ['No', 'Yes'],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          checkConfig(topupPoliciesFlatten)
        }
      })
    }
    else {
      checkConfig(topupPoliciesFlatten)
    }
  };


  return (
    <>
      <div className='w-100 mb-3'>
        {!_.isEmpty(flex_balance) &&
          <WalletDetail flex_balance={flex_balance} />
        }
      </div>
      {policy_ids.map(({ id }, index) =>
        <ForthStep key={id + '_dependent'} {...props}
          policy_id={id} policy_ids={policy_ids}
          parentIndex={index}
          flex_balance={flex_balance} setTopupPolicies={setTopupPolicies}
        //   nextbtn={_nextbtn}
        />)}
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
    </>
  )
}
