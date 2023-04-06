import React, { useEffect } from 'react';
import * as yup from 'yup';
import swal from 'sweetalert';

import { Card, SelectComponent, Error, Button } from 'components';
import { Row, Col } from 'react-bootstrap';
import { AttachFile2 } from 'modules/core';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { useForm, Controller } from "react-hook-form";
import { AnchorTag } from '../../EndorsementRequest/style';
import { createAction, loadPolicyNo, loadPolicyType, loadSampleFormatAction } from '../offline-tpa.action';
import { Head } from '../../../components';
import { Prefill } from '../../../custom-hooks/prefill';
import { useSelector } from 'react-redux';

const validationSchema = (userType) => yup.object().shape({
  ...(userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer required')
    })
  }),
  policy_type: yup.object().shape({
    id: yup.string().required('Policy Type required'),
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name required'),
  }),
})


export function UploadData({
  userType, state, dispatch,
  userTypeName, currentUser,
  moduleData, typeName, employers }) {
  const {
    policy_types,
    policy_nos,
    // employers,
    loading,
  } = state;

  const { title, saveApi, loadErrorApi, sampleFormatApi, fileName, type, document_type_id } = moduleData;

  const { control, errors, handleSubmit, register, watch, setValue, reset } = useForm({
    validationSchema: validationSchema(userType),
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const { globalTheme } = useSelector(state => state.theme)
  const employer_id = watch('employer_id')?.value || currentUser.employer_id;
  const policy_id = watch('policy_id')?.value;
  const policy_type = watch('policy_type')?.value;

  useEffect(() => {
    if (employer_id) {
      setValue([{ 'policy_type': undefined }, { 'policy_id': undefined }]);
      loadPolicyType(dispatch, { employer_id: employer_id }, typeName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer_id])

  useEffect(() => {
    if (policy_type) {
      setValue('policy_id', undefined);
      loadPolicyNo(dispatch,
        { user_type_name: userTypeName, employer_id: employer_id || currentUser.employer_id, policy_sub_type_id: policy_type },
        userType === 'broker')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_type])


  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(policy_types, setValue, 'policy_type')
  Prefill(policy_nos, setValue, 'policy_id')


  const onSubmit = ({ policy_id, employer_id, file, to_override }) => {

    if (!file?.length) {
      swal('Validation', 'Upload Sheet', 'info');
      return null;
    }

    const formData = new FormData();
    formData.append('employer_id', employer_id?.value || currentUser.employer_id);
    formData.append('is_super_hr', currentUser.is_super_hr);
    formData.append('policy_id', policy_id?.value);

    const loadPayload = currentUser.employer_id ?
      { employer_id: currentUser.employer_id, document_type_id } :
      { broker_id: currentUser.broker_id, document_type_id }

    if (Number(policy_type) === 2 || Number(policy_type) === 3) {
      // Data Submission for GPA Claims
      formData.append("file", file[0]);
      createAction(dispatch, formData, loadPayload, reset, { saveApi, loadErrorApi }, policy_type)
    } else {
      formData.append(fileName, file[0]);
      formData.append("to_override", to_override);
      createAction(dispatch, formData, loadPayload, reset, { saveApi, loadErrorApi }, policy_type)
    }

  }

  return (
    <Card title={title}>
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
                  options={employers}
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

          {(Number(policy_type) === 1 || typeName !== "claim-data") && <Col md={6} lg={4} xl={4} sm={12}>
            <Head className='text-center'>Should Overwrite ?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No"}</p>
                <input ref={register} name={'to_override'} type={'radio'} value={0} defaultChecked={true} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Yes"}</p>
                <input ref={register} name={'to_override'} type={'radio'} value={1} />
                <span></span>
              </CustomControl>
            </div>
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
            />
            {!!policy_id && <AnchorTag href={"#"}
              onClick={() => loadSampleFormatAction({ policy_id, type }, sampleFormatApi, policy_type)}
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
        <Row>
          <Col md={12} className="d-flex justify-content-end mt-4">
            <Button type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  )
}
