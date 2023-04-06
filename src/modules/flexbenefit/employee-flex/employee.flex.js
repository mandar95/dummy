import React, { useEffect, useReducer, useState } from "react";

import { Col, Row } from "react-bootstrap";
import { IconlessCard, TabWrapper, Tab } from "components";
import { Button, Loader, NoDataFound } from "../../../components";
import FlexPlan from "./flex.plan";

import { employeeFlexPolicies, getEmployeeOldBenefits, initialState, loadEmployeePolicies, loadTempStorage, reducer, tempStorage } from "./employee-flex.action";
import { useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";
import { RightContainer, Wrapper } from "../../core/layout/Layout";
import { FooterWrapper } from "../../../components/footer/style";
import { BackButton } from "../../../components/header/header";
import { NumberInd } from "../../../utils";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router";

const style = { padding: '7px 10px' }

const FlexBenefit = ({ myModule }) => {

	const [tab, setTab] = useState("GMC");
	const [show, setShow] = useState(1);
	const [{ details, tempData, loading, loadingFlexPlan, oldBenefits }, dispatch] = useReducer(reducer, initialState);
	const [employeePolicies, setEmployeePolcies] = useState();
	const { globalTheme } = useSelector(state => state.theme)
	// const [useTempData, setUseTempData] = useState([false, false, false]);
	const [reset, setReset] = useState(false);
	const [premiumUpdated, setPremiumUpdated] = useState(0);
	const history = useHistory();
	const { userType } = useParams()

	useEffect(() => {
		if (userType === 'employee') {
			employeeFlexPolicies(dispatch)
			loadTempStorage(dispatch)
			getEmployeeOldBenefits(dispatch)
			loadEmployeePolicies(setEmployeePolcies)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		reset && setReset(false)
	}, [reset])

	useEffect(() => {
		if (tab === 'GMC' && details.length && !details.some(({ product_id, is_parent_policy }) => product_id === 1 && !is_parent_policy)) {
			if (details.some(({ product_id, is_parent_policy }) => product_id === 2 && !is_parent_policy)) {
				setTab("GPA")
			} else if (details.some(({ product_id, is_parent_policy }) => product_id === 3 && !is_parent_policy)) {
				setTab("GTL")
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [details])

	useEffect(() => {
		const _TimeOut = setTimeout(() => {
			setPremiumUpdated(prev => (!!prev && prev !== 1) ? 1 : prev)
		}, 3000)

		return () => clearTimeout(_TimeOut)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [premiumUpdated])

	useEffect(() => {
		premiumUpdated > 1 && setPremiumUpdated(1)
		const _TimeOut = setInterval(() => setPremiumUpdated(1), 1);
		setTimeout(() => {
			clearInterval(_TimeOut)
		}, 1000)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tab])

	if (!employeePolicies) {
		return <Loader />
	}


	const GMC_Data = details.filter(({ product_id, is_parent_policy }) => product_id === 1 && !is_parent_policy) || []
	const GMC_Topup = GMC_Data.reduce((total, { topup_policies }) => [...total, ...(topup_policies || [])], []) || []
	const GMC_Parent = GMC_Data.reduce((total, { parent_policies }) => [...total, ...(parent_policies || [])], []) || []
	const GPA_Data = details.filter(({ product_id, is_parent_policy }) => product_id === 2 && !is_parent_policy) || []
	const GPA_Topup = GPA_Data.reduce((total, { topup_policies }) => [...total, ...(topup_policies || [])], []) || []
	const GPA_Parent = GPA_Data.reduce((total, { parent_policies }) => [...total, ...(parent_policies || [])], []) || []
	const GTL_Data = details.filter(({ product_id, is_parent_policy }) => product_id === 3 && !is_parent_policy) || []
	const GTL_Topup = GTL_Data.reduce((total, { topup_policies }) => [...total, ...(topup_policies || [])], []) || []
	const GTL_Parent = GTL_Data.reduce((total, { parent_policies }) => [...total, ...(parent_policies || [])], []) || []
	// .filter(({ product_id }) => useTempData[product_id - 1])
	const TotalPremium = tempData?.flex_details?.reduce((total, { employee_premium = 0, benefits_premium = 0 }) => total + employee_premium + benefits_premium, 0)

	if (userType !== 'employee') {
		return <Row>
			<Col xl={12} lg={12} md={12} sm={12}>
				<h1 className='display-4 text-center'>Only For Employee Login</h1>
			</Col>
		</Row>
	}

	if (!details.filter(({ product_id, is_parent_policy }) => [1, 2, 3].includes(product_id) && !is_parent_policy).length || reset) {
		if (loading || loadingFlexPlan || reset) {
			return <Loader />
		} else {
			history.push('/employee/enrollment-view')
		}
	}

	return (
		<>
			{false && tempData?.flex_details && !!TotalPremium && <div className="d-flex justify-content-end">
				<Button
					style={{
						margin: '15px 100px -29px 0',
						boxShadow: 'none'
					}}
					buttonStyle='square-outline' type='button'>
					Total  {TotalPremium < 0 ? 'Amount Credit' : 'Premium'}: ₹ {NumberInd(Math.abs(TotalPremium))} <sub> (Incl GST)</sub>
				</Button>

			</div>}

			<IconlessCard
				styles={{ padding: '1.6rem 0' }}
				title={<Row style={{
					justifyContent: 'space-between',
					background: 'white',
					margin: '0px',
					alignItems: 'center',
				}}>
					<div style={{
						fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
						fontWeight: '500',
						letterSpacing: '1px'
					}}>
						{myModule?.module_content || 'Flexible Benefit Program - Insurance'}
					</div>
					<div className="d-flex">
						<div style={{
							cursor: 'pointer',
							fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
							fontWeight: '500',
							letterSpacing: '1px',
							background: '#ffefef',
							padding: '10px 15px',
							borderRadius: '10px',
							marginRight: '10px'
						}}
							onClick={() => { setShow(1); tempStorage(dispatch, { flex_details: [1] }, { setReset, setTab, nextTo: 'GMC' }) }}
						>Reset <i className="fas fa-sync" style={{
							background: '#d63838',
							color: 'white',
							padding: '3px',
							borderRadius: '5px',
							marginLeft: '20px'
						}}></i></div>
						<div style={{
							cursor: 'pointer',
							fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px',
							fontWeight: '500',
							letterSpacing: '1px',
							background: '#fffbef',
							padding: '10px 15px',
							borderRadius: '10px'
						}}
							onClick={() => setShow(true)}
						>Edit <i className="fas fa-pencil" style={{
							background: globalTheme?.Tab?.color,
							color: 'white',
							padding: '3px',
							borderRadius: '5px',
							marginLeft: '20px'
						}}></i></div>
					</div>
				</Row>}
				marginTop="0px !important"
			>
				{!!(GMC_Data.length || GPA_Data.length || GTL_Data.length) ? <> <TabWrapper width='max-content' margin="0" bgColor="#fffbef" className="d-flex align-item-center">
					{!!GMC_Data.length && <Tab style={style} bgColor={globalTheme?.Tab?.color} textColor="black" isActive={Boolean(tab === "GMC")} onClick={() => setTab("GMC")} className="d-block">Group Mediclaim</Tab>}
					{!!GPA_Data.length && <Tab style={style} bgColor={globalTheme?.Tab?.color} textColor="black" isActive={Boolean(tab === "GPA")} onClick={() => {
						if (GMC_Data.length && (!tempData?.flex_details?.find(({ product_id }) => +product_id === 1) /* || !useTempData[0] */)) {
							const isSinglePlan = GMC_Data.length === 1;
							if (!(isSinglePlan && !GMC_Data[0]?.has_been_endrosed && !GMC_Data[0]?.members.length)) {
								swal('Please choose GMC before proceeding', '', 'info')
								return false;
							}
						}
						setTab("GPA")
					}} className="d-block">Group Personal Accident</Tab>}
					{!!GTL_Data.length && <Tab style={style} bgColor={globalTheme?.Tab?.color} textColor="black" isActive={Boolean(tab === "GTL")} onClick={() => {
						if (GMC_Data.length && (!tempData?.flex_details?.find(({ product_id }) => +product_id === 1) /* || !useTempData[0] */)) {
							const isSinglePlan = GMC_Data.length === 1;
							if (!(isSinglePlan && !GMC_Data[0]?.has_been_endrosed && !GMC_Data[0]?.members.length)) {
								swal('Please choose GMC before proceeding', '', 'info')
								return false;
							}
						}
						if (GPA_Data.length && (!tempData?.flex_details?.find(({ product_id }) => +product_id === 2) /* || !useTempData[1] */)) {
							const isSinglePlan = GPA_Data.length === 1;
							if (!(isSinglePlan && !GPA_Data[0]?.has_been_endrosed && !GPA_Data[0]?.members.length)) {
								swal('Please choose GPA before proceeding', '', 'info')
								return false;
							}
						}
						setTab("GTL")
					}} className="d-block">Group Term Life</Tab>}
				</TabWrapper>

					{!!GMC_Data.length && tab === "GMC" &&
						<FlexPlan
							title={myModule?.module_content}
							employeePolicies={employeePolicies}
							premiumUpdated={premiumUpdated} setPremiumUpdated={setPremiumUpdated}
							sticky globalTheme={globalTheme}
							oldBenefits={oldBenefits?.[0]?.benefit_details}
							show={show} setShow={setShow} dispatch={dispatch}
							reducerdetails={details} details={GMC_Data} tempData={tempData}
							topup_detail={GMC_Topup} parent_detail={GMC_Parent} setTab={setTab} /* setUseTempData={setUseTempData} useTempData={useTempData} */
							type="GMC" base_product_id={1} hasOtherPlans={!!(GPA_Data.length || GTL_Data.length)} isLastPlan={!(GPA_Data.length || GTL_Data.length)} nextTo={(GPA_Data.length && 'GPA') || (GTL_Data.length && 'GTL')} />
					}
					{!!GPA_Data.length && tab === "GPA" &&
						<FlexPlan
							title={myModule?.module_content}
							employeePolicies={employeePolicies}
							premiumUpdated={premiumUpdated} setPremiumUpdated={setPremiumUpdated}
							sticky globalTheme={globalTheme}
							oldBenefits={oldBenefits?.[0]?.benefit_details}
							show={show} setShow={setShow} dispatch={dispatch}
							reducerdetails={details} details={GPA_Data} tempData={tempData}
							topup_detail={GPA_Topup} parent_detail={GPA_Parent} setTab={setTab} /* setUseTempData={setUseTempData} useTempData={useTempData} */
							type="GPA" base_product_id={2} hasOtherPlans={!!(GMC_Data.length || GTL_Data.length)} isLastPlan={!GTL_Data.length} nextTo={GTL_Data.length && 'GTL'} />
					}
					{!!GTL_Data.length && tab === "GTL" &&
						<FlexPlan
							title={myModule?.module_content}
							employeePolicies={employeePolicies}
							premiumUpdated={premiumUpdated} setPremiumUpdated={setPremiumUpdated}
							sticky globalTheme={globalTheme}
							oldBenefits={oldBenefits?.[0]?.benefit_details}
							show={show} setShow={setShow} dispatch={dispatch}
							reducerdetails={details} details={GTL_Data} tempData={tempData}
							topup_detail={GTL_Topup} parent_detail={GTL_Parent} setTab={setTab} /* setUseTempData={setUseTempData} useTempData={useTempData} */
							type="GTL" base_product_id={3} hasOtherPlans={!!(GMC_Data.length || GPA_Data.length)} isLastPlan={true} />
					}
				</> : loading ? <NoDataFound text='Loading Polices' img='/assets/images/loading.jpg' /> : <NoDataFound />}
				{(loading || loadingFlexPlan) && <Loader />}
			</IconlessCard>
			<GlobalStyle widthGreater={(tab === "GMC" && GMC_Data.length) || (tab === "GPA" && GPA_Data.length) || (tab === "GTL" && GTL_Data.length)} />
		</>
	)
}

export default FlexBenefit

const GlobalStyle = createGlobalStyle`
${RightContainer}{
  overflow: unset;
}
${Wrapper}{
	width: ${({ widthGreater }) => widthGreater > 3 ? 'max-content' : 'auto'};
}
${FooterWrapper}{
	span{
		position: ${({ widthGreater }) => widthGreater > 3 ? 'initial' : 'absolute'};;
	}
}

${BackButton}{
	display: none;
}

	.tooltip.show {
    opacity: 1;
  }
  .tooltip {
    padding: 6px;
    max-width: 280px;
    border-radius: 0;
    background-color: black;
    pointer-events: none;

  }
  .tooltip-inner {
    max-width: 100%;
    width: 100%;
    /* padding: 10px 18px; */
    border-radius: 0;
    color: #d2d3d4;
    line-height: 18px;
    background-color: black;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    text-align: start;
  }

`;
