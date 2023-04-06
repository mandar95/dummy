import React, { useEffect, useReducer, useState } from "react";
import DashboardGraph from "./components/dashboard-graph/DashboardGraph";
import ReportCards from "./components/report-cards/ReportCards";
import AppointmentReview from "./components/appointment-review/AppointmentReview";
import ComingSoon from "./components/coming-soon/ComingSoon.js";
import Wellcome from "./components/wellcome/Wellcome";
import { EmployerDashboardContainer } from "./style";
import Calender from "./components/calender/Calender";
import Cards from "./components/cards/Cards";
import { serializeError } from "utils";
import {
  getCoverData,
  getPopUpData,
  loadAllClaims,
  loadAllClaimsDetails,
  loadAllEndorsments,
  loadAllEnrollmentDetails,
  loadAllFilterClaims,
} from "./service";
import { useSelector } from "react-redux";
import { Loader } from "components";
import TabComponent from "./components/tab/TabComponent";
import moment from "moment";

const initialState = {
  loading: true,
  loading1: true,
  loading2: true,
  loading3: true,
  loading4: true,
  loading5: true,
  error: "",
  claims: [],
  filterClaims: [],
  claimsDetails: [],
  enrollmentDetails: {},
  endorsements: {},
  coverData: [],
  topUpData: [],
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "DATA_FATCHING":
      return {
        ...state,
        loading: true,
        loading1: true,
        loading2: true,
      };
    case "FATCHING_SUCCESS_CLAIMS":
      return {
        ...state,
        loading: false,
        error: "",
        claims: payload,
      };
    case "FATCHING_SUCCESS_FILTERCLAIMS":
      return {
        ...state,
        loading: false,
        error: "",
        filterClaims: payload,
      };
    case "FATCHING_SUCCESS_ENROLLMENTDETAILS":
      return {
        ...state,
        loading1: false,
        error: "",
        enrollmentDetails: payload,
      };
    case "FATCHING_SUCCESS_ENDORSEMENTS":
      return {
        ...state,
        loading2: false,
        error: "",
        endorsements: payload,
      };
    case "FATCHING_SUCCESS_CLAIMDETAILS":
      return {
        ...state,
        loading3: false,
        error: "",
        claimsDetails: payload,
      };
    case "FATCHING_SUCCESS_COVERDATA":
      return {
        ...state,
        loading4: false,
        error: "",
        coverData: payload,
      };
    case "FATCHING_SUCCESS_TOPUPDATA":
      return {
        ...state,
        loading5: false,
        error: "",
        topUpData: payload,
      };
    case "FATCHING_FAIL": {
      return {
        ...state,
        loading: false,
        loading1: false,
        loading2: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

const loadClaims = async (dispatch, employer_id, policyId) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: allClaims } = await loadAllClaims(employer_id, policyId);
    if (allClaims) {
      dispatch({ type: "FATCHING_SUCCESS_CLAIMS", payload: allClaims?.data });
    }
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadFilterClaims = async (dispatch, employer_id) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: allClaims } = await loadAllFilterClaims(employer_id);
    if (allClaims) {
      dispatch({
        type: "FATCHING_SUCCESS_FILTERCLAIMS",
        payload: allClaims?.data,
      });
    }
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadClaimsDetails = async (dispatch, is_super_hr) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: allClaimsDetails } = await loadAllClaimsDetails(is_super_hr);
    if (allClaimsDetails) {
      dispatch({
        type: "FATCHING_SUCCESS_CLAIMDETAILS",
        payload: allClaimsDetails?.data,
      });
    }
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadCoverData = async (dispatch) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: allCoverData } = await getCoverData();
    if (allCoverData) {
      dispatch({
        type: "FATCHING_SUCCESS_COVERDATA",
        payload: allCoverData?.data,
      });
    }
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadPopUpData = async (dispatch) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: allTopUpData } = await getPopUpData();
    if (allTopUpData?.data) {
      dispatch({
        type: "FATCHING_SUCCESS_TOPUPDATA",
        payload: allTopUpData?.data,
      });
    }
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadEnrollmentDetails = async (dispatch, employer_id, policyId) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: enrollmentDetails } = await loadAllEnrollmentDetails(
      employer_id,
      policyId
    );
    dispatch({
      type: "FATCHING_SUCCESS_ENROLLMENTDETAILS",
      payload: enrollmentDetails?.data,
    });
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const loadEndorsments = async (dispatch, employer_id, policyId) => {
  try {
    dispatch({ type: "DATA_FATCHING" });
    const { data: endorsements } = await loadAllEndorsments(
      employer_id,
      policyId
    );
    dispatch({
      type: "FATCHING_SUCCESS_ENDORSEMENTS",
      payload: endorsements?.data,
    });
  } catch (error) {
    dispatch({ type: "FATCHING_FAIL", payload: serializeError(error) });
  }
};

const EmployerDashboard = () => {
  const { currentUser } = useSelector((state) => state.login);
  const [
    {
      loading,
      loading1,
      loading2,
      loading3,
      loading4,
      loading5,
      topUpData,
      endorsements,
      claims,
      filterClaims,
      coverData,
      enrollmentDetails,
      claimsDetails,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [year, setYear] = useState(moment(new Date()).format("YYYY"));
  const [isYearSelect, setIsYearSelect] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [policyId, setPolicyId] = useState(null);
  const [dateType, setDateType] = useState("");

  const onHide = () => {
    setModalShow(false);
  };

  const reset = () => {
    setPolicyId(undefined);
    setYear(moment(new Date()).format("YYYY"));
    onHide();
  }

  const getFilterValue = (data) => {
    if (data.year.value !== year) {
      setIsYearSelect(true);
      setDateType("");
    }
    if (data.year.value) {
      setYear(data.year.value);
    }
    if (data.policy_id) {
      setPolicyId(data.policy_id);
    }
    onHide();
  };

  const [employerId, setEmployerId] = useState(null);

  useEffect(() => {
    if (currentUser?.child_entities?.length) {
      setEmployerId(currentUser.child_entities[0].id);
    } else if (currentUser?.employer_id) {
      setEmployerId(currentUser.employer_id);
    }
  }, [currentUser, currentUser.child_entities]);

  useEffect(() => {
    if (employerId) {
      loadEnrollmentDetails(dispatch, employerId, policyId?.value);
      loadClaims(dispatch, employerId, policyId?.value);
      loadEndorsments(dispatch, employerId, policyId?.value);
      loadFilterClaims(dispatch, employerId);
    }
    loadClaimsDetails(dispatch, currentUser.is_super_hr);
    loadCoverData(dispatch);
    loadPopUpData(dispatch);
  }, [currentUser.is_super_hr, employerId, policyId]);

  return (
    <>
      {loading || loading3 || loading4 || loading5 || loading1 || loading2 ? (
        <Loader />
      ) : (
        <EmployerDashboardContainer>
          <TabComponent
            getFilterValue={getFilterValue}
            year={year}
            modalShow={modalShow}
            setModalShow={setModalShow}
            employerId={employerId}
            setEmployerId={setEmployerId}
            onHide={onHide}
            reset={reset}
            claims={filterClaims}
            policyId={policyId}
            currentUser={currentUser}
          />
          <div className="row m-0 p-0">
            <div className="col-md-9 col-12 m-0 p-0">
              <div className="d-flex flex-column">
                <Wellcome title={currentUser?.name} />
                <DashboardGraph
                  isYearSelect={isYearSelect}
                  setIsYearSelect={setIsYearSelect}
                  year={year}
                  dateType={dateType}
                  setDateType={setDateType}
                  data={endorsements}
                />
              </div>
            </div>
            <div className="col-md-3 col-12 m-0 pl-0 pl-md-4 pr-0">
              <ComingSoon />
            </div>
          </div>
          <div className="row sectionTwo m-0 p-0">
            <div className="col-md-8 col-12 p-0">
              <div className="row m-0 p-0">
                <div className="col-md-5 col-12 m-0 p-0">
                  <ReportCards
                    year={year}
                    coverData={coverData}
                    topUpData={topUpData}
                  />
                </div>
                <div className="col-md-7 col-12 m-0 p-0">
                  <Cards data={claimsDetails} />
                </div>
              </div>
              <Calender year={year} data={enrollmentDetails} />
            </div>
            <div className="col-md-4 col-12 m-0 pl-0 pl-md-4 pr-0">
              <AppointmentReview year={year} claims={claims} />
            </div>
          </div>
        </EmployerDashboardContainer>
      )}
    </>
  );
};

export default EmployerDashboard;
