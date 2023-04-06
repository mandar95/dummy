import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Containter = styled.div`
display:flex;
align-items: center;
cursor: pointer;
`

export const BackIcon = styled.i`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(35px + ${fontSize - 92}%)` : '35px'};
color: #585858b3;
line-height: 25px;
`


// Back Button
export const BackBtn = ({ url, children, stepAction }) => {
  const history = useHistory();
  const prevPage = () => {
    history.push(url)
  }
  return (
    <Containter id="prevBtn" onClick={url ? prevPage : stepAction}>
      {children}
    </Containter>
  )
}

// PropTypes
BackBtn.propTypes = {
  url: PropTypes.string
}
// DefaultTypes
BackBtn.defaultProps = {
  value: '/',
}
