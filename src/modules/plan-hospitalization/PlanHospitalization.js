import React, { useEffect, useReducer } from 'react';
import * as yup from 'yup';

import { Card, SelectComponent, Error, Loader, Button } from '../../components';
import { Row, Col } from 'react-bootstrap';
import { AttachFile2 } from "modules/core";
import { AnchorTag } from '../policies/steps/premium-details/styles';

import {
  // loadEmployers, 
  loadPolicyType, loadPolicyNo, downloadSample,
  exportPlannedHosp,
  sheetStatus
} from './plan-hospitalization.action';
import { serializeError, downloadFile } from '../../utils';
import { useForm, Controller } from "react-hook-form";
import { useSelector,useDispatch } from 'react-redux';
import { DataTable } from '../user-management';
import { ErrorSheetColumn } from './plan-hospitalization.helper';
import {
  fetchEmployers,
  setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";

const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  sampleURL: '',
  sheetDetail: [],
  error: false
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

const validationSchema = yup.object().shape({
  employer_id: yup.object().shape({
    id: yup.string().required('Employer Required'),
  }),
  policy_type_id: yup.object().shape({
    id: yup.string().required('Policy Type Required'),
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name Required'),
  })
})

export function PlanHospitalization({ myModule }) {
  const { globalTheme } = useSelector(state => state.theme)
  const dispatchRedux = useDispatch();
  const [{ loading, 
    // employers, 
    policy_types, policy_nos, sampleURL, sheetDetail }, dispatch] = useReducer(reducer, initialState);
  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
  const { employers,
		firstPage: fp,
		lastPage: lp, } = useSelector(
    (state) => state.networkhospitalbroker
  );
  const { control, errors, handleSubmit, watch, register, setValue } = useForm({
    validationSchema,
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const employer_id = watch('employer_id')?.value;
  const policy_id = watch('policy_id')?.value;

  useEffect(() => {
    // loadEmployers(dispatch);
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
			if (lp >= fp) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatchRedux(fetchEmployers({ broker_id: currentUser?.broker_id }, fp));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fp, currentUser]);

  useEffect(() => {
    if (currentUser?.broker_id) {
      sheetStatus(dispatch, { broker_id: currentUser?.broker_id });
      const intervalId = setInterval(() => sheetStatus(dispatch, { broker_id: currentUser?.broker_id }), 15000);
      return () => { clearInterval(intervalId); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])


  useEffect(() => {
    if (sampleURL)
      downloadFile(sampleURL)

    return () => { dispatch({ type: 'GENERIC_UPDATE', payload: { sampleURL: '' } }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleURL])

  const onSubmit = ({ document, employer_id, policy_id }) => {

    const formData = new FormData();

    formData.append('hosp_detail_sheet', document[0]);
    formData.append('policy_id', policy_id?.value);
    formData.append('employer_id', employer_id?.value);

    exportPlannedHosp(dispatch, formData)
  }

  return (
    <>
      {!!myModule?.canwrite && <Card title='Planned Hospitalization Configuration'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Employer"
                    placeholder="Select Employer"
                    required={false}
                    isRequired
                    options={employers.map(item => (
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
                  loadPolicyType(dispatch, { employer_id: selected?.value })
                  setValue('policy_type_id', '')
                  setValue('policy_id', '')
                  return selected;
                }}
                control={control}
                name="employer_id"
              />
              {!!errors.employer_id?.id && <Error>
                {errors.employer_id?.id.message}
              </Error>}
            </Col>
            <Col md={6} lg={4} xl={4} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    label="Policy Type"
                    placeholder="Select Policy Type"
                    required={false}
                    isRequired
                    options={policy_types}
                    error={errors && errors.policy_type_id?.id}
                  />
                }
                onChange={([selected]) => {
                  loadPolicyNo(dispatch, { user_type_name: userTypeName, employer_id, policy_sub_type_id: selected?.value })
                  setValue('policy_id', '')
                  return selected;
                }}
                control={control}
                name="policy_type_id"
              />
              {!!errors.policy_type_id?.id && <Error>
                {errors.policy_type_id?.id.message}
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
                onChange={([selected]) => {
                  return selected;
                }}
                control={control}
                name="policy_id"
              />
              {!!errors.policy_id?.id && <Error>
                {errors.policy_id?.id.message}
              </Error>}
            </Col>

            <Col md={12} lg={12} xl={12} sm={12} className='mt-4'>
              <AttachFile2
                fileRegister={register}
                name={'document'}
                title={'Upload Planned Hosptilzation Document'}
                key="file"
                required
                accept={".xlsx, .xls"}
                description="File Formats: (.xlsx .xls)"
                nameBox
              />
              {!!policy_id && <AnchorTag href={'#'} onClick={() => downloadSample(dispatch, { policy_id, employer_id })}>
                <i
                  className="ti-cloud-down attach-i"
                  style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                ></i>
                <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                  Download Sample Format
                </p>
              </AnchorTag>}
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-5">
              <Button type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </form>
        {loading && <Loader />}
      </Card>}
      {!!sheetDetail.length && <Card title='Sheet Status'>
        <DataTable
          columns={ErrorSheetColumn}
          data={sheetDetail}
          noStatus={true}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10]}
          rowStyle
          autoResetPage={false}
        />
      </Card>}
    </>
  )
}
