import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import * as yup from "yup";
import Table from "./table2";
import ModalComponent from "./editModal4"
import swal from "sweetalert";
// import _ from "lodash";
import { CardBlue, Button, Error, Input, SelectComponent, Loader } from "components";
// import { AttachFile2 } from 'modules/core';
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitInsurerQuerySubType, getAllInsurerQueriesType, getAllInsurerQueriesSubType, clear } from "../help.slice";
import { insurer } from 'config/validations'

const validation = insurer.query_complaint

// make validation
const validationSchema = yup.object().shape({
    query_type: yup.object().shape({
        id: yup.string().required('Query type Required'),
    }),
    name: yup.string()
        .required("Please enter sub query type")
        .min(2, 'Minimum 2 character required')
        .max(validation.name.length, `Maximum ${validation.name.length} character required`)
        // eslint-disable-next-line no-useless-escape
        .matches(validation.name.regex, {
            message: 'Alphanumeric characters, hyphen(-) & slash(/,\\/) only',
            excludeEmptyString: true,
        })
});

export const QuerySubType = ({ currentUser, userType, myModule }) => {
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const { success, error, loading, insurerQueriesTypeData, insurerQueriesSubTypeData } = useSelector((state) => state.help);
    const [modalShow, setModalShow] = useState(false);


    const { control, errors, handleSubmit, setValue/* , reset */ } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
    });

    // Get Insurer and sub insurer queirs type
    useEffect(() => {
        if (currentUser?.broker_id || currentUser?.ic_id) {
            dispatch(getAllInsurerQueriesType(userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
            dispatch(getAllInsurerQueriesSubType(userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    /* ** If "success" or "error" state will change then this component will re-rendered. */
    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(getAllInsurerQueriesSubType(userType === 'broker' ?
                    { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
                resetValues();
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const resetValues = () => {
        setValue([{ "query_type": undefined }, { "name": '' }]);
        // reset({
        //     query_type:undefined,
        //     name:""
        // })
        // setValue([{query_type:undefined},{name:""}])
    };

    //Sunmit Insurer Company Sub Type
    const onSubmit = (data) => {
        let Data = {
            name: data.name,
            query_id: data.query_type?.value,
            ...userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }
        }
        dispatch(submitInsurerQuerySubType(Data));
    }

    const title = (
        <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
            <span style={{ width: "100%" }}>Query Sub Types</span>
            {!!myModule?.canwrite && <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn size="sm" varient="primary" onClick={() => setModalShow(true)}>
                    <p
                        style={{
                            fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                            fontWeight: "600",
                            marginBottom: "-1px",
                        }}
                    >
                        Add/Overwrite
                    </p>
                </Btn>
            </div>}
        </div>
    );

    return (
        <>
            {!!myModule?.canwrite && <CardBlue title='Query Sub Type Configurator'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <SelectComponent
                                            label="Query Type"
                                            placeholder="Select Query Type"
                                            required={false}
                                            isRequired={true}
                                            options={
                                                insurerQueriesTypeData?.map((item) => ({
                                                    id: item?.id,
                                                    label: item?.name,
                                                    value: item?.id,
                                                })) || []
                                            }
                                        />
                                    }
                                    name="query_type"
                                    control={control}
                                    error={errors && errors.query_type?.id}
                                />
                            </div>
                            {!!errors?.query_type?.id && <Error>{errors?.query_type?.id?.message}</Error>}
                        </Col>
                        <Col sm="12" md="6" lg="6" xl="6">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Input
                                            label="Query Sub Type"
                                            placeholder="Enter Query Sub Type"
                                            maxLength={validation.name.length}
                                            required={false}
                                            isRequired={true}
                                        />
                                    }
                                    name="name"
                                    control={control}
                                    defaultValue={""}
                                    error={errors && errors.name}
                                />
                            </div>
                            {!!errors?.name && <Error>{errors?.name?.message}</Error>}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlue>}
            <CardBlue
                title={title}>
                <Table myModule={myModule} data={insurerQueriesSubTypeData} />
            </CardBlue>
            <ModalComponent show={modalShow} onHide={() => setModalShow(false)}
                userType={userType} currentUser={currentUser} />
            {loading && <Loader />}
        </>
    )

}
