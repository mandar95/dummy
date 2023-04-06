import React from "react";
import { Row, Col } from "react-bootstrap";
import { Input, Select } from "../../components";
import { Error } from 'components';
import { noSpecial, numOnly } from '../../../../utils';
import { Button } from '../../select-plan/style';
const ModalForm = ({ handleSubmit, onSubmit, register, relations, errors, Relations, Data }) => {
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="d-flex flex-wrap" >

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Select
                        name="relation_id"
                        label='Relation Type'
                        placeholder="Select Relation Type"
                        autoComplete="none"
                        id="relation_id"
                        inputRef={register}
                        isRequired={true}
                        required={false}
                        defaultValue={""}
                        options={relations.map(({ name, id }) => ({
                            id, name: name === 'Self' ? 'Employee' : name, value: id
                        })) || []}
                        error={errors.relation_id}
                    />
                    {!!errors?.relation_id && <Error top='4px'>{errors?.relation_id?.message}</Error>}
                </Col>

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Input
                        label="EID"
                        name="employee_id"
                        type="text"
                        inputRef={register}
                        isRequired={true}
                        error={errors?.employee_id}

                    />
                    {!!errors?.employee_id && <Error top='4px'>{errors?.employee_id?.message}</Error>}
                </Col>

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Input
                        label="Name"
                        name="name"
                        type="text"
                        inputRef={register}
                        isRequired={true}
                        error={errors?.name}

                    />
                    {!!errors?.name && <Error top='4px'>{errors?.name?.message}</Error>}
                </Col>

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Input
                        label="Date of birth"
                        name="dob"
                        type="date"
                        inputRef={register}
                        isRequired={true}
                        error={errors?.dob}

                    />
                    {!!errors?.dob && <Error top='4px'>{errors?.dob?.message}</Error>}
                </Col>

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        inputRef={register}
                        isRequired={true}
                        error={errors?.email}

                    />
                    {!!errors?.email && <Error top='4px'>{errors?.email?.message}</Error>}
                </Col>

                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Select
                        label="Gender"
                        name='gender'
                        placeholder='Select Gender'
                        inputRef={register}
                        isRequired={true}
                        required={false}
                        error={errors?.gender}
                        options={Relations}
                    />
                    {!!errors.gender && <Error top='4px'>
                        {errors.gender.message}
                    </Error>}
                </Col>
                <Col md={6} lg={6} xl={6} sm={12} className='mb-3'>
                    <Input
                        label="Sum Insured"
                        name="sum_insured"
                        type="tel"
                        onKeyDown={numOnly} onKeyPress={noSpecial}
                        maxLength={9}
                        isRequired={true}
                        inputRef={register}
                        error={errors?.sum_insured}

                    />
                    {!!errors?.sum_insured && <Error top='4px'>{errors?.sum_insured?.message}</Error>}
                </Col>

            </Row>

            <Row >
                <Col md={12} className="d-flex justify-content-center mt-4">
                    <Button width={"190px"}
                        padding="15px"
                        fontSize='1.5rem' type='submit'>
                        {Data === true ? 'Add' : 'Update'} <i className="fa fa-plus" aria-hidden="true" />
                    </Button>
                </Col>
            </Row>
        </form>
    );
}

export default ModalForm;