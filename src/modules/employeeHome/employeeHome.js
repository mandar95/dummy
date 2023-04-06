import React, { useState, useReducer, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { QRCode } from "./QRCode";
import { useDispatch, useSelector } from "react-redux";
import { memberSyncCNH, pristynCareApiCall } from "../wellness/wellness.slice";
import { reducer, initialState } from "../Dashboard_Card_Config/helper";
import { getDashboardCardMapping } from "../Dashboard_Card_Config/actions";
import { Loader } from 'components';
import {
  SMALL, LoginUICard2, ContentDiv, Title,
  SubTitle, SelectDiv, LoginUICard, IMG, SubTitle2, GlobalStyle, Wrapper, TopDiv
} from "./style"
import { ModuleControl } from "../../config/module-control";

const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const Card2 = ({ v, history, callFromHome, globalTheme }) => (
  v && <LoginUICard2
    Border={v.theme_json.cardColor}
    BgColor={v.theme_json.cardBackground}
    onClick={() => {
      if (callFromHome) {
        if (v.redirect_url.search("://") < 0) {
          history.push(`${v.redirect_url}`);
        } else {
          window.open(v.redirect_url, "_blank");
        }
      }
    }}
  >
    <Row className="w-100">
      <Col xs={5} md={3} lg={5} sm={5}>
        <IMG src={v.image} alt={""} />
      </Col>
      <Col
        xs={7}
        md={9}
        lg={7}
        sm={7}
        style={{
          padding: "0px",
          display: "flex",
          flexDirection: "column",
          height: "12vh",
        }}
      >
        <ContentDiv style={{ margin: "0px" }}>
          <div>
            <Title
              style={{
                color: v.theme_json.textColor,
              }}
            >
              {v.heading}
            </Title>
            {/* <SubTitle2>{v.sub_heading}</SubTitle2> */}
            {!!v.sub_heading && (
              <SubTitle
                style={{
                  color: v.theme_json.textColor,
                }}
              >
                {v.sub_heading}
              </SubTitle>
            )}
            {!!v.description && (
              <SMALL
                style={{
                  color: v.theme_json.textColor,
                }}
              >
                {v.description}
              </SMALL>
            )}
          </div>
        </ContentDiv>
      </Col>
    </Row>
    <Row className="justify-content-end">
      <SelectDiv style={{ zIndex: "1" }} BgColor={v.theme_json.cardColor}>
        Select{" "}
        <i
          className="ti ti-arrow-circle-right"
          style={{
            float: "right",
            marginTop: "5px",
            fontSize: globalTheme?.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
          }}
        ></i>
      </SelectDiv>
    </Row>
  </LoginUICard2>
);

const EmployeeHome = () => {

  const [{ setDashboardCardMapping, loading }, reducerDispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const { currentUser, modules } = useSelector((state) => state.login);
  const { globalTheme } = useSelector(state => state.theme)

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.employer_id) {
      getDashboardCardMapping(currentUser?.employer_id, reducerDispatch, "", "employee");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.employer_id]);

  // Card Logics
  const DoctorOnCall =
    (["PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER) &&
      [17 /*  WSP */].includes(currentUser?.employer_id)) ||
    (["PALM_UAT"].includes(process.env.REACT_APP_SERVER) &&
      currentUser?.employer_id !== 28) /* BUREAU VERITAS */ ||
    ["DEVELOPMENT"].includes(process.env.REACT_APP_SERVER);
  const connect$heal =
    (["PALM_UAT"].includes(process.env.REACT_APP_SERVER) &&
      currentUser?.employer_id !== 28) ||
    ["DEVELOPMENT"].includes(process.env.REACT_APP_SERVER);
  const MyWellness =
    !['HOWDEN_UAT',
      "PALM_UAT", "PALM_PRODUCTION"
    ].includes(process.env.REACT_APP_SERVER) ||
    (["PALM_UAT"].includes(process.env.REACT_APP_SERVER) &&
      currentUser?.employer_id !== 28) /* BUREAU VERITAS */ ||
    (["PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER) &&
      [17 /*  WSP */, 11 /* GHV Advanced */, 15 /* Fyntune */].includes(
        currentUser?.employer_id
      ));
  const MyHealth =
    !["PALM_UAT"].includes(process.env.REACT_APP_SERVER) ||
    (["PALM_UAT"].includes(process.env.REACT_APP_SERVER) &&
      currentUser?.employer_id !== 28); /* BUREAU VERITAS */

  const SurgeryCare = ["PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER) || isLocal;

  const OPDCare = ["PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER) || isLocal;
  // ---------

  const UserManual = ModuleControl.UserManual;
  const isWSP = (["PALM_PRODUCTION"].includes(process.env.REACT_APP_SERVER) && currentUser?.employer_id === 17)

  const PristynCare = ["DEVELOPMENT", "PALM_UAT"].includes(process.env.REACT_APP_SERVER);

  const _Data = [
    { link: "dashboard", image: "/assets/images/employee-home/my-benefit.png", title: "My Benefits", subTitle: "Insurance/Flex", Border: "#9AFC59", Background: "#ECFFE0", ButtonColor: "#9AFC59", isSubTitle2: false },
    { link: modules?.find(({ url }) => url === '/employee/enrollment') ? "enrollment" : "policy-flexible-benefits", image: "/assets/images/employee-home/my-family.png", title: "My Family", subTitle: "Enrol Members", Border: "#FFC300", Background: "#FFF8DB", ButtonColor: "#FFC300", isSubTitle2: false, },
    ...(MyWellness
      ? [{ link: "my-wellness", image: "/assets/images/employee-home/my-wellness.png", title: "My Wellness", subTitle: "", Border: "#D174FF", Background: "#F4E7FA", ButtonColor: "#D174FF", isSubTitle2: false, },]
      : [null]),
    ...(MyHealth
      ? [{ link: "submit-claim", image: "/assets/images/employee-home/Health-center.png", title: "My Health", subTitle: "Service Center", subTitle2: "Claim Service", Border: "#0068FB", Background: "#D5E4F8", ButtonColor: "#0068FB", isSubTitle2: true, },]
      : [null]),
    { link: "", image: "/assets/images/employee-home/doc-online.png", title: "Doctor on Call", subTitle: "", Border: "#7cb2ff", Background: "#eef5ff", ButtonColor: "#7cb2ff", isSubTitle2: false, },
    { link: "", image: "/assets/images/employee-home/connect-heal.jpg", title: "Connect & Heal", subTitle: "", Border: "#5aa078", Background: "#ffffff", ButtonColor: "#5aa078", isSubTitle2: false, },
    ...((UserManual && !isWSP)
      ? [{ link: "https://employeebenefit.s3.ap-south-1.amazonaws.com/VID-20220314-WA0001.mp4", image: "/assets/images/employee-home/user-manual.png", title: "Employee Benefit", subTitle: "Watch Video", subTitle2: "", Border: "#ff9c4c", Background: "linear-gradient(to right top,#ffd8b8,#ffe4cd,#ffecdd,#f6f2e4,#fcfff7)", ButtonColor: "#ff9c4c", isSubTitle2: false, },]
      : [null]),
    ...(SurgeryCare
      ? [{ link: "https://www.pristyncare.com/gp/partners-palm-broker", image: "/assets/images/employee-home/SurgeryCare.png", title: "Surgery Care", subTitle: "", subTitle2: "", Border: "#46af94", Background: "#ffffff", ButtonColor: "#46af94", isSubTitle2: false, },]
      : [null]),
    ...(OPDCare
      ? [{ link: "https://meradoc.com/meraclinic/corporate/Palm_Insurance_Brokers", image: "/assets/images/employee-home/OPDCare.png", title: "OPD Care", subTitle: "", subTitle2: "", Border: "#fea8b1", Background: "#ffffff", ButtonColor: "#fea8b1", isSubTitle2: false, },]
      : [null]),
    ...(PristynCare
      ? [{ link: "", image: "/assets/images/employee-home/Pristyn_Care_Logo.png", title: "Surgery Care", subTitle: "By Pristyn Care", subTitle2: "", Border: "#955fc8", Background: "#ffffff", ButtonColor: "#955fc8", isSubTitle2: false, },]
      : [null]),
  ];

  const navigator = (navigateTo, title) => {
    if (navigateTo.search("://") < 0) {
      if (navigateTo) history.push(`/employee/${navigateTo}`);
      if (title === _Data[4].title) setModal(true);
      if (title === _Data[5].title) dispatch(memberSyncCNH());
      if (title === _Data[9].title) dispatch(pristynCareApiCall());
    } else {
      window.open(navigateTo, "_blank");
    }
  };

  const Card = ({ v, i, width }) =>
    v && (
      <LoginUICard
        Border={v.Border}
        BgColor={v.Background}
        onClick={() => navigator(v.link, v.title)}
      >
        <Row className="">
          <Col xs={5} md={3} lg={5} sm={5}>
            <IMG width={width} src={v.image} alt={v.title} />
          </Col>
          <Col
            xs={7}
            md={9}
            lg={7}
            sm={7}
            style={{
              padding: "0px",
              display: "flex",
              flexDirection: "column",
              height: "12vh",
            }}
          >
            <ContentDiv style={{ margin: "0px" }}>
              <div>
                <Title>{v.title}</Title>
                {v.isSubTitle2 ? (
                  <SubTitle2>{v.subTitle}</SubTitle2>
                ) : (
                  <SubTitle>{v.subTitle}</SubTitle>
                )}
                {!!v.subTitle2 && <SubTitle>{v.subTitle2}</SubTitle>}
              </div>
            </ContentDiv>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <SelectDiv BgColor={v.ButtonColor}>
            Select{" "}
            <i
              className="ti ti-arrow-circle-right"
              style={{
                float: "right",
                marginTop: "5px",
                fontSize: globalTheme?.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
              }}
            ></i>
          </SelectDiv>
        </Row>
      </LoginUICard>
    );

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        {!setDashboardCardMapping?.length && !loading && <TopDiv style={{ display: 'flex', flexWrap: 'wrap' }}>
          {[_Data[0], _Data[1]].map((v, i) => <Card v={v} key={i + 'first'} />)}

          {[_Data[DoctorOnCall ? 4 : 2], _Data[3]].map((v, i) => <Card v={v} key={i + 'second'} />)}

          {DoctorOnCall && <Card v={_Data[2]} key='doctor' />}
          {connect$heal && <Card v={_Data[5]} key='connectHeal' />}
          <Card v={_Data[7]} key='surgeory' width='100%' />
          <Card v={_Data[8]} key='opdcare' width='100%' />
          <Card v={_Data[6]} key='userManual' />
          <Card v={_Data[9]} key='pristyncare' width='100%' />
        </TopDiv>}
        <div className="row flex-wrap justify-content-start">
          {!!setDashboardCardMapping?.length && setDashboardCardMapping.map(
            (data) =>
            (
              <div
                className="col-12 w-100 col-lg-5 justify-content-start"
                key={data.card_id}
              >
                <Card2 v={data.card_details} history={history} callFromHome={true} globalTheme={globalTheme} />
              </div>
            )
          )}
        </div>
      </Wrapper>
      {loading && <Loader />}
      <QRCode show={modal} onHide={() => setModal(false)} />
    </>
  );
};

export default EmployeeHome;
