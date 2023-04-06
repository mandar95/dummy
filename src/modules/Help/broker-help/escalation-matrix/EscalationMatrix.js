import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { Card, Loader, NoDataFound, SelectComponent } from "../../../../components";
import { DataTable } from '../../../user-management';
import { getEscalationMatrix, help, removeEscalationMatrix } from '../../help.slice';
import { EscalationMatrixColumn } from '../../helper';
import { EscalationMatrixModal } from './EscalationMatrixModal';

export function EscalationMatrix({ myModule, employers }) {

  const dispatch = useDispatch();
  const [addModal, setAddModal] = useState(false);
  const { loading, escalationMatrix } = useSelector(help);
  const [employer, setEmployer] = useState(escalationMatrix.length ?
    { id: escalationMatrix[0].employer_id, label: escalationMatrix[0].employer, value: escalationMatrix[0].employer_id }
    : null);

  useEffect(() => {
    if (employer?.id && (escalationMatrix?.[0]?.employer_id !== employer?.id))
      dispatch(getEscalationMatrix({ employer_id: employer.id }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer])

  const onEdit = (id, data) => {
    setAddModal(data)
  }

  const onRemove = (id) => {
    dispatch(removeEscalationMatrix({ employer_id: employer.id, id }))
  }

  return (
    <Card title={<div className="d-flex justify-content-between">
      <span>Escalation Matrix</span>
      {!!myModule?.canwrite && employer && escalationMatrix.length < 3 &&
        <div>
          <Button size="sm" onClick={() => { setAddModal(true) }} className="shadow-sm m-1 rounded-lg">
            <strong>Add +</strong>
          </Button>
        </div>}
    </div>}>


      <Row className="d-flex flex-wrap">
        <Col md={12} lg={4} xl={4} sm={12}>
          <SelectComponent
            name='employer_id'
            label="Employer"
            placeholder="Select Employer"
            required
            options={employers?.map(item => (
              {
                id: item.id,
                label: item.name,
                value: item.id
              }
            )) || []}
            value={employer}
            onChange={(e) => { setEmployer(e); return e }}
          />
        </Col>
      </Row>

      {escalationMatrix.length ?
        <DataTable
          columns={EscalationMatrixColumn(myModule?.canwrite || !myModule?.candelete)}
          data={escalationMatrix}
          noStatus={true}
          EditFlag={!!myModule?.canwrite ? true : false}
          EditFunc={onEdit}
          deleteFlag={!!myModule?.candelete && 'custom_delete_action'}
          removeAction={onRemove}
          rowStyle
        />
        :
        (!loading && <NoDataFound />)}
      {addModal && <EscalationMatrixModal
        escalationMatrix={escalationMatrix}
        employer_id={employer?.id}
        show={addModal} onHide={() => setAddModal()} />}
      {loading && <Loader />}
    </Card>
  )
}
