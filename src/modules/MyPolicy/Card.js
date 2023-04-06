import React from "react";
import { Row, Col } from "react-bootstrap";
import { CardContentConatiner } from "../Insurance/style";
import "./radiobutton.css";

export const BuyCard = ({ Data }) => {
  const List = () => {
    return Data?.map((item, index) => (
      <Col key={'buycard' + index} md={6} lg={4} xl={3} sm={12} className="p-5">
        <div
          className="card"
          style={{
            borderRadius: "18px",
            boxShadow: "1px 1px 15px rgba(179, 179, 179, 0.5)",
            cursor: "pointer",
          }}
          onClick={() => {
            window.open(item.url, "_blank");
          }}
        >
          <div className="card-body card-flex-em">
            <div
              className="row rowButton2"
              style={{
                marginRight: "-15px !important",
                marginLeft: "-15px !important",
              }}
            >
              <CardContentConatiner>
                <div className="col-md-10 text-center mb-2 mx-auto">
                  <img
                    src={item.media}
                    className="mx-auto"
                    width="95"
                    height="auto"
                    alt="img"
                  />
                </div>

                <div className="col-md-12 text-center text">{item.insurer_name}</div>
              </CardContentConatiner>
            </div>
          </div>
        </div>
      </Col>
    ));
  };

  return (
    <Row className="d-flex flex-wrap justify-content-center mb-3">{List()}</Row>
  );
};
