import React from 'react';
import PropTypes from 'prop-types';
import { Label, SelectInput, LoaderDiv } from './style';

export const Select = (
  {
    id,
    label,
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
    isLoader,
    isRequired,
    ...rest
  }
) => (
  <>
    {isLoader ?
      <LoaderDiv>
        <div>
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </LoaderDiv> :
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
              <option key={item.id + id} value={item.value}>{item.name}</option>)}
          </>)
          : null
        }
      </SelectInput>
    }
    {/*  top span*/}
    <Label htmlFor={name}>
      {label}
      {isRequired
        ? <sup> <img style={{ height: '10px' }} alt="important" src='/assets/images/inputs/important.png' /> </sup>
        : null}
    </Label>
  </>
);


Select.defaultProps = {
  label: "label",
  required: true,
  id: "default",
  disabled: false,
  isLoader: false
  // value: "",
}

Select.propTypes = {
  label: PropTypes.string,
  option: PropTypes.array,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  onChange: PropTypes.func,
  id: PropTypes.string,
  disabled: PropTypes.bool
};
