import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { SpanLabel } from "../input/style";
import classes from "./SelectComponent.module.css";
import { FormGroupSelectReact } from "./style";

export default function SelectComponent({
  // captureMenuScroll = false,
  backspaceRemovesValue = true,
  autoFocus = false,
  multi = false,
  defaultInputValue = "",
  defaultValue = [],
  label = "label",
  menuIsOpen = false,
  options = [],
  placeholder = "Select Option",
  closeMenuOnSelect = true,
  closeMenuOnScroll = true,
  // escapeClearsValue = false,
  hideSelectedOptions = false,
  inputId = "",
  isLoading = false,
  isRtl = false,
  isSearchable = true,
  onInputChange = null,
  onChange,
  required,
  isRequired,
  menuPlacement = 'auto',
  value = [],
  error,
  disabled = false,
  labelProps,
  spanProps,
  customFilter,
  isClearable = false
}) {

  const { globalTheme } = useSelector(state => state.theme)

  const ref = useRef()
  useEffect(() => {
    if (menuIsOpen) {
      ref.current.focus()
    }
  }, [menuIsOpen])
  //on change method
  const onChangeHandler = (e) => {
    if (onChange) onChange(e);
  }
  return (
    <FormGroupSelectReact className={'text-center'}>
      <span className={`text-dark ${classes.legend}`} {...spanProps}>
        <SpanLabel {...labelProps}>
          {label} {(required || isRequired) && <span className="text-danger">*</span>}
        </SpanLabel>
      </span>
      <Select
        ref={ref}
        {...customFilter && { filterOption: customFilter }}
        value={value}
        isClearable={isClearable}
        onInputChange={onInputChange}
        isRtl={isRtl}
        isSearchable={isSearchable}
        isLoading={isLoading}
        inputId={inputId}
        menuPlacement={menuPlacement}
        styles={{
          // Fixes the overlapping problem of the component
          menu: provided => ({ ...provided, zIndex: 2, fontSize: globalTheme.fontSize ? `calc(12.3px + ${globalTheme.fontSize - 92}%)` : '12.3px' }),
          menuList: provided => ({ ...provided, padding: '0' }),
          singleValue: provided => ({ ...provided, color: '#000000', fontSize: globalTheme.fontSize ? `calc(12.3px + ${globalTheme.fontSize - 92}%)` : '12.3px', marginLeft: '22px' }),
          dropdownIndicator: provided => ({ ...provided, padding: '8px 8px 0 0' }),
          indicatorsContainer: provided => ({
            ...provided, padding: '0',
            position: 'absolute',
            top: '9px',
            right: '0',
            background: disabled ? '#f2f2f2' : '#ffffff'
          }),
          indicatorSeparator: provided => ({ ...provided, display: 'none' }),
          valueContainer: provided => ({ ...provided, justifyContent: 'center', padding: '8px 27px 2px 2px' }),
          placeholder: (base, state) => ({
            ...base,
            color: '#000000',
            fontSize: globalTheme.fontSize ? `calc(12.3px + ${globalTheme.fontSize - 92}%)` : '12.3px',
            display: state.isFocused && 'none',
          })
        }}
        // blurInputOnSelect={false}
        closeMenuOnScroll={closeMenuOnScroll}
        closeMenuOnSelect={closeMenuOnSelect}
        // escapeClearsValue={escapeClearsValue}
        hideSelectedOptions={hideSelectedOptions}
        backspaceRemovesValue={backspaceRemovesValue}
        // style={customStyles}
        className={`${classes.minHeight} ${error ? classes['error'] : ''}`
        }
        // defaultValue={selectedOption}
        onChange={onChangeHandler}
        options={options}
        isMulti={multi}
        autoFocus={autoFocus}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        defaultValue={defaultValue}
        defaultMenuIsOpen={menuIsOpen}
        defaultInputValue={defaultInputValue}
        loadingMessage={true}
        isDisabled={disabled}
        placeholder={<div className="text-center w-100">{placeholder}</div>}
      />
    </FormGroupSelectReact>
  );
}
