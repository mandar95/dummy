import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";
import { ViewFamilyDetail } from './ViewFamilyDetail';
import { EditFamilyDetail } from './EditFamilyDetail';

import { useSelector } from 'react-redux';

export const FamilyDetail = ({ userType, options, nextPage, ic_plan_id, ic_id, broker_id }) => {

  const [show, setShow] = useState(false);
  const { rfqData, success } = useSelector(state => state.rfq);

  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>Family Details</span>
        <div>
          {show ?
            <Button type="button" onClick={() => { setShow(false) }} buttonStyle="outline-secondary">
              Cancel
            </Button>
            : <Button type="button" onClick={() => { setShow(true) }} buttonStyle="outline-secondary">
              Edit <i className="ti-pencil" />
            </Button>
          }
        </div>
      </div>
    }>
      {show ?
        <EditFamilyDetail
          userType={userType}
          ic_plan_id={ic_plan_id}
          broker_id={broker_id}
          ic_id={ic_id}
          options={options}
          rfqData={rfqData}
          style={style}
        />
        :
        <ViewFamilyDetail
          rfqData={rfqData}
          nextPage={nextPage}
          style={style}
          options={options} />
      }

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
