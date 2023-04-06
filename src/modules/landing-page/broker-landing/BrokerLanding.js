import React, { useEffect } from "react";
import styled from "styled-components";
import Fade from "react-reveal/Fade";

import { CustomerService } from "./cards-content/CustomerService";
import { MainContent } from "../employer/MainContent";
import { ModulesDisplay } from "./modules-display/ModulesDisplay";
// import { Plans } from "./cards-content/Plans";
import {
	NavBar,
	Subscribe,
	AboutUs,
	Footer,
	Loader,
} from "../../../components";
import { SoftwareKey } from "./cards-content/SoftwareKey";

import { loadBrokerHome } from "./broker.slice";
import { useSelector, useDispatch } from "react-redux";

export const BrokerLanding = () => {
	const dispatch = useDispatch();
	const { page = {}, loading } = useSelector((state) => state.brokerHome);
	const {
		benefits = [],
		customer_service = [],
		// plans = [],
		stepers = [],
	} = page;

	useEffect(() => {
		dispatch(loadBrokerHome());
		//eslint-disable-next-line
	}, []);

	return !loading ? (
		<>
			<NavBar />
			<Fade down delay={1000} duration={1000}>
				<DivContent>
					<MainContent />
				</DivContent>
			</Fade>
			<Div
				bgposition={"top left"}
				bgsize={"850px"}
				bgimage={"/assets/images/landing-page/bg-1.png"}
			>
				<SoftwareKey benefits={benefits} />
			</Div>
			<Div>
				<ModulesDisplay stepers={stepers} />
			</Div>
			<Div className="text-center">
				<Title>Full featured policy administration</Title>
				<Image src={"/assets/images/landing-page/flow_chart_broker.png"} />
			</Div>
			<Div
				bgposition={"top right"}
				bgsize={"1080px"}
				bgimage={"/assets/images/landing-page/bg-2.png"}
			>
				<Fade left delay={700}>
					<CustomerService customer_service={customer_service} />
				</Fade>
				{/* <Fade delay={700}>
					<Plans right plans={plans} />
				</Fade> */}
			</Div>
			<Div
				padding={"50px 50px 0"}
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
			</Div>
			<Footer />
		</>
	) : (
		<Loader />
	);
};

//linear-gradient(69.83deg,#009933 0%,#65ee65 100%)
const DivContent = styled.div`
	padding: 50px;
	height: 39rem;
	width: 100%;
	background-image: url("/assets/images/banner_ft.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	@media (max-width: 767px) {
		background-image: none;
		height: auto;
	}
`;

const Div = styled.div`
	background-repeat: no-repeat;
	background-position: ${({ bgposition }) => bgposition};
	background-size: ${({ bgsize }) => bgsize};
	background-image: ${({ bgimage }) => `url(${bgimage})`};
	padding: ${({ padding }) => padding || "50px"};
	${({ padding }) => (padding ? `@media (max-width: 500px) {padding: 0}` : "")};
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

const Image = styled.img`
	height: auto;
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

const Title = styled.p`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.8rem + ${fontSize - 92}%)` : '2.8rem'};
	
	line-height: 1.2;
`;
