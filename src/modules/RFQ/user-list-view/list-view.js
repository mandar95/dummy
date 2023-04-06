import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Row, Col, Button, Form } from "react-bootstrap";
import _ from "lodash";
import swal from "sweetalert";
import * as yup from "yup";
import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Select, Error, Loader, Tab, TabWrapper, NoDataFound, Button as Btn } from "components";
import { clear, InsurerAll, userList, getBroker, loadRFQleadAssigne, updateICQuote } from "../rfq.slice";
// import { clear as Clear, PostQuote } from "modules/RFQ/home/home.slice";
import { DataTable } from "modules/user-management";
import {
  TableData,
  // customStatus,
  Lister,
  ListerFamily,
  // exclude,
  TableDataDef,
  TableDataDg,
  TableDataLeadAssigne,
  editDetails,
  calculatePremium
} from "./helper.js";
import { EditModal } from "./modal";
import { EditModal as DefModal } from "./def-modal";
import { EditModal as DefView } from "./def-view";
import { EditModal as ActiveHandle } from "./activeHandle-modal";
import { EditModal as DemographyModal } from "./demography-modal";
import { doesHasIdParam } from "../home/home";
import PlanFeature from './plan-feature';

import { getstatecity, getIndustry, getConfigData } from '../../RFQ/home/home.slice'
import { common_module } from 'config/validations';
const validation = common_module.user;

export const UserList = ({ myModule }) => {

  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const { currentUser, userType: userTypeName } = useSelector((state) => state.login);
  const { error, ins, userlist, access, success, loading, brkr, leadAssigne, ICQuotesuccess } = useSelector(
    (state) => state.rfq
  );
  const { statecity, industry_data } = useSelector((state) => state.RFQHome);

  const { userType } = useParams();
  const [show, setShow] = useState(false);
  const [activeHandleShow, setActiveHandleShow] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeHandleData, setActiveHandleData] = useState({});
  const [view, setView] = useState(false);
  const [viewDef, setViewDef] = useState(false);
  const [modal, setModal] = useState(false);
  const [trigger, setTrigger] = useState("insurer");
  let [edit, setEdit] = useState(false);
  let [featureEdit, setFeatureEdit] = useState(false);
  const [file, setFile] = useState();
  const [, setUpdate] = useState(0);
  const [demographyModal, setDemographyModal] = useState(false);
  const history = useHistory();

  /*----------validation schema----------*/
  const validationSchema = (view) => yup.object().shape({
    ...(userType === "admin" && {
      ic: yup.string().required("Please select insurer"),
    }),
    ...(!view && {
      flow: yup.string().required("Please select the work flow"),
    }),
    ...(view && {
      work_email: yup
        .string()
        .email("Please enter valid email id").required("Please enter email id"),
      company_name: yup
        .string()
        .max(50, "Company name should be below 50").required("Please enter company name"),
      pincode: yup
        .string()
        .min(6, "Pincode must consist 6 digits")
        .max(6, "Pincode must consist 6 digits").required("Please enter pincode"),
      city_id: yup.string().required("Please select city"),
      state_id: yup.string().required("Please select state"),
      // industry_type_id: yup.string().required("Please select industry"),
      contact_no: yup.string()
        .required('Mobile No. is required')
        .min(10, 'Mobile No. should be 10 digits')
        .max(10, 'Mobile No. should be 10 digits')
        .matches(validation.contact.regex, 'Not valid number'),
    }),
    ...((view && view.no_of_employees) && {
      no_of_employees: yup.string().required('No .of employee required'),
    }),
    // ...((view && view?.rfq_selected_plan?.final_premium) && {
    //   final_premium: yup.string().required('Final premium required'),
    // }),
    // ...((view && view?.rfq_selected_plan?.sum_insured) && {
    //   sum_insured: yup.string().required('Sum insured required'),
    // })
  });

  /*----x-----validation schema-----x----*/

  const { handleSubmit, control, watch, errors, setValue, register } = useForm({
    validationSchema: validationSchema(view)
  });
  const parent = watch("parent") || [];

  const IcId = watch("ic");
  const brokerId = watch("brokerId");
  const Pincode = watch("pincode") || "";

  const _renderActiveHandle = (cell) => {
    return (
      <Button disabled={currentUser?.ic_user_type_id === 1 ? false : true} size="sm" className="shadow m-1 rounded-lg" variant={cell?.value ? "success" : "secondary"} onClick={() => ActiveHandlefn(cell.row.original)}>
        {cell?.value || 'Assign to'}
      </Button>
    );
  }

  const ActiveHandlefn = (data) => {
    if (!_.isEmpty(data)) {
      setActiveHandleData(data);
      setActiveHandleShow(true);
    }
  }


  const EditList = (id, data) => {
    if (!_.isEmpty(data)) {
      setEditData(data);
      setShow(true);
    }
  };

  //deficiency modal set
  const EditMember = (id, data) => {
    setModal(data);
  };

  const viewFn = (data) => {
    setView(data);
  };

  const editDemography = (id, data) => {
    setDemographyModal(data)
  }

  const viewDefFn = (data) => {
    if (!_.isEmpty(data?.deficiency_documents)) {
      setViewDef(data?.deficiency_documents);
    } else {
      swal("Deficiency trail not available", "", "info");
    }
  };

  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        getConfigData(
          trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
        )
      );
    } else if (userType !== "admin") {
      dispatch(
        getConfigData(
          userType === "insurer"
            ? { ic_id: currentUser?.ic_id }
            : { broker_id: currentUser?.broker_id }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, currentUser])

  useEffect(() => {
    if (Pincode?.length === 6) {
      dispatch(getstatecity({ pincode: Pincode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Pincode]);

  useEffect(() => {
    if (!_.isEmpty(view) && _.isEmpty(statecity)) {
      dispatch(getstatecity({ pincode: view?.pincode }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (!_.isEmpty(view) && edit) {
      for (let i in view) {
        setValue(i, view[i]);
      }
      setValue('final_premium', view?.rfq_selected_plan?.final_premium)
      setValue('sum_insured', view?.rfq_selected_plan?.sum_insured)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, edit])

  useEffect(() => {
    if (!_.isEmpty(view)) {
      dispatch(loadRFQleadAssigne(view.id))
      dispatch(getIndustry());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  useEffect(() => {
    setValue("ic", "");
    setValue("brokerId", "");
    setShow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  //load insurers/brokers
  useEffect(() => {
    if (userType === "admin" && trigger === "insurer") {
      dispatch(InsurerAll({}, true));
    }
    if (userType === "admin" && trigger === "broker" && userTypeName) {
      dispatch(getBroker(userTypeName, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, trigger, userTypeName]);

  //Load data
  useEffect(() => {
    if (currentUser?.ic_id || IcId || currentUser?.broker_id || brokerId) {
      if (userType === "admin") {
        if (
          (trigger === "insurer" && IcId) ||
          (trigger === "broker" && brokerId)
        ) {
          dispatch(
            userList(
              trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
            )
          );
        }
      } else {
        if (userType !== "admin")
          dispatch(
            userList(
              userType === "insurer"
                ? { ic_id: currentUser?.ic_id }
                : { broker_id: currentUser?.broker_id }
            )
          );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.ic_id, IcId, currentUser?.broker_id, brokerId]);

  //onError
  useEffect(() => {
    if (error) {
      swal(error, "", "warning");
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  //onSuccess
  useEffect(() => {
    if (success) {
      swal(success, "", "success").then(() => {
        if (userType === "admin") {
          dispatch(
            userList(
              trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
            )
          );
        } else if (userType !== "admin") {
          dispatch(
            userList(
              userType === "insurer"
                ? { ic_id: currentUser?.ic_id }
                : { broker_id: currentUser?.broker_id }
            )
          );
        }
      });
      setModal(false);
      setView(false);
      setActiveHandleShow(false);
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (ICQuotesuccess) {
      swal(ICQuotesuccess, "", "success").then(() => {
        if (userType === "admin") {
          dispatch(
            userList(
              trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
            )
          );
        } else if (userType !== "admin") {
          dispatch(
            userList(
              userType === "insurer"
                ? { ic_id: currentUser?.ic_id }
                : { broker_id: currentUser?.broker_id }
            )
          );
        }
      });
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ICQuotesuccess])

  // useEffect(() => {
  //   if (postplan) {
  //     swal("Feature Updated Succesfully", "", "success").then(() => {
  //       if (userType === "admin") {
  //         dispatch(
  //           userList(
  //             trigger === "insurer" ? { ic_id: IcId } : { broker_id: brokerId }
  //           )
  //         );
  //       } else if (userType !== "admin") {
  //         dispatch(
  //           userList(
  //             userType === "insurer"
  //               ? { ic_id: currentUser?.ic_id }
  //               : { broker_id: currentUser?.broker_id }
  //           )
  //         );
  //       }
  //     });
  //   }
  //   return () => {
  //     dispatch(Clear(''));
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [postplan])

  useEffect(() => {
    if (!_.isEmpty(userlist) && !_.isEmpty(view)) {
      const _data = userlist.filter((item) => item.id === view.id)
      setView(_data[0]);
      setEdit(false);
      setFeatureEdit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userlist])

  /*-----demography-----*/
  let demographyData = view?.rfq_age_demography;
  /*--x--demography--x--*/
  let onClickHandlerEdit = () => {
    setEdit(!edit);
  };

  let onClickFeatureHandlerEdit = () => {
    setFeatureEdit(!featureEdit);
  }

  const Title = ({ _title, _method, _isEdit }) => (
    <Row>
      <Col sm={12} md={6}>
        {_title}
      </Col>
      {!!myModule?.canwrite && <Col sm={12} md={6} className="d-flex justify-content-end mt-3">
        <span id="edit-button" className="mr-3">
          <Button buttonStyle="outline" onClick={_method}>
            {_isEdit ? "Cancel" : "Edit"}
          </Button>
        </span>
      </Col>}
    </Row>
  );

  const selectStateData = () => {
    setView(false)
    setEdit(false)
    setFeatureEdit(false);
  }

  const onSubmitMethod = (data) => {
    const formdata = new FormData();
    for (let i in data) {
      if (i !== "parent") {
        formdata.append(i, data[i]);
      }
    }
    formdata.append("id", view.id);
    if (file) {
      formdata.append("employee_data", file);
    }
    dispatch(updateICQuote(formdata))
  };

  const updatePlanFeature = () => {
    let quotes = [view]
    let QuoteId = view.id
    const getIndexValue = [0]

    const selected_parent = _.compact(parent.map(({ id }) => Number(id)));
    const selected_child = _.compact(parent.map(({ child }) => Number(child)));

    //processing data
    const ParentIds = _.compact(
      _.compact(parent).map((item) => {
        if (selected_parent.includes(Number(item?.id))) {
          return item;
        } else {
          return null;
        }
      })
    )
      .map((item) => item?.parent_ids)
      .map((item) => item.split(","))
      .map((item) => item[_.without(getIndexValue, null)[0]]);

    const ChildIds = _.compact(
      _.compact(parent).map((item) => {
        if (selected_child.includes(Number(item?.child))) {
          return item;
        } else {
          return null;
        }
      })
    )
      .map((item) => item?.child_ids)
      .map((item) => item.split(","))
      .map((item) => item[_.without(getIndexValue, null)[0]]);

    // mandorty check
    const selectedQuotes = quotes.find(({ id }) => id === Number(QuoteId))
    const MandatoryProductFeatues = selectedQuotes.rfq_selected_plan.product_features.filter(({ is_mandantory }) => is_mandantory)
    const FilterProductFeature = MandatoryProductFeatues.filter(({ id }) => !ParentIds.some(selectedId => Number(selectedId) === id))
    if (FilterProductFeature.length > 0) {
      let msg = ''
      FilterProductFeature.forEach(({ product_feature_name }, index) =>
        msg = `${msg}
			${index + 1}. ${product_feature_name}`)
      swal('Mandatory Features For This Plan', msg, 'warning')
      return null;
    }

    const selectedQuoteMultiSum = quotes.find(({ id }) => id === Number(QuoteId))
    selectedQuoteMultiSum.rfq_selected_plan.product_features.forEach(({ id, product_type, product_detail }) => {
      const isPresent = ParentIds.some(parent_id => Number(parent_id) === id);
      if (isPresent) {
        const selectedProductDetail = product_detail.find(({ id: childId }) => {
          return ChildIds.some((child_id) => Number(child_id) === childId)
        })
        if ([1, 5].includes(product_type)) {
          selectedProductDetail && product_detail.forEach((elem) => {
            if (selectedProductDetail.sum_insured === elem.sum_insured) {
              ChildIds.push(String(elem.id))
            }
          })
        }
        if (product_type === 2) {
          selectedProductDetail && product_detail.forEach((elem) => {
            if (selectedProductDetail.duration_value === elem.duration_value &&
              selectedProductDetail.duration_unit === elem.duration_unit &&
              selectedProductDetail.duration_type === elem.duration_type &&
              selectedProductDetail.sum_insured === elem.sum_insured) {
              ChildIds.push(String(elem.id))
            }
          })
        }
        if (product_type === 3) {
          selectedProductDetail && product_detail.forEach((elem) => {
            if (selectedProductDetail.name === elem.name &&
              selectedProductDetail.sum_insured === elem.sum_insured) {
              ChildIds.push(String(elem.id))
            }
          })
        }
      }
    })

    let req = {
      // enquiry_id: view.enquiry_id,
      // ic_plan_id: view.rfq_selected_plan.selected_plan_id,
      plan_product_feature_ids: _.compact(ParentIds),
      plan_product_detail_ids: _.compact(ChildIds.filter(onlyUnique)),
      id: view.id,
      final_premium: PlanPremiums[0]
    };
    //dispatch(PostQuote(req));


    dispatch(updateICQuote(req))

  }


  //multiplying premium
  const PlanPremiums = useMemo(() => calculatePremium({ quotes: view?.rfq_selected_plan ? [view?.rfq_selected_plan] : [], parent, member_details: view?.rfq_age_demography || [] })
    , [view, parent]);
  //const _PremiumAmt = (Number(PlanPremiums) - Number(view?.rfq_selected_plan?.final_premium) || 0)
  return (
    <>
      {!view ? (
        <>
          {userType === "admin" && (
            <TabWrapper width={"max-content"}>
              <Tab
                isActive={trigger === "insurer"}
                onClick={() => setTrigger("insurer")}
              >
                Insurer
              </Tab>
              <Tab
                isActive={trigger === "broker"}
                onClick={() => setTrigger("broker")}
              >
                Broker
              </Tab>
            </TabWrapper>
          )}
          <Card title={<div className="d-flex justify-content-between">
            <span>Total Leads</span>
            {(currentUser.ic_user_type_id === 4 && !!myModule?.canwrite) &&
              <Btn type="button" onClick={() => {
                history.push(`/company-details?creating_user=${currentUser.id}${doesHasIdParam({ brokerId: currentUser?.broker_id, insurerId: currentUser?.ic_id })}`)
              }} buttonStyle="outline-secondary">
                + Create quote
              </Btn>}
          </div>}>
            <>
              <Row>
                {userType === "admin" && (
                  <>
                    {trigger === "insurer" ? (
                      <Col sm="12" md="12" lg="12" xl="12">
                        <Controller
                          as={
                            <Select
                              label={"Insurer"}
                              placeholder={"Select Insurer"}
                              options={
                                ins.map(({ id, name }) => ({
                                  id,
                                  name,
                                  value: id,
                                })) || []
                              }
                            />
                          }
                          control={control}
                          name={"ic"}
                        />
                        {!!errors?.ic && <Error>{errors?.ic?.message}</Error>}
                      </Col>
                    ) : (
                      <Col sm="12" md="12" lg="12" xl="12">
                        <Controller
                          as={
                            <Select
                              label={"Broker"}
                              placeholder={"Select Broker"}
                              options={
                                brkr.map(({ id, name }) => ({
                                  id,
                                  name,
                                  value: id,
                                })) || []
                              }
                            />
                          }
                          control={control}
                          name={"brokerId"}
                        />
                        {!!errors?.brokerId && (
                          <Error>{errors?.brokerId?.message}</Error>
                        )}
                      </Col>
                    )}
                  </>
                )}
              </Row>
              {!_.isEmpty(userlist) ? (
                <DataTable
                  columns={TableData(_renderActiveHandle, myModule) || []}
                  data={userlist}
                  noStatus={true}
                  pageState={{ pageIndex: 0, pageSize: 5 }}
                  pageSizeOptions={[5, 10]}
                  rowStyle
                  EditFlag={!!myModule?.canwrite}
                  // customStatus={customStatus}
                  EditFunc={EditList}
                  selectiveEdit
                  viewFn={viewFn}
                  viewFlag
                />
              ) : (
                <NoDataFound text='No Leads Found' />)}
            </>
          </Card>
        </>
      ) : (
        !_.isEmpty(view) ? (
          <>
            <Row className="w-100">
              <Col sm="12" md="12" lg="12" xl="12" className="w-100">
                <div className="py-2 mx-4 my-4 px-4">
                  <Button onClick={() => selectStateData()}>Back To List View</Button>
                </div>
              </Col>
            </Row>
            <Row className="d-flex flex-wrap-reverse w-100">
              <Col sm="12" md="12" lg="8" xl="8">
                <Card title={<Title _title={`Details`} _method={onClickHandlerEdit} _isEdit={edit} />} styles={{ marginRight: "0" }}>
                  {!_.isEmpty(view) ? (
                    !edit ? Lister(view, undefined, demographyData)
                      :
                      <Form onSubmit={handleSubmit(onSubmitMethod)}>
                        {editDetails(Controller, { control, errors, register }, { statecity, industry_data, view, setFile })}
                        <Row>
                          <Col md={12} className="d-flex justify-content-end mt-4">
                            <Button type="submit">
                              Save
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                  )
                    : (<noscript />)}
                </Card>
                {false && !_.isEmpty(view?.rfq_selected_plan?.product_features) && (
                  <Card title={<Title _title={`Plan Features`} _method={onClickFeatureHandlerEdit} _isEdit={featureEdit} />} styles={{ marginRight: "0" }}>
                    <Row style={{
                      marginTop: '-10px',
                      marginBottom: '20px'
                    }}>
                      <PremiumBtn style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', letterSpacing: "2px" }}>
                        Premium : {`₹ ${Number(PlanPremiums)}`}
                      </PremiumBtn>
                    </Row>
                    <Row xs={1} sm={2} md={2} lg={2} xl={2}>
                      <div className="p-2">
                        <PlanFeature
                          filterData={[view?.rfq_selected_plan]}
                          parent={parent}
                          register={register}
                          setUpdate={setUpdate}
                          totalPre={PlanPremiums}
                          featureEdit={featureEdit}
                        />
                      </div>
                    </Row>
                    {featureEdit &&
                      <Row>
                        <Col md={12} className="d-flex justify-content-end mt-4">
                          <Button type="submit" onClick={updatePlanFeature}>
                            Save
                          </Button>
                        </Col>
                      </Row>
                    }
                  </Card>
                )}
                {!_.isEmpty(view?.rfq_leads_family_construct) && (
                  <Card title="Relation" styles={{ marginRight: "0" }}>
                    {ListerFamily(view?.rfq_leads_family_construct || {})}
                  </Card>
                )}
                {!_.isEmpty(view?.general_family_construct) && (
                  <Card title="Relation" styles={{ marginRight: "0" }}>
                    {ListerFamily(view?.general_family_construct || {}, true)}
                  </Card>
                )}
                {!_.isEmpty(view?.general_rfq_rates) && (
                  <Card
                    title="RFQ Rate Details"
                    styles={{ marginRight: "0" }}
                  >
                    {view?.general_rfq_rates?.map((_, index) =>
                      Lister(view?.general_rfq_rates[index] || {}, index)
                    )}
                  </Card>
                )}
                {!_.isEmpty(demographyData) && (
                  <Card title="Demography" styles={{ marginRight: "0" }}>
                    <DataTable
                      columns={TableDataDg || []}
                      data={demographyData || []}
                      noStatus={true}
                      pageState={{ pageIndex: 0, pageSize: 5 }}
                      pageSizeOptions={[5, 10]}
                      rowStyle
                      EditFlag
                      EditFunc={editDemography}
                    />
                  </Card>
                )}
                {!!view?.rfq_deficiency && (
                  <Card
                    title={
                      <div
                        className="d-flex justify-content-between"
                        styles={{ marginRight: "0" }}
                      >
                        <span>Deficiency Details</span>
                        <Button
                          type="button"
                          onClick={() => {
                            setModal({
                              enquiry_id: view?.enquiry_id,
                              rfq_leads_id: view?.id,
                            });
                          }}
                          buttonStyle="outline-secondary"
                        >
                          + Add
                        </Button>
                      </div>
                    }
                  >
                    <DataTable
                      columns={TableDataDef || []}
                      data={view?.rfq_deficiency || []}
                      noStatus={true}
                      pageState={{ pageIndex: 0, pageSize: 5 }}
                      pageSizeOptions={[5, 10]}
                      rowStyle
                      EditFlag
                      // deficiencyStatus
                      EditFunc={EditMember}
                      viewFn={viewDefFn}
                      viewFlag
                    />
                  </Card>
                )}
                {!_.isEmpty(leadAssigne) && (
                  <Card title="Lead Assignee" styles={{ marginRight: "0" }}>
                    <DataTable
                      columns={TableDataLeadAssigne || []}
                      data={leadAssigne || []}
                      noStatus={true}
                      pageState={{ pageIndex: 0, pageSize: 5 }}
                      pageSizeOptions={[5, 10]}
                      rowStyle
                    />
                  </Card>
                )}
              </Col>
            </Row>
          </>
        ) : (<Loader />)
      )}
      <EditModal
        show={show}
        onHide={() => setShow(false)}
        data={editData}
        ic={currentUser?.ic_id || IcId}
        brokerId={currentUser?.broker_id || brokerId}
        userType={userType}
        trigger={trigger}
        access={access}
      />
      <DefModal
        show={modal}
        onHide={() => setModal(false)}
        Data={modal || []}
        ic={currentUser?.ic_id || IcId}
        brokerId={currentUser?.broker_id || brokerId}
      />
      <DefView
        show={viewDef}
        onHide={() => setViewDef(false)}
        Data={viewDef || []}
      />
      <ActiveHandle
        show={activeHandleShow}
        onHide={() => setActiveHandleShow(false)}
        Data={activeHandleData}
        ic={currentUser?.ic_id || IcId}
        brokerId={currentUser?.broker_id || brokerId}
      />
      <DemographyModal
        show={demographyModal}
        onHide={() => setDemographyModal(false)}
        Data={demographyModal || []}
        qouteData={view}
      // ic={currentUser?.ic_id || IcId}
      // brokerId={currentUser?.broker_id || brokerId}
      />
      {loading && <Loader />}
    </>
  );
};

const PremiumBtn = styled.span`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    letter-spacing: 2px;
    background: #1bf29e;
    border-radius: 10px;
    padding: 3px 10px;
    box-shadow: 1px 2px 4px 2px #f2f2f2;
    border: 1px solid #d8d8d8;
    color: white;
    
`;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
