import React, { useState, useEffect, useCallback } from "react";
import * as yup from "yup";
// import PropTypes from 'prop-types';
import styled from "styled-components";
import _ from "lodash";
import { addDays, subDays, isAfter, isBefore, isEqual } from "date-fns";

import { Modal, Table, Form } from "react-bootstrap";
import { Button, Error, DatePicker } from "components";
import { useForm, Controller } from "react-hook-form";
import { numOnly, noSpecial } from "utils";
import { common_module } from 'config/validations'
import { Img } from 'components/inputs/input/style';
import { format } from 'date-fns'
import { DateFormate } from "../../../utils";

const validation = common_module.submit_claim

const validationSchema = yup.object().shape({
	bill_no: yup.array().of(yup.string().required("Bill No required")
		.min(validation.bill_no.min, `Minimum ${validation.bill_no.min} character required`)
		.max(validation.bill_no.max, `Maximum ${validation.bill_no.max} character available`)
		.matches(validation.bill_no.regex, 'Must contain only alphabets/numbers')),
	bill_amt: yup.array().of(yup.string().required("Amount required")
		.min(validation.claim_amt.min, `Minimum ${validation.claim_amt.min} character required`)
		.max(validation.claim_amt.max, `Maximum ${validation.claim_amt.max} character available`)),
	comment: yup.array().of(yup.string().required("Comment required")
		.min(validation.comment.min, `Minimum ${validation.comment.min} character required`)
		.max(validation.comment.max, `Maximum ${validation.comment.max} character available`)
		// .matches(validation.comment.regex, 'Must contain only alphabets')
	),
});

export const ReimbursementModal = (props) => {
	const blankForm = {
		bill_no: "",
		bill_date: "",
		bill_amt: "",
		comment: "",
		reimburment_type: "",
	};
	const updateState = useCallback(() => {
		let result = [];
		const value = props.data?.comment?.length || 1;
		for (let i = -1; i < value - 1; i++) {
			result = [...result, blankForm];
		}
		return result;
	}, [props, blankForm]);
	const [expenses, setExpenses] = useState(updateState());

	const { control, register, errors, handleSubmit, setValue, watch } = useForm({
		defaultValues: props.data || {},
		validationSchema
	});

	useEffect(() => {
		setExpenses(updateState());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const reimbursementType = (date, index) => {
		let type = "";
		if (date)
			if (props.type !== "opd") {
				if (
					(isEqual(new Date(date), new Date(DateFormate(props.minDate || '', { dateFormate: true }))) ||
						isAfter(new Date(date), new Date(DateFormate(props.minDate || '', { dateFormate: true })))) &&
					(isEqual(new Date(date), new Date(DateFormate(props.maxDate || '', { dateFormate: true }))) ||
						isBefore(new Date(date), new Date(DateFormate(props.maxDate || '', { dateFormate: true }))))
				) {
					type = "Hospitalization";
				} else if (
					isBefore(new Date(date), new Date(DateFormate(props.minDate || '', { dateFormate: true })))
				) {
					type = "Pre-hospitalization";
				} else if (
					isAfter(new Date(date), new Date(DateFormate(props.minDate || '', { dateFormate: true })))
				) {
					type = "Post-hospitalization";
				}
			} else {
				type = "opd";
			}
		setValue("reimburment_type." + index, type);
	};

	const addForm = () => {
		setExpenses([...expenses, { ...blankForm }]);
	};

	const removeBill = (id) => {
		let BillCopy = _.cloneDeep(expenses);

		BillCopy.splice(id, 1);

		setExpenses(BillCopy);
	};

	const onSubmit = (data) => {
		props.submitdata(data);
		props.onHide();
	};
	return (
		<Modal
			data={props.data}
			show={props.show}
			onHide={props.onHide}
			size="xl"
			fullscreen={"yes"}
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="fullscreen-modal fullscreen-modal-hosp"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<Head>Reimbursement Expenses</Head>
				</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Body className="text-center mr-5 ml-5">
					<Table
						className="text-center rounded text-nowrap"
						style={{ border: "solid 1px #e6e6e6" }}
						responsive
					>
						<thead>
							<tr>
								<th style={style} className="align-top">
									Bill No<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>
								{false /* ClaimSubType */ && <th style={style} className="align-top">
									{props.type !== "opd" ? "Reimbursement Type" : "Claim Type"}<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>}
								<th style={style} className="align-top">
									Bill Date<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>
								<th style={style} className="align-top">
									Claim Amount<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>
								<th style={style} className="align-top">
									Comment<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>
								{true /* ClaimSubType */ && <th style={style} className="align-top">
									{props.type !== "opd" ? "Reimbursement Type" : "Claim Type"}<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
								</th>}
								<th style={style} className="align-top">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{expenses?.map((val, index) => {

								const reimburment_type = watch(`reimburment_type.${index}`)

								return (
									<tr key={index + 'expenses'}>
										<td>
											<Controller
												as={
													<Form.Control
														className="rounded-lg"
														size="sm"
														type='text'
														// onKeyDown={numOnly} onKeyPress={noSpecial}
														// min={0}
														required
														maxLength={validation.bill_no.max}
														placeholder="Bill No"
													/>
												}
												name={`bill_no.${index}`}
												// isValid={errors.bill_no && errors.bill_no[index]}
												control={control}
												defaultValue={
													Object.keys(props.data).length ? props.data?.bill_no[index] : ""
												}
											/>
											{!!errors.bill_no && errors.bill_no[index] && <Error top='0'>
												{errors.bill_no[index].message}
											</Error>}
										</td>

										{false /* ClaimSubType */ && <td>

											{(props.type === "opd") ?
												<Controller
													as={
														<Form.Control
															className="rounded-lg"
															size="sm"
															type="text"
															required
															placeholder="Type"
															disabled
														/>
													}
													name={`reimburment_type.${index}`}
													// error={errors.reimburment_type && errors.reimburment_type[index]}
													control={control}
													defaultValue={'opd'
													}
												/>
												:
												<Form.Control required as="select" name={`reimburment_type.${index}`} ref={register} onChange={(e) => { setValue(`bill_date.${index}`, undefined); return e }}>
													<option value={''}>{'Select Type'}</option>
													{props?.claim_hospitalization_type.map(({ label }) => <option key={label + 'cover_type'} value={label}>{label}</option>)}
												</Form.Control>
											}

											{/* {!!errors.reimburment_type && errors.reimburment_type[index] && <Error top='0'>
												{errors.reimburment_type[index].message}
											</Error>} */}
										</td>}
										<td>
											<Controller
												as={
													<DatePicker
														{...extractValidation(reimburment_type, props.currentPolicyDetail, DateFormate(props.minDate), DateFormate(props.maxDate))}
														name={`bill_date.${index}`}
														label={'Date Range From'}
														required
														height='30px'
														noLabel
														margin={'0'}
													/>
												}
												name={`bill_date.${index}`}
												// isValid={errors.bill_no && errors.bill_no[index]}
												onChange={([selected]) => {
													(true /* ClaimSubType */ && reimbursementType(format(selected, 'yyyy-MM-dd'), index));
													(false /* ClaimSubType */ && props.type === "opd" && setValue(`reimburment_type[${index}]`, 'opd'));
													return selected ? format(selected, 'dd-MM-yyyy') : '';
													// return e;
												}}
												control={control}
											// defaultValue={
											// 	Object.keys(props.data).length ? props.data?.bill_date[index] : ""
											// }
											/>
											{/* {!!errors.bill_date && errors.bill_date[index] && <Error top='0'>
												{errors.bill_date[index].message}
											</Error>} */}
										</td>
										<td>
											<Controller
												as={
													<Form.Control
														className="rounded-lg"
														size="sm"
														type='tel'
														onKeyDown={numOnly} onKeyPress={noSpecial}
														required
														maxLength={validation.claim_amt.length}
														placeholder="Amount"
													/>
												}
												name={`bill_amt.${index}`}
												// isValid={errors.bill_amt && errors.bill_amt[index]}
												control={control}
												defaultValue={
													Object.keys(props.data).length ? props.data?.bill_amt[index] : ""
												}
											/>
											{!!errors.bill_amt && errors.bill_amt[index] && <Error top='0'>
												{errors.bill_amt[index].message}
											</Error>}
										</td>
										<td>
											<Controller
												as={
													<Form.Control
														className="rounded-lg"
														size="sm"
														type="text"
														required
														maxLength={validation.comment.max}
														placeholder="Comment"
													/>
												}
												name={`comment.${index}`}
												// isValid={errors.comment && errors.comment[index]}
												control={control}
												defaultValue={
													Object.keys(props.data).length ? props.data?.comment[index] : ""
												}
											/>
											{!!errors.comment && errors.comment[index] && <Error top='0'>
												{errors.comment[index].message}
											</Error>}
										</td>

										{true /* ClaimSubType */ && <td>
											<Controller
												as={
													<Form.Control
														className="rounded-lg"
														size="sm"
														type="text"
														required
														placeholder="Type"
														disabled
													/>
												}
												name={`reimburment_type.${index}`}
												// error={errors.reimburment_type && errors.reimburment_type[index]}
												control={control}
												defaultValue={
													Object.keys(props.data).length
														? props.data?.reimburment_type[index]
														: ""
												}
											/>
											{/* {!!errors.reimburment_type && errors.reimburment_type[index] && <Error top='0'>
												{errors.reimburment_type[index].message}
											</Error>} */}
										</td>}

										<td>
											<i
												className="btn ti-trash text-danger"
												onClick={() => removeBill(index)}
											/>
										</td>
									</tr>
								);
							})}
							<tr>
								<td colSpan="6">
									<i className="btn ti-plus text-success" onClick={addForm} />
								</td>
							</tr>
						</tbody>
					</Table>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit">Save</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

const style = {
	minWidth: "110px",
};

// DefaultTypes
ReimbursementModal.defaultProps = {
	props: { onHide: () => { } },
};

const Head = styled.span`
	text-align: center;
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
	
	letter-spacing: 1px;
	color: ${({ theme }) => theme?.Tab?.color || '#6334E3'};
`;

const extractValidation = (reimburment_type, currentPolicyDetail, minDate, maxDate) => {
	if (true /* ClaimSubType */) {
		return {
			minDate: new Date(currentPolicyDetail.start_date || '2000-01-01'),
			maxDate: (new Date() > new Date(currentPolicyDetail.end_date)) ? new Date(currentPolicyDetail.end_date) : new Date()
		}
	}
	if (reimburment_type === 'Pre-hospitalization') {
		return {
			minDate: (new Date(currentPolicyDetail.start_date || '2000-01-01') > subDays(new Date(minDate), 30)) ?
				new Date(currentPolicyDetail.start_date || '2000-01-01') : subDays(new Date(minDate), 30),
			maxDate: subDays(new Date(minDate), 1)
		}
	}
	if (reimburment_type === 'Post-hospitalization') {
		return {
			minDate: addDays(new Date(maxDate), 1),
			maxDate: (new Date() > new Date(currentPolicyDetail.end_date) || new Date() > addDays(new Date(maxDate), 60)) ?
				(addDays(new Date(maxDate), 60) > new Date(currentPolicyDetail.end_date) ? new Date(currentPolicyDetail.end_date) : addDays(new Date(maxDate), 60))
				: new Date()
		}
	}
	if (reimburment_type === 'Hospitalization') {
		return {
			minDate: new Date(minDate),
			maxDate: new Date(maxDate)
		}
	}

	return {
		minDate: new Date(currentPolicyDetail.start_date || '2000-01-01'),
		maxDate: (new Date() > new Date(currentPolicyDetail.end_date)) ? new Date(currentPolicyDetail.end_date) : new Date()
	}
}
