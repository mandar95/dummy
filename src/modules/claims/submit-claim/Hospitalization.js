import React, { useState, useEffect } from "react";
import * as yup from "yup";
import _ from "lodash";

import { Input, Button, Error, Select } from "components";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Form } from "react-bootstrap";
// import Select from "modules/user-management/Onboard/Select/Select";
import { ReimbursementModal } from "./Modal";
import Typeahead from "./TypeSelect/TypeSelect";
import {
	StyledProgressBar,
	ProgressText,
	ProgressCount,
	CaneclDiv,
} from "./style";

import { useDispatch, useSelector } from "react-redux";
import { claim, loadCity, loadState, loadHospitals } from "../claims.slice";
import { common_module } from 'config/validations';
import { noSpecial, numOnly } from "utils";

const validation = common_module.submit_claim

const validationSchema = (customHospitalName) => yup.object().shape({
	hospital_name: yup.string().required("Hospital Name required")
		.min(validation.hospital_name.min, `Minimum ${validation.hospital_name.min} character required`)
		.max(validation.hospital_name.max, `Maximum ${validation.hospital_name.max} character available`),
	...customHospitalName && {
		hospital_pincode: yup
		.string()
		.required("Pincode required")
		.min(
		  validation.pincode.length,
		  `Pincode must consist ${validation.pincode.length} digits`
		)
		.max(
		  validation.pincode.length,
		  `Pincode must consist ${validation.pincode.length} digits`
		)
		.matches(validation.pincode.regex, "Invalid pincode"),
		hospital_mobile_no: yup.string()
		.required('Mobile No. is required')
		.min(validation.mobile_no.length, "Mobile No. should be 10 digits")
		.max(validation.mobile_no.length, "Mobile No. should be 10 digits")
		.matches(validation.mobile_no.regex, 'Not valid number'),
	},
	reason: yup.string()
		.min(validation.reason.min, `Minimum ${validation.reason.min} character required`)
		.max(validation.reason.max, `Maximum ${validation.reason.max} character available`)
		.matches(validation.reason.regex, { message: 'Must contain only alphabets', excludeEmptyString: true })
		.notRequired().nullable(),
	disease: yup.string().required("Disease required").nullable()
		.min(validation.disease.min, `Minimum ${validation.disease.min} character required`)
		.max(validation.disease.max, `Maximum ${validation.disease.max} character available`)
		.matches(validation.disease.regex, 'Must contain only alphabets'),
	hospital_addres: yup.string().required("Hospital Address required")
		.min(validation.hospital_address.min, `Minimum ${validation.hospital_address.min} character required`)
		.max(validation.hospital_address.max, `Maximum ${validation.hospital_address.max} character available`),
	doctor_name: yup.string().required("Doctor Name required")
		.min(validation.doctor.min, `Minimum ${validation.doctor.min} character required`)
		.max(validation.doctor.max, `Maximum ${validation.doctor.max} character available`)
		.test("alphabets", "Name must contain only alphabets & .(dots)", (value) => {
			return validation.doctor.regex.test(value?.trim());
		}),
	state_id: yup.string().required("State required"),
	city_id: yup.string().required("City required").nullable(),
});

export const Hospitalization = (props) => {
	const [modal, setModal] = useState(false);
	const [customHospitalName, setCustomHospitalName] = useState(false);

	const {
		control,
		errors,
		reset,
		handleSubmit,
		watch,
		register,
		setValue,
	} = useForm({
		defaultValues: props.data || {},
		validationSchema: validationSchema(customHospitalName),
	});

	const dispatch = useDispatch();
	const { cities, states, hospitals } = useSelector(claim);

	useEffect(() => {
		dispatch(loadState());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (props.data.hospital_name)
			reset({ hospital_name: props.data.hospital_name });
	}, [reset, props.data.hospital_name]);

	// useEffect(() => {
	// 	if (props.hospitalData?.hospital_name && props.policyId) {
	// 		// dispatch(hospitalByName({ hospital_name: props.hospitalData.hospital_name, policy_id: props.policyId }))
	// 	}
	// }, [props.hospitalData, props.policyId]);

	useEffect(() => {
		if (props.data?.state_id) {
			cityRequest(props.data?.state_id);
			reset({ hospital_state: props.data?.state_id });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data?.state_id]);

	useEffect(() => {
		if (props.data?.city_id && cities) {
			hospitalRequest(props.data?.city_id);
			reset({ hospital_city: props.data?.city_id });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data?.city_id, cities]);

	useEffect(() => {
		if (props.data?.hospital_name && hospitals) {
			const filterHosp = hospitals.find(
				({ hospital_name }) => hospital_name === props.data?.hospital_name
			);
			!_.isEmpty(filterHosp) && props.setHospitalData(filterHosp);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.data?.hospital_name, hospitals]);

	const cityRequest = (state_id) => {
		if (state_id) dispatch(loadCity({ state_id }));
	};

	const hospitalRequest = (city_id) => {
		const city = cities?.find((elem) => elem.id === Number(city_id));
		if (props?.policyId && city)
			dispatch(
				loadHospitals({ city_name: city?.city_name, policy_id: props?.policyId })
			);
	};

	const onSubmit = (data) => {
		if (_.isEmpty(props.data.tableBill)) {
			// toast.warning("Click on Reimbursement Expenses to fill bills ", { autoClose: true });
			setTimeout(() => {
				setModal(true);
			}, 500);
		} else {
			props.submitData(2, data);
		}
	};

	// const searchHospital = (hospitalData) => {
	//   if (hospitalData)
	//     props.setHospitalData(hospitalData)

	// }

	const addData = (data) => {
		if (data) props.postModal(data);
	};

	const state_data = states?.filter(
		({ id }) => Number(id) === Number(watch("state_id"))
	);
	const city_data = cities?.filter(
		({ id }) => Number(id) === Number(watch("city_id"))
	);

	useEffect(() => {
		if (!_.isEmpty(state_data)) setValue("state_name", state_data[0]?.state_name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state_data]);

	useEffect(() => {
		if (!_.isEmpty(city_data)) setValue("city_name", city_data[0]?.city_name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [city_data]);

	const currentPolicyDetail = props.policyData.find(({ id }) => id === Number(props.policyId)) || {};

	useEffect(() =>{
		if(hospitals.length && props.data?.hospital_name){
			const isCustom = hospitals?.find(d => d.hospital_name === props.data.hospital_name);
			if(!isCustom){
			  setCustomHospitalName(true)
			}else{
			  setCustomHospitalName(false)
			}
		  }
	}, [props.data.hospital_name, hospitals])

	return (
		<>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className="d-flex flex-wrap" style={{ margin: "0px" }}>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Input label="Doctor Name" maxLength={validation.doctor.max}
									placeholder="Enter Doctor Name" isRequired={true}
									required={false} />
							}
							name="doctor_name"
							error={errors && errors.doctor_name}
							control={control}
						/>
						{!!errors.doctor_name && <Error>{errors.doctor_name.message}</Error>}
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Select
									label={`${props?.type === "opd" ? "Clinic" : "Hospital"} State`}
									placeholder={`Select State`}
									options={
										states.map((item) => ({
											id: item.id,
											name: item.state_name,
											value: item.id,
										})) || []
									}
									// selected={Number(props.data.state_id) || ""}
									id="hospital_state"
									isRequired={true}
									required={false}
								/>
							}
							defaultValue={''}
							onChange={([e]) => {
								cityRequest(e.target?.value);
								return e.target?.value;
							}}
							error={errors && errors.state_id}
							name="state_id"
							control={control}
						/>
						{!!errors.state_id && <Error>{errors.state_id.message}</Error>}
						<input type="hidden" name={"state_name"} ref={register} />
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Select
									label={`${props?.type === "opd" ? "Clinic" : "Hospital"} City`}
									placeholder="Select City"
									options={
										cities.map((item) => ({
											id: item.id,
											name: item.city_name,
											value: item.id,
										})) || []
									}
									// selected={Number(props.data.city_id) || ""}
									id="hospital_city"
									isRequired={true}
									required={false}
								/>
							}
							defaultValue={''}
							onChange={([e]) => {
								hospitalRequest(e.target?.value);
								return e.target?.value;
							}}
							error={errors && errors.city_id}
							name="city_id"
							control={control}
						/>
						{!!errors.city_id && <Error>{errors.city_id.message}</Error>}
						<input type="hidden" name={"city_name"} ref={register} />
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Typeahead
									label={`${props?.type === "opd" ? "Clinic" : "Hospital"} Name`}
									id="hopitalName"
									maxLength={validation.hospital_name.max}
									valueName="hospital_name"
									options={hospitals || []}
									placeholder={`Enter ${props?.type === "opd" ? "Clinic" : "Hospital"
										} Name`}
									isRequired={true}
									required={false}
								/>
							}
							defaultValue={props.data.hospital_name ? props.data.hospital_name : ""}
							onChange={([data]) => {
								if(data?.hospital_name){
								  const isCustom = hospitals?.find(d => d.hospital_name === data.hospital_name);
								  if(!isCustom){
									setCustomHospitalName(true)
								  }else{
									setCustomHospitalName(false)
								  }
								}
								props.setHospitalData(data);
								return data?.hospital_name || "";
							}}
							error={errors && errors.hospital_name}
							name="hospital_name"
							control={control}
						/>
						{!!errors.hospital_name && <Error>{errors.hospital_name.message}</Error>}
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Input
									label={`${props?.type === "opd" ? "Clinic" : "Hospital"} Address`}
									maxLength={validation.hospital_address.max}
									placeholder={`Enter ${props?.type === "opd" ? "Clinic" : "Hospital"
										} Address`}
									isRequired={true}
									required={false}
								/>
							}
							name="hospital_addres"
							error={errors && errors.hospital_addres}
							control={control}
						/>
						{!!errors.hospital_addres && (
							<Error>{errors.hospital_addres.message}</Error>
						)}
					</Col>
				{ customHospitalName && <>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Input 
								  label="Hospital Pincode" 
								  placeholder="Enter Hospital Pincode" 
								  min={0}
								  type='tel'
								  maxLength={validation.pincode.length}
								  onKeyDown={numOnly} onKeyPress={noSpecial}
								  required
								 />
							}
							defaultValue={props.data.hospital_pincode ? props.data.hospital_pincode : ""}
							name="hospital_pincode"
							error={errors && errors.hospital_pincode}
							control={control}
						/>
						{!!errors.hospital_pincode && <Error>{errors.hospital_pincode.message}</Error>}
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Input 
								  label="Hospital Contact No"
								  placeholder="Enter Hospital Contact No"
								  min={0}
								  type='tel'
								  maxLength={validation.mobile_no.length}
								  onKeyDown={numOnly} onKeyPress={noSpecial}
								  required 
								/>
							}
							defaultValue={props.data.hospital_mobile_no ? props.data.hospital_mobile_no : ""}
							name="hospital_mobile_no"
							error={errors && errors.hospital_mobile_no}
							control={control}
						/>
						{!!errors.hospital_mobile_no && <Error>{errors.hospital_mobile_no.message}</Error>}
					</Col>
				 </> }
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={
								<Input
									label="Disease/Illness"
									maxLength={validation.disease.max}
									placeholder="Enter Disease/Illness"
									isRequired={true}
									required={false}
								/>
							}
							name="disease"
							error={errors && errors.disease}
							control={control}
						/>
						{!!errors.disease && <Error>{errors.disease.message}</Error>}
					</Col>
					<Col md={6} lg={6} xl={4} sm={12}>
						<Controller
							as={<Input label="Remarks" maxLength={validation.reason.max}
								placeholder="Enter Remarks" required={false} />}
							name="reason"
							error={errors && errors.reason}
							control={control}
						/>
						{!!errors.reason && <Error>{errors.reason.message}</Error>}
					</Col>
					<Col md={6} lg={6} xl={4} sm={12} className="my-auto text-center">
						<Button
							type="button"
							buttonStyle="outline"
							onClick={() => {
								setModal(true);
							}}
						>
							Reimbursement Expenses <i className="ti-pencil-alt" />
						</Button>
					</Col>
				</Row>
				<div className="mt-4 d-flex flex-wrap justify-content-between">
					<div md={4} className="text-center">
						<StyledProgressBar now={props.progress} />
						<ProgressText>
							<ProgressCount>{`${props.progress}% `}</ProgressCount>
							of 100 Completed
						</ProgressText>
					</div>
					<div className="d-flex flex-wrap h-50 justify-content-end">
						<CaneclDiv>
							<Button
								type="button"
								onClick={() => props.previousPage(1)}
								buttonStyle="outline-secondary"
							>
								Previous
							</Button>
						</CaneclDiv>
						<Button type="submit" className="ml-4">
							Save &amp; Next
						</Button>
					</div>
				</div>
			</Form>
			{modal && <ReimbursementModal
				data={_.cloneDeep(props.data?.tableBill)}
				currentPolicyDetail={currentPolicyDetail}
				// ClaimSubType
				// claim_hospitalization_type={props.data?.claim_hospitalization_type}
				watch={watch}
				submitdata={(data) => addData(data)}
				show={modal}
				formatDate={props.formatDate}
				minDate={props.minDate}
				maxDate={props.maxDate}
				onHide={() => setModal(false)}
				type={props.type || ""}
			/>}
		</>
	);
};
