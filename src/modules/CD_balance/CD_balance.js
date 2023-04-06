import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filters from "./Filters";
import CDcard from "./CDcard";
import {
  // selectPolicyNumber,
  selectPolicyDetails,
  cdBalanceDetails
} from "./CD.Slice.js";
import { employeeCount as resetEmployeeCount } from "../CD_balance_broker/CDB.Slice";
import { Container, FilterContainer, SecondContainer } from "./style";
import { loadPolicy, clearPolicyData } from "../policies/approve-policy/approve-policy.slice";

const CD_balance = (props) => {

  const dispatch = useDispatch();
  const response = useSelector((state) => state.login);
  // const PolicyTypeNumber = useSelector(selectPolicyNumber);
  const PolicyDetails = useSelector(selectPolicyDetails);
  const { employeeCount } = useSelector(state => state.cdBalancebroker)

  //states
  const [policyNoId, setPolicyNoId] = useState(null);
  //Api call for employer Id
  useEffect(() => {

    return () => {
      dispatch(resetEmployeeCount(''));
      dispatch(clearPolicyData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPolicyNumberId = (e) => {
    if (e.target.value) {
      setPolicyNoId(e.target.value);
      //Api Call for Cd balance details
      const data = { policy_id: e.target.value };
      dispatch(cdBalanceDetails(data));
      dispatch(loadPolicy(e.target.value));
    }
  };


  return (
    <Container>
      <FilterContainer>
        <Filters
          employerId={response?.currentUser?.employer_id} //response?.currentUser?.employer_id
          getPolicyNumberId={getPolicyNumberId}
          policyNoId={policyNoId}
          employeeCount={employeeCount}
        />
      </FilterContainer>
      <SecondContainer>
        <CDcard
          policyDetails={PolicyDetails?.data?.data}
          policyNoId={policyNoId}
        />
      </SecondContainer>
    </Container>
  );
};

export default CD_balance;
