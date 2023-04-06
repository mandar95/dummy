import React from "react";

import { IconButton } from "@material-ui/core";

import classes from "./index.module.css";
import swal from "sweetalert";
import { DateFormate } from "utils";
import { Button } from "react-bootstrap";
import _ from "lodash";
import * as yup from "yup";
import { sortTypeWithTime } from "../../components";
import { common_module } from 'config/validations';
const validation = common_module.user;
// import moment from "moment";
export const setDateFormate = (date) => {
  let today = new Date(date);
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var date_ =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate();
  var dateTime = date_ + " " + time;
  return dateTime;
};
export const schema = yup.object().shape({
  name: yup.string().required("Please Enter Member Name"),
  contact: yup.string()
    .notRequired().nullable()
    .matches(validation.contact.regex, { message: "Not valid number", excludeEmptyString: true })
    // .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits'),
  email: yup.string().nullable().email().label('Email Address'),
  address_line_1: yup.string().required("Please Enter Address 1"),
  address_line_2: yup.string().label("Address 2").nullable(true),
  pincode: yup.string().min(6).required("Please Enter Pincode"),
  city_id: yup.string().required("Please Select City"),
  state_id: yup.string().required("Please Select State"),
  appointment_request_date_time: yup
    .date()
    .min(new Date(), "Past Date and Time Not Allowed")
    .required("Please Select Appointment Request Date Time")
    .typeError("Wrong Date")
    .label("Date & Time"),
  alternate_appointment_request_date_time: yup
    .date()
    .nullable()
    .min(new Date(), "Past Date and Time Not Allowed")
    .notRequired()
    .typeError("Wrong Date")
    .label("Alternate Date & Time"),
});
export const validationSchema = () =>
  yup.object().shape({
    members: yup.array().of(
      yup.object().shape({
        name: yup.string().required("Please Enter Member Name").label("Name"),
        contact: yup
          .string()
          .notRequired()
          .nullable()
          .matches(validation.contact.regex, {
            message: "Not valid number",
            excludeEmptyString: true,
          })
          // .min(10, 'Must be exactly 10 digits')
          .max(10, "Must be exactly 10 digits"),
        email: yup.string().nullable().email().label("Email Address"),
        address_line_1: yup
          .string()
          .min(3)
          .required("Please Enter Address 1")
          .label("address line 1"),
        address_line_2: yup.string().nullable().label("address line 2"),
        pincode: yup
          .string()
          .min(6)
          .required("Please Enter Pincode")
          .label("pincode"),
        city_id: yup.string().required("Please Select City").label("city"),
        state_id: yup.string().required("Please Select State").label("state"),
        appointment_request_date_time: yup
          .date()
          .min(new Date(), "Past Date and Time Not Allowed")
          .required("Please Select Appointment Request Date Time")
          .typeError("Wrong Date")
          .label("Date & Time"),
        alternate_appointment_request_date_time: yup
          .date()
          .nullable()
          .min(new Date(), "Past Date and Time Not Allowed")
          .notRequired()
          .typeError("Wrong Date")
          .label("Alternate Date & Time"),
      })
    ),
  });
export const Status = [
  { id: 1, name: "Pending", value: "1" },
  { id: 2, name: "Approved", value: "2" },
  { id: 3, name: "Rejected", value: "3" },
];
export const structure = (
  myModule,
  Dispatch,
  actionObj,
  userTypeName,
  setOpenAppointmentModal,
  setOpenHealthReportModal,
  setOpenCheckupTypeModal,
  setAppointmentStatusModal,
  setOpenReportDownloadModal
) => {
  let data = [];
  const access = !!(myModule?.candelete || myModule?.canwrite)
  const canWrite = !!myModule?.canwrite
  if (userTypeName === "Broker") {
    data = [
      {
        Header: "Policy Number",
        accessor: "policy_number",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.policy?.policy_number;
        //   return <>{value}</>;
        // },
      },
      ...(userTypeName === "Broker" && [{
        Header: "Employer Name",
        accessor: "employer_name",
      }]),
      {
        Header: "Employee Code",
        accessor: "employee_code",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.employee?.code;
        //   return <>{value}</>;
        // },
      },
      {
        Header: "Employee Name",
        accessor: "employee_name",
      },
      {
        Header: "Relation With Employee",
        accessor: "relation_with_employee",
      },
      {
        Header: "Health Check-up Date & Time",
        accessor: "appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
        // sortType: sortTypeWithTime
      },
      {
        Header: "Alternate Health Check-up Date & Time",
        accessor: "alternate_appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.alternate_appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
        // sortType: sortTypeWithTime
      },
      ...(userTypeName === "Broker" && [{
        Header: "Appointment Date Time",
        accessor: "appointment_date_time",
        sortType: sortTypeWithTime,
        Cell: (cell) => {
          let _memberData = {
            employee_member_mapping_id:
              cell.row?.original?.employee_member_mapping_id,
            contact: cell.row?.original?.contact,
            email: cell.row?.original?.email,
            appointment_request_date_time:
              cell.row?.original?.appointment_request_date_time,
            alternate_appointment_request_date_time:
              cell.row?.original?.alternate_appointment_request_date_time,
            address_line_1: cell.row?.original?.address_line_1,
            address_line_2: cell.row?.original?.address_line_2,
            pincode: cell.row?.original?.pincode,
            state_id: cell.row?.original?.state_id,
            city_id: cell.row?.original?.city_id,
            appointment_date_time: cell.row?.original?.appointment_date_time,
          };
          // health_check_up_status
          let valueHCS = cell.row?.original?.is_checkup_done;
          let data = Boolean(cell.row?.original?.checkup_type?.length > 0);
          return Boolean(cell.row?.original?.appointment_date_time) &&
            Boolean(valueHCS) ? (
            DateFormate(cell.row?.original?.appointment_date_time, { type: 'withTime' })
          ) : (
            (data && canWrite && <button
              onClick={() =>
                setOpenAppointmentModal({ flag: true, id: _memberData })
              }
              className="btn btn-primary btn-sm"

            >
              Appointment Date Time
            </button>)
          );
        },
      }, {
        Header: "Appointment Status",
        accessor: "appointment_status",
        Cell: (cell) => {
          let _memberData = {
            employee_member_mapping_id:
              cell.row?.original?.employee_member_mapping_id,
            contact: cell.row?.original?.contact,
            email: cell.row?.original?.email,
            appointment_request_date_time:
              cell.row?.original?.appointment_request_date_time,
            alternate_appointment_request_date_time:
              cell.row?.original?.alternate_appointment_request_date_time,
            address_line_1: cell.row?.original?.address_line_1,
            address_line_2: cell.row?.original?.address_line_2,
            pincode: cell.row?.original?.pincode,
            state_id: cell.row?.original?.state_id,
            city_id: cell.row?.original?.city_id,
            appointment_status_id: cell.row?.original?.appointment_status_id,
            appointment_status: cell.row?.original?.appointment_status,
          };
          let valueHCS = Boolean(cell.row?.original?.is_checkup_done);
          // let __data = "";
          // __data = cell.row?.original?.appointment_status_id === 1?"Pending":"";
          // __data =  cell.row?.original?.appointment_status_id === 2? "Approved":"";
          // __data = cell.row?.original?.appointment_status_id === 3?"Rejected":"";
          if (cell.row?.original?.appointment_status === "Rejected") {
            return cell.row?.original?.appointment_status
          }
          if (cell.row?.original?.appointment_status === "Approved") {
            return cell.row?.original?.appointment_status
          }
          let data = Boolean(cell.row?.original?.checkup_type?.length > 0);
          if (valueHCS) {
            return cell.row?.original?.appointment_status
          }
          return (Boolean(!cell.row?.original?.appointment_date_time?.length)) ? (
            cell.row?.original?.appointment_status
          ) : (

            (data && <button
              onClick={() =>
                setAppointmentStatusModal({ flag: true, id: _memberData })
              }
              className="btn btn-primary btn-sm"
            >
              Appointment Status
            </button>)
          );
        },
      }, {
        Header: "Check Up Type",
        accessor: "checkup_type",
        Cell: (cell) => {
          let value = cell.row?.original?.is_checkup_done;
          let _memberData = {
            employee_member_mapping_id:
              cell.row?.original?.employee_member_mapping_id,
            contact: cell.row?.original?.contact,
            email: cell.row?.original?.email,
            appointment_request_date_time:
              cell.row?.original?.appointment_request_date_time,
            alternate_appointment_request_date_time:
              cell.row?.original?.alternate_appointment_request_date_time,
            address_line_1: cell.row?.original?.address_line_1,
            address_line_2: cell.row?.original?.address_line_2,
            pincode: cell.row?.original?.pincode,
            state_id: cell.row?.original?.state_id,
            city_id: cell.row?.original?.city_id,
            checkup_type: cell.row?.original?.checkup_type,
          };
          return (
            Boolean(value) ? (
              cell.row?.original?.checkup_type
            ) : canWrite && (
              <button
                onClick={() =>
                  setOpenCheckupTypeModal({ flag: true, id: _memberData })
                }
                className="btn btn-primary btn-sm"
              >
                Checkup Type
              </button>
            )
          );
        },
      }, {
        Header: "Status Updated By",
        accessor: "status_updated_by",
      }, {
        Header: "Health Check-Up Done",
        accessor: "is_checkup_done",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cell) => {
          //const [thumbUp, setThumbup] = useState(true);
          // const handleChange = (e) => {
          //   reducerDispatch({
          //     type: "HANDEL_MODAL",
          //     payload: data.row.original,
          //   });
          // };
          let value = cell.row?.original?.is_checkup_done;
          let _memberData = {
            employee_member_mapping_id:
              cell.row?.original?.employee_member_mapping_id,
            contact: cell.row?.original?.contact,
            email: cell.row?.original?.email,
            appointment_request_date_time:
              cell.row?.original?.appointment_request_date_time,
            alternate_appointment_request_date_time:
              cell.row?.original?.alternate_appointment_request_date_time,
            address_line_1: cell.row?.original?.address_line_1,
            address_line_2: cell.row?.original?.address_line_2,
            pincode: cell.row?.original?.pincode,
            state_id: cell.row?.original?.state_id,
            city_id: cell.row?.original?.city_id,
          };
          // let data = Boolean(cell?.row?.original?.appointment_date_time?.length)
          let p = cell?.row?.original?.appointment_status
          switch (value) {
            case 1:
              return (
                <IconButton
                  className="text-success"
                  aria-label="edit"
                // onClick={() => {
                //   swal({
                //     title: "Approve Health Checkup?",
                //     text: "Do you want to approve this health checkup ?",
                //     icon: "warning",
                //     buttons: {
                //       cancel: "Cancel",
                //       catch: {
                //         text: "Approve!",
                //         value: "update",
                //       },
                //     },
                //     dangerMode: true,
                //   })
                //     .then((caseValue) => {
                //       switch (caseValue) {
                //         case "update":
                //           // history.push(`approve-policy/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`)
                //           break;
                //         default:
                //       }
                //     })
                // }}
                >
                  <small>
                    <i className="fas fa-thumbs-up"></i>
                  </small>
                </IconButton>
              );
            case 0:
              return (
                <IconButton
                  className="text-danger"
                  aria-label="edit"
                  disabled={!canWrite}
                  onClick={() => {
                    swal({
                      title: "Approve Health Checkup?",
                      text: "Do you want to approve this health checkup ?",
                      icon: "warning",
                      buttons: {
                        cancel: "Cancel",
                        catch: {
                          text: "Approve!",
                          value: "update",
                        },
                      },
                      dangerMode: true,
                    }).then((caseValue) => {
                      switch (caseValue) {
                        case "update":
                          if (p !== "Approved") {
                            swal({
                              title: "Appointment Status Not Approved",
                              icon: "warning",
                            })
                            return
                          }
                          Dispatch(
                            actionObj.createHealthCheckup({
                              user_type_name: userTypeName,
                              action: "update",
                              members: [
                                { ..._memberData, health_check_up_status: 1 },
                              ],
                            })
                          );
                          // history.push(`approve-policy/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`)
                          break;
                        default:
                      }
                    });
                  }}
                >
                  <small>
                    <i className="fas fa-thumbs-down"></i>
                  </small>
                </IconButton>
              );
            default:
              return <></>;
          }
        },
      },
      {
        Header: "Health Check-Up Report",
        accessor: "document_data",
        disableFilters: true,
        disableSortBy: true,
        Cell: (cell) => {
          let _memberData = {
            employee_member_mapping_id:
              cell.row?.original?.employee_member_mapping_id,
            contact: cell.row?.original?.contact,
            email: cell.row?.original?.email,
            appointment_request_date_time:
              cell.row?.original?.appointment_request_date_time,
            alternate_appointment_request_date_time:
              cell.row?.original?.alternate_appointment_request_date_time,
            address_line_1: cell.row?.original?.address_line_1,
            address_line_2: cell.row?.original?.address_line_2,
            pincode: cell.row?.original?.pincode,
            state_id: cell.row?.original?.state_id,
            city_id: cell.row?.original?.city_id,
            health_check_up_report: cell.row?.original?.health_check_up_report,

          };
          // let value = cell.row?.original?.health_check_up_report;
          let valueHCS = cell.row?.original?.is_checkup_done;
          return (
            Boolean(valueHCS) ? (
              <button className={classes.chips} onClick={() =>
                setOpenReportDownloadModal({ flag: true, id: cell.row?.original?.document_data })
              }>
                Report<i className="ml-2 far fa-folder-open"></i>
              </button>
            ) : canWrite && (
              <button
                onClick={() =>
                  setOpenHealthReportModal({ flag: true, id: _memberData })
                }
                className={`btn btn-primary btn-sm`}
              >
                Upload
              </button>
            )
          );
        },
      }]),
      ...access ? [{
        Header: "Operations",
        accessor: "actions",
        disableFilters: true,
        disableSortBy: true,
      }] : [],
    ];
  } else if (userTypeName === "Employer") {
    data = [
      {
        Header: "Policy Number",
        accessor: "policy_number",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.policy?.policy_number;
        //   return <>{value}</>;
        // },
      },
      {
        Header: "Employee Code",
        accessor: "employee_code",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.employee?.code;
        //   return <>{value}</>;
        // },
      },
      {
        Header: "Employee Name",
        accessor: "employee_name",
      },
      {
        Header: "Relation With Employee",
        accessor: "relation_with_employee",
      },
      {
        Header: "Health Check-up Date & Time",
        accessor: "appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },
      {
        Header: "Alternate Health Check-up Date & Time",
        accessor: "alternate_appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.alternate_appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },
      {
        Header: "Request Date",
        accessor: "request_date",
        disableSortBy: true,
        Cell: (cell) => {
          let data = Boolean(
            cell?.row?.original?.appointment_request_date_time?.length
          )
            ? DateFormate(cell?.row?.original?.appointment_request_date_time, { type: 'withTime' })
            : "-";
          return <p>{data}</p>;
        },
      }, {
        Header: "Appointment Status",
        accessor: "appointment_status",
      },
      {
        Header: "Appointment Date and Time",
        accessor: "appointment_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.appointment_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },
      {
        Header: "Check Up Type",
        accessor: "checkup_type",
      },
      ...access ? [{
        Header: "Operations",
        accessor: "actions",
        disableFilters: true,
        disableSortBy: true,
      }] : [],
    ];
  } else if (userTypeName === "Employee") {
    data = [
      {
        Header: "Policy Number",
        accessor: "policy_number",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.policy?.policy_number;
        //   return <>{value}</>;
        // },
      },
      {
        Header: "Employee Code",
        accessor: "employee_code",
        // Cell: (cell) => {
        //   let value = cell.row?.original?.employee?.code;
        //   return <>{value}</>;
        // },
      },
      {
        Header: "Employee Name",
        accessor: "employee_name",
      },
      {
        Header: "Relation With Employee",
        accessor: "relation_with_employee",
      },
      {
        Header: "Health Check-up Date & Time",
        accessor: "appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },
      {
        Header: "Alternate Health Check-up Date & Time",
        accessor: "alternate_appointment_request_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.alternate_appointment_request_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },
      {
        Header: "Request Date",
        accessor: "request_date",
        Cell: (cell) => {
          let data = Boolean(
            cell?.row?.original?.appointment_request_date_time?.length
          )
            ? DateFormate(cell?.row?.original?.appointment_request_date_time, { type: 'withTime' })
            : "-";
          return <p>{data}</p>;
        },
        disableSortBy: true,
      }, {
        Header: "Appointment Status",
        accessor: "appointment_status",
      },
      {
        Header: "Appointment Date and Time",
        accessor: "appointment_date_time",
        Cell: (cell) => {
          return DateFormate(cell.row?.original?.appointment_date_time, { type: 'withTime' })
        },
        disableSortBy: true,
      },

      {
        Header: "Check Up Type",
        accessor: "checkup_type",
      },
      ...access ? [{
        Header: "Operations",
        accessor: "actions",
        disableFilters: true,
        disableSortBy: true,
      }] : [],
    ];
  }
  return data;
};

export const data = [
  {
    actions: "actions",
    health_checkup_report: "health_checkup_report",
    health_checkup_done: "health_checkup_done",
    confirm_by: "confirm_by",
    check_up_type: "check_up_type",
    appointment_date_time_and_time: "appointment_date_time_and_time",
    health_appointment_request_date_time_and_time: "health_appointment_request_date_time_and_time",
    relation_with_employee: "relation_with_employee",
    employee_name: "employee_name",
    employee_code: "employee_code",
    employer_name: "employer_name",
    policy_no: "policy_no",
  },
  {
    actions: "actions",
    health_checkup_report: "health_checkup_report",
    health_checkup_done: "health_checkup_done",
    confirm_by: "confirm_by",
    check_up_type: "check_up_type",
    appointment_date_time_and_time: "appointment_date_time_and_time",
    health_appointment_request_date_time_and_time: "health_appointment_request_date_time_and_time",
    relation_with_employee: "relation_with_employee",
    employee_name: "employee_name",
    employee_code: "employee_code",
    employer_name: "employer_name",
    policy_no: "policy_no",
  },
  {
    actions: "actions",
    health_checkup_report: "health_checkup_report",
    health_checkup_done: "health_checkup_done",
    confirm_by: "confirm_by",
    check_up_type: "check_up_type",
    appointment_date_time_and_time: "appointment_date_time_and_time",
    health_appointment_request_date_time_and_time: "health_appointment_request_date_time_and_time",
    relation_with_employee: "relation_with_employee",
    employee_name: "employee_name",
    employee_code: "employee_code",
    employer_name: "employer_name",
    policy_no: "policy_no",
  },
  {
    actions: "actions",
    health_checkup_report: "health_checkup_report",
    health_checkup_done: "health_checkup_done",
    confirm_by: "confirm_by",
    check_up_type: "check_up_type",
    appointment_date_time_and_time: "appointment_date_time_and_time",
    health_appointment_request_date_time_and_time: "health_appointment_request_date_time_and_time",
    relation_with_employee: "relation_with_employee",
    employee_name: "employee_name",
    employee_code: "employee_code",
    employer_name: "employer_name",
    policy_no: "policy_no",
  },
  {
    actions: "actions",
    health_checkup_report: "health_checkup_report",
    health_checkup_done: "health_checkup_done",
    confirm_by: "confirm_by",
    check_up_type: "check_up_type",
    appointment_date_time_and_time: "appointment_date_time_and_time",
    health_appointment_request_date_time_and_time: "health_appointment_request_date_time_and_time",
    relation_with_employee: "relation_with_employee",
    employee_name: "employee_name",
    employee_code: "employee_code",
    employer_name: "employer_name",
    policy_no: "policy_no",
  },
];

export const ErrorSheetTable = [
  {
    Header: "Policy Number",
    accessor: "policy_number",
  },
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Employer Name",
    accessor: "employer_name"
  },
  {
    Header: "Total No Of Employees",
    accessor: "total_no_of_employees",
  },
  {
    Header: "No Of Employees Uploaded",
    accessor: "no_of_employees_uploaded",
  },
  {
    Header: "No Of Employees Failed To Upload",
    accessor: "no_of_employees_failed_to_upload",
  },
  {
    Header: "Original Document",
    accessor: "original_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => {
      return (
        <>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="text-secondary" href={cell.row?.original?.original_document_url} download>
            <i className="ti ti-download"></i>
          </a>
        </>
      );
    },
  },
  {
    Header: "Error Document",
    accessor: "error_document_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => {
      return (
        <>
          {_.isEqual(cell.row?.original?.status, "Failed") && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a className="text-secondary" href={cell.row?.original?.error_document_url} download>
              <i className="ti ti-download"></i>
            </a>
          )}
        </>
      );
    },
  },
  {
    Header: "Uploaded At",
    accessor: "uploaded_at",
    sortType: sortTypeWithTime,
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
