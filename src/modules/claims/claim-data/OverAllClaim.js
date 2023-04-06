import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { DataTable } from '../../user-management'
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import swal from 'sweetalert';
import { Card, Loader, NoDataFound, sortType, SelectComponent, Button as BTN, DatePicker, Error } from '../../../components';
import { Button, ButtonGroup, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { DateFormate, randomString } from '../../../utils';
import { Controller, useForm } from 'react-hook-form';
import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
  clearEmployer,
  loadPolicyType,
  clear_policy_type,
  loadPolicyId,
  clear_policy_id,
  loadBrokerEmployer,
  clear,
  loadBroker,
  loadClaimData,
  all_claim_data as set_all_claim_data,
  setClaimAllData,
  set_track_claim
} from "../claims.slice";
import { /* addDays, */ format } from 'date-fns';
import { Prefill } from '../../../custom-hooks/prefill';

const validationSchema = yup.object().shape({
  to_date: yup.string().required("End Date Required").nullable(),
  from_date: yup.string().required("Start Date Required").nullable()
})

export function OverAllClaim() {

  const dispatch = useDispatch();
  const history = useHistory();
  const { userType } = useParams();
  const [foregtParams, setForgetParams] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);

  const {
    loading,
    success,
    policy_type: policy_types,
    policy_id: policy_ids,
    all_claim_data = [],
    broker,
    claimAllData,
    error,
  } = useSelector((state) => state.claims);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const QueryParams = {
    employer_id: decodeURIComponent(query.get('employer_id') || ''),
    employer_name: decodeURIComponent(query.get('employer_name') || ''),
    policy_type_id: decodeURIComponent(query.get('policy_type_id') || ''),
    policy_type_name: decodeURIComponent(query.get('policy_type_name') || ''),
    policy_id: decodeURIComponent(query.get('policy_id') || ''),
    policy_name: decodeURIComponent(query.get('policy_name') || ''),
    from_date: decodeURIComponent(query.get('from_date') || ''),
    to_date: decodeURIComponent(query.get('to_date' || ''))
  }

  const { control, setValue, watch, errors, handleSubmit } = useForm({
    validationSchema,
    mode: "onBlur",
    reValidateMode: "onBlur",
    ...(QueryParams?.from_date ? {
      defaultValues: {
        ...QueryParams?.employer_id && { employer_id: { id: QueryParams?.employer_id, label: QueryParams?.employer_name, value: QueryParams?.employer_id } },
        ...QueryParams?.policy_type_id && { policy_type: { id: QueryParams?.policy_type_id, label: QueryParams?.policy_type_name, value: QueryParams?.policy_type_id } },
        ...QueryParams?.policy_id && { policy_id: { id: QueryParams?.policy_id, label: QueryParams?.policy_name, value: QueryParams?.policy_id } },
        from_date: QueryParams?.from_date,
        to_date: QueryParams?.to_date
      }
    } : {
      defaultValues: claimAllData
    }
    )

  });

  const employer_id = watch('employer_id')?.value || (!(currentUser.is_super_hr && currentUser.child_entities.length) && currentUser?.employer_id);
  const policy_type = watch('policy_type')?.value;
  const policy_id = watch('policy_id')?.value;
  const from_date = watch('from_date') || '';
  const to_date = watch('to_date') || '';
  const employer_data = watch('employer_id')
  const policy_type_data = watch('policy_type')
  const policy_id_data = watch('policy_id')
  const brokerId = (watch("broker_id") || {})?.id;

  const getQueryParam = () => (
    `?${employer_data ? `employer_id=${encodeURIComponent(employer_data.id)}&employer_name=${encodeURIComponent(employer_data.label)}&` : ''}
${policy_type_data ? `policy_type_id=${encodeURIComponent(policy_type_data.id)}&policy_type_name=${encodeURIComponent(policy_type_data.label)}&` : ''}
${policy_id_data ? `policy_id=${encodeURIComponent(policy_id_data.id)}&policy_name=${encodeURIComponent(policy_id_data.label)}&` : ''}
from_date=${encodeURIComponent(from_date)}&to_date=${encodeURIComponent(to_date)}`)

  useEffect(() => {
    if (claimAllData.url) {
      history.replace(`claim-data${claimAllData.url}`)
    }

    if (QueryParams?.from_date && !all_claim_data.length) {
      dispatch(setClaimAllData({
        employer_id: QueryParams?.employer_id ? { id: QueryParams?.employer_id, label: QueryParams?.employer_name, value: QueryParams?.employer_id } : undefined,
        policy_type: QueryParams?.policy_type_id ? { id: QueryParams?.policy_type_id, label: QueryParams?.policy_type_name, value: QueryParams?.policy_type_id } : undefined,
        policy_id: QueryParams?.policy_id ? { id: QueryParams?.policy_id, label: QueryParams?.policy_name, value: QueryParams?.policy_id } : undefined,
        from_date: QueryParams?.from_date,
        to_date: QueryParams?.to_date,
        url: getQueryParam()
      }))

      dispatch(loadClaimData({
        broker_id: currentUser.broker_id || undefined,
        employer_id: QueryParams?.employer_id || currentUser.employer_id || undefined,
        policy_type: QueryParams?.policy_type_id || undefined,
        policy_id: QueryParams?.policy_id || undefined,
        ...QueryParams?.from_date && { from_date: QueryParams?.from_date },
        ...QueryParams?.to_date && { to_date: QueryParams?.to_date },
        employee_id: currentUser.employee_id,
        is_super_hr: Number(currentUser?.employer_id) === Number(QueryParams?.employer_id) ? 0 : currentUser.is_super_hr
      }))
    }
    return () => {
      // dispatch(set_all_claim_data([]))
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (userTypeName) {
      if (userType === "admin") {
        dispatch(loadBroker(userTypeName));
      }
    }

    return () => {
      dispatch(clearEmployer());
      // setECashlessAllowed(0);
      dispatch(clear_policy_type());
      dispatch(clear_policy_id());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);

  useEffect(() => {
    if (employer_id) {
      dispatch(loadPolicyType({ employer_id: employer_id }));
      (!QueryParams.policy_type_id || foregtParams) && setValue([
        { policy_type: undefined },
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])
      return () => {
        dispatch(clear_policy_type());
        dispatch(clear_policy_id());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id]);

  useEffect(() => {
    if (employer_id && policy_type) {
      (!QueryParams.policy_id || foregtParams) && setValue([
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])

      dispatch(
        loadPolicyId({
          user_type_name: userTypeName,
          employer_id: employer_id,
          policy_sub_type_id: policy_type,
          ...(userType === "broker" &&
            currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    }
    return () => {
      dispatch(clear_policy_id());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_type]);

  useEffect(() => {

    if (currentUser.employee_id && userType === 'employee') {
      dispatch(loadClaimData({ employee_id: currentUser.employee_id, is_super_hr: currentUser.is_super_hr }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (error) {
      swal("Alert", error, "warning");
    }
    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error])

  useEffect(() => {
    if (policy_id) {
      const policy = policy_ids?.find(({ id }) => id === Number(policy_id));
      (!QueryParams.from_date || foregtParams) && setValue([
        { to_date: DateFormate(policy?.end_date || '', { dateFormate: true }) || "" },
        { from_date: DateFormate(policy?.start_date || '', { dateFormate: true }) || "" }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id])

  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_types, setValue, 'policy_type', 'policy_sub_type_name', 'policy_sub_type_id')
  Prefill(policy_ids, setValue, 'policy_id', 'policy_no')


  const foregtParamsAction = ([e]) => {
    setForgetParams(true)
    return e
  }

  const getAdminEmployer = ([e]) => {
    if (e?.value) {
      setForgetParams(true)
      dispatch(loadBrokerEmployer(e.value));

      setValue([
        { employer_id: undefined },
        { policy_type: undefined },
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])
    }
    return e;
  };

  const onReset = () => {
    dispatch(set_all_claim_data([]))
    dispatch(setClaimAllData({
      broker_id: undefined,
      employer_id: undefined,
      policy_type: undefined,
      policy_id: undefined,
      from_date: undefined,
      to_date: undefined,
      url: null
    }))
    setValue([
      ...(userType !== 'employer' || !!(currentUser.is_super_hr && currentUser.child_entities.length)) ? [{ employer_id: undefined }] : [],
      { policy_type: undefined },
      { policy_id: undefined },
      { to_date: undefined },
      { from_date: undefined }
    ])
    history.replace('claim-data')
  }


  const onSubmit = () => {

    history.replace(`claim-data${getQueryParam()}`)

    dispatch(setClaimAllData({
      // broker_id: currentUser.broker_id,
      employer_id: employer_data,
      policy_type: policy_type_data,
      policy_id: policy_id_data,
      ...from_date && { from_date: from_date },
      ...to_date && { to_date: to_date },
      // employee_id: currentUser.employee_id
      url: getQueryParam()
    }))

    dispatch(loadClaimData({
      broker_id: currentUser.broker_id,
      employer_id: employer_id || currentUser.employer_id,
      policy_type: policy_type,
      policy_id: policy_id,
      ...from_date && { from_date: from_date },
      ...to_date && { to_date: to_date },
      // employee_id: currentUser.employee_id,
      is_super_hr: Number(currentUser?.employer_id) === Number(employer_id) ? 0 : currentUser.is_super_hr
    }, true))
  }

  return (
    <Card title='Overall Claims'>
      {userType !== 'employee' &&
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">
            {userType === "admin" && (
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Broker"
                      placeholder="Select Broker"
                      options={broker.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      })) || []}
                      id="id"
                      required
                    />
                  }
                  onChange={getAdminEmployer}
                  name="broker_id"
                  control={control}
                />
              </Col>
            )}
            {(userType === "broker" || userType === "admin") && (
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Employer"
                      placeholder="Select Employer"
                      options={employers.map((item) => ({
                        id: item?.id,
                        label: item?.name,
                        value: item?.id,
                      }))}
                      id="employer_id"
                    />
                  }
                  onChange={foregtParamsAction}
                  name="employer_id"
                  control={control}
                />
              </Col>
            )}
            {!!(currentUser.is_super_hr && currentUser.child_entities.length) &&
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder='Select Employer'
                    options={currentUser.child_entities.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                    id="employer_id"
                  // required
                  />}
                  // defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                  onChange={foregtParamsAction}
                  name="employer_id"
                  control={control}
                  error={errors && errors.employer_id?.id}
                />
                {!!errors.employer_id?.id && <Error>
                  {errors.employer_id?.id.message}
                </Error>}
              </Col>}

            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Type"
                    placeholder="Select Policy Type"
                    options={policy_types.map((item) => ({
                      id: item?.policy_sub_type_id,
                      label: item?.policy_sub_type_name,
                      value: item?.policy_sub_type_id,
                    }))}
                    id="policy_type"
                  // required
                  />
                }
                onChange={foregtParamsAction}
                name="policy_type"
                control={control}
              />
            </Col>

            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Name"
                    placeholder="Select Policy Name"
                    options={policy_ids.map((item) => ({
                      id: item?.id,
                      label: item?.policy_no,
                      value: item?.id,
                    }))}
                    id="policy_id"
                  // required
                  />
                }
                name="policy_id"
                control={control}
              />
            </Col>

            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <DatePicker
                    name={'from_date'}
                    label={'Start Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  setValue('to_date', undefined);
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="from_date"
                control={control}
                error={errors && errors.from_date}
              />
              {!!errors.from_date && <Error>
                {errors.from_date.message}
              </Error>}
            </Col>
            <Col md={12} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <DatePicker
                    minDate={new Date(DateFormate(from_date || '01-01-1900', { dateFormate: true }))}
                    // maxDate={addDays(new Date(DateFormate(from_date || '01-01-2200', { dateFormate: true })), 6)}
                    maxDate={new Date()}
                    name={'to_date'}
                    label={'End Date'}
                    required={false}
                    isRequired
                  />
                }
                onChange={([selected]) => {
                  return selected ? format(selected, 'dd-MM-yyyy') : '';
                }}
                name="to_date"
                control={control}
                error={errors && errors.to_date}
              />
              {!!errors.to_date && <Error>
                {errors.to_date.message}
              </Error>}
            </Col>

            {userType !== 'employee' && <Col md={12} lg={12} xl={12} sm={12} className='d-flex justify-content-end'>
              {!!(employer_id || from_date || to_date) && <BTN type='button' buttonStyle='danger' onClick={onReset}>Reset</BTN>}
              <BTN type='submit'>{employer_id ? 'Submit' : 'Get All Data'}</BTN>
            </Col>}

          </Row>
        </form>}
      {all_claim_data.length > 0 && <DataTable
        columns={TableData}
        data={all_claim_data ? all_claim_data.map((elem, index) => ({
          ...elem,
          sr_no: index + 1,
          created_at: DateFormate(elem.created_at, { type: 'withTime' }),
          updated_at: DateFormate(elem.updated_at, { type: 'withTime' }),
          claim_registration_date: DateFormate(elem.claim_registration_date),
          claim_amount: String(elem.claim_amount).includes(".") ? Number(elem.claim_amount).toFixed(2) : elem.claim_amount,
          settled_amount: String(elem.settled_amount).includes(".") ? Number(elem.settled_amount).toFixed(2) : elem.settled_amount,
          deduction_amount: String(elem.deduction_amount).includes(".") ? Number(elem.deduction_amount).toFixed(2) : elem.deduction_amount
          //deduction_amount: Number(elem.claim_amount) - Number(elem.settled_amount)
        })) : []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 15, 20]}
        rowStyle
      />
      /* :
      <NoDataFound text='No Claim Data Found' /> */}
      {!loading && userType === 'employee' && all_claim_data.length === 0 && <NoDataFound text='No Claim Data Found' />}
      {loading && <Loader />}
    </Card>
  )
}

// color code
export const _colorStatus = (cell) => {
  const color = cell?.row.original?.color_code || '#28343e';
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" style={{ backgroundColor: color, borderColor: color }}>
      {cell.value || 'Pending'}
    </Button>
  );
}

export const _Status = (cell) => {
  const color = cell?.row.original?.color_code || '#28343e';
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" style={{ backgroundColor: color, borderColor: color }}>
      {cell.value || '-'}
    </Button>
  );
}

export const _renderAction = (cell) => {
  return cell.row?.original.claim_id ? (
    <ButtonGroup key={`${cell.row.index}-operations`} size="sm">
      {< OverlayTrigger
        placement="top"
        overlay={<Tooltip>
          <strong>View claim details</strong>.
        </Tooltip>}>
        <Link to={`/claim-details-view/${randomString()}/${encodeURIComponent(cell.row?.original.claim_id)}/${randomString()}/${encodeURIComponent(cell.row?.original.type)}`}> <Button className="strong" variant="outline-info"><i className="ti-eye" /></Button></Link>
      </OverlayTrigger>}
    </ButtonGroup>
  ) : '-';
}

const _trackClaim = ({ row }) => {
  const original = row.original;

  const dispatch = useDispatch();
  const history = useHistory();
  const { userType } = useParams();

  const trackData = {
    employerId: original.employer_id,
    policyNo: original.policy_type_id,
    policyId: original.policy_id,
    employeeId: original.employee_id,
    member_id: original.member_id,
  }

  const saveTrack = () => {
    if (original.claim_id) {
      dispatch(set_track_claim({ ...trackData, claimId: original.claim_id }))
      history.push(`/${userType}/track-claim`)
    }
  }
  return !!(original.claim_id && trackData.employerId) ?
    <ButtonGroup key={`${row.index}-operations`} size="sm">
      <Button onClick={saveTrack} className="strong" variant="outline-primary">
        <i className="ti-location-pin" />
      </Button>
    </ButtonGroup> : '-'
}

const TableData = [
  {
    Header: "Sr. No.",
    accessor: "sr_no",
  },
  {
    Header: "Claim Id",
    accessor: "claim_id",
  },
  {
    Header: "Policy Number",
    accessor: "policy_number",
  },
  {
    Header: "Type",
    accessor: "type"
  },
  {
    Header: "Claim Type (ipd/opd)",
    accessor: "claim_type_ipd_opd"
  },
  {
    Header: "Client Name",
    accessor: "employer_name",
  },
  {
    Header: "Employee Name",
    accessor: "employee_name",
  },
  {
    Header: "Employee Code",
    accessor: "employee_code",
  },
  {
    Header: "Employee Email",
    accessor: "employee_email",
  },
  {
    Header: "Patient Name",
    accessor: "member_name",
  },
  {
    Header: "Member Relation",
    accessor: "member_relation",
  },
  {
    Header: "Claim Amount",
    accessor: "claim_amount",
  },
  {
    Header: "Settled Amount",
    accessor: "settled_amount",
  },
  {
    Header: "Deduction Amount",
    accessor: "deduction_amount",
  },
  {
    Header: "Claim Type",
    accessor: "claim_type",
  },
  {
    Header: "Source",
    accessor: "created_by",
  },
  {
    Header: "TPA",
    accessor: "tpa",
  },
  {
    Header: "Registered On",
    accessor: "claim_registration_date",
    sortType: sortType
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortType: sortType
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    sortType: sortType
  },
  {
    Header: "Claim Status",
    accessor: "claim_status",
    Cell: _colorStatus
  },
  {
    Header: "Claim Sub Status",
    accessor: "claim_sub_status",
    Cell: _Status
  },
  {
    Header: "TAT",
    accessor: "claim_tat",
  },
  {
    Header: "Track Claim",
    accessor: "track",
    disableSortBy: true,
    disableFilters: true,
    Cell: _trackClaim
  },
  {
    Header: "Claim View",
    accessor: "operations",
    disableSortBy: true,
    disableFilters: true,
    Cell: _renderAction
  }
];

