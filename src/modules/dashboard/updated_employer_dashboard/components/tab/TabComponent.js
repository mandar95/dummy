import React from "react";
import { TabComponentContainer } from "../../style";
import FilterModal1 from "../modal/FilterModal1";
import Tab from "./Tab";

const TabComponent = ({
  currentUser,
  setModalShow,
  modalShow,
  year,
  getFilterValue,
  onHide,
  setEmployerId,
  claims,
  reset,
  policyId,
  employerId,
}) => {
  return (
    <TabComponentContainer>
      <div className="tab-option">
        {currentUser.child_entities.length
          ? currentUser.child_entities.map(({ name, id }, index) => (
              <Tab
                key={id}
                name={name}
                isActive={employerId === id || (!employerId && index === 0)}
                onClick={() => setEmployerId(id)}
              ></Tab>
            ))
          : null}
      </div>
      <div onClick={() => setModalShow(true)} className="filter-icon">
        <i className="far fa-filter"></i>
      </div>
      {!!modalShow && (
        <FilterModal1
          getFilterValue={getFilterValue}
          show={modalShow}
          onHide={onHide}
          year={year}
          reset={reset}
          policyId={policyId}
          policies={claims}
          setModalShow={setModalShow}
        />
      )}
    </TabComponentContainer>
  );
};

export default TabComponent;
