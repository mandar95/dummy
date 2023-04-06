//Note Wrap this component with a Div and class Name p-1 or give any desired padding.

import React, { useState/* , useRef */ } from "react";
import { Col } from "react-bootstrap";
import styled from "styled-components";
import { Card, WidgetHeader, ImageTag } from "./style";

import './style.css';
import PopOver from "modules/wellness/my-wellness/popover/popover";
import { useSelector } from "react-redux";

const WidgetsAllocation = styled.div`

${({ hex1, hex2, theme }) => {
    return `border: 0px dashed ${theme.Button?.square_outline?.border_color || '#CE93D8'};
    border-radius: 30px;
    border-radius: 30px;
    background: #0707074d;
    color: #ffffff;
    letter-spacing: 1px;
    padding: 5px 10px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
    letter-spacing: 0;
    outline: none;
    margin: 10px;
    width: 171px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;

    display:flex;
    flex-direction:column;
     
    & a{
      text-decoration:none;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
    }
    `
  }}
`
const Cols = styled(Col)`
@media (max-width: 992px) {
  display:flex;
  justify-content:center;
}
@media (min-width: 992px) and (max-width: 1199px) {
  flex: 0 0 50% !important;
  max-width: 50% !important;
}
`

const Ribbon = styled.div`
width: 149px;
height: 151px;
overflow: hidden;
position: absolute;
top: 0px;
left: 25px;

@media (max-width: 992px) {
  left:-93px
}

&::before,
&::after {
  position: absolute;
  z-index: -1;
  content: '';
  display: block;
  // border: 5px solid #2980b9;
  border-top-color: transparent;
  border-left-color: transparent;
}
& span {
  position: absolute;
  display: block;
  width: 225px;
  padding: 3px 0;
  background-color: #bdf546;
  color: #525050;
  box-shadow: 0 5px 10px rgba(0,0,0,.1);
  text-shadow: 0 1px 1px rgba(0,0,0,.2);
  text-transform: uppercase;
  text-align: center;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
  // right: -13px;
  // top: 36px;
  // transform: rotate(-45deg);
  right: 3px;
  top: 36px;
  transform: rotate(-54deg);
}
&::before {
  top: 0;
  right: 0;
}
&::after {
  bottom: 0;
  left: 0;
}
`
const ContentSpan = styled.span`
&::-webkit-scrollbar {
  width: 8px !important;
  height: 10px;
  background-color: transparent;
}

&::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important; 
  border-radius: 10px !important;
}

&::-webkit-scrollbar-thumb {
  border-radius: 10px !important;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5) !important; 
}
`


const Widgets = ({ Hex1, Hex2, Header, Image, wellnessPartnerName, wellnessPartnerUrl, content }) => {
  const [popoverShow, setShow] = useState(false);
  const [target, setTarget] = useState(null);
const { globalTheme } = useSelector(state => state.theme)

  // const ref = useRef(null);

  const handleHover = (event) => {
    setShow(!popoverShow);
    setTarget(event.target);
  };

  function flip(event) {
    var element = event.currentTarget;
    if (element.className === "card") {
      if (element.style.transform === "rotateY(180deg)") {
        element.style.transform = "rotateY(0deg)";
      }
      else {
        element.style.transform = "rotateY(180deg)";
      }
    }
  };

  return (
    <>
      {/* <Cols md={6} lg={4} xl={4} sm={6} style={{ marginBottom: '35px' }}>
        <div className="flip-card" style={{ width: '100%' }}>
          <div className="flip-card-inner">
            <div className="flip-card-front" style={{ position: 'unset' }}>
              <Card Hex1={Hex1 || "#ff5674"} Hex2={Hex2 || "#ff8a61"}>
                <WidgetHeader style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>{Header || "N/A"}</WidgetHeader>
                <ImageTag>
                  <img src={Image || "/assets/images/dash1.png"} alt="dashimg" style={{ height: '50px' }}></img>
                </ImageTag>
                <WidgetsAllocation
                //  style={{ backgroundColor: `${bgColor}` }}
                >
                  <ContentSpan style={{ overflowY: 'scroll' }}>{content}</ContentSpan>
                </WidgetsAllocation>
              </Card>
            </div>

            <div className="flip-card-back" style={{ position: 'absolute', top: '0' }}>
              <Card Hex1={Hex1 || "#ff5674"} Hex2={Hex2 || "#ff8a61"}>
                <WidgetHeader style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>{Header || "N/A"}</WidgetHeader>
                <ImageTag>
                  <img src={Image || "/assets/images/dash1.png"} alt="dashimg" style={{ height: '50px' }}></img>
                </ImageTag>
                <WidgetsAllocation
                //  style={{ backgroundColor: `${bgColor}` }}
                >
                  <a style={{ color: 'white' }} target="_blank" rel="noopener noreferrer" href={`https://${wellnessPartnerUrl}`}>
                    Click here
                  </a>
                </WidgetsAllocation>
                <Ribbon><span>{wellnessPartnerName}</span></Ribbon>
              </Card>
            </div>
          </div>
        </div>
      </Cols> */}

      <Cols className="container" md={6} lg={4} xl={4} sm={6} style={{ marginBottom: '35px', height: '200px' }}>
        <div className="card" onClick={flip}>
          <div className="front">
            <Card Hex1={Hex1 || "#ff5674"} Hex2={Hex2 || "#ff8a61"} style={{ width: '80%' }}>
              <WidgetHeader style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>{Header || "N/A"}</WidgetHeader>
              <ImageTag>
                <img src={Image || "/assets/images/dash1.png"} alt="dashimg" style={{ height: '50px' }}></img>
              </ImageTag>
              <WidgetsAllocation
              //  style={{ backgroundColor: `${bgColor}` }}
              >
                <ContentSpan
                  style={{ overflowY: 'hidden' }}
                  onMouseOver={handleHover}
                  onMouseOut={handleHover}
                >{content}
                  <PopOver
                    showpopover={popoverShow}
                    target={target}
                    // reference={ref}
                    tooltipdata={content}
                  />
                </ContentSpan>
              </WidgetsAllocation>
            </Card>
          </div>
          <div className="back">
            <Card Hex1={Hex1 || "#ff5674"} Hex2={Hex2 || "#ff8a61"} style={{ width: '80%' }}>
              <WidgetHeader style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px' }}>{Header || "N/A"}</WidgetHeader>
              <ImageTag>
                <img src={Image || "/assets/images/dash1.png"} alt="dashimg" style={{ height: '50px' }}></img>
              </ImageTag>
              <WidgetsAllocation style={{ background: !Boolean(wellnessPartnerUrl) && 'none' }}
              //  style={{ backgroundColor: `${bgColor}` }}
              >
                {Boolean(wellnessPartnerUrl) &&
                  <a style={{ color: 'white' }} target="_blank" rel="noopener noreferrer" href={`${wellnessPartnerUrl}`}>
                    Click here
                  </a>
                }
              </WidgetsAllocation>
              <Ribbon><span>{wellnessPartnerName}</span></Ribbon>
            </Card>
          </div>
        </div>
      </Cols>

    </>
  );
};

export default Widgets;
