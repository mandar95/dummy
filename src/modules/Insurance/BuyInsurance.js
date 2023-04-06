import React, { useEffect } from "react";
import { CardBlue, Loader, NoDataFound } from "../../components";
import { BuyCard } from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { loadInsuranceLink } from "./BuyInsurance.slice";
import { giveProperId } from "../RFQ/home/home";

const BuyInsuranceCustomer = ({ userType }) => {
	const dispatch = useDispatch();
	const { insurance_link, loading } = useSelector(state => state.buyInsurance);
	const { currentUser } = useSelector((state) => state.login);

	useEffect(() => {
		if (currentUser?.ic_id || currentUser?.broker_id || userType === 'customer') {
			dispatch(loadInsuranceLink(userType === 'customer' ? giveProperId({}) : currentUser?.broker_id ?
				{ broker_id: currentUser?.broker_id } : { ic_id: currentUser?.ic_id }));
		}
		if (userType === 'employee') {
			dispatch(loadInsuranceLink({ broker_id: currentUser?.broker_id || 1 }))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	return !loading ? (
		<CardBlue title={userType === 'employee' ? "Buy Insurance Policy" : "Buy Retail Insurance Policy"} round>
			{insurance_link.length ?
				<BuyCard Data={insurance_link} /> :
				<NoDataFound text='No Retail Insurance Found' />}
		</CardBlue>
	) :
		<Loader />
};

export default BuyInsuranceCustomer;
