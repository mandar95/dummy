import React, { useState, useEffect } from "react";
import swal from "sweetalert";
// import * as yup from 'yup';

import { Button } from "react-bootstrap";
import { Select, Card, Loader, _colorCode, NoDataFound } from "components";
import { DataTable } from 'modules/user-management';
import Modal from './Modal'

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { clear, loadTPAs, loadBroker, loadTPAKeywordsStatus, deleteTPAKeywords } from "../claims.slice";

export const TpaStatusConfig = ({ myModule }) => {
  const dispatch = useDispatch();
  const { userType } = useParams();
  const [modal, setModal] = useState();

  const { tpaKeywords = [], loading, success, error, broker } = useSelector((state) => state.claims);

  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);

  const onEdit = (id, data) => {
    setModal(data);
  };

  useEffect(() => {
    if (userType === 'admin' && userTypeName) {
      dispatch(loadBroker(userTypeName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);

  useEffect(() => {
    if (currentUser.broker_id) {
      dispatch(loadTPAs({ broker_id: currentUser.broker_id }))
      dispatch(loadTPAKeywordsStatus({ broker_id: currentUser.broker_id }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  useEffect(() => {
    if (success) {
      swal(success, "", "success").then(() => {
      });
      modal && setModal(false)
      dispatch(loadTPAKeywordsStatus({ broker_id: currentUser.broker_id }))
    }
    if (error) {
      swal("Alert", error, "warning");
    }
    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error])

  return (
    <>
      <Card
        title={
          <div className="d-flex justify-content-between">
            <span>TPA Status Configurator</span>
            {!!myModule?.canwrite && <div>
              <Button
                size="sm"
                onClick={() => {
                  setModal(true);
                }}
                className="shadow-sm m-1 rounded-lg"
              >
                <strong>Claim Status Mapping +</strong>
              </Button>
            </div>}
          </div>}
      >

        {userType === 'admin' && <div className="p-2">

          <Select
            label="Broker"
            placeholder='Select Broker'
            required={false}
            isRequired={false}
            options={broker.map((item) => ({
              id: item?.id,
              name: item?.name,
              value: item?.id,
            }))}
          />
        </div>
        }

        {tpaKeywords.length > 0 ? <DataTable
          columns={TableData(myModule)}
          data={tpaKeywords || []}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 15, 20]}
          rowStyle
          deleteFlag={!!myModule?.candelete && 'custom_delete'}
          removeAction={deleteTPAKeywords}
          EditFlag={!!myModule?.canwrite}
          EditFunc={onEdit}
        /> :
          <NoDataFound />
        }

      </Card>

      {!!modal && (
        <Modal
          show={!!modal}
          onHide={() => setModal(null)}
          Data={modal}
          broker_id={currentUser.broker_id}
          userType={userType}
        />
      )}

      {loading && <Loader />}

    </>
  )
}

const TableData = (myModule) => [
  {
    Header: "TPA",
    accessor: "tpa_name",
  },
  {
    Header: "Tpa Claim Status Master",
    accessor: "keywords",
    Cell: (data) => {
      return data.value.map(({ keyword }, index) =>
        <Button key={keyword + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
          {keyword}
        </Button>)
    },
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter(row => {
        const keywords = row.values[id];
        return keywords.some(({ keyword }) => String(keyword)
          .toLowerCase()
          .includes(String(filterValue).trimStart().toLowerCase()))
      });
    }
  },
  {
    Header: "Color",
    accessor: "color_code",
    Cell: _colorCode
  },
  {
    Header: "Status Text",
    accessor: "status_name",
    // disableFilters: true,
    // disableSortBy: true,
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];
