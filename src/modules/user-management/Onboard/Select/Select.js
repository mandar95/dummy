import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupSelect, SelectInput, SelectLabel, SelectSpan, Img } from './style';

const Select = (
    {
        label,
        option,
        required,
        onChange,
        name,
        value,
        placeholder,
        valueId,
        selected,
        valueName,
        id,
        disabled,
        error,
        isRequired
    }
) => {

    //on change method
    let onchangehandler = (e) => {
        if (onChange) onChange(e?.target?.value)
    }

    return (
        <FormGroupSelect key={id}>
            <SelectInput
                className={error ? 'error' : ''}
                name={name} defaultValue={selected}
                onChange={onchangehandler} required={required}
                disabled={disabled}>
                {/* option map */}
                <option value="">{'Select ' + placeholder}</option>
                {option?.length
                    ? option?.map((value) => {
                        const valueID = value.id || value[`${valueId}`]
                        return (<option disabled={value.disable} key={value[`${valueName}`] + valueID} value={valueID}>{value[`${valueName}`]}</option>)
                    })
                    : <option key={`nodata`} disabled>No Data</option>
                }
            </SelectInput>
            {/*  top span*/}
            <SelectLabel htmlFor="name">
                <SelectSpan>
                    {label}
                    {required || isRequired
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
    placeholder: "Option",
    selected: ""
    // value: "",
}

Select.propTypes = {
    label: PropTypes.string,
    option: PropTypes.array,
    required: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    id: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default Select;
