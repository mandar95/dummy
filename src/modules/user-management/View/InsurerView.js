import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { DashboardCard, Div } from './style.js';
import { Row, Col } from 'react-bootstrap';
import { Button, Loader } from "components";
// import { UserManagement } from './Table';
import { ViewOrganization } from './Organization/View';
import { EditOrganization } from './Organization/Edit';
import { ViewAddress } from './Address/View.js';
import { EditAddress } from './Address/Edit.js';

import { useDispatch, useSelector } from 'react-redux';
import {
  clear, insurerInfo, selectUserInfo, getState,
  getCity, selectLoading, selectError,
  selectSuccess, clearCity, clearUserInfo
} from '../user.slice';
import { useParams } from 'react-router';
import { Decrypt } from '../../../utils/EncryptDecrypt.js';

export const InsurerView = () => {

  const [disable1, setDisable1] = useState(false);
  const [disable2, setDisable2] = useState(false);
  const dispatch = useDispatch();
  const UserInfo = useSelector(selectUserInfo);
  let { id } = useParams();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const stateId = UserInfo?.state_id;
  id = Decrypt(id);

  useEffect(() => {
    if (id) {
      dispatch(insurerInfo(id));
      dispatch(getState());
    }

    return () => { dispatch(clearUserInfo()); dispatch(clearCity()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stateId) {
      dispatch(getCity({ state_id: stateId }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId])
  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  return (
    <>
      <Div>
        <Row className="d-flex flex-wrap">
          {/* <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-agenda fa-2x text-success"></i></div>
              <h6>{UserInfo?.policies}</h6>
              <h4>Policies</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-user fa-2x text-primary"></i></div>
              <h6>{UserInfo?.broker_users}</h6>
              <h4>Users</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-direction-alt fa-2x text-warning"></i></div>
              <h6>{UserInfo?.employers}</h6>
              <h4>Employers</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-face-smile fa-2x text-danger"></i></div>
              <h6>{UserInfo?.employees}</h6>
              <h4>Employee</h4>
            </DashboardCard>
          </Col> */}
          <Col md={12} lg={12} xl={12} sm={12}>
            {(UserInfo) &&
              <>
                <Row className="d-flex flex-wrap">
                  <Col className="p-3">
                    <DashboardCard>
                      <div className="float-right position-absolute flex-d justify-content-end" style={{ right: "7px", top: "18px" }} >
                        <Button buttonStyle="outline" type="button" onClick={() => { setDisable1(!disable1) }}>
                          {disable1 ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                      <h3>Organization</h3>
                      {disable1 ?
                        <EditOrganization
                          Data={UserInfo}
                          Submitted={() => setDisable1(false)}
                          userType="insurer"
                          userId={id} /> :
                        <ViewOrganization Data={UserInfo} />}
                    </DashboardCard>
                  </Col>
                </Row>

                <Row className="d-flex flex-wrap">
                  <Col className="p-3">
                    <DashboardCard>
                      <div className="float-right position-absolute flex-d justify-content-end" style={{ right: "7px", top: "18px" }} >
                        <Button buttonStyle="outline" type="button" onClick={() => { setDisable2(!disable2) }}>
                          {disable2 ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                      <h3>Address Detail</h3>
                      {disable2 ?
                        <EditAddress
                          Data={UserInfo}
                          Submitted={() => setDisable2(false)}
                          userType="insurer"
                          userId={id} /> :
                        <ViewAddress Data={UserInfo} />}
                    </DashboardCard>
                  </Col>
                </Row>
              </>
            }
          </Col>
        </Row>
      </Div>
      {/* <UserManagement employer data={UserInfo?.data?.employers || []} /> */}
      {/* <UserManagement users data={UserInfo?.data?.users || []} /> */}
      {(loading || _.isEmpty(UserInfo)) && <Loader />}
    </>
  )
}
