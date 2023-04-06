import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react';
import axios from 'axios';

import classes from 'modules/Health_Checkup/form.module.css'
import { GlobalStyle, StyledCard } from './styles';
import { DataTable } from 'modules/user-management';
import { generateSelfEndorseLink, policyColumns } from '../helper';
import { Policy } from '../models/policy';
import { Select, Loader, NoDataFound, LoaderButton } from 'components';
import ReactSelect from "react-select";
import { Row, Col, Button } from 'react-bootstrap';
import { approvePolicy, clear, loadBroker, broker_id, policyApproved } from '../approve-policy/approve-policy.slice'
import {
  loadPolicies, clearEnrollmentDate,
  clearDownloadPolicySuccess, clearPolicyDeleteSucess,
  clearPolicyDeleteError, clearPolicies, deletePolicy,
  exportPolicy,
  setPageData
} from '../policy-config.slice';
import { useDispatch, useSelector } from 'react-redux';
import { randomString } from 'utils';
import { EnrollmentSheetMappping } from './EnrollmentSheetMappping';
import { loadTemplates } from '../../EndorsementRequest/EndorsementRequest.slice';
import { downloadFile, Encrypt } from '../../../utils';
import { AuditTrailModal } from './AuditTrailModal';
import { DocumentsModal } from './DocumentModal';

import {
  fetchEmployers,
  setPageData as setPageData1
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { SelectComponent } from '../../../components';
import { ModuleControl } from '../../../config/module-control';
import { GeneratePolicyModal } from './GeneratePolicyModal';


const PolicyList = ({ myModule }) => {
  const dispatch = useDispatch();
  const { userType } = useParams();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const employerName = decodeURIComponent(query.get("name") || '');
  const employerId = query.get("id");

  const [generatePolicyModal, setGeneratePolicyModal] = useState(false);
  const [policyData, setPolicyData] = useState([]);
  const [brokerId, setBrokerId] = useState(null);
  const [modal, setModal] = useState(null);
  const [auditModal, setAuditModal] = useState(null);
  const [documentModal, setDocumentModal] = useState(null);
  const [employer, setEmployer] = useState(employerName ? {
    label: employerName,
    id: employerId,
    value: employerId
  } : null);

  const { changeEnrollmentMessage, error, policyURL,
    policyDeleteSucess, policyDeleteError,
    policies, firstPage, lastPage, listLoading } = useSelector(state => state.policyConfig);

  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  const { success, broker, error: ApproveError } = useSelector(approvePolicy);

  const notEmployer = userType !== 'employer';

  const { employers,
    firstPage: firstPage1,
    lastPage: lastPage1, } = useSelector(
      (state) => state.networkhospitalbroker);

  const FetchPolicies = () => {
    if (lastPage >= firstPage) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    let cancelTokenSource = axios.CancelToken.source();
    function _callback() {
      dispatch(loadPolicies(brokerId, userTypeName, firstPage, cancelTokenSource, currentUser.is_super_hr, type, employer?.id || currentUser?.employer_id));
    }
    return () => {
      clearTimeout(_TimeOut)
      cancelTokenSource.cancel();
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setPageData1({
        firstPage: 1,
        lastPage: 1,
      }))
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (brokerId) {
      dispatch(broker_id(brokerId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerId])

  useEffect(() => {
    if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
      if (lastPage1 >= firstPage1) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage1));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage1, currentUser]);

  useEffect(() => {
    if ((((userType === 'broker' || userType === 'employer') && userTypeName) || brokerId) && (employer?.id || currentUser?.employer_id)) {
      return FetchPolicies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, userType, userTypeName, employer]);

  useEffect(() => {
    if (userTypeName) {

      // if (userType === 'broker' || userType === 'employer') {
      //   dispatch(loadPolicies(null, userTypeName));
      // }
      if (userType === 'admin') {
        dispatch(loadBroker(userTypeName))
      }
      dispatch(loadTemplates())
    }

    return () => { dispatch(clearPolicies()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, userTypeName]);

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
      return;
    }

    if (changeEnrollmentMessage) {
      swal("", changeEnrollmentMessage, "success");
    }

    if (policyURL) {
      const link = document.createElement('a');
      link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(policyURL));
      link.href = policyURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return () => { dispatch(clearEnrollmentDate()); dispatch(clearDownloadPolicySuccess()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeEnrollmentMessage, error, policyURL]);

  useEffect(() => {
    if (policies) {
      const policyModels = policies
        .map((policy, index) => new Policy(policy, index));
      setPolicyData(prev => [...policyModels]);
    }
  }, [policies]);

  useEffect(() => {
    if (ApproveError) {
      swal("Alert", ApproveError, "warning");
    };

    if (success) {
      swal('Success', success, "success");
      if (modal) {
        setModal(false)
      }
      return FetchPolicies()
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, ApproveError]);

  // delete policy
  useEffect(() => {
    if (policyDeleteSucess) {
      swal('Success', policyDeleteSucess, "success");
      return FetchPolicies()
    };

    if (policyDeleteError) {
      swal("Alert", policyDeleteError, "warning");
      return FetchPolicies()
    };

    return () => { dispatch(clearPolicyDeleteError()); dispatch(clearPolicyDeleteSucess()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyDeleteSucess, policyDeleteError]);

  const getAdminEmployer = (e) => {
    if (e.target.value) {
      // dispatch(loadPolicies(e.target.value, userTypeName));
      setBrokerId(e.target.value)
      FetchPolicies()
    }
    return (e)
  }

  const customRender = ({ row }) => {
    const redirect = () => history.push(`policy/claim-documents/${randomString()}/${Encrypt(row?.original?.id)}/${randomString()}`);
    return [2, 3, 5, 6].includes(row?.original?.policy_sub_type_id) ? '-' : <Button type="button" variant="outline-dark" size="sm" className='shadow' onClick={redirect}>
      Documents <i className="ti-file" />
    </Button>
  }

  const _renderChangeEnrollmentAction = (cell) => {
    return (
      <Button
        size="sm"
        variant={'outline-info'}
        className='shadow'
        onClick={() => history.push(`policies-enrollment/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`)}>
        Change <i className="ti-pencil-alt" />
      </Button>
    );
  };

  const _renderExportPolicyAction = (data) => {
    return (
      <span
        role='button'
        onClick={() => dispatch(exportPolicy({ policy_id: data.row.original.id, user_type_name: userTypeName }))}>
        <i className="ti ti-download"></i>
      </span >
    );
  };


  const choosePolicies = (employer) => {
    let state = []

    swalReact(
      <Row>
        <Col xl={12} lg={12} ms={12} sm={12}>
          <div className={`text-center ${classes.fieldset}`}>
            <span className={`text-dark ${classes.legend}`}>
              Select Policies <span className="text-danger">*</span>
            </span>
            <ReactSelect
              closeMenuOnSelect={false}
              isMulti
              options={policies?.filter((item) =>
                ((currentUser.is_super_hr && currentUser.child_entities.length) ? employer.label === item.employer : true) &&
                item.policy_status === 'Active' &&
                (!item.is_parent_policy && !item.self_exclude_policy) &&
                (/* new Date(item.start_date).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) && */ new Date(item.end_date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) // check policy is active and date is in between
                .map(data => ({
                  id: data.id,
                  label: `${data.policy_number} : ${data.policy_name}`,
                  value: data.id
                }))}
              onChange={
                (e) => {
                  state = e
                  return e
                }
              }
              name="selectedPolicies"
            />
          </div>
        </Col>
      </Row>
      , {
        buttons: {
          cancel: "Cancel",
          'Generate': true
        },
        closeOnClickOutside: false,
      }).then((value) => {
        if (value) {
          if (state.length)
            generateSelfEndorseLink(state)
          else
            swal('No Policy Selected', '', 'info', { buttons: 'OK' })
        }
      })
  }

  const chooseEmployer = () => {
    let state = []

    swalReact(
      <Row>
        <Col className='mb-4' xl={12} lg={12} ms={12} sm={12}>
          <div className={`text-center ${classes.fieldset}`}>
            <span className={`text-dark ${classes.legend}`}>
              Select Employer <span className="text-danger">*</span>
            </span>
            <ReactSelect
              closeMenuOnSelect={true}
              // isMulti
              options={[...new Set(policies.map(item => item.employer))]?.map(data => ({
                id: data,
                label: data,
                value: data
              }))}
              onChange={
                (e) => {
                  state = e
                  return e
                }
              }
              name="selectedPolicies"
            />
          </div>
        </Col>
      </Row>
      , {
        buttons: {
          cancel: "Cancel",
          'Next': true
        },
        closeOnClickOutside: false,
      }).then((value) => {
        if (value) {
          if (state.label)
            choosePolicies(state)
          else
            swal('No Employer Selected', '', 'info', { buttons: 'OK' })
        }
      })
  }


  const _renderAction = ({ row }) => {
    const status = row?.values?.policyStatus;
    const AllowedToApprove = myModule.other || currentUser.ic_user_type_id === 1;

    switch (status) {
      case "Active": return (
        <Button variant={"success"} size="sm"
          onClick={() => {
            swal({
              title: "Update Policy?",
              text: "Update policy data or status",
              icon: "warning",
              buttons: {
                cancel: "Cancel",
                ...AllowedToApprove && { 'Disable': 'Disable' },
                catch: {
                  text: "Update Policy!",
                  value: "update",
                },
                ...AllowedToApprove && { inactive: true }
              },
              dangerMode: true,
            })
              .then((caseValue) => {
                switch (caseValue) {
                  case "update":
                    history.push(`approve-policy/${randomString()}/${Encrypt(row.original.id)}/${randomString()}`)
                    break;
                  case "inactive":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 3));
                    break;
                  case "Disable":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 0));
                    break;
                  default:
                }
              })
          }}>
          {'Approved'}
        </Button>
      );
      case "Approved": return (
        <Button size="sm" onClick={() => {
          swal({
            title: AllowedToApprove ? "Go Live?" : 'Update Policy?',
            text: AllowedToApprove ? "Make this policy live!" : 'Update this policy!',
            icon: "warning",
            buttons: {
              cancel: "Cancel",
              ...AllowedToApprove && { 'Disable': 'Disable' },
              catch: {
                text: "Update Policy!",
                value: "update",
              },
              ...AllowedToApprove && { 'GoLive': 'Go Live' }
            },
            dangerMode: 'true',
          })
            .then((caseValue) => {
              switch (caseValue) {
                case "update":
                  history.push(`approve-policy/${randomString()}/${Encrypt(row.original.id)}/${randomString()}`)
                  break;
                case "GoLive":
                  AllowedToApprove && dispatch(policyApproved(row.original.id, 1));
                  break;
                case "Disable":
                  AllowedToApprove && dispatch(policyApproved(row.original.id, 0));
                  break;
                default:
              }
            })
        }}>
          {AllowedToApprove ? 'Go Live' : 'Update'}
        </Button>
      )
      case "Pending Approval": return row.original.renewed_from ?
        (AllowedToApprove ?
          <Button size="sm" onClick={() => {
            swal({
              title: "Go Live?",
              text: "Make this policy live!",
              icon: "warning",
              buttons: {
                cancel: "Cancel",
                catch: {
                  text: "Approved Only!",
                  value: "approve",
                },
                live: 'Approved & Live'
              },
              dangerMode: true,
            })
              .then((caseValue) => {
                switch (caseValue) {
                  case "live":
                    dispatch(policyApproved(row.original.id, 1));
                    break;
                  case "approve":
                    dispatch(policyApproved(row.original.id, 3));
                    break;
                  default:
                }
              })
          }}>
            {'Approve'}
          </Button> : '-') :
        (<Button size="sm" onClick={() => { history.push(`approve-policy/${randomString()}/${Encrypt(row.original.id)}/${randomString()}`) }}>
          {AllowedToApprove ? 'Approve' : 'Update'}
        </Button>)
      case "Inactive": return (
        <Button variant={"success"} size="sm"
          onClick={() => {
            swal({
              title: "Update Policy?",
              text: "Update policy data or status",
              icon: "warning",
              buttons: {
                cancel: "Cancel",
                catch: {
                  text: "Update Policy!",
                  value: "update",
                },
                ...AllowedToApprove && { 'Approve': 'Approve' },
                ...AllowedToApprove && { 'GoLive': 'Go Live' }
              },
              dangerMode: true,
            })
              .then((caseValue) => {
                switch (caseValue) {
                  case "update":
                    history.push(`approve-policy/${randomString()}/${Encrypt(row.original.id)}/${randomString()}`)
                    break;
                  case "Approve":
                    dispatch(policyApproved(row.original.id, 3));
                    break;
                  case "GoLive":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 1));
                    break;
                  default:
                }
              })
          }}>
          {'Update Policy/Status'}
        </Button>
      );
      case 'Policy Expired':
        return <Button variant={"secondary"} size="sm"
          onClick={() => {
            swal({
              title: "Update Policy?",
              text: "Update policy data or status",
              icon: "warning",
              buttons: {
                cancel: "Cancel",
                ...(AllowedToApprove && ['Active', 'Approved', 'Pending Approval'].includes(row?.original.policyStatusOriginal)) && { 'Disable': 'Disable' },
                ...(AllowedToApprove && ['Active'].includes(row?.original.policyStatusOriginal)) && { inactive: true },
                catch: {
                  text: "Update Policy!",
                  value: "update",
                },
                ...(AllowedToApprove && ['Pending Approval', 'Inactive'].includes(row?.original.policyStatusOriginal)) && { 'Approve': 'Approve' },
                ...(AllowedToApprove && ['Approved', 'Pending Approval', 'Inactive'].includes(row?.original.policyStatusOriginal)) && { 'GoLive': 'Activate' },
              },
              dangerMode: true,
            })
              .then((caseValue) => {
                switch (caseValue) {
                  case "update":
                    history.push(`approve-policy/${randomString()}/${Encrypt(row.original.id)}/${randomString()}`)
                    break;
                  case "inactive":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 3));
                    break;
                  case "Approve":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 3));
                    break;
                  case "GoLive":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 1));
                    break;
                  case "Disable":
                    AllowedToApprove && dispatch(policyApproved(row.original.id, 0));
                    break;
                  default:
                }
              })
          }}>
          {'Update Policy/Status'}
        </Button>
      default: return <></>;
    }
  };

  const _changeEnrollmentSheet = (data) => {
    return (<Button
      size="sm"
      variant={'outline-success'}
      className='shadow'
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => setModal({ policy_id: data.row.original.id, sheet_data: data.value, tpaid: data?.row?.original?.tpa_id, policy_sub_type_id: data.row.original.policy_sub_type_id })}>
      Custom Sheet Mapping <i className="ti-pencil-alt" />
    </Button>)
  }

  const _AuditTrail = ({ row }) => {
    return (<Button
      size="sm"
      variant={'outline-danger'}
      className='shadow'
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => setAuditModal(row.original.id)}>
      Audit Trail <i className="ti-list" />
    </Button>)
  }

  const _PolicyDocument = ({ value, row }) => {
    return value.length ? (<Button
      size="sm"
      variant={'outline-dark'}
      className='shadow'
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => value.length === 1 ? downloadFile(value[0].document_path, undefined, true) : setDocumentModal(value)}>
      {value.length === 1 ? `${value[0].document_name?.replace(`${row.original.policyName} - `, '')}` : 'Policy Documents'} <i className="ti-file" />
    </Button>) : '-'
  }

  const _CdStatement = ({ value, row }) => {
    return value.length ? (<Button
      size="sm"
      variant={'outline-dark'}
      className='shadow'
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => value.length === 1 ? downloadFile(value[0].document_path, undefined, true) : setDocumentModal(value)}>
      {value.length === 1 ? `${value[0].document_name?.replace(`${row.original.policyName} - `, '')}` : 'CD Statements'} <i className="ti-file" />
    </Button>) : '-'
  }

  const _renderTable = (
    <StyledCard
      title={<div className="d-flex justify-content-between">
        <span>Policies</span>
        <div>
          {(employer || userType === 'employer') && (!(firstPage > lastPage) ?
            <LoaderButton percentage={(firstPage - 1) * 100 / lastPage} /> :
            !!policies.length &&
            <Button onClick={(!(currentUser.is_super_hr && currentUser.child_entities.length) && (employer?.id > 0 || !employer)) ? choosePolicies : chooseEmployer} size='sm' type='button'>Generate Self Endorsement Link <i className="ti-link" /></Button>)}
          {userType === 'broker' && ModuleControl.CustomRelease /* JSON Copy Policy */ && <Button onClick={() => setGeneratePolicyModal(true)} className='ml-2' size='sm' variant='secondary' type='button'>Generate Policy JSON <i className="ti-import" /></Button>}
        </div>
      </div>}
      round>

      {(userType === "admin") &&
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={6} xl={4} sm={12}>
            <Select
              label={"Brokers"}
              placeholder='Select Broker'
              options={broker.map((item) => ({
                id: item?.id,
                name: item?.name,
                value: item?.id,
              }))}
              id="drop"
              valueName="name"
              onChange={getAdminEmployer}
            />
          </Col>ll
        </Row>}
      {(userType === "broker" || userType === "admin") &&
        <Col md={12} lg={4} xl={3} sm={12} style={{ zIndex: 4 }}>
          <SelectComponent
            label="Employer"
            placeholder='Select Employer'
            options={[{
              id: -1,
              label: 'All Policies',
              value: -1
            }, ...employers.map((item) => ({
              id: item?.id,
              label: item?.name,
              value: item?.id
            }))]}
            value={employer}
            id="employer_id"
            required
            onChange={(e) => {
              history.replace(`policies?name=${encodeURIComponent(e.label)}&id=${e.id}${type ? `&type=${type}` : ''}`)
              dispatch(setPageData({
                firstPage: 1,
                lastPage: 1,
              }))
              setEmployer(e); return e
            }}
            name="employer_id"
          />
        </Col>}

      {(listLoading && employer) ? <>
        <NoDataFound text='Loading Polices' img='/assets/images/loading.jpg' />
        <Loader /></> : (!!(policyData && policyData.length > 0) ?
          <DataTable
            columns={policyColumns(
              (myModule?.canwrite) ? true : false,
              (myModule?.candelete) ? true : false,
              userType === "admin",
              customRender,
              _renderChangeEnrollmentAction,
              _renderExportPolicyAction,
              _renderAction,
              _changeEnrollmentSheet,
              _AuditTrail,
              _PolicyDocument,
              _CdStatement,
              notEmployer,
              currentUser.is_super_hr,
              policyData?.some(({ total_policy_lives, total_policy_premium }) => total_policy_lives || total_policy_premium),
              policyData?.some(({ policy_document }) => policy_document.length),
              policyData?.some(({ cd_statement }) => cd_statement.length)
            )}
            data={policyData}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            autoResetPage={false}
            noStatus={true}
            deleteFlag={'custom_delete'}
            removeAction={deletePolicy}
          // deleteFlag={'policyDelete'}
          // customRender={customRender}
          // type={userType === "admin" ? '/admin/' : '/broker/'}
          // link1={'Policy'}
          /> :
          (employer && <NoDataFound text='No Policies Data Found' />))}
      {!!modal && <EnrollmentSheetMappping data={modal} show={!!modal} onHide={() => setModal(false)} />}
      {!!auditModal && <AuditTrailModal policy_id={auditModal} show={!!auditModal} onHide={() => setAuditModal(false)} />}
      {!!documentModal && <DocumentsModal show={documentModal} onHide={() => setDocumentModal(false)} />}
      {generatePolicyModal && <GeneratePolicyModal show={generatePolicyModal} onHide={() => setGeneratePolicyModal(false)} />}
      {firstPage === 1 && lastPage === 1 && employer && <Loader />}
      <GlobalStyle />
    </StyledCard>
  )


  return _renderTable;
}

export default PolicyList;
