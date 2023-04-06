import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { Card, Loader } from '../../components';
import { serializeError } from '../../utils';
import { DataTable } from '../user-management';
import { PlannedHospitalMapDetail } from './plan-hospitalization.action';

const initialState = {
  loading: false,
  detail: [],
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

export function AilmentHospMapDetail() {

  const [{ loading, detail }, dispatch] = useReducer(reducer, initialState);

  const { currentUser } = useSelector(state => state.login)

  useEffect(() => {
    if (currentUser.employer_id) {
      PlannedHospitalMapDetail(dispatch, { employer_id: currentUser.employer_id })
    }
  }, [currentUser]);

  return loading ? <Loader /> : (
    <Card title="Planned Hospitalization E-Cashless Hospital Details">
      <DataTable
        columns={Column}
        data={detail || []}
        noStatus={true}
        // pageState={{ pageIndex: 0, pageSize: 5 }}
        // pageSizeOptions={[5, 10, 20]}
        rowStyle
      />
    </Card>
  )
}

const Column = [
  {
    Header: "Hospital Name",
    accessor: "hospital_name"
  },
  {
    Header: "Member Name",
    accessor: "hospital_state"
  },
  {
    Header: "Mobile No",
    accessor: "hospital_city"
  },
  {
    Header: "Email",
    accessor: "ailment_name"
  },
  {
    Header: "Claim Intimate Date",
    accessor: "ailment_cost"
  }
]
