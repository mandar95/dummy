import React, { useEffect, useState, Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Form } from "react-bootstrap";
import styled from 'styled-components';
import { Error, Counter, Button } from "components";
import "./Modal.css";
import * as yup from "yup";
import { numOnly, noSpecial } from '../../../../../../utils'
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { set_company_data, addAgeGroup, saveCompanyData } from '../../../home.slice'
import { AboutText, DefaultValue, AboutTextLabel } from "../../about-team/AboutTeam";
import swal from "sweetalert";


const CloseButton = styled.button`
    position: absolute;
    top: -15px;
    right: -10px;
    display: flex;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: #515151;
    text-shadow: none;
    opacity: 1;
    box-shadow: 0px 4px 20px 0px #00000080;
    z-index: 1;
    border: 1px solid #ffffff;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.7rem + ${fontSize - 92}%)` : '1.7rem'};
    
    background: white;
    &:focus{
        outline:none;
    }
`

const Rows = styled(Row)`
& label {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
    line-height:18px;
}
`
const RFQLabel = styled.label`
background: #d7d7d7;
padding: 5px 10px;
border-radius: 15px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'} !important;

`

const RFQInput = styled.input`
border-radius: 20px;
padding: 10px;
outline: none;
border: none;
background: wi;
width: 20%;

font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
background: white;
box-shadow: 0px 3px 11px 0px #dcdcdc;
`
const RFQSelect = styled.select`
border: 0px solid #dddddd;
border-radius: 30px;
outline: none;
background: #c7d3f000;
height: 41px;
width: 150px;
color:#484848e6;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
padding: 4px 10px;

-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background: #f0f2ff
		url("data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==")
		no-repeat right 10px center;

@media (max-width:992px) {
	width:100%
   }
`
const HeaderRows = styled(Row)`
@media (max-width:575px) {
	display:none;
   }
`
const BodyRows = styled(Col)`

@media (max-width:575px) {
	display:flex;
    &:nth-child(2){
        border-left:none;
        border-right:none;
    }
   }
`

const HeaderDiv = styled.div`
display:none;
@media (max-width:575px) {
    display: flex;
    width: 285px;
    text-align: left;
    align-items: center;
   }
`

/*----------validation schema----------*/
const validationSchema = (isDual) => yup.object().shape({
    no_of_employees: yup.number()
        .typeError('Please enter no. of employees')
        .min(7, "Minimum employees should be 7")
        .max(1000, "Maximum employees should be 1000"),
    member_details: yup.array().of(
        yup.object().shape({
            age_group: yup.string().required('Please select age'),
            sum_insured: yup.string().required('Please select sum insured'),
            ...(!isDual && {
                no_of_employees: yup.number()
                    .required('Please enter no of memebers')
                    .min(1, "Minimum employees should be 1")
            })
        })),
});

const TeamDetailsEditModal = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { globalTheme } = useSelector(state => state.theme)
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    const [memberCount, setMemberCount] = useState([]);

    const { sumInsuredData, ageGroupData, company_data } = useSelector(state => state.RFQHome);
    const isDual = Number(company_data.suminsured_type_id) === 2 && Number(company_data.premium_type) === 1


    const { handleSubmit, errors, register, setValue, watch, reset } = useForm({
        validationSchema: validationSchema(isDual),
        mode: "onBlur",
        reValidateMode: "onBlur"
    });
    const total_emp = watch('no_of_employees')


    // set distributed number to all counter component (onLoad--only once)
    useEffect(() => {
        if (company_data?.no_of_employees && company_data.member_details.length === 1) {
            let groups = []
            for (let member of distributeInteger(parseInt(company_data?.no_of_employees), company_data.member_details.length)) {
                groups.push(member)
            }
            setMemberCount(groups)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data?.no_of_employees])

    // set distributed number to all counter component (onChange)
    useEffect(() => {
        if (memberCount.length) {
            memberCount.forEach((item, index) => {
                if (item) {
                    if (parseInt(watch(`member_details[${0}].no_of_dependant`)) === 0) {
                        setValue(`member_details[${index}].no_of_employees`, item)
                    }
                    if (!isDual) {
                        setValue(`member_details[${index}].no_of_employees`, item)
                    }
                }
            })
            updateEmpCount()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memberCount])

    // reset data
    useEffect(() => {
        // setTimeout(() => {
        //     reset(company_data)
        // }, 0);
        reset(company_data)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data])

    // add counter component
    const addAgeGroupData = () => {
        const data = [{ age_group: ageGroupData[0].name, min_age: 0, max_age: 17, sum_insured: sumInsuredData[0].name, no_of_employees: 0, no_of_dependant: 0 }]
        dispatch(addAgeGroup({
            member_details: [...company_data.member_details, ...data],
            no_of_employees: total_emp,
        }));
    }
    // remove counter component
    const removeAgeGroupData = (e) => {
        let id = parseInt(e.target.id);
        let filterData = company_data.member_details.filter((item, index) => {
            return index !== id
        })
        dispatch(addAgeGroup({
            member_details: [...filterData],
            no_of_employees: parseInt(total_emp) - parseInt(watch(`member_details[${id}].no_of_employees`)),
        }));
    }

    // get age-rage based on min_age
    const getMinMax = (minAge) => {
        let averageAge = "";
        switch (minAge) {
            case 0: {
                averageAge = "0-17";
                break;
            }
            case 18: {
                averageAge = "18-35";
                break;
            }
            case 36: {
                averageAge = "36-45";
                break;
            }
            case 46: {
                averageAge = "46-60";
                break;
            }
            case 60: {
                averageAge = "60-75";
                break;
            }
            default: {
            }
        }
        return averageAge;
    }

    const distributeInteger = function* (total, divider) {
        if (divider === 0) {
            yield 0
        } else {
            let rest = total % divider
            let result = total / divider

            for (let i = 0; i < divider; i++) {
                if (rest-- > 0) {
                    yield Math.ceil(result)
                } else {
                    yield Math.floor(result)
                }
            }
        }
    }
    // update employee count logic here
    const updateEmpCount = (e) => {
        let totalEmp = [];
        const data = company_data.member_details.map((item, index) => {
            let memberCount = total_emp === "" ? 0 : parseInt(watch(`member_details[${index}].no_of_employees`));
            let dependentCount = 0;
            if (isDual) {
                dependentCount = parseInt(watch(`member_details[${index}].no_of_dependant`))
            }
            let SI = watch(`member_details[${index}].sum_insured`);
            let ageGroup = watch(`member_details[${index}].age_group`);
            let min_max = ageGroup.split("-")
            if (!isNaN(memberCount)) {
                totalEmp.push(memberCount)
                if (!isNaN(dependentCount)) {
                    totalEmp.push(dependentCount)
                }
            }
            return {
                ...item,
                no_of_employees: isNaN(memberCount) ? 0 : memberCount,
                ...(isDual && { no_of_dependant: isNaN(dependentCount) ? 0 : dependentCount }),
                sum_insured: SI,
                min_age: parseInt(min_max[0]),
                max_age: parseInt(min_max[1]),
                age_group: ageGroup
            }
        })
        let sum = totalEmp.reduce(function (a, b) { return a + b; }, 0);
        let num_of_emp = total_emp !== "" ? total_emp === "1000" ? total_emp : sum >= 0 ? parseInt(sum) : "" : 0;
        dispatch(addAgeGroup({
            no_of_employees: num_of_emp,
            member_details: [...data],
        }));
        ResetComponentData(data)
    }
    // distributed number logic here
    const distributeMemberCount = (e) => {
        let groups = [];
        let totalEmp = isNaN(parseInt(total_emp)) ? 0 : parseInt(total_emp);
        for (let member of distributeInteger(totalEmp, company_data.member_details.length)) {
            groups.push(member)
        }
        setMemberCount(groups)
    }
    // reset hook form data
    const ResetComponentData = (data) => {
        data.forEach((item, index) => {
            setValue(`member_details[${index}].age_group`, item.age_group)
            setValue(`member_details[${index}].sum_insured`, item.sum_insured)
            setValue(`member_details[${index}].no_of_employees`, item.no_of_memebers)
            setValue(`member_details[${index}].no_of_dependant`, item.no_of_dependant || 0)
        })
    }


    const onSubmit = (data) => {
        const defaultValue = DefaultValue(company_data, company_data.family_construct)
        if (defaultValue !== Number(total_emp)) {
            swal('Validation', AboutText(company_data, company_data.family_construct?.length) + ' should be ' + defaultValue, 'warning')
            return null
        }

        let member_details_data = data.member_details.map((item) => {
            let min_max = item.age_group.split("-")
            return { ...item, min_age: parseInt(min_max[0]), max_age: parseInt(min_max[1]) }
        })

        dispatch(saveCompanyData({
            no_of_employees: data.no_of_employees,
            age_group: member_details_data,
            step: 4,
            enquiry_id: id
        }, { message: 'Data Updated Successfully...' }));
        dispatch(set_company_data({
            no_of_employees: data.no_of_employees,
            member_details: member_details_data,
        }));
        props.onHide();
    }

    const closeModal = () => {
        props.onHide();
        props.onSaveFalse();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header style={{ border: 'none', background: '#f3f3f3' }}>
                <Modal.Title id="contained-modal-title-vcenter"><span className="ml-2" style={{ fontWeight: '500' }}>Edit Team Details</span></Modal.Title>
            </Modal.Header>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <Modal.Body>
                <Row>
                    <Form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                        <Row style={{ padding: '0px 55px 0 25px', justifyContent: 'center' }}>
                            <Col md={12} lg={12} xl={12} sm={12}>
                                <Rows>
                                    <Col md={12} lg={12} xl={12} sm={12} className='mb-3'>
                                        <Row className='align-items-center' style={{ marginBottom: '15px' }}>
                                            <Col md={12} lg={12} xl={12} sm={12} className='mb-3 d-flex align-items-center' style={{ marginLeft: '60px' }}>
                                                <span style={{ fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', marginRight: '60px' }}>
                                                    {AboutText(company_data, company_data.family_construct?.length)}
                                                </span>
                                                <RFQInput
                                                    name="no_of_employees"
                                                    ref={register}
                                                    defaultValue={DefaultValue(company_data, company_data.family_construct)}
                                                    maxLength="4"
                                                    autoComplete="none"
                                                    onKeyDown={numOnly} onKeyPress={noSpecial}
                                                    onChange={distributeMemberCount}
                                                    error={errors.no_of_employees}
                                                />
                                                {!!(errors.no_of_employees) && <Error style={{
                                                    marginTop: '15px !important',
                                                    marginLeft: '17px'
                                                }} className="mt-0">{errors.no_of_employees.message}</Error>}
                                            </Col>
                                        </Row>
                                        <div>
                                            <HeaderRows>
                                                <Col md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-3 text-center'><RFQLabel>AGE GROUP</RFQLabel></Col>
                                                <Col md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-3 text-center'><RFQLabel>SUM INSURED</RFQLabel></Col>
                                                <Col md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-3 text-center'><RFQLabel>{AboutTextLabel(company_data, company_data.family_construct?.length)}</RFQLabel></Col>
                                                {isDual && <Col md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-3 text-center'><RFQLabel>NO. OF DEPENDANT</RFQLabel></Col>}
                                            </HeaderRows>
                                            <Row>
                                                {ageGroupData.length > 0 && sumInsuredData?.length > 0 && company_data?.member_details.map((item, index) => (
                                                    <Fragment key={index + 'age-group-data'}>
                                                        <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center'>
                                                            <HeaderDiv>AGE GROUP</HeaderDiv>
                                                            <RFQSelect
                                                                name={`member_details[${index}].age_group`}
                                                                ref={register}
                                                                defaultValue={getMinMax(item.min_age)}
                                                                onChange={updateEmpCount}
                                                            >
                                                                {ageGroupData?.map((item) => (
                                                                    <option key={item.value + 'age_group'} value={item.value}>{item.name}</option>
                                                                ))}
                                                            </RFQSelect>
                                                        </BodyRows>
                                                        <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center'
                                                        //  style={{ borderLeft: '1px solid #c1c1c1', borderRight: '1px solid  #c1c1c1' }}
                                                        >
                                                            <HeaderDiv>SUM INSURED</HeaderDiv>
                                                            <RFQSelect
                                                                name={`member_details[${index}].sum_insured`}
                                                                ref={register}
                                                                defaultValue={item.sum_insured}
                                                                onChange={updateEmpCount}
                                                            >
                                                                {sumInsuredData?.map((item) => (
                                                                    <option key={item.value + 'sum-ins'} value={item.value}>{item.name}</option>
                                                                ))}
                                                            </RFQSelect>
                                                        </BodyRows>
                                                        <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center d-flex justify-content-center align-items-center'>
                                                            <HeaderDiv>NO. OF EMPLOYEES</HeaderDiv>
                                                            <div>
                                                                <Counter
                                                                    name={`member_details[${index}].no_of_employees`}
                                                                    inputRef={register}
                                                                    defaultValue={item.no_of_employees}
                                                                    //defaultValue={totalEmp[index]}
                                                                    setVal={setValue}
                                                                    watchVal={watch}
                                                                    myFunction={updateEmpCount}
                                                                    onChange={updateEmpCount}
                                                                />
                                                                {!!errors?.member_details?.length && errors.member_details[index]?.no_of_employees &&
                                                                    <Error className='mt-1'>
                                                                        {errors?.member_details?.length && errors.member_details[index]?.no_of_employees.message}
                                                                    </Error>}
                                                            </div>
                                                            {!isDual &&
                                                                (company_data?.member_details.length > 1) &&
                                                                // <Col md={1} lg={1} xl={1} sm={1} className='mb-1 text-center'>
                                                                <i style={{
                                                                    color: '#f24f4f',
                                                                    position: 'absolute',
                                                                    right: '0'
                                                                }}
                                                                    className="fa fa-trash-alt"
                                                                    id={index}
                                                                    onClick={removeAgeGroupData}></i>
                                                                //  </Col>
                                                            }
                                                        </BodyRows>
                                                        {isDual && <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center d-flex justify-content-center align-items-center'>
                                                            <HeaderDiv>NO. OF DEPENDANT</HeaderDiv>
                                                            <div>
                                                                <Counter
                                                                    name={`member_details[${index}].no_of_dependant`}
                                                                    inputRef={register}
                                                                    defaultValue={item.no_of_dependant}
                                                                    //defaultValue={totalEmp[index]}
                                                                    setVal={setValue}
                                                                    watchVal={watch}
                                                                    myFunction={updateEmpCount}
                                                                    onChange={updateEmpCount}
                                                                />
                                                                {!!errors?.member_details?.length && errors.member_details[index]?.no_of_dependant &&
                                                                    <Error className='mt-1'>
                                                                        {errors?.member_details?.length && errors.member_details[index]?.no_of_dependant.message}
                                                                    </Error>}
                                                            </div>
                                                            {
                                                                (company_data?.member_details.length > 1) &&
                                                                // <Col md={1} lg={1} xl={1} sm={1} className='mb-1 text-center'>
                                                                <i style={{
                                                                    color: '#f24f4f',
                                                                    position: 'absolute',
                                                                    right: '0'
                                                                }}
                                                                    className="fa fa-trash-alt"
                                                                    id={index}
                                                                    onClick={removeAgeGroupData}></i>
                                                                // </Col>
                                                            }
                                                        </BodyRows>}
                                                    </Fragment>
                                                ))}
                                            </Row>
                                        </div>
                                    </Col>
                                </Rows>
                                <Row className="justify-content-center">
                                    <Button buttonStyle="outline" type='button' onClick={addAgeGroupData}>
                                        <i className="ti ti-plus"></i> Add age group
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                        {/* <Modal.Header style={{ border: 'none', background: '#f3f3f3', margin: '15px 0px' }}>
                            <Modal.Title id="contained-modal-title-vcenter"><span className="ml-2" style={{ fontWeight: '500' }}>Edit Family Count</span></Modal.Title>
                        </Modal.Header>
                        <Row>
                            <Col
                                sm="12"
                                md="12"
                                lg="8"
                                xl="8"
                                className="pl-4 pr-4 d-flex flex-wrap align-content-start"
                            >
                                {!!props?.company_data?.company_name && Count}

                            </Col>
                        </Row>*/}
                        <Modal.Footer style={{ border: 'none', padding: '10px', display: 'flex', justifyContent: 'flex-center' }}>
                            <Row>
                                <Col md={12} className="d-flex justify-content-end">
                                    <Button type="submit" onClick={props.onSaveTrue}>
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </Modal.Footer>
                    </Form>
                </Row>
            </Modal.Body>
        </Modal>
    );
}
export default TeamDetailsEditModal;
