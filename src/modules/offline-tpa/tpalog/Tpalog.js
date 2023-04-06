import React, { useEffect, useReducer, useState } from "react";
import { addDays, format } from "date-fns";

import { Card, Error, Loader, SelectComponent, Button, DatePicker } from "../../../components";
import { Col, Row } from "react-bootstrap";
import { loadPolicyNo, loadPolicyType } from "../offline-tpa.action.js";
import { TpaLogModel } from "./CommonFunctions";
import DataTablePagination from "../../user-management/DataTablePagination/DataTablePagination.js";
import ModalComponent from "./ViewModal.js";
// import TpaWellnessUI from "./index";

import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { loadTpaMethods } from "./tpalog.action.js";
import { DateFormate, serializeError } from "../../../utils";
import service from "./Tpalog.service.js";
import { Prefill } from "../../../custom-hooks/prefill";
import { set_pagination_update } from "../../user-management/user.slice";

const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  details: [],
  loadingDetail: true,
  log_types: []
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}


const TpaLog = () => {
  const dispatchRedux = useDispatch();
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [{ policy_types,
    policy_nos,
    log_types,
    loading, }, dispatch] = useReducer(reducer, initialState);

  const [viewModal, setViewModal] = useState(false);
  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  const { control, errors, watch, setValue } = useForm();

  const employer_id = watch('employer_id')?.value || currentUser.employer_id;
  const policy_type = watch('policy_type')?.value;
  const policy_id = watch('policy_id')?.value;
  const log_type = watch('log_type')?.label;
  const from_date = watch('from_date') || '';
  const to_date = watch('to_date') || '';


  const viewTemplate = (rowData) => {
    setViewModal(rowData);
  };
  let _commonObject = {
    viewTemplate,
    viewModal,
    setViewModal,
  };

  // initial load
  useEffect(() => {
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (policy_id) {
      loadTpaMethods(dispatch, { policy_id })
    }
  }, [policy_id])

  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName === "Broker") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser]);

  useEffect(() => {
    if (employer_id) {
      loadPolicyType(dispatch, { employer_id }, "tpa-log");
      setValue([
        { policy_type: undefined },
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined },
        { log_type: undefined }
      ])
      return () => {
        dispatch({ type: 'GENERIC_UPDATE', payload: { policy_nos: [] } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id]);


  // load policy type
  useEffect(() => {
    if (policy_type) {
      setValue([
        { policy_id: undefined },
        { to_date: undefined },
        { from_date: undefined },
        { log_type: undefined }
      ])
      loadPolicyNo(dispatch,
        { user_type_name: userTypeName, employer_id, policy_sub_type_id: policy_type },
        userType === 'broker')
    }
    return () => {
      dispatch({ type: 'GENERIC_UPDATE', payload: { log_types: [] } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_type])

  useEffect(() => {
    if (policy_id) {
      setValue([
        { to_date: undefined },
        { from_date: undefined },
        { log_type: undefined }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id])

  useEffect(() => {
    if (log_type) {
      setValue([
        { to_date: undefined },
        { from_date: undefined },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log_type])

  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_types, setValue, 'policy_type', 'label')
  Prefill(policy_nos, setValue, 'policy_id', 'label')


  const onReset = () => {
    setValue([
      { employer_id: undefined },
      { policy_type: undefined },
      { policy_id: undefined },
      { to_date: undefined },
      { from_date: undefined },
      { log_type: undefined }
    ])
  }

  return <Card title={'TPA Logs'}>
    <Row className="d-flex flex-wrap">

      {['broker'].includes(userType) && <Col md={6} lg={4} xl={4} sm={12}>
        <Controller
          as={
            <SelectComponent
              label="Employer"
              placeholder="Select Employer"
              required={false}
              isRequired
              options={employers?.map((item) => ({
                id: item?.id,
                label: item?.name,
                value: item?.id,
              })) || []}
              error={errors && errors.employer_id?.id}
            />
          }
          control={control}
          name="employer_id"
        />
        {!!errors.employer_id?.id && <Error>
          {errors.employer_id?.id.message}
        </Error>}
      </Col>}

      {!!(currentUser.is_super_hr && currentUser.child_entities.length) && <Col md={6} lg={4} xl={4} sm={12}>
        <Controller
          as={
            <SelectComponent
              label="Employer"
              placeholder="Select Employer"
              required={false}
              isRequired
              options={currentUser.child_entities.map(item => (
                {
                  id: item.id,
                  label: item.name,
                  value: item.id
                }
              )) || []}
              error={errors && errors.employer_id?.id}
            />
          }
          defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
          control={control}
          name="employer_id"
        />
        {!!errors.employer_id?.id && <Error>
          {errors.employer_id?.id.message}
        </Error>}
      </Col>}

      <Col md={6} lg={4} xl={4} sm={12}>
        <Controller
          as={
            <SelectComponent
              label="Policy Type"
              placeholder="Select Policy Type"
              required={false}
              isRequired
              options={policy_types}
              error={errors && errors.policy_type?.id}
            />
          }
          control={control}
          name="policy_type"
        />
        {!!errors.policy_type?.id && <Error>
          {errors.policy_type?.id.message}
        </Error>}
      </Col>

      <Col md={6} lg={4} xl={4} sm={12}>
        <Controller
          as={
            <SelectComponent
              label="Policy Name"
              placeholder="Select Policy Name"
              required={false}
              isRequired
              options={policy_nos}
              error={errors && errors.policy_id?.id}
            />
          }
          control={control}
          name="policy_id"
        />
        {!!errors.policy_id?.id && <Error>
          {errors.policy_id?.id.message}
        </Error>}
      </Col>

      <Col md={6} lg={4} xl={4} sm={12}>
        <Controller
          as={
            <SelectComponent
              label="Log Type"
              placeholder="Select Log Type"
              required={false}
              isRequired
              options={log_types}
              error={errors && errors.log_type?.id}
            />
          }
          control={control}
          name="log_type"
        />
        {!!errors.log_type?.id && <Error>
          {errors.log_type?.id.message}
        </Error>}
      </Col>

      <Col xs={12} sm={12} md={6} lg={4} xl={4}>
        <Controller
          as={
            <DatePicker
              name={'from_date'}
              label={'Start Date'}
              required={false}
              isRequired
            />
          }
          onChange={([selected]) => {
            setValue('to_date', undefined);
            return selected ? format(selected, 'dd-MM-yyyy') : '';
          }}
          name="from_date"
          error={errors && errors?.from_date}
          control={control}
        />
        {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
      </Col>
      <Col xs={12} sm={12} md={6} lg={4} xl={4}>
        <Controller
          as={
            <DatePicker
              minDate={new Date(DateFormate(from_date || '01-01-1900', { dateFormate: true }))}
              maxDate={addDays(new Date(DateFormate(from_date || '01-01-2200', { dateFormate: true })), 6)}
              name={'to_date'}
              label={'End Date'}
              required={false}
              isRequired
            />
          }
          onChange={([selected]) => {
            to_date && dispatchRedux(set_pagination_update(true))
            return selected ? format(selected, 'dd-MM-yyyy') : '';
          }}
          name="to_date"
          error={errors && errors?.to_date}
          control={control}
        />
        {!!errors?.to_date && <Error>{errors?.to_date?.message}</Error>}
      </Col>

    </Row>
    <Row>
      <Col md={12} className="d-flex justify-content-end mt-4">
        <Button className="mr-0" buttonStyle='danger' type="button" onClick={onReset}>
          Reset
        </Button>
      </Col>
    </Row>
    {!!(policy_id && log_type && from_date && to_date) && <DataTablePagination
      columns={TpaLogModel(_commonObject.viewTemplate)}
      noStatus
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[3, 5, 10]}
      autoResetPage={false}
      rowStyle={"true"}
      disableFilter
      API={service.loadTpaLogs}
      ApiPayload={{ policy_id, method: log_type, from_date, to_date }}
    />}
    {!!_commonObject.viewModal && (
      <ModalComponent
        show={!!_commonObject.viewModal}
        onHide={() => _commonObject.setViewModal(false)}
        HtmlArray={_commonObject.viewModal}
      />
    )}
    {loading && <Loader />}
  </Card>

}

// const TpaLog1 = () => {
//   return (
//     <TpaWellnessUI
//       FetchAPI={service.getTpaLog}
//       module={TpaLogModel}
//       cardTitle={"TPA Log"}
//       nofoundData={"No TPA Log Found"}
//     />
//   );
// };

export default TpaLog;
