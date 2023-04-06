import React, { useEffect, useReducer, useState } from "react";
import * as yup from 'yup';

import { Card, Error, Loader, SelectComponent, Button } from "components";
import { Col, Row } from "react-bootstrap";
import { loadErrorSheetAction, loadPolicyNo, loadPolicyType } from "../offline-tpa/offline-tpa.action";
import { AttachFile2 } from 'modules/core';
import { AnchorTag } from '../EndorsementRequest/style';

import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { loadSelectedEvent, reducer, loadSampleFormatAction, loadTemplate, triggerEmailUplaod } from "./template.action";
import { ProgressBar } from "modules/EndorsementRequest/progressbar";
import { DataTable } from "../user-management";
import { ErrorSheetTableData } from "../offline-tpa/error-data/ErrorData";
import service from '../offline-tpa/offline-tpa.service';
import { Prefill } from "../../custom-hooks/prefill";
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Head } from "../../components";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

const initialState = {
  loading: false,
  selectedEvent: [],
  policy_types: [],
  policy_nos: [],
  templates: [],
  details: [],
  loadingDetail: false
}

const validationSchema = (userType, eventType) => yup.object().shape({
  ...((userType === 'broker' && eventType !== 44) && {
    employer_id: yup.object().when("trigger_id", {
      is: value => value?.is_employer_wise_template_allowed,
      then: yup.object().shape({
        id: yup.string().required("Employer required")
      }),
      otherwise: yup.object()
    })
  }),

  ...(eventType !== 44 && {
    policy_type: yup.object().when("trigger_id", {
      is: value => value?.is_policy_wise_template_allowed,
      then: yup.object().shape({
        id: yup.string().required("Policy Type required")
      }),
      otherwise: yup.object()
    }),
    policy_id: yup.object().when("trigger_id", {
      is: value => value?.is_policy_wise_template_allowed,
      then: yup.object().shape({
        id: yup.string().required("Policy Name required")
      }),
      otherwise: yup.object()
    }),
  }),
  trigger_id: yup.object().shape({
    id: yup.string().required('Event Type required'),
  }),
  // ...(eventType === 44 && {
  //   policy_sub_type_id: yup.object().shape({
  //     id: yup.string().required('policy id requied')
  //   })
  // })


  // template_id: yup.object().shape({
  //   id: yup.string().required('Template required'),
  // }),
})


export function TriggerEmailUpload() {
  const dispatchRedux = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [eventType, setEventType] = useState(null)

  const [{ policy_types,
    policy_nos,
    selectedEvent,
    templates,
    loadingDetail,
    details,
    loading, }, dispatch] = useReducer(reducer, initialState);

  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  const { control, errors, watch, setValue, register, handleSubmit } = useForm({
    validationSchema: validationSchema(userType, eventType),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const employer_id = watch('employer_id')?.value /* || currentUser.employer_id */;
  const policy_type = watch('policy_type')?.value;
  const trigger = watch('trigger_id');
  const trigger_type = watch('trigger_type');

  // initial load
  useEffect(() => {
    loadSelectedEvent(dispatch)
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
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

  // load policy type
  useEffect(() => {
    // if (currentUser.employer_id) {
    //   if (['employee', 'employer'].includes(userType)) {
    //     loadPolicyType(dispatch, { employer_id: currentUser.employer_id }, "tpa-log")
    //   }
    // }

    if (currentUser.employer_id || currentUser.broker_id) {
      const payload = currentUser.employer_id ?
        { employer_id: currentUser.employer_id, document_type_id: 24 } :
        { broker_id: currentUser.broker_id, document_type_id: 24 };

      loadErrorSheetAction(dispatch, payload, service.loadErrorSheet);
      const intervalId = setInterval(() => loadErrorSheetAction(dispatch, payload, service.loadErrorSheet), 15000);
      return () => { clearInterval(intervalId); }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  useEffect(() => {
    if (employer_id) {
      loadPolicyType(dispatch, { employer_id: employer_id }, "tpa-log");
      return () => {
        dispatch({ type: 'GENERIC_UPDATE', payload: { policy_types: [] } });
        setValue([
          { policy_type: undefined },
          { policy_id: undefined },
          { template_id: undefined }
        ])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id])

  useEffect(() => {
    if (policy_type) {
      loadPolicyNo(dispatch,
        { user_type_name: userTypeName, employer_id: employer_id /* || currentUser.employer_id */, policy_sub_type_id: policy_type },
        userType === 'broker');
      return () => {
        dispatch({ type: 'GENERIC_UPDATE', payload: { policy_nos: [] } });
        setValue([
          { policy_id: undefined },
          { template_id: undefined }
        ])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_type])


  // Prefill 
  Prefill((trigger?.is_employer_wise_template_allowed || trigger?.is_policy_wise_template_allowed) ? employers : [], setValue, 'employer_id')
  Prefill(trigger?.is_policy_wise_template_allowed ? policy_types : [], setValue, 'policy_type')
  Prefill(trigger?.is_policy_wise_template_allowed ? policy_nos : [], setValue, 'policy_id')

  const onReset = () => {
    dispatch({ type: 'LOADING', payload: true });
    setValue([
      { employer_id: undefined },
      { policy_type: undefined },
      { policy_id: undefined },
      { template_id: undefined },
      { trigger_id: undefined },
      { file: undefined }
    ])
    setTimeout(() => {
      dispatch({ type: 'LOADING', payload: false });
    }, 200);
  }


  const onSubmit = (data) => {
    const formData = new FormData();

    if (trigger?.trigger_all === 1 && +trigger_type === 2) {
      formData.append('trigger_email_to', 1);
    } else {
      formData.append("file", data.file[0]);
    }


    formData.append('trigger_id', data.trigger_id?.value);
    formData.append('broker_id', currentUser?.broker_id);
    (data.employer_id?.value && (trigger?.is_employer_wise_template_allowed || trigger?.is_policy_wise_template_allowed)) && formData.append('employer_id', data.employer_id?.value);
    (data.policy_type?.value && trigger?.is_policy_wise_template_allowed) && formData.append('policy_sub_type_id', data.policy_type?.value);
    (data.policy_id?.value && trigger?.is_policy_wise_template_allowed) && formData.append('policy_id', data.policy_id?.value);
    data.template_id?.value && formData.append('template_id', data.template_id?.value);

    triggerEmailUplaod(dispatch, formData, setValue,)
  }

  return <>
    <Card title={'Trigger E-mail Upload'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Event Type"
                  placeholder="Select Event Type"
                  required={false}
                  isRequired
                  options={selectedEvent}
                  error={errors && errors.trigger_id?.id}
                />
              }
              onChange={([e]) => {
                loadTemplate(dispatch, {
                  broker_id: currentUser?.broker_id || 1,
                  trigger_id: e?.value
                });
                setEventType(e?.value)
                setValue([
                  { employer_id: undefined },
                  { policy_type: undefined },
                  { policy_id: undefined },
                  { template_id: undefined }
                ])
                return e
              }}
              control={control}
              name="trigger_id"
            />
            {!!errors.trigger_id?.id && <Error>
              {errors.trigger_id?.id.message}
            </Error>}
          </Col>

          <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Template"
                  placeholder="Select Template"
                  required={false}
                  options={templates}
                  // isRequired
                  isClearable
                  error={errors && errors.template_id?.id}
                />
              }
              control={control}
              name="template_id"
            />
            {!!errors.template_id?.id && <Error>
              {errors.template_id?.id.message}
            </Error>}
          </Col>

          {!!(trigger?.is_employer_wise_template_allowed || trigger?.is_policy_wise_template_allowed) &&
            ['broker'].includes(userType) && <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired={eventType !== 44}
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

          {/* {!!(trigger?.is_employer_wise_template_allowed || trigger?.is_policy_wise_template_allowed) &&
            !!(currentUser.is_super_hr && currentUser.child_entities.length) && <Col md={6} lg={4} xl={4} sm={12}>
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
                onChange={([selected]) => {
                  loadPolicyType(dispatch, { employer_id: selected.value }, "tpa-log");
                  setValue([
                    { policy_type: undefined },
                    { policy_id: undefined },
                    { template_id: undefined }
                  ])
                  return selected;
                }}
                defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>} */}

          {!!trigger?.is_policy_wise_template_allowed && <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Policy Type"
                  placeholder="Select Policy Type"
                  required={false}
                  isRequired={eventType !== 44}
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
          </Col>}

          {!!trigger?.is_policy_wise_template_allowed && <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Policy Name"
                  placeholder="Select Policy Name"
                  required={false}
                  isRequired={eventType !== 44}
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
          </Col>}

          {trigger?.trigger_all === 1 && <Col md={6} lg={6} xl={4} sm={12}>
            <Head className='text-center'>Trigger Type?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2">
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"Upload File"}</p>
                <input ref={register} name={'trigger_type'} type={'radio'} value={1} defaultChecked={true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", position: 'inherit' }}>{"All"}</p>
                <input ref={register} name={'trigger_type'} type={'radio'} value={2} />
                <span></span>
              </CustomControl>
            </div>
          </Col>}


          {+trigger_type !== 2 && <Col md={12} lg={12} xl={12} sm={12}>
            <AttachFile2
              fileRegister={register}
              control={control}
              defaultValue={""}
              name="file"
              title="Attach File"
              key="premium_file"
              resetValue={loading || loadingDetail}
              accept={".xls, .xlsx"}
              description="File Formats: xls, xlsx"
              nameBox
              required
            />
            {!!trigger?.value && <AnchorTag href={"#"}
              onClick={() => loadSampleFormatAction({ trigger_id: trigger?.value })}
            >
              <i
                className="ti-cloud-down attach-i"
                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
              ></i>
              <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                Download Sample Format
              </p>
            </AnchorTag>}
            {!!errors?.file && <Error>{errors?.file?.message}</Error>}
          </Col>
          }

        </Row>
        <Row className="d-flex flex-wrap mt-3">
          <Col md={12} lg={12} xl={8} sm={12}>
            <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
              <Title fontSize="0.9rem" color='#70a0ff'>
                Note: Template is non-mandatory. If no template is selected then template mapped to Employer/Policy or default will be sent.
              </Title>
            </TextCard>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button buttonStyle='danger' type="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="submmit" >
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
    {loadingDetail && <ProgressBar text='Uploading Data...' />}

    <Card title={'Trigger E-mail Upload Status'}>
      <DataTable
        columns={
          ErrorSheetTableData(userType) ||
          []
        }
        data={details}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10]}
        rowStyle
        autoResetPage={false}
      />
    </Card>
    {loading && <Loader />}
  </>
}
