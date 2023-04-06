import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { getaboutUs } from "../../../modules/landing-page/employerLanding.slice";
import _ from "lodash";

const AboutUs = () => {
	const dispatch = useDispatch();
	const { globalTheme } = useSelector(state => state.theme)
	const response = useSelector((state) => state.employerHome);
	const Data =
		!_.isEmpty(response?.aboutUsResp?.data?.data) &&
		response?.aboutUsResp?.data?.data;

	//api call----------------
	useEffect(() => {
		dispatch(getaboutUs());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//------------------------

	return (
		<Row style={{ padding: "20px" }} className="d-flex flex-wrap">
			<Col xs={11} sm={11} md={6} lg={6} xl={6}>
				<div>
					<img
						src="/assets/images/logo.png"
						alt="logo"
						width="200"
						height="50"
					/>
				</div>
				<div
					style={{
						paddingTop: "10px",
					}}
				>
					<span style={{ textAlign: "center" }}>devendra.b@fyntune.com</span>
				</div>
			</Col>
			<Col xs={11} sm={11} md={6} lg={6} xl={6} className="d-flex flex-wrap">
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Row>
						<span style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>About Us</span>
					</Row>
					{Data ? (
						Data?.map((item) => (
							<React.Fragment key={item?.id + '-about-us'}>
								<a
									href={item?.url ? item?.url : "/broker"}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Row>{item?.name || "N/A"}</Row>
								</a>
							</React.Fragment>
						))
					) : (
						<noscript />
					)}
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Row>
						<span style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px' }}>
							<a
								href="https://www.fyntune.com/contact.html"
								style={{ textDecoration: "none", color: 'black' }}
							>
								Contact Us
							</a>
						</span>
					</Row>
					<Row style={{ color: "#007bff" }}>
						4th Floor, Akshar Blue Chip IT Park, Turbhe MIDC, Turbhe, Navi Mumbai,
						Maharashtra 400705
					</Row>
				</Col>
			</Col>
		</Row>
	);
};

export default AboutUs;
