import React from 'react';
import PropTypes from 'prop-types';
import { SelectInput, SelectWrap, Button } from './style';

export const Select = (
  {
    id,
    options,
    required,
    onChange,
    name,
    value,
    data,
    placeholder,
    error,
    inputRef,
    disabled,
    onAddFeature,
    ...rest
  }
) => (
  <SelectWrap>
    <SelectInput
      error={error}
      {...(!!data ? { value: data } : { value: value })}
      name={name}
      ref={inputRef}
      onChange={onChange}
      required={required}
      disabled={disabled}
      {...rest}>
      {/* option map */}
      {options
        ? (<>
          {!!placeholder && <option key={`select-${id}`} value="">{placeholder}</option>}
          {options.map(item =>
            <option key={item.id + id + item.name} value={item.id}>{item.name}</option>)}
        </>)
        : null
      }
    </SelectInput>
    <Button type={'button'} onClick={onAddFeature}>
      + Add Product Feature
    </Button>
  </SelectWrap >
);


Select.defaultProps = {
  required: true,
  id: "default",
  disabled: false
  // value: "",
}

Select.propTypes = {
  option: PropTypes.array,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  disabled: PropTypes.bool
};
