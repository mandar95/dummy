import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Title } from "modules/RFQ/select-plan/style.js";

export const ProgressBar = ({ text = 'Processing Your Request...', type = 'animation' }) => {
  const [status, setStatus] = useState(15);


  useEffect(() => {
    const intervalId = setTimeout(function () {
      if (status <= 97) {
        setStatus(prev => {
          if (prev < 50) return prev + 0.25;
          if (prev < 80) return prev + 0.07;
          return prev + 0.02;
        })
      }
    }, 10);
    return () => { clearInterval(intervalId); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <Spinner text={text}>
      {type === 'animation' ? <section className="loading loading02">
        {text.split('').map((word, index) => word !== ' ' ? <span key={index}>{word}</span> : <Fragment key={index}><span >{word}</span><br className='d-lg-none' /></Fragment>)}
      </section> :
        <Title fontSize='2rem' className='mb-0 bg-white'> {text}</Title>}
      <br />
      <ProgressStyle width={status}>
        <div className="progress-done">
          {Math.ceil(status)}%
        </div>
      </ProgressStyle>
    </Spinner >
  )
}

const ProgressStyle = styled.div`

	background-color: #d8d8d8;
	border-radius: 20px;
	position: relative;
	margin: 15px 0;
	height: 30px;
	width: 300px;

.progress-done {
	background: linear-gradient(to left, #F2709C, #FF9472);
	box-shadow: 0 3px 3px -5px #F2709C, 0 2px 5px #F2709C;
	border-radius: 20px;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: ${({ width }) => width || 15}%;
	opacity: 1; 
	transition: width linear;
}`

const Spinner = styled.div`

  margin: auto 0;
  width: 70px;
  text-align: center;
  height: 200px;
  padding-top: 0px;
  position: absolute;
  z-index: 99;
  top: 50%;
  left: 48%;
  width: 100%;
  height: 104%;
  position: fixed;
  top: 0;
  left: 0;
  background:${({ theme }) => theme.dark ? '#00000078' : '#fffdfd78'} ;
  z-index:9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .loading {
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
	font-family: "Montserrat", sans-serif;
	
	text-align: center;
	span {
		display: inline-block;
		margin: 0 -0.05em;
	}
}
/* @keyframes loading02 {
	0% {
		filter: blur(0);
		opacity: 1;
	}
	100% {
		filter: blur(2px);
		opacity: ${({ text = '' }) => text.length / 10};
	}
} */
@keyframes loading03 {
  0% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
/* code #2 */
.loading02 {
  span {
    /* animation: loading02 1.2s infinite alternate; */
    animation: loading03 1.2s infinite alternate;
    padding: 0 6px;
    color: #494949;
    }
    ${({ text = '' }) => {
    let final = ''
    for (let i = 2; i < text.length; ++i) {
      final += `span:nth-child(${i + 1}) {
        animation-delay: ${(i) / 10}s;
      }
      `
    }
    return final
  }}
}

img{
  height: 80px;
}

@media screen and (max-width: 768px) {
  img{
    height: 40px;
  }
  .loading {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
  }
}

`
