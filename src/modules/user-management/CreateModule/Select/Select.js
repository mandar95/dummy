import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupSelect, SelectInput, SelectLabel, SelectSpan, Img } from '../../Onboard/Select/style';

const Select = (
    {
        label,
        option,
        required,
        onChange,
        name,
        value,
        defaultValue,
        selected,
        id,
    }
) => {

    //on change method
    let onchangehandler = (e) => {
        if (onChange) onChange(e)
    }

    return (
        <FormGroupSelect>
            <SelectInput value={value} name={name} onChange={onchangehandler} required={required}>
                {/* option map */}
                <option value="" disabled selected>{defaultValue}</option>
                {option
                    ? option.map((value) =>
                        <option key={value[1] + 'select'} selected={value[0] === selected} value={value[0]}>{value[1]}</option>)
                    : null
                }
            </SelectInput>
            {/*  top span*/}
            <SelectLabel htmlFor="name">
                <SelectSpan>
                    {label}
                    {required
                        ? <sup> <Img alt="Image Not Found" src='/assets/images/inputs/important.png' /> </sup>
                        : null}
                </SelectSpan></SelectLabel>
        </FormGroupSelect>
    )
};


Select.defaultProps = {
    label: "label",
    option: ["options"],
    required: true,
    id: "default",
    defaultValue: "Select Option"
    // value: "",
}

Select.propTypes = {
    label: PropTypes.string,
    option: PropTypes.array,
    required: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    id: PropTypes.string,
    defaultValue: PropTypes.string || PropTypes.number,
};

export default Select;
