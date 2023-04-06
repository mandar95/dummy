import React, { useState, useEffect, useRef, Fragment } from "react";
import styled from "styled-components";
import { Row, Col, Spinner, OverlayTrigger } from "react-bootstrap";
import { slice } from "lodash";

// import Widgets from "../../../components/my-widget/widget";
import { IconlessCard, NoDataFound, Loader } from "../../../components/";
import { readAction } from "./my-wellness.prototype";

import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployeeBenefit,
  getICDContent,
  loadMore,
  getVisit,
  clear,
  getMediBuddy,
  getLybrate,
  pristynCareApiCall,
  memberSyncCNH,
  getMeraDoc,
  get1MG,
} from "../wellness.slice";
import classes from "./index.module.css";
import { Typography } from "@material-ui/core";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { downloadFile } from "../../../utils";
import { ModuleControl } from "../../../config/module-control";
import { QRCode } from "../../employeeHome/QRCode";

const TypographyComp = styled(Typography)`
  color: ${({ theme }) => theme.Tab?.color || '#00000'};
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
  display: "block";
`

const LeftCard = styled.div`
  background: #fff;
  color: black;
  border-radius: 30px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
  border: 1px solid #dedede;
  border-radius: 10px 35px 0 35px;
  box-shadow: 7px 11px 10px 0px #b3b3b3;
  margin: 30px 30px 30px 0px;
  padding: 35px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};

  & .static_content {
    height: 275px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 992px) {
    width: 80%;
    margin: auto;
  }
  @media (min-width: 992px) and (max-width: 1300px) {
    & .static_image > img {
      height: 100px !important;
      width: 145px !important;
    }
  }
`;
const LoadMoreContainer = styled.div`
  flex-direction: column;
  display: flex;
  width: 75px;
  margin: auto;
  cursor: pointer;
  align-items: center;
`;
const LoadMoreArrow = styled.span`
  transform: rotate(90deg);
  width: 15px;
  margin: auto;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
`;
const LoadMoreText = styled.span`
  font-family: basier_squareregular;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  
  margin-top: -5px;
`;

const Button = styled.button`
  background-color: #FFFFFF;
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  display: inline-block;
  font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(16px + ${fontSize - 92}%)` : '16px'};
  
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 13px 23px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: auto;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow .2s;
  }

  &:active {
    background-color: #F7F7F7;
    border-color: #000000;
    transform: scale(.96);
  }

  &:disabled {
    border-color: #DDDDDD;
    color: #DDDDDD;
    cursor: not-allowed;
    opacity: 1;
  }
`

const WellnessPartners = ModuleControl.Wellness_Partners;

// const TATA_VISIT = ModuleControl.TataVisit;

// const Button_Label = TATA_VISIT ? 'Click Here' : 'Buy Now';

// const TCOM = [2, 14, 15];

const MyWellness = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const {
    EMPBenefit,
    ICDContent,
    loading,
    isLoadMore,
    isLoadMoreLoading,
    visitURL,
    error,
  } = useSelector((state) => state.wellness);
  const { currentUser, userType } = useSelector((state) => state.login);
  const [longText, setLongText] = useState("");
  // const [flipOrNot, setFlipOrNot] = useState(false);
  const leftContentRef = useRef(null);
  const ref = useRef();

  useEffect(() => {
    if (userType === "Employee") {
      dispatch(
        getAllEmployeeBenefit({ employee_id: currentUser?.employee_id })
      );
      dispatch(getICDContent({ employee_id: currentUser?.employee_id }));
    }
    //eslint-disable-next-line
  }, [userType]);

  useEffect(() => {
    setLongText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EMPBenefit]);

  useEffect(() => {
    if (visitURL) {
      downloadFile(visitURL, null, true)
    }
    return () => {
      dispatch(clear('visit'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitURL])

  useEffect(() => {
    if (longText === "") {
      let _element = leftContentRef.current;
      setLongText(_element?.innerText);
      if (_element?.innerText.length > 200) {
        let trim = _element.innerText.substr(0, 200);
        _element.innerText = trim;
        readAction(_element, true);
        //setLongText("");
      }
    }
  }, [longText, ICDContent, EMPBenefit]);

  useEffect(() => {
    // if (error) {
    //     swal(error, "", "warning");
    // }
    return () => {
      dispatch(clear());
    };
    //eslint-disable-next-line
  }, [error]);

  const readMoreAction = (e) => {
    let _element = leftContentRef.current;
    if (e.target.className === "more") {
      _element.innerText = longText;
      readAction(_element, false);
    } else {
      if (e.target.className === "less") {
        let trim = _element.innerText.substr(0, 200);
        _element.innerText = trim;
        readAction(_element, true);
      }
    }
  };

  const new_Benefit =
    EMPBenefit.length > 6 && !isLoadMore ? slice(EMPBenefit, 0, 6) : EMPBenefit;
  const renderTooltip = (props, data) => (
    <div
      id="button-tooltip"
      {...props}
      className={`bg-light p-3 rounded-lg shadow-lg ${classes.divWidth}`}
    >
      {data}
    </div>
  );


  const ActionWellness = ({ wellness_partner_url, benefit_id, wellness_partner_id }) => {

    const FoundPartner = WellnessPartners.find(elem => benefit_id === elem.benefit_id && wellness_partner_id === elem.wellness_partner_id);
    if (FoundPartner) {
      switch (FoundPartner.label) {
        case 'PRISTYNE_CARE': dispatch(pristynCareApiCall(wellness_partner_url, currentUser.name))
          break
        case 'DOC_ONLINE': setModal(true)
          break
        case 'VISIT': dispatch(getVisit())
          break
        case 'MEDI_BUDDY': dispatch(getMediBuddy())
          break
        case 'MERA_DOC': dispatch(getMeraDoc())
          break
        case 'LYBRATE': dispatch(getLybrate())
          break
        case 'Connect_Heal': dispatch(memberSyncCNH())
          break
        case '1MG': dispatch(get1MG())
          break
        default: downloadFile(wellness_partner_url, false, true)
      }
    }
    else {
      downloadFile(wellness_partner_url, false, true)
    }

  }

  return (
    !loading ? (
      <Row className="m-0">
        <Col md={12} lg={8} xl={9} sm={12}>
          <div className="mt-4 w-100">
            <div className="row justify-content-start">

              {new_Benefit.map((item, i) => {
                return (
                  <Fragment key={"widget1" + i}>
                    <div
                      className={"mb-3 col-12 col-md-4 col-sm-6 " + classes['hover-wellness']}>
                      <Flippy
                        flipOnHover={false} // default false
                        flipOnClick={true} // default false
                        flipDirection="horizontal" // horizontal or vertical
                        ref={ref}
                        key={"widget1a" + i}
                        style={{
                          // cursor: "url('/assets/images/icon/flip.png'), auto",
                          cursor: "grabbing",
                        }}
                      >
                        <FrontSide
                          style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                        >
                          <div
                            className="text-center w-100 d-flex justify-content-center align-items-center"
                            style={{ height: '150px' }}
                          >
                            <img
                              src={
                                item.benefit_image ||
                                "/assets/images/dash1.png"
                              }
                              alt=""
                              className="img-fluid"
                              style={{
                                width: "max-content",
                                height: 'auto',
                                // maxWidth: '260px',
                                maxHeight: '150px'
                              }}
                            />
                          </div>
                          <div className="text-left m-2">
                            {item.benefit_name.length > 23 ?
                              <OverlayTrigger
                                placement="top"
                                overlay={(e) =>
                                  renderTooltip(e, item.benefit_name)
                                }
                              >
                                <TypographyComp
                                  noWrap={true}
                                  className="my-2"
                                >
                                  {item.benefit_name}
                                </TypographyComp>
                              </OverlayTrigger>
                              : <TypographyComp
                                noWrap={true}
                                className="my-2"
                              >
                                {item.benefit_name}
                              </TypographyComp>}


                            <div className="w-100" style={{ minHeight: "82px", maxHeight: "82px" }}>
                              {item.benefit_content?.length > 100 ? (
                                <>
                                  <span className="text-secondary">
                                    {item.benefit_content?.slice(0, 100) + "..."}
                                  </span>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={(e) =>
                                      renderTooltip(e, item.benefit_content)
                                    }
                                  >
                                    <h6 className="text-danger mt-1">
                                      Read More
                                    </h6>
                                  </OverlayTrigger>
                                </>
                              ) : (
                                <span className="text-secondary">
                                  {item.benefit_content}
                                </span>
                              )}
                            </div>
                          </div>
                        </FrontSide>
                        <BackSide
                          style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                        >
                          <div
                            className="text-center w-100 d-flex justify-content-center align-items-center"
                            style={{ height: '150px' }}
                          >
                            <img
                              src={
                                item.wellness_partner_logo ||
                                "/assets/images/dash1.png"
                              }
                              alt=""
                              className="img-fluid"
                              style={{
                                width: "max-content",
                                height: 'max-content',
                                // maxWidth: '260px',
                                maxHeight: '150px'
                              }}
                            />
                          </div>
                          <div className="text-center m-2">
                            <h5>
                              <span
                                className="text-danger"
                              >
                                {item.wellness_partner_name}
                              </span>
                            </h5>

                            {!!item.wellness_partner_url && <Button className="mt-3" onClick={() => ActionWellness(item)}>{item.button_name || 'Buy Now'}</Button>}

                          </div>
                        </BackSide>
                      </Flippy>
                    </div>
                  </Fragment>
                );
              })}
              {!new_Benefit.length && (
                <IconlessCard removeBottomHeader={true}>
                  <NoDataFound />
                </IconlessCard>
              )}
            </div>
            {EMPBenefit.length > 6 && !isLoadMore && (
              <Row style={{ textAlign: "center" }}>
                <LoadMoreContainer onClick={() => dispatch(loadMore(true))}>
                  {isLoadMoreLoading ? (
                    <Spinner animation="border" variant="dark" />
                  ) : (
                    <>
                      <LoadMoreArrow>»</LoadMoreArrow>
                      <LoadMoreText>Load More</LoadMoreText>
                    </>
                  )}
                </LoadMoreContainer>
              </Row>
            )}
          </div>
        </Col>
        {!!(ICDContent?.dynamic_content || EMPBenefit[0]?.static_content) && (
          <Col md={12} lg={4} xl={3} sm={12}>
            <LeftCard>
              <div
                onClick={(e) => readMoreAction(e)}
                className="static_content"
                ref={leftContentRef}
              >
                {ICDContent
                  ? ICDContent.dynamic_content
                  : EMPBenefit[0]?.static_content}
              </div>
              <div
                className="static_image"
                style={{ textAlign: "center", marginTop: "15px" }}
              >
                <img
                  src="/assets/images/my-wellness/balance.png"
                  style={{ height: "116px", width: "178px" }}
                  alt="img"
                />
              </div>
            </LeftCard>
          </Col>
        )}
        <QRCode show={modal} onHide={() => setModal(false)} />
      </Row>
    ) : (
      <Loader />
    )
  );
};

export default MyWellness;

// const VISIT = {
//   "benefit_name": "Visit",
//   "benefit_content": "VISIT empowers organisations enhance healthcare experience and optimise medical costs for all their employees.",
//   "benefit_image": "/assets/images/icon/visit.png",
// }

// const MEDI_BUDDY_Detail = {
//   "benefit_name": "MediBuddy",
//   "benefit_content": "Get access to all your Health insurance services - View Policy, Initiate and Track Claims, Go Cashless with network hospitals and intimate Hospitalization",
//   "benefit_image": "/assets/images/icon/medibuddy.svg",
// }

// const LYBRATE_DETAIL = {
//   "benefit_name": "Lybrate",
//   "benefit_content": "Get access to all your Health insurance services - View Policy, Initiate and Track Claims, Go Cashless with network hospitals and intimate Hospitalization",
//   "benefit_image": "/assets/images/icon/medibuddy.svg",
// }
