import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRenewalData, selectRenewalData } from "./MyPolicy.slice";
import Table from "react-bootstrap/Table";
import { CardBlue, NoDataFound } from "../../components";
import swal from "sweetalert";
import { DateFormate } from "../../utils";

const PolicyTable = (props) => {
  //Selectors
  const dispatch = useDispatch();
  const getTableData = useSelector(selectRenewalData);
  const { globalTheme: theme } = useSelector((state) => state.theme);
  //states
  const [tableData, setTableData] = useState([]);

  //setting table data
  useEffect(() => {
    setTableData(getTableData?.data?.data);
  }, [getTableData]);

  //remove useeffect and assign the selector response to tablearray.also remove the promise on api call dispatch.
  // let TableArray = tableData;

  const renderTableData = (TableArray, index) => (
    <tr key={index + 'renewal'}>
      <th>{TableArray?.cover_type || "-"}</th>
      <th>{TableArray?.policy_no || "-"}</th>
      <th>{TableArray?.company_name || "-"}</th>
      <th>{TableArray?.suminsured || "-"}</th>
      <th>{TableArray?.premium || "-"}</th>
      <th>{DateFormate(TableArray?.start_date) || "-"}</th>
      <th>{DateFormate(TableArray?.end_date) || "-"}</th>
      {/*<th>{TableArray?.vehicle_reg_no || "-"} </th>
      <th>{TableArray?.vehicle_reg_date || "-"}</th>
      <th>{TableArray?.travel_location || "-"}</th>
      <th>{TableArray?.travel_trip_type || "-"}</th> */}
      <th style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={
            TableArray?.day_left > 0
              ? {
                display: "flex",
                outline: "none",
                alignItems: "center",
                background: "green",
                color: "white",
                borderRadius: "8px",
                padding: "2px",
                textAlign: "center",
                flexWrap: "wrap",
              }
              : {
                display: "flex",
                background: "red",
                alignItems: "center",
                color: "white",
                borderRadius: "8px",
                outline: "none",
                padding: "2px",
                textAlign: "center",
                flexWrap: "wrap",
              }
          }
        >
          {TableArray?.day_left > 0 ? "Active" : "Expired"}
        </div>
      </th>
      <th>{TableArray?.day_left}</th>
      {/* <th>
        <button
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            color: "green",
          }}
          onClick={() =>
            TableArray?.redirect_url
              ? window.open(TableArray?.redirect_url)
              : swal("Link is Inactive", "", "warning")
          }
        >
          <i className="ti-reload" />
        </button>
      </th> */}
      <th>
        <button
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            color: theme.CardBlue?.color || "blue",
          }}
          onClick={() =>
            TableArray?.doc_path
              ? window.open(TableArray?.doc_path)
              : swal("Document not available", "", "warning")
          }
        >
          <i className="ti-file" />
        </button>
      </th>
    </tr>
  );

  //get TableData-----------------
  useEffect(() => {
    dispatch(getRenewalData()).then(setTableData([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //--------------------------------
  return (
    <CardBlue title="My Policies">
      <div
        style={{ marginTop: "-10px", marginLeft: "20px", marginRight: "20px" }}
      >
        {tableData?.length ?
          <Table striped bordered hover responsive>
            <thead style={{ background: theme.CardBlue?.color || "#6334e3", color: "white" }}>
              <tr>
                <th>Cover Type</th>
                <th>Policy</th>
                <th>Company Name</th>
                <th>Sum Insured</th>
                <th>Premium</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Policy Status</th>
                <th>Days Left</th>
                {/* <th>Action</th> */}
                <th>Policy Doc</th>
              </tr>
            </thead>
            <tbody>{tableData?.map(renderTableData)}</tbody>
          </Table> :
          <NoDataFound text='No Renewal Policies Found' />}
      </div>
    </CardBlue>
  );
};

export default PolicyTable;
