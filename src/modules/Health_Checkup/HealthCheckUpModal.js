import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import "./styleflexmodal.css";
import { useForm } from "react-hook-form";
import classes from "./form.module.css";
import classesone from "./index.module.css";
import _ from "lodash";
import swal from "sweetalert";
import {
  fetchEmployers,
  fetchPolicies,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
  selectPolicySubType,
  getPolicySubTypeData,
} from "modules/EndorsementRequest/EndorsementRequest.slice";
import {
  loadEmployee,
  loadMembers,
  claim,
  clearMembers,
  clearEmployee
} from "modules/claims/claims.slice";
import { getstatecity } from "modules/RFQ/home/home.slice";
import { createHealthCheckup, getHealthCheckupByMember } from "./healthSlice";
import { validationSchema,setDateFormate } from "./helper";
import EmployeeSelectionForm from "./Forms/EmployeeSelectionForm";
import UserDetailsForm from "./Forms/UserDetailsForm";

const HealthCheckUpModal = ({ show, onHide, healthCheckupData }) => {
  const dispatch = useDispatch();
  const [ltemp, setTemp] = useState(0);
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  const { employers, policies,
		firstPage,
		lastPage  } = useSelector(
    (state) => state.networkhospitalbroker
  );
  const { statecity } = useSelector((state) => state.RFQHome);
  const { healthCheckupMemberData } = useSelector(
    (state) => state.HealthCheckup
  );
  const { employee, members } = useSelector(claim);
  let PolicyTypeResponse = useSelector(selectPolicySubType);

  const [releation, setRelation] = useState([]);
  const [tab, setTab] = useState({});
  const [memberData, setMemberData] = useState([]);

  const { control, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema: validationSchema(),
    mode: "onBlur",
  });
  const employerId = watch("employer_id")?.id || currentUser.employer_id;
  const policyTypeID = watch("policy_sub_type_id")?.id;
  const policyID = watch("policy_id")?.id;
  const employeeID = watch("emp_id") || currentUser.employee_id;
  const _member = watch("members");
  const _policySubType = PolicyTypeResponse?.data?.data.filter(
    (item) => item.id === 1
  ); //filter for policy type only -> GMC
  useEffect(() => {
    if (
      typeof _member?.[tab.i] !== "undefined" ||
      !_.isEmpty(healthCheckupMemberData)
    ) {
      if (
        _member?.[tab.i]?.pincode?.length === 6 ||
        String(_member?.[tab.i]?.pincode)?.length === 6 ||
        !_.isEmpty(healthCheckupMemberData)
      ) {
        // alert(JSON.stringify(_member?.[tab.i]?.pincode))
        dispatch(
          getstatecity({
            pincode:
              _member?.[tab.i]?.pincode || healthCheckupMemberData?.pincode,
          })
        );
      }
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_member?.[tab.i]?.pincode, healthCheckupMemberData]);
  useEffect(() => {
    setTemp(ltemp => 0);
    return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (statecity?.length) {
      setValue(`members[${tab.i}].state_id`, statecity[0]?.state_id);
      setValue(`members[${tab.i}].city_id`, statecity[0]?.city_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statecity])
  useEffect(() => {
    if (policies?.length === 1 && _policySubType?.length > 0) {
      setValue("policy_id", policies[0]?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policies])
  useEffect(() => {
    if (_policySubType?.length === 0) {
      dispatch(clearMembers())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_policySubType])
  //get employer
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

  //get policy type id
  useEffect(() => {
    if (currentUser?.employer_id || employerId)
      dispatch(
        getPolicySubTypeData({
          employer_id: currentUser?.employer_id || employerId,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employerId]);

  //get policy id
  useEffect(() => {
    if (policyTypeID && (currentUser?.employer_id || employerId))
      dispatch(
        fetchPolicies({
          user_type_name: userTypeName,
          employer_id: currentUser?.employer_id || employerId,
          policy_sub_type_id: policyTypeID,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyTypeID, employerId]);

  useEffect(() => {
    dispatch(clearEmployee());
    if (
      (userTypeName === "Employer" || userTypeName === "Broker") &&
      employerId &&
      policyID
    ) {
      dispatch(loadEmployee({ employer_id: employerId, policy_id: policyID }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName, employerId, policyID]);
  useEffect(() => {
    setTemp(ltemp => 0);
    dispatch(clearMembers());
    if (employeeID && policyID) {
      setRelation([]);

      if (healthCheckupData?.length) {
        let a = healthCheckupData?.filter(data => (Number(data.policy_id) === Number(policyID) && Number(data.employee_id) === Number(employeeID)));
        if (a.length > 0) {
          setTemp(a.length);
        }
        if (a.length >= 2) {
          swal("Alert", "Health check-up can be booked for any 2 family members only", "warning");
        } else {
          dispatch(loadMembers({ employee_id: employeeID, policy_id: policyID }));
        }
      } else {
        dispatch(loadMembers({ employee_id: employeeID, policy_id: policyID }));
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeID, policyID]);
  useEffect(() => {
    let gateNumber1 = Boolean(Number(ltemp) + Number(releation.length) > 2);
    let gateNumber2 = Boolean(releation.length > 2);
    let gateClosed = Boolean(gateNumber1 || gateNumber2);
    if (gateClosed) {
      swal(
        "Alert",
        "Health check-up can be booked for any 2 family members only",
        "warning"
      ).then(() => {
        const data = releation?.filter(
          (item, index) => index !== releation.length - 1
        );
        setRelation(data);
      })

    }
    if (!_.isEmpty(healthCheckupMemberData) && !gateClosed) {
      if (healthCheckupMemberData.is_checkup_done) {
        let _data = releation?.filter(
          (item) =>
            item.id !== healthCheckupMemberData.employee_member_mapping_id
        );
        setRelation(_data);
        swal(
          "warning",
          "Health checkup alredy approved for this member",
          "warning"
        );
      } else {
        if (!healthCheckupMemberData.is_checkup_done) {
          swal("Found Saved Data, do you want to continue with it ?", {
            buttons: {
              yes: "Yes",
              no: "No",
            },
            closeOnClickOutside: false,
          }).then((value) => {
            if (value === "yes") {
              let _mergeData = memberData?.filter(
                (item) =>
                  item.employee_member_mapping_id !==
                  healthCheckupMemberData.employee_member_mapping_id
              );
              setMemberData([
                ..._mergeData,
                ...[
                  {
                    address_line_1: healthCheckupMemberData.address_line_1,
                    address_line_2: healthCheckupMemberData.address_line_2,
                    alternate_appointment_request_date_time:
                      healthCheckupMemberData.alternate_appointment_request_date_time,
                    appointment_request_date_time:
                      healthCheckupMemberData.appointment_request_date_time,
                    city_id: healthCheckupMemberData.city_id,
                    contact: healthCheckupMemberData.contact,
                    email: healthCheckupMemberData.email,
                    employee_member_mapping_id:
                      healthCheckupMemberData.employee_member_mapping_id,
                    pincode: healthCheckupMemberData.pincode,
                    state_id: healthCheckupMemberData.state_id,
                  },
                ],
              ]);
            } else {
              setMemberData([]);
            }
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthCheckupMemberData]);
  useEffect(() => {
    if (memberData.length) {
      let index = releation.findIndex((x) => x.id === tab.id);
      if (!(releation.length === index + 1)) {
        setTab({
          label: releation[index + 1].label,
          id: releation[index + 1].id,
          i: index + 1,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberData]);
  useEffect(() => {
    if (memberData?.length) {
      const data = memberData.filter(
        (item) => item.employee_member_mapping_id === tab.id
      );
      if (data[0]?.pincode) {
        dispatch(getstatecity({ pincode: data[0].pincode }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const setRelationData = (data) => {
    dispatch(
      getHealthCheckupByMember({
        user_type_name: userTypeName,
        employee_member_mapping_id: data[data.length - 1]?.id,
      })
    );
    setRelation(data);
  };
  
  const onSubmit = (data) => {
    if (_.isEqual(tab.i, 0)) {
      if (_.isEmpty(data?.members[0]?.email)) {
        swal({ title: "Email Requried", icon: "warning" });

        return;
      }

      if (_.isEmpty(data?.members[0]?.contact)) {
        swal({ title: "Mobile Number Requried", icon: "warning" });

        return;
      }
    }
    let _data = [];
    data.members.forEach((item, i) => {
      if (typeof item !== "undefined") {
        let newObj = _.omit(item, "name");
        _data.push({
          ...newObj,
          appointment_request_date_time: setDateFormate(
            item.appointment_request_date_time
          ),
          alternate_appointment_request_date_time: setDateFormate(
            item.alternate_appointment_request_date_time
          ),
        });
      }
    });
    if (tab.i === releation.length - 1) {
      let a = memberData.filter((e) =>
        releation.map((item) => item.id).includes(e.employee_member_mapping_id)
      );
      let b = a?.filter(
        (item) =>
          item.employee_member_mapping_id !==
          _data[0].employee_member_mapping_id
      );
      let _mergeData = [...b, ..._data];
      let g = _mergeData.map((data) => {
        return {
          ...data,
          contact: Boolean(data?.contact?.length === 0) ? null : data?.contact,
          email: Boolean(data?.email?.length === 0) ? null : data?.email,
        };
      });
      dispatch(
        createHealthCheckup({
          user_type_name: userTypeName,
          action: "insert",
          members: g,
        })
      );
    } else {
      let _mergeData = memberData?.filter(
        (item) =>
          item.employee_member_mapping_id !==
          _data[0].employee_member_mapping_id
      );
      setMemberData([..._mergeData, ..._data]);
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <Modal.Body>
        <div
          className={`px-3 py-2 d-flex justify-content-between ${classesone.borderDashed}`}
        >
          <div>
            <p className={`h5 ${classesone.redColor}`}>
              Health Check Up
            </p>
          </div>
          <div onClick={onHide} className={classesone.redColorCross}>
            <i className="fas fa-times"></i>
          </div>
        </div>
        <EmployeeSelectionForm
        currentUser={currentUser}
          handleSubmit={handleSubmit} onSubmit={onSubmit} userTypeName={userTypeName} employers={employers}
          control={control} _policySubType={_policySubType} errors={errors} policies={policies} employee={employee} 
          classes={classes} setRelationData={setRelationData} releation={releation} members={members}
        />
        <UserDetailsForm
          classesone={classesone} releation={releation} tab={tab} setTab={setTab} memberData={memberData} members={members}
          handleSubmit={handleSubmit} onSubmit={onSubmit} errors={errors} control={control} statecity={statecity}
        />
      </Modal.Body>
    </Modal>
  );
};

export default HealthCheckUpModal;
