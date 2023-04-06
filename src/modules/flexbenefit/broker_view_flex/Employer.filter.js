import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconlessCard, SelectComponent, Button } from "../../../components"
import styled from 'styled-components'
import {
	// fetchEmployers,
	selectEmployer,
	//  employers
} from './flexbenefit.slice';
import { fetchEmployers, setPageData } from 'modules/networkHospital_broker/networkhospitalbroker.slice';
import { useForm, Controller } from "react-hook-form";


const Title = styled.div`
padding  : 1rem;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
`;


export const EmployerFilter = ({ setEmpID, userType }) => {
	const [selectEmp, setEmp] = useState({ id: "", company_name: "" });
	const dispatch = useDispatch();
	// const Employers = useSelector(employers);
	const { currentUser } = useSelector(state => state.login);
	const { control } = useForm();
	const { employers,
		firstPage,
		lastPage, } = useSelector(
			(state) => state.networkhospitalbroker
		);

	useEffect(() => {
		return () => {
			dispatch(setPageData({
				firstPage: 1,
				lastPage: 1
			}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// useEffect(() => {
	// 	if (currentUser.broker_id)
	// 		dispatch(fetchEmployers(currentUser.broker_id));
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [currentUser])

	useEffect(() => {
		if ((currentUser?.broker_id)) {
			if (lastPage >= firstPage) {
				var _TimeOut = setTimeout(_callback, 250);
			}
			function _callback() {
				dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
			}
			return () => {
				clearTimeout(_TimeOut)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstPage, currentUser]);

	useEffect(() => {
		if (!!selectEmp.id && !!selectEmp.company_name) {
			dispatch(selectEmployer(selectEmp))
		} else if (currentUser.employer_id) {
			dispatch(selectEmployer({ id: currentUser.employer_id, company_name: currentUser.employer_name }))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectEmp, currentUser])

	const changeHandler = ([e]) => {

		if (e?.value) {
			setEmp({ id: e.id, company_name: e.value });
			setEmpID(e.value)
		}
		return e
	}
	if (userType === 'employer' && !(currentUser.is_super_hr && currentUser.child_entities.length)) {
		return null
	}
	return <IconlessCard title={<Title>Filter by Employer</Title>} styles={{
		maxWidth: "280px"
	}}>


		{!!(currentUser.is_super_hr && currentUser.child_entities.length) ?
			<Controller
				as={<SelectComponent
					label="Employer"
					placeholder='Select Employer'
					options={currentUser.child_entities.map(item => (
						{
							id: item.id,
							label: item.name,
							value: item.id
						}
					)) || []}
					id="employer_id"
					required
				/>}
				defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
				onChange={changeHandler}
				name="employer_id"
				control={control}
			/> :
			<Controller
				as={<SelectComponent
					label="Employer"
					placeholder='Select Employer'
					options={employers.map((item) => ({
						id: item?.id,
						label: item?.name,
						value: item?.id,
					}))}
					id="employer_id"
					required
				/>}
				onChange={changeHandler}
				name="employer_id"
				control={control}
			/>}

		<Button buttonStyle={"danger"} onClick={() => window.location.reload()}>Reset</Button>
	</IconlessCard>
}
