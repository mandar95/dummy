import React from "react";
import {
  CardRow,
  Container,
  Label
} from "./style";

const Card = ({ children, className = '', style = {}, variant = '#fce4ff', border, label, lablestyle = {} }) => {
  return (
    <CardRow border={border} variant={variant} style={style} className={className} >
      {!!label && <Label style={lablestyle}>{label}</Label>}
      <Container>
        {children}
      </Container>
    </CardRow >
  )
}

export default Card;
