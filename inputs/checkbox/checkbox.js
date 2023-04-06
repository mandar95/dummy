import React from "react";
import PropTypes from "prop-types";
import "./checkbox.css";
import { useSelector } from "react-redux";

const Checkbox = ({
  label,
  required,
  onChange,
  noWrapper,
  placeholder,
  placeholderSize,
  ref,
  name,
  ...otherProps
}) => {
  const { globalTheme } = useSelector(state => state.theme)
  //add on change
  const onChangeHandler = (ev) => {
    if (onChange) onChange(ev);
  };
  return (
    <div className={`form-group ${noWrapper ? "" : "border-enroll"}`}>
      <div className="custom-control-checkbox">
        <label className="custom-control-label-check  container-check">
          {<span style={{ fontSize: globalTheme.fontSize ? `calc(${placeholderSize} + ${globalTheme.fontSize - 92}%)` : placeholderSize }}>{placeholder}</span> ||
            ""}
          <input
            onChange={onChangeHandler}
            name={name}
            ref={ref}
            {...otherProps}
            type="checkbox"
          />
          <span className="checkmark-check"></span>
        </label>
      </div>

      {/* top label */}
      {label ? (
        <label htmlFor="name" className="form-label">
          <span className="span-label">{label}</span>
        </label>
      ) : null}
    </div>
  );
};

Checkbox.defaultProps = {
  label: "",
  required: false,
  name: "",
  checked: false,
};

Checkbox.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  name: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checkbox;
