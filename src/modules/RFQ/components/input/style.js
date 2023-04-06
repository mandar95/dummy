import styled from 'styled-components';

export const Label = styled.label`
  position: absolute;
  color: #000000;
  transition: all 0.3s;
  cursor: text;
  top: 9px;
  left: 35px;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};

  & > span {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
  }
`;

export const TextInput = styled.input`
  // min-height: 70px;
  min-height: 70px;
  cursor: text;
  width: 100%;
  transition: all 0.15s linear;
  min-width: 180px;
  border-radius: 15px;
  color: #000000;
  padding: 25px 15px 0 22px;
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  border: ${({ error }) => (error ? '2px solid red' : 'none')};
  background: #ffffff;
  box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
  text-align: left;
  &:focus {
    outline: none;
    border: 2px solid ${({ error }) => (error ? 'red' : '#1bf29e')};
    min-height: 70px;
    padding: 25px 15px 0 19px;
  }
  &:not(:placeholder-shown) {
    min-height: ${({ minHeight }) => minHeight || '70px'};
  } 
  ::placeholder{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
  }
  @media (max-width: 767px) {
    min-width: 353px;
    max-width: inherit;
  }
  @media (max-width: 450px) {
    min-width: 195px;
    max-width: inherit;
  }
`;
