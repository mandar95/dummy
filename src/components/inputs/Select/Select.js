import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupSelect, SelectInput, SelectLabel, SelectSpan, Img } from './style';
import { v4 as uuid } from 'uuid';

import style from "./SelectComponent.module.css";

const Select = (
    {
        id,
        label,
        options,
        option,
        customOptions,
        customIdOptions,
        optionKey,
        optionKeyOne,
        optionKeyTwo,
        required,
        onChange,
        name,
        value,
        data,
        placeholder,
        error,
        isRequired,
        disabled,
        singleSelected,
        labelProps,
        selectType="default"
    }
) => {
    //on change method
    const onChangeHandler = (e) => {
        if (onChange) onChange(e);
    }

    return (
        selectType === "default" ? <FormGroupSelect>
            <SelectInput
                className={error ? 'error' : ''}
                // value={value}
                {...(!!data ? { value: data } : { value: value || "" })}
                name={name}
                onChange={onChangeHandler}
                required={required}
                disabled={disabled}>
                {/* option map */}
                {option
                    ? option.map((value) =>
                        <option selected={singleSelected ? true : false} key={uuid()} value={value}>{value}</option>)
                    : null
                }
                {options
                    ? (
                        <>
                            <option value="">{placeholder}</option>
                            {options.map(item =>
                                <option key={uuid()} value={item.value || item.id}>{item.name}</option>)}
                        </>
                    )
                    : null
                }
                {
                    customOptions ? (
                        <>
                            <option value="">{placeholder}</option>
                            {customOptions?.map((item, index) => <option key={uuid()} value={item[optionKey]}>
                                {item[optionKey]}
                            </option>)}
                        </>
                    ) : null
                }
                {
                    customIdOptions ? (
                        <>
                            <option value="">{placeholder}</option>
                            {customIdOptions?.map((item, index) => <option key={uuid()} value={item[optionKeyOne]}>
                                {item[optionKeyTwo]}
                            </option>)}
                        </>
                    ) : null
                }
            </SelectInput>
            {/*  top span*/}
            <SelectLabel htmlFor="name">
                <SelectSpan {...labelProps}>
                    {label}
                    {required || isRequired
                        ? <sup> <Img alt="Image Not Found" src='/assets/images/inputs/important.png' /> </sup>
                        : null}
                </SelectSpan></SelectLabel>
        </FormGroupSelect> : <select 
                className={style.customSelect}
                // value={value}
                {...(!!data ? { value: data } : { value: value || "" })}
                name={name}
                onChange={onChangeHandler}
                required={required}
                disabled={disabled}>
                {/* option map */}
                {option
                    ? option.map((value) =>
                        <option selected={singleSelected ? true : false} key={uuid()} value={value}>{value}</option>)
                    : null
                }
                {options
                    ? (
                        <>
                            <option value="">{placeholder}</option>
                            {options.map(item =>
                                <option key={uuid()} value={item.value || item.id}>{item.name}</option>)}
                        </>
                    )
                    : null
                }
                {
                    customOptions ? (
                        <>
                            <option value="">{placeholder}</option>
                            {customOptions?.map((item, index) => <option key={uuid()} value={item[optionKey]}>
                                {item[optionKey]}
                            </option>)}
                        </>
                    ) : null
                }
                {
                    customIdOptions ? (
                        <>
                            <option value="">{placeholder}</option>
                            {customIdOptions?.map((item, index) => <option key={uuid()} value={item[optionKeyOne]}>
                                {item[optionKeyTwo]}
                            </option>)}
                        </>
                    ) : null
                }
        </select>
    )
};


Select.defaultProps = {
    label: "label",
    required: true,
    id: "default",
    disabled: false
    // value: "",
}

Select.propTypes = {
    label: PropTypes.string,
    option: PropTypes.array,
    required: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    id: PropTypes.string,
    disabled: PropTypes.bool
};

export default Select;
