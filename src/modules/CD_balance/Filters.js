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
  getCdStatement,
  selectPolicyDetails,
  alertMessage,
  selectAlert,
  clearAlertMessage,
  selectCdUpdateDetails,
} from "./CD.Slice.js";

import { Button } from "../../components/button/Button";
import Card from "../../components/GlobalCard/Card";
import Input from "../../components/inputs/input/input";
// import SelectEmployer from "./SelectEmployer";  //Required for Broker.
// import SelectInsurer from "./SelectInsurer";
// import SelectPolicyType from "./SelectPolicyType";
// import SelectPolicyNumber from "./SelectPolicyNumber";
import swal from "sweetalert";
import { getFirstError } from "../../utils";
import { employeeCountwrtPremium } from "../CD_balance_broker/CDB.Slice";
import { Select } from "../../components";

const Filters = (props) => {

  //state and selectors
  const dispatch = useDispatch();
  const [getPolicyId, setPolicyId] = useState(null); //api
  const [getFromDate, setFromDate] = useState("");
  const [getToDate, setToDate] = useState("");
  // const InsurerResponse = useSelector(selectInsurerId);
  const PolicyTypeData = useSelector(selectPolicyType);
  const PolicyTypeNumber = useSelector(selectPolicyNumber);
  const PolicyDetailsResp = useSelector(selectPolicyDetails);
  const UpdateDetails = useSelector(selectCdUpdateDetails);
  const Alertresp = useSelector(selectAlert);
  const { userType } = useSelector((state) => state.login);

  const { policyData } = useSelector(state => state.approvePolicy);

  //states for respomnses--------------------
  // const [insurerResp, setinsurerResp] = useState([]);
  const [policyTypeResp, setpolicyTypeResp] = useState([]);
  const [policyNumResp, setpolicyNumResp] = useState([]);
  const [status, setStatus] = useState(null);

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

  useEffect(() => {
    //resetting dropdowns
    //insurer api
    const data = { employer_id: props.employerId };
    dispatch(getPolicyType(data));
    // dispatch(getInsurerDetails(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employerId]);

  useEffect(() => {
    let policy_sub_type_id = getPolicyId;
    //api call for policy number
    if (policy_sub_type_id)
      dispatch(
        getPolicyNumber({
          user_type_name: userType,
          policy_sub_type_id,
          employer_id: props.employerId
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employerId, getPolicyId]);

  // useEffect(() => {
  //   const data = {
  //     policy_id: props.policyNoId,
  //     to_date: getToDate,
  //     from_date: getFromDate,
  //   };
  //   dispatch(getCdStatement(data));
  // }, [props.policyNoId, getFromDate, getToDate, dispatch]);

  const getpolicyDetails = () => {
    if (props?.policyNoId && getFromDate && getToDate) {
      let policy_id = props?.policyNoId;
      let from_date = getFromDate;
      let to_date = getToDate;
      dispatch(getPolicyDetails({ policy_id, from_date, to_date }));
      dispatch(employeeCountwrtPremium({ policy_id: props.policyNoId }))

      const data = {
        policy_id: props.policyNoId,
        to_date: getToDate,
        from_date: getFromDate,
      };
      dispatch(getCdStatement(data));
      setStatus(1);
    } else {
      swal("Please fill all the fields", "", "warning");
    }
  };

  const policyTypeID = async (e) => {
    //resetting dropdowns-
    //-
    if (e.target.value) {
      const policy_sub_type_id = e.target.value;
      setPolicyId(policy_sub_type_id);
    }
  };

  // const GetInsurerId = async (e) => {
  //   //resetting dropdowns
  //   setpolicyTypeResp([]);
  //   if (e.target.value) {
  //     const InsurerAPIdata = {
  //       employer_id: props?.employerId,
  //       insurer_id: e.target.value,
  //     };
  //     //api call for policy type data
  //     dispatch(getPolicyType(InsurerAPIdata));
  //   }
  // };

  //-resetting dropdowns -----------------------------
  // useEffect(() => {
  //   if (InsurerResponse.data?.data != null) {
  //     setinsurerResp(InsurerResponse.data?.data);
  //   } else {
  //     setinsurerResp([]);
  //   }
  // }, [InsurerResponse]);

  useEffect(() => {
    if (PolicyTypeData.data?.data != null) {
      setpolicyTypeResp(PolicyTypeData?.data?.data);
    }
    else {
      setpolicyTypeResp([]);
    }
  }, [PolicyTypeData]);

  useEffect(() => {
    if (PolicyTypeNumber.data?.data != null) {
      setpolicyNumResp(PolicyTypeNumber?.data?.data);
    }
    else {
      setpolicyNumResp([]);
    }
  }, [PolicyTypeNumber]);
  //------------------------------------------------

  //primary alertMessage
  useEffect(() => {
    if (status) {
      if (PolicyDetailsResp?.data?.status === true) {
        swal("Data fetched", "", "success");
        setStatus(null);
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
        setStatus(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PolicyDetailsResp]);

  //secondary alertMessage
  useEffect(() => {
    dispatch(alertMessage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Alertresp) {
      swal(Alertresp, "", "warning");
    }
    return () => {
      dispatch(clearAlertMessage());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Alertresp]);

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
        {
          //Required for Broker.
          /* <DivSelect>
           <SelectEmployer  data={Employer} />
        <DivSelect>*/
        }
        {/* <DivSelect>
          <Select
            label="Insurer"
            placeholder="Select Insurer"
            required
            options={insurerResp?.map(item => (
              {
                id: item.id,
                name: item.name,
                value: item.id
              }
            )) || []}
            onChange={GetInsurerId}
          />
        </DivSelect> */}
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
