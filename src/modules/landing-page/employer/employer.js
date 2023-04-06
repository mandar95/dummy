import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Subscribe, AboutUs, Loader } from "../../../components";
import { MainContent } from "../broker-landing/main-content/MainContent";
import { ModulesDisplay } from "./ModulesDisplay";
import { NavBar, Footer } from "../../../components";
import styled from "styled-components";
// import Carousel from "./carousel";
import MobiletTile from "./mobileTile";
import { getInfo, clearAlertMessage } from "../employerLanding.slice";
import swal from "sweetalert";
import _ from "lodash";
import Fade from "react-reveal/Fade";

const EmployerLP = () => {
	//selectors
	const dispatch = useDispatch();
	const response = useSelector((state) => state.employerHome);
	const Data =
		!_.isEmpty(response?.response?.data?.data) &&
		response?.response?.data?.data[0];

	//api calls--------------------------
	useEffect(() => {
		dispatch(getInfo());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//-----------------------------------

	//secondary alert message
	useEffect(() => {
		if (response.alert) {
			swal("", response?.alert, "warning");
		}
		return () => {
			dispatch(clearAlertMessage());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [response.alert]);

	return (
		<>
			{!_.isEmpty(response) ? (
				<div>
					<NavBar style={{ position: "absolute" }} />
						<DivMain
							bgposition={"top right"}
							bgsize={"1060px"}
							bgimage={"/assets/images/landing-page/bg-2.png"}
						>
							<MainContent />
						</DivMain>
					<Div>
						{/*<h3 style={{ fontWeight: "600", textShadow: "2px 2px #D0D0D0" }}>
            What is Lorem Ipsum?
          </h3>*/}
						<ModulesDisplay stepers={Data?.stepers ? Data?.stepers : []} />
					</Div>
					<div style={{ padding: "50px" }} className="text-center">
						<Fade right delay={100}>
							<Title>Communication with the employees</Title>
						</Fade>
						<Fade delay={400}>
							<Image src={"/assets/images/landing-page/Employer_flow_chart.png"} />
						</Fade>
					</div>
					<DivMobile>
						<MobiletTile Data={Data} />
					</DivMobile>
					{/* <div style={{ padding: "50px" }} id="plans_carousel">
						<Fade right delay={100}>
							<h2
								style={{
									textAlign: "center",
									paddingBottom: "20px",
									fontWeight: "600",
									fontSize: globalTheme.fontSize ? `calc(40px + ${globalTheme.fontSize - 92}%)` : '40px',
								}}
							>
								We made our pricing simpler in packages.
							</h2>
						</Fade>
						<Fade delay={400}>
							<Carousel Data={Data?.plans} />
						</Fade>
					</div> */}
					<Div1
						bgposition={"bottom"}
						bgsize={"100% 100%"}
						bgimage={"/assets/images/splashFT.png"}
					>
						<DivTag>
							<Fade left delay={700}>
								<Subscribe />
							</Fade>
						</DivTag>
						<DivFooter>
							<Fade bottom delay={700}>
								<AboutUs />
							</Fade>
						</DivFooter>
					</Div1>
				</div>
			) : (
				<Loader />
			)}
			<Footer />
		</>
	);
};

const DivMain = styled.div`
	background-repeat: no-repeat;
	background-position: ${({ bgposition }) => bgposition};
	background-size: ${({ bgsize }) => bgsize};
	background-image: ${({ bgimage }) => `url(${bgimage})`};
	padding: ${({ padding }) => padding || "50px"};
	${({ padding }) => (padding ? `@media (max-width: 500px) {padding: 0}` : "")};
`;

const Div = styled.div`
	margin-top: 100px;
	padding: 50px;
`;
// const DivContent = styled.div`
// 	padding: 50px;
// 	height: 39rem;
// 	width: 100%;
// 	background-image: url("/assets/images/banner_ft.png");
// 	background-position: center;
// 	background-repeat: no-repeat;
// 	background-size: 100% 100%;
// 	@media (max-width: 767px) {
// 		background-image: none;
// 		height: auto;
// 	}
// `;
const Div1 = styled.div`
	background-repeat: no-repeat;
	background-position: ${({ bgposition }) => bgposition};
	background-size: ${({ bgsize }) => bgsize};
	background-image: ${({ bgimage }) => `url(${bgimage})`};
	padding: 50px;
	@media (max-width: 767px) {
		background-image: none;
		padding: 5px;
	}
`;
const DivTag = styled.div`
	display: flex;
	justify-content: center;
	padding: 50px;
	@media (max-width: 767px) {
		display: block;
	}
`;
const DivFooter = styled.div`
	padding: 50px;
	@media (max-width: 767px) {
		display: flex;
		justify-content: center;
		padding: 5px;
		margin-left: 5px;
		width: min-content;
		flex-wrap: wrap;
	}
`;

const DivMobile = styled.div`
	padding: 50px;
	background-image: url("/assets/images/mobilesplash.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	@media (max-width: 767px) {
		background-image: none;
	}
`;

const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};
	
	padding-bottom: 10px;
	line-height: 1.2;
`;

const Image = styled.img`
	height: 100%;
	width: 100%;
	padding: 0 27rem;


	@media (max-width: 1200px) {
		padding: 0 25rem;
		width: 100%;
	}
	@media (max-width: 1080px) {
		padding: 0 15rem;
		width: 100%;
	}
	@media (max-width: 920px) {
		padding: 0 10rem;
		width: 100%;
	}
	@media (max-width: 730px) {
		padding: 0 6rem;
		width: 100%;
	}

	@media (max-width: 500px) {
		padding: 0;
		width: 100%;
	}
`;

export default EmployerLP;
