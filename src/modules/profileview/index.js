import React from "react";
import Profileview from "./profileview";
import InsurerView from "./insurer-view/insurer-view";
import { useSelector } from 'react-redux';
import CustomerProfileView from 'modules/CustomerProfileView/CustomerProfileView'
import { Loader } from 'components'
import ProfileviewOrganisation from "./organization-user/ProfileviewOrganisation";


const SwitchExchangeDashboard = () => {
	const { currentUser, userType } = useSelector(state => state.login);
	switch (userType) {
		case "Employee":
			return <Profileview />;
		case "Employer":
			return <ProfileviewOrganisation userType={userType} />;
		case "Broker":
			return <ProfileviewOrganisation userType={userType} />;
		case "Super Admin":
			return <ProfileviewOrganisation userType={userType} />;
		case "IC":
			return <InsurerView currentUser={currentUser} />;
		case "Customer":
			return <CustomerProfileView />;
		default:
			return <Loader />;
	}
};

export default SwitchExchangeDashboard;
