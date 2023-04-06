import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";
import { ViewBasicDetail } from './ViewBasicDetail';
import { EditBasicDetail } from './EditBasicDetail';

import { useSelector } from 'react-redux';

export const BasicDetail = ({ userType, options, nextPage, ic_plan_id, ic_id, broker_id }) => {

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
        <span>Basic Details</span>
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
        <EditBasicDetail
          userType={userType}
          ic_plan_id={ic_plan_id}
          ic_id={ic_id}
          broker_id={broker_id}
          options={options}
          rfqData={rfqData}
        />
        :
        <ViewBasicDetail
          rfqData={rfqData}
          nextPage={nextPage}
          options={options} />
      }

    </CardBlue>
  )
}
