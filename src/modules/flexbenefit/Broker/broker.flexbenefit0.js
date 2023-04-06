import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Card, Select, SelectComponent, Button, Loader } from "../../../components";
import swal from "sweetalert";
import { Row } from "react-bootstrap";
import _ from "lodash";
import ModalComponent from "./amount.js";
// import AddBenefitsModal from "./add-benefits.js";
import styled from "styled-components";
import { getFirstError } from "../../../utils";
import {
  // getEmployersData,
  // selectEmployerDataresp,
  getFlexData,
  selectFlexresp,
  allocateFlexData,
  selectAllocateFlex,
  loadBroker,
  // loadBrokerEmployer,
} from "../flexbenefit.slice";
import { useParams } from "react-router-dom";
import {fetchEmployers,setPageData} from "modules/networkHospital_broker/networkhospitalbroker.slice";
const validationSchema = (userType) => yup.object().shape({
  ...userType === 'admin' && {
    broker_id: yup.object().shape({
      id: yup.string().required('Broker Required'),
    })
  },
  ...userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer Required'),
    })
  },
});

const BrokerFlexConfig = () => {

  const { userType } = useParams();
  //selectors
  const dispatch = useDispatch();
  // const employerResp = useSelector(selectEmployerDataresp);
  const { broker, loading } = useSelector((state) => state.flexbenefit);
  const { currentUser,userType: userTypeName } = useSelector((state) => state.login);

  const allocateResp = useSelector(selectAllocateFlex);
  const { handleSubmit, control, register, watch, errors } = useForm({ validationSchema: validationSchema(userType) });
  const brokerId = (watch("broker_id") || {})?.id;
  const flexResp = useSelector(selectFlexresp);
  
  const { employers,
		firstPage,
		lastPage, } = useSelector(
    (state) => state.networkhospitalbroker
  );
  const [Data, setData] = React.useState({});

  const [modalShow, setModalShow] = useState(false);
  // const [modalShow2, setModalShow2] = useState(false);

  const [alert, setAlert] = useState(null);
  let _filterType = watch('filter_type');
  useEffect(() => {
    if (_filterType) {
      dispatch(getFlexData({
        type: _filterType
      }));
    }
    //eslint-disable-next-line
  }, [_filterType]);
  //api calls --------------------------
  useEffect(() => {
    if (userType === "admin") {
      dispatch(loadBroker());
    }
    dispatch(getFlexData({
      type: 'W'
    }));
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    //eslint-disable-next-line
  }, []);
  // useEffect(() => {
  //   if (currentUser.broker_id && userType === "broker") {
  //     dispatch(getEmployersData(currentUser.broker_id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser])
	useEffect(() => {
		if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, brokerId, currentUser]);
  //------------------------------------

  //onSubmit----------------------------
  const onSubmit = (data) => {
    setData(data);
    if (!_.isEmpty(data?.benefits)) {
      if (_.includes(data?.benefits, "1")) {
        setModalShow(true);
        setAlert(1);
      } else {
        dispatch(allocateFlexData({ ...data, employer_id: data?.employer_id?.value }));
        setAlert(1);
      }
    } else {
      swal("Benefits not selected", "", "warning");
    }
  };
  //------------------------------------

  //alert------------------------------
  useEffect(() => {
    if (alert === 1) {
      if (allocateResp?.data?.status) {
        swal(allocateResp?.data?.message, "", "success");
        setAlert(0);
      } else {
        let error =
          allocateResp?.data?.errors &&
          getFirstError(allocateResp?.data?.errors);
        error = error
          ? error
          : allocateResp?.data?.message
            ? allocateResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setAlert(0);
      }
    }
    //eslint-disable-next-line
  }, [allocateResp]);

  // const getAdminEmployer = ([e]) => {
  //   if (e.target.value) {
  //     dispatch(loadBrokerEmployer(e.target.value));
  //   }
  //   return e;
  // };

  //card title------------------
  const title = (
    <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
      <span style={{ width: "90%" }}>Select Benefits</span>
      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn
          size="sm"
          varient="primary"
          onClick={() => {
            setModalShow2(true);
            setAlert(0);
          }}
        >
          <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}>Add Benefits</span>
        </Btn>
      </div> */}
    </div>
  );
  //-----------------------

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card title="Filters" round>
          <div style={{ marginTop: "-20px" }}>
            <Row xs={1} sm={1} md={2} lg={3}>
              {userType === "admin" && (
                <div className="p-2">
                  <Controller
                    as={
                      <Select
                        label="Broker"
                        placeholder="Select Broker"
                        options={broker.map((item) => ({
                          id: item?.id,
                          name: item?.name,
                          value: item?.id,
                        }))}
                        valueName="name"
                        id="id"
                        required
                      />
                    }
                    error={errors.broker_id?.id}
                    // onChange={getAdminEmployer}
                    name="broker_id"
                    control={control}
                  />
                </div>
              )}
              <div className="p-2">
                <Controller
                  as={<SelectComponent
                    label="Employer"
                    placeholder='Select Employer'
                    options={employers?.map((item) => ({
                      id: item?.id,
                      label: item?.name,
                      value: item?.id,
                    }))}
                    id="employer_id"
                    required />}
                  error={errors.employer_id?.id}
                  name="employer_id"
                  control={control} />
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <Select
                      label="Flex Benefit Applicable"
                      placeholder="Select Option"
                      options={[
                        { id: 1, name: "Yes", value: 1 },
                        { id: 0, name: "No", value: 0 },
                      ]}
                    />
                  }
                  name="flex_applicable"
                  control={control}
                />
              </div>
              <div className="p-2">
                <Controller
                  as={
                    <Select
                      label="Wellness Benefit Applicable"
                      placeholder="Select Option"
                      options={[
                        { id: 1, name: "Yes", value: 1 },
                        { id: 0, name: "No", value: 0 },
                      ]}
                    />
                  }
                  name="wellness_applicable"
                  control={control}
                />
              </div>
            </Row>
          </div>
        </Card>
        <Card title={title}>
          <Row xs={1} sm={1} md={2} lg={3}>
            <Controller
              as={
                <Select
                  required={false}
                  isRequired={false}
                  label="Filter"
                  placeholder="Select Option"
                  options={[
                    // { id: 1, name: "Voluntary", value: "V" },
                    { id: 0, name: "Wellness", value: "W" },
                  ]}
                />
              }
              name="filter_type"
              control={control}
              defaultValue={'W'}
            />
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
            className='row'
          >
            {flexResp?.data?.data?.map((item, index) => (
              <label htmlFor={item?.id} key={'flex-data' + item?.id} className="col-md-4 col-lg-2 col-12 my-5">
                <div className="p-3" style={{ border: "1px solid #deff" }}>
                  <div className="row">
                    <div className="col-4">
                      <input
                        type="checkbox"
                        style={{ width: "50%", minWidth: '20px' }}
                        name={`benefits[${index}]`}
                        value={item?.id}
                        ref={register}
                        id={item?.id}
                      />
                    </div>
                    <ImageDiv className="col-8">
                      <img
                        src={item?.image}
                        alt="flex"
                        width="50"
                        height="50"
                      />
                    </ImageDiv>
                  </div>
                  <div className="row">
                    <div
                      className="col-12 text-center"
                      style={{ height: "30px" }}
                    >
                      <div className="">{item.name || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <Button type="submit" style={{ float: "right" }}>
            Save
          </Button>
        </Card>
      </form>
      <ModalComponent
        style={{ transition: " opacity .25s linear " }}
        Data={Data}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {loading && <Loader />}
    </>
  );
};

export default BrokerFlexConfig;

//style-----------------------------

const ImageDiv = styled.div`
  margin-left: -15px;
  min-height: 50px;
  max-height: 50px;
`;
//-----------------------------------
