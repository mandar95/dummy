import React from "react";
import { ImageWithContent, ImageContent, TextContent } from "./InsureYourLife";
import { IconBg } from "./LandingMockup";

const RewardingCover = () => {
  return (
    <ImageWithContent
      className="align-items-center flex-column flex-md-row py-5 py-md-0"
      height={"90vh"}
    >
      <TextContent width={"40%"} color={"#37474f"}>
        <h4 className="text-center text-md-left">
          Simple, smarter, more <br />
          rewarding cover.
        </h4>
        <p className="text-center text-md-left">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde, omnis.
        </p>
        <div className="d-flex flex-column">
          <div classNname="d-flex flex-column">
            <div className="d-flex align-items-start">
              <IconBg bgColor={"#e4f7ff"}>
                <span role="img" aria-label="trophy">
                  🏆
                </span>
              </IconBg>
              <div className="ml-3">
                <h5>Premium Insurance Plan</h5>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Vitae, atque!
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <IconBg>
              <i
                style={{ color: "#ff9955" }}
                className="fas fa-life-ring fa-lg"
              ></i>
            </IconBg>
            <div className="ml-3">
              <h5>Life-time Insurance Plan</h5>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae,
                atque!
              </p>
            </div>
          </div>
        </div>
      </TextContent>
      <ImageContent width={"60%"}>
        <img src={"/assets/images/landing-mockup/family-pic1.jpg"} alt="" />
      </ImageContent>
    </ImageWithContent>
  );
};

export default RewardingCover;
