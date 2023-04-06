import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import _ from 'lodash';

import { Head, Text, CardBlue, Marker, Typography, Loader } from "components";
import { Row, Col, Button as Btn } from 'react-bootstrap';

import {
  clear, selectUserInfo, selectLoading, selectError,
  selectSuccess, clearUserInfo, employeeInfo
} from '../user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { DateFormate, Decrypt } from '../../../utils';
import { ResetPasswordModal } from './Organization/ResetPassword';
import { useParams } from 'react-router';


export default function EmployeeView() {

  const dispatch = useDispatch();
  const UserInfo = useSelector(selectUserInfo);

  let { id: userId } = useParams();
  userId = Decrypt(userId);
  const { globalTheme } = useSelector(state => state.theme)
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const [modal, setModal] = useState();

  useEffect(() => {
    return () => { dispatch(clearUserInfo()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userId) {
      dispatch(employeeInfo(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

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

  //card title----------------------------------------------
  const title = (
    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "4px" }}>
      <span>Employee</span>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn size="sm" varient="primary" onClick={() => setModal(true)}>
          <p
            style={{
              fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
              fontWeight: "600",
              marginBottom: "-1px",
            }}
          >
            Reset Password
          </p>
        </Btn>
      </div>
    </div>
  );


  return (

    (!_.isEmpty(UserInfo)) ? (
      <>
        <CardBlue title={title}>
          <Row className="mt-3 flex-wrap">
            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'}Personal Details</Typography>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Employee Name</Head>
              <Text>{UserInfo.name || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Email Id</Head>
              <Text>{UserInfo.email || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Gender</Head>
              <Text>{UserInfo.gender || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Date Of Birth</Head>
              <Text>{DateFormate(UserInfo.dob) || "-"}</Text>
            </Col>

            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Contact No</Head>
              <Text>{UserInfo.mobile_no || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Emergency Contact Person</Head>
              <Text>{UserInfo.emergency_contact_name || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Emergency Contact No</Head>
              <Text>{UserInfo.emergency_contact || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Alternate Email Id</Head>
              <Text>{UserInfo.alternate_email || "-"}</Text>
            </Col>

            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'}Address Details</Typography>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Address</Head>
              <Text>{UserInfo.address || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>State</Head>
              <Text>{UserInfo.state || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>City</Head>
              <Text>{UserInfo.city || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Pincode</Head>
              <Text>{UserInfo.pincode || "-"}</Text>
            </Col>

            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'}Company Details</Typography>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Company Name</Head>
              <Text>{UserInfo.company_name || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Employee Code</Head>
              <Text>{UserInfo.employee_code || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Employee Designation</Head>
              <Text>{UserInfo.employee_desination || "-"}</Text>
            </Col>
            <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
              <Head>Date of Joining</Head>
              <Text>{DateFormate(UserInfo.doj) || "-"}</Text>
            </Col>
          </Row>
        </CardBlue>
        {
          !!modal && (
            <ResetPasswordModal
              show={!!modal}
              onHide={() => setModal(null)}
              Data={userId}
            />
          )
        }
      </>
    ) : <Loader />
  )

}
