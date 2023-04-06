import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";

import Filters from "./Filters";
import PerformanceTable from "./PerformanceTable";
// import TMIBASL_BENCHMARK from "./TMIBASL_BENCHMARK";
// import Table2 from "./Table2";
import { Container } from "./style";
import { Loader } from "components";
import { ProgressBar } from "modules/EndorsementRequest/progressbar";

import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { initialState, reducer, loadMonthlyClaim } from "../Report.action.js";


const MonthlyClaimTrackerReport = () => {

  const { userType } = useParams();
  const [{ lastpage, firstpage,
    brokers, employers, policy_subtypes, policies,
    loading, loadingReport, reportData }, dispatch] = useReducer(reducer, initialState);

  //Selectors
  const { currentUser } = useSelector((state) => state.login);

  //states
  const [formData, setFormData] = useState();


  // fetch for values -------
  const getValues = (data) => {
    setFormData({ ...data, policy_id: data.policy_id?.value, employer_id: data.employer_id?.value || currentUser?.employer_id });
  };
  //-------------------------


  useEffect(() => {
    if ((currentUser?.broker_id || formData?.broker_id) && formData) {
      const data = Object.assign(
        {
          broker_id: currentUser?.broker_id || formData?.broker_id,
        },
        formData
      );

      loadMonthlyClaim(dispatch, data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, dispatch]);

  //-----------------------------------

  return (
    <Container>
      <Filters
        BrokerId={currentUser?.broker_id}
        getValues={getValues}
        userType={userType}
        brokers={brokers}
        employers={employers}
        policy_subtypes={policy_subtypes}
        policies={policies}
        dispatch={dispatch}
        lastpage={lastpage}
        firstpage={firstpage}
      />

      {/*
      <TableContainer>
        <TMIBASL_BENCHMARK />
      </TableContainer>
      <TableContainer>
        <Table2 />
      </TableContainer>*/}
      {!_.isEmpty(reportData) &&
        <PerformanceTable Data={reportData} />}
      {loadingReport && <ProgressBar text='Fetching Data...' />}
      {loading && <Loader />}
    </Container>
  );
};

export default MonthlyClaimTrackerReport;
