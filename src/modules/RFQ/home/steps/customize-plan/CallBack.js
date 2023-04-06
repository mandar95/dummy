import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Title, Card } from "../../../select-plan/style";
import { RFQButton } from "components";
import { Col/* , FormControl */ } from "react-bootstrap";
// import { Input } from "../../style";

import { SendQuotes } from "./Popup/SendQuotes";
import { createCallback, clear } from "../../home.slice";

export default function CallBack({ prefill }) {
	const [sendQuotes, setSendQuotes] = useState(false);
	const dispatch = useDispatch();

	const { callbackSuccess } = useSelector((state) => state.RFQHome);

	useEffect(() => {
		if (sendQuotes === 'call')
			dispatch(createCallback({
				callback_number: prefill.contact_no,
				lead_id: prefill.id
			}))
		return () => {
			dispatch(clear('callbackSuccess'));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sendQuotes])

	return (
		<>
			{/* <Card
				border="1px solid #0404042e"
				className="mb-5 p-4 text-center"
				noShadow
				bgColor="#fff"
			>
				<img
					src="/assets/images/RFQ/call-center.png"
					width="120px"
					alt="call back"
				/>
				<Title fontSize="1.3rem" color="#1d1d1d">
					Schedule a Call Back
				</Title>

				<Input>
					<Input.Prepend>
						<Input.Text>+91</Input.Text>
					</Input.Prepend>
					<FormControl
						id="inlineFormInputGroup"
						placeholder="Enter your mobile number"
						defaultValue={prefill?.contact_no || ""}
					/>
				</Input> */}
			<Col md={12} lg={6} xl={3} sm={12} className="mb-3">
				<RFQButton
					// width="175px"
					// height="45px"
					width="100%"
					height="59px"
					variant={'bulgy'}
					onClick={() => setSendQuotes('call')}
				>
					Call Me
				</RFQButton>
			</Col>
			{/* <br />
			 <Title fontSize="1.1rem" color="#1d1d1d">
			 	Or
			 </Title>
			 <br /> */}
			<Col md={12} lg={6} xl={3} sm={12} className="mb-3">
				<RFQButton
					variant={'bulgy1'}
					// width="175px" 
					// height="45px" 
					width="100%"
					height="59px"
					onClick={() => setSendQuotes('email')}>
					Send Quotes
				</RFQButton>
			</Col>

			{!!sendQuotes && (
				<SendQuotes
					show={!!sendQuotes}
					onClose={setSendQuotes}
					type={sendQuotes}
					mobile={prefill?.contact_no || ""}
					email={prefill?.work_email || ''}
					callbackSuccess={callbackSuccess}
				/>
			)}
			{/* </Card> */}
		</>
	);
}
