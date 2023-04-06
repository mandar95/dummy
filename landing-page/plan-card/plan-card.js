import React, { useState } from "react";
import { Button } from "../../";
import styled from "styled-components";
import RateChart from "./rate-chart";
import { Button as Btn } from "react-bootstrap";
import OptionModal from "./option-modal";
import { useHistory } from "react-router-dom";
import { plandata } from "modules/proposal-page/proposal.slice";
import { useDispatch, useSelector } from "react-redux";

const PlanCard = (props) => {
	const Data = props?.data;
	const [modalShow, setModalShow] = useState(false);
	const [modalShow2, setModalShow2] = useState(false);
	const { globalTheme } = useSelector(state => state.theme)
	const history = useHistory();
	const dispatch = useDispatch();
	const path = history.location.pathname;

	const onSubmit = ({ subs_type }) => {
		let request = {
			subs_type: subs_type,
			path: path,
			id: Data?.id,
		};
		switch (subs_type * 1) {
			case 1:
				request = { ...request, amount: Data?.monthly_price };
				break;
			case 4:
				request = { ...request, amount: Data?.quaterly_price };
				break;
			case 6:
				request = { ...request, amount: Data?.half_yearly_price };
				break;
			case 12:
				request = { ...request, amount: Data?.yearly_price };
				break;
			default:
				request = { ...request, amount: Data?.yearly_price };
				break;
		}
		dispatch(plandata(request));
		history.push("/proposal-page");
	};

	return (
		<>
			<DashboardCard hex1={Data?.hex1} hex2={Data?.hex2}>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<LabelDiv
						labelStyle={{ labelcolor: Data?.hex1, bgcolor: Data?.hex2 }}
						className="py-1 px-3"
					>
						<span className="px-1">{`${Data?.name || ""} Plan`}</span>
					</LabelDiv>
				</div>
				<h6>{`₹ ${Data?.price || "N/A"}`}</h6>
				<p
					style={{
						marginTop: "20px",
						marginBottom: "20px",
						minHeight: "105px",
						maxHeight: "105px",
						overflow: "auto",
					}}
				>
					{`${
						Data?.description ||
						`lorem ipsum,lorem ipsumlorem ipsum,lorem ipsum,lorem ipsum,lorem
      ipsumlorem ipsum,lorem ipsum,lorem ipsum,lorem ipsumlorem ipsum,lorem
      ipsum`
					}`}
				</p>
				<div style={{ marginTop: "40px", marginBottom: "20px" }}>
					{Data?.button_url ? (
						<a
							href={Data?.button_url ? Data?.button_url : "/broker"}
							target="_blank"
							style={{ textDecoration: "none" }}
							rel="noopener noreferrer"
						>
							<Button
								hex1={Data?.hex1}
								hex2={Data?.hex2}
								buttonStyle="outline-solid"
								style={{ paddingTop: "15px", paddingBottom: "15px" }}
							>
								<span style={{ fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px', fontWeight: "600" }}>Choose Plan</span>
							</Button>
						</a>
					) : (
						<Button
							hex1={Data?.hex1}
							hex2={Data?.hex2}
							buttonStyle="outline-solid"
							style={{ paddingTop: "15px", paddingBottom: "15px" }}
							onClick={() => setModalShow2(true)}
						>
							<span style={{ fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px', fontWeight: "600" }}>Choose Plan</span>
						</Button>
					)}
				</div>
				<Btn onClick={() => setModalShow(true)} variant="link">
					<p
						style={{
							marginTop: "10px",
							marginBottom: "10px",
							fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
						}}
					>
						See Details
					</p>
				</Btn>
			</DashboardCard>
			<RateChart data={Data} show={modalShow} onHide={() => setModalShow(false)} />
			<OptionModal
				show={modalShow2}
				onSubmit={onSubmit}
				onHide={() => setModalShow2(false)}
			/>
		</>
	);
};

const DashboardCard = styled.div`
  background: #ffffff;
  box-shadow: 2px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 40px 10px 20px;
  height: 100%;
  width: auto;
  & + h4,
  h5 {
    color: #6c6c6c;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.18em + ${fontSize - 92}%)` : '1.18em'};
  }
  & + h5 {
    display: block;
  }
  h6 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(4.5em + ${fontSize - 92}%)` : '4.5em'};
    line-height: 104px;
    border-bottom:0.2px solid #D0D0D0;
    ${({ hex1, hex2 }) => {
					return `
           background: -webkit-linear-gradient(${hex1 || "#0084f4"}, ${
						hex2 || "#00c48c"
					});
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
             `;
				}}

  }
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    content: "";
    ${({ hex1, hex2 }) => {
					return `
           background: linear-gradient(69.83deg, ${hex1 || "#0084f4"} 0%, ${
						hex2 || "#00c48c"
					} 100%);
             `;
				}}}
  
`;

const LabelDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  filter:brightness(100%);
  ${({ labelStyle }) => {
			return `
        background-color: ${labelStyle?.bgcolor || "#0084f4"}
           `;
		}}

  text {
    ${({ labelStyle }) => {
					return `
           color:${labelStyle?.labelcolor || "blue"}
             `;
				}}}
    opacity:1;
  
`;

export default PlanCard;
