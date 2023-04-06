import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";

import { useSelector } from 'react-redux';
import { approvePolicy } from '../approve-policy.slice';
import { ViewPolicyDetail } from './ViewPolicyDetail';
import { EditPolicyDetail } from './EditPolicyDetail';

export const PolicyDetail = (props) => {

  // const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { policyData, success } = useSelector(approvePolicy);
  const { userType, options, nextPage } = props;

  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  // const policyData = {
  //   "id": 12,

  //   "policy_number": "1210003419040000123",

  //   "policy_type_id": 1,
  //   "policy_type": "Group",

  //   "policy_sub_type_id": 1,
  //   "policy_sub_type": "Group Personal Accident",

  //   "insurer_id": 1,
  //   "insurer": "Oriental Insurance",

  //   "employer_id": 1,
  //   "employer": "Starbucks",

  //   "broker_commision": 10,
  //   "start_date": "2020-06-16",
  //   "end_date": "2020-06-16",
  //   "enrollement_start_date": "2020-07-09",
  //   "enrollement_end_date": "2020-08-01",
  // }
  // useEffect(() => {
  //   if (userType === "broker") {
  //     dispatch(loadPolicy());
  //   }
  //   // return () => { dispatch(clearPolicyData()) }
  // }, userType])


  return (
    <CardBlue title={<div className="d-flex justify-content-between">
      <span>Policy Details</span>
      {userType !== "employer" && <div>
        {show ?
          <Button type="button" onClick={() => { setShow(false) }} buttonStyle="outline-secondary">
            Cancel
          </Button>
          : <Button type="button" onClick={() => { setShow(true) }} buttonStyle="outline-secondary">
            Edit <i className="ti-pencil" />
          </Button>
        }
      </div>}
    </div>}>
      {show ?
        <EditPolicyDetail
          userType={userType}
          options={options}
          policyData={policyData}
          setShow={() => setShow(false)}
        />
        :
        <ViewPolicyDetail
          policyData={policyData}
          nextPage={nextPage}
          userType={userType}
          options={options} />}
    </CardBlue>
  )
}
