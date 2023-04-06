import React, { useEffect } from 'react'
import { Input, Error, TabWrapper, Tab } from 'components';
import { AdditionalInformationWrapper, Header, FormWrapper } from './styles';
import { Row, Col, Table, Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { Img } from '../../../../components/inputs/input/style';
import { Div } from '../premium-details/styles';
import swal from 'sweetalert';
import { numOnly, noSpecial, numOnlyWithPoint } from 'utils';
import { toWords } from '../../../../utils';

const style = { zoom: '0.9' }

const AdditionalInformation = ({
	/* savedConfig,  */control, errors, cdBalance, setCdBalance,
	setTab, tab, haveSubEntities, watch, setValue, employerCdStatement }) => {

	const cd_balance_threshold = watch('cd_balance_threshold');
	const inception_premium = watch('inception_premium');
	const inception_premium_installment = watch('inception_premium_installment');


	useEffect(() => {
		if (Number(inception_premium_installment) > 24) {
			swal('Validation', 'Inception Premium Installment Max 24 Allowed', 'info').then(() => {

				setValue('inception_premium_installment', '24')
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inception_premium_installment])

	const DisableInputs = !!employerCdStatement.length && employerCdStatement.some(({ cd_account_type }) => cd_account_type !== 1)

	return (
		<AdditionalInformationWrapper>
			<Header>
				<h6>Additional Information -</h6>
			</Header>
			<div style={style}>
				<TabWrapper width={'max-content'}>
					{(!employerCdStatement.length || employerCdStatement.every(({ cd_account_type }) => cd_account_type === 1)) && <Tab
						isActive={Boolean(tab === "policy")}
						onClick={() => setTab("policy")}>
						Policy Wise
					</Tab>}

					{(!employerCdStatement.length || employerCdStatement.some(({ cd_account_type }) => cd_account_type !== 1)) && <>
						{employerCdStatement.some(({ cd_account_type }) => cd_account_type === 3) && <Tab
							isActive={Boolean(tab === "branch")}
							onClick={() => setTab("branch")}>
							Entity Wise
						</Tab>}
						{haveSubEntities && employerCdStatement.some(({ cd_account_type }) => cd_account_type === 2) &&
							<Tab
								isActive={Boolean(tab === "group")}
								onClick={() => setTab("group")}>
								Group Wise<sub>(All Entities)</sub>
							</Tab>
						}
					</>}

				</TabWrapper>
			</div>
			<br />
			<FormWrapper>
				{['policy', 'group', 'branch'].includes(tab) &&
					<>
						<Row>
							<Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="Opening CD Balance"
										placeholder={DisableInputs ? '-' : "Enter Opening CD Balance"}
										type="number"
										disabled={DisableInputs}
										{...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
										min={0}
										required={false} />}
									error={errors && errors.cd_balance}
									onChange={([e]) => { setCdBalance(e.target.value); return e }}
									name="cd_balance"
									control={control} />
								{!!(cdBalance) &&
									<Error top='0' color={'blue'}>{toWords.convert(cdBalance)}</Error>}
								{!!errors.cd_balance && <Error>
									{errors.cd_balance.message}
								</Error>}
							</Col>
							<Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="CD Balance Threshold"
										placeholder={DisableInputs ? '-' : "Enter CD Balance Threshold"}
										type="number"
										disabled={DisableInputs}
										{...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
										min={0}
										max={cdBalance}
										required={false} />}
									error={errors && errors.cd_balance_threshold}
									onChange={([e]) => { return e }}
									name="cd_balance_threshold"
									control={control} />
								{!!(cd_balance_threshold) &&
									<Error top='0' color={'blue'}>{toWords.convert(cd_balance_threshold)}</Error>}
								{!!errors.cd_balance_threshold && <Error>
									{errors.cd_balance_threshold.message}
								</Error>}
							</Col>
						</Row>

						<Row>
							<Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="Inception Premium"
										placeholder={DisableInputs ? '-' : "Enter Inception Premium"}
										type="number"
										disabled={DisableInputs}
										{...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
										min={0}
										required={false} />}
									error={errors && errors.inception_premium}
									name="inception_premium"
									control={control} />
								{!!(inception_premium) &&
									<Error top='0' color={'blue'}>{toWords.convert(inception_premium)}</Error>}
								{!!errors.inception_premium && <Error>
									{errors.inception_premium.message}
								</Error>}
							</Col>
							{!!inception_premium && Number(inception_premium) > 0 && <Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="Inception Premium Installment"
										placeholder={DisableInputs ? '-' : "Enter Inception Premium Installment"}
										type="tel"
										onKeyDown={numOnly} onKeyPress={noSpecial}
										maxLength={2}
										disabled={DisableInputs}
										{...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
										required={false} />}
									error={errors && errors.inception_premium_installment}
									name="inception_premium_installment"
									control={control} />
								{!!errors.inception_premium_installment && <Error>
									{errors.inception_premium_installment.message}
								</Error>}
							</Col>}
						</Row>
						{!!inception_premium_installment && Number(inception_premium_installment) > 0 &&
							!!inception_premium && Number(inception_premium) > 0 &&
							<Div className="text-center" >
								<Table
									className="text-center rounded text-nowrap"
									style={{ border: "solid 1px #e6e6e6" }}
									responsive
								>
									<thead>
										<tr>
											<th style={style} className="align-top">
												Installment
											</th>
											<th style={style} className="align-top">
												Installment Amount<sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
											</th>
										</tr>
									</thead>
									<tbody>
										{[...Array(Number(inception_premium_installment))].map((_, index) =>

											<tr key={index + 'inception'}>
												<td>
													{index + 1} Installment
												</td>
												<td>
													<Controller
														as={
															<Form.Control
																className="rounded-lg"
																size="ms"
																type='tel'
																disabled={DisableInputs}
																{...DisableInputs && { labelProps: { background: 'linear-gradient(#ffffff, #dadada)' } }}
																onKeyDown={numOnlyWithPoint} onKeyPress={noSpecial}
																required
																maxLength={9}
																placeholder={DisableInputs ? '-' : "Installment Amount"}
															/>
														}
														name={`installment_amounts.${index}`}
														control={control}
													/>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</Div>
						}
					</>
				}
				{/* { tab === 'branch' && savedConfig.employer_child?.map(({ name }, index) => (
					<Fragment key={name + index}>
						<br />
						<Marker />
						<Typography>{'\u00A0'} {name}</Typography>
						<Row>

							<Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="Opening CD Balance"
										placeholder={DisableInputs? '-':"Enter Opening CD Balance"}
										type="number"
										min={0}
										required={false} />}
									error={errors && errors.employer_child_cd && errors.employer_child_cd[index] && errors.employer_child_cd[index].cd_amount}
									// onChange={([e]) => { setCdBalance(e.target.value); return e }}
									name={`employer_child_cd[${index}].cd_amount`}
									control={control} />
								{!!errors && errors.employer_child_cd && errors.employer_child_cd[index] && errors.employer_child_cd[index].cd_amount &&
									<Error>
										{errors.employer_child_cd[index].cd_amount.message}
									</Error>}
							</Col>

							<Col xl={4} lg={5} md={6} sm={12}>
								<Controller
									as={<Input
										label="CD Balance Threshold"
										placeholder={DisableInputs? '-':"Enter CD Balance Threshold"}
										type="number"
										min={0}
										// max={cdBalance}
										required={false} />}
									error={errors && errors.employer_child_cd && errors.employer_child_cd[index] && errors.employer_child_cd[index].cd_threshold}
									// onChange={([e]) => { return e }}
									name={`employer_child_cd[${index}].cd_threshold`}
									// name="cd_threshold"
									control={control} />
								{!!errors && errors.employer_child_cd && errors.employer_child_cd[index] && errors.employer_child_cd[index].cd_threshold &&
									<Error>
										{errors.employer_child_cd[index].cd_threshold.message}
									</Error>}
							</Col>
						</Row>
					</ Fragment>
				))} */}
			</FormWrapper>
		</AdditionalInformationWrapper>
	)
};

export default AdditionalInformation;
