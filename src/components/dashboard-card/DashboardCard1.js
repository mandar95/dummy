import React from "react";
import styled from "styled-components";

import { CardBody } from "../GlobalCard/style";


const DashboardCard1 = (props) => {
  const { icon, title, children, action } = props
  return (
    <DashboardCard1Container {...props} className="p-3">
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span>
              {icon}
            </span>
            <h6 className="dashboard-title">{title}</h6>
          </div>
          {action && <div className="px-4">
            <i className="fal py-2 fa-ellipsis-v"></i>
          </div>}
        </div>
        <div className="pt-5 px-3">
          {children}
        </div>
      </div>
    </DashboardCard1Container>
  );
};

export default DashboardCard1;

const DashboardCard1Container = styled(CardBody)`
  background-color: ${({ bgColor }) => bgColor ? bgColor : '#ffffff'} !important;
  width: ${({ width }) => (width ? width : "fit-content")};
  border-radius: 30px;
  
  span {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    background-color: ${({ iconBgColor,theme }) => iconBgColor ? iconBgColor : theme.Card.color};
    border-radius: 10px;
    color: ${({ iconColor }) => iconColor ? iconColor : "#ffffff"};
  }
  .dashboard-title {
    color: ${({ titleColor }) => titleColor ? titleColor : "#000000"};
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    margin: 0 0 0 8px;
  }
  .fa-ellipsis-v {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
    transform: rotate(90deg);
    color: #dbdbdb;
    cursor: pointer;
  }
  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    color: #fff;
  }
  h4 {
    color: #fff;
  }
`;

//=====================Sample Here=====================//
// const DashboardCard1 = () => {
//   return (
//     <DashboardCard1Container className="p-3">
//       <div className="d-flex flex-column">
//         <div className="d-flex align-items-center justify-content-between">
//           <div className="d-flex align-items-center">
//             <span>
//               <i className="fas fa-circle"></i>
//             </span>
//             <h6 className="dashboard-title">Animate Platform App</h6>
//           </div>
//           <div className="px-4">
//             <i className="fal py-2 fa-ellipsis-v"></i>
//           </div>
//         </div>
//         <div className="pt-5 pr-3 mr-3 pb-4">
//           <div className="row w-100 m-auto">
//             <div className="col-4">
//               <div className="d-flex pr-3 flex-column">
//                 <p className="m-0">Active </p>
//                 <h4 className="m-0">29</h4>
//               </div>
//             </div>
//             <div className="col-4">
//               <div className="d-flex pr-3 flex-column">
//                 <p className="m-0">Active </p>
//                 <h4 className="m-0">29</h4>
//               </div>
//             </div>
//             <div className="col-4">
//               <div className="d-flex pr-3 flex-column">
//                 <p className="m-0">Active </p>
//                 <h4 className="m-0">29</h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardCard1Container>
//   );
// };
