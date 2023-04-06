import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import * as yup from "yup";

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button, SelectComponent } from 'components'
// import Select from "modules/user-management/Onboard/Select/Select";
import { AttachFile } from 'modules/core'
import { AnchorTag } from 'modules/policies/steps/premium-details/styles';
import { CustomControl } from "modules/user-management/AssignRole/option/style";

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import {
  // loadEmployer, clearEmployer,
  // loadSubTypePolicy, clear_sub_type_policy,
  help, saveBrokerFAQ,
  sampleFile, clearSampleURL
} from '../../help.slice';
import { downloadFile } from 'utils';


export const validationSchema = yup.object().shape({
  employer_id: yup.object().shape({
    id: yup.string().required('Employer Required'),
  }),
  sub_type_policy_id: yup.object().shape({
    id: yup.string().required('Policy Type Required'),
  }),
});


export const AddFAQ = ({ show, onHide, validation }) => {

  const [file, setFile] = useState();
  const { globalTheme } = useSelector(state => state.theme)
  const { control, handleSubmit, errors } = useForm({ validationSchema });
  const dispatch = useDispatch();
  const { sub_type_policy, sampleURL } = useSelector(help);
  const { employers } = useSelector(
    (state) => state.networkhospitalbroker
  );


  useEffect(() => {
    if (sampleURL) {
      downloadFile(sampleURL);
      swal({
        title: "Downloading",
        text: "Sample Format",
        timer: 2000,
        button: false,
        icon: "info",
      });
    }
    return () => {
      dispatch(clearSampleURL());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleURL]);

  const onSubmit = (data) => {
    if (file) {
      const formData = new FormData();

      formData.append(`file`, file);
      formData.append(`employer_id`, data.employer_id?.value);
      formData.append(`sub_type_policy_id`, data.sub_type_policy_id?.value);
      formData.append(`override`, data.override || "1");

      dispatch(saveBrokerFAQ(formData))
    }
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Add FAQ's</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap">
            <Col md={12} lg={6} xl={6} sm={12}>
              <Controller
                as={
                  <SelectComponent
                    name='employer_id'
                    label="Employer"
                    placeholder="Select Employer"
                    required
                    options={employers?.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                  />}
                error={errors.employer_id?.id}
                name="employer_id"
                control={control}
              />
            </Col>
            <Col md={12} lg={6} xl={6} sm={12}>
              <Controller
                as={<SelectComponent
                  label="Policy Type"
                  options={sub_type_policy.map(item => (
                    {
                      id: item.id,
                      label: item.name,
                      value: item.id
                    }))}
                  id="policy_type"
                  required
                />}
                error={errors.sub_type_policy_id?.id}
                name="sub_type_policy_id"
                control={control}
              />
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="text-left"
              style={{ border: "1.5px dotted #0093ff", borderRadius: "10px" }}>

              <div className="d-flex justify-content-around flex-wrap p-2">
                <Controller
                  as={<CustomControl className="d-flex mt-4" >
                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Overwrite file'}</h5>
                    <input name={'override'} type={'radio'} value={1} defaultChecked />
                    <span style={{ top: "-2px" }}></span>
                  </CustomControl>}
                  name={'override'}
                  control={control}
                />
                <Controller
                  as={<CustomControl className="d-flex mt-4" >
                    <h5 className="m-0" style={{ paddingLeft: "33px" }}>{'Add into existing FAQs'}</h5>
                    <input name={'override'} type={'radio'} value={0} />
                    <span style={{ top: "-2px" }}></span>
                  </CustomControl>}
                  name={'override'}
                  control={control}
                />
              </div>
              <AttachFile
                name="premium_file"
                title="Attach File"
                key="premium_file"
                {...validation.faq.file}
                onUpload={(files) => setFile(files[0])}
                nameBox
                required
              // error={errors && errors.premium_file}
              />
              <AnchorTag href={'#'}
                onClick={() => dispatch(sampleFile('14'))}
              >
                <i
                  className="ti-cloud-down attach-i"
                  style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                ></i>
                <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                  Download Sample Format
                </p>
              </AnchorTag>
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
              <Button type="submit">Save</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}

// PropTypes
AddFAQ.propTypes = {
  props: PropTypes.object
}

// DefaultTypes
AddFAQ.defaultProps = {
  props: { onHide: () => { } }
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
