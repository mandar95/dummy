import React from "react";
import { _renderImage } from "components";
import _ from "lodash";
import { Button } from "react-bootstrap";
import { sortTypeWithTime } from "../../../components";
import { isValidHttpUrl } from "../../../utils";
export const TableData = (SIType, access, haveSI) => [
  {
    Header: "Feature Name",
    accessor: "title",
  },
  {
    Header: "Content",
    accessor: "content",
  },
  ...(haveSI ? (SIType === "salary"
    ? [
      {
        Header: "No Of Time Salary",
        accessor: "no_of_times_of_salary",
      },
    ]
    : [
      {
        Header: "Sum Insured",
        accessor: "suminsured",
      },
    ]) : []),
  {
    Header: "Image",
    accessor: "image",
    Cell: _renderImage,
    disableFilters: true,
    disableSortBy: true,
  },
  ...access ? [{
    Header: "Operations",
    accessor: "operations",
  }] : [],
];


const _successDocument = ({ value }) => {
  return <>
    <a className="text-secondary" href={value} download>
      <i className="ti ti-download"></i>
    </a>
  </>
}

const _errorDocument = ({ value, row }) => {
  return (_.isEqual(row?.original?.status, "Failed") && value) ? (isValidHttpUrl(value) ? (
    <a className="text-secondary" href={value} download>
      <i className="ti ti-download"></i>
    </a>
  ) : value) : '-'
}

export const TableDataUpload = [
  {
    Header: "Policy Number",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Total No Of Features",
    accessor: "total_no_of_employees",
  },
  {
    Header: "No Of Features Uploaded",
    accessor: "no_of_employees_uploaded",
  },
  {
    Header: "No Of Features Failed To Upload",
    accessor: "no_of_employees_failed_to_upload",
  },
  {
    Header: "Original Document",
    accessor: "original_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: _successDocument
  },
  {
    Header: "Error Document",
    accessor: "error_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: _errorDocument
  },
  {
    Header: "Uploaded At",
    accessor: "uploaded_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "Status",
    accessor: "status",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => {
      return (
        cell.row?.original?.status === "Success" ? (
          <Button
            disabled
            size="sm"
            className="shadow m-1 rounded-lg"
            variant="success"
          >
            {cell.row?.original?.status}
          </Button>
        ) : (
          <Button
            disabled
            size="sm"
            className="shadow m-1 rounded-lg"
            variant={
              cell.row?.original?.status === "Processing"
                ? "secondary"
                : "danger"
            }
          >
            {cell.row?.original?.status}
          </Button>
        )
      );
    },
  },
]
