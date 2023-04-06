import styled from "styled-components";

//e-card
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
`;

//Filters
const DivSelect = styled.div`
  margin: 30px 0px;
  margin-top: -2px;
`;
const DivButtonAlign = styled.div`
  float: right;
  margin-top: 10px;
`;

const FilterContainer = styled.div`
  display: flex;
  max-width: 358.08px;
  @media (max-width: 600px) {
    display: flex;
    flex-direction: row;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
`;

const HealthcardContainer = styled.div`
  display: flex;
  max-height: 430px;
  margin-top: 30px;
`;

//HealthCard
const Wrapper = styled.div`
  display: flex;
  flex-wrap:wrap;
  @media (max-width: 600px) {
    display: flex;
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  padding-botton: 40px;
`;

const Avatar = styled.div`
  display: flex;
  flex-direction: row;
`;
const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
`;

const DivButton = styled.div`
  display: flex;
  width: 55%;
  justify-content: flex-end;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content:space-evenly;
  margin-top:-20px;
`;

const SubContentBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const SubContentBox2 = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

export {
  //ecard
  Container,
  HealthcardContainer,
  //filters
  DivSelect,
  FilterField,
  DivButtonAlign,
  FilterContainer,
  //HealthCard
  Wrapper,
  TitleBox,
  Avatar,
  ProfileData,
  DivButton,
  ContentBox,
  SubContentBox,
  SubContentBox2,
};
