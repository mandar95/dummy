import React, { useEffect } from 'react';

import { Card, Loader, NoDataFound } from 'components';
import { DataTable } from "modules/user-management";

import { useDispatch, useSelector } from "react-redux";
import { loadPaymentHistory, clear } from "./dashboard_customer.slice";
import { PaymentHistoryColumn } from './helper'


export const PaymentHistory = () => {

  const dispatch = useDispatch();
  const { payment_history, error, loading } = useSelector((state) => state.CustDash);

  useEffect(() => {
    dispatch(loadPaymentHistory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //OnError (No error display)
  useEffect(() => {
    // if (error) {
    // }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return !loading ? (
    <Card title='Payment History'>
      {payment_history.length ? <DataTable
        columns={PaymentHistoryColumn}
        data={payment_history}
        noStatus={true}
      // pageState={{ pageIndex: 0, pageSize: 5 }}
      // pageSizeOptions={[5, 10]}
      // rowStyle
      // customStatus={customStatus}
      /> :
        <NoDataFound text='No Payment History Found' />}
    </Card>
  ) : <Loader />;
};
