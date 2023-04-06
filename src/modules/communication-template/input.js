import React from 'react';
import PropTypes from 'prop-types';
// import { FormGroupInput, Input as FormInput, FormLabel, SpanLabel, Img } from './style';

import { Input2 } from 'modules/communication-config/create-template/Tags/index';

const InputTextArea = (
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
        style,
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
        <Input2
            className={`${error ? 'error' : ''}`}
            onChange={onChangeHandler}
            name={name}
            value={value || ""}
            defaultValue={defaultValue}
            type={type}
            placeholder={placeholder}
            required={required}
            inputRef={inputRef}
            onBlur={onBlurHandler}
            spellCheck="false"
            style={style || {}}
            {...otherProps} />
    );

    return (
        <div className="form-group-input">
            {_renderInput()}
        </div>
    )
};


// ask for onChange default function !!
InputTextArea.defaultProps = {
    label: "label",
    value: "",
    placeholder: "placeholder",
    required: false,
    name: "",
    type: "text",
    showSpan: true
    // onChange: () => { },
}


InputTextArea.propTypes = {
    label: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
};


export default InputTextArea;
