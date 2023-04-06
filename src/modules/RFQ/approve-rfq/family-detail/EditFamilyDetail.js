import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import swal from 'sweetalert';

import { Button, Input } from "components";
import { Row, Col, Table, Form } from 'react-bootstrap';
// import Select from "../../../user-management/Onboard/Select/Select";
import { OptionInput } from 'modules/policies/approve-policy/style';

import { useForm, Controller } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { updateRfq } from '../../rfq.slice';
import { sortRelation, refillRelations, getChildAge } from 'modules/RFQ/plan-configuration/helper';

export const EditFamilyDetail = ({ rfqData, style, options, ic_plan_id, ic_id, broker_id }) => {
  const filteredRelation = sortRelation(options.relations)
  //let _memberCount = rfqData?.relations?.map((elem) => filteredRelation.find(({ id }) => Number(id) === Number(elem.relation_id))).filter(Boolean)
  let _memberCount = filteredRelation?.map((elem) => rfqData?.relations.find(({ relation_id }) => Number(relation_id) === Number(elem.id))).filter(Boolean)

  const dispatch = useDispatch();
  // const [ageLimit, setAgeLimit] = useState(rfqData.relations?.map((value) => (!value.max_age)));
  // const [membersCount, setMembersCount] = useState(rfqData.relations?.length || 1);
  // const [memberRelation, setMemberRelation] = useState(rfqData?.relations?.map((elem) => String(elem.relation_id)) || []);
  const [ageLimit, setAgeLimit] = useState(_memberCount?.map((value) => (!value.max_age)));
  const [membersCount, setMembersCount] = useState(_memberCount.length || 1);
  const [memberRelation, setMemberRelation] = useState(_memberCount?.map((elem) => String(elem.relation_id)) || []);

  const { control, handleSubmit } = useForm({
    defaultValues: rfqData
  });


  useEffect(() => {

    if (membersCount) {
      let tempData = [...memberRelation];
      tempData.length = membersCount
      for (let i = 0; i < membersCount; i++) {
        if (!tempData[i] && _memberCount[i]?.relation_id) {
          tempData[i] = String(_memberCount[i]?.relation_id)
        }
      }
      setMemberRelation(tempData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersCount])



  // const handleConstructChange = ([e]) => {
  //   if (Number(e.target.value) > 15) {
  //     swal("Validation", "Member Limit 15", "info");
  //     return membersCount;
  //   }
  //   setMembersCount(Number(e.target.value) > 0 ? Number(e.target.value) : '0')
  //   return e;
  // };

  const ageLimitFilter = (value, index) => {
    let newSet = _.cloneDeep(ageLimit);
    newSet[index] = value;
    setAgeLimit(newSet)
  }


  const addCount = () => {
    if (membersCount >= 15) {
      swal('Limit', 'Maximum 15 Relation Count Allowed', 'warning')
      return null
    }
    setMembersCount(prev => prev ? prev + 1 : 1);
  }

  const subCount = () => {
    setMembersCount(prev => prev === 1 ? 1 : prev - 1);
  }
  const onSubmit = (data) => {

    const { min_age, max_age, relation, no_of_relation } = data;
    const ages = relation?.map((val, index) => {

      return {
        ...(!ageLimit[index]) && {
          min_age: min_age[index],
          max_age: max_age[index]
        },
        relation_id: index === 0 ? 1 : val,
        no_of_relation: no_of_relation[index]
      }
    }) || []
    const _ages = refillRelations(ages).filter(Boolean)
    dispatch(updateRfq({
      relations: _ages,
      step: 5,
      ic_plan_id,
    }, { ic_plan_id, ic_id, broker_id }))

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Table className="text-center" style={style.Table} responsive>
        <thead >
          <tr style={style.HeadRow}>
            <th style={style.TableHead} scope="col">Family Relation </th>
            <th style={style.TableHead} scope="col">Min Age</th>
            <th style={style.TableHead} scope="col">Max Age</th>
            <th style={style.TableHead} scope="col">Age Limit</th>
            <th style={style.TableHead} scope="col">No Of Relation</th>
          </tr>
        </thead>
        <tbody>
          {([...Array(Number(membersCount))])?.map((_, index) => {
            let getName = filteredRelation.find(({ id }) => Number(id) === Number(memberRelation[index]))
            return <tr key={index + 'family-detail'}>
              {index === 0 && Number(memberRelation[0]) === 1 ? <td>
                <Controller
                  as={
                    <Form.Control className="rounded-lg" size="sm" required
                      placeholder="Relation" disabled
                      style={{ background: 'linear-gradient(#ffffff, #dadada)' }} />}
                  name={`relation.${index}`}
                  control={control}
                  defaultValue={rfqData?.relations[index]?.relation || "Self"}
                />
              </td> :
                <td>
                  <Controller
                    as={
                      <Form.Control as='select' className="rounded-lg" size="sm" required>
                        {/* {options.familyLabels.map((elem) =>
                            <option value={elem.id}>{elem.name}</option>
                          )} */}
                        <option value=''>Select Relation</option>
                        {/* {options.familyLabels */}
                        {filteredRelation
                          .filter((elem) => (!memberRelation.includes(String(elem.id)) || elem.id === Number(memberRelation[index])))
                          .map((elem) => (<option key={elem.id + elem.name} value={elem.id}>{elem.name}</option>))}
                      </Form.Control>}
                    name={`relation.${index}`}
                    control={control}
                    onChange={([e]) => {
                      const value = e.target.value
                      setMemberRelation(prev => {
                        prev[index] = value;
                        return [...prev];
                      })
                      return e
                    }}
                    defaultValue={_memberCount[index]?.relation_id}
                  />
                </td>}
              <td>
                {!ageLimit[index] ?
                  <Controller
                    as={
                      <Form.Control className="rounded-lg" size="sm" required
                        placeholder="Min Age"
                        min={
                          (memberRelation.includes('3') ||
                            memberRelation.includes('4')) ?
                            '0' : '18'}
                        max="150" type="number"
                      />}
                    name={`min_age.${index}`}
                    control={control}
                    defaultValue={String(_memberCount[index]?.min_age) || ""}
                  />
                  :
                  <Form.Control className="rounded-lg" size="sm"
                    value="0" disabled
                  />}
              </td>
              <td>
                {!ageLimit[index] ?
                  <Controller
                    as={
                      <Form.Control className="rounded-lg" size="sm" required
                        placeholder="Max Age"
                        min={
                          (memberRelation.includes('3') ||
                            memberRelation.includes('4')) ?
                            '0' : '18'}
                        max="150" type="number"
                      />}
                    name={`max_age.${index}`}
                    control={control}
                    defaultValue={String(_memberCount[index]?.max_age) || ""}
                  />
                  :
                  <Form.Control className="rounded-lg" size="sm"
                    value="0" disabled
                  />
                }
              </td>
              <td>
                <Controller
                  as={<OptionInput className="d-flex justify-content-center">
                    <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"No Age Limit"}</p>
                    <input name={'age_limit'} type={'checkbox'} defaultChecked={ageLimit[index]} />
                    <span></span>
                  </OptionInput>}
                  onChange={([e]) => { ageLimitFilter(e.target.checked, index); return e.target.checked }}
                  name={'age_limit'}
                  control={control}
                />
              </td>
              <td>
                {(getName?.id === 2 || getName?.id === 3) ?
                  <Controller
                    as={
                      <Input
                        label="No. of Relation"
                        placeholder="Enter no of relation"
                        min={1}
                        max={4}
                        type="number"
                        required={false}
                        isRequired={true}
                      />
                    }
                    defaultValue={
                      _memberCount[index]?.relation_id === 3 ? getChildAge(rfqData) : _memberCount[index]?.no_of_relation || 1
                    }
                    rules={{ required: true, min: 1, max: 4 }}
                    name={`no_of_relation.${index}`}
                    control={control}
                  /> :
                  <Controller
                    as={
                      <Input
                        label="No. of Relation"
                        placeholder="Enter no of relation"
                        disabled
                      />
                    }
                    defaultValue={1}
                    name={`no_of_relation.${index}`}
                    control={control}
                  />
                }

              </td>

            </tr>
          })}
        </tbody>
      </Table>

      <Row className='mt-3'>
        <Col className="d-flex justify-content-end align-items-center">
          <Button buttonStyle="warning" type='button' onClick={addCount}>
            <i className="ti ti-plus"></i> Add{'\u00A0'}
          </Button>
          {membersCount !== 1 &&
            <Button buttonStyle="danger" type='button' onClick={subCount}>
              <i className="ti ti-minus"></i> Remove
            </Button>
          }
        </Col>
      </Row>

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="submit">
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

// const f = (ages) => {


//   let d = ages.map((item) => {
//     if (item.relation_id === 3 || item.relation_id === 2) {
//       return { ...item,no_of_relation item.no_of_relation}
//     }
//     else {
//       return item
//     }
//   })



//   let _noOfRelation = ages.filter((item) => item.relation_id === 3 || item.relation_id === 2)[0].no_of_relation
//   // let divider = _noOfRelation % 2
//   let divider1 = _noOfRelation / 2
//   let divider2 = Math.floor(_noOfRelation / 2)
//   let finaldivider = divider1 > divider2 ?


// }
