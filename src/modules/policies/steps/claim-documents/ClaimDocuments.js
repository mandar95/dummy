import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap';

import { AttachFile2 } from 'modules/core';
import { Switch } from "modules/user-management/AssignRole/switch/switch";
import { Button, Error, Input, Marker, Typography } from 'components';


import { Controller, useForm } from 'react-hook-form';
import { SelectComponent } from '../../../../components';

const Wrapper = styled.div`
`;

const Title = styled.div`
  margin-bottom: 3rem;
  h4 {
    color: ${({ theme }) => theme.dark ? '#ffffff' : '#000000'};
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
    
    letter-spacing: 1px;
    z-index: 1;
    span {
      height: 15px;
      width: 15px;
      background-color: #f2c9fb;
      border-radius: 50%;
      display: inline-block;
      margin-bottom: 5px;
      margin-right: -9px;
      opacity: 0.7;
    }
  }
`;

// const validationSchema = yup.object().shape({
//   claims_array: yup.array().of(
//     yup.object().shape({
//       document_name: yup.string().required('Document name required'),
//       // sample_document_url: yup.mixed().required("File is requied")
//     }))
// })
let _documentType = [{ id: 1, name: 'Pre Hospitalization' }, { id: 2, name: 'Post Hospitalization' }, { id: 3, name: 'Hospitalization' }]

const ClaimDocuments = (props) => {
  const { savedConfig, formId, onSave } = props;

  const { control, errors, register, handleSubmit, watch, setValue } = useForm({
    // validationSchema
    defaultValues: {
      claims_array: savedConfig?.claims_array || [],
      claims_array_opd: savedConfig?.claims_array_opd || [],
      is_claim_intimation_mandatory: savedConfig?.is_claim_intimation_mandatory || 0
    }
  });
  const claimsArray = watch('claims_array') || [];
  const claimsArray_opd = watch('claims_array_opd') || [];
  const [count, setCount] = useState(savedConfig?.claims_array?.length || 1)
  const [count_opd, setCount_opd] = useState(savedConfig?.claims_array_opd?.length || 1)

  useEffect(() => {
    setValue('claim_back_date_days', savedConfig?.claim_back_date_days || '0')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedConfig])

  // useEffect(() => {

  //   if (claimsArray.length) {
  //     claimsArray.forEach(({ sample_document_url }, index) => {
  //       register(`claims_array[${index}].document_name`, { required: sample_document_url.length ? true : false });
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [claimsArray]);

  // useEffect(() => {

  //   if (claimsArray_opd.length) {
  //     claimsArray_opd.forEach(({ sample_document_url }, index) => {
  //       register(`claims_array_opd[${index}].document_name`, { required: sample_document_url.length ? true : false });
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [claimsArray_opd]);


  const is_ipd_opd = Number(savedConfig.policy_rater_type_id) === 3

  const addCount = () => {
    setCount(prev => prev ? prev + 1 : 1);
  }

  const subCount = () => {
    setCount(prev => prev === 1 ? 1 : prev - 1);
  }

  const addCount_opd = () => {
    setCount_opd(prev => prev ? prev + 1 : 1);
  }

  const subCount_opd = () => {
    setCount_opd(prev => prev === 1 ? 1 : prev - 1);
  }

  const onSubmit = (data) => {
    if (onSave) onSave({ formId, data });
  };

  const formFormat = (index, key, opd) => (
    <Row key={key + index}>
      <Col xl={4} lg={5} md={6} sm={12}>
        <Controller
          as={
            <Input
              label="Document Name"
              id='document_id'
              placeholder="Enter Document Name"
              required={(opd ? claimsArray_opd : claimsArray)[index]?.sample_document_url?.length ? true : false}
            />
          }
          error={errors && errors[`claims_array${opd}`] && errors[`claims_array${opd}`][index]?.document_name}
          control={control}
          // rules={{ required: !claimsArray[index]?.sample_document_url?.length ? true : false }}
          name={`claims_array${opd}[${index}].document_name`}
        />
        {!!(errors[`claims_array${opd}`] && errors[`claims_array${opd}`][index]?.document_name) && <Error>
          {errors[`claims_array${opd}`][index]?.document_name.message}
        </Error>}
      </Col>

      <Col xl={4} lg={5} md={6} sm={12}>
        {/* <Head className='text-center'>Document Type</Head>
        <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
          <CustomControl className="d-flex mt-4 mr-0">
            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Pre"}</p>
            <input ref={register} name={'document_type'} type={'radio'} value={1} defaultChecked={true} />
            <span></span>
          </CustomControl>
          <CustomControl className="d-flex mt-4 ml-0">
            <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Post"}</p>
            <input ref={register} name={'document_type'} type={'radio'} value={0} />
            <span></span>
          </CustomControl>
        </div> */}
        {(opd === '') && ([1, 3, 4, 5].includes(savedConfig.policy_rater_type_id)) ?
          <Controller
            as={
              <SelectComponent
                label={"Document Type"}
                placeholder={"Select Document Type"}
                options={
                  _documentType.map(({ id, name }) => ({
                    id,
                    label: name,
                    value: id,
                  })) || []
                }
                isRequired={false}
                required={false}
              />
            }
            isRequired={true}
            multi={true}
            closeMenuOnSelect={false}
            closeMenuOnScroll={false}
            hideSelectedOptions={true}
            isClearable={false}
            // defaultValue={1}
            control={control}
            name={`claims_array${opd}[${(index)}].document_type`}
          /> :
          <Controller
            as={
              <Input
                hidden
                label=""
                id='document_id'
              // placeholder="Enter Document Name"
              />
            }
            control={control}
            defaultValue={[{ id: 4 }]}
            // rules={{ required: !claimsArray[index]?.sample_document_url?.length ? true : false }}
            name={`claims_array${opd}[${(index)}].document_type`}
          />
        }
      </Col>

      <Col xl={4} lg={5} md={6} sm={12}>
        <Controller
          as={<Switch label={'Mandatory'} />}
          name={`claims_array${opd}[${(index)}].is_mandatory`}
          control={control}
          defaultValue={0}
          required={(opd ? claimsArray_opd : claimsArray)[index]?.sample_document_url?.length ? true : false}
        />
        {/* {!!(errors[`claims_array${opd}`] && errors[`claims_array${opd}`][index]?.is_mandatory) && <Error>
          {errors[`claims_array${opd}`][index]?.is_mandatory.message}
        </Error>} */}
      </Col>

      <Col xl={4} lg={5} md={6} sm={12}>
        <AttachFile2
          fileRegister={register}
          name={`claims_array${opd}[${(index)}].sample_document_url`}
          title="Attach Sample Format"
          key="premium_file"
          accept=".jpeg, .png, .jpg, .pdf"
          description="File Formats: jpeg, png, jpg, pdf"
          nameBox
        />
        {/* {!!(errors[`claims_array${opd}`] && errors[`claims_array${opd}`][index]?.sample_document_url) && <Error>
          {errors[`claims_array${opd}`][index]?.sample_document_url.message}
        </Error>} */}
      </Col>

    </Row>)

  return (<Wrapper>
    <Title>
      <h4>
        <span className="dot-xd"></span>
        Claim Document
      </h4>
    </Title>
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      {is_ipd_opd && <><Marker />
        <Typography className='mt-5'>{'\u00A0'} IPD</Typography></>}
      {[...Array(Number(count))].map((_, index) =>
        formFormat(index, 'claim-document-', '')
      )}
      <Row className='mt-3'>
        <Col className="d-flex justify-content-end align-items-center">
          <Button buttonStyle="warning" type='button' onClick={addCount}>
            <i className="ti ti-plus"></i> Add{'\u00A0'}
          </Button>
          {count !== 1 &&
            <Button buttonStyle="danger" type='button' onClick={subCount}>
              <i className="ti ti-minus"></i> Remove
            </Button>
          }
        </Col>
      </Row>
      {is_ipd_opd && <><Marker />
        <Typography className='mt-5'>{'\u00A0'} OPD</Typography></>}
      {is_ipd_opd && [...Array(Number(count_opd))].map((_, index) =>
        formFormat(index, 'claim-document-opd-', '_opd')
      )}
      {is_ipd_opd &&
        <Row className='mt-3'>
          <Col className="d-flex justify-content-end align-items-center">
            <Button buttonStyle="warning" type='button' onClick={addCount_opd}>
              <i className="ti ti-plus"></i> Add{'\u00A0'}
            </Button>
            {count_opd !== 1 &&
              <Button buttonStyle="danger" type='button' onClick={subCount_opd}>
                <i className="ti ti-minus"></i> Remove
              </Button>
            }
          </Col>
        </Row>
      }

      <Row>


        <Col xl={6} lg={7} md={12} sm={12}>
          <Title>
            <h4>
              <span className="dot-xd"></span>
              Intimate Claim Information
            </h4>
          </Title>
          <Controller
            as={
              <Input
                label="No Of Back Days (Intimate Claim)"
                placeholder="Enter No Of Back Days"
                type="number"
                min={0}
                noWrapper
                required
              />
            }
            name={"claim_back_date_days"}
            control={control}
            rules={{ required: true }}
          />
        </Col>

        <Col xl={6} lg={7} md={12} sm={12}>
          <Title>
            <h4>
              <span className="dot-xd"></span>
              Submit Claim Information
            </h4>
          </Title>
          <Controller
            as={<Switch />}
            name="is_claim_intimation_mandatory"
            control={control}
            defaultValue={0}
            label={`Claim Intimation Mandatory Before Submit Claim`}
          />
        </Col>

      </Row>
    </form>
  </Wrapper>)
}

export default ClaimDocuments;
