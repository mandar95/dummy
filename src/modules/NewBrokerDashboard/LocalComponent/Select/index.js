import { defaultTheme } from "react-select";
import React, { useRef, useState } from "react";
import Select from "react-select";

import style from "./style.module.css";
import useOutsideClick from "../../../../components/RFQComponents/dropdown/custom-hooks";

const { colors } = defaultTheme;

const selectStyles = {
  container: (provided) => ({
    ...provided,
    position: "absolute",
    zIndex: 9999,
    backgroundColor: "white",
    boxShadow: "1px 1px 10px lightgrey",
  }),
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
  }),
  menu: () => ({
    boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)",
  })
};

const SelectComponent = ({
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
  isClearable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  //on change method
  const onChangeHandler = (e) => {
    if (onChange) {
      onChange(e);
      setIsOpen(false);
    }
  }
  // const [value, setValue] = useState();

  const dropDownRef = useRef(null);
    useOutsideClick(dropDownRef, () => setIsOpen(false));

  return (
    <div ref={dropDownRef} className={style.cardBody}>
      <div className={style.textBox}>
        <p className={style.title}>{label}</p>
        <Dropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          target={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <div style={{
                width: "100px"
              }}>
                <div className="text-truncate">
                  <div className={style.text}>{value ? `${value.label}` : "Select"}</div>
                </div>
              </div>
              <div>
                <ChevronDown />
              </div>
            </div>
            // <Button
            //   shouldFitContainer
            //   iconAfter={<ChevronDown />}
            //   onClick={() => setIsOpen((prev) => !prev)}
            //   isSelected={isOpen}
            // >
            //   {value ? `${value.label}` : "Select a State"}
            // </Button>
          }
        >
          <Select
            autoFocus
            backspaceRemovesValue={false}
            components={{ DropdownIndicator, IndicatorSeparator: null }}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}

            onChange={onChangeHandler}
            options={options}
            placeholder="Search..."
            styles={selectStyles}
            tabSelectsValue={false}
            value={value}
            closeMenuOnScroll={true}
            closeMenuOnSelect={true}
            defaultValue={defaultValue}
            menuIsOpen
          />
          {/* <Select

            components={{ DropdownIndicator, IndicatorSeparator: null }}
            controlShouldRenderValue={false}
            placeholder="Search..."
            tabSelectsValue={false}

            ref={ref}
            styles={selectStyles}
            {...customFilter && { filterOption: customFilter }}
            value={value}
            isClearable={isClearable}
            onInputChange={onInputChange}
            isRtl={isRtl}
            isSearchable={isSearchable}
            isLoading={isLoading}
            inputId={inputId}
            menuPlacement={menuPlacement}
            // blurInputOnSelect={false}
            closeMenuOnScroll={closeMenuOnScroll}
            closeMenuOnSelect={closeMenuOnSelect}
            // escapeClearsValue={escapeClearsValue}
            hideSelectedOptions={hideSelectedOptions}
            backspaceRemovesValue={backspaceRemovesValue}
            // style={customStyles}
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
          /> */}
        </Dropdown>
      </div>
    </div>
  );
};

// styled components

const Menu = (props) => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      css={{
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        // position: "absolute",
        // zIndex: 9999
        // position: "absolute",
      }}
      {...props}
    />
  );
};
const Blanket = (props) => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: "fixed",
      zIndex: 1
    }}
    {...props}
  />
);
const Dropdown = ({ children, isOpen, target, onClose,ref }) => (
  
  <div
    css={{
      position: "relative"
    }}
  >
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);
const Svg = (p) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...p}
  />
);
const DropdownIndicator = () => (
  <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>
);

export default SelectComponent;
