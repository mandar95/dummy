import React from "react";
import Select from "react-select";

export default function AnimatedMulti({
  options,
  value,
  onChange,
  name,
  onBlur,
  ref,
  placeholder,
  closeOnSelect,
  isClearable
}) {
  return (
    <Select
      closeMenuOnSelect={closeOnSelect ? true : false}
      isMulti
      options={options || []}
      value={value}
      onChange={(e) => onChange(e)}
      name={name}
      onBlur={onBlur}
      avoidHighlightFirstOption
      onSelect={onChange}
      ref={ref}
      defaultValue={value}
      hideSelectedOptions={false}
      placeholder={placeholder || "Select..."}
      isClearable={isClearable}
    />
  );
}

