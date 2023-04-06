import * as yup from "yup";

export const reportValidationSchema = (userType, isReportType = false) => yup.object().shape({
  to_date: yup.string().required("End Date Required").nullable(),
  from_date: yup.string().required("Start Date Required").nullable(),
  ...userType === 'admin' && {
    broker_id: yup.object().shape({
      id: yup.string().required('Broker Required'),
    })
  },
  ...userType === 'broker' && {
    employer_id: yup.object().shape({
      id: yup.string().required('Employer Required'),
    })
  },
  policy_sub_type_id: yup.object().shape({
    id: yup.string().required('Policy Type Required')
  }),
  policy_id: yup.object().shape({
    id: yup.string().required('Policy Name Required'),
  }),
  ...(isReportType && {
    report_type: yup.object().shape({
      id: yup.string().required('Report Type Required'),
    })
  }),
});
