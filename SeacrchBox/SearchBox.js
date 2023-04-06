import React, { useState } from 'react';
import './search-box.css';

function SearchBox({ handleChange }) {
    const [value, setValue] = useState('');

    return <div className='search-box'>
        <input
            style={{
                background: 'url(/assets/images/chosen-sprite.png) no-repeat 100% -20px, #fff'
            }}
            type='text'
            value={value}
            autoFocus
            onChange={(e) => { setValue(e.target.value); handleChange(e.target.value) }} />
    </div>
}

export default SearchBox;