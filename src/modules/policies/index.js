import PolicyConfig from "./policy-config";
import ApprovePolicy from './approve-policy/ApprovePolicy'

import EnrollmentUpdate from './policy-list/EnrollmentUpdate';
import NomineeConfig from "./Nominee-Config";
import PolicyList from './policy-list';
import FeatureConf from "./feature-config/feature-config";
import CommunicationTrigger from "./communication-trigger-config/communication-trigger-config";

export {
  PolicyConfig, ApprovePolicy,
  EnrollmentUpdate, NomineeConfig,
  PolicyList, FeatureConf,
  CommunicationTrigger
};
export * from './approve-policy/ClaimDocument/ClaimDocument'
