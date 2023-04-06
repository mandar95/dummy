import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

import { Button } from 'react-bootstrap';
import { Card, Loader, NoDataFound } from "../../../../components";
import { DataTable } from "../../../user-management";
import { AddFAQ } from './AddFAQ'
import { EditBrokerFAQModal } from './EditFAQ';

import { useDispatch, useSelector } from 'react-redux';
import { help, clear, removeBrokerFAQ } from '../../help.slice';
import { FAQBroker } from '../../helper';


export const FAQ = ({ userType, myModule, validation }) => {

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success, broker_faq } = useSelector(help);


  // useEffect(() => {
  //   if (userType === 'broker' && modal === false)
  //     dispatch(loadBrokerFAQ())

  //   // return () => { dispatch(clear_broker_faq()) }
  // }, [userType, dispatch, modal])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success").then(() => {
        setAddModal(false);
        setEditModal(false);
      });
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  const onEdit = (id, data) => {
    setEditModal(data);
  };

  return (
    <>
      <Card title={
        <div className="d-flex justify-content-between">
          <span>FAQ</span>
          {!!myModule?.canwrite &&
            <div>
              <Button size="sm" onClick={() => { setAddModal(true) }} className="shadow-sm m-1 rounded-lg">
                <strong>Add FAQ's +</strong>
              </Button>
            </div>}

        </div>
      }>
        {broker_faq.length ?
          <DataTable
            columns={FAQBroker((!myModule?.canwrite && !myModule?.candelete) ? false : true)}
            data={broker_faq}
            noStatus={true}
            EditFlag={!!myModule?.canwrite ? true : false}
            EditFunc={myModule?.canwrite && onEdit}
            deleteFlag={!!myModule?.candelete && 'custom_delete'}
            removeAction={removeBrokerFAQ}

            // editFAQBroker={myModule?.canwrite ? true : false}
            // deleteFAQBroker={myModule?.candelete ? true : false}
            rowStyle
          />
          :
          <NoDataFound text="No FAQ's Added" />}
      </Card>
      {!!addModal &&
        <AddFAQ
          show={addModal}
          onHide={() => setAddModal(false)}
          userType={userType}
          validation={validation}
        />}
      {!!editModal && <EditBrokerFAQModal
        id={editModal.id}
        data={editModal}
        show={!!editModal}
        onHide={() => setEditModal(false)} />}
      {loading && <Loader />}
    </>
  )
}
