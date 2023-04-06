import React, { useEffect, useState } from "react";
import { RFQfamilyMemeberCard, RFQButton, Loader } from "components";
import { useForm } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
import { BackBtn } from "../button";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
// import styled from "styled-components";
import { numOnly, noSpecial } from "../../../../../utils";
import { InfoCard, Title } from "modules/RFQ/data-upload/style";

import { saveCompanyData, clear, set_company_data } from "../../home.slice";
// import * as yup from "yup";
import _ from "lodash";
import swal from "sweetalert";
import { DefaultValue } from "../about-team/AboutTeam";
import { doesHasIdParam } from "../../home";
import { sortRelation } from "../../../plan-configuration/helper";
import { getChildAge } from 'modules/RFQ/plan-configuration/helper';

// const ColHeader = styled(Col)`
// 	@media screen and (max-width: 990px) {
// 		justify-content: center;
// 	}
// `;

export const FamilyCount = ({ utm_source }) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const location = useLocation();

	//enquiry id
	const query = new URLSearchParams(location.search);
	const id = decodeURIComponent(query.get("enquiry_id"));
	const brokerId = query.get("broker_id");
	const insurerId = query.get("insurer_id");
	const { globalTheme } = useSelector(state => state.theme)
	const {
		enquiry_id,
		loading,
		success,
		company_data,
		industry_data,
		relationListData,
	} = useSelector((state) => state.RFQHome);

	const [relations, setRelations] = useState([]);
	const [relationData, setRelationData] = useState("");
	/*----------validation schema----------*/
	// const validationSchema = yup.object().shape({});
	/*----x-----validation schema-----x----*/

	const { register, handleSubmit, errors, setValue } = useForm({
		// validationSchema,
		mode: "onBlur",
		reValidateMode: "onBlur",
	});

	// redirect if !id
	useEffect(() => {
		if (!id) {
			history.replace(`/company-details`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	var relationId;
	// 	if (company_data?.family_construct) {
	// 		relationId = company_data?.family_construct.map((item) => {
	// 			return item.relation_id;
	// 		});
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [company_data.family_construct]);

	useEffect(() => {
		if (!_.isEmpty(company_data)) {
			setRelationData(company_data?.relation_type);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data]);

	useEffect(() => {
		if (success && (enquiry_id || id)) {
			history.push(`/about-team?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}`);
		}
		return () => {
			dispatch(clear());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success, enquiry_id, id]);

	//set relation list
	useEffect(() => {
		if (!_.isEmpty(industry_data?.relations)) {

			setRelations(sortRelation(industry_data?.relations));
		}
	}, [industry_data.relations]);

	const onSubmit = (data) => {

		let values = Object.values(data);
		let keys = Object.keys(data);

		let _childAgeCount = keys.includes("3") ? (getChildAge(relationListData)) * parseInt(data['1']) : null;
		let _partnerAgeCount = keys.includes("2") ?
			(relationListData.find(({ relation_id }) => relation_id === 2).no_of_relation) * parseInt(data['1']) : null;

		if (values.includes("")) {
			swal("Count of members is required", "", "warning");
		} else if (
			values.includes("0") &&
			(company_data.family_type === 0 ||
				company_data.family_type === 1)
		) {
			swal("Count of members cannot be 0", "", "warning");
		} else if (parseInt(data['1']) < 7) {
			swal("Count of employee must be greater than 6", "", "warning");
		} else if (
			keys.includes("2") &&
			parseInt(data['2']) > _partnerAgeCount
		) {
			swal(`Count of spouse cannot be more than ${_partnerAgeCount}`, "", "warning");
		} else if (
			keys.includes("2") &&
			parseInt(data['1'] || company_data.no_of_employees) < parseInt(data['2'])
		) {
			swal("Count of spouse cannot be more than employee(" +
				(data['1'] || company_data.no_of_employees) + ")", "", "warning");
		} else if (
			keys.includes("2") &&
			parseInt(data['2']) === 0
		) {
			swal("Count of spouse cannot be 0", "", "warning");
		} else if (
			(keys.includes("3")) &&
			parseInt(data['3'] || 0) === 0
		) {
			swal("Count of children cannot be 0", "", "warning");
		} else if (keys.includes("3") && parseInt(data['3']) > _childAgeCount) {
			swal(`Count of children cannot be more than ${_childAgeCount}`, "", "warning");
		} else if (
			(keys.includes("5")) &&
			(parseInt(data['5'] || 0) >
				2 * parseInt(data['1'] || company_data.no_of_employees))) {
			swal("Count of parents cannot be more than employee count(" +
				2 * (data['1'] || company_data.no_of_employees) + ")", "", "warning");
		} else if (
			(keys.includes("5")) &&
			parseInt(data['5'] || 0) === 0) {
			swal("Count of parents cannot be 0", "", "warning");
		} else if (
			(keys.includes("7")) &&
			(parseInt(data['7'] || 0) >
				2 * parseInt(data['1'] || company_data.no_of_employees))) {
			swal("Count of parents in law cannot be more than employee count(" +
				2 * (data['1'] || company_data.no_of_employees) + ")", "", "warning");
		} else if (
			(keys.includes("7")) &&
			parseInt(data['7'] || 0) === 0) {
			swal("Count of parents in law cannot be 0", "", "warning");
		} else {

			let count = relations.map((item) => {
				if (relationData?.includes(item.id)) {
					const container = {};
					container["id"] = item.id;
					container["count"] = parseInt(data[item.id]);
					return container;
				}
				return null;
			});
			count = refillRelations(count);
			let request = {
				step: 6,
				enquiry_id: id,
				counts: count.filter((elm) => elm),
			};
			dispatch(saveCompanyData(request));
			dispatch(
				set_company_data({
					family_construct: request?.counts.map(({ id, count }) => ({
						relation_id: Number(id),
						no_of_relations: Number(count),
					})),
					no_of_employees: DefaultValue(company_data, request?.counts.map(({ id, count }) => ({
						relation_id: Number(id),
						no_of_relations: Number(count),
					})))
				})
			);
		}
	}

	const Count = relations.map((item) => {
		if (relationData?.includes(item.id)) {
			const match = (company_data.family_construct || []).find(
				(elem) => elem?.relation_id * 1 === item?.id * 1
			);

			const onInput = (e) => {
				if (Number(e.target?.value) > 1000) {
					setValue(item?.name, 1000)
				}
			}

			return (
				<Col sm="12" md="12" lg="12" xl="6" key={item.id}>
					<RFQfamilyMemeberCard
						name={item?.id}
						inputRef={register}
						onKeyDown={numOnly} onKeyPress={noSpecial}
						type='tel'
						onInput={onInput}
						defaultValue={
							!_.isEmpty(match)
								? match?.no_of_relations :
								// Lookup.includes(item?.id * 1)?
								Number(company_data.no_of_employees) || 10
							// : 1
						}
						error={errors?.item?.name}
						maxLength="4"
						inputLabel={item?.name === "Self" ? "Employee" : item?.name}
						imgSrc={item.name ? item.logo : "/assets/images/icon/spouse.png"}
						isRequired={true}
					/>
				</Col>
			);
		}
		return null;
	});

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className="d-flex">
					<Col sm="12" md="12" lg="12" xl="12" className="d-flex mb-4">
						<BackBtn
							url={`/family-construct?enquiry_id=${encodeURIComponent(enquiry_id || id)}${doesHasIdParam({ brokerId, insurerId })}`}
							style={{ outline: "none", border: "none", background: "none" }}
						>
							<img
								src="/assets/images/icon/Group-7347.png"
								alt="bck"
								height="45"
								width="45"
							/>
						</BackBtn>
						<h1 style={{ fontWeight: "600", marginLeft: "10px", fontSize: globalTheme.fontSize ? `calc(1.6rem + ${globalTheme.fontSize - 92}%)` : '1.6rem' }}>
							{relationData?.length === 1 && relationData[0] === 1 ? `Enter the number of employees` : `Enter the number of family members`}
						</h1>
					</Col>
					<div
						className="d-flex flex-wrap-reverse"
						style={{ paddingLeft: "2.5%" }}
					>
						<Col
							sm="12"
							md="12"
							lg="7"
							xl="7"
							className="pl-4 pr-4 d-flex flex-wrap align-content-start"
						>
							{!!company_data?.company_name && Count}
							<Col sm="12" md="12" lg="12" xl="12" className="w-100 mt-4 pt-4">
								<RFQButton>
									Next
									<i className="fa fa-long-arrow-right" aria-hidden="true" />
								</RFQButton>
							</Col>
						</Col>
						<Col sm="12" md="12" lg="5" xl="5">
							{/* <Row className="w-100  h-100">
							<Col sm="12" md="12" lg="12" xl="12">
								<RFQcard
									title="Get tailored pricing"
									content="We use this info to find a plan that is tailored for your company. having your email id let us send you a detailed quotes"
									imgSrc="/assets/images/women_user.png"
								/>
							</Col>
						</Row> */}
							<InfoCard>
								<img
									alt="tasveer"
									src="/assets/images/women_user.png"
									height="50"
									width="50"
								/>
								<Title fontSize="1.5rem">
									We have filled the counts with our best guess,please edit as
									per actuals
								</Title>
								<p style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>
									we use heuristics to prefill the family numbers but you can
									override with exact numbers to get accurate price.Remember,
									spouse cannot be more than employees.
								</p>
							</InfoCard>
						</Col>
					</div>
				</Row>
			</Form>
			{(loading || success) && <Loader />}
		</>
	);
};

const refillRelations = (ages) => {
	let storeRelation = []
	for (let age of ages) {
		if (!age) continue;
		const id = Number(age.id);
		if ([4, 6, 8].includes(id)) {

		} else if ([3, 5, 7].includes(id)) {
			storeRelation.push(age)
			storeRelation.push({ count: 0, id: id + 1 })
		} else {
			storeRelation.push(age)
		}
	}
	return storeRelation
}
