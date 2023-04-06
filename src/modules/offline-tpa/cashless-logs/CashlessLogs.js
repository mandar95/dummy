import React, { useState } from 'react'
import { Card, sortTypeWithTime } from '../../../components'
import DataTablePagination from '../../user-management/DataTablePagination/DataTablePagination'
import { CellViewTemplate } from '../tpalog/CommonFunctions'
import ModalComponent from '../tpalog/ViewModal'
import { loadCashlessLogs } from './cashless-logs.service'

const Column = (viewTemplate) => [
  {
    Header: "Request Host",
    accessor: "request_host",
  },
  {
    Header: "IP Address",
    accessor: "ip_address",
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "Request Data",
    accessor: "request",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
  {
    Header: "Response Data",
    accessor: "response",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  }

]

export const CashlessLogs = () => {

  const [viewModal, setViewModal] = useState(false);

  const viewTemplate = (rowData) => {
    setViewModal(rowData);
  };

  return <Card title={'Cashless Logs'}>
    <DataTablePagination
      columns={Column(viewTemplate)}
      showEmptyMessage={false}
      noStatus
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10, 20, 25, 50, 100]}
      autoResetPage={false}
      activateSearch
      // activateSearchText={'By Date Created, IP Address & Request Host'}
      API={loadCashlessLogs}
    />
    {!!viewModal && (
      <ModalComponent
        show={!!viewModal}
        onHide={() => setViewModal(false)}
        HtmlArray={JSON.stringify(viewModal)}
      />
    )}

  </Card>
}
