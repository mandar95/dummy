import React from 'react';
import { sortType, sortTypeWithTime, _copyPolicy, _renewalPolicy } from '../../components';
import {
  BasicDetails, MemberDetails, PremiumDetails,
  HRDetails, AdditionalDetails, ClaimDocuments
} from "./steps";
import { Link } from 'react-router-dom';
import { Encrypt, randomString } from 'utils';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import swal from 'sweetalert';
import { NumberInd } from '../../utils';
import { ModuleControl } from '../../config/module-control';
import { generatePolicyJSON } from './approve-policy/approve-policy.slice';

export const components = [
  <BasicDetails />,
  <MemberDetails />,
  <PremiumDetails />,
  <HRDetails />,
  <AdditionalDetails />,
  <ClaimDocuments />
];

export const formIds = [
  "basic-details-form",
  "family-details-form",
  "premium-details-form",
  "hr-details-form",
  "additional-details-form",
  "claim-form"
];

export const EmployeeEligibleOptions = [
  { id: 0, value: 0, name: 'All' },
  { id: 1, value: 1, name: 'Inception' },
  { id: 2, value: 2, name: 'Opted-Topup' },
  { id: 3, value: 3, name: 'Midterm' }
]

export const TopUpMapBase = [
  {
    input: 'topup_master_policy_id',
    label: 'topup_master_policy_name',
    label2: 'topup_master_policy_number'
  },
  {
    input: 'topup_master_policy_id_one',
    label: 'topup_master_policy_id_one_name',
    label2: 'topup_master_policy_id_one_policy_number'
  },
  {
    input: 'topup_master_policy_id_two',
    label: 'topup_master_policy_id_two_name',
    label2: 'topup_master_policy_id_two_policy_number'
  },
  {
    input: 'topup_master_policy_id_three',
    label: 'topup_master_policy_id_three_name',
    label2: 'topup_master_policy_id_three_policy_number'
  },
  {
    input: 'topup_master_policy_id_four',
    label: 'topup_master_policy_id_four_name',
    label2: 'topup_master_policy_id_four_policy_number'
  },
]


const _renderPolicyStatusAction = ({ value, row }) => {

  const statusColor = {
    'Active': 'primary',
    'Pending Approval': 'warning',
    'Approved': 'success',
    'Policy Expired': 'danger'
  }
  return (
    <Button
      disabled
      size="sm"
      style={{ whiteSpace: 'pre' }}
      className="shadow m-1 rounded-lg"
      variant={statusColor[value] || 'secondary'}>
      {value}{(value === 'Policy Expired' && `\n(${row?.original.policyStatusOriginal})`)}
    </Button>
  );
};

const _viewButton = (cell) => {
  return (
    <Link to={`approve-policy/${randomString()}/${Encrypt(cell.row.original.id)}/${randomString()}`}>
      <Button className="strong" variant="outline-info">
        <i className="ti-eye" />
      </Button>
    </Link>)
}

const _totalPremium = ({ value }) => (<>₹{NumberInd(value)}</>)

export const ShowInEmployeeTab = [
  { id: 0, name: 'Default', value: 0 },
  { id: 1, name: 'Group Cover', value: 1 },
  { id: 2, name: 'Voluntary Cover', value: 2 }
]

export const policyColumns = (
  write, remove, admin,
  customRender,
  _renderChangeEnrollmentAction,
  _renderExportPolicyAction,
  _renderAction,
  _changeEnrollmentSheet,
  _AuditTrail,
  _PolicyDocument,
  _CdStatement,
  notEmployer,
  is_super_hr,
  showLivePremium,
  policy_document,
  cd_statement,
) => [

    {
      Header: "Sr No.",
      accessor: "index",
      sticky: 'left',
      className: "width150",
    },
    {
      Header: "Policy No.",
      accessor: "policyNumber",
      sticky: 'left',
      className: "width150",
    },
    {
      Header: "Policy Name",
      accessor: "policyName",
      sticky: 'left',
      className: (notEmployer || is_super_hr) ? "width150" : "width150 border-right",
    },
    ...((notEmployer || is_super_hr) ? [{
      Header: "Client Name",
      accessor: "employer",
      sticky: 'left',
      className: "width150 border-right",
    }] : []),
    {
      Header: "Policy Type",
      accessor: "policyType",
    },
    {
      Header: "Policy Sub Type",
      accessor: "policySubType",
    },
    {
      Header: "Insurer",
      accessor: "insurer",
    },
    {
      Header: "TPA",
      accessor: "tpa",
    },
    ...(notEmployer ? [{
      Header: "Loss Ratio %",
      accessor: "loss_ratio"
    }] : []),
    {
      Header: "Policy Start Date",
      accessor: "start_date",
      sortType: sortType
    },
    {
      Header: "Policy End Date",
      accessor: "end_date",
      sortType: sortType
    },
    {
      Header: "Created On",
      accessor: "createdOn",
      sortType: sortTypeWithTime
    },
    ...(notEmployer ? [
      {
        Header: "Created By",
        accessor: "createdBy"
      },
      {
        Header: "Modified On",
        accessor: "modifiedOn",
        sortType: sortTypeWithTime
      },
      {
        Header: "Modified By",
        accessor: "modifiedBy"
      },
      {
        Header: "Approved On",
        accessor: "approvedOn",
        sortType: sortTypeWithTime
      },
      {
        Header: "Approved By",
        accessor: "approvedBy"
      },
    ] : []),
    ...(showLivePremium ? [{
      Header: "Total Lives",
      accessor: "total_policy_lives"
    },
    {
      Header: "Total Premiums",
      accessor: "total_policy_premium",
      Cell: _totalPremium
    }] : []),
    {
      Header: "Policy Status",
      accessor: "policyStatus",
      Cell: _renderPolicyStatusAction
    },
    ...(write ? [...(notEmployer ? [{
      Header: "Action",
      accessor: "changeEnrollmentAction",
      disableFilters: true,
      disableSortBy: true,
      Cell: _renderAction
    },
    {
      Header: "Change Enrolment",
      accessor: "enrollment",
      Cell: _renderChangeEnrollmentAction,
      disableFilters: true,
      disableSortBy: true,
    }] : []),
    {
      Header: "Sheet Mapping",
      accessor: "sheet_data",
      Cell: _changeEnrollmentSheet,
      disableFilters: true,
      disableSortBy: true,
    }
    ] : []),
    ...((notEmployer) ? [{
      Header: "Audit Trail",
      accessor: "auditTrail",
      disableFilters: true,
      disableSortBy: true,
      Cell: _AuditTrail
    }] : []),
    ...((!admin && notEmployer) ? [{
      Header: 'Renew Policy',
      accessor: "id",
      Cell: (data) => _renewalPolicy(data, true),
      disableFilters: true,
      disableSortBy: true,
    }, {
      Header: 'Claim Documents',
      accessor: "claimDocument",
      Cell: customRender,
      disableFilters: true,
      disableSortBy: true,
    }] : []),
    ...notEmployer ? [{
      Header: 'Copy Policy',
      accessor: "copy",
      Cell: _copyPolicy,
      disableFilters: true,
      disableSortBy: true,

    }] : [],
    ...(notEmployer && ModuleControl.CustomRelease /* JSON Copy Policy */) ? [{
      Header: 'Create Copy Policy JSON',
      accessor: "copy_link",
      Cell: _copyPolicyJson,
      disableFilters: true,
      disableSortBy: true,

    }] : [],
    ...policy_document ? [{
      Header: "Policy Document",
      accessor: "policy_document",
      Cell: _PolicyDocument,
      disableFilters: true,
      disableSortBy: true,
    }] : [],
    ...cd_statement ? [{
      Header: "CD Statement",
      accessor: "cd_statement",
      Cell: _CdStatement,
      disableFilters: true,
      disableSortBy: true,
    }] : [],
    ...(notEmployer ? [
      {
        Header: "Export Policy",
        accessor: "exportPolicy",
        Cell: _renderExportPolicyAction,
        disableFilters: true,
        disableSortBy: true,
      }] : []),
    ...(!notEmployer ? [
      {
        Header: "View Policy",
        accessor: "view",
        disableFilters: true,
        disableSortBy: true,
        Cell: _viewButton
      }] : []),
    ...((remove && notEmployer) ? [{
      Header: "Operations",
      accessor: "operations",
    }] : [])
  ];


export function generateSelfEndorseLink(policies) {
  const generatedLink = policies.reduce((final, { id }) => final ? `${final}o${Encrypt(id)}` : Encrypt(id), '');
  const base_url = window.location.origin + '/self-endorsement?options=' + generatedLink;

  /* Copy the text inside the text field */
  if (navigator.clipboard) {
    navigator.clipboard.writeText(base_url).then(() => {
      swal('Copied to clipboard', base_url, 'success', { buttons: 'OK' })
    });
  } else {
    swal('URL Generated', base_url, 'success', { buttons: 'OK' })
  }
}

export function generateCopyPolicyLink(policies) {
  const generatedLink = policies.reduce((final, { id }) => final ? `${final}o${Encrypt(id)}` : Encrypt(id), '');
  const base_url = window.location.origin + '/self-endorsement?options=' + generatedLink;

  /* Copy the text inside the text field */
  if (navigator.clipboard) {
    navigator.clipboard.writeText(base_url).then(() => {
      swal('Copied to clipboard', base_url, 'success', { buttons: 'OK' })
    });
  } else {
    swal('URL Generated', base_url, 'success', { buttons: 'OK' })
  }
}

// copy policy link
export const _copyPolicyJson = ({ row }) => {

  return (<OverlayTrigger
    placement="top"
    overlay={<Tooltip>
      <strong>Create Policy Copy JSON</strong>
    </Tooltip>}>
    <button
      style={{
        outline: "none",
        border: "none",
        background: "transparent",
        color: "gray",
        cursor: "pointer",
        fontSize: '1.2rem'
      }}
      onClick={() => generatePolicyJSON(row.original.id)}
    >
      <i className={'ti-share'} />
    </button>
  </OverlayTrigger>)
}


export const validateInstalment = (e, employerInstallment, setValue) => {
  const value = Number(e.target.value)
  if (employerInstallment.length) {
    if ((employerInstallment.every(({ installment_level }) => installment_level === 0) && value === 1) ||
      (employerInstallment.every(({ installment_level }) => installment_level === 1) && value === 0)) {
      return swal({
        title: "This will overwrite all past Installment type!",
        text: "Do you want to continue?",
        icon: "warning",
        buttons: ['No', 'Yes'],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (!isConfirm) {
          setValue('installment_level', value ? '0' : '1')
          return e
        }
      })
    }
  }
  else return e
}

export const validateInstalmentNote = (value, employerInstallment) => {
  if (employerInstallment.length) {
    if (employerInstallment.every(({ installment_level }) => installment_level === 0) && value === 1) {
      return 'Once the policy will be created, it will remove all the policy wise instalment for the current employer'
    }
    if (employerInstallment.every(({ installment_level }) => installment_level === 1) && value === 0) {
      return 'Once the policy will be created, it will update enitity wise instalment for the current employer'
    }
  }
  return false
}
