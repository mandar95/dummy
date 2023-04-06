import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as yup from "yup";

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'components'
import { SelectComponent } from "components";

import { useForm, Controller } from "react-hook-form";
// import { loadEmployers } from './service';
import { useHistory } from 'react-router';
import { fetchEmployers, setPageData } from "modules/networkHospital_broker/networkhospitalbroker.slice"
import { useSelector, useDispatch } from "react-redux";
import { Error } from '../../components';
// const EmployerApiCalls = async (dispatch, userTypeName) => {
//   try {
//     dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
//     const { data } = await loadEmployers(userTypeName);
//     dispatch({
//       type: 'GENERIC_UPDATE', payload: {
//         employers: data?.data?.map((item) => ({
//           id: item.id,
//           label: item.name,
//           value: item.id
//         })) || [], loading: false
//       }
//     });
//   }
//   catch (error) {
//     console.error(error)
//     dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
//   }
// }

const validationSchema = yup.object().shape({
  employer_id: yup.object().shape({
    id: yup.string().required('Employer Required'),
  })
});


export default function EmployerModal({
  show, onHide, userType,
  ApiCalls, dispatch, currentUser }) {
  const dispatchRedux = useDispatch();
  const { employers,
    firstPage,
    lastPage } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const { control, handleSubmit, errors } = useForm({
    validationSchema
  });
  const history = useHistory();

  const onSubmit = ({ employer_id }) => {
    if (employer_id?.value) {
      ApiCalls(dispatch, employer_id)

      setTimeout(onHide, 500);
    }
  }

  useEffect(() => {
    return () => {
      dispatchRedux(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ((currentUser?.broker_id)) {
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

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Select Employer</Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="d-flex flex-wrap justify-content-center">
            <Col md={10} lg={10} xl={10} sm={12}>
              <Controller
                as={userType === 'employer' ? <SelectComponent
                  label="Employers"
                  placeholder="Select Employer"
                  options={currentUser.child_entities.map(item => (
                    {
                      id: item.id,
                      label: item.name,
                      value: item.id
                    }
                  )) || []}
                  id="employer_id"
                  required
                />
                  : <SelectComponent
                    label="Employers"
                    placeholder="Select Employer"
                    options={employers?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    })) || []}
                    id="employer_id"
                    required
                    error={errors && errors?.employer_id?.id}
                  />}
                name="employer_id"
                control={control}
              />
              {!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button buttonStyle='danger' type="button" onClick={() => history.goBack()}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal >
  );
}


const Head = styled.span`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};

letter-spacing: 1px;
color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`
