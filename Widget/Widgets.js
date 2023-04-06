import React from "react";
import { Col } from "react-bootstrap";
import { CardBack, WidgetHeader, NumberTag, ImageTag } from "./style";

const Widgets = ({ Hex1, Hex2, Number, Header, Image }) => {
  return (
    <Col lg={2} md={4} className="flex-card-head mb-2">
      <CardBack Hex1={Hex1 || "#ff5674"} Hex2={Hex2 || "#ff8a61"}>
        <WidgetHeader>{Header || "N/A"}</WidgetHeader>
        <NumberTag>{Number || 0}</NumberTag>
        <ImageTag>
          <img src={Image || "/assets/images/dash1.png"} alt="dashimg" height='80' width='auto'></img>
        </ImageTag>
      </CardBack>
    </Col>
  );
};

export default Widgets;
