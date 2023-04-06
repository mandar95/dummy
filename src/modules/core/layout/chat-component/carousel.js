import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import { PlanCard } from "../../../components";
// import _ from "lodash";
import { HospitalCard, HospAdd, HospName } from '../chat.style';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 5, // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 767 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 767, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
    },
};

const CarouselComponent = (props) => {
    const Data = props?.Data
    return (
        <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
            ssr={false} // means to render carousel on server-side.
            infinite={false}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            transitionDuration={500}
            // focusOnSelect={true}  //not centering the selected item
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            customTransition="transform 300ms ease-in-out"
            // deviceType="mobile"
            itemClass="carousel-item-padding-40-px"
        >
            {Data ? (
                Data?.map((item, index) => (
                    <HospitalCard key={'corusel' + index}>
                        {/* <PlanCard data={item} /> */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            borderBottom: '1px solid #efefef'
                        }}>
                            <img
                                src="/assets/images/hospital.png"
                                alt="bck"
                                height="30"
                                width="30"
                                style={{ marginBottom: '5px' }}
                            />
                            <HospName>{item.hospital_name}</HospName>
                        </div>
                        <HospAdd><i className="fa fa-map-marked-alt"
                            style={{
                                color: 'rgb(0,108,255)',
                                marginRight: '11px'
                            }}
                        ></i>{item.address1},{item.city_name},{item.state_name},{item.pin_code}</HospAdd>
                    </HospitalCard>
                ))
            ) : (
                <noscript />
            )}
        </Carousel>
    );
};

export default CarouselComponent;
