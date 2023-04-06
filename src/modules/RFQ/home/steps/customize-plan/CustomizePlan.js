import React, { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import { Loader } from "../../../../../components";
import { BackBtn } from "../button";
import InputForm from "./InputForm";
import CompareCard from "./CompareCard";

import { useForm, Controller } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { clear, Quotes, PostQuote, sorting } from "../../home.slice";
import _ from "lodash";
import { doesHasIdParam } from "../../home";
import { ModuleControl } from "../../../../../config/module-control";

export default function CustomizePlan({ utm_source }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
	const brokerId = query.get("broker_id");
	const insurerId = query.get("insurer_id");
	const {
		success,
		company_data,
		quotes: QuotesStr,
		// quotesCopy,
		postplan,
		// error,
		loading,
		completeQuoteLoading,
		// totallives,
		filterData,
	} = useSelector((state) => state.RFQHome);

	// const [PlanPremiums, setPlanPremiums] = useState([]);
	const [flag, setFlag] = useState(0);
	// const [PlanPremiums, setPlanPremiums] = useState([]);
	const [update, setUpdate] = useState(0);
	const [previousTeamMemberDetailsId, setPreviousTeamMemberDetailsId] = useState();
	const [gateForCarePreSalesFeatures, setGateForCarePreSalesFeatures] = useState(false);
	const [gateForCarePreSalesFeatureAccordion, setGateForCarePreSalesFeatureAccordion] = useState(false);
	const { register, watch, errors, setValue, control, handleSubmit } = useForm({
		mode: "onChange",
	});
	// const type = watch("type");
	const [type, setType] = useState("insurance");
	const getType = (elem) => {
		if (type !== elem) {
			setType(elem);
		}
	};
	useEffect(() => {
		dispatch(sorting(type));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type, QuotesStr]);

	useEffect(() => {
		setFlag(0)
	}, [type])


	const parent = watch("parent") || [];
	useEffect(() => {
		// Care Pre-Sales : This code is for care pre-sales, API hit on feature change to update care premium
		if (ModuleControl.inDevelopment) {
			const selectedChildIds = parent?.filter(data => Boolean(data?.child) && Boolean(data?.id))?.map(data => data?.child);
			if (gateForCarePreSalesFeatureAccordion) {
				setGateForCarePreSalesFeatures(true);
				setGateForCarePreSalesFeatureAccordion(false);
			}
			if (selectedChildIds?.length && gateForCarePreSalesFeatures) {
				setGateForCarePreSalesFeatures(false);
				dispatch(Quotes({ enquiry_id, plan_product_detail_ids: String(selectedChildIds) }, company_data.member_details));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parent, gateForCarePreSalesFeatureAccordion])
	let unsorted_quotes = !_.isEmpty(QuotesStr) ? [...QuotesStr] : [];
	let quotes = unsorted_quotes.sort((a, b) =>
		type === "insurance"
			? Number(b.broker_ic_id) - Number(a.broker_ic_id)
			: Number(b.total_premium) - Number(a.total_premium)
	);

	useEffect(() => {
		if (flag < 6 && quotes && quotes.length) {
			setFlag((prev) => prev + 1)
		};
	}, [flag, quotes, parent]);

	useEffect(() => {
		setFlag((prev) => prev + 1)
	}, [update, type])

	//ID handling.
	useEffect(() => {
		if (!enquiry_id) {
			swal("Enquiry ID not found, Redirecting to home", "", "warning").then(() => {
				history.replace("./home");
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enquiry_id]);

	useEffect(() => {
		if (enquiry_id && company_data.member_details?.length && company_data.member_details[0].id && Number(previousTeamMemberDetailsId) !== Number(company_data.member_details[0].id)) {
			dispatch(Quotes({ enquiry_id }, company_data.member_details));
			setPreviousTeamMemberDetailsId(previousTeamMemberDetailsId => company_data.member_details[0].id)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data.member_details])

	//OnSuccess
	useEffect(() => {
		if (success) {
			if (typeof success !== "boolean") {
				swal(success, "", "success").then(() => {
					dispatch(Quotes({ enquiry_id }, company_data.member_details));
				});
			}
		}
		if (postplan) {
			if (Number(company_data?.is_demography) === 1) {
				history.push(`/data-upload/1?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`);
			}
			else if (Number(company_data?.is_demography) === 0) {
				history.push(`/data-upload/5?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`);
			}
		}
		return () => {
			dispatch(clear());
			dispatch(clear("postplan"));
		};
		//eslint-disable-next-line
	}, [success, postplan, completeQuoteLoading]);

	useEffect(() => {
		if (completeQuoteLoading && !QuotesStr.length && !loading) {
			history.push("/rfq-callback-done");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [completeQuoteLoading, QuotesStr, loading]);

	//multiplying premium
	const PlanPremiums = useMemo(() =>
		calculatePremium({ quotes, parent, member_details: company_data.member_details, filterData }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[quotes, parent, company_data.member_details]);


	const HeaderDiv = (
		<div className="d-flex align-items-center">
			<BackBtn
				url={`/topup?enquiry_id=${encodeURIComponent(enquiry_id)}${doesHasIdParam({ brokerId, insurerId })}`}
				style={{ outline: "none", border: "none", background: "none" }}
			>
				<img
					src="/assets/images/icon/Group-7347.png"
					alt="bck"
					height="45"
					width="45"
				/>
			</BackBtn>
			<h1 style={{ fontWeight: "600", marginLeft: "10px" }}>Customize plans</h1>
		</div>
	);


	const onSubmit = (QuoteId) => {

		const selectedQuotes = quotes.find(({ id }) => id === Number(QuoteId))

		const selectedQuoteMultiSumProductFeature = selectedQuotes?.plan_product_features || [];

		const s_child = _.compact(parent.map(({ child_ids, id }) => id && child_ids.split(","))).flat(1).map(child_id => Number(child_id));
		const p_child = _.compact(parent.map(({ parent_ids, id }) => id && parent_ids.split(","))).flat(1).map(parent_id => Number(parent_id));

		let ChildIds = [], ParentIds = [];
		selectedQuoteMultiSumProductFeature.forEach(elem => {
			if (elem) {
				if (p_child.includes(elem.id)) {
					ParentIds.push(elem.id)
				}
				elem.product_detail.forEach((childElem) => {
					if (s_child.includes(childElem.id)) {
						ChildIds.push(childElem.id)
					} else if (p_child.includes(elem.id) && !elem.product_detail.some(({ id }) => s_child.includes(id))) {
						ChildIds.push(childElem.id)
					}
				})
			}
		})

		const SeletectePlanIndex = quotes.findIndex(({ id }) => Number(id) === Number(QuoteId))

		const req = {
			enquiry_id: enquiry_id,
			ic_plan_id: QuoteId,
			plan_product_feature_ids: _.compact(ParentIds),
			plan_product_detail_ids: _.compact(ChildIds),
			premium: (quotes[SeletectePlanIndex]?.total_premium || 0) + Number(PlanPremiums[SeletectePlanIndex] || 0) || 0,
			type_of_plan: quotes[SeletectePlanIndex]?.type_of_plan || "offline"
		}

		dispatch(PostQuote(req));
	};

	return (
		<>
			{HeaderDiv}
			<InputForm
				register={register}
				errors={errors}
				prefill={company_data}
				setValue={setValue}
				enquiry_id={encodeURIComponent(enquiry_id)}
				Controller={Controller}
				control={control}
				watch={watch}
				quotes={quotes}
				getType={getType}
				selectedType={type}
				customize
			/>
			<CompareCard
				setGateForCarePreSalesFeatures={setGateForCarePreSalesFeatures}
				setGateForCarePreSalesFeatureAccordion={setGateForCarePreSalesFeatureAccordion}
				register={register}
				parent={parent}
				prefill={company_data}
				watch={watch}
				quotes={quotes}
				filterData={filterData}
				// prelistdata={prelistdata}
				setUpdate={setUpdate}
				totalPre={PlanPremiums}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
			/>
			{loading && <Loader />}
		</>
	);
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

const sumInsuredMember = (deductible, sumMemberCount) => {
	if (deductible && sumMemberCount.some(({ sum_insured }) => deductible === sum_insured))
		return sumMemberCount.find(({ sum_insured }) => deductible === sum_insured).no_of_member
	else
		return sumMemberCount.reduce((total, { no_of_member }) => total + no_of_member, 0)
}

const CalculatePremiumWithAgeDetail = (BaseFilterPremium, premium_precentage) => {
	return BaseFilterPremium.reduce((total, { premium, age }) => total + ((premium * premium_precentage) * ((Number(age.no_of_employees || 0) + Number(age.no_of_dependant || 0)) || 0)), 0)
}

const CalculateFeaturePremium = (item, sumMemberCount, BasePremium, total_premium) => {
	let premium;
	if (Number(item.premium_by) === 2) {
		if (item.deductible_from) {
			premium = CalculatePremiumWithAgeDetail(BasePremium.filter(({ suminsured }) => suminsured === item.deductible_from), Number(item?.premium) / 100) /* (BasePremium[item.deductible_from] || 0) * Number(item?.premium) / 100 */;

			if (Number(item.premium_type) === 1) {
				return (premium)
			}
			else {
				return -(premium)
			}
		} else {
			if (Number(item.premium_type) === 1) {
				return (total_premium) * Number(item?.premium) / 100;
			} else {
				return -((total_premium) * Number(item?.premium) / 100);
			}
		}
	}
	else {
		premium = Number(item?.premium);
		if (Number(item.premium_type) === 1) {
			return (premium * sumInsuredMember(item.deductible_from, sumMemberCount))
		}
		else {
			return -(premium * sumInsuredMember(item.deductible_from, sumMemberCount))
		}
	}

}

const calculatePremium = ({ quotes, parent, member_details, filterData }) => {

	let sumInsureds = member_details.map(({ sum_insured }) => Number(sum_insured));
	sumInsureds = sumInsureds.filter(onlyUnique)
	const sumMemberCount = sumInsureds.map(sumIns => ({
		no_of_member: member_details.reduce((total, { sum_insured, no_of_employees, no_of_dependant }) => {
			if (Number(sumIns) === Number(sum_insured)) {
				return total + Number(no_of_employees || 0) + Number(no_of_dependant || 0)
			}
			else return total
		}, 0),
		sum_insured: sumIns
	}))

	const s_child = _.compact(parent.map(({ child }) => Number(child)));
	const p_child = _.compact(parent.map(({ parent_ids, id }) => id && parent_ids.split(","))).flat(1).map(parent_id => Number(parent_id));

	const Mapped_Child = _.compact(
		_.compact(parent).map((item) => {
			if (s_child.includes(Number(item?.child))) {
				return item;
			} else {
				return null;
			}
		})
	)
		.map((item) => item?.child_ids)
		.map((item) => item && item.split(","));


	let TempPlanPremiums = []
	quotes.forEach((data, index) => {

		let premiumVal = 0;
		let C_Ids = (Mapped_Child || []).map(
			(item) => !_.isEmpty(item) && item[index]
		);

		data.plan_product_features.forEach(({ id, product_type, product_detail, product_feature_id }) => {

			const selectedProductDetail = product_detail.find(({ id: childId }) => {
				return C_Ids.some((child_id) => Number(child_id) === childId)
			})
			selectedProductDetail && product_detail.forEach((elem) => {

				if ([1, 5].includes(product_type)) {
					if (selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
				if (product_type === 2) {
					if (selectedProductDetail.duration_value === elem.duration_value &&
						selectedProductDetail.duration_unit === elem.duration_unit &&
						selectedProductDetail.duration_type === elem.duration_type &&
						selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
				if (product_type === 3) {
					if (selectedProductDetail.name === elem.name &&
						selectedProductDetail.sum_insured === elem.sum_insured) {
						C_Ids.push(String(elem.id))
					}
				}
			})
		})

		C_Ids = C_Ids.filter(onlyUnique);

		(data?.plan_product_features || []).forEach((elem) => {

			if (!_.isEmpty(parent[elem?.product_feature_id])) {
				if (
					Number(parent[elem?.product_feature_id]?.id) ===
					Number(elem?.product_feature_id)
				) {
					let featureList = []
					filterData.forEach((fdata) => {
						if (fdata.plan_ids.includes(elem.id))
							featureList = fdata.product_detail
					})
					featureList = featureList.filter(flist => elem?.product_detail.find((pdata => flist.ids.includes(pdata.id))))
					return elem?.product_detail.forEach((item) => {
						if (elem.include_multiple_si === 0) {
							if (
								Number(parent[elem?.product_feature_id]?.id) ===
								Number(elem?.product_feature_id)
							) {
								premiumVal = Number(premiumVal) + CalculateFeaturePremium(item, sumMemberCount, data.base_premiums, data.total_premium);
							}
						} else if (
							!_.isEmpty(parent[elem?.product_feature_id].child) &&
							C_Ids.includes(String(item?.id))
						) {
							premiumVal = Number(premiumVal) + CalculateFeaturePremium(item, sumMemberCount, data.base_premiums, data.total_premium);
						}
						else if (p_child.includes(elem.id) && !elem.product_detail.some(({ id }) => C_Ids.includes(String(id)))) {
							if ((elem.include_multiple_si === 2 && featureList[0].ids.includes(item?.id)) || elem.include_multiple_si === 1)
								premiumVal = Number(premiumVal) + CalculateFeaturePremium(item, sumMemberCount, data.base_premiums, data.total_premium);
						}

					});
				}
			}
		});
		TempPlanPremiums.push(premiumVal);
	});
	return TempPlanPremiums

}
