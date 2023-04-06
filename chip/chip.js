import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    background: ${({ theme }) => (theme.Chip?.background || '#deff')};
    color: ${({ theme }) => (theme.Chip?.color || 'black')};
    border-radius: 4px;
    margin: 5px;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px dashed grey;
    min-width: 10px;
    align-items: center;
    max-width: fit-content;
    display: inline-block;
    word-break: break-word;
`;

const DeleteIcon = styled.a`
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
    margin-left: 4px;
    cursor: pointer;
`;

const Chip = props => {
    const { id, name, onDelete } = props;

    const onClickHandler = ev => {
        ev.preventDefault();
        onDelete(id);
    };

    return (
        <Wrapper key={id}>
            <span className="mr-2">{name}</span>
            <DeleteIcon onClick={onClickHandler}>
                <img src="/assets/images/close.png" alt="Close" />
            </DeleteIcon>
        </Wrapper>
    );
}

export default Chip;
