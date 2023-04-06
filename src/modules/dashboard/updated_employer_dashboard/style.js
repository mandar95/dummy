import styled from "styled-components";

export const EmployerDashboardContainer = styled.div`
  margin: 40px 40px 40px 40px;
  display: flex;
  flex-direction: column;

  .sectionTwo {
    margin: 15px 0px !important;
  }

  @media (max-width: 768px) {
    margin: 30px 20px 20px 20px;
    .sectionTwo {
      margin: 0 !important;
    }
  }
`;
export const ChartContainer = styled.div`
  background-color: white;
  box-shadow: 0px 10px 65px -45px grey;
  height: 100%;
  padding: 20px;
  border-radius: 20px;

  h3 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};

    span {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
      font-weight: 500;
      color: #797878;
    }
    @media (max-width: 768px) {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    }
  }

  .chart-line {
    position: relative;
  }
  .no-data {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -90%) scale(2) rotateZ(-12deg);

    h1 {
      font-weight: 600;
      color: #a9a9a9c9;
    }
  }

  .fa-filter {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.3rem + ${fontSize - 92}%)` : '1.3rem'};
    color: #6e8192;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

export const WellcomeContainer = styled.div`
  width: 100%;
  background-image: linear-gradient(to right, #fb4e83, #f9846a);
  padding: 30px;
  color: #ffffff;
  margin-bottom: 30px;
  border-radius: 20px;
  box-shadow: 0px 74px 50px -70px #fb4e83;

  button {
    border: 1px solid #ffffff;
    border-radius: 10px;
    padding: 10px 20px;
    background: transparent;
    color: #ffffff;
    font-weight: 500;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    box-shadow: 0px 0px 3px 0px #fff;
  }
  img {
    width: 60%;
    transform: translate(-30px, -25px) scale(1.5);
  }

  @media (max-width: 768px) {
    img {
      width: 75%;
      transform: translate(8px, -25px) scale(1.7);
    }
  }
`;

export const ReportCardsContainer = styled.div`
  margin: 15px 0px 0px 0px;
  IconlessCard {
    margin: 0;
  }

  .no-data {
    display: flex;
    justify-content: center;
    font-weight: bold;
    padding: 8rem 0;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
    color: #b1b1b1;
  }

  h3 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};

    @media (max-width: 768px) {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    }
  }

  .filter {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    font-weight: 500;
    color: #797878;
  }

  @media (max-width: 768px) {
    margin: 30px 0 15px 0;
  }
`;

export const ReportCardContainer = styled.div`
  padding: 10px;
`;

export const CardsContainer = styled.div`
  margin: 15px 0px 15px 35px;
  height: 100%;
  .card-container {
    margin: 0 0 0 15px;
  }
  .icon {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    background-image: linear-gradient(to right, #ee09798c, #ff6a008c);
    color: #fff;
    padding: 12px;
    border-radius: 10px;
  }
  @media (max-width: 768px) {
    margin: 0;
    .card-container {
      margin: 0;
    }
  }
`;

export const CardContainer = styled.div`
  .card {
    padding: 20px 25px;
    border-radius: 20px;
    background-image: white;
    box-shadow: 0px 35px 50px -35px #8998e491;
    height: 93%;
    width: 95%;
  }

  h5 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }

  p {
    font-weight: 500;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.8rem + ${fontSize - 92}%)` : '0.8rem'};
    color: #23232396;
  }

  .content-seperate {
    border-width: 2px;
    border-style: solid;
    border-image: linear-gradient(to right bottom, #ee0979, #ff6a00);
    border-image-slice: 1;
  }

  @media (max-width: 768px) {
    .card {
      margin: 15px 0;
      height: auto;
      width: auto;
    }
  }
`;

export const CalenderContainer = styled.div`
  margin-top: 30px;
  background-color: #fff;
  box-shadow: 0px 10px 65px -45px grey;
  border-radius: 20px;

  h3 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    padding-top: 20px;
    padding-left: 20px;

    span {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
      font-weight: 500;
      color: #797878;
    }

    @media (max-width: 768px) {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    }
  }

  .no-data {
    display: flex;
    justify-content: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(2rem + ${fontSize - 92}%)` : '2rem'};
    padding-bottom: 4rem;
    font-weight: bold;
    padding-top: 2rem;
    color: #b1b1b1;
  }

  .react-multiple-carousel__arrow--left {
    left: 0;
    border-radius: 0 15px 15px 0;
  }
  .react-multiple-carousel__arrow--right {
    right: 0;
    border-radius: 15px 0 0 15px;
  }
  .react-multiple-carousel__arrow {
    background-color: #4344ee;
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    padding: 0px 20px 10px 20px;
    border-radius: 15px;

    @media (max-width: 768px) {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
    }
  }
  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }
  .calender-content {
    padding-bottom: 20px;
  }
  @media (max-width: 768px) {
    margin: 15px 0 30px 0;
    .container {
      padding: 0 8px;
    }
  }
`;
export const CalenderCardContainer = styled.div`
  width: fit-content;
  padding: 20px;
  border: 1px solid gray;
  text-align: center;
  border-radius: 15px;
  background-color: ${({ background }) => (background ? background : "white")};
  color: ${({ color }) => color && color};
  cursor: pointer;

  h5 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1rem + ${fontSize - 92}%)` : '1rem'};
  }

  p {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    color: #000000a1;
    color: ${({ color }) => (color && color) || "#232323"};
  }
`;

export const AppointmentReviewContainer = styled.div`
  width: 100%;
  height: 97.9%;
  overflow: auto;
  padding: 10px;
  margin-top: 15px;
  background-color: #fff;
  box-shadow: 0px 10px 65px -45px grey;
  border-radius: ${({ checklength }) => checklength && checklength};
  .bar-chart {
    width: ${({ width }) => (width ? width : "100%")};
  }

  h3 {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.5rem + ${fontSize - 92}%)` : '1.5rem'};
    padding-left: 10px;
    padding-top: 10px;

    span {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
      font-weight: 500;
      color: #797878;
    }

    @media (max-width: 768px) {
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    }
  }

  tspan {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(9px + ${fontSize - 92}%)` : '9px'};
  }
  @media (max-width: 768px) {
    margin: 0px 0 30px 0;
  }
`;

export const FilterModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const TabComponentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  .filter-icon {
    color: #6e7377;
    cursor: pointer;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2rem + ${fontSize - 92}%)` : '1.2rem'};
    box-shadow: 0px 0px 14px -5px grey;
    background: #fff;
    border-radius: 10px;
    padding: 5px 8px;
  }
  .tab-option {
    display: flex;
    justify-content: start;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    .tab-option {
      flex-wrap: wrap;
    }
  }
`;
export const TabContainer = styled.div`
  background: linear-gradient(
    20deg,
    ${({ isActive }) => (isActive ? "#f9836b" : "#fff")},
    ${({ isActive }) => (isActive ? "#fa4e82" : "#fff")}
  );
  color: ${({ isActive }) => (isActive ? "#fff" : "#333")};
  padding: 10px 20px;
  border-radius: 10px;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
  cursor: pointer;
  box-shadow: 0px 0px 26px -14px grey;
  font-weight: 600;
`;

// ==================== Coming Soon ==================== //
export const ComingSoonContainer = styled.div`
  background: #fff;
  height: 100%;
  padding: 20px;
  box-shadow: 0px 10px 65px -45px grey;
  border-radius: 20px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;
