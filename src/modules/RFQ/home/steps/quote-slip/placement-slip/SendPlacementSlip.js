import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Modal, Row, Col } from 'react-bootstrap';
import { Error, RFQButton } from 'components'
import { OptionInput as InputOption } from 'modules/policies/approve-policy/style.js'

import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router';
import { Input } from "modules/RFQ/components/index.js";

// import { OptionInput } from 'modules/enrollment/style.js'
import { CardContentConatiner } from 'modules/Insurance/style.js';
import { sendPlacementSlip } from './qcr.action';
import * as yup from "yup";
import { useSelector } from 'react-redux';

const validationSchema = yup.object().shape({
  name: yup.string()
    .min(2, "Please enter name more than 2 character")
    .required("Please Enter Name")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
  email: yup.string()
    .email('Please enter valid email id')
    .required('Email id is required'),

});

export const SendPlacementSlip = ({ show, onHide }) => {
  const { id, userType } = useParams();
  const { globalTheme } = useSelector(state => state.theme)
  const { register, handleSubmit, control, errors, setValue, watch } = useForm({
    validationSchema,
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const send_to = watch('send_to') || 'Insurer';

  useEffect(() => {
    if (userType === 'customer') {
      setValue('send_to', '2')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  const onSubmit = (data) => {
    let _data = {
      quote_id: id ? id : show.original.id,
      send_to: data.send_to || 'Insurer',
      name: data.name,
      email: data.email,
      create_account: data.create_account || 0
    }
    sendPlacementSlip(_data, onHide)
    // UploadFileApi(formData, 'insurer_cd_statement', payload, dispatch);

  }


  return (
    <Modal
      show={!!show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>{'Send Placement Slip'}</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className='d-flex justify-content-center m-1 p-2'>
            {UsersToSend(userType)?.map(({ name, id }) =>

              <Col md={6} lg={4} xl={3} sm={12} key={name + id} className='p-3'>
                <Card
                  className="card"
                  active={send_to === id}
                  onClick={() => {
                    setValue('send_to', String(id))
                  }}
                >
                  <div className="card-body card-flex-em">
                    <OptionInput className="d-flex">
                      <input
                        name={'send_to'}
                        type={"radio"}
                        ref={register}
                        value={id}
                        defaultChecked={userType === 'customer' ? (id === 'Customer' && true) : (id === 'Insurer' && true)}
                      />
                      <span></span>

                    </OptionInput>
                    <div
                      className="row rowButton2"
                      style={{
                        marginRight: "-15px !important",
                        marginLeft: "-15px !important",
                      }}>
                      <CardContentConatiner height={'auto'}>
                        <div className="col-md-12 text-center">
                          <Head>{name}</Head>
                        </div>
                      </CardContentConatiner>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
            <Col md={12} lg={12} xl={12} sm={12} className='mb-3'>
              {send_to === 'Customer' && <Controller
                as={<InputOption className="d-flex justify-content-center m-4">
                  <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>{"Create/Map Customer Account"}</p>
                  <input name={'create_account'} type={'checkbox'} defaultChecked={false} />
                  <span style={{ left: "-221px", top: "0" }}></span>
                </InputOption>}
                onChange={([e]) => { return e.target.checked ? 1 : 0 }}
                name={'create_account'}
                control={control}
              />}
            </Col>
            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
              <Input
                label="Name"
                name="name"
                id="name"
                maxLength="50"
                placeholder="Enter your name"
                autoComplete="none"
                inputRef={register}
                defaultValue={""}
                isRequired={true}
                required={false}
                error={errors?.name}
              />
              {!!errors?.name && <Error className="mt-0">{errors?.name?.message}</Error>}
            </Col>
            <Col md={12} lg={6} xl={6} sm={12} className='mb-3'>
              <Input
                label="Email ID"
                name="email"
                id="email"
                maxLength="50"
                placeholder="Enter Email ID"
                autoComplete="none"
                inputRef={register}
                defaultValue={""}
                isRequired={true}
                required={false}
                error={errors?.email}
              />
              {!!errors?.email && <Error className="mt-0">{errors?.email?.message}</Error>}
            </Col>
            <Col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              className="mt-4 mb-5"
            >
              <RFQButton>
                Send
                <i className="fa fa-long-arrow-right" aria-hidden="true" />
              </RFQButton>
            </Col>
          </Row>

        </form>
      </Modal.Body>
    </Modal >
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
`

const Card = styled.div`
border-radius: 18px;
box-shadow: rgb(179 179 179 / 35%) 1px 1px 12px 0px;
cursor: pointer;
border: 1px solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
background: ${({ theme, active }) => active ? (theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)') : '#fcfcfc'};
${Head} {
  color: ${({ theme, active }) => active ? '#fff' : (theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)')};
}
`


const UsersToSend = (userType) => [
  ...userType === 'broker' ? [{ name: 'Insurer', id: 'Insurer' }] : [],
  { name: 'Customer', id: 'Customer' },
  ...userType !== 'customer' ? [{ name: 'Other', id: 'Other' }] : []
]

export const OptionInput = styled.label`
  margin-left: 20px;
  cursor: pointer;
  user-select: none;
  position: absolute;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span{
    position: relative;
    left: -25px;
    top:  -7px;
    height: 20px;
    width: 20px;
    min-width: 20px;
    background-color: #fff;
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 0px 2px 6px 0px #0b0b0b40;
    border: 1px solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }
  span:after {
    content: "";
    position: relative;
    display: none;
    }
  /* &:hover input ~ span{
    background-color: #1bf29e3b;
    transition: all 0.2s;
  } */
  input:checked ~ span {
    background-color: #fff !important;
  }
  input:checked ~ span:after {
    display: block;
  }
  span:after {
    left: 3px;
    top: 1.1px;
    width: 4px;
    height: 8px;
    transition: all 1s;
    border: solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: 1.6;
    -moz-transform: scale(1.6);
}
`
