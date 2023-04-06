import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Select, Button } from "components"
import { AttachFile } from "../../core/attachFile/AttachFile";
const EditModalForm = ({ handleSubmit, onSubmit, col, data, control, Data, setData, getFile, onHide }) => {
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {!!col && col.map((v, i) => <Row key={i + 'master-config'} style={{ margin: "2rem 0rem" }}>
                <Col md={12} lg={12} xl={12} sm={12}>
                    {(!v?.dropdown && !v?.image) ?
                        <> <Controller
                            as={<Form.Control as="textarea" rows="2" />}
                            defaultValue={!!data ? data[v.accessor] : ''}
                            name={v.accessor}
                            control={control}
                        />
                            <label className="form-label">
                                <span className="span-label">{v.Header}</span>
                            </label> </> : !!v?.dropdown ?
                            <Controller
                                as={
                                    <Select
                                        label={v?.Header}
                                        placeholder={`Select ${v?.Header}`}
                                        customIdOptions={v.options} name={v.name} id={11}
                                        optionKeyOne={v.optionKeyOne} optionKeyTwo={v.optionKeyTwo}
                                        data={!!Data ? Data : v.value}
                                    // value={Number(v?.value)}
                                    />
                                }
                                // value={v?.value}
                                // defaultValue={v?.value}
                                onChange={([selected]) => {
                                    setData(selected.target.value);
                                    return selected;
                                }}
                                name={v.name}
                                control={control}
                            />
                            : (!!v?.image && !v?.nofile) ? <AttachFile
                                accept="jpg, jpeg, png"
                                key="member_sheet"
                                onUpload={getFile}
                                description="File Formats: (.jpg , .png)"
                                nameBox
                            />
                                : !!v?.file ?
                                    <AttachFile
                                        accept=".xlsx, .xls"
                                        key="member_sheet"
                                        onUpload={getFile}
                                        description="File Formats: (.xlsx .xls)"
                                        nameBox
                                    /> : ""}
                </Col>
            </Row>)}
            {!!col.password && <Row style={{ margin: "2rem 0rem" }}>
                <Col md={12} lg={12} xl={12} sm={12}>
                    <> <Controller
                        as={<Form.Control as="textarea" rows="2" />}
                        defaultValue={''}
                        name={"password"}
                        control={control}
                    />
                        <label className="form-label">
                            <span className="span-label">Password</span>
                        </label> </> </Col> </Row>}
            <Row >
                <Col md={12} className="d-flex justify-content-center mt-4">
                    <Button buttonStyle='danger' type="button" onClick={onHide}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default EditModalForm;
