import styled from 'styled-components';

export const FeatureButton = styled.small`
background: ${({ theme }) => (theme.Tab?.color || '#ff3c46')};
@media (max-width:600px) {
	font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(8px + ${fontSize - 92}%)` : '8px'};
}
`;
export const ToolTipDiv = styled.div`
display: inherit;
color: ${({ theme }) => (theme.Tab?.color || 'blue')};
cursor: pointer;
.icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
    margin-left: 0.4rem;
  }
  .tooltip.show {
    opacity: 1;
  }
  .tooltip {
    padding: 6px;
    max-width: 280px;
    border-radius: 0;
    background-color: black;
    pointer-events: none;

  }
  .tooltip-inner {
    max-width: 100%;
    width: 100%;
    padding: 10px 18px;
    border-radius: 0;
    color: #d2d3d4;
    line-height: 18px;
    background-color: black;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
    text-align: start;
  }`
