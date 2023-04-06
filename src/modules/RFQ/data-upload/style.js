import styled from 'styled-components';

export const Wrapper = styled.div`
padding: 20px 70px;
background-repeat: no-repeat;
background-position: ${({ bgposition }) => bgposition};
background-size: ${({ bgsize }) => bgsize};
background-image: ${({ bgimage }) => `url(${bgimage})`};
.link{
  color: #6a99ff;
  cursor: pointer;
}
.browse{
  
  cursor: pointer;
  color: #4a84ff;
}
@media (max-width: 2560px) {
  padding: 30px 60px 120px;
}
@media (max-width: 1200px) {
  padding: 30px 60px 120px;
}
@media (max-width: 920px) {
  padding: 20px 30px 100px;
}
@media (max-width: 768px) {
  padding: 10px 30px 90px;
}
`;

export const Button = styled.button`
background: #ffffff;
color: #1bf29e;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
border-radius: 11px;
padding: 14px 30px;
display: inline-block;
width: 100%;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
text-align: center;
height: auto;

border: 4px solid #1bf29e;
outline: none;
&:focus{
  outline: none;
}
`

export const Stepper = styled.div`
display: flex;
justify-content: space-between;
padding: 0.35rem;

flex-wrap: wrap;

.list{
  display: inline-block;
  span{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
  }
  .numbering{
    position: relative;
    top: -7px;
  }
  .btn-circle {
    background: #2a97ed;
    width: 25px;
    height: 25px;
    padding: 0;
    border-radius: 40px;
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    margin-right: 6px;
    margin-bottom: 4px;
    line-height: 1.42857;
    .fa{
      color: white;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
      position: relative;
      top: -3px;
    }
  }
  .number{
    
    color: #a6a6a6;
    border: 3px solid;
    background: #ffffff;
  }
}

@media (max-width: 950px) {
  flex-direction: column;
}

`

export const InfoCard = styled.div`

background: #ddeeff;
width: auto;
border-radius: 30px;
padding: 20px;
/* border: 2px solid white; */
margin-left: auto;
max-width: 315px;
display: flex;
flex-direction: column;

.list{
  margin-top: 25px;
  span{
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }
  .btn-circle {
    background: #2a97ed;
    width: 28px;
    height: 28px;
    padding: 0;
    border-radius: 40px;
    text-align: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    margin-right: 25px;
    line-height: 1.42857;
    .fa{
      color: white;
    }
  }
}
p{
  margin: 1.2rem auto;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
}
h4{
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  padding: 0 12px;
  color: #006c9c;
  
  margin-bottom: 17px;
}

@media (max-width: 992px) {
  margin: 25px auto;
}
@media (max-width: 768px) {
  width: 100%;
}
`;

export const Carousal = styled.div`
display: flex;
overflow-x: auto;
padding-top: 15px;


.btn-circle {
  background: #2a97ed;
  width: 35px;
  height: 35px;
  padding: 0;
  border-radius: 40px;
  text-align: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
  line-height: 1.42857;
  margin-top: -20px;
  .fa{
    color: white;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }
}

.card {
  border: none;
  border-radius: 15px;
  padding: 7px ​15px;
  text-align: start;
  .card-header{
    padding: 0 10px;
    background-color: rgba(255, 255, 255, 0);
    cursor: pointer;
    border-bottom: 4px solid #1bf29e;
    span{
      
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    }
  }
  .card-body {
    padding: 0;
    .list{
      padding: 9px 0 9px 20px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
      
      margin: 6px 0;
    }
    .list:hover{
      background: #F3F7FB;
    }
  }
}

&::-webkit-scrollbar {
  display: block;
  width: 5px;
  height:10px;
  background-color: #f5f5f500;
}
&::-webkit-scrollbar-track {
  background: transparent;
  -webkit-box-shadow: inset 0 0 20px rgba(142, 142, 142,0.3);
  margin: 0 580px;
}
  
&::-webkit-scrollbar-thumb {
  background-color: #1bf29e;
  -webkit-box-shadow: none;
  border-bottom: none;
  border-top: none;
}

&::-webkit-scrollbar-track-piece:end {
  background: transparent;
}

&::-webkit-scrollbar-track-piece:start {
  background: transparent;
}
@media (max-width: 2560px) {
  margin: 0 -60px;
  padding-left: 60px;
}
@media (max-width: 1350px) {
  &::-webkit-scrollbar-track {
    margin: 0 250px;
  }
}
@media (max-width: 1200px) {
  margin: 0 -60px;
  padding-left: 60px;
}
@media (max-width: 920px) {
  margin: 0 -30px;
  padding-left: 30px;
  &::-webkit-scrollbar-track {
    margin: 0 200px;
  }
}
@media (max-width: 768px) {
  margin: 0 -30px;
  padding-left: 30px;
  &::-webkit-scrollbar-track {
    margin: 0 50px;
  }
}
`

export const StyledButton = styled.div`
  display: flex;
  width: 20px;
  float: right;
  padding: 0;
  .arrow {
  ${({ color }) => `color: ${color};`}
  ${({ relative }) => relative === 'relative' ? `
  position: relative;
  top: 8px; `: ''}
  }
  &:focus {
    box-shadow: none;
  }
  &&.btn-link {
    color: red;
    text-decoration: none;
  }
`;

export const CloseButton = styled.button`
position: absolute;
top: 10px;
right: 10px;
display: flex;
justify-content: center;
width: 40px;
height: 40px;
border-radius: 50%;
color: #232222;
text-shadow: none;
opacity: 1;
z-index: 1;
border: 1px solid #bfbfbf;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};

background: white;
    &:focus{
        outline:none;
    }
`

export const ThankYou = styled.div`
display: flex;
padding: 6rem 30px;
max-width: 900px;
@media (max-width: 768px) {
  flex-wrap: wrap;
  text-align: center;
  padding: 4rem 0;
  img{
    margin: auto;
  }
}
`;

export const Title = styled.h1`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '3.3em'} + ${theme.fontSize - 92}%)` : (fontSize || '3.3em')};
font-weight:${({ fontWeight }) => fontWeight || '500'};
display: inline-block;
color: ${({ color }) => color || '#000000'};
overflow-wrap: break-word;
`
