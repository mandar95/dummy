import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import { Card, Select, Loader, NoDataFound } from '../../../../components'
import { DataTable } from "../../../user-management";
import { Row, Col, Button } from 'react-bootstrap';
// import Select from "../../../user-management/Onboard/Select/Select";

import { useDispatch, useSelector } from 'react-redux';
import {
  help, loadFeedBackBroker, clear, loadBroker
  // clear_broker_feedback, 
} from '../../help.slice';
import { BrokerFeedBack } from '../../helper';
import ExportModal from '../QueriesComplaint/ExportModal';


export const FeedBack = ({ userType, employer }) => {

  const dispatch = useDispatch();
  const { loading, broker_feedback, error, broker } = useSelector(help);
  const { userType: userTypeName } = useSelector(state => state.login);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //   if (userType === 'broker') {
    //     dispatch(loadFeedBackBroker())
    //   }
    if (userType === 'admin' && userTypeName) {
      dispatch(loadBroker(userTypeName))
    }
    //   return () => {
    //     dispatch(clear_broker_feedback());
    //     dispatch(clear())
    //   }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, userTypeName])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };

    return () => { dispatch(clear()) }
  }, [error, loading, dispatch]);

  const getAdminData = (e) => {
    if (e.target.value) {
      dispatch(loadFeedBackBroker(e.target.value));
    }
    return (e)
  }

  return (
    <>
      <Card title={
        <div className="d-flex justify-content-between">
          <span>Feedback</span>
          <div>
            <Button size="sm" className="shadow m-1 rounded-lg" variant="dark"
              onClick={() => { setShowModal(true) }}
            >
              <strong><i className="ti-cloud-down"></i> Export</strong>
            </Button>
          </div>
        </div>
      }>
        {(userType === "admin") &&
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={6} xl={4} sm={12}>
              <Select
                label={"Brokers"}
                placeholder='Select Broker'
                options={broker.map((item) => ({
                  id: item?.id,
                  name: item?.name,
                  value: item?.id,
                }))}
                id="drop"
                valueName="name"
                onChange={getAdminData}
              />
            </Col>
          </Row>}
        {!!broker_feedback.length ?
          <DataTable
            columns={BrokerFeedBack}
            data={broker_feedback}
            noStatus={true}
            rowStyle
          /> :
          <NoDataFound text='No Feedbacks Found' />}
      </Card>

      {!!showModal && <ExportModal
        show={showModal}
        employers={employer}
        onHide={() => setShowModal(false)}
        loading={loading}
        title={"Download Feedback"}
      />}

      {loading && <Loader />}
    </>
  )
}
