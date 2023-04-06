import React, { useState, useReducer, useEffect } from 'react';

import { Card, NoDataFound, Loader } from '../../components';
import { DataTable } from 'modules/user-management';
import { loadWhiteListing, initialState, deleteWhiteListing, reducer } from './white-listing.action';
import Modal from './Modal';
import { Button } from 'react-bootstrap';

export function WhiteListing({ myModule = { canwrite: 1, candelete: 1 } }) {

  const [modal, setModal] = useState();
  const [{ loading, detail }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadWhiteListing(dispatch)
  }, [])

  const DeleteBrokerBranch = (id) => {
    deleteWhiteListing(dispatch, id)
  }

  const onEdit = (id, data) => {
    setModal(data);
  };

  return (
    <Card title={<div className="d-flex justify-content-between">
      <span>White Listing Config</span>
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
        />
      )}
      {loading && <Loader />}
    </Card>
  )
}

const _colorCode = ({ value, row }) => {
  const color = row.original.type === 1 ? '#2c8cb5' : '#eeb02b';
  return (<Button disabled size="sm" className="shadow m-1 rounded-lg" style={{ backgroundColor: color, borderColor: color }}>
    {value}
  </Button>)
}

const TableData = (myModule) => [
  {
    Header: "Sr No.",
    accessor: "index",
  },
  {
    Header: "Type",
    accessor: "type_name",
    Cell: _colorCode
  },
  {
    Header: "IP Address",
    accessor: "ip",
  },
  {
    Header: "Email Address",
    accessor: "email",
  },
  {
    Header: "Created On",
    accessor: "created_at",
  },
  {
    Header: "Updated On",
    accessor: "updated_at",
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];
