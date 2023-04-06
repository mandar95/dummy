import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
// import { Select } from "../../../components/select/Select";
import { Select } from "../../../components"
import { RFQfamilyMemeberCard, Error } from "components";

import { numOnly, noSpecial } from '../../../../../utils'
import _ from 'lodash';
import * as yup from "yup";

import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const FamilyCover = () => {
	// const dispatch = useDispatch();
	// const history = useHistory();
	// const location = useLocation();
	// const query = new URLSearchParams(location.search);
	// const id = decodeURIComponent(query.get("enquiry_id"));
	const { company_data, industry_data } = useSelector(state => state.RFQHome);

	const averageAgeEmployees = [
		{ id: 1, name: '18-25 Yrs', value: '18-25' },
		{ id: 2, name: '26-35 Yrs', value: '26-35' },
		{ id: 3, name: '36-50 Yrs', value: '36-50' },
		{ id: 4, name: '51-65 Yrs', value: '51-65' },
	]

	const familyTypes = [
		// { id: 1, name: "Parents, spouse", value: 1 },
		// { id: 2, name: "Parents, spouse, children", value: 2 },
		// { id: 3, name: "Parents, spouse, inlaws, children", value: 3 },
		{ id: 0, name: "Employee only", value: 0 },
		{ id: 1, name: "Employee and spouse", value: 1 },
		{ id: 2, name: "Employee, spouse and children", value: 2 },
		{ id: 3, name: "Employee, spouse, children and parents", value: 3 },
		{ id: 4, name: "Other member", value: 4 },
	]


	const [relations, setRelations] = useState([]);
	const [relationData, setRelationData] = useState("");
	const Lookup = [1, 2, 3, 4, 5, 6];

	/*----------validation schema----------*/
	const validationSchema = yup.object().shape({
		average_age: yup.string().required("Average age is required"),
		family_type: company_data?.family_type ? company_data?.family_type : 0,
	});
	const { handleSubmit, errors, register, setValue } = useForm({
		validationSchema,
		mode: "onBlur",
		reValidateMode: "onBlur"
	});

	// -----------------------------average age logic----------------------------------------
	useEffect(() => {
		setValue("average_age", company_data?.average_age);
		setValue("family_type", company_data?.family_type);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company_data])

	// -----------------------------family count logic----------------------------------------
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
		if (!_.isEmpty(company_data?.relation_type)) {
			setRelationData(company_data?.relation_type);
		}
	}, [company_data.relation_type]);

	//set relation list
	useEffect(() => {
		if (!_.isEmpty(industry_data?.relations)) {
			setRelations(industry_data?.relations);
		}
	}, [industry_data.relations]);

	const Count = relations.map((item) => {
		if (relationData?.includes(item.id)) {
			const match = (company_data.family_construct || []).filter(
				(elem) => elem?.relation_id * 1 === item?.id * 1
			);

			return (
				<div className="p-2" key={item.id + 'relations'}>
					<RFQfamilyMemeberCard
						name={item?.name}
						inputRef={register}
						onKeyDown={numOnly} onKeyPress={noSpecial}
						type='tel'
						readOnly={true}
						defaultValue={
							!_.isEmpty(match)
								? match[0]?.no_of_relations
								: Lookup.includes(item?.id * 1)
									? company_data.no_of_employees
									: ""
						}
						error={errors?.item?.name}
						inputLabel={item?.name}
						imgSrc={item.name ? item.logo : "/assets/images/icon/spouse.png"}
						isRequired={true}
					/>
				</div>
			);
		}
		return null
	});

	const onSubmit = (data) => {

	}
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Row className="mt-4">
				<Col sm="10" md="12" lg="6" xl="6">
					<h2 style={{ fontWeight: "600" }}>Family Cover</h2>
					<p>Family construct and relation count</p>
				</Col>
				<Col sm="12" md="12" lg="12" xl="12" className="mt-2">
					<Select
						name="family_type"
						label="Choose family type"
						autoComplete="none"
						placeholder="Select family type"
						id="family_type"
						inputRef={register}
						isRequired={true}
						disabled={true}
						required={false}
						defaultValue={""}
						options={familyTypes}
						error={errors.family_type}
					/>
					{!!(errors.family_type) && <Error className="mt-0">{errors.family_type.message}</Error>}
				</Col>
				<Col sm="12" md="12" lg="12" xl="12" className="mt-2">
					<Select
						label="Average age of your employees"
						name="average_age"
						autoComplete="none"
						placeholder="Select average age"
						id="average_age"
						inputRef={register}
						disabled={true}
						isRequired={true}
						required={false}
						defaultValue={""}
						options={averageAgeEmployees}
						error={errors.average_age}
					/>
					{!!(errors.average_age) && <Error className="mt-0">{errors.average_age.message}</Error>}
				</Col>
				<Col sm="10" md="12" lg="6" xl="6" className="mt-4">
					<p>Member relation count is given below.</p>
				</Col>
			</Row>
			<Row xs={1} sm={2} md={3} lg={4} xl={4}>
				{Count}
			</Row>
			<Row>
				{/* <Col sm="12" md="12" lg="12" xl="12" className="mt-2">
						<RFQButton>Update Invoice</RFQButton>
					</Col> */}
			</Row>
		</Form>
	);
};

export default FamilyCover;
