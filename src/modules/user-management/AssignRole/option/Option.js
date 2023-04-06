
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomControl } from './style';

export const ParentCheckbox = ({ text, name, onChange, id, value, type }) => {
  const [isCheck, setIsCheck] = useState(value)

  // on change method
  let onchangehandler = (e) => {
    if (onChange) onChange(e.target.checked ? id : undefined)
    setIsCheck(!isCheck)
  }

  return (
    <CustomControl className="d-flex mt-4" >
      <h5 className="m-0" style={{ paddingLeft: "33px" }}>{text}</h5>
      <input name={name} type={type} value={isCheck} checked={isCheck} onChange={onchangehandler} />
      <span style={{ top: "-2px" }}></span>
    </CustomControl>
  )
}

export const ChildCheckBox = ({ text, name, onChange, id, value, type }) => {

  const [isCheck, setIsCheck] = useState(value)

  // on change method
  let onchangehandler = (e) => {
    if (onChange) onChange(e.target.checked ? id : undefined)
    setIsCheck(!isCheck)
  }

  return (
    <CustomControl>
      <p style={{ fontWeight: "600", padding: '3px 11px 9px 27px', marginBottom: "0px" }}>{text}</p>
      <input name={name} type={type} value={isCheck} checked={isCheck} onChange={onchangehandler} />
      <span></span>
    </CustomControl>
  )
}


// default props
ChildCheckBox.defaultProps = {
  text: "Text Here",
  name: "",
  id: "id",
  type: "checkbox"
}
ParentCheckbox.defaultProps = {
  text: "Text Here",
  name: "",
  id: NaN,
  type: "checkbox"
}

// props types
ChildCheckBox.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.number,
  type: PropTypes.string
};
ParentCheckbox.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.number,
  type: PropTypes.string
};
