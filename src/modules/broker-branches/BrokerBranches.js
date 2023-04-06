import React, { useState, useReducer, useEffect } from 'react';

import { Card, NoDataFound, Loader } from '../../components';
import { DataTable } from 'modules/user-management';
import { deleteBrokerBranches, initialState, loadBrokerBranches, reducer } from './broker-branches.action';
import Modal from './Modal';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getState } from '../user-management/user.slice';
import { state_data } from '../claims/claims.slice';

export function BrokerBranches({ myModule = { canwrite: 1, candelete: 1 } }) {

  const [modal, setModal] = useState();
  const dispatchRedux = useDispatch();
  const [{ loading, detail }, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useSelector(state => state.login)

  useEffect(() => {
    dispatchRedux(getState())
    return () => dispatchRedux(state_data([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    currentUser.broker_id &&
      loadBrokerBranches(dispatch, currentUser.broker_id)
  }, [currentUser])

  const DeleteBrokerBranch = (id) => {
    deleteBrokerBranches(dispatch, id,currentUser.broker_id)
  }

  const onEdit = (id, data) => {
    setModal(data);
  };

  return (
    <Card title={<div className="d-flex justify-content-between">
      <span>Branches Config</span>
      {!!myModule?.canwrite && <div>
        <Button
          size="sm"
          onClick={() => {
            setModal(true);
          }}
          className="shadow-sm m-1 rounded-lg"
        >
          <strong>Create +</strong>
        </Button>
      </div>}
    </div>}
    >
      {detail.length > 0 ? <DataTable
        columns={TableData(myModule)}
        data={detail || []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 15, 20]}
        rowStyle
        deleteFlag={!!myModule?.candelete && 'custom_delete_action'}
        removeAction={DeleteBrokerBranch}
        EditFlag={!!myModule?.canwrite}
        EditFunc={onEdit}
      /> :
        <NoDataFound />
      }

      {!!modal && (
        <Modal
          show={modal}
          onHide={() => setModal(null)}
          dispatch={dispatch}
          dispatchRedux={dispatchRedux}
        />
      )}
      {loading && <Loader />}
    </Card>
  )
}

const TableData = (myModule) => [
  {
    Header: "Sr No.",
    accessor: "index",
  },
  {
    Header: "Branch Name",
    accessor: "branch_name",
  },
  {
    Header: "Branch Location",
    accessor: "branch_location",
  },
  {
    Header: "State",
    accessor: "state_name",
  },
  {
    Header: "City",
    accessor: "city_name",
  },
  {
    Header: "Created By",
    accessor: "created_by",
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];
