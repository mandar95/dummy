import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { DashboardCard, Div } from './style.js';
import { Row, Col } from 'react-bootstrap';
import { Button, Loader } from "components";
import { UserManagement } from './Table';
import { ViewOrganization } from './Organization/View';
import { EditOrganization } from './Organization/Edit';
import { ViewAddress } from './Address/View.js';
import { EditAddress } from './Address/Edit.js';

import { ResetPasswordModal } from './Organization/ResetPassword';

import { useDispatch, useSelector } from 'react-redux';
import {
  clear, userInfoAdmin, selectUserInfo, clearCity, getState,
  getCity, selectLoading,
  selectError, selectSuccess, clearUserInfo
} from '../user.slice';
import { Decrypt } from '../../../utils/EncryptDecrypt.js';
import { useHistory, useParams } from 'react-router';
import { loadThemes } from '../../theme/theme.slice.js';

export default function EmployerView() {

  const [disable1, setDisable1] = useState(false);
  const [disable2, setDisable2] = useState(false);
  const dispatch = useDispatch();
  const UserInfo = useSelector(selectUserInfo);
  const [modal, setModal] = useState();
  let { id: userId } = useParams();
  userId = Decrypt(userId);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const { themes } = useSelector((state) => state.theme);
  const stateId = UserInfo?.data?.employer?.[0]?.state_id;

  // Access Control
  const history = useHistory();
  const { modules } = useSelector(state => state.login);
  const [myModule, setMyModule] = useState(null);
  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find((elem) => elem.url.endsWith('/user-management-employer'))
      if (!thisModule?.canread) {
        history.replace('/home')
      }
      setMyModule(thisModule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])


  useEffect(() => {
    if (userId) {
      dispatch(userInfoAdmin("employer", userId));
      dispatch(getState());
      dispatch(loadThemes());
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

  const EditUserData = (data) => {
    setModal(data);
  };

  return (
    <>
      <Div>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-agenda fa-2x text-success"></i></div>
              <h6>{UserInfo?.policies}</h6>
              <h4>Policies</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-user fa-2x text-primary"></i></div>
              <h6>{UserInfo?.employer_users}</h6>
              <h4>Users</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-face-smile fa-2x text-danger"></i></div>
              <h6>{UserInfo?.employees}</h6>
              <h4>Employee</h4>
            </DashboardCard>
          </Col>
          <Col md={6} lg={3} xl={3} sm={12} className="p-3">
            <DashboardCard>
              <div><i className="rounded-circle ti-direction-alt fa-2x text-warning"></i></div>
              <h6>{UserInfo?.employee_members}</h6>
              <h4>Total Lives</h4>
            </DashboardCard>
          </Col>
          <Col md={12} lg={12} xl={12} sm={12}>
            {(UserInfo?.data) &&
              <>
                <Row className="d-flex flex-wrap">
                  <Col className="p-3">
                    <DashboardCard>
                      {!!myModule?.canwrite && <div className="float-right position-absolute flex-d justify-content-end" style={{ right: "7px", top: "18px" }} >
                        <Button buttonStyle="outline" type="button" onClick={() => { setDisable1(!disable1) }}>
                          {disable1 ? "Cancel" : "Edit"}
                        </Button>
                      </div>}
                      <h3>Organization</h3>
                      {disable1 ?
                        <EditOrganization
                          Data={!!UserInfo.data?.employer.length && UserInfo.data?.employer[0]}
                          Submitted={() => setDisable1(false)}
                          userType="employer"
                          userId={userId}
                          themes={themes} /> :
                        <ViewOrganization themes={themes} Data={!!UserInfo.data?.employer.length && UserInfo.data?.employer[0]} />}
                    </DashboardCard>
                  </Col>
                </Row>

                <Row className="d-flex flex-wrap">
                  <Col className="p-3">
                    <DashboardCard>
                      {!!myModule?.canwrite && <div className="float-right position-absolute flex-d justify-content-end" style={{ right: "7px", top: "18px" }} >
                        <Button buttonStyle="outline" type="button" onClick={() => { setDisable2(!disable2) }}>
                          {disable2 ? "Cancel" : "Edit"}
                        </Button>
                      </div>}
                      <h3>Address Detail</h3>
                      {disable2 ?
                        <EditAddress
                          Data={!!UserInfo.data?.employer.length && UserInfo.data?.employer[0]}
                          Submitted={() => setDisable2(false)}
                          userType="employer"
                          userId={userId} /> :
                        <ViewAddress Data={!!UserInfo.data?.employer.length && UserInfo.data?.employer[0]} />}
                    </DashboardCard>
                  </Col>
                </Row>
              </>
            }
          </Col>
        </Row>
      </Div>
      {!!UserInfo?.data?.employees?.length && <UserManagement canwrite={!!myModule?.canwrite} employeeEmployer data={UserInfo?.data?.employees || []} EditUser={EditUserData} />}
      {!!UserInfo?.data?.users?.length && <UserManagement canwrite={!!myModule?.canwrite} users data={UserInfo?.data?.users || []} EditUser={EditUserData} />}
      {
        !!modal && (
          <ResetPasswordModal
            show={!!modal}
            onHide={() => setModal(null)}
            Data={modal}
          />
        )
      }
      {(loading || _.isEmpty(UserInfo)) && <Loader />}
    </>
  )
}
