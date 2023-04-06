import styled from "styled-components";

const CardContentConatiner = styled.div`
	display: grid !important;
	height: ${({ height }) => height || '200px'};
	place-items: center;
	width: 100%;
	.text{
		font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.1rem + ${fontSize - 92}%)` : '1.1rem'};
	}
`;

export { CardContentConatiner };
