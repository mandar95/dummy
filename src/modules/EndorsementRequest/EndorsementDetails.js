import React, { useEffect, useState } from "react";
import _ from "lodash";
import swal from "sweetalert";

import { Controller, useForm } from "react-hook-form";
import { Card, Select, NoDataFound, Loader } from "components";
import { Button, ButtonGroup, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { DataTable } from "modules/user-management";
import { getEndorsementDetails, endorsedMemberApproveReject, clear } from "./EndorsementRequest.slice";
import { EditMember } from "../enrollment/Steps/Dependency/EditMember.js";
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";


import { TableData } from "./helper.js";
import { useDispatch, useSelector } from "react-redux";
import { enrollment, loadFlex, loadMember, loadRelations, clear as clear_member } from "../enrollment/enrollment.slice.js";
import { SelectComponent } from "../../components";
import { useParams } from "react-router";

const _Types = [{ id: 0, value: 0, name: 'All' },
{ id: 1, value: 1, name: 'Approved' },
// { id: 2, value: 2, name: 'Defiency Raised' },
// { id: 3, value: 3, name: 'Deficiency resolved' },
{ id: 4, value: 4, name: 'Rejected' }]


export const EndorsementDetail = ({ myModule }) => {

  const dispatch = useDispatch();
  // const [activeHandleShow, setActiveHandleShow] = useState(false);
  // const [activeHandleData, setActiveHandleData] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [employerId, setEmployerId] = useState();

  const { EndorsementDetails, endorsedMemberSuccess, loading, error, success } = useSelector((state) => state.endorsementRequest);
  const { member_option, flex, relations,
    loading: loading_member, error: error_member, success: success_member } = useSelector(enrollment);
  const { userType } = useParams();
  const { userType: userTypeName, currentUser } = useSelector(state => state.login)
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const { control, watch } = useForm({});
  let _typeid = watch('typeid');


  useEffect(() => {

    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userTypeName === 'Employer')
      dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr))
    if (userTypeName === 'Broker' && _typeid)
      dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr, employerId?.value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_typeid, userTypeName])

  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (endorsedMemberSuccess) {
      swal('Success', endorsedMemberSuccess, "success").then(() => {
        dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr, employerId?.value))
      })
    }
    return () => {
      dispatch(clear('endorsedMemberSuccess'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endorsedMemberSuccess])

  useEffect(() => {
    if (editModal.policy_id && editModal.employee_id) {
      dispatch(loadRelations(editModal.policy_id));
      dispatch(loadFlex(editModal.policy_id));
      dispatch(loadMember(editModal.policy_id, editModal.employee_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModal])

  useEffect(() => {
    if (error) {
      swal(error, "", "warning");
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!loading_member && error_member) {
      swal("Alert", error_member, "warning");
    };
    if (!loading_member && success_member) {
      swal('Success', success_member, "success");
      dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr, employerId?.value))
    };

    return () => { dispatch(clear_member()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success_member, error_member, loading_member]);


  //onSuccess
  useEffect(() => {
    if (success) {
      swal(success, "", "success").then(() => {
        dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr, employerId?.value))
      });

    }
    // setActiveHandleShow(false);
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);


  const _renderAction = ({ row }) => {

    const Status = userTypeName === 'Broker' ? row?.original?.broker_verification_status : row?.original?.employer_verification_status

    return (
      <ButtonGroup
        size="sm">
        {Status !== 'Approved' && <OverlayTrigger
          placement="top"
          overlay={<Tooltip><strong>Approve</strong></Tooltip>}>
          <Button
            disabled={false}
            variant={"primary"}
            size="sm"
            onClick={() => {
              swal({
                title: "Alert",
                text: "Approve Member Data or Status",
                icon: "warning",
                buttons: {
                  cancel: "Cancel",
                  catch: {
                    text: "Approve Member!",
                    value: "update",
                  },
                },
                dangerMode: true,
              })
                .then((caseValue) => {
                  switch (caseValue) {
                    case "update":
                      dispatch(endorsedMemberApproveReject({
                        member_id: row?.original?.id,
                        ...userType === 'broker' ?
                          { broker_verification_status: 1 } :
                          { employer_verification_status: 1 }
                      }))
                      break;
                    default:
                  }
                })
            }}>
            <i className="ti-check"></i>
          </Button>
        </OverlayTrigger>}
        {Status !== 'Rejected' && <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Reject</strong>
          </Tooltip>}>
          <Button
            disabled={false}
            variant={"danger"}
            size="sm"
            onClick={() => {
              swal({
                title: "Alert",
                text: "Reject Member Data or Status",
                icon: "warning",
                buttons: {
                  cancel: "Cancel",
                  catch: {
                    text: "Reject Member!",
                    value: "update",
                  },
                  //inactive: true
                },
                dangerMode: true,
              })
                .then((caseValue) => {
                  switch (caseValue) {
                    case "update":
                      dispatch(endorsedMemberApproveReject({
                        member_id: row?.original?.id,
                        ...userType === 'broker' ?
                          { broker_verification_status: 4 } :
                          { employer_verification_status: 4 }
                      }))
                      break;
                    default:
                  }
                })
            }}>
            <i className="ti-close"></i>
          </Button>
        </OverlayTrigger>}
        {/* <OverlayTrigger
            placement="top"
            overlay={<Tooltip>
              <strong>Deficiency</strong>
            </Tooltip>}>
            <Button
              size="sm" variant={"secondary"}
              onClick={() => ActiveHandlefn(row.original)}>
              <i className="ti-hand-point-up" />
            </Button>
          </OverlayTrigger> */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Edit Member</strong>
          </Tooltip>}>
          <Button
            size="sm" variant={"warning"}
            onClick={() => setEditModal(row.original)}>
            <i className="ti-pencil-alt" />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }



  // const ActiveHandlefn = (data) => {
  //   if (!_.isEmpty(data)) {
  //     setActiveHandleData(data);
  //     setActiveHandleShow(true);
  //   }
  // }


  return (
    <>

      <Card title={<div className="d-flex justify-content-between flex-wrap">
        <span>Member Verification</span>
        <div style={{ width: '180px' }}>
          <Controller
            as={
              <Select
                label={"Status"}
                placeholder={"Select Status"}
                options={_Types}
                isRequired={false}
                required={false}
              />
            }
            defaultValue={0}
            control={control}
            name={"typeid"}
          />
        </div>
      </div>}>

        {['broker'].includes(userType) &&
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={4} xl={4} sm={12}>
              <SelectComponent
                label="Employer"
                placeholder="Select Employer"
                required={false}
                isRequired
                options={employers?.map((item) => ({
                  id: item?.id,
                  label: item?.name,
                  value: item?.id,
                })) || []}
                value={employerId}
                name="employer_id"
                onChange={(e) => {
                  if (e?.value) {
                    dispatch(getEndorsementDetails(_typeid || 0, userTypeName, currentUser.is_super_hr, e?.value))
                  }
                  setEmployerId(e)
                  return e;
                }}
              />
            </Col>
          </Row>}
        {!_.isEmpty(EndorsementDetails) ? (
          <DataTable
            columns={TableData(_renderAction, myModule)}
            data={EndorsementDetails}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
          />
        ) : (<NoDataFound text='No Member Data Found' />)}
      </Card>
      {/* <ActiveHandle
            show={activeHandleShow}
            onHide={() => setActiveHandleShow(false)}
            Data={activeHandleData}
            userType={userType} /> */}
      {!!editModal &&
        <EditMember
          relations={relations}
          // savedConfig={savedConfig}
          policy_id={editModal.policy_id}
          flex={flex}
          Data={editModal}
          show={!!editModal}
          member_option={member_option}
          onHide={() => setEditModal(false)}
        />}
      {(loading_member || loading) && <Loader />}
    </>
  );
};
