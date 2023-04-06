import React from 'react';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from 'react-router';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import { DateFormate, downloadFile, Encrypt } from '../../utils';
import swal from 'sweetalert';

// color code
export const _colorCode = (cell) => {
  return (<Button disabled size="sm" className="shadow m-1 rounded-lg" style={cell.value ? { backgroundColor: cell.value, borderColor: cell.value } : {}}>
    {cell.value || '-'}
  </Button>)
}

// allowed | not allowed
export const _checkAlowed = (data) => {
  return data.value ? <i className="ti-check text-success" style={{ fontWeight: '800' }} />
    : <i className="ti-close text-danger" style={{ fontWeight: '800' }} />
}

// renew policy
export const _renewalPolicy = (cell, flag) => {

  const history = useHistory();

  const tempFlag = flag ? cell.row.original.need_renewal && !cell.row.original.is_renewed : true
  return (<OverlayTrigger
    placement="top"
    overlay={<Tooltip>
      <strong>{cell.row.original.is_renewed ? 'Policy Already Renewed' :
        (!cell.row.original.need_renewal && flag) ? 'Renewal allowed 30 days before Policy end' :
          'Policy can be renewed only once'}</strong>
    </Tooltip>}>
    <button
      style={{
        outline: "none",
        border: "none",
        background: "transparent",
        color: tempFlag ? "green" : 'red',
        cursor: tempFlag ? "pointer" : 'not-allowed'
      }}
      onClick={() => tempFlag && history.push('policy-renew/' + Encrypt(cell.value))}
    >
      <i className={tempFlag ? "ti-reload" : 'ti-close'} />
    </button>
  </OverlayTrigger>)
}

// copy policy
export const _copyPolicy = ({ row }) => {

  const history = useHistory();

  return (<OverlayTrigger
    placement="top"
    overlay={<Tooltip>
      <strong>Create Policy Copy</strong>
    </Tooltip>}>
    <button
      style={{
        outline: "none",
        border: "none",
        background: "transparent",
        color: "gray",
        cursor: "pointer"
      }}
      onClick={() => history.push('policy-copy/' + Encrypt(row.original.id))}
    >
      <i className={'ti-files'} />
    </button>
  </OverlayTrigger>)
}

// render image
export const _renderImage = ({ value }) => {
  if (value) return <a style={{ textDecoration: "none" }} href={value || "#"} target="_blank" rel="noopener noreferrer"><img width='50px' src={value} alt='logo' /></a>
  else return "-"
}

// render image2
export const _renderImage2 = ({ value }) => {
  if (value) return <a style={{ textDecoration: "none" }} href={value || "#"} target="_blank" rel="noopener noreferrer"><img width='50px' src={value} alt='logo' style={{
    background: '#7996ff',
    padding: '5px',
    borderRadius: '5px'
  }} /></a>
  else return "-"
}

export const _downloadBtn = ({ value }) => {
  return value ? (
    <span
      role='button'
      onClick={() => exportPolicy(value)}>
      <i className="ti ti-download"></i>
    </span>
  ) :
    '-';
}

// rating star
export const _renderRatings = (cell) => {

  let ratings = Math.ceil(cell.value);
  if (ratings < 0) {
    ratings = 0;
  } else if (ratings > 5) {
    ratings = 5;
  }
  const rate = new Array(ratings).fill(<StarRoundedIcon />),
    total = new Array(Number(5 - ratings)).fill(<StarBorderRoundedIcon />)
  return <>
    {rate.length > 0 && rate.map(v => v)}
    {total.length > 0 && total.map(v => v)}
  </>
}

export const _renderModuleIconAction = (data) => {
  return (<>
    {data.value} < i className={`fa fa-${data.value}`} />
  </>)
}

export const _renderInvoice = (cell) => (
  <span
    role='button'
    disabled={cell.row.original.invoice_url ? false : true}
    onClick={() => cell.row.original.invoice_url
      && window.open(cell.row.original.invoice_url)}>
    <i className={`ti ${cell.row.original.invoice_url ? 'ti-download' : 'ti-close'}`}></i>
  </span >
)

export const _renderDocument = (cell) => (
  <span
    role='button'
    onClick={() => (cell.value)
      ? downloadFile(cell.value, undefined, true)
      : swal("Document not available", "", "info")}>
    <i className={(cell.value) ? "ti ti-download" : "ti ti-close"}></i>
  </span >
)

export const _renderDefaultStatus = (cell) => {
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value ? "success" : "secondary"}>
      {cell?.value ? "Active" : "Disable"}
    </Button>
  );
}

export const _renderAIStatus = (cell) => {
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value ? "success" : "secondary"}>
      {cell?.value ? "Active" : "Inactive"}
    </Button>
  );
}


const exportPolicy = (URL) => {
  if (URL) {
    const link = document.createElement('a');
    link.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,' + encodeURIComponent(URL));
    link.href = URL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const sortTypeWithTime = (a, b, id) => {
  const first = new Date((b.values[id] && b.values[id] !== '-') ? DateFormate(b.values[id], { type: 'withTime' }).split(' ')[0] : '1970-01-01')
  const second = new Date((a.values[id] && a.values[id] !== '-') ? DateFormate(a.values[id], { type: 'withTime' }).split(' ')[0] : '1970-01-01')
  return first - second
};

export const sortType = (a, b, id) => new Date(DateFormate(b.values[id] || '')) - new Date(DateFormate(a.values[id] || ''));
