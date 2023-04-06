import React, { useEffect } from 'react';
import swal from 'sweetalert';
import { DataTable } from '../../user-management';
import { getExcelData } from './broker.renewal.service';
import { Card, Select, _renewalPolicy, NoDataFound } from '../../../components'
import { loadBroker } from '../../claims/claims.slice'
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

const renderExcel = (id) => {
  getExcelData({ policy_id: id }).then(res => {
    if (res.data?.data?.url)
      window.location.href = res.data.data.url;
    else
      swal("Document not available", "", "info")
  }).catch(err => console.error(err));
}

const _renderExcel = (cell) => (
  <span
    role='button'
    onClick={() => renderExcel(cell.row.original.id)}>
    <i className="ti ti-download"></i>
  </span >
)


export default function BrokerRenewalTable({ details, admin, getAdminData, canWrite }) {
  const dispatch = useDispatch();
  const { broker } = useSelector(state => state.claims);

  useEffect(() => {
    if (admin) {
      dispatch(loadBroker())
    }
    //eslint-disable-next-line
  }, [])

  const getAdminTable = (e) => {
    getAdminData(e)
  }


  return (
    <Card title={<p>Renewal</p>}>
      {(admin) &&
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={6} xl={4} sm={12}>
            <Select
              label={"Brokers"}
              placeholder='Select Broker'
              options={broker.map((item) => ({
                id: item?.id,
                name: item?.name,
                value: item?.id,
              }))}
              id="drop"
              valueName="name"
              onChange={getAdminTable}
            />
          </Col>
        </Row>}
      {!!details.length ?
        <DataTable
          columns={RenewalModel(admin, canWrite,)}
          data={details}
          // type={admin ? '/admin/' : '/broker/'}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 20, 25, 50, 100]}
          rowStyle
        /> :
        <NoDataFound text='No Policies for Renewal' />}
    </Card>
  )
}


const RenewalModel = (admin, canWrite) => [{
  Header: "Policy No",
  accessor: "policy_number",
},
{
  Header: "Policy Name",
  accessor: "policy_name",
},
{
  Header: "Policy Type",
  accessor: "policy_type",
},
{
  Header: "Insurer Name",
  accessor: "insurer"
},
{
  Header: "TPA Name",
  accessor: "tpa"
},
{
  Header: "Client Name",
  accessor: "employer"
},
{
  Header: "Start Date",
  accessor: "start_date"
},
{
  Header: "End Date",
  accessor: "end_date"
},
{
  Header: "Cover",
  accessor: "policy_cover"
},
{
  Header: "Premium",
  accessor: "policy_premium"
},
{
  Header: "Loss Ratio%",
  accessor: "loss_ratio"
},
...(!(admin || canWrite) ? [] : [{
  Header: 'Policy Renew',
  accessor: "id",
  Cell: (data) => _renewalPolicy(data, false),
  disableFilters: true,
  disableSortBy: true,
}]),
{
  Header: "Download",
  accessor: "download",
  Cell: _renderExcel,
  disableFilters: true,
  disableSortBy: true,
}
]
