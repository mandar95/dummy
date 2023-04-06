// /* eslint-disable */
import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { /* useParams,  */useHistory, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import { IconlessCard, Button, TabWrapper, Tab, Loader } from '../../../components';
import { FlexSummary } from './employee.flexsummary';
import {
	getEmployeeWidgetData,
	selectEmployeeWidgetResponse, getFlexPolicy, clear, submitFlexPolicy, employeeFlexPolicies
} from '../flexbenefit.slice';
import { postFlexBenefitTransaction } from '../serviceApi';
import { Modal, Col } from 'react-bootstrap';
import swal from "sweetalert";
import { Input } from '../../../components'
import PlanBenefits from "./modal";
import { /*InverserCalculateOptionPremium,*/ PackageUpdate, SeperateOpd, shouldHidePremium } from './package_update2';

import { useForm } from "react-hook-form";
import { employeeDashboard, getEmployeePolicies } from '../../dashboard/Dashboard.slice';
import { RightContainer } from '../../core/layout/Layout';
import { EmployeeSummary } from '../../dashboard/EmployeeSummary';
import { Declaration, onChangeHandler } from './helper';
import { OptionInput } from "modules/RFQ/home/style";
import { comma } from 'modules/enrollment/NewDesignComponents/ForthStep';
import { ModuleControl } from '../../../config/module-control';

const Title = ({ text, image = "" }) => {
	return (<>
		<img src={`${image || "/assets/images/car.png"}`} alt="?" style={{ width: "50px", height: "42px" }} />
		<span className="font-weight-light small">{text}</span>
	</>)
}

const styles = {
	margin: "0em 0em",
	position: "relative",
	top: "-2px",
	minHeight: "300px",
	// paddingLeft: "0.5em",
}

const isHowden = ModuleControl.isHowden

export const EmployeeFlexBenefit = () => {
	const history = useHistory();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const showOldFlex = query.get("showoldflex")
	const [tab, setTab] = useState((!ModuleControl.HideOldFlex || showOldFlex) ? 'Insurer' : 'Flex Summary');
	const [show, setShow] = useState(false);
	const [modalDetails, setDetails] = useState({});
	const [value, setValue] = useState('');
	const dispatch = useDispatch();
	const widgetData = useSelector(selectEmployeeWidgetResponse);
	const { FlexPolicies, plan_policies, success, error, loading, loadingW } = useSelector((state) => state.flexbenefit);
	const { currentUser } = useSelector((state) => state.login);
	const { globalTheme: theme } = useSelector(state => state.theme)
	// let cardRef = useRef(null);
	const [viewIndex, setView] = useState([]);
	const [_show, set_Show] = useState(false);
	const [otherPremiums, setOtherPremiums] = useState(0)
	const [mandatory, setMandatory] = useState([]);
	const { employeeDashboardSummary, summaryPremium, summaryFlex, loading: dashoardLoading /* nomineeSummary */ } = useSelector(
		(state) => state.dashboard
	);

	const { handleSubmit, control, watch, register, setValue: formSetValue } = useForm({

	});

	const [totalPremium, setTotalPremium] = useState([]);
	const [totalSumInsured, setTotalSumInsured] = useState([]);

	const [BuyPremium, setBuyPremium] = useState([]);
	const [BuySumInsured, setBuySumInsured] = useState([]);
	const [key, setKey] = useState([]);
	const [updateFlag, setUpdateFlag] = useState(0);
	const { globalTheme } = useSelector(state => state.theme)


	const { group_cover: groupcover = [], voluntary_cover: voluntarycover = [] } =
		useSelector(getEmployeePolicies) || {};

	const policies = [...groupcover, ...voluntarycover]

	useEffect(() => {
		dispatch(getEmployeeWidgetData());
		dispatch(getFlexPolicy())
		dispatch(employeeFlexPolicies())

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (currentUser?.id) {
			dispatch(employeeDashboard(currentUser));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	useEffect(() => {
		if (policies.length) {
			const otherPremium = policies?.filter(
				(elem) =>
					// elem?.policy_sub_type_id <= 3 &&
					((elem?.is_flex_policy && elem?.policy_rater_type_id === 5) || !elem?.is_flex_policy /* || !!elem.is_parent_policy */)
			).reduce((total, elem) => total + Number(elem.premium), 0);
			otherPremium && setOtherPremiums(otherPremium)

			// dispatch(loadAllSalaryDeduction(policy))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [policies])


	useEffect(() => {
		if (!loading && (!FlexPolicies.length ||
			FlexPolicies.every(({ enrollement_start_date, enrollement_end_date }) =>
				!(enrollement_start_date || enrollement_end_date) || ((enrollement_start_date && enrollement_end_date) &&
					(new Date(enrollement_start_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ||
						new Date(enrollement_end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))))) {
			setTab('Flex Summary')
		}
		if (FlexPolicies.length) {
			setKey(FlexPolicies.map(() => true))
		}
	}, [loading, FlexPolicies])

	useEffect(() => {
		if (!loadingW && !widgetData.length && !FlexPolicies.length && !loading) {
			setTab('Flex Summary')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadingW, widgetData, loading])

	useEffect(() => {
		if (success) {
			swal(success, "", "success")
		}
		if (error) {
			swal("Alert", error, "warning");
		}

		return () => { dispatch(clear()) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, error])

	useEffect(() => {
		setBuyPremium(totalPremium.reduce((total, premium, index) => total + ((key[index] && Number(premium)) ? Number(premium) : 0), 0));
		setBuySumInsured(totalSumInsured.reduce((total, premium, index) => total + ((key[index] && Number(premium)) ? Number(premium) : 0), 0));
	}, [key, totalPremium, totalSumInsured])

	const openModal = (id, name, image, amount, flexi_benefit_price, allocationType) => {
		setValue(0);
		let splitAmount = !amount ? [] : amount.split(",");
		setDetails({
			flexi_benefit_id: id,
			name, image,
			amount: splitAmount,
			amountLength: splitAmount.length,
			flexi_benefit_price: flexi_benefit_price,
			allocationType
		});
		setShow(true);
	}
	const handleClose = () => { setShow(false) }
	const onValueChange = (e) => { setValue(Number(e.target.value)) }
	const onSubmit = (e) => {
		e.preventDefault()
		handleClose();
		postFlexBenefitTransaction({ flex_amount: modalDetails.flexi_benefit_price ? modalDetails.flexi_benefit_price : value, flexi_benefit_id: modalDetails?.flexi_benefit_id }).then(res => {
			if (res.data?.status) {
				swal(res.data?.message, "", "success");
				dispatch(getEmployeeWidgetData());
			}
			else {
				swal(res.data?.message, "", "warning");
			}
		})
	}

	const storeIndex = (i) => {
		let value = [...viewIndex, i];
		setView(value);
	}

	const removeIndex = (i) => {
		let value = viewIndex;
		value.splice(value.indexOf(i), 1);
		setView(value);
	}



	const onSubmitnew = ({ flex }) => {
		/* Howden Specific 
			OPD
			Parent
		*/

		const isRakuten = isHowden &&
			(currentUser?.company_name || '').toLowerCase().startsWith('rakuten');
		const isPersistent = isHowden &&
			(currentUser?.company_name || '').toLowerCase().startsWith('persistent');
		const isPearson = isHowden &&
			(currentUser?.company_name || '').toLowerCase().startsWith('pearson');
		const isRobin = isHowden &&
			(currentUser?.company_name || '').toLowerCase().startsWith('robin software development');

		let declarationType = ''
		if (isRakuten) {
			declarationType = 'rakuten';
		}
		if (isPersistent) {
			declarationType = 'persistent';
		}
		if (isPearson) {
			declarationType = 'pearson';
		}
		if (isRobin) {
			declarationType = 'robin software development';
		}

		const CompanyDeclaration = Declaration[declarationType] || {};

		if (mandatory.length !== CompanyDeclaration?.finalDeclaration?.filter(({ is_mandatory }) => is_mandatory).length && (isRakuten || isPersistent || isPearson || isRobin) &&
			!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums)))) {
			swal("Please agree all terms and condition to proceed", "", "warning");
			return null
		}

		let response = []
		FlexPolicies.forEach((v, index) => {
			if (v.is_parent_policy === 1 && v.adult_count === 0) {
				return false
			}
			if (key[index]) {

				const UdaanLogicActivateHidePremium = isHowden &&
					((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('robin software development') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('rakuten')) && !!v.salary?.length;

				const PearsonLogicActivateHidePremium = isHowden && (currentUser?.company_name || '').toLowerCase().startsWith('pearson') && !!v.salary?.length;

				const permilySalary = v?.relation_wise_si_gpa?.length;
				const enhanceKey = v?.enhance_suminsureds?.length;
				const flexiKey = typeof v?.flex_sum_insured_value === "object" && v?.flex_sum_insured_value;
				let [base_suminsured = v.current_cover,
					base_premium = permilySalary ? 0 : enhanceKey ? v?.enhance_premiums?.[v?.enhance_suminsureds?.findIndex(({ sum_insured }) => Number(sum_insured) === Number(v.current_enhance_cover))]?.total_premium || 0 : (flexiKey ?
						((UdaanLogicActivateHidePremium && shouldHidePremium(v, v.current_cover, PearsonLogicActivateHidePremium ? 2 : 3)) ? 0 : v.flex_employee_premium[v?.flex_sum_insured_value.indexOf(v.current_cover)]) :
						v.grade_premium[v.grade_suminsured.indexOf(v.current_cover)]?.family_premium)]
					= (flex[index]?.premium || '')?.split(',');
				const feature_ids = flex[index]?.parent?.filter(({ child }) => !!child).map(({ child }) => Number(child)) || []
				const benefit_ids = flex[index]?.parent?.filter(({ id }) => !!id).map(({ id }) => Number(id)) || []

				if (!base_suminsured && !enhanceKey) {
					base_suminsured = v.current_cover
				}
				let AllFeatures = [];

				v.benefits.forEach(({ features, benefit_name }) =>
					features.forEach((elem) =>
						AllFeatures.push({
							...elem,
							is_opd: (benefit_name.toLowerCase()).includes('opd') ? 1 : 0,
							is_parent_premium: (!!Number(elem.has_capping_data) && elem.capping_data?.length) ? 1 : 0
						})));

				const empPremiumIndex = v?.flex_employee_premium && v?.flex_employee_premium?.indexOf(Number(base_premium));
				const final_employer_premium = (flexiKey ?
					v?.flex_employer_premium?.[empPremiumIndex] :
					v.grade_premium[v.grade_suminsured.indexOf(Number(base_suminsured))]?.total_employer_premium) || 0;

				// Udaan Logic
				let udaanPremium = 0
				const UdaanLogicActivate = v.policy_rater_type_id === 5 &&
					isHowden &&
					((currentUser?.company_name || '').toLowerCase().startsWith('udaan') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('granary wholesale private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('grantrail wholesale private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop capital private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('stacktrail cash and carry private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop technology private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('hiveloop logistics private limited') ||
						(currentUser?.company_name || '').toLowerCase().startsWith('indusage techapp private limited'));
				if (UdaanLogicActivate) {
					if (v.adult_count === 1 && (v.child_count === 0 || !!v.child_count)) {
						udaanPremium = -4000;
					}
					if (((v.no_of_parents || 0) + (v.no_of_parent_in_laws || 0)) === 0 && !!(v.adult_count > 1 || v.child_count)) {
						udaanPremium = -2500;
					}
				}

				let no_of_times_salary = null;
				if (v.salary?.length && !enhanceKey) {
					no_of_times_salary = v.salary[v.flex_sum_insured_value?.indexOf(Number(base_suminsured || v.current_cover))]
				}


				const final_employee_premium = Number(base_premium) + udaanPremium;
				(base_suminsured || v.current_cover || 0) &&
					response.push({
						policy_id: v.id,
						...(v.current_self_member_id && { member_id: v.current_self_member_id }),
						employee_id: currentUser?.employee_id,
						...(permilySalary ? {
							relation_detail: v?.relation_wise_si_gpa.map(({ relation_id, suminsureds }) => {


								const { employee_premium = [], employer_premium = [] } = v.relation_wise_pi_gpa.find((elem) => relation_id === elem.relation_id) || {};
								const indexOfSI = v?.relation_wise_si_gpa?.find(({ relation_id }) => relation_id === 1)?.suminsureds.findIndex((value) => value === Number(base_suminsured))

								return {
									relation_id,
									suminsured: suminsureds[indexOfSI],
									employer_premium: employer_premium[indexOfSI],
									employee_premium: employee_premium[indexOfSI],
									premium: Number(employer_premium[indexOfSI]) + Number(employee_premium[indexOfSI])
								}
							})
						} :
							(enhanceKey && Number(base_suminsured)) ? {
								enhance_suminsured: base_suminsured || 0, // base suminsed
								enhance_employee_premium: final_employee_premium || 0,
								enhance_employer_premium: final_employer_premium || 0,
								enhance_premium: (Number(final_employee_premium) + Number(final_employer_premium) || 0)
							} : {
								final_base_cover: base_suminsured || v.current_cover || 0, // base suminsed
								final_employee_premium,
								final_employer_premium: Number(final_employer_premium) + (UdaanLogicActivateHidePremium ? Number(v.intial_premium || 0) : 0),
								final_base_premium: Number(final_employee_premium) + Number(final_employer_premium) + (UdaanLogicActivateHidePremium ? Number(v.intial_premium || 0) : 0),
							}),
						...SeperateOpd({
							totalPremium: totalPremium[index], totalSumInsured: totalSumInsured[index],
							base_premium, base_suminsured,
							AllFeatures, feature_id: feature_ids,
							v
						}),

						...benefit_ids?.length && { benefit_ids: benefit_ids },
						...feature_ids?.length && { feature_ids: feature_ids },
						...(no_of_times_salary) && { no_of_times_salary: Number(no_of_times_salary.no_of_times_of_salary) }
					})
			}
		})
		dispatch(submitFlexPolicy({
			flexi_data: response
		}, currentUser))

	}

	const AllowedSubmit = (/* isLocal || */ ((FlexPolicies.every(({ benefit_ids, already_purchased }) => !benefit_ids && already_purchased !== 2) ||
		FlexPolicies?.[0]?.employee_policy_confirmation === 0) && FlexPolicies?.[0]?.enrollment_window === 1));

	return (loading || loadingW) ? <Loader /> : (
		<>
			<Modal show={show} onHide={handleClose} dialogClassName="my-modal">
				<Modal.Header closeButton>
					<Modal.Title><Title text={modalDetails?.name} image={modalDetails?.image} /></Modal.Title>
				</Modal.Header>
				<form onSubmit={onSubmit}>
					<Modal.Body>
						<div className="px-2">
							<p style={{ color: "#6334E3", letterSpacing: "0.1em" }}>Allocate</p>
							<div className="row">
								{modalDetails.amountLength > 1 ?
									modalDetails.amount.map((val, id) =>
										<div className="col-6" key={id + 'modal-detail'}>
											<div>
												<label className="d-flex">
													<input
														type="radio"
														style={{ padding: "0em !important", margin: "0em !important", width: "10%" }}
														checked={Boolean(value === Number(val))}
														value={val}
														onChange={onValueChange}
													/>
													&#8377; {val}
												</label>
											</div></div>)
									: <>
										<div className="col-12"><Input label="Amount"
											placeholder="Enter Amount"
											onChange={onValueChange}
											name={'amount'} min={1}
											value={modalDetails.flexi_benefit_price ? modalDetails.flexi_benefit_price : String(value)}
											disabled={modalDetails.flexi_benefit_price ? true : false}
											type="number"
											required={true} />
										</div>
										<div className="col-12">
											<Input label="Final Amount"
												placeholder=""
												value={modalDetails.allocationType === 1 ? value : (Number(value) * 12)}
												disabled={true}
											/>
										</div>
									</>
								}
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button type="button" buttonStyle={"danger"} onClick={handleClose}>
							Close
						</Button>
						<Button buttonStyle={"success"}>
							Save
						</Button>
					</Modal.Footer>
				</form>
			</Modal>
			<Wrapper>
				<TabWrapper width={'max-content'}>
					{(!ModuleControl.HideOldFlex || showOldFlex) && FlexPolicies?.length > 0 &&
						!FlexPolicies.every(({ enrollement_start_date, enrollement_end_date }) =>
							!(enrollement_start_date || enrollement_end_date) || ((enrollement_start_date && enrollement_end_date) &&
								(new Date(enrollement_start_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ||
									new Date(enrollement_end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))) &&
						<Tab isActive={Boolean(tab === "Insurer")} onClick={() => setTab("Insurer")} className="d-block">Insurance</Tab>}
					{widgetData.length > 0 && <Tab isActive={Boolean(tab === "Wellness")} onClick={() => setTab("Wellness")} className="d-block">Wellness</Tab>}
					<Tab isActive={Boolean(tab === "Flex Summary")} onClick={() => {
						setTab("Flex Summary");
						setMandatory([])
					}} className="d-block">Flex Summary</Tab>
					{!!plan_policies.length && plan_policies.every(({ has_alread_purchased }) => !has_alread_purchased) &&
						<Tab
							onClick={() => history.push('/employee/policy-flexible-benefits')} className="d-block">Flex Benefit</Tab>}
				</TabWrapper>
				{(widgetData.length > 0 && tab === "Wellness") && (<div className="row m-0 my-4">
					{widgetData.map((v, i) =>
						<div className="col-lg-6 col-md-8 my-3" key={v.flexi_benefit_id + 'widget-data'}>
							<span className="px-3 py-2" style={{ border: "1px dashed", borderRadius: "10px", backgroundColor: theme.Tab?.color, color: "#ffffff", marginLeft: "1.5em" }}>Allocated - {v.allocated_amount}&nbsp;{v.flex_allocation_type === 1 ? '(Monthly)' : '(Yearly)'}</span>
							<IconlessCard
								removeBottomHeader={true}
								headerStyle={{ margin: "0em", padding: "0em" }}
								title={<Title text={v.flexi_benefit_name} image={v.image} />}
								styles={styles} >
								<div className="row">
									<div className="col md-12 col-12">
										<p style={{ maxHeight: "40px", overflowY: `${viewIndex.includes(i) ? "visible" : "hidden"}`, display: "inline-block" }}>{v.flexi_benefit_description}</p>
										{
											// eslint-disable-next-line jsx-a11y/anchor-is-valid 
											<a
												// href=""
												style={{ textDecoration: "none", color: theme.Tab?.color }}
												onClick={() => viewIndex.includes(i) ? removeIndex(i) : storeIndex(i)}>{`${viewIndex.includes(i) ? "View less" : "View more..."}`}</a>}
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-12 mt-2 mt-lg-0 text-right">
										<Button buttonStyle="success" style={{ border: " 1px dashed #272727" }} onClick={() => openModal(v.flexi_benefit_id, v.flexi_benefit_name, v.image, v.amount, v.flexi_benefit_price, v.flex_allocation_type)}>Allocate</Button>
									</div>
								</div>
							</IconlessCard>
						</div>)}
				</div>)}

				{(tab === "Flex Summary") && (!dashoardLoading ? ((!!employeeDashboardSummary.length && !ModuleControl.isTATA /* Flex Summary Old */) ?
					<EmployeeSummary
						summaryPremium={summaryPremium}
						summary={employeeDashboardSummary}
						summaryFlex={summaryFlex}
					/> : <FlexSummary />)
					: <Loader />)}


				{(FlexPolicies?.length > 0 && tab === "Insurer") &&
					(
						<form onSubmit={handleSubmit(onSubmitnew)} style={{ width: '100%' }}>
							<div className="row my-4 m-0">
								<Col xl={8} lg={8} md={12} sm={12}>
									{FlexPolicies.map((v, index) => {
										// if ([3].includes(v?.benefits_type)) {
										if (v.is_parent_policy === 1 && v.adult_count === 0) {
											return false
										}
										if ((v.enrollement_start_date && v.enrollement_end_date) &&
											(new Date(v.enrollement_start_date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ||
												new Date(v.enrollement_end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))) {
											return false
										}
										return (
											<PackageUpdate key={index + 'FlexPolicies'} v={{ ...v, parent_premium: 6022 }} packageIndex={index}
												// ref={elementsRef[index].current}
												control={control}
												register={register}
												watch={watch}
												currentUser={currentUser}
												setValue={formSetValue}
												setTotalPremium={setTotalPremium}
												// totalPremium={totalPremium}
												setTotalSumInsured={setTotalSumInsured}
												// totalSumInsured={totalSumInsured}
												setKey={setKey}
												setUpdateFlag={setUpdateFlag}
												updateFlag={updateFlag}
												AllowedSubmit={AllowedSubmit}
											/>
										)
										// } else {
										// 	return null;
										// }
									})}

								</Col>

								{/* Howden Specific */}
								{AllowedSubmit &&
									<Col xl={4} lg={4} md={12} sm={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
										{/* <TotalSIPremium className='position-sticky sticky-top'> */}
										<TotalSIPremium>
											{/* <Amount style={{ marginBottom: '20px' }}>Total Amount</Amount>
											<div style={{ marginBottom: '15px' }}>
												<SpanT>Total Sum Insured</SpanT><br></br>
												<SpanC>₹ {BuySumInsured}</SpanC>
											</div> */}
											{!!(Number(BuyPremium) + Number(otherPremiums)) ? <div>
												<SpanT>{(Number(BuyPremium) + Number(otherPremiums) > 0 ? 'To Pay' : 'Credit')}</SpanT>
												<br></br>
												<SpanC>₹ {comma(Math.abs(Number(BuyPremium) + Number(otherPremiums)))}</SpanC>
												<br></br>
												(Incl GST)
											</div> : <div><SpanT>No Premium</SpanT></div>}
											{!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums))) && <Button size="md" className="p-2" variant="success" type="submit">
												<span>{`Submit`}</span>
											</Button>}
										</TotalSIPremium>
										<ImageDiv style={{ textAlign: 'center' }}>
											<img src={'/assets/images/Assets_gmc-vector.png'} alt={'/assets GMC'} style={{
												width: '80%'
											}} />
										</ImageDiv>
										{/* Rakuten */}
										{(isHowden &&
											(currentUser?.company_name || '').toLowerCase().startsWith('rakuten') &&
											!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums)))
										)
											&&
											<DeclarationDiv>
												<DeclarationSpan>Group Medical Flexible Sum Insured</DeclarationSpan>
												<ul style={{ listStyleType: 'disc' }}>
													{Declaration['rakuten'].declarationContent1.map((item, index) => <li key={index + '-declarationContent1'}>{item}</li>)}
												</ul>
												<DeclarationSpan>Group Personal Accident Flexible Sum Insured</DeclarationSpan>
												<ul style={{ listStyleType: 'disc' }}>
													{Declaration['rakuten'].declarationContent2.map((item, index) => <li key={index + '-declarationContent2'}>{item}</li>)}
												</ul>
												<DeclarationSpan>Final Submit</DeclarationSpan>
												{Declaration['rakuten'].finalDeclaration.map(({ id, declaration, is_mandatory }, index) => (
													<Col xl={12} lg={12} md={12} sm={12} key={index + 'declartion-86'}>
														<OptionInput small width={'auto'} className="d-flex" style={{ marginTop: '15px', ...!is_mandatory && { marginLeft: '50px' } }}>
															{is_mandatory && <><input
																name={`parent[${id}].id`}
																type={"checkbox"}
																ref={register}
																onChange={(e) => onChangeHandler(e, { watch, finalDeclaration: Declaration['rakuten'].finalDeclaration, mandatory, setMandatory })}
																id={id}
																// defaultChecked={is_mandatory ? true : false}
																defaultChecked={false}
															/>
																<span></span>
															</>}
															<p style={{ whiteSpace: 'normal', fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem', marginTop: '0', margiBottom: '8px' }}>
																{declaration}
															</p>

														</OptionInput>
													</Col>

												))}
												For any further queries please reach out to &nbsp;
												<a target="_blank" className="c-link" data-stringify-link="mailto:rakuten-india-insurance@mail.rakuten.com" delay="150" data-sk="tooltip_parent" aria-haspopup="menu" aria-expanded="false" href="mailto:rakuten-india-insurance@mail.rakuten.com" rel="noopener noreferrer" tabindex="-1" data-remove-tab-index="true">rakuten-india-insurance@mail.rakuten.com<span aria-label="(opens in new tab)"></span></a>
												{/* &nbsp;and escalations please write to
												&nbsp;<a target="_blank" className="c-link" data-stringify-link="mailto:rakuten-india-COE@mail.rakuten.com" delay="150" data-sk="tooltip_parent" aria-haspopup="menu" aria-expanded="false" href="mailto:rakuten-india-COE@mail.rakuten.com" rel="noopener noreferrer" tabindex="-1" data-remove-tab-index="true">rakuten-india-COE@mail.rakuten.com<span aria-label="(opens in new tab)"></span></a> */}
											</DeclarationDiv>
										}

										{/* Robin Software */}
										{(isHowden &&
											(currentUser?.company_name || '').toLowerCase().startsWith('robin software development') &&
											!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums)))
										)
											&&
											<DeclarationDiv>
												<DeclarationSpan>Group Medical Flexible Sum Insured</DeclarationSpan>
												<ul style={{ listStyleType: 'disc' }}>
													{Declaration['robin software development'].declarationContent1.map((item, index) => <li key={index + '-declarationContent1'}>{item}</li>)}
												</ul>
												<DeclarationSpan>Group Personal Accident Flexible Sum Insured</DeclarationSpan>
												<ul style={{ listStyleType: 'disc' }}>
													{Declaration['robin software development'].declarationContent2.map((item, index) => <li key={index + '-declarationContent2'}>{item}</li>)}
												</ul>
												<DeclarationSpan>Final Submit</DeclarationSpan>
												{Declaration['robin software development'].finalDeclaration.map(({ id, declaration, is_mandatory }, index) => (
													<Col xl={12} lg={12} md={12} sm={12} key={index + 'declartion-86'}>
														<OptionInput small width={'auto'} className="d-flex" style={{ marginTop: '15px', ...!is_mandatory && { marginLeft: '50px' } }}>
															{is_mandatory && <><input
																name={`parent[${id}].id`}
																type={"checkbox"}
																ref={register}
																onChange={(e) => onChangeHandler(e, { watch, finalDeclaration: Declaration['robin software development'].finalDeclaration, mandatory, setMandatory })}
																id={id}
																// defaultChecked={is_mandatory ? true : false}
																defaultChecked={false}
															/>
																<span></span>
															</>}
															<p style={{ whiteSpace: 'normal', fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem', marginTop: '0', margiBottom: '8px' }}>
																{declaration}
															</p>

														</OptionInput>
													</Col>

												))}
												For any further queries please reach out to &nbsp;
												<a target="_blank" className="c-link" data-stringify-link="mailto:jaikiran.kumar@howdenindia.com" delay="150" data-sk="tooltip_parent" aria-haspopup="menu" aria-expanded="false" href="mailto:jaikiran.kumar@howdenindia.com" rel="noopener noreferrer" tabindex="-1" data-remove-tab-index="true">jaikiran.kumar@howdenindia.com<span aria-label="(opens in new tab)"></span></a>
												{/* &nbsp;and escalations please write to
												&nbsp;<a target="_blank" className="c-link" data-stringify-link="mailto:rakuten-india-COE@mail.rakuten.com" delay="150" data-sk="tooltip_parent" aria-haspopup="menu" aria-expanded="false" href="mailto:rakuten-india-COE@mail.rakuten.com" rel="noopener noreferrer" tabindex="-1" data-remove-tab-index="true">rakuten-india-COE@mail.rakuten.com<span aria-label="(opens in new tab)"></span></a> */}
											</DeclarationDiv>
										}

										{/* Pearson */}
										{(isHowden &&
											(currentUser?.company_name || '').toLowerCase().startsWith('pearson') &&
											!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums)))
										)
											&&
											<DeclarationDiv height='max-content'>
												<DeclarationSpan>Final Submit</DeclarationSpan>
												{Declaration['pearson'].finalDeclaration.map(({ id, declaration, is_mandatory }, index) => (
													<Col xl={12} lg={12} md={12} sm={12} key={index + 'declartion-89'}>
														<OptionInput small width={'auto'} className="d-flex" style={{ marginTop: '15px', ...!is_mandatory && { marginLeft: '50px' } }}>
															{is_mandatory && <><input
																name={`parent[${id}].id`}
																type={"checkbox"}
																ref={register}
																onChange={(e) => onChangeHandler(e, { watch, finalDeclaration: Declaration['pearson'].finalDeclaration, mandatory, setMandatory })}
																id={id}
																// defaultChecked={is_mandatory ? true : false}
																defaultChecked={false}
															/>
																<span></span>
															</>}
															<p style={{ whiteSpace: 'normal', fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem', marginTop: '0', margiBottom: '8px' }}>
																{declaration}
															</p>

														</OptionInput>
													</Col>

												))}
											</DeclarationDiv>
										}

										{/* Persistent */}
										{(isHowden &&
											(currentUser?.company_name || '').toLowerCase().startsWith('persistent') &&
											!!(BuySumInsured || (Number(BuyPremium) + Number(otherPremiums)))
										)
											&&
											<DeclarationDiv height='max-content'>
												<DeclarationSpan>Final Submit</DeclarationSpan>
												{Declaration['persistent'].finalDeclaration.map(({ id, declaration, is_mandatory }, index) => (
													<Col xl={12} lg={12} md={12} sm={12} key={index + 'declartion-89'}>
														<OptionInput small width={'auto'} className="d-flex" style={{ marginTop: '15px', ...!is_mandatory && { marginLeft: '50px' } }}>
															{is_mandatory && <><input
																name={`parent[${id}].id`}
																type={"checkbox"}
																ref={register}
																onChange={(e) => onChangeHandler(e, { watch, finalDeclaration: Declaration['persistent'].finalDeclaration, mandatory, setMandatory })}
																id={id}
																// defaultChecked={is_mandatory ? true : false}
																defaultChecked={false}
															/>
																<span></span>
															</>}
															<p style={{ whiteSpace: 'normal', fontSize: globalTheme.fontSize ? `calc(0.9rem + ${globalTheme.fontSize - 92}%)` : '0.9rem', marginTop: '0', margiBottom: '8px' }}>
																{declaration}
															</p>

														</OptionInput>
													</Col>

												))}
											</DeclarationDiv>
										}
									</Col>}
							</div>
						</form>
					)}
				<PlanBenefits
					show={!!_show}
					onHide={() => set_Show(false)}
					features={_show || []}
				/>

			</Wrapper>
			<GlobalStyle />
		</>
	)
}

const GlobalStyle = createGlobalStyle`
${RightContainer}{
  overflow: unset;
	@media (max-width: 992px) {
    overflow: hidden;
  }
}
`;


const TotalSIPremium = styled.div`
			background: #fffbef;
			display: flex;
			flex-direction: column;
			padding: 5px 10px;
			border-radius: 20px;
			// width: 95%;
			padding: 15px 25px;
			border-radius: 33px;
			width: 315px;
			@media (max-width: 676px) {

				width:234px
  }
			`
const SpanT = styled.span`
			font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
			letter-spacing: 1px;
			color: #6a6a6a;
			`
const SpanC = styled.span`
			font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
			
			letter-spacing: 1px;
			`

const Wrapper = styled.div`
			padding-top: 20px;
			padding-left: 20px;
			`;

const ImageDiv = styled.div`
			margin-top:35px;
			@media (max-width: 990px) {
	& img{
				width:45% !important
	}
  }
			`
const DeclarationDiv = styled.div`
			font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
			background: #fff9e6;
			border-radius: 15px;
			padding: 10px 15px;
			box-shadow: 1px 0px 12px 0px #c5c5c5;
			height: ${({ height }) => height || '600px'};
			overflow-x: auto;
			`
const DeclarationSpan = styled.span`
			font-weight:bold;
			`
