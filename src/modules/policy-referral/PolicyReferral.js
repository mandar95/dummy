import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import swal from 'sweetalert';
// import * as yup from 'yup';
// import { useHistory } from 'react-router-dom';

import { Input, Card, Button, Loader } from "../../components";
import { Row, Col, Form } from 'react-bootstrap';
import Select from "../user-management/Onboard/Select/Select";
import { DataTable } from "../user-management";

import { useDispatch, useSelector } from 'react-redux';
import { loadBrokers, loadInsurerType, loadPolicyReferrals, clear, referral, submitPolicyReferal, removePolicyReferal } from './policy-referral.slice';
import { columnRefferal } from './policy-refferral.helper';
import { EditReferral } from './EditReferral';

export const PolicyReferal = () => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [edit, setEdit] = useState(false);
  const { control, reset, handleSubmit } = useForm();
  const { success, loading, error, brokers, insurer_types, policy_referrals } = useSelector(referral);
  const { userType } = useSelector(state => state.login);

  useEffect(() => {
    if (userType) {
      dispatch(loadBrokers());
      dispatch(loadInsurerType());
      dispatch(loadPolicyReferrals());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      reset({
        url: ''
      })
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading, dispatch]);

  // useEffect(() => {
  //   if (edit) {
  //     window.scrollTo(0, 0);
  //     reset({
  //       url: edit?.url,
  //       insurer_id: 2,
  //     })
  //   }
  // }, [edit])


  const onSubmit = data => {
    dispatch(submitPolicyReferal(data));
  };

  const onEdit = (id, data) => {
    setEdit(data);
  };

  return (
    <>
      <Card title="Add Policy Referral">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Select
                  label="Broker"
                  option={brokers || []}
                  valueName="name"
                  id="broker_id"
                  required
                />}
                name="broker_id"
                control={control}
              />
            </Col>
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Select
                  label="Insurer Type"
                  option={insurer_types || []}
                  valueName="name"
                  id="insurer_type"
                  required
                />}
                name="insurer_id"
                defaultValue
                control={control}
              />
            </Col>
            <Col md={12} lg={12} xl={6} sm={12}>
              <Controller
                as={<Input label="URL" type="url" name="url" placeholder="Enter URL " required />}
                name="url"
                control={control}
              />
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button type="submit">
                {'Add'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title={'Policy Referral Data'}>
        <DataTable
          columns={columnRefferal}
          data={policy_referrals || []}
          EditFlag
          EditFunc={onEdit}
          deleteFlag={'custom_delete'}
          removeAction={removePolicyReferal}
          noStatus={true} />
      </Card>
      <EditReferral
        brokers={brokers}
        insurer_types={insurer_types}
        edit={edit}
        show={!!edit}
        onHide={() => setEdit(false)}
      />
      {loading && <Loader />}
    </>
  )
}
