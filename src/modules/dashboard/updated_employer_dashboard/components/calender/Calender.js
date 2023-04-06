import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { CalenderContainer } from "../../style";
import CalenderCard from "./CalenderCard";

function CustomRightArrow({ onClick }) {
  function handleClick() {
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Go to next slide"
      className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
    />
  );
}

function CustomLeftArrow({ onClick }) {
  function handleClick() {
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Go to previous slide"
      className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
    />
  );
}

const options = {
  additionalTransfrom: 0,
  arrows: true,
  autoPlaySpeed: 3000,
  centerMode: true,
  className: "",
  containerClass: "container",
  dotListClass: "",
  draggable: true,
  infinite: false,
  itemClass: "",
  keyBoardControl: true,
  minimumTouchDrag: 80,
  focusOnSelect: false,
  pauseOnHover: true,
  renderArrowsWhenDisabled: false,
  renderButtonGroupOutside: false,
  renderDotsOutside: false,
  responsive: {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 5,
    },
    mobile: {
      breakpoint: {
        max: 768,
        min: 0,
      },
      items: 2,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 768,
      },
      items: 3,
      partialVisibilityGutter: 30,
    },
  },
  rewind: false,
  rewindWithAnimation: false,
  rtl: false,
  shouldResetAutoplay: true,
  showDots: false,
  sliderClass: "",
  slidesToSlide: 1,
  swipeable: true,
  customLeftArrow: <CustomLeftArrow />,
  customRightArrow: <CustomRightArrow />,
};

const Calender = ({ data = {}, year }) => {
  const [select, setSelect] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (typeof data.confirmed_enrollment_date_wise === "object") {
      setAllData(
        Object?.values(data.confirmed_enrollment_date_wise)
          ?.filter((d) => d.enrollment_confirmed_date)
          ?.filter((d) =>
            year ? d.enrollment_confirmed_date.includes(year) : true
          )
      );
    }
  }, [data, year]);

  return (
    <CalenderContainer>
      <h3 className="font-weight-bold mb-3">
        Enrolment Confirmed Count{" "}
        <span className="filter">( filter by year: {year} )</span>
      </h3>
      <h4 className="title m-0">
        Pending Enrolment Confirmation :
        {data?.pending_enrollment_confirmation_count}
      </h4>
      <div className="calender-content">
        <Carousel {...options}>
          {allData?.map((num) => (
            <CalenderCard
              select={select}
              key={num}
              onClick={() => setSelect(num.enrollment_confirmed_date)}
              date={num.enrollment_confirmed_date}
              enrollmentConfiremd={num.enrollment_confirmed_count}
            />
          ))}
        </Carousel>
      </div>
      {allData?.length === 0 && <div className="no-data">Data Not Found</div>}
    </CalenderContainer>
  );
};

export default Calender;
