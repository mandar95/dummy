import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, SelectComponent, CardBlue, Button, Error } from "components";
import { ButtonContainer } from "./style";
import { Row, Col } from "react-bootstrap";
import {
  loadEmployers,
  loadPolicyTypes,
  loadPolicies,
  loadBroker,
  loadBrokerEmployer,
} from "../Report.action.js";
import { format } from 'date-fns'
import { DateFormate } from "utils";
import { reportValidationSchema } from "../validation";
import { Prefill } from "../../../custom-hooks/prefill";

const Filters = ({ dispatch, lastpage, firstpage,
  BrokerId, getValues, userType = '',
  brokers, employers, policy_subtypes, policies }) => {
  //Selectors
  const { control, handleSubmit, watch, setValue, errors } = useForm({
    validationSchema: reportValidationSchema(userType)
  });
  const { userType: userTypeName, currentUser } = useSelector((state) => state.login);
  //states
  const employer_id = watch("employer_id")?.value || currentUser?.employer_id || '';
  const policy_sub_type_id = watch("policy_sub_type_id")?.value || '';
  const policy_id = watch("policy_id")?.value || '';
  const from_date = watch('from_date') || '';
  const to_date = watch('to_date') || '';


  //api call for broker data -----
  useEffect(() => {
    if (userType === 'admin' && userTypeName) {
      loadBroker(dispatch, userTypeName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName])
  //---------------

  //api call for employer data -----
  useEffect(() => {
    if (lastpage >= firstpage && BrokerId && ['broker', 'admin'].includes(userType)) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    function _callback() {
      loadEmployers(dispatch, { broker_id: BrokerId }, firstpage);
    }
    return () => {
      clearTimeout(_TimeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstpage, BrokerId]);
  //---------------

  // api for policy subtype --------
  useEffect(() => {
    if (employer_id) {
      const data = { employer_id: employer_id };
      setValue([
        { policy_sub_type_id: undefined },
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])
      loadPolicyTypes(dispatch, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id]);
  //--------------------------------

  // api for policy subtype --------
  useEffect(() => {
    if (employer_id && policy_sub_type_id) {
      const data = {
        ...(currentUser?.broker_id && { broker_id: currentUser?.broker_id }),
        employer_id: employer_id,
        policy_sub_type_id: policy_sub_type_id,
        user_type_name: userTypeName
      };
      setValue([
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])
      loadPolicies(dispatch, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_sub_type_id]);
  //--------------------------------

  useEffect(() => {
    if (policy_id) {
      const policy = policies?.find(({ id }) => id === Number(policy_id));
      setValue([
        { to_date: DateFormate(policy?.end_date || '', { dateFormate: true }) || "" },
        { from_date: DateFormate(policy?.start_date || '', { dateFormate: true }) || "" }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id])

  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_subtypes, setValue, 'policy_sub_type_id')
  Prefill(policies, setValue, 'policy_id', 'number')


  const getAdminEmployer = ([e]) => {
    if (e.value) {
      loadBrokerEmployer(dispatch, e.value);
      setValue([
        { employer_id: undefined },
        { policy_sub_type_id: undefined },
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined }
      ])
    }
    return (e)
  }

  return (
    <CardBlue title="Client Summary Details">
      <form onSubmit={handleSubmit(getValues)}>
        <Row xs={1} sm={1} md={2} lg={3} xl={4}>
          {(userType === "admin") &&
            <Col xs={12} sm={12} md={6} lg={4} xl={3}>
              <Controller
                as={<SelectComponent
                  label="Broker"
                  placeholder='Select Broker'
                  options={brokers.map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                  }))}
                  valueName="name"
                  id="id"
                  required
                />}
                onChange={getAdminEmployer}
                name="broker_id"
                error={errors && errors?.broker_id?.id}
                control={control}
              />
              {!!errors?.broker_id?.id && <Error>{errors?.broker_id?.id?.message}</Error>}
            </Col>}
          {(['admin', 'broker'].includes(userType)) && <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <SelectComponent
                  label="Employer"
                  placeholder="Select Employer"
                  required
                  options={employers?.map((item) => ({
                    id: item?.id,
                    label: item?.name || item?.company_name,
                    value: item?.id,
                  })) || []}
                />
              }
              error={errors && errors?.employer_id?.id}
              control={control}
              name="employer_id"
            />
            {!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
          </Col>}

          {!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
            <Col md={6} lg={4} xl={3} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder='Select Employer'
                    options={currentUser.child_entities.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                    id="employer_id"
                    required
                  />
                }
                defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                name="employer_id"
                control={control}
              />
              {!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
            </Col>
          )}

          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <SelectComponent
                  label="Policy Type"
                  placeholder="Policy Type"
                  required
                  options={policy_subtypes?.map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                  })) || []}
                />
              }
              error={errors && errors?.policy_sub_type_id?.id}
              control={control}
              name="policy_sub_type_id"
            />
            {!!errors?.policy_sub_type_id?.id && <Error>{errors?.policy_sub_type_id?.id?.message}</Error>}
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <SelectComponent
                  label="Policy Name"
                  placeholder="Policy Name"
                  required
                  options={policies?.map((item) => ({
                    id: item?.id,
                    label: item?.number,
                    value: item?.id
                  })) || []}
                />
              }
              error={errors && errors?.policy_id?.id}
              control={control}
              name="policy_id"
            />
            {!!errors?.policy_id?.id && <Error>{errors?.policy_id?.id?.message}</Error>}
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <DatePicker
                  maxDate={new Date(DateFormate(to_date || '01-01-2200', { dateFormate: true }))}
                  name={'from_date'}
                  label={'Date Range From'}
                  required={false}
                  isRequired={true}
                />
              }
              onChange={([selected]) => {
                return selected ? format(selected, 'dd-MM-yyyy') : '';
              }}
              name="from_date"
              error={errors && errors?.from_date}
              control={control}
            />
            {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <DatePicker
                  minDate={new Date(DateFormate(from_date || '01-01-1900', { dateFormate: true }))}
                  name={'to_date'}
                  label={'Date Range To'}
                  required={false}
                  isRequired={true}
                />
              }
              onChange={([selected]) => {
                return selected ? format(selected, 'dd-MM-yyyy') : '';
              }}
              name="to_date"
              error={errors && errors?.to_date}
              control={control}
            />
            {!!errors?.to_date && <Error>{errors?.to_date?.message}</Error>}
          </Col>
        </Row>

        <ButtonContainer>
          {/*
            <div style={{ padding: "3px" }}>
              <Button buttonStyle="outline">Export Pdf</Button>
            </div>
            <div style={{ padding: "3px" }}>
              <Button buttonStyle="outline">Export Excel</Button>
            </div>
          */}
          <div style={{ padding: "3px" }}>
            <Button type="submit">Submit</Button>
          </div>
        </ButtonContainer>
      </form>
    </CardBlue>
  );
};

export default Filters;
