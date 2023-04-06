import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { IconlessCard, TabWrapper, Tab, Loader, SelectComponent } from '../../components';
import { employeeFormCenter } from './form.center.service';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Col, Row } from 'react-bootstrap';

const Styled = {
	IconlessCard: {
		borderRadius: '2em',
		maxWidth: '900px',
		height: "100%",
		cursor: 'pointer',
	}
}

const useSelectedData = (Tab, data, setter, employer_id) => {
	useEffect(() => {
		setter((prev) => {
			let newVal = data?.filter(v => v.policy_name === Tab && employer_id === v.employer_id);
			return newVal;
		})
		// eslint-disable-next-line
	}, [Tab, data, employer_id])
}

function EmployeeFormCenter() {
	const { globalTheme } = useSelector(state => state.theme)
	const [tab, setTab] = useState("Group Mediclaim");
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true)
	const [selectedData, setSelectedData] = useState([]);
	const { userType } = useParams()
	const { currentUser } = useSelector(state => state.login)
	const [employer, setEmployer] = useState({});

	useEffect(() => {
		if (!_.isEmpty(currentUser))
			employeeFormCenter(userType, currentUser.is_super_hr).then(res => {
				setData(res?.data?.data);
				setLoading(false)
			}).catch(err => {
				setLoading(false)
				console.error(err.message)
			});
		if (currentUser) {
			setEmployer({ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name })
		}
	}, [userType, currentUser])

	useEffect(() => {
		if (!data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Mediclaim'))) {
			if (data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Personal Accident'))) {
				setTab("Group Personal Accident")
			} else if (data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Term Life'))) {
				setTab("Group Term Life")
			}
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])



	useSelectedData(tab, data, setSelectedData, employer.value);

	return loading ? <Loader /> : (
		<>

			{userType === 'employee' && !!data?.length && data.some(({ employer_id }) => employer_id === employer?.value) && <TabWrapper width='max-content'>
				{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Mediclaim')) && <Tab isActive={Boolean(tab === "Group Mediclaim")} onClick={() => setTab("Group Mediclaim")}>Group Mediclaim</Tab>}
				{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Personal Accident')) && <Tab isActive={Boolean(tab === "Group Personal Accident")} onClick={() => setTab("Group Personal Accident")}>Group Personal Accident</Tab>}
				{/* abhi changes */}
				{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Term Life')) && <Tab isActive={Boolean(tab === "Group Term Life")} onClick={() => setTab("Group Term Life")}>Group Term Life</Tab>}
			</TabWrapper>}

			<IconlessCard styles={Styled.IconlessCard}
				title={selectedData?.length ? (`${employer.label ? employer.label + ' : ' : ''}${tab}`) : (employer.label || '')}
			>
				{userType === 'employer' && !!(currentUser.is_super_hr && currentUser.child_entities.length) && <Row>
					<Col xs={12} sm={12} md={6} lg={6} xl={6}>
						<SelectComponent
							label="Select Employer"
							placeholder="Select Employer"
							options={currentUser.child_entities.map(item => (
								{
									id: item.id,
									label: item.name,
									value: item.id
								}
							)) || []}
							value={employer}
							isRequired
							defaultValue={{ id: currentUser.employer_id, value: currentUser.employer_id, label: currentUser.employer_name }}
							name="employer_id"
							onChange={(selected) => {
								setEmployer(selected)
								setTab("Group Mediclaim")
								return selected;
							}}
						/>
					</Col>
				</Row>}

				{userType === 'employer' && !!data?.length && data.some(({ employer_id }) => employer_id === employer?.value) && <TabWrapper className='ml-0' width='max-content'>
					{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Mediclaim')) && <Tab isActive={Boolean(tab === "Group Mediclaim")} onClick={() => setTab("Group Mediclaim")}>Group Mediclaim</Tab>}
					{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Personal Accident')) && <Tab isActive={Boolean(tab === "Group Personal Accident")} onClick={() => setTab("Group Personal Accident")}>Group Personal Accident</Tab>}
					{/* abhi changes */}
					{data.some(({ policy_name, employer_id }) => employer_id === employer?.value && policy_name.includes('Term Life')) && <Tab isActive={Boolean(tab === "Group Term Life")} onClick={() => setTab("Group Term Life")}>Group Term Life</Tab>}
				</TabWrapper>}
				{selectedData?.length ? <div className="row">
					{
						selectedData?.map((v, i) =>
							<div className="col-12 col-lg-6" key={i + 'data-55'}>
								<ClaimForm className="my-1">
									{v.document_name}
									<Wrapper>
										<i className="ti-cloud-down" style={{ fontSize: globalTheme.fontSize ? `calc(1.4em + ${globalTheme.fontSize - 92}%)` : '1.4em', margin: "1em 0em" }} onClick={() => window.open(v.document_path)}></i>
									</Wrapper>
								</ClaimForm>
							</div>
						)
					}
				</div> :
					<h1 className='text-center display-4 text-secondary'>
						No Document Available
					</h1>}
			</IconlessCard>
		</>
	)
}

const ClaimForm = styled.div`
border : 1.5px dashed #78909c;
border-radius : 5px;
padding : 1em;
display : flex;
align-items : center;
justify-content : space-between;
`;


export const Wrapper = styled.div`
background : ${({ theme }) => `linear-gradient(to bottom,${theme.Tab?.color || '#E57373'} 0%,#FFFFFF 177%)`} ;
padding : 0.5em 1em;
color: #fff;
border-radius: 6px;
`;

export default EmployeeFormCenter;
