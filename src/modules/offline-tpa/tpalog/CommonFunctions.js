import React from "react";
import { Button } from "components";

export const CellViewTemplate = (cell, viewTemplate) => {
  if (cell.value) {
    return (
      <Button
        size="sm"
        className="shadow rounded-lg align-items-center"
        onClick={() => {
          viewTemplate(cell.value);
        }}
      >
        View &nbsp;
        <i className={"ti-angle-up text-light"} />
      </Button>
    );
  }
  return (
    <Button
      size="sm"
      buttonStyle="submit-disabled"
      className="shadow rounded-lg align-items-center"
    >
      Not Found
    </Button>
  );
};

export const TpaLogModel = (viewTemplate) => [
  {
    Header: "Policy Id",
    accessor: "policy_id",
    disableFilters: true,
  },
  {
    Header: "Policy No",
    accessor: "policy_no",
    disableFilters: true,
  },
  {
    Header: "Request Data",
    accessor: "request_data",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
  {
    Header: "Request Type",
    accessor: "request_type",
    disableFilters: true,
  },
  {
    Header: "Created At",
    accessor: "created_at",
    disableFilters: true,
  },
  {
    Header: "Response Data",
    accessor: "response_data",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
];

export const WellnessLogModel = (viewTemplate) => [
  {
    Header: "Policy Id",
    accessor: "policy_id",
    disableFilters: true,
  },
  {
    Header: "Policy No",
    accessor: "policy_number",
    disableFilters: true,
  },
  {
    Header: "Request Data",
    accessor: "request_data",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
  {
    Header: "Request Type",
    accessor: "request_name",
    disableFilters: true,
  },
  {
    Header: "Created At",
    accessor: "created_at",
    disableFilters: true,
  },
  {
    Header: "Response Data",
    accessor: "response_data",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
];
