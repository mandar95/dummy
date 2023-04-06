import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import _ from "lodash";
import { Controller } from "react-hook-form";
import { SelectComponent, Select, Button } from "components";
import { CustomControl } from "../../user-management/AssignRole/option/style";
import { AttachFile } from "../../core/attachFile/AttachFile";
import { downloadFile } from "utils"
import swal from "sweetalert";
import { AnchorTag } from "../../addmember2/style";
import { useSelector } from "react-redux";
const AddModalForm = ({ handleSubmit, onSubmit, props, control, MasterData, enable_dropdown, label,
    placeholder, response, field, register, get, getInput, downloadFormate }) => {
    const { globalTheme } = useSelector(state => state.theme)
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {!_.isEqual(props.component, "feature-config") && "Add master"}
                    {_.isEqual(props.component, "feature-config") && "Upload"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ padding: "20px" }}>
                    {!_.isEqual(props.component, "feature-config") && <Row>
                        <Col>
                            <Controller
                                as={
                                    <SelectComponent
                                        label="Master Type"
                                        placeholder="Select Master Type"
                                        options={props.userType !== 'admin' ?
                                            [...MasterData?.filter(({ id }) => [17, 22, 30, 36, 42].includes(id)).map((master) => ({
                                                id: master.id,
                                                label: master.name,
                                                value: master.id
                                            })), {
                                                id: 42,
                                                label: 'Campaign',
                                                value: 42
                                            }]
                                            : MasterData?.map((master) => ({
                                                id: master.id,
                                                label: master.name,
                                                value: master.id
                                            }))}
                                    />
                                }
                                defaultValue={props?.masterId}
                                name="master"
                                control={control}
                            />
                        </Col>
                    </Row>}
                    <Row
                        className="p-3"
                        style={{ border: "1.5px dotted #0093ff", borderRadius: "10px" }}
                    >
                        {enable_dropdown && (
                            <Col xs={12}>
                                <Controller
                                    as={
                                        <Select
                                            label={label || "N/A"}
                                            placeholder={placeholder || "N/A"}
                                            options={response?.subResp?.map((master) => ({
                                                id: master.id,
                                                name: master.name,
                                                value: master.id,
                                            }))}
                                        />
                                    }
                                    name="subId"
                                    control={control}
                                />
                            </Col>
                        )}
                        {field === "excel" ? (
                            <>
                                <Col
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        marginTop: "-20px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    {!_.isEqual(props?.component, "feature-config") && (
                                        <>
                                            <CustomControl className="d-flex mt-4">
                                                <h5 className="m-0" style={{ paddingLeft: "33px" }}>
                                                    {"Overwrite file"}
                                                </h5>
                                                <input
                                                    name={"override"}
                                                    type={"radio"}
                                                    value={1}
                                                    ref={register}
                                                />
                                                <span style={{ top: "-2px" }}></span>
                                            </CustomControl>

                                            <CustomControl className="d-flex mt-4">
                                                <h5 className="m-0" style={{ paddingLeft: "33px" }}>
                                                    {"Add in existing"}
                                                </h5>
                                                <input
                                                    name={"override"}
                                                    type={"radio"}
                                                    value={0}
                                                    defaultChecked
                                                    ref={register}
                                                />
                                                <span style={{ top: "-2px" }}></span>
                                            </CustomControl>
                                        </>
                                    )}
                                    {/* for feature config component */}
                                    {_.isEqual(props?.component, "feature-config") && (
                                        <CustomControl className="d-flex mt-4">
                                            <h5 className="m-0" style={{ paddingLeft: "33px" }}>
                                                {"Add"}
                                            </h5>
                                            <input
                                                name={"featureoverride"}
                                                type={"radio"}
                                                defaultValue={1}
                                                defaultChecked
                                                ref={register}
                                            />
                                            <span style={{ top: "-2px" }}></span>
                                        </CustomControl>
                                    )}
                                </Col>
                                {!_.isEqual(props?.component, "feature-config") && (
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <AttachFile
                                            accept=".xlsx, .xls"
                                            key="member_sheet"
                                            onUpload={get}
                                            description={`File Formats: (.xlsx .xls)`}
                                            nameBox
                                        />
                                    </Col>
                                )}
                                {_.isEqual(props?.component, "feature-config") && (
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <AttachFile
                                            accept=".xlx, .xlsx, .xls, .csv"
                                            key="member_sheet"
                                            onUpload={get}
                                            description={`File Formats: (.xlx, .xlsx, .xls, .csv)`}
                                            nameBox
                                        />
                                    </Col>
                                )}
                            </>
                        ) : (
                            <noscript />
                        )}
                        {getInput && getInput}
                        {field === "excel" && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    width: "100%",
                                    paddingTop: "5px",
                                }}
                            >
                                {!_.isEqual(props?.component, "feature-config") && (
                                    <AnchorTag href={'#'} onClick={() => {
                                        !_.isEmpty(response?.sample?.data?.data)
                                            ? downloadFile(
                                                response?.sample?.data?.data[0]?.upload_path
                                            )
                                            : swal("Sample format not available", "", "warning");
                                    }}>
                                        <i
                                            className="ti-cloud-down attach-i"
                                            style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                        ></i>
                                        <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                            Download Sample Format
                                        </p>
                                    </AnchorTag>
                                )}
                                {_.isEqual(props?.component, "feature-config") &&
                                    !_.isEmpty(downloadFormate) && (
                                        <AnchorTag href={'#'} onClick={() => {
                                            !_.isEmpty(downloadFormate)
                                                ? downloadFile(downloadFormate)
                                                : swal(
                                                    "Sample format not available",
                                                    "",
                                                    "warning"
                                                );
                                        }}>
                                            <i
                                                className="ti-cloud-down attach-i"
                                                style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
                                            ></i>
                                            <p style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
                                                Download Sample Format
                                            </p>
                                        </AnchorTag>
                                    )}
                            </div>
                        )}
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" buttonStyle="danger" onClick={props.onHide}>
                    Close
                </Button>
                <Button type="submit">Submit</Button>
            </Modal.Footer>
        </form>
    );
}

export default AddModalForm;
