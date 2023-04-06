import styled from 'styled-components';

export const Head = styled.p`
    font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || "13px"} + ${theme.fontSize - 92}%)` : (fontSize || "13px")};
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#444444'};
    margin-bottom: 8px;
    text-align: left;
    letter-spacing:1px;

`

export const Text = styled.p`
    color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
    font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || "12px"} + ${theme.fontSize - 92}%)` : (fontSize || "12px")};
    line-height: 18px;
    margin-bottom:25px;
    letter-spacing:1px;
    overflow-wrap: break-word;
`
// margin : 1em 0.5em 0.5em 0.5em;
export const Typography = styled.div`
cursor: pointer;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2em + ${fontSize - 92}%)` : '1.2em'};
color: ${({ theme }) => theme.dark ? '#FAFAFA' : '#606060'};
display : inline-block;
`;

export const Marker = styled.div`
display : inline-block;
height : 10px;
width : 10px;
border-radius : 50%;
background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || '#d757f6'} ;
opacity : 0.9;
`
export const Error = styled.p`
margin-top: ${({ top }) => top || '-10px'};
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
text-align: center;
color: ${({ color }) => color || 'red'};
`
