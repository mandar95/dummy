import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const LoaderDiv = styled.div`
height: 435px;
display: flex;
justify-content: center;
align-items: center;
`

export const ThreeSpinner = () => {
  return (
    <LoaderDiv>
      <Spinner animation="grow" size="sm" />
      <Spinner animation="grow" size="sm" />
      <Spinner animation="grow" size="sm" />
    </LoaderDiv>
  )
}
