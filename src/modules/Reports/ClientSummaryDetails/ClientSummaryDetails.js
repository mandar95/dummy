//buttons remaining

import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";

import { Loader } from "components";
import Filters from "./Filters";
import PolicyPlanPeriod from "./PolicyPlanPeriod";
import Prorata from "./Prorata";
import PerformanceTable from "./PerformanceTable";
import TAT from "./TAT";
import { Container } from "./style";
import { ProgressBar } from "modules/EndorsementRequest/progressbar";

import { useParams } from "react-router";
import { initialState, reducer, loadClientSummary } from "../Report.action.js";
import { useSelector } from "react-redux";


const ClientSummaryDetails = () => {

  const { userType } = useParams();
  const [{ lastpage, firstpage,
    brokers, employers, policy_subtypes, policies,
    loading, loadingReport, reportData }, dispatch] = useReducer(reducer, initialState);

  // Selectors
  const { currentUser } = useSelector((state) => state.login);
  //states
  const [formData, setFormData] = useState();

  // fetch for values -------
  const getValues = (data) => {
    setFormData({ ...data, policy_id: data.policy_id?.value, employer_id: data.employer_id?.value || currentUser?.employer_id });
  };
  //-------------------------

  // api call for the table data ------
  useEffect(() => {
    if ((currentUser?.broker_id || formData?.broker_id) && formData) {
      const data = Object.assign(
        {
          broker_id: currentUser?.broker_id || formData?.broker_id,
        },
        formData
      );
      loadClientSummary(dispatch, data)
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

      {!_.isEmpty(reportData) && <>
        <PolicyPlanPeriod Data={reportData?.claim_summary} />

        <Prorata Data={reportData?.Prorata} />

        <PerformanceTable Data={reportData?.member_cnt} />

        <div style={{ marginLeft: "35px" }}>
          <span>
            Note: Claim - Resettlement & pre/post claims are not considered as
            separate claims count, but amounts are considered.
          </span>
        </div>

        <TAT Data={reportData?.TAT} />
      </>}
      {loadingReport && <ProgressBar text='Fetching Data...' />}
      {loading && <Loader />}
    </Container>
  );
};

export default ClientSummaryDetails;
