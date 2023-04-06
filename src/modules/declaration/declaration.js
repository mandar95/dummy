import React, { useEffect } from "react";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import * as yup from "yup";
// import Table from "./table";
import swal from "sweetalert";
// import _ from "lodash";
import { CardBlue, Button, Error, Loader } from "components";

import { Switch } from "modules/user-management/AssignRole/switch/switch";

// import ModalComponent from "./editModal1";
// import DeclarationModal from './editModal2';

import { CarausalDiv } from 'modules/announcements/style/';
import { SelectSpan } from 'components/inputs/Select/style';

import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { clear, setDeclaration, updateDeclaration } from "modules/documents/documents.slice";

// import { insurer } from 'config/validations';

// const validation = insurer.documents

const DeclrationConfig = ({ IC_id, Type, allDeclrationData, setShowViewData }) => {

    const validationSchema = yup.object().shape({
        declarationData: yup.array().of(
            yup.object().shape({
                declaration: yup.string()
                    .required("declaration name is required"),
            })),
        //.min(validation.name.min, `Minimum ${validation.name.min} character required`)
        //.matches(validation.name.regex, 'Must contain only alphabets')
    });
    const dispatch = useDispatch();
    const { success, error, loading } = useSelector((state) => state.documents);
    // const [modalShow, setModalShow] = useState(false);
    // const [editId, setEditId] = useState(null);
    // const [editDetails, setEditDetails] = useState([]);
    // const [show, setShow] = useState(false);

    const { control, errors, handleSubmit, setValue, watch } = useForm({
        validationSchema,
    });
    const { globalTheme } = useSelector(state => state.theme)

    // add counter component
    const add = () => {
        if (allDeclrationData.length !== 10) {
            let newData = allDeclrationData.map((item, index) => {
                let Declaration = watch(`declarationData[${index}].declaration`);
                let isMandatory = watch(`declarationData[${index}].is_mandatory`);
                return {
                    ...item,
                    declaration: Declaration,
                    is_mandatory: isMandatory
                }
            })
            const data = [...newData, { declaration: "", is_mandatory: 0 }]
            dispatch(setDeclaration({
                data: [...data],
            }));
        }
        else {
            swal("Can not add declaration more than 10", "", "warning")
        }
    }

    const remove = () => {
        let filterData = allDeclrationData.filter((item, index) => {
            return index !== (allDeclrationData.length - 1)
        })
        dispatch(setDeclaration({
            data: [...filterData],
        }));
    }

    // useEffect(() => {
    //     if (!!editId) {
    //         setEditDetails(allDeclrationData.filter((item) => item.id === editId))
    //         setShow(true);
    //     }
    //     // eslint-disable-next-line
    // }, [editId])

    // useEffect(() => {
    //     if (IC_id) {
    //         if (Type === "insurer") {
    //             dispatch(getAllDeclration({
    //                 ic_id: IC_id
    //             }));
    //         }
    //         else {
    //             dispatch(getAllDeclration({
    //                 broker_id: IC_id
    //             }));
    //         }

    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [IC_id])

    useEffect(() => {
        if (success) {
            swal(success, "", "success")
                .then(() => {
                    setShowViewData(true)
                });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    useEffect(() => {
        if (allDeclrationData.length === 0) {
            add()
        }
        allDeclrationData.forEach((item, index) => {
            setValue(`declarationData[${index}].declaration`, item.declaration)
            setValue(`declarationData[${index}].is_mandatory`, item.is_mandatory)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDeclrationData])

    const goBack = () => {
        setShowViewData(true)
    }

    const onSubmit = (data) => {
        dispatch(updateDeclaration({
            declarations: data.declarationData,
            ...(Type === 'broker' ? { broker_id: IC_id } : { ic_id: IC_id }),
            _method: "PATCH"
        }))
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-start", margin: '15px 0px 0px 40px' }}>
                <Btn size="sm" varient="primary" onClick={goBack} style={{ width: '110px' }}>
                    <span style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}><i className="fa fa-long-arrow-left"></i>&nbsp;&nbsp;Back To Card</span>
                </Btn>
            </div>
            <CardBlue title="Declaration Configurator">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {allDeclrationData?.map((item, index) => (
                        <Row key={index + 'declarations'}>
                            <Col md={12} lg={8} xl={8} sm={12}>
                                <CarausalDiv style={{ borderBottom: 'none' }}>
                                    <div style={{ padding: "10px", marginTop: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <SelectSpan style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
                                                {`Declaration Name ${index + 1}`}
                                                <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
                                            </SelectSpan>
                                        </div>
                                        <Controller
                                            as={<Form.Control as="textarea" rows="3" />}
                                            name={`declarationData[${index}].declaration`}
                                            control={control}
                                            defaultValue={item.declaration}
                                            error={errors && errors?.declarationData?.length && errors.declarationData[index]?.declaration}
                                            style={{ resize: 'none' }}
                                        />
                                    </div>
                                    {!!errors?.declarationData?.length && errors.declarationData[index]?.declaration &&
                                        <Error>
                                            {errors?.declarationData?.length && errors.declarationData[index]?.declaration.message}
                                        </Error>}
                                </CarausalDiv>
                            </Col>
                            <Col md={12} lg={4} xl={4} sm={12}>
                                <div style={{ marginTop: '55px' }}>
                                    <Controller
                                        as={<Switch label="Is Mandatory" />}
                                        name={`declarationData[${index}].is_mandatory`}
                                        control={control}
                                        defaultValue={item.is_mandatory}
                                        error={errors && errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory}
                                    />
                                    {!!errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory &&
                                        <Error>
                                            {errors?.declarationData?.length && errors.declarationData[index]?.is_mandatory.message}
                                        </Error>}
                                </div>
                            </Col>

                        </Row>
                    ))}
                    <Row className='mt-3'>
                        <Col className="d-flex justify-content-center align-items-center">
                            <Button buttonStyle="warning" type='button' onClick={add}>
                                <i className="ti ti-plus"></i> Add{'\u00A0'}
                            </Button>
                            {allDeclrationData.length !== 1 &&
                                <Button buttonStyle="danger" type='button' onClick={remove}>
                                    <i className="ti ti-minus"></i> Remove{'\u00A0'}
                                </Button>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                                Update & Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </CardBlue>
            {/* <CardBlue
                title={title}>
                <Table data={allDeclrationData} onEdit={getEditData} />
            </CardBlue>
            <ModalComponent show={modalShow} onHide={() => setModalShow(false)} />
            <DeclarationModal show={show}
                onHide={() => setShow(false)}
                setId={() => setEditId(null)}
                id={editId}
                editData={editDetails} /> */}
            {loading && <Loader />}
        </>
    );
}

export default DeclrationConfig;
