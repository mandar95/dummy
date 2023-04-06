import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import { Button } from "react-bootstrap";
import {
  columnUser, columnBroker,
  columnEmployee, columnEmployer,
  columnModules, columnRoles,
  columnEmployeeForEmployer, columnInsurer,
  columnTpa
} from './DataTable';
import { Card, Loader, LoaderButton, SelectComponent } from '../../components';
import Select from "./Onboard/Select/Select";
import { Row, Col } from 'react-bootstrap';
import { randomString } from 'utils';
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import {
  getStatusCount, selectUsersData,
  selectUsersStatus, allModules, RoleData,
  getUserDataDropdown, selectdropdownData,
  selectLoading, clearData, loadInsurer,
  clear, selectError, selectSuccess,
  loadInsurerUsers, loadInsurerBrokers,
  loadTPA,
  removeUser,
  removeModule,
  removeRole,
  firstP,
  lastP,
  setPageData,
  getUsersData
} from './user.slice';

import { DateFormate, Encrypt } from '../../utils';
import axios from 'axios';
import { EnrollmentSheetMappping } from './EnrollmentSheetMappping';
import { loadTemplates } from '../EndorsementRequest/EndorsementRequest.slice';
import { DataTable } from '.';
import {
  fetchEmployers,
  setPageData as setPageData1
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
// import DataTablePagination from './DataTablePagination/DataTablePagination';

export default function UserManagement(props) {

  const { currentUser, userType: currentUserType } = useSelector(state => state.login);

  const { userType } = useParams();
  const [userStatus] = useState(1);
  const [getId, setGetId] = useState(null);
  const [modal, setModal] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(selectUsersData);
  const userCount = useSelector(selectUsersStatus);
  const dropDown = useSelector(selectdropdownData);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const loading = useSelector(selectLoading);
  const Fpage = useSelector(firstP);
  const Lpage = useSelector(lastP);
  const type = GetType(props);

  const { control } = useForm();

  const { employers,
    firstPage: firstPage1,
    lastPage: lastPage1, } = useSelector(
      (state) => state.networkhospitalbroker);

  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const _type = query.get("type");
  const employerName = decodeURIComponent(query.get("name") || '');
  const employerId = query.get("id");

  const [employer, setEmployer] = useState(employerName ? {
    label: employerName,
    id: employerId,
    value: employerId
  } : null);

  useEffect(() => {
    return () => {
      dispatch(setPageData1({
        firstPage: 1,
        lastPage: 1,
      }))
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id) && currentUserType !== "Employee") {
      if (lastPage1 >= firstPage1) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage1));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage1, currentUser]);

  useEffect(() => {
    dispatch(loadTemplates())
    if (props.insurer) {
      dispatch(loadInsurer());
    }
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
      dispatch(clearData())

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.module && currentUserType) {
      dispatch(allModules("all", 0, currentUserType, userType === 'broker' && true));
    }
    // if (userType !== 'insurer' && (props.users || props.broker || props.employer || props.employee) && currentUserType) {
    if (userType !== 'insurer' && (props.users || props.broker || props.employer) && currentUserType) {
      // dispatch(getUsersData({ status: userStatus, type, currentUser: currentUserType }));
      dispatch(getStatusCount({ type, currentUser: currentUserType }));
      if (type === 'Employer') {
        dispatch(getUserDataDropdown({ status: 1, type: "Employer", currentUser: currentUserType, per_page: 10000, is_super_hr: currentUser.is_super_hr }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, type, currentUserType]);

  useEffect(() => {
    if (employer?.id || currentUser?.employer_id) {
      if (userType !== 'insurer' && (props.employee) && currentUserType) {
        // dispatch(getUsersData({ status: userStatus, type, currentUser: currentUserType }));
        dispatch(getStatusCount({ type, currentUser: currentUserType, employer_id: employer?.id || currentUser?.employer_id }));
        if (type === 'Employer') {
          dispatch(getUserDataDropdown({ status: 1, type: "Employer", currentUser: currentUserType, per_page: 10000, is_super_hr: currentUser.is_super_hr }))
        }
      }
    }
  }, [userStatus, type, currentUserType, employer])

  useEffect(() => {
    if ((Lpage >= Fpage) && currentUserType) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    let cancelTokenSource = axios.CancelToken.source();
    function _callback() {
      // if (userType !== 'insurer' && (props.users || props.broker || props.employer || props.employee) && currentUserType) {
      if (userType !== 'insurer' && (props.users || props.broker || props.employer) && currentUserType) {
        dispatch(getUsersData({
          status: userStatus, type, currentUser: currentUserType,
          pageNo: Lpage < Fpage ? 1 : Fpage, cancelTokenSource,
          is_super_hr: currentUser.is_super_hr
        }));
      }
    }
    return () => {
      clearTimeout(_TimeOut)
      cancelTokenSource.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Fpage, userStatus, type, currentUserType]);

  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();
    if (employer?.id || currentUser?.employer_id) {
      if (Lpage >= Fpage) {
        var _TimeOut = setTimeout(_callback, 300);
      }
      function _callback() {
        if (userType !== 'insurer' && (props.employee) && currentUserType) {
          dispatch(getUsersData({
            status: userStatus, type, currentUser: currentUserType,
            pageNo: Lpage < Fpage ? 1 : Fpage, cancelTokenSource,
            is_super_hr: currentUser.is_super_hr,
            employer_id: employer?.id || currentUser?.employer_id
          }));
        }
      }
    }
    return () => {
      clearTimeout(_TimeOut)
      cancelTokenSource.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Fpage, employer]);


  useEffect(() => {
    if (props.brokerRole && userType === "admin" && currentUserType) {
      dispatch(getUserDataDropdown({ status: 1, type: "Broker", currentUser: currentUserType, per_page: 10000 }))
    }
    if (props.employerRole && (userType === "admin" || userType === "broker")) {
      dispatch(getUserDataDropdown({ status: 1, type: "Employer", currentUser: currentUserType, per_page: 10000, is_super_hr: currentUser.is_super_hr }))
    }
    if (props.insurerRole && userType === "admin") {
      dispatch(loadInsurer(1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, currentUserType]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
    };

    return () => { dispatch(clear()) }
  }, [success, error, loading, dispatch]);


  const userId = filterUserId(getId, userType, props, currentUser)

  useEffect(() => {
    if (userType === 'insurer' && props.users && userId) {
      dispatch(loadInsurerUsers(userId))
    }
    if (userType === 'insurer' && props.broker && userId) {
      dispatch(loadInsurerBrokers({ ic_id: userId }))
    }
    if (props.tpa && userId) {
      dispatch(loadTPA(userType === 'broker' ? { broker_id: userId } : { ic_id: userId }))
    }

    if (props.brokerRole && userId) {
      dispatch(RoleData(userId, "broker"));
    }
    if (props.employerRole && userId) {
      dispatch(RoleData(userId, "employer"));
    }
    if (props.insurerRole && userId) {
      dispatch(RoleData(userId, "insurer"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const addLink = filterAddLink(props, userType, userId, props.myModule);
  const onboardLink = filterOnboardLink(props, userType, props.myModule);
  const editLink = filterEditLink(props, userType, props.myModule);
  const viewLink = filterViewLink(props, userType);
  const deleteFlag = ((userType !== 'insurer' && props.users) && true) ||
    (props.module && userType === 'admin' && true) ||
    (props.brokerRole && true) ||
    (props.employerRole && true) ||
    (props.insurerRole && true);

  const updateUserStatus = (status) => {
    // setUserStatus(status)
  }
  const _changeEnrollmentSheet = (data) => {
    return (<Button
      size="sm"
      variant={'outline-success'}
      className='shadow'
      style={{ whiteSpace: 'nowrap' }}
      onClick={() => setModal({ employer_id: data.row.original.id, sheet_data: data.row.original.employery_custom_upload_template })}>
      Custom Sheet Mapping <i className="ti-pencil-alt" />
    </Button>)

  }

  const column = (props.users &&
    columnUser((props.myModule?.candelete && userStatus !== 2) ? true : false, userType === 'insurer', userData?.data?.some(({ last_login_at }) => last_login_at))) ||
    (props.broker && columnBroker) ||
    (props.employer && columnEmployer(true, userType, _changeEnrollmentSheet)) ||
    (props.employee && ((userType === "employer" || userType === "") ? columnEmployeeForEmployer(false, true) : columnEmployee)) ||
    (props.module && columnModules(userType === "admin")) ||
    ((props.brokerRole || props.employerRole) && columnRoles((props.myModule?.candelete || props.myModule?.canwrite) ? true : false)) ||
    (props.insurer && columnInsurer) ||
    (props.insurerRole && columnRoles((props.myModule?.candelete || props.myModule?.canwrite) ? true : false, true)) ||
    (props.tpa && columnTpa(userType === 'admin'));
  // ((props.lives || props.dependent) && columnLives());


  const own = (props.employerRole && (userType === 'employer')) ||
    (props.brokerRole && (userType === 'broker')) ||
    (props.insurerRole && (userType === 'insurer'))


  const noStatus = userType === 'insurer' || props.insurerRole ||
    props.insurer || props.tpa || (userType === 'employer' && props.employer);

  const onDelete = (id) => {
    if (props.users) {
      dispatch(removeUser(id, { status: userStatus, type, currentUser: currentUserType }));
    }
    if (props.module) {
      dispatch(removeModule(id, currentUserType));
    }
    if (props.brokerRole) {
      dispatch(removeRole(id, 'broker', userId));
    }
    if (props.employerRole) {
      dispatch(removeRole(id, 'employer', userId));
    }
    if (props.insurerRole) {
      dispatch(removeRole(id, 'insurer', userId));
    }

  }

  return (
    <>
      <Card title={
        <div className="d-flex justify-content-between">
          <span>{type[0].toUpperCase() + type.slice(1)}</span>
          <div className="d-flex justify-content-end flex-wrap">
            {!(Fpage > Lpage) && (userType !== 'insurer' && (props.users || props.broker || props.employer || props.employee) && currentUserType) &&
              <LoaderButton percentage={(Fpage - 1) * 100 / Lpage} />}
            {((["Broker", "Employer", "Insurer"].includes(type)) && !!onboardLink) &&
              <Link to={onboardLink}><Button size="sm" className="shadow-sm m-1 rounded-lg" variant="primary">
                <strong>Onboard {type} +</strong>
              </Button></Link>}
            {((userId || userType === "admin") && /*userData?.data &&*/ (type !== 'Employee' && !!addLink)) &&
              <Link to={addLink}><Button size="sm" className="shadow-sm m-1 rounded-lg" variant="primary">
                <strong>Add {type} {['Broker', 'Employer', 'Insurer'].includes(type) && 'User '}+</strong>
              </Button></Link>
            }
          </div>
        </div>
      } round>
        {(props.brokerRole || props.employerRole || props.insurerRole) && (
          <Row className="d-flex flex-wrap">
            {(props.brokerRole && userType === "admin") &&
              <Col md={6} lg={6} xl={4} sm={12}>
                <Select
                  label={"Brokers"}
                  option={dropDown}
                  id="drop"
                  valueName="name"
                  onChange={(data) => { if (data) setGetId(data) }}
                />
              </Col>
            }
            {(props.employerRole && (userType !== "employer" && userType !== "")) &&
              <Col md={6} lg={6} xl={4} sm={12}>
                {
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
                  />}
              </Col>
            }
            {(props.insurerRole && userType === "admin") &&
              <Col md={6} lg={6} xl={4} sm={12}>
                <Select
                  label={"Insurers"}
                  option={dropDown}
                  id="drop"
                  valueName="name"
                  onChange={(data) => { if (data) setGetId(data) }}
                />
              </Col>
            }
          </Row>
        )}
        {((userType === "broker" || userType === "admin") && (props.employee)) &&
          <Col md={12} lg={4} xl={3} sm={12} style={{ zIndex: 4 }}>
            <SelectComponent
              label="Employer"
              placeholder='Select Employer'
              options={[{
                id: -1,
                label: 'All',
                value: -1
              }, ...employers.map((item) => ({
                id: item?.id,
                label: item?.name,
                value: item?.id
              }))]}
              value={employer}
              id="employer_id"
              required
              onChange={(e) => {
                history.replace(`user-management-employee?name=${encodeURIComponent(e.label)}&id=${e.id}${_type ? `&type=${_type}` : ''}`)
                // setUCCPageData(reducerDispatch, {
                //   current_page: 1,
                //   last_page: 1,
                // })
                dispatch(setPageData({
                  firstPage: 1,
                  lastPage: 1
                }))
                setEmployer(e); return e
              }}
              name="employer_id"
            />
          </Col>}
        {
        /* (props.users || props.broker || props.employer || props.employee) ?
          <DataTablePagination
            columns={column}
            count={userCount}
            type={type}
            // noStatus={noStatus}
            editLink={props.myModule?.canwrite ? editLink : false}
            viewLink={viewLink}
            deleteFlag={props.myModule?.candelete && deleteFlag ? 'custom_delete_action' : false}
            removeAction={props.myModule?.candelete && deleteFlag ? onDelete : false}
            userId={userId}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            autoResetPage={false}
            // userStatus={(status) => updateUserStatus(status)}
            API={service.getUserDataPagination}
            ApiPayload={{ status: userStatus, type, currentUser: currentUserType }}
          /> : */ ((type !== 'Role') ?
            <>{(userData?.data?.length) && <DataTable
              columns={column}
              data={userData?.data?.map((elem) => ({ ...elem, onboarded_at: DateFormate(elem.onboarded_at), last_login_at: DateFormate(elem.last_login_at, { type: 'withTime' }) })) || []}
              count={userCount}
              type={type}
              noStatus={noStatus}
              editLink={props.myModule?.canwrite ? editLink : false}
              viewLink={viewLink}
              deleteFlag={props.myModule?.candelete && deleteFlag ? 'custom_delete_action' : false}
              removeAction={props.myModule?.candelete && deleteFlag ? onDelete : false}
              userId={userId}
              pageState={{ pageIndex: 0, pageSize: 5 }}
              pageSizeOptions={[5, 10, 20, 25, 50, 100]}
              autoResetPage={false}
              userStatus={(status) => updateUserStatus(status)} />}</> :
            (userData?.data && !loading && type === 'Role') ?
              <DataTable
                columns={column}
                data={userData?.data || []}
                count={userCount}
                type={type}
                noStatus={noStatus}
                editLink={props.myModule?.canwrite ? editLink : false}
                viewLink={viewLink}
                deleteFlag={props.myModule?.candelete && deleteFlag ? 'custom_delete_action' : false}
                removeAction={props.myModule?.candelete && deleteFlag ? onDelete : false}
                userId={userId}
                own={own}
                deleteLimit={own ? 1 : 0}
                userStatus={(status) => updateUserStatus(status)} /> : "")
        }

      </Card>
      {(loading) && <Loader />}
      {!!modal && <EnrollmentSheetMappping data={modal} show={!!modal} onHide={() => setModal(false)} />}
    </>
  );

}

const filterAddLink = (props, userType, userId, myModule) => {
  let link = "";
  if (!myModule?.canwrite) return link;
  switch (userType) {
    case "admin":
      link = (props.users && "/admin-create-user") ||
        (props.broker && "/admin-create-broker") ||
        (props.employer && "/admin-create-employer") ||
        (props.module && "/create-module") ||
        (props.brokerRole && `/create-broker-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.employerRole && `/create-employer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.insurer && '/admin-create-insurer') ||
        (props.insurerRole && `/create-insurer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.tpa && "/add-tpa");
      break;
    case "broker":
      link = (props.users && "/broker-create-user") ||
        (props.employer && "/broker-create-employer") ||
        (props.brokerRole && `/create-broker-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.employerRole && `/create-employer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.tpa && "/add-tpa");
      break;
    case "employer":
      link = (props.users && "/employer-create-user") ||
        (props.employerRole && `/create-employer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`);
      break;
    case 'insurer':
      link = (props.users && '/insurer-create-user') ||
        (props.insurerRole && `/create-insurer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`) ||
        (props.tpa && "/add-tpa");
      break;
    case "":
      link = (props.users && "/employer-create-user") ||
        (props.employerRole && `/create-employer-role/${randomString()}/${Encrypt(userId)}/${randomString()}`);
      break;

    default: link = ""
  }
  return link;
}

const filterOnboardLink = (props, userType, myModule) => {
  let link = "";
  if (!myModule?.canwrite) return link;
  switch (userType) {
    case "admin":
      link = (props.broker && "/onboard-broker") ||
        (props.employer && "/onboard-employer") ||
        (props.insurer && '/onboard-insurer');
      break;
    case "broker":
      link = (props.employer && "/onboard-employer");
      break;
    case "insurer":
      link = (props.broker && "/onboard-broker");
      break;

    default: link = ""
  }
  return link;
}

const filterEditLink = (props, userType, myModule) => {
  let link = "";
  if (!myModule?.canwrite) return link;
  switch (userType) {
    case "admin":
      link = (props.users && "/admin-update-user") ||
        (props.module && "/update-module") ||
        (props.brokerRole && "/update-broker-role") ||
        (props.employerRole && "/update-employer-role") ||
        (props.insurerRole && '/update-insurer-role');
      break;
    case "broker":
      link = (props.users && "/broker-update-user") ||
        (props.brokerRole && "/update-broker-role") ||
        (props.module && "/update-module") ||
        (props.employerRole && "/update-employer-role");
      break;
    case "employer":
      link = (props.users && "/employer-update-user") ||
        (props.employerRole && "/update-employer-role");
      break;
    case "insurer":
      link = (props.users && "/insurer-update-user") ||
        (props.insurerRole && '/update-insurer-role');
      break;
    case "":
      link = (props.employerRole && "/update-employer-role");
      break;

    default: link = ""
  }
  return link;
}

const filterViewLink = (props, userType) => {
  let link = "";
  switch (userType) {
    case "admin":
      link = (props.broker && "/broker-view") ||
        (props.employer && "/employer-view") ||
        (props.employee && "/employee-view") ||
        (props.insurer && "/insurer-view");
      break;
    case "broker":
      link = (props.employer && "/employer-view") ||
        (props.employee && "/employee-view");
      break;
    case "employer":
      link = (props.employer && "/employer-view") ||
        (props.employee && "/employee-view")
      break;
    case "insurer":
      link = (props.broker && "/broker-view")
      break;

    default: link = ""
  }
  return link;
}

const filterUserId = (getId, userType, props, currentUser) => {
  return getId ||
    ((userType === "broker" && (props.brokerRole || props.users || props.employer || props.tpa)) && currentUser?.broker_id) ||
    ((userType === "employer" && (props.employerRole || props.users)) && currentUser?.employer_id) ||
    ((userType === "insurer" && (props.insurerRole || props.users || props.broker || props.tpa)) && currentUser?.ic_id) || null;
}

const GetType = (props) => {

  return (props.users && "users") ||
    (props.broker && "Broker") ||
    (props.employer && "Employer") ||
    (props.employee && "Employee") ||
    (props.module && "Module") ||
    (props.brokerRole && "Role") ||
    (props.employerRole && "Role") ||
    (props.insurer && 'Insurer') ||
    (props.insurerRole && 'Role') ||
    (props.tpa && 'TPA');
  // (props.lives && 'Active Lives') ||
  // (props.dependent && 'Active Dependent Lives');

}
