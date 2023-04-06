import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";

import { useSelector } from 'react-redux';
import { approvePolicy } from '../approve-policy.slice';
import { ViewRater } from './ViewRater';
import { EditRater } from './EditRater';

const SalaryType = [
  { id: 'salary_1', name: 'Salary Type 1', value: 'salary_1' },
  { id: 'salary_2', name: 'Salary Type 2', value: 'salary_2' },
  { id: 'salary_3', name: 'Salary Type 3', value: 'salary_3' }
];

export const Rater = (props) => {

  // const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { policyData, success } = useSelector(approvePolicy);
  const { userType, options, nextPage } = props;



  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>Rater (SI & Premium)</span>
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
        <EditRater
          userType={userType}
          options={options}
          policyData={policyData}
          SalaryType={SalaryType}
        />
        :
        <ViewRater
          policyData={policyData}
          options={options}
          nextPage={nextPage}
          SalaryType={SalaryType}
        />}
    </CardBlue>
  )
}
