import React, { useEffect, useReducer, useState } from "react";
import * as yup from "yup";
import swal from "@sweetalert/with-react";

import { CardBlue, SelectComponent, Error, Button, Loader } from "components";
import { Row, Col, Form, Table } from "react-bootstrap";
import { Img } from 'components/inputs/Select/style';
import { useSelector, useDispatch } from "react-redux";
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import DataUpload from "./MultipleFileDrop";

import {
  // loadEmployers, 
  loadPolicyNo, loadPolicyType
} from '../offline-tpa.action';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from "react-router";
import { serializeError } from "../../../utils";
import { TableRow } from "./TableRow";
import offlineTpaService from "../offline-tpa.service";
import {
  fetchEmployers, setPageData
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import { Prefill } from "../../../custom-hooks/prefill";

const initialState = {
  loading: false,
  employers: [],
  policy_types: [],
  policy_nos: [],
  details: [],
  loadingUpload: false
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'GENERIC_UPDATE': return {
      ...state,
      ...payload
    }
    case 'LOADING_UPLOAD': return {
      ...state,
      loadingUpload: payload
    }
    case 'ERROR': return {
      ...state,
      loading: false,
      error: serializeError(payload)
    }
    default: return state;
  }
}
/*----------validation schema----------*/
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


export const UploadECard = () => {
  const dispatchRedux = useDispatch();
  const { employers,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );

  const [{
    policy_types,
    policy_nos,
    // employers,
    loading,
    loadingUpload
  }, dispatch] = useReducer(reducer, initialState);

  const { userType } = useParams();
  const { userType: userTypeName, currentUser } = useSelector((state) => state.login);
  const [file, setFile] = useState([]);
  const [response, setResponse] = useState([]);

  const { control, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema: validationSchema(userType),
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const employer_id = watch('employer_id')?.value;
  const policy_id = watch('policy_id')?.value;
  const policy_type = watch('policy_type')?.value;

  // initial load
  useEffect(() => {
    // if (userType === 'broker') {
    //   loadEmployers(dispatch);
    // }
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

  useEffect(() => {
    if (employer_id) {
      setValue([{ 'policy_type': undefined }, { 'policy_id': undefined }]);
      loadPolicyType(dispatch, { employer_id: employer_id });
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


  useEffect(() => {
    if (file.length && file.length === response.length && loadingUpload) {
      swal(<div>
        <span
          role='button'
          className='text-primary'>
          <i className="ti ti-user"></i> Total ECard Uploaded :&nbsp;
          {file.length}
        </span>
        {response.some((elem) => elem?.status === 'true') && <>
          <br />
          <span
            className='text-success'
            role='button'>
            <i className="ti ti-check"></i>  Successfull :&nbsp;
            {response.filter((elem) => elem?.status === 'true').length}
          </span>
        </>}
        {response.some((elem) => elem?.status === 'false') && <>
          <br />
          <span
            className='text-danger'
            role='button'>
            <i className="ti ti-close"></i>  Failed :&nbsp;
            {response.filter((elem) => elem?.status === 'false').length}
          </span>
        </>}
      </div>)
      dispatch({ type: 'LOADING_UPLOAD', payload: false });
    }
  }, [file, response, loadingUpload])

  const onSubmit = async () => {

    if (!file.length) {
      swal('Validaton', 'No File Selected', 'info');
      return null;
    }
    if (!policy_id) {
      swal('Validaton', 'Select Policy Name', 'info');
      return null;
    }
    dispatch({ type: 'LOADING_UPLOAD', payload: true });
    let counter = 0;
    let i = setInterval(async function () {

      const formData = new FormData();
      formData.append("policy_id", policy_id);
      formData.append("documents", file[counter]);
      const { data, message, errors } = await offlineTpaService.uploadECard(formData);
      if (data) {
        setResponse(prev => {
          const copy = [...prev];
          copy[counter] = { message: serializeError(message || errors), status: data.status ? 'true' : 'false' };
          return copy
        });
        if (message === 'Too Many Attempts.') {
          for (let i = counter + 1; i <= file.length; ++i) {
            setResponse(prev => {
              const copy = [...prev];
              copy[i] = { message: 'Failed', status: 'false' };
              return copy
            });
          }
          dispatch({ type: 'LOADING_UPLOAD', payload: false });
          clearInterval(i);
        }
        ++counter;
      }
      if (counter === file.length) {
        clearInterval(i);
      }
    }, 500);
  };

  const ResetUploadFailedProcess = async () => {

    if (!policy_id) {
      swal('Validaton', 'Select Policy Name', 'info');
      return null;
    }
    dispatch({ type: 'LOADING_UPLOAD', payload: true });
    const failedDocuments = [];
    response.forEach((elem, index) => {
      if (elem?.status === 'false') {
        failedDocuments.push(file[index])
      }
    });

    setFile(failedDocuments)
    setResponse([]);

    let counter = 0;
    let i = setInterval(async function () {

      const formData = new FormData();
      formData.append("policy_id", policy_id);
      formData.append("documents", failedDocuments[counter]);
      const { data, message, errors } = await offlineTpaService.uploadECard(formData);
      if (data) {
        setResponse(prev => {
          const copy = [...prev];
          copy[counter] = { message: serializeError(message || errors), status: data.status ? 'true' : 'false' };
          return copy
        });

        if (message === 'Too Many Attempts.') {
          for (let i = counter + 1; i <= failedDocuments.length; ++i) {
            setResponse(prev => {
              const copy = [...prev];
              copy[i] = { message: 'Failed', status: 'false' };
              return copy
            });
          }
          dispatch({ type: 'LOADING_UPLOAD', payload: false });
          clearInterval(i);
        }
        ++counter;
      }
      if (counter === failedDocuments.length) {
        clearInterval(i);
      }
    }, 500);
  };

  const retryUpload = async (index) => {
    if (!policy_id) {
      swal('Validaton', 'Select Policy Name', 'info');
      return null;
    }

    setResponse(prev => {
      const copy = [...prev];
      copy[index] = undefined;
      return copy
    });

    const formData = new FormData();
    formData.append("policy_id", policy_id);
    formData.append("documents", file[index]);
    const { data, message, errors } = await offlineTpaService.uploadECard(formData);
    if (data) {
      setResponse(prev => {
        const copy = [...prev];
        copy[index] = { message: serializeError(message || errors), status: data.status ? 'true' : 'false' };
        return copy
      });
    }
  }

  const removeFile = id => {
    const filteredObj = file.filter((_, index) => index !== id);
    setFile([...filteredObj]);
    if (response.length) {
      const filteredResponse = response.filter((_, index) => index !== id);
      setResponse([...filteredResponse]);
    }
  }

  const ResetValue = () => {
    setValue([
      // { "broker_id": undefined },
      { "employer_id": undefined },
      { "policy_type": undefined },
      { "policy_id": undefined }
    ]);
    setResponse([])
    setFile([])
  }

  return (
    <CardBlue title="E-Card File Upload" round>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {['broker'].includes(userType) && <Col md={6} lg={4} xl={4} sm={12}>
            <Controller
              as={
                <SelectComponent
                  label="Employer"
                  placeholder="Select Employer"
                  required={false}
                  isRequired
                  options={employers?.map((item) => ({
                    id: item?.id,
                    label: item?.name,
                    value: item?.id,
                  })) || []}
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

        </Row>
        {!loadingUpload && !response.length && <Row className="mb-3">
          <Title color="#555555" fontSize="1.15rem">Upload file&nbsp;(PDF, DOC, Image)
            <sup> <Img style={{ height: '11px' }} alt="Image Not Found" src='/assets/images/inputs/important.png' /> </sup>
          </Title>
          <DataUpload
            setFile={setFile}
            file={file}
            uploadLimit={500}
            dontShowFile
            accept={".doc, .docx,.png,.jpeg,.jpg,.pdf"}
            uploadType={["image", "pdf", "doc"]}
          />
        </Row>}
        {!!file.length && <Table
          className="text-center rounded text-nowrap"
          style={{ border: "solid 1px #e6e6e6" }}
          responsive
        >
          <thead>
            <tr>
              <th className="align-top">
                Sr. No.
              </th>
              <th className="align-top">
                File Name
              </th>
              {(!loadingUpload && (!response.length || response.every((elem) => elem?.status === 'false'))) && <th className="align-top">
                Remove
              </th>}
              {(loadingUpload || !!response.length) && <th className="align-top">
                Status
              </th>}
            </tr>
          </thead>
          <tbody>
            {file.map((fileData, index) => !!fileData &&
              <TableRow key={fileData.name + index}
                fileName={fileData.name} fileIndex={index}
                removeFile={removeFile} response={response}
                loadingUpload={loadingUpload}
                retryUpload={retryUpload} />
            )}
          </tbody>
        </Table>}

        <Row className="d-flex flex-wrap mt-3">
          <Col md={12} lg={12} xl={5} sm={12}>
            <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
              <Title fontSize="0.9rem" color='#70a0ff'>
                Note: File name should be as TPA Member ID <br />
                <br />
              </Title>
            </TextCard>
          </Col>
        </Row>
        {!loadingUpload && <Row className="d-flex justify-content-end">
          <Button buttonStyle='danger' type='button' onClick={ResetValue} >Reset</Button>
          {!response.length && <Button type='submit' >Submit</Button>}
          {response.some((elem) => elem?.status === 'false') && <Button onClick={ResetUploadFailedProcess} >Retry Failed Process</Button>}
        </Row>}
      </Form>
      {loading && <Loader />}
    </CardBlue >
  );
};


/* Format Option */
// import { OptionInput, Head } from "modules/enrollment/style.js";
// import { CardContentConatiner } from 'modules/Insurance/style';


// const seperator = watch('seperator') || '-';

// <Row className="mb-3">
//  <Title color="#555555" fontSize="1.14rem">
//    Seprator Format
//  </Title>
//  <Col md={6} lg={4} xl={4} sm={12}>
//    <Controller
//      as={<Input label="Seprator" maxLength={5} placeholder="Enter Seprator" required={false} />}
//      name="seperator"
//      error={errors && errors.seperator}
//      control={control}
//    />
//  </Col>
//  <br />
//  {FormatOptions()}
// </Row>

// const FormatOptions = () => {

//   if (!file[0]?.name) {
//     return null
//   }
//   const fileName = file[0]?.name?.replace(/\.[^/.]+$/, "");

//   const splitedArray = fileName.split(seperator);
//   const Slength = splitedArray.length;

//   const result = []
//   for (let i = 0; i < Slength - 1; ++i) {
//     const employee_code = splitedArray.slice(0, i + 1).join(seperator);
//     const tpa_no = splitedArray.slice(i + 1, Slength).join(seperator);

//     result.push({
//       employee_code,
//       tpa_no
//     })
//   }
//   return result.map(({ employee_code, tpa_no }, index) =>
//     <Col md={6} lg={4} xl={3} sm={12} key={index + 'options'} className='p-3'>
//       <div
//         className="card"
//         style={{
//           borderRadius: "18px",
//           boxShadow: "rgb(179 179 179 / 35%) 1px 1px 12px 0px",
//           cursor: "pointer",
//         }}
//         onClick={() => {
//           setValue('installment_id', String(index))
//         }}
//       >
//         <div className="card-body card-flex-em">
//           <OptionInput className="d-flex">
//             <input
//               name={'installment_id'}
//               type={"radio"}
//               ref={register}
//               value={index}
//               defaultChecked={index === 0 && true}
//             />
//             <span></span>

//           </OptionInput>
//           <div
//             className="row rowButton2"
//             style={{
//               marginRight: "-15px !important",
//               marginLeft: "-15px !important",
//             }}>
//             <CardContentConatiner height={'auto'}>
//               <div className="col-md-12 text-center">
//                 <Head>Employee Code:{employee_code}</Head><br />
//                 <Head>TPA No:{tpa_no}</Head>
//               </div>
//             </CardContentConatiner>
//           </div>
//         </div>
//       </div>
//     </Col>
//   )
// }
