import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
import { Label, TextInput } from './style';

export const Input = (
  {
    id,
    label,
    required,
    onChange,
    name,
    value,
    error,
    inputRef,
    disabled,
    type = 'text',
    defaultValue,
    isRequired,
    onEdit,
    icon,
    labelStyle,
    noFocusChange,
    ...rest
  }
) => {
  const [focus, setFocus] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)

  return (
    <>
      <TextInput
        name={name}
        disabled={disabled}
        required={required}
        onChange={onChange}
        placeholder=" "
        id={id}
        type={(focus || noFocusChange) ? type : 'text'}
        onFocus={() => setFocus(true)}
        ref={inputRef}
        defaultValue={defaultValue}
        value={value}
        error={error}
        {...rest} />
      <Label htmlFor={name} style={labelStyle}>
        {label}
        {isRequired
          ? <sup> <img style={{ height: '10px' }} alt="important" src='/assets/images/inputs/important.png' /> </sup>
          : null}
      </Label>
      {icon &&
        <i className={icon} style={{
          position: 'absolute',
          top: '30px',
          right: '35px',
          fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
          cursor: 'pointer'
        }}
          onClick={() => { onEdit && onEdit() }}
        ></i>}
    </>
  )
};
