import React from "react";
import { AppointmentReviewContainer } from "../../style";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const AppointmentReview = ({ claims = [], year }) => {
  const { globalTheme } = useSelector(state => state.theme)
  const makeWidth =
    claims.filter(
      (d) =>
        d.policy_start_date.includes(year) || d.policy_end_date.includes(year)
    )?.length * 50;

  const dataLength = claims.filter(
    (d) =>
      d.policy_start_date.includes(year) || d.policy_end_date.includes(year)
  )?.length;

  const chartOptions = {
    series: [
      {
        name: "Employees",
        data: claims
          .filter(
            (d) =>
              d.policy_start_date.includes(year) ||
              d.policy_end_date.includes(year)
          )
          ?.map(({ total_employees }) => total_employees),
      },
      {
        name: "Claim",
        data: claims
          .filter(
            (d) =>
              d.policy_start_date.includes(year) ||
              d.policy_end_date.includes(year)
          )
          ?.map(
            ({ overall_claim_submission_count }) =>
              overall_claim_submission_count
          ),
      },
    ],
    options: {
      colors: ["#3dc198", "#f16666"],
      chart: {
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 3,
        colors: ["transparent"],
      },
      tooltip: {
        shared: true,
        x: {
          show: true,
          format: 'dd MMM',
          formatter: (ser) => ser.slice(0,14)+"...",
      },
        intersect: false,
        style: {
          fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
        },
      },
      xaxis: {
        categories: claims
          .filter(
            (d) =>
              d.policy_start_date.includes(year) ||
              d.policy_end_date.includes(year)
          )
          ?.map(({ policy_name }) => policy_name),
      },
      yaxis: {
        title: {
          text: "Count in number",
        },
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
      },
      fill: {
        opacity: 1,
      },
    },
  };

  return (
    <AppointmentReviewContainer
      checklength={dataLength < 15 ? "20px" : "20px 20px 0px 0px"}
      width={dataLength > 10 ? makeWidth + "px" : "100%"}
    >
      <h3 className="m-0 font-weight-bold">
        Claim Count <span className="ml-2">( filter by year: {year} )</span>{" "}
      </h3>
      <div className="bar-chart">
        <Chart
          options={chartOptions.options}
          series={chartOptions.series}
          type="bar"
          height="610"
        />
      </div>
    </AppointmentReviewContainer>
  );
};

export default React.memo(AppointmentReview);
