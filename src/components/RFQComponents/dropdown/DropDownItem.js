import React, { useState, useEffect } from "react";
import SearchBox from "../../SeacrchBox/SearchBox";
import "./dropdownitem.css";
import { DropdownNavigator } from "./DropDownNavigator"


function DropDownItems({ items, selected, handleClick, searchable, notAllowed }) {
  const [list, setList] = useState(items);
  const [noResult, setNoResult] = useState('');
  const handleSearchChange = (value = "") => {
    const filteredItems = items.filter((item) =>
      item.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    if (filteredItems.length > 0)
      setList(filteredItems);
    else {
      setList([]);
      setNoResult(value);
    }
  };

  useEffect(() => {
    setList(items)
  }, [items])

  useEffect(() => {
    DropdownNavigator();
  }, [])

  return (
    <div className="drop-down-items">
      {searchable && (
        <div className="drop-down-items__search">
          <SearchBox handleChange={handleSearchChange} />
        </div>
      )}
      <div className="drop-down-items__overflow" id="drop-down-items__overflow">
        {
          notAllowed &&
          <div
            className={
              `${notAllowed === selected && 'drop-down-items__item--selected'} drop-down-items__item--not-allowed`}>{notAllowed}</div>
        }
        {
          list.length > 0 ?
            list.map((item) => (
              <div
                key={item + 'drop-down'}
                onClick={() => handleClick(item)}
                className={`${item === selected
                  ? "drop-down-items__item--selected"
                  : "drop-down-items__item"
                  }`}
              >
                {item}
              </div>
            )) : <div className='drop-down-items__no-results'>{`No results matched for "${noResult}"`}</div>
        }
      </div>
    </div >
  );
}

export default DropDownItems;
