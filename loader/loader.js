import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import styled from 'styled-components';

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
& > div {
  width: 18px;
  height: 18px;
  background-color: #464646;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}
& .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
& .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}
@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.loading {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(75px + ${fontSize - 92}%)` : '75px'};
	font-family: "Montserrat", sans-serif;
	text-align: center;
	span {
		display: inline-block;
		margin: 0 -0.05em;
	}
}
@keyframes loading02 {
	0% {
		filter: blur(0);
		opacity: 1;
	}
	100% {
		filter: blur(5px);
		opacity: 0.2;
	}
}
/* code #2 */
.loading02 {
  span {
    animation: loading02 1.2s infinite alternate;
    padding: 0 6px;
    color: #494949;
    }
  span:nth-child(2) {
      animation-delay: 0.2s;
    }
  span:nth-child(3) {
      animation-delay: 0.4s;
    }
  span:nth-child(4) {
      animation-delay: 0.6s;
    }
  span:nth-child(5) {
      animation-delay: 0.8s;
    }
  span:nth-child(6) {
      animation-delay: 1s;
    }
  span:nth-child(7) {
      animation-delay: 1.2s;
    }
}

img{
  height: 80px;
}

@media screen and (max-width: 768px) {
  img{
    height: 40px;
  }
  .loading {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(35px + ${fontSize - 92}%)` : '35px'};
  }
}
`

export const Loader = ({ type }) => {
  switch (type) {
    case 1:
      return (
        <Spinner className='flex-column'>
          <section className="loading loading02">
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </section>
        </Spinner>
      );

    default:
      return <Spinner>
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </Spinner>
  }
};

const LoadingButton = styled(Button)`
white-space: nowrap;
    background-color: ${({ theme }) => theme.Tab?.color || 'rgb(222, 142, 240, 0.74)'} !important;
    border-color: ${({ theme }) => theme.Tab?.color || 'rgb(222, 142, 240, 0.74)'} !important;
`

export const LoaderButton = ({ percentage, text = 'Fetching Data' }) => {
  return (
    <LoadingButton size="sm" className="shadow m-1 rounded-lg" disabled>
      <strong>{text}</strong> <Badge variant="light">
        <span className='pt-1'>{(percentage).toFixed()}%</span> <img src={'/assets/images/loading-buffering.gif'} width='15px' alt='...' />
      </Badge>
    </LoadingButton>
  );
};
