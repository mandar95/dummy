import React, { useEffect, useState, useReducer } from 'react';

import { TabWrapper, Tab, Card, SelectComponent, NoDataFound, Loader } from '../../components';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { DataTable } from "../user-management";

import TypeWise from './TypeWise';
import { ErrorSheetTableData } from './helper';

import {
  loadSummary, loadPolicySubType,
  // loadEmployers,
  loadEmployerChilds,
  loadGroupChilds,
  loadPolicies,
  GetErrorSheetData,
  downloadCDStatement,
  availableLivesAPI
} from './service';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { downloadFile, serializeError } from '../../utils';
import { FlexContainer } from '../core/attachFile/style';
import { RoundColor } from './style';
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react';
import { PolicyBalanceDetailsModal } from './PolicyBalanceDetails';
import { useForm, Controller } from 'react-hook-form';
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import DataTablePagination from '../user-management/DataTablePagination/DataTablePagination';

const initialState = {
  loading: false,
  loading2: false,
  summary: [],
  policie_types: [],
  // employers: [],
  childs: [],
  policies: [],
  filtered_policies: [],
  policWise: [],
  sampleUrl: '',
  ErrorSheetData: [],
  lastPage: 1,
  firstPage: 1,
  insurerCdDocument: [],
  balanceDetails: {},
  policyDetails: {}
}

const reducer = (state, { type, payload }) => {

  switch (type) {
    case 'INITIAL_FETCH': return {
      ...state,
      ...payload,
      // loading: false
    }
    case 'CHILDS_FETCH': return {
      ...state,
      childs: payload,
      loading2: false
    }
    case 'FILTER_POLICIES': {
      const filtered_policies = state.policies.filter(({ policy_sub_type_id }) => policy_sub_type_id === Number(payload));
      return { ...state, filtered_policies };
    }
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'POLICIES_UPDATE': return {
      ...state,
      loading: payload.lastPage > payload.firstPage ? true : false,
      policies: [...state.policies, ...payload.policies],
      lastPage: payload.lastPage,
      firstPage: payload.firstPage,
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      errors: serializeError(payload)
    }
    default: return state;
  }
}


// const FetchSummary = async (dispatch, userType, is_super_hr) => {
//   try {
//     dispatch({ type: 'GENERIC_UPDATE', payload: { loading3: true } });
//     const { data: summary } = await loadSummary(userType, is_super_hr);


//     dispatch({
//       type: 'GENERIC_UPDATE', payload: {
//         summary: summary?.data ? Object.values(summary?.data).filter(value => value) : [],
//         loading3: false
//       }
//     })
//   } catch (error) {
//     console.error(error)
//     dispatch({ type: 'GENERIC_UPDATE', payload: { loading3: false } });
//   }
// }

const FetchPolicySubType = async (dispatch, employer_id, broker_id) => {
  try {
    const { data: policie_types } = await loadPolicySubType(employer_id, broker_id);

    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        policie_types: policie_types?.data?.map((item) => ({
          id: item?.id,
          label: item?.name,
          value: item?.id,
        })) || [],
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const FetchPolicies = async (dispatch, userType, firstPage, is_super_hr, employerChildType) => {
  try {
    const { data } = await loadPolicies(userType, firstPage, is_super_hr, (employerChildType).replace('c-', '').replace('e-', ''));
    dispatch({
      type: 'POLICIES_UPDATE', payload: {
        policies: data?.data?.map((item) => ({
          id: item?.id,
          label: item?.policy_number + ':' + item?.policy_name,
          value: item?.id,
          policy_sub_type_id: item?.policy_sub_type_id
        })) || [],
        lastPage: data?.last_page,
        firstPage: data?.current_page + 1,
      },
    })
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
  }
}


const LoadChildsApi = async (dispatch, data) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data: childs } = await loadEmployerChilds(data);

    const response = [];

    childs?.data?.length && childs.data.forEach((item1) => {
      const parent_id = 'e-' + item1.id;
      response.push({
        id: parent_id, value: parent_id, label: item1.name, is_child: 0
      })
      // item1?.child_companies.length && item1.child_companies.forEach((item2) => {
      //   const child_id = 'c-' + item2.id;
      //   response.push({
      //     id: child_id, value: child_id, label: `${item1.name}:${item2.name}`, is_child: 1
      //   })
      // })
    })

    dispatch({
      type: 'CHILDS_FETCH', payload: response
    })
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });

  }
}


const LoadGroupApi = async (dispatch, data) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data: childs } = await loadGroupChilds(data);
    dispatch({
      type: 'CHILDS_FETCH', payload: childs?.data?.map(({ id, policy_number, employer_childs }) => ({
        id, value: id,
        label: `${policy_number}:${employer_childs.reduce((mergeName, { company_name }) => (mergeName ? mergeName + ',' : mergeName) + company_name, '')}`
      })) || []
    })

  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const LoadErrorSheetData = async (dispatch, payload) => {
  try {
    //dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data } = await GetErrorSheetData(payload);
    if (data.status) {
      dispatch({
        type: 'INITIAL_FETCH', payload: {
          ErrorSheetData: data?.data
        }
      })
    }
    else {
      // dispatch({
      //   type: 'ERROR', payload: {
      //     errors: message || errors
      //   }
      // });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const DownloadCDStatement = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data } = await downloadCDStatement(payload);
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
    data?.data?.download_report && downloadFile(data?.data?.download_report, '', true);
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const AvailableLives = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data } = await availableLivesAPI(payload);
    if (data.data) {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
      swal(data.data)
    }
    else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
      swal('No Data Available', '', 'info')
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const tabType = {
  'Policy Wise': 1,
  'Entity Wise': 2,
  'Group Wise': 3
}

export default function CDBalance({ myModule }) {
  const dispatchRedux = useDispatch();
  const [tab, setTab] = useState('Policy Wise');
  const [policyId, setPolicyId] = useState('');
  const [employerChildType, setEmployerChildType] = useState('');
  const [modal, setModal] = useState(false);
  const [{
    // summary,
    // employers,
    loading, loading2,
    //  loading3,
    policie_types, childs, filtered_policies,
    policWise, sampleUrl, ErrorSheetData,
    lastPage, firstPage, insurerCdDocument,
    balanceDetails, policyDetails }, dispatch] = useReducer(reducer, initialState);
  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const { control, setValue } = useForm()
  const { employers,
    firstPage: fp,
    lastPage: lp, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  useEffect(() => {
    if (userTypeName && (currentUser.employer_id || currentUser.broker_id)) {
      FetchPolicySubType(dispatch, currentUser.employer_id, currentUser.broker_id);
      // FetchSummary(dispatch, userTypeName, currentUser.is_super_hr);
    }
  }, [userTypeName, currentUser])


  useEffect(() => {
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
  useEffect(() => {
    if (userTypeName && ((employerChildType && tab === 'Policy Wise') || userTypeName === 'Employer')) {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 1000);
      }
      function _callback() {
        FetchPolicies(dispatch, userTypeName, firstPage, currentUser.is_super_hr, employerChildType);
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, userTypeName, employerChildType, tab])

  useEffect(() => {
    if (currentUser.employer_id && !employerChildType) {
      if (tab === 'Entity Wise')
        LoadChildsApi(dispatch, { employer_id: currentUser.employer_id });
      if (tab === 'Group Wise')
        LoadGroupApi(dispatch, { employer_id: currentUser.employer_id });
    }
  }, [currentUser, tab, employerChildType])

  useEffect(() => {
    if (currentUser.broker_id) {
      if (tab === 'Entity Wise' || tab === 'Policy Wise')
        LoadChildsApi(dispatch, { broker_id: currentUser.broker_id });
    }
  }, [currentUser, tab])

  useEffect(() => {
    if (tab !== 'Policy Wise') {
      setPolicyId('')
    }

  }, [tab])


  useEffect(() => {
    if (currentUser?.broker_id || currentUser?.employer_id) {
      LoadErrorSheetData(dispatch, {
        ...((currentUser?.broker_id && userType === 'broker') && { broker_id: currentUser?.broker_id }),
        ...((currentUser?.employer_id && userType === 'employer') &&
          { employer_id: currentUser?.employer_id, is_super_hr: currentUser.is_super_hr })
      })
    }
    const intervalId = setInterval(() => LoadErrorSheetData(dispatch, {
      ...((currentUser?.broker_id && userType === 'broker') && { broker_id: currentUser?.broker_id }),
      ...((currentUser?.employer_id && userType === 'employer') &&
        { employer_id: currentUser?.employer_id, is_super_hr: currentUser.is_super_hr })
    }), 15000);
    return () => { clearInterval(intervalId); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])


  return /* loading ? <Loader /> : */ (
    <>
      <Card title='CD Balance Summary'>
        {/* {loading3 ? <NoDataFound text='Loading Polices' img='/assets/images/loading.jpg' /> :
          (summary.length ? <DataTable
            columns={ColumnStructure({ dispatch }, { setModal, dispatch })}
            data={summary}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 6 }}
            pageSizeOptions={[6, 9, 12]}
            rowStyle
            autoResetPage={false}
            hidePagination={6}
          /> :
            <NoDataFound />)} */}
        <DataTablePagination
          showEmptyMessage={false}
          columns={ColumnStructure({ dispatch }, { setModal, dispatch })}
          noStatus
          // viewLink={'/employee-view'}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 20, 25, 50, 100]}
          autoResetPage={false}
          // disableFilter
          activateSearch
          activateSearchText={'Search By Policy Number'}
          // CurrentURL={listId}
          rowStyle
          API={loadSummary}
          ApiPayload={{ userType, is_super_hr: currentUser.is_super_hr }}
        />
      </Card>

      <Card title={'CD Balance'}>
        <TabWrapper shadow='0' margin='0' width={'max-content'}>
          <Tab
            borderRadius={'1.1em'}
            isActive={tab === 'Policy Wise'}
            onClick={() => { setEmployerChildType(''); setTab('Policy Wise') }}>
            Policy Wise
          </Tab>
          {(userType === 'broker' || !!currentUser.is_super_hr) && <Tab
            borderRadius={'1.1em'}
            isActive={tab === 'Entity Wise'}
            onClick={() => { setEmployerChildType(''); setTab('Entity Wise') }}>
            Entity Wise
          </Tab>}
          <Tab
            borderRadius={'1.1em'}
            isActive={tab === 'Group Wise'}
            onClick={() => { setEmployerChildType(''); setTab('Group Wise') }}>
            Group Wise
          </Tab>
        </TabWrapper>

        <Row>
          {tab === 'Policy Wise' &&
            <>
              {userType === 'broker' && <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Entity"
                    placeholder="Select Entity"
                    required={false}
                    isRequired={true}
                    options={childs}
                  />}
                  onChange={([e]) => {
                    setEmployerChildType(e?.value);
                    dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true, firstPage: 1, lastPage: 1, policies: [], policWise: [], filtered_policies: [] } });
                    setValue('policy_type', undefined)
                    setValue('policy_id', undefined)
                    return e
                  }}
                  control={control}
                  name="entity_id"
                />
              </Col>}
              <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Policy Type"
                      placeholder="Select Policy Type"
                      required={false}
                      isRequired={true}
                      options={policie_types}
                    />}
                  onChange={([e]) => {
                    dispatch({ type: 'FILTER_POLICIES', payload: e?.value });
                    dispatch({ type: 'GENERIC_UPDATE', payload: { policWise: [] } });
                    setValue('policy_id', undefined)
                    return e
                  }}
                  control={control}
                  name="policy_type"
                />
              </Col>
              <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="Policy"
                      placeholder="Select Policy"
                      required={false}
                      isRequired={true}
                      options={filtered_policies}
                    />}
                  onChange={([e]) => {
                    setPolicyId(e?.value);
                    return e
                  }}
                  control={control}
                  name="policy_id"
                />
              </Col>
            </>}
          {tab === 'Entity Wise' && (userType === 'broker' || !!currentUser.is_super_hr) &&
            <>
              {userType === 'broker...' && <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired={true}
                    options={employers?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) || []}
                  />}
                  onChange={([e]) => {
                    setEmployerChildType(e?.value)
                    LoadChildsApi(dispatch, { employer_id: e?.value });
                    return e;
                  }}
                  control={control}
                  name="employer_id"
                />
              </Col>}
              {userType === 'employer' ? !!(currentUser.is_super_hr) &&
                <Col md={12} lg={4} xl={3} sm={12}>
                  <Controller
                    as={<SelectComponent
                      label="Entity"
                      placeholder='Select Entity'
                      options={currentUser.child_entities.map(item => (
                        {
                          id: 'c-' + item.id,
                          label: item.name,
                          value: 'c-' + item.id
                        }
                      )) || []}
                      id="entity_id"
                      required
                    />}
                    onChange={([e]) => {
                      setEmployerChildType(e?.value);
                      return e
                    }}
                    name="entity_id"
                    control={control}
                  />
                </Col> : <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Entity"
                    placeholder="Select Entity"
                    required={false}
                    isRequired={true}
                    options={childs}
                  />}
                  onChange={([e]) => {
                    setEmployerChildType(e?.value);
                    return e
                  }}
                  control={control}
                  name="entity_id"
                />
              </Col>}
            </>
          }
          {tab === 'Group Wise' &&
            <>
              {userType === 'broker' && <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired={true}
                    options={employers?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) || []}
                  />}
                  onChange={([e]) => {
                    LoadGroupApi(dispatch, { employer_id: e?.value });
                    return e;
                  }}
                  control={control}
                  name="employer2_id"
                />
              </Col>}
              <Col xl={3} lg={4} md={6} sm={12}>
                <Controller
                  as={<SelectComponent
                    label="Group"
                    placeholder="Select Group"
                    required={false}
                    isRequired={true}
                    options={childs}
                  />}
                  onChange={([e]) => {
                    setEmployerChildType(e?.value);
                    return e;
                  }}
                  control={control}
                  name="group_id"
                />
              </Col>
            </>
          }
        </Row>

        <TypeWise myModule={myModule} policy_id={policyId} employer_child_companies_id={employerChildType}
          childs={(userType === 'employer' && !!(currentUser.is_super_hr)) ? currentUser.child_entities.map(item => (
            {
              id: 'c-' + item.id,
              label: item.name,
              value: item.id
            }
          )) || [] : childs}
          insurerCdDocument={insurerCdDocument}
          policWise={policWise} sampleUrl={sampleUrl} type={tabType[tab]} dispatch={dispatch} />

      </Card>

      <Card title='Insurer Endorsement'>
        {!!ErrorSheetData.length ?
          <DataTable
            columns={
              ErrorSheetTableData(userType) ||
              []
            }
            data={
              ErrorSheetData ||
              []
            }
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            autoResetPage={false}
            rowStyle
          />
          :
          <NoDataFound />
        }
      </Card>
      {!!modal && <PolicyBalanceDetailsModal
        payload={modal}
        balanceDetails={balanceDetails}
        policyDetails={policyDetails}
        show={!!modal}
        dispatch={dispatch}
        onHide={() => setModal(false)}
      />}

      {(loading2 || loading) && <Loader />}
    </>
  )
}

const _renderExportPolicyAction = ({ row }, { dispatch }) => {
  return (
    <FlexContainer className='justify-content-center' onClick={() =>
      DownloadCDStatement(dispatch, { policy_id: row.original.policy_id })}>
      <RoundColor>
        <i className="ti ti-download"></i>
      </RoundColor>
      {/* <p className="my-auto ml-2">{'Download'}</p> */}
    </FlexContainer>
  );
};

const style = { fontSize: '0.7rem' };

export const RenderView = ({ row }, { dispatch }) => {

  return (
    <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() =>
      AvailableLives(dispatch, { policy_id: row.original.policy_id })}>
      View&nbsp;<i style={style} className='ti-angle-up text-primary' />
    </Button>)
};

export const PolicyBalanceDetails = ({ row }, { dispatch, setModal }) => {

  return (
    <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() =>
      setModal({ policy_id: row.original.policy_id })}>
      Add&nbsp;<i style={style} className='ti-plus text-primary' />
    </Button>)
};

const _renderInception = ({ row, value }) => {

  const tableView = () => {
    swalReact(<Table
      bordered
      className="text-center rounded text-nowrap"
      style={{ border: "solid 1px #e6e6e6" }}>
      <thead>
        <tr>
          <th className="align-top">
            Installment
          </th>
          <th className="align-top">
            Installment Amount(₹)
          </th>
        </tr>
      </thead>
      <tbody>
        {row.original.installment_amounts?.map((_, index) =>
          <tr key={index + 'inception'}>
            <td>
              {index + 1} Installment
            </td>
            <td>
              {_}
            </td>
          </tr>
        )}
      </tbody>
    </Table>)

  }

  if (Number(value)) {
    return value === 1 ? Number(row.original.inception_premium) : (
      <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={tableView}>
        View&nbsp;<i style={style} className='ti-angle-up text-primary' />
      </Button>)
  }
  if (Number(row.original.inception_premium)) {
    return Number(row.original.inception_premium)
  }
  return '-'
}

const ColumnStructure = (cdPackage, policyDetailPack) => [
  {
    Header: "Employer Name",
    accessor: "employer_name",
  },
  {
    Header: "Policy Number",
    accessor: "policy_number",
  },
  {
    Header: "Policy Type",
    accessor: "policy_sub_type",
  },
  {
    Header: "Initial CD(₹)",
    accessor: "initial_amount",
  },
  {
    Header: "CD Deposit(₹)",
    accessor: "cd_trasaction_amount",
  },
  {
    Header: "Total Lives",
    accessor: "total_lives"
  },
  {
    Header: "Policy Premium(₹)",
    accessor: "total_premium",
  },
  {
    Header: "Utilize Amount(₹)",
    accessor: "utilized_amount",
  },
  {
    Header: "Balance CD(₹)",
    accessor: "remaining_amount",
  },
  {
    Header: "Inception Premium(₹)",
    accessor: "inception_premium",
  },
  {
    Header: "Inception Premium Installment(₹)",
    accessor: "inception_premium_installment",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderInception
  },

  {
    Header: "CD Statement",
    accessor: "cd_pdf",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => _renderExportPolicyAction(e, cdPackage)

  },
  {
    Header: "Lives to be added",
    accessor: "available_lives",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => RenderView(e, cdPackage)
  },
  {
    Header: "Add CD",
    accessor: "policy_balance_details",
    disableFilters: true,
    disableSortBy: true,
    Cell: (e) => PolicyBalanceDetails(e, policyDetailPack)
  },
]
