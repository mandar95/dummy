import React, { useEffect, useState } from "react";
import {
  MultiToggleCard,
  RFQButton,
  Loader,
  MultiSelect,
  Card
} from "components";
import { Row, Col, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { BackBtn } from "../button";
import { useDispatch, useSelector } from "react-redux";
import { saveCompanyData, clear, set_company_data } from "../../home.slice";
import { sortRelationCustomer } from '../../../plan-configuration/helper'
import { refillRelationsCustomer } from "../../../plan-configuration/helper";
import { doesHasIdParam } from "../../home";

import { useMediaPredicate } from "react-media-hook";
import { _createOtherMemberData } from "./helper";


export const FamilyConstruct = ({ utm_source }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const smallerThan992 = useMediaPredicate("(max-width: 992px)");

  //enquiry id
  const query = new URLSearchParams(location.search);
  const id = decodeURIComponent(query.get("enquiry_id"));
  const brokerId = query.get("broker_id");
  const insurerId = query.get("insurer_id");
  const { globalTheme } = useSelector(state => state.theme)

  const {
    enquiry_id,
    loading,
    success,
    company_data,
    relationListData,
  } = useSelector((state) => state.RFQHome);

  const [coverType, setCoverType] = useState("individual");
  const [premiumType, setPremiumType] = useState("per_life");
  const [typeID, setTypeID] = useState([]);
  const [otherTypeID, setOtherTypeID] = useState([]);
  const [memberConfigData, setMemberConfigData] = useState([]);
  const [otherTypeFlag, setOtherTypeFlag] = useState([]);

  const { handleSubmit, register, setValue, watch, control } = useForm({
    defaultValues: {
      family_type: company_data?.family_type ? JSON.stringify(company_data?.family_type) : JSON.stringify([1]),
      other_family: JSON.stringify([0])
    }
  });


  let otherRelation = watch('relation_type');



  useEffect(() => {
    if (company_data?.family_type) {
      let options = _createOtherMemberData(company_data, relationListData)
      if (options.length > 0) { setValue('other_family', JSON.stringify([22])) }
      else { setValue('other_family', JSON.stringify([0])) }

      setValue('relation_type', options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company_data?.family_type, memberConfigData])

  useEffect(() => {
    if (otherRelation) {
      setOtherTypeID(otherRelation.map((e) => e.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherRelation])

  useEffect(() => {
    if (relationListData.length) {
      setMemberConfigData(relationListData.map((e) => e.relation_id))
    }
  }, [relationListData])

  useEffect(() => {
    if (otherTypeFlag.length && company_data?.family_type) {
      let options = _createOtherMemberData(company_data, relationListData)
      setValue('relation_type', options)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherTypeFlag, company_data?.family_type])


  let relationData = sortRelationCustomer(relationListData)


  useEffect(() => {
    if (company_data?.family_type) {
      setValue("family_type", JSON.stringify(company_data?.family_type));
    }

    if (company_data?.suminsured_type_id) {
      Number(company_data?.suminsured_type_id) === 1
        ? setCoverType("individual")
        : setCoverType("floater");
    }

    if (company_data?.premium_type && Number(company_data?.suminsured_type_id) === 2) {
      Number(company_data?.premium_type) === 1
        ? setPremiumType("per_life")
        : setPremiumType("per_family");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company_data]);

  // redirect if !id
  useEffect(() => {
    if (!id) {
      history.replace(`/company-details`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success && (enquiry_id || id)) {
      history.push(`/family-count?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`);
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, enquiry_id, id]);

  const other_relation = relationListData.filter(({ relation_id }) => relation_id > 8);
  const options = other_relation.map((item) =>
    ({ id: item?.relation_id, value: item?.relation_id, label: item?.relation_name, ...item }));


  const getTypeID = (data) => {
    let _data = data.filter((e) => ![4, 6, 8].map((item) => item).includes(e) && e <= 8)
    if (memberConfigData?.length > 0) {
      setTypeID(_data.filter((e) => memberConfigData.map((item) => item).includes(e)))
    }
    else {
      setTypeID(data)
    }
  }

  const setOtherType = (data) => {
    let _data = [];
    if (data.length > 1) {
      _data = data.filter((e) => e !== 0);
      setOtherTypeFlag(_data)
    }
    else {
      setOtherTypeFlag(data)
    }
  }

  const onSubmit = () => {
    let _membersID = [...typeID, ...((otherTypeFlag?.length > 0 && otherTypeID.length > 0) ? otherTypeID : [])]
    const relation_ids = [...new Set(refillRelationsCustomer(_membersID))]
    let request = {
      relation_type: relation_ids,
      suminsured_type_id:
        relation_ids.length > 1 ?
          coverType === "individual" ? 1 : 2 : 1,
      premium_type:
        (relation_ids.length > 1 && coverType === "floater") ?
          premiumType === "per_life" ? 1 : 2 : 1,
      step: 5,
      enquiry_id: id,
    };
    let newData = {
      family_type: relation_ids,
      relation_type: relation_ids,
      suminsured_type_id:
        relation_ids.length > 1 ?
          coverType === "individual" ? 1 : 2 : 1,
      premium_type:
        (relation_ids.length > 1 && coverType === "floater") ?
          premiumType === "per_life" ? 1 : 2 : 1
    };
    // alert(JSON.stringify(request));
    dispatch(saveCompanyData(request));
    dispatch(set_company_data(newData));

  };
  return (
    <>
      <Row className="m-0 d-flex h-100">
        <Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
          <BackBtn
            url={`/upload-data-demography?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}${utm_source ? `&utm_source=${utm_source}` : ''}`}
            style={{ outline: "none", border: "none", background: "none" }}
          >
            <img
              src="/assets/images/icon/Group-7347.png"
              alt="bck"
              height="45"
              width="45"
            />
          </BackBtn>
          <h1 style={{ fontWeight: "600", marginLeft: "10px", fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>
            Choose the type of family coverage
          </h1>
        </Col>
        <Form onSubmit={handleSubmit(onSubmit)} className='w-100' style={{ paddingLeft: "2.5%" }}>
          <Row className='m-0'>
            <div style={{ display: 'contents' }}>
              <MultiToggleCard
                onClick={getTypeID}
                data={relationData}
                contentStyle={{
                  fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                  fontWeight: "600",
                  color: "black",
                }}

                ContainerStyle={{ width: 'auto' }}
                inputName="family_type"
                inputRef={register}
                setVal={setValue}
                watch={watch}
                padding="10px"
              ></MultiToggleCard>
              {!relationListData.every(({ relation_id }) => relation_id <= 8) &&
                <MultiToggleCard
                  onClick={setOtherType}
                  data={[{
                    id: 22,
                    imgSrc: "/assets/images/icon/Group 6782@2x.png",
                    content: "Other Members",
                  }]}
                  contentStyle={{
                    fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                    fontWeight: "600",
                    color: "black",
                  }}
                  ContainerStyle={{ width: smallerThan992 ? '100%' : 'auto' }}
                  inputName="other_family"
                  inputRef={register}
                  setVal={setValue}
                  watch={watch}
                  padding="10px"
                ></MultiToggleCard>
              }
            </div>
          </Row>
          {/* {family_type * 1 === 4 && ( */}
          {otherTypeFlag?.length > 0 &&
            otherTypeFlag[0] !== 0 &&
            <Card title="Additional Details">
              <Row style={{ marginTop: "-10px" }}>
                {/* {family_type * 1 === 4 && ( */}
                <Col sm="12" md="12" lg="12" xl="12">
                  <label className="d-flex justify-content-center">Relations</label>
                  <Controller
                    as={
                      <MultiSelect
                        options={options}
                        placeholder={""}
                        // value={value}
                        name={"relation_type"}
                        ref={register}
                      />
                    }
                    name={"relation_type"}
                    control={control}
                  />
                </Col>
              </Row>
            </Card>
          }
          <Row className='m-0'>
            {(typeID.length > 1 || otherTypeID.length > 0) && (
              <>
                {/* <Col
                sm="12"
                md="12"
                lg="12"
                xl="12"
                className="d-flex justify-content-center"
              >
                <div className="my-3 w-100 px-4">
                  <h4 className="text-center">Cover Type</h4>
                  <div className="d-flex justify-content-center">
                    <RFQButton
                      className="m-2"
                      variant={coverType === "individual" ? "bulgy" : "bulgy_invert"}
                      onClick={() => setCoverType("individual")}
                      type="button"
                    >
                      Multi Individual
                    </RFQButton>
                    <RFQButton
                      className="m-2"
                      variant={coverType === "floater" ? "bulgy" : "bulgy_invert"}
                      onClick={() => setCoverType("floater")}
                      type="button"
                    >
                      Family Floater
                    </RFQButton>
                  </div>
                </div>
              </Col> */}
                {/* {(typeID.length > 1 || otherTypeID.length > 0) && */}
                <Col
                  sm="12"
                  md="12"
                  lg="5"
                  xl="5"
                  className="d-flex justify-content-center"
                >
                  <div className="my-3 w-100 px-4">
                    <h5 style={{ fontSize: globalTheme.fontSize ? `calc(1rem + ${globalTheme.fontSize - 92}%)` : '1rem' }} className="text-center">Cover Type</h5>
                    <div className="d-flex justify-content-center">
                      <RFQButton
                        width='140px'
                        height='45px'
                        fontSize='0.8rem'
                        className="m-2"
                        variant={coverType === "individual" ? "bulgy" : "bulgy_invert"}
                        onClick={() => setCoverType("individual")}
                        type="button"
                      >
                        Multi Individual
                      </RFQButton>
                      <RFQButton
                        width='140px'
                        height='45px'
                        fontSize='0.8rem'
                        className="m-2"
                        variant={coverType === "floater" ? "bulgy" : "bulgy_invert"}
                        onClick={() => setCoverType("floater")}
                        type="button"
                      >
                        Family Floater
                      </RFQButton>
                    </div>
                  </div>
                </Col>
                {/* } */}
                {
                  coverType === "floater" &&
                  <Col
                    sm="12"
                    md="12"
                    lg="5"
                    xl="5"
                    className="d-flex justify-content-center"
                  >
                    <div className="my-3 w-100 px-4">
                      <h5 style={{ fontSize: globalTheme.fontSize ? `calc(1rem + ${globalTheme.fontSize - 92}%)` : '1rem' }} className="text-center">Premium Type</h5>
                      <div className="d-flex justify-content-center">
                        <RFQButton
                          width='140px'
                          height='45px'
                          fontSize='0.8rem'
                          className="m-2"
                          variant={premiumType === "per_life" ? "bulgy1" : "bulgy_invert1"}
                          onClick={() => setPremiumType("per_life")}
                          type="button"
                        >
                          Per Life
                        </RFQButton>
                        <RFQButton
                          width='140px'
                          height='45px'
                          fontSize='0.8rem'
                          className="m-2"
                          variant={premiumType === "per_family" ? "bulgy1" : "bulgy_invert1"}
                          onClick={() => setPremiumType("per_family")}
                          type="button"
                        >
                          Per Family
                        </RFQButton>
                      </div>
                    </div>
                  </Col>
                }
              </>
            )
            }
            <Col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              className="mt-4 pt-4"
              style={{ margin: "20px 0", padding: "10px" }}
            >
              <RFQButton type="submit">
                Next
                <i className="fa fa-long-arrow-right" aria-hidden="true" />
              </RFQButton>
            </Col>
          </Row>
        </Form >
      </Row >
      {(loading || success) && <Loader />}
    </>
  );
};

