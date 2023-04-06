import React, { useState } from "react";
import styled from "styled-components";

const DashboardCard = (props) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { icon, amount, title } = props;
  return (
    <DashboardCardContainer {...props} className="px-4 py-3 shadow">
      <div className="d-flex flex-column">
        <div className="d-flex pt-3 justify-content-between">
          <div className="icon-area">{icon}</div>
          <SubMenu open={showSubMenu}>
            <i
              onClick={() => setShowSubMenu(!showSubMenu)}
              onBlur={() => setShowSubMenu(false)}
              className="fal p-2 fa-ellipsis-v"
            ></i>
            {showSubMenu && (
              <SubMenuContent className="d-flex shadow flex-column">
                <div className="d-flex sub-menu-item align-items-center py-2 px-4">
                  <div className="mr-4">
                    <i className="far fa-badge-dollar"></i>
                  </div>
                  <p className="m-0">Make paymnent</p>
                </div>
                <div className="d-flex sub-menu-item align-items-center py-2 px-4">
                  <div className="mr-4">
                    <i className="far fa-badge-dollar"></i>
                  </div>
                  <p className="m-0">Make paymnent</p>
                </div>
                <div className="d-flex sub-menu-item align-items-center py-2 px-4">
                  <div className="mr-4">
                    <i className="far fa-badge-dollar"></i>
                  </div>
                  <p className="m-0">Make paymnent</p>
                </div>
                <div className="d-flex sub-menu-item align-items-center py-2 px-4">
                  <div className="mr-4">
                    <i className="far fa-badge-dollar"></i>
                  </div>
                  <p className="m-0">Make paymnent</p>
                </div>
              </SubMenuContent>
            )}
          </SubMenu>
        </div>
        <h3 className="my-3">${amount}</h3>
        <div className="w-70">
          <p className="m-0">{title}</p>
        </div>
      </div>
    </DashboardCardContainer>
  );
};

export default DashboardCard;

const DashboardCardContainer = styled.div`
  width: ${({ width }) => (width ? width : "fit-content")};
  background-color: #fff;
  border-radius: 1.5rem;
  .icon-area {
    i {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
    }
  }
  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }
  .fa-ellipsis-v {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.8rem + ${fontSize - 92}%)` : '1.8rem'};
    cursor: pointer;
  }
  .w-70 {
    width: 70%;
  }
  h3 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
  }
`;
const SubMenu = styled.div`
  height: 25px;
  width: 25px;
  transform: translateY(-7px);
  background: ${({ open }) => (open ? "#e1e1e1" : "#fff")};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: relative;
`;
const SubMenuContent = styled.div`
  width: 240px;
  border-radius: 1.5rem;
  position: absolute;
  background-color: #fff;
  top: 30px;
  overflow: hidden;
  left: 0;
  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
  }
  i {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
  }
  .sub-menu-item {
    cursor: pointer;
    &:hover {
      background-color: #e1e1e18c;
    }
  }
`;

//===================Sample-Here=================//

// const DashboardCard = () => {
//   const [showSubMenu, setShowSubMenu] = useState(false);
//   return (
//     <DashboardCardContainer className="px-4 py-3 shadow">
//       <div className="d-flex flex-column">
//         <div className="d-flex pt-3 justify-content-between">
//           <div>
//             <i className="fal fa-wallet"></i>
//           </div>
//           <SubMenu open={showSubMenu}>
//             <i
//               onClick={() => setShowSubMenu(!showSubMenu)}
//               onBlur={() => setShowSubMenu(false)}
//               className="fal p-2 fa-ellipsis-v"
//             ></i>
//             {showSubMenu && (
//               <SubMenuContent className="d-flex shadow flex-column">
//                 <div className="d-flex sub-menu-item align-items-center py-2 px-4">
//                   <div className="mr-4">
//                     <i className="far fa-badge-dollar"></i>
//                   </div>
//                   <p className="m-0">Make paymnent</p>
//                 </div>
//                 <div className="d-flex sub-menu-item align-items-center py-2 px-4">
//                   <div className="mr-4">
//                     <i className="far fa-badge-dollar"></i>
//                   </div>
//                   <p className="m-0">Make paymnent</p>
//                 </div>
//                 <div className="d-flex sub-menu-item align-items-center py-2 px-4">
//                   <div className="mr-4">
//                     <i className="far fa-badge-dollar"></i>
//                   </div>
//                   <p className="m-0">Make paymnent</p>
//                 </div>
//                 <div className="d-flex sub-menu-item align-items-center py-2 px-4">
//                   <div className="mr-4">
//                     <i className="far fa-badge-dollar"></i>
//                   </div>
//                   <p className="m-0">Make paymnent</p>
//                 </div>
//               </SubMenuContent>
//             )}
//           </SubMenu>
//         </div>
//         <h3 className="my-3">$143,624</h3>
//         <div className="w-70">
//           <p className="m-0">Your Bank Balance</p>
//         </div>
//       </div>
//     </DashboardCardContainer>
//   );
// };
