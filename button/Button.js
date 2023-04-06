import styled from "styled-components";

export const Button = styled.button`
  padding: 11px 17px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  letter-spacing: 0;
  outline: none;
  // -webkit-touch-callout: none;
  // -webkit-user-select: none;
  // -khtml-user-select: none;
  // -moz-user-select: none;
  // -ms-user-select: none;
  // user-select: none;
  // -webkit-tap-highlight-color: transparent;
  // transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  //   border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  // transition-property: color, background-color, border-color, box-shadow;
  // transition-duration: 0.15s, 0.15s, 0.15s, 0.15s;
  // transition-timing-function: ease-in-out, ease-in-out, ease-in-out, ease-in-out;
  // transition-delay: 0s, 0s, 0s, 0s;
  &:not(:disabled):not(.disabled) {
    cursor: pointer;
  }
  &:not(:disabled):not(.disabled).active,
  &:not(:disabled):not(.disabled):active {
    background-image: none;
    color: #20d2a3;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
  }
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.dark ? '0 10px 15px 6px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)' : '0px 7px 15px -3px #b6b6b6, 0 4px 6px -2px #F9FBE7'};

  ${({ buttonStyle, hex1, hex2, theme, borderRadius, shadow }) => {
    switch (buttonStyle) {
      case "danger":
        return `
        background: ${theme.Button?.danger?.background || '#ff8983'};
        color: ${theme.Button?.danger?.text_color || '#fff'};
        letter-spacing: 1px;
        border-radius: 50px;
        padding: 11px 30px;
        border: 1px dotted ${theme.Button?.danger?.border_color || '#ff8683'};
        margin-right: 25px;
      `;
      case "warning":
        return `
        background:${theme.Button?.warning?.background || '#eebb4d'} ;
        color:${theme.Button?.warning?.text_color || '#fff'} ;
        letter-spacing: 1px;
        border-radius: 50px;
        padding: 11px 30px;
        border: 1px dotted ${theme.Button?.warning?.border_color || '#eebb4d'};
        margin-right: 25px;
      `;
      case "outline":
        return `
        border: 1px dashed ${theme.Button?.outline?.border_color || '#cb68d9'};
        border-radius: 50px;
        background: ${theme.Button?.outline?.background || '#fff'};
        color:${theme.Button?.outline?.text_color || '#b406cc'} ;
        letter-spacing: 1px;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
      `;

      case "square-outline":
        return `
        border: 1px dashed ${theme.Button?.square_outline?.border_color || '#CE93D8'};
        border-radius: 3px;
        background: ${theme.Button?.square_outline?.background || '#fff'};
        color:${theme.Button?.square_outline?.text_color || '#000000'} ;
        letter-spacing: 1px;
        font-size: ${theme.fontSize ? `calc(12px + ${theme.fontSize - 92}%)` : '12px'};
      `;

      case "outline-secondary":
        return `
        border-radius: 100px;
        color:${theme.Button?.outline_secondary?.text_color || '#606060'} ;
        letter-spacing: 1px;
        font-size: ${theme.fontSize ? `calc(14px + ${theme.fontSize - 92}%)` : '14px'};
        border: 1px dotted ${theme.Button?.outline_secondary?.border_color || '#606060'};
        padding: 10px 24px !important;
        background:${theme.Button?.outline_secondary?.background || '#efefef'};
        /* margin: 0px 10px; */
      `;
      case "submit-disabled":
        return `
        border-radius: 100px 10px 100px 100px;
        background: ${theme.Button?.submit_disabled?.background || '#efefef'};
        color:${theme.Button?.submit_disabled?.text_color || '#606060'} ;
        letter-spacing: 1px;
        font-size: ${theme.fontSize ? `calc(14px + ${theme.fontSize - 92}%)` : '14px'};
        border: 1px dotted ${theme.Button?.submit_disabled?.border_color || '#606060'};
        padding: 10px 40px;
        box-shadow: 0 0 black;
      `;
      case "outline-solid":
        return `
        border-radius: ${borderRadius || '100px'};
        background: linear-gradient(69.83deg, ${hex1 || theme.Button?.outline_solid?.background1 || "#0084f4"} 0%, ${hex2 || theme.Button?.outline_solid?.background2 || "#00c48c"
          } 100%);
        color:${theme.Button?.outline_solid?.text_color || 'white'} ;
        letter-spacing: 1px;
        font-size: ${theme.fontSize ? `calc(14px + ${theme.fontSize - 92}%)` : '14px'};
        border: 1px solid ${theme.Button?.outline_solid?.border_color || '#D0D0D0'};
        padding: 10px 40px;
        box-shadow: ${shadow || '0px 7px 15px -3px #b6b6b6, 0 4px 6px -2px #F9FBE7'};
        &:not(:disabled):not(.disabled).active,
        &:not(:disabled):not(.disabled):active {
          background-image: none;
          color: ${hex1};
        }
      `;

      default:
        return `
        border-radius: 100px 10px 100px 100px;
        background: ${theme.Button?.default?.background || '#3fd49f'};
        color: ${theme.Button?.default?.text_color || '#fff'};
        letter-spacing: 1px;
        font-size: ${theme.fontSize ? `calc(14px + ${theme.fontSize - 92}%)` : '14px'};
        border: 1px dotted ${theme.Button?.default?.border_color || '#1ad2a4'};
        padding: 10px 40px;
        
      `;
    }
  }}
  @media (max-width: 400px) {
    margin-right: 0;
  }
`;

export default Button;
