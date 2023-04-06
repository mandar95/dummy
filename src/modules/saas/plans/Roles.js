/*
Module: Plan Details
User Type: Admin
Commented By: Salman Ahmed
 */

// import React, { useState, Fragment, useEffect } from 'react'

// import { Row, Col } from 'react-bootstrap';
// import { ParentCheckbox, ChildCheckBox } from "modules/user-management/AssignRole/option/OptionRef";


// export const Roles = ({ modules, name, watch, register }) => {

//   const watchModule = watch(name) || { module_id: [] }
//   const [flag, setFlag] = useState(0)

//   useEffect(() => {
//     if (flag < 1 && modules && modules.length)
//       setFlag(prev => prev + 1)

//   }, [flag, modules])


//   return (
//     <Row className="d-flex flex-wrap">
//       {modules?.map((parentElem) => {
//         return (
//           <Fragment key={`module1-${parentElem.id}`}>
//             <Col className="pl-0" md={7} lg={7} xl={7} sm={7} >
//               <ParentCheckbox id={parentElem.id}
//                 name={`${name}.module_id.${parentElem.id}`}
//                 register={register}
//                 // onClick={resetAllChild}
//                 defaultValue={parentElem.isSelected && parentElem.id}
//                 text={parentElem.moduleName || parentElem.name} />
//             </Col>

//             {(watchModule.module_id[parentElem.id]) ?
//               (parentElem.child.length) ?
//                 <>
//                   {parentElem.child.map((childElem) =>
//                     <Fragment key={`module2-${childElem.id}`}>
//                       <Col md={7} lg={7} xl={7} sm={7} style={{ paddingLeft: "5vw" }} >
//                         <ParentCheckbox id={childElem.id}
//                           name={`${name}.module_id.${childElem.id}`}
//                           register={register}
//                           defaultValue={childElem.isSelected && childElem.id}
//                           text={childElem.moduleName || childElem.name} />
//                       </Col>
//                       {((watchModule.module_id[childElem.id] === undefined || watchModule.module_id[childElem.id] === null) ? childElem.isSelected === 1 : watchModule.module_id[childElem.id]) &&
//                         <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
//                           <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
//                             <ChildCheckBox id={childElem.id} text="Read"
//                               name={`${name}.canread.${childElem.id}`}
//                               register={register}
//                               defaultValue={(childElem.canread && childElem.id) || (watchModule.module_id[childElem.id] && childElem.id)}
//                             />
//                             <ChildCheckBox id={childElem.id} text="Write"
//                               name={`${name}.canwrite.${childElem.id}`}
//                               register={register}
//                               defaultValue={childElem.canwrite && childElem.id}
//                             />
//                             <ChildCheckBox id={childElem.id} text="Delete"
//                               name={`${name}.candelete.${childElem.id}`}
//                               register={register}
//                               defaultValue={childElem.candelete && childElem.id}
//                             />
//                           </div>
//                         </Col>
//                       }
//                     </Fragment>
//                   )}
//                 </>
//                 :
//                 <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
//                   <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
//                     <ChildCheckBox id={parentElem.id} text="Read"
//                       name={`${name}.canread.${parentElem.id}`}
//                       register={register}
//                       defaultValue={(parentElem.canread && parentElem.id) || (watchModule.module_id[parentElem.id] && parentElem.id)}
//                     />
//                     <ChildCheckBox id={parentElem.id} text="Write"
//                       name={`${name}.canwrite.${parentElem.id}`}
//                       register={register}
//                       defaultValue={parentElem.canwrite && parentElem.id}
//                     />
//                     <ChildCheckBox id={parentElem.id} text="Delete"
//                       name={`${name}.candelete.${parentElem.id}`}
//                       register={register}
//                       defaultValue={parentElem.candelete && parentElem.id}
//                     />
//                   </div>
//                 </Col>
//               : ""
//             }
//           </Fragment>
//         )
//       })
//       }
//     </Row>)
// }
