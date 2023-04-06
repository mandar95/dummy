import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Input, Error, SelectComponent } from "../../../components";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
    editICD,
    updateICD,
    clear,
    success,
} from "../wellness.slice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";


/*----------validation schema----------*/
const validationSchema = yup.object().shape({
    icd_code: yup.object().shape({
        id: yup.string().required('ICD Code Required'),
    }),
    icd_name: yup.string().required("Please enter ICD Name"),
});
/*----x-----validation schema-----x----*/

const EditModal = (props) => {

    const { ICDData, editICDData, icdUpdate } = useSelector((state) => state.wellness);
    const dispatch = useDispatch();

    const [ICD, setICD] = useState(null);
    const [ICD_Data, setICD_Data] = useState([]);

    useEffect(() => {
        if (ICD) {
            const ICD_obj = ICDData.filter((item) => item?.icd_code === ICD);
            setValue("icd_name", ICD_obj[0].icd_name);
            setICD_Data(() => [...ICD_obj]);
        }
        //eslint-disable-next-line
    }, [ICD]);

    //prefill
    useEffect(() => {
        if (props?.id) {
            dispatch(editICD(props?.id));
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!_.isEmpty(editICDData)) {
            setValue("icd_code", ICDData.map((item) => ({
                id: item?.id,
                label: item?.icd_code,
                value: item?.icd_code,
            })).find(({ value }) => value === editICDData[0]?.icd_code));
            setValue("icd_name", editICDData[0]?.icd_name);
            setValue("status", editICDData[0]?.status);
        }
        //eslint-disable-next-line
    }, [editICDData]);

    const { control, errors, handleSubmit, setValue } = useForm({
        validationSchema,
    });

    const onSubmit = ({ status }) => {
        const formdata = new FormData();
        if (!_.isEmpty(ICD_Data)) {
            formdata.append("icd_id", ICD_Data[0].id);
        }
        else {
            formdata.append("icd_id", editICDData[0].icd_id);
        }
        formdata.append("status", status);
        formdata.append("_method", "PATCH");
        dispatch(updateICD(props?.id, formdata));
    };
    useEffect(() => {
        if (icdUpdate) {
            dispatch(success(icdUpdate));
            props.onHide();
        }

        return () => {
            dispatch(clear("icd-code-master"));
        };
        //eslint-disable-next-line
    }, [icdUpdate]);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Edit ICD Code Master</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12} lg={6} xl={6} sm={12}>
                            <div className="p-2">
                                <Controller
                                    as={<SelectComponent placeholder="Select ICD Code"
                                        label="ICD Code"
                                        required={false}
                                        isRequired={true}
                                        options={ICDData.map((item) => ({
                                            id: item?.id,
                                            label: item?.icd_code,
                                            value: item?.icd_code,
                                        }))} />}
                                    onChange={([selected]) => {
                                        setICD(selected.value);
                                        return selected;
                                    }}
                                    name="icd_code"
                                    control={control}
                                    error={errors && errors.icd_code}

                                />
                                {!!errors?.icd_code &&
                                    <Error>
                                        {errors?.icd_code?.message}
                                    </Error>}
                            </div>
                        </Col>
                        <Col md={12} lg={6} xl={6} sm={12}>
                            <div className="p-2">
                                <Controller
                                    as={<Input label="ICD Name" placeholder="ICD Name" disabled={true}
                                        labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                                    name="icd_name"
                                    defaultValue={""}
                                    control={control}
                                    error={errors && errors.icd_name}

                                />
                                {!!errors?.icd_name &&
                                    <Error>
                                        {errors?.icd_name?.message}
                                    </Error>}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <Controller
                                as={<Switch />}
                                name="status"
                                control={control}
                                defaultValue={editICDData[0]?.status || 1}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-danger" onClick={props.onHide}>
                        Close
                    </Button>
                    <Button type="submit">Update</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditModal;
