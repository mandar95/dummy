import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`;

const AccordionHeader = props => {
    const { children } = props;

    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
};

export default AccordionHeader;
