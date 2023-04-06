import React from "react";
import { Col } from "react-bootstrap";
import { SelectComponent, Error, Button } from "components";
import { Controller } from "react-hook-form";
import { Switch } from "../../../user-management/AssignRole/switch/switch";
import { TR } from "../style";
import { useSelector } from "react-redux";
const CreateNominee = ({ handleSubmit, onSubmit, userTypeName, control, errors, _policySubType, policies,
    mostOuterTab, employers, outerTab, classes, check, setCheck, table, relations }) => {
    const { globalTheme } = useSelector(state => state.theme)
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                {(userTypeName === "Admin" ||
                    userTypeName === "Super Admin" ||
                    userTypeName === "Broker") && (
                        <Col xl={4} lg={4} md={6} sm={12}>
                            <Controller
                                as={
                                    <SelectComponent
                                        label="Employer"
                                        placeholder="Select Employer"
                                        required={false}
                                        isRequired={true}
                                        options={employers?.map((item) => ({
                                            id: item?.id,
                                            label: item?.name,
                                            value: item?.id,
                                        })) || []}
                                    />
                                }
                                name="employer_id"
                                control={control}
                                defaultValue={""}
                                error={errors && errors.employer_id}
                            />
                            {!!errors?.employer_id && (
                                <Error>{errors?.employer_id?.message}</Error>
                            )}
                        </Col>
                    )}
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Policy Type"
                                placeholder="Select Policy Type"
                                required={false}
                                isRequired={true}
                                options={_policySubType?.map(item => (
                                    {
                                        id: item.id,
                                        label: item.name,
                                        value: item.id
                                    }
                                )) || []}
                            />
                        }
                        name="policy_sub_type_id"
                        control={control}
                        defaultValue={""}
                        error={errors && errors.policy_sub_type_id}
                    />
                    {!!errors?.policy_sub_type_id && (
                        <Error>{errors?.policy_sub_type_id?.message}</Error>
                    )}
                </Col>
                <Col xl={4} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <SelectComponent
                                label="Policy Name"
                                placeholder="Select Policy Name"
                                required={false}
                                isRequired={true}
                                options={policies?.map((item) => ({
                                    id: item?.id,
                                    label: item?.number,
                                    value: item?.id,
                                })) || []}
                            />
                        }
                        name="policy_id"
                        control={control}
                        defaultValue={""}
                        error={errors && errors.policy_id}
                    />
                    {!!errors?.policy_id && (
                        <Error>{errors?.policy_id?.message}</Error>
                    )}
                </Col>
                {/* switch start */}
                {mostOuterTab && (
                    <>
                        <Col xl={4} lg={4} md={6} sm={12}>
                            <Controller
                                as={
                                    <Switch
                                        InputBorderStyle={{
                                            border: "none",
                                        }}
                                        showSpan={true}
                                        label={"Is Nomination Applicable ?"}
                                        required={true}
                                    />
                                }
                                defaultValue={0}
                                name={`nominee_requirement`}
                                control={control}
                            />
                        </Col>
                        {outerTab && (
                            <>
                                <Col xl={4} lg={4} md={6} sm={12}>
                                    <Controller
                                        as={
                                            <Switch
                                                InputBorderStyle={{
                                                    border: "none",
                                                }}
                                                showSpan={true}
                                                label={"Is Nominee Mandatory ?"}
                                                required={true}
                                            />
                                        }
                                        defaultValue={0}
                                        name={`nomineeMandatory`}
                                        control={control}
                                    />
                                </Col>
                                <Col
                                    xl={4}
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    className="align-self-center"
                                >
                                    <div className="text-center md-1 text-secondary">
                                        Allowed Members ?{" "}
                                        <small
                                            className="text-danger"
                                            style={{ fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}
                                        >
                                            *
                                        </small>{" "}
                                    </div>
                                    <label
                                        className={`w-100 d-flex justify-content-center align-items-center ${classes.checkbox}`}
                                        htmlFor="check1"
                                    >
                                        <div className="d-flex w-100 m-1 justify-content-center align-items-center">
                                            <div
                                                className={`py-2 px-2 text-center w-100  ${!check &&
                                                    classes.borderRounded +
                                                    " bg-primary text-center text-light"
                                                    }`}
                                            >
                                                <span>Insured Members</span>
                                            </div>

                                            <input
                                                onChange={(e) => setCheck((check) => !check)}
                                                type="checkbox"
                                                id="check1"
                                            />
                                            <div
                                                className={`py-2 px-2 text-center w-100 ${check &&
                                                    classes.borderRounded +
                                                    " bg-primary text-center text-light"
                                                    }`}
                                            >
                                                <span>Selected Members</span>
                                            </div>
                                        </div>
                                    </label>
                                </Col>
                            </>
                        )}
                    </>
                )}
                {/* switch end */}
            </div>
            {table && (
                <div className="table-responsive mt-4">
                    <table className="table table-striped mt-3">
                        <thead>
                            <TR>
                                <th>Select</th>
                                <th>Relations</th>
                            </TR>
                        </thead>
                        <tbody>
                            {
                                // eslint-disable-next-line array-callback-return
                                relations.map((data, i) => {
                                    if (Number(data?.id) !== 1) {
                                        return (
                                            <tr
                                                style={{
                                                    textAlign: "center",
                                                }}
                                                key={i}
                                            >
                                                <td>
                                                    <Controller
                                                        as={
                                                            <input
                                                                type="checkbox"
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                }}
                                                            />
                                                        }
                                                        defaultValue={false}
                                                        name={`triggers[${data?.id}].to_trigger`}
                                                        control={control}
                                                    />
                                                </td>
                                                <td>{data?.name}</td>
                                            </tr>
                                        );
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )}
            <div className="d-flex justify-content-end">
                <Button type="submit">
                    Submit
                    <i className="ml-3 fas fa-arrow-right"></i>
                </Button>
            </div>
        </form>
    );
}

export default CreateNominee;
