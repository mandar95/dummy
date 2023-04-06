import styled from 'styled-components';
//import { Row } from 'react-bootstrap'

const Variant = {
  invert: {
    bgColor: '#fff',
    border: '1px solid #1bf29e',
    textColor: '#1bf29e',
    onFocusText: '#fff'
  },
  bulgy_invert: {
    bgColor: '#fff',
    border: '1px solid #8383ff',
    textColor: '#8383ff',
    onFocusText: '#8383ff'
  },
  bulgy: {
    bgColor: '#8383ff',
    border: 'none',
    textColor: '#fff',
    onFocusText: '#fff'
  },
  bulgy_invert1: {
    bgColor: '#fff',
    border: '1px solid #ffbd58',
    textColor: '#ffbd58',
    onFocusText: '#ffbd58'
  },
  bulgy1: {
    bgColor: '#ffbd58',
    border: 'none',
    textColor: '#fff',
    onFocusText: '#fff'
  },
  bulgy_invert2: {
    bgColor: '#fff',
    border: '1px solid #27c686',
    textColor: '#257555',
    onFocusText: '#27c686'
  },
  bulgy2: {
    bgColor: '#27c686',
    border: 'none',
    textColor: '#fff',
    onFocusText: '#fff'
  },
  red: {
    bgColor: '#e11a22',
    border: 'none',
    textColor: '#fff',
    onFocusText: '#fff'
  },
  theme: {
    border: 'none',
    textColor: '#fff',
    onFocusText: '#fff'
  },
  default: {
    bgColor: '##e7e7e7',
    border: 'none',
    textColor: '#000',
    onFocusText: '#000'
  }

}

// const ButtonContainer = styled.div`
//   display: flex;
//   margin-top: 1rem;
//   justify-content: center;
//   @media (max-width: 768px) {
//     margin-top: 15px;
//   }
//   & > button {
//     width: 185px !important;
//     background-color: #1bf29e !important;
//     border-radius: 10px;
//     padding: 0px !important;
//     &:hover, &:focus {
//       background-color: #1bf29e !important;
//     }
//   }
//   & > button > i {
//     padding-left: 70px;
//     transition: transform 0.5s;
//   }
//   & > button:hover,
//   & > button:focus,
//   & > button:active {
//     & > i {
//       transform: translateX(10px);
//     }
//   }
//   @media (max-width: 768px) {
//     & > button {
//       width: 95% !important;
//     }
//   }
// `;

const ConfirmButton = styled.button`
background-color: ${({ variant, theme }) => {
    if (variant) return Variant[variant].bgColor || theme?.Tab?.color
    return '#1bf29e'
  }} !important;
color: ${({ variant }) => {
    if (variant) return Variant[variant].textColor
    return '#fff'
  }};
border-radius: 5px;
padding: 0px !important;
display: inline-block;
width: ${({ width }) => width || '185px'} !important;
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '20px'} + ${theme.fontSize - 92}%)` : (fontSize || '20px')};
text-align: center;
letter-spacing: 2px;
height: ${({ height }) => height || '55px'};
border: ${({ variant }) => {
    if (variant) return Variant[variant].border
    return 'none'
  }};
border-radius: 15px;
outline: none;
&:focus{
  outline: none;
}
  &:hover, &:focus {
    background-color: ${({ variant }) => {
    if (variant) return Variant[variant].bgColor
    return '#1bf29e'
  }} !important;
    color:${({ variant }) => {
    if (variant) return Variant[variant].onFocusText
    return '#fff'
  }};
}
& > i {
  padding-left: 70px;
  transition: transform 0.5s;
}
&:hover,
&:focus,
&:active {
  & > i {
    transform: translateX(10px);
  }
}
/* @media (max-width: 768px) {
  & {
    width: 95% !important;
  }
} */
`

export default ConfirmButton;

