import styled from "styled-components";

export const Button =  styled.button`
background-color: ${({ theme }) => theme.Tab?.color};
color:#fff;
border-radius: 15px;
padding: 0px !important;
display: inline-block;
width: ${({ width }) => width || '180px'} !important;
font-size: ${({ fontSize }) => fontSize || '15px'};

text-align: center;
letter-spacing: 2px;
height: ${({ height }) => height || '45px'};
border: none;
border-radius: 15px;
outline: none;
&:focus{
  outline: none;
}
& > i.fa-arrow-left {
  padding-right: 25px;
  transition: transform 0.5s;
}
& > i.fa-arrow-right {
    padding-left: 25px;
    transition: transform 0.5s;
  }
&:hover,
&:focus,
&:active {
  & > i.fa-arrow-right {
    transform: translateX(10px);
  }
}

&:hover,
&:focus,
&:active {
  & > i.fa-arrow-left {
    transform: translateX(-10px);
  }
}

/* @media (max-width: 768px) {
  & {
    width: 95% !important;
  }
} */
`
