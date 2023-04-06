import React, { useState } from 'react';
import swal from 'sweetalert';

import ThirdStep from './ThirdStep';
import { Button } from "modules/enrollment/NewDesignComponents/subComponent/Elements";

import { useSelector, useDispatch } from 'react-redux';
import { nextStep } from "../enrollment.slice";
import { enrollment } from "../enrollment.slice";

function NomineeWrapper(props) {

  const { backStep, step, steps, policy_ids } = props;
  const dispatchRedux = useDispatch();
  const [nomineeConfigs, setNomineeConfigs] = useState(policy_ids.map(() => ({
    nominee_requirement: 1,
    members: []
  })) || []);
  const { policies } = useSelector(enrollment);


  const handleNext = () => {
    if (nomineeConfigs.length && nomineeConfigs.some(({ nominee_requirement }) => nominee_requirement === 1)) {
      for (let i = 0; i < nomineeConfigs.length; ++i) {
        if (nomineeConfigs[i].nominee_requirement === 1) {
          if (!nomineeConfigs[i].members?.length) {
            swal(`${policy_ids[i].policy_name} : Nominee is mandatory for this policy`);
            return
          }
          if (nomineeConfigs[i].members.reduce((total, { share_per }) => total + Number(share_per), 0) !== 100) {
            swal(`${policy_ids[i].policy_name} : Total share for nominees should be 100%`);
            return
          }
        }
      }
      dispatchRedux(nextStep());
    } else {
      dispatchRedux(nextStep());
    }
  };


  return (
    <>
      {policy_ids.map(({ id, policy_name, baseEnrolmentStatus }, index) =>
        <ThirdStep key={id + '_nominee'} {...props}
          policy_id={id} policy_name={policy_name}
          parentIndex={index}
          baseEnrolmentStatus={baseEnrolmentStatus}
          setNomineeConfigs={setNomineeConfigs}
          description={policies?.filter(value => Number(value.id) === Number(id))[0]?.description}
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
export default NomineeWrapper;
