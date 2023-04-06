import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupSelect, SelectLabel, SelectSpan, Img } from 'modules/user-management/Onboard/Select/style';
import styled from 'styled-components';
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
    error,
    minHeight,
    margin,
    width,
    isLabel,
    ...rest
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
    onChange({ [valueName]: q, id: 0 })
  }
  const debounceOnChange = React.useCallback(debounce(handleSearch, 400), []);


  return (
    <FormGroupSelect key={id} minHeight={minHeight} margin={margin} width={width}>
      <SelectInput
        minHeight={minHeight}
        className={`${error ? 'error' : ''}`}
        id={id}
        labelKey={valueName}
        name={name}
        placeholder={'Enter ' + label}
        onInputChange={(e) => debounceOnChange(e)}
        onChange={([e]) => onChange(e)}
        options={options}
        allowNew
        newSelectionPrefix={`Add ${label}: `}
        required={required}
        {...rest}
        selected={value ? [{ [valueName]: value }] : []}
      />
      {/*  top span*/}
      {isLabel &&
        <SelectLabel htmlFor='name'>
          <SelectSpan>
            {label}
            {required
              ? <sup> <Img alt='Image Not Found' src='/assets/images/inputs/important.png' /> </sup>
              : null}
          </SelectSpan></SelectLabel>
      }
    </FormGroupSelect>
  )
};


TypeSelect.defaultProps = {
  label: 'label',
  option: [],
  required: true,
  isLabel: true,
  id: 'default',
  // defaultValue: 'Select Option',
  selected: '',
  name: 'nameDefault',
  // defaultValue: '',
  valueName: 'name'
  // value: '',
}

TypeSelect.propTypes = {
  label: PropTypes.string,
  option: PropTypes.array,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  defaultValue: PropTypes.string || PropTypes.number,
};

export default TypeSelect;

export const SelectInput = styled(Typeahead)`
box-sizing: border-box;
max-height: 54px!important;
min-height:${({ minHeight }) => minHeight ? `${minHeight}!important` : '52px'};
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
// min-height: 52px;
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
  // min-height: 51px;
  min-height:${({ minHeight }) => minHeight ? `${minHeight}!important` : '52px'};
  border: none;
  background-color: inherit;
}
&.error {
  border-color: #FF0000;
}
`
