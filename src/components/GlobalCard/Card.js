import React from "react";
import {
  Row1,
  Container2,
  Header,
  BottomHeader,
  Container3
} from "./style";

const Card = ({ children, title, round = false, className, style, clickHandler = () => { }, headerStyle = {}, containerstyle = {}, hideLine = false }) => {
  const styles = (round ? { borderBottomRightRadius: "35px" } : {})
  return (
    <Row1 style={{ ...styles, ...style }} className={className} onClick={() => clickHandler()}>
      <Container2>
        <Header style={headerStyle}>
          <span className="icon"></span>
          {title}
          {!hideLine && <BottomHeader />}
        </Header>
      </Container2>
      <Container3 containerstyle={containerstyle}>
        {children}
      </Container3>
    </Row1 >
  )
}

export default Card;
