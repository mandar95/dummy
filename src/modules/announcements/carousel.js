import React from "react";
import { Carousel } from "react-bootstrap";
import { PreviewImgTag } from "./style";
import swal from "sweetalert";
import { useSelector } from "react-redux";

const CarouselComponent = (props) => {
  const Data = props?.file;
  const { globalTheme } = useSelector(state => state.theme)

  const Test = () => {
    return Array.isArray(Data) && Data?.map((item, index) => {
      return (
        <Carousel.Item key={'announce' + index}>
          <PreviewImgTag
            size={props.size}
            className="d-block w-100"
            src={item.image || "/assets/images/car3.jpg"}
            alt="Announcement Image"
          />
          <Carousel.Caption>
            {props?.link ? (
              <a
                style={{ textDecoration: "none" }}
                href={props?.link ? props?.link : "/home"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3
                  style={{ color: props.color || "black", fontWeight: "600" }}
                >
                  {props?.title || ""}
                </h3>
              </a>
            ) : (
              <h3 style={{ color: props.color || "black", fontWeight: "600" }}>
                {props?.title || ""}
              </h3>
            )}
            <p style={{ color: props.color || "black", fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px' }}>
              {props?.content || ''}
            </p>
            {!!props?.tc && <p
              style={{
                fontSize: globalTheme.fontSize ? `calc(14px +${globalTheme.fontSize - 92}%)` : '14px',
                cursor: "pointer",
                display: props?.tc ? "inherit" : "none",
                color: props.color
              }}
              onClick={() => swal(props?.tc || '', "", "info")}
            >
              Terms & Conditions *
            </p>}
          </Carousel.Caption>
        </Carousel.Item>
      );
    });
  };
  return <Carousel>{Test()}</Carousel>;
  // return (
  //   <Carousel slide={true}>
  //   <div style={{display:'flex',justifyContent:'center',width:props.size}}>
  //     {!_.isEmpty(List) ? (
  //       List
  //     ) : (
  //       <PreviewImgTag src={"/assets/images/car3.jpg"} alt="img" size={props.size} />
  //     )}
  //     </div>

  //   </Carousel>
  // );
};

export default CarouselComponent;
