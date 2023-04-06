import React, { useState } from 'react';
import { Select, Input, Button, CardBlue, Error } from 'components';
import { Form, Row, Col } from 'react-bootstrap';
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import './editor.css'
import * as yup from 'yup';
import swal from 'sweetalert';

import { createEmailTemplate, createSmsTemplate } from 'modules/communication-config/communication-config.slice';
import SecureLS from 'secure-ls';
import axios from 'axios';


const TemplateType = [{ id: 1, name: 'Email' }, { id: 2, name: 'SMS' }]

const validationSchema = yup.object().shape({
    template_name: yup.string()
        .min(3, "Please enter a template name more than 2 character")
        .required("Please Enter Template Name"),
    template_type: yup.string()
        .required("Please Select Template Type"),
})

export const StaticTemplate = ({ setTab }) => {
    const ls = new SecureLS();
    const restClient = axios.create();
    const dispatch = useDispatch();
    const [editorData, setEditorData] = useState("")
    const { userType: userTypeName } = useSelector(state => state.login);


    const { control, handleSubmit, errors } = useForm({
        validationSchema,
        //validationSchema: validationSchema(openDiv),
        // mode: "onChange",
        // reValidateMode: "onChange"
    });


    const onSubmit = (data) => {
        if (editorData) {
            let _data = {
                template_name: data.template_name,
                static_content: editorData
            }
            if (Number(data.template_type) === 1) {
                dispatch(createEmailTemplate(null, null, null, null, userTypeName, true, _data, setTab))
            } else {
                dispatch(createSmsTemplate(null, null, null, userTypeName, true, _data, setTab))
            }
        } else {
            swal("Template content can't be empty", "", "warning")
        }

    }
    const API_URL = `${process.env.REACT_APP_API_BASE_URL}/admin/store/communication/image`;
    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    const token = ls.get('token');
                    if (token) {
                        restClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    }
                    loader.file.then((file) => {
                        body.append("files", file);
                        restClient({
                            url: API_URL,
                            method: "POST",
                            //cancelToken: options.cancelToken,
                            data: body
                        }).then((res) => {
                            resolve({
                                default: `${res?.data?.filename}`
                            });
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                });
            }
        };
    }

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

    return (
        <CardBlue title=''>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ padding: '0px 15px' }} id="parentDiv">
                    <Col sm="12" md="12" lg="4" xl="4">
                        <Controller
                            as={
                                <Input
                                    label="Template Name"
                                    placeholder="Enter Template Name"
                                    required={false}
                                    isRequired={true}
                                />
                            }
                            name="template_name"
                            control={control}
                            defaultValue={""}
                            error={errors && errors.template_name}
                        />
                        {!!errors?.template_name && <Error>{errors?.template_name?.message}</Error>}
                    </Col>
                    <Col sm="12" md="12" lg="4" xl="4">
                        <Controller
                            as={
                                <Select
                                    label="Template Type"
                                    placeholder="Select Template Type"
                                    required={false}
                                    isRequired={true}
                                    // options={_Events}
                                    options={TemplateType.map((item) => ({
                                        id: item?.id,
                                        name: item?.name,
                                        value: item?.id,
                                    }))}
                                />
                            }
                            name="template_type"
                            control={control}
                            defaultValue={""}
                            error={errors && errors.template_type}
                        />
                        {!!errors?.template_type && <Error>{errors?.template_type?.message}</Error>}
                    </Col>
                </Row>
                <CKEditor
                    editor={DecoupledcEditor}
                    //editor={ClassicEditor}
                    data={""}

                    config={{
                        //toolbarLocation: "top",
                        extraPlugins: [uploadPlugin],
                        // removePlugins: ['imageUpload', 'mediaEmbed'],


                    }}

                    onReady={(editor) => {
                        // editor.ui
                        //     .getEditableElement()
                        //     .parentElement.prepend(editor.ui.view.toolbar.element);
                        document.getElementById('parentDiv').after(editor.ui.view.toolbar.element)
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setEditorData(data)
                    }}

                />
                {/* {JSON.stringify(editorData)} */}

                <Row className="d-flex flex-wrap">
                    <Col md={12} className="d-flex justify-content-end mt-4">
                        <Button>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </CardBlue>
    )


}
