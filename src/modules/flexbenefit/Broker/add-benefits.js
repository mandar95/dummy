import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Input, Select, Error } from "../../../components";
import { getFirstError } from '../../../utils';
import { CustomControl } from "modules/user-management/AssignRole/option/style";
import {
  addBenefitsData,
  selectAddBenefits,
  getFlexData,
  updateBenefitsData
} from "../flexbenefit.slice";
import swal from "sweetalert";
import * as yup from 'yup';
import { Img } from "../../../components/inputs/Select/style";
import { _UI } from "../../Dashboard_Card_Config/helper";
import { AttachFile2 } from "../../core";

const validationSchema = yup.object().shape({
  name: yup.string().required("Please enter benefit name"),
  code: yup.string().required("Please enter benefit code"),
  type: yup.string().required("Please select benefit type"),
})

const ModalComponent = ({ show, onHide, _editData }) => {
  const { handleSubmit, control, errors, watch, register, setValue } = useForm({
    validationSchema,
    // defaultValues:{
    //   flex_allocation_type:Number(_editData?.flex_allocation_type)
    // }
  });
  const { globalTheme } = useSelector(state => state.theme)

  let _type = watch('type')

  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const [alert, setAlert] = useState(null);

  const addBenefitsResp = useSelector(selectAddBenefits);
  //onSubmit-----------------------------------
  const onSubmit = (data) => {
    if (file || show.isEditData) {
      const formdata = new FormData();
      formdata.append("name", data?.name);
      formdata.append("code", data?.code);
      formdata.append("type", data?.type);
      file && formdata.append("image", file[0]);
      formdata.append("description", data?.description);
      formdata.append("flex_allocation_type", data?.flex_allocation_type);
      formdata.append("status", 1);
      if (!show.isEditData) {
        dispatch(addBenefitsData(formdata));
      }
      else {
        formdata.append("_method", "PATCH");
        dispatch(updateBenefitsData(formdata, _editData.id))
      }
      setAlert(1);
    } else {
      swal("", "Please attached file", "warning");
    }
  };
  //-------------------------------------------


  useEffect(() => {
    if (_editData && show.isEditData) {
      //setValue('flex_allocation_type', Number(_editData.flex_allocation_type))
    }
    else {
      setValue('name', '')
      setValue('code', '')
      setValue('type', '')
      setValue('description', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_editData, show])



  //--------------------------------------------
  useEffect(() => {
    if (alert === 1) {
      if (addBenefitsResp?.data?.status) {
        swal(addBenefitsResp?.data?.message, "", "success").then(
          dispatch(getFlexData({
            type: _type
          })),
          onHide()
        );
        setAlert(0);
      } else {
        let error = addBenefitsResp?.data?.errors && getFirstError(addBenefitsResp?.data?.errors);
        error = error ? error : addBenefitsResp?.data?.message;
        swal("", error, "warning");
        setAlert(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBenefitsResp]);
  //--------------------------------------------

  //getFile------------
  const getFile = (file) => {
    setFile(file);
  };
  //-------------------

  return (

    <Modal
      show={show.isShow}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span >{!show.isEditData ? 'Add' : 'Update'} Benefits</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto" }}>
          <div style={{ padding: "20px" }}>
            <Row xs={1} sm={2} md={2} lg={3} xl={3}>
              <div className="p-2">
                <Controller
                  as={
                    <Input
                      required={false}
                      isRequired={true}
                      label="Benefit Name"
                      placeholder="Enter Benefit Name"
                    />
                  }
                  name="name"
                  control={control}
                  error={errors && errors.name}
                  defaultValue={_editData?.name}
                />
                {!!errors?.name && <Error>{errors?.name?.message}</Error>}
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <Input
                      required={false}
                      isRequired={true}
                      label="Benefit Code"
                      placeholder="Enter Benefit Code"
                    />
                  }
                  name="code"
                  control={control}
                  error={errors && errors.code}
                  defaultValue={_editData?.code}
                />
                {!!errors?.code && <Error>{errors?.code?.message}</Error>}
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <Select
                      required={false}
                      isRequired={true}
                      label="Benefit Type"
                      placeholder="Select Benefit Type"
                      options={[
                        // { id: 1, name: "Voluntary", value: "V" },
                        { id: 0, name: "Wellness", value: "W" },
                      ]}
                    />
                  }
                  name="type"
                  control={control}
                  error={errors && errors.type}
                  defaultValue={_editData?.type}
                />
                {!!errors?.type && <Error>{errors?.type?.message}</Error>}
              </div>
            </Row>
            <Row xs={1} sm={1} md={1} lg={1} xl={1}>
              <AttachFile2
                fileRegister={register}
                accept="jpg, jpeg, png, pdf"
                key="member_sheet"
                onUpload={getFile}
                description="File Formats: (.jpg , .png)"
                nameBox
                required={!show.isEditData}
                attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                fileDataUI={() => _UI(_editData?.image)}
              />
            </Row>
            <Row>
              <div className='d-flex flex-column justify-content-around flex-wrap' style={{
                // borderTop: '1px dashed #a0a0a0'
              }}>
                <div style={{ marginTop: '15px', fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>Flex Allocation Type : -</div>
                <CustomControl className='d-flex mt-4 mr-0'>
                  <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Monthly'}</p>
                  <input name={`flex_allocation_type`} ref={register} type={'radio'}
                    value={1}
                    defaultChecked={_editData?.flex_allocation_type === 'Yearly' ? false : true}
                  />
                  <span></span>
                </CustomControl>
                <CustomControl className='d-flex mt-4 ml-0'>
                  <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'Yearly'}</p>
                  <input name={`flex_allocation_type`} ref={register} type={'radio'}
                    value={2}
                    defaultChecked={_editData?.flex_allocation_type === 'Yearly' ? true : false}
                  />
                  <span></span>
                </CustomControl>
              </div>
            </Row>
            <Row xs={1} sm={1} md={1} lg={1} xl={1}>
              <div style={{ padding: "10px", marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                    <u>Description</u>
                    <sup>
                      {" "}
                      <Img
                        alt="important"
                        src="/assets/images/inputs/important.png"
                      />{" "}
                    </sup>
                  </label>
                </div>
                <Controller
                  as={<Form.Control as="textarea" rows="3" />}
                  name="description"
                  control={control}
                  defaultValue={_editData?.description}

                />
              </div>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={onHide}
            variant="danger"
            style={{ float: "right" }}
          >
            Close
          </Button>
          <Button type="submit" variant="success" style={{ float: "right" }}>
            Save
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default ModalComponent;
