import { differenceInMonths } from "date-fns"

export const isSelectedPlan = (flex_detail = {}, intial_suminsured, intial_employee_premium) => {

  if (intial_suminsured && flex_detail.has_been_endrosed &&
    Number(flex_detail.intial_suminsured) === Number(intial_suminsured)
    //  &&
    // Number(flex_detail.intial_employee_premium) === Number(intial_employee_premium)
  )
    return true
  return false
}

export const FilterPolicyFeature = (allPolicyFeatures,
  { policy_suminsured, policy_no_of_times_of_salary, employeee_grade }) => {

  return allPolicyFeatures.filter(({ is_policy_level, is_opd, suminsured,
    no_of_times_of_salary, grade }) => {

    if (is_policy_level === 1) return true;
    if (is_opd === 0 || !is_opd) return true;
    if (suminsured === policy_suminsured) return true;
    if (no_of_times_of_salary === policy_no_of_times_of_salary) return true;
    if (grade === employeee_grade) return true;
    // if (relation === selected_relations )
    // if (designation === employee_designation )
    // if (age === employee_age )

    return false;
  })

}


export const giveInstalment = (detail) => {
  if (detail?.installment && detail?.installment_level === 1) {
    const monthDifference = differenceInMonths(new Date(detail.policy_end_date || ''), new Date())
    return (detail.policy_end_date ? detail?.installment.filter(({ installment }) => monthDifference >= +installment) : detail?.installment);
  }
}
