import React, { useEffect, useReducer, useState } from "react";
import * as yup from "yup";
import swal from "sweetalert";

import { CardBlue, SelectComponent, Error, Button, Loader } from "components";
import { Row, Col } from "react-bootstrap";
import { AttachFile2 } from '../core';
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";

import {
  // loadEmployers, 
  loadErrorSheetAction, loadSampleFormatAction, createAction
} from '../offline-tpa/offline-tpa.action';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from "react-router";
import { serializeError } from "../../utils";
import offlineTpaService from "../offline-tpa/offline-tpa.service";
import { AnchorTag } from "../EndorsementRequest/style";
import { ProgressBar } from "../EndorsementRequest/progressbar";
import { ErrorData } from "../offline-tpa/error-data/ErrorData";
import service from '../offline-tpa/offline-tpa.service';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Tab, TabWrapper } from "../../components";

const initialState = {
  loading: false,
  employers: [],
  details: [],
  loadingUpload: false
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'LOADING_UPLOAD': return {
      ...state,
      loadingUpload: payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}
/*----------validation schema----------*/
const validationSchema = (userType) => yup.object().shape({
  ...(userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer required')
    })
  })
})


export const PolicyCoverage = ({ myModule }) => {

  const [{
    // employers,
    loading,
    loadingUpload,
    details
  }, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [type_id, setType_id] = useState(1);

  const SampleAPI = type_id === 1 ? offlineTpaService.laodCoverageSample : offlineTpaService.laodCoverActionSample;
  const SubmitAPI = type_id === 1 ? offlineTpaService.uploadPolicyCoverage : offlineTpaService.uploadPolicyCoverAction;

  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  const { control, errors, handleSubmit, watch, register, reset } = useForm({
    validationSchema: validationSchema(userType),
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const employer_id = watch('employer_id')?.value;
  const { globalTheme } = useSelector(state => state.theme)

  // initial load
  useEffect(() => {
    // if (userType === 'broker') {
    //   loadEmployers(dispatch);
    // }
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
  // load error
  useEffect(() => {
    if (currentUser.employer_id || currentUser.broker_id) {
      const payload = currentUser.employer_id ?
        { employer_id: currentUser.employer_id, document_type_id: type_id === 1 ? 20 : 25 } :
        { broker_id: currentUser.broker_id, document_type_id: type_id === 1 ? 20 : 25 };

      loadErrorSheetAction(dispatch, payload, service.loadErrorSheet);
      const intervalId = setInterval(() => loadErrorSheetAction(dispatch, payload, service.loadErrorSheet), 15000);
      return () => { clearInterval(intervalId); }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, type_id])


  const onSubmit = ({ employer_id, file }) => {
    if (!file?.length) {
      swal('Validation', 'Upload Sheet', 'info');
      return null;
    }

    const formData = new FormData();
    formData.append('employer_id', employer_id?.value);
    type_id === 1 && formData.append('type_id', type_id);

    formData.append('sheet', file[0]);
    const loadPayload = currentUser.employer_id ?
      { employer_id: currentUser.employer_id, document_type_id: type_id === 1 ? 20 : 25 } :
      { broker_id: currentUser.broker_id, document_type_id: type_id === 1 ? 20 : 25 };

    createAction(dispatch, formData, loadPayload, reset, { saveApi: SubmitAPI, loadErrorApi: service.loadErrorSheet })

  };

  return (
    <>
      <TabWrapper width={"max-content"}>
        <Tab
          isActive={type_id === 1}
          onClick={() => {
            setType_id(1);
          }}
        >
          Lock In
        </Tab>
        <Tab
          isActive={type_id === 2}
          onClick={() => {
            setType_id(2);
          }}
        >
          Cover Action
        </Tab>
      </TabWrapper>
      {myModule?.canwrite && <CardBlue title={`Policy ${type_id === 1 ? 'Lock-In' : 'Cover Action'}  Upload`} round>
        <form onSubmit={handleSubmit(onSubmit)}>
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

            <Col md={12} lg={12} xl={12} sm={12}>
              <AttachFile2
                fileRegister={register}
                control={control}
                defaultValue={""}
                name="file"
                title="Attach File"
                key="premium_file"
                resetValue={loading}
                accept={".xls, .xlsx"}
                description="File Formats: xls, xlsx"
                nameBox
                required
              />
              {!!employer_id && <AnchorTag href={"#"}
                onClick={() => loadSampleFormatAction({ employer_id }, SampleAPI)}
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

          </Row>
          <Row className="d-flex flex-wrap mt-3">
            <Col md={12} lg={12} xl={5} sm={12}>
              <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
                <Title fontSize="0.9rem" color='#70a0ff'>
                  Note: Value of Cell should be <Title fontSize="0.91rem" color='#3076ff'>Yes</Title> & <Title fontSize="0.91rem" color='#3076ff'>No</Title>
                  <br />
                  <Title fontSize="0.91rem" color='#3076ff'>Yes</Title>: Relation Mandatory
                  <br />
                  <Title fontSize="0.91rem" color='#3076ff'>No</Title>: Relation will be Hidden
                  <br />
                  Row A will have <Title fontSize="0.91rem" color='#3076ff'>Employee Code</Title>
                </Title>
              </TextCard>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </CardBlue>}
      <ErrorData
        ErrorSheetData={details}
        moduleData={{ title: type_id === 1 ? 'Policy Lock-In ' : 'Cover Action' }}
        userType={userType} />
      {loading && <Loader />}
      {loadingUpload && <ProgressBar text='Uploading Data...' />}
    </>
  );
};
