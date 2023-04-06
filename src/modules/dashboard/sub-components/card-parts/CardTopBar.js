import React from "react";
const CardTopBar = ({ navigator, navigatorName, v, classes }) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      className="d-flex justify-content-between align-items-baseline"
      onClick={() => navigator(navigatorName, v.policy_id)}
    >
      <div style={{ minHeight: '70px' }}>
        {!!v.insurer_logo && <img
          className={`${classes.img}`}
          src={v.insurer_logo}
          alt={v.insurer_name}
        />}
      </div>
      {v.policy_name && (
        <div className={`${classes.yellowBack}`}>{v.policy_name}</div>
      )}
    </div>
  );
}

export default CardTopBar;
