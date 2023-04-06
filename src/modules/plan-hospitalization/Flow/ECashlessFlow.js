import React, { useEffect, useReducer, useState } from 'react';
import * as yup from 'yup';

import { Card, SelectComponent, Input, Error, Loader, Button, NoDataFound, Head } from 'components';
import { Row, Col, Button as Btn, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DataTable } from 'modules/user-management';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { useForm, Controller } from "react-hook-form";
import {
  // loadEmployers, 
  loadPolicyNo, loadPolicyType,
  loadFlowDetails, createECashFlow,
  // getFlowDetail, updateECashFlow,
  deleteECashFlow
} from '../plan-hospitalization.action';
import { serializeError } from 'utils';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FlowModal } from './EditModal';
import { numOnly, noSpecial } from "utils";
import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";

const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  details: [],
  firstPage: 1,
  lastPage: 1,
  loadingDetail: true
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload,
      ...((payload.last_page && payload.current_page) && {
        lastPage: payload.last_page,
        firstPage: payload.current_page + 1,
      })

    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

const validationSchema = (userType) => yup.object().shape({
  ...(userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer Required'),
    })
  }),
  policy_type: yup.object().shape({
    id: yup.string().required('Policy Type Required'),
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name Required'),
  }),
})

export function ECashlessFlow({ myModule }) {
  const dispatchRedux = useDispatch();
  const [{ loading,
    policy_types,
    policy_nos,
    // employers,
    details,
    loadingDetail,
    firstPage,
    lastPage
  },
    dispatch
  ] = useReducer(reducer, initialState);

  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const { employers,
    firstPage: fp,
    lastPage: lp, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const [modal, setModal] = useState(false);

  const { control, errors, handleSubmit, register, watch, setValue, reset } = useForm({
    validationSchema: validationSchema(userType),
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const employer_id = watch('employer_id')?.value;
  const e_cashless_allowed = watch('e_cashless_allowed');
  const employee_validation_by_employer = watch('employee_validation_by_employer');

  const FetchPolicies = (obj) => {
    if (lastPage >= firstPage) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    function _callback() {
      //dispatch(loadPolicies(brokerId, userTypeName, firstPage));
      loadPolicyNo(dispatch, obj, undefined, firstPage)
    }
    return () => {
      clearTimeout(_TimeOut)
    }
  }

  // initial load
  useEffect(() => {
    // if (userType === 'broker') {
    //   loadEmployers(dispatch);
    // }

    loadFlowDetails(dispatch)
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lp >= fp) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, fp));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fp, currentUser]);

  // load policy type
  useEffect(() => {
    if (currentUser.employer_id || employer_id) {
      if (['employee', 'employer'].includes(userType)) {
        loadPolicyType(dispatch, { employer_id: currentUser.employer_id || employer_id })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employer_id, firstPage])


  const onSubmit = ({ policy_id, e_cashless_allowed, employee_validation_by_employer, duration, duration_unit }) => {
    createECashFlow(dispatch, {
      policy_id: policy_id?.value,
      e_cashless_allowed: e_cashless_allowed || 0,
      employee_validation_by_employer: employee_validation_by_employer || 0,
      ...(Number(employee_validation_by_employer) === 3) && {
        duration: duration || 1,
        duration_unit: duration_unit || 1
      }
    })

    setTimeout(() => {
      reset({
        employer_id: '',
        policy_id: '',
        policy_type: '',
        e_cashless_allowed: '0',
        employee_validation_by_employer: '0'
      })
    }, 100)
  }

  const deleteFlow = (id) => {
    deleteECashFlow(dispatch, id)
  }

  const EditData = (id, data) => {
    setModal(data);
  };

  return (
    <>
      {!!myModule?.canwrite && <Card title='Planned Hospitalization (e-Cashless) Configuration'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">

            {['broker'].includes(userType) && <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired
                    options={employers.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                    error={errors && errors.employer_id?.id}
                  />
                }
                onChange={([selected]) => {
                  loadPolicyType(dispatch, { employer_id: selected?.value });
                  setValue('policy_type', '');
                  setValue('policy_id', '');
                  return selected;
                }}
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>}

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Type"
                    placeholder="Select Policy Type"
                    required={false}
                    isRequired
                    options={policy_types}
                    error={errors && errors.policy_type?.id}
                  />
                }
                onChange={([selected]) => {
                  FetchPolicies({ user_type_name: userTypeName, employer_id: employer_id || currentUser.employer_id, policy_sub_type_id: selected?.value }, lastPage, firstPage)
                  //loadPolicyNo(dispatch, { user_type_name: userTypeName, employer_id: employer_id || currentUser.employer_id, policy_sub_type_id: selected?.value })
                  return selected;
                }}
                control={control}
                name="policy_type"
              />
              {!!errors.policy_type?.id && <Error>
                {errors.policy_type?.id.message}
              </Error>}
            </Col>

            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Name"
                    placeholder="Select Policy Name"
                    required={false}
                    isRequired
                    options={policy_nos.filter(({ id }) => !details.some(({ policy_id }) => policy_id === id))}
                    error={errors && errors.policy_id?.id}
                  />
                }
                control={control}
                name="policy_id"
              />
              {!!errors.policy_id?.id && <Error>
                {errors.policy_id?.id.message}
              </Error>}
            </Col>

          </Row>
          <Row className="d-flex flex-wrap">

            <Col md={6} lg={4} xl={4} sm={12}>
              <Head className='text-center'>Is Planned Hospitalization (e-Cashless) Applicable?</Head>
              <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                <CustomControl className="d-flex mt-4 mr-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                  <input ref={register} name={'e_cashless_allowed'} type={'radio'} value={0} defaultChecked={true} />
                  <span></span>
                </CustomControl>
                <CustomControl className="d-flex mt-4 ml-0">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                  <input ref={register} name={'e_cashless_allowed'} type={'radio'} value={1} />
                  <span></span>
                </CustomControl>
              </div>
            </Col>
            {Number(e_cashless_allowed) === 1 &&
              <Col md={6} lg={6} xl={6} sm={12}>
                <Head className='text-center'>Request Approval required by Employer SPOC for?</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2">
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"None"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={0} defaultChecked={true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"All Employees"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={1} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Non-Priority Members"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={2} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Auto Approval"}</p>
                    <input ref={register} name={'employee_validation_by_employer'} type={'radio'} value={3} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>}
            {Number(employee_validation_by_employer) === 3 && <>

              <Col md={6} lg={4} xl={4} sm={12}>
                <Controller
                  as={<Input label="Duration" type='tel' maxLength={3}
                    onKeyDown={numOnly} onKeyPress={noSpecial} placeholder="Enter Duration" required={true}
                    isRequired={true} />}
                  name="duration"
                  error={errors && errors.duration}
                  control={control}
                />
                {!!errors.duration &&
                  <Error>
                    {errors.duration.message}
                  </Error>}
              </Col>
              <Col md={6} lg={4} xl={4} sm={12}>
                <Head className='text-center'>Duration Type?</Head>
                <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
                  <CustomControl className="d-flex mt-4 mr-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Day"}</p>
                    <input ref={register} name={'duration_unit'} type={'radio'} value={1} defaultChecked={true} />
                    <span></span>
                  </CustomControl>
                  <CustomControl className="d-flex mt-4 ml-0">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Hours"}</p>
                    <input ref={register} name={'duration_unit'} type={'radio'} value={2} />
                    <span></span>
                  </CustomControl>
                </div>
              </Col>
            </>}
          </Row>
          <Row className="d-flex justify-content-end w-100">
            <Button type='submit' className='mt-2'>
              Submit
            </Button>
          </Row>
        </form>

      </Card>}
      {!!modal && <FlowModal
        show={!!modal}
        onHide={() => setModal(false)}
        Data={modal}
        dispatch={dispatch}
      />}

      <Card title='E-Cashless Flow Detail'>
        {details.length ? <DataTable
          columns={Column(myModule, {
            deleteFlag: !!myModule?.candelete && 'custom_delete_action',
            removeAction: deleteFlow,
            EditFlag: !!myModule?.canwrite,
            EditFunc: EditData,
          })}
          data={details || []}
          noStatus={true}
          rowStyle
        /> : (!loadingDetail ? <NoDataFound /> : <NoDataFound text='Loading Data' img='/assets/images/loading.jpg' />)}
      </Card>

      {loading && <Loader />}
    </>
  )
}

const _e_cashless_allowed = ({ value }) => {
  return (<Btn disabled size="sm" variant={value ? 'success' : 'secondary'} className="shadow m-1 rounded-lg">
    {value ? 'Yes' : 'No'}
  </Btn>)
}

const Status = [
  { label: 'None', id: 0, color: 'secondary' },
  { label: 'All Employees', id: 1, color: 'success' },
  { label: 'Non-Priority Members', id: 2, color: 'primary' },
  { label: 'Auto Approval', id: 3, color: 'info' },
]

const _employee_validation_by_employer = ({ value }) => {
  return (<Btn disabled size="sm" className="shadow m-1 rounded-lg" variant={Status[value]?.color}>
    {Status[value]?.label}
  </Btn>)
}

const Column = (myModule, actionPackage) => [
  {
    Header: "Sr No.",
    accessor: "sr_no"
  },
  {
    Header: "Employer",
    accessor: "emploer_name"
  },
  // {
  //   Header: "Policy Type",
  //   accessor: "policy_type_name"
  // },
  {
    Header: "Policy Name",
    accessor: "policy_name"
  },
  {
    Header: "E-Cashless Allowed",
    accessor: "e_cashless_allowed",
    Cell: _e_cashless_allowed,
    disableFilters: true,
  },
  {
    Header: "E-Cashless Type",
    accessor: "employee_validation_by_employer",
    Cell: _employee_validation_by_employer,
    disableFilters: true,
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Action",
    accessor: "action",
    Cell: (cell) => _renderOperationAction(cell, actionPackage),
    disableFilters: true,
    disableSortBy: true
  }] : []),
]

const _renderOperationAction = (cell, { deleteFlag,
  removeAction,
  EditFlag,
  EditFunc }) => {
  return (

    <ButtonGroup size="sm">

      {EditFlag && <OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>Edit</strong>
        </Tooltip>}>
        <Btn className="strong" variant={"outline-warning"} onClick={() => EditFunc(cell.row.original?.id, cell.row.original)}>
          <i className="ti-pencil-alt" />
        </Btn>
      </OverlayTrigger>}

      {deleteFlag && <OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>Remove</strong>
        </Tooltip>}>
        <Btn className="strong" onClick={() => removeAction(cell.row.original.id)} variant="outline-danger"><i className="ti-trash" /></Btn>
      </OverlayTrigger>}

    </ButtonGroup >
  );
};
