import React from "react";
import PropTypes from 'prop-types';
import { Form } from "react-bootstrap";

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter }
}) => {
  return (
    <Form.Control className="rounded-lg" size="sm" type="text"
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value?.trimStart() || undefined);
      }}
    />
  );
};

// PropTypes 
DefaultColumnFilter.propTypes = {
  filterValue: PropTypes.undefined || PropTypes.string,
  preFilteredRows: PropTypes.array,
  setFilter: PropTypes.func
}

// DefaultTypes
DefaultColumnFilter.defaultProps = {
  filterValue: undefined,
  preFilteredRows: [],
  setFilter: () => { }
}
