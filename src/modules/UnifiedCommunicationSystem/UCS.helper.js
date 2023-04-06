import React from "react";
import { Button } from "react-bootstrap";
import { sortTypeWithTime } from "../../components";
import { ResendEmail } from "./UCC.action";

const CellViewTemplate = (cell, viewTemplate) => {
  return (
    <Button
      size="sm"
      className="shadow rounded-lg align-items-center"
      onClick={() => {
        viewTemplate(cell.row.original.id);
      }}
    >
      View &nbsp;
      <i className={"ti-angle-up text-light"} />
    </Button>
  );
  // if (cell.value) {
  //   return (
  //     <Button
  //       size="sm"
  //       className="shadow rounded-lg align-items-center"
  //       onClick={() => {
  //         // viewTemplate(cell.value);
  //       }}
  //     >
  //       View &nbsp;
  //       <i className={"ti-angle-up text-light"} />
  //     </Button>
  //   );
  // }
  // return (
  //   <Button
  //     target="_blank"
  //     href={`http://eb.fynity.in/api/admin/get/email-log-template?id=${cell.row.original.id}`}
  //     size="sm"
  //     buttonStyle="submit-disabled"
  //     className="shadow rounded-lg align-items-center"
  //   >
  //     View
  //   </Button>
  // );
};

export const TableData = (
  viewTemplate,
  myModule
) => [
    {
      Header: "Email Name",
      accessor: "email_name",
    },
    {
      Header: "Employer Name",
      accessor: "employer_name",
    },
    {
      Header: "Sender Email",
      accessor: "sender_email",
    },
    {
      Header: "Receiver Email",
      accessor: "receiver_email",
    },
    {
      Header: "Template Name",
      accessor: "template_name",
    },
    {
      Header: "Template URL",
      accessor: "template_url",
      disableFilters: true,
      disableSortBy: true,
      Cell: (cell) => CellViewTemplate(cell, viewTemplate),
    },
    {
      Header: "Email Sent On",
      accessor: "created_at",
      sortType: sortTypeWithTime,
    },
    {
      Header: "Status",
      disableFilters: true,
      disableSortBy: true,
      accessor: "status",
      Cell: DataTableButtons._statusBtn,
    },
    ...(myModule?.canwrite
      ? [
        {
          Header: "Actions",
          accessor: "operations",
          disableFilters: true,
          disableSortBy: true,
          Cell: DataTableButtons._actionBtn,
        },
      ]
      : []),
  ];

const DataTableButtons = {
  _statusBtn: (cell) => {
    return (
      <Button
        disabled
        size="sm"
        className="shadow m-1 rounded-lg"
        variant={cell?.value === 1 ? "success" : "secondary"}
      >
        {cell?.value ? "Active" : "In Active"}
      </Button>
    );
  },
  _actionBtn: (cell) => {
    return (
      <Button
        size="sm"
        className="shadow m-1 rounded-lg"
        variant="primary"
        onClick={() => ResendEmail(cell.row?.original?.id)}
      >
        {`Resend Email`}
      </Button>
    );
  },
};
