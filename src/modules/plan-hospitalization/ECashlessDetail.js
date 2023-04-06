import React, { useEffect, useReducer } from 'react';
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Card, Loader, NoDataFound, SelectComponent, sortType } from '../../components';
import { serializeError } from '../../utils';
import { DataTable } from '../user-management';
import {
  ClaimDetail,
  // loadEmployers
} from './plan-hospitalization.action';
import { useForm, Controller } from "react-hook-form";
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";

const initialState = {
  loading: false,
  loadingClaimDetail: false,
  detail: [],
  employers: []
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}

export function ECashlessDetail() {
  const dispatchRedux = useDispatch();

  const [{ loading, detail,
    // employers, 
    loadingClaimDetail }, dispatch] = useReducer(reducer, initialState);

  const { currentUser, userType: userTypeName } = useSelector(state => state.login)
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { userType } = useParams();

  const { control, watch } = useForm();
  const employerId = watch('employer_id')?.value;

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
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (userType !== 'employee' && (currentUser.employer_id || employerId)) {
      ClaimDetail(dispatch, { employer_id: currentUser.employer_id || employerId, user_type_name: userTypeName, is_super_hr: currentUser.is_super_hr })
    }
    if (userType === 'employee' && currentUser.employee_id) {
      ClaimDetail(dispatch, { employee_id: currentUser.employee_id, user_type_name: userTypeName, is_super_hr: currentUser.is_super_hr })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employerId]);

  return loading ? <Loader /> : (
    <Card title="Planned Hospitalization E-Cashless Claim Detail">
      {userType === 'broker' && <Row className="d-flex flex-wrap">
        <Col md={6} lg={4} xl={4} sm={12}>
          <Controller
            as={<SelectComponent
              label="Employer"
              placeholder='Select Employer'
              options={employers?.map((item) => ({
                id: item.id,
                name: item.name,
                label: item.name,
                value: item.id
              })) || []}
              id="employer_id"
              required
            />}
            name="employer_id"
            control={control}
          />
        </Col>
      </Row>}
      {detail.length ? <DataTable
        columns={Column}
        data={detail || []}
        noStatus={true}
        // pageState={{ pageIndex: 0, pageSize: 5 }}
        // pageSizeOptions={[5, 10, 20]}
        rowStyle
      /> : !loadingClaimDetail && <NoDataFound text={(!employerId && userType === 'broker') ? 'No Employer Selected' : 'No Data Found'} />}
      {loadingClaimDetail && <>
        <NoDataFound text='Loading Data...' img='/assets/images/loading.jpg' />
        <Loader /></>}
    </Card>
  )
}

const _view = ({ value, row }) => {

  const history = useHistory()

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>
        <strong>View Claim</strong>.
      </Tooltip>}>
      <Button className="strong" variant="outline-info" onClick={() => history.push(`e-cashless-service?claim_request_id=${row?.original?.claim_request_id}`)}><i className="ti-eye" /></Button>
    </OverlayTrigger>
  )
}


const Column = [
  // {
  //   Header: "Broker",
  //   accessor: "employee_name"
  // },
  // {
  //   Header: "Employer",
  //   accessor: "employee_name"
  // },
  {
    Header: "Sr No.",
    accessor: "sr_no"
  },
  {
    Header: "Employee Code",
    accessor: "employee_code"
  },
  {
    Header: "Employee Name",
    accessor: "employee_name"
  },
  {
    Header: "Member Name",
    accessor: "patient_name"
  },
  {
    Header: 'Member Relation',
    accessor: "relation_with_employee"
  },
  {
    Header: "Mobile No",
    accessor: "mobile_no"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Planned Hospitalization Date",
    accessor: "planned_date",
    sortType: sortType
  },
  {
    Header: "Claim Request Date",
    accessor: "claim_request_date",
    sortType: sortType
  },
  {
    Header: "Ailment",
    accessor: "reason"
  },
  {
    Header: "Ailment Cost",
    accessor: "recommendation_data.ailment_cost"
  },
  {
    Header: "Hospital",
    accessor: "hospital_name"
  },
  {
    Header: "TAT(in days)",
    accessor: "tat_days"
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "View Detail",
    accessor: "view",
    Cell: _view
  },
]

