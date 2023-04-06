import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Select } from "../../../components/select/Select";
// import { CompactCard } from "components";
import _ from 'lodash';
import { useForm } from 'react-hook-form';
// import { getDaysInMonth } from "date-fns";

const SumInsured = ({ sumInsureds, sum_insured, getSI }) => {
	const { register, watch } = useForm();
	const SI = watch('SI');

	useEffect(() => {
		if (SI) {
			getSI(SI);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [SI])

	return (
		<>
			<Row className="mt-4">
				<Col sm="10" md="12" lg="6" xl="6">
					<h2 style={{ fontWeight: "600" }}>Choose Sum Insured</h2>
					<p>Sum Insured per family</p>
				</Col>
				<Col sm="12" md="12" lg="6" xl="6">
					<Select
						name="SI"
						label="Select Sum Insured"
						autoComplete="none"
						id="type"
						inputRef={register}
						options={!_.isEmpty(sumInsureds) ? sumInsureds.map((val) => ({
							id: val, name: val, value: val
						})) : [{ id: 1, name: sum_insured, value: sum_insured }]}
					// error={errors.type}
					/>
				</Col>
			</Row>
			<Row style={{ paddingTop: '20px', paddingBottom: '20px' }}>
				<Col sm="12" md="12" lg="12" xl="12" >
					{/* <Tabs defaultActiveKey="Family" id="uncontrolled-tab-example">
						
						<Tab eventKey="Family" title="Family Floater">
							<CompactCard removeBottomHeader={true}>
								<div style={{ marginTop: "-40px", display: "flex" }}>
									<Col xs="3" sm="2" md="2" lg="1" xl="1" className="pr-1">
										<img
											alt="user"
											src="/assets/images/women_user.png"
											height="50"
											width="50"
										/>
									</Col>
									<Col
										xs="9"
										sm="10"
										md="10"
										lg="11"
										xl="11"
										style={{ maxHeight: "150px", overflow: "auto" }}
									>
										<h5 style={{ fontWeight: "600" }}>Family Floater</h5>
										<p>
											Sum Insured per family.Sum Insured per family.Sum Insured per
											family.Sum Insured per family
										</p>
									</Col>
								</div>
							</CompactCard>
						</Tab>
					</Tabs> */}
				</Col>
			</Row>
		</>
	);
};

export default SumInsured;
