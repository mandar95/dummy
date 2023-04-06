import { sortType, _renderDocument, _renderRatings } from "../../components";
import { RenderReply, _renderStatusAction } from "./component.helper";

export const FAQBroker = (read) => [
  {
    Header: "Employer",
    accessor: "employer_name"
  },
  {
    Header: "Policy Type",
    accessor: "policy_sub_type"
  },
  {
    Header: "FAQ",
    accessor: "question"
  },
  {
    Header: "Answer",
    accessor: "answer"
  },
  ...(read ? [{
    Header: "Operations",
    accessor: "operations"
  }] : [])

];

export const BrokerFeedBack = [
  {
    Header: "User Name",
    accessor: "name"
  },
  {
    Header: "Employee Code",
    accessor: "employee_code"
  },
  {
    Header: "Feedback",
    accessor: "feedback"
  },
  {
    Header: "Ratings",
    accessor: "ratings",
    Cell: _renderRatings,
    disableFilters: true,
    disableSortBy: true,
  }
]


export const QueryComplaintBroker = (write, employeeId) => [
  {
    Header: "Query ID",
    accessor: "query_id"
  },
  {
    Header: "Query Type",
    accessor: "query_type"
  },
  {
    Header: "Subtype",
    accessor: "query_sub_type"
  },
  {
    Header: "Raised To",
    accessor: "raise_to",
    className: "text-nowrap",
  },
  {
    Header: "Raised By",
    accessor: "raised_by"
  },
  {
    Header: "Employee Code",
    accessor: "employee_code"
  },
  {
    Header: "Comments",
    accessor: "comments"
  },
  {
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
  },
  {
    Header: "Resolution",
    accessor: "resolution"
  },
  {
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
  },
  ...(write ? [{
    Header: "Reply",
    accessor: "reply",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => RenderReply(cell, { isReply: false, employeeId })
  }] : [])
  ,
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  },
  {
    Header: "Document",
    accessor: "document",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderDocument
  },
  {
    Header: "Resolution TAT",
    accessor: "resolution_tat"
  }
];

export const QueryComplaintEmployee = [
  {
    Header: "Query ID",
    accessor: "query_id"
  },
  {
    Header: "Query Type",
    accessor: "query_type"
  },
  {
    Header: "Subtype",
    accessor: "query_sub_type"
  },
  {
    Header: "Comments",
    accessor: "comments"
  },
  {
    Header: "Document",
    accessor: "document",
    Cell: _renderDocument,
  },
  {
    Header: "Raised To",
    accessor: "raise_to",
    className: "text-nowrap",
  },
  {
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
  },
  {
    Header: "Resolution",
    accessor: "resolution"
  },
  {
    Header: "Resolution TAT",
    accessor: "resolution_tat"
  },
  {
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
  },
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  }
];

export const QueryComplaintBrokerOrg = (write, isReply) => [
  {
    Header: "Query ID",
    accessor: "query_id"
  },
  {
    Header: "Query Type",
    accessor: "query_type"
  },
  {
    Header: "Subtype",
    accessor: "query_sub_type"
  },
  {
    Header: "Comments",
    accessor: "comments"
  },
  {
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
  },
  {
    Header: "Raised By",
    accessor: "raised_by"
  },
  {
    Header: "Resolution",
    accessor: "resolution"
  },
  {
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
  },
  ...(write ? [{
    Header: "Reply",
    accessor: "reply",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => RenderReply(cell, { isReply })
  }] : [])
  ,
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  },
  {
    Header: "Document",
    accessor: "document",
    Cell: _renderDocument,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Resolution TAT",
    accessor: "resolution_tat"
  }
];

export const QueryComplaintInsurerOrg = (isReply, myModule) => [
  {
    Header: "Query ID",
    accessor: "query_id"
  },
  {
    Header: "Query Type",
    accessor: "query_type"
  },
  {
    Header: "Subtype",
    accessor: "query_sub_type"
  },
  {
    Header: "Comments",
    accessor: "comments"
  },
  {
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
  },
  {
    Header: "Raised By",
    accessor: "raised_by"
  },
  {
    Header: "Resolution",
    accessor: "resolution"
  },
  {
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
  },
  ...(myModule?.canwrite ? [{
    Header: "Reply",
    accessor: "reply",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => RenderReply(cell, { isReply })
  }] : []),
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  },
  {
    Header: "Document",
    accessor: "document",
    Cell: _renderDocument,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Resolution TAT",
    accessor: "resolution_tat"
  }
];

export const QueryComplaintEmployerOrg = (write, isReply) => [
  {
    Header: "Query ID",
    accessor: "query_id"
  },
  {
    Header: "Query Type",
    accessor: "query_type"
  },
  {
    Header: "Subtype",
    accessor: "query_sub_type"
  },
  {
    Header: "Comments",
    accessor: "comments"
  },
  {
    Header: "Raised On",
    accessor: "raised_on",
    sortType: sortType
  },
  {
    Header: "Raised By",
    accessor: "raised_by"
  },
  {
    Header: "Resolution",
    accessor: "resolution"
  },
  {
    Header: "Resolved On",
    accessor: "resolved_on",
    sortType: sortType
  },
  ...(write ? [{
    Header: "Reply",
    accessor: "reply",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => RenderReply(cell, { isReply })
  }] : [])
  ,
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  },
  {
    Header: "Document",
    accessor: "document",
    Cell: _renderDocument,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Resolution TAT",
    accessor: "resolution_tat"
  }
];


export const EscalationMatrixColumn = (write) => [
  {
    Header: "Start Level",
    accessor: "start_level_name"
  },
  {
    Header: "End Level",
    accessor: "end_level_name"
  },
  {
    Header: "Time To Live",
    accessor: "time"
  },
  ...write ? [{
    Header: "Operations",
    accessor: "operation"
  }] : []
];
