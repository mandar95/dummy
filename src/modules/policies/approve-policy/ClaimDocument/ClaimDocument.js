import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import { CardBlue, Button, Loader, Typography, Head, Text, Input } from "components";
import { DataTable } from "modules/user-management";
import { Row, Col, Button as Btn } from 'react-bootstrap';
import { EditModal, _documentType } from './EditModal';

import { useDispatch, useSelector } from 'react-redux';
import { approvePolicy, loadPolicy, clearPolicyData, clear, editPolicy } from '../approve-policy.slice';
import { useHistory, useParams } from "react-router";
import { _renderDocument, NoDataFound } from '../../../../components';
import { Decrypt } from '../../../../utils';
import { Controller, useForm } from 'react-hook-form';
import { Switch } from '../../../user-management/AssignRole/switch/switch';



const TableData = (is_ipd_opd, isNotEmployer, havePolicyType) => [
  {
    Header: "Document Name",
    accessor: "document_name",
  },
  {
    Header: "Document",
    accessor: "document",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderDocument
  },
  ...(is_ipd_opd ? [{
    Header: "IPD/OPD",
    accessor: "rater_type"
  }] : []),
  ...(havePolicyType ? [{
    Header: "Document Type",
    accessor: "document_type_name"
  }] : []),
  {
    Header: "Mandatory",
    accessor: "is_mandatory",
    Cell: _renderStatusAction,
    disableFilters: true,
    disableSortBy: true,
  },
  ...(isNotEmployer ? [{
    Header: "Operations",
    accessor: "operations",
  }] : [])
];

const customStatus = {
  "Yes": "success",
  "No": "danger"
};

const _renderStatusAction = (cell) => {
  return (
    <Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={customStatus[cell.value] || "success"} >
      {cell.value || '-'}
    </Btn>
  );
}


export const ClaimDocument = ({ nextPage, myModule = {} }) => {
  // const dispatch = useDispatch();
  const { policyData, success, loading, error } = useSelector(approvePolicy);
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const [modal, setModal] = useState();

  const { id, userType } = useParams();
  const [editClaimInfo, setEditClaimInfo] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const policy_id = Decrypt(id);

  const { control, watch, setValue } = useForm({
    // validationSchema
    defaultValues: {
      claim_back_date_days: policyData?.claim_back_date_days || '0',
      is_claim_intimation_mandatory: Number(policyData?.is_claim_intimation_mandatory)
    }
  });

  const no_of_back_days = watch('claim_back_date_days')
  const is_claim_intimation_mandatory = watch('is_claim_intimation_mandatory')
  const is_ipd_opd = policyData.policy_rater_type_id === 3


  useEffect(() => {
    if (editClaimInfo) {
      setValue('claim_back_date_days', policyData?.claim_back_date_days || '0')
      setValue('is_claim_intimation_mandatory', Number(policyData?.is_claim_intimation_mandatory))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editClaimInfo])

  useEffect(() => {
    if (!nextPage && policy_id && userType === "broker") {
      dispatch(loadPolicy(policy_id));
      return () => {
        dispatch(clearPolicyData());
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (success) {
      setModal(false)
    }
  }, [success])

  useEffect(() => {
    if (policy_id) {
      if (!loading && error) {
        swal("Alert", error, "warning");
      };
      if (!loading && success) {
        swal('Success', success, "success");
        setEditClaimInfo(false)
      };
      return () => { dispatch(clear()) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  // role approve allowed || is Admin 
  const AllowedToApprove = (myModule.other || currentUser.ic_user_type_id === 1) /* && (new Date(policyData.end_date)?.setHours(0, 0, 0, 0) >= new Date()?.setHours(0, 0, 0, 0)) */;

  const EditMember = (id, data) => {
    setModal(data);
  };

  const onDelete = (id) => {
    dispatch(editPolicy({
      id: id,
      user_type_name: userTypeName,
      operation_type: 3,
      step: 5,
      _method: 'PATCH',
      policy_id: policyData.id
    }, policyData.id))
  };

  const goBack = () => {
    history.goBack();
  }

  const updateData = () => {
    dispatch(editPolicy({
      id: id,
      user_type_name: userTypeName,
      operation_type: 2,
      claim_back_date_days: no_of_back_days,
      is_claim_intimation_mandatory,
      step: 5,
      _method: 'PATCH',
      policy_id: policyData.id
    }, policyData.id))
    // let f = no_of_back_days.current.children.children.children[0]
  }

  return (
    <>
      <CardBlue title={<div className="d-flex justify-content-between">
        <span>Claim Documents</span>
        {userType !== "employer" && <Button type="button" onClick={() => { setModal(true) }} buttonStyle="outline-secondary">
          Add +
        </Button>}
      </div>}>
        <form>
          {(!loading && policyData.claimDocuments?.length ?
            <DataTable
              columns={TableData(is_ipd_opd, userType !== "employer", ![2].includes(policyData.policy_rater_type_id) && policyData.claimDocuments?.some(({ document_type }) => document_type))}
              data={policyData.claimDocuments?.map(({ is_mandatory, document_name, sample_document_url, id, is_opd_document, document_type }) => ({
                document_type,
                document_type_name: document_type.split(',').reduce((total, item) => total ? total + ', ' + _documentType.find(({ id }) => +item === id)?.name : _documentType.find(({ id }) => +item === id)?.name, '') || '-',
                is_mandatory: is_mandatory ? 'Yes' : 'No',
                document_name, id,
                is_opd_document,
                rater_type: is_opd_document ? 'OPD' : 'IPD',
                ...(sample_document_url && { document: sample_document_url })
              })) || []}
              noStatus={true}
              rowStyle
              // customStatus={customStatus}
              EditFunc={EditMember}
              EditFlag
              deleteFlag={'custom_delete_action'}
              removeAction={onDelete}
            // deleteFlag='delete-claim-document'
            // policy_id={policyData.id}
            />
            :
            <NoDataFound text='No Claim Document Found' />)}
          {!!(nextPage) && <>
            <Col md={12} lg={12} xl={12} style={{
              display: 'flex',
              justifyContent: 'end',
              borderTop: '2px solid #fff8a8',
              paddingTop: '10px',
              marginTop: '50px'
            }}>
              {!!(AllowedToApprove && userType !== "employer") && (!editClaimInfo ? <Button type="button" onClick={() => setEditClaimInfo(true)} buttonStyle="outline-secondary">
                Edit
              </Button>
                :
                <Button type="button" onClick={() => setEditClaimInfo(false)} buttonStyle="outline-secondary">
                  Cancel
                </Button>)
              }
            </Col>
            <br />
            {!editClaimInfo ? <>
              <Typography>{'\u00A0'}Intimate Claim Information</Typography>
              <Col xs={12} md={6} lg={6} className="mt-2" sm={12}>
                <Head>No Of Back Days (Intimate Claim)</Head>
                <Text>{policyData.claim_back_date_days || "0"}</Text>
              </Col>
              <Typography>{'\u00A0'}Submit Claim Information</Typography>
              <Col xs={12} md={6} lg={6} className="mt-2" sm={12}>
                <Head>Claim Intimation Mandatory Before Submit Claim</Head>
                <Text>{policyData.is_claim_intimation_mandatory ? 'Yes' : 'No'}</Text>
              </Col>
            </>
              :
              <>
                <Typography>{'\u00A0'}Intimate Claim Information</Typography>
                <Col xl={5} lg={7} md={12} sm={12}>
                  <Controller
                    as={
                      <Input
                        label="No Of Back Days (Intimate Claim)"
                        placeholder="Enter No Of Back Days"
                        type="number"
                        min={0}
                        noWrapper
                      />
                    }
                    name={"claim_back_date_days"}
                    control={control}
                    rules={{ required: true }}
                  />
                </Col>
                <Typography>{'\u00A0'}Submit Claim Information</Typography>
                <Col xl={5} lg={7} md={12} sm={12}>
                  <Controller
                    as={<Switch />}
                    name="is_claim_intimation_mandatory"
                    control={control}
                    defaultValue={0}
                    label={`Claim Intimation Mandatory Before Submit Claim`}
                  />
                </Col>
              </>
            }</>}
          <Row className='d-block pt-5'>
            <Col md={12} className="d-flex justify-content-end mt-4">
              {(nextPage && AllowedToApprove && (new Date(policyData.end_date)?.setHours(0, 0, 0, 0) >= new Date()?.setHours(0, 0, 0, 0)) && userType !== "employer") ?
                !editClaimInfo ? <Button type="button" onClick={nextPage}>
                  Approve
                </Button> : <Button type="button" onClick={() => updateData()}>
                  Update
                </Button>
                :
                <Button type="button" onClick={goBack}>
                  Go to Policy list
                </Button>}
            </Col>
          </Row>
        </form>
      </CardBlue>
      {
        !!modal &&
        <EditModal
          Data={modal}
          is_ipd_opd={is_ipd_opd}
          id={policyData.id}
          rater_id={Number(policyData.policy_rater_type_id)}
          show={!!modal}
          onHide={() => setModal(false)}
        />
      }
      {
        loading && <Loader />
      }
    </>
  )
}
