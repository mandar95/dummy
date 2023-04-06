import { combineReducers } from "redux";

// login slice
import loginSlice from "../modules/core/form/login.slice";

// user management slice
import userManagementSlice from "../modules/user-management/user.slice";

//  cd balance slice
import cdBalanceSlice from "../modules/CD_balance/CD.Slice";

//broker cd Balance
import cdBalancebrokerSlice from "../modules/CD_balance_broker/CDB.Slice";

// e-card slice
import eCardSlice from "../modules/ECard/ECard.slice";

// policy config slice
import policyConfigSlice from "../modules/policies/policy-config.slice";

// approve policy slice
import approvePolicySlice from "../modules/policies/approve-policy/approve-policy.slice";

// add member slice
import addMemberSlice from "../modules/addmember2/addMember.slice";

//network hoapital broker
import networkhospitalbrokerSlice from "../modules/networkHospital_broker/networkhospitalbroker.slice";

//Endorsement Request
import endorsementRequestSlice from "../modules/EndorsementRequest/EndorsementRequest.slice.js";

//wellness
import wellnessSlice from "../modules/wellness/wellness.slice.js";

//allocate
import allocateSlice from "../modules/Allocate/Allocate.slice.js";

//ProfileView
import profileViewSlice from "../modules/profileview/profileview.slice";

//Claim
import claimSlice from "../modules/claims/claims.slice";

//Help
import HelpSlice from "../modules/Help/help.slice";

//Form Center Slice
import formCenterSlice from "../modules/FormCenter/form.center.slice";

//dashboard
import dashboardSlice from "../modules/dashboard/Dashboard.slice";

//flex flexbenefit
import flexbenefitSlice from "../modules/flexbenefit/flexbenefit.slice";

//flex flexbenefit
import brokerflexbenefitSlice from "../modules/flexbenefit/broker_view_flex/flexbenefit.slice";

//My policy employee
import myPolicySlice from "../modules/MyPolicy/MyPolicy.slice";

//DashBoard Broker
import dashboardBrokerSlice from "../modules/dashboard/dashboard_broker/dashboard_broker.slice";

//DashBoard Broker
import enrollmentSlice from "../modules/enrollment/enrollment.slice";

//Bank Details
import bankDetailsSlice from "../modules/profileview/bankdetails/bankDetails.slice";

//Bank Details
import announcementSlice from "../modules/announcements/announcement.slice";

//Policy Refrral
import policyReferralSlice from "../modules/policy-referral/policy-referral.slice";

//employer Home page
import employerHomeSlice from "../modules/landing-page/employerLanding.slice";

//master countries
import masterSlice from "../modules/master-config/master.slice";

//broker home
import brokerHomeSlice from "../modules/landing-page/broker-landing/broker.slice";

//DashBoard Admin
import dashboardAdminSlice from "../modules/dashboard/dashboard-admin/dashboard_admin.slice";

//report config
import reportConfigSlice from "../modules/report-config/report-config.slice";

//Communication Configuration
import communicationConfigSlice from "../modules/communication-config/communication-config.slice";

// Theme
import themeSlice from "../modules/theme/theme.slice";

//Payment Gateway
import paymentGatewaySlice from "../modules/saas/payment-gateway/payment-gateway.slice";

import homeSlice from "../modules/RFQ/home/home.slice";

//RFQ
import Rfq from "../modules/RFQ/rfq.slice";

import documentSlice from "../modules/documents/documents.slice";

//Buy Insurance customer
import buyInsuranceSlice from "../modules/Insurance/BuyInsurance.slice";

//Insurer dashboard
import InsDashSlice from "../modules/dashboard/dashboard_insurer/dashboard_insurer.slice";

//customer profile
import customerProfileSlice from "../modules/CustomerProfileView/customerProfile.slice";

//Customer dashboard
import CustDashSlice from "../modules/dashboard/dashboard_customer/dashboard_customer.slice";

import TATConfigSlice from "../modules/TAT_Configurator/TATConfig.slice";
import ContactConfigSlice from "../modules/contact-us-config/contact-config.slice";
import healthCheckupSlice from "../modules/Health_Checkup/healthSlice";

// New Broker Dashboard

import newBrokerDashboard from "../modules/NewBrokerDashboard/newbrokerDashboard.slice";

//Saas
// import saasSlice from "../modules/saas/saas.slice";
//proposal
// import proposalSlice from "../modules/proposal-page/proposal.slice";
//Client Details
// import clientDetialsSlice from "../modules/Client-details/client.details.slice";

export default combineReducers({
	login: loginSlice,
	userManagement: userManagementSlice,
	cdBalance: cdBalanceSlice,
	eCard: eCardSlice,
	policyConfig: policyConfigSlice,
	addMember: addMemberSlice,
	endorsementRequest: endorsementRequestSlice,
	wellness: wellnessSlice,
	allocate: allocateSlice,
	profile: profileViewSlice,
	dashboard: dashboardSlice,
	cdBalancebroker: cdBalancebrokerSlice,
	networkhospitalbroker: networkhospitalbrokerSlice,
	flexbenefit: flexbenefitSlice,
	claims: claimSlice,
	help: HelpSlice,
	formcenter: formCenterSlice,
	myPolicy: myPolicySlice,
	dashboardBroker: dashboardBrokerSlice,
	approvePolicy: approvePolicySlice,
	enrollment: enrollmentSlice,
	bankDetails: bankDetailsSlice,
	flexbenefitBroker: brokerflexbenefitSlice,
	announcement: announcementSlice,
	policyReferral: policyReferralSlice,
	employerHome: employerHomeSlice,
	master: masterSlice,
	brokerHome: brokerHomeSlice,
	dashboardAdmin: dashboardAdminSlice,
	reportConfig: reportConfigSlice,
	commConfig: communicationConfigSlice,
	theme: themeSlice,
	paymentGateway: paymentGatewaySlice,
	RFQHome: homeSlice,
	rfq: Rfq,
	documents: documentSlice,
	buyInsurance: buyInsuranceSlice,
	InsDash: InsDashSlice,
	customerProfile: customerProfileSlice,
	CustDash: CustDashSlice,
	TATConfig: TATConfigSlice,
	ContactConfig: ContactConfigSlice,
	HealthCheckup: healthCheckupSlice,
	NewBrokerDashboard: newBrokerDashboard
	// clientDetails: clientDetialsSlice,
	// saas: saasSlice,
	// proposal: proposalSlice,
});
