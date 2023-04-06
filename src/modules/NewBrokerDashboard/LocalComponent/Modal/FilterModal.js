import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { format } from 'date-fns'
import * as yup from "yup";
// import _ from "lodash";

import { IconlessCard, SelectComponent, Error, Button, DatePicker } from "components";
import {
  fetchBrokers,
  fetchEmployers,
  setPageData, clearDD, fetchPolicies, getPolicies
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { DateFormate } from "utils";
import {
  clearOldDataOnNewSubmit, setPagination, GetAllEmailLogs, /* GetStates, */ GetEmployers, /* GetWidgetsData, */
  GetQueriesCount, GetEndorsementCount, GetAllClaimCount, GetEnrolmentInProgress, GetLiveCaselessClaim,
  /* GetPolicyDetails, */ setShowingPolicyNumberOrName, setOnSearchData
} from "../../newbrokerDashboard.slice";
import DataTable from "modules/user-management/DataTable/DataTable";
import classesone from "modules/Health_Checkup/index.module.css";
import "modules/Health_Checkup/index.module.css";
import { requiredField, TableData } from "./helper";
import {
  clear as policyTypeClear
} from "modules/EndorsementRequest/EndorsementRequest.slice";

const schema = (show) => yup.object().shape({
  employer_id: requiredField(show, "employer_id"),
  from_date: requiredField(show, "from_date"),
  to_date: requiredField(show, "to_date"),
  insurer_id: requiredField(show, "insurer_id"),
  tpa_id: requiredField(show, "tpa_id"),
});

const FilterModal = ({ show, onHide, loadDefault }) => {
  const dispatch = useDispatch();
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  const { emailLogDetails, insurer, tpa,
    policySubType, employerDropdownData } = useSelector(state => state.NewBrokerDashboard);
  const { employers,
    firstPage,
    lastPage, policies } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { control, errors, handleSubmit, watch, reset, setValue } = useForm({
    validationSchema: schema(show),
    mode: "onBlur",
  });

  // const brokerId = (watch("broker_id") || {})?.id;

  const from_date = watch('from_date') || '';

  const employerId = (watch("employer_id") || {})?.id;
  const policyTypeID = (watch("policy_sub_type_id") || {})?.id;

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
      dispatch(setPagination({
        firstPage: 1,
        lastPage: 1,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userTypeName === "Admin" || userTypeName === "Super Admin") {
      dispatch(fetchBrokers(userTypeName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);

  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))

      dispatch(clearDD('employer'))
      dispatch(clearDD('policyST'))
      dispatch(clearDD('policy'))
      dispatch(policyTypeClear('broker'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id && userTypeName === "Broker")) {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    } else if (userTypeName === "Employer" && !!currentUser?.is_super_hr) {
      dispatch(GetEmployers({
        currentUser: userTypeName,
        is_super_hr: currentUser.is_super_hr
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  //get policy type id
  // useEffect(() => {
  //     if (currentUser?.employer_id || employerId) {
  //         dispatch(
  //             getPolicySubTypeData({
  //                 employer_id: currentUser?.employer_id || employerId,
  //             })
  //         );
  //         return () => {
  //             dispatch(clearDD('policy'))
  //         }
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser, employerId]);
  useEffect(() => {
    if(employerId) {
        setValue("policy_sub_type_id","");
        setValue("policy_id","");
        dispatch(getPolicies([]));
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[employerId]);

  //get policy id
  useEffect(() => {
    if (policyTypeID && (employerId || currentUser?.employer_id)) {
      dispatch(
        fetchPolicies({
          user_type_name: userTypeName,
          employer_id: employerId || currentUser?.employer_id,
          policy_sub_type_id: policyTypeID,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        }, true)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyTypeID]);

  const onSubmit = (data) => {
    if (!!data?.employer_id?.id) {
      dispatch(setShowingPolicyNumberOrName(true));
    } else {
      dispatch(setShowingPolicyNumberOrName(false));
    }
    dispatch(clearOldDataOnNewSubmit());
    if (!!data?.employer_id?.id || !!data?.insurer_id?.id ||
      !!data?.tpa_id?.id || !!data?.policy_sub_type_id?.id || !!data?.policy_id?.id
      || !!data?.from_date || !!data?.to_date) {
      data = {
        broker_id: currentUser?.broker_id,
        is_child_company: Number(!!data?.employer_id?.id && (!!currentUser?.is_super_hr || userTypeName === "Broker")),
        // ...(!!data?.employer_id?.id && (!!currentUser?.is_super_hr || userTypeName === "Broker")
        //      && { is_child_company: 1 }),
        ...(!!data?.from_date && { from_date: data?.from_date }),
        ...(!!data?.to_date && { to_date: data?.to_date }),
        ...(!!data?.employer_id?.id && { employer_id: [data?.employer_id?.id] }),
        ...(!!data?.insurer_id?.id && { insurer_id: data?.insurer_id?.id }),
        ...(!!data?.tpa_id?.id && { tpa_id: data?.tpa_id?.id }),
        ...((!!data?.policy_sub_type_id?.id && +data?.policy_sub_type_id?.id !== 999) && { policy_sub_type_id: data?.policy_sub_type_id?.id }),
        ...(!!data?.policy_id?.id && { policy_id: [data?.policy_id?.id] }),
        ...(userTypeName === "Employer" && {
          is_employer: true,
          ...((show === "Global" || !data?.employer_id?.id) && { is_super_hr: currentUser?.is_super_hr }),
          ...((!data?.employer_id?.id) && { employer_id: [currentUser?.employer_id] }),
        })
      };
      dispatch(setOnSearchData({data, show}));
      // if (show === "Communication") {
      //   dispatch(GetAllEmailLogs(data));
      // } else if (show === "Queries") {
      //   dispatch(GetQueriesCount(data));
      // } else if (show === "Endorsement") {
      //   dispatch(GetEndorsementCount(data));
      // } else if (show === "All Claims") {
      //   dispatch(GetAllClaimCount(data));
      // } else if (show === "Enrolment In Progress") {
      //   dispatch(GetEnrolmentInProgress(data));
      // } else if (show === "Live Cashless Claims") {
      //   dispatch(GetLiveCaselessClaim(data));
      // } else if (show === "Global") {
      //   dispatch(GetWidgetsData(
      //     data
      //   ));
      //   dispatch(GetQueriesCount(
      //     data
      //   ));
      //   dispatch(GetEndorsementCount(
      //     data
      //   ));
      //   dispatch(GetAllEmailLogs(
      //     data
      //   ));
      //   dispatch(GetAllClaimCount(
      //     data
      //   ));
      //   dispatch(GetEnrolmentInProgress(
      //     data
      //   ));
      //   dispatch(GetLiveCaselessClaim(
      //     data
      //   ));
      //   dispatch(GetStates(
      //     data
      //   ));
      //   dispatch(GetPolicyDetails(
      //     data
      //   ));
      // }
      onHide();
    }

  };

  const ResetForm = () => {
    const data = {
      broker_id: currentUser?.broker_id,
      is_child_company: 0,
      policy_sub_type_id: 1,
      ...(userTypeName === "Employer" && {
          is_employer: true,
          is_super_hr: currentUser?.is_super_hr,
          employer_id: [currentUser?.employer_id]
      })
  }
    dispatch(clearOldDataOnNewSubmit());
    reset({
      from_date: "",
      to_date: "",
      master_system_trigger_id: "",
      employer_id: "",
      policy_id: "",
      log_type: "",
      policy_sub_type_id: "",
      insurer_id: "",
      tpa_id: "",
    });
    if (show === "Communication") {
      dispatch(GetAllEmailLogs(data));
    } else if (show === "Queries") {
      dispatch(GetQueriesCount(data));
    } else if (show === "Endorsement") {
      dispatch(GetEndorsementCount(data));
    } else if (show === "All Claims") {
      dispatch(GetAllClaimCount(data));
    } else if (show === "Enrolment In Progress") {
      dispatch(GetEnrolmentInProgress(data));
    } else if (show === "Live Cashless Claims") {
      dispatch(GetLiveCaselessClaim(data));
    } else if (show === "Global") {
      loadDefault();
    }
    onHide();
  }

  return (
    <Modal
      size="lg"
      show={!!show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="special_modalasdsa_flex"
    >
      <Modal.Body>
        <>
          <div
            className={`px-3 py-2 d-flex justify-content-between ${classesone.borderDashed}`}
          >
            <div>
              <p className={`h5 font-weight-bold`}>
                {show} Filter
              </p>
            </div>
            <div onClick={onHide} className={classesone.redColorCross}>
              <i className="fas fa-times"></i>
            </div>
          </div>
          <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              {(userTypeName === "Admin" ||
                userTypeName === "Super Admin" ||
                userTypeName === "Broker") && ["All Claims", "Live Cashless Claims", "Global"].includes(show) && (
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                      as={
                        <SelectComponent
                          label="TPA"
                          placeholder="Select TPA"
                          required={false}
                          isRequired={!["All Claims", "Live Cashless Claims", "Global"].includes(show)}
                          options={tpa || []}
                          error={errors && errors?.tpa_id}
                        />
                      }
                      name="tpa_id"
                      control={control}
                      defaultValue={""}
                    />
                    {!!errors?.tpa_id && <Error>{errors?.tpa_id?.message}</Error>}
                  </Col>
                )}
              {(userTypeName === "Admin" ||
                userTypeName === "Super Admin" ||
                userTypeName === "Broker") && ["All Claims", "Live Cashless Claims", "Global"].includes(show) && (
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                      as={
                        <SelectComponent
                          label="Insurer"
                          placeholder="Select Insurer"
                          required={false}
                          isRequired={!["All Claims", "Live Cashless Claims", "Global"].includes(show)}
                          options={insurer || []}
                          error={errors && errors?.insurer_id}
                        />
                      }
                      name="insurer_id"
                      control={control}
                      defaultValue={""}
                    />
                    {!!errors?.insurer_id && <Error>{errors?.insurer_id?.message}</Error>}
                  </Col>
                )}
              {(userTypeName === "Admin" ||
                userTypeName === "Super Admin" ||
                userTypeName === "Broker" || !!currentUser?.is_super_hr) && (
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                      as={
                        <SelectComponent
                          label="Employer"
                          placeholder="Select Employer"
                          required={false}
                          isRequired={!["All Claims", "Enrolment In Progress", "Live Cashless Claims", "Global"].includes(show)}
                          options={[...employerDropdownData, ...employers]?.map((item) => ({
                            id: item?.id,
                            label: item?.name,
                            value: item?.id,
                          })) || []}
                          error={errors && errors?.employer_id}
                        />
                      }
                      name="employer_id"
                      control={control}
                      defaultValue={""}
                    />
                    {!!errors?.employer_id && <Error>{errors?.employer_id?.message}</Error>}
                  </Col>
                )}
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label={"Cover Type"}
                      placeholder={"Cover Type"}
                      options={policySubType?.map((item) => ({
                        id: item?.policy_sub_type_id,
                        label: item?.policy_sub_type,
                        value: item?.policy_sub_type_id,
                      })) || []}
                      required={false}
                    />
                  }
                  name="policy_sub_type_id"
                  control={control}
                  defaultValue={""}
                />
              </Col>
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      selectType="new"
                      label={"Policy Name"}
                      placeholder={"Policy Name"}
                      options={policies?.map((item) => ({
                        id: item?.id,
                        label: item?.number,
                        value: item?.id,
                      })) || []}
                      required={false}
                    />
                  }
                  name="policy_id"
                  control={control}
                  defaultValue={""}
                />
              </Col>
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <DatePicker
                      minDate={new Date(DateFormate(/* policy.start_date || */ '01-01-1900', { dateFormate: true }))}
                      maxDate={new Date(DateFormate(/* to_date || policy.end_date || */ '01-01-2200', { dateFormate: true }))}
                      name={'from_date'}
                      label={'Date Range From'}
                      required={false}
                      isRequired={!["All Claims", "Enrolment In Progress", "Live Cashless Claims", "Global"].includes(show)}
                      error={errors && errors?.from_date}
                    />
                  }
                  onChange={([selected]) => {
                    setValue('to_date', '')
                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="from_date"
                  control={control}
                />
                {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
              </Col>
              <Col xl={4} lg={4} md={6} sm={12}>
                <Controller
                  as={
                    <DatePicker
                      minDate={new Date(DateFormate(from_date || /* policy.start_date || */ '01-01-1900', { dateFormate: true }))}
                      maxDate={new Date(DateFormate(/* policy.end_date || */ '01-01-2200', { dateFormate: true }))}
                      name={'to_date'}
                      label={'Date Range To'}
                      required={false}
                      isRequired={!["All Claims", "Enrolment In Progress", "Live Cashless Claims", "Global"].includes(show)}
                      error={errors && errors?.to_date}
                    />
                  }
                  onChange={([selected]) => {
                    return selected ? format(selected, 'dd-MM-yyyy') : '';
                  }}
                  name="to_date"
                  control={control}
                />
                {!!errors?.to_date && <Error>{errors?.to_date?.message}</Error>}
              </Col>
            </Row>
            <Row className="justify-content-end">
              <div className="mx-2">
                <Button buttonStyle="warning" type="reset" onClick={ResetForm}>Reset</Button>
              </div>
              <div className="mr-3">
                <Button type="submit">Filter</Button>
              </div>
            </Row>
          </form>
          {!!emailLogDetails?.length && <IconlessCard title={"Email Communication Table"}>
            <DataTable
              columns={TableData()}
              data={emailLogDetails}
              noStatus={true}
              pageState={{ pageIndex: 0, pageSize: 5 }}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              autoResetPage={false}
            />
          </IconlessCard>}
        </>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;
