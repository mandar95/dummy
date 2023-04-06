import React from 'react';
import PropTypes from 'prop-types';
import './Counter.css';

const Counter = ({
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
    setVal,
    watchVal,
    myFunction,
    ...rest
}) => {

    let val = watchVal(name)

    const increment = () => {
        let count = parseInt(val) + 1;
        setVal(name, count);
        // myFunction(count);
    }
    const decrement = () => {
        if (parseInt(val) > 1) {
            let count = parseInt(val) - 1
            setVal(name, count);
            //myFunction(count);
        }
    }

    // on change method
    const onChangeHandler = (e) => {
        if (onChange) onChange(e);
    };


    return (
        <div className="quantity">
            <div className="quantity__minus" onClick={decrement}><span>-</span></div>
            <input
                name={name}
                disabled={disabled}
                required={required}
                onChange={onChangeHandler}
                placeholder=" "
                id={id}
                type={type}
                ref={inputRef}
                defaultValue={defaultValue}
                //value={value}
                error={error}
                className="quantity__input"
                {...rest}
            />
            <div className="quantity__plus" onClick={increment}><span>+</span></div>
        </div>
    )
};

Counter.defaultProps = {
    value: "",
    required: false,
    name: "",
    type: "text",
    // onChange: () => { },
}


Counter.propTypes = {
    required: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
};

export default Counter;
