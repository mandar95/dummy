import React, { useEffect, useState } from 'react';

import { Card, Button } from 'components'
import { Col, Row } from 'react-bootstrap';
import { DataTable } from '../../user-management';
import { Error, Head, Input, Loader, Marker, Text, Typography, _downloadBtn } from '../../../components';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import swal from 'sweetalert';
import { AttachFile2 } from '../../core';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getClaimDetails, postDeficiencyUpload, tpaAcceptedExtensions } from '../claims.slice';

export function DeficiencyResolution() {


  const { id, type } = useParams()
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const development = decodeURIComponent(query.get("development") || "");
  const dispatch = useDispatch();
  const { claimDetailsData, loading } = useSelector((state) => state.claims);
  const [accepted_extensions, set_accepted_extensions] = useState([]);
  const { control, errors, register, handleSubmit, reset } = useForm({
    // validationSchema
  });

  const { fields = [], remove, append } = useFieldArray({
    control,
    name: 'documents'
  });

  useEffect(() => {
    if (id) {
      dispatch(getClaimDetails({ claim_id: id }, type, true))
    }
    append({ document_name: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (fields.length === 0) {
      append({ document_name: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  useEffect(() => {
    if (claimDetailsData?.policy_id) {
      tpaAcceptedExtensions({ policy_id: claimDetailsData?.policy_id }, set_accepted_extensions)
    }

  }, [claimDetailsData])

  const addCount = () => {
    if (fields?.length === 10) {
      return swal('Validation', 'Limit reached', 'info')
    }
    append({ document_name: '' });
  }

  const subCount = (id) => {
    if (fields?.length === 1) {
      return
    }
    remove(id);
  }

  const onSubmit = ({ documents = [] }) => {
    const formdata = new FormData();
    formdata.append('claim_id', id)
    formdata.append('policy_id', claimDetailsData?.policy_id)
    documents.forEach(({ document_name, document_file }, index) => {
      formdata.append(`document_name[${index}]`, document_name)
      formdata.append(`document_upload[${index}]`, document_file[0])
    })

    dispatch(postDeficiencyUpload(formdata, id, type, reset))
  }

  return (
    <>
      {(claimDetailsData?.deficiency_upload === 1 || development) && <Card title='Deficiency Resolution'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col xl={12} lg={12} md={12} sm={12} >
              <Head>Claim ID</Head>
              <Text>{id || "-"}</Text>
            </Col>
            <Col xl={4} lg={4} md={12} sm={12} >
              <Head>Deficiency Raised Date</Head>
              <Text>{claimDetailsData?.deficiency_raised_date}</Text>
            </Col>
            <Col xl={8} lg={8} md={12} sm={12} >
              <Head>Deficiency Reason</Head>
              <Text>{claimDetailsData?.deficiency_reason || '-'}</Text>
            </Col>
          </Row>
          <Marker />
          <Typography>{'\u00A0'} Upload Document</Typography>
          <Row>
            <Col xl={12} lg={12} md={12} sm={12}>

              {fields?.map(({ id }, index) =>
                <Row key={id} className='py-3 px-1 border'>
                  <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                      as={
                        <Input
                          label="Document Name"
                          id='document_id'
                          placeholder="Enter Document Name"
                          required
                        // isRequired
                        />
                      }
                      error={errors && errors[`documents`] && errors[`documents`][index]?.document_name}
                      control={control}
                      // rules={{ required: !claimsArray[index]?.sample_document_url?.length ? true : false }}
                      name={`documents[${index}].document_name`}
                    />
                    {!!(errors[`documents`] && errors[`documents`][index]?.document_name) && <Error>
                      {errors[`documents`][index]?.document_name.message}
                    </Error>}
                  </Col>

                  <Col xl={6} lg={6} md={6} sm={12} className='pt-2'>
                    <AttachFile2
                      fileRegister={register}
                      name={`documents[${index}].document_file`}
                      title="Attach Sample Format"
                      required
                      accept={accepted_extensions.length ? accepted_extensions.reduce((total, type) => total ? `${total}, .${type}` : `.${type}`, '') : ".pdf"}
                      description={`File Formats: ${accepted_extensions.length ? accepted_extensions.reduce((total, type) => total ? `${total}, ${type}` : `${type}`, '') : 'pdf'}`}
                      nameBox
                    />
                  </Col>
                  <Col xl={2} lg={2} md={6} sm={12} className="d-flex justify-content-center align-items-start pt-2">
                    {fields.length !== 1 &&
                      <Button buttonStyle='danger' type='button' onClick={() => subCount(index)}>
                        Remove
                      </Button>
                    }
                  </Col>
                </Row>
              )}
            </Col>
            <Col className="d-flex justify-content-center align-items-center mt-3">
              <Button buttonStyle="warning" type='button' onClick={addCount}>
                <i className="ti ti-plus"></i> Add Document{'\u00A0'}
              </Button>

            </Col>
          </Row>
          <Row>
            <Col className='d-flex justify-content-end' xl={12} lg={12} md={12} sm={12}>
              <Button type='button' buttonStyle='danger' onClick={reset}>Reset</Button>
              <Button type='submit'>Submit</Button>
            </Col>
          </Row>

        </form>

      </Card>}
      {
        !!claimDetailsData?.deficiency_documents?.length && <Card title='Documents Uploaded Detail'>
          <DataTable
            columns={
              Column
            }
            data={claimDetailsData?.deficiency_documents.map((elem, index) => ({ ...elem, index: index + 1 })) || []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
          />

        </Card>
      }
      {loading && <Loader />}
    </>
  )
}

const Column = [
  {
    Header: "Sr. No",
    accessor: "index"
  },
  {
    Header: "Documents Name",
    accessor: "name"
  },
  {
    Header: "Documents",
    accessor: "file",
    Cell: _downloadBtn,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Uploaded On",
    accessor: "uploaded_on"
  },
  {
    Header: "Uploaded By",
    accessor: "uploaded_by"
  }
]
