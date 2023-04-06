import React from "react";
import { Row, Col, Form } from 'react-bootstrap';
import { Controller } from "react-hook-form";
import { Input, Button, Select, Error, Marker, Typography } from "components";
import { numOnly, noSpecial } from "utils";
import Typeahead from "modules/RFQ/plan-configuration/steps/TypeSelect/TypeSelect.js";
import { AttachFile } from 'modules/core';
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { CustomCheck } from '../../../../policies/approve-policy/style';
import { TextInput } from '../../../plan-configuration/style';
const EditBasicDetailsForm = ({ handleSubmit, onSubmit, validation, errors, control, options, setSubPolicyType,
    subPolicyTypes, isBroker, icName, rfqData, setIcLogo, planDescription }) => {
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>

                <Col xl={3} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <Input
                                label="Plan Name"
                                placeholder="Enter Plan Name"
                                required
                                maxLength={validation.plan_name.max}
                                error={errors && errors.plan_name}
                            />
                        }
                        control={control}
                        name="plan_name"
                    />
                    {!!errors.plan_name && <Error>
                        {errors.plan_name.message}
                    </Error>}
                </Col>

                <Col xl={3} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <Select
                                label="Policy Type"
                                placeholder="Select Policy Type"
                                required
                                options={options.policy_types ||
                                    [{ id: 1, name: 'Group' }, { id: 2, name: 'Topup' }]}
                                error={errors && errors.policy_type_id}
                            />
                        }
                        onChange={([selected]) => {
                            setSubPolicyType(selected.target.value);
                            return selected;
                        }}
                        control={control}
                        name="policy_type_id"
                    />
                    {!!errors.policy_type_id && <Error>
                        {errors.policy_type_id.message}
                    </Error>}
                </Col>

                <Col xl={3} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <Select
                                label="Policy Sub Type"
                                placeholder="Select Policy Sub Type"
                                required
                                options={subPolicyTypes || []}
                                error={errors && errors.policy_sub_type_id}
                            />
                        }
                        control={control}
                        name="policy_sub_type_id"
                    />
                    {!!errors.policy_sub_type_id && <Error>
                        {errors.policy_sub_type_id.message}
                    </Error>}
                </Col>
                <Col xl={4} lg={5} md={6} sm={12}>
                    <Controller
                        as={
                            <Input
                                label='Min Employee Live'
                                placeholder='Enter Min Employee Live'
                                required
                                type='tel'
                                minLength={1}
                                // maxLength={validation.min_no_of_employee.length}
                                onKeyDown={numOnly} onKeyPress={noSpecial}
                                error={errors && errors.min_no_of_employee}
                            />
                        }
                        control={control}
                        name='min_no_of_employee'
                    />
                    {!!errors.min_no_of_employee && <Error>
                        {errors.min_no_of_employee.message}
                    </Error>}
                </Col>
                <Col xl={3} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <Input
                                label="Max Employee Live"
                                placeholder="Enter Max Employee Live"
                                required
                                maxLength={validation.max_no_of_employee.length}
                                type='tel'
                                onKeyDown={numOnly} onKeyPress={noSpecial}
                                error={errors && errors.max_no_of_employee}
                            />
                        }
                        control={control}
                        name="max_no_of_employee"
                    />
                    {!!errors.max_no_of_employee && <Error>
                        {errors.max_no_of_employee.message}
                    </Error>}
                </Col>

                {/* <Col xl={3} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label="Corporate Buffer %"
                  placeholder="Enter Corporate Buffer %"
                  type='tel'
                  maxLength={validation.co_oprate_buffer.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  required
                  error={errors && errors.co_oprate_buffer}
                />
              }
              control={control}
              name="co_oprate_buffer"
            />
            {!!errors.co_oprate_buffer && <Error>
              {errors.co_oprate_buffer.message}
            </Error>}
          </Col> */}

                {/* <Col xl={3} lg={4} md={6} sm={12}>
            <Controller
              as={
                <Input
                  label="Co-Pay %"
                  placeholder="Enter Co-Pay %"
                  type='tel'
                  maxLength={validation.co_oprate_buffer.length}
                  onKeyDown={numOnly} onKeyPress={noSpecial}
                  required
                  error={errors && errors.co_pay_percentage}
                />
              }
              control={control}
              name="co_pay_percentage"
            />
            {!!errors.co_pay_percentage && <Error>
              {errors.co_pay_percentage.message}
            </Error>}
          </Col> */}


                <Col xl={3} lg={4} md={6} sm={12}>
                    <Controller
                        as={
                            <Input
                                label="Max Discount %"
                                placeholder="Enter Max Discount %"
                                type='tel'
                                maxLength={validation.max_discount.length}
                                onKeyDown={numOnly} onKeyPress={noSpecial}
                                required
                                error={errors && errors.max_discount}
                            />
                        }
                        control={control}
                        name="max_discount"
                    />
                    {!!errors.max_discount && <Error>
                        {errors.max_discount.message}
                    </Error>}
                </Col>

                {isBroker && <>
                    <Col xl={4} lg={5} md={6} sm={12}>
                        <Controller
                            as={
                                <Typeahead
                                    label={'IC Name'}
                                    id="ic_name"
                                    valueName="name"
                                    options={options.insurance_compaines || []}
                                    required
                                    value={icName}
                                />
                            }
                            onChange={([data]) => {

                                return data?.name || "";
                            }}
                            defaultValue={rfqData.insurer_name}
                            error={errors && errors.ic_name}
                            name="ic_name"
                            control={control}
                        />
                        {!!errors.ic_name && <Error>{errors.ic_name.message}</Error>}
                    </Col>

                    {!!(icName && options.insurance_compaines.every(({ name }) => name !== icName)) && <Col xl={4} lg={5} md={6} sm={12}>
                        <AttachFile
                            required={false}
                            name={'ic_logo'}
                            title={'IC logo'}
                            key="premium_file"
                            onUpload={setIcLogo}
                            accept=".jpg, .jpeg, .png"
                            description="File Formats: jpg, jpeg, png"
                            nameBox
                        />
                    </Col>}
                </>
                }
            </Row>

            <Row>
                <Col xl={12} lg={10} md={12} sm={12}>
                    <TextCard className="pl-3 pt-3 pr-3 mb-4 mt-4" borderRadius='10px' noShadow border='1px dashed #929292' bgColor="#f8f8f8">
                        <Marker />
                        <Typography>{'\u00A0'} If Renewal journey chosen</Typography>
                        <div className='d-flex'>
                            <CustomCheck className="custom-control-checkbox">
                                <label className="custom-control-label-check  container-check">
                                    <span >{'Should able to view plan?'}</span>
                                    <Controller
                                        as={
                                            <input
                                                name={'can_view_plan_for_renewal'}
                                                type="checkbox"
                                                defaultChecked={rfqData?.can_view_plan_for_renewal}
                                            />
                                        }
                                        name={'can_view_plan_for_renewal'}
                                        onChange={([e]) => e.target.checked ? 1 : 0}
                                        control={control}
                                        defaultValue={0}
                                    />
                                    <span className="checkmark-check"></span>
                                </label>
                            </CustomCheck>
                            <CustomCheck className="custom-control-checkbox">
                                <label className="custom-control-label-check  container-check">
                                    <span >{'Should allow payment?'}</span>
                                    <Controller
                                        as={
                                            <input
                                                name={'allow_payment_for_renewal'}
                                                type="checkbox"
                                                defaultChecked={rfqData?.allow_payment_for_renewal}
                                            />
                                        }
                                        name={'allow_payment_for_renewal'}
                                        onChange={([e]) => e.target.checked ? 1 : 0}
                                        control={control}
                                        defaultValue={0}
                                    />
                                    <span className="checkmark-check"></span>
                                </label>
                            </CustomCheck>
                        </div>
                    </TextCard>
                </Col>
            </Row>

            <Row className="d-flex mt-3 mb-3 justify-content-center">
                <Col md={12} lg={12} xl={12} sm={12}>
                    <div style={
                        {
                            position: 'absolute',
                            right: '15px',
                            top: '-20px',
                            background: '#e2e2e2',
                            padding: '0px 5px',
                            borderRadius: '3px'
                        }
                    }>
                        {`${planDescription.length} / 800`}
                    </div>
                    <Controller
                        as={<TextInput
                            maxLength={validation.plan_description.length}
                            className="form-control"
                            placeholder="Enter Content Here..."
                        />}
                        name="plan_description"
                        control={control}
                        error={errors && errors.plan_description}
                    />
                    <label className="form-label">
                        <span className="span-label">Plan Description</span>
                    </label>
                    {!!errors.plan_description && <Error top='0'>
                        {errors.plan_description.message}
                    </Error>}
                </Col>
            </Row>

            <Row>
                <Col md={12} className="d-flex justify-content-end mt-4">
                    <Button type="submit">
                        Update
                    </Button>
                </Col>
            </Row>

        </Form>
    );
}

export default EditBasicDetailsForm;