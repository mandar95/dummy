import React from "react";
import {
  SwitchInput,
  CustomControl,
  SwitchContainer,
} from "../EndorsementRequest/custom-sheet/components";
import { IconButton } from "@material-ui/core";
import { Button } from "react-bootstrap";
import common from "../../config/validations/common";
import * as yup from "yup";
export const Levels = [
  { id: 1, name: 'Level 1', value: 'Level 1' },
  { id: 2, name: 'Level 2', value: 'Level 2' },
  { id: 3, name: 'Level 3', value: 'Level 3' },
];
export const schemaServiceAccountManager = yup.object().shape({
  code: yup.string().required().matches(/^[aA-zZ0-9\-/\s]+$/, "Only Alphabets, Numbers, - and / allowed for this field ").label('Service Agent/RM ID'),
  name: yup.string().required().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").min(3).label('Service Agent/RM Name'),
  email: yup.string().required().email().label('Email Address'),
  mobile: yup
    .string()
    .matches(common.mobile.regex, "Phone number is not valid")
    .required()
    .max(10).label('Mobile Number'),
  level: yup
    .string()
    .required()
});
export const initialState = {
  loading: true,
  details: [],
  selectInput: [],
  selectInputModel: [],
  statesList: [],
  modalData: {
    show: false,
    data: null,
  },
  switchInput: [],
  detailswithzone: [],
};
export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    case "ON_FETCH":
      return {
        ...state,
        loading: false,
        details: [...(payload.data) || []],
      };
    case "ON_HIDE":
      return {
        ...state,
        loading: false,
      };
    case "ON_SELECT":
      return {
        ...state,
        selectInput: payload,
      };
    case "ON_SELECT_MODAL":
      return {
        ...state,
        selectInputModel: payload,
      };
    case "ON_STATE_FETCH":
      return {
        ...state,
        statesList: [...(payload || [])],
      };
    case "HANDEL_MODAL":
      return {
        ...state,
        modalData: {
          show: true,
          data: payload,
        },
      };
    case "HANDEL_MODAL_HIDE":
      return {
        ...state,
        modalData: {
          show: false,
          data: null,
        },
      };
    case "ON_FETCH_CREATE_ZONE":
      return {
        ...state,
        detailswithzone: payload,
      };
    default:
      return state;
  }
};

export const structure = (reducerDispatch, Update, Fetch, myModule) => [
  {
    Header: "Service Agent/RM ID",
    accessor: "service_manager_code",
  },
  {
    Header: "Service Agent/RM Name",
    accessor: "service_manager_name",
  },
  {
    Header: "State",
    accessor: "state",
    Cell: (data) => data.value.map(({ name }, index) =>
    (<Button key={name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
      {name}
    </Button>)),
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const keywords = row.values[id];
        return keywords.some(({ name }) =>
          String(name).toLowerCase().includes(String(filterValue).trimStart().toLowerCase())
        );
      });
    },
  },
  {
    Header: "Zones",
    accessor: "zones",
    // disableFilters: true,
    disableSortBy: true,
    Cell: (data) => data.value.map((zone, index) =>
    (<Button key={zone + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
      {zone}
    </Button>)),
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const keywords = row.values[id];
        return keywords.some((zone) =>
          String(zone).toLowerCase().includes(String(filterValue).trimStart().toLowerCase())
        );
      });
    },
  },
  {
    Header: "Level",
    accessor: "service_manager_level",
  },
  {
    Header: "Email",
    accessor: "service_manager_email",
  },
  {
    Header: "Mobile Number",
    accessor: "service_manager_mobile_no",
  },

  ...!!(myModule?.candelete) ? [
    {
      Header: "Status",
      accessor: "status",
      disableFilters: true,
      disableSortBy: true,

      Cell: (data) => {
        const handleChange = (e) => {
          // reducerDispatch({
          //   type: "HANDEL_SWITCH",
          //   payload: data.row.original,
          // });
          reducerDispatch({
            type: "LOADING",
          });
          if (data.row.original.status === "Inactive") {
            Update(
              { status: "Active", id: data.row.original.id },
              reducerDispatch,
              Fetch
            );
          }
          if (data.row.original.status === "Active") {
            Update(
              { status: "Inactive", id: data.row.original.id },
              reducerDispatch,
              Fetch
            );
          }
        };
        return (
          <CustomControl>
            <SwitchContainer>
              <label>
                <SwitchInput
                  checked={data.value === "Active" ? true : false}
                  onChange={handleChange}
                  type="checkbox"
                />
                <div>
                  <div></div>
                </div>
              </label>
            </SwitchContainer>
          </CustomControl>
        );
      },
    },
    {
      Header: "Action",
      accessor: "update",
      disableFilters: true,
      disableSortBy: true,
      Cell: (data) => {
        const handleChange = (e) => {
          reducerDispatch({
            type: "HANDEL_MODAL",
            payload: data.row.original,
          });
        };
        return (
          <IconButton
            className="text-success"
            aria-label="edit"
            onClick={handleChange}
          >
            <small>
              <i className="fas fa-pencil-alt"></i>
            </small>
          </IconButton>
        );
      },
    }] : [],
];
