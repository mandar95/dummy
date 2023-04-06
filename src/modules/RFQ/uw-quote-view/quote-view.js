import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { CardBlue, CompactCard, Loader } from "components";
import _ from "lodash";
import * as yup from "yup";
import { Lister, ListerFamily, TableData, RFQStatus, exclude, editDetails } from "./helper";
import {
	calculatePremium, TableDataDg as TableDataDgnew
} from "../user-list-view/helper";
// import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { getSingleUw, clear } from "../home/home.slice";
import { clear as clearMsg, updateUWQuote } from "../rfq.slice";
import { DataTable } from "modules/user-management";
import swal from "sweetalert";
import { EditModal } from "./Modal";
import { EditModal as DefView } from "./def-view";
import CustomerDeficiency from "./customerDeficiency";
import { Decrypt } from "../../../utils";
import PlanFeature from "../user-list-view/plan-feature";
import { EditModal as DemographyModal } from "./demography-modal";

import { getstatecity, getIndustry, getConfigData } from '../../RFQ/home/home.slice'
import { giveProperId } from '../../RFQ/home/home';
import { common_module } from 'config/validations';
const validation = common_module.user;

export const QuoteView = () => {
	let { id, userType } = useParams();
	id = Decrypt(id)
	const [modal, setModal] = useState();
	const [viewDef, setViewDef] = useState(false);
	let [edit, setEdit] = useState(false);
	let [featureEdit, setFeatureEdit] = useState(false);
	const [file, setFile] = useState();
	const [, setUpdate] = useState(0);
	const [demographyModal, setDemographyModal] = useState(false);
	const { globalTheme } = useSelector(state => state.theme)
	// const [PlanPr, setPremium] = useState(false);

	/*----------validation schema----------*/
	const validationSchema = (uwSingle) => yup.object().shape({
		...(!_.isEmpty(uwSingle) && {
			work_email: yup
				.string()
				.email("Please enter valid email id").required("Please enter email id"),
			company_name: yup
				.string()
				.max(50, "Company name should be below 50").required("Please enter company name"),
			pincode: yup
				.string()
				.min(6, "Pincode must consist 6 digits")
				.max(6, "Pincode must consist 6 digits").required("Please enter pincode"),
			city_id: yup.string().required("Please select city"),
			state_id: yup.string().required("Please select state"),
			// industry_type_id: yup.string().required("Please select industry"),
			contact_no: yup.string()
				.required('Mobile No. is required')
				.min(10, 'Mobile No. should be 10 digits')
				.max(10, 'Mobile No. should be 10 digits')
				.matches(validation.contact.regex, 'Not valid number'),
		}),
		...((!_.isEmpty(uwSingle) && uwSingle.no_of_employees) && {
			no_of_employees: yup.string().required('No .of employee required'),
		}),
		// ...((!_.isEmpty(uwSingle) && uwSingle?.rfq_selected_plan?.final_premium) && {
		// 	final_premium: yup.string().required('Final premium required'),
		// }),
		// ...((!_.isEmpty(uwSingle) && uwSingle?.rfq_selected_plan?.sum_insured) && {
		// 	sum_insured: yup.string().required('Sum insured required'),
		// })
	});

	const dispatch = useDispatch();

	const { uwSingle, error, statecity, industry_data } = useSelector((state) => state.RFQHome);
	const { success, loading, error: _error } = useSelector((state) => state.rfq);
	const { currentUser } = useSelector((state) => state.login);


	const { handleSubmit, control, errors, watch, setValue, register } = useForm({
		validationSchema: validationSchema(uwSingle)
	});
	const Pincode = watch("pincode") || "";
	const parent = watch("parent") || [];

	useEffect(() => {
		dispatch(getConfigData(giveProperId({})));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		dispatch(clear("uwSingle"));
		if (id) dispatch(getSingleUw({ rfq_id: id, is_uw: 0 }));
		dispatch(getIndustry());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		if (Pincode?.length === 6) {
			dispatch(getstatecity({ pincode: Pincode }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Pincode]);

	useEffect(() => {
		if (!_.isEmpty(uwSingle) && _.isEmpty(statecity)) {
			dispatch(getstatecity({ pincode: uwSingle?.pincode }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uwSingle]);

	useEffect(() => {
		if (!_.isEmpty(uwSingle) && edit) {
			for (let i in uwSingle) {
				setValue(i, uwSingle[i]);
			}
			setValue('final_premium', uwSingle?.rfq_selected_plan?.final_premium)
			setValue('sum_insured', uwSingle?.rfq_selected_plan?.sum_insured)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uwSingle, edit])

	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		if (success) {
			swal('Success', success, "success").then(() => {
				if (id) {
					dispatch(getSingleUw({ rfq_id: id, is_uw: 0 }));
					setEdit(false)
					setFeatureEdit(false)
				}
			});
			setModal(false);
		}
		return () => {
			dispatch(clear());
			dispatch(clearMsg());
		};
		//eslint-disable-next-line
	}, [error, success]);

	useEffect(() => {
		if (_error) {
			swal(_error, "", "warning");
		}
	}, [_error])

	//dispatch get
	const Redispatch = () => {
		if (id) dispatch(getSingleUw({ rfq_id: id, is_uw: 0 }));
	};

	const EditMember = (id, data) => {
		setModal(data);
	};

	const viewDefFn = (data) => {
		if (!_.isEmpty(data?.deficiency_documents)) {
			setViewDef(data?.deficiency_documents);
		} else {
			swal("Deficiency trail not available", "", "info");
		}
	};

	/*-----demography-----*/
	let demographyData = !_.isEmpty(
		uwSingle?.rfq_selected_plan?.rates_demography
	) && {
		...uwSingle?.rfq_selected_plan,
		...uwSingle?.rfq_selected_plan?.rates_demography,
	};

	!_.isEmpty(demographyData.rates_demography) &&
		delete demographyData.rates_demography;
	!_.isEmpty(demographyData.Selected_plan_feature) &&
		delete demographyData.Selected_plan_feature;
	!_.isEmpty(demographyData.selected_general_config) &&
		delete demographyData.selected_general_config;

	//table
	const tableHeaders = !_.isEmpty(demographyData)
		? Object.keys(demographyData)
		: [];
	let TableDataDg = [
		...tableHeaders
			.filter(({ accessor }) => !exclude.includes(accessor))
			.map((item, index) => {
				if (
					!(
						typeof tableHeaders[`${item}`] === "object" ||
						tableHeaders[index] === "id"
					)
				) {
					return {
						Header: `${_.capitalize(tableHeaders[index]).replace(/_/g, " ")}`,
						accessor: `${tableHeaders[index]}`,
					};
				} else return null;
			}),
	];

	TableDataDg = _.compact(TableDataDg);
	/*--x--demography--x--*/

	let onClickHandlerEdit = () => {
		setEdit(!edit);
	};

	let onClickFeatureHandlerEdit = () => {
		setFeatureEdit(!featureEdit);
	}
	const editDemography = (id, data) => {
		setDemographyModal(data)
	}

	const Title = ({ _title, _method, _isEdit }) => (
		<Row>
			<Col sm={12} md={6}>
				{_title}
			</Col>
			<Col sm={12} md={6} className="d-flex justify-content-end mt-3">
				<span id="edit-button" className="mr-3">
					<Button buttonStyle="outline" onClick={_method}>
						{_isEdit ? "Cancel" : "Edit"}
					</Button>
				</span>
			</Col>
		</Row>
	);

	//multiplying premium
	const PlanPremiums = useMemo(() => calculatePremium({ quotes: uwSingle?.rfq_selected_plan ? [uwSingle?.rfq_selected_plan] : [], parent, member_details: uwSingle?.rfq_age_demography || [] })
		, [uwSingle, parent]);
	//const _PremiumAmt = (Number(PlanPremiums) - Number(view?.rfq_selected_plan?.final_premium) || 0)

	// useEffect(() => {
	// 	setPremium(true)
	// }, [uwSingle, parent])

	const updatePlanFeature = () => {
		let quotes = [uwSingle]
		let QuoteId = uwSingle.id
		const getIndexValue = [0]

		const selected_parent = _.compact(parent.map(({ id }) => Number(id)));
		const selected_child = _.compact(parent.map(({ child }) => Number(child)));

		//processing data
		const ParentIds = _.compact(
			_.compact(parent).map((item) => {
				if (selected_parent.includes(Number(item?.id))) {
					return item;
				} else {
					return null;
				}
			})
		)
			.map((item) => item?.parent_ids)
			.map((item) => item.split(","))
			.map((item) => item[_.without(getIndexValue, null)[0]]);

		const ChildIds = _.compact(
			_.compact(parent).map((item) => {
				if (selected_child.includes(Number(item?.child))) {
					return item;
				} else {
					return null;
				}
			})
		)
			.map((item) => item?.child_ids)
			.map((item) => item.split(","))
			.map((item) => item[_.without(getIndexValue, null)[0]]);

		// mandorty check
		const selectedQuotes = quotes.find(({ id }) => id === Number(QuoteId))
		const MandatoryProductFeatues = selectedQuotes.rfq_selected_plan.product_features.filter(({ is_mandantory }) => is_mandantory)
		const FilterProductFeature = MandatoryProductFeatues.filter(({ id }) => !ParentIds.some(selectedId => Number(selectedId) === id))
		if (FilterProductFeature.length > 0) {
			let msg = ''
			FilterProductFeature.forEach(({ product_feature_name }, index) =>
				msg = `${msg}
				${index + 1}. ${product_feature_name}`)
			swal('Mandatory Features For This Plan', msg, 'warning')
			return null;
		}

		const selectedQuoteMultiSum = quotes.find(({ id }) => id === Number(QuoteId))
		selectedQuoteMultiSum.rfq_selected_plan.product_features.forEach(({ id, product_type, product_detail }) => {
			const isPresent = ParentIds.some(parent_id => Number(parent_id) === id);
			if (isPresent) {
				const selectedProductDetail = product_detail.find(({ id: childId }) => {
					return ChildIds.some((child_id) => Number(child_id) === childId)
				})
				if ([1, 5].includes(product_type)) {
					selectedProductDetail && product_detail.forEach((elem) => {
						if (selectedProductDetail.sum_insured === elem.sum_insured) {
							ChildIds.push(String(elem.id))
						}
					})
				}
				if (product_type === 2) {
					selectedProductDetail && product_detail.forEach((elem) => {
						if (selectedProductDetail.duration_value === elem.duration_value &&
							selectedProductDetail.duration_unit === elem.duration_unit &&
							selectedProductDetail.duration_type === elem.duration_type &&
							selectedProductDetail.sum_insured === elem.sum_insured) {
							ChildIds.push(String(elem.id))
						}
					})
				}
				if (product_type === 3) {
					selectedProductDetail && product_detail.forEach((elem) => {
						if (selectedProductDetail.name === elem.name &&
							selectedProductDetail.sum_insured === elem.sum_insured) {
							ChildIds.push(String(elem.id))
						}
					})
				}
			}
		})

		let req = {
			// enquiry_id: view.enquiry_id,
			// ic_plan_id: view.rfq_selected_plan.selected_plan_id,
			plan_product_feature_ids: _.compact(ParentIds),
			plan_product_detail_ids: _.compact(ChildIds.filter(onlyUnique)),
			id: uwSingle.id,
			final_premium: PlanPremiums[0]
		};
		dispatch(updateUWQuote(req))

	}

	const onSubmitMethod = (data) => {
		const formdata = new FormData();
		for (let i in data) {
			if (i !== "parent") {
				formdata.append(i, data[i]);
			}
		}
		formdata.append("id", uwSingle.id);
		if (file) {
			formdata.append("employee_data", file);
		}
		//	const _response = { ...data, id: uwSingle.id, ...(file && { document: document }) }
		dispatch(updateUWQuote(formdata))
	};

	return (
		<>
			{!_.isEmpty(uwSingle) ? (
				<Row className="d-flex flex-wrap-reverse w-100">
					<Col sm="12" md="12" lg="8" xl="8">
						<CardBlue title={<Title _title={`Details`} _method={onClickHandlerEdit} _isEdit={edit} />} styles={{ marginRight: "0" }}>
							{!_.isEmpty(uwSingle) ? (
								!edit ?
									Lister({
										...uwSingle,
										...(!_.isEmpty(uwSingle?.rfq_selected_plan) && {
											final_premium: uwSingle?.rfq_selected_plan?.final_premium,
											plan_name: uwSingle?.rfq_selected_plan?.plan_name,
											sum_insured: uwSingle?.rfq_selected_plan?.sum_insured,
										}),
									}, undefined, uwSingle?.rfq_age_demography)
									:
									<Form onSubmit={handleSubmit(onSubmitMethod)}>
										{editDetails(Controller, { control, errors, register }, { statecity, industry_data, uwSingle, setFile })}
										<Row>
											<Col md={12} className="d-flex justify-content-end mt-4">
												<Button type="submit">
													Save
												</Button>
											</Col>
										</Row>
									</Form>
							) : (
								<noscript />
							)}
						</CardBlue>
						{!_.isEmpty(uwSingle?.rfq_leads_family_construct) && (
							<CardBlue title="Relation" styles={{ marginRight: "0" }}>
								{ListerFamily(uwSingle?.rfq_leads_family_construct || {})}
							</CardBlue>
						)}
						{!_.isEmpty(uwSingle?.general_family_construct) && (
							<CardBlue title="Relation" styles={{ marginRight: "0" }}>
								{ListerFamily(uwSingle?.general_family_construct || {}, true)}
							</CardBlue>
						)}
						{!_.isEmpty(uwSingle?.general_rfq_rates) && (
							<CardBlue title="RFQ Rate Details" styles={{ marginRight: "0" }}>
								{uwSingle?.general_rfq_rates?.map((_, index) =>
									Lister(uwSingle?.general_rfq_rates[index] || {}, index)
								)}
							</CardBlue>
						)}
						{!_.isEmpty(demographyData) && (
							<CardBlue title="Demography" styles={{ marginRight: "0" }}>
								<DataTable
									columns={TableDataDg || []}
									data={[demographyData] || []}
									noStatus={true}
									pageState={{ pageIndex: 0, pageSize: 5 }}
									pageSizeOptions={[5, 10]}
									rowStyle
								/>
							</CardBlue>
						)}
						{!_.isEmpty(uwSingle?.rfq_selected_plan?.ic_plan_product_features) && (
							<CardBlue title={<Title _title={`Plan Features`} _method={onClickFeatureHandlerEdit} _isEdit={featureEdit} />} styles={{ marginRight: "0" }}>
								<Row style={{
									marginTop: '-10px',
									marginBottom: '20px'
								}}>
									<PremiumBtn style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', letterSpacing: "2px" }}>
										Premium : {`₹ ${Number(PlanPremiums)}`}
									</PremiumBtn>
								</Row>
								<Row xs={1} sm={2} md={2} lg={2} xl={2}>
									<div className="p-2">
										<PlanFeature
											filterData={[uwSingle?.rfq_selected_plan]}
											parent={parent}
											register={register}
											setUpdate={setUpdate}
											totalPre={PlanPremiums}
											featureEdit={featureEdit}
										/>
									</div>
								</Row>
								{featureEdit &&
									<Row>
										<Col md={12} className="d-flex justify-content-end mt-4">
											<Button type="submit" onClick={updatePlanFeature}>
												Save
											</Button>
										</Col>
									</Row>
								}
							</CardBlue>
						)}
						{!_.isEmpty(uwSingle?.rfq_age_demography) && (
							<CardBlue title="Demography" styles={{ marginRight: "0" }}>
								<DataTable
									columns={TableDataDgnew || []}
									data={uwSingle?.rfq_age_demography || []}
									noStatus={true}
									pageState={{ pageIndex: 0, pageSize: 5 }}
									pageSizeOptions={[5, 10]}
									rowStyle
									EditFlag
									EditFunc={editDemography}
								/>
							</CardBlue>
						)}
						{!!uwSingle?.rfq_deficiency && (
							<CardBlue
								styles={{ marginRight: "0" }}
								title={
									<div
										className="d-flex justify-content-between"
										styles={{ marginRight: "0" }}
									>
										<span>Deficiency Details</span>
										{userType !== "customer" && (
											<Button
												type="button"
												onClick={() => {
													setModal({
														enquiry_id: uwSingle?.enquiry_id,
														rfq_leads_id: uwSingle?.id,
													});
												}}
												buttonStyle="outline-secondary"
											>
												+ Add
											</Button>
										)}
									</div>
								}
							>
								<DataTable
									columns={TableData(userType !== "customer") || []}
									data={uwSingle?.rfq_deficiency || []}
									noStatus={true}
									pageState={{ pageIndex: 0, pageSize: 5 }}
									pageSizeOptions={[5, 10]}
									rowStyle
									EditFlag
									// deficiencyStatus
									EditFunc={EditMember}
									viewFn={viewDefFn}
									viewFlag
								/>
							</CardBlue>
						)}
					</Col>
					<Col sm="12" md="12" lg="4" xl="4">
						<CompactCard removeBottomHeader={true}>
							{RFQStatus(uwSingle?.status, uwSingle)}
						</CompactCard>
					</Col>
				</Row>
			) : (
				<Loader />
			)}
			{!!modal && (
				userType !== "customer" ? (
					<EditModal
						show={!!modal}
						onHide={() => setModal(null)}
						Data={modal}
						ic={currentUser?.ic_id} //|| IcId}
						brokerId={currentUser?.broker_id} //|| brokerId}
					/>
				) : (
					<CustomerDeficiency
						show={!!modal}
						onHide={() => setModal(null)}
						def={modal}
						Redispatch={Redispatch}
					/>
				)
			)}
			<DefView
				show={viewDef}
				onHide={() => setViewDef(false)}
				Data={viewDef || []}
			/>
			<DemographyModal
				show={demographyModal}
				onHide={() => setDemographyModal(false)}
				Data={demographyModal || []}
				qouteData={uwSingle}
			// ic={currentUser?.ic_id || IcId}
			// brokerId={currentUser?.broker_id || brokerId}
			/>
			{loading && <Loader />}
		</>
	);
};

const PremiumBtn = styled.span`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    letter-spacing: 2px;
    background: #1bf29e;
    border-radius: 10px;
    padding: 3px 10px;
    box-shadow: 1px 2px 4px 2px #f2f2f2;
    border: 1px solid #d8d8d8;
    color: white;
    
`;

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
