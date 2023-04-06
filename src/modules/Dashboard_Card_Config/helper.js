import React from "react";
import * as yup from "yup";

export let schemaCardConfig = yup.object().shape({
  heading: yup.string().required().max(24).label("Heading"),
  sub_heading: yup.string().max(25).nullable(true).label("Sub Heading"),
  // description: yup.string().max(6).nullable(true).label("Description"),
  redirect_url: yup.string().label("URL"),
  redirect_url_external: yup.string().url().label("URL"),
  cardBackground: yup.string().required().label("Background"),
  cardColor: yup.string().required().label("Color"),
  textColor: yup.string().required().label("Text Color"),
});

export let schemaCardSequencing = yup.object().shape({
  employer_id: yup.object().shape({
    id: yup.string().required('Employer Required'),
  }),
});

export const initialState = {
  loading: true,
  selectedModuleData: null,
  selectedModuleDataForUpdate: null,
  getAllCardsDetail: [],
  updateCardModalData: {
    show: false,
    data: {},
  },
  viewCardModalData: {
    show: false,
    data: {},
  },
  employerID: false,
  setDashboardCardMapping: [],
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "Loading":
      return {
        ...state,
        loading: payload,
      };
    case "Set_All_Card_Details":
      return {
        ...state,
        getAllCardsDetail: payload,
      };
    case "Set_Update_Card_Modal":
      return {
        ...state,
        updateCardModalData: payload,
      };
    case "Set_View_Card_Modal":
      return {
        ...state,
        viewCardModalData: payload,
      };
    case "Set_Employer_ID":
      return {
        ...state,
        employerID: payload,
      };
    case "Set_Dashboard_Card_Mapping":
      return {
        ...state,
        setDashboardCardMapping: payload,
      };
    default:
      return state;
  }
};

export const _UI = (url) => {
  return <img src={url} alt="" style={{ maxHeight: "50px" }} />;
};

export const _viewColor = ({ value }) => (
  <input
    style={{ border: "0px" }}
    type="color"
    defaultValue={value}
    disabled={true}
  />
)


export const structure = (reducerDispatch, access) => [
  {
    Header: "Heading",
    accessor: "heading",
  },
  {
    Header: "Sub Heading",
    accessor: "sub_heading",
  },
  // {
  //   Header: "Description",
  //   accessor: "description",
  // },
  {
    Header: "URL",
    accessor: "redirect_url",
  },
  {
    Header: "Card Background",
    accessor: "theme_json.cardBackground",
    disableFilters: true,
    disableSortBy: true,
    Cell: _viewColor
  },
  {
    Header: "Color",
    accessor: "theme_json.cardColor",
    disableFilters: true,
    disableSortBy: true,
    Cell: _viewColor
  },
  {
    Header: "Text Color",
    accessor: "theme_json.textColor",
    disableFilters: true,
    disableSortBy: true,
    Cell: _viewColor
  },
  {
    Header: "Image",
    accessor: "image",
    disableFilters: true,
    disableSortBy: true,
    Cell: (data) => {
      return (
        <img
          style={{ maxHeight: "50px" }}
          src={data.row.original.image}
          alt=""
        />
      );
    },
  },
  {
    Header: "Card",
    accessor: "card",
    disableFilters: true,
    disableSortBy: true,
    Cell: (data) => {
      const handleChange = (e) => {
        reducerDispatch({
          type: "Set_View_Card_Modal",
          payload: {
            show: true,
            data: data.row.original,
          },
        });
      };
      return (
        <button
          className="btn btn-outline-primary btn-sm"
          aria-label="edit"
          onClick={handleChange}
        >
          <i className="fas fa-eye"></i>
        </button>
      );
    },
  },
  ...access ? [{
    Header: "Operations",
    accessor: "operations",
  }] : [],
];
