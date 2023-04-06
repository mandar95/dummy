import React from "react";
import styled from "styled-components";
import { Row, Col, Carousel } from "react-bootstrap";
import { useSelector } from "react-redux";

const Item = (content) => {
	const { globalTheme } = useSelector(state => state.theme)
	return (
		<Card bgColor="#f8f8ff" noShadow className="mb-5 p-4">
			<Row>
				<Col xs="8" sm="8" md="8" lg="8" xl="8">
					<p style={{ fontWeight: "600", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', margin: "6px 0" }}>
						{`Network Hospital`}
					</p>
					<p style={{ fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px', minHeight: '50px' }}>{content}</p>
				</Col>
				<Col
					xs="4"
					sm="4"
					md="4"
					lg="4"
					xl="4"
					className="d-flex justify-content-end align-content-center my-auto"
				>
					<img
						alt="hospital"
						src="/assets/images/hospital2.png"
						height="60"
						width="60"
					/>
				</Col>
			</Row>
		</Card>
	);
};

let content1 = `Your health insurance provider has a tie-up with certain hospitals, which are known as network hospitals.`;
let content2 = `Network hospital allows you to avail cashless medical treatment.`;

export const CarouselCard = () => {
	return (
		<Carousel
			fade={false}
			prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
			nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
			indicators={false}
		>
			<Carousel.Item interval={5000} >
				{Item(content1)}
			</Carousel.Item>
			<Carousel.Item interval={5000}>
				{Item(content2)}
			</Carousel.Item>
		</Carousel>
	);
};

export const Card = styled.div`
	height: 154px;
	border: ${({ border }) => border || "none"};
	border-radius: ${({ borderRadius }) => borderRadius || "20px"};
	background-color: ${({ bgColor }) => bgColor || "#ffffff"};
	transition: all 0.3s ease 0s;
	box-shadow: ${({ noShadow, boxShadow }) =>
		noShadow ? "none" : boxShadow || "1px 5px 14px 0px rgb(0 0 0 / 10%)"};
	width: ${({ width }) => width || "auto"};
	.cardwrap {
		padding: 1.5rem 0;
	}
	min-width: ${({ minWidth }) => minWidth || "min-content"};
	${({ margin, padding }) =>
		margin && padding
			? `margin: ${margin};
    padding: ${padding};
    @media (max-width: 768px) {
        margin: 0;
    }`
			: ""}
	${({ minHeight }) => (minHeight ? ` min-height: 100%;` : ``)}
`;
