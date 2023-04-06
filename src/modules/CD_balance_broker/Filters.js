import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DivSelect, DivButtonAlign } from "./style";
import {
  // getInsurerDetails,
  // selectInsurerId,
  getPolicyType,
  selectPolicyType,
  getPolicyNumber,
  selectPolicyNumber,
  getPolicyDetails,
  selectEmployerName,
  selectPolicyDetails,
  getEmployerName,
  getCdStatement,
  alertMessage,
  selectAlert,
  clearAlertMessage,
  loadBroker,
  clearPolicyDetails,
  selectCdUpdateDetails,
  employeeCountwrtPremium
} from "./CDB.Slice.js";

import { Button } from "../../components/button/Button";
import Card from "../../components/GlobalCard/Card";
import Input from "../../components/inputs/input/input";
// import SelectBroker from "./SelectBroker";
// import SelectEmployer from "./SelectEmployer"; //Required for Broker.
// import SelectInsurer from "./SelectInsurer";
// import SelectPolicyType from "./SelectPolicyType";
// import SelectPolicyNumber from "./SelectPolicyNumber";
import swal from 'sweetalert';
import { getFirstError } from '../../utils';
import { Select } from "../../components";


const Filters = (props) => {

  //state and selectors
  const dispatch = useDispatch();
  const response = useSelector((state) => state.login);
  const [getPolicyId, setPolicyId] = useState(null); //api
  const [getFromDate, setFromDate] = useState("");
  const [getToDate, setToDate] = useState("");
  const [EmployerId, setEmployerId] = useState(null);

  // let InsurerResponse = useSelector(selectInsurerId);
  const PolicyTypeData = useSelector(selectPolicyType);
  const PolicyTypeNumber = useSelector(selectPolicyNumber);
  const Brokerresponse = useSelector(selectEmployerName);
  const PolicyDetailsResp = useSelector(selectPolicyDetails);
  const UpdateDetails = useSelector(selectCdUpdateDetails);
  const { broker } = useSelector((state) => state.cdBalancebroker);
  const Alertresp = useSelector(selectAlert);

  const { policyData } = useSelector(state => state.approvePolicy);
  const { currentUser } = useSelector(state => state.login);

  //states for respomnses--------------------
  const [brokerResp, setbrokerResp] = useState([]);
  const [policyTypeResp, setpolicyTypeResp] = useState([]);
  const [policyNumResp, setpolicyNumResp] = useState([]);
  const [status, setStatus] = useState(null)

  //-----------------------------------------


  useEffect(() => {
    if (policyData.start_date) {
      setFromDate(policyData.start_date)
    }
    if (policyData.end_date) {
      setToDate(policyData.end_date)
    }
  }, [policyData])

  useEffect(() => {
    if (UpdateDetails?.data?.status === true) {
      const data = {
        policy_id: props.policyNoId,
        to_date: getToDate,
        from_date: getFromDate,
      };
      dispatch(getCdStatement(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateDetails]);


  //api call for broker data -----
  useEffect(() => {
    if (props?.userType === 'admin' && response) {
      dispatch(loadBroker(response.userType))
    }

    return () => {
      setbrokerResp([]);
      setEmployerId(null);
      setpolicyTypeResp([]);
      setpolicyNumResp([]);
      setStatus(null);
      dispatch(clearPolicyDetails())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  useEffect(() => {
    setbrokerResp([]);
    setpolicyTypeResp([]);
    const data = {
      broker_id: response?.currentUser?.broker_id,
    };
    if (response?.currentUser?.broker_id)
      dispatch(getEmployerName(data));
  }, [response, dispatch]);

  const getEmployerId = (e) => {
    setEmployerId(e.target.value);
    setpolicyTypeResp([]);
    if (e.target.value) {
      const data = { employer_id: e.target.value };
      dispatch(getPolicyType(data));
    }
  };

  useEffect(() => {
    let policy_sub_type_id = getPolicyId;
    //api call for policy number
    if (EmployerId && getPolicyId)
      dispatch(getPolicyNumber({
        user_type_name: response?.userType,
        policy_sub_type_id,
        employer_id: EmployerId,
        ...(currentUser?.broker_id && { broker_id: currentUser?.broker_id })
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EmployerId, getPolicyId]);

  const getpolicyDetails = () => {
    if (props?.policyNoId && getFromDate && getToDate) {
      let policy_id = props?.policyNoId;
      let from_date = getFromDate;
      let to_date = getToDate;
      dispatch(getPolicyDetails({ policy_id, from_date, to_date }));
      dispatch(employeeCountwrtPremium({ policy_id: props.policyNoId }))

      const data = {
        policy_id: props?.policyNoId,
        to_date: getToDate,
        from_date: getFromDate,
      };
      dispatch(getCdStatement(data));
      setStatus(1)
    }
    else {
      swal("Please fill all the fields", "", "warning")
    }
  };

  const policyTypeID = (e) => {
    if (e.target.value) {
      const id = e.target.value;
      setPolicyId(id);
    }
  };


  // resetting dropdowns----------------
  useEffect(() => {
    if (Brokerresponse?.data?.data != null) {
      setbrokerResp(Brokerresponse?.data?.data);
    }
  }, [Brokerresponse]);


  useEffect(() => {
    if (PolicyTypeData.data?.data != null) {
      setpolicyTypeResp(PolicyTypeData?.data?.data);
    }
  }, [PolicyTypeData]);

  useEffect(() => {
    if (PolicyTypeNumber.data?.data != null) {
      setpolicyNumResp(PolicyTypeNumber?.data?.data);
    }
  }, [PolicyTypeNumber]);
  //------------------------------------

  //primary alertMessage
  useEffect(() => {
    if (status) {
      if (PolicyDetailsResp?.data?.status === true) {
        swal("Data fetched", "", "success");
        setStatus(null)
      } else {
        let error =
          PolicyDetailsResp?.data?.errors &&
          getFirstError(PolicyDetailsResp?.data?.errors);
        error = error
          ? error
          : PolicyDetailsResp?.data?.message
            ? PolicyDetailsResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setStatus(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PolicyDetailsResp]);

  //secondary alertMessage
  useEffect(() => {
    dispatch(alertMessage())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Alertresp) {
      swal(Alertresp, "", "warning")
    }
    return () => {
      dispatch(clearAlertMessage())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Alertresp])

  const getAdminEmployer = (e) => {
    if (e?.target?.value) {
      dispatch(getEmployerName({ broker_id: e.target.value }));
    }
    return (e)
  }


  return (
    <div>
      <Card
        title="Filters"
        round
        style={{
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {(props?.userType === "admin") &&
          <DivSelect>
            <Select
              label="Broker"
              placeholder="Select Broker"
              required
              options={broker?.map(item => (
                {
                  id: item.id,
                  name: item.name,
                  value: item.id
                }
              )) || []}
              onChange={getAdminEmployer}
            />
          </DivSelect>
        }
        <DivSelect>
          <Select
            label="Employer"
            placeholder="Select Employer"
            required
            options={brokerResp?.map(item => (
              {
                id: item.id,
                name: item.name,
                value: item.id
              }
            )) || []}
            onChange={getEmployerId}
          />
        </DivSelect>
        <DivSelect>
          <Select
            label="Policy type"
            placeholder="Select Policy type"
            required
            options={policyTypeResp?.map(item => (
              {
                id: item.id,
                name: item.name,
                value: item.id
              }
            )) || []}
            onChange={policyTypeID}
          />
        </DivSelect>
        <DivSelect>
          <Select
            label="Policy Number"
            placeholder="Select Policy Number"
            required
            options={policyNumResp?.map(item => (
              {
                id: item.id,
                name: item.policy_no,
                value: item.id
              }
            )) || []}
            onChange={props.getPolicyNumberId}
          />
        </DivSelect>
        <DivSelect>
          <Input
            label="Start Date"
            type="date"
            onChange={(e) => setFromDate(e.target.value)}
            value={getFromDate}
            min={policyData.start_date}
            max={policyData.end_date}
          />
        </DivSelect>
        <DivSelect>
          <Input
            label="End Date"
            type="date"
            onChange={(e) => setToDate(e.target.value)}
            value={getToDate}
            min={policyData.start_date}
            max={policyData.end_date}
          />
        </DivSelect>
        <DivButtonAlign>
          <Button onClick={getpolicyDetails}>Next</Button>
        </DivButtonAlign>
      </Card>
    </div>
  );
};

export default Filters;
