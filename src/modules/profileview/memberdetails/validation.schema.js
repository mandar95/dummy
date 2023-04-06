// import { useCallback, useMemo } from "react";
// import * as yup from 'yup'

// const useYupValidationResolver = validationSchema =>
//     useCallback(
//         async data => {
//             try {
//                 const values = await validationSchema.validate(data, {
//                     abortEarly: false
//                 });

//                 return {
//                     values,
//                     errors: {}
//                 };
//             } catch (errors) {
//                 return {
//                     values: {},
//                     errors: errors.inner.reduce(
//                         (allErrors, currentError) => ({
//                             ...allErrors,
//                             [currentError.path]: {
//                                 type: currentError.type ?? "validation",
//                                 message: currentError.message
//                             }
//                         }),
//                         {}
//                     )
//                 };
//             }
//         },
//         [validationSchema]
//     );




// export { useYupValidationResolver };


















// const addSchema = yup.object().shape({
//     firstName: yup.string().required().max(12),
//     age: yup
//       .number()
//       .required()
//       .positive()
//       .integer(),
//     website: yup.string().url()
//   });