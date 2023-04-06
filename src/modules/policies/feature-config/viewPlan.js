import React from 'react'
import { Head, Text } from 'components';
import { Row, Col, Table } from 'react-bootstrap';
import { Card } from 'modules/RFQ/select-plan/style';
import { CardWrap, Content, Vline } from 'modules/RFQ/plan-configuration/style';
import styled from 'styled-components';

const style = { zoom: '0.9', minWidth: 'unset' }
const cardStyle = { zoom: '0.8' }

const TextDiv = styled.div`
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
`

export const ViewPlan = ({ data, setModal, i, onRemovePlan, type, view, SIType }) => {
    const { benefit_description,
        benefit_name,
        construct,
        features } = data;



    return (
        <Col xl={6} lg={6} md={12} sm={12} className='pr-3 pb-3'>
            <Card style={style} borderRadius='10px' minHeight boxShadow='1px 1px 14px 5px rgb(142 142 142 / 10%)'>
                <Vline active={true} />
                <CardWrap>
                    <div className='header'>
                        <h2>{benefit_name}</h2>
                        <div className='icon'>
                            {!!setModal && <i className="ti-pencil text-primary" onClick={() => setModal({
                                ...data, i,
                                ...(view && { construct: data.construct.map(({ relation_id }) => relation_id) })
                            })}></i>}
                            {!!onRemovePlan && <i className="ti-trash text-danger" onClick={() => onRemovePlan(i)}></i>}
                        </div>
                    </div>
                    {type === 'Plan' && <Row>
                        <Col md={6} lg={3} xl={3} sm={12} >
                            <Head>{SIType !== "salary" ? "Sum Insured" : "No Of Time Salay"}</Head>
                            <Text>{(construct)?.reduce((result, member_id) => {
                                return result = result + (result ? ', ' : '') + member_id?.name
                            }, '') ?? "-"}</Text>
                        </Col>
                    </Row>}
                    <Table style={cardStyle} striped={false} responsive>
                        <tr>
                            {features.some(({ name }) => name) && <th className='align-top'>Product Feature Name</th>}
                            {features.some(({ description }) => description) && <th className='align-top'>Content</th>}
                        </tr>

                        {features?.map(({ name, description, cover_by, cover, cover_type, premium_by, premium, premium_type }, index) =>
                            <tr key={index + 'sum-pre'}>
                                {features.some(({ name }) => name) && <td>{name}</td>}
                                {features.some(({ description }) => description) && <td>{description || '-'}</td>}
                            </tr>
                        )}

                    </Table>
                </CardWrap>

                {!!benefit_description && <Content>
                    {benefit_description}
                </Content>}
            </Card>
        </Col>
    )
}




export const ViewPlan2 = ({ data, configs, setModal, i, onRemovePlan, type, view, SIType }) => {
    const {
        content,
        no_of_times_of_salary,
        suminsured,
        title,
        image,
        is_policy_level
    } = data;


    return (
        <Col xl={6} lg={6} md={12} sm={12} className='pr-3 pb-3'>
            <Card style={style} borderRadius='10px' minHeight boxShadow='1px 1px 14px 5px rgb(142 142 142 / 10%)'>
                <Vline active={true} />
                <CardWrap>
                    <div className='header'>
                        <h2>{ }</h2>
                    </div>
                    <Row>
                        <Col md={6} lg={3} xl={3} sm={12}>
                            {is_policy_level !== 1 ? <>
                                <Head>{SIType !== "salary" ? "Sum Insured" : "No Of Time Salay"}</Head>
                                <Text>{suminsured ? suminsured : no_of_times_of_salary}</Text>
                            </> : <Head className='mb-3'>{"Policy Level"}</Head>}
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '15px' }}>
                        <Col md={12} lg={4} xl={4} sm={12}>
                            <TextDiv>{title}</TextDiv>
                        </Col>
                        <Col md={12} lg={4} xl={4} sm={12}>
                            <TextDiv>{content}</TextDiv>
                        </Col>
                        <Col md={12} lg={4} xl={4} sm={12} style={{ textAlign: 'center' }}>
                            <div>
                                {image ? <a style={{ textDecoration: "none" }} href={image || "#"} target="_blank" rel="noopener noreferrer"><img width='50px' src={image} alt='logo' /></a> : "-"}
                            </div>
                        </Col>
                    </Row>
                </CardWrap>
            </Card>
        </Col>
    )
}
