import React from "react";
import {
  IconlessCardRow,
  HeaderContainer,
  Header,
  CardContentBox,
} from "./style";

const IconlessCard = ({ children, title, round = false, styles }) => {
  const style = round ? { borderBottomRightRadius: "35px"} : {};
  return (
    <IconlessCardRow style={{ style, ...styles }}>
      <HeaderContainer>
        <Header>
          {title}
        </Header>
      </HeaderContainer>
      <CardContentBox>{children}</CardContentBox>
    </IconlessCardRow>
  );
};

export default IconlessCard;
