import React from 'react';
import styled from 'styled-components';
// import { Link } from 'react-router-dom';

export const LandingCard = ({ data = {}, image }) => {

  const { description, title} = data;

  return (
    <Wrapper>
      {/* <Link to={url || '/broker'}> */}
      {/* <i className="ti-panel"></i> */}
      <img src={image} alt='Seriveimage'/>
      <h5 className="title">{title}</h5>
      <p>{description}</p>
      {/* </Link> */}
    </Wrapper>
  )
}

const Wrapper = styled.div`
cursor: pointer;
max-width: 300px;
margin: auto;
background: #fff;
box-shadow: 0px 0px 16px 3px rgb(153 153 153 / 10%);
border: 1px solid #eff7ff;
border-radius: 5px;
overflow: hidden;
position: relative;
z-index: 5;
padding: 180px 30px 25px 40px;
margin-top: 45px;
transition: all 0.3s linear;
img {
  color: #f17272;
  position: absolute;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(65px + ${fontSize - 92}%)` : '65px'};
  left: 40px;
  top: 52px;
}
h5 {
  padding: 10px 0;
  color: #233D63;
}
p {
  color: #737f92;
  padding-bottom: 20px;
}
&:hover{
  background: linear-gradient(to left,#1fffaf 0%,#1ad2a4 100%);
  transition: all 0.3s linear;
  text-decoration:none;
  h5 {
    color: #ffffff;
    text-decoration:none;
  }
  p {
    color: #ffffff;
    text-decoration:none;
  }
  a {
    text-decoration:none;
  }
}
`
