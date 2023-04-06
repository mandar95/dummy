import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { AuthRoute } from 'utils'
import { Loader } from './components';
import Internal from './modules/internal-use';
import { ZTest } from './modules/ZTest';
import { ModuleControl } from './config/module-control';


// General
import Layout from './modules/core/layout';
import { EmployerLP, BrokerLanding, LandingPageInput } from './modules/landing-page';
import Error404 from './components/ErrorPages/404';
import { Login, ForgotPassword, ResetPassword, ChangePassword, SecurityQuestion, AzureLogin } from './modules/core/form';
import {
	DataUpload, RFQConfig, RFQHome, ApproveRFQ,
	UwQuoteView, QuoteView, BucketConfig, PlanView, /* Reports, */
	WorkFlow, FlowList, UserList, FeatureConfig,
	QCR, QuoteDetails, CreateQuote, ViewQuoteDetail
} from './modules/RFQ';
import PaymentGateway from './modules/saas/payment-gateway/PaymentGateway';
import PrivacyPolicy from "./modules/about/privacypolicy/privacy";
import LogoutSSO from './components/logout-sso/Logout-SSO';
import LandingMockup from 'modules/landing-page/landing-mockup/LandingMockup';
import { EmailViewer } from './modules/user-management/EmailViewer/EmailViewer';


// Multi-Profile
import ReportConfig from './modules/report-config/report-config';
import MasterConfig from './modules/master-config/master-config';
import { BrokerFlex, FlexConfig, SwitchExchange, FlexBenefit, FlexStepper, EmployeeFlexMap } from './modules/flexbenefit';
import { Home } from './modules/core/home/Home';
import Profileview from './modules/profileview';
import {
	UserManagement,
	CreateAdmin, AdminCreateUser, BrokerCreateUser, EmployerCreateUser, /* InsurerCreateUser, */
	RoleForm, CreateModule, UpdateModule, UpdateRole,
	OnBoard, /* OnBoardTpa, */
	BrokerView, EmployerView, EmployeeView, /* InsurerView */
	UpdateRoleForEmployee, UserManagmentEmployee, ZoneMapping,
	RegionMapping, AdminModule, LivesDependent, AllUsers, EmployeeDelete
} from './modules/user-management';
import {
	SubmitClaim, IntimitateClaim, TrackClaim, PortalClaim,
	TpaStatusConfig, OverAllClaim, ClaimDetailsView2, DeficiencyResolution,
	ViewClaimDetails
} from './modules/claims';
import {
	EnrollmentReport, ClaimUtilizationReport, ClientSummaryDetails,
	MonthlyClaimTrackerReport, TpaReport, GpaReport
} from "./modules/Reports";
import ECard from "./modules/ECard/ECard";
import { ContactUs } from './modules/contact-us/ContactUs';
import ContactConfig from './modules/contact-us-config/contact-config';
import {
	EndorsementRequest, CustomSheetEndorsement,
	CustomiseSheet, EndorsementDetail, ProgressBar
} from './modules/EndorsementRequest'
import Allocate from './modules/Allocate/Allocate'
import {
	EmployeePolicyMembers, PaymentHistory,
	InsurerDashboard, BoughtPolicies,
	Dashboard, SwitchExchangeDashboard
} from './modules/dashboard';
import { FormCenter } from './modules/FormCenter/form.center';
import HelperExchange from './modules/Help/index';
import NWH from './modules/networkHospital_broker/network-hospital'
import TATConfig from './modules/TAT_Configurator/TATConfig';
import CorporateBuffer from './modules/corporate-buffer/CorporateBuffer';
import CDBalance from './modules/cd-balance/CDBalance';
import {
	PlanHospitalization, ECashlessIntimation,
	TPAClaim, ECashlessDetail,
	AilmentHospMapDetail, ECashlessFlow
} from './modules/plan-hospitalization';
import { VerifyUser } from './modules/ZTest/VerifyUser';
import { OfflineTPA, UploadECard, /* ECardUpload, */ TpaLog } from './modules/offline-tpa';
import HealthCheckUp from './modules/Health_Checkup';


// Admin
import { PolicyReferal } from './modules/policy-referral/PolicyReferral';


// Broker
import { NotificationConfig, AddComponent } from './modules/announcements';
import AddAnnouncement from './modules/announcements/Broker/add-announcement';
import { CRMConfig } from './modules/contact-us/CRM/CRMConfig';
import {
	PolicyConfig, ApprovePolicy, ClaimDocument,
	EnrollmentUpdate, NomineeConfig,
	PolicyList, FeatureConf, CommunicationTrigger
} from './modules/policies';
import RenewalSwitchExchange from './modules/Renewal/index';
import { CommunicationConfig } from './modules/communication-config/Communication';
import { Theme, Components } from './modules/theme';
import {
	MyWellNess, WellnessCMSConfig,
	BenefitConfigurator, WellnessPartnerConfig,
	BenefitEmployerMap, WellnessFlexConfig,
	IcdCodeMaster, BenefitWellnessMap,
	IcdAdmin, WellnessLog
} from './modules/wellness';
import Queryconfig from './modules/query-config/index';
import Declaration from "./modules/declaration/index";
import { UCS } from './modules/UnifiedCommunicationSystem/UCS';
import ServiceAccountManager from './modules/ServiceAccountManager';
import { CommunicationTemplate } from './modules/communication-template/index';
import DashboardCardConfig from './modules/Dashboard_Card_Config';
import DashBoardCardSequencing from './modules/Dashboard_Card_Config/Card_Sequencing';
import { EmployerDataUpload } from './modules/employee-upload/EmployeeUpload';
import { PolicyCoverage } from './modules/policy-coverage/UploadPolicyCoverage';
import TPAApiTrigger from 'modules/TPAApiTrigger/TPAApiTrigger';
import { BrokerBranches } from './modules/broker-branches/BrokerBranches';
import { WhiteListing } from './modules/white-listing/WhiteListing';


// Employee
import { Enrollment, SelfEndorsement, viewEnroll } from './modules/enrollment';
import MyPolicy from './modules/MyPolicy/MyPolicy';
import WellnessHeaps from "./modules/wellness-heaps/wellness-heaps";


// Customer
import Insurance from './modules/Insurance/Insurance';
import RouteChangeTracker from './utils/RouteChangeTracker';
import EmployerDashboard from 'modules/dashboard/updated_employer_dashboard/EmployerDashboard';
import NewBrokerDashboard from 'modules/NewBrokerDashboard';
import { CashlessLogs } from './modules/offline-tpa/cashless-logs/CashlessLogs';


// import CD_balance from "./modules/CD_balance/CD_balance";
// import CD_balance_broker from "./modules/CD_balance_broker/CD_balance";
// import ADDDeclrationConfig from "./modules/declaration/admin/add-declaration";
// import Documents from './modules/documents/documents';
// import ProposalPage from './modules/proposal-page/proposal-page';
// import { ClientDetails } from './modules/Client-details/client.details';
// import { ClientViewDetails } from './modules/Client-details/client.details.view';
// import { Plans, CreatePlan, Billing, BuyPlan } from './modules/saas';
/* ====================================END OF IMPORT==================================== */

const TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

const Router = props => {

	const { isAuthenticated } = useSelector(state => state.login);

	return (
		<BrowserRouter>
			<Suspense fallback={<Loader /* type={1} */ />}>
				<Switch>
					{/*--landing-pages--*/}
					<Route exact path="/broker" component={BrokerLanding} />
					<Route exact path="/employer" component={EmployerLP} />
					<Route exact path='/'>
						{/* {isAuthenticated ?
                        <Redirect to="/home" />
                        : */}
						<BrokerLanding />
						{/* } */}
					</Route>
					{ModuleControl.inDevelopment/* Landing Page Mockup */ && <Route exact path="/landing-mockup" component={LandingMockup} />}
					{/*x-landing-pages-x*/}
					{/* <Route exact path='/proposal-page' component={ProposalPage} /> */}
					<Route exact path="/login" component={Login} />
					{/* <Route exact path="/register" component={Register} /> */}
					<Route exact path="/forgot-password" component={ForgotPassword} />
					<Route exact path="/reset-password" component={ResetPassword} />
					<Route exact path="/change-password" component={ChangePassword} />
					<Route exact path="/payment-gateway" component={PaymentGateway} />
					<Route exact path="/security-question" component={SecurityQuestion} />

					<Route exact path="/azure/sign-in" component={AzureLogin} />

					{/* ------------------------- RFQ ------------------------- */}
					<Route exact path="/data-upload/:id" component={DataUpload} />
					<Route exact path="/company-detail/:id" component={DataUpload} />
					<Route exact path="/company-details" component={RFQHome} />
					<Route exact path="/policy-renewal" component={RFQHome} />
					<Route exact path='/upload-policy-claim-detail' component={RFQHome} />
					<Route exact path="/previous-policy-detail" component={RFQHome} />
					<Route exact path="/about-team" component={RFQHome} />
					<Route exact path="/family-construct" component={RFQHome} />
					<Route exact path="/family-count" component={RFQHome} />
					<Route exact path="/topup" component={RFQHome} />
					<Route exact path="/customize-plan" component={RFQHome} />
					<Route exact path="/declaration" component={RFQHome} />
					<Route exact path="/checkout" component={RFQHome} />
					<Route exact path="/rfq-callback-done" component={RFQHome} />
					<Route exact path="/upload-data-demography" component={RFQHome} />

					{/* Self Endorsement */}
					<Route exact path="/self-endorsement" component={SelfEndorsement} />

					{/* Encrypt Depcrypt */}
					{ModuleControl.isDevelopment && <Route exact path="/encrypt-decrypt" component={Internal.EncryptDepcrypt} />}
					<Route exact path="/404-out" component={Error404} />

					{/* TPA ECashless */}
					<Route exact path="/:userType/:random1/e-cashless-intimation/:claim_request_id_another/:random2" component={TPAClaim} />

					{ModuleControl.PrivacyPolicy && <Route exact path="/privacy-policy" component={PrivacyPolicy} />}
					<Route exact path="/logout" component={LogoutSSO} />
					<Route exact path="/mobile-login" component={LogoutSSO} />
					<Route exact path="/email-viewer" component={EmailViewer} />

					<Layout {...props}>
						<Switch>
							<Route exact path="/tset" component={ZTest} />
							<Route exact path="/home" component={Home} />

							<Route exact path="/home/employee-policy-members/:policyId" component={EmployeePolicyMembers} />
							<Route exact path="/profile" component={Profileview} />
							<Route exact path="/user-change-password" component={ChangePassword} />
							{/* <Route exact path="/loader" component={(props) => (<Loader type={1} {...props} />)} /> */}
							<Route exact path="/loader" >
								<ProgressBar type='animation' />
							</Route>
							<AuthRoute exact path="/:userType/tpa-api-trigger" component={TPAApiTrigger} />

							<Route exact path="/loader"><ProgressBar type='animation' /></Route>
							<Route exact path="/home-dashboard" component={EmployerDashboard} />
							{/*------------------ User Management ---------------- */}
							<AuthRoute exact listId={'user-management-all-users'} key='user-management-all-users' path="/:userType/user-management-all-users" component={AllUsers} />

							<AuthRoute exact key='user-management-users' path="/:userType/user-management-users" users component={UserManagement} />
							<AuthRoute exact key='user-management-broker' path="/:userType/user-management-broker" broker component={UserManagement} />
							<AuthRoute exact key='user-management-employer' path="/:userType/user-management-employer" employer component={UserManagement} />
							<Route exact key='user-management-employee' path="/:userType/user-management-employee"><UserManagement employee /></Route>
							<AuthRoute exact key='user-management-module' path="/:userType/user-management-module" module component={UserManagement} />
							<AuthRoute exact key='user-management-broker-role' path="/:userType/user-management-broker-role" brokerRole component={UserManagement} />
							<AuthRoute exact key='user-management-employer-role' path="/:userType/user-management-employer-role" employerRole component={UserManagement} />
							<AuthRoute exact key='user-management-employee-role' path="/:userType/user-management-employee-role" employerRole employeeRole component={UserManagmentEmployee} />
							<AuthRoute exact key='user-management-insurer' path="/:userType/user-management-insurer" insurer component={UserManagement} />
							<AuthRoute exact key='user-management-insurer-role' path="/:userType/user-management-insurer-role" insurerRole component={UserManagement} />
							<AuthRoute exact key='user-management-tpa' path="/:userType/user-management-tpa" tpa component={UserManagement} />
							<Route exact path="/:userType/user-management-total-lives"><LivesDependent type='Active Lives' /></Route>
							<Route exact path="/:userType/user-management-dependent-lives"><LivesDependent type='Active Dependent Lives' /></Route>
							{/* Roles */}
							<Route exact path="/create-broker-role/:random1/:id/:random2"><RoleForm create type={'broker'} /></Route>
							<Route exact path="/update-broker-role/:random1/:id/:random2"><UpdateRole type={'broker'} /></Route>
							<Route exact path="/create-employer-role/:random1/:id/:random2"><RoleForm create type={'employer'} /></Route>
							<Route exact path="/update-employer-role/:random1/:id/:random2"><UpdateRole type={'employer'} /></Route>
							<Route exact path="/update-employee-role/:random1/:id/:random2"><UpdateRoleForEmployee type={'employee'} /></Route>
							<Route exact path="/create-insurer-role/:random1/:id/:random2"><RoleForm type={'insurer'} /></Route>
							<Route exact path="/update-insurer-role/:random1/:id/:random2"><UpdateRole type={'insurer'} /></Route>
							{/* Modules */}
							<Route exact path="/create-module" component={CreateModule} />
							<Route exact path="/update-module/:random1/:id/:random2" component={UpdateModule} />
							{/* Onboard */}
							<Route exact path="/onboard-broker"><OnBoard type='Broker' /></Route>
							<Route exact path="/onboard-employer"><OnBoard type='Employer' /></Route>
							<Route exact path="/onboard-insurer"><OnBoard type='Insurer' /></Route>
							{/* <Route exact path="/add-tpa"><OnBoardTpa /></Route> */}
							{/* Create User */}
							<Route exact path="/admin-create-user" component={CreateAdmin} />
							<Route exact path="/admin-create-broker"><AdminCreateUser type="Broker" /></Route>
							<Route exact path="/admin-create-employer"><AdminCreateUser type="Employer" /></Route>
							<Route exact path="/admin-create-insurer"><AdminCreateUser type="Insurer" /></Route>
							<Route exact path="/broker-create-user"><BrokerCreateUser type="Broker" /></Route>
							<Route exact path="/broker-create-employer"><BrokerCreateUser type="Employer" /></Route>
							<Route exact path="/employer-create-user"><EmployerCreateUser type="Employer" /></Route>
							{/* <Route exact path="/insurer-create-user"><InsurerCreateUser type="Insurer" /></Route> */}
							{/* Update User */}
							<Route exact path="/admin-update-user/:random1/:id/:random2" component={CreateAdmin} />
							<Route exact path="/broker-update-user/:random1/:id/:random2"><BrokerCreateUser type="Broker" /></Route>
							<Route exact path="/employer-update-user/:random1/:id/:random2"><EmployerCreateUser type="Employer" /></Route>
							{/* <Route exact path="/insurer-update-user/:random1/:id/:random2"><InsurerCreateUser type="Insurer" /></Route> */}
							{/* View */}
							<Route exact path="/broker-view/:random1/:id/:random2" component={BrokerView} />
							<Route exact path="/employer-view/:random1/:id/:random2" component={EmployerView} />
							<Route exact path="/employee-view/:random1/:id/:random2" component={EmployeeView} />
							{/* <Route exact path="/insurer-view/:random1/:id/:random2" component={InsurerView} /> */}

							<AuthRoute exact path="/:userType/employee-delete" component={EmployeeDelete} />

							{/*------------------ Claims ---------------- */}
							{/* Submit Claim */}
							<AuthRoute exact path="/:userType/submit-claim" component={SubmitClaim} />
							{/* Intimate Claim */}
							<AuthRoute exact path="/:userType/intimate-claim" component={IntimitateClaim} />
							{/* Track Claim */}
							<AuthRoute key='track-claim-create' exact path="/:userType/track-claim" component={TrackClaim} />
							<AuthRoute key='track-claim-update' exact path="/:userType/track-claim/:random1/:claimid/:memberid/:random2/:tpamemberid" component={TrackClaim} />
							{/* Overall Claim */}
							<AuthRoute key='overall-claim-create' exact path="/:userType/overall-claim" component={PortalClaim} />
							<Route exact path="/:userType/view-claim/:employer_id/:random1/:policy_type_id/:random2/:policy_id/:random3/:employee_id/:random4/:type/:random5/:claim_id/:random6/:member_id" component={ViewClaimDetails} />
							<AuthRoute key='overall-claim-update' exact path="/:userType/overall-claim/:random1/:policyid/:random2" component={PortalClaim} />
							<AuthRoute exact path="/:userType/claim-data" component={OverAllClaim} />
							<Route exact path="/claim-details-view/:random1/:id/:random2/:type" component={ClaimDetailsView2} />
							{/* Overall Claim */}
							<Route exact path="/deficiency-resolution/:random1/:id/:random2/:type" component={DeficiencyResolution} />

							{/* TPA status config */}
							<AuthRoute exact path="/:userType/tpa-status-config" component={TpaStatusConfig} />

							{/*------------------------- Help ------------------------- */}
							<AuthRoute exact path="/:userType/help" component={HelperExchange} />
							<AuthRoute exact path="/:userType/query-config" component={Queryconfig} />

							{/*------------------------- Employer -------------------------*/}
							{/*--Cd Balance--*/}
							{/* <AuthRoute exact path="/employer/cd-balance" component={CD_balance} /> */}
							{/*--Allocate--*/}
							<AuthRoute exact path="/:userType/allocate" component={Allocate} />
							{/*------------------------- Cororate Buffer/CD Balance -------------------------*/}
							<AuthRoute exact path="/:userType/corporate-buffer" component={CorporateBuffer} />
							<AuthRoute exact path="/:userType/cd-balance-policies" component={CDBalance} />

							{/*------------------------- Employee -------------------------*/}
							{/* My-Policy/Enrollment */}
							<AuthRoute exact path="/:userType/my-policy" component={MyPolicy} />
							<AuthRoute exact path="/:userType/enrollment" component={Enrollment} />
							<Route exact path="/:userType/enrollment-view" component={Enrollment} />
							<Route exact path="/:userType/enrollment-view/:random1/:id/:random2" component={viewEnroll} />

							{/*------------------------- Broker -------------------------*/}
							{/* -------------------------
								* Poilicy Config/Approve/List
								* Feature Config
								* Nominee Config
								--------------------------- */}
							<Route exact path="/:userType/policy-config" key='policy-config' component={PolicyConfig} />
							<Route exact path="/:userType/policy-renew/:id" key='policy-renew' component={PolicyConfig} />
							<Route exact path="/:userType/policy-copy/:id" key='policy-copy' component={PolicyConfig} />
							<Route exact path="/:userType/policy-create/:enquiry_id" key='policy-create' component={PolicyConfig} />
							<Route exact path="/:userType/policy-generate/:id" key='policy-generate' component={PolicyConfig} />
							<Route exact path="/:userType/policy/claim-documents/:random1/:id/:random2" component={ClaimDocument} />
							<Route exact path="/:userType/approve-policy/:random1/:id/:random2" component={ApprovePolicy} />
							<AuthRoute exact path="/:userType/policies" component={PolicyList} />
							<Route exact path="/:userType/policies-enrollment/:random1/:policy_id/:random2" component={EnrollmentUpdate} />
							<AuthRoute exact path="/:userType/feature-config" component={FeatureConf} />
							<AuthRoute exact path="/:userType/nominee-config" component={NomineeConfig} />

							{/* ------------------------- Policy Referal ------------------------- */}
							<AuthRoute exact path="/:userType/policy-referal" component={PolicyReferal} />

							{/* ------------------------- E-Card/Cd-Balance ------------------------- */}
							<AuthRoute exact path="/:userType/e-card" component={ECard} />
							{/* <AuthRoute exact path="/:userType/cd-balance" component={CD_balance_broker} /> */}

							{/*--Add Member-Nominee [Broker/Employer]--*/}
							<AuthRoute exact path="/:userType/endorsement-request" component={EndorsementRequest} />
							<AuthRoute exact path="/:userType/endorsement-details" component={EndorsementDetail} />
							<AuthRoute exact path="/:userType/employee-upload" component={EmployerDataUpload} />

							<Route exact path="/:userType/endorsement-sheets/:type" component={CustomiseSheet} />
							<Route exact path="/:userType/endorsement-sheet-create/:type" key='create-custom-sheet' component={CustomSheetEndorsement} />
							<Route exact path="/:userType/endorsement-sheet-update/:type/:random1/:template_id/:random2" key='update-custom-sheet' component={CustomSheetEndorsement} />
							{/* Reports */}
							<AuthRoute exact path="/:userType/enrollment-report" component={EnrollmentReport} />
							<AuthRoute exact path="/:userType/client-summary-details" component={ClientSummaryDetails} />
							<AuthRoute exact path="/:userType/monthly-claim-tracker-report" component={MonthlyClaimTrackerReport} />
							<AuthRoute exact path="/:userType/claim-utilization-report" component={ClaimUtilizationReport} />
							<AuthRoute exact path="/:userType/gpa-report" component={GpaReport} />
							<AuthRoute exact path="/:userType/tpa-report" component={TpaReport} />

							<AuthRoute exact path="/:userType/renewal" component={RenewalSwitchExchange} />

							{/* Network Hospital */}
							<AuthRoute exact path="/:userType/network-hospital" component={NWH} />

							{/* Form Center */}
							<AuthRoute exact path="/:userType/form-center" component={FormCenter} />
							{/* Contact-us */}
							<AuthRoute exact path="/:userType/contact-us" component={ContactUs} />

							<Route exact path="/:userType/flex-benefits" component={SwitchExchange} />
							<Route exact path="/:userType/home" component={SwitchExchangeDashboard} />
							<Route exact path="/:userType/dashboard" component={Dashboard} />
							<AuthRoute exact path="/:userType/flex-benefits-config" component={BrokerFlex} />
							<AuthRoute exact path="/:userType/announcement-config" component={NotificationConfig} />
							<Route exact path={"/announcement/edit/:random1/:id/:random2"} component={AddAnnouncement} />
							{/*--------------- Super Admin/Broker(Report/Communication/Trigger) -------------------*/}
							<AuthRoute exact path="/:userType/report-config" component={ReportConfig} />
							<AuthRoute exact path="/:userType/master-config" component={MasterConfig} />
							<AuthRoute exact path="/:userType/communication-config" component={CommunicationConfig} />
							<AuthRoute exact path="/:userType/create-template" component={CommunicationTemplate} />
							<AuthRoute key='policy-trigger-config' exact path="/:userType/policy-trigger-config" isPolicy={1} component={CommunicationTrigger} />
							<AuthRoute key='generic-trigger-config' exact path="/:userType/generic-trigger-config" isPolicy={0} component={CommunicationTrigger} />

							{/* <Route exact path="/admin/plans" component={Plans} /> */}
							{/* <Route exact path="/admin/edit/:random1/:id/:random2" component={CreatePlan} /> */}
							{/* <Route exact path="/billing-console" component={Billing} /> */}
							{/* <Route exact path={"/admin/client-details"} component={ClientDetails} /> */}
							{/* <Route exact path={"/client/view/:id"} component={ClientViewDetails} /> */}
							<Route exact path={"/themes"} key='theme-all' component={Theme} />
							<Route exact path={"/edit-theme/:random1/:id/:random2"} key='theme-update' component={Theme} />
							{/* <Route exact path="/buy-plan" component={BuyPlan} /> */}
							<Route exact path="/admin/landing-page" component={LandingPageInput} />
							<Route exact path={"/:userType/edit-notification/:random1/:id/:random2"} component={AddComponent} />

							{/* wellness */}
							<AuthRoute exact path="/:userType/my-wellness" component={MyWellNess} />
							<AuthRoute exact path="/:userType/benefit-config" component={BenefitConfigurator} />
							<AuthRoute exact path="/:userType/wellness-partner-config" component={WellnessPartnerConfig} />
							<AuthRoute exact path="/:userType/benefit-employer-mapping" component={BenefitEmployerMap} />
							<AuthRoute exact path="/:userType/wellness-flex-config" component={WellnessFlexConfig} />
							<AuthRoute exact path="/:userType/wellness-benefit-cms" component={WellnessCMSConfig} />
							<AuthRoute exact path="/:userType/icd-code-master" component={IcdCodeMaster} />
							<AuthRoute exact path="/:userType/benefit-wellness-partner-mapping" component={BenefitWellnessMap} />
							<AuthRoute exact path="/:userType/icd" component={IcdAdmin} />

							{/* Insurer/Broker */}
							<AuthRoute exact path="/:userType/rfq-configuration" component={RFQConfig} />
							<AuthRoute key='product-feature' exact path="/:userType/product-feature" component={FeatureConfig} />
							<Route key='edit-product-feature' exact path="/:userType/edit-product-feature/:random1/:id/:random2" component={FeatureConfig} />
							<Route exact path="/:userType/rfq-approve/:random1/:id/:random2" component={ApproveRFQ} />
							<AuthRoute exact path="/:userType/uwquote-view" component={UwQuoteView} />
							<Route exact path="/:userType/quote-view/:random1/:id/:random2" component={QuoteView} />
							<Route exact path="/:userType/plan-view/:random1/:id/:random2" component={PlanView} />
							<AuthRoute exact path="/:userType/bucket-config" component={BucketConfig} />
							<AuthRoute exact path="/:userType/insurance" key='insurance' component={Insurance} />
							<AuthRoute exact path="/:userType/insurance-customer" key='insurance-customer' component={Insurance} />
							{/* <Route exact path="/:userType/report" component={Reports} /> */}
							<AuthRoute exact path="/:userType/work-flow" component={WorkFlow} />
							<AuthRoute exact path="/:userType/work-flow-list" component={FlowList} />
							<AuthRoute exact path="/:userType/user-list-view" component={UserList} />

							{/*------------------------- {documents} ------------------------*/}
							{/* <Route exact path="/:userType/documents" component={Documents} /> */}

							{/*------------------------- {declaration} ------------------------*/}
							<AuthRoute exact path="/:userType/declaration-config" component={Declaration} />
							{/* <Route exact path={"/:userType/edit-declaration/:random1/:id/:random2"} component={ADDDeclrationConfig} /> */}

							{/* Customer */}
							<AuthRoute exact path="/:userType/bought-policies" component={BoughtPolicies} />
							<AuthRoute exact path="/:userType/searches"><BoughtPolicies type='search' /></AuthRoute>
							<AuthRoute exact path="/:userType/payment-history" component={PaymentHistory} />
							<AuthRoute exact path="/:userType/rfq-dashboard" component={InsurerDashboard} />

							<AuthRoute exact path="/:userType/tat-configurator" component={TATConfig} />
							<AuthRoute exact path="/:userType/contact-us-configurator" component={ContactConfig} />

							{/* UCC */}
							<AuthRoute exact path="/:userType/unified-communication-system" component={UCS} />
							{/*Zone Mapping*/}
							<AuthRoute exact path="/:userType/create-zonal-mapping" component={ZoneMapping} />
							{/*Region Mapping*/}
							<AuthRoute exact path="/:userType/create-regional-mapping" component={RegionMapping} />
							<AuthRoute exact path="/:userType/wellness-heaps" component={WellnessHeaps} />

							{/* E-Cashless */}
							<AuthRoute exact path="/:userType/planed-hospitalization" component={PlanHospitalization} />
							<Route exact path="/:userType/planed-hospitalization-ailment-map" component={AilmentHospMapDetail} />

							<AuthRoute exact key="e-cashless-intimation" path="/:userType/e-cashless-intimation" component={ECashlessIntimation} />
							<Route exact key="e-cashless-service" path="/:userType/e-cashless-service" component={ECashlessIntimation} />
							<AuthRoute exact path="/:userType/e-cashless-intimation-detail" component={ECashlessDetail} />
							<AuthRoute exact path="/:userType/e-cashless-flow" component={ECashlessFlow} />

							{/*------------------------- Offline TPA ------------------------*/}
							<AuthRoute exact key={'tpa-member-upload'} path="/:userType/tpa-member-upload" type={'member-data'} component={OfflineTPA} />
							<AuthRoute exact key={'upload-policy-data'} path="/:userType/upload-policy-data" type={'claim-data'} component={OfflineTPA} />
							<AuthRoute exact key={'tpa-intimate-claim'} path="/:userType/tpa-intimate-claim" type={'intimate'} component={OfflineTPA} />
							<AuthRoute exact key={'tpa-submit-claim'} path="/:userType/tpa-submit-claim" type={'submit'} component={OfflineTPA} />
							<AuthRoute exact key={'tpa-network-hospital'} path="/:userType/tpa-network-hospital" type={'network-hospital'} component={OfflineTPA} />
							<AuthRoute exact path="/:userType/ecard-upload" component={UploadECard} />
							{/* <AuthRoute exact path="/:userType/tpa-E-card" component={ECardUpload} /> */}

							{/*------------------------- Logs/SAM/HealthCheckup/Contacts ------------------------*/}
							<AuthRoute exact path="/:userType/tpalog" component={TpaLog} />
							<AuthRoute exact path="/:userType/cashless-logs" component={CashlessLogs} />
							<AuthRoute exact path="/:userType/wellnesslog" component={WellnessLog} />
							<AuthRoute exact path="/:userType/service-account-manager" component={ServiceAccountManager} />
							<AuthRoute exact path="/:userType/health-checkup" component={HealthCheckUp} />
							<AuthRoute exact path="/:userType/crm-contact" component={CRMConfig} />

							{/*------------------------- Employee Dashboard ------------------------*/}
							<AuthRoute exact path="/:userType/dashboard-card-config" component={DashboardCardConfig} />
							<AuthRoute exact path="/:userType/dashboard-card-sequencing" component={DashBoardCardSequencing} />

							{/*------------------------- QCR ------------------------*/}
							<Route key='qcr-create' exact path="/:userType/qcr-create" component={QCR} />
							<Route key='qcr-update' exact path="/:userType/qcr/:random1/:id/:random2/:steppage" component={QCR} />
							<AuthRoute exact path="/:userType/qcr-quote-detail" component={QuoteDetails} />
							<Route exact path="/:userType/qcr-quote-create/:random1/:id/:random2" component={CreateQuote} />
							<Route exact path="/:userType/qcr-quote-view/:random1/:id/:random2" component={ViewQuoteDetail} />

							{/*------------------------- Policy Coverage ------------------------*/}
							<AuthRoute exact path="/:userType/upload-policy-coverage" /* type_id={1} */ component={PolicyCoverage} />
							<Route exact path="/:userType/broker-branches" component={BrokerBranches} />
							<Route exact path="/:userType/white-listing" component={WhiteListing} />
							{/* <AuthRoute exact path="/:userType/restrict-policy-coverage" type_id={2} component={PolicyCoverage} /> */}

							{/*------------------------- Flex Confif ------------------------*/}
							<AuthRoute key='list' exact path="/:userType/policy-flex-config" component={FlexConfig} />
							<Route key='update' exact path="/:userType/policy-flex-update/:random1/:flex_id/:random2" component={FlexConfig} />
							<AuthRoute exact path="/:userType/policy-flexible-benefits" component={FlexBenefit} />
							<Route exact path="/:userType/policy-flexible-benefits-form" component={FlexStepper} />
							<Route exact path="/:userType/policy-flex-users/:random1/:flex_plan_id/:random2"><EmployeeFlexMap listId={'/broker/policy-flex-users'} /></Route>

							{/* New Broker Dashboard */}
							<Route exact path="/:userType/new-dashboard" component={NewBrokerDashboard} />

							{/* Others */}
							<Route exact path="/:userType/adminmodule/:master_user_types_id" component={AdminModule} />
							<AuthRoute exact path="/:userType/verify-user" component={VerifyUser} />
							<Route exact path="/components" component={Components} />
							<Route exact path="/404" component={Error404} />



							<Redirect to={isAuthenticated ? '/404' : '/404-out'} />
						</Switch>
					</Layout>
					<Redirect to={'/404-out'} />
				</Switch>
			</Suspense>
			{TRACKING_ID && <RouteChangeTracker />}
		</BrowserRouter>
	);
}

export default Router;
