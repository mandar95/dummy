import React, { useState, useEffect, useReducer } from "react";

import Filters from "./Filters";
import GenderAnalysis from "./GenderAnalysis";
import SUMMARY_ACTIVE_LIVES from "./Summary_Active_Lives";
import STATUS_WISE_CLAIMS from "./STATUS_WISE_CLAIMS";
import TOP_AILMENT_ANALYSIS from "./Top_Ailment_Analysis";
import TOP_HOSPITAL_ANALYSIS from "./Top_Hospital_Analysis";
import SUM_UTILIZATION from "./Sum_Utilization";
import CLAIM_INCIDENCE_RATIO from "./Claim_Incidence_Ratio";
import PerformanceTable from "./Performance_Table";
import MaternityClaim from './Maternity_Claim';
import DisallowanceAnalysis from './Disallowance_Analysis';

import { Container } from "./style";
import { ProgressBar } from "modules/EndorsementRequest/progressbar";
import { Loader } from "components";

import { useSelector } from "react-redux";
import { initialState, reducer, loadClaimUtilization } from "../Report.action.js";
import { useParams } from "react-router";
import _ from "lodash";


const ClaimUtilizationReport = () => {

  const { userType } = useParams();
  const [{ lastpage, firstpage,
    brokers, employers, policy_subtypes, policies,
    loading, loadingReport, reportData }, dispatch] = useReducer(reducer, initialState);

  const { currentUser } = useSelector((state) => state.login);

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
          broker_id: currentUser?.broker_id || formData?.broker_id
        },
        formData
      );
      loadClaimUtilization(dispatch, data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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

      {!_.isEmpty(reportData) &&
        <>
          <GenderAnalysis tableData={reportData?.getRelGenSummary} />
          <SUMMARY_ACTIVE_LIVES tableData={reportData?.activeLifeSummary} />
          <STATUS_WISE_CLAIMS tableData={reportData?.claimSummaryClaimRatio} />
          <CLAIM_INCIDENCE_RATIO tableData={reportData?.claimIncidentRatio} />
          <TOP_AILMENT_ANALYSIS tableData={reportData?.getTopTenAilment} />
          <MaternityClaim tableData={reportData?.getMaternityData} />
          <DisallowanceAnalysis tableData={reportData?.disallowance_amt_analysis} />
          <TOP_HOSPITAL_ANALYSIS tableData={reportData?.getTopTenHsopital} />
          <SUM_UTILIZATION tableData={reportData?.SumAssuredUtilization} />
          <PerformanceTable tableData={reportData?.policy_performance} />
        </>
      }
      {loadingReport && <ProgressBar text='Fetching Data...' />}
      {loading && <Loader />}
    </Container>
  );
};

export default ClaimUtilizationReport;
