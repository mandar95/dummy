import React from 'react';
import { Button } from "react-bootstrap"
import { useHistory, useParams } from 'react-router';
import { randomString } from '../../../../../../utils';
import { deleteQuoteSlip } from './qcr.action';
import swal from "sweetalert";
import { sortType } from '../../../../../../components';

const _ViewPlacementSlip = ({ row }) => {
  const history = useHistory();
  const { userType } = useParams();

  return <Button size="sm" className="shadow m-1 rounded-lg" variant='outline-primary'
    onClick={() => history.push(`/${userType}/qcr/${randomString()}/${row?.original?.id}/${randomString()}/${3}`)}
  >
    View <i className='fas fa-eye' />
  </Button>
}
const _SendPlacementSlip = ({ row }, setPlacemetSlip) => {
  return <Button size="sm" className="shadow m-1 rounded-lg" variant='outline-warning' onClick={() => (setPlacemetSlip(row))}>
    Send <i className='fas fa-envelope' />
  </Button>
}
const _AddInsurerQuote = ({ row }, type) => {
  const history = useHistory();
  const { userType } = useParams();

  const should_view = row.original.insurer?.length;
  if ((!should_view && userType === 'customer') || (type === 'final' && !row.original.insurer.some(({ selected_insurer }) => selected_insurer))) {
    return '';
  }

  return <Button size="sm" style={{ whiteSpace: 'nowrap' }} className="shadow m-1 rounded-lg" variant='info' onClick={() =>
    should_view ? history.push(`/${userType}/qcr-quote-view/${randomString()}/${row.original.id}/${randomString()}${type === 'final' ? '?type=final' : ''}`)
      : history.push(`/${userType}/qcr-quote-create/${randomString()}/${row.original.id}/${randomString()}`)}>
    {should_view ? <>View Quote <i className='fas fa-eye' /></> : <>Add Quote <i className='fas fa-plus' /></>}
  </Button>
}
// const _ViewQuoteSlip = ({ value }) => {
//   return <Button size="sm" className="shadow m-1 rounded-lg" variant='outline-primary'>
//     View <i className='fas fa-eye' />
//   </Button>
// }
const _Audit = ({ row }, setAuditDetails) => {
  return <Button size="sm" className="shadow m-1 rounded-lg" style={{ whiteSpace: 'nowrap' }} variant='outline-info' onClick={() => setAuditDetails(row)}>
    Audit Details <i className='fas fa-file-alt' />
  </Button>
}
const _SendQuotesSlip = ({ row }, setQouteSlip, type) => {
  let toShow = false;
  const haveData = row.original.insurer?.length;
  if (type === 'final' && haveData && row.original.insurer.some(({ selected_insurer }) => selected_insurer)) {
    toShow = true
  }
  if (type !== 'final' && haveData) {
    toShow = true
  }
  return toShow ? <Button size="sm" className="shadow m-1 rounded-lg" variant='outline-warning' onClick={() => (setQouteSlip({ ...row.original, type }))}>
    Send <i className='fas fa-envelope' />
  </Button> : ''
}
const _Actions = ({ row }, dispatch) => {
  return <Button size="sm" className="shadow m-1 rounded-lg" variant='danger'
    onClick={() => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          deleteQuoteSlip(dispatch, row.original.id)
        }
      });
    }}
  >
    <i className='fas fa-trash-alt' />
  </Button>
}

export const QuotesColumn = ({ setPlacemetSlip, setAuditDetails, setQouteSlip, dispatch, userType, myModule }) => [
  {
    Header: "Quote ID",
    accessor: "quote_id",
  },
  {
    Header: "Version",
    accessor: "quote_version",
  },
  {
    Header: "Company Name",
    accessor: "company_name",
  },
  {
    Header: "Existing Cover",
    accessor: "existing_cover",
  },
  {
    Header: "Existing Premium",
    accessor: "premium_paid_inception_gst_including",
  },
  {
    Header: "Claim Ratio",
    accessor: "claim_ratio",
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortType: sortType
  },
  ...userType !== 'customer' ? [{
    Header: "Created By",
    accessor: "created_user",
  }] : [],
  ...userType !== 'customer' ? [{
    Header: "Assigned To",
    accessor: "AssignedTo",
  }] : [],
  ...!!myModule?.canwrite ? [{
    Header: "View Placement Slip",
    accessor: "ViewPlacementSlip",
    Cell: _ViewPlacementSlip,
    disableFilters: true,
    disableSortBy: true
  },
  {
    Header: "Send Placement Slip",
    accessor: "SendPlacementSlip",
    Cell: (e) => _SendPlacementSlip(e, setPlacemetSlip),
    disableFilters: true,
    disableSortBy: true
  },
  {
    Header: userType === "customer" ? "View Quote Slip" : "Add Insurer Quote",
    accessor: "view_quote_slip",
    Cell: (e) => _AddInsurerQuote(e),
    disableFilters: true,
    disableSortBy: true
  },
  // {
  //   Header: "View Quote Slip",
  //   accessor: "ViewQuoteSlip",
  //   Cell: _ViewQuoteSlip,
  //   disableFilters: true,
  //   disableSortBy: true
  // },
  ...userType !== 'customer' ? [{
    Header: "Audit",
    accessor: "Audit",
    Cell: (e) => _Audit(e, setAuditDetails),
    disableFilters: true,
    disableSortBy: true
  }] : [],
  {
    Header: "Send Quotes Slip",
    accessor: "SendQuotesSlip",
    Cell: (e) => _SendQuotesSlip(e, setQouteSlip),
    disableFilters: true,
    disableSortBy: true
  },
  {
    Header: "Final Quote",
    accessor: "Final_Quote",
    Cell: (e) => _AddInsurerQuote(e, 'final'),
    disableFilters: true,
    disableSortBy: true
  },
  {
    Header: "Send Final Quote",
    accessor: "Send_Final_Quote",
    Cell: (e) => _SendQuotesSlip(e, setQouteSlip, 'final'),
    disableFilters: true,
    disableSortBy: true
  },] : [],

  ...(userType !== 'customer' && !!myModule?.candelete) ? [{
    Header: "Actions",
    accessor: "Actions",
    Cell: (e) => _Actions(e, dispatch),
    disableFilters: true,
    disableSortBy: true
  }] : [],
];

export const SortFeature = (data) =>
  data.filter((element) => element.is_parent).map((value) => {
    const child = data.filter((childrenElement) => { return !childrenElement.is_parent && (childrenElement.parent_id === value.id) })
    return { ...value, child: child }
  });
