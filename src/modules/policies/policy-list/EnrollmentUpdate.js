import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

import { Card, TabWrapper, Tab, Loader } from '../../../components'
import BulkEnrollment from './enrollments/BulkEnrollment';
import SingleEnrollment from './enrollments/SingleEnrollment';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { approvePolicy, loadPolicy, clear, loadAuditTrail, clearAuditTrail, clearPolicyData } from '../approve-policy/approve-policy.slice';
import { clearEnrollmentDate } from '../policy-config.slice';
import { Decrypt } from '../../../utils';
import AuditTrailEnrollment from './enrollments/AuditTrailEnrollment';
import { set_pagination_update } from '../../user-management/user.slice';

export default function EnrollmentUpdate() {

  const [tab, setTab] = useState('Policy Wise');
  const dispatch = useDispatch()
  let { policy_id } = useParams()
  policy_id = Decrypt(policy_id);
  const { policyData, members_enrolled, success, error: error2, loading, audit_trail } = useSelector(approvePolicy);
  const { changeEnrollmentMessage, error } = useSelector(state => state.policyConfig);

  useEffect(() => {
    dispatch(loadPolicy(policy_id));
    dispatch(loadAuditTrail(policy_id));

    return () => {
      dispatch(clearAuditTrail())
      dispatch(clearPolicyData())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (changeEnrollmentMessage || success) {
      swal('', changeEnrollmentMessage || success, 'success').then(() => {
        if (tab === 'Multiple Employee Wise') {
          setTab('Single Employee Wise')
        }
        dispatch(loadAuditTrail(policy_id));
        dispatch(set_pagination_update(true))
      });
      dispatch(loadPolicy(policy_id));
    }

    if (error || error2) {
      swal('', error || error2, "warning");
    }

    return () => {
      dispatch(clearEnrollmentDate());
      dispatch(clear())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeEnrollmentMessage, error, success, error2])


  return (!loading && tab === 'Policy Wise') || tab !== 'Policy Wise' ? (
    <>
      <TabWrapper width='max-content'>
        <Tab
          isActive={Boolean(tab === 'Policy Wise')}
          onClick={() => setTab('Policy Wise')}>
          Policy Wise
        </Tab>
        <Tab
          isActive={Boolean(tab === 'Single Employee Wise')}
          onClick={() => setTab('Single Employee Wise')}>
          Single Employee Wise
        </Tab>
        {/* <Tab
          isActive={Boolean(tab === 'Multiple Employee Wise')}
          onClick={() => setTab('Multiple Employee Wise')}>
          Multiple Employee Wise
        </Tab> */}

        <Tab
          isActive={Boolean(tab === 'Audit Trail')}
          onClick={() => setTab('Audit Trail')}>
          Audit Trail
        </Tab>
      </TabWrapper>

      <Card title={tab + ' Enrolment'}>
        {tab === 'Policy Wise' && (
          <BulkEnrollment dispatch={dispatch} data={policyData} />
        )}
        {tab === 'Single Employee Wise' && (
          <SingleEnrollment policyData={policyData} dispatch={dispatch} data={members_enrolled} success={success} error={error2} policy_id={policy_id} />
        )}
        {tab === 'Multiple Employee Wise' && (
          <BulkEnrollment dispatch={dispatch} data={policyData} multiple members_enrolled={members_enrolled.map(({ name, id, ...rest }) => ({ name, id, value: id, ...rest }))} />
        )}
        {tab === 'Audit Trail' && (
          <AuditTrailEnrollment loading={loading} data={audit_trail} />
        )}
      </Card>
      {loading && <Loader />}
    </>
  ) : <Loader />
}
