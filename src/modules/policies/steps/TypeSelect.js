import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupSelect, SelectLabel, SelectSpan, Img } from 'modules/user-management/Onboard/Select/style';
import styled from "styled-components";
import { Typeahead } from 'react-bootstrap-typeahead';



const TypeSelect = (
  {
    label,
    options,
    required,
    onChange,
    name,
    value,
    valueName,
    id,
    placeholder,
    prefix,
    error
  }
) => {


  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }
  const handleSearch = (q) => {
    onChange({ name: q, id: 0 })
  }
  const debounceOnChange = React.useCallback(debounce(handleSearch, 400), []);


  return (
    <FormGroupSelect key={id}>
      <SelectInput
        className={`${error ? 'error' : ''}`}
        id={id}
        autoComplete={'new-password'}
        labelKey={valueName}
        name={name}
        placeholder={placeholder}
        onInputChange={(e) => debounceOnChange(e)}
        onChange={([e]) => onChange(e)}
        options={options}
        allowNew
        newSelectionPrefix={prefix}
        required={required}
        defaultSelected={value ? [{ name: value }] : []}
      />
      {/*  top span*/}
      <SelectLabel htmlFor={name}>
        <SelectSpan>
          {label}
          {required
            ? <sup> <Img alt="Image Not Found" src='/assets/images/inputs/important.png' /> </sup>
            : null}
        </SelectSpan></SelectLabel>
    </FormGroupSelect>
  )
};


TypeSelect.defaultProps = {
  label: "label",
  option: [],
  required: true,
  id: "default",
  // defaultValue: "Select Option",
  selected: "",
  placeholder: '',
  prefix: '',
  name: "nameDefault",
  // defaultValue: "",
  valueName: "name"
  // value: "",
}

TypeSelect.propTypes = {
  label: PropTypes.string,
  option: PropTypes.array,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  defaultValue: PropTypes.string || PropTypes.number,
};

export default TypeSelect;

export const SelectInput = styled(Typeahead)`
box-sizing: border-box;
max-height: 54px!important;
width: 100%;

color: rgb(114, 114, 114);
cursor: pointer;
border: 1px solid #cae9ff;
display: inline-block;
border-radius: 5px;
transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'} !important;
outline: none;

border: 1px solid #cae9ff;
padding: 0px!important;
min-height: 52px;
${({ theme }) => theme.dark ? `
.form-control{
  color: #ffffff;
}
.form-control:focus{
  color: #fafafa;
  background-color: #fff0;
}
`: ''}
&:focus{
  border-color: #80bdff!important;
}
&:focus{
  box-shadow: none!important;
  border: 1px solid #7cbae7;
}
&:not([size]):not([multiple]) {
  text-align-last: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
}
& div input {
  min-height: 51px;
  border: none;
  background-color: inherit;
}
&.error {
  border-color: #FF0000;
}
`
