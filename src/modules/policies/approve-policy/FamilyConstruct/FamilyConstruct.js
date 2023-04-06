import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";

import { useSelector } from 'react-redux';
import { approvePolicy } from '../approve-policy.slice';
import { ViewFamily } from './ViewFamily';
import { EditFamily } from './EditFamily';

export const FamilyConstruct = (props) => {

  // const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { policyData, success } = useSelector(approvePolicy);
  const { userType, nextPage, options } = props;

  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  // const policyData = {
  //   "id": 12,

  //   "family_construct_id": 1,
  //   "family_construct_name": "Employee",

  //   "ageDetails": [
  //     {
  //       "id": 7,
  //       "relation_id": 1,
  //       "relation": "Self",
  //       "min_age": 18,
  //       "max_age": 65,
  //       "additional_premium": null,
  //       "employee_contribution": 60,
  //       "employer_contribution": 40,
  //       "max_twins": 0
  //     }
  //   ],

  //   "has_special_child": 0,
  //   "specail_child_premium": null,
  //   "specail_child_employer_contribution": 0,
  //   "specail_child_employee_contribution": 0,

  //   "has_unmarried_child": 1,
  //   "unmarried_child_premium": null,
  //   "unmarried_child_employer_contribution": 0,
  //   "unmarried_child_employee_contribution": 0,

  //   "has_parent_cross_selection": 0,
  // }

  return (
    <CardBlue title={<div className="d-flex justify-content-between">
      <span>Family Construct</span>
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
        <EditFamily
          userType={userType}
          options={options}
          policyData={policyData}
          style={style}
        />
        :
        <ViewFamily
          policyData={policyData}
          options={options}
          nextPage={nextPage}
          style={style} />}
    </CardBlue>
  )
}

const style = {
  PageButton: {
    background: "rgb(222, 142, 240, 0.74)",
    borderRadius: "50%",
    minWidth: "34px",
    minHeight: "34px"
  },
  Table: { border: "solid 1px #e6e6e6", background: "#00000000" },
  HeadRow: { background: "#353535", color: "#FFFFFF" },
  TableHead: {
    minWidth: "120px",
  },
  td: {
    color: "#666666"
  }
}
