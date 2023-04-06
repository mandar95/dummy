import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import styled from "styled-components";

import Steps from "./steps/steps";
import CreateReport from "./create-report/create-report";
import { Card, TabWrapper, Tab } from "../../components";
import ReportDetail from './ReportDetail';

import { useDispatch, useSelector } from "react-redux";
import { clear, alertMessage, clearAlertMessage } from "./report-config.slice";

const ReportConfig = ({ myModule }) => {
  const response = useSelector((state) => state.reportConfig);
  const dispatch = useDispatch();
  //states
  const [gettitle, settitle] = useState();
  const [tab, setTab] = useState("Report Detail");

  //Screen Selection
  const screenSelection = () => {
    if (tab === "Report Config") {
      return <Steps getTitle={getTitle} />;
    } else if (tab === "Report Detail") {
      return <ReportDetail />;
    } else if (tab === "Create Report") {
      return <CreateReport />;
    }
  };

  //secondary alertMessage
  useEffect(() => {
    dispatch(alertMessage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (response.alert) {
      swal(response.alert, "", "warning");
    }
    return () => {
      dispatch(clearAlertMessage());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.alert]);

  useEffect(() => {
    if (['Report Detail', 'Create Report'].includes(tab)) {
      settitle(tab);
    }
  }, [tab])

  //secondary success.
  useEffect(() => {
    if (!response.loading && response.success) {
      swal('Success', response.success, "success");
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.success, response.error, response.loading]);

  //getTitle
  const getTitle = (data) => {
    settitle(data);
  };

  return (
    <Container>
      <TabWrapper width={'max-content'}>
        <Tab
          isActive={Boolean(tab === "Report Detail")}
          onClick={() => setTab("Report Detail")}
        >
          Report Detail
        </Tab>
        {!!myModule?.canwrite && <>
          <Tab
            isActive={Boolean(tab === "Create Report")}
            onClick={() => setTab("Create Report")}
          >
            Create Report
          </Tab>
          <Tab
            isActive={Boolean(tab === "Report Config")}
            onClick={() => setTab("Report Config")}
          >
            Report Configurator
          </Tab>
        </>}
        {/* <Tab
            isActive={Boolean(tab === "Existing Reports")}
            onClick={() => setTab("Existing Reports")}
          >
            Existing Reports
          </Tab> */}
      </TabWrapper>

      <Card title={gettitle || "Create Report"}>
        <div style={{ width: "100%" }}>{screenSelection()}</div>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 10px;
`;

export default ReportConfig;
