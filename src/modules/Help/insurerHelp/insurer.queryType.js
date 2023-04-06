import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import * as yup from "yup";
import Table from "./table1";
import swal from "sweetalert";
// import _ from "lodash";
import { CardBlue, Button, Error, Input, Loader } from "components";
import ModalComponent from "./editModal3"
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitInsurerQueryType, getAllInsurerQueriesType, clear } from "../help.slice";
import { insurer } from 'config/validations'

const validation = insurer.query_complaint

const validationSchema = yup.object().shape({
    name: yup.string()
        .required("Please enter query type")
        .min(2, 'Minimum 2 character required')
        .max(validation.name.length, `Maximum ${validation.name.length} character required`)
        // eslint-disable-next-line no-useless-escape
        .matches(validation.name.regex, {
            message: 'Alphanumeric characters, hyphen(-) & slash(/,\\/) only',
            excludeEmptyString: true,
        })
});

export const QueryType = ({ currentUser, userType, myModule }) => {
    const dispatch = useDispatch();
    const { success, error, loading, insurerQueriesTypeData } = useSelector((state) => state.help);
    // const [resetFile, setResetFile] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const { globalTheme } = useSelector(state => state.theme)


    const { control, errors, handleSubmit, setValue } = useForm({
        validationSchema,
        // mode: "onBlur",
        // reValidateMode: "onBlur"
    });

    /* 
        ** If "currentUser" state will change then this component will re-rendered.
        ** Here get all insurer queries type by passing "broker id or ic_id" as a argument 
    */
    useEffect(() => {
        if (currentUser?.broker_id || currentUser?.ic_id)
            dispatch(getAllInsurerQueriesType(
                userType === 'broker' ?
                    { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    /* 
        ** If "success" or "error" state will change then this component will re-rendered.
        ** After "success" or "error" will show alert option.
    */
    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                dispatch(getAllInsurerQueriesType(userType === 'broker' ?
                    { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
                resetValues(); // reset previous value
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const resetValues = () => {
        setValue("name", "");
    };


    // Submit Insurer Query Type
    const onSubmit = (data) => {
        dispatch(submitInsurerQueryType({
            ...data, ...userType === 'broker' ?
                { broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }
        }));
    }


    const title = (
        <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
            <span style={{ width: "100%" }}>Query Types</span>
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
            {!!myModule?.canwrite && <CardBlue title='Query Type Configurator'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm="12" md="12" lg="12" xl="12">
                            <div className="p-2">
                                <Controller
                                    as={
                                        <Input
                                            label="Query Type"
                                            placeholder="Enter Query Type"
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
                <Table myModule={myModule} data={insurerQueriesTypeData} />
            </CardBlue>
            <ModalComponent show={modalShow} onHide={() => setModalShow(false)}
                userType={userType} currentUser={currentUser} />
            {loading && <Loader />}
        </>
    )

}
