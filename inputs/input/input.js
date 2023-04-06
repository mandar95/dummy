import React from 'react';
import PropTypes from 'prop-types';
import { FormGroupInput, Input as FormInput, FormLabel, SpanLabel, Img } from './style';

const Input = (
    {
        label,
        required,
        onChange,
        name,
        defaultValue,
        value,
        type,
        error,
        placeholder,
        inputRef,
        noWrapper,
        onBlur,
        isRequired,
        labelProps,
        showSpan,
        ...otherProps
    }
) => {

    // on change method
    const onChangeHandler = (e) => {
        if (onChange) onChange(e);
    };
    const onBlurHandler = (e) => {
        if (onBlur) onBlur(e);
    };

    const _renderInput = () => (
        <>
            <FormGroupInput className="">
                <FormInput
                    className={`${error ? 'error' : ''}`}
                    autoComplete={'new-password'}
                    onChange={onChangeHandler}
                    name={name}
                    value={value || ""}
                    defaultValue={defaultValue}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    inputRef={inputRef}
                    onBlur={onBlurHandler}
                    {...otherProps} />
                <FormLabel htmlFor="name">
                    {showSpan &&
                        <SpanLabel {...labelProps}>
                            {label}
                            {required || isRequired
                                ? <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
                                : null}
                        </SpanLabel>
                    }
                </FormLabel>
            </FormGroupInput>
        </>
    );

    return (
        <div className="form-group-input">
            {_renderInput()}
        </div>
    )
};


// ask for onChange default function !!
Input.defaultProps = {
    label: "label",
    value: "",
    placeholder: "placeholder",
    required: false,
    name: "",
    type: "text",
    showSpan: true
    // onChange: () => { },
}


Input.propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
};


export default Input;
