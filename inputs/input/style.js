import styled, { css } from 'styled-components';


export const FormGroupInput = styled.div`
  margin-bottom: 30px;
  position: relative;
  // min-width: 210px;
  max-height: 54px!important;
  margin: ${({ margin }) => margin ? margin : '1rem 0px'};
  `

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  display: block;
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#000000'};
  background: transparent;
  cursor: text!important;
  border: 1px solid #cae9ff;
  display: inline-block;
  text-align: center;
  margin: 0em;
  padding: 1px 0px;
  border-radius: 5px;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'}!important;
  padding: 8px 8px;
  height: 52px;
  cursor: pointer;
  overflow-wrap:break-word;

  &:disabled {
    background-color: ${({ theme }) => theme.dark ? '#ffffff00' : '#dadada'};
    cursor: not-allowed !important;
  }
  &:focus {
  outline: 0;
  border-color: #80bdff!important;
  box-shadow: #80bdff 0px 0px 2px;
  }

  &&.error {
    border: 1px solid red;
  }
`

export const FormLabel = styled.label`
  position: absolute;
  transition: 0.25s ease;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'}!important;
  text-align: center;
  width: 100%;
  display: inline-block;
  top: -12px;
  color: #000;
  left: -0px;
`

export const SpanLabel = styled.span`
  white-space: nowrap;
  background: ${({ theme, background }) => theme.dark ? '#2a2a2a' : (background || '#fff')};
  padding: 2px 1px;
  letter-spacing: 1px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
  color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
  left: 5px;
`

export const Img = styled.img`
  height: 8px;
`

export const DatePickerDropDown = styled.select`
border: none;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
width: 80px;
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 6px;
  height: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #cccccc;
}
::-webkit-scrollbar-thumb:hover {
  background-color: grey;
}
`

export const DateWrapper = styled.span`
.react-datepicker__header{
  background-color: #ffffff;
  border-bottom: 0;
}
.react-datepicker__day--today {
  font-weight: inherit;
}
.react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected{
  background-color:#98bbfd;
}
.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range{
  background-color:#98bbfd;
  color: #000;
  outline: none;
  border-radius: 0;
}
.react-datepicker__day--outside-month{
  visibility: hidden;
  color: transparent;
  pointer-events: none;
}
.react-datepicker__day,.react-datepicker__day-name
{
  padding: 0.09rem;
  margin: 0;
  width: 2.3rem;
}
.react-datepicker__day:hover {
  border-radius: 0;
  background-color: #eaeaea;
}
.react-datepicker__day--disabled:hover{
  background-color: transparent;
}
.react-datepicker__input-container input {
  border: 1px solid #ced4da;
}
@-moz-document url-prefix() {
  .date {
    border: 1px solid #ced4da;
    z-index: 0;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .date {
    border: 1px solid #ced4da;
    padding: 7px !important;
    z-index: 0;
  }
}`

export const StyledInput = styled.input.attrs(props => ({
  autoComplete: "off",
  autoFocus: false
  // errors: props.errors
}))`
background-image: url("/assets/images/cal.png");
  background-position: 97% center;
  background-repeat: no-repeat;
  background-size: 25px;
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 0.25rem;
  box-sizing: border-box;
  display: block;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  height: 3rem;
  line-height: 1.5;
  padding: 0.5rem 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  width: 100%;
  height: ${({ height }) => height ? height : '54px'};

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    color: #9da7af;
    outline: 0;
  }

  ::-webkit-input-placeholder {
    color: #636c72;
  }

  :-ms-input-placeholder {
    color: #636c72;
  }

  :-moz-placeholder {
    color: #636c72;
    opacity: 1;
  }
  &&.error {
    border: 1px solid red;
  }
/* 
  ${({ errors }) =>
    errors &&
    css`
      background: rgb(251, 236, 242);
      border-color: rgb(191, 22, 80) rgb(191, 22, 80) rgb(191, 22, 80)
        rgb(236, 89, 144);
      border-image: initial;
      border-style: solid;
      border-width: 1px 1px 1px 10px;
    `} */
`;
