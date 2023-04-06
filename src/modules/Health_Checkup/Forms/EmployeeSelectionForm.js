import React from "react";
import { Col } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { Error, Select as Selecta, SelectComponent } from "components";
import Select from "react-select";
const EmployeeSelectionForm = ({ handleSubmit, onSubmit, userTypeName, employers, control, _policySubType,
    errors, policies, employee, classes, setRelationData, releation, members, currentUser }) => {
    return (
        <form className={`p-3`} onSubmit={handleSubmit(onSubmit)}>
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
                            />
                        </Col>
                    )}

                {!!(currentUser.is_super_hr && currentUser.child_entities.length) && (

                    <Col xl={4} lg={4} md={6} sm={12}>
                        <Controller
                            as={
                                <SelectComponent
                                    label="Employer"
                                    placeholder="Select Employer"
                                    required={false}
                                    isRequired={true}
                                    options={currentUser.child_entities.map(item => (
                                        {
                                            id: item.id,
                                            label: item.name,
                                            value: item.id
                                        }
                                    )) || []}
                                />
                            }
                            defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
                            name="employer_id"
                            control={control}
                        />
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
                                options={
                                    _policySubType?.map((item) => ({
                                        id: item.id,
                                        label: item.name,
                                        value: item.id,
                                    })) || []
                                }
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
                                isRequired={true}
                                required={false}
                                options={

                                    (_policySubType?.length > 0 && policies?.map((item) => ({
                                        id: item?.id,
                                        label: `${item?.policy_no}`,
                                        value: item?.id,
                                    }))) || []
                                }
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
                {userTypeName !== "Employee" && (
                    <Col md={6} lg={4} xl={4} sm={12}>
                        <Controller
                            as={
                                <Selecta
                                    label="Employee Name : Code"
                                    placeholder="Select Employee"
                                    isRequired={true}
                                    required={false}
                                    options={
                                        (_policySubType?.length > 0 && employee?.map((item) => ({
                                            id: item?.employee_id,
                                            name: item.employee_name + ' : ' + item.employee_code,
                                            value: item?.employee_id,
                                        }))) || []
                                    }
                                    id="emp_id"
                                />
                            }
                            // onChange={getMember}
                            name="emp_id"
                            control={control}
                        />
                    </Col>
                )}
                <Col md={6} lg={4} xl={4} sm={12} className="align-self-center">
                    <Controller
                        as={
                            <div className={` text-center ${classes.fieldset}`}>
                                <span className={`text-dark ${classes.legend}`}>
                                    Select Relation <span className="text-danger">*</span>
                                </span>
                                <Select
                                    className={`${classes.minHeight}`}
                                    closeMenuOnSelect={false}
                                    onChange={
                                        (e) =>
                                            // reducerDispatch({
                                            //   type: "ON_SELECT",
                                            //   payload: e,
                                            // })
                                            setRelationData(e)
                                    }
                                    value={releation}
                                    isMulti
                                    options={members?.map((data, i) => {
                                        return {
                                            id: data.member_id,
                                            name: data.relation_name,
                                            value: `${data.relation_name + " " + data.member_id
                                                }`,
                                            label: `${(data.relation_name === "Daughter" ||
                                                data.relation_name === "Son" || (data.relation_name === "Spouse/Partner" || data.relation_name === "Spouse" || data.relation_name === "Partner"))
                                                ? data.relation_name + " - " + data.name
                                                : data.relation_name
                                                }`,
                                        };
                                    })}
                                />
                            </div>
                        }
                        name="selectRelation"
                        error={errors && errors.selectRelation}
                        control={control}
                    />
                </Col>
            </div>
        </form>
    );
}

export default EmployeeSelectionForm;
