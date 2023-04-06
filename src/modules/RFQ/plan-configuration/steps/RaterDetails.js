import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import swal from 'sweetalert';

import { useDispatch, useSelector } from 'react-redux';
import { AttachFile } from 'modules/core';
import { AnchorTag, Title } from '../style';
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';
import { downloadSampleFile } from 'modules/policies/policy-config.slice';
import { insurer } from 'config/validations'

const validation = insurer.plan_config

const Wrapper = styled.div`
`;

const FormWrapper = styled.div`
`;

export const RaterDetails = props => {

  const { savedConfig, formId, onSave } = props;

  const dispatch = useDispatch();
  const [familyFile, setFamilyFile] = useState(null);
  const [individualFile, setIndividualFile] = useState(null);
  const { globalTheme } = useSelector(state => state.theme)

  const { control, errors, register, watch, handleSubmit } = useForm({
    defaultValues: savedConfig || {},
  });

  const isIndividual = watch('has_individual');
  const isFamily = watch('has_family');

  // useEffect(() => {
  //   if (savedConfig) {

  //   }
  // }, [savedConfig]);

  const downloadFamilySample = () => {
    dispatch(downloadSampleFile({ sample_type_id: 34 }));
    // swal("Sorry", "No sample file format available.", "info");
  };

  const downloadIndividualSample = () => {
    dispatch(downloadSampleFile({ sample_type_id: 33 }));
    // swal("Sorry", "No sample file format available.", "info");
  };

  const onUploadFile = (prop, file) => {
    if (prop === 'family_file') {
      setFamilyFile(file);
    } else {
      setIndividualFile(file);
    }
    return file;
  };

  const onSubmit = data => {
    if (isIndividual || isFamily) {
      if (onSave) onSave({ ...savedConfig, ...data, individual_file: individualFile, family_file: familyFile });
    }
    else
      swal("Validation", "Select atleast one type", "info");

  };


  return (
    <Wrapper>
      <Title>
        <h4>
          <span className="dot-xd"></span>
          SI &amp; Premium
        </h4>
      </Title>
      <FormWrapper>
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <InputWrapper className="custom-control custom-checkbox">
              <input
                id="customCheck1"
                className="custom-control-input"
                type="checkbox"
                name="has_individual"
                ref={register} />

              <label style={{ fontSize: globalTheme.fontSize ? `calc(1.4rem + ${globalTheme.fontSize - 92}%)` : '1.4rem', paddingTop: '0' }} className="custom-control-label" htmlFor="customCheck1">Individual</label>
            </InputWrapper>
          </Row>

          <Row>
            {!!(isIndividual) &&
              <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
                <Controller
                  as={
                    <AttachFile
                      key="individual_file"
                      name="individual_file"
                      title="Individual Rater File"
                      onUpload={(files) => onUploadFile('individual_file', files[0])}
                      {...validation.file}
                      nameBox
                      defaultFileName={individualFile?.name || ''}
                      required={true}
                      error={errors && errors.individual_file}
                    />
                  }
                  name="individual_file"
                  control={control}
                />
                <AnchorTag href={'#'} onClick={downloadIndividualSample}>
                  <i
                    className="ti-cloud-down attach-i"
                    style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                  ></i>
                  <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                    Download Sample Format
                  </p>
                </AnchorTag>
              </Col>
            }
          </Row>

          <Row>
            <InputWrapper className="custom-control custom-checkbox">
              <input
                id="customCheck2"
                className="custom-control-input"
                type="checkbox"
                name="has_family"
                ref={register} />

              <label style={{ fontSize: globalTheme.fontSize ? `calc(1.4rem + ${globalTheme.fontSize - 92}%)` : '1.4rem', paddingTop: '0' }} className="custom-control-label" htmlFor="customCheck2">Family</label>
            </InputWrapper>
          </Row>
          <Row>

            {!!(isFamily) &&
              <Col xl={6} lg={6} md={12} sm={12} className="mt-3">
                <Controller
                  as={
                    <AttachFile
                      name="family_file"
                      title="Family Rater File"
                      key="family_file"
                      onUpload={(files) => onUploadFile('family_file', files[0])}
                      {...validation.file}
                      nameBox
                      defaultFileName={familyFile?.name || ''}
                      required={true}
                      error={errors && errors.family_file}
                    />
                  }
                  name="family_file"
                  control={control}
                />
                <AnchorTag href={'#'} onClick={downloadFamilySample}>
                  <i
                    className="ti-cloud-down attach-i"
                    style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                  ></i>
                  <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                    Download Sample Format
                  </p>
                </AnchorTag>
              </Col>}
          </Row>

        </form>
      </FormWrapper>
    </Wrapper >
  )
}
