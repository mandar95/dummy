import styled from 'styled-components';

export const Title = styled.h1`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '3.3em'} + ${theme.fontSize - 92}%)` : (fontSize || '3.3em')};
font-weight:${({ fontWeight }) => fontWeight || '500'};
display: inline-block;
color: ${({ color }) => color || '#000000'};
overflow-wrap: break-word;
`

export const Info = styled.div`
display: flex;
justify-content: space-between;
.form-group{
  margin: 0 0 30px 0;
  display: flex;
  flex-wrap: nowrap;
  i {
    margin: auto 0 auto 8px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    color: #00e000;
  }
  .form-control{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
  }
}
h4{
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};
  
  i {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    color: #006c9c;
    padding-left: 14px;
    cursor: pointer;
  }
}
p{
  
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
  color: #535354;
}
@media (max-width: 980px) {
  flex-direction: column;
  div {
    margin-bottom: 15px;
  }
  p{
    margin-bottom: 0;
  }
}

`

export const Card = styled.div`
border: ${({ border }) => border || 'none'};
border-radius: ${({ borderRadius }) => borderRadius || '20px'};
background-color: ${({ bgColor }) => bgColor || '#ffffff'};
transition: all 0.3s ease 0s;
box-shadow:${({ noShadow, boxShadow }) => noShadow ? 'none' : boxShadow || '1px 5px 14px 0px rgb(0 0 0 / 10%)'};
width: ${({ width }) => width || 'auto'};
.cardwrap{
  padding: 1.5rem 0;
}
min-width:${({ minWidth }) => minWidth || 'min-content'};
${({ margin, padding }) =>
    margin && padding ? `margin: ${margin};
padding: ${padding};
@media (max-width: 768px) {
  margin: 0;
}` : ''}
${({ minHeight }) => minHeight ? ` min-height: 100%;` : ``}
`

export const BottomWrap = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
padding: 20px 40px;`

export const PlanCard = styled.div`
flex: 0.33;
padding: 20px 40px;
`
export const RestCard = styled(PlanCard)`
text-align: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.7rem + ${fontSize - 92}%)` : '1.7rem '};
color: #006c9c;
`

export const TopCard = styled(PlanCard)`
flex: 0.33;
padding: 20px 40px;

img{
  width: 60px;
}
hr{
  margin-bottom: 20px;
}
p{
  display: inline-block;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(26px + ${fontSize - 92}%)` : '26px'};
  
  padding-left: 40px;
}
h2{
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.2rem + ${fontSize - 92}%)` : '2.2rem'} !important;
  padding-top: 26px;
  color: #006c9c;
  span{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2.2rem + ${fontSize - 92}%)` : '2.2rem'} !important;
  }
}
span{
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(19px + ${fontSize - 92}%)` : '19px'};
  
}
.guarntee{
  background: #F3F7FB;
  margin: 18px 0;
  padding: 10px;
  border-radius: 7px;
  color: #006c9c;
  
  display: flex;
  justify-content: space-between;
}`

export const Header = styled.div`
margin: 20px 40px 0;
background: #F3F7FB;
padding: 17px 40px;
border-radius: 7px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(27px + ${fontSize - 92}%)` : '27px'};
color: #006c9c;

display: flex;
justify-content: space-between;
`
export const Button = styled.button`
background: ${({ color }) => color || '#71ED8D'};
color: #fff;
border-radius: 17px;
padding: ${({ padding }) => padding || '30px 30px'};
display: inline-block;
width: ${({ width }) => width || '100%'};
max-width: ${({ maxWidth }) => maxWidth || 'initial'};
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '3.3em'} + ${theme.fontSize - 92}%)` : (fontSize || '26px')};
text-align: center;
height: auto;

border: none;
outline: none;
&:focus{
  outline: none;
}
&:hover, &:focus {
  background-color: ${({ color }) => color || '#71ED8D'} !important;
}
& > i {
padding-left: ${({ invertFa }) => invertFa ? '0' : '30px'};
transition: transform 0.5s;
}
&:hover,
&:focus,
&:active {
& > i {
  transform: ${({ invertFa }) => invertFa ? 'translateX(-10px)' : 'translateX(10px)'};
}
}
@media (max-width: 768px) {
  width: 100%;
}
`

export const Wrapper = styled.div`

background-repeat: no-repeat;
background-position: ${({ bgposition }) => bgposition};
background-size: ${({ bgsize }) => bgsize};
background-image: ${({ bgimage }) => `url(${bgimage})`};
padding: ${({ padding }) => padding || "50px"};
${({ padding }) => (padding ? `@media (max-width: 500px) {padding: 0}` : "")};

.btn-circle {
  background: #F3F7FB;
  width: 55px;
  height: 55px;
  padding: 6px 0px;
  border-radius: 40px;
  text-align: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
  margin-right: 5px;
  line-height: 1.42857;
}

.vl {
  border-left: 1px solid #8080803d;
  height: auto;
}

@media (max-width: 2560px) {
  padding: 30px 60px;
}
@media (max-width: 1200px) {
  padding: 30px 60px;
}
@media (max-width: 920px) {
  padding: 20px 10px;
}
@media (max-width: 768px) {
  padding: 0;
}
`
export const Wrap = styled.div`
padding: 20px 60px;
overflow-x: auto;
@media (max-width: 920px) {
  padding: 20px 20px;
}`

export const CustomControl = styled.div`
  position: relative;
  display: block;
  padding:  0px 1.5rem;
`
export const SwitchContainer = styled.div`
  position: absolute;
  top: 68%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
`

export const SwitchInput = styled.input`
position: absolute;
opacity: 0;
height: 0px;
& + div {
  vertical-align: middle;
  border-radius: 999px;
  background-color: ${({ dark }) => dark ? '#cbcbcb' : '#ec3b3b'};
  -webkit-transition-duration: .4s;
  transition-duration: .4s;
  -webkit-transition-property: background-color, box-shadow;
  transition-property: background-color, box-shadow;
  cursor: pointer;
  width: 77px;
  height: 40px;
}
& + div span {
  position: absolute;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};
  color: white;
  margin-top: 12px;
}
& + div span:nth-child(1) {
  margin-left: 15px;
}
& + div span:nth-child(2) {
  margin-left: 57px;
}
&:checked + div {
  width: 77px;
  height: 40px;
  background-position: 0 0;
  background-color: #ec3b3b;
  background-color: ${({ dark }) => dark ? '#000000' : '#1bf29e'};
}
& + div > div {
  float: left;
  width: 33px;
  height: 33px;
  border-radius: inherit;
  background: #ffffff;
  -webkit-transition-timing-function: cubic-bezier(1, 0, 0, 1);
  transition-timing-function: cubic-bezier(1, 0, 0, 1);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition-property: transform, background-color;
  transition-property: transform, background-color;
  pointer-events: none;
  margin-top: 3px;
  margin-left: 2px;
}

&:checked + div > div {
  -webkit-transform: translate3d(20px, 0, 0);
  transform: translate3d(20px, 0, 0);
  background-color: #ffffff;
}

&:checked + div > div {
  -webkit-transform: translate3d(32px, 0, 0);
  transform: translate3d(40px, 0, 0);
}
`
