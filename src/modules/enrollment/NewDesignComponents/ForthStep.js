import React, { useEffect, useReducer, useState } from 'react';
import swal from 'sweetalert';

import { TopUp } from "./TopUp";
import { loadAllSummary, validateFlexAmtAll } from "../enrollment.slice";
import { Loader } from 'components'
import { Accordion } from "react-bootstrap";

import { useDispatch, useSelector } from 'react-redux';
import {
  initialState, reducer,
  loadTopup
} from './enrolment.action';
import { ContextAwareToggle } from '../enrollment.help';
function isInt(n) {
  return Number(n) % 1 === 0;
}

export const comma = (str) => {
  var newStr = 0;
  if (isInt(str)) {
    newStr = parseInt(str);
    return newStr.toLocaleString("en-IN");
  } else {
    newStr = parseFloat(Number(str).toFixed(2));
    return newStr.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};


const ForthStep = ({ policy_id, policyIds, flex_balance,
  setTopupPolicies, parentIndex }) => {

  const dispatchRedux = useDispatch();
  const [resetOptional, setResetOptional] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)

  const [{ topup, loading, error,
    success }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadTopup(dispatch, policy_id)
    dispatchRedux(validateFlexAmtAll({ policy_ids: policyIds.map(({ id }) => id) }))
    // validateFlexAmt(dispatch, policy_id);
    return () => {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          topup_premium: null,
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTopupPolicies(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = topup || null;
      return prevCopy;
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentIndex, topup])


  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      success !== "gateclose" && swal('Success', success, "success");
      dispatchRedux(loadAllSummary(policyIds));
      dispatchRedux(validateFlexAmtAll({ policy_ids: policyIds.map(({ id }) => id) }))
      loadTopup(dispatch, policy_id)
    };

    return () => {
      dispatch({ type: 'CLEAR' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const isOptionalType = topup.every(({ topup_compulsion_flag }) => topup_compulsion_flag === 2);

  return (
    <>
      {!!topup.length && topup.map((elem, index) =>
        ((isOptionalType && topup.some(({ top_up_added }) => top_up_added)) ? !!elem?.top_up_added : true) &&
        (elem.suminsured ? <Accordion key={elem.policy_id} defaultActiveKey={/* packageIndex + */ 1} style={{
          boxShadow: '1px 1px 16px 0px #e7e7e7',
          borderRadius: '15px',
          width: '100%',
          marginBottom: '15px',
          border: '1px solid #e8e8e8'
        }}>
          <Accordion.Toggle
            eventKey={/* packageIndex + */ 1} style={{
              width: '100%',
              border: 'none',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              background: 'white',
              padding: '10px',
              outline: 'none'

            }} className='d-flex justify-content-between align-items-center'>
            <div className='text-left mr-3' style={{
              fontWeight: '500',
              fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
              letterSpacing: '1px',
              color: 'black'
            }}>

              {(elem?.policy_name) || 'Top Up'}</div>
            <ContextAwareToggle eventKey={/* packageIndex + */ 1} />
          </Accordion.Toggle>
          {true &&
            <Accordion.Collapse eventKey={/* packageIndex + */ 1} style={{
              width: '100%',
              paddingTop: '15px',
              background: 'white',
              borderTop: '2px solid #FFDF00',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px'
            }}>
              <div className='w-100'>
                <TopUp policy_id={policy_id} key={index + 'topup'}
                  elem={elem} index={index} flex_balance={flex_balance} dispatch={dispatch}
                  resetOptional={resetOptional} setResetOptional={isOptionalType &&setResetOptional}
                  dispatchRedux={dispatchRedux}
                />
              </div>
            </Accordion.Collapse>
          }
        </Accordion> :
          !loading && <h1 key={elem.policy_id} className='text-center display-4 text-secondary'>
            No Top Up Cover for This Policy
          </h1>))}
      {loading && <Loader />}
    </>
  )
}

export default ForthStep;
