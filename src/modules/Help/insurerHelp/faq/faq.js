import React, { useEffect, useState } from "react";
import { Card, Button, Error } from "components";
import { Row, Col, Form, Button as Btn } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createINSFaq, getInsFaq, clear } from "../../help.slice";
import swal from "sweetalert";
import AddFaq from "./AddFAQ";
import Table from "./table";
import { insurer } from 'config/validations'

const validation = insurer.faq

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	question: yup.string().required("Please enter the question").min(2, 'Min 2 characters').max(validation.question, `Max ${validation.question} characters`),
	answer: yup.string().required("Please enter the answer").min(2, 'Min 2 characters').max(validation.answer, `Max ${validation.answer} characters`),
});
/*----x-----validation schema-----x----*/

const FAQ = ({ currentUser, userType, myModule }) => {
	const dispatch = useDispatch();
	const { insurerFaq, createInsFaq } = useSelector((state) => state.help);
	const [show, setShow] = useState(false);
	const { control, handleSubmit, setValue, errors, watch } = useForm({
		validationSchema,
	});

	const question = watch('question') || ''
	const answer = watch('answer') || ''

	//load data
	useEffect(() => {
		if (currentUser?.ic_id || currentUser?.broker_id)
			dispatch(getInsFaq(userType === 'broker' ?
				{ broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	//on success
	useEffect(() => {
		if (createInsFaq) {
			swal(createInsFaq, "", "success").then(() => dispatch(getInsFaq(
				userType === 'broker' ?
					{ broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }
			)));
		}

		return () => {
			dispatch(clear("Ins"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [createInsFaq]);

	const resetValues = () => {
		setValue([{"question": ""},{"answer": ""}]);
	};

	const onSubmit = ({ question, answer }) => {
		dispatch(createINSFaq({
			questions: question, answers: answer,
			...userType === 'broker' ?
				{ broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }
		}));
		resetValues();
	};

	return (
		<>
			{!!myModule?.canwrite && <Card
				title={
					<div className="d-flex justify-content-between">
						<span>FAQ Configurator</span>
						<div>
							<Btn
								size="sm"
								onClick={() => {
									setShow(true);
								}}
								className="shadow-sm m-1 rounded-lg"
							>
								<strong>Add FAQ's +</strong>
							</Btn>
						</div>
					</div>
				}
			>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col md={12} lg={12} xl={12} sm={12}>
							<div style={
								{
									position: 'absolute',
									right: '15px',
									top: '-20px',
									background: '#e2e2e2',
									padding: '0px 5px',
									borderRadius: '3px'
								}
							}>
								{`${question.length} / ${validation.question}`}
							</div>
							<Controller
								as={<Form.Control as="textarea" rows="2" maxLength={validation.question} />}
								// defaultValue={question}
								name="question"
								control={control}
							/>
							<label className="form-label">
								<span className="span-label">
									Question
									<sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
								</span>

							</label>
							{!!errors?.question && (
								<Error className="pt-3">{errors?.question?.message}</Error>
							)}
						</Col>

						<Col md={12} lg={12} xl={12} sm={12} className="mt-5">
							<div style={
								{
									position: 'absolute',
									right: '15px',
									top: '-20px',
									background: '#e2e2e2',
									padding: '0px 5px',
									borderRadius: '3px'
								}
							}>
								{`${answer.length} / ${validation.answer}`}
							</div>
							<Controller
								as={<Form.Control as="textarea" rows="4" maxLength={validation.answer} />}
								// defaultValue={answer}
								name="answer"
								control={control}
							/>
							<label className="form-label">
								<span className="span-label">
									Answer
									<sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
								</span>
							</label>
							{!!errors?.answer && (
								<Error className="pt-3">{errors?.answer?.message}</Error>
							)}
						</Col>
						<Col
							sm="12"
							md="12"
							lg="12"
							xl="12"
							className="d-flex justify-content-end mt-3"
						>
							<Button type="submit" variant="success">
								Submit
							</Button>
						</Col>
					</Row>
				</Form>
			</Card>}
			<Card title="View">
				<Table myModule={myModule} data={insurerFaq || []} />
			</Card>
			<AddFaq show={show} onHide={() => setShow(false)}
				userType={userType} currentUser={currentUser} />
		</>
	);
};

export default FAQ;
