import React from "react";
import { Carousel } from "react-bootstrap";
import { PreviewImg } from "../style";
import _ from "lodash";

const PreviewComponent = ({ getAnncmtData, file }) => {

  const List = !_.isEmpty(file)
    ? file?.map((item, index) => (
      <Carousel.Item key={'preview' + index}>
        <PreviewImg
          src={URL.createObjectURL(item) || "/assets/images/nprv.png"}
          alt="Announcement Image"
        />
      </Carousel.Item>
    ))
    : [];

  return (
    <Carousel interval={3500} slide={true}>
      {!_.isEmpty(List) ? (
        List
      ) : (
        getAnncmtData?.media ? getAnncmtData?.media.map(({ link }) => <PreviewImg width={'100%'} src={link || "/assets/images/nprv.png"} alt="img" />) :
          <PreviewImg src={"/assets/images/nprv.png"} alt="img" />
      )}
    </Carousel>
  );
};

export default PreviewComponent;
