import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

import { CardBlue, Button } from "components";
import { ViewRateDetail } from './ViewRateDetail';
import { EditRateDetail } from './EditRateDetail';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { set_approved } from '../../rfq.slice'

export const RateDetail = ({ userType, options, nextPage, ic_plan_id, ic_id, dispatch, broker_id }) => {

  const [show, setShow] = useState(false);
  const history = useHistory();
  const { rfqData, success, approved } = useSelector(state => state.rfq);

  useEffect(() => {
    if (success) {
      setShow(false)
    }
    if (approved) {
      swal('Success', approved, "success").then(() => {
        history.replace(`/${userType}/uwquote-view`)
      });
    }

    return () => { dispatch(set_approved(false)) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, approved])

  return (
    <CardBlue title={
      <div className="d-flex justify-content-between">
        <span>Rater (SI & Premium)</span>
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
        <EditRateDetail
          userType={userType}
          ic_plan_id={ic_plan_id}
          ic_id={ic_id}
          broker_id={broker_id}
          options={options}
          rfqData={rfqData}
        />
        :
        <ViewRateDetail
          rfqData={rfqData}
          nextPage={nextPage}
        />
      }

    </CardBlue>
  )
}
