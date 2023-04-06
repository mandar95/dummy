import {
  Button,
  CardBlue,
  Error,
  Loader,
  SelectComponent,
  // Tab,
  // TabWrapper,
} from "components";
import {
  loadPolicyTypes,
  loadPolicies,
  loadEmployers,
  loadBroker,
  loadBrokerEmployer,
  initialState,
  reducer,
  loadApiType,
  loadTpa,
  loadTpaJobData,
  submitTpa,
} from "modules/Reports/Report.action";
import DataTable from "modules/user-management/DataTable/DataTable";
import React, { useEffect, useReducer, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { DivButton } from "./style";
import { validationSchema } from "./validation";
import swal from 'sweetalert';
import { sortTypeWithTime } from "../../components";
import { CellViewTemplate } from "../offline-tpa/tpalog/CommonFunctions";
// import ModalComponent from "./ModalComponent";
import ModalComponent from "modules/offline-tpa/tpalog/ViewModal.js";
import { DateFormate } from "../../utils";
import { differenceInMinutes } from "date-fns";
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";

const TPAApiTrigger = () => {
  const [
    {
      lastpage,
      firstpage,
      brokers,
      employers,
      allTpa,
      allTpaJobData,
      apiType,
      policy_subtypes,
      policies,
      loading,
      submittedData
    },
    dispatch,
  ] = useReducer(reducer, initialState);


  const [tab/* , setTab */] = useState("Policy Type");
  const [viewModal, setViewModal] = useState(false);

  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(
    (state) => state.login
  );

  const { handleSubmit, control, setValue, watch, errors } = useForm({
    validationSchema: validationSchema(userType, tab),
  });
  const getSubPolicy_id = watch("policy_sub_type_id")?.value; // Api
  const getEmployer_id = watch("employer_id")?.value; // Api
  const policy_id = watch("policy_id")?.value; // Api
  const tpa_id = watch("tpa_id")?.value; // Api

  // const from_date = watch('from_date') || '';
  // const to_date = watch('to_date') || '';

  //api call for broker data -----
  useEffect(() => {
    if (userType === "admin" && userTypeName) {
      loadBroker(dispatch, userTypeName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);
  //---------------


  useEffect(() => {
    if (submittedData.status) {
      swal('Success', "Added Successfully", 'success');
    } else if (submittedData.message) {
      swal('Alert', submittedData.message || "", 'warning');
    }
  }, [submittedData])

  useEffect(() => {
    loadTpaJobData(dispatch)
  }, [])

  useEffect(() => {
    if (
      lastpage >= firstpage &&
      currentUser?.broker_id &&
      userType === "broker"
    ) {
      var _TimeOut = setTimeout(_callback, 250);
    }
    function _callback() {
      loadEmployers(dispatch, { broker_id: currentUser?.broker_id }, firstpage);
    }
    return () => {
      clearTimeout(_TimeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstpage, currentUser]);

  const onSubmitDetails = (data) => {
    if (tab === "Policy Type" && policy_id && data?.api_type?.value) {
      const previousData = allTpaJobData.findLast(({ policy_id: policyId, method_name }) => +policyId === +policy_id && method_name === data?.api_type?.value)
      if (previousData && differenceInMinutes(new Date(), new Date(DateFormate(previousData.ran_at, { type: 'withTime' }))) < 2) {
        swal('Recently Hit', 'The gap between two Trigger of same API Type & Policy Name should be atleast 2 min', 'info')
        return
      }

      submitTpa(dispatch, {
        policy_id,
        method_name: data?.api_type?.value,
      });
    } else if (tab === "TPA Type") {
      submitTpa(dispatch, {
        tpa_id,
        method_name: data?.api_type?.value,
      });
    }
    resetData();
  };

  const resetData = () => {
    setValue([
      { policy_sub_type_id: undefined },
      { broker_id: undefined },
      { tpa_id: undefined },
      { employer_id: undefined },
      { policy_id: undefined },
      { api_type: undefined },
    ])
  }

  useEffect(() => {
    if (getEmployer_id /* || currentUser?.employer_id */) {
      let data = {
        employer_id: getEmployer_id /* || currentUser?.employer_id */,
      };

      loadPolicyTypes(dispatch, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEmployer_id, currentUser]);

  useEffect(() => {
    if (getEmployer_id && getSubPolicy_id && policy_id) {
      let data = {
        policy_id,
      };
      loadApiType(dispatch, data);
    } else if (tpa_id) {
      loadApiType(dispatch, { tpa_id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id, tpa_id]);

  useEffect(() => {
    loadTpa(dispatch);
  }, []);

  useEffect(() => {
    if (getEmployer_id /* || currentUser?.employer_id */ && getSubPolicy_id) {
      let data = {
        ...(currentUser?.broker_id && { broker_id: currentUser?.broker_id }),
        employer_id: getEmployer_id /* || currentUser?.employer_id */,
        policy_sub_type_id: getSubPolicy_id,
        user_type_name: userTypeName,
      };
      loadPolicies(dispatch, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSubPolicy_id, policy_subtypes]);

  const getAdminEmployer = ([e]) => {
    if (e?.value) {
      loadBrokerEmployer(dispatch, e.value);
      setValue([
        { employer_id: undefined },
        { policy_sub_type_id: undefined },
        { policy_id: undefined },
      ]);
    }
    return e;
  };

  return (
    <>
      {/* <TabWrapper width="max-content">
        <Tab
          isActive={Boolean(tab === "Policy Type")}
          onClick={() => setTab("Policy Type")}
          className="d-block"
        >
          Policy Type
        </Tab>
        <Tab
          isActive={Boolean(tab === "TPA Type")}
          onClick={() => setTab("TPA Type")}
          className="d-block"
        >
          TPA Type
        </Tab>
      </TabWrapper> */}

      {/* --------------check policy type for decide render------------- */}
      {tab === "Policy Type" && (
        <CardBlue title="TPA API Trigger" round>
          <form onSubmit={handleSubmit(onSubmitDetails)}>
            <Row>
              {userType === "admin" && (
                <Col xs={12} sm={12} md={6} lg={4} xl={3}>
                  <Controller
                    as={
                      <SelectComponent
                        label="Broker"
                        placeholder="Select Broker"
                        options={brokers.map((item) => ({
                          id: item?.id,
                          label: item?.name,
                          value: item?.id,
                        }))}
                        id="id"
                        isRequired
                      />
                    }
                    onChange={getAdminEmployer}
                    name="broker_id"
                    error={errors && errors?.broker_id?.id}
                    control={control}
                  />
                  {!!errors?.broker_id?.id && (
                    <Error>{errors?.broker_id?.id?.message}</Error>
                  )}
                </Col>
              )}
              {(userType === "broker" || userType === "admin") && (
                <Col xs={12} sm={12} md={6} lg={4} xl={3}>
                  <Controller
                    as={
                      <SelectComponent
                        label="Employer"
                        placeholder="Select Employer"
                        options={
                          employers?.map((item) => ({
                            id: item?.id,
                            label: item?.name || item?.company_name,
                            value: item?.id,
                          })) || []
                        }
                        isRequired
                      />
                    }
                    onChange={([selected]) => {
                      setValue([
                        { policy_sub_type_id: undefined },
                        { policy_id: undefined },
                        { api_type: undefined },
                      ]);
                      return selected;
                    }}
                    name="employer_id"
                    error={errors && errors?.employer_id?.id}
                    control={control}
                  />
                  {!!errors?.employer_id?.id && (
                    <Error>{errors?.employer_id?.id?.message}</Error>
                  )}
                </Col>
              )}

              {/* {!!(currentUser.is_super_hr && currentUser.child_entities.length) && (
						<Col xs={12} sm={12} md={6} lg={4} xl={3}>
							<Controller
								as={
									<SelectComponent
										label="Employer"
										placeholder="Select Employer"
										options={currentUser.child_entities.map(item => (
											{
												id: item.id,
												label: item.name,
												value: item.id
											}
										)) || []}
										isRequired
									/>
								}
								defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
								name="employer_id"
								onChange={([selected]) => {
									setValue([
										{ policy_sub_type_id: undefined },
										{ policy_id: undefined },
										{ to_date: undefined },
										{ from_date: undefined },
									])
									return selected;
								}}
								error={errors && errors?.employer_id?.id}
								control={control}
							/>
							{!!errors?.employer_id?.id && <Error>{errors?.employer_id?.id?.message}</Error>}
						</Col>
					)} */}
              <Col xs={12} sm={12} md={6} lg={4} xl={3}>
                <Controller
                  as={
                    <SelectComponent
                      label="Policy Type"
                      placeholder="Select Policy"
                      options={
                        policy_subtypes?.map((item) => ({
                          id: item?.id,
                          label: item?.name,
                          value: item?.id,
                        })) || []
                      }
                      isRequired
                    />
                  }
                  onChange={([selected]) => {
                    setValue([
                      { policy_id: undefined },
                      { api_type: undefined },
                    ]);
                    return selected;
                  }}
                  name="policy_sub_type_id"
                  error={errors && errors?.policy_sub_type_id?.id}
                  control={control}
                />
                {!!errors?.policy_sub_type_id?.id && (
                  <Error>{errors?.policy_sub_type_id?.id?.message}</Error>
                )}
              </Col>

              <Col xs={12} sm={12} md={6} lg={4} xl={3}>
                <Controller
                  as={
                    <SelectComponent
                      label="Policy Name"
                      placeholder="Policy Name"
                      options={
                        policies?.map((item) => ({
                          id: item?.id,
                          label: item?.number,
                          value: item?.id,
                        })) || []
                      }
                      isRequired
                    />
                  }
                  onChange={([selected]) => {
                    setValue([{ api_type: undefined }]);
                    return selected;
                  }}
                  name="policy_id"
                  error={errors && errors?.policy_id?.id}
                  control={control}
                />
                {!!errors?.policy_id?.id && (
                  <Error>{errors?.policy_id?.id?.message}</Error>
                )}
              </Col>

              <Col md={6} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="API Type"
                      placeholder="Select API Type"
                      options={
                        apiType?.map((item) => ({
                          id: item,
                          label: item,
                          value: item,
                        })) || []
                      }
                      id="api_type"
                      required={false}
                      isRequired
                    />
                  }
                  name="api_type"
                  error={errors && errors?.api_type?.id}
                  control={control}
                />
                {!!errors.api_type?.id && (
                  <Error>{errors.api_type?.id.message}</Error>
                )}
              </Col>

              {/* <Col md={12} lg={4} xl={3} sm={12}>
            <Controller
              as={
                <DatePicker
                  name={"from_date"}
                  label={"Start Date"}
                  required={false}
                  isRequired
                />
              }
              onChange={([selected]) => {
                setValue("to_date", undefined);
                return selected ? format(selected, "dd-MM-yyyy") : "";
              }}
              name="from_date"
              control={control}
              error={errors && errors.from_date}
            />
            {!!errors.from_date && <Error>{errors.from_date.message}</Error>}
          </Col>
          <Col md={12} lg={4} xl={3} sm={12}>
            <Controller
              as={
                <DatePicker
                  minDate={
                    new Date(
                      DateFormate(from_date || "01-01-1900", {
                        dateFormate: true,
                      })
                    )
                  }
                  // maxDate={addDays(new Date(DateFormate(from_date || '01-01-2200', { dateFormate: true })), 6)}
                  maxDate={new Date()}
                  name={"to_date"}
                  label={"End Date"}
                  required={false}
                  isRequired
                />
              }
              onChange={([selected]) => {
                return selected ? format(selected, "dd-MM-yyyy") : "";
              }}
              name="to_date"
              control={control}
              error={errors && errors.to_date}
            />
            {!!errors.to_date && <Error>{errors.to_date.message}</Error>}
          </Col>

          <Col md={12} lg={4} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  placeholder={"Type Start Index"}
                  label={"Start Index"}
                  type={"number"}
                />
              }
              name="start_index"
              error={errors && errors.start_index}
              control={control}
            />
            {!!errors.start_index && <Error>{errors.start_index.message}</Error>}
          </Col>

          <Col md={12} lg={4} xl={3} sm={12}>
            <Controller
              as={
                <Input
                  placeholder={"Type End Index"}
                  label={"End Index"}
                  type={"number"}
                />
              }
              name="end_index"
              error={errors && errors.end_index}
              control={control}
            />
            {!!errors.end_index && <Error>{errors.end_index.message}</Error>}
          </Col> */}
            </Row>

            <DivButton>
              <Button type="submit">
                <span style={{ marginLeft: "-5px", marginRight: "-2px" }}>
                  Submit
                </span>
              </Button>
            </DivButton>
            <Row className="d-flex flex-wrap mt-3">
              <Col md={12} lg={12} xl={6} sm={12}>
                <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
                  <Title fontSize="0.95rem" color='#70a0ff'>
                    Note: The gap between two Trigger of same API Type & Policy Name should be atleast 2 min.
                  </Title>
                </TextCard>
              </Col>
            </Row>
          </form>

          {/* {!loading && userType === 'employee' && all_claim_data.length === 0 && <NoDataFound text='No Claim Data Found' />} */}
          {loading && <Loader />}
        </CardBlue>
      )}
      {tab === "TPA Type" && (
        <CardBlue title="TPA API Trigger" round>
          <form onSubmit={handleSubmit(onSubmitDetails)}>
            <Row>
              <Col xs={12} sm={12} md={6} lg={4} xl={3}>
                <Controller
                  as={
                    <SelectComponent
                      label="Employer"
                      placeholder="Select TPA"
                      options={
                        allTpa?.map((item) => ({
                          id: item?.id,
                          label: item?.name || item?.company_name,
                          value: item?.id,
                        })) || []
                      }
                      isRequired
                    />
                  }
                  onChange={([selected]) => {
                    setValue([{ api_type: undefined }]);
                    return selected;
                  }}
                  name="tpa_id"
                  error={errors && errors?.tpa_id?.id}
                  control={control}
                />
                {!!errors?.tpa_id?.id && (
                  <Error>{errors?.tpa_id?.id?.message}</Error>
                )}
              </Col>
              <Col md={12} lg={4} xl={3} sm={12}>
                <Controller
                  as={
                    <SelectComponent
                      label="API Type"
                      placeholder="Select API Type"
                      options={
                        apiType?.map((item) => ({
                          id: item,
                          label: item,
                          value: item,
                        })) || []
                      }
                      id="api_type"
                      required={false}
                      isRequired
                    />
                  }
                  name="api_type"
                  error={errors && errors?.api_type?.id}
                  control={control}
                />
                {!!errors.api_type?.id && (
                  <Error>{errors.api_type?.id.message}</Error>
                )}
              </Col>
            </Row>
            <DivButton>
              <Button type="submit">
                <span style={{ marginLeft: "-5px", marginRight: "-2px" }}>
                  Submit
                </span>
              </Button>
            </DivButton>
          </form>

          {/* {!loading && userType === 'employee' && all_claim_data.length === 0 && <NoDataFound text='No Claim Data Found' />} */}
          {loading && <Loader />}
        </CardBlue>
      )}
      <CardBlue title="TPA API Trigger Details">
        <DataTable
          columns={TableData(setViewModal)}
          noStatus={true}
          data={allTpaJobData || []}
          pageState={{ pageIndex: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 15, 20]}
          rowStyle
        />
      </CardBlue>
      {!!viewModal && (
        <ModalComponent
          show={!!viewModal}
          onHide={() => setViewModal(false)}
          HtmlArray={viewModal}
        />
      )}
    </>
  );
};

export default TPAApiTrigger;

const TableData = (viewTemplate) => [
  {
    Header: "Sr. No",
    accessor: "index"
  },
  {
    Header: "Method Name",
    accessor: "method_name",
  },
  {
    Header: "Executed By",
    accessor: "ran_by",
  },
  {
    Header: "Executed At",
    accessor: "ran_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "Request",
    accessor: "request",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },
  {
    Header: "Response",
    accessor: "response",
    disableFilters: true,
    disableSortBy: true,
    Cell: (cell) => CellViewTemplate(cell, viewTemplate),
  },

];
