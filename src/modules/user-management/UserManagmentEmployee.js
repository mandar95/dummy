import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { DataTable } from "modules/user-management/index";
import { Card, Loader, SelectComponent } from "../../components";
import { Row, Col } from "react-bootstrap";
import { randomString } from "utils";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUsersData,
  selectUsersStatus,
  getUserDataDropdown,
  selectdropdownData,
  selectLoading,
  clearData,
  clearRole,
  clear,
  // setPageData,
  selectError,
  selectSuccess,
  RoleDataEmployee,
} from "./user.slice";
import { Encrypt } from "utils";
import { useHistory } from "react-router";
import { useForm, Controller } from "react-hook-form";


export default function UserManagmentEmployee(props) {
  const history = useHistory();
  const { userType: currentUserType } = useSelector((state) => state.login);
  const [getId, setGetId] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(selectUsersData);
  const userCount = useSelector(selectUsersStatus);
  const dropDown = useSelector(selectdropdownData);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const loading = useSelector(selectLoading);

  const { control } = useForm();


  const GetType = (props) => {
    return (
      (props.users && "users") ||
      (props.broker && "Broker") ||
      (props.employer && "Employer") ||
      (props.employee && "Employee") ||
      (props.module && "Module") ||
      (props.brokerRole && "Role") ||
      (props.employerRole && "Role") ||
      (props.insurer && "Insurer") ||
      (props.insurerRole && "Role") ||
      (props.tpa && "TPA")
    );
  };
  const type = GetType(props);

  useEffect(() => {
    dispatch(
      getUserDataDropdown({
        status: 1,
        type: "Employer",
        currentUser: currentUserType,
        per_page: 10000,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  useEffect(() => {
    if (getId) {
      dispatch(RoleDataEmployee(getId));
    }
    return () => {
      dispatch(clearData());
      dispatch(clearRole());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getId]);
  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success) {
      swal('Success', success, "success");
    }

    return () => { dispatch(clear()) }
  }, [success, error, loading, dispatch]);
  const column = (reducerDispatch, Update, Fetch) => [
    {
      Header: "Employer Name",
      accessor: "employer_name",
    },
    {
      Header: "Operations",
      accessor: "operations",
    },
  ];
  const onEdit = (id, data) => {
    history.push(
      `/update-employee-role/${randomString()}/${Encrypt(
        data.employer_id
      )}/${randomString()}`
    );
  };
  return (
    <>
      <Card
        title={
          <>
            <div className="d-flex justify-content-between">
              <span>
                {props?.employeeRole ? "Employee" : ""}{" "}
                {type[0].toUpperCase() + type.slice(1)}
              </span>
            </div>
          </>
        }
        round
      >
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={<SelectComponent
                label="Employer"
                placeholder='Select Employer'
                options={dropDown.map((item) => ({
                  id: item?.id,
                  label: item?.name,
                  value: item?.id,
                }))}
                id="employer_id"
                required
              />}
              onChange={([e]) => {
                if (e?.value) setGetId(e?.value);
                return e
              }}
              name="employer_id"
              control={control}
            />
          </Col>
        </Row>
        {userData?.data && getId && (
          <DataTable
            columns={column()}
            data={userData?.data || []}
            count={userCount}
            type={type}
            userId={"userId"}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            autoResetPage={false}
            EditFlag
            EditFunc={onEdit}
          />
        )}
      </Card>
      {loading && <Loader />}
    </>
  );
}
