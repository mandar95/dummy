import React from 'react'

import { Card, NoDataFound, Button } from '../../components';
import { DataTable } from "../user-management";

export default function TableView({ rowData = [], setEmployerModal, userType, currentUser, employer_id }) {
  return (
    <Card title={<div className="d-flex justify-content-between">
      <span>Corporate Buffer{(employer_id.label || currentUser.employer_name) && ` : ${(employer_id.label || currentUser.employer_name)}`}</span>
      {(userType === 'broker' || !!(currentUser.is_super_hr && currentUser.child_entities.length)) && <Button type="button" onClick={() => {
        setEmployerModal(true)
      }} buttonStyle="outline-secondary">
        Change Employer
      </Button>}
    </div>}>
      {rowData.length ? <DataTable
        columns={ColumnStructure}
        data={rowData}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 20, 50]}
        rowStyle
      /> : <NoDataFound />}
    </Card>
  )
}

const ColumnStructure = [
  {
    Header: "Policy Name",
    accessor: "policy_number",
  },
  {
    Header: "Total Amount",
    accessor: "total_corporate_buffer_amount",
  },
  {
    Header: "Balance",
    accessor: "balance_corporate_buffer_amount",
  },
  {
    Header: "Utilize",
    accessor: "utilizied_corporate_buffer_amount",
  }
]
