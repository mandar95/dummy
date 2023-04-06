import React, { useState, useEffect } from 'react';

import { CardBlue, Button } from "components";
import { ViewBucket } from './ViewBucket';
import { EditBucket } from './EditBucket';

import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

export const BucketDetail = ({ userType, riskBuckets, nextPage, ic_plan_id, ic_id, broker_id }) => {

  const [show, setShow] = useState(false);
  const history = useHistory();
  const { rfqData, success } = useSelector(state => state.rfq);

  useEffect(() => {
    if (success) {
      setShow(false)
    }
  }, [success])

  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>Industry Bucket Details</span>
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
        <EditBucket
          userType={userType}
          ic_plan_id={ic_plan_id}
          broker_id={broker_id}
          ic_id={ic_id}
          options={riskBuckets}
          rfqData={rfqData}
          history={history}
        />
        :
        <ViewBucket
          rfqData={rfqData}
          nextPage={nextPage}
          options={riskBuckets}
        />
      }

    </CardBlue>
  )
}
