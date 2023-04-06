import React, { useState, useRef, useEffect } from 'react';
import useOutsideClick from './custom-hooks'
import DropDownItems from './DropDownItem'
import './customdropdown.css'

function CustomDropDown({
    items,
    searchable,
    selectedItem,
    className,
    expand,
    style,
    onChange,
    isOpen,
    notAllowed,
    inputLabel
}) {
    const [open, setOpen] = useState(expand);
    const [selected, setSelected] = useState(selectedItem);
    const dropDownRef = useRef(null);
    useOutsideClick(dropDownRef, () => setOpen(false));

    const handleItemClick = item => {
        setSelected(item);
        setOpen(false);
        onChange && onChange(item);
    };
    useEffect(() => {
        setSelected(selectedItem)
    },[selectedItem])

    useEffect(() => {
        isOpen && isOpen(open);
    }, [open, isOpen]);

    return <div className='custom-drop-down' ref={dropDownRef}>
        {
            !open ?
                <div className={`custom-drop-down__head ${className ? className : ''}`} style={style ? style : {}} onClick={() => setOpen(true)}>
                    {/* <span className='custom-drop-down__input-label' style={{ fontWeight: "600" }}>
                        {inputLabel} :
                    </span> */}
                    <div className='custom-drop-down__output-label'>
                        <span className='custom-drop-down__selected-text' style={{ fontWeight: "normal" }}>
                            {selected}
                        </span>
                     </div>
                     <img src='/assets/images/arrow_selectBox.png' className='custom-drop-down__arrow' alt='arrow' />
                </div> :
                <div className='custom-drop-down__wrapper'>
                    <div className='custom-drop-down__head custom-drop-down__head--open' style={style ? style : {}} onClick={() => setOpen(false)}>
                        {/* <span className='custom-drop-down__input-label'>
                            {inputLabel} :
                        </span> */}
                        <div className='custom-drop-down__output-label'>
                            <span className='custom-drop-down__selected-text'>
                                {selected}
                            </span>
                        </div>
                        <img src='/assets/images/arrow_selectBox.png' className='custom-drop-down__arrow' alt='arrow' />
                    </div>
                    <DropDownItems notAllowed={notAllowed && notAllowed} items={items} handleClick={handleItemClick} selected={selected} searchable={searchable} />
                </div>
        }
    </div >
}

export default CustomDropDown;