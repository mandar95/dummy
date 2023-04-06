import React from 'react';
import { Button } from "react-bootstrap";
import { _renderImage, _renderInvoice, _renderImage2, _downloadBtn } from "../../components";
import {
  // get
  getCountries,
  loadTPA,
  loadTPAServices,
  loadRelation,
  loadDesignation,
  loadConstruct,
  loadPolicyTypes,
  loadPremium,
  loadInsurer,
  loadAlignment,
  loadPosition,
  loadSumInsured,
  loadSubSumInsured,
  loadSize,
  loadQuery,
  loadGrade,
  loadQuerySubType,
  loadPolicySubType,
  loadPolicyContent,
  loadInsurerType,
  loadAnnouncement,
  loadAnnouncementSubType,
  loadDashboardIcone,
  loadSampleFormat,
  loadNotificationType,
  loadCampaign,
  //update
  editPolicy,
  // delete
  deleteTPAService,
  deleteAlignment,
  deletePosition,
  deleteSumInsured,
  deleteSubSumInsured,
  deleteSize,
  deleteCountry,
  deleteDesignation,
  deleteTPA,
  deleteQuery,
  deletePolicy,
  deleteRelation,
  deleteConstruct,
  deleteGrade,
  deleteQuerySubType,
  deleteInsurer,
  deletePolicySubType,
  deletePolicyContent,
  deleteInsurerType,
  deleteAnnouncement,
  deleteAnnouncementSubType,
  deletePremium,
  deleteDashboardIcone,
  deleteSampleFormat,
  deleteNotificationAction,
  deleteCampaign,
  //optional
  clearResponse

} from "./master.slice";

const _btnGroup = (cell) => {
  // return cell.value.map(({ campaign_code }, index) =>
  //   <Button key={campaign_code + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
  //     {campaign_code}
  //   </Button>)
  return <Button disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
      {cell.value}
    </Button>
}

export const MasterUserTypeData = [
  { name: 'Super Admin', id: 1 },
  { name: 'Admin', id: 2 },
  { name: 'Broker', id: 3 },
  { name: 'Employer', id: 4 },
  { name: 'Employee', id: 5 },
  { name: 'Insurer', id: 6 },
  { name: 'Customer', id: 7 },
]

export const NotificationTypeData = [
  { name: 'Actionable', id: 1 },
  { name: 'Non-Actionable', id: 2 },
]

const SrNo = {
  Header: "Sr No.",
  accessor: "index",
}

const Operations = {
  Header: "Operations",
  accessor: "operations",
}

export const columnHeader = (master_type) => {
  switch (master_type) {
    case 1: return ([
      SrNo,
      {
        Header: "Position",
        accessor: "name",
      },
      Operations
    ]);
    case 2: return ([
      SrNo,
      {
        Header: "Size",
        accessor: "name",
      },
      {
        Header: "Value",
        accessor: "response_name",
      },
      Operations
    ]);
    case 3: return ([
      SrNo,
      {
        Header: "Alignment",
        accessor: "name",
      },
      Operations
    ]);
    case 4: return ([
      SrNo,
      {
        Header: "Designation",
        accessor: "name",
      },
      Operations
    ]);
    case 5: return ([
      SrNo,
      {
        Header: "Email Type",
        accessor: "name",
      },
      Operations
    ]);
    case 6: return ([
      SrNo,
      {
        Header: "Insurer Type",
        accessor: "name",
      },
      {
        Header: "Bike Info",
        accessor: "has_bike_info",
      },
      {
        Header: "Car Info",
        accessor: "has_car_info",
      },
      {
        Header: "Travel Info",
        accessor: "has_travel_info",
      },
      {
        Header: "Logo",
        accessor: "image",
        Cell: _renderImage,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 7: return ([
      SrNo,
      {
        Header: "Annoucement Type",
        accessor: "name",
      },
      Operations
    ]);
    case 8: return ([
      SrNo,
      {
        Header: "Bank",
        accessor: "name",
      },
      Operations
    ]);
    case 9: return ([
      SrNo,
      {
        Header: "Bank Branch",
        accessor: "name",
      },
      Operations
    ]);
    case 10: return ([
      SrNo,
      {
        Header: "City",
        accessor: "name",
      },
      Operations
    ]);

    case 11: return ([
      SrNo,
      {
        Header: "Countries",
        accessor: "name",
      },
      Operations
    ]);
    case 12: return ([
      SrNo,
      {
        Header: "Document Type",
        accessor: "name",
      },
      Operations
    ]);
    case 13: return ([
      SrNo,
      {
        Header: "Family Construct",
        accessor: "name",
      },
      {
        Header: "No. of Adults",
        accessor: "no_of_adult",
      },
      {
        Header: "No. of Childs",
        accessor: "no_of_child",
      },
      Operations
    ]);
    case 14: return ([
      SrNo,
      {
        Header: "Fields",
        accessor: "name",
      },
      Operations
    ]);
    case 15: return ([
      SrNo,
      {
        Header: "Flex Benefits",
        accessor: "name",
      },
      Operations
    ]);
    case 16: return ([
      SrNo,
      {
        Header: "Grades",
        accessor: "grade",
      },
      Operations
    ]);
    case 17: return ([
      SrNo,
      {
        Header: "Insurer",
        accessor: "name",
      },
      {
        Header: "Logo",
        accessor: "logo_path",
        Cell: _renderImage,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 18: return ([
      SrNo,
      {
        Header: "Invoice",
        accessor: "name",
        Cell: _renderInvoice,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 19: return ([
      SrNo,
      {
        Header: "Modules",
        accessor: "name",
      },
      Operations
    ]);
    case 20: return ([
      SrNo,
      {
        Header: "Plan",
        accessor: "name",
      },
      Operations
    ]);
    case 21: return ([
      SrNo,
      {
        Header: "Policy Type",
        accessor: "name",
      },
      Operations
    ]);
    case 22: return ([
      SrNo,
      {
        Header: "Queries",
        accessor: "name",
      },
      Operations
    ]);
    case 23: return ([
      SrNo,
      {
        Header: "State",
        accessor: "name",
      },
      Operations
    ]);
    case 24: return ([
      SrNo,
      {
        Header: "TPA Name",
        accessor: "tpa_name"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Url",
        accessor: "url"
      },
      {
        Header: "Username",
        accessor: "username",
      },
      Operations
    ]);
    case 25: return ([
      SrNo,
      {
        Header: "Use Type",
        accessor: "name",
      },
      Operations
    ]);
    case 26: return ([
      SrNo,
      {
        Header: "Pincode",
        accessor: "name",
      },
      Operations
    ]);
    case 27: return ([
      SrNo,
      {
        Header: "Plan Features",
        accessor: "name",
      },
      Operations
    ]);
    case 28: return ([
      SrNo,
      {
        Header: "Policy Contents",
        accessor: "content",
      },
      {
        Header: "Logo",
        accessor: "image",
        Cell: _renderImage,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 29: return ([
      SrNo,
      {
        Header: "Policy Sub Type",
        accessor: "name",
      },
      {
        Header: "Master Policy",
        accessor: "master_policy_name",
      },
      Operations
    ]);
    case 30: return ([
      SrNo,
      {
        Header: "Query Sub Type",
        accessor: "name",
      },
      {
        Header: "Master Query ",
        accessor: "master_query",
      },
      Operations
    ]);
    case 31: return ([
      SrNo,
      {
        Header: "Relation Master",
        accessor: "name",
      },
      Operations
    ]);
    case 32: return ([
      SrNo,
      {
        Header: "Report Master",
        accessor: "name",
      },
      Operations
    ]);
    case 33: return ([
      SrNo,
      {
        Header: "Sample Documents",
        accessor: "name",
      },
      Operations
    ]);
    case 34: return ([
      SrNo,
      {
        Header: "Sum insured Types",
        accessor: "name",
      },
      Operations
    ]);
    case 35: return ([
      SrNo,
      {
        Header: "Sum insured Sub Types",
        accessor: "name",
      },
      Operations
    ]);
    case 36: return ([
      SrNo,
      {
        Header: "TPA",
        accessor: "name",
      },
      Operations
    ]);
    case 37: return ([
      SrNo,
      {
        Header: "Premium",
        accessor: "name",
      },
      Operations
    ]);
    case 38: return ([
      SrNo,
      {
        Header: "Announcement Sub Type",
        accessor: "name",
      },
      {
        Header: "Master Type",
        accessor: "master_type_name",
      },
      Operations
    ]);
    case 39: return ([
      SrNo,
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "User Type",
        accessor: "user_type",
      },
      {
        Header: "Logo",
        accessor: "icon",
        Cell: _renderImage2,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 40: return ([
      SrNo,
      {
        Header: "Sample Name",
        accessor: "sample_name",
      },
      {
        Header: "Sample Type ID",
        accessor: "sample_type_id",
      },
      {
        Header: "File",
        accessor: "upload_path",
        Cell: _downloadBtn,
        disableFilters: true,
        disableSortBy: true,
      },
      Operations
    ]);
    case 41: return ([
      SrNo,
      {
        Header: "Action Name",
        accessor: "name",
      },
      {
        Header: "Action URL",
        accessor: "url",
      },
      {
        Header: "notification Type",
        accessor: "notification_type_name",
      },
      Operations
    ]);
    case 42: return ([
      SrNo,
      {
        Header: "Campaign Name",
        accessor: "name",
      },
      {
        Header: "Campaign Code",
        accessor: "codes",
        Cell: _btnGroup
      },
      Operations
    ]);
    default: return [];
  }
}


export const getMaster = (master_type, dispatch) => {
  switch (master_type) {
    case 1: return (dispatch(loadPosition()))
    case 2: return (dispatch(loadSize()))
    case 3: return (dispatch(loadAlignment()))
    case 4: return (dispatch(loadDesignation()))
    case 5: return (dispatch(clearResponse())) // removed
    case 6: return (dispatch(loadInsurerType()))
    case 7: return (dispatch(loadAnnouncement()))
    case 8: return (dispatch(clearResponse())) // removed
    case 9: return (dispatch(clearResponse())) // removed
    case 10: return (dispatch(clearResponse())) // removed
    case 11: return (dispatch(getCountries()))
    case 12: return (dispatch(clearResponse())) //removed
    case 13: return (dispatch(loadConstruct()))
    case 14: return (dispatch(clearResponse())) //removed
    case 15: return (dispatch(clearResponse())) //alreadyDone
    case 16: return (dispatch(loadGrade()))
    case 17: return (dispatch(loadInsurer()))
    case 18: return (dispatch(clearResponse())) //removed
    case 19: return (dispatch(clearResponse())) //alreadyDone
    case 20: return (dispatch(clearResponse())) //removed
    case 21: return (dispatch(loadPolicyTypes()))
    case 22: return (dispatch(loadQuery()))
    case 23: return (dispatch(clearResponse())) //removed
    case 24: return (dispatch(loadTPAServices()))
    case 25: return (dispatch(clearResponse())) //removed
    case 26: return (dispatch(clearResponse())) //removed
    case 27: return (dispatch(clearResponse())) //removed
    case 28: return (dispatch(loadPolicyContent()))
    case 29: return (dispatch(loadPolicySubType()))
    case 30: return (dispatch(loadQuerySubType()))
    case 31: return (dispatch(loadRelation()))
    case 32: return (dispatch(clearResponse())) //removed
    case 33: return (dispatch(clearResponse())) //removed
    case 34: return (dispatch(loadSumInsured()))
    case 35: return (dispatch(loadSubSumInsured()))
    case 36: return (dispatch(loadTPA()))
    case 37: return (dispatch(loadPremium()))
    case 38: return (dispatch(loadAnnouncementSubType()))
    case 39: return (dispatch(loadDashboardIcone()))
    case 40: return (dispatch(loadSampleFormat()))
    case 41: return (dispatch(loadNotificationType()))
    case 42: return (dispatch(loadCampaign()))
    default:
  }
}

export const deleteMaster = (dispatch, master_type, id) => {
  switch (master_type) {
    case 1: return (dispatch(deletePosition(id)))
    case 2: return (dispatch(deleteSize(id)))
    case 3: return (dispatch(deleteAlignment(id)))
    case 4: return (dispatch(deleteDesignation(id)))
    case 5: return (dispatch(clearResponse(id))) // removed
    case 6: return (dispatch(deleteInsurerType(id)))
    case 7: return (dispatch(deleteAnnouncement(id)))
    case 8: return (dispatch(clearResponse(id))) // removed
    case 9: return (dispatch(clearResponse(id))) // removed
    case 10: return (dispatch(clearResponse(id))) // removed
    case 11: return (dispatch(deleteCountry(id)))
    case 12: return (dispatch(clearResponse(id))) //removed
    case 13: return (dispatch(deleteConstruct(id)))
    case 14: return (dispatch(clearResponse(id))) //removed
    case 15: return (dispatch(clearResponse(id))) //alreadyDone
    case 16: return (dispatch(deleteGrade(id)))
    case 17: return (dispatch(deleteInsurer(id)))
    case 18: return (dispatch(clearResponse(id))) //removed
    case 19: return (dispatch(clearResponse(id))) //alreadyDone
    case 20: return (dispatch(clearResponse(id))) //removed
    case 21: return (dispatch(deletePolicy(id)))
    case 22: return (dispatch(deleteQuery(id)))
    case 23: return (dispatch(clearResponse(id))) //removed
    case 24: return (dispatch(deleteTPAService(id)))
    case 25: return (dispatch(clearResponse(id))) //removed
    case 26: return (dispatch(clearResponse(id))) //removed
    case 27: return (dispatch(clearResponse(id))) //removed
    case 28: return (dispatch(deletePolicyContent(id)))
    case 29: return (dispatch(deletePolicySubType(id)))
    case 30: return (dispatch(deleteQuerySubType(id)))
    case 31: return (dispatch(deleteRelation(id)))
    case 32: return (dispatch(clearResponse(id))) //removed
    case 33: return (dispatch(clearResponse(id))) //removed
    case 34: return (dispatch(deleteSumInsured(id)))
    case 35: return (dispatch(deleteSubSumInsured(id)))
    case 36: return (dispatch(deleteTPA(id)))
    case 37: return (dispatch(deletePremium(id)))
    case 38: return (dispatch(deleteAnnouncementSubType(id)))
    case 39: return (dispatch(deleteDashboardIcone(id)))
    case 40: return (dispatch(deleteSampleFormat(id)))
    case 41: return (dispatch(deleteNotificationAction(id)))
    case 42: return (dispatch(deleteCampaign(id)))
    default:
  }
}


export const editMaster = (dispatch, master_type, id, data) => {
  switch (master_type) {
    case 1: return (dispatch(clearResponse(data, id)))
    case 2: return (dispatch(clearResponse(data, id)))
    case 3: return (dispatch(clearResponse(data, id)))
    case 4: return (dispatch(clearResponse(data, id)))
    case 5: return (dispatch(clearResponse(data, id)))
    case 6: return (dispatch(clearResponse(data, id)))
    case 7: return (dispatch(clearResponse(data, id)))
    case 8: return (dispatch(clearResponse(data, id)))
    case 9: return (dispatch(clearResponse(data, id)))
    case 10: return (dispatch(clearResponse(data, id)))
    case 11: return (dispatch(clearResponse(data, id)))
    case 12: return (dispatch(clearResponse(data, id)))
    case 13: return (dispatch(clearResponse(data, id)))
    case 14: return (dispatch(clearResponse(data, id)))
    case 15: return (dispatch(clearResponse(data, id)))
    case 16: return (dispatch(clearResponse(data, id)))
    case 17: return (dispatch(clearResponse(data, id)))
    case 18: return (dispatch(clearResponse(data, id)))
    case 19: return (dispatch(clearResponse(data, id)))
    case 20: return (dispatch(clearResponse(data, id)))
    case 21: return (dispatch(editPolicy(data, id)))
    case 22: return (dispatch(clearResponse(data, id)))
    case 23: return (dispatch(clearResponse(data, id)))
    case 24: return (dispatch(clearResponse(data, id)))
    case 25: return (dispatch(clearResponse(data, id)))
    case 26: return (dispatch(clearResponse(data, id)))
    case 27: return (dispatch(clearResponse(data, id)))
    case 28: return (dispatch(clearResponse(data, id)))
    case 29: return (dispatch(clearResponse(data, id)))
    case 30: return (dispatch(clearResponse(data, id)))
    case 31: return (dispatch(clearResponse(data, id)))
    case 32: return (dispatch(clearResponse(data, id)))
    case 33: return (dispatch(clearResponse(data, id)))
    case 34: return (dispatch(clearResponse(data, id)))
    case 35: return (dispatch(clearResponse(data, id)))
    case 36: return (dispatch(loadTPA(data, id)))
    default:
  }
}
