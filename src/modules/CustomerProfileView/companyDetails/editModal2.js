import React, { useEffect } from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import swal from "sweetalert";
import { Input, Button, Error, Select } from "../../../components";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerProfileData, CreateMemberDetails, clear } from '../customerProfile.slice';
import { loadDesignation } from 'modules/master-config/master.slice';
import { numOnly, noSpecial } from "utils";
import { common_module } from 'config/validations';
const validation = common_module.user;

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Name is required"),
    email: yup.string()
        .email('Please enter valid email id')
        .required('Email id is required'),
    contact_no: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number')
        .test('invalid', 'Not valid number', (value) => {
            return !/^[9]{10}$/.test(value);
        }),
    designation_id: yup.string().required("Designation is required"),
});

const EditModal = (props) => {

    const dispatch = useDispatch();
    const { success, error } = useSelector((state) => state.customerProfile);
    const { response } = useSelector(state => state.master);
    const { control, errors, handleSubmit } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
    });

    useEffect(() => {
        if (success) {
            swal(success, "", "success")
                .then(() => {
                    dispatch(getCustomerProfileData());
                });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    useEffect(() => {
        //dispatch(getCustomerProfileData())
        dispatch(loadDesignation())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const resetValues = () => {
    //     setValue("name", "");
    //     setValue("email", null);
    //     setValue("contact_no", "");
    //     setValue("designation_id", "");
    // };

    const onSubmit = (data) => {
        //let designation = response?.data?.data.filter((item) => item.id === parseInt(data.designation_id))
        // alert(JSON.stringify({ ...data, designation_name: designation[0].name }))
        dispatch(CreateMemberDetails(data))
    }


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Add Team Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12} lg={6} xl={6} sm={6}>
                            <div className="p-2">
                                <Controller
                                    as={<Input
                                        label="Member Name"
                                        placeholder="Enter Member Name"
                                        required={false}
                                        isRequired={true}
                                    />}
                                    name="name"
                                    defaultValue={""}
                                    control={control}
                                    error={errors && errors.name}

                                />
                                {!!errors?.name && <Error>{errors?.name?.message}</Error>}
                            </div>
                        </Col>
                        <Col md={12} lg={6} xl={6} sm={6}>
                            <div className="p-2">
                                <Controller
                                    as={<Input
                                        label="Email ID"
                                        placeholder="Enter Email ID"
                                        required={false}
                                        isRequired={true}
                                    />}
                                    name="email"
                                    defaultValue={""}
                                    control={control}
                                    error={errors && errors.email}

                                />
                                {!!errors?.email && <Error>{errors?.email?.message}</Error>}
                            </div>
                        </Col>
                        <Col md={12} lg={6} xl={6} sm={6}>
                            <div className="p-2">
                                <Controller
                                    as={<Input
                                        label="Mobile No"
                                        placeholder="Enter Mobile No"
                                        type='tel'
                                        maxLength={10}
                                        onKeyDown={numOnly} onKeyPress={noSpecial}
                                        required={false}
                                        isRequired={true}
                                    />}
                                    name="contact_no"
                                    defaultValue={""}
                                    control={control}
                                    error={errors && errors.contact_no}

                                />
                                {!!errors?.contact_no && <Error>{errors?.contact_no?.message}</Error>}
                            </div>
                        </Col>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Select
                                            label="Designation"
                                            placeholder="Select Designation"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                response?.data?.data?.map((item) => ({
                                                    id: item?.id,
                                                    name: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="designation_id"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.designation_id}
                                />
                            </div>
                            {!!errors?.designation_id && <Error>{errors?.designation_id?.message}</Error>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
