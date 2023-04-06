import React, { useState, useEffect } from 'react'
import _ from 'lodash';

import { Input, TabWrapper, Tab, Head, Text } from 'components';
import {
  AdditionalCoverWrapper, Header, AddBenefits,
  InputWrapper, FormWrapper, BenefitList
} from './styles';
import { Row, Col, Button, Table, Modal } from 'react-bootstrap';
import Chip from 'components/chip/chip';
import { CreatePlan } from './create-plan';
import { Card } from '../../../RFQ/select-plan/style';
import { CardWrap, Content, Vline } from '../../../RFQ/plan-configuration/style';

import { Controller, useForm } from 'react-hook-form';
import swal from 'sweetalert';

const style = { zoom: '0.9' }
const cardStyle = { zoom: '0.8' }

export const CoverType = [
  { id: 1, value: 1, name: 'Including' },
  { id: 2, value: 2, name: 'Additional' },
  { id: 3, value: 3, name: 'No Cover' }
]

export const PremiumType = [
  { id: 1, value: 1, name: 'Discount' },
  { id: 2, value: 2, name: 'Loading' },
  { id: 3, value: 3, name: 'No Premium' }
]

const AdditionalCover = ({
  benefits, addBenefit, removeBenefit, setBenefits, savedConfig,
  flexi, tab, setTab, configs, planData, setPlanData, showForm, setShowForm }) => {

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { add_benefit: benefits.length ? true : false }
  });
  // const [showForm, setShowForm] = useState(false);


  const [planModal, setPlanModal] = useState(false);
  const [packageModal, setPackageModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);

  useEffect(() => {
    if (benefits.length || planData.length) {
      setShowForm(prev => true);
      reset({
        add_benefit: true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // useEffect(() => {
  //   if (tab === '2' && planData.length === 0) {
  //     setPlanData([{
  //       "features": [
  //         {
  //           "name": "Gym",
  //           "cover_by": "1",
  //           "cover": "5000",
  //           "cover_type": "1",
  //           "premium_by": "1",
  //           "premium": "6200",
  //           "premium_type": "2"
  //         }
  //       ],
  //       "benefit_description": "sshsbjh",
  //       "benefit_name": "Tester",
  //       "construct": [
  //         "1"
  //       ],
  //       "sum_insured": "500000"
  //     }])
  //     setPlanModal(true)
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab])

  const onChange = ([selected]) => {
    const target = selected.target;
    const checked = target && target.checked ? target.checked : false;
    setShowForm(prev => checked);
    if (!checked) setBenefits([]);
    return selected;
  };

  const onSubmit = (data, ev) => {
    if (data.name) {
      addBenefit(data);
      reset({
        name: '',
        deductiable: '',
      });
    }
  };

  const onRemovePlan = (id) => {
    let BillCopy = _.cloneDeep(planData);
    BillCopy.splice(id, 1);
    setPlanData(BillCopy)
  }

  const _renderForm = () => {
    if (showForm) {
      return (
        <>
          {!!(flexi) && <>
            <div style={style}>
              <TabWrapper width={'max-content'}>
                <Tab
                  isActive={Boolean(tab === "1")}
                  onClick={() => {
                    if (planData.length) {
                      swal({
                        title: "Warning",
                        text: `Will Delete Created ${tab === '2' ? 'Plans' : (tab === '3' ? 'Package' : 'Swap')}!`,
                        icon: "warning",
                        buttons: {
                          cancel: "No",
                          'yes': 'Yes'
                        },
                        dangerMode: true,
                      })
                        .then(function (caseValue) {
                          switch (caseValue) {
                            case "yes":
                              setTab("1");
                              setPlanData([])
                              break;
                            default:
                          }
                        })
                    } else {
                      setTab("1");
                    }
                  }}>
                  Single
                </Tab>

                <Tab
                  isActive={Boolean(tab === "2")}
                  onClick={() => {
                    if (tab !== '1' && planData.length) {
                      swal({
                        title: "Warning",
                        text: `Will Delete Created ${tab === '4' ? 'Swap' : 'Package'}!`,
                        icon: "warning",
                        buttons: {
                          cancel: "No",
                          'yes': 'Yes'
                        },
                        dangerMode: true,
                      })
                        .then(function (caseValue) {
                          switch (caseValue) {
                            case "yes":
                              setTab("2");
                              setPlanData([])
                              break;
                            default:
                          }
                        })
                    } else {
                      setTab("2");
                    }
                  }}>
                  Plan Wise
                </Tab>

                <Tab
                  isActive={Boolean(tab === "3")}
                  onClick={() => {
                    if (tab !== '1' && planData.length) {
                      swal({
                        title: "Warning",
                        text: `Will Delete Created ${tab === '4' ? 'Swap' : 'Plan'}!`,
                        icon: "warning",
                        buttons: {
                          cancel: "No",
                          'yes': 'Yes'
                        },
                        dangerMode: true,
                      })
                        .then(function (caseValue) {
                          switch (caseValue) {
                            case "yes":
                              setTab("3");
                              setPlanData([])
                              break;
                            default:
                          }
                        })
                    } else {
                      setTab("3");
                    }
                  }}>
                  Package Wise
                </Tab>
                <Tab
                  isActive={Boolean(tab === "4")}
                  onClick={() => {
                    if (tab !== '1' && planData.length) {
                      swal({
                        title: "Warning",
                        text: `Will Delete Created ${tab === '2' ? 'Plan' : 'Package'}!`,
                        icon: "warning",
                        buttons: {
                          cancel: "No",
                          'yes': 'Yes'
                        },
                        dangerMode: true,
                      })
                        .then(function (caseValue) {
                          switch (caseValue) {
                            case "yes":
                              setTab("4");
                              setPlanData([])
                              break;
                            default:
                          }
                        })
                    } else {
                      setTab("4");
                    }
                  }}>
                  Swap Wise
                </Tab>
              </TabWrapper>
            </div>
          </>}
          {tab === '1' &&
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormWrapper>
                <Row>
                  <Col xl={4} lg={5} md={6} sm={12}>
                    <Controller
                      as={<Input
                        label="Add Label"
                        placeholder="Add Label"
                      />}
                      name="name"
                      control={control}
                    />
                  </Col>
                  <Col xl={4} lg={5} md={6} sm={12}>
                    <Controller
                      as={<Input
                        label="Add Limit"
                        placeholder="Add Limit"
                        type="number"
                        min={0}
                      />}
                      name="deductiable"
                      control={control}
                    />
                  </Col>
                  <Col xl={4} lg={5} md={6} sm={12} className="d-flex align-items-center">
                    <Button type="submit">
                      <i className="ti ti-plus"></i> Add
                    </Button>
                  </Col>
                </Row>
              </FormWrapper>


              <Row>
                {
                  (benefits && benefits.length > 0)
                    ? <BenefitList>
                      {
                        benefits.map((benefit, index) =>
                          <Chip
                            id={benefit.name}
                            name={`${benefit.name} ${benefit.deductiable ? `- ${benefit.deductiable}` : ''}`}
                            onDelete={removeBenefit}
                            key={index + 'ben'}
                          />)
                      }
                    </BenefitList>
                    : null
                }
              </Row>
            </form>
          }
          {tab === '2' && <>
            <Button className='mb-3 ml-3' onClick={() => setPlanModal(true)}>
              Add Plan +
            </Button>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                i={index} setModal={setPlanModal}
                key={index + 'plan'}
                type='Plan'
                configs={configs} data={data} />)}
          </>}
          {tab === '3' && <>
            <Button className='mb-3 ml-3' onClick={() => setPackageModal(true)}>
              Add Packages +
            </Button>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                i={index} setModal={setPackageModal}
                key={index + 'package'}
                type='Package'
                configs={configs} data={data} />)}
          </>}
          {tab === '4' && <>
            <Button className='mb-3 ml-3' onClick={() => setSwapModal(true)}>
              Add Swap +
            </Button>

            {planData?.map((data, index) =>
              <ViewPlan onRemovePlan={onRemovePlan}
                i={index} setModal={setSwapModal}
                key={index + 'swap'}
                type='Swap'
                configs={configs} data={data} />)}
          </>}
          {!!planModal && <CreatePlan
            savedConfig={savedConfig}
            configs={configs}
            setPlanData={setPlanData}
            Data={planModal}
            type='Plan'
            show={!!planModal} onHide={() => setPlanModal(false)}
          />}
          {!!packageModal && <CreatePlan
            savedConfig={savedConfig}
            configs={configs}
            setPlanData={setPlanData}
            Data={packageModal}
            type='Package'
            show={!!packageModal} onHide={() => setPackageModal(false)}
          />}
          {!!swapModal && <CreatePlan
            savedConfig={savedConfig}
            configs={configs}
            setPlanData={setPlanData}
            Data={swapModal}
            type='Swap'
            show={!!swapModal} onHide={() => setSwapModal(false)}
          />}
        </>
      )
    }
    return null;
  };

  return (
    <AdditionalCoverWrapper>
      <Header>
        <h6>Additional Cover -</h6>
      </Header>

      <AddBenefits>
        <InputWrapper className="custom-control custom-checkbox">
          <Controller
            as={
              <input
                id="customCheck"
                className="custom-control-input"
                type="checkbox" />
            }
            name="add_benefit"
            control={control}
            onChange={onChange}
            defaultValue
          />

          <label className="custom-control-label" htmlFor="customCheck">Add Benefit</label>
        </InputWrapper>
        {_renderForm()}
      </AddBenefits>
    </AdditionalCoverWrapper>
  )
};

export default AdditionalCover

export const ViewPlan = ({ data, configs, setModal, i, onRemovePlan, type, view }) => {

  const [viewCapped, setViewCapped] = useState([]);
  const { benefit_description,
    benefit_name,
    min_enchance_si_limit = 0,
    construct,
    sum_insured, features } = data;

  const NotSwap = type !== 'Swap';

  return (<>
    <Col xl={12} lg={12} md={12} sm={12} className='pr-3 pb-3'>
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
              <Head>Sum Insured</Head>
              <Text>{sum_insured ?? "-"}</Text>
            </Col>
            <Col md={6} lg={3} xl={3} sm={12} >
              <Head>Family Construct</Head>
              <Text>{(view ? construct.map(({ relation_id }) => relation_id) : construct).reduce((result, member_id) => {
                return result = result + (result ? ', ' : '') + configs.relations?.find(({ id }) => Number(member_id) === id)?.name
              }, '') ?? "-"}</Text>
            </Col>
          </Row>}
          {!!min_enchance_si_limit && <Col md={6} lg={3} xl={3} sm={12} >
            <Head>Visible From SI Value</Head>
            <Text>{min_enchance_si_limit ?? "0"}</Text>
          </Col>}
          <Table style={cardStyle} striped={false} responsive>
            <tr>
              {features.some(({ name }) => name) && <th className='align-top'>{NotSwap ? 'Benefit ' : 'Swap Option '}Name</th>}
              {features.some(({ description }) => description) && <th className='align-top'>{NotSwap ? 'Benefit ' : 'Swap Option '}Description</th>}
              {features.some(({ cover }) => cover) && <th className='align-top'>Cover Value</th>}
              {features.some(({ cover }) => cover) && <th className='align-top'>Cover Type</th>}
              {features.some(({ premium }) => premium) && <th className='align-top'>Premium Value</th>}
              {features.some(({ premium }) => premium) && <th className='align-top'>Premium Type</th>}
              {features.some(({ min_enhance_si_limit }) => min_enhance_si_limit) && <th className='align-top'>Visible From SI Value</th>}
              {features.some(({ has_capping_data }) => has_capping_data) && <th className='align-top'>Capped Data</th>}
            </tr>

            {features?.map(({
              name, description, cover_by,
              cover, cover_type, premium_by,
              premium, premium_type, min_enhance_si_limit,
              has_capping_data, capping_data }, index) =>
              <tr key={index + 'sum-pre'}>
                {features.some(({ name }) => name) && <td>{name}</td>}
                {features.some(({ description }) => description) && <td>{description || '-'}</td>}
                {features.some(({ cover }) => cover) && <td>{(!!Number(cover) && `${cover} ${Number(cover_by) === 2 ? '%' : '₹'}`) || '-'}</td>}
                {features.some(({ cover }) => cover) && <td>{CoverType.find(({ id }) => id === Number(cover_type))?.name}</td>}
                {features.some(({ premium }) => premium) && <td>{(!!Number(premium) && `${premium} ${Number(premium_by) === 2 ? '%' : '₹'}`) || '-'}</td>}
                {features.some(({ premium }) => premium) && <td>{PremiumType.find(({ id }) => id === Number(premium_type))?.name}</td>}
                {features.some(({ min_enhance_si_limit }) => min_enhance_si_limit) && <td>{min_enhance_si_limit || 0}</td>}
                {features.some(({ has_capping_data }) => has_capping_data) && <td> {!!Number(has_capping_data) && <div className='icon_view'>
                  <i className="ti-eye text-primary" onClick={() => setViewCapped(capping_data)}></i>
                </div>}</td>}
              </tr>
            )}

          </Table>
        </CardWrap>

        {!!benefit_description && <Content>
          {benefit_description}
        </Content>}
      </Card>
    </Col>
    <ViewCapped
      show={!!viewCapped?.length}
      capping_data={viewCapped}
      onHide={() => setViewCapped([])}
    />
  </>)
}

export const ViewCapped = ({ show, onHide, capping_data = [] }) => {

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
    // dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>
            Capped Data
          </Head>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mr-5 ml-5">
        <Row className="d-flex justify-content-center flex-wrap">

          <Col md={12} lg={12} xl={12} sm={12}>
            <Table className='text-center rounded text-nowrap' style={{ border: 'solid 1px #e6e6e6' }}>
              <tr>
                <th style={style} className='align-top'>Sum Insured</th>
                <th style={style} className='align-top'>Single Parent Premium</th>
                <th style={style} className='align-top'>Double Parent Premium</th>
              </tr>
              {capping_data?.map(({ sum_insured, single_parent_premium, double_parent_premium }, index) => <tr key={index + '-capping_data'}>
                <td>₹{sum_insured}</td>
                <td>₹{single_parent_premium}</td>
                <td>₹{double_parent_premium}</td>
              </tr>)}

            </Table>
          </Col>
        </Row>
      </Modal.Body>
    </Modal >
  );
};
