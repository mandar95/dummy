import React from "react";
import classes from "./form.module.css";
import styled from "styled-components";
import { useSelector } from "react-redux";
const HealthButtondiv = styled.div`
color:  ${({ theme }) => (theme.Tab?.color || '#ff3c46')};
`;

const HealthButton = styled.small`
    background:  ${({ theme, isActive }) => isActive ? (theme.Tab?.color || '#ff3c46') : "#ff8a8e"};
    `;
const HealthButtonNew = styled.small`
    background:  ${({ theme, isActive }) => isActive ? (theme.Tab?.color || '#ff3c46') : "none"};
    padding: 10px 0px;
    border-radius: 8px;
    border: 1px dashed;
    border:${({ isActive }) => isActive ? ('1px dashed') : "none"};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${({ disabled }) => disabled ? 'not-allowed' : "pointer"};
    `;

const Tab = ({ isActive, label, onClick, tabStyle = 1, disabled }) => {
  const { globalTheme } = useSelector(state => state.theme)
  return (
    tabStyle !== 2 ?
      <HealthButton
        isActive={isActive}
        style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}
        className={` px-5 mx-2 ${isActive
          ? `${classes.darkRedBackTab}`
          : `text-dark ${classes.tab}`
          }`}
        onClick={onClick}
      >
        {label}
        {isActive && (
          <HealthButtondiv className={`${classes.arrow}`}>
            <i className="fas fa-caret-down"></i>
          </HealthButtondiv>
        )}
      </HealthButton>
      :
      <HealthButtonNew
        isActive={isActive}
        disabled={disabled}
        style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}
        className={` px-5 mx-2 ${isActive
          ? `${classes.darkRedBackTab}`
          : `text-dark ${classes.tab}`
          }`}
        onClick={onClick}
      >
        {label}
        {isActive && (
          <HealthButtondiv className={`${classes.arrow}`}>
            <i className="fas fa-caret-down"></i>
          </HealthButtondiv>
        )}
      </HealthButtonNew>

  );
};

export default Tab;
