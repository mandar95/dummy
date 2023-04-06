import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useHistory, useLocation } from "react-router";

import { useTable, useFilters, usePagination/* , useGlobalFilter */ } from 'react-table';
import { Table, Form, Button, Badge, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { randomString } from 'utils';
import { Encrypt, numOnly, serializeError } from "../../../utils";
import { Loader, NoDataFound } from '../../../components';
import { set_pagination_update } from '../user.slice';
import { DefaultColumnFilter } from '../DataTable/DefaultColumnFilter';
import { GlobalFilter } from '../DataTable/GlobalFilter';
import axios from 'axios';


const initialState = {
  last_page: 1,
  loading: false,
  data: []
};

const GENERIC_UPDATE = 'TOTAL_COUNT_CHANGED';


const reducer = (state, { type, payload }) => {
  switch (type) {
    case GENERIC_UPDATE: return {
      ...state,
      ...payload
    }
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const FetchAction = async (dispatch, api, gotoPage, apiPayload, setGlobalFilterState, showError, showEmptyMessage, cancelTokenSource) => {
  try {
    dispatch({ type: GENERIC_UPDATE, payload: { loading: true } });
    const { data, message, error, cancelToken } = await api(apiPayload, cancelTokenSource);

    if (cancelToken) {
      return null;
    }
    if (data.last_page < data.current_page) {
      gotoPage(0)
      return;
    }
    if (data.data?.length || !showEmptyMessage) {
      dispatch({
        type: GENERIC_UPDATE, payload: {
          data: data.data || [],
          last_page: data.last_page,
          total: data.total,
          per_page: data.per_page,
          current_page: data.current_page,
          loading: false
        },
      })
    }
    else {
      dispatch({ type: GENERIC_UPDATE, payload: { loading: false, ...!showError && { data: [] } } });
      showError && swal('', serializeError(message || error || 'No Data Found'), 'info').then(() => {
        setGlobalFilterState('')
      });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: GENERIC_UPDATE, payload: { loading: false } });
  }
}

const ExcludeHeaderFeatures = ["Operations", "View"]

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

function DataTablePagination({
  columns,
  // data,
  userStatus,
  count,
  type,
  noStatus,
  pageState = {},
  pageSizeOptions = [10, 20, 50, 100],

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

  ApiPayload = {},
  API,
  trimData,
  noDataFoundText = 'No Data Found',

  disableFilter = true,
  CurrentURL = '',
  showEmptyMessage = true,
  ...rest /*  own, selectiveEdit, redirectPolicy, rowStyle */ }) {
  const [{ last_page, data, loading }, useReducerDispatch] =
    useReducer(reducer, initialState);

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page_route = Number(query.get("page") || 1);
  const page_size_route = Number(query.get("page_size"));
  const [pageTemp, setPageTemp] = useState((page_route - 1) || 0);
  const [filters, setFilters] = React.useState({});
  const [globalFilterState, setGlobalFilterState] = React.useState('');
  const { pagination_update } = useSelector(state => state.userManagement);


  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
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
                case 'custom_delete_action': removeAction(data.id)
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
    // visibleColumns,
    // preGlobalFilteredRows,
    // setGlobalFilter,
    // pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize, filters: tableFilter/* , globalFilter */ },
  } = useTable(
    {
      columns,
      data: (trimData ? trimData(data) : data) || [],
      initialState: {
        pageIndex: page_route - 1 || 0,
        pageSize: (pageSizeOptions.includes(page_size_route) ? page_size_route : false) || (pageSizeOptions.length ? pageSizeOptions[0] : 10),
        // filters
      },
      defaultColumn,
      manualFilters: true,
      filterTypes,
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: last_page,
    },
    useFilters,
    // useGlobalFilter,
    usePagination,
  );

  const handleSearch = (q) => {
    setFilters(q.reduce((obj, { id, value }) => ({ ...obj, [id]: value }), {}));
  }
  const debounceOnChange = React.useCallback(debounce(handleSearch, 400), []);

  React.useEffect(() => {
    debounceOnChange(tableFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilter]);


  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();
    if (pageIndex + 1 && pageSize) {
      FetchAction(
        useReducerDispatch, API, gotoPage,
        { data: ApiPayload, page: pageIndex + 1, per_page: pageSize, filters, globalFilterState: globalFilterState.trim() },
        setGlobalFilterState, rest.showError, showEmptyMessage, cancelTokenSource)
      CurrentURL && history.replace(`${CurrentURL}?page=${pageIndex + 1}&page_size=${pageSize}`)
    }

    return () => {
      cancelTokenSource.cancel();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, /* filters, */ globalFilterState,])

  useEffect(() => {
    if (pagination_update && pageIndex + 1 && pageSize) {
      FetchAction(
        useReducerDispatch, API, gotoPage,
        { data: ApiPayload, page: pageIndex + 1, per_page: pageSize, filters, globalFilterState: globalFilterState.trim() },
        setGlobalFilterState, rest.showError, showEmptyMessage)
    }

    return () => {
      dispatch(set_pagination_update(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination_update])

  // useEffect(() => {
  //   gotoPage(0);
  // }, [pageSize, gotoPage]);

  useEffect(() => {
    setPageTemp(pageIndex)
  }, [pageIndex])

  const _renderOperationAction = (index, cell) => {
    return (

      <ButtonGroup key={`${index}-operations`} size="sm">

        {viewLink && < OverlayTrigger
          placement="top"
          overlay={<Tooltip>
            <strong>View {type}</strong>.
          </Tooltip>}>
          <Button onClick={() => history.push(`${viewLink}/${randomString()}/${Encrypt((type === 'Employee') ? cell.row?.original?.user_id : cell.row?.original?.id)}/${randomString()}`)} className="strong" variant="outline-info"><i className="ti-eye" /></Button>
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
          <Button className="strong" onClick={() => operation(cell.row.original, `delete`)} variant="outline-danger"><i className="ti-trash" /></Button>
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
          <td key={`${index}-tbody-tr1-td1`} {...cell.getCellProps()}>
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
      <input
        type="tel"
        onKeyDown={numOnly}
        maxLength={String(last_page).length}
        value={pageTemp === '' ? '' : pageTemp + 1}
        onChange={(e) => {
          if (e.target.value && e.target.value.charAt(0) === '0') {
            e.target.value = e.target.value.substring(1);
          }
          if (Number(e.target.value) > Number(last_page)) {
            e.target.value = last_page;
          }
          const page = e.target.value ? Number(e.target.value) - 1 : '';
          setPageTemp(page);
        }}
        onBlur={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : -1;
          gotoPage(page);
        }}
        onKeyPress={(event) => {
          const key = event.keyCode || event.which;
          if (key === 13) {
            const page = event.target.value ? Number(event.target.value) - 1 : -1;
            gotoPage(page);
          }
        }}
        style={{ width: '100px' }}
      /> of {last_page}
    </span>
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => nextPage()} disabled={!canNextPage}>
      <i className="ti-angle-right" />
    </StyledButton>{" "}
    <StyledButton style={pageStyle} className="shadow-sm" variant="outline-light" size="sm" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
      <i className="ti-angle-double-right" />
    </StyledButton>{" "}
  </div>)

  if (!data?.length && !loading && showEmptyMessage) {
    return <NoDataFound text={noDataFoundText} />
  }

  return (
    <>
      {(data?.length || !showEmptyMessage) ? (
        <>
          {/* Above Table */}
          <Form onSubmit={e => e.preventDefault()} className={"d-flex mb-2 justify-content-between"} inline>
            {<Form.Group >
              {/* <Form.Label className='mr-4'> */}
              <span className="mr-3">Show results</span>
              {/* </Form.Label> */}
              <Form.Control className="rounded-lg shadow-sm" as="select" size="sm" value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}>
                {(!!pageSizeOptions.length ? pageSizeOptions : []).map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>}

            <div>
              {(type !== "Module" && type !== "Role" && !noStatus) &&
                <>
                  <Button size="sm" className="shadow m-1 rounded-lg" variant="success" onClick={() => userStatus(1)}>
                    <strong>Active</strong> <Badge variant="light">{count?.data?.active}</Badge>
                  </Button>
                  <Button size="sm" className="shadow m-1 rounded-lg" variant="secondary" onClick={() => userStatus(0)}>
                    <strong>Disabled</strong> <Badge variant="light">{count?.data?.inactive}</Badge>
                  </Button>
                  <Button size="sm" className="shadow m-1 rounded-lg" variant="danger" onClick={() => userStatus(2)}>
                    <strong>Removed</strong> <Badge variant="light">{count?.data?.deleted}</Badge>
                  </Button>
                </>
              }
              {!!rest.onExport && <Button size="sm" className="shadow m-1 mr-3 rounded-lg" variant="dark" onClick={rest.onExport}>
                <strong><i className="ti-cloud-down"></i> Export</strong>
              </Button>}
              {rest.activateSearch && <GlobalFilter globalFilterState={globalFilterState} activateSearchText={rest.activateSearchText} setGlobalFilterState={setGlobalFilterState} />}
            </div>
          </Form>

          {/* Data Table */}
          <StyleTable className="text-center" {...getTableProps()} responsive>
            <thead>
              {headerGroups && headerGroups.map((headerGroup, index) => (
                <React.Fragment key={`${index}-thead`} >
                  <TRStyle color={rest.rowStyle} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, i) => (
                      <th key={`${i}-thead-tr1-th1`}
                        {...column.getHeaderProps()}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </TRStyle>
                  {!disableFilter && <tr>
                    {headerGroup.headers.map((column, i) => (
                      <th key={`${i}-thead-tr1-th2`} className="align-top" {...column.getHeaderProps()}>
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
          {Pagination}

        </>
      ) : <NoDataFound text='Loading Data...' img='/assets/images/loading.jpg' />
      }

      {loading && <Loader />}
    </>
  );
}

export default DataTablePagination;

// DefaultTypes
DataTablePagination.defaultProps = {
  columns: [
    {
      Header: "Policy No.",
      accessor: "policy_number",
      // disableFilters: true,
      // disableSortBy: true,
    },
    {
      Header: "Policy Name",
      accessor: "policy_name",
      // disableFilters: true,
      // disableSortBy: true,
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
  border: solid 1px #e6e6e6;
  thead {
    background:${({ theme }) => theme.dark ? '#2a2a2a' : 'rgb(243,243,243,243)'};
    white-space: nowrap;
  }
  th {
    min-width: 120px;
    background:${({ theme }) => theme.dark ? '#2a2a2a' : ''};
  }
  td {
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#666666'};
    vertical-align: middle;
  }
`
const TRStyle = styled.tr`
  background: ${({ theme, color }) => color || theme.dark ? theme.PrimaryColors?.tableColor : 'rgb(243,243,243,243)'};
  color: ${({ color, theme }) => color || theme.dark ? "#FFFFFF" : '#000000'};
`

const StyledButton = styled(Button)`
  background: ${({ theme }) => theme.PrimaryColors?.color1 || 'rgb(222, 142, 240, 0.74)'} !important;
  border-radius: 50%;
  min-width: 34px;`
