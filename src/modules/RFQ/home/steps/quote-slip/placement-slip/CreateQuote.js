import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert';
import * as yup from "yup";

import { IconlessCard, Button, Error } from 'components';
import { Row, Col, Table, Form, Button as Btn } from 'react-bootstrap';
// import { Input } from "modules/RFQ/components/index.js";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useHistory, useParams } from 'react-router';
import { addQuote, deleteInsurer, initialState, loadInsurer, loadQCRQuotes, reducer, updateInsurerData } from './qcr.action';
import { Loader } from '../../../../../../components';
import { randomString, DateFormate } from '../../../../../../utils';
// import { CalculatePlans } from './ViewQuoteDetail';
import Typeahead from 'modules/RFQ/plan-configuration/steps/TypeSelect/TypeSelect';
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

import { noSpecial, numOnlyWithPoint } from 'utils';
import _ from "lodash";

const CalculatePlans = ({ data = [], feature = [] }) => {
  const allIC = [...new Set(data.map(({ insurer_name }) => insurer_name))];

  const result = [];
  allIC.forEach((elem, index) => {
    let product_feature = [];
    feature.forEach(({ id: feature_id }, index2) => {
      data.forEach((elem2) => {
        if (elem2.quote_slip_feature_id === feature_id && elem === elem2.insurer_name) {
          product_feature[index2] = elem2
        }
      })
    })
    result[index] = {
      "insurer_name": elem,
      "insurer_id": data.find(({ insurer_name }) => insurer_name === elem)?.insurer_id,
      "premium": product_feature?.[0]?.premium,
      "premium_tax": product_feature?.[0]?.premium_tax,
      "total_premium": product_feature?.[0]?.total_premium,
      "selected_insurer": product_feature?.[0]?.selected_insurer,
      "tax_type": product_feature?.[0]?.tax_type,
      product_feature
    }
  })
  return result
}

const schmea = yup.object().shape({
  plans: yup.array().of(
    yup.object().shape({
      insurer_name: yup.string().required("Insurer Name Required").label("Insurer Name"),
      product_feature: yup.array().of(
        yup.object().shape({
          label: yup.string().required("Required"),
        })),
      premium: yup.string().required("Required"),
      premium_tax: yup.string().required("Required"),
      total_premium: yup.string().required("Required")

    }))
});

export function CreateQuote() {

  const [{ qcr_detail, loading, insurer }, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const [insurer_features, set_insurer_feature] = useState([]);
  const { id, userType } = useParams();
  const { control, errors, handleSubmit, register, reset, watch, setValue } = useForm({
    validationSchema: schmea,
    mode: "onBlur",
  });



  const { fields, remove, append } = useFieldArray({
    control,
    name: 'plans'
  });

  const is_update = qcr_detail.insurer?.length;
  const tax_type = Number(watch('tax_type') || 1);
  const premium_detail = watch('plans') || [];


  useEffect(() => {
    append({ firstName: '', lastName: '' });
    loadQCRQuotes(dispatch, { quote_id: id })
    loadInsurer(dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (is_update) {
      const FilterResponse = CalculatePlans({ data: qcr_detail.insurer, feature: qcr_detail.data_slip_feature });
      set_insurer_feature(FilterResponse)
      reset({ plans: FilterResponse || [], tax_type: String(FilterResponse[0].tax_type || 1) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qcr_detail])

  useEffect(() => {
    if (tax_type) {
      premium_detail.forEach(({ premium = 0, premium_tax = 0 }, index) => {
        let total = 0
        if (tax_type === 1) {
          total = Number(premium) + Number(premium_tax)
        } else {
          total = Number(premium) + (Number(premium) * Number(premium_tax) / 100)
        }
        setValue(
          `${('plans')}[${index}].total_premium`,
          String(total).includes('.') ? total.toFixed(2) : total
        );
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tax_type])

  const calculateTotalPremium = (i, tax = 0) => {
    if (premium_detail[i].premium && tax) {
      // const total = Number(premium_detail[i].premium) + (premium_detail[i].premium * tax / 100)
      let total = 0
      if (tax_type === 1) {
        total = Number(premium_detail[i].premium) + Number(tax)
      } else {
        total = Number(premium_detail[i].premium) + (Number(premium_detail[i].premium) * Number(tax) / 100)
      }
      setValue(
        `${('plans')}[${i}].total_premium`,
        String(total).includes('.') ? total.toFixed(2) : total
      );
    }
  }

  const onAddCount = () => {
    if (fields?.length === 4) {
      return swal('Validation', 'Limit reached', 'info')
    }
    append({ firstName: '', lastName: '' });
  }

  const onSubCount = (id) => {
    if (fields?.length === 1) {
      return
    }
    remove(id);
  }


  const onSubmit = ({ plans }) => {
    const allICS = plans.map((item) => item.insurer_name);
    if ([...new Set(allICS)].length !== plans.length) {
      swal('Validation', 'Insurer should not be repeated', 'info');
      return
    }
    let _plans = plans.map((item, index) => {
      if (insurer.every(({ name }) => name !== item.insurer_name)) {
        let newObj = qcr_detail?.insurer[index]?.insurer_id ? _.omit(item, 'insurer_name') : item;
        return {
          ...newObj,
          product_feature: item.product_feature.map((elem, item1) => ({
            ...elem,
            ...((elem.feature_id || fields[index]?.product_feature?.[item1]?.feature_id) && { feature_id: elem.feature_id || fields[index]?.product_feature?.[item1]?.feature_id }),
            ...((elem.product_feature || fields[index]?.product_feature?.[item1]?.product_feature) && { product_feature: elem.product_feature || fields[index]?.product_feature?.[item1]?.product_feature })
          })),
          ...(qcr_detail?.insurer[index]?.insurer_id &&
            { insurer_id: item.insurer_id }
          )
        }
      }
      else {
        let newObj = _.omit(item, 'insurer_name');
        return {
          insurer_id: insurer.find(({ name }) => name === item.insurer_name).id,
          ...newObj,
          product_feature: item.product_feature.map((elem, item1) => ({
            ...elem,
            ...((elem.feature_id || fields[index]?.product_feature?.[item1]?.feature_id) && { feature_id: elem.feature_id || fields[index]?.product_feature?.[item1]?.feature_id }),
            ...((elem.product_feature || fields[index]?.product_feature?.[item1]?.product_feature) && { product_feature: elem.product_feature || fields[index]?.product_feature?.[item1]?.product_feature })
          }))
        }
      }
    })

    if (is_update) {
      swal({
        title: 'Update Version?',
        text: 'Should Update Quote Vesrsion',
        icon: "warning",
        buttons: {
          // cancel: "Cancel",
          catch: {
            text: "No",
            value: "No",
          },
          'Yes': 'Yes'
        },
        dangerMode: 'true',
      })
        .then((caseValue) => {
          switch (caseValue) {
            case "Yes":
              updateInsurerData(dispatch, {
                quote_id: id,
                plans: _plans,
                type: 'updateversion',
                tax_type: tax_type
              }, history, userType)
              break;
            case "No":
              updateInsurerData(dispatch, {
                quote_id: id,
                plans: _plans,
                type: 'update',
                tax_type: tax_type
              }, history, userType)
              break;
            default:
          }
        })
    } else {
      addQuote(dispatch, {
        quote_id: id,
        plans: _plans,
        tax_type: tax_type
      }, history,
        userType)
    }
  }

  return (
    <>
      <IconlessCard isHeder={false} marginTop={'0'}>
        <div className="d-flex justify-content-between ">
          <HeaderDiv>
            <div className='icon'>
              <i className='fas fa-file-invoice' />
            </div>
            <div>
              <p className='title'>Quote for {qcr_detail.company_name}</p>
              {/* <p className='secondary-title'>Group Mediclaim</p> */}
            </div>
          </HeaderDiv>
          {!!insurer_features.length && <div style={{ marginTop: '-10px' }}>
            <Button type="button" onClick={() => { history.replace(`/${userType}/qcr-quote-view/${randomString()}/${id}/${randomString()}`) }} buttonStyle="outline-secondary">
              Cancel
            </Button>
          </div>}
        </div>
        <Row className="align-items-center">
          <Col
            md={12}
            lg={12}
            xl={10}
            sm={12}
            className="d-flex flex-wrap">
            {Widget.map(({ text_color, bg_color, imgSrc, key_name, memeberType, type
            }) =>
              <WidgetCard
                key={uuidv4()}
                text_color={text_color}
                bg_color={bg_color}
                margin={"0 0.5rem 1rem"}
                imgSrc={imgSrc}
                value={type === 'date' ? DateFormate(qcr_detail[key_name]) : qcr_detail[key_name]}
                memeberType={memeberType}
                history={history}
                userType={userType}
                id={id}
              />
            )}

          </Col>
          <Col
            md={12}
            lg={12}
            xl={2}
            sm={12}
            className="d-flex justify-content-end mb-2">
          </Col>
        </Row>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledTable className="text-center rounded text-nowrap"
            style={{ border: "solid 1px #e6e6e6" }} responsive>
            <thead>
              <tr>
                <th>Product Feature</th>
                <th>Proposed Option</th>
                {fields.map((field, index) => <th key={field.id + 'th'}>
                  {is_update && index < insurer_features.length ?
                    <>
                      <input type='hidden' ref={register} name={`plans[${index}].insurer_id`} value={field.insurer_id} />
                      <input type='hidden' ref={register} name={`plans[${index}].insurer_name`} value={field.insurer_name} />
                      {field?.insurer_name || ''}
                      {fields?.length > 1 && <i role='button' className='fad fa-trash-alt text-danger mx-2 p-1 pt-2 bg-light' onClick={() => swal({
                        title: "Are you sure?",
                        text: "Once deleted, you will not be able to recover!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      }).then((willDelete) => {
                        if (willDelete) {
                          deleteInsurer(dispatch, field.insurer_id, id)
                        }
                      })} />}
                    </> :
                    <>
                      <div className='insurer-div d-flex align-items-center justify-content-between'>
                        <Controller
                          as={
                            <Typeahead
                              label={'Insurer ' + (index + 1)}
                              // id='ic_name'
                              // valueName='name'
                              minHeight={'30px'}
                              margin={"0px"}
                              width={'100%'}
                              isLabel={false}
                              required={true}
                              options={insurer || []}
                              // required
                              value={""}
                            />
                          }
                          onChange={([data]) => {
                            return data?.name || '';
                          }}
                          // defaultValue={field?.insurer_name || ''}
                          // error={errors && errors.ic_name}
                          ref={register()}
                          name={`plans[${index}].insurer_name`}
                          control={control}
                        />
                        {fields?.length > 1 && <i className='fad fa-trash-alt text-danger mr-2' onClick={() => onSubCount(index)} />}
                      </div>
                      {!!errors.plans?.[index]?.insurer_name && <Error className='mb-0' top='0'>
                        {errors.plans[index]?.insurer_name.message}
                      </Error>}
                    </>
                  }
                  {/* <div className='insurer-div d-flex align-items-center justify-content-between'>
                    <Form.Control className='rounded-lg' size='sm' type='text'
                      maxLength={20}
                      name={`plans[${index}].insurer_name`}
                      ref={register()}
                      defaultValue={field?.insurer_name || ''}
                      placeholder={'Enter Insurer ' + (index + 1)} />
                    {fields?.length > 1 && <i className='fad fa-trash-alt text-danger mr-2' onClick={() => onSubCount(index)} />}

                  </div>
                  {!!errors.plans?.[index]?.insurer_name && <Error className='mb-0' top='0'>
                    {errors.plans[index]?.insurer_name.message}
                  </Error>} */}
                </th>)}

                {/* !is_update && */ fields?.length < 4 && <th className='add_button'><Btn size='sm' className='rounded-circle bg-light' type="button" onClick={onAddCount}>
                  <i className="ti ti-plus text-primary" role='button'></i>
                </Btn></th>}
              </tr>
            </thead>
            <tbody>
              {qcr_detail.data_slip_feature?.map(({ feature_name, proposed_option, id }, index) =>
                <tr key={index + '-feat-' + id}>
                  <td>{feature_name}</td>
                  <td>{proposed_option || '-'}</td>
                  {fields.map((field, index1) =>
                    <td key={field.id + 'td'}>
                      <input type='hidden' ref={register} name={`plans[${index1}].product_feature[${index}].feature_id`}
                        //  value={is_update ? field?.product_feature?.[index]?.id : id} 
                        // defaultValue={field?.product_feature?.[index]?.feature_id || ''}
                        // {...register(`plans[${index1}].product_feature[${index}].feature_id`)}
                        value={id || field?.product_feature?.[index]?.feature_id || ''}
                      />
                      <input type='hidden' ref={register} name={`plans[${index1}].product_feature[${index}].product_feature`}
                        // defaultValue={field?.product_feature?.[index]?.product_feature || ''}
                        // {...register(`plans[${index1}].product_feature[${index}].product_feature`)}
                        value={id || field?.product_feature?.[index]?.product_feature || ''} />
                      <Form.Control className='rounded-lg' size='sm' type='text'
                        maxLength={500}
                        name={`plans[${index1}].product_feature[${index}].label`}
                        ref={register()}
                        defaultValue={field?.product_feature?.[index]?.label || ''}
                        placeholder='' />
                      {!!errors?.plans?.[index1]?.product_feature?.[index]?.label && <Error className='mb-0' top='0'>
                        {errors?.plans?.[index1]?.product_feature?.[index]?.label.message}
                      </Error>}
                    </td>
                  )}
                  {/* !is_update && */ fields?.length < 4 && <td></td>}
                </tr>
              )}

              <tr>
                <td>Premium (₹)</td>
                <td></td>
                {fields.map((field, index1) =>
                  <td key={field.id + 'td-premium'}>
                    <Form.Control className='rounded-lg' size='sm'
                      type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`plans[${index1}].premium`}
                      ref={register()}
                      defaultValue={field?.premium || '0'}
                      placeholder='' />
                    {!!errors?.plans?.[index1]?.premium && <Error className='mb-0' top='0'>
                      {errors?.plans?.[index1]?.premium.message}
                    </Error>}
                  </td>
                )}
                {/* !is_update && */ fields?.length < 4 && <td></td>}
              </tr>
              <tr>
                <td>Tax ({tax_type === 1 ? '₹' : '%'})
                  <div className='d-flex flex-column justify-content-around flex-wrap' style={{ margin: '-20px 3px 5px 40px' }}>
                    <CustomControl className='d-flex mt-4 mr-0'>
                      <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Value(₹)'}</p>
                      <input name={'tax_type'} ref={register} type={'radio'} value={1} defaultChecked={true} />
                      <span></span>
                    </CustomControl>
                    <CustomControl className='d-flex mt-4 ml-0'>
                      <p style={{ fontWeight: '600', paddingLeft: '27px', marginBottom: '0px', width: 'inherit' }}>{'By Percentage(%)'}</p>
                      <input name={'tax_type'} ref={register} type={'radio'} value={2} defaultChecked={!true} />
                      <span></span>
                    </CustomControl>
                  </div>
                </td>
                <td>{''}</td>
                {fields.map((field, index1) =>
                  <td key={field.id + 'td-tax'}>
                    <Form.Control className='rounded-lg' size='sm'
                      type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`plans[${index1}].premium_tax`}
                      ref={register()}
                      defaultValue={field?.premium_tax || '0'}
                      onInput={(e) => { calculateTotalPremium(index1, e.target.value) }}
                      placeholder='' />
                    {!!errors?.plans?.[index1]?.premium_tax && <Error className='mb-0' top='0'>
                      {errors.plans?.[index1]?.premium_tax.message}
                    </Error>}
                  </td>
                )}
                {/* !is_update && */ fields?.length < 4 && <td></td>}
              </tr>

              <tr>
                <td>Premium with Tax (₹)</td>
                <td></td>
                {fields.map((field, index1) =>
                  <td key={field.id + 'td-total'}>
                    <Form.Control className='rounded-lg' size='sm'
                      type='tel'
                      maxLength={9}
                      onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
                      name={`plans[${index1}].total_premium`}
                      ref={register()}
                      defaultValue={field?.total_premium || '0'}
                      placeholder='' />
                    {!!errors?.plans?.[index1]?.total_premium && <Error className='mb-0' top='0'>
                      {errors?.plans?.[index1]?.total_premium.message}
                    </Error>}
                  </td>
                )}
                {/* !is_update && */ fields?.length < 4 && <td></td>}
              </tr>

            </tbody>
          </StyledTable>
          <Col
            sm="12"
            md="12"
            lg="12"
            xl="12"
            className="mt-4 mb-3 d-flex justify-content-end">
            <Button type='submit'>
              {is_update ? 'Update' : 'Submit'} <i className="fa fa-long-arrow-right" aria-hidden="true" />
            </Button>
          </Col>
        </form>
      </IconlessCard>
      {loading && <Loader />}
    </>
  )
}

const StyledTable = styled(Table)`
thead {
  tr {
    color: #ffffff;
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }
  th {
    min-width: 158px;
    .insurer-div {
      background: white;
      border-radius: 5px 3px 4px 5px;
      .form-control:focus {
          border-color: transparent;
          box-shadow: none;
      }
      .form-control {
        border: 0;
      }
    }
  }
  .add_button {
    min-width: auto;
  }
}
tbody{
  tr {
    background-color: #f6f6f6;
  }
}

`

const HeaderDiv = styled.div`
  display:flex;
  margin-top: -12px;
  margin-bottom: 15px;
  align-items: center;
  .icon {
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: -1px 10px 0 -30px;
    i{
      color: white;
      padding: 13px 16px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
    }
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};
    margin: 0;
    
  }
  .secondary-title {
    margin: 0;
    color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }

`

const Container = styled.div`
cursor:pointer;
position: relative;
display: flex;
flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
align-items: center;
justify-content: space-between;
padding: 10px;
width: ${({ width }) => width || '180px'};
height: auto;
text-align: center;
margin: ${({ margin }) => margin || '10px'};
border-radius: 15px;
background-color: ${({ bg_color }) => bg_color || '#ffffff'};
transition: all 0.3s ease 0s;
box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
@media (max-width: 768px) {
    margin: 0 auto 1rem;
    width: 100%;
}
`;

const ImgDiv = styled.div`
    height: ${({ size }) => size || '85px'};
    width: ${({ size }) => size || '85px'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: ${({ top }) => top || '-47px'};
    margin-bottom: ${({ marginBottom }) => marginBottom || '-25px'};
`

const MemberCountDiv = styled.div`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.8rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.8rem')};
text-align: start;
color: ${({ text_color }) => text_color || '#000000'};
`
const MemberTypeDiv = styled.div`
margin-top: 4px;
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.5rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.5rem')};
text-align: start;
`

const WidgetCard = ({ text_color, bg_color, imgSrc, value, memeberType, margin, history, id, userType }) => {
  return (
    <Container bg_color={bg_color} width='200px' flexDirection={'row'} margin={margin}
      onClick={() => history.push(`/${userType}/qcr/${randomString()}/${id}/${randomString()}/${3}`)}>
      <div>
        <MemberTypeDiv fontSize='1rem'>{memeberType || 'member type'}</MemberTypeDiv>
        <MemberCountDiv text_color={text_color} fontSize='1rem'>{value || ''}</MemberCountDiv>
      </div>
      <ImgDiv size="40px" top='0' marginBottom='0'>
        {/* <Img size="40px" src={imgSrc}></Img> */}
        <i className='fas fa-pencil-alt' />
      </ImgDiv>
    </Container >
  )
}


const Widget = [{
  bg_color: '#fff8ee',
  text_color: '#E38B10',
  imgSrc: "/assets/images/qcr/policy-expiry.png",
  key_name: 'policy_expiry',
  memeberType: "Policy Expiry",
  type: 'date'
},
{
  bg_color: '#ebefff',
  text_color: '#123BDC',
  imgSrc: "/assets/images/qcr/no-of-employees.png",
  key_name: 'no_of_employee',
  memeberType: "No. of Employees"
},
{
  bg_color: '#eefff6',
  text_color: '#11CC6C',
  imgSrc: "/assets/images/qcr/no-of-lives.png",
  key_name: 'no_of_lives_inception',
  memeberType: "No. of Lives"
},
{
  bg_color: '#ffeefb',
  text_color: '#812670',
  imgSrc: "/assets/images/qcr/sum-insured.png",
  key_name: 'existing_cover',
  memeberType: "Sum Insured"
}]
