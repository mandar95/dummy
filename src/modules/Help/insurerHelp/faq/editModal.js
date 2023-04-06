import React, { useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Error } from "components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
	editINSFaq,
	updateINSFaq,
	clear,
	createInsFaq,
} from "../../help.slice";
import { insurer } from 'config/validations'

const validation = insurer.faq

const EditModal = (props) => {
	const dispatch = useDispatch();

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		question: yup.string().required("Please enter the question").min(2, 'Min 2 characters').max(validation.question, `Max ${validation.question} characters`),
		answer: yup.string().required("Please enter the answer").min(2, 'Min 2 characters').max(validation.answer, `Max ${validation.answer} characters`),
	});
	/*----x-----validation schema-----x----*/

	const { control, errors, handleSubmit, setValue, watch } = useForm({
		validationSchema,
	});

	const question = watch('question') || ''
	const answer = watch('answer') || ''


	const { editInsFaq, updateInsFaq } = useSelector((state) => state.help);

	// prefill
	useEffect(() => {
		dispatch(editINSFaq(props.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.id]);

	useEffect(() => {
		if (!_.isEmpty(editInsFaq)) {
			setValue("question", editInsFaq[0]?.question);
			setValue("answer", editInsFaq[0]?.answer);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editInsFaq]);

	//onSuccess
	useEffect(() => {
		if (updateInsFaq) {
			dispatch(createInsFaq(updateInsFaq));
			props.onHide();
		}
		return () => {
			dispatch(clear("update-Ins"));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateInsFaq]);

	const onSubmit = ({ question, answer }) => {
		dispatch(updateINSFaq(props.id, { questions: question, answers: answer }));
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="my-modal"
		>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col className='mt-2' md={12} lg={12} xl={12} sm={12}>
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
								as={<Form.Control as="textarea" maxLength={validation.question} rows="2" />}
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
								as={<Form.Control as="textarea" maxLength={validation.answer} rows="4" />}
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
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button buttonStyle="danger" onClick={props.onHide}>
						Close
					</Button>
					<Button type="submit">Update</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditModal;
