import React, { useState, useReducer, useEffect } from 'react';

import { Card, TabWrapper, Tab, Loader, NoDataFound } from "components";
import { Button } from 'react-bootstrap';
import { AddModal } from './AddModal';
import { DataTable } from "modules/user-management";

import { serializeError } from '../../../utils';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteContact, getContacts,
  // loadEmployers, 
  loadPolicyNo
} from '../contact.us.action';
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";

const Types = {
  'Broker': {
    title: 'Broker',
    type: 1,
    data_key: 'broker'
  },
  'Employer': {
    title: 'Employer',
    type: 3,
    data_key: 'employer'
  },
  'TPA': {
    title: 'TPA',
    type: 4,
    data_key: 'tpa'
  },
  'Insurer': {
    title: 'Insurer',
    type: 2,
    data_key: 'insurer'
  }
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


const initialState = {
  loading: true,
  details: { broker: [], employer: [], insurer: [], tpa: [] },
  employers: [],
  policy_nos: []
}

export function CRMConfig({ myModule }) {
  const dispatchRedux = useDispatch()

  const [{ details, loading,
    // employers,
    policy_nos }, dispatch] = useReducer(reducer, initialState);
  const [tab, setTab] = useState('Broker');
  const [modal, setModal] = useState(false);
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  useEffect(() => {
    // loadEmployers(dispatch)
    loadPolicyNo(dispatch)
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
    if (currentUser?.broker_id) {
      getContacts(dispatch, { broker_id: currentUser?.broker_id })
    }
  }, [currentUser])

  useEffect(() => {
    if (loading) {
      setModal(false)
    }
  }, [loading])

  const onEdit = (id, data) => {
    setModal(data || { id: 1 });
  };

  const deleteData = (id) => {
    deleteContact(dispatch, id, currentUser?.broker_id)
  }

  return (
    <>
      <TabWrapper width="max-content">
        <Tab
          isActive={Boolean(tab === "Broker")}
          onClick={() => setTab("Broker")}>
          Broker
        </Tab>
        <Tab
          isActive={Boolean(tab === "Employer")}
          onClick={() => setTab("Employer")}>
          Employer
        </Tab>
        <Tab
          isActive={Boolean(tab === "TPA")}
          onClick={() => setTab("TPA")}>
          TPA
        </Tab>
        <Tab
          isActive={Boolean(tab === "Insurer")}
          onClick={() => setTab("Insurer")}>
          Insurer
        </Tab>
      </TabWrapper>

      <Card title={<div className="d-flex justify-content-between">
        <span>{tab} Contact Detail</span>
        {!!myModule?.canwrite && <Button type="button" onClick={() => setModal(true)}>
          Add Contact +
        </Button>}
      </div>}>

        {loading ? <>
          <NoDataFound text='Loading Data...' img='/assets/images/loading.jpg' />
          <Loader /></> : (details[Types[tab].data_key].length ? <DataTable
            columns={TableColumn(myModule)}
            data={details[Types[tab].data_key] || []}
            noStatus={true}
            rowStyle
            deleteFlag={!!myModule?.candelete && 'custom_delete_action'}
            removeAction={deleteData}
            EditFlag={!!myModule?.canwrite}
            EditFunc={onEdit}
          /> : <NoDataFound />)}

      </Card>

      {modal && <AddModal
        typeData={Types[tab]}
        show={!!modal}
        data={modal}
        contact_data={details[Types[tab].data_key]}
        dispatch={dispatch}
        currentUser={currentUser}
        employers={employers?.map((item) => ({
          id: item?.id,
          label: item?.name,
          value: item?.id,
        })) || []}
        policy_nos={policy_nos}
        onHide={() => setModal(false)} />}
    </>
  )
}

const _showAddress = ({ value }) => <div style={{ whiteSpace: 'pre-line' }}>
  {value}
</div>


const TableColumn = (myModule) => [
  {
    Header: "Employer",
    accessor: "employer_name",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Address",
    accessor: "address",
    Cell: _showAddress
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Contact",
    accessor: "contact",
  },
  {
    Header: "Level",
    accessor: "level",
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];
