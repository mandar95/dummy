import React from 'react';
import styled from 'styled-components';
import { allFont } from '../../../components/header/profile/FontModal';

const FontFamilyCard = ({ data, handleSelect, selectFont, size = false }) => {
  return (
    <FontFamilyCardContainer size={size} selectFont={selectFont} font={data.value} onClick={() => handleSelect(data.value)} className='mr-md-4 mr-2 mt-3'>
      <h3 className='m-0 px-md-3 px-2 py-md-2 py-1'>{data.title}</h3>
      <div className='px-md-3 px-2 py-md-2 py-1 example'>
        {data.example}
      </div>
    </FontFamilyCardContainer>
  );
};

export default FontFamilyCard;

const FontFamilyCardContainer = styled.div`
   border: ${({ selectFont, font, theme }) => selectFont === font ? '3px solid ' + theme.PrimaryColors?.color4 : "3px solid transparent"};
   border-radius: 5px;
   width: 150px;
   cursor: pointer;
   font-family: ${({ font, size }) => (!size && allFont[font - 1]?.title) || 'Titillium Web'},sans-serif;
   box-shadow: 0 7px 19px 1px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);
   h3{
     font-size: 0.9rem;
   }
   .example{
    font-size: ${({ size, font }) => size ? `calc(1.4rem + ${font - 92}%)` : '1.4rem'};
   }
   @media (max-width: 768px) {
    width: 110px;
    height: 77px;
    .example{
     font-size: 1.1rem;
    }
   }
`
