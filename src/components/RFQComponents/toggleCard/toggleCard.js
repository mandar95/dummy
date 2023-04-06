import React, { useState, useEffect } from "react";
import styled from "styled-components";
import './toggleCard.css'

const Container = styled.div`
	display: flex;
	align-items: stretch;
	justify-content: center;
	flex-flow: wrap;
	width: 100%;
	& .active {
		border: 1px solid #1bf29e !important;
	}
	& .active:before {
		width: 25px;
		height: 25px;
		font-family: FontAwesome;
		content: "\f00c";
		background: #1bf29e;
		position: absolute;
		right: -7px;
		top: -7px;
		border-radius: 50%;
		color: #fff;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
		line-height: 24px;
	}
	.cardStyle{
		${({ cardStyle }) => cardStyle}
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin: 20px;
		border-radius: 10px;
		background-color: #ffffff;
		transition: all 0.3s ease 0s;
		box-shadow: 0 10px 15px 6px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
		cursor: pointer;
	}
	@media (max-width: 1137px) {
		justify-content: center;
	}
`;
const ImgDiv = styled.div`
	// background: #a0d0cd45;
	height: ${({ imageDivSize }) => imageDivSize || '55px'};
	width: ${({ imageDivSize }) => imageDivSize || '55px'};
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center !important;
`;

const Img = styled.img`
	height: ${({ imageSize }) => imageSize || '60px'};
	width: ${({ imageSize }) => imageSize || '60px'};
	margin: 10px 0px 0px 0px;
`;
const TitleDiv = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
	margin-top:10px;
	& label {
		margin: 0px;
		cursor: pointer;
	}
`;

const ContentDiv = styled.div`
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
	color: #2a367596;
	// line-height: 18px;
	/* margin-top: 10px; */
	/* max-Height:130px; */
	overflow:hidden;	
`;

// const ContentDiv2 = styled.div`
// 	font-size: 13px;
// 	color: #2a367596;
// 	line-height: 19px;
// 	margin-top: 10px;
// `;
const PriceDiv = styled.div`
    padding: 13px;
    background: #fde3f7;
    border-radius: 30px;
    color: #464646;
		font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
`


const ToggleCard = ({
	data,
	titleStyle,
	contentStyle,
	ContainerStyle,
	inputName,
	inputRef,
	setVal,
	width,
	height,
	padding,
	titleDivStyle,
	isDisabled,
	watch,
	imageDivSize,
	imageSize }) => {

	const cardStyle = {
		width: width || "160px",
		height: height || "180px",
		padding: padding || '20px 30px'
	};

	const activeValue = watch(inputName);

	const [activeCard, setActiveCard] = useState("");
	const activeCardAction = (id) => {
		setActiveCard(id);
		setVal(inputName, id)
	};

	// useEffect(() => {
	// 	data.forEach(({ isActive, id }) => {
	// 		if (isActive) setActiveCard(id);
	// 	});
	// }, [data]);
	useEffect(() => {
		activeCardAction(activeValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeValue])

	// display array
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
			<Container style={ContainerStyle} cardStyle={cardStyle} className={isDisabled ? "disabledDiv" : ""} >
				{(data || []).map(function (item) {
					return (
						// <div className='wrapper'>
						<div
							className={(parseInt(activeCard) === parseInt(item.id) ? "active" : "") + ' cardStyle'}
							onClick={() => activeCardAction(item.id)}
							key={item.id + 'togle-card'}
						// style={cardStyle}
						>
							<ImgDiv imageDivSize={imageDivSize}>
								<Img imageSize={imageSize} src={item.imgSrc || "/assets/images/icon/life.png"}></Img>
							</ImgDiv>
							<TitleDiv style={{ ...titleDivStyle, ...!!item.titleColor && item.titleColor }}>
								<label style={titleStyle}>{item?.product_feature_name || item.title}</label>
							</TitleDiv>
							<ContentDiv>
								<p style={contentStyle}>{item.content}</p>
							</ContentDiv>
							{
								(item?.price || item?.premium) && <ContentDiv>
									<PriceDiv>₹&nbsp;{item?.premium || item.price}&nbsp;{displayFn(data?.type || "normal")}</PriceDiv>
								</ContentDiv>
							}
						</div>
						// </div>
					);
				})}
			</Container>
			<input
				type="hidden"
				name={inputName}
				id={inputName}
				ref={inputRef}
			// value={activeCard}
			/>
		</>
	);
};

export default ToggleCard;
