import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router";
import _ from "lodash";
import swal from "sweetalert";

import { Row, Col } from "react-bootstrap";
import { CardBlue, CompactCard, Loader } from "components";
import { Lister, ListerRater, RFQStatus, FeaturesFn } from "./helper";
import { ViewBucket } from '../approve-rfq/bucket-detail/ViewBucket'

import { useSelector, useDispatch } from "react-redux";
import { clear, loadRfq, loadBuckets } from "../rfq.slice";
import { Decrypt } from "../../../utils";

export const PlanView = () => {

	const dispatch = useDispatch();
	const history = useHistory();
	let { id, userType } = useParams();
	id = Decrypt(id);
	const { rfqData, error, loading, riskBuckets, insurer_id } = useSelector((state) => state.rfq);
	const { currentUser } = useSelector(state => state.login);

	useEffect(() => {
		if (userType === 'insurer' && (currentUser.ic_id || insurer_id)) {
			dispatch(loadRfq({ ic_id: currentUser.ic_id || insurer_id, ic_plan_id: id }));
			dispatch(loadBuckets({ ic_id: currentUser.ic_id || insurer_id }));
		}
		if (userType === 'broker' && (currentUser.broker_id)) {
			dispatch(loadRfq({ broker_id: currentUser.broker_id, ic_plan_id: id }));
			dispatch(loadBuckets({ broker_id: currentUser.broker_id }));
		}
		if (userType === 'admin' && !insurer_id) {
			history.push(`/${userType}/uwquote-view`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}

		return () => {
			dispatch(clear());
		};
		//eslint-disable-next-line
	}, [error]);


	return !loading ? (
			<Row className="d-flex flex-wrap-reverse w-100 m-0">
				<Col sm="12" md="12" lg="8" xl="8">
					<CardBlue title="Plan Details">
						{!_.isEmpty(rfqData) ? Lister(rfqData) : <noscript />}
					</CardBlue>

					<CardBlue title="Plan Rate Details">
						{ListerRater({
							indivdual_rate_sheet: rfqData.indivdual_rate_sheet,
							family_floater_rate_sheet: rfqData.family_floater_rate_sheet,
							has_indivdual: rfqData.has_indivdual,
							has_family_floater: rfqData.has_family_floater
						})}
					</CardBlue>

					<CardBlue title="Product Benefits">
						<Row>
							{rfqData.plan_product_features?.map((item, index) => FeaturesFn(item, index))}
						</Row>
					</CardBlue>

					<CardBlue title="Industries Bucket">
						<ViewBucket
							rfqData={rfqData}
							options={riskBuckets} />
					</CardBlue>

				</Col>
				{!!rfqData.status && <Col sm="12" md="12" lg="4" xl="4">
					<CompactCard removeBottomHeader={true}>
						{RFQStatus(rfqData.status, rfqData)}
					</CompactCard>
				</Col>}
			</Row >
	) : <Loader />
};
