import React from 'react';
import swal from 'sweetalert';
import httpClient from '../../api/httpClient';
import { serializeError } from '../../utils';
import { Card, Input, Button } from 'components'
import { Row, Col } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";

const verifyUserApi = (data) => httpClient('/admin/verify-user', { method: 'POST', data });

export const verifyUser = async (payload, fetcAction = false, fetcActionPayload = null) => {
  const { data, message, errors } = await verifyUserApi(payload);
  if (data.status) {
    swal('Success', message, 'success')
  }
  else {
    swal("Alert", serializeError(message || errors), 'warning')
  }
};


export function VerifyUser() {
  const onSubmit = (data) => {
    verifyUser(data)
  }

  const { control, errors, handleSubmit } = useForm();
  return (
    <Card title='Verify User Email'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="d-flex flex-wrap">
          <Col md={12} lg={12} xl={12} sm={12}>
            <Controller
              as={<Input label="Email" type="email" maxLength={200}
                placeholder="Enter Email" required={false} isRequired={true} />}
              name="email"
              error={errors && errors.email}
              control={control}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              Verify
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  )
}
