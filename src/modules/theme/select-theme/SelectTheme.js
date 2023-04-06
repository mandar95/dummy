import React from 'react';
import styled from "styled-components";

import { Switch } from 'modules/user-management/AssignRole/switch/switch'
import { useSelector } from 'react-redux';

import { Row, Col } from 'react-bootstrap';


export const SelectTheme = ({ dispatch, themeUpdate, darkTheme, admin }) => {

  const { themes, globalTheme } = useSelector(state => state.theme);

  return (
    <>
      {!!admin && <Row className="d-flex flex-wrap m-0 justify-content-center">
        <Col sm={12} md={6} lg={4} xl={4}>
          <Switch dark value={globalTheme.dark} onChange={(e) => dispatch(darkTheme(e))} label={'Dark Mode'} />
        </Col>
      </Row>}

      <Row className="d-flex flex-wrap m-0">
        {themes.map((theme) => {
          const { name, data, id } = theme;
          const Selected = globalTheme.id === id

          return (
            <Col key={name + id} sm={12} md={12} lg={6} xl={4}>
              <CardComponent border={Selected} onClick={() => {
                dispatch(themeUpdate({ id, ...data }));
                localStorage.setItem('theme', id)
              }}>
                <p>{name}</p>
                <Flex>
                  <Color bgColor={data.Card.color} />
                  <Color bgColor={data.CardBlue.color} />
                  <Color bgColor={data.CardLine.color} />
                  <Color bgColor={data.Tab.color} />
                </Flex>
                <Flex>
                  <Color bgColor={data.Button.default.background} />
                  <Color bgColor={data.Button.danger.background} />
                  <Color bgColor={data.Button.outline.background} />
                  <Color bgColor={data.Button.warning.background} />
                </Flex>
                <Flex>
                  <Color bgColor={data.Button.outline_secondary.background} />
                  <Color bgColor={data.Button.square_outline.background} />
                  <Color bgColor={data.Button.outline_solid.background1} />
                  <Color bgColor={data.Button.outline_solid.background2} />
                </Flex>
                <Flex>
                  <Color bgColor={data.PrimaryColors.color1} />
                  <Color bgColor={data.PrimaryColors.color2} />
                  <Color bgColor={data.PrimaryColors.color3} />
                  <Color bgColor={data.PrimaryColors.color4} />
                </Flex>
              </CardComponent>
            </Col>
          )
        })}
      </Row>
    </>
  )
}

const CardComponent = styled.div`
  border: ${({ border, theme }) => border ? '3px solid ' + theme.PrimaryColors?.color4 : 'none'};
  border-radius: 0 35px 0 35px;
  background-color: ${({ theme }) => theme.dark ? '#2a2a2a' : '#fff'};
  transition: all 0.3s ease 0s;
  box-shadow: 0 10px 15px 6px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: auto;
  margin: 30px;
  @media (max-width: 767px) {
    margin: 15px;
  }
  min-height: 150px;
  p{
    padding: 15px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(18px + ${fontSize - 92}%)` : '18px'};
    margin-bottom: -3px;
  }
  cursor: pointer;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 15px;
`
const Color = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  width: 100%;
`
