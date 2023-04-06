import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Modal, Row, Col, Button as Btn } from 'react-bootstrap';
import { Input, Error } from 'components'
import { AttachFile2 } from 'modules/core';

import { useForm, Controller } from "react-hook-form";
import { downloadFile } from 'utils';
import { InsurerCdStatement, UploadFileApi } from './TypeWise';
import { DataTable } from '../user-management';
import { useSelector } from 'react-redux';


export const InsurerCDModal = ({ show, onHide, payload, dispatch, insurerCdDocument }) => {

  const { register, handleSubmit, errors, control } = useForm();

  useEffect(() => {
    if (payload?.policy_id)
      InsurerCdStatement(dispatch, payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data) => {
    if (data.files) {
      const formData = new FormData();

      formData.append('policy_id', payload.policy_id);
      formData.append('document_name', data.document_name);
      formData.append('documents', data.files[0]);
      formData.append('other', payload.other);
      UploadFileApi(formData, 'insurer_cd_statement', payload, dispatch);
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{payload.other ? 'Other Documents' : 'Insurer CD Statement'}</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className='d-flex justify-content-center m-1 p-2 border'>
            <Col md={8} lg={8} xl={7} sm={12}>
              <Controller
                as={
                  <Input
                    label="Document Name"
                    placeholder="Enter Document Name"
                    required={true}
                    maxLength={200}
                    error={errors && errors.comment}
                  />
                }
                control={control}
                name="document_name"
              />
              {!!errors.comment && <Error>
                {errors.comment.message}
              </Error>}
            </Col>
            <Col md={12} lg={6} xl={6} sm={12}>
              <AttachFile2
                fileRegister={register}
                defaultValue={""}
                name="files"
                title="Attach File"
                key="premium_file"
                accept={".png, .jpeg, .jpg, .xls, .xlsx, .tiff, .eml, .msg, .pdf"}
                // resetValue={resetFile}
                description={'File Formats: png, jpeg, jpg, xls, xlsx, tiff, eml, msg, pdf'}
                nameBox
              />
            </Col>
            <Col xl={4} lg={4} md={12} sm={12} className='d-flex justify-content-center align-items-center'>
              <Btn
                className="m-3"
                type="submit">
                Upload
              </Btn>
            </Col>
          </Row>

        </form>
        {!!(insurerCdDocument.length) && <div style={{ margin: '0 27px' }}>
          <DataTable
            columns={Column()}
            data={insurerCdDocument}
            noStatus
            rowStyle
            pageState={{ pageIndex: 0, pageSize: 3 }}
            pageSizeOptions={[3, 5, 10]}
          />
        </div>}
      </Modal.Body>
    </Modal >
  );
}

const DownloadSample = ({ value }) => {
  const { globalTheme } = useSelector(state => state.theme)
  return value ? <Btn variant='outline-secondary' size='sm' onClick={() => downloadFile(value, '', true)}>
    <i
      className="ti-cloud-down attach-i"
      style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
    />
    {'Download Document'}
  </Btn> : '-'
}

const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`

const Column = () => [
  {
    Header: "Document Name",
    accessor: "document_name",
  },
  {
    Header: "Document",
    accessor: "document_url",
    Cell: DownloadSample
  }
]
