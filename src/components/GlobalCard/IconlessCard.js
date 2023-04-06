import React from "react";
import {
  IconlessCardRow,
  HeaderContainer,
  Header,
  BottomHeader,
  CardContentBox,
} from "./style";

const IconlessCard = ({ children, title, round = false, styles, removeBottomHeader = false, headerStyle = {}, marginTop, image = "", imageStyle = {}, isHeder = true, MyHtml = "", Ribbon = null ,childDivStyle={}}) => {
  const style = round ? { borderBottomRightRadius: "35px" } : {};

  return (
    <IconlessCardRow style={{ style, ...styles }} Ribbon={Ribbon}>
      {isHeder &&
        <HeaderContainer>
          <Header style={headerStyle}>
            {!!image && <span style={imageStyle}><img src={image} alt={'N/A'} width={40} /></span>}
            {title}
            {removeBottomHeader ? "" : <BottomHeader></BottomHeader>}
          </Header>
        </HeaderContainer>
      }
      {MyHtml}
      <CardContentBox style={childDivStyle} marginTop={marginTop}>{children}</CardContentBox>
    </IconlessCardRow>
  );
};

export default IconlessCard;
