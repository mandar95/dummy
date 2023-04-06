import React from "react";
import * as yup from "yup";
import { Button as Btn } from "react-bootstrap";

import { Button } from "components";
import { DateFormate } from "utils";
import {
    ResendEmail
} from "../../newbrokerDashboard.slice";

export const requiredField = (item, key) => {
    if (["All Claims","Enrolment In Progress","Live Cashless Claims", "Global"]?.includes(item)) {
      if (key === "employer_id") {
        return yup.object()
          .shape({
            id: yup.string(),
            label: yup.string(),
            value: yup.string(),
          }).nullable().label("Employer")
      } else if(key === "from_date") {
        return yup.string().label("From Date");
      } else if(key === "to_date") {
        return yup.string().label("Till Date")
      } else if(key === "insurer_id") {
        return yup.object()
          .shape({
            id: yup.string(),
            label: yup.string(),
            value: yup.string(),
          }).nullable().label("Insurer")
      } else if(key === "tpa_id") {
        return yup.object()
          .shape({
            id: yup.string(),
            label: yup.string(),
            value: yup.string(),
          }).nullable().label("TPA")
      }
    } else {
      if (key === "employer_id") {
        return yup.object()
          .shape({
            id: yup.string(),
            label: yup.string(),
            value: yup.string(),
          }).required().nullable().label("Employer")
      } else if(key === "from_date") {
        return yup.string().required().label("From Date");
      } else if(key === "to_date") {
        return yup.string().required().label("Till Date")
      }
    }
  }

  export const TableData = (
    viewTemplate,
    myModule
  ) => [
      {
        Header: "Employee Name",
        accessor: "employee_name",
      },
      {
        Header: "Employer Name",
        accessor: "employer_name",
      },
      {
        Header: "Policy Name",
        accessor: "policy_name",
      },
      {
        Header: "Policy No",
        accessor: "policy_number",
      },
      {
        Header: "Receiver Email",
        accessor: "receiver_email",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: (cell) => DateFormate(cell.row?.original?.created_at, { type: "withTime" })
      },
      {
        Header: "Actions",
        accessor: "operations",
        disableFilters: true,
        disableSortBy: true,
        Cell: DataTableButtons._actionBtn,
      }
    ];
  export const DataTableButtons = {
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
      const payload = {
        employer_id: cell.row?.original?.employer_id,
        broker_id: cell.row?.original?.broker_id,
        master_system_trigger_id: cell.row?.original?.master_system_trigger_id,
        policy_id: cell.row?.original?.policy_id,
        emails: [cell.row?.original?.receiver_email]
      }
      return (
        <Btn
          size="sm"
          className="shadow m-1 rounded-lg"
          variant="primary"
          onClick={() => ResendEmail(payload)}
        >
          {`Resend Email`}
        </Btn>
      );
    },
  };