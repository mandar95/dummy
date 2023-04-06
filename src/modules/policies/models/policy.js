import { DateFormate } from "../../../utils";

export class Policy {

    constructor(policy = {}, index) {

        this.index = index + 1;
        this.id = policy.id;
        this.policyNumber = policy.policy_number;
        this.policyName = policy.policy_name;
        this.broker = policy.broker;
        this.insurer = policy.insurer;
        this.tpa = policy.tpa;
        this.employer = policy.employer;
        this.policyType = policy.policy_type;
        this.policySubType = policy.policy_sub_type;
        this.policyStatus = new Date(policy.end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? 'Policy Expired' : policy.policy_status;
        this.policyStatusOriginal = policy.policy_status;
        this.startDate = policy.start_date;
        this.endDate = policy.end_date;
        this.enrollmentStartDate = policy.enrollement_start_date;
        this.enrollmentEndDate = policy.enrollement_end_date;
        this.sumInsuredType = policy.sum_insured_type;
        this.sumInsuredSubType = policy.sum_insured_sub_type;
        this.premium = policy.premium;
        this.createdOn = DateFormate(policy.created_at, { type: 'withTime' });
        this.createdBy = policy.created_by;
        this.modifiedOn = DateFormate(policy.modified_at, { type: 'withTime' });
        this.modifiedBy = policy.modified_by;
        this.approvedOn = DateFormate(policy.approved_at, { type: 'withTime' });
        this.approvedBy = policy.approved_by;
        this.need_renewal = policy.need_renewal;
        this.is_renewed = policy.is_renewed;
        this.renewed_from = policy.renewed_from;
        this.start_date = DateFormate(policy.start_date);
        this.end_date = DateFormate(policy.end_date);
        this.loss_ratio = policy.loss_ratio;
        this.sheet_data = policy.policy_custom_upload_template;
        this.created_by_id = policy.created_by_id;
        this.policy_sub_type_id = policy.policy_sub_type_id;
        this.tpa_id = policy.tpa_id;
        this.total_policy_lives = policy.total_policy_lives;
        this.total_policy_premium = policy.total_policy_premium;
        this.policy_document = policy.policy_documents?.filter(({ document_type }) => document_type === 1) || [];
        this.cd_statement = policy.policy_documents?.filter(({ document_type }) => document_type === 5) || [];
    }
}
