import * as yup from "yup";

export const validationSchema = (userType, tab) =>
  yup.object().shape({
    // to_date: yup.string().required("End Date Required").nullable(),
    // from_date: yup.string().required("Start Date Required").nullable(),
    ...(userType === "admin" && tab === "Policy Type" && {
      broker_id: yup.object().shape({
        id: yup.string().required("Broker Required"),
      }),
    }),
    ...(userType === "broker" && tab === "Policy Type" && {
      employer_id: yup.object().shape({
        id: yup.string().required("Employer Required"),
      }),
    }),
    ...(tab === "Policy Type" && {policy_sub_type_id: yup.object().shape({
      id: yup.string().required("Policy Type Required"),
    })}),
    ...(tab === "Policy Type" && {policy_id: yup.object().shape({
      id: yup.string().required("Policy Name Required"),
    })}),
    ...(tab === "tpa_id" && {tpa_id: yup.object().shape({
      id: yup.string().required("TPA is Required"),
    })}),
    api_type: yup.object().shape({
      id: yup.string().required("API Type Required"),
    }),
    // start_index: yup.number().required('Start Index Required'),
    // end_index: yup.number().required('End Index Required'),
    // ...(isReportType && {
    //   report_type: yup.object().shape({
    //     id: yup.string().required('Report Type Required'),
    //   })
    // }),
  });
