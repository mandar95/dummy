import React, { useEffect, useState, Fragment } from "react";
import { Row, Col, Form } from "react-bootstrap";
import styled from 'styled-components';
import { Error, RFQButton, RFQcard, Loader, Counter, Button } from "components";
import { BackBtn } from '../button'
import { numOnly, noSpecial } from '../../../../../utils'
import * as yup from "yup";


import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { clear, set_company_data, saveCompanyData, addAgeGroup, getRFQDataCount } from '../../home.slice';
import swal from "sweetalert";
import { doesHasIdParam } from "../../home";
import { getMinMax, distributeInteger } from './helper';

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

const InputDiv = styled.input`
border: 0px solid #dddddd;
border-radius: 30px;
outline: none;
height: 41px;
/* background: #f0f2ff; */
width: 150px;
color:#484848e6;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
padding: 4px 10px;

background: #f0f2ff;
@media (max-width:992px) {
	width:100%
   }
`

const RFQSelect = styled.select`
border: 0px solid #dddddd;
border-radius: 30px;
outline: none;
height: 41px;
/* background: #f0f2ff; */
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
    // border-left:1px solid #c1c1c1;
    // border-right:1px solid #c1c1c1

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
                    .min(1, "Minimum should be 1")
            }),
        })),
});

export const AboutTeam = ({ utm_source }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = decodeURIComponent(query.get("enquiry_id"));
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const { success, loading, company_data,
        sumInsuredData, ageGroupData, RFQDataCount } = useSelector(state => state.RFQHome);
    const { globalTheme } = useSelector(state => state.theme)
    const [memberCount, setMemberCount] = useState([])
    const isDual = Number(company_data.suminsured_type_id) === 2 && Number(company_data.premium_type) === 1

    // const averageAgeEmployees = [
    // { id: 1, name: '0-25 Yrs', value: '0-25' },
    // { id: 2, name: '26-35 Yrs', value: '26-35' },
    // { id: 3, name: '36-45 Yrs', value: '36-45' },
    // { id: 4, name: '46-55 Yrs', value: '46-55' },
    // { id: 5, name: '56-65 Yrs', value: '56-65' },
    // { id: 6, name: '66-75 Yrs', value: '66-75' },
    //     { id: 1, name: '0-17 Yrs', value: '0-17' },
    //     { id: 2, name: '18-35 Yrs', value: '18-35' },
    //     { id: 3, name: '36-45 Yrs', value: '36-45' },
    //     { id: 4, name: '46-60 Yrs', value: '46-60' },
    //     { id: 5, name: '60-75 Yrs', value: '60-75' },
    // ]
    // const sumInsured = [
    //     { id: 1, name: '50000', value: '50000' },
    //     { id: 2, name: '1 Lacs', value: '100000' },
    //     { id: 3, name: '2 Lacs', value: '200000' },
    //     { id: 4, name: '3 Lacs', value: '300000' },
    //     { id: 5, name: '4 Lacs', value: '400000' },
    //     { id: 6, name: '5 Lacs', value: '500000' },
    // ]



    const { handleSubmit, errors, register, setValue, watch, reset } = useForm({
        validationSchema: validationSchema(isDual),
        mode: "onBlur",
        reValidateMode: "onBlur"
    });


    const total_emp = watch('no_of_employees')
    const isDemography = Number(company_data?.is_demography) === 1 ? true : false

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
        reset(company_data)
        if (!isDemography && !RFQDataCount.length) {
            dispatch(getRFQDataCount(insurerId || id))
            //dispatch(employeeSheetData({ enquiry_id: insurerId || id }));
        }
        // dispatch(addAgeGroup({
        //     member_details: company_data.member_details || [],
        //     no_of_employees: DefaultValue(company_data, company_data.relation_count)
        // }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company_data])

    // redirect if !id
    useEffect(() => {
        if (!id) {
            history.replace(`/company-details`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // redirect
    useEffect(() => {
        if (success && id) {
            history.push(`/topup?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`)
        }
        return () => { dispatch(clear('RFQDataCount')) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, id])

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

    // update employee count logic here
    const updateEmpCount = (e) => {
        let totalEmp = [];
        let data = [];
        data = company_data.member_details.map((item, index) => {
            let memberCount = total_emp === "" ? 0 : (parseInt(watch(`member_details[${index}].no_of_employees`)));
            let dependentCount = 0;
            if (isDual) {
                dependentCount = parseInt(watch(`member_details[${index}].no_of_dependant`))
            }
            let SI = watch(`member_details[${index}].sum_insured`);
            let ageGroup = watch(`member_details[${index}].age_group`);
            let min_max = ageGroup.split("-")
            if (!isNaN(memberCount)) {
                totalEmp.push((memberCount))
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
    const distributeMemberCount = () => {
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
            setValue(`member_details[${index}].no_of_employees`, item.no_of_employees)
            setValue(`member_details[${index}].no_of_dependant`, item.no_of_dependant || 0)
        })
    }

    // set distributed number to all counter component (onLoad--only once)

    const onSubmit = (data) => {
        const defaultValue = !isDemography ? RFQDataCount[0]?.total_lives_count : DefaultValue(company_data, company_data.family_construct)
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
            enquiry_id: id,
            is_self: company_data?.isSelf ?? 1
        }));
        dispatch(set_company_data({
            no_of_employees: data.no_of_employees,
            member_details: member_details_data
        }));
    }
    return (
        <>
            <Row>
                <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
                    <BackBtn
                        url={isDemography ? `/family-count?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}` : `/upload-data-demography?enquiry_id=${encodeURIComponent(id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`}
                        style={{ outline: "none", border: "none", background: "none" }}>
                        <img
                            src="/assets/images/icon/Group-7347.png"
                            alt="bck"
                            height="45"
                            width="45"
                        />
                    </BackBtn>
                    <h1 style={{ fontWeight: "600", marginLeft: '10px', fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>{isDemography ? 'Tell us about your team' : 'Your team details'}</h1>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ justifyContent: 'center' }}>
                    <Col md={12} lg={isDual ? 9 : 7} xl={isDual ? 9 : 7} sm={12}>
                        <Rows>
                            <Col md={12} lg={12} xl={12} sm={12} className='mb-3'>
                                <Row className='align-items-center' >
                                    <Col md={12} lg={12} xl={12} sm={12} className='mb-3 d-flex align-items-center' style={{ marginLeft: '60px' }}>
                                        <span style={{ fontWeight: '500', fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', marginRight: '60px' }}>
                                            {isDemography ? AboutText(company_data, company_data.family_construct?.length) : AboutText2(RFQDataCount)}

                                        </span>
                                        <RFQInput
                                            name="no_of_employees"
                                            ref={register}
                                            //  defaultValue={Number(company_data?.is_demography) === 1 ? DefaultValue(company_data, company_data.family_construct) : RFQDataCount[0]?.total_lives_count}
                                            defaultValue={RFQDataCount[0]?.total_lives_count}
                                            maxLength="4"
                                            autoComplete="none"
                                            onKeyDown={numOnly} onKeyPress={noSpecial}
                                            onChange={distributeMemberCount}
                                            error={errors.no_of_employees}
                                            readOnly={isDemography ? false : true}
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
                                        {isDemography ?
                                            ageGroupData?.length > 0 && sumInsuredData?.length > 0 && company_data?.member_details.map((item, index) => (
                                                <Fragment key={index + 'about-team'}>
                                                    <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center'>
                                                        <HeaderDiv>AGE GROUP</HeaderDiv>
                                                        <RFQSelect
                                                            name={`member_details[${index}].age_group`}
                                                            ref={register}
                                                            defaultValue={getMinMax(item.min_age)}
                                                            onChange={updateEmpCount}
                                                        >
                                                            {ageGroupData?.map((item) => (
                                                                <option key={item.value + 'age-group'} value={item.value}>{item.name}</option>
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
                                                            // </Col>
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
                                            ))
                                            :
                                            DemographyReadOnlyData(company_data?.member_details, isDual, register)
                                        }
                                    </Row>
                                </div>
                            </Col>
                        </Rows>
                        {isDemography &&
                            <Row className="justify-content-center">
                                <Button buttonStyle="outline" type='button' onClick={addAgeGroupData}>
                                    <i className="ti ti-plus"></i> Add age group
                                </Button>
                            </Row>
                        }
                        <Col
                            sm="12"
                            md="12"
                            lg="12"
                            xl="12"
                            className="mt-4 mb-5 pt-4"
                        >
                            <RFQButton>
                                Next
                                <i className="fa fa-long-arrow-right" aria-hidden="true" />
                            </RFQButton>
                        </Col>
                    </Col>
                    <Col md={12} lg={isDual ? 3 : 5} xl={isDual ? 3 : 5} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <RFQcard
                            title="Age will help to get accurate price"
                            content="We use this to get customized quote. You can specify total employee count if you are not sure about age band"
                            imgSrc="/assets/images/RFQ/lightbulb@2x.png"
                        />
                    </Col>
                </Row>
            </Form>
            {(loading || success) && <Loader />}
        </>
    );
};

export const AboutText = (companyData = {}, relationLength) => {
    if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) === 1) {
        return 'Total number of employees'
    }
    else if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) > 1) {
        return 'Total number of live'
    }
    else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 1) {
        return 'Total number of live'
    }
    else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 2) {
        return 'Total number of employees'
    }

    return 'Total number of employees'
}

export const AboutTextLabel = (companyData = {}, relationLength) => {
    if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) === 1) {
        return 'NO. OF EMPLOYEES'
    }
    else if (Number(companyData.suminsured_type_id) === 1 && Number(relationLength) > 1) {
        return 'NO. OF LIVES'
    }
    else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 1) {
        return 'NO. OF EMPLOYEES'
    }
    else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 2) {
        return 'NO. OF EMPLOYEES'
    }

    return 'NO. OF EMPLOYEES'
}

export const DefaultValue = (companyData = {}, relations) => {
    if (relations)
        if (Number(companyData.suminsured_type_id) === 1 && Number(relations.length) === 1) {
            return relations.find(({ relation_id }) => Number(relation_id) === 1)?.no_of_relations || 10
        }
        else if (Number(companyData.suminsured_type_id) === 1 && Number(relations.length) > 1) {
            return relations.reduce((total, { no_of_relations }) => total + no_of_relations, 0)
        }
        else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 1) {
            return relations.reduce((total, { no_of_relations }) => total + no_of_relations, 0)
        }
        else if (Number(companyData.suminsured_type_id) === 2 && Number(companyData.premium_type) === 2) {
            return relations.find(({ relation_id }) => Number(relation_id) === 1)?.no_of_relations || 10
        }

    return 10
}

const AboutText2 = (_data) => {
    let _text = _data[0]?.self_count === _data[0]?.total_lives_count ? "Total number of employees" : "Total number of live"
    return _text
}

const DemographyReadOnlyData = (member_details, isDual, register) => {
    return member_details.map((item, index) => (
        <Fragment key={index + 'about-team2'}>
            <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center'>
                <HeaderDiv>AGE GROUP</HeaderDiv>
                <InputDiv
                    name={`member_details[${index}].age_group`}
                    ref={register}
                    defaultValue={item.age_group}
                    readOnly
                >
                </InputDiv>
            </BodyRows>
            <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center'>
                <HeaderDiv>SUM INSURED</HeaderDiv>
                <InputDiv
                    name={`member_details[${index}].sum_insured`}
                    ref={register}
                    defaultValue={item.sum_insured}
                    readOnly
                >
                </InputDiv>
            </BodyRows>
            <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center d-flex justify-content-center align-items-center'>
                <HeaderDiv>NO. OF EMPLOYEES</HeaderDiv>
                <div>
                    <InputDiv
                        name={`member_details[${index}].no_of_employees`}
                        ref={register}
                        defaultValue={item.no_of_employees}
                        readOnly
                    />
                </div>
            </BodyRows>
            {isDual && <BodyRows md={isDual ? 3 : 4} lg={isDual ? 3 : 4} xl={isDual ? 3 : 4} sm={isDual ? 3 : 4} className='mb-1 text-center d-flex justify-content-center align-items-center'>
                <HeaderDiv>NO. OF DEPENDANT</HeaderDiv>
                <div>
                    <InputDiv
                        name={`member_details[${index}].no_of_dependant`}
                        ref={register}
                        defaultValue={item.no_of_dependant}
                        readOnly
                    />
                </div>
            </BodyRows>}
        </Fragment>
    ))
}
