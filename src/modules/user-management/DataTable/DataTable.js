import React from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useHistory } from "react-router";

import { useTable, usePagination, useFilters, useGlobalFilter, useSortBy } from "react-table";
import { Table, Form, Button, Badge, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

import { DefaultColumnFilter } from './DefaultColumnFilter'
import { useDispatch } from "react-redux";
import { randomString } from 'utils';
import { Encrypt } from "../../../utils";
// import { EmployerReplyModal } from 'modules/Help/EmployerHelp/employer.reply';
import { useSticky } from 'react-table-sticky';
import { useMediaPredicate } from "react-media-hook";


const ExcludeHeaderFeatures = ["Operations", "View"]

export default function DataTable({
  columns,
  data,
  userStatus,
  count,
  type,
  noStatus,
  pageState = {},
  pageSizeOptions = [],

  // redirection link
  editLink = null,
  viewLink = null,

  // view functionality
  viewFlag,
  viewFn = () => null,

  // delete functionality
  deleteFlag,
  removeAction = () => null,
  deleteLimit = 0, // not to delete row (index) 

  // edit functionality
  EditFlag = null,
  EditFunc = () => null,

  autoResetPage = true,
  showFilter = false,

  ...rest /*  own, selectiveEdit, redirectPolicy, rowStyle */ }) {

  const history = useHistory();
  // const [resolveModal, setResolveModal] = useState(false);
  const dispatch = useDispatch();

  const lessThan1025 = useMediaPredicate("(min-width: 1025px)");

  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).trim().toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  );

  const operation = (data, type) => {

    switch (type) {

      case "delete":
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {
              switch (deleteFlag) {
                case 'custom_delete': dispatch(removeAction(data.id))
                  break;
                case 'custom_delete_action': removeAction(data.id, data)
                  break;
                default: swal('Server Issue', 'Please contact the administrator', 'info')
              }
            }
          });
        break;
      default:
        break;
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: !!pageState ? pageState : { pageIndex: 0 },
      autoResetPage: autoResetPage,
      autoResetExpanded: autoResetPage,
      autoResetGroupBy: autoResetPage,
      autoResetSelectedRows: autoResetPage,
      autoResetSortBy: autoResetPage,
      autoResetFilters: autoResetPage,
      autoResetRowState: autoResetPage,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    lessThan1025 && useSticky
  );

  const _renderOperationAction = (index, cell) => {
    return (
      <ButtonGroup key={`${index}-operations`} size="sm">

        {viewLink && < OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>View {type}</strong>.
          </Tooltip>}>
          <Button onClick={() => history.push(`${viewLink}/${randomString()}/${Encrypt((type === 'Employee') ? cell.row?.original?.user_id || cell.row?.original?.id : cell.row?.original?.id)}/${randomString()}`)} className="strong" variant="outline-info"><i className="ti-eye" /></Button>
        </OverlayTrigger>}

        {viewFlag && < OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>View {type}</strong>.
          </Tooltip>}>
          <Button className="strong" variant="outline-info" onClick={() => viewFn(cell.row.original)}><i className="ti-eye" /></Button>
        </OverlayTrigger>}

        {editLink && ((type === 'Role' ? !!(rest.own && deleteLimit <= cell.row?.id) : true) || !rest.own) && <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Edit {type}</strong>
          </Tooltip>}>
          <Button className="strong" variant="outline-warning"
            onClick={() => history.push(`${editLink}/${randomString()}/${Encrypt(cell.row?.original?.id)}/${randomString()}`)}>
            <i className="ti-pencil-alt" /></Button>
        </OverlayTrigger>}

        {EditFlag && <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Edit {type}</strong>
          </Tooltip>}>
          <Button className="strong" variant={(rest.selectiveEdit && !cell.row.original?.to_allow_actions) ? "outline-secondary" : "outline-warning"} disabled={(rest.selectiveEdit && !cell.row.original?.to_allow_actions) ? true : false} onClick={() => EditFunc(cell.row.original?.id, cell.row.original)}>
            <i className="ti-pencil-alt" />
          </Button>
        </OverlayTrigger>}

        {deleteFlag && deleteLimit <= cell.row?.id && <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Remove {type}</strong>
          </Tooltip>}>
          <Button className="strong" variant={(rest.selectiveDelete && !cell.row.original?.to_allow_delete_actions) ? "outline-secondary" : "outline-danger"} disabled={(rest.selectiveDelete && !cell.row.original?.to_allow_delete_actions) ? true : false} onClick={() => operation(cell.row.original, `delete`)}><i className="ti-trash" /></Button>
        </OverlayTrigger>}

        {!!(rest.redirectPolicy && cell.row?.original?.status === 'Won' && cell.row?.original?.enquiry_id) && <OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>Create Policy</strong>.
          </Tooltip>}>
          <Link to={`policy-config`}> <Button className="strong" variant="outline-info"><i className="ti-pencil-alt" /></Button></Link>
        </OverlayTrigger>}

      </ButtonGroup >
    );
  };

  // not used anywher(doubtfull)
  // const _renderResolve = (cell) => {
  //   return (cell.row.original.status) ?
  //     (<Button size="sm" className="shadow m-1 rounded-lg" variant={"primary"} onClick={() => { setResolveModal(cell.row.original) }}>
  //       Reply
  //     </Button>)
  //     : (<Button size="sm" className="shadow m-1 rounded-lg" variant={"secondary"} disabled style={{ cursor: 'not-allowed' }}>
  //       Resolved
  //     </Button>)
  // }


  const _renderCell = (cell, index) => {
    const cellHeader = cell.column.Header;
    switch (cellHeader) {
      case "Operations":
        return _renderOperationAction(index, cell);
      case "View":
        return _renderOperationAction(index, cell);
      default:
        const prod = 'function(e){var t=e.value;return void 0===t?"":t}';
        const dev = 'function defaultRenderer(_ref)';
        const cellFunction = String(cell.column.Cell);

        return cellFunction.includes(prod) || cellFunction.includes(dev) ? (
          (cell.value || cell.value === 0) ?
            cell.render("Cell") : "-")
          :
          cell.render("Cell")
    }
  }

  const _renderRow = (rowIndex, row) => {
    return (
      <tr key={`${rowIndex}-tbody-tr1`} {...row.getRowProps()}>
        {row.cells.map((cell, index) =>
          <td key={`${index}-tbody-tr1-td1`} className={((row.cells[index].column.className && lessThan1025) ? row.cells[index].column.className : '')} {...cell.getCellProps()}>
            {_renderCell(cell, index)}
          </td>
        )}
      </tr>
    )
  };

  // Pagination 
  const Pagination = (<div className="float-right mt-1">
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
      <i className="ti-angle-double-left" />
    </StyledButton>{" "}
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => previousPage()} disabled={!canPreviousPage}>
      <i className="ti-angle-left" />
    </StyledButton>{" "}
    <span className="mr-2">
      Page{" "}
      {pageIndex + 1} of {pageOptions.length}
    </span>
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => nextPage()} disabled={!canNextPage}>
      <i className="ti-angle-right" />
    </StyledButton>{" "}
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
      <i className="ti-angle-double-right" />
    </StyledButton>{" "}
  </div>)

  return (
    <>
      {/* Above Table */}
      <Form onSubmit={e => e.preventDefault()} className={"d-flex mb-2 justify-content-between"} inline>
        <Form.Group >
          {data.length > (rest.hidePagination || 3) && <>
            {/* <Form.Label className='mr-4'> */}
            <span className="mr-3">Show results</span>
            {/* </Form.Label> */}
            <Form.Control className="rounded-lg shadow-sm" as="select" size="sm" value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}>
              {(!!pageSizeOptions.length ? pageSizeOptions : [10, 20, 50, 100]).map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Form.Control>
          </>}
        </Form.Group>
        {(type !== "Module" && type !== "Role" && !noStatus) &&
          <div>
            <Button size="sm" className="shadow m-1 rounded-lg" variant="success" onClick={() => userStatus(1)}>
              <strong>Active</strong> <Badge variant="light">{count?.data?.active}</Badge>
            </Button>
            <Button size="sm" className="shadow m-1 rounded-lg" variant="secondary" onClick={() => userStatus(0)}>
              <strong>Disabled</strong> <Badge variant="light">{count?.data?.inactive}</Badge>
            </Button>
            <Button size="sm" className="shadow m-1 rounded-lg" variant="danger" onClick={() => userStatus(2)}>
              <strong>Removed</strong> <Badge variant="light">{count?.data?.deleted}</Badge>
            </Button>
          </div>
        }
        {!!rest.onExport && <Button size="sm" className="shadow m-1 rounded-lg" variant="dark" onClick={rest.onExport}>
          <strong><i className="ti-cloud-down"></i> Export</strong>
        </Button>}
      </Form>

      {/* Data Table */}
      <StyleTable className="text-center" {...getTableProps()} responsive>
        <thead>
          {headerGroups && headerGroups.map((headerGroup, index) => (
            <React.Fragment key={`${index}-thead`} >
              <TRStyle color={rest.rowStyle?.toString()} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  ExcludeHeaderFeatures.includes(column.render("Header")) ?
                    <th key={`${i}-thead-tr1-th1`}
                      {...column.getHeaderProps()}
                      className={"border-top-0 " + ((column.className && lessThan1025) ? column.className : '')}>
                      {column.render("Header")}
                    </th>
                    :
                    <th key={`${i}-thead-tr1-th1`}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={'border-top-0 ' +
                        (column.isSorted
                          ? column.isSortedDesc
                            ? "sort-desc "
                            : "sort-asc "
                          : "") + ((column.className && lessThan1025) ? column.className : '')
                      }>
                      {column.render("Header")} {column.canSort && <i className="ti-exchange-vertical" />}
                    </th>
                ))}
              </TRStyle>

              {(data.length > 1 || showFilter) && <tr>
                {headerGroup.headers.map((column, i) => (
                  <th key={`${i}-thead-tr1-th2`} className={"align-top" + ((column.className && lessThan1025) ? column.className : '')} {...column.getHeaderProps()}>
                    {ExcludeHeaderFeatures.includes(column.render("Header")) ? ""
                      :
                      <div onClick={() => gotoPage(0)}>{column.canFilter ? column.render("Filter") : null}</div>}
                  </th>
                ))}

              </tr>}
            </React.Fragment>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return _renderRow(i, row);
          })}
        </tbody>
      </StyleTable>

      {data.length > (rest.hidePagination || 3) && Pagination}

      {/* Broker FAQ Reply Modal */}
      {/* not used anywher(doubtfull) */}
      {/* {!!resolveModal &&
        <EmployerReplyModal
          id={resolveModal.id}
          replyText={resolveModal.reply || ""}
          show={!!resolveModal}
          onHide={() => setResolveModal(false)}
        />
      } */}

    </>
  );
};


// DefaultTypes
DataTable.defaultProps = {
  columns: [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Email",
      accessor: "email"
    },
    {
      Header: "Mobile No.",
      accessor: "mobile_no"
    },
    {
      Header: "Type",
      accessor: "type"
    },
    {
      Header: "Operations",
      accessor: "operations"
    }
  ],
  data: [],
  userStatus: () => { },
  count: {},
}

// const StyleButton = styled(Button)`
//   background:${({ disabled }) => disabled ? '#f2c9fb' : 'rgb(222, 142, 240, 0.74)'} ;
//   border-radius: 50%;
//   min-width: 34px;
//   min-height: 34px;
// `

const pageStyle = {
  background: "rgb(222, 142, 240, 0.74)",
  borderRadius: "50%",
  minWidth: "34px",
  minHeight: "34px"
}

const StyleTable = styled(Table)`
  border-collapse: separate;
  border-spacing: 0;
  border: solid 1px #e6e6e6;
  thead {
    user-select: none;
    background:${({ theme }) => theme.dark ? '#2a2a2a' : 'rgb(243,243,243,243)'};
    white-space: nowrap;
  }
  th {
    min-width: 120px;
    background:${({ theme }) => theme.dark ? '#2a2a2a' : 'rgb(243,243,243,243)'};
    border-bottom: 0 !important;
  }
  td {
    background:${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#666666'};
    vertical-align: middle;
  }
  .width150 {
    max-width: 150px;
    width: 150px;
    min-width: 150px;
    word-break: break-word;
  }
`
const TRStyle = styled.tr`
background: ${({ theme, color }) => (color === "true") || theme.dark ? theme.PrimaryColors?.tableColor : 'rgb(243,243,243,243)'};
color: ${({ color, theme }) => (color === "true") || theme.dark ? "#FFFFFF" : '#000000'};
th {
  background: ${({ theme, color }) => (color === "true") || theme.dark ? theme.PrimaryColors?.tableColor : 'rgb(243,243,243,243)'};
  }
`

const StyledButton = styled(Button)`
background: ${({ theme }) => theme.PrimaryColors?.color1 || 'rgb(222, 142, 240, 0.74)'} !important;
border-radius: 50%;
min-width: 34px;
min-height: 34px;
`
