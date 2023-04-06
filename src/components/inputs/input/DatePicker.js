import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormGroupInput, FormLabel, SpanLabel, Img, StyledInput, DatePickerDropDown } from './style';
import moment from 'moment';
import { range } from 'lodash';
import { getYear, getMonth } from "date-fns";

const formatDate = (date) => {
  if (date) {
    const [day, month, year] = date.split('-');
    return [year, month, day].join("/");
  }
  else { return '' }
};



export function DatePicker({
  value, error, minDate = new Date('1900-01-01'), maxDate = new Date('2300-01-01'), name,
  onChange = () => null, labelProps = {}, label, height,
  required, isRequired, disabled = false, /* excludeDates = [], */
  noLabel = false, margin, noInput, onSelect = () => null }) {

  const handleDateChangeRaw = (e) => {
    if (noInput)
      e.preventDefault();
  }

  // calculate required years
  const years = range(getYear(minDate), getYear(maxDate) + 1, 1);

  // const monthrange = range(getMonth(new Date()), getMonth(addDays(new Date(), 180)))

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  // calculate required months
  const calculateMonths = (date) => {

    let timeValues = [];
    const minDateMoment = moment(minDate);
    const maxDateMoment = moment(maxDate);
    const dateMoment = moment(date)
    let dateStart = moment(new Date(minDateMoment.format('yy') === dateMoment.format('yy') ? minDate : `${dateMoment.format('yy')}-01-01`));
    let dateEnd = moment(new Date(maxDateMoment.format('yy') !== dateMoment.format('yy') ? `${dateStart.format('yy')}-12-31` : maxDate));

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      timeValues.push(months[Number(dateStart.format('MM')) - 1]);
      dateStart.add(1, 'month');
    }

    return timeValues
  }

  return (
    <FormGroupInput margin={margin} className="form-group">
      <ReactDatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }) => (
          <div
            className="d-flex justify-content-between"
          >
            <button type='button' className='datepicker-right-next' onClick={decreaseMonth} disabled={prevMonthButtonDisabled} >
              <img
                src='/assets/images/calender-left.png'
                width='14px' height='14px' alt='Next'
                style={{ pointer: 'none' }}
              />
            </button>
            {/* <button type='button' className='rounded-circle' style={{ outline: 'none' }} onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              {"<"}
            </button> */}
            <div>
              <DatePickerDropDown
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {calculateMonths(date).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </DatePickerDropDown>
              <DatePickerDropDown
                value={getYear(date)}
                onChange={({ target: { value } }) => {
                  changeYear(value);
                  changeMonth(Number(value) > getYear(date) ? 0 : getMonth(minDate))
                }}
              >
                {years.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </DatePickerDropDown>
            </div>
            <button type='button' className='datepicker-right-next' onClick={increaseMonth} disabled={nextMonthButtonDisabled} >
              <img
                src='/assets/images/calender-right.png'
                width='14px' height='14px' alt='Next'
                style={{ pointer: 'none' }}
              />
            </button>
            {/* <button type='button' className='rounded-circle' style={{ outline: 'none' }} onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {">"}
            </button> */}
          </div>
        )}
        dateFormat="dd-MM-yyyy"
        minDate={minDate}
        maxDate={maxDate}
        selected={
          value ? new Date(formatDate(value)) : null
        }
        onChange={(date) => onChange(date)}
        showTimeSelect={false}
        todayButton="Today"
        customInput={<StyledInput className={`${error ? 'error' : ''}`} height={height} />}
        dropdownMode="select"
        name={name}
        required={required}
        // isClearable
        onChangeRaw={handleDateChangeRaw}
        placeholderText="dd-mm-yyyy"
        shouldCloseOnSelect
        disabled={disabled}
        // excludeDates={excludeDates}
        onSelect={onSelect}
      />
      {!noLabel && <FormLabel htmlFor="name">
        <SpanLabel {...labelProps}>
          {label}
          {required || isRequired
            ? <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
            : null}
        </SpanLabel>
      </FormLabel>}
    </FormGroupInput>
  );
}
