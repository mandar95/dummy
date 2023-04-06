import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { Button, CardBlue, SelectComponent, NoDataFound } from "../../components";
import { Row } from "react-bootstrap";
import _ from "lodash";
import { AttachFile } from "../core";
import { getFirstError } from "../../utils";
import {
  sendFileData,
  selectFileResponse,
  sampleFileData,
  selectSampleResponse,
  sampleReportData,
  selectReportResponse,
  getErrorSheetData,
  sampleReportDetails
} from "./Allocate.slice";
import { Content, DivButton, ButtonContainer } from "./style";
import { DataTable } from "modules/user-management";
import { useParams } from "react-router-dom";
// import { 
//   getUserDataDropdown, 
//   selectdropdownData } from "../user-management/user.slice";
import { ErrorSheetTableData } from './helper';
import { useForm, Controller } from "react-hook-form";

import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
const Allocate = () => {

  const { userType } = useParams()
  //selectors
  const dispatch = useDispatch();
  const SampleResponse = useSelector(selectSampleResponse);
  const FileResponse = useSelector(selectFileResponse);
  const ReportResponse = useSelector(selectReportResponse);
  // const dropDown = useSelector(selectdropdownData);
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const { control } = useForm();

  const { ErrorSheetData } = useSelector(state => state.allocate);

  const { currentUser, userType: currentUserType } = useSelector(state => state.login);
  //states
  const [file, setFile] = useState(null);
  const [status, setstatus] = useState(0);
  const [employer_id, setemployer_id] = useState(null);

  const getFile = (files) => {
    setFile(files[0]);
    if (!_.isEmpty(files)) {
      swal("File attached", "", "success");
    }
  };

  useEffect(() => {
    if (currentUser?.broker_id || currentUser?.employer_id || employer_id) {
      dispatch(getErrorSheetData({
        ...((currentUser?.broker_id && userType === 'broker') && { broker_id: currentUser?.broker_id }),
        ...((currentUser?.employer_id && userType === 'employer') && { employer_id: employer_id || currentUser?.employer_id })
      }))
    }
    const intervalId = setInterval(() => dispatch(getErrorSheetData({
      ...((currentUser?.broker_id && userType === 'broker') && { broker_id: currentUser?.broker_id }),
      ...((currentUser?.employer_id && userType === 'employer') && { employer_id: employer_id || currentUser?.employer_id })
    })), 15000);
    return () => { clearInterval(intervalId); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employer_id])
  //Api's call for download format & report -------------
  useEffect(() => {
    dispatch(sampleFileData(4));
    return () => {
      dispatch(sampleReportDetails({}))
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userType === 'employer')
      dispatch(sampleReportData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (currentUserType)
  //     dispatch(getUserDataDropdown({ status: 1, type: "Employer", currentUser: currentUserType, per_page: 10000 }))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    if ((currentUser?.broker_id) && currentUserType !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);
  //-------------------------------------------------------

  useEffect(() => {
    if (status === 1) {
      if (FileResponse?.data?.status === true) {
        swal(
          "Employee Flex Amount Added Successfully.",
          "",
          "success"
        ).then(() => dispatch(sampleReportData(userType === 'broker' && employer_id)));
        setstatus(0)
      } else {
        let error =
          FileResponse?.data?.errors &&
          getFirstError(FileResponse?.data?.errors);
        error = error
          ? error
          : FileResponse?.data?.message
            ? FileResponse?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setstatus(0)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FileResponse]);

  //secondary alertMessage
  // useEffect(() => {
  //   dispatch(alertMessage());
  // }, []);

  // useEffect(() => {
  //   if (Alertresp) {
  //     swal(Alertresp, "", "warning");
  //   }
  //   return () => {
  //     dispatch(clearAlertMessage());
  //   };
  // }, [Alertresp]);

  //Api call for Submit---
  const submit = () => {
    if (userType === 'broker' && !employer_id) {
      swal("Please select employer", "", "warning");
    }
    if (file) {
      const formData = new FormData();
      formData.append("employer_id", employer_id || currentUser?.employer_id);
      formData.append("is_super_hr", currentUser?.is_super_hr);
      formData.append("file", file);
      if (file !== null) {
        dispatch(sendFileData(formData));
        setstatus(1);
      }
    } else {
      swal("Please attach file", "", "warning");
    }
  };
  //--------------------


  // if (userType === 'broker') {
  //   swal("Can't Allocate", 'Only Employer can allocate flex', 'info').then(()=>{
  //     history.goBack()
  //   })
  //   return null
  // }

  return (
    <CardBlue
      title="Flex Allocate"
      round
    //style={{ display: "flex", minWidth: "500px", maxWidth: "600px" }}
    >
      {userType === 'broker' &&
        <Controller
          as={<SelectComponent
            label="Employer"
            placeholder='Select Employer'
            options={employers?.map((item) => ({
              id: item?.id,
              label: item?.name,
              value: item?.id,
            })) || []}
            id="employer_id"
            required
          />}
          onChange={([e]) => {
            dispatch(sampleReportData(e?.value));
            setemployer_id(e?.value)
            return e
          }}
          name="employer_id"
          control={control}
        />}
      {userType === 'employer' && !!(currentUser.is_super_hr && currentUser.child_entities.length) &&
        <Controller
          as={<SelectComponent
            label="Employer"
            placeholder='Select Employer'
            options={currentUser.child_entities?.map((item) => ({
              id: item?.id,
              label: item?.name,
              value: item?.id,
            })) || []}
            id="employer_id"
            required
          />}
          onChange={([e]) => {
            dispatch(sampleReportData(e?.value));
            setemployer_id(e?.value)
            return e
          }}
          defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
          name="employer_id"
          control={control}
        />}
      <div>
        <Content>
          <AttachFile
            accept=".xlsx, .xls"
            key="member_sheet"
            onUpload={getFile}
            description="File Formats: (.xlsx)"
            required={true}
            nameBox
          />

          <DivButton>
            <Button onClick={submit}>Submit</Button>
          </DivButton>
        </Content>
        <ButtonContainer>
          {((userType === 'broker' && employer_id) || userType === 'employer') && !!ReportResponse?.data?.data?.url && <a href={ReportResponse?.data?.data?.url || ''}>
            <Button buttonStyle="outline" style={{ margin: "10px" }}>
              <span>Download Report</span>
              <i
                className="ti-cloud-down display-sm-none"
                style={{ marginLeft: "5px" }}
              />
            </Button>
          </a>}
          <a href={SampleResponse?.data?.data[0]?.upload_path ? (SampleResponse?.data?.data[0]?.upload_path) : ("/home")}>
            <Button buttonStyle="outline" style={{ margin: "10px" }}>
              <span>Download Format</span>
              <i
                className="ti-clipboard display-sm-none"
                style={{ marginLeft: "5px" }}
              />
            </Button>
          </a>
        </ButtonContainer>
      </div>
      {!!ErrorSheetData.length ? <>
        <Row style={{
          'borderTop': '1px solid #c9c9c9',
          'padding': '10px 10px',
          'fontSize': '20px',
        }}>
          Flex Allocation Documents
        </Row>
        <DataTable
          columns={
            ErrorSheetTableData(userType, currentUser.is_super_hr) ||
            []
          }
          data={
            ErrorSheetData ||
            []
          }
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          rowStyle
          autoResetPage={false}
        />
      </> :

        <Row style={{
          'borderTop': '1px solid #c9c9c9',
          'padding': '10px 10px',
          'fontSize': '20px',
        }}>
          Flex Allocation Documents
          <NoDataFound text='No Data Found' />
        </Row>

      }
    </CardBlue>
  );
};

export default Allocate;
