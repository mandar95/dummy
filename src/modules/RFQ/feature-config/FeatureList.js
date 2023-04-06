import React from 'react'
import { Card } from '../../../components'
import { DataTable } from '../../user-management'

import { removeFeature } from '../rfq.slice';

export default function FeatureList({ features, myModule }) {
  return (
    <Card title='Product Feature List'>
      <DataTable
        columns={FeatureColum(myModule)}
        data={features}
        noStatus={true}
        editLink={!!myModule?.canwrite && 'edit-product-feature'}
        deleteFlag={!!myModule?.candelete && 'custom_delete'}
        removeAction={removeFeature}
        rowStyle
      />
    </Card>
  )
}

const FeatureColum = (myModule) => [
  {
    Header: "Sr. No",
    accessor: "sr_no"
  },
  {
    Header: "Feature Name",
    accessor: "name"
  },
  {
    Header: "Feature Type",
    accessor: "product_name"
  },
  {
    Header: "Content",
    accessor: "content"
  },
  ...((myModule?.canwrite || myModule?.candelete) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : [])
]
