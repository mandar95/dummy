import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  employeeDashboard,
  getEmployeePolicies,
  getUserType,
  getloading,
} from "./Dashboard.slice";
import { useDispatch, useSelector } from "react-redux";
import { TabWrapper, Tab, Loader } from "components";
import { useParams } from "react-router-dom";
import classes from "./Dashboard.module.css";
import { EmployeeSummary } from "./EmployeeSummary";
import Card from "./sub-components/Card";
import { Form } from "react-bootstrap";
import { ModuleControl } from "../../config/module-control";

const Wrapper = styled.div`
  margin-top: 20px;
  margin-left: 20px;
`;

const Dashboard = () => {
  const dispatch = useDispatch();
  const type = useParams()?.userType;
  const { group_cover: groupcover = [], voluntary_cover: voluntarycover = [] } =
    useSelector(getEmployeePolicies) || {};
  const { employeeDashboardSummary, /* summaryPremium, */ summaryFlex, nomineeSummary, flex_balance } = useSelector(
    (state) => state.dashboard
  );

  const { currentUser } = useSelector((state) => state.login);
  const userType = useSelector(getUserType);
  const loading = useSelector(getloading);
  let [coverTab, setCoverTab] = useState("GroupCover");
  // let [employeeTotalPremium, setEmployeeTotalPremium] = useState(0);
  const [allYears, setAllYears] = useState([]);
  const [currentYear, setCurrentYear] = useState();
  const [summaryPremium, setSummaryPremium] = useState();

  useEffect(() => {
    const policies = [...(groupcover || []), ...(voluntarycover || [])];
    if (policies?.length > 0) {

      let yearArray = [];
      (policies || []).forEach((elem) => {
        const getYear = new Date(elem?.policy_start_date).getFullYear();
        if (!yearArray.includes(getYear) && [1, 2, 3].includes(elem?.policy_sub_type_id)) {
          yearArray.push(getYear)
        }
      })
      yearArray = yearArray.sort(function (a, b) {
        return a - b;
      })
      yearArray.length > 1 && ModuleControl.CustomRelease /* Employee Year Filter */ && setCurrentYear(yearArray[yearArray.length - 1]);
      setAllYears(yearArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupcover, voluntarycover])

  useEffect(() => {
    const policies = [...(groupcover || []), ...(voluntarycover || [])];
    if (policies?.length > 0) {

      let totalPremium = 0;
      (policies || []).forEach((elem) => {
        const getYear = new Date(elem?.policy_start_date).getFullYear();
        if (getYear === currentYear || !currentYear || !elem?.policy_start_date) {
          totalPremium += elem.premium;
        }
      })
      setSummaryPremium(totalPremium)
    }

    // change tab
    const currentYearGroupCover = groupcover.filter((elem) => {
      const getYear = new Date(elem?.policy_start_date).getFullYear();
      return getYear === currentYear || !currentYear || !elem?.policy_start_date
    })

    const currentYearVoluntaryCover = voluntarycover.filter((elem) => {
      const getYear = new Date(elem?.policy_start_date).getFullYear();
      return getYear === currentYear || !currentYear || !elem?.policy_start_date
    })

    if (coverTab === 'GroupCover' && !currentYearGroupCover.length && currentYearVoluntaryCover.length) {
      setCoverTab('VoluntaryCover')
    } else if (coverTab === 'VoluntaryCover' && !currentYearVoluntaryCover.length) {
      setCoverTab('GroupCover')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupcover, voluntarycover, currentYear])


  useEffect(() => {
    if (type === "employee" && currentUser?.id) {
      dispatch(employeeDashboard(currentUser));
    }
    return () => {
      //cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, currentUser]);

  useEffect(() => {
    if (!loading && !groupcover?.length && voluntarycover?.length) {
      setCoverTab("VoluntaryCover");
    }
  }, [loading, groupcover, voluntarycover]);

  const currentYearGroupCover = groupcover.filter((elem) => {
    const getYear = new Date(elem?.policy_start_date).getFullYear();
    return getYear === currentYear || !currentYear || !elem?.policy_start_date
  })

  const currentYearVoluntaryCover = voluntarycover.filter((elem) => {
    const getYear = new Date(elem?.policy_start_date).getFullYear();
    return getYear === currentYear || !currentYear || !elem?.policy_start_date
  })

  return (
    <>
      <Wrapper>
        {["Employee", "Employer"].includes(userType) && !!(currentYearGroupCover?.length || currentYearVoluntaryCover?.length)
          && (
            <TabWrapper width={"max-content"}>
              {!!currentYearGroupCover?.length && (
                <Tab
                  isActive={Boolean(coverTab === "GroupCover")}
                  onClick={() => setCoverTab("GroupCover")}
                >
                  Group Cover
                </Tab>
              )}
              {!!currentYearVoluntaryCover?.length && (
                <Tab
                  isActive={Boolean(coverTab === "VoluntaryCover")}
                  onClick={() => setCoverTab("VoluntaryCover")}
                >
                  Voluntary Cover
                </Tab>
              )}
              {!!(currentYearGroupCover?.length || currentYearVoluntaryCover?.length) && (
                <Tab
                  isActive={Boolean(coverTab === "Summary")}
                  onClick={() => setCoverTab("Summary")}
                >
                  Summary
                </Tab>
              )}
            </TabWrapper>
          )}

        {allYears.length > 1 && ModuleControl.CustomRelease /* Employee Year Filter */ &&
          <div className="row justify-content-end align-items-baseline w-100">
            <Form.Group className="d-flex align-items-center m-0 mb-1 mr-3" >
              <span className="mr-3 text-nowrap">Coverage Year</span>
              <Form.Control className="rounded-lg shadow-sm" as="select" size="sm" value={currentYear}
                onChange={e => {
                  setCurrentYear(Number(e.target.value));
                }}>
                <option key={'clear'} value={''}>
                  {'All'}
                </option>
                {allYears.map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>}

        <div style={{ display: "flex", flexWrap: "wrap", ...(allYears.length > 1 && ModuleControl.CustomRelease /* Employee Year Filter */ && { marginTop: '2rem' }) }} >
          {["Employee", "Employer"].includes(userType) &&
            coverTab === "GroupCover" && (
              <div className="row w-100">
                {currentYearGroupCover?.map((v, i) => (
                  <div
                    key={v.policy_id + "group-cover"}
                    className={"col-12 col-lg-6 " + classes.custom_col}
                  >
                    <Card navigatorName={"GroupPolicy"} v={v}
                      description={v?.policy_description}
                    />
                  </div>
                ))}
                {!currentYearGroupCover?.length && (
                  <h1 className="text-center display-4 text-secondary">
                    No Group Cover Found
                  </h1>
                )}
              </div>
            )}

          {["Employee", "Employer"].includes(userType) &&
            coverTab === "VoluntaryCover" && (
              <div className="row w-100">
                {currentYearVoluntaryCover?.map((v, i) => (
                  <div
                    key={v.policy_id + "voluntary-cover"}
                    className={"col-12 col-lg-6 " + classes.custom_col}
                  >
                    <Card navigatorName={"VoluntaryPolicy"} v={v}
                      description={v?.policy_description}
                    />
                  </div>
                ))}
                {!currentYearVoluntaryCover?.length && (
                  <h1 className="text-center display-4 text-secondary">
                    No Voluntary Cover Found
                  </h1>
                )}
              </div>
            )}
          {coverTab === "Summary" &&
            (!!employeeDashboardSummary.length ?
              <EmployeeSummary
                currentYear={currentYear}
                summaryPremium={summaryPremium}
                nomineeSummary={nomineeSummary}
                summary={employeeDashboardSummary}
                summaryFlex={summaryFlex}
                flex_balance={flex_balance}
              />
              : <Loader />)}
        </div>
      </Wrapper>
      {loading && <Loader />}
    </>
  );
};

export default Dashboard;
