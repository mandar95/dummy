import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { ChartContainer } from "../../style";
import FilterModal from "../modal/FilterModal";

const DashboardGraph = ({
  data = {},
  year,
  setIsYearSelect,
  dateType,
  setDateType,
  isYearSelect,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [dataType, setDataType] = useState("Employee Wise");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [allData, setAllData] = useState([]);

  const todayDate = moment(new Date()).format("YYYY-MM");
  const thisMonth = moment(new Date()).format("YYYY-MM");
  const thisYear = moment(new Date()).format("YYYY");

  const doFilter = (d) => {
    switch (dateType) {
      case "FTD":
        return d?.cover_start_date === todayDate;

      case "MTD":
        return moment(d?.cover_start_date).format("YYYY-MM") === thisMonth;

      case "YTD":
        return d?.cover_start_date.split("-")[0] === thisYear;

      case "Custom Date":
        return (
          moment(fromDate, "YYYY-MM-DD") <=
            moment(d?.cover_start_date, "YYYY-MM-DD") &&
          moment(toDate, "YYYY-MM-DD") >=
            moment(d?.cover_start_date, "YYYY-MM-DD")
        );

      default:
        return true;
    }
  };

  const getTotalAmount = (data) => {
    const filterByDateType = data.filter(
      (d) =>
        d?.cover_start_date.split("-")[0] ===
        (dateType === "YTD" ? thisYear : year + "")
    );

    const updateData = [];
    for (let i = 1; i < 13; i++) {
      const newFiltered = filterByDateType.filter(
        (d) => Number(d.cover_start_date.split("-")[1]) === i
      );
      const totalEndorsementCount = newFiltered.reduce(function (prev, cur) {
        return prev + Number(cur.employee_endorsed_count);
      }, 0);
      const totalEndorsementDeleteCount = newFiltered.reduce(function (
        prev,
        cur
      ) {
        return prev + Number(cur.employee_endorsed_deleted_count);
      },
      0);

      const totalEndorsementMemberCount = newFiltered.reduce(function (
        prev,
        cur
      ) {
        return prev + Number(cur.employee_endorsed_member_count);
      },
      0);

      const totalEndorsementMemberDeleteCount = newFiltered.reduce(function (
        prev,
        cur
      ) {
        return prev + Number(cur.employee_endorsed_member_deleted_count);
      },
      0);

      if (newFiltered.length) {
        const data = {
          ...newFiltered[0],
          employee_endorsed_count: totalEndorsementCount,
          employee_endorsed_deleted_count: totalEndorsementDeleteCount,
          employee_endorsed_member_count: totalEndorsementMemberCount,
          employee_endorsed_member_deleted_count:
            totalEndorsementMemberDeleteCount,
        };
        updateData.push(data);
      }
    }
    return updateData;
  };

  useEffect(() => {
    let makeArray = Object.values(data);
    if (isYearSelect || dateType === "YTD") {
      setAllData(getTotalAmount(makeArray));
    } else {
      setAllData(makeArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, isYearSelect, dateType, dataType]);

  const chartOptions = {
    series: [
      {
        name: `${dataType.split(" ")[0]} Count`,
        data: allData
          .filter((d) => doFilter(d))
          .map((d) =>
            dataType === "Employee Wise"
              ? d?.employee_endorsed_count
              : d?.employee_endorsed_member_count
          ),
      },
      {
        name: `${dataType.split(" ")[0]} Deleted Count`,
        data: allData
          .filter((d) => doFilter(d))
          .map((d) =>
            dataType === "Employee Wise"
              ? d?.employee_endorsed_deleted_count
              : d?.employee_endorsed_member_deleted_count
          ),
      },
    ],
    options: {
      colors: ["#4344ee", "#ea6256"],
      chart: {
        dropShadow: {
          enabled: true,
          top: 8,
          left: 5,
          blur: 7,
          opacity: 0.6,
          color: ["#4344ee", "#ea6256"],
        },
        toolbar:{
          show: true,
          tools: {
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        background: "white",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      xaxis: {
        categories: allData
          .filter((d) => doFilter(d))
          .map((d) =>
            dateType === "YTD" || isYearSelect
              ? moment(d?.cover_start_date).format("MMMM").slice(0, 3)
              : d?.cover_start_date
          ),
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
      },
    },
  };

  const onHide = () => {
    setModalShow(false);
  };

  const getData = (data) => {
    const { data_type: { value } = {}, date_type } = data || {};
    setDateType(date_type?.value);

    if (data?.from_date) {
      setFromDate(data.from_date);
    }
    if (data?.till_date) {
      setToDate(data?.till_date);
    }

    if (date_type) {
      if(date_type !== "YTD"){
        setIsYearSelect(false);
      }
    }
    setDataType(value);
    onHide();
  };

  return (
    <ChartContainer>
      <div className="mb-3 d-flex justify-content-between">
        <h3 className="m-0 font-weight-bold">
          Endorsement
          {isYearSelect && !dateType ? (
            <span className="ml-2">
              ( filter by year: {year} || data-type: {dataType} )
            </span>
          ) : (
            <span className="ml-2">
              ( filter by date-type: {dateType} || data-type: {dataType} )
            </span>
          )}
        </h3>
        <div
          onClick={() => setModalShow(true)}
          className="d-flex justify-content-end mr-2"
        >
          <i className="far fa-filter"></i>
        </div>
      </div>
      <div className="chart-line">
        <Chart
          options={chartOptions.options}
          series={chartOptions.series}
          type="line"
          height="350"
        />
        {allData.filter((d) => doFilter(d))?.length === 0 && (
          <div className="no-data">
            <h1>Data Not Found</h1>
          </div>
        )}
      </div>
      {!!modalShow && (
        <FilterModal
          getData={getData}
          dataType={dataType}
          show={modalShow}
          onHide={onHide}
          fromDate={fromDate}
          toDate={toDate}
          dateType={dateType}
        />
      )}
    </ChartContainer>
  );
};

export default React.memo(DashboardGraph);
