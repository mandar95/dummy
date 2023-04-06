import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
// import _ from 'lodash';

import { Button } from "components";
import { Row, Col, Form } from 'react-bootstrap';
import { AttachFile } from 'modules/core'
import { AnchorTag } from 'modules/policies/steps/premium-details/styles';
import { InputWrapper } from 'modules/policies/steps/additional-details/styles';

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { sampleFile, clearSampleURL, approvePolicy } from 'modules/policies/approve-policy/approve-policy.slice';
import { downloadFile } from 'utils';
import { updateRfq } from '../../rfq.slice';
import { insurer } from 'config/validations'

const validation = insurer.plan_config

export const EditRateDetail = ({ rfqData, ic_plan_id, ic_id, broker_id }) => {

  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const [familyFile, setFamilyFile] = useState(null);
  const [individualFile, setIndividualFile] = useState(null);

  const { control, errors, register, watch, handleSubmit } = useForm({
    defaultValues: {
      has_individual: rfqData.has_indivdual ? true : false,
      has_family: rfqData.has_family_floater ? true : false,
    },
  });

  const isIndividual = watch('has_individual');
  const isFamily = watch('has_family');

  const { sampleURL } = useSelector(approvePolicy);

  useEffect(() => {
    if (sampleURL) {
      downloadFile(sampleURL);
    }

    return (() => { dispatch(clearSampleURL()) })
  }, [sampleURL, dispatch])


  const downloadFamilySample = () => {
    dispatch(sampleFile(34));
    // swal("Sorry", "No sample file format available.", "info");
  };

  const downloadIndividualSample = () => {
    dispatch(sampleFile(33));
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

  const onSubmit = (data) => {

    const formData = new FormData();

    if ((data.has_individual && !rfqData.has_indivdual) || individualFile) {
      if (data.has_individual && individualFile) {
        formData.set('indivdual_rate_sheet', individualFile)
        formData.set('has_indivdual', 1)
      }
      else {
        swal("Incomplete", "Attach individual rate file", "info");
        return;
      }
    } else if (!data.has_individual) {
      formData.set('has_indivdual', 0)
    }

    if ((data.has_family && !rfqData.has_family_floater) || familyFile) {
      if (data.has_family && familyFile) {
        formData.set('family_floater_sheet', familyFile)
        formData.set('has_family_floater', 1)
      } else {
        swal("Incomplete", "Attach family rate file", "info");
        return;
      }
    } else if (!data.has_family) {
      formData.set('has_family_floater', 0)
    }



    formData.append(`step`, 3);
    formData.append(`ic_plan_id`, ic_plan_id);

    dispatch(updateRfq(formData, { ic_plan_id, ic_id, broker_id }))

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Row>
        <InputWrapper className="custom-control custom-checkbox">
          <input
            id="customCheck1"
            className="custom-control-input"
            type="checkbox"
            name="has_individual"
            ref={register} />

          <label style={{ fontSize: globalTheme.fontSize ? `calc(1.4rem + ${globalTheme.fontSize - 92}%)` : '1.4rem', paddingTop: '0' }} className="custom-control-label" htmlFor="customCheck1">Individual Rater</label>
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
                  {...validation.file}
                  onUpload={(files) => onUploadFile('individual_file', files[0])}
                  nameBox
                  defaultFileName={individualFile?.name || ''}
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

          <label style={{ fontSize: globalTheme.fontSize ? `calc(1.4rem + ${globalTheme.fontSize - 92}%)` : '1.4rem', paddingTop: '0' }} className="custom-control-label" htmlFor="customCheck2">Family Rater</label>
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
                  {...validation.file}
                  onUpload={(files) => onUploadFile('family_file', files[0])}
                  nameBox
                  defaultFileName={familyFile?.name || ''}
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

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
