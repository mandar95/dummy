import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";

import { useSelector } from 'react-redux';
import { approvePolicy } from '../approve-policy.slice';
import { ViewCDBalance } from './ViewCDBalance';
import { EditCDBalance } from './EditCDBalance';

export const CDBalance = ({ userType, options, nextPage, myModule }) => {

  // const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { policyData, success } = useSelector(approvePolicy);

  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  // const policyData = {
  //   "id": 12,

  //   "cd_value": 10000,
  //   "cd_threshold_value": 8000,

  //   "sales_manager": "Naveen Joshi",
  //   "ac_manager_email": "moin.gadkari@fyntune.com",
  //   "ac_manager_mobile_no": 9653122705,

  //   "hr_name": "HR Name",
  //   "hr_email": "azam.shaikh@fyntune.com",
  //   "hr_mobile_no": 7739920189,
  // }


  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>CD Balance & Contact Details</span>
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
      </div>
    }>
      {show ?
        <EditCDBalance
          userType={userType}
          options={options}
          policyData={policyData}
        />
        :
        <ViewCDBalance
          myModule={myModule}
          userType={userType}
          policyData={policyData}
          options={options}
          nextPage={nextPage}
        />}
    </CardBlue>
  )
}
