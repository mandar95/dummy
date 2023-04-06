import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
// import { Row, Col } from "react-bootstrap";

const Container = styled.div`
	display: flex;
	align-items: stretch;
	justify-content: space-around;
	flex-flow: wrap;
	width: 100%;
	& .active {
		border: 1px solid #00ff3e !important;
	}
	& .active:before {
		width: 25px;
		height: 25px;
		font-family: FontAwesome;
		content: "\f00c";
		background: #00ff3e;
		position: absolute;
		right: -7px;
		top: -7px;
		border-radius: 50%;
		color: #fff;
		font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
		line-height: 24px;
	}
`;
const ImgDiv = styled.div`
	background: #a0d0cd45;
	height: 55px;
	width: 55px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Img = styled.img`
	height: 40px;
	width: 40px;
	margin: -4px 0px 0px 0px;
`;
const TitleDiv = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
	margin-top: 10px;
	& label {
		margin: 0px;
	}
`;

const ContentDiv = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
	color: #2a367596;
	overflow: auto;
	height: 120px;
	line-height: 19px;
	margin-top: 10px;
`;



const ContentDiv2 = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
	color: #2a367596;
	line-height: 19px;
	margin-top: 10px;
`;

const PriceDiv = styled.div`
	padding: 13px;
	background: #fde3f7;
	border-radius: 30px;
	color: #464646;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
`;

const ToggleCard = ({
	data,
	title,
	content,
	imgSrc,
	titleStyle,
	contentStyle,
	jsx,
	width,
	height,
	onClick,
	inputRef,
	inputName,
	setVal,
}) => {
	const cardStyle = {
		position: "relative",
		// padding: "15px 10px",
		padding: "10px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: width || "160px",
		height: height || "180px",
		textAlign: "center",
		margin: "10px",
		borderRadius: "10px",
		backgroundColor: "#ffffff",
		transition: "all 0.3s ease 0s",
		boxShadow: "0 10px 15px 6px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)",
	};
	const [activeCard, setActiveCard] = useState([]);
	const activeCardAction = (id) => {
		const valueCheck = activeCard.filter((item) => item === id);
		if (!_.isEmpty(valueCheck)) {
			setActiveCard(_.without(activeCard, id));
		} else {
			setActiveCard([...activeCard, id]);
		}
	};

	useEffect(() => {
		if (onClick) {
			onClick(activeCard);
		}
		// setVal(inputName, activeCard);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeCard]);


	//display array
	const display = ["Per Employee"];

	const displayFn = (type, waived) => {

		switch (type) {
			case "normal":
				return display[0];
			case "waiver":
				return waived ? "Yes" : "No";
			case "table":
				return display[0];
			default:
				return display[0];
		}
	};


	return (
		<>
			<Container>
				{(data || []).map(function (item) {
					return (
						<div
							className={
								!_.isEmpty(
									activeCard.filter(
										(elem) => elem === `${item?.id || 0}`
									)
								)
									? "active"
									: "inactive"
							}
							onClick={() => activeCardAction(item?.id || 0)}
							key={(item?.premium || item?.product_feature_id || item?.id) + 'checkbox'}
							style={cardStyle}
						>
							<ImgDiv>
								<Img src={item.imgSrc || "/assets/images/icon/life.png"}></Img>
							</ImgDiv>
							<TitleDiv>
								<label style={titleStyle}>
									{item?.product_feature_name || item.title}
								</label>
							</TitleDiv>
							<ContentDiv>
								<p style={contentStyle}>{item.content}</p>
							</ContentDiv>
							{item?.premium && <ContentDiv2 className="pt-4">
								<PriceDiv>
									₹&nbsp;{item?.premium}&nbsp;{displayFn(data?.type || "normal")}
								</PriceDiv>
							</ContentDiv2>}
						</div>
					);
				})}
			</Container>
			<input type="hidden" name={inputName} ref={inputRef} />
		</>
	);
};

export default ToggleCard;
